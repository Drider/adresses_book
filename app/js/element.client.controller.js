'use strict';

angular.module('addressBook')
  .controller('elementListCtrl', function ($localStorage,$state,ElementsStore) {
    console.log('load');
    var vm = this;
    vm.elementsData = [];

    ElementsStore.loadAll()
      .then(function (data) {

        angular.forEach(data, function(value,key) {
          value._id = key;
          this.push(value);
        }, vm.elementsData);

      });

    vm.openDetail = function (e, elem) {
      e.preventDefault();

      vm.oneElement = elem;
      $state.go('element-detail',{id:elem._id});

    };



  })
  .controller('elementDetailCtrl', function ($localStorage,$state,$stateParams,ElementsStore) {
    var vm = this;
    ElementsStore.loadAll();
    console.log($stateParams);
    if ($stateParams.id) {
      ElementsStore.get($stateParams.id)
        .then(function (data) {
          console.log(data);
          vm.oneElement = data;
        });
    }

  })
  .controller('elementAddCtrl', function ($localStorage,$state,ElementsStore) {

    var vm = this;

    vm.signup = function (valid) {
      console.log(valid);
      if (valid) {
        vm.newElem = {
          add_time: Date.now(),
          name: vm.name,
          add: vm.addition
        };
        ElementsStore.add(generateRandomAlphaNum(8),vm.newElem);
        vm.name = vm.addition = '';
      }

    };

    function generateRandomAlphaNum(len) {
      var rdmString = "";
      for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
      return  rdmString.substr(0, len);
    }

  });
