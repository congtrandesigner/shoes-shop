import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>GET HELP</h4>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/search?keyword=nike">Nike</NavLink>
          <NavLink to="/search?keyword=adidas">Adidas</NavLink>
          <a href="mailto:congtrandesigner@gmail.com">Contact</a>
        </div>

        <div className="footer-col">
          <h4>SUPPORT</h4>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Help</a>
          <a href="tel:0979972617">Phone</a>
        </div>

        <div className="footer-col">
          <h4>REGISTER</h4>
          <NavLink to="/register">register</NavLink>
          <NavLink to="/login">login</NavLink>
        </div>
      </div>

      <div className="footer-bottom">
        © 2022 Cybersoft All Rights Reserved | Design Theme by Trương Tấn Khải.
      </div>
    </footer>
  );
}
