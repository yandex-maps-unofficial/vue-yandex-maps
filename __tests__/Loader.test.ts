import { loadYmap } from '../src';

describe('Loader tests', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    window.ymaps = null as any;
  });

  test('should create script', () => {
    const settings = {
      debug: true,
    };

    loadYmap(settings);

    const script = document.getElementById('vue-yandex-maps-script') as HTMLScriptElement;

    expect(script.src).toMatch(/api-maps.yandex.ru/);
    expect(script.src).toMatch(/mode=debug/);
  });

  test(`shouldn't create script if ymaps in window`, async () => {
    window.ymaps = {} as any;

    await loadYmap({});

    const script = document.getElementById('vue-yandex-maps-script') as HTMLScriptElement;

    expect(script).toBeNull();
  });

  test(`shouldn't create script if script is already added`, () => {
    const testScript = document.createElement('script');
    testScript.id = 'vue-yandex-maps-script';
    testScript.src = 'http://test-src/';
    document.head.appendChild(testScript);

    loadYmap({});

    const scripts = document.querySelectorAll('#vue-yandex-maps-script') as NodeListOf<HTMLScriptElement>;

    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toBe('http://test-src/');
  });
});
