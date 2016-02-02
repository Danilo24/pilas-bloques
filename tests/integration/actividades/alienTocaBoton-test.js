import {moduleForComponent} from 'ember-qunit';
import actividadTest from '../../helpers/actividadTest';
import actividadAlienTocaBoton from 'pilas-engine-bloques/actividades/actividadAlienTocaBoton';

moduleForComponent('pilas-editor', "actividad:AlienTocaBoton", {  integration: true, });

actividadTest('AlienTocaBoton', actividadAlienTocaBoton, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaDerecha" id="4"><next><block type="MoverACasillaDerecha" id="7"><next><block type="MoverACasillaDerecha" id="10"><next><block type="ApretarBoton" id="13"></block></next></block></next></block></next></block></statement></block></xml>',
});