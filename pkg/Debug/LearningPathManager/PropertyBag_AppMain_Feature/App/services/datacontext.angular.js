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
        getSites: getSites
    };

    // init service
    function init() {
      common.logger.log("service loaded", null, serviceId);
    }

    function getSitesResource() {
        return $resource('/_api/search/query?querytext=\'contentclass:sts_site\')',
       {},
       {
           get: {
               method: 'GET', 
               headers: {
                   'Accept': 'application/json;odata=verbose'
               }
           }
       });
    }

      // get all item choices available
    function getSites() {
        // get resource
        var resource = getSitesResource();

        var deferred = $q.defer();
        resource.get({}, function (data) {
            deferred.resolve(data);
            common.logger.log("retrieved app content", data, serviceId);
        }, function (error) {
            deferred.reject(error);
            common.logger.logError("retrieved app content", error, serviceId);
        });

        return deferred.promise;
    }
       
  }
})();