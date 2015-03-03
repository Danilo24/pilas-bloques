import Ember from 'ember';

Blockly.Blocks.primitivas = { COLOUR: '#4a6cd4' };
Blockly.Blocks.sensores = { COLOUR: '#4a6cd4' };
Blockly.Blocks.eventos = { COLOUR: '#4a6cd4' };

/*
 * Representa un bloque
 * para el lenguaje de la actividad
 */
var Bloque = Ember.Object.extend({
  init: function(){
    // espera:
    // + id
    // + categoria
  },

  block_init: function() {
    // abstracta
  },

  block_javascript: function(block) {
    // abstracta
  },

  registrar_en_blockly: function() {
    var myThis = this;
    Blockly.Blocks[this.get('id')] = {
      init: function() {
        myThis.block_init(this);
      }
    };

    Blockly.JavaScript[this.get('id')] = function(block) {
      return myThis.block_javascript(block);
    };
  },

  get_parametros: function() {
    return [];
  },

  obtener_icono: function(nombre) {
    return new Blockly.FieldImage('iconos/' + nombre, 16, 16, '<');
  },

  // Escupe el código que va en el toolbox para el bloque
  build: function() {
    var str_block = '';
    str_block += '<block type="TIPO">'.replace('TIPO', this.get('id'));

    this.get_parametros().forEach(function(item) {
       str_block += item.build();
    });

    str_block += '</block>';
    return str_block;
  }
});

var Accion = Bloque.extend({

  init: function() {
    this._super();
    this.set('categoria', 'Acciones');
  },

  block_init: function(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.primitivas.COLOUR);
    block.setPreviousStatement(true);
    block.setNextStatement(true);
  },

  block_javascript: function(block) {
    return 'programa.hacer(' + this.nombre_comportamiento() + ', ' + this.argumentos() + ')\n';
  }

});

var IrDerecha = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_derecha');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('derecha.png'))
         .appendField('ir derecha');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaDerecha';
  },

  argumentos: function() {
    return '{cantidad: 68, tiempo: 1}';
  }

});

var IrIzquierda = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_izquierda');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('izquierda.png'))
         .appendField('ir izquierda');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaIzquierda';
  },

  argumentos: function() {
    return '{cantidad: 68, tiempo: 1}';
  }

});

var IrArriba = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_arriba');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('arriba.png'))
         .appendField('ir arriba');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaArriba';
  },

  argumentos: function() {
    return '{cantidad: 80, tiempo: 1}';
  }

});

var IrAbajo = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'ir_abajo');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField(this.obtener_icono('abajo.png'))
         .appendField('ir abajo');
  },

  nombre_comportamiento: function() {
    return 'MoverHaciaAbajo';
  },

  argumentos: function() {
    return '{cantidad: 80, tiempo: 1}';
  }

});

var Recoger = Accion.extend({

  init: function() {
    this._super();
    this.set('id', 'recoger');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
        .appendField('recoger')
        .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 16, 16, 'tuerca'));
  },

  nombre_comportamiento: function() {
    return 'Recoger';
  },

  argumentos: function() {
    return '{tiempo: 1}';
  }

});

var Sensor = Bloque.extend({
  init: function() {
    this._super();
    this.set('categoria', 'Sensores');
  },

  block_init: function(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.sensores.COLOUR);
    block.setInputsInline(true);
    block.setOutput(true);
  },

  block_javascript: function(block) {
    return ['programa.receptor.' + this.nombre_sensor() + '\n', Blockly.JavaScript.ORDER_ATOMIC];
  }
});

var ChocaConTuerca = Sensor.extend({
  init: function() {
    this._super();
    this.set('id', 'choca_con_tuerca');
  },

  block_init: function(block) {
    this._super(block);
    block.appendDummyInput()
         .appendField('choca con')
         .appendField(new Blockly.FieldImage('libs/data/tuerca.png', 15, 15, 'tuerca'));
  },

  nombre_sensor: function() {
    return 'colisiona_con_item("Tuerca")';
  }
});

var EstructuraDeControl = Bloque.extend({
  init: function() {
    this._super();
    this.set('categoria', 'Control');
  },

  block_init: function(block) {
    this._super(block);
    block.setColour(Blockly.Blocks.loops.COLOUR);
    block.setInputsInline(true);
    block.setPreviousStatement(true);
    block.setNextStatement(true);
  }

});

var Repetir = EstructuraDeControl.extend({

  init: function() {
    this._super();
    this.set('id', 'repetir');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('count')
        .setCheck('Number')
        .appendField('repetir');
    block.appendStatementInput('block');
  },

  block_javascript: function(block) {
    var value_count = Blockly.JavaScript.valueToCode(block, 'count', Blockly.JavaScript.ORDER_ATOMIC) || '0' ;
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.repetirN(function(){ return {{n}}; });\n'.replace('{{n}}', value_count);
    return r;
  },

  get_parametros: function() {
    return [
      ParamValor.create({
        nombre_param: 'count',
        tipo_bloque: 'math_number',
        nombre_valor: 'NUM',
        valor: '10'
      })
    ];
  }


});

var Si = EstructuraDeControl.extend({

  init: function() {
    this._super();
    this.set('id', 'si');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('si');
    block.appendStatementInput('block');
  },

  block_javascript: function(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.alternativa_si(function(){ return {{condition}}; });\n'.replace('{{condition}}', value_condition);
    return r;
  }

});

var Sino = EstructuraDeControl.extend({

  init: function() {
    this._super();
    this.set('id', 'sino');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('si');
    block.appendStatementInput('block1');
    block.appendDummyInput()
        .appendField('sino');
    block.appendStatementInput('block2');
  },

  block_javascript: function(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    var statements_block1 = Blockly.JavaScript.statementToCode(block, 'block1');
    var statements_block2 = Blockly.JavaScript.statementToCode(block, 'block2');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block1;
    r += 'programa.empezar_secuencia();\n';
    r += statements_block2;
    r += 'programa.alternativa_sino(function(){ return {{condition}}; });\n'.replace('{{condition}}', value_condition);
    return r;
  }

});

var Hasta = EstructuraDeControl.extend({

  init: function() {
    this._super();
    this.set('id', 'hasta');
  },

  block_init: function(block) {
    this._super(block);
    block.appendValueInput('condition')
        .setCheck('Boolean')
        .appendField('repetir hasta que');
    block.appendStatementInput('block');
  },

  block_javascript: function(block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'true';
    var statements_block = Blockly.JavaScript.statementToCode(block, 'block');
    var r = 'programa.empezar_secuencia();\n';
    r += statements_block;
    r += 'programa.repetir_hasta(function(){ return {{condition}}; });\n'.replace('{{condition}}', value_condition);
    return r;
  }

});

var ExpresionDeBlockly = Bloque.extend({
  init: function() {
    this._super();
    this.set('categoria', 'Expresiones');
  },

  registrar_en_blockly: function() {
    // pisado porque ya viene con blockly
  }
});

var Numero = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'math_number');
  },
});

var OpAritmetica = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'math_arithmetic');
  },
});

var Booleano = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_boolean');
  },
});

var OpComparacion = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_compare');
  },
});

var OpLogica = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_operation');
  },
});

var OpNegacion = ExpresionDeBlockly.extend({
  init: function() {
    this._super();
    this.set('id', 'logic_negate');
  },
});

/*
 * Representa el valor
 * de un campo string de un bloque
 */
var ParamCampo = Ember.Object.extend({
   build: function() {
     var str_block = '';
     str_block += '<field name="NOMBRE">'.replace('NOMBRE', this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';
     return str_block;
   }
});

/*
 * Representa un valor mas complejo
 * de un campo de un bloque
 */
var ParamValor = Ember.Object.extend({
   build: function() {
     var str_block = '';
     str_block += '<value name="NOMBRE">'.replace('NOMBRE', this.get('nombre_param'));

     str_block += '<block type="TIPO">'.replace('TIPO', this.get('tipo_bloque'));

     str_block += '<field name="TIPO">'.replace('TIPO', this.get('nombre_valor'));
     str_block += this.get('valor');
     str_block += '</field>';

     str_block += '</block>';

     str_block += '</value>';

     return str_block;
   }
});

/*
 * Representa el lenguaje que podra utilizarse
 * en una actividad
 */
var Lenguaje = Ember.Object.extend({

  init: function() {
    this.set('categorias', []);
    this.set('bloques', {});
  },

  agregar: function(c, bs) {
    if(bs !== undefined) {
      this.categoria(c);
      bs.forEach(function (b) {
        this.bloque(b);
      }.bind(this));
    }
  },

  categoria: function(c) {
    this.get('categorias').pushObject(c);
    var bs = this.get('bloques');
    bs[c] = [];
    this.set('bloques', bs);
  },

  bloque: function(b) {
    var b_instance = b.create();
    b_instance.registrar_en_blockly();
    this.get('bloques')[b_instance.get('categoria')].pushObject(b_instance);
  },

  build: function() {
    var str_toolbox = '';

    str_toolbox += '<xml>';

    this.get('categorias').forEach(function(item) {
      if(item === 'Subtareas') {
        str_toolbox += this._build_subtareas();
      } else if (item === 'Variables') {
        str_toolbox += this._build_variables();
      } else {
        str_toolbox += this._build_categoria(item);
      }
    }.bind(this));

    str_toolbox += '</xml>';

    return str_toolbox;
  },

  _build_categoria: function(categoria) {
   var str_category = '';

   str_category += '<category name="x">\n'.replace('x', categoria);

   this.get('bloques')[categoria].forEach(function(b) {
       str_category += b.build();
   });

   str_category += '</category>\n';

   return str_category;
  },

  _build_subtareas: function() {
    return '<category name="Subtareas" custom="PROCEDURE"></category>';
  },

  _build_variables: function() {
    return '<category name="Variables" custom="VARIABLE"></category>';
  }

});

/**
  Modelo de actividad
**/
var Actividad = Ember.Object.extend({
  init: function() {
    var actividad = this.get('actividad');
    this.set('nombre', actividad.nombre);
    this.set('enunciado', actividad.enunciado);
    this.set('escena', actividad.escena);
    this.set('puedeComentar', actividad.puedeComentar);
    this.set('puedeDesactivar', actividad.puedeDesactivar);
    this.set('puedeDuplicar', actividad.puedeDuplicar);
  },

  iniciarEscena: function () {
    var Esc = this.get('escena');
    pilas.mundo.gestor_escenas.cambiar_escena(new Esc());
  },

  construirLenguaje: function() {
    var act = this.get('actividad');
    var leng = Lenguaje.create();

    leng.agregar('Acciones', act.acciones);
    leng.agregar('Sensores', act.sensores);
    leng.agregar('Control', act.control);
    leng.agregar('Expresiones', act.expresiones);
    leng.agregar('Variables', []);
    leng.agregar('Subtareas', []);

    return leng.build();
  }

  // definir en subclases
  // iniciarEscena
});


var EscenaAlien = (function (_super) {
    __extends(EscenaAlien, _super);
    function EscenaAlien() {
      _super.apply(this, arguments);
    }

    EscenaAlien.prototype.coord_grilla = function(fila, columna) {
      var columnas = [-175, -105, -35, 35, 105, 175];
      var filas = [140, 60, -20, -100, -180];

      return {x: columnas[columna-1], y: filas[fila-1]};
    };

    EscenaAlien.prototype.iniciar = function() {
      var fondo = new pilas.fondos.Laberinto1();
      var alien = new pilas.actores.Alien(-175, -180);

      window.alien = alien;
      window.fondo = fondo;

      alien.cuando_busca_recoger = function() {
        var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca');

        if (actores.length > 0) {
          var mensaje = '';
          actores[0].eliminar();
          var restantes = pilas.obtener_actores_con_etiqueta('Tuerca').length;

          if (restantes > 0) {
            mensaje = 'genial, aún quedan: ' + restantes;
          } else {
            mensaje = '¡Nivel completado!';
          }

          alien.decir(mensaje);
        }
      };

      var posicion = this.coord_grilla(1, 1);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(2, 2);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(3, 3);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(4, 4);
      new pilas.actores.Tuerca(posicion.x, posicion.y);

      posicion = this.coord_grilla(5, 5);
      new pilas.actores.Tuerca(posicion.x, posicion.y);
    };

    return EscenaAlien;
})(Base);

var actividadAlien = {
  nombre: 'El alien y las tuercas',
  enunciado: 'Define un programa para que el alien junte todas las tuercas',
  escena: EscenaAlien,
  puedeComentar: false,
  puedeDesactivar: false,
  puedeDuplicar: false,
  subtareas: true,
  variables: true,
  control: [Repetir, Si, Sino, Hasta],
  expresiones: [Numero, OpAritmetica, OpComparacion, Booleano, OpLogica, OpNegacion],
  acciones: [IrDerecha, IrIzquierda, IrArriba, IrAbajo, Recoger],
  sensores: [ChocaConTuerca]
};

var Actividades = {
  Alien: Actividad.create({ actividad: actividadAlien }),
};

export default Actividades;
