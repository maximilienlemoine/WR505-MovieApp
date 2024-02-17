<script setup>
import {onMounted, ref} from 'vue'
import router from "@/router";

let categories = ref('');
let search = ref('');
let pageNext = ref('');
let pagePrevious = ref('');
let admin = false;
let form = ref(false);
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const API_URL = import.meta.env.VITE_SERVER_API_URL;
if (!token) {
  router.push('/login')
}
if (role === 'ROLE_ADMIN') {
  admin = true;
}

onMounted(async () => {
  await getCategories();
});

async function getCategories() {
  try {
    const response = await fetch(API_URL + '/api/categories', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function nextPage() {
  try {
    const response = await fetch(`http://127.0.0.1:8000${pageNext.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function previousPage() {
  try {
    const response = await fetch(`http://127.0.0.1:8000${pagePrevious.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login');
    } else {
      categories.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

async function searchCategory() {
  try {
    const response = await fetch(API_URL + `/api/categories?page=1&name=${search.value}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    if (data.code === 401) {
      return router.push('/login')
    } else {
      categories.value = data['hydra:member'];
      pageNext.value = data['hydra:view']['hydra:next'];
      pagePrevious.value = data['hydra:view']['hydra:previous'];
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données.', error);
  }
}

</script>

<template>
  <h1>Catégories</h1>
  <div class="row">
    <div class="col-5">
      <input class="form-control" type="text" v-model="search">
    </div>
    <div class="col-7 d-flex justify-content-between">
      <button class="btn btn-primary" @click="searchCategory()"><i class="bi bi-search"></i> Rechercher</button>
      <button class="btn btn-primary" @click="addCategory()" v-if="admin"><i class="bi bi-plus"></i> Ajouter</button>
    </div>

  </div>
  <div class="row">
    <template v-if="categories">
      <div :class="['col-8 flex', { 'col-12 flex': !form }]">
        <template v-for="category in categories" :key="category.id">
          <div class="card">
            {{ category.name }} <br>
            {{ category.movies.length }} films
            <div class="card-action" v-if="admin">
              <button class="btn btn-primary" @click="editCategory(category)"><i class="bi bi-pencil"></i> Modifier
              </button>
              <button v-if="!category.movies.length" class="btn btn-primary"
                      @click="deleteCategory(category.id); open()"><i class="bi bi-trash"></i> Supprimer
              </button>
              <button v-else class="btn btn-primary" disabled title="Impossible la categorie est utilisée"><i
                  class="bi bi-trash"></i> Supprimer
              </button>
            </div>
          </div>
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
  </div>
</template>