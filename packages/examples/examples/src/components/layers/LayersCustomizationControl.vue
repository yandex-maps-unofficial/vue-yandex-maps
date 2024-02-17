<template>
  <div class="customization-control">
    <div class="customization-control_title">
      {{ title }}
    </div>
    <div v-for="section in getSections" :key="section.title" class="customization-control_section">
      <div class="customization-control_section_title">
        {{ section.title }}
      </div>
      <div
        v-for="(btn, btnIndex) in section.buttons"
        :key="btn"
        class="customization-control_section_btn"
        @click="section.handlers[btnIndex]()"
      >
        {{ btn }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type CustomizationControls = 'color' | 'opacity' | 'scale'

interface CustomizationControlProps {
  title: string;
  enabledControls: CustomizationControls[];
  changeHandler: (control: CustomizationControls, diff?: number) => void;
}

type CustomizationControlSection = { title: string, } & (
    {
      buttons: [string],
      handlers: [() => void]
    } | {
  buttons: [string, string],
  handlers: [() => void, () => void]
});

const props = defineProps<CustomizationControlProps>();

const getSections = computed(() => {
  const sections: CustomizationControlSection[] = [];

  if (props.enabledControls.includes('color')) {
    sections.push({
      title: 'Цвет:',
      buttons: ['Случайный'],
      handlers: [() => props.changeHandler('color')],
    });
  }

  if (props.enabledControls.includes('opacity')) {
    sections.push({
      title: 'Прозрачность:',
      buttons: ['-', '+'],
      handlers: [() => props.changeHandler('opacity', -0.1), () => props.changeHandler('opacity', 0.1)],
    });
  }

  if (props.enabledControls.includes('scale')) {
    sections.push({
      title: 'Увеличение:',
      buttons: ['-', '+'],
      handlers: [() => props.changeHandler('scale', -1), () => props.changeHandler('scale', 1)],
    });
  }

  return sections;
});
</script>

<style scoped>
.customization-control {
  padding: 10px 0;
  margin: 0 15px;

  display: flex;
  flex-direction: column;
  gap: 15px;
}

.customization-control:not(:first-child) {
  border-top: 1px solid rgba(170, 170, 170, 0.15);
}

.customization-control_title {
  text-align: center;

  font-size: 18px;
  font-weight: 600;
}

.customization-control_section {
  display: flex;
  align-items: center;
  gap: 5px;
}

.customization-control_section_title {
  flex-basis: 50%;
}

.customization-control_section_btn {
  cursor: pointer;

  padding: 8px;

  color: rgb(255, 255, 255);
  border-radius: 8px;
  background-color: rgba(0, 122, 252, 0.9);
  transition: background-color 0.2s;
  user-select: none;
}

.customization-control_section_btn:hover {
  background-color: rgb(0, 110, 252);
}

.customization-control_section_btn:active {
  background-color: rgb(0, 122, 252);
}
</style>
