(function () {
    'use strict';

    // define controller
    var controllerId = 'news';
    angular.module('app').controller(controllerId,
      ['common', news]);

    // init controller
    function news(common) {
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

