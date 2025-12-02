import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin.css";

axios.defaults.withCredentials = true;

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadDoctors = async () => {
    try {
      const res = await axios.get("/admin/doctors");
      setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // call async loader without triggering sync setState warnings
    (async () => {
      await loadDoctors();
    })();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !specialization) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("/admin/doctors", {
        name,
        email,
        phone,
        password,
        specialization,
      });

      alert("Doctor added successfully");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSpecialization("");
      loadDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding doctor");
    }
  };

  const handleEditDoctor = (doc) => {
    setEditMode(true);
    setEditId(doc.id);
    setName(doc.user.name);
    setEmail(doc.user.email);
    setPhone(doc.user.phone || "");
    setSpecialization(doc.specialization);
    setPassword("");
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !specialization) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.put(`/admin/doctors/${editId}`, {
        name,
        email,
        phone,
        specialization,
      });

      alert("Doctor updated successfully");
      setEditMode(false);
      setEditId(null);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSpecialization("");
      loadDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating doctor");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(`/admin/doctors/${id}`);
      alert("Doctor deleted successfully");
      loadDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting doctor");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="admin-container">
      <h2 className="admin-title">Manage Doctors</h2>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={editMode ? handleUpdateDoctor : handleAddDoctor}
        className="admin-form"
      >
        <h3>{editMode ? "Edit Doctor" : "Add Doctor"}</h3>

        <input
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {!editMode && (
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <input
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />

        <button type="submit">
          {editMode ? "Update" : "Add"} Doctor
        </button>

        {editMode && (
          <button
            type="button"
            className="delete-btn"
            onClick={() => {
              setEditMode(false);
              setEditId(null);
              setName("");
              setEmail("");
              setPhone("");
              setPassword("");
              setSpecialization("");
            }}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* DOCTOR LIST */}
      <h3 className="admin-title" style={{ fontSize: 24 }}>Existing Doctors</h3>

      {doctors.map((doc) => (
        <div key={doc.id} className="admin-card">
          <div className="info-row"><strong>{doc.user.name}</strong></div>
          <div className="info-row"><strong>Email:</strong> {doc.user.email}</div>
          <div className="info-row"><strong>Phone:</strong> {doc.user.phone}</div>
          <div className="info-row"><strong>Specialization:</strong> {doc.specialization}</div>

          <div style={{ marginTop: 10 }}>
            <button
              className="edit-btn"
              onClick={() => handleEditDoctor(doc)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDeleteDoctor(doc.id)}
              style={{ marginLeft: 10 }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <button
        className="back-btn"
        onClick={() => (window.location.href = "/admin")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}