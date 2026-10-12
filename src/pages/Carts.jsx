import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  changeQuantity,
  removeFromCart,
  clearCart,
  orderApi,
} from '../redux/reducers/cartReducer';

export default function Carts() {
  const dispatch = useDispatch();
  const { arrCart } = useSelector((state) => state.cartReducer);
  const { userLogin } = useSelector((state) => state.userReducer);

  const totalPrice = arrCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    const order = {
      orderDetail: arrCart.map((item) => ({
        productId: String(item.id),
        quantity: item.quantity,
      })),
      email: userLogin.email,
    };
    try {
      await dispatch(orderApi(order)).unwrap();
      alert('Đặt hàng thành công!');
      dispatch(clearCart());
    } catch (err) {
      alert(err?.message || 'Đặt hàng thất bại');
    }
  };

  if (arrCart.length === 0) {
    return (
      <div className="form-page">
        <h2 className="form-title">Carts</h2>
        <p>
          Giỏ hàng trống. <NavLink to="/" className="link">Mua sắm ngay</NavLink>
        </p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <h2 className="form-title">Carts</h2>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Size</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {arrCart.map((item) => (
            <tr key={`${item.id}-${item.size}`}>
              <td><img src={item.image} alt={item.name} /></td>
              <td>{item.name}</td>
              <td>{item.size}</td>
              <td>{item.price}$</td>
              <td>
                <div className="cart-quantity">
                  <button
                    onClick={() =>
                      dispatch(changeQuantity({ id: item.id, size: item.size, delta: 1 }))
                    }
                  >
                    +
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(changeQuantity({ id: item.id, size: item.size, delta: -1 }))
                    }
                  >
                    -
                  </button>
                </div>
              </td>
              <td>{item.price * item.quantity}$</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-bottom">
        <p className="cart-total">Total: {totalPrice}$</p>
        <button className="btn-order" onClick={handleOrder}>SUBMIT ORDER</button>
      </div>
    </div>
  );
}
