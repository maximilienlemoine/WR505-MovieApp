<script setup lang="ts">
import {VueFinalModal} from 'vue-final-modal'

defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()
</script>

<template>
  <VueFinalModal
      class="confirm-modal"
      content-class="confirm-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
  >
    <h1>{{ title }}</h1>
    <slot/>

    <div class="d-flex-justifie-between">
      <button class="btn btn-primary" @click="emit('confirm')">Confirmer</button>
      <button class="btn btn-primary" @click="emit('close')">Annuler</button>
    </div>
  </VueFinalModal>
</template>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
}

.d-flex-justifie-between {
  display: flex;
  justify-content: space-between;
}

.confirm-modal-content > * + * {
  margin: 0.5rem 0;
}

.confirm-modal-content h1 {
  font-size: 1.375rem;
}

.dark .confirm-modal-content {
  background: #000;
}
</style>