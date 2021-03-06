var _ = require('lodash');
var Waterline = require('waterline');

function createModel (schema, name, doc, connection) {
  return schema.type === 'object' && {
    dynamicFinders: false,
    associationFinders: false,
    identity: name.toLowerCase(),
    globalId: name,
    connection: connection,
    attributes: createAttributes(schema, doc)
  };
}

function createAttributes (schema, doc) {

  return _.mapValues(schema.properties, function (property, name) {
    var ref = property.$ref || (property.items && property.items.$ref) || '';

    return _.compact({
      type: getType(property),
      notNull: !!property.required,
      model: property.$ref,
      collection: property.items ? property.items.$ref : undefined,
      via: ref.split('/')[1] || undefined
    });
  });
}

function getType (property) {
  if (_.contains([ 'object', 'array' ], (property.type || '').toLowerCase())) {
    return undefined;
  }
  else {
    return property.type;
  }
}

/**
 * Return a list of Waterline collection objects that can be passed into
 * waterline.loadCollections
 * 
 * @param doc - a google discovery doc (restDescription)
 */
exports.createCollections = function (doc, _connection) {
  var connection = _connection || 'sailsDiscovery';

  return _.compact(
    _.map(doc.resources, function (resource, name) {
      var schema = doc.shemas[name];
      var model = createModel(schema, name, doc, connection);
      return Waterline.Collection.extend(model);
    })
  );
};
