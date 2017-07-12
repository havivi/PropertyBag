(function () {
  'use strict';

  // create app
  var app = angular.module('app', [
    // ootb angular modules
    'ngRoute',      // app route (url path) support
    'ngCookies',    // cookie read/write support
    'ngSanitize',   // fixes HTML issues in data binding
    'ngResource',   // assists with rest calls
    'ngAnimate',    // animation capabilities
   
    // my custom modules
    'common',
    'officeuifabric.core',
    'officeuifabric.components.callout',
    'officeuifabric.components.searchbox',
    'officeuifabric.components.commandbar'
  ]);

  // startup code
  app.run(['$route','angular.config', function($route, angularConfig) {
    
  }]);
})();

