import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({ user }) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleSignOut = () => {
    router.push("/signout");
  };

  const handleMyOrders = () => {
    router.push("/orders");
  };

  const handleCreate = () => {
    router.push("/tickets/new");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Extract username from email (part before @)
  const getUsername = (email) => {
    if (!email) return "";
    return email.split("@")[0];
  };

  console.log("user", user);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          GitTickets
        </a>

        <div className="navbar-nav ms-auto">
          {user ? (
            // User is signed in - show create button and username dropdown
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-light d-flex align-items-center gap-2"
                onClick={handleCreate}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                Create
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  aria-expanded={dropdownOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                >
                  {getUsername(user.email)}
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${
                    dropdownOpen ? "show" : ""
                  }`}
                  aria-labelledby="userDropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleMyOrders();
                      }}
                    >
                      My Orders
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleSignOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            // User is signed out - show sign in and sign up buttons
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light" onClick={handleSignIn}>
                Sign In
              </button>
              <button className="btn btn-primary" onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
