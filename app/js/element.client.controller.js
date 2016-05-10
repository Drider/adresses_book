'use strict';

angular.module('addressBook')
  .directive("regExInput", function(){
    "use strict";
    return {
      restrict: "A",
      require: "?regEx",
      scope: {},
      replace: false,
      link: function(scope, element, attrs, ctrl){
        element.bind('keypress', function (event) {
          var regex = new RegExp(attrs.regEx);
          var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
          if (!regex.test(key)) {
            event.preventDefault();
            return false;
          }
        });
      }
    };
  })

  // elements list page ctrl
  //
  .controller('elementListCtrl', function ($localStorage,$state,ElementsStore) {
    var vm = this;
    vm.elementsData = [];

    //Load records
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

  // element detail view page ctrl
  //
  .controller('elementDetailCtrl', function ($localStorage,$state,$stateParams,ElementsStore,uiGmapGoogleMapApi,uiGmapIsReady) {
    var vm = this;

    //Load records
    ElementsStore.loadAll();

    if ($stateParams.id) {
      //Get record by id
      ElementsStore.get($stateParams.id)
        .then(function (data) {
          vm.oneElement = data;
          vm.mapCenter = { latitude:  +data.address.location.lat, longitude: +data.address.location.lng };
          console.log(vm.mapCenter);

          vm.map = {
            center: vm.mapCenter,
            zoom: 10
          };

          uiGmapIsReady.promise(1).then(function(instances) {
            vm.mapInst = instances[0];
            console.log(vm.mapInst);
            //add marker to the map
            new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              position: data.address.location,
              map:vm.mapInst.map
            });
          });

          vm.setMapCenter = function () {
            if (vm.mapInst) {
              vm.mapInst.map.setCenter(data.address.location);
            }
          }

        });



    }
    


  })

  // add element page ctrl
  //
  .controller('elementAddCtrl', function ($scope,$localStorage,$state,ElementsStore,uiGmapGoogleMapApi,uiGmapIsReady) {

    var vm = this;
    var marker;
    //Load records
    ElementsStore.loadAll();

    vm.map = {
      center: {latitude: 55.00597621361476, longitude: 82.9412841796875},
      zoom: 10,
      mapEvents: {
        'click': function (maps, eventName, originalEventArgs) {
          var e = originalEventArgs[0];

          var geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());

          geocoder.geocode({'latLng': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

              if (results[0]) {
                $scope.$apply(function () {
                  vm.address = results[0].formatted_address;
                  vm.latLng = latlng.toJSON();
                });

                console.log(results[0].formatted_address); // details address
              } else {
                console.log('Location not found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
          });

          marker.setPosition(latlng.toJSON());
        }
      }
    };

    uiGmapIsReady.promise(1).then(function(instances) {
      var inst = instances[0];

      vm.latLng = null;
      marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map:inst.map
      });

    });

    vm.addRecord = function (formCtrl) {
      console.log(formCtrl);
      if (formCtrl.$valid) {
        vm.newElem = {
          add_time: Date.now(),
          name: vm.name,
          address: {
            formatted_address: vm.address,
            location: vm.latLng
          }
        };
        ElementsStore.add(generateRandomAlphaNum(8),vm.newElem);

        vm.name = vm.address = '';
        formCtrl.$setPristine();
        formCtrl.$setUntouched();
      }

    };

    //helper func to generate random ID
    function generateRandomAlphaNum(len) {
      var rdmString = "";
      for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
      return  rdmString.substr(0, len);
    }

  });
