import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/axiosInterceptors';

function Signout() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(true);

  useEffect(() => {
    const signOut = async () => {
      try {
        await api.post('/api/users/signout');
        // Redirect to home page after successful signout
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
        // Even if there's an error, redirect to home page
        router.push('/');
      }
    };

    signOut();
  }, [router]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="card-title">Signing Out</h4>
              <p className="card-text text-muted">
                You are being signed out. Please wait...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signout;