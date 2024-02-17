<script setup>
import {onMounted, ref} from 'vue'
import router from "@/router";
import {ModalsContainer, useModal} from "vue-final-modal";
import ModalComponent from "@/components/utils/ModalComponent.vue";
import {Notification} from "@arco-design/web-vue";

let categories = ref('');
let nameCategory = ref('');
let search = ref('');
let pageNext = ref('');
let pagePrevious = ref('');
let categoryDeleteId = ref('');
let editedIdCategory = ref('');
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

const {open, close} = useModal({
  component: ModalComponent,
  attrs: {
    title: 'Suppression de la catégorie',
    onConfirm() {
      confirmDeleteCategory();
    },
    onClose() {
      close();
    },
  },
  slots: {
    default: '<p>La catégorie sera supprimé définitivement</p>',
  },
})

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

function editCategory(category) {
  if (form.type === 'add') {
    form.value = true;
  } else {
    form.value = !form.value;
  }
  form.type = 'edit';
  nameCategory.value = category.name;
  editedIdCategory.value = category.id;
}

function addCategory() {
  if (form.type === 'edit') {
    form.value = true;
  } else {
    form.value = !form.value;
  }
  form.type = 'add';
  nameCategory.value = '';
}

function deleteCategory(categoryId) {
  categoryDeleteId.value = categoryId;
}

async function submitForm() {
  if (form.type === 'edit') {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return router.push('/');
      }
      const updatedCategory = {
        "name": `${nameCategory.value}`,
      };
      await fetch(API_URL + `/api/categories/${editedIdCategory.value}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify(updatedCategory),
      });

      form.value = false;
      Notification.success('La catégorie a été modifié avec succès');
      await getCategories();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la categorie :', error);
      Notification.error('Erreur lors de la mise à jour de la catégorie');
    }
  } else {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return router.push('/');
      }
      const newCategory = {
        "name": `${nameCategory.value}`,
      };
      await fetch(API_URL + `/api/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      form.value = false;
      Notification.success('La catégorie a été ajouté avec succès');
      await getCategories();

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catogorie :', error);
      Notification.error('Erreur lors de l\'ajout de la catégorie');
    }
  }
}

async function confirmDeleteCategory() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return router.push('/');
    }
    await fetch(API_URL + `/api/categories/${categoryDeleteId.value}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    close();
    Notification.success('La catégorie a été supprimé avec succès');
    await getCategories();
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    Notification.error('Erreur lors de la suppression de la catégorie');
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
      <div :class="['col-4', { 'd-none': !form }]">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="editedNameCategory">Nom <span class="required">*</span></label>
            <input
                type="text"
                class="form-control"
                id="editedNameCategory"
                v-model="nameCategory"
                required
            />
          </div>
          <div class="d-flex justify-content-between">
            <button @click="form = false" type="button" class="btn btn-secondary"><i class="bi bi-x"></i> Annuler
            </button>
            <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Enregister</button>
          </div>
        </form>
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
    <ModalsContainer></ModalsContainer>
  </div>
</template>