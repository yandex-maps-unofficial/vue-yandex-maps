import type {
  ComputedGetter, ComputedRef, DebuggerOptions, Ref, UnwrapRef,
} from 'vue';
import { computed, ref } from 'vue';
import { VueYandexMaps } from '../../namespace.ts';

/**
 * @description Prevents memory leak on SSR when ref is called outside setup
 */
export function safeRef<T = any>(value: T): Ref<UnwrapRef<T>> {
  if (typeof window === 'undefined') {
    return {
      // @ts-ignore
      value,
      // @ts-ignore
      __v_isRef: true,
    };
  }

  return ref<T>(value);
}

/**
 * @description Prevents memory leak on SSR when computed is called outside setup
 */
export function safeComputed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRef<T> {
  if (typeof window === 'undefined') {
    return {
      get value() {
        return getter();
      },
      // @ts-ignore
      __v_isRef: true,
    };
  }

  return computed<T>(getter, debugOptions);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copy<T>(target: T): T {
  if (Array.isArray(target)) return target.map((i) => copy(i)) as T;
  if (!target || typeof target !== 'object' || (target?.constructor !== undefined && target?.constructor !== Object)) return target;
  return Object.keys(target)
    .reduce((carry, key) => {
      const val = (target as any)[key];
      (carry as any)[key] = copy(val);
      return carry;
    }, {} as T);
}

export function isDev() {
  return typeof process !== 'undefined' && (process.env?.NODE_ENV === 'development' || process.dev);
}

export function throwException({
  text,
  isInternal,
}: {
  text: string,
  isInternal?: boolean
}): never {
  if (isInternal) {
    text += ' This is likely Vue Yandex Maps internal bug.';

    if (isDev()) {
      text += ' You can report this bug here: https://github.com/PNKBizz/vue-yandex-maps/issues/new/choose';
    }
  }

  throw new VueYandexMaps.YandexMapException(text);
}

export function excludeKeys(item: Record<string, any>, ignoreKeys: string[]) {
  for (const [key, value] of Object.entries(item)) {
    if (ignoreKeys.includes(key)) delete item[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      excludeKeys(value, ignoreKeys);
      if (!Object.keys(value).length) delete item[key];
    }
  }
}