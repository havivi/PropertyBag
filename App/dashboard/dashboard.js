﻿(function () {
  'use strict';

  // define controller
  var controllerId = 'dashboard';
  angular.module('app').controller(controllerId,
      ['$location', '$routeParams', 'common', 'datacontext', dashboard]);

  // init controller
  function dashboard($location, $routeParams, common, datacontext) {
    var vm = this;
    var logger = common.logger;
   vm.sites = [];
    // init controller
    init();

    // init controller
    function init() {
      logger.log("controller loaded", null, controllerId);
      common.activateController([], controllerId);
      getSites()
    }
 
    function getSites() {
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

  }
})();

