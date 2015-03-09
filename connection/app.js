var app = angular.use('com.datagoal.components', [
    'com.datagoal.filters'
]);
app.constant('VERSION', '1.0.0');
app.factory('Connection', function () {
    return function ($timeout, $http) {
        var CONN_TIMEOUT = 15000,
            CONNECTIVITY_TEST_URL = 'conn';

        var self = this;

        this.online = true;

        this.lookup = function () {
            $timeout(function () {
                $http({
                    method: 'get',
                    url: CONNECTIVITY_TEST_URL,
                    timeout: CONN_TIMEOUT
                })
                .success(function () {
                    self.online = true;
                })
                .error(function () {
                    self.online = false;
                });

                self.lookup();
            }, CONN_TIMEOUT);
        }
    }
});
app.directive('dgConnection', [
    '$timeout',
    '$http',
    'Connection',
    function ($timeout, $http) {
        return {
            restrict: 'AE',
            transclude: true,
            replace: false,
            scope: {

            },
            controller: function ($scope) {
                $scope.conn = new Connection($timeout, $http);
                $scope.conn.lookup();
            },
            template: '\
                <div class="alert" ng-if="!conn.online" ng-cloak>\
                <div class="text-center">\
                    <span dg-trans>Connection lost, retrying in</span>\
                    <span dg-timer="15"></span>\
                    <span dg-trans>seconds...</span>\
                </div>\
            </div>'
        }
    }
]);