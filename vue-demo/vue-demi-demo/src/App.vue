<template>
  <div id="app">
    {{ username }}
    <HelloWorld />

    <!-- <el-button type="primary" @click="handleShowNotification">点我</el-button> -->
    <d-input v-model="username" />
    
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue-demi'
import HelloWorld from '@/components/HelloWorld.vue'
import { Notification } from 'element-ui'
import DInput from '@/components/d-input.vue'
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    DInput,
  },
  setup() {
    const username = ref('小明')
    const handleShowNotification = () => {
      Notification({
        message: '你好',
        onClose: (el) => {
          console.log('我是通知', el)
        },
      })
    }
    return {
      username,
      handleShowNotification,
    }
  },
})
</script>

<style></style>
