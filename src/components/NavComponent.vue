<script setup>
import {RouterLink} from 'vue-router'
import router from "@/router";
import {watch} from "vue";

let token = localStorage.getItem('token')
let picture = localStorage.getItem('picture')
let username = localStorage.getItem('username')
let initials = '';

watch(() => localStorage.getItem('username'), (newUsername) => {
  username = newUsername
  getInitials()
})

watch(() => localStorage.getItem('picture'), (newPicture) => {
  picture = newPicture

  if (!picture) {
    getInitials()
  }
})

function logout() {
  localStorage.clear()
  router.push('/login')
  token = null;
  location.reload()
}

if (!picture) {
  getInitials()
}

function getInitials() {
  if (!username) {
    return
  }
  const words = username.split(' ');
  if (words.length > 1) {
    initials = words.map(word => word.slice(0, 1)).join('');
  } else {
    initials = words[0].slice(0, 2);
  }
}

</script>

<template>
  <header>
    <nav>
      <template v-if="token !=null">
        <div>
          <RouterLink to="/">Accueil</RouterLink>
          <RouterLink to="/movies">Films</RouterLink>
          <RouterLink to="/actors">Acteurs</RouterLink>
          <RouterLink to="/categories">Catégories</RouterLink>
        </div>
        <div class="user-dropdown">
          <div class="d-flex align-items-center">
            <img v-if="picture" :src="picture" alt="profile picture" width="50" height="50">
            <template v-else>
              <div class="initialsPicture">{{ initials }}</div>
            </template>
            <span class="username"> {{ username }} <i class="bi bi-caret-down-fill fs-6"></i> </span>
          </div>
          <div class="dropdown">
            <RouterLink to="/profile"><i class="bi bi-person"></i> Profil</RouterLink>
            <a @click="logout()"><i class="bi bi-person-x"></i> Deconnexion</a>
          </div>
        </div>
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
  font-size: 1.2rem;
  text-decoration: none;
  color: var(--color-text);
  cursor: pointer;
  transition: color 0.3s;
}

.username {
  font-weight: bold;
}

.username {
  font-size: 1rem;
}

@media (min-width: 768px) {
  nav {
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

  .username {
    font-size: 0.8rem;
  }
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

.dropdown {
  display: none;
  position: absolute;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown a {
  display: block;
  margin: 5px 0;
  text-decoration: none;
}

.user-dropdown:hover .dropdown {
  display: block;
}

.initialsPicture {
  background-color: rgba(252, 203, 120, 0.56);
  color: white;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  padding: 5px;
  font-size: 1.5rem;
  margin: 5px 10px 5px 5px;
}
</style>