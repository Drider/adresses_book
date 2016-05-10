'use strict';

angular.module('addressBook')
  .service('ElementsStore', ['$http', '$q', '$localStorage', function ($http, $q, $localStorage) {
    var _elementsData = {};
    var _LS = $localStorage;
    var _find = function (elementId) {
      return _elementsData[elementId];
    };
    var _retrieveInstance = function(elementId, elementData) {
      var instance = _elementsData[elementId];
      if (!instance) {
        _elementsData[elementId] = elementData;
        instance = _elementsData[elementId];
      }
      return instance;
    };

    this.get = function (elementId) {
      var deferred = $q.defer();
      var elementData = _find(elementId);
      if (elementData) {
        deferred.resolve(elementData);
      } else {
        deferred.resolve( this.load(elementId) );
      }
      return deferred.promise;
    };
    this.add = function (elementId, elementData) {
      _retrieveInstance(elementId, elementData);
      _LS.elementsData = angular.toJson(_elementsData);
      this.load().then(function (data) {
        console.log(data);
      })
    };
    this.load = function (elementId) {
      var deferred = $q.defer();

      var data = _LS.elementsData ? angular.fromJson(_LS.elementsData) : {};
      if (elementId) {
        deferred.resolve( _find(elementId) );
      } else {
        deferred.resolve(data);
      }

      return deferred.promise;
    };
    this.loadAll = function () {
      var deferred = $q.defer();
      var data = _LS.elementsData ? angular.fromJson(_LS.elementsData) : {};
      if ( data ) {

        for (var val in data) {
          if (data.hasOwnProperty(val)) {
            _retrieveInstance(val, data[val]);
          }
        }

      }
      deferred.resolve(_elementsData);
      return deferred.promise;
    };
    this.showAllApartmentData = function () {
      console.log(_elementsData);
    };
    this.isData = function () {
      for (var prop in _elementsData) {
        return true;
      }
      return false;
    };
    this.findData = function (apartmentId) {
      return _find(apartmentId);
    }

  }]);

