/*jshint esversion: 6 */

import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  grupo: belongsTo('grupo')
});
