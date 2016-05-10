'use strict';

/* App Module */

angular.module('addressBook',[]);

var coreModule = angular.module('core', [
  'ui.router',
  'ngStorage',
  'uiGmapgoogle-maps',
  'addressBook'
]);

angular.module('myApplicationModule', ['uiGmapgoogle-maps']).config(
  ['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyB5OHEhSURGrR-dk8oAH8gggyHzOK_eR8M',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization',
      china: true
    });
  }]
);

coreModule.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/main");
  //
  // Now set up the states
  $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "views/main.client.view.html"
    })
    .state('elements-list', {
      url: "/elements-list",
      templateUrl: "views/elements-list.client.view.html",
    })
    .state('element-detail', {
      url: "/element-detail/:id",
      templateUrl: "views/element-detail.client.view.html"
    })
    .state('add-new-element', {
      url: "/add-new-element",
      templateUrl: "views/add-new-element.client.view.html",
    });
}]);
