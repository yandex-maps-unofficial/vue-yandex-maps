# Начало работы

В этом разделе подразумевается, что вы уже установили и сконфигурировали проект.

<<< ../../packages/examples/vue3/src/components/ExampleQuickstart.vue

<example-quickstart :is-dark-theme="isDark()"/>

<script lang="ts" setup>
import ExampleQuickstart from 'example-vue3/src/components/ExampleQuickstart.vue';

const isDark = () => {
    if (typeof window === 'undefined') return false;

    return document.documentElement.classList.contains('dark');
}
</script>

## Что дальше?

Прочитайте [общие принципы работы компонентов](/components/) - это важнее, чем вам может показаться. 
