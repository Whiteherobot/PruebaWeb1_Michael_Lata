<script setup>
import { ref } from "vue";
import Login from "./components/Login.vue";
import CrudObjetos from "./components/CrudObjetos.vue";

const logged = ref(false);
</script>

<template>
  <div>
    <div class="app-container">
      <main>
        <crud-objetos />
      </main>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
