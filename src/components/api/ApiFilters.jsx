import React from "react";

function ApiFilters({
  titles,
  loadingTitles,
  titleFilter,
  onTitleChange,
  nameSearch,
  onNameChange,
  onReset,
  nameInputRef,
}) {
  return (
    <div className="filters">
      <label className="filters__item">
        <span className="filters__label">Filter by title (API)</span>
        <select
          className="filters__control"
          value={titleFilter}
          onChange={onTitleChange}
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
          ref={nameInputRef}
          className="filters__control"
          type="text"
          placeholder="Type a name…"
          value={nameSearch}
          onChange={onNameChange}
        />
      </label>

      <button className="filters__reset" type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default React.memo(ApiFilters);