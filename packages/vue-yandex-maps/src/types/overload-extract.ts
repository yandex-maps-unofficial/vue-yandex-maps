// https://github.com/microsoft/TypeScript/issues/32164

type OverloadProps<TOverload> = Pick<TOverload, keyof TOverload>;

type OverloadUnionRecursive<TOverload, TPartialOverload = unknown> = TOverload extends (
    ...args: infer TArgs
) => infer TReturn
    ? TArgs[0] extends '@yandex/ymaps3-vuefy'
        ? never
        : TPartialOverload extends TOverload
            ? never
            : TArgs[0] extends '@yandex/ymaps3-vuefy' | '@yandex/ymaps3-reactify'
                ? never
                : | OverloadUnionRecursive<
                TPartialOverload & TOverload,
                TPartialOverload & ((...args: TArgs) => TReturn) & OverloadProps<TOverload>
                >
                | ((...args: TArgs) => TReturn)
    : never;

type OverloadUnion<TOverload extends (...args: any[]) => any> = Exclude<
    OverloadUnionRecursive<
        // The "() => never" signature must be hoisted to the "front" of the
        // intersection, for two reasons: a) because recursion stops when it is
        // encountered, and b) it seems to prevent the collapse of subsequent
        // "compatible" signatures (eg. "() => void" into "(a?: 1) => void"),
        // which gives a direct conversion to a union.
        (() => never) & TOverload
    >,
    TOverload extends () => never ? never : () => never
>;

// Inferring a union of parameter tuples or return types is now possible.
export type OverloadParameters<T extends (...args: any[]) => any> = Parameters<OverloadUnion<T>>;
