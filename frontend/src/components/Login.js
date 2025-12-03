import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { authAPI, setAccessToken } from "../services/api";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      const response = await authAPI.googleLogin(credentialResponse.credential);
      
      // Save only access token (refresh token should be in httpOnly cookie)
      if (response.data.tokens?.access_token) {
        setAccessToken(response.data.tokens.access_token);
      } else if (response.data.access_token) {
        setAccessToken(response.data.access_token);
      }
      
      // Save user data
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="card" style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>HRMS Login</h2>
      <p>Sign in with your Google account</p>
      
      {error && (
        <div style={{ color: "red", margin: "10px 0", padding: "10px", background: "#fee" }}>
          {error}
        </div>
      )}
      
      <div style={{ margin: "20px 0" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_blue"
          size="large"
          shape="rectangular"
          useOneTap // Optional: for better UX
        />
      </div>
      
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>For testing:</p>
        <p>• Use any Google account</p>
        <p>• First login creates user automatically</p>
      </div>
    </div>
  );
};

export default Login;