<template>
  <div>
    {{ props.name }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
}
const props = defineProps<Props>()
</script>

