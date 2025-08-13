import type { HorizontalPosition, VerticalPosition, YandexMapMarkerCustomProps } from '../types/marker.ts';

export function getMarkerContainerProps({
    position,
    containerAttrs,
    wrapperAttrs,
    zeroSizes,
}: YandexMapMarkerCustomProps): {
    root: Record<string, any>;
    children: Record<string, any>;
} {
    const root: Record<string, any> = {
        class: ['__ymap-marker'],
        style: {},
    };
    const children: Record<string, any> = {
        class: ['__ymap-marker_wrapper'],
        style: {},
    };

    const isDefaultPosition = position === 'default' || position === 'default default';

    if (position && !isDefaultPosition) {
        if (position.startsWith('translate')) {
            children.style.transform = position;
        }
        else {
            let translateX = 0;
            let translateY = 0;

            const splitted = position.split(' ') as [HorizontalPosition | VerticalPosition, HorizontalPosition | VerticalPosition];

            for (let i = 0; i < splitted.length; i++) {
                let local = 0;
                const item = splitted[i];

                switch (item) {
                    case 'top':
                    case 'left':
                        local = -100;
                        break;
                    case 'top-center':
                    case 'left-center':
                        local = -50;
                        break;
                    case 'bottom':
                    case 'right':
                        local = 100;
                        break;
                    case 'bottom-center':
                    case 'right-center':
                        local = 50;
                        break;
                    default:
                        local = 0;
                }

                if (item.startsWith('left') || item.startsWith('right')) translateX = local;
                else translateY = local;
            }

            children.style.transform = `translate(${ translateX }%, ${ translateY }%)`;
        }
    }

    if (zeroSizes === true || (zeroSizes !== false && position && !isDefaultPosition)) {
        root.style.width = '0';
        root.style.height = '0';

        if (children.style.transform) children.style.width = 'fit-content';
    }

    const attrs = {
        root: { ...(containerAttrs ?? {}) },
        children: { ...(wrapperAttrs ?? {}) },
    };

    for (const [key, value] of Object.entries(attrs)) {
        const obj = key === 'root' ? root : children;

        if (value.class) {
            if (!Array.isArray(value.class)) value.class = [value.class];

            value.class = [
                ...obj.class,
                ...value.class,
            ];
        }

        if (value?.style) {
            if (typeof value.style !== 'object' || Array.isArray(value.style)) {
                console.warn(`Style property was given in ${ key } of marker, but it is not an object. Style of this prop can only be an object, therefore it was ignored.`);
            }
            else {
                value.style = {
                    ...obj.style,
                    ...value.style,
                };
            }
        }

        Object.assign(obj, value);
    }

    return {
        root,
        children,
    };
}

export function excludeYandexMarkerProps<T extends Record<string, any>>(props: T): Omit<T, keyof YandexMapMarkerCustomProps> {
    props = { ...props };
    const toExclude: Record<keyof YandexMapMarkerCustomProps, true> = {
        position: true,
        containerAttrs: true,
        wrapperAttrs: true,
        zeroSizes: true,
    };

    for (const excluded in toExclude) {
        if (excluded in props) delete props[excluded];
    }

    return props;
}
