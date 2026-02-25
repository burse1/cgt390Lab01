import React from "react";

function ApiPager({ page, onPrev, onNext, disablePrev, disableNext }) {
  return (
    <div className="pager">
      <button type="button" onClick={onPrev} disabled={disablePrev}>
        Prev
      </button>
      <span className="pager__text">Page {page}</span>
      <button type="button" onClick={onNext} disabled={disableNext}>
        Next
      </button>
    </div>
  );
}

export default React.memo(ApiPager);