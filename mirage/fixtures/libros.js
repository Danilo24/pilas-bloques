/*jshint esversion: 6 */

export default [
  {
    id: 1,
    capituloIds: ['Capítulo 3', 'Capítulo 4', 'Capítulo 5'],
    nombre: 'primer-ciclo',
    titulo: 'Primer Ciclo',
    descripcion: 'Desafíos del manual para docentes "Ciencias de la Computación para el aula, 1° ciclo de primaria"',
    modoLecturaSimple: true, // modo de lectura para niños pequeños.
    desafiosCortos: true // significa que en un grupo/serie de desafíos, se deben hacer uno detrás del otro.
    // sirve particularmente para mostrar el título de la serie en el desafío.
    // ver pilas-editor.hbs
  },
  {
    id: 2,
    capituloIds: ['Autómatas, comandos, procedimientos y repetición', 'Alternativa condicional', 'Repetición condicional', 'Sensores Numéricos', 'Parametrización de soluciones'],
    nombre: 'programar',
    titulo: 'Segundo Ciclo',
    descripcion: 'Desafíos del cuaderno para docentes "Actividades para aprender a Program.AR"  Para 2° ciclo de primaria en adelante.',
  },

  // Libro invisible, exclusivo para hacer capturas:
  {
    id: 'capturas1c',
    capituloIds: ['manual1cPrimariaCapturasCap3', 'manual1cPrimariaCapturasCap4', 'manual1cPrimariaCapturasCap5'],
    titulo: 'Primer ciclo para hacer capturas',
    modoLecturaSimple: true,
    desafiosCortos: true,
    oculto: true
  }

];
