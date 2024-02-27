<script setup>
import {useRoute} from 'vue-router'
import {onMounted, ref} from 'vue';
import moment from "moment";
import router from "@/router";
import CardFilm from "@/components/CardMovie.vue";
import {ModalsContainer, useModal} from "vue-final-modal";
import ModalComponent from "@/components/utils/ModalComponent.vue";
import { Notification } from "@arco-design/web-vue";

let dataActor = ref('');
let nationalites = ref('');
let editedActorFirstname = ref('');
let editedActorLastName = ref('');
let editedActorNationalite = ref('');
let editedActorBirthday = ref('');
let editedActorReward = ref('');
let fileInput = ref('');
let admin = false;
const rewards = [
  'Oscar',
  'César',
  `Palme d'or`,
  `Prix d'interprétation masculine`,
  `Prix d'interprétation féminine`,
  'Golden Globes',
  'Grammy Awards'
];

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

const today = new Date().toISOString().split('T')[0];

function convertDate(date, format = 'DD/MM/YYYY') {
  return moment(date).format(format);
}

function ageActor(date) {
  return moment().diff(date, 'years');
}

const {open, close} = useModal({
  component: ModalComponent,
  attrs: {
    title: 'Suppression de l\'acteur',
    onConfirm() {
      confirmDeleteActor();
    },
    onClose() {
      close();
    },
  },
  slots: {
    default: '<p>L\'acteur sera supprimé définitivement</p>',
  },
})

onMounted(async () => {
  await getNationalites();
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

async function getNationalites() {
  try {
    const response = await fetch(API_URL + '/api/nationalities', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    nationalites = data['hydra:member'];
  } catch (error) {
    console.error('Erreur lors de la récupération des nationalités :', error);
  }
}

function toggleDetails() {
  update.value = !update.value;
  editedActorFirstname.value = dataActor.value.firstName
  editedActorLastName.value = dataActor.value.lastName;
  editedActorNationalite.value = dataActor.value.nationality.id;
  editedActorBirthday.value = convertDate(dataActor.value.birthday, 'YYYY-MM-DD');
  editedActorReward.value = dataActor.value.reward;
}

async function editActor() {
  let media = await createMedia();
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return router.push('/');
    }
    const updatedActor = {
      "firstName": `${editedActorFirstname.value}`,
      "lastName": `${editedActorLastName.value}`,
      "nationalite": `/api/nationalities/${editedActorNationalite.value}`,
      "birthday": `${editedActorBirthday.value}`,
      "reward": `${editedActorReward.value}`,
    };

    if (media !== null) {
      updatedActor.mediaObjects = [`/api/media_objects/${media.id}`];
    }

    await fetch(API_URL + `/api/actors/${actorId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify(updatedActor),
    });

    update.value = false;
    Notification.success('L\'acteur a bien été modifié');
    await getActor(actorId);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'acteur :', error);
    Notification.error('Une erreur s\'est produite lors de la modification de l\'acteur');
  }
}

async function confirmDeleteActor() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return router.push('/');
    }
    await fetch(API_URL + `/api/actors/${actorId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    close();
    return router.push('/actors');
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
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
        <button class="btn btn-primary m-2" @click="toggleDetails(dataActor)" :disabled="!dataActor"><i
            class="bi bi-pencil"></i> Modifier
        </button>
        <button class="btn btn-primary m-2" @click="open()" :disabled="!dataActor"><i class="bi bi-trash"></i> Supprimer
        </button>
      </div>
      <div :class="['col-12 col-md-3', { 'd-none': !update }]">
        <h2 v-if="dataActor">{{ dataActor.firstName }} {{ dataActor.lastName }}</h2>
        <form @submit.prevent="editActor">
          <div class="form-group pb-2">
            <label for="editedActorFirstname">Nom <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editedActorFirstname"
                v-model="editedActorFirstname"
                required
            />
            <label for="editedActorLastName">Prenom <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editedActorLastName"
                v-model="editedActorLastName"
                required
            />
            <label for="editedActorNationalite">Nationalité <span class="required">*</span></label>
            <select name="editedActorNationalite" id="editedActorNationalite" class="form-select"
                    v-model="editedActorNationalite" required>
              <option v-for="nationalite in nationalites" :value="nationalite.id"
                      :selected="nationalite.id === editedActorNationalite">{{ nationalite.country }}
              </option>
            </select>
            <label for="editedActorBirthday">Date de naissance <span class="required">*</span></label>
            <input
                type="date"
                class="form-control"
                id="editedActorBirthday"
                v-model="editedActorBirthday"
                required
                :max="today"
            >
            <label for="editedActorReward">Prix remporté <span class="required">*</span></label>
            <select name="editedActorReward" id="editedActorReward" class="form-select" v-model="editedActorReward" required>
              <option v-for="reward in rewards" :value="reward" :selected="reward === editedActorReward">{{
                  reward
                }}
              </option>
            </select>
            <label for="file">Photo</label>
            <input type="file" class="form-control" id="file" name="file" @change="uploadFile">
          </div>
          <div class="d-flex justify-content-between">
            <button @click="update = false" type="button" class="btn btn-secondary"><i class="bi bi-x"></i> Annuler
            </button>
            <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Enregister</button>
          </div>
        </form>
      </div>

      <div :class="['col-12 col-md-8', { 'dataMovie col-12': !update }]" v-if="dataActor">
        <h1>Nom : {{ dataActor.firstName }} {{ dataActor.lastName }}</h1>
        <p>Pays de naissance : {{ dataActor.nationality.country }}</p>
        <p>Date de naissance : {{ convertDate(dataActor.birthday) }}</p>
        <p>Age : {{ ageActor(dataActor.birthday) }} ans</p>
        <p>Reward : {{ dataActor.reward }}</p>
        <div v-if="dataActor.mediaObjects" class="flex col-12">
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
    <ModalsContainer></ModalsContainer>
  </div>
</template>

<style scoped>

</style>