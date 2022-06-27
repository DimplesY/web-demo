<template>
  <div id="app">
    {{ username }}
    <HelloWorld />

    <el-button type="primary" @click="handleShwoNotification">点我</el-button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue-demi'
import HelloWorld from '@/components/HelloWorld.vue'
import { Notification } from 'element-ui'
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    const username = ref('小明')
    const handleShwoNotification = () => {
      Notification({
        message: '你好',
        onClose: (el) => {
          console.log('我是通知', el)
        },
      })
    }
    return {
      username,
      handleShwoNotification,
    }
  },
})
</script>

<style></style>
