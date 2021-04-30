eAppModule.controller('appFormController', ['$scope',
  '$q',
  '$state',
  '$http',
  '$log',
  '$rootScope',
  function($scope, $q, $state, $http, $log, $rootScope) {
    $scope.array = [];
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.dateofbirth = "";
    $scope.educationalQualification = "";
    $scope.gender = "";

    $scope.genderSelection = function(gender) {
      $scope.gender = gender;
    };

    $scope.onSend = function(firstname1, lastname1, dateofbirth1, educationalQualification1, gender1) {
      if ($scope.array.length === 0) {
        $scope.array.push(1);
        $scope.firstname = firstname1;
        return;
      }
      if ($scope.array.length == 1) {
        $scope.array.push(1);
        $scope.lastname = lastname1;
        return;
      }
      if ($scope.array.length == 2) {
        $scope.array.push(1);
        $scope.dateofbirth = dateofbirth1;
        return;
      }
      if ($scope.array.length == 3) {
        $scope.array.push(1);
        $scope.educationalQualification = educationalQualification1;
        return;
      }
      if ($scope.array.length == 4) {
        $scope.array.push(1);
        $scope.gender = gender1;
        return;
      }
      if ($scope.array.length > 4) {
        $scope.array.push(1);
        return;
      }
    };
  }
]);
