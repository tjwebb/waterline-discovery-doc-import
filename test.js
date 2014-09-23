var assert = require('assert');
var Waterline = require('waterline');
var fixtures = require('google-discovery-document/test/fixtures/valid');
var _ = require('lodash');

describe('waterline-discovery-doc-import', function () {
  var WaterlineDiscovery = require('./');
  var config = {
    adapters: {
      memory: require('sails-disk')
    },
    connections: {
      sailsDiscovery: {
        adapter: 'memory'
      }
    },
    migrate: 'drop'
  };

  describe('#createCollections', function () {
    var orm;

    it('should create a valid waterline orm', function (done) {
      this.timeout(60 * 1000);
      var waterline = new Waterline();
      var collections = WaterlineDiscovery.createCollections(fixtures.xtuple460);
      _.each(collections, waterline.loadCollection, waterline);

      waterline.initialize(config, function (error, _orm) {
        orm = _orm.collections;
        done(error);
      });
    });

    it('should contain an Account orm model for xtuple fixture test', function () {
      assert(_.isObject(orm.account));
    });
  });
});
