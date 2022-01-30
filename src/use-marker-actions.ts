import { MarkerAction } from './types';

type UpdateFunction = (arr: ymaps.GeoObject[], action: 'add' | 'remove') => void;

export default function useGeoObjectActions(updateFn: UpdateFunction) {
  const markersToAdd: ymaps.GeoObject[] = [];
  const markersToDelete: ymaps.GeoObject[] = [];
  let addGeoObjectTimeout: number | undefined;
  let deleteGeoObjectTimeout: number | undefined;

  const addGeoObject: MarkerAction = (marker: ymaps.GeoObject) => {
    markersToAdd.push(marker);
    clearTimeout(addGeoObjectTimeout);
    addGeoObjectTimeout = window.setTimeout(() => updateFn(markersToAdd, 'add'));
  };

  const deleteGeoObject: MarkerAction = (marker: ymaps.GeoObject) => {
    markersToDelete.push(marker);
    clearTimeout(deleteGeoObjectTimeout);
    deleteGeoObjectTimeout = window.setTimeout(() => updateFn(markersToDelete, 'remove'));
  };

  return { addGeoObject, deleteGeoObject };
}
