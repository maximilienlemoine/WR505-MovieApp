<script setup>
import {onMounted, ref} from 'vue'
import router from "@/router";
import CardActeur from "@/components/CardActor.vue";

let actors = ref('')
let search = ref('')
let pageNext = ref('')
let pagePrevious = ref('')
let admin = false;
const token = localStorage.getItem('token')
const API_URL = import.meta.env.VITE_SERVER_API_URL;
const role = localStorage.getItem('role');
if (role === 'ROLE_ADMIN') {
  admin = true;
}
if (!token) {
  router.push('/login')
}

onMounted(async () => {
  await getActors();
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
      actors.value = data['hydra:member'];
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
      actors.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function searchActor() {
  try {
    const response = await fetch(API_URL + `/api/actors?page=1&lastName=${search.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      actors.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

function addActor() {
  router.push('/actor/create')
}

</script>

<template>
  <h1>Acteurs</h1>
  <div class="row">
    <div class="col-5">
      <input class="form-control" type="text" v-model="search">
    </div>
    <div class="col-2">
      <button class="btn btn-primary" @click="searchActor()"><i class="bi bi-search"></i> Rechercher</button>
    </div>
    <div class="col-5 d-flex justify-content-end" v-if="admin">
      <button class="btn btn-primary" @click="addActor()"><i class="bi bi-plus-circle"></i> Ajouter un acteur</button>
    </div>
  </div>
  <template v-if="actors">
    <div class="flex">
      <template v-for="actor in actors" :key="actor.id">
        <CardActeur :actor="actor"></CardActeur>
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