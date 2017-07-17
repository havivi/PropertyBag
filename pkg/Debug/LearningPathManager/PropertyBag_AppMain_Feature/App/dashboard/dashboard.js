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
        var logger = common.logger;
        vm.sites = [];
        vm.subsites = [];
        vm.lists = [];
        vm.properties = [];
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
            getProperties(site, undefined);
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

        function getListProperties(list) {
            var site = vm.site.path.Value;
            if (vm.subsite) {
                if (vm.subsite.path) {
                    site = vm.subsite.path;
                }
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
            datacontext.getProperties(site)
               .then(function (data) {
                   if (data) {
                       vm.properties = data;

                   }
               }).catch(function (error) {
                   common.logger.logError('error obtaining items', error, controllerId);
               });
        }
    }
})();

