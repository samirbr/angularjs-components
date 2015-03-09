var app = angular.use('com.datagoal.components', [
    'com.datagoal.filters'
]);
app.constant('VERSION', '1.1.1');
app.directive('uiSwitch', [
    function () {
        return {
            restrict: 'AE',
            require: '?ngModel',
            transclude: true,
            scope: {
                checked: '=ngModel'
            },
            template: '\
            <link rel="stylesheet" ng-href="components/switch/app.css">\
            <div class="switch">\
                <input type="checkbox" ng-model="checked" class="hide">\
                <div class="switch-bar" ng-class="{on: checked, off: !checked}" ng-click="checked = !checked">\
                    <div class="switch-on" ng-bind="choices[true]"></div>\
                    <div class="switch-btn" ng-bind-html="label"></div>\
                    <div class="switch-off" ng-bind="choices[false]"></div>\
                </div>\
            </div>',
            controller: function ($scope) {
                $scope.choices = {
                    true: 'On',
                    false: 'Off'
                };
                $scope.label = '';
            },
            link: function ($scope, el, attrs, transcludeFn) {
                if (attrs.hasOwnProperty('choices')) {
                    $scope.choices = $scope.$eval(attrs.choices);
                }

                if (attrs.hasOwnProperty('label')) {
                    $scope.label = attrs.label;
                }
            }
        };
    }
]);