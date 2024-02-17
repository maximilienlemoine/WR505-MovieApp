<script setup>
import {useRoute} from 'vue-router'
import {onMounted, ref} from 'vue';
import moment from "moment";
import router from "@/router";
import CardFilm from "@/components/CardMovie.vue";

let dataActor = ref('');
let admin = false;

const route = useRoute();
const actorId = route.params.id;
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const API_URL = import.meta.env.VITE_SERVER_API_URL;
if (!token) {
  router.push('/login')
}
let update = ref(false);
if (role === 'ROLE_ADMIN') {
  admin = true;
}

function convertDate(date, format = 'DD/MM/YYYY') {
  return moment(date).format(format);
}

function ageActor(date) {
  return moment().diff(date, 'years');
}

onMounted(async () => {
  await getActor(actorId);
});

async function getActor(id) {
  try {
    const response = await fetch(API_URL + '/api/actors/' + id, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      dataActor.value = data;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 d-flex justify-content-end" v-if="admin">
        <button class="btn btn-primary m-2" :disabled="!dataActor"><i
            class="bi bi-pencil"></i> Modifier
        </button>
        <button class="btn btn-primary m-2"><i class="bi bi-trash"></i> Supprimer
        </button>
      </div>
      <div :class="['col-8', { 'dataMovie col-12': !update }]" v-if="dataActor">
        <h1>Nom : {{ dataActor.firstName }} {{ dataActor.lastName }}</h1>
        <p>Pays de naissance : {{ dataActor.nationalite.pays }}</p>
        <p>Date de naissance : {{ convertDate(dataActor.birthday) }}</p>
        <p>Age : {{ ageActor(dataActor.birthday) }} ans</p>
        <p>Reward : {{ dataActor.reward }}</p>
        <div v-if="dataActor.mediaObjects" :class="['flex', { 'col-12': update }, { 'col-8': !update }]">
          <img v-for="media in dataActor.mediaObjects" :src="media.contentUrl" alt="Photo de l'acteur"
               style="height: 300px;">
        </div>
        <div>Films ({{ dataActor.movies.length }}) :
          <div v-if="dataActor.movies" :class="['flex', { 'col-12': update }, { 'col-8': !update }]">
            <CardFilm v-for="movie in dataActor.movies" :movie="movie"></CardFilm>
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