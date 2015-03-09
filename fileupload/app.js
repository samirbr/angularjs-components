var app = angular.use('com.datagoal.components', [
    'com.datagoal.filters'
]);
app.constant('VERSION', '1.0.0');
app.directive('dgFileUpload', [
    '$http',
    '$filter',
    '$parse',
    function ($http, $filter, $parse) {
        return {
            restrict: 'AE',
            require: '?ngModel',
            transclude: true,
            replace: false,
            scope: {
                file: '=ngModel'
            },

            controller: function ($scope) {
                $scope.thumbnail_url = null;

                $scope.cancel = function ($event) {
                    $scope.file = null;
                }

                $scope.upload = function ($event) {
                    var file = $event.target.files[0];

                    $scope.file = file.name;

                    if (file.name.match(new RegExp('.*\\.(' + $scope.allowed.join('|') +  ')'))) {
                        $(new FileReader()).on('error', function () {
                            console.log(arguments);
                        }).on('load', function (event) {
                            $http({
                                url: $scope.url,
                                method: 'post',
                                data: {
                                    filename: file.name,
                                    thumbnail: $scope.thumbnail,
                                    data: event.target.result
                                },
                                success: function (response) {
                                    $scope.thumbnail_url = response.thumbnail_url;
                                    console.log(response);
                                },
                                error: function (response) {
                                    $scope.message = $filter('trans')('Error uploading...');
                                    console.log(response);
                                }
                            });
                        }).get(0)
                        .readAsText(file);
                    } else {
                        $scope.message = $filter('trans')('Extensions allowed: ')
                            + $scope.allowed.join(',');
                    }
                }

                $scope.choose = function ($event) {
                    var $file = $($event.target)
                        .parent()
                        .siblings(':file')
                        .get(0);
                    $file.click();
                }
            },
            template: '\
            <div>\
                <div class="input-group col-md-12">\
                    <input type="file" class="hide" ng-model="file" onchange="angular.element(this).scope().upload(event)">\
                    <span class="form-control filename">{{ file }}</span>\
                    <div class="input-group-btn">\
                        <button class="btn btn-default" ng-click="cancel($event)" ng-show="file">\
                            <span class="icon-dg icon-dg-trash"></span>\
                        </button>\
                        <button class="btn btn-default" ng-click="choose($event)" dg-trans>Choose</button>\
                    </div>\
                </div>\
                <div ng-show="thumbnail_url">\
                    <a href="#" class="thumbnail">\
                      <img ng-src="thumbnail_url">\
                    </a>\
                </div>\
            </div>',
            link: function ($scope, el, attrs, transcludeFn) {
                $scope.url = attrs.url;
                $scope.thumbnail = $scope.$eval(attrs.thumbnail);
                $scope.allowed = attrs.allowed.split(',').map(function (extension) {
                    return extension.trim();
                });
            }
        }
    }
]);