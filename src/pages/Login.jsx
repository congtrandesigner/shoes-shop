import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';
import { loginApi, loginFacebookApi } from '../redux/reducers/userReducer';
import { loadFacebookSdk, getFacebookToken } from '../api/facebook';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadFacebookSdk();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Email không được bỏ trống').email('Email không hợp lệ'),
      password: Yup.string().required('Mật khẩu không được bỏ trống'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(loginApi(values)).unwrap();
        alert('Đăng nhập thành công!');
        navigate('/');
      } catch (err) {
        alert(err?.message || 'Đăng nhập thất bại');
      }
    },
  });

  const handleFacebookLogin = async () => {
    try {
      const facebookToken = await getFacebookToken();
      await dispatch(loginFacebookApi(facebookToken)).unwrap();
      alert('Đăng nhập Facebook thành công!');
      navigate('/');
    } catch (err) {
      alert(err?.message || 'Đăng nhập Facebook thất bại');
    }
  };

  const showError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="form-error">{formik.errors[field]}</p>
    ) : null;

  return (
    <div className="form-page">
      <h2 className="form-title">Login</h2>

      <form className="form-col form-login" onSubmit={formik.handleSubmit}>
        <label>Email</label>
        <input placeholder="email" {...formik.getFieldProps('email')} />
        {showError('email')}

        <label>Password</label>
        <div className="password-box">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="password"
            {...formik.getFieldProps('password')}
          />
          <button
            type="button"
            className="btn-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {showError('password')}

        <div className="form-login-bottom">
          <NavLink to="/register">Register now ?</NavLink>
          <button type="submit" className="btn-submit btn-login" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang gửi...' : 'Login'}
          </button>
        </div>

        <button type="button" className="btn-facebook" onClick={handleFacebookLogin}>
          <FaFacebook />
          <span>Continue with Facebook</span>
        </button>
      </form>
    </div>
  );
}
