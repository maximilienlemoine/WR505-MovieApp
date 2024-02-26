<script setup>
import {onMounted, ref} from "vue";
import {Notification} from "@arco-design/web-vue";
import router from "@/router";

const API_URL = import.meta.env.VITE_SERVER_API_URL;
let email = ref('')
let password = ref('')

async function testToken() {
  const token = localStorage.getItem('token')
  if (!token) {
    return
  }
  try {
    const response = await fetch(API_URL + '/api/me', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    if (response.status === 401) {
      localStorage.clear()
      location.reload()
    } else {
      location.href = '/'
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  testToken()
})

async function login() {
  try {
    const response = await fetch(API_URL + '/api/login_check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value
      })
    })
    const data = await response.json()
    localStorage.setItem('token', data.token)
    const jsonPayload = await decodeJwt(data.token)
    localStorage.setItem('role', jsonPayload.roles[0])
    localStorage.setItem('username', jsonPayload.frontUsername)
    localStorage.setItem('picture', jsonPayload.mediaObjects)
    location.reload()
    location.href = '/'
  } catch (e) {
    console.error(e)
    Notification.error('Erreur lors de la connexion')
  }
}

async function decodeJwt(token) {
  const base64Url = await token.split('.')[1]
  const base64 = await base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}

function forgotPassword() {
  router.push('/forgot-password')
}

</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Connexion</h1>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <form>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" class="form-control">
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" v-model="password" class="form-control">
          </div>
          <div class="form-group">
            <a @click="forgotPassword" style="cursor: pointer">Mot de passe oublié ?</a>
          </div>
          <button type="button" class="btn btn-primary btn-block" @click="login">Connexion</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>

</style>