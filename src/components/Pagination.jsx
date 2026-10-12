import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const getPages = (current, total) => {
  const pages = [];
  for (let i = 1; i <= total; i++) {
    const isEdge = i <= 2 || i > total - 2;
    const isNear = Math.abs(i - current) <= 1;
    if (isEdge || isNear) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return pages;
};

export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={current === 1} onClick={() => onChange(current - 1)}>
        <FiChevronLeft />
      </button>

      {getPages(current, total).map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="page-dots">...</span>
        ) : (
          <button
            key={p}
            className={p === current ? 'active' : ''}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button disabled={current === total} onClick={() => onChange(current + 1)}>
        <FiChevronRight />
      </button>
    </div>
  );
}
