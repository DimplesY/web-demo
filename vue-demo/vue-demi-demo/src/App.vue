<template>
  <div id="app">
    {{ username }}
    <HelloWorld />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue-demi'
import HelloWorld from '@/components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    const username = ref('小明')
    return {
      username,
    }
  },
})
</script>

<style>
</style>
