import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
    titulo: attr('string'),
    grupos: hasMany('grupo'),
    libro: belongsTo('libro')
});
