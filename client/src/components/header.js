import React from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ user }) => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleSignOut = () => {
    router.push('/signout');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          GitTickets
        </a>
        
        <div className="navbar-nav ms-auto">
          {user ? (
            // User is signed in - show sign out button
            <button 
              className="btn btn-outline-light" 
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          ) : (
            // User is signed out - show sign in and sign up buttons
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-light" 
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSignUp}
              >
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
