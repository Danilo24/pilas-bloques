import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'ReparandoLaNave';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="3" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="4" inline="true"><value name="count"><block type="math_number" id="5"><field name="NUM">3</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="6"><mutation name="Buscar Hierro y volver"></mutation><next><block type="procedures_callnoreturn" id="7"><mutation name="Buscar Carbón y volver"></mutation></block></next></block></statement><next><block type="Escapar" id="8"></block></next></block></statement></block><block type="procedures_defnoreturn" id="9" x="344" y="6"><mutation></mutation><field name="NAME">Buscar Hierro y volver</field><statement name="STACK"><block type="repetir" id="10" inline="true"><value name="count"><block type="math_number" id="11"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="12"></block></statement><next><block type="TomarHierro" id="13"><next><block type="repetir" id="14" inline="true"><value name="count"><block type="math_number" id="15"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="16"></block></statement><next><block type="Depositar" id="17"></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="18" x="35" y="199"><mutation></mutation><field name="NAME">Buscar Carbón y volver</field><statement name="STACK"><block type="repetir" id="19" inline="true"><value name="count"><block type="math_number" id="20"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="21"></block></statement><next><block type="repetir" id="22" inline="true"><value name="count"><block type="math_number" id="23"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaArriba" id="24"></block></statement><next><block type="TomarCarbon" id="25"><next><block type="repetir" id="26" inline="true"><value name="count"><block type="math_number" id="27"><field name="NUM">3</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="28"></block></statement><next><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaIzquierda" id="31"></block></statement><next><block type="Depositar" id="40"></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'Da error al depositar cuando no tengo nada',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="25" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Depositar" id="34"></block></statement></block></xml>',
	errorEsperado: 'No tengo nada en la mano',
});
