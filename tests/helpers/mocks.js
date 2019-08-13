import Service from '@ember/service';
import sinon from 'sinon';

export const pilasMock = {
    on() { },
    liberarRecursos() { },
    estaResueltoElProblema() { return true; },
    reiniciarEscenaCompleta: sinon.stub(),
    cambiarAModoDeLecturaSimple: sinon.stub(),
    habilitarModoTurbo: sinon.stub(),
    deshabilitarModoTurbo: sinon.stub(),
};

export const interpreteMock = {
    paused_: false,
    run: sinon.stub().returns(false)
};

export const interpreterFactoryMock = Service.extend({
    crearInterprete() { return interpreteMock; }
});

export const actividadMock = { 
    get(key) { return this[key]; }, //TODO: Sacar esta definición y usar Ember.Component.extend
    nombre: "Actividad_Mock",
    debeFelicitarse: true,
    grupo: {
        libro: {
            modoLecturaSimple: true
        }
    }
};

export const blocklyWorkspaceMock = function() {
    let workspace = new Blockly.WorkspaceSvg({})
    workspace.createDom()
    workspace.cachedParentSvg_ = { getScreenCTM: sinon.stub() }
    Blockly.mainWorkspace = workspace
    workspace.highlightBlock = sinon.stub()
    return workspace
}