import React from "react";
import Card from "../Card";

function ApiGrid({ cards, cols, mode, gridRef }) {
  return (
    <div
      ref={gridRef}
      className="cards__grid"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cards.map((p) => (
        <Card key={p.id} {...p} mode={mode} />
      ))}
    </div>
  );
}

export default React.memo(ApiGrid);