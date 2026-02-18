import { useMemo } from "react";
import Card from "./Card";
import Section from "./section";
import { useMode } from "../context/ModeContext";
import { useFetchedProfiles } from "../context/FetchedProfilesContext";

export default function FetchedProfiles() {
  const { mode } = useMode();

  const {
    titles,
    loadingTitles,

    titleFilter,
    setTitleFilter,
    nameSearch,
    setNameSearch,

    page,
    setPage,
    limit,
    canGoPrev,
    canGoNext,

    rows,
    loadingData,
    error,
    reset,
  } = useFetchedProfiles();

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
    <Section title="Fetched Profiles (API)">
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

        <button className="filters__reset" type="button" onClick={reset}>
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
          <Card key={p.id} {...p} mode={mode} />
        ))}
      </div>
    </Section>
  );
}
