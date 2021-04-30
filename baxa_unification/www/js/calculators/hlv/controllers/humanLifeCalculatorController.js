unificationBAXA.controller('humanLifeCalculatorController', [
	 '$rootScope',
    '$scope',
    '$log',
    '$state',
function($rootScope,
				 $scope,
				 $log,
				 $state) {
					 
	$scope.calculate = function (){
			$state.go('humanLifeCalculatorOutput');
	}

}]);
