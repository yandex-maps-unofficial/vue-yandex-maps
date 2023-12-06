export type VerticalPosition = 'top' | 'top-center' | 'bottom' | 'bottom-center';
export type HorizontalPosition = 'left' | 'right' | 'left-center' | 'right-center';
/**
 * Describes controls position.
 */
export type Position =
  VerticalPosition
  | HorizontalPosition
  | `${VerticalPosition} ${HorizontalPosition}`
  | `${HorizontalPosition} ${VerticalPosition}`;
export type YandexMapMarkerPosition =
  Position
  | 'default'
  | 'default default'
  | `translate${string}`

export interface YandexMapMarkerCustomProps {
  position?: YandexMapMarkerPosition;
  containerAttrs?: Record<string, any>;
  wrapperAttrs?: Record<string, any>;
  zeroSizes?: boolean | null;
}
