(function () {
  'use strict';

  // define controller
  var controllerId = 'dashboard';
  angular.module('app').controller(controllerId,
    ['common', dashboard]);

  // init controller
  function dashboard(common) {
    var vm = this;
    var logger = common.logger;

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
                   vm.sites = data;
                   
               }
           }).catch(function (error) {
               common.logger.logError('error obtaining items', error, controllerId);
           });
    }

  }
})();

