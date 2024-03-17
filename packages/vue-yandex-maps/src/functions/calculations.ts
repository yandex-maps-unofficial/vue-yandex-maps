import type { LngLat, LngLatBounds } from '@yandex/ymaps3-types';
import { throwException } from '../utils/system.ts';

/**
 * @note You must pass at least one array element in coordinates array
 */
export function getCenterFromCoords(coordinates: Array<LngLat | Readonly<LngLat>>): LngLat {
  if (coordinates.length === 1) return coordinates[0] as LngLat;
  if (!coordinates.length) {
    throwException({
      text: 'Invalid parameters in useYMapsCenterFromCoords: you must pass at least one LngLat',
    });
  }

  const sum = coordinates.reduce(([accLng, accLat], [lng, lat]) => [
    accLng + lng,
    accLat + lat,
  ], [0, 0]);

  return [
    sum[0] / coordinates.length,
    sum[1] / coordinates.length,
  ];
}

/**
 * @note You must pass at least two array elements in coordinates array
 */
export function getBoundsFromCoords(coordinates: Array<LngLat | Readonly<LngLat>>): LngLatBounds {
  if (coordinates.length < 2) {
    throwException({
      text: 'Invalid parameters in useYMapsBoundsFromCoords: you must pass at least two LngLat',
    });
  }

  const {
    minLongitude,
    minLatitude,
    maxLongitude,
    maxLatitude,
  } = coordinates.reduce(
    (acc, [longitude, latitude]) => ({
      minLongitude: Math.min(acc.minLongitude, longitude),
      minLatitude: Math.min(acc.minLatitude, latitude),
      maxLongitude: Math.max(acc.maxLongitude, longitude),
      maxLatitude: Math.max(acc.maxLatitude, latitude),
    }),
    {
      minLongitude: Infinity,
      minLatitude: Infinity,
      maxLongitude: -Infinity,
      maxLatitude: -Infinity,
    },
  );

  return [[minLongitude, maxLatitude], [maxLongitude, minLatitude]];
}
