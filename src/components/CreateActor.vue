<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter();
let nationalities = ref('');
let actorFirstname = ref('');
let actorLastName = ref('');
let actorNationality = ref('');
let actorBirthday = ref('');
let actorReward = ref('');
let fileInput = ref('');
let charging = ref(false);

const rewards = [
  'Oscar',
  'César',
  `Palme d'or`,
  `Prix d'interprétation masculine`,
  `Prix d'interprétation féminine`,
  'Golden Globes',
  'Grammy Awards'
];

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const token = localStorage.getItem('token');
if (!token) {
  router.push('/login')
}
const role = localStorage.getItem('role');
if (role !== 'ROLE_ADMIN') {
  router.push('/')
}
onMounted(async () => {
  await getNationalites();
  charging.value = true;
});

const today = new Date().toISOString().split('T')[0];

async function getNationalites() {
  try {
    const response = await fetch(API_URL + '/api/nationalities', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    nationalities = data['hydra:member'];
  } catch (error) {
    console.error('Erreur lors de la récupération des nationalités :', error);
  }
}

async function createActor() {
  const media = await createMedia();
  const body = {
    'firstName': `${actorFirstname.value}`,
    'lastName': `${actorLastName.value}`,
    'nationality': `/api/nationalities/${actorNationality.value}`,
    'birthday': `${actorBirthday.value}`,
    'reward': `${actorReward.value}`,
  }

  if (media !== null) {
    body.mediaObjects = [`/api/media_objects/${media.id}`];
  }

  try {
    const response = await fetch(API_URL + '/api/actors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      await router.push('/actors')
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'acteur :', error);
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
    console.error('Erreur lors de la création du media de l\'acteur :', error);
  }
}

const uploadFile = (event) => {
  fileInput.value = event.target.files[0];
};

</script>

<template>
  <div>
    <h1>Ajouter un acteur</h1>
    <form @submit.prevent="createActor()" v-if="charging">
      <div class="form-group">
        <label for="firstname">Prénom <span class="required">*</span></label>
        <input type="text" class="form-control" id="firstname" v-model="actorFirstname" required>
      </div>
      <div class="form-group">
        <label for="lastname">Nom <span class="required">*</span></label>
        <input type="text" class="form-control" id="lastname" v-model="actorLastName" required>
      </div>
      <div class="form-group">
        <label for="nationality">Nationalité <span class="required">*</span></label>
        <select class="form-select" id="nationality" v-model="actorNationality" required>
          <option v-for="nationality in nationalities" :value="nationality.id">{{ nationality.country }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="birthday">Date de naissance <span class="required">*</span></label>
        <input type="date" class="form-control" id="birthday" v-model="actorBirthday" required :max="today">
      </div>
      <div class="form-group">
        <label for="reward">Récompense <span class="required">*</span></label>
        <select class="form-select" id="reward" v-model="actorReward" required>
          <option v-for="reward in rewards" :value="reward">{{ reward }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="file">Photo</label>
        <input type="file" class="form-control" id="file" name="file" @change="uploadFile">
      </div>
      <div class="col-12 d-flex justify-content-between">
        <button class="btn btn-secondary" @click="router.push('/actors')"><i class="bi bi-arrow-left-circle"></i> Retour
        </button>
        <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Ajouter</button>
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