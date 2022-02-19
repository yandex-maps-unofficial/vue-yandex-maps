import { MarkerAction, UpdateFunction, MarkerJson } from '../types';

export default function useGeoObjectActions(
  updateFunction: UpdateFunction<ymaps.GeoObject | MarkerJson>,
  isObjectManager = false,
) {
  const markersToAdd: any[] = [];
  const markersToDelete: any[] = [];
  let addGeoObjectTimeout: number | undefined;
  let deleteGeoObjectTimeout: number | undefined;

  const addGeoObject: MarkerAction = (marker, markerJson) => {
    markersToAdd.push(isObjectManager ? markerJson : marker);
    clearTimeout(addGeoObjectTimeout);
    addGeoObjectTimeout = window.setTimeout(() => updateFunction(markersToAdd, 'add'));
  };

  const deleteGeoObject: MarkerAction = (marker, markerJson) => {
    markersToDelete.push(isObjectManager ? markerJson : marker);
    clearTimeout(deleteGeoObjectTimeout);
    deleteGeoObjectTimeout = window.setTimeout(() => updateFunction(markersToDelete, 'remove'));
  };

  return { addGeoObject, deleteGeoObject };
}
