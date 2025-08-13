<template>
    <common-wrapper>
        <template
            #default="{
                coordinates: center, theme, zoom, width, height,
            }"
        >
            <!-- #region html -->
            <div class="inputs">
                <label>
                    API Поиска по организациям
                    <input
                        v-model="search"
                        autocomplete="off"
                        list="search"
                        placeholder="Начните вводить для поиска"
                        type="text"
                    >
                    <datalist id="search">
                        <option
                            v-for="(item, index) in searchResponse ?? []"
                            :key="item.geometry?.coordinates.join(',') ?? index"
                            :value="item.geometry?.coordinates"
                        >
                            {{ item.properties.name }} ({{ item.properties.description }})
                        </option>
                    </datalist>
                </label>
                <label>
                    API Геосаджеста
                    <input
                        v-model="suggest"
                        autocomplete="off"
                        list="suggest"
                        placeholder="Начните вводить для поиска"
                        type="text"
                    >
                    <datalist id="suggest">
                        <option
                            v-for="(item, index) in suggestResponse ?? []"
                            :key="index"
                            :value="item.subtitle?.text"
                        >
                            {{ item.title.text }}
                        </option>
                    </datalist>
                </label>
            </div>
            <yandex-map
                v-model="map"
                :height="height"
                :settings="{
                    location: {
                        center,
                        zoom,
                    },
                    theme,
                    showScaleInCopyrights: true,
                }"
                :width="width"
            >
                <yandex-map-default-scheme-layer/>
                <yandex-map-default-features-layer/>
                <yandex-map-controls :settings="{ position: 'top left' }">
                    <yandex-map-search-control :settings="{ placeholder: 'Я - нативный поиск!', searchResult: (val) => selectedInput = val[0]?.geometry?.coordinates ?? null }"/>
                </yandex-map-controls>
                <yandex-map-default-marker
                    v-if="selectedSearch"
                    :settings="{ coordinates: selectedSearch, title: 'Результат поиска' }"
                />
                <yandex-map-default-marker
                    v-if="selectedSuggest"
                    :settings="{ coordinates: selectedSuggest, title: 'Результат геосаджеста' }"
                />
                <yandex-map-default-marker
                    v-if="selectedInput"
                    :settings="{ coordinates: selectedInput, title: 'Результат поиска' }"
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
    getBoundsFromCoords,
    getLocationFromBounds,
    YandexMap,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
    YandexMapDefaultSchemeLayer,
    YandexMapSearchControl,
    YandexMapControls,
} from 'vue-yandex-maps';
import { ref, shallowRef, watch } from 'vue';
import type { SearchResponse } from '@yandex/ymaps3-types/imperative/search';
import type { SuggestResponse } from '@yandex/ymaps3-types/imperative/suggest';
import type { LngLat, YMap } from '@yandex/ymaps3-types';

const selectedSearch = ref<LngLat | null>(null);
const selectedSuggest = ref<LngLat | null>(null);
const selectedInput = ref<LngLat | null>(null);

const search = ref('');
const searchResponse = shallowRef<null | SearchResponse>(null);
const suggestResponse = shallowRef<null | SuggestResponse>(null);
const suggest = ref('');
const map = shallowRef<YMap | null>(null);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

watch(search, async val => {
    if (!val) return;

    // Проверка, что уже координаты
    if (val.split(/[,.]/).length === 4) {
        selectedSearch.value = val.split(',').map(x => parseFloat(x)) as LngLat;
        return;
    }

    await sleep(300);
    if (val !== search.value) return;

    searchResponse.value = await ymaps3.search({
        text: val,
        bounds: map.value?.bounds,
    });
});

watch(suggest, async val => {
    if (!val) return;

    const existing = suggestResponse.value?.find(x => x.subtitle?.text === val);
    if (existing) {
        const afterSuggestSearch = await ymaps3.search({
            text: val,
            type: ['toponyms'],
            bounds: map.value?.bounds,
        });
        if (afterSuggestSearch[0].geometry?.coordinates) {
            selectedSuggest.value = afterSuggestSearch[0].geometry.coordinates;
            return;
        }
    }

    await sleep(300);
    if (val !== suggest.value) return;
    suggestResponse.value = await ymaps3.suggest({
        text: val,
        bounds: map.value?.bounds,
        types: ['biz'],
    });
});

watch([selectedSuggest, selectedSearch], async () => {
    if (selectedSuggest.value && !selectedSearch.value) {
        map.value?.setLocation({
            center: selectedSuggest.value,
            zoom: 15,
            duration: 300,
        });
    }
    else if (!selectedSuggest.value && selectedSearch.value) {
        map.value?.setLocation({
            center: selectedSearch.value,
            zoom: 15,
            duration: 300,
        });
    }
    else if (selectedSuggest.value && selectedSearch.value) {
        map.value?.setLocation({
            ...await getLocationFromBounds({
                bounds: getBoundsFromCoords([selectedSearch.value, selectedSuggest.value]),
                map: map.value!,
                comfortZoomLevel: true,
            }),
            duration: 300,
        });
    }
});
// #endregion setup
</script>

<!-- #region style -->
<style scoped>
.inputs {
  display: grid;
  grid-template-columns: repeat(2, 48%);
  justify-content: space-between;
  margin-bottom: 20px;

  label {
    display: flex;
    flex-direction: column;
    gap: 10px;

    input {
      padding: 10px;
      border-radius: 5px;
      color: var(--vp-button-alt-text);
      background: var(--vp-button-alt-bg);
    }
  }
}
</style>
<!-- #endregion style -->
