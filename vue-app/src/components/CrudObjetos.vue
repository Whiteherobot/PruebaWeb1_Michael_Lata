<template>
  <div class="crud-container">
    <h2>CRUD Objetos</h2>
    <div style="text-align:center; margin-bottom:12px">
      <input v-model="nombre" placeholder="Nombre del objeto" />
      <button v-if="editId" @click="handleUpdate">Actualizar</button>
      <button v-if="editId" @click="handleCancel" style="background:#bbb; color:#222">Cancelar</button>
      <button v-else @click="handleAdd">Agregar</button>
    </div>
    <p v-if="mensaje" style="color:green; text-align:center">{{ mensaje }}</p>
    <p v-if="error" style="color:red; text-align:center">{{ error }}</p>
    <table class="crud-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="obj in products" :key="obj.id">
          <td>{{ obj.nombre }}</td>
          <td>
            <button @click="handleEdit(obj)">Editar</button>
            <button @click="handleDelete(obj.id)" style="background:#c62828">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const products = ref([]);
const nombre = ref("");
const editId = ref(null);
const mensaje = ref("");
const error = ref("");

const fetchObjetos = async () => {
  try {
    const data = await getDocs(collection(db, "products"));
    products.value = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    error.value = "Error al cargar objetos.";
  }
};

onMounted(fetchObjetos);

const handleAdd = async () => {
  mensaje.value = "";
  error.value = "";
  if (!nombre.value) {
    error.value = "El nombre no puede estar vacío.";
    return;
  }
  try {
    await addDoc(collection(db, "products"), { nombre: nombre.value });
    nombre.value = "";
    mensaje.value = "Objeto agregado.";
    fetchObjetos();
  } catch (err) {
    error.value = "Error al agregar: " + err.message;
  }
};

const handleEdit = (obj) => {
  editId.value = obj.id;
  nombre.value = obj.nombre;
  mensaje.value = "";
  error.value = "";
};

const handleUpdate = async () => {
  mensaje.value = "";
  error.value = "";
  if (!nombre.value) {
    error.value = "El nombre no puede estar vacío.";
    return;
  }
  try {
    await updateDoc(doc(db, "products", editId.value), { nombre: nombre.value });
    editId.value = null;
    nombre.value = "";
    mensaje.value = "Objeto actualizado.";
    fetchObjetos();
  } catch (err) {
    error.value = "Error al actualizar: " + err.message;
  }
};

const handleDelete = async (id) => {
  if (!confirm("¿Seguro que deseas borrar este objeto?")) return;
  mensaje.value = "";
  error.value = "";
  try {
    await deleteDoc(doc(db, "products", id));
    mensaje.value = "Objeto borrado.";
    fetchObjetos();
  } catch (err) {
    error.value = "Error al borrar: " + err.message;
  }
};

const handleCancel = () => {
  editId.value = null;
  nombre.value = "";
  mensaje.value = "";
  error.value = "";
};
</script>