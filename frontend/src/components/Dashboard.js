import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load user", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      {user && (
        <div style={{ marginTop: "20px" }}>
          <h3>Welcome, {user.name}!</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.name} 
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            )}
            <div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.is_admin ? "Admin" : "User"}</p>
              <p><strong>Last Login:</strong> {new Date(user.last_login).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: "30px" }}>
        <h3>Quick Actions</h3>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button className="btn btn-primary" onClick={() => navigate("/employees")}>
            View Employees
          </button>
          <button className="btn" onClick={() => window.open("http://localhost:8081", "_blank")}>
            Open Database (Adminer)
          </button>
          <button className="btn" onClick={() => window.open("http://localhost:8001/api/docs", "_blank")}>
            Open API Docs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
