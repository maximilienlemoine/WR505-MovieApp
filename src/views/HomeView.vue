<script setup>
import {onMounted, ref} from 'vue'
import CardActeur from "@/components/CardActor.vue";
import CardFilm from "@/components/CardMovie.vue";
import router from "@/router";

let movies = ref('')
let actors = ref('')
const token = localStorage.getItem('token')
const API_URL = import.meta.env.VITE_SERVER_API_URL;
if (!token) {
  router.push('/login')
}

onMounted(async () => {
  await getActors();
  await getMovies();
});

async function getActors() {
  try {
    const response = await fetch(API_URL + '/api/actors', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      actors.value = data['hydra:member'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function getMovies() {
  try {
    const response = await fetch(API_URL + '/api/movies', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      movies.value = data['hydra:member'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}
</script>

<template>
  <main>
    <h2>Films</h2>
    <div v-if="movies" class="flex">
      <template v-for="movie in movies.slice(0,4)">
        <CardFilm :movie="movie"></CardFilm>
      </template>
    </div>
    <div v-else class="d-flex justify-content-center mt-4">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
    </div>

    <h2>Acteurs</h2>
    <div v-if="actors" class="flex">
      <template v-for="act in actors.slice(0,4)">
        <CardActeur :actor="act"></CardActeur>
      </template>
    </div>
    <div v-else class="d-flex justify-content-center mt-4">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
