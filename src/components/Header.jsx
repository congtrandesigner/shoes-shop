import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { logout } from '../redux/reducers/userReducer';
import { TOKEN, USER_LOGIN } from '../api/http';

const categories = [
  { id: 'MEN', label: 'Men' },
  { id: 'WOMEN', label: 'Woman' },
  { id: 'KID', label: 'Kid' },
  { id: 'SPORT', label: 'Sport' },
];


export default function Header() {
  const { userLogin } = useSelector((state) => state.userReducer);
  const { arrCart } = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const currentCategory = new URLSearchParams(search).get('category');

  const totalQuantity = arrCart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_LOGIN);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header>
      <div className="header">
        <NavLink to="/" className="logo">SHOES SHOP</NavLink>

        <div className="header-right">
          <NavLink to="/search" className="header-icon">
            <FiSearch /> Search
          </NavLink>
          <NavLink to="/carts" className="header-icon">
            <FiShoppingCart /> ({totalQuantity})
          </NavLink>

          {userLogin ? (
            <>
              <NavLink to="/profile">{userLogin.email}</NavLink>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>

      <nav className="nav">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/search?category=${cat.id}`}
            className={currentCategory === cat.id ? 'active' : ''}
          >
            {cat.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
