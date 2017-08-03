(function () {
    'use strict';

    // define controller
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId,
        ['$location', '$routeParams', 'common', 'datacontext', dashboard]);

    // init controller
    function dashboard($location, $routeParams, common, datacontext) {
        var vm = this;
        vm.getSubsites = getSubsites;
        vm.getLists = getLists;
        vm.getListProperties = getListProperties;
        vm.openDialog = openDialog;
        vm.closeDialog = closeDialog;
        vm.openDeleteDialog = openDeleteDialog;
        vm.closeDeleteDialog = closeDeleteDialog;
        vm.saveProperty = saveProperty;
        vm.deleteProperty = deleteProperty;
        vm.isProperty = isProperty;
        var logger = common.logger;

        vm.sites = [];
        vm.subsites = [];
        vm.lists = [];
        vm.properties = [];
        vm.site = '';
        vm.subsite = '';
        vm.listname = '';
        vm.showDialog = false;
        vm.showDeleteDialog = false;
        vm.indexedKeysExists = false;
        vm.indexedKeysValue = '';
        // init controller
        init();

        // init controller
        function init() {
            logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
            getSites()

        }

        function getSites() {
            vm.subsites = [];
            datacontext.getSites()
               .then(function (data) {
                   if (data) {

                       for (var i = 0; i < data.length; i++) {
                           vm.sites.push({ title: data[i].Cells.results[2], path: data[i].Cells.results[3] });
                       }
                   }
               }).catch(function (error) {
                   common.logger.logError('error obtaining items', error, controllerId);
               });
        }

        function getSubsites(site) {
            vm.lists = [];
            vm.subsite = '';
            vm.listname = '';
            getLists(site);
            getProperties(site, undefined);
            datacontext.getSubsites(site)
               .then(function (data) {
                   if (data) {
                       vm.subsites = [];
                       vm.subsites.push({ title: "", path: "" });
                       for (var i = 0; i < data.length; i++) {
                           vm.subsites.push({ title: data[i].Title, path: data[i].Url });
                       }
                   }
               }).catch(function (error) {
                   common.logger.logError('error obtaining items', error, controllerId);
               });
        }

        function getLists(site) {

            vm.lists = [];
            vm.listname = '';
            if (!site) {
                site = vm.site;
                vm.subsite = '';
            }
            getProperties(site, undefined);
            datacontext.getLists(site)
               .then(function (data) {
                   if (data) {
                       vm.lists.push({ title: "", path: "" });
                       for (var i = 0; i < data.length; i++) {
                           vm.lists.push({ title: data[i].Title, path: data[i].Url });
                       }
                      
                   }
               }).catch(function (error) {
                   common.logger.logError('error obtaining items', error, controllerId);
               });

        }

        function getListProperties(list) {
            var site = vm.site;
            if (vm.subsite) {
                site = vm.subsite;
            }

            getProperties(site, list);
            datacontext.getLists(site)
               .then(function (data) {
                   if (data) {
                       vm.lists = [];
                       vm.lists.push({ title: "", path: "" });
                       for (var i = 0; i < data.length; i++) {
                           vm.lists.push({ title: data[i].Title, path: data[i].Url });
                       }
                   }
               }).catch(function (error) {
                   common.logger.logError('error obtaining items', error, controllerId);
               });
        }

        function getProperties(site, list) {
            vm.properties = [];
            datacontext.getProperties(site, list)
               .then(function (data) {
                   if (data) {
                       vm.properties = data;
                       for (var p in vm.properties) {
                           if (p === "vti_x005f_indexedpropertykeys") {
                               vm.indexedKeysExists = true;
                               vm.indexedKeysValue = vm.properties[p];
                           }
                       }

                        
                   }
               }).catch(function (error) {
                   common.logger.logError('error obtaining items', error, controllerId);
               });
        }

        function openDialog(key, value) {
            vm.propertyName = key;
            vm.propertyValue = value;
            if (key) {
                vm.propertyHeader = "Edit Property";
                vm.propertyNameDisabled = true;
            }
            else {
                vm.propertyHeader = "New Property";
                vm.propertyNameDisabled = false;
            }
            vm.showDialog = true;
        }

        function closeDialog() {
            vm.showDialog = false;
        }

        function openDeleteDialog(key, value) {
            vm.propertyName = key;
            vm.propertyValue = value;
            
            vm.showDeleteDialog = true;
        }

        function closeDeleteDialog() {
            vm.showDeleteDialog = false;
        }

        function saveProperty(site) {
            if (!site) {
                site = vm.site;
                vm.subsite = '';
            }

            if (vm.listname) {
                datacontext.addPropertyBagList(vm.listname, site, vm.propertyName, vm.propertyValue, vm.propertySearchable, vm.indexedKeysExists, vm.indexedKeysValue)
                  .then(function () {
                      common.logger.logSuccess("Property Bag added successfully", null, controllerId);
                      closeDialog();
                      getProperties(site, vm.listname);
                  }).catch(function (error) {
                      common.logger.logError('error obtaining items', error, controllerId);
                  });
            } else {
                datacontext.addPropertyBagWeb(site, vm.propertyName, vm.propertyValue, vm.propertySearchable, vm.indexedKeysExists, vm.indexedKeysValue)
                  .then(function () {
                      common.logger.logSuccess("Property Bag added successfully", null, controllerId);
                      closeDialog();
                      getProperties(site, vm.listname);
                  }).catch(function (error) {
                      common.logger.logError('error obtaining items', error, controllerId);
                  });
            }
        }

        function deleteProperty(site) {
            if (!site) {
                site = vm.site;
                vm.subsite = '';
            }
            datacontext.deletePropertyBagWeb(site, vm.propertyName)
              .then(function () {
                  common.logger.logSuccess("Property Bag deleted successfully", null, controllerId);
                  closeDeleteDialog();
                  getProperties(site, vm.listname);
              }).catch(function (error) {
                  common.logger.logError('error obtaining items', error, controllerId);
              });
        }
        
        function isProperty(data) {
            return ((typeof vm.properties[data]) === 'string')  
             
        }

    }

    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

   
})();

