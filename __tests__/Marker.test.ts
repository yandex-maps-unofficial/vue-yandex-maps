import { shallowMount } from '@vue/test-utils';
import Marker from '../src/Marker';
import { actionsKey } from '../src/utils';

describe('Marker tests', () => {
  let wrapper: any;
  let isAdded = false;
  let isRemoved = false;

  const createComponent = () => {
    wrapper = shallowMount(Marker as any, {
      propsData: {
        coordinates: [33, 22],
        markerId: '123',
      },
      global: {
        provide: {
          [actionsKey as symbol]: {
            addGeoObject: jest.fn(() => (isAdded = true)),
            deleteGeoObject: jest.fn(() => (isRemoved = true)),
          },
        },
      },
    });
  };

  beforeEach(() => {
    window.ymaps = {
      GeoObject: jest.fn(),
    } as any;
  });

  afterEach(() => {
    wrapper.unmount();
    isAdded = false;
    isRemoved = false;
  });

  test('should added to parent', () => {
    createComponent();

    expect(isAdded).toBe(true);
  });

  test('should deleted from parent', () => {
    createComponent();

    wrapper.unmount();

    expect(isRemoved).toBe(true);
  });
});
