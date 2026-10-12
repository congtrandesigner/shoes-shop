import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../redux/reducers/userReducer';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      phone: '',
      gender: true,
    },

    validationSchema: Yup.object({
      email: Yup.string().required('Email không được bỏ trống').email('Email không hợp lệ'),
      password: Yup.string().required('Mật khẩu không được bỏ trống').min(6, 'Mật khẩu ít nhất 6 ký tự'),
      passwordConfirm: Yup.string()
        .required('Vui lòng nhập lại mật khẩu')
        .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp'),
      name: Yup.string().required('Tên không được bỏ trống'),
      phone: Yup.string()
        .required('Số điện thoại không được bỏ trống')
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải gồm 10-11 chữ số'),
    }),

    onSubmit: async (values) => {
      const { passwordConfirm, ...userRegister } = values;
      try {
        await dispatch(registerApi(userRegister)).unwrap();
        alert('Đăng ký thành công!');
        navigate('/login');
      } catch (err) {
        alert(err?.message || 'Đăng ký thất bại');
      }
    },
  });

  const showError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="form-error">{formik.errors[field]}</p>
    ) : null;

  return (
    <div className="form-page">
      <h2 className="form-title">Register</h2>

      <form className="form-register" onSubmit={formik.handleSubmit}>
        <div className="form-col">
          <label>Email</label>
          <input name="email" placeholder="email" {...formik.getFieldProps('email')} />
          {showError('email')}

          <label>Password</label>
          <input type="password" placeholder="password" {...formik.getFieldProps('password')} />
          {showError('password')}

          <label>Password confirm</label>
          <input type="password" placeholder="password confirm" {...formik.getFieldProps('passwordConfirm')} />
          {showError('passwordConfirm')}
        </div>

        <div className="form-col">
          <label>Name</label>
          <input placeholder="name" {...formik.getFieldProps('name')} />
          {showError('name')}

          <label>Phone</label>
          <input placeholder="phone" {...formik.getFieldProps('phone')} />
          {showError('phone')}

          <div className="form-gender">
            <span>Gender</span>
            <label>
              <input
                type="radio"
                name="gender"
                checked={formik.values.gender === true}
                onChange={() => formik.setFieldValue('gender', true)}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                checked={formik.values.gender === false}
                onChange={() => formik.setFieldValue('gender', false)}
              />
              Female
            </label>
          </div>

          <button type="submit" className="btn-submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang gửi...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
