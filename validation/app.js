var app = angular.use('com.datagoal.components', [
    'com.datagoal.filters'
]);
app.constant('VERSION', '1.0.0');
app.directive('dgFormValidation', [
    '$parse',
    function ($parse) {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {},
            template: '\
            <span class="glyphicon glyphicon-ok" aria-hidden="true" ng-show="form.$valid"></span>\
            <span class="glyphicon glyphicon-warning-sign" aria-hidden="true" ng-show="form.$invalid"></span>',
            controller: function ($scope) {
            },
            link: function ($scope, $elem, attrs, transcludeFn) {
                $elem.addClass('input-group-addon');
                var fieldFn = $parse(attrs.dgFormValidation);
                $scope.form = fieldFn($scope.$parent);
            }
        };
    }
]);