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
        getSites: getSites,
        getSubsites: getSubsites,
        getLists: getLists,
        getProperties: getProperties
    };

    // init service
    function init() {
      common.logger.log("service loaded", null, serviceId);
    }

    function getSitesResource() {
        
        return $resource("_api/search/query",
       {},
       {
           get: {
               method: 'GET',
               params: {
                   'querytext': '\'* AND contentclass:sts_site\'',
                   'selectproperties': '\'Title,Path\'' 
               },
               headers: {
                   'Accept': 'application/json;odata=verbose'
               }
           }
       });
    }
       
    function getSites() {
        // get resource
        var resource = getSitesResource();

        var deferred = $q.defer();
        resource.get({}, function (data) {
            deferred.resolve(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results);
            common.logger.log("retrieved app content", data, serviceId);
        }, function (error) {
            deferred.reject(error);
            common.logger.logError("retrieved app content", error, serviceId);
        });

        return deferred.promise;
    }

    function getSubsitesResource(site) {

        return $resource(spContext.hostWeb.appWebUrl + "/_api/SP.AppContextSite(@target)/web/webs?@target='" + site + "'",
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

    function getSubsites(site) {
     
        var resource = getSubsitesResource(site);

        var deferred = $q.defer();
        resource.get({}, function (data) {
            deferred.resolve(data.d.results);
            common.logger.log("retrieved app content", data, serviceId);
        }, function (error) {
            deferred.reject(error);
            common.logger.logError("retrieved app content", error, serviceId);
        });

        return deferred.promise;
    }
       
    function getListsResource(site) {

        return $resource(spContext.hostWeb.appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists?@target='" + site + "'",
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

    function getLists(site) {

        var resource = getListsResource(site);

        var deferred = $q.defer();
        resource.get({}, function (data) {
            deferred.resolve(data.d.results);
            common.logger.log("retrieved app content", data, serviceId);
        }, function (error) {
            deferred.reject(error);
            common.logger.logError("retrieved app content", error, serviceId);
        });

        return deferred.promise;
    }

    function getPropertiesResource(site, list) {
        if (!list) {
            return $resource(spContext.hostWeb.appWebUrl + "/_api/SP.AppContextSite(@target)/web/AllProperties?@target='" + site + "'",
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
        else 
        {
            return $resource(spContext.hostWeb.appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" + list + "')?@target='" + site + "'",
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
    }

    function getProperties(site, list) {
      
        var resource = getPropertiesResource(site, list);

        var deferred = $q.defer();
        resource.get({}, function (data) {
            if (list) {
                deferred.resolve(data.d.properties);
            } else {
                deferred.resolve(data.d);
            }
            common.logger.log("retrieved app content", data, serviceId);
        }, function (error) {
            deferred.reject(error);
            common.logger.logError("retrieved app content", error, serviceId);
        });

        return deferred.promise;
    }
  }
})();