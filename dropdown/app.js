var app = angular.use('com.datagoal.components', [
    'com.datagoal.filters'
]);
app.constant('VERSION', '1.2.6');
app.directive('dgDropdown', [
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
                $scope.$show = false;

                $scope.change = function (item, $event) {
                    if ($event) {
                        $event.preventDefault();
                        $scope.$emit('dg-dropdown:change', item.value);
                    }

                    $scope.selected = item.value;

                }

                $scope.label = function (value) {
                    if (value) {
                        var items = $scope.items.filter(function (item) {
                            return angular.equals(item.value, value);
                        });

                        return items.length ? items[0].label : $scope.placeholder;
                    }

                    return $scope.placeholder;
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
            <link rel="stylesheet" ng-href="components/dropdown/app.css">\
            <div class="dropdown combobox inline">\
                <button class="dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">\
                    <div class="input-group">\
                        <input type="hidden" ng-model="selected" ng-required="is_required">\
                        <div class="form-control inline" ng-required="is_required" ng-model="selected" ng-bind-html="label(selected)"></div>\
                        <div class="input-group-addon"><span class="caret"></span></div>\
                    </div>\
                </button>\
                <ul class="dropdown-menu" role="menu">\
                    <li role="presentation" ng-repeat="item in items" ng-class="{selected: is_selected(item, selected)}">\
                        <div ng-if="item.is_group" class="divider"></div>\
                        <a role="menuitem" href="#" tabindex="-1" ng-if="!item.is_group"\
                           ng-click="change(item, $event)"\
                           ng-bind-html="item.label"></a>\
                    </li>\
                </ul>\
            </div>',
            link: function ($scope, el, attrs, transcludeFn) {
                var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)$/,
                    expr = attrs.ngOptions,
                    match;
                var locals = {};

                $scope.items = [];
                $scope.useHtml = attrs.hasOwnProperty('useHtml');
                $scope.placeholder = attrs.hasOwnProperty('placeholder') ? attrs.placeholder : '';
                $scope.is_required = attrs.hasOwnProperty('required');
                /*$scope.name = attrs.hasOwnProperty('name') ? attrs.name : '';*/

                if (match = expr.match(NG_OPTIONS_REGEXP)) {
                    var displayFn = $parse(match[2] || match[1]),
                        valueName = match[3] || match[5],
                        valueFn = $parse(match[2] ? match[1] : valueName),
                        valuesFn = $parse(match[6]);
                    var values = valuesFn($scope.$parent);

                    if (attrs.hasOwnProperty('groupBy')) {
                        values = $filter('groupBy')(values, attrs.groupBy);
                    }

                    if (Array.isArray(values)) {
                        for (var i = 0, ii = values.length; i < ii; i++) {
                            locals[valueName] = values[i];
                            var item = {
                                label: displayFn($scope, locals),
                                value: valueFn($scope, locals) || values[i]
                            };

                            $scope.items.push(item);
                        }
                    } else {
                        Object.keys(values).forEach(function (key) {
                            $scope.items.push({
                                label: key,
                                is_group: true
                            });

                            for (var i = 0, ii = values[key].length; i < ii; i++) {
                                locals[valueName] = values[key][i];
                                var item = {
                                    label: displayFn($scope, locals),
                                    value: valueFn($scope, locals) || values[key][i]
                                };

                                $scope.items.push(item);
                            }
                        });
                    }
                }
            }
        }
    }
]);