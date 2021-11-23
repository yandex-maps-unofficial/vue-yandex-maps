export type MapSettings = {
  apiKey?: string;
  lang?: string;
  version?: string;
  coordorder?: string;
  debug?: boolean;
  enterprise?: boolean;
};

export type MarkerAction = (marker: ymaps.GeoObject) => void;
export type MarkerType = 'Point' | 'LineString' | 'Rectangle' | 'Polygon' | 'Circle';
export interface Geometry extends ymaps.IGeometryJson {
  coordinates: Array<RecursiveArray | number>;
  radius?: number;
}
export interface Marker {
  geometry: Geometry;
  properties: object;
}
export type RecursiveArray = Array<RecursiveArray | number>;
