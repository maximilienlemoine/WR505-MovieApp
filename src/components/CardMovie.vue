<script setup>
import AverageComponent from "@/components/utils/AverageComponent.vue";

const props = defineProps(['movie'])
const movie = props.movie

function convertDuration(duration) {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  if (minutes < 10) {
    return `${hours}h0${minutes}`
  } else {
    return `${hours}h${minutes}`
  }
}
</script>

<template>
  <div class="card">
    <h5>{{ movie.title }}</h5>
    <i>{{ movie.description }}</i>
    <p>Durée : {{ convertDuration(movie.duration) }} <br>
      <AverageComponent :average="movie.averageRating"></AverageComponent>
    </p>
    <template v-if="movie.mediaObjects.length > 0">
      <img :src="movie.mediaObjects[0].contentUrl" alt="Affiche du film">
    </template>
    <router-link :to="{name : 'detailMovie', params : { id : movie.id }}">Plus d'informations</router-link>
  </div>
</template>

<style scoped>
.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>