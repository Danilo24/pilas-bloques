import { later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  pilasMock,
  interpreterFactoryMock,
  interpreteMock,
  actividadMock,
  blocklyWorkspaceMock
} from '../../helpers/mocks';
import sinon from 'sinon';

module('Unit | Components | pilas-blockly', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
      this.owner.register('service:interpreterFactory', interpreterFactoryMock);
      this.owner.lookup('service:highlighter').workspace = blocklyWorkspaceMock()

      this.ctrl = this.owner.factoryFor('component:pilas-blockly').create();
      this.ctrl.pilas = pilasMock; //TODO: Injectar como service
      this.ctrl.set('modelActividad', actividadMock);
      sinon.resetHistory();
  });

  //TODO: Ver de agrupar en modules
  test('Al ejecutar se encuentra ejecutando y ejecuta el intérprete', function(assert) {
    this.ctrl.send('ejecutar');

    assert.ok(this.ctrl.get('ejecutando'));
    assert.notOk(this.ctrl.get('pausadoEnBreakpoint'));
    assert.ok(interpreteMock.run.called);
  });

  test('Ejecutar paso a paso bloquea la ejecución', function(assert) {
    this.ctrl.send('ejecutar', true);
    
    later(() => {
      assert.ok(interpreteMock.run.calledOnce);
      assert.ok(this.ctrl.get('pausadoEnBreakpoint'));
    });
  });

  test('Step desbloquea el breakpoint', function(assert) {
    this.ctrl.send('ejecutar', true);
    
    later(() => {
      assert.ok(this.ctrl.get('pausadoEnBreakpoint'));
      this.ctrl.send('step');
      assert.notOk(this.ctrl.get('pausadoEnBreakpoint'));
    });
  });

  test('Luego de ejecutar termina de ejecutar', function(assert) {
    this.ctrl.send('ejecutar');

    later(() => {
      assert.notOk(this.ctrl.get('ejecutando'));
      assert.ok(this.ctrl.get('terminoDeEjecutar'));
    });
  });

  test('Al resolver el problema muestra el fin del desafío', function(assert) {
    this.ctrl.set('debeMostrarFinDeDesafio', true);
    this.ctrl.send('ejecutar');

    later(() => {
      assert.ok(this.ctrl.get('mostrarDialogoFinDesafio'));
    });
  });

  test('Al reiniciar settea flags y reinicia la escena de pilas', function(assert) {
    this.ctrl.send('reiniciar');

    assert.notOk(this.ctrl.get('ejecutando'));
    assert.notOk(this.ctrl.get('terminoDeEjecutar'));
    assert.notOk(this.ctrl.get('errorDeActividad'));
    assert.ok(pilasMock.reiniciarEscenaCompleta.called);
  });
});

