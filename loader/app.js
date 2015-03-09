var app = angular.use('com.datagoal.components', [
    'com.datagoal.filters'
]);
app.constant('VERSION', '1.0.2');
app.factory('Spin', function () {
    function Spin(elem) {
        var $elem = elem;

        this.show = function () {
            $elem.show();
        }

        this.hide = function () {
            $elem.hide();
        }
    }

    Spin.show = angular.noop;
    Spin.hide = angular.noop;

    return Spin;
});
app.factory('httpResponseInterceptor', [
    '$q',
    function ($q) {
        return {
            response: function (response) {
                app.SpinProvider.$get().hide();
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                app.SpinProvider.$get().hide();
                return $q.reject(rejection);
            }
        }
    }
]);
app.config(function ($httpProvider, SpinProvider) {
    app.SpinProvider = SpinProvider;

    $httpProvider.interceptors.push('httpResponseInterceptor');

    $httpProvider.defaults.transformRequest.push(function (data) {
        SpinProvider.$get().show();
        return data;
    });
});
app.directive('dgLoader', [
    'Spin',
    function (Spin) {
        return {
            restrict: 'AE',
            transclude: true,
            replace: false,
            scope: {

            },
            template: '\
                <link rel="stylesheet" ng-href="components/loader/app.css">\
                    <div class="dg-spin">\
                    <span class="fa fa-spin fa-spinner"></span>\
                </div>\
                <div class="modal-backdrop">\
                </div>',
            link: function ($scope, $elem, attrs, transcludeFn) {
                app.SpinProvider.$get = function () {
                    return new Spin($elem);
                }

                app.SpinProvider.$get().hide();
            }
        }
    }
]);