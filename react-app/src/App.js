import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import './App.css';

function App() {

  const [objetos, setObjetos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const fetchObjetos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      setObjetos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError("Error al cargar objetos.");
    }
  };

  useEffect(() => {
    fetchObjetos();
  }, []);

  const handleAdd = async () => {
    setMensaje("");
    setError("");
    if (!nombre&!precio&!stock) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    try {
      await addDoc(collection(db, "products"), { nombre, precio, stock});
      setNombre("");
      setPrecio("");
      setStock("");
      setMensaje("Objeto agregado.");
      fetchObjetos();
    } catch (err) {
      setError("Error al agregar: " + err.message);
    }
  };

  

  const handleEdit = (obj) => {
    setEditId(obj.id);
    setNombre(obj.nombre);
    setMensaje("");
    setError("");
  };

  const handleUpdate = async () => {
    setMensaje("");
    setError("");
    if (!nombre) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    try {
      await updateDoc(doc(db, "products", editId), { nombre });
      setEditId(null);
      setNombre("");
      setMensaje("Objeto actualizado.");
      fetchObjetos();
    } catch (err) {
      setError("Error al actualizar: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este objeto?")) return;
    setMensaje("");
    setError("");
    try {
      await deleteDoc(doc(db, "products", id));
      setMensaje("Objeto borrado.");
      fetchObjetos();
    } catch (err) {
      setError("Error al borrar: " + err.message);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setNombre("");
    setMensaje("");
    setError("");
  };

  return (
    <div className="crud-container">
      <h2>CRUD Objetos</h2>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre del nombre"
        />
        <input
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          placeholder="Nombre del precio"
        />
        <input
          value={stock}
          onChange={e => setStock(e.target.value)}
          placeholder="Nombre del Stock"
        />
        {editId ? (
          <>
            <button onClick={handleUpdate}>Actualizar</button>
            <button onClick={handleCancel} style={{ background: "#bbb", color: "#222" }}>Cancelar</button>
          </>
        ) : (
          <button onClick={handleAdd}>Agregar</button>
        )}
      </div>
      {mensaje && <p style={{ color: "green", textAlign: "center" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </div>
  );
}

export default App;

