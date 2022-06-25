import { onMounted, ref, onBeforeUnmount } from 'vue-demi'

export default function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', update)
  })

  return {
    x,
    y,
  }
}
