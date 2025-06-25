import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "@/api/user";

export default function Navbar() {
  const { token, clear } = useAuthStore();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data);
        } catch (e) {
          console.error("failed to fetch data!", e);
        }
      }
    };
    fetchUser();
  }, [token]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold text-light" to="/">
        CodexShare
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/posts">
                Posts
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {token && user ? (
              <li className="nav-item dropdown">
                <button
                  className="btn nav-link dropdown-toggle d-flex align-items-center text-light"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={`http://localhost:3000/uploads/${user.avatar}`}
                    alt="avatar"
                    width="32"
                    height="32"
                    className="rounded-circle me-2"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="text-light">{user.name}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/user-posts">
                      My Posts
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        clear();
                        navigate("/auth");
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/auth">
                    Join Now
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
