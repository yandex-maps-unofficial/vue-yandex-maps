import type {
  ComputedGetter, ComputedRef, DebuggerOptions, Ref, UnwrapRef,
} from 'vue';
import {
  computed, ref, toRaw, unref,
} from 'vue';
import { VueYandexMaps } from '../../namespace.ts';
import YandexMapException = VueYandexMaps.YandexMapException;

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

export function copy<T, K = UnwrapRef<T>>(target: T): K {
  target = toRaw(unref(target));

  // Array copy
  if (Array.isArray(target)) return target.map((i) => copy(i)) as K;

  // Ignore functions, classes, raw values
  if (!target || typeof target !== 'object' || (target?.constructor !== undefined && target?.constructor !== Object)) return target as unknown as K;

  // Objects copy
  return Object.keys(target)
    .reduce((carry, key) => {
      const val = (target as any)[key];
      (carry as any)[key] = copy(val);
      return carry;
    }, {} as K);
}

export function isDev() {
  return typeof process !== 'undefined' && (process.env?.NODE_ENV === 'development' || process.dev);
}

interface ThrowExceptionSettings {
  text: string,
  isInternal?: boolean
  warn?: boolean
}

export function getException({
  text,
  isInternal,
  warn,
}: ThrowExceptionSettings): YandexMapException {
  if (warn) {
    text = `Warning: ${text}`;
  }

  if (isInternal) {
    text += ' This is likely Vue Yandex Maps internal bug.';

    if (isDev()) {
      text += ' You can report this bug here: https://github.com/PNKBizz/vue-yandex-maps/issues/new/choose';
    }
  }

  return new VueYandexMaps.YandexMapException(text);
}

export function throwException(settings: Omit<ThrowExceptionSettings, 'warn'> & { warn: true }): void
export function throwException(settings: Omit<ThrowExceptionSettings, 'warn'> & { warn?: false }): never
export function throwException(settings: ThrowExceptionSettings): never | void {
  const exception = getException(settings);

  if (settings.warn) {
    console.warn(exception);
  } else {
    throw exception;
  }
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
