<script setup>
import {onMounted, watch} from "vue";

const props = defineProps(['average'])
let average = props.average

watch(() => props.average, (newAverage) => {
  setAverage(newAverage)
})

onMounted(() => {
  setAverage(average)
})

function setAverage(newAverage) {
  if (isNaN(newAverage) || newAverage === null || newAverage === undefined) {
    average = 0
  } else if (newAverage > 10) {
    average = 10
  } else {
    average = newAverage
  }
}
</script>

<template>
  <template v-for="n in average">
    <i class="bi bi-star-fill stars gold"></i>&nbsp;
  </template>
  <template v-for="n in 10 - average">
    <i class="bi bi-star stars gray"></i>&nbsp;
  </template>
</template>

<style scoped>

</style>