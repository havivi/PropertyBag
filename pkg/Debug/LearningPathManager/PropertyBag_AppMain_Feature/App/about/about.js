(function () {
    'use strict';

    // define controller
    var controllerId = 'about';
    angular.module('app').controller(controllerId,
      ['common', about]);

    // init controller
    function about(common) {
        var vm = this;
        var logger = common.logger;

        // init controller
        init();

        // init controller
        function init() {
          
            logger.log("controller loaded", null, controllerId);
            common.activateController([], controllerId);
        }


    }
})();

