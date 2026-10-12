import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import Pagination from '../components/Pagination';
import { getAllProductApi, isValidProduct } from '../redux/reducers/productReducer';

const PAGE_SIZE = 6;

export default function Home() {
  const dispatch = useDispatch();
  const { arrProduct, loading } = useSelector((state) => state.productReducer);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllProductApi());
  }, [dispatch]);

  if (loading) return <p>Đang tải...</p>;

  const validProducts = arrProduct.filter(isValidProduct);

  const totalPages = Math.ceil(validProducts.length / PAGE_SIZE);
  const pageProducts = validProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <Carousel products={validProducts.slice(0, 4)} />

      <h2 className="section-title">Product Feature</h2>
      <div className="product-list">
        {pageProducts.map((prod) => (
          <ProductCard key={prod.id} prod={prod} />
        ))}
      </div>

      <Pagination current={page} total={totalPages} onChange={setPage} />
    </div>
  );
}
