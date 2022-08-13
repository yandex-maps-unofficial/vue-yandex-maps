import { shallowMount } from '@vue/test-utils';
import * as utils from '../src/utils';
import Map from '../src/Map';

describe('Map tests', () => {
  let wrapper: any;

  const createComponent = () => {
    wrapper = shallowMount(Map, {
      propsData: {
        coordinates: [33, 22],
      },
    });
  };

  beforeEach(() => {
    window.ymaps = {
      ready: jest.fn((cb) => cb()),
      Map: jest.fn(),
    } as any;
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('renders a map', () => {
    createComponent();
    const map = wrapper.find('[data-test="map"]');

    expect(map.exists()).toBe(true);
  });

  test('map was initialized for now', () => {
    utils.emitter.scriptIsNotAttached = false;
    utils.emitter.ymapReady = true;

    createComponent();

    expect(window.ymaps.Map).toBeCalled();
    expect(wrapper.emitted()).toHaveProperty('created');
  });

  test(`map was initialized after script loading`, () => {
    utils.emitter.scriptIsNotAttached = true;
    utils.emitter.ymapReady = false;

    jest.spyOn(utils, 'ymapLoader').mockImplementation((settings) => Promise.resolve());

    createComponent();

    expect(utils.ymapLoader).toBeCalled();

    utils.emitter.$emit('scriptIsLoaded');

    expect(window.ymaps.Map).toBeCalled();
    expect(wrapper.emitted()).toHaveProperty('created');
  });
});
