import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UpdateIcon from "@mui/icons-material/Update";
import SchoolIcon from "@mui/icons-material/School";
import "./Nav.css";

function Nav() {
  return (
    <nav className="navbar">
      <div className="logo">
        <SchoolIcon className="logo-icon" />
        <span>GradeSystem</span>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" className="nav-item">
            <HomeIcon />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/student/signup" className="nav-item">
            <AddCircleIcon />
            <span>s-signup</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/student/login" className="nav-item">
            <AddCircleIcon />
            <span>s-login</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/teacher/signup" className="nav-item">
            <AddCircleIcon />
            <span>t-signup</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/teacher/login" className="nav-item">
            <UpdateIcon />
            <span>t-login</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
