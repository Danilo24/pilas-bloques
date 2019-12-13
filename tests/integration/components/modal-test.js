import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.set('closeModal', () => {});

    await render(hbs`<Modal @title={{"¿Pensás que este ejercicio tiene un error?"}} @onClose={{action closeModal}}/>`);

    assert.equal(this.element.textContent.trim(), '');

  });
});
