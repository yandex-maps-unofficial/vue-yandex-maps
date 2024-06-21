import type { YandexMapSettings } from './YandexMap.vue';
import YandexMap from './YandexMap.vue';
import type { YandexMapListenerSettings } from './YandexMapListener.vue';
import YandexMapListener from './YandexMapListener.vue';
import YandexMapDefaultFeaturesLayer from './layers/YandexMapDefaultFeaturesLayer.vue';
import YandexMapDefaultSchemeLayer from './layers/YandexMapDefaultSchemeLayer.vue';
import type {
    IYandexMapDefaultSatelliteLayer,
    IYandexMapDefaultSatelliteLayerProps,
} from './layers/YandexMapDefaultSatelliteLayer.vue';
import YandexMapDefaultSatelliteLayer from './layers/YandexMapDefaultSatelliteLayer.vue';
import YandexMapTileDataSource from './data-sources/YandexMapTileDataSource.vue';
import YandexMapFeatureDataSource from './data-sources/YandexMapFeatureDataSource.vue';
import YandexMapLayer from './layers/YandexMapLayer.vue';
import YandexMapMarker from './YandexMapMarker.vue';
import type { YandexMapDefaultMarkerSettings } from './modules/markers/YandexMapDefaultMarker.vue';
import YandexMapDefaultMarker from './modules/markers/YandexMapDefaultMarker.vue';
import YandexMapFeature from './YandexMapFeature.vue';
import YandexMapControls from './controls/YandexMapControls.vue';
import YandexMapControl from './controls/YandexMapControl.vue';
import type { YandexMapControlButtonSettings } from './controls/YandexMapControlButton.vue';
import YandexMapControlButton from './controls/YandexMapControlButton.vue';
import YandexMapGeolocationControl from './modules/controls/YandexMapGeolocationControl.vue';
import YandexMapZoomControl from './modules/controls/YandexMapZoomControl.vue';
import YandexMapScaleControl from './controls/YandexMapScaleControl.vue';
import YandexMapCartesianProjection from './modules/projection/YandexMapCartesianProjection.vue';
import YandexMapSphericalMercatorProjection from './modules/projection/YandexMapSphericalMercatorProjection.vue';
import YandexMapHint from './modules/hints/YandexMapHint.vue';
import YandexMapOpenMapsButton from './modules/controls/YandexMapOpenMapsButton.vue';
import type { YandexMapClustererOptions } from './modules/clusterer/YandexMapClusterer.vue';
import YandexMapClusterer from './modules/clusterer/YandexMapClusterer.vue';
import YandexMapCollection from './YandexMapCollection.vue';
import YandexMapEntity from './YandexMapEntity.vue';
import type { YandexMapMarkerCustomProps, YandexMapMarkerPosition } from '../types/marker.ts';

export {
    YandexMap,
    YandexMapListener,
    YandexMapMarker,
    YandexMapFeature,
    YandexMapCollection,
    YandexMapEntity,

    // Data Sources
    YandexMapTileDataSource,
    YandexMapFeatureDataSource,

    // Layers
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultSatelliteLayer,
    YandexMapLayer,

    // Controls
    YandexMapControls,
    YandexMapControl,
    YandexMapControlButton,
    YandexMapScaleControl,

    // Controls Module
    YandexMapGeolocationControl,
    YandexMapZoomControl,
    YandexMapOpenMapsButton,

    // Projections Modules
    YandexMapCartesianProjection,
    YandexMapSphericalMercatorProjection,

    // Clusterer Module
    YandexMapClusterer,

    // Markers Module
    YandexMapDefaultMarker,

    // Hint Module
    YandexMapHint,
};

export type {
    YandexMapMarkerPosition,
    YandexMapMarkerCustomProps,
    YandexMapSettings,
    YandexMapControlButtonSettings,
    YandexMapClustererOptions,
    YandexMapDefaultMarkerSettings,
    YandexMapListenerSettings,
    IYandexMapDefaultSatelliteLayer,
    IYandexMapDefaultSatelliteLayerProps,
};
