import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nombre || !password) {
      setError("Completa todos los campos.");
      return;
    }
    try {
      const q = query(
        collection(db, "usuarios"),
        where("nombre", "==", nombre),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setSuccess("¡Bienvenido!");
        setTimeout(() => onLogin(), 800);
      } else {
        setError("Usuario o contraseña incorrectos. ¿Deseas registrarte?");
      }
    } catch (err) {
      setError("Error al conectar con la base de datos.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nombre || !password) {
      setError("Completa todos los campos.");
      return;
    }
    try {
      // Verifica si ya existe el usuario
      const q = query(
        collection(db, "usuarios"),
        where("nombre", "==", nombre)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("El usuario ya existe.");
        return;
      }
      await addDoc(collection(db, "usuarios"), { nombre, password });
      setSuccess("Usuario registrado. Ahora puedes ingresar.");
    } catch (err) {
      setError("Error al registrar usuario.");
    }
  };

  return (
    <form className="crud-container" style={{ maxWidth: 350 }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        autoFocus
      /><br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin} style={{ marginRight: 8 }}>Ingresar</button>
      <button onClick={handleRegister} type="button">Registrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}