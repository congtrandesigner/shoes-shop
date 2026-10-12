import { Routes, Route } from 'react-router-dom';
import HomeTemplate from './templates/HomeTemplate';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Carts from './pages/Carts';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeTemplate />}>
        <Route index element={<Home />} />
        <Route path="detail/:id" element={<Detail />} />
        <Route path="search" element={<Search />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
        <Route
          path="carts"
          element={<ProtectedRoute><Carts /></ProtectedRoute>}
        />
      </Route>
    </Routes>
  );
}
