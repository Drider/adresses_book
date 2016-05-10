'use strict';

var coreModule = angular.module('core');

coreModule.controller('mainCtrl', function($localStorage) {
  var vm = this;

  vm.storage = $localStorage;
  vm.storage.count = 1;


});