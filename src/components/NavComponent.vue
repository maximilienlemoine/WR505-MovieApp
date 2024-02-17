<script setup>
import {RouterLink} from 'vue-router'
import router from "@/router";

let token = localStorage.getItem('token')

function logout() {
  localStorage.clear()
  router.push('/login')
  token = null;
  location.reload()
}

</script>

<template>
  <header>
    <nav>
      <template v-if="token !=null">
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/movies">Films</RouterLink>
        <RouterLink to="/actors">Acteurs</RouterLink>
        <RouterLink to="/categories">Catégories</RouterLink>
          <RouterLink to="/profile"><i class="bi bi-person"></i> Profil</RouterLink>
          <a @click="logout()"><i class="bi bi-person-x"></i> Deconnexion</a>
      </template>
      <template v-else>
        <RouterLink to="/login">Login</RouterLink>
      </template>
    </nav>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 10px 20px;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 0.4rem;
}

nav a, .dropdown a {
  display: inline-block;
  padding: 0 1rem;
  font-size: 1rem;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text);
  cursor: pointer;
  transition: color 0.3s;
}

nav a:hover, .dropdown a:hover {
  color: rgba(255, 165, 0, 0.64);
}

nav a:first-of-type, .dropdown a {
  border: 0;
}

nav {
  display: flex;
  justify-content: end;
  align-items: center;
}

nav img {
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
}

span {
  margin-right: 10px;
  cursor: pointer;
}
</style>