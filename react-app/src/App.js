import React, { useState } from "react";
import CrudObjetos from "./Componentes/CrudObjetos";
import Login from "./Componentes/Login";
import './App.css';

function App() {
  const [logged, setLogged] = useState(false);

  return (
    <div>
      {logged ? <CrudObjetos /> : <Login onLogin={() => setLogged(true)} />}
    </div>
  );
}

export default App;

