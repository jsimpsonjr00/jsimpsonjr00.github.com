angular.module("AngularApp")
	.directive('buttonsCheckbox', function() {
        return {
            restrict: 'E',
            scope: { model: '=', options:'='},
            controller: function($scope){
                $scope.toggle = function( option ){
                    $scope.model[ option ] ? delete $scope.model[ option ] : $scope.model[ option ] = true;
                };      
            },
            templateUrl: 'views/directives/buttonsCheckbox.html'
        };
    });