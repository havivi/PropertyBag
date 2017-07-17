(function () {
  'use strict';

  var app = angular.module('app');

  // get all the routes
  app.constant('routes', getRoutes());

  // config routes & their resolvers
  app.config(['$routeProvider', 'routes', routeConfigurator]);

  function routeConfigurator($routeProvider, routes) {
    routes.forEach(function (route) {
      $routeProvider.when(route.url, route.config);
    });

    $routeProvider.otherwise({ redirectTo: '/' });
  }

  // build the routes
  function getRoutes() {
    return [
      {
        url: '/',
        config: {
          templateUrl: 'app/dashboard/dashboard.html',
          title: 'Home',
          settings: { 
            nav: 0,
            content: 'Home',
            topNavigationEnabled: true
          }
        }
      },
      {
        url: '/about',
        config: {
            templateUrl: 'app/about/about.html',
          title: 'About',
          settings: {
            nav: 1,
            content: 'About',
            topNavigationEnabled: true
          }
        }
       
      } 

    ];
  }
})();