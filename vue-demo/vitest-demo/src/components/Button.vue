<script setup lang="ts">
import { ref } from 'vue'

const counter = ref(0)
</script>

<template>
  <button data-test="btn" @click="counter++">
    {{ counter }}
  </button>
</template>

<style scoped></style>
