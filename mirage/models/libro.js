/*jshint esversion: 6 */

import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  capitulos: hasMany('capitulo')
});
