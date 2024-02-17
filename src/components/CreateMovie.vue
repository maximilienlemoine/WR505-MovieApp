<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter();
let movieTitle = ref('');
let movieDescription = ref('');
let movieReleaseDate = ref('');
let movieDuration = ref(0);
let movieCategory = ref('');
let movieActors = ref([]);
let movieDirector = ref('');
let movieEntries = ref(1);
let movieBudget = ref(1);
let movieWebsite = ref('');
let movieRating = ref(0);
let categories = ref([]);
let actors = ref([]);
let charging = ref(false);
let fileInput = ref('');

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const token = localStorage.getItem('token');
if (!token) {
  router.push('/login')
}
const role = localStorage.getItem('role');
if (role !== 'ROLE_ADMIN') {
  router.push('/')
}

const today = new Date().toISOString().split('T')[0];

onMounted(async () => {
  await getCategories();
  await getActors();
  charging.value = true;
});

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
    console.error('Erreur lors de la création du média du film :', error);
  }
}

async function createMovie() {
  const media = await createMedia();

  const body = {
    'title': `${movieTitle.value}`,
    'description': `${movieDescription.value}`,
    'releaseDate': `${movieReleaseDate.value}`,
    'duration': movieDuration.value,
    'category': `/api/categories/${movieCategory.value}`,
    'director': `${movieDirector.value}`,
    'entries': movieEntries.value,
    'budget': movieBudget.value,
    'website': `${movieWebsite.value}`,
    'rating': movieRating.value,
    'actor': movieActors.value.map(actor => `/api/actors/${actor}`),
  }

  if (media !== null) {
    body.mediaObjects = [`/api/media_objects/${media.id}`];
  }

  try {
    const response = await fetch(API_URL + '/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      await router.push('/movies')
    }
  } catch (error) {
    console.error('Erreur lors de la création du film :', error);
  }
}

const uploadFile = (event) => {
  fileInput.value = event.target.files[0];
};
</script>

<template>
  <div class="container">
    <h1 class="my-5">Ajouter un film</h1>
    <form @submit.prevent="createMovie" v-if="charging">
      <div class="form-group">
        <label for="movieTitle" class="form-label">Titre <span class="required">*</span></label>
        <input type="text" class="form-control" id="movieTitle" v-model="movieTitle" required>
      </div>
      <div class="form-group">
        <label for="movieDescription" class="form-label">Description <span class="required">*</span></label>
        <textarea class="form-control" id="movieDescription" v-model="movieDescription" required></textarea>
      </div>
      <div class="form-group">
        <label for="movieReleaseDate" class="form-label">Date de sortie <span class="required">*</span></label>
        <input type="date" class="form-control" id="movieReleaseDate" v-model="movieReleaseDate" required :max="today">
      </div>
      <div class="form-group">
        <label for="movieDuration" class="form-label">Durée</label>
        <input type="number" min="0" class="form-control" id="movieDuration" v-model="movieDuration">
      </div>
      <div class="form-group">
        <label for="movieCategory" class="form-label">Catégorie <span class="required">*</span></label>
        <select class="form-select" id="movieCategory" v-model="movieCategory" required>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="movieActors" class="form-label">Acteurs <span class="required">*</span></label>
        <a-select v-model="movieActors" multiple :placeholder="'Sélectionnez les acteurs'">
          <a-option v-for="actor in actors" :key="actor.id" :value="actor.id">{{ actor.firstName }} {{
              actor.lastName
            }}
          </a-option>
        </a-select>
      </div>
      <div class="form-group">
        <label for="movieDirector" class="form-label">Réalisateur <span class="required">*</span></label>
        <input type="text" class="form-control" id="movieDirector" v-model="movieDirector" required>
      </div>
      <div class="form-group">
        <label for="movieEntries" class="form-label">Entrées</label>
        <input type="number" min="1" class="form-control" id="movieEntries" v-model="movieEntries">
      </div>
      <div class="form-group">
        <label for="movieBudget" class="form-label">Budget</label>
        <input type="number" min="1" class="form-control" id="movieBudget" v-model="movieBudget">
      </div>
      <div class="form-group">
        <label for="movieWebsite" class="form-label">Site web</label>
        <input type="url" class="form-control" id="movieWebsite" v-model="movieWebsite">
      </div>
      <div class="form-group">
        <label for="movieRating" class="form-label">Note</label>
        <input type="number" min="0" max="10" class="form-control" id="movieRating" v-model="movieRating">
      </div>
      <div class="form-group">
        <label for="file" class="form-label">Affiche</label>
        <input type="file" class="form-control" id="file" @change="uploadFile">
      </div>
      <div class="col-12 d-flex justify-content-between">
        <button class="btn btn-secondary" @click="router.push('/movies')"><i class="bi bi-arrow-left-circle"></i> Retour
        </button>
        <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Enregistrer</button>
      </div>
      <div>
        <p><span class="required">*</span> Champs obligatoires</p>
      </div>
    </form>
    <div v-else class="d-flex justify-content-center mt-4">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>