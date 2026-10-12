import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileApi, updateProfileApi, getFavoriteApi } from '../redux/reducers/userReducer';
import { ORDER_QUANTITIES } from '../redux/reducers/cartReducer';

const formatDate = (dateString) => {
  const d = new Date(dateString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)} - ${pad(d.getDate())} - ${d.getFullYear()}`;
};

const getSavedQuantities = () => JSON.parse(localStorage.getItem(ORDER_QUANTITIES) || '{}');

export default function Profile() {
  const dispatch = useDispatch();
  const { userProfile, favorites } = useSelector((state) => state.userReducer);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    dispatch(getProfileApi());
    dispatch(getFavoriteApi());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userProfile?.email || '',
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      password: '',
      gender: userProfile?.gender ?? true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên không được bỏ trống'),
      phone: Yup.string()
        .required('Số điện thoại không được bỏ trống')
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải gồm 10-11 chữ số'),
      password: Yup.string()
        .required('Nhập mật khẩu để xác nhận cập nhật')
        .min(6, 'Mật khẩu ít nhất 6 ký tự'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(updateProfileApi(values)).unwrap();
        alert('Cập nhật thành công!');
        formik.setFieldValue('password', '');
      } catch (err) {
        alert(err?.message || 'Cập nhật thất bại');
      }
    },
  });

  const showError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="form-error">{formik.errors[field]}</p>
    ) : null;

  if (!userProfile) return <p>Đang tải...</p>;

  const ordersHistory = [...(userProfile.ordersHistory || [])].reverse();
  const savedQuantities = getSavedQuantities();

  return (
    <div className="form-page">
      <h2 className="form-title">Profile</h2>

      <div className="profile">
        <img
          className="profile-avatar"
          src={userProfile.avatar || 'https://i.pravatar.cc/200'}
          alt="avatar"
        />

        <form className="form-register profile-form" onSubmit={formik.handleSubmit}>
          <div className="form-col">
            <label>Email</label>
            <input {...formik.getFieldProps('email')} disabled />

            <label>Phone</label>
            <input placeholder="phone" {...formik.getFieldProps('phone')} />
            {showError('phone')}
          </div>

          <div className="form-col">
            <label>Name</label>
            <input placeholder="name" {...formik.getFieldProps('name')} />
            {showError('name')}

            <label>Password</label>
            <input type="password" placeholder="password" {...formik.getFieldProps('password')} />
            {showError('password')}

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
              {formik.isSubmitting ? 'Đang lưu...' : 'Update'}
            </button>
          </div>
        </form>
      </div>

      <div className="profile-tabs">
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Order history
        </button>
        <button
          className={activeTab === 'favourite' ? 'active' : ''}
          onClick={() => setActiveTab('favourite')}
        >
          Favourite
        </button>
      </div>

      {activeTab === 'history' && (
        <>
          {ordersHistory.length === 0 && <p>Chưa có đơn hàng nào.</p>}

          {ordersHistory.map((order) => (
            <div key={order.id} className="order">
              <p className="order-date">+ Orders have been placed on {formatDate(order.date)}</p>

              <table className="cart-table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>img</th>
                    <th>name</th>
                    <th>price</th>
                    <th>quantity</th>
                    <th>total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderDetail?.map((item, index) => {
                    const quantity = savedQuantities[order.id]?.[index];
                    return (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td><img src={item.image} alt={item.name} /></td>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td><span className="qty-box">{quantity ?? '-'}</span></td>
                        <td>{quantity ? item.price * quantity : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}

      {activeTab === 'favourite' && (
        <>
          {favorites.length === 0 ? (
            <p>Chưa có sản phẩm yêu thích.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>img</th>
                  <th>name</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td><img src={prod.image} alt={prod.name} /></td>
                    <td>{prod.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
