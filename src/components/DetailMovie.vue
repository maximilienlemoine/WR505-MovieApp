<script setup>
import {useRoute} from 'vue-router'
import {onMounted, ref} from 'vue';
import moment from "moment";
import router from "@/router";
import CardActeur from "@/components/CardActor.vue";
import AverageComponent from "@/components/utils/AverageComponent.vue";
import {Notification} from "@arco-design/web-vue";

let dataMovie = ref('');
let editedMovieTitle = ref('');
let editMovieDescription = ref('');
let editMovieReleaseDate = ref('');
let editMovieDuration = ref('');
let editMovieCategory = ref('');
let editMovieDirector = ref('');
let editMovieEntries = ref('');
let editMovieBudget = ref('');
let editMovieWebsite = ref('');
let editMovieRating = ref('');
let editMovieActors = ref([]);
let fileInput = ref('');
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

const today = new Date().toISOString().split('T')[0];

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

function toggleDetails() {
  update.value = !update.value;
  editedMovieTitle.value = dataMovie.value.title;
  editMovieDescription.value = dataMovie.value.description;
  editMovieReleaseDate.value = convertDate(dataMovie.value.releaseDate, 'YYYY-MM-DD');
  editMovieDuration.value = dataMovie.value.duration;
  editMovieCategory.value = dataMovie.value.category.id;
  editMovieDirector.value = dataMovie.value.director;
  editMovieEntries.value = dataMovie.value.entries;
  editMovieBudget.value = dataMovie.value.budget;
  editMovieWebsite.value = dataMovie.value.website;
  editMovieRating.value = dataMovie.value.averageRating;
  editMovieActors.value = dataMovie.value.actor.map(actor => actor.id);
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

async function updateMovieTitle() {
  let media = await createMedia();
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return router.push('/');
    }
    const updatedMovie = {
      "title": `${editedMovieTitle.value}`,
      "description": `${editMovieDescription.value}`,
      "releaseDate": `${editMovieReleaseDate.value}`,
      "duration": parseInt(editMovieDuration.value),
      "director": `${editMovieDirector.value}`,
      "entries": parseInt(editMovieEntries.value),
      "budget": parseInt(editMovieBudget.value),
      "website": `${editMovieWebsite.value}`,
      "averageRating": parseInt(editMovieRating.value),
      "category": `/api/categories/${editMovieCategory.value}`,
      "actor": editMovieActors.value.map(actor => `/api/actors/${actor}`),
    };

    if (media !== null) {
      updatedMovie.mediaObjects = [`/api/media_objects/${media.id}`];
    }

    await fetch(API_URL + `/api/movies/${movieId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify(updatedMovie),
    });

    update.value = false;
    Notification.success('Le film a été mis à jour avec succès');
    await getMovie(movieId);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du titre du film :', error);
    Notification.error('Une erreur s\'est produite lors de la mise à jour du film');
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

async function createMedia() {
  if (!fileInput.value) {
    return null;
  }

  const formData = new FormData();
  formData.append('file', fileInput.value);
  try {
    const response = await fetch(API_URL + '/api/media_objects', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: formData
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      return data;
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'acteur :', error);
  }
}

const uploadFile = (event) => {
  fileInput.value = event.target.files[0];
};

</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 d-flex justify-content-end" v-if="admin">
        <button class="btn btn-primary m-2" @click="toggleDetails(dataMovie)" :disabled="!dataMovie"><i
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
      <div :class="['col-3', { 'd-none': !update }]">
        <h2 v-if="dataMovie">{{ dataMovie.title }}</h2>
        <form @submit.prevent="updateMovieTitle">
          <div class="form-group">
            <label for="editMovieTitle">Titre du film <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editMovieTitle"
                v-model="editedMovieTitle"
                required
            />
            <label for="editMovieDescription">Description <span class="required">*</span></label>
            <textarea
                class="form-control"
                id="editMovieDescription"
                v-model="editMovieDescription"
                required
            />
            <label for="editMovieRating">Notation <span class="required">*</span></label>
            <input
                type="number"
                min="0"
                max="10"
                class="form-control"
                id="editMovieRating"
                v-model="editMovieRating"
                required
            >
            <label for="editMovieReleaseDate">Date de sortie <span class="required">*</span></label>
            <input
                type="date"
                class="form-control"
                id="editMovieReleaseDate"
                v-model="editMovieReleaseDate"
                required
                :max="today"
            >
            <label for="editMovieDuration">Durée <span class="required">*</span></label>
            <input
                type="number"
                min="0"
                class="form-control"
                id="editMovieDuration"
                v-model="editMovieDuration"
                required
            >
            <label for="editMovieCategory">Catégorie <span class="required">*</span></label>
            <select name="movieCategory" id="movieCategory" required v-model="editMovieCategory" class="form-select">
              <option v-for="category in categories" :key="category.id" :value="category.id"
                      :selected="category.id === editMovieCategory">{{
                  category.name
                }}
              </option>
            </select>

            <label for="editMovieActors">Acteurs <span class="required">*</span></label>
            <a-select v-model="editMovieActors" multiple :placeholder="'Sélectionnez les acteurs'">
              <a-option v-for="actor in actors" :key="actor.id" :value="actor.id"
                        :selected="editMovieActors.includes(actor.id)">{{ actor.firstName }} {{ actor.lastName }}
              </a-option>
            </a-select>

            <label for="editMovieDirector">Réalisateur <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editMovieDirector"
                v-model="editMovieDirector"
                required
            >
            <label for="editMovieEntries">Entrées</label>
            <input
                type="number"
                min="0"
                class="form-control"
                id="editMovieEntries"
                v-model="editMovieEntries"
                required
            >
            <label for="editMovieBudget">Budget</label>
            <input
                type="number"
                min="0"
                class="form-control"
                id="editMovieBudget"
                v-model="editMovieBudget"
                required
            >
            <label for="editMovieWebsite">Site du film</label>
            <input
                type="url"
                class="form-control"
                id="editMovieWebsite"
                v-model="editMovieWebsite"
            >
            <label for="file">Affiche</label>
            <input type="file" class="form-control" id="file" name="file" @change="uploadFile">
          </div>
          <div class="d-flex justify-content-between">
            <button @click="update = false" type="button" class="btn btn-secondary"><i class="bi bi-x"></i> Annuler
            </button>
            <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Enregister</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>