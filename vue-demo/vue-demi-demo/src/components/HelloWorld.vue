<template>
  <div>
    <p>鼠标的位置：{{ x }} --- {{ y }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import useMouse from '@/composables/useMouse'
export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const { x, y } = useMouse()
    return {
      x,
      y,
    }
  },
})
</script>

<style lang="scss" scoped></style>
