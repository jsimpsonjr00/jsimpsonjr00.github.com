angular.module("AngularApp")
	.directive('buttonsRadio', function() {
        return {
            restrict: 'E',
            scope: { model: '=', options:'='},
            controller: function($scope){
                $scope.toggle = function( option ){ //allow toggle off
                	$scope.model === option ? $scope.model = "" : $scope.model = option;
                };
            },
            templateUrl: 'views/directives/buttonsRadio.html'
        };
    });