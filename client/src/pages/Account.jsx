import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar/Sidebar";
import './Account.css'

const { Sider, Content } = Layout;

function Account() {
  const [collapsed, setCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // generalmente non visualizziamo la password esistente per sicurezza, ma la usiamo per aggiornamenti
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

   // Recupera il token salvato (ad esempio in localStorage)
   const token = localStorage.getItem("token");

   // Carica i dati utente appena il componente monta
   useEffect(() => {
     axios
       .get("/api/user", {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         const { name, email } = response.data;
         setFormData({ name, email, password: "" });
       })
       .catch((err) => {
         console.error("Error while fetching user data:", err);
       });
   }, [token]);
 
   // Aggiornamento dello stato per ogni input modificato
   const handleChange = (e) => {
     setFormData((prevData) => ({
       ...prevData,
       [e.target.name]: e.target.value,
     }));
   };
 
   // Gestione della submit del form per aggiornare le info
   const handleSubmit = (e) => {
     e.preventDefault();
     axios
       .put("/api/user", formData, {
         headers: { Authorization: `Bearer ${token}` },
       })
       .then((response) => {
         console.log("User updated successfully:", response.data);
         setEditMode(false);
         // opzionalmente puoi aggiornare lo stato o mostrare un messaggio di successo
       })
       .catch((err) => {
         console.error("Error while updating:", err);
         setError(err.response?.data?.message || "Error while updating");
       });
   };

  return (
    <Layout>
      <Sider
        className="sider"
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={180}
        collapsedWidth={60}
      >
        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      </Sider>
      <Layout>
        <Content className="content">
          <div className="account-container">
            <h2 className="title">
              <span className="gradient-text">Your Account</span>
            </h2>
            {!editMode ? (
              <div className="form-container">
                <p>
                  <strong>Name:</strong> {formData.name}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Password:</strong> {"********"}
                </p>
                {/* Per motivi di sicurezza non si mostra la password */}
                <button className="change-btn" onClick={() => setEditMode(true)}>Change</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Account;
