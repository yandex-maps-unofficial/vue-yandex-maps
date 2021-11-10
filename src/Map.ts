import { h, VNode, defineComponent, getCurrentInstance } from 'vue';
import * as utils from './utils';
import { MapSettings } from './types';

export default defineComponent({
  name: 'YandexMap',
  props: {
    coords: {
      type: Array,
      required: true,
    },
    settings: {
      type: Object as () => MapSettings,
      default: () => ({}),
    },
    debug: Boolean,
  },
  setup(props, context) {
    const internalInstance = getCurrentInstance();
    console.log(internalInstance);
    const pluginOptions: MapSettings = {};

    const init = () => {
      console.log('ymaps initialised');
    };

    if (utils.emitter.scriptIsNotAttached) {
      const settings = { ...pluginOptions, ...props.settings };
      utils.ymapLoader(settings);
    }
    if (utils.emitter.ymapReady) {
      window.ymaps.ready(init);
    } else {
      utils.emitter.$on('scriptIsLoaded', init);
    }

    return {
      pluginOptions,
    };
  },
  render(): VNode {
    return h('section', { class: 'ymap-container' }, [h('div'), h('div', [this.$slots.default?.()])]);
  },
});
