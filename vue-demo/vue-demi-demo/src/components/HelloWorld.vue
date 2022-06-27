<template>
  <div>
    <p>鼠标的位置：{{ x }} --- {{ y }}</p>

    <button >点我</button>
    <button @click="handleClick">点我</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import useMouse from '@/composables/useMouse'

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const { x, y } = useMouse()
    const handleClick = () => {
      console.log('点击')
    }
    return {
      x,
      y,
      handleClick,
    }
  },
})
</script>

<style lang="scss" scoped></style>
