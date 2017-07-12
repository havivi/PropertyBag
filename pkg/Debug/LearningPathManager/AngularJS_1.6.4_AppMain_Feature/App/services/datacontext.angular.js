/*
 * datacontext that uses the Anuglar $http service
 */

(function () {
  'use strict';

  // define factory
  var serviceId = 'datacontext';
  angular.module('app').factory(serviceId,
    ['$rootScope', '$http', '$resource', '$q', 'config', 'common', 'spContext', datacontext]);

  function datacontext($rootScope, $http, $resource, $q, config, common, spContext) {
    // init factory
    init();

    // service public signature
    return {
     
    };

    // init service
    function init() {
      common.logger.log("service loaded", null, serviceId);
    }
       
  }
})();