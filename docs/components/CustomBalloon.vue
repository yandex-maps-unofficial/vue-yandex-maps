<template>
  <div>
    {{ modelValue }} component with props and emits
    <button @click="$emit('update:modelValue', 'Awesome')">Click!</button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>
