import { getCurrentInstance, normalizeProps, patchProp } from 'vue';

// Vue uses these to manage VNodes; they must not become DOM attributes/listeners.
const vnodeOnlyProp = /^(?:key|ref|ref_for|ref_key|onVnode.*)$/;

export interface MarkerContainer {
    element: HTMLDivElement;
    update: (props: Record<string, any>) => void;
    destroy: () => void;
}

/**
 * Yandex owns the container's position in the DOM; Teleport owns its children.
 * This helper only applies root props and removes them when the owner disposes it.
 * Use patchProp directly: render() would flush Vue's global queue for every marker.
 * The caller owns the watchers and lifecycle, so ruler points can use this too.
 */
export function createMarkerContainer(): MarkerContainer | null {
    if (typeof document === 'undefined') return null;

    // Capture the current owner, when present, for Vue's DOM event error handling.
    const instance = getCurrentInstance();
    const element = document.createElement('div');
    let previousProps: Record<string, any> = {};

    function update(props: Record<string, any>) {
        // Vue normalizes class arrays/objects and style arrays, just as for v-bind.
        // Work on a copy: normalization and filtering must not mutate caller props.
        const nextProps = normalizeProps({ ...props })!;
        for (const key in nextProps) {
            if (vnodeOnlyProp.test(key)) delete nextProps[key];
        }

        // Retain old style values even if the caller mutates its object in place.
        if (nextProps.style && typeof nextProps.style === 'object') {
            nextProps.style = { ...nextProps.style };
        }

        for (const key in previousProps) {
            if (!(key in nextProps)) {
                patchProp(element, key, previousProps[key], null, undefined, instance);
            }
        }

        for (const key in nextProps) {
            const previousValue = previousProps[key];
            const nextValue = nextProps[key];
            if (previousValue === nextValue) continue;

            // getMarkerContainerProps creates fresh style objects. Equal values
            // should not cause DOM writes across thousands of unchanged markers.
            if (key === 'style' && previousValue && nextValue &&
                typeof previousValue === 'object' && typeof nextValue === 'object') {
                const styleKeys = Object.keys(nextValue);
                const sameStyle = styleKeys.length === Object.keys(previousValue).length &&
                    styleKeys.every(name => previousValue[name] === nextValue[name]);
                if (sameStyle) continue;
            }

            // Vue handles DOM properties, attributes, styles and event invokers.
            patchProp(element, key, previousValue, nextValue ?? null, undefined, instance);
        }

        previousProps = nextProps;
    }

    return {
        element,
        update,
        destroy() {
            // Detaching alone would leave listeners on externally retained elements.
            update({});
            element.remove();
        },
    };
}
