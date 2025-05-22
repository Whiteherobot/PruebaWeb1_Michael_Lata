<script setup>
import { ref } from "vue";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const emit = defineEmits(["login"]);
const nombre = ref("");
const password = ref("");
const error = ref("");
const success = ref("");

const handleLogin = async () => {
  error.value = "";
  success.value = "";
  if (!nombre.value || !password.value) {
    error.value = "Completa todos los campos.";
    return;
  }
  const q = query(
    collection(db, "usuarios"),
    where("nombre", "==", nombre.value),
    where("password", "==", password.value)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    success.value = "¡Bienvenido!";
    setTimeout(() => emit("login"), 800);
  } else {
    error.value = "Usuario o contraseña incorrectos. ¿Deseas registrarte?";
  }
};

const handleRegister = async () => {
  error.value = "";
  success.value = "";
  if (!nombre.value || !password.value) {
    error.value = "Completa todos los campos.";
    return;
  }
  const q = query(
    collection(db, "usuarios"),
    where("nombre", "==", nombre.value)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    error.value = "El usuario ya existe.";
    return;
  }
  await addDoc(collection(db, "usuarios"), {
    nombre: nombre.value,
    password: password.value,
  });
  success.value = "Usuario registrado. Ahora puedes ingresar.";
};
</script>

<template>
  <form class="crud-container" @submit.prevent="handleLogin">
    <h2>Login</h2>
    <input v-model="nombre" placeholder="Nombre" autofocus /><br />
    <input v-model="password" type="password" placeholder="Contraseña" /><br />
    <button type="submit" style="margin-right:8px">Ingresar</button>
    <button type="button" @click="handleRegister">Registrar</button>
    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="success" style="color:green">{{ success }}</p>
  </form>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
