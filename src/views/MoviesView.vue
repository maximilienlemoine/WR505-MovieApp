<script setup>
import {onMounted, ref} from 'vue'
import CardFilm from "@/components/CardMovie.vue";
import router from "@/router";

let movies = ref('')
let search = ref('')
let rating = ref('')
let pageNext = ref('')
let pagePrevious = ref('')
const token = localStorage.getItem('token')
const API_URL = import.meta.env.VITE_SERVER_API_URL;
if (!token) {
  router.push('/login')
}

onMounted(async () => {
  await getMovies();
});

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
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function nextPage() {
  try {
    const response = await fetch(API_URL + `${pageNext.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function previousPage() {
  try {
    const response = await fetch(API_URL + `${pagePrevious.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login');
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function searchMovie() {
  try {
    const response = await fetch(API_URL + `/api/movies?page=1&title=${search.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function searchByRating() {
  try {
    const response = await fetch(API_URL + '/api/movies?page=1&averageRating=' + rating.value, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      movies.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

function addMovie() {
  router.push('/movie/create')
}
</script>

<template>
  <h1>Films</h1>
  <div class="row">
    <div class="col-12 col-md-5">
      <input class="form-control" type="text" v-model="search">
    </div>
    <div class="col-12 col-md-2">
      <button class="btn btn-primary" @click="searchMovie()"><i class="bi bi-search"></i> Rechercher</button>
    </div>
    <div class="col-12 col-md-3 d-flex align-items-center">
      <label for="ratingFilter" style="margin-right: 20px">Filtrer par note <i
          class="bi bi-star-fill stars gold"></i></label>
      <select name="ratingFilter" id="ratingFilter" class="form-select w-50" @change="searchByRating()"
              v-model="rating">
        <option value="">Toutes</option>
        <option v-for="i in 10" :value="i">{{ i }}</option>
      </select>
    </div>
    <div class="col-12 col-md-2">
      <button class="btn btn-primary" @click="addMovie()"><i class="bi bi-plus-circle"></i> Ajouter un film</button>
    </div>
  </div>
  <template v-if="movies">
    <div class="flex">
      <template v-for="movie in movies" :key="movie.id">
        <CardFilm :movie="movie"></CardFilm>
      </template>
    </div>
    <div class="d-flex justify-content-between">
      <button v-if="pagePrevious" class="btn btn-secondary" @click="previousPage()"><i
          class="bi bi-arrow-left-circle"></i> Précedent
      </button>
      <button v-else class="btn btn-secondary" disabled><i class="bi bi-arrow-left-circle"></i> Précedent</button>
      <button v-if="pageNext" class="btn btn-secondary" @click="nextPage()">Suivant <i
          class="bi bi-arrow-right-circle"></i></button>
      <button v-else class="btn btn-secondary" disabled>Suivant <i class="bi bi-arrow-right-circle"></i></button>
    </div>
  </template>
  <div v-else class="d-flex justify-content-center mt-4">
    <div class="spinner-border" role="status">
      <span class="sr-only"></span>
    </div>
  </div>
</template>

<style scoped>
</style>