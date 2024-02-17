<script setup>

import { ref } from 'vue'
import { Notification } from '@arco-design/web-vue'
import router from "@/router";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
let email = ref('')

async function onForgotPassword() {
  try {
    await fetch(API_URL + '/api/password/forgot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
      }),
    })
      Notification.success('Si l\'adresse correspond, un email de réinitialisation de mot de passe a été envoyé');
      await router.push('/login')
  } catch (error) {
    Notification.error('Erreur lors de la réinitialisation du mot de passe');
  }
}

</script>

<template>
  <div>
    <h1>Mot de passe oublié</h1>
    <form @submit.prevent="onForgotPassword">
      <div class="form-group">
        <label for="email" class="form-label">Email <span class="required">*</span></label>
        <input type="email" class="form-control" id="email" v-model="email" required>
      </div>
      <button type="submit" class="btn btn-primary"><i class="bi bi-check"></i> Réinitialiser le mot de passe</button>
    </form>
  </div>

</template>

<style></style>