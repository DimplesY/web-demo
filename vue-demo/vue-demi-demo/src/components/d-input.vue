<template>
  <input type="text" :value="msg" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  model: {
    prop: 'msg',
    event: 'input',
  },
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped></style>