'use strict';

angular.module('addressBook')

  // elements list page ctrl
  //
  .controller('elementListCtrl', function ($localStorage,$state,ElementsStore) {
    var vm = this;
    vm.elementsData = [];
    vm.clearStore = clearStore;
    vm.openDetail = openDetail;

    //Load records
    ElementsStore.loadAll()
      .then(function (data) {

        angular.forEach(data, function(value,key) {
          value._id = key;
          this.push(value);
        }, vm.elementsData);

      });

    function clearStore () {
      ElementsStore.clear();
      vm.elementsData = [];
    }

    function openDetail (e, elem) {
      e.preventDefault();

      vm.oneElement = elem;
      $state.go('element-detail',{id:elem._id});
    }

  })

  // element detail view page ctrl
  //
  .controller('elementDetailCtrl', function ($localStorage,$state,$stateParams,ElementsStore,uiGmapGoogleMapApi,uiGmapIsReady) {
    var vm = this;
    vm.lastState = $state.previous.state.name || 'main';

    //Load records
    ElementsStore.loadAll();

    if ($stateParams.id) {
      //Get record by id
      ElementsStore.get($stateParams.id)
        .then(function (data) {
          vm.oneElement = data;
          vm.mapCenterCoords = { latitude:  +data.address.location.lat, longitude: +data.address.location.lng };

          vm.map = {
            center: vm.mapCenterCoords,
            zoom: 10
          };

          uiGmapIsReady.promise(1).then(function(instances) {
            vm.mapInst = instances[0];

            // Create and add marker to the map
            //
            new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              position: data.address.location,
              map:vm.mapInst.map
            });

          });

          vm.setMapCenter = function setMapCenter () {
            if (vm.mapInst) {
              vm.mapInst.map.setCenter(data.address.location);
            }
          }

        });

    }

  })

  // add element page ctrl
  //
  .controller('elementAddCtrl', function ($scope,$state,ElementsStore,uiGmapGoogleMapApi,uiGmapIsReady) {

    var vm = this;
    var marker;
    var INIT_MAP_CENTER_COORDS = {latitude: 55.00597621361476, longitude: 82.9412841796875}; // NSK

    vm.latLng = null;
    vm.addRecord = addRecord;

    //Load records
    ElementsStore.loadAll();


    vm.map = {
      center: INIT_MAP_CENTER_COORDS,
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

              } else {
                console.log('Location not found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
          });


          marker.getVisible() || marker.setVisible(true); // check marker visibility
          marker.setPosition(latlng.toJSON());

        }
      }
    };

    uiGmapIsReady.promise(1).then(function(instances) {
      var inst = instances[0];

      marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map:inst.map
      });

    });

    function addRecord (formCtrl) {

      if (formCtrl.$valid) {
        vm.newElem = {
          add_time: Date.now(),
          name: vm.name,
          address: {
            formatted_address: vm.address,
            location: vm.latLng
          }
        };

        // Add new element to localStorage
        //
        ElementsStore.add(generateRandomAlphaNum(8),vm.newElem);

        // clear form and data
        //
        vm.name = vm.address = '';
        formCtrl.$setPristine();
        formCtrl.$setUntouched();
        marker.setVisible(false);
      }

    }
    //helper func to generate random ID
    function generateRandomAlphaNum(len) {
      var rdmString = "";
      for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
      return  rdmString.substr(0, len);
    }


  });
