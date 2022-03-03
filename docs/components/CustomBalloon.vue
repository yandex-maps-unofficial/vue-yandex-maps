<template>
  <div class="component">
    {{ modelValue }} component with props and emits
    <button @click="$emit('update:modelValue', 'Awesome')">Click!</button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
  },
  setup() {},
};
</script>
