export type MapSettings = {
  apiKey?: string;
  lang?: string;
  version?: string;
  coordorder?: string;
  debug?: boolean;
  enterprise?: boolean;
};

export interface Geometry extends ymaps.IGeometryJson {
  coordinates: Array<RecursiveArray | number>;
  radius?: number;
}

export type MarkerFeature = {
  geometry: Geometry;
  properties: {
    markerId: string | number;
  };
};

export type MarkerJson = MarkerFeature & {
  options: ymaps.IGeoObjectOptions;
};

export type MarkerAction = (marker: unknown, markerJson?: MarkerJson) => void;

export type UpdateFunction<T> = (
  arr: T extends ymaps.GeoObject ? ymaps.GeoObject[] : MarkerJson[],
  action: 'add' | 'remove',
) => void;

export type MarkerArray<T> = T extends ymaps.GeoObject ? ymaps.GeoObject[] : MarkerJson[];

export type MarkerType = 'Point' | 'LineString' | 'Rectangle' | 'Polygon' | 'Circle';

export type RecursiveArray = Array<RecursiveArray | number>;

export type MapType = 'yandex#map' | 'yandex#satellite' | 'yandex#hybrid';

export type DetailedControls = { [name in ymaps.ControlKey]: Object };

export interface MarkerGeometry extends ymaps.IGeometry {
  setCoordinates: (value: unknown) => void;
}
