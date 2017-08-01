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
            getProperties: getProperties,
            getWebProperties: getWebProperties
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
                       'selectproperties': '\'Title,Path\'',
                       'rowlimit': 2000
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
            else {
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
        var web;
        var webProps;
        var context;
        var appContextSite;

        function getWebProperties(site) {

            var deferred = $q.defer();
            context = new SP.ClientContext(spContext.hostWeb.appWebUrl);
            appContextSite = new SP.AppContextSite(context, site);
            context.load(appContextSite.get_web());
            web = appContextSite.get_web();
            webProps = web.get_allProperties();
            context.load(web);
            context.load(webProps);
            context.executeQueryAsync(
                function () {
                    var encodedPropKey = EncodePropertyKey('test');
                    webProps.set_item("alontest001", encodedPropKey);
                    web.update();
                    context.executeQueryAsync(
                    function () {

                        alert('The propertybag   was added');
                        // $scope.GetProperties();
                    },
                    function (sender, args) {
                        alert(args.get_message());
                        //  rerurn = 'Failed in adding propertybag  "' + property.key + '". Error: ' + args.get_message();

                    }
                );
                    deferred.resolve(webProps);
                },
                function (sender, args) {
                    common.logger.logError(args.get_message(), error, serviceId);
                    deferred.reject(args.get_message());
                }
            );

            return deferred.promise;
        }

        function addNewProperty(property) {

            // Adds a new property or modified the value of an existing property. 
            webProps.set_item(property.key, property.value)
            // Check if "vti_indexedpropertykeys" property exists in the property bag. If yes, set the flag

            var found = $.map($scope.properties, function (val) {
                if (val.Key == 'vti_indexedpropertykeys') {

                    property.indexedKeysExists = true;
                }
            });
            if (property.indexed === true) {
                var encodedPropKey = EncodePropertyKey(property.key);

                if (property.indexedKeysExists) {
                    var indexedProperties = webProps.get_item("vti_indexedpropertykeys");
                    if (indexedProperties.indexOf(encodedPropKey) > -1) {
                        // Means the property is already indexed

                        alert('The propertybag  "' + property.key + '" is already indexed.');
                    }
                    else {
                        // Add the encoded value to the property bag vti_indexedpropertykeys
                        var addEncodedKey = indexedProperties + encodedPropKey + "|"
                        webProps.set_item("vti_indexedpropertykeys", addEncodedKey);
                        // alert('The vti_indexedpropertykeys  "' + property.key + '" was added');
                    }
                }
                else {
                    // vti_indexedpropertykeys does not exist. Add the new property.
                    webProps.set_item("vti_indexedpropertykeys", encodedPropKey);
                }
            }
            web.update();
            context.executeQueryAsync(
            function () {

                alert('The propertybag  "' + property.key + '" was added');
                $scope.GetProperties();
            },
            function (sender, args) {
                alert(args.get_message());
                rerurn = 'Failed in adding propertybag  "' + property.key + '". Error: ' + args.get_message();

            }
        );
        }

        function EncodePropertyKey(propKey) {
            var bytes = [];
            for (var i = 0; i < propKey.length; ++i) {
                bytes.push(propKey.charCodeAt(i));
                bytes.push(0);
            }
            var b64encoded = window.btoa(String.fromCharCode.apply(null, bytes));
            return b64encoded;
        }
    }
})();