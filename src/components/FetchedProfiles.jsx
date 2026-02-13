import { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Section from "./section";
import { Link } from "react-router-dom";

export default function FetchedProfiles({ mode }) {
  const [titles, setTitles] = useState(["All"]);
  const [titleFilter, setTitleFilter] = useState("All");
  const [nameSearch, setNameSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [rows, setRows] = useState([]);
  const [loadingTitles, setLoadingTitles] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  // --- Fetch titles once on mount ---
  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        setLoadingTitles(true);
        setError("");

        const res = await fetch(
          "https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to load titles");
        const data = await res.json();

        // IMPORTANT: do NOT trim titles (API may contain trailing spaces like "Designer ")
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
    };

    run();
    return () => controller.abort();
  }, []);

  // reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [titleFilter, nameSearch]);

  // --- Fetch data whenever filters/page change ---
  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        setLoadingData(true);
        setError("");

        const nameParam = nameSearch.trim();

        const useFetchAll = titleFilter === "All" && nameParam === "";

        if (useFetchAll) {
          const url = "https://web.ics.purdue.edu/~zong6/profile-app/fetch-data.php";
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error("Failed to load profiles");
          const data = await res.json();

          const arr = Array.isArray(data) ? data : [];
          const start = (page - 1) * limit;
          setRows(arr.slice(start, start + limit));
          return;
        }

        // Otherwise use the filtered endpoint
        const base =
          "https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php";

        const tryFetch = async (titleValue) => {
          const url =
            base +
            `?title=${encodeURIComponent(titleValue)}` +
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


          return list;
        };

    
        const titleCandidates =
          titleFilter === "All"
            ? ["All", ""]
            : [titleFilter, titleFilter.trim()];

        let list = [];
        for (const t of titleCandidates) {
          list = await tryFetch(t);
          if (list.length > 0) break;
        }

        setRows(list);
      } catch (e) {
        if (e.name !== "AbortError") setError("Could not load profiles.");
      } finally {
        setLoadingData(false);
      }
    };

    run();
    return () => controller.abort();
  }, [titleFilter, nameSearch, page]);

  const canGoPrev = page > 1;
  const canGoNext = rows.length === limit; // heuristic

  const mappedCards = useMemo(() => {
    return rows.map((r) => ({
      id: Number(r.id) || r.id,
      name: r.name ?? "Unnamed",
      role: r.title ?? "Untitled",
      image: r.image_url,
      bio: r.bio ?? "",
      email: r.email ?? "",
      year: "API",
      major: "Fetched",
      isFeatured: false,
    }));
  }, [rows]);

  return (
    <Section title="Fetched Profiles (Lab 8)">
      <div className="filters">
        <label className="filters__item">
          <span className="filters__label">Filter by title (API)</span>
          <select
            className="filters__control"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            disabled={loadingTitles}
          >
            {titles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__item">
          <span className="filters__label">Search by name (API)</span>
          <input
            className="filters__control"
            type="text"
            placeholder="Type a name…"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </label>

        <button
          className="filters__reset"
          type="button"
          onClick={() => {
            setTitleFilter("All");
            setNameSearch("");
            setPage(1);
          }}
        >
          Reset
        </button>
      </div>

      <div className="pager">
        <button
          type="button"
          onClick={() => setPage((p) => p - 1)}
          disabled={!canGoPrev || loadingData}
        >
          Prev
        </button>
        <span className="pager__text">Page {page}</span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={!canGoNext || loadingData}
        >
          Next
        </button>
      </div>

      {error && <p className="apiError">{error}</p>}
      {loadingData && <p className="apiHint">Loading…</p>}
      {!loadingData && !error && mappedCards.length === 0 && (
        <p className="apiHint">No results.</p>
      )}

      <div className="cards__grid">
        {mappedCards.map((p) => (
        <div key={p.id}>
          <Card {...p} mode={mode} />
          <Link to={`/profile/${p.id}`} state={{ profile: p }}>
            View Details
          </Link>
        </div>
))}

      </div>
    </Section>
  );
}
