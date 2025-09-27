import api from "@/services/axiosInterceptors";
import axios from "axios";
import React from "react";

function index({ user }) {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2 className="card-title mb-4">Welcome</h2>
              {user ? (
                <div>
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    You are signed in
                  </div>
                  <p className="text-muted">Welcome back!</p>
                </div>
              ) : (
                <div>
                  <div className="alert alert-warning" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    You are not signed in
                  </div>
                  <p className="text-muted">Please sign in to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;
