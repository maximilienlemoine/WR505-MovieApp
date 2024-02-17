<script setup>
import { ref } from 'vue'
import { Notification } from '@arco-design/web-vue'
import router from "@/router";
import {useRoute} from "vue-router";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
const route = useRoute()
const resetToken = route.params.token
let password = ref('')
let confirmPassword = ref('')

async function onResetPassword() {
  if (password.value !== confirmPassword.value) {
    Notification.error('Les mots de passe ne correspondent pas');
    return
  }

  try {
    const response = await fetch(API_URL + '/api/password/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: resetToken,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    })
    if (response.status !== 200) {
      Notification.error('Erreur lors de la réinitialisation du mot de passe');
    } else {
      Notification.success('Mot de passe réinitialisé avec succès');
      await router.push('/login')
    }
  } catch (error) {
    console.error(error)
    Notification.error('Erreur lors de la réinitialisation du mot de passe');
  }
}

</script>

<template>
  <div>
    <h1>Nouveau mot de passe</h1>
    <form @submit.prevent="onResetPassword">
      <div class="form-group">
        <label for="password" class="form-label">Mot de passe <span class="required">*</span></label>
        <input type="password" class="form-control" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirmation du mot de passe <span class="required">*</span></label>
        <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Enregistrer</button>
    </form>
  </div>
</template>

<style scoped>

</style>