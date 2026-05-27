<template>
    <common-wrapper>
        <template
            #default="{
                theme, width, height,
            }"
        >
            <!-- #region html -->
            <yandex-map
                v-model="map"
                :height="height"
                :settings="{
                    location,
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-controls :settings="{ position: 'bottom left' }">
                    <yandex-map-control>
                        <div class="info">
                            Перетаскивайте маркеры, чтобы изменить маршрут
                        </div>
                    </yandex-map-control>
                    <yandex-map-route-control
                        :settings="{
                            onRouteResult,
                            onUpdateWaypoints: (result) => {
                                pointAName = result[0]?.properties.name ?? 'Точка А'
                                pointBName = result[1]?.properties.name ?? 'Точка B'
                            } }"
                    />
                </yandex-map-controls>

                <yandex-map-default-marker
                    :settings="{
                        coordinates: pointACoordinates,
                        title: pointAName,
                        subtitle: pointASubtitle,
                        draggable: true,
                        onDragMove: onDragMovePointAHandler,
                        onDragEnd: onDragEndHandler,
                    }"
                />
                <yandex-map-default-marker
                    :settings="{
                        coordinates: pointBCoordinates,
                        title: pointBName,
                        subtitle: pointBSubtitle,
                        draggable: true,
                        onDragMove: onDragMovePointBHandler,
                        onDragEnd: onDragEndHandler,
                    }"
                />

                <yandex-map-feature
                    v-if="route"
                    :settings="{
                        ...route,
                        style: lineStyle,
                    }"
                />
            </yandex-map>
            <!-- #endregion html -->
        </template>
    </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
    getLocationFromBounds,
    yandexMapLoadStatus,
    YandexMap,
    YandexMapControl,
    YandexMapControls,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapFeature,
    YandexMapRouteControl,
} from 'vue-yandex-maps';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';
import type { AvailableTypes } from '@yandex/ymaps3-default-ui-theme';
import type { BaseRouteResponse } from '@yandex/ymaps3-types';
import type { DrawingStyle, LngLat, RouteFeature, YMap, YMapMarkerEventHandler } from '@yandex/ymaps3-types';
import { ref, shallowRef, watch } from 'vue';

const location = ref<YMapLocationRequest>({
    center: [37.623082, 55.75254], // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const map = shallowRef<YMap | null>(null);

// The initial coordinates of the starting and ending points of the route
const INITIAL_ROUTE_POINTS: LngLat[] = [
    [37.620028, 55.741556],
    [38.130492, 56.31112],
];

// An object containing the route line style
const lineStyle: DrawingStyle = {
    fillRule: 'nonzero',
    fill: '#333',
    fillOpacity: 0.9,
    stroke: [
        {
            width: 6,
            color: '#007afce6',
        },
        {
            width: 10,
            color: '#fff',
        },
    ],
};

// Converting [Lng, Lat] coordinates to string format
function getPointStr(point: LngLat) {
    return point.map(c => c!.toFixed(4))
        .join('; ');
}

const pointAName = ref('Точка A');
const pointBName = ref('Точка B');
const pointASubtitle = ref(getPointStr(INITIAL_ROUTE_POINTS[0]));
const pointBSubtitle = ref(getPointStr(INITIAL_ROUTE_POINTS[1]));
const pointACoordinates = ref(INITIAL_ROUTE_POINTS[0]);
const pointBCoordinates = ref(INITIAL_ROUTE_POINTS[1]);
const route = ref<RouteFeature | null>(null);

// The function for fetching a route between two points
async function fetchRoute(startCoordinates: LngLat, endCoordinates: LngLat) {
    // Request a route from the Router API with the specified parameters.
    const routes = await ymaps3.route({
        points: [startCoordinates, endCoordinates], // Start and end points of the route LngLat[]
        type: 'driving', // Type of the route
        bounds: true, // Flag indicating whether to include route boundaries in the response
    });

    // Check if a route was found
    if (!routes[0]) return;

    // Convert the received route to a RouteFeature object.
    const firstRoute = routes[0].toRoute();

    // Check if a route has coordinates
    if (firstRoute.geometry.coordinates.length === 0) return;

    return firstRoute;
}

const routeHandler = async (newRoute?: RouteFeature) => {
    // If the route is not found, then we alert a message and clear the route line
    if (!newRoute) {
        alert('Route not found');
        route.value = null;
        return;
    }

    route.value = newRoute;
    if (newRoute.properties.bounds) {
        const newLocation = await getLocationFromBounds({
            bounds: newRoute.properties.bounds,
            map: map.value!,
        });

        // Чтобы маршрут всегда помещался на экран
        location.value = {
            center: newLocation.center,
            zoom: Math.floor(newLocation.zoom) - 1,
            duration: 300,
        };
    }
};

const onRouteResult = (result: BaseRouteResponse, type: AvailableTypes) => {
    const points = result.toRoute();
    console.log(points);
    routeHandler(points);

    const startCoords = points.geometry.coordinates[0];
    const endCoords = points.geometry.coordinates[points.geometry.coordinates.length - 1];

    pointASubtitle.value = getPointStr(startCoords);
    pointBSubtitle.value = getPointStr(endCoords);
    pointACoordinates.value = startCoords;
    pointBCoordinates.value = endCoords;
};

watch(yandexMapLoadStatus, async status => {
    if (status !== 'loaded') return;

    const fetchedRoute = await fetchRoute(pointACoordinates.value, pointBCoordinates.value);
    await routeHandler(fetchedRoute);
}, {
    immediate: true,
});

// The handler functions for updating the coordinates and subtitle of the marker when dragging
const onDragMovePointAHandler: YMapMarkerEventHandler = (coordinates: LngLat) => {
    pointAName.value = 'Точка А';
    pointASubtitle.value = getPointStr(coordinates);
    pointACoordinates.value = coordinates;
};
const onDragMovePointBHandler: YMapMarkerEventHandler = (coordinates: LngLat) => {
    pointAName.value = 'Точка B';
    pointBSubtitle.value = getPointStr(coordinates);
    pointBCoordinates.value = coordinates;
};

// The handler function for updating route data after dragging the marker
const onDragEndHandler: YMapMarkerEventHandler = () => {
    fetchRoute(pointACoordinates.value, pointBCoordinates.value)
        .then(routeHandler);
};
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.info {
  padding: 10px;
  font-size: 14px;
}
</style>
<!-- #endregion style -->
