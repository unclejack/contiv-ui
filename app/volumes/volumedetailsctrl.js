/**
 * Created by vjain3 on 4/15/16.
 */
angular.module('contiv.volumes')
    .config(function ($stateProvider) {
        $stateProvider
            .state('contiv.volumes.details', {
                url: '/details/:key',
                controller: 'VolumeDetailsCtrl as volumeDetailsCtrl',
                templateUrl: 'volumes/volumedetails.html'
            });
    })
    .controller('VolumeDetailsCtrl', ['$state', '$stateParams', '$scope', '$interval', 'VolumesModel',
        function ($state, $stateParams, $scope, $interval, VolumesModel) {
            var volumeDetailsCtrl = this;

            function returnToVolumes() {
                $state.go('contiv.volumes');
            }
            function deleteVolume() {
                VolumesModel.delete(volumeDetailsCtrl.volume);
                returnToVolumes();
            }

            function getVolumeInfo(reload) {
                VolumesModel.getModelByKey($stateParams.key, reload)
                    .then(function (volume) {
                        volumeDetailsCtrl.volume = volume;
                    });
            }

            volumeDetailsCtrl.deleteVolume = deleteVolume;

            //Load from cache for quick display initially
            getVolumeInfo(false);

            var promise = $interval(function () {
                getVolumeInfo(true);
            }, 5000);

            //stop polling when user moves away from the page
            $scope.$on('$destroy', function () {
                $interval.cancel(promise);
            });

        }]);