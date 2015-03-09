var app = angular.use('com.datagoal.components', [
    'ngSanitize',
    'com.datagoal.filters'
]);
app.constant('VERSION', '1.0.0');
app.directive('dgBtnGroup', [
    '$parse',
    '$filter',
    function ($parse, $filter) {
        return {
            restrict: 'AE',
            require: '?ngModel',
            transclude: true,
            replace: false,
            scope: {
                selected: '=ngModel'
            },

            controller: function ($scope) {
                $scope.items = [];

                $scope.change = function (item, $event) {
                    if ($event) $event.preventDefault();

                    $scope.selected = item.value;
                    $scope.$emit('dg-btn-group:change');
                }

                $scope.is_selected = function (a, b) {
                    var eq = angular.equals(a.value, b);

                    if (eq) {
                        $scope.change(a);
                    }

                    return eq;
                }
            },
            template: '\
            <div class="btn-group">\
                <button class="btn btn-default" ng-class="{active: is_selected(item, selected) }"\
                    ng-repeat="item in items" title="{{ item.label | striptags }}" data-original-title="{{ item.label | striptags }}"\
                    ng-click="change(item)" bs-tooltip ng-bind-html="item.label | striptext">\
                </button>\
            </div>',
            link: function ($scope, el, attrs, transcludeFn) {
                var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)$/,
                    expr = attrs.ngOptions,
                    match;
                var locals = {};

                $scope.items = [];

                if (match = expr.match(NG_OPTIONS_REGEXP)) {
                    var displayFn = $parse(match[2] || match[1]),
                        valueName = match[3] || match[5],
                        valueFn = $parse(match[2] ? match[1] : valueName),
                        valuesFn = $parse(match[6]);
                    var values = valuesFn($scope.$parent);


                    for (var i = 0, ii = values.length; i < ii; i++) {
                        locals[valueName] = values[i];
                        var item = {
                            label: displayFn($scope, locals),
                            value: valueFn($scope, locals) || values[i]
                        };

                        $scope.items.push(item);
                    }
                }
            }
        }
    }
]);