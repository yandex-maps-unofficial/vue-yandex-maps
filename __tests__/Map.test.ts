import { mount } from '@vue/test-utils';
import Map from '../src/Map';

test('renders a todo', () => {
  const wrapper = mount(Map);

  const todo = wrapper.find('[data-test="map"]');

  expect(todo.exists()).toBe(true);
});
