import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Carousel({ products }) {
  const [index, setIndex] = useState(0);
  const total = products.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const next = () => setIndex((i) => (i + 1) % total);

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total, index]);

  if (total === 0) return null;

  const prod = products[index];

  return (
    <div className="carousel">
      <button className="carousel-arrow left" onClick={prev}>
        <FiChevronLeft />
      </button>

      <div className="carousel-slide">
        <img src={prod.image} alt={prod.name} />
        <div className="carousel-info">
          <h2>{prod.name}</h2>
          <p>{prod.shortDescription}</p>
          <NavLink to={`/detail/${prod.id}`} className="btn-carousel">Buy now</NavLink>
        </div>
      </div>

      <button className="carousel-arrow right" onClick={next}>
        <FiChevronRight />
      </button>

      <div className="carousel-dots">
        {products.map((p, i) => (
          <span
            key={p.id}
            className={i === index ? 'dot active' : 'dot'}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
