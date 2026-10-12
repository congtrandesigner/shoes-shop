import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginApi } from '../redux/reducers/userReducer';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        <input type="password" placeholder="password" {...formik.getFieldProps('password')} />
        {showError('password')}

        <div className="form-login-bottom">
          <NavLink to="/register">Register now?</NavLink>
          <button type="submit" className="btn-submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang gửi...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
