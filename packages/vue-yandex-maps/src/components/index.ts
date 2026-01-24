import type { YandexMapSettings } from './YandexMap.vue';
import YandexMap from './YandexMap.vue';
import type { YandexMapListenerSettings } from './YandexMapListener.vue';
import YandexMapListener from './YandexMapListener.vue';
import YandexMapDefaultFeaturesLayer from './layers/YandexMapDefaultFeaturesLayer.vue';
import YandexMapDefaultSchemeLayer from './layers/YandexMapDefaultSchemeLayer.vue';
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
import YandexMapWebMercatorProjection from './modules/projection/YandexMapWebMercatorProjection.vue';
import YandexMapHint from './modules/hints/YandexMapHint.vue';
import YandexMapOpenMapsButton from './modules/controls/YandexMapOpenMapsButton.vue';
import type { YandexMapClustererOptions } from './modules/clusterer/YandexMapClusterer.vue';
import YandexMapClusterer from './modules/clusterer/YandexMapClusterer.vue';
import YandexMapCollection from './YandexMapCollection.vue';
import YandexMapEntity from './YandexMapEntity.vue';
import type { YandexMapMarkerCustomProps, YandexMapMarkerPosition } from '../types/marker.ts';
import type { YandexMapRulerSettings } from './modules/ruler/YandexMapRuler.vue';
import YandexMapRuler from './modules/ruler/YandexMapRuler.vue';
import YandexMapTrafficLayer from './modules/layers-extra/YandexMapTrafficLayer.vue';
import YandexMapTrafficEventsLayer from './modules/layers-extra/YandexMapTrafficEventsLayer.vue';
import YandexMapRotateControl from './modules/controls/YandexMapRotateControl.vue';
import YandexMapTiltControl from './modules/controls/YandexMapTiltControl.vue';
import YandexMapRotateTiltControl from './modules/controls/YandexMapRotateTiltControl.vue';
import YandexMapResizer from './modules/ui/YandexMapResizer.vue';
import YandexMapMiniMap from './modules/controls/YandexMapMiniMap.vue';
import YandexMapContextMenu from './modules/ui/YandexMapContextMenu.vue';
import YandexMapContextMenuItem from './modules/ui/YandexMapContextMenuItem.vue';
import YandexMapDrawerControl from './modules/ui/YandexMapDrawerControl.vue';
import YandexMapSignpost from './modules/ui/YandexMapSignpost.vue';
import YandexMapSpinner from './modules/ui/YandexMapSpinner.vue';
import YandexMapSearchControl from './modules/controls/YandexMapSearchControl.vue';
import YandexMapRouteControl from './modules/controls/YandexMapRouteControl.vue';
import type { YandexMapPopupMarkerSettings } from './modules/markers/YandexMapPopupMarker.vue';
import YandexMapPopupMarker from './modules/markers/YandexMapPopupMarker.vue';
import type { YandexMapOverlayCustomProps } from './modules/overlay/YandexMapOverlay.vue';
import YandexMapOverlay from './modules/overlay/YandexMapOverlay.vue';
import YandexMapImageOverlay from './modules/overlay/YandexMapImageOverlay.vue';
import YandexMapVideoOverlay from './modules/overlay/YandexMapVideoOverlay.vue';

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
    YandexMapLayer,

    // Controls
    YandexMapControls,
    YandexMapControl,
    YandexMapControlButton,
    YandexMapScaleControl,
    YandexMapRotateControl,
    YandexMapTiltControl,
    YandexMapRotateTiltControl,
    YandexMapSearchControl,
    YandexMapRouteControl,

    // UI
    YandexMapDrawerControl,
    YandexMapSignpost,
    YandexMapSpinner,
    YandexMapResizer,
    YandexMapMiniMap,
    YandexMapContextMenu,
    YandexMapContextMenuItem,
    YandexMapDefaultMarker,
    YandexMapPopupMarker,

    // Controls Module
    YandexMapGeolocationControl,
    YandexMapZoomControl,
    YandexMapOpenMapsButton,

    // Projections Modules
    YandexMapCartesianProjection,
    YandexMapWebMercatorProjection,

    // Clusterer Module
    YandexMapClusterer,

    // Hint Module
    YandexMapHint,

    // Ruler Module
    YandexMapRuler,

    // Layers Extra Module
    YandexMapTrafficLayer,
    YandexMapTrafficEventsLayer,

    // Overlays
    YandexMapOverlay,
    YandexMapImageOverlay,
    YandexMapVideoOverlay,
};

export type {
    YandexMapMarkerPosition,
    YandexMapMarkerCustomProps,
    YandexMapSettings,
    YandexMapControlButtonSettings,
    YandexMapClustererOptions,
    YandexMapDefaultMarkerSettings,
    YandexMapListenerSettings,
    YandexMapRulerSettings,
    YandexMapOverlayCustomProps,
    YandexMapPopupMarkerSettings,
};
