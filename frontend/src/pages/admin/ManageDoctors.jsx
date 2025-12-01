import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadDoctors = () => {
    setLoading(true);
    axios
      .get("/admin/doctors")
      .then((res) => setDoctors(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !specialization) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("/admin/doctors", {
        name,
        email,
        password,
        specialization,
      });

      alert("Doctor added successfully");
      setName("");
      setEmail("");
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
    setSpecialization(doc.specialization);
    setPassword("");
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    if (!name || !email || !specialization) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.put(`/admin/doctors/${editId}`, {
        name,
        email,
        specialization,
      });

      alert("Doctor updated successfully");
      setEditMode(false);
      setEditId(null);
      setName("");
      setEmail("");
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
    <div style={{ padding: 20 }}>
      <h2>Manage Doctors</h2>

      {/* ADD / EDIT FORM */}
      <form onSubmit={editMode ? handleUpdateDoctor : handleAddDoctor} style={{ marginBottom: 20 }}>
        <h3>{editMode ? "Edit Doctor" : "Add Doctor"}</h3>

        <input
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />

        {!editMode && (
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", marginBottom: 10 }}
          />
        )}

        <input
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          style={{ display: "block", marginBottom: 10 }}
        />

        <button type="submit">{editMode ? "Update" : "Add"} Doctor</button>

        {editMode && (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setEditId(null);
              setName("");
              setEmail("");
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
      <h3>Existing Doctors</h3>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.id} style={{ marginBottom: 10 }}>
            <strong>{doc.user.name}</strong> — {doc.specialization} <br />
            <strong>Email:</strong> {doc.user.email}

            <div style={{ marginTop: 5 }}>
              <button onClick={() => handleEditDoctor(doc)}>Edit</button>
              <button
                onClick={() => handleDeleteDoctor(doc.id)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
            </div>
            <hr />
          </li>
        ))}
      </ul>

      <button onClick={() => (window.location.href = "/admin")} style={{ marginTop: 20 }}>
        Back to Dashboard
      </button>
    </div>
  );
}