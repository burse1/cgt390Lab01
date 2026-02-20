import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Card from "./Card";
import Section from "./section";
import { useFetchedProfiles } from "../context/FetchedProfilesContext";
import { useMode } from "../context/ModeContext";

export default function FetchedProfiles() {
  const { mode } = useMode();
  const { state, dispatch, canGoPrev, canGoNext } = useFetchedProfiles();

  //  useRef: access DOM input + focus it on reset
  const nameInputRef = useRef(null);

  //  useLayoutEffect (next section): measure grid width before paint
  const gridRef = useRef(null);
  const [cols, setCols] = useState(3);

  useLayoutEffect(() => {
    if (!gridRef.current) return;

    const measure = () => {
      const w = gridRef.current.getBoundingClientRect().width;
      // pick a reasonable min card width; adjust if your cards are wider/narrower
      const minCard = 260;
      const nextCols = Math.max(1, Math.floor(w / minCard));
      setCols(nextCols);
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(gridRef.current);

    return () => ro.disconnect();
  }, []);

  const mappedCards = useMemo(() => {
    return state.rows.map((r) => ({
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
  }, [state.rows]);

  return (
    <Section title="Fetched Profiles (API)">
      <div className="filters">
        <label className="filters__item">
          <span className="filters__label">Filter by title (API)</span>
          <select
            className="filters__control"
            value={state.titleFilter}
            onChange={(e) =>
              dispatch({ type: "SET_TITLE_FILTER", payload: e.target.value })
            }
            disabled={state.loadingTitles}
          >
            {state.titles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__item">
          <span className="filters__label">Search by name (API)</span>
          <input
            ref={nameInputRef}
            className="filters__control"
            type="text"
            placeholder="Type a name…"
            value={state.nameSearch}
            onChange={(e) =>
              dispatch({ type: "SET_NAME_SEARCH", payload: e.target.value })
            }
          />
        </label>

        <button
          className="filters__reset"
          type="button"
          onClick={() => {
            dispatch({ type: "RESET_FILTERS" });
            // focus input after reset
            nameInputRef.current?.focus();
          }}
        >
          Reset
        </button>
      </div>

      <div className="pager">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_PAGE", payload: state.page - 1 })}
          disabled={!canGoPrev || state.loadingData}
        >
          Prev
        </button>
        <span className="pager__text">Page {state.page}</span>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_PAGE", payload: state.page + 1 })}
          disabled={!canGoNext || state.loadingData}
        >
          Next
        </button>
      </div>

      {state.error && <p className="apiError">{state.error}</p>}
      {state.loadingData && <p className="apiHint">Loading…</p>}
      {!state.loadingData && !state.error && mappedCards.length === 0 && (
        <p className="apiHint">No results.</p>
      )}

      {/* useLayoutEffect result used here: dynamic columns */}
      <div
        ref={gridRef}
        className="cards__grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {mappedCards.map((p) => (
          <Card key={p.id} {...p} mode={mode} />
        ))}
      </div>
    </Section>
  );
}