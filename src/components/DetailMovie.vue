<script setup>
import {useRoute} from 'vue-router'
import {onMounted, ref} from 'vue';
import moment from "moment";
import router from "@/router";
import CardActeur from "@/components/CardActor.vue";
import AverageComponent from "@/components/utils/AverageComponent.vue";

let dataMovie = ref('');
let update = ref(false);
let admin = false;
let categories = ref('');
let actors = ref('');
const route = useRoute();
const movieId = route.params.id;
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const API_URL = import.meta.env.VITE_SERVER_API_URL;
if (!token) {
  router.push('/login')
}
if (role === 'ROLE_ADMIN') {
  admin = true;
}

function convertDate(date, format = 'DD/MM/YYYY') {
  return moment(date).format(format);
}

function ageMovie(date) {
  return moment().diff(date, 'years');
}

onMounted(async () => {
  await getCategories();
  await getActors();
  await getMovie(movieId);
});

async function getMovie(id) {
  try {
    const response = await fetch(API_URL + '/api/movies/' + id, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      dataMovie.value = data;
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function getCategories() {
  try {
    const response = await fetch(API_URL + '/api/categories?pagination=false', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function getActors() {
  try {
    const response = await fetch(API_URL + '/api/actors?pagination=false', {
      headers: {
        Authorization: `Bearer ${token}`,
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

function formatValue(value, type = null) {
  let options;

  switch (type) {
    case 'budget':
      options = {style: 'currency', currency: 'EUR'};
      break;
    case 'duration':
      options = {style: 'unit', unit: 'minute'};
      break;
    default:
      options = {};
  }

  return new Intl.NumberFormat('fr-FR', options).format(value);
}

</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 d-flex justify-content-end" v-if="admin">
        <button class="btn btn-primary m-2" @click="" :disabled="!dataMovie"><i
            class="bi bi-pencil"></i> Modifier
        </button>
        <button class="btn btn-primary m-2"><i class="bi bi-trash"></i> Supprimer
        </button>
      </div>
      <div :class="['col-8', { 'dataMovie col-12': !update }]" v-if="dataMovie">

        <div class="row">
          <h1 class="col-8">Nom du film : {{ dataMovie.title }}</h1>
          <div class="col-4" style="display: flex; align-items: center; justify-content: end; font-size: 2rem">
            <AverageComponent :average="dataMovie.averageRating"></AverageComponent>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <i>Description : {{ dataMovie.description }}</i>
            <p>
              Date de sortie : {{ convertDate(dataMovie.releaseDate) }} ({{ ageMovie(dataMovie.releaseDate) }} ans)<br>
              Durée : {{ formatValue(dataMovie.duration, 'duration') }}.<br>
              Genre : {{ dataMovie.category.name }}<br>
              Réalisateur : {{ dataMovie.director }}<br>
              {{ formatValue(dataMovie.entries) }} entrées<br>
              Budget : {{ formatValue(dataMovie.budget, 'budget') }}<br>
            </p>
            <a :href="dataMovie.website" target="_blank" class="btn btn-primary">Site du film</a>
          </div>
          <div class="col-6">
            <img v-for="media in dataMovie.mediaObjects" :src="media.contentUrl" alt="image du film"
                 style="height: 500px">
          </div>
        </div>
        <div>Acteurs :
          <div v-if="dataMovie.actor" :class="['flex', { 'col-12': update }, { 'col-8': !update }]">
            <CardActeur v-for="actor in dataMovie.actor" :actor="actor"></CardActeur>
          </div>
        </div>

      </div>
      <div v-else :class="['d-flex justify-content-center mt-4 col-8', { 'col-12': !update }]">
        <div class="spinner-border" role="status">
          <span class="sr-only"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>