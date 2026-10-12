import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetailApi } from '../redux/reducers/productReducer';
import { addToCart } from '../redux/reducers/cartReducer';
import ProductCard from '../components/ProductCard';

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state.productReducer);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    dispatch(getProductDetailApi(id));
    setQuantity(1);
    setSelectedSize(null);
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  if (!productDetail) return <p>Đang tải...</p>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size!');
      return;
    }
    dispatch(
      addToCart({
        id: productDetail.id,
        name: productDetail.name,
        image: productDetail.image,
        price: productDetail.price,
        size: selectedSize,
        quantity: quantity,
      })
    );
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <div>
      <div className="detail">
        <img src={productDetail.image} alt={productDetail.name} />

        <div className="detail-info">
          <h2>{productDetail.name}</h2>
          <p>{productDetail.description}</p>

          <h3 className="detail-size-title">Available size</h3>
          <div className="detail-sizes">
            {productDetail.size.map((s) => (
              <button
                key={s}
                className={s === selectedSize ? 'size active' : 'size'}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="detail-price">{productDetail.price}$</p>

          <div className="detail-quantity">
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
            <span>{quantity}</span>
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
          </div>

          <button className="btn-add" onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>

      <h2 className="related-title">- Realate Product -</h2>
      <div className="product-list">
        {productDetail.relatedProducts.map((prod) => (
          <ProductCard key={prod.id} prod={prod} />
        ))}
      </div>
    </div>
  );
}
