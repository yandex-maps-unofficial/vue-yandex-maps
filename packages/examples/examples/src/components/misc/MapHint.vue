<template>
  <common-wrapper>
    <template
      #default="{
        theme, width, height,
      }"
    >
      <!-- #region html -->
      <yandex-map
        :settings="{
          location: LOCATION,
          theme,
          showScaleInCopyrights: true,
        }"
        :width="width"
        :height="height"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-controls :settings="{ position: 'right' }">
          <yandex-map-zoom-control />
        </yandex-map-controls>

        <yandex-map-default-marker
          v-for="(marker, index) in MARKERS_PROPS"
          :key="index"
          :settings="{ ...marker, color: '#006efc' }"
        />

        <yandex-map-feature
          v-for="(feature, index) in POLYGONS_PROPS"
          :key="index"
          :settings="{ ...feature, style: { stroke: [{ color: '#006efc', width: 3 }], fill: 'rgba(56, 56, 219, 0.5)' } }"
        />

        <yandex-map-feature
          v-for="(feature, index) in LINES_PROPS"
          :key="index"
          :settings="{ ...feature, style: { stroke: [{ color: '#006efc', width: 8 }] } }"
        />

        <yandex-map-hint hint-property="hint">
          <template #default="{ content }">
            <div
              class="hint-window"
              v-html="content"
            />
          </template>
        </yandex-map-hint>
      </yandex-map>
      <!-- #endregion html -->
    </template>
  </common-wrapper>
</template>

<script setup lang="ts">
import CommonWrapper from '../CommonWrapper.vue';
// #region setup
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultSchemeLayer,
  YandexMapZoomControl,
  YandexMapDefaultFeaturesLayer,
  YandexMapHint,
  YandexMapDefaultMarker,
  YandexMapFeature,
} from 'vue-yandex-maps';
import type {
  LineStringGeometry,
  LngLat,
  PolygonGeometry,
  YMapFeatureProps,
  YMapMarkerProps,
} from '@yandex/ymaps3-types';
import type { YMapLocationRequest } from '@yandex/ymaps3-types/imperative/YMap';

const LOCATION: YMapLocationRequest = {
  center: [-0.1364, 51.5058], // starting position [lng, lat]
  zoom: 13, // starting zoom
};

/* An array of props for markers.
`properties.hint` stores the text that will be displayed when hovering over this marker */
const MARKERS_PROPS: YMapMarkerProps[] = [
  {
    coordinates: [-0.14190342869498382, 51.50129651503065] satisfies LngLat,
    properties: {
      hint: '<b>Buckingham Palace</b> - is the official residence of the <br> British monarch, hosting ceremonial events and featuring <br> iconic architecture.',
    },
  },
  {
    coordinates: [-0.18817530707891617, 51.50512726949868] satisfies LngLat,
    properties: {
      hint: '<b>Kensington Palace</b> - is a historic royal residence, showcases <br> exhibitions, elegant gardens, and serves as a home <br> for members of the British royal family.',
    },
  },
  {
    coordinates: [-0.11964415235651962, 51.503327577654] satisfies LngLat,
    properties: {
      hint: `<b>The London Eye</b> - is an iconic observation wheel on the <br> South Bank of the River Thames, offering panoramic <br> views of London's skyline and landmarks.`,
    },
  },
  {
    coordinates: [-0.12716120754332955, 51.51929445582118] satisfies LngLat,
    properties: {
      hint: '<b>The British Museum</b> - is a globally acclaimed institution, <br> featuring an extensive collection of art and artifacts <br> representing diverse cultures and historical periods.',
    },
  },
  {
    coordinates: [-0.12458267283672696, 51.500699368761325] satisfies LngLat,
    properties: {
      hint: '<b>Big Ben</b> - is an iconic clock tower known for its impressive <br> architecture and the resonance of its renowned chimes.',
    },
  },
  {
    coordinates: [-0.07655136904107662, 51.508217306427014] satisfies LngLat,
    properties: {
      hint: '<b>The Tower of London</b> - is an iconic fortress on the banks of <br> the River Thames, boasts a storied past as a royal palace, <br> prison, and repository for the Crown Jewels.',
    },
  },
];

/* An array of props for polygons.
`properties.hint` stores the text that will be displayed when hovering over this polygon */
const POLYGONS_PROPS: YMapFeatureProps[] = [
  {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-0.17513834592348232, 51.51165202530792],
          [-0.16190301769869406, 51.513001340277846],
          [-0.16109535003143338, 51.51231855941048],
          [-0.15895893878255024, 51.51248112721672],
          [-0.15661409716792238, 51.50927843401717],
          [-0.15562405293063508, 51.508888242730144],
          [-0.15233130095148276, 51.506186787223314],
          [-0.15207076299430192, 51.505585199888124],
          [-0.15316502241446156, 51.50343893137208],
          [-0.16561507295268435, 51.502352737998294],
          [-0.17447336349683396, 51.502238915164114],
          [-0.17447336349683396, 51.503312090531445],
          [-0.17340515787239238, 51.504759211027306],
          [-0.17309251232377537, 51.50523073469345],
          [-0.17224535003435154, 51.5065080661585],
          [-0.17483463977610986, 51.508992099032525],
        ],
      ],
    } as PolygonGeometry,
    properties: {
      hint: '<b>Hyde Park</b> - is a London masterpiece, enchants with its vast <br> greenery, serene water features, and cultural sites, providing <br> a dynamic haven for strolls, picnics, and cultural events.',
    },
  },
  {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-0.175150828458657, 51.511648797383074],
          [-0.1813152239672102, 51.510677581527084],
          [-0.19112673379363956, 51.509911460340504],
          [-0.18927478935253084, 51.50610013371933],
          [-0.19031529940583924, 51.505869723211454],
          [-0.18944001315362843, 51.50406887801099],
          [-0.18842187966060628, 51.50419805281397],
          [-0.18745186333889072, 51.50245366026584],
          [-0.18296678338863465, 51.50168539524292],
          [-0.1817864198335375, 51.50156319609843],
          [-0.17764050647722895, 51.50168491790318],
          [-0.17709787489028853, 51.50167444370358],
          [-0.17473288661871156, 51.501867043116995],
          [-0.17473087622462335, 51.50324588754518],
          [-0.1735755770392999, 51.50493346687707],
          [-0.17302048974985643, 51.50591659658257],
          [-0.1724920584290436, 51.50658547353086],
          [-0.1748753842257685, 51.50898980991704],
        ],
      ],
    } as PolygonGeometry,
    properties: {
      hint: '<b>Kensington Gardens</b> - is a charming royal park in London, <br> boasting elegant landscapes, the serene Serpentine Lake, <br> and the iconic Peter Pan statue.',
    },
  },
  {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-0.14945522399169806, 51.50315923557074],
          [-0.1494675481880307, 51.50265928572335],
          [-0.14188007968960067, 51.50233098032153],
          [-0.14154732638861883, 51.50247712113629],
          [-0.1416212715666148, 51.50253096237032],
          [-0.14121457308763696, 51.502692485688804],
          [-0.14115295210597364, 51.502630953063914],
          [-0.14079555041232647, 51.502692485688804],
          [-0.14040117612968128, 51.502692485688804],
          [-0.14004377443603414, 51.50263864464658],
          [-0.13969869693871959, 51.50249250435252],
          [-0.1388729757844313, 51.50282324223941],
          [-0.14004377443603414, 51.50392312064804],
          [-0.14240814261762005, 51.50679004604427],
          [-0.14704204043870076, 51.504444267658855],
          [-0.14785543739665638, 51.50388280105736],
        ],
      ],
    } satisfies PolygonGeometry,
    properties: {
      hint: `<b>Green Park</b> - is a peaceful and scenic public space known <br> for its lush lawns, mature trees, and proximity <br> to Buckingham Palace and St. James's Park.`,
    },
  },
  {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-0.1496879265445339, 51.50235650823383],
          [-0.15108798774812707, 51.50193749615679],
          [-0.15115348768747644, 51.50182507762356],
          [-0.15097336285426563, 51.50159001978967],
          [-0.1482811010649776, 51.49987391695768],
          [-0.14744237881914363, 51.49887556571919],
          [-0.14729500395560746, 51.49890878247571],
          [-0.14675053570976568, 51.49867626466909],
          [-0.14658678586139223, 51.4987529190228],
          [-0.14636162981987869, 51.49857150350944],
          [-0.14505126343152258, 51.49921740581846],
          [-0.1448527288897303, 51.49935150604363],
          [-0.14464331574290828, 51.499371875663385],
          [-0.14399875839489773, 51.499230985606154],
          [-0.14377078672623336, 51.49932781593314],
          [-0.1436891971885105, 51.49943984878708],
          [-0.14363752381461936, 51.499606200089836],
          [-0.1433438014788171, 51.499662216207454],
          [-0.1431153507731931, 51.49982517179255],
          [-0.14307183635307422, 51.49981668453695],
          [-0.14294401274397509, 51.49999321912624],
          [-0.14422833328107273, 51.501199299862805],
          [-0.1437554714897926, 51.501369815847134],
          [-0.143721065463766, 51.50147349675585],
          [-0.1434237729986322, 51.50161486509059],
          [-0.1432786659620789, 51.50160602958259],
          [-0.14284909095134535, 51.501797311512064],
          [-0.1428377113022474, 51.50184229220364],
          [-0.1428984027641031, 51.50190621205701],
          [-0.14238277476962471, 51.50211973711725],
        ],
      ],
    } satisfies PolygonGeometry,
    properties: {
      hint: `<b>Buckingham Palace Gardens</b>, an extension of the royal residence, <br> feature meticulously maintained greenery, scenic paths, and beautiful <br> flower beds, creating a tranquil escape in the heart of London.`,
    },
  },
  {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-0.13062333070521917, 51.50566423308428],
          [-0.13931835434232595, 51.502122326198204],
          [-0.1392427544506968, 51.50186753866919],
          [-0.13936371427730346, 51.501505800828845],
          [-0.13968627381492116, 51.501238427526545],
          [-0.13899075481193296, 51.50054954081204],
          [-0.13056397981147733, 51.50138051893921],
          [-0.1300247005845227, 51.501396246774874],
          [-0.12975752190501766, 51.50268071332267],
          [-0.1291647321297693, 51.503573110900554],
          [-0.1291193721947918, 51.50385619741617],
          [-0.12955174844998957, 51.50516348374043],
        ],
      ],
    } satisfies PolygonGeometry,
    properties: {
      hint: `<b>St James's Park</b> - is a picturesque London gem, offers stunning <br> lake views, lush gardens, and iconic landmarks, creating a serene <br> haven for leisure and relaxation in the city center.`,
    },
  },
  {
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-0.15558843273278652, 51.523703059372764],
          [-0.14587522529060454, 51.52536713800137],
          [-0.14601324183343953, 51.530124121101764],
          [-0.14843600767757953, 51.535583882853295],
          [-0.1488670727839754, 51.535959128714246],
          [-0.15131875557660202, 51.536625602502326],
          [-0.16263599037087376, 51.53402631588212],
          [-0.16515846494285477, 51.5312124761529],
          [-0.16461065303681, 51.52952086755516],
          [-0.15954650362176895, 51.5261384789047],
          [-0.158618023271036, 51.52494392912662],
        ],
      ],
    } satisfies PolygonGeometry,
    properties: {
      hint: `<b>The Regent's Park</b>, distinguished by its elegant boating lake, <br> open-air theater, and the iconic Queen Mary's Gardens, offers <br> a diverse blend of nature, leisure, and cultural attractions in London`,
    },
  },
];

/* An array of props for lines.
`properties.hint` stores the text that will be displayed when hovering over this line */
const LINES_PROPS: YMapFeatureProps[] = [
  {
    geometry: {
      type: 'LineString',
      coordinates: [
        [-0.17899610420820156, 51.47349568089417],
        [-0.1781017599757523, 51.47649601751671],
        [-0.17641706502625495, 51.47892471615735],
        [-0.1725693049564153, 51.480989657130834],
        [-0.1492539588034949, 51.48458978762359],
        [-0.1456544432929729, 51.48461267065339],
        [-0.13837489721489785, 51.483742619235784],
        [-0.1324471043471689, 51.484556568260956],
        [-0.12721590554275933, 51.48754689138389],
        [-0.12412071729570102, 51.49125894352177],
        [-0.12160383048819338, 51.50413989845836],
        [-0.11901853544633592, 51.507169744182484],
        [-0.11287528101388539, 51.509353046391375],
        [-0.09629486070371351, 51.509425149460895],
        [-0.08130200419091252, 51.50721996667749],
        [-0.06113154121471965, 51.50172185382963],
        [-0.05692458132286012, 51.50194468396838],
        [-0.04938703935111348, 51.505620991522825],
      ],
    } satisfies LineStringGeometry,
    properties: {
      hint: `<b>The Thames River</b>, flowing through London, is a historic <br> waterway famed for iconic landmarks like the Tower Bridge. <br> It's the cleanest metropolitan river, supporting diverse marine life.`,
    },
  },
];
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.hint-window {
  position: absolute;
  transform: translate(7px, -100%);
  padding: 4px;
  background: white;
  border: 1px solid black;
  opacity: 0.7;
  white-space: nowrap;
}
</style>
<!-- #endregion style -->
