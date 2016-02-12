/* globals MariaLaComeSandias */
import bloques from 'pilas-engine-bloques/actividades/bloques';
import direcciones from 'pilas-engine-bloques/actividades/direccionesCuadricula';

var {Accion, Repetir,Procedimiento} = bloques;
var {IrDerecha,IrIzquierda, IrArriba,IrAbajo} = direcciones;


var MorderSandia = Accion.extend({
  init() {
    this._super();
    this.set('id', 'MorderSandia');
  },


  block_init(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('Morder sandía ')
         .appendField(this.obtener_icono('../libs/data/icono.sandia.png'));
  },

  nombre_comportamiento() {
    return 'RecogerPorEtiqueta';


  },

  argumentos() {
  return '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}';

  }
});

var actividadMariaLaComeSandias = {
  nombre: 'María la come sandías',
  id: 'MariaLaComeSandias',
  enunciado: 'María necesita comer todas las sandías de la cuadrícula. Pensá de qué manera puede hacerlo creando los bloques necesarios. Atención: la forma en que las sandías están distribuidas en la cuadrícula, es clave para crear la menor cantidad de procedimientos.',

  escena: MariaLaComeSandias,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  procedimientos: [Procedimiento],

  // TODO: aca irian atributos iniciales que se desean para un personaje
  variables: [],

  control: [Repetir],
  expresiones: [],
  acciones: [IrDerecha,IrIzquierda, IrArriba,IrAbajo,MorderSandia],
  sensores: []
};

export default actividadMariaLaComeSandias;