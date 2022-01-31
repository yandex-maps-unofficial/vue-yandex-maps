import { MarkerAction, UpdateFunction } from '../types';

export default function useGeoObjectActions(updateFunction: UpdateFunction) {
  const markersToAdd: ymaps.GeoObject[] = [];
  const markersToDelete: ymaps.GeoObject[] = [];
  let addGeoObjectTimeout: number | undefined;
  let deleteGeoObjectTimeout: number | undefined;

  const addGeoObject: MarkerAction = (marker: ymaps.GeoObject) => {
    markersToAdd.push(marker);
    clearTimeout(addGeoObjectTimeout);
    addGeoObjectTimeout = window.setTimeout(() => updateFunction(markersToAdd, 'add'));
  };

  const deleteGeoObject: MarkerAction = (marker: ymaps.GeoObject) => {
    markersToDelete.push(marker);
    clearTimeout(deleteGeoObjectTimeout);
    deleteGeoObjectTimeout = window.setTimeout(() => updateFunction(markersToDelete, 'remove'));
  };

  return { addGeoObject, deleteGeoObject };
}
