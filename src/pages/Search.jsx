import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import {
  searchProductApi,
  getProductByCategoryApi,
  isValidProduct,
} from '../redux/reducers/productReducer';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const dispatch = useDispatch();
  const { arrSearch } = useSelector((state) => state.productReducer);

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category');

  const [inputValue, setInputValue] = useState(keyword);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (category) {
      dispatch(getProductByCategoryApi(category));
      setInputValue('');
    } else {
      dispatch(searchProductApi(keyword));
      setInputValue(keyword);
    }
  }, [keyword, category, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ keyword: inputValue.trim() });
  };

  const result = _.orderBy(arrSearch.filter(isValidProduct), ['price'], [sortOrder]);

  return (
    <div>
      <form className="search-form" onSubmit={handleSubmit}>
        <label>Search</label>
        <input
          placeholder="product name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn-submit">Search</button>
      </form>

      <div className="search-header">
        <h2>
          {category ? `Category: ${category}` : 'Search result'} ({result.length})
        </h2>
        <div className="search-sort">
          <button
            className={sortOrder === 'desc' ? 'active' : ''}
            onClick={() => setSortOrder('desc')}
          >
            Price: high → low
          </button>
          <button
            className={sortOrder === 'asc' ? 'active' : ''}
            onClick={() => setSortOrder('asc')}
          >
            Price: low → high
          </button>
        </div>
      </div>

      {result.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="product-list">
          {result.map((prod) => (
            <ProductCard key={prod.id} prod={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
