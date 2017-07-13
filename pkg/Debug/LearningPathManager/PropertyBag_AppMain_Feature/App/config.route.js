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
            topNavigationEnabled: false
          }
        }
      },
      {
        url: '/news',
        config: {
            templateUrl: 'app/news/news.html',
          title: 'News',
          settings: {
            nav: 1,
            content: 'News',
            topNavigationEnabled: true
          }
        }
       
      },
      {
          url: '/menu',
          config: {
              templateUrl: 'app/dashboard/dashboard.html',
              title: 'menu2',
              settings: {
                  nav: 2,
                  content: 'Item 2',
                  topNavigationEnabled: true
              }
          }

      }

    ];
  }
})();