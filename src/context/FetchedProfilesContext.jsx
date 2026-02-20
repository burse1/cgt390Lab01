import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const FetchedProfilesContext = createContext(null);

const TITLES_URL = "https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php";
const ALL_URL = "https://web.ics.purdue.edu/~zong6/profile-app/fetch-data.php";
const FILTER_URL =
  "https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php";

const LIMIT = 10;

const initialState = {
  // titles
  titles: ["All"],
  loadingTitles: false,

  // filters
  titleFilter: "All",
  nameSearch: "",

  // paging
  page: 1,
  limit: LIMIT,
  totalCount: 0,

  // data
  rows: [],
  loadingData: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "TITLES_LOADING":
      return { ...state, loadingTitles: true, error: "" };

    case "TITLES_SUCCESS":
      return { ...state, loadingTitles: false, titles: action.payload };

    case "TITLES_ERROR":
      return { ...state, loadingTitles: false, error: action.payload || "Could not load titles." };

    case "SET_TITLE_FILTER":
      return { ...state, titleFilter: action.payload, page: 1 };

    case "SET_NAME_SEARCH":
      return { ...state, nameSearch: action.payload, page: 1 };

    case "SET_PAGE":
      return { ...state, page: action.payload };

    case "RESET_FILTERS":
      return { ...state, titleFilter: "All", nameSearch: "", page: 1 };

    case "DATA_LOADING":
      return { ...state, loadingData: true, error: "" };

    case "DATA_SUCCESS":
      return {
        ...state,
        loadingData: false,
        rows: action.payload.rows,
        totalCount: action.payload.totalCount,
      };

    case "DATA_ERROR":
      return { ...state, loadingData: false, error: action.payload || "Could not load profiles." };

    default:
      return state;
  }
}

export function FetchedProfilesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch titles once
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        dispatch({ type: "TITLES_LOADING" });

        const res = await fetch(TITLES_URL, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load titles");
        const data = await res.json();

        // keep spaces (API includes trailing spaces)
        const rawTitles = Array.isArray(data.titles) ? data.titles : [];
        const deduped = Array.from(new Set(rawTitles.map((t) => String(t)))).filter(
          (t) => t.length > 0
        );
        deduped.sort((a, b) => a.localeCompare(b));

        dispatch({ type: "TITLES_SUCCESS", payload: ["All", ...deduped] });
      } catch (e) {
        if (e.name !== "AbortError") {
          dispatch({ type: "TITLES_ERROR", payload: "Could not load titles." });
        }
      }
    }

    run();
    return () => controller.abort();
  }, []);

  // Fetch data whenever filters/page change
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        dispatch({ type: "DATA_LOADING" });

        const nameParam = state.nameSearch.trim();
        const useFetchAll = state.titleFilter === "All" && nameParam === "";

        if (useFetchAll) {
          const res = await fetch(ALL_URL, { signal: controller.signal });
          if (!res.ok) throw new Error("Failed to load profiles");
          const data = await res.json();

          const arr = Array.isArray(data) ? data : [];
          const start = (state.page - 1) * state.limit;

          dispatch({
            type: "DATA_SUCCESS",
            payload: {
              rows: arr.slice(start, start + state.limit),
              totalCount: arr.length,
            },
          });
          return;
        }

        const url =
          FILTER_URL +
          `?title=${encodeURIComponent(state.titleFilter)}` +
          `&name=${encodeURIComponent(nameParam)}` +
          `&page=${encodeURIComponent(state.page)}` +
          `&limit=${encodeURIComponent(state.limit)}`;

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

        const totalCount = Number(data?.count) || list.length;

        dispatch({
          type: "DATA_SUCCESS",
          payload: { rows: list, totalCount },
        });
      } catch (e) {
        if (e.name !== "AbortError") {
          dispatch({ type: "DATA_ERROR", payload: "Could not load profiles." });
        }
      }
    }

    run();
    return () => controller.abort();
  }, [state.titleFilter, state.nameSearch, state.page, state.limit]);

  const canGoPrev = state.page > 1;
  const canGoNext = state.page * state.limit < state.totalCount;

  const value = useMemo(
    () => ({
      state,
      dispatch,
      canGoPrev,
      canGoNext,
    }),
    [state, canGoPrev, canGoNext]
  );

  return (
    <FetchedProfilesContext.Provider value={value}>
      {children}
    </FetchedProfilesContext.Provider>
  );
}

export function useFetchedProfiles() {
  const ctx = useContext(FetchedProfilesContext);
  if (!ctx) throw new Error("useFetchedProfiles must be used inside <FetchedProfilesProvider>");
  return ctx;
}

export default FetchedProfilesContext;