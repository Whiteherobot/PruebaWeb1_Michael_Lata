import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function CrudObjetos() {
  const [objetos, setObjetos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const fetchObjetos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "objetos"));
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
    if (!nombre) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    try {
      await addDoc(collection(db, "objetos"), { nombre });
      setNombre("");
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
      await updateDoc(doc(db, "objetos", editId), { nombre });
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
      await deleteDoc(doc(db, "objetos", id));
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
          placeholder="Nombre del objeto"
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
      <table className="crud-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {objetos.map(obj => (
            <tr key={obj.id}>
              <td>{obj.nombre}</td>
              <td>
                <button onClick={() => handleEdit(obj)}>Editar</button>
                <button onClick={() => handleDelete(obj.id)} style={{ background: "#c62828" }}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}