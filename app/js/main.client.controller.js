'use strict';

angular.module('core')
  .controller('mainCtrl', function($scope,$state,ElementsStore) {
    var vm = this;
    vm.asyncSelected = undefined;

    vm.getElements = getElements;

    $scope.$watch(function () {
      return vm.asyncSelected;
    }, function(current, original) {
      vm.isCheckVal = angular.isObject(current) && current.hasOwnProperty('_id');
    });

    function getElements (val) {
      return ElementsStore.get().then(function (data) {
        var arr = [];
        angular.forEach(data, function(value, key) {
          value._id = key;
          (value.name.toLocaleLowerCase().indexOf(val) > -1) && this.push(value);
        }, arr);
        return arr;
      })
    }

  });