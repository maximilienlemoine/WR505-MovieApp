<script setup>
import {onMounted, ref} from 'vue'
import router from "@/router";
import { Notification } from "@arco-design/web-vue";

let user = ref('');
let updateUserState = ref(false);
let editEmail = ref('');
let editFirstName = ref('');
let editLastName = ref('');
let editUsername = ref('');
let password = ref('');
let confirmPassword = ref('');
let fileInput = ref('');
const token = localStorage.getItem('token')
const API_URL = import.meta.env.VITE_SERVER_API_URL;
if (!token) {
  router.push('/login')
}

onMounted(async () => {
  await getUser();
});

async function getUser() {
  try {
    const response = await fetch(API_URL + '/api/me', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      user.value = data;
    }
  } catch (error) {
    Notification.error('Erreur lors de la récupération des données');
  }
}

function update() {
  updateUserState.value = !updateUserState.value;
  editEmail.value = user.value.email;
  editFirstName.value = user.value.firstname;
  editLastName.value = user.value.lastname;
  editUsername.value = user.value.username;
}

async function updateUser() {
  const media = await createMedia();

  if (password && password.value !== confirmPassword.value) {
    Notification.error('Les mots de passe ne correspondent pas');
    return;
  }

  try {
    const token = localStorage.getItem('token'); // Récupérer le token d'authentification
    if (!token) {
      return router.push('/');
    }
    const updatedUser = {
      "email": `${editEmail.value}`,
      "firstname": `${editFirstName.value}`,
      "lastname": `${editLastName.value}`,
      "username": `${editUsername.value}`,
    }

    if (media) {
      updatedUser.mediaObject = media.id;
    }

    if (password.value) {
      updatedUser.password = password.value;
      updatedUser.confirmPassword = confirmPassword.value;
    }

    const response = await fetch(API_URL + '/api/me/update', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json',
      },
      body: JSON.stringify(updatedUser),
    });

    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      user.value = data;
      localStorage.setItem('username', data.username);
      localStorage.setItem('picture', data.mediaObjects);
      updateUserState.value = false;

      location.reload()
    }
  } catch (error) {
    Notification.error('Erreur lors de la mise à jour des données');
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
<div class="container-fluid">
    <h1>Profil</h1>
    <div class="row">
      <div class="col-12 d-flex justify-content-end">
        <button class="btn btn-primary m-2" @click="update()" :disabled="!user"><i class="bi bi-pencil"></i> Modifier</button>
      </div>
      <div :class="['col-8', { 'col-12': !updateUserState }]">
        <template v-if="user">
          <div>
            <p>Email : {{ user.email }}</p>
            <p>Nom : {{ user.lastname }}</p>
            <p>Prénom : {{ user.firstname }}</p>
            <p>Username : {{ user.username }}</p>
            <img v-if="user.mediaObjects" :src="user.mediaObjects" alt="profile picture">
          </div>
        </template>
        <div v-else class="d-flex justify-content-center mt-4">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
      </div>
      <div :class="['col-3', { 'd-none': !updateUserState }]">
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="editEmail">Adresse email <span class="required">*</span></label>
            <input
                type="email"
                class="form-control"
                id="editEmail"
                v-model="editEmail"
                required
            />
          </div>
          <div class="form-group">
            <label for="editFirstName">Prenom <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editFirstName"
                v-model="editFirstName"
                required
            />
          </div>
          <div class="form-group">
            <label for="editLastName">Nom <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editLastName"
                v-model="editLastName"
                required
            />
          </div>
          <div class="form-group">
            <label for="editUsername">Nom d'utilisateur <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editUsername"
                v-model="editUsername"
                required
            />
          </div>
          <div class="form-group">
            <label for="password">Mot de passe :</label>
            <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe :</label>
            <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="confirmPassword"
            />
          </div>
          <div class="form-group">
            <label for="file">Photo de profil :</label>
            <input type="file" class="form-control" id="file" @change="uploadFile"/>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Enregister</button>
            <button @click="updateUserState = false" type="button" class="btn btn-secondary"><i class="bi bi-x"></i> Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
