import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { userLogin } = useSelector((state) => state.userReducer);

  if (!userLogin) {
    alert('Vui lòng đăng nhập!');
    return <Navigate to="/login" replace />;
  }

  return children;
}
