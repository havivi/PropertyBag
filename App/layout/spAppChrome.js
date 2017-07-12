(function () {
  'use strict';

  // define controller
  var controllerId = 'spAppChrome';
  angular.module('app').controller(controllerId,
    ['$rootScope', 'spContext', 'common', 'config', spAppChrome]).directive('raw', ['$sce', function ($sce) {
        var directive = {
            replace: true,
            scope: {
                src: '='
            },
            template: '<pre class="code" ng-bind-html="data"></pre>',
            restrict: 'E',
            link: function (scope, element) {
                var template = angular.element(document.getElementById(scope.src));
                scope.data = $sce.trustAsHtml(element.text(template.html()).html());
            }
        };

        return directive;
    }]);

  // create controller
  function spAppChrome($rootScope, spContext, common, config) {
    var vm = this;
    var logger = common.logger;
    var spChromeControlData = undefined;

    // init controller
    init();

    // init controller
    function init() {
      // create chrome control settings
      spChromeControlData = {
        siteUrl: spContext.hostWeb.url,
        siteTitle: spContext.hostWeb.title,
        appHelpPageUrl: "javascript:openHelp('help')",
        appIconUrl: spContext.hostWeb.logoUrl,
        appTitle: config.title,
        settingsLinks: [
          {
            linkUrl: "/Settings",
            displayName: "Settings"
          }, {
              linkUrl: "/AboutMe",
              displayName: "About Me"
          }, {
              linkUrl: "/News",
              displayName: "Write a blog"
          }
        ]
      };

      // create the sharepoint chrome control
      var nav = new SP.UI.Controls.Navigation("chrome_ctrl_container", spChromeControlData);

      // show chrome control
      nav.setVisible(true);

      // hide top app chrome (image & app name)
      nav.setBottomHeaderVisible(false);

      logger.log("spAppChrome loaded", null, controllerId);
      common.activateController([], controllerId);
    }

      

  }

})();

function openHelp(msg) {
    alert(msg)
}