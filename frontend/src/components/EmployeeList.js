import React, { useState, useEffect } from "react";
import { employeeAPI } from "../services/api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getEmployees();
      setEmployees(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card">Loading employees...</div>;
  if (error) return <div className="card" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="card">
      <h2>Employees</h2>
      <p>Total: {employees.length} employee(s)</p>
      
      {employees.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No employees found. You might need to create some via the database.
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Department</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{emp.employee_id}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{emp.personal_email}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{emp.department}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "4px",
                      background: emp.employee_status === "Active" ? "#dcfce7" : "#fee2e2",
                      color: emp.employee_status === "Active" ? "#166534" : "#991b1b"
                    }}>
                      {emp.employee_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={{ marginTop: "30px", fontSize: "14px", color: "#666" }}>
        <p><strong>Note:</strong> Only admin users can see all employees. Regular users only see their own profile.</p>
        <p>To create test employees, use Adminer (http://localhost:8081) or wait for the frontend to have create forms.</p>
      </div>
    </div>
  );
};

export default EmployeeList;
