<template>
  <div>
    <div class="customization-control">
      <div class="customization-control_title">
        {{ title }}
      </div>
      <div v-for="section in getSections" :key="section.title" class="customization-control_section">
        <div class="customization-control_section_title">
          {{ section.title }}
        </div>
        <div v-for="(btn, btnIndex) in section.buttons" :key="btn" class="customization-control_section_btn" @click="section.handlers[btnIndex]()">
          {{ btn }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface CustomizationControlProps {
  title: string;
  changeColorHandler?: () => void;
  changeOpacityHandler?: (diff: number) => void;
  changeScaleHandler?: (diff: number) => void;
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

  if (props.changeColorHandler) {
    sections.push({
      title: 'Цвет:',
      buttons: ['Случайный'],
      handlers: [props.changeColorHandler],
    });
  }

  if (props.changeOpacityHandler) {
    sections.push({
      title: 'Прозрачность:',
      buttons: ['-', '+'],
      handlers: [() => props.changeOpacityHandler!(-0.1), () => props.changeOpacityHandler!(0.1)],
    });
  }

  if (props.changeOpacityHandler) {
    sections.push({
      title: 'Увеличение:',
      buttons: ['-', '+'],
      handlers: [() => props.changeOpacityHandler!(-0.1), () => props.changeOpacityHandler!(0.1)],
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
  border-top: 1px solid #c0c0c1;
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
