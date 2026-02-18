import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FetchedProfilesContext = createContext(null);

const TITLES_URL = "https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php";
const ALL_URL = "https://web.ics.purdue.edu/~zong6/profile-app/fetch-data.php";
const FILTER_URL =
  "https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php";

export function FetchedProfilesProvider({ children }) {
  const [titles, setTitles] = useState(["All"]);
  const [loadingTitles, setLoadingTitles] = useState(false);

  const [titleFilter, setTitleFilter] = useState("All");
  const [nameSearch, setNameSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  // fetch titles once
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setLoadingTitles(true);
        setError("");

        const res = await fetch(TITLES_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load titles");
        const data = await res.json();

        // keep spaces (API includes trailing spaces)
        const rawTitles = Array.isArray(data.titles) ? data.titles : [];
        const deduped = Array.from(new Set(rawTitles.map((t) => String(t)))).filter(
          (t) => t.length > 0
        );
        deduped.sort((a, b) => a.localeCompare(b));

        setTitles(["All", ...deduped]);
      } catch (e) {
        if (e.name !== "AbortError") setError("Could not load titles.");
      } finally {
        setLoadingTitles(false);
      }
    }

    run();
    return () => controller.abort();
  }, []);

  // reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [titleFilter, nameSearch]);

  // fetch data when filters/page changes
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setLoadingData(true);
        setError("");

        const nameParam = nameSearch.trim();
        const useFetchAll = titleFilter === "All" && nameParam === "";

        if (useFetchAll) {
          const res = await fetch(ALL_URL, { signal: controller.signal });
          if (!res.ok) throw new Error("Failed to load profiles");
          const data = await res.json();

          const arr = Array.isArray(data) ? data : [];
          setTotalCount(arr.length);

          const start = (page - 1) * limit;
          setRows(arr.slice(start, start + limit));
          return;
        }

        const url =
          FILTER_URL +
          `?title=${encodeURIComponent(titleFilter)}` +
          `&name=${encodeURIComponent(nameParam)}` +
          `&page=${encodeURIComponent(page)}` +
          `&limit=${encodeURIComponent(limit)}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load profiles");
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.profiles)
          ? data.profiles
          : Array.isArray(data.data)
          ? data.data
          : [];

        setTotalCount(Number(data?.count) || list.length);
        setRows(list);
      } catch (e) {
        if (e.name !== "AbortError") setError("Could not load profiles.");
      } finally {
        setLoadingData(false);
      }
    }

    run();
    return () => controller.abort();
  }, [titleFilter, nameSearch, page]);

  const canGoPrev = page > 1;
  const canGoNext = page * limit < totalCount;

  const reset = () => {
    setTitleFilter("All");
    setNameSearch("");
    setPage(1);
  };

  const value = useMemo(
    () => ({
      // titles
      titles,
      loadingTitles,

      // filters
      titleFilter,
      setTitleFilter,
      nameSearch,
      setNameSearch,

      // paging
      page,
      setPage,
      limit,
      totalCount,
      canGoPrev,
      canGoNext,

      // data
      rows,
      loadingData,
      error,

      // actions
      reset,
    }),
    [
      titles,
      loadingTitles,
      titleFilter,
      nameSearch,
      page,
      limit,
      totalCount,
      canGoPrev,
      canGoNext,
      rows,
      loadingData,
      error,
    ]
  );

  return (
    <FetchedProfilesContext.Provider value={value}>
      {children}
    </FetchedProfilesContext.Provider>
  );
}

export function useFetchedProfiles() {
  const ctx = useContext(FetchedProfilesContext);
  if (!ctx)
    throw new Error(
      "useFetchedProfiles must be used inside <FetchedProfilesProvider>"
    );
  return ctx;
}

export default FetchedProfilesContext;
