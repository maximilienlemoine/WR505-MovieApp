<script setup>
import moment from "moment/moment";
import {watch} from "vue";

const props = defineProps(['actor'])
let actor = props.actor

function convertDate(date) {
  return moment(date).format('DD/MM/YYYY');
}

watch(() => props.actor, (newActor) => {
  actor = newActor
})
</script>

<template>
  <div class="card">
    {{ actor.firstName }} {{ actor.lastName }} <br>
    Pays de naissance : {{ actor.nationality.country }} <br>
    Date de naissance : {{ convertDate(actor.birthday) }}
    <template v-if="actor.mediaObjects.length > 0">
      <img :src="actor.mediaObjects[0].contentUrl" alt="Photo de l'acteur">
    </template>
    <router-link :to="{name : 'detailActor', params : { id : actor.id }}">Plus d'informations</router-link>
  </div>
</template>

<style scoped>

</style>