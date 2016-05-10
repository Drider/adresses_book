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
  .controller('elementAddCtrl', function ($scope,$localStorage,$state,ElementsStore,uiGmapGoogleMapApi) {

    var vm = this;

    //{ latitude: 55.00597621361476, longitude: 82.9412841796875 } NSK coords
    //(54.858417716801455, 83.10723781585693) AZOFT coords
    uiGmapGoogleMapApi.then(function(maps) {

      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
      });

      vm.map = {
        center: { latitude: 54.858417716801455, longitude: 83.10723781585693 },
        zoom: 10,
        mapEvents: {
          'click': function (maps, eventName, originalEventArgs) {
            var e = originalEventArgs[0];

            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());

            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {

                if (results[0]) {
                  $scope.$apply(function () {
                    vm.address = results[0].formatted_address;
                  });

                  console.log(results[0].formatted_address); // details address
                } else {
                  console.log('Location not found');
                }
              } else {
                console.log('Geocoder failed due to: ' + status);
              }
            });


            //console.log(maps, eventName, arg);
            //console.log(arg[0].latLng.lat());
            //console.log(arg[0].latLng.lng());
            //console.log(arg[0].latLng.toJSON());
            //console.log(arg[0].latLng.toString());

            //latLngObj = arg[0].latLng;
            marker.setPosition(latlng.toJSON());
            marker.setMap(maps);
          }
        }
      };
    });

    vm.addRecord = function (valid) {
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
