/**
 * Created by cshampur on 6/23/16.
 */
angular.module('contiv.networks')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('contiv.menu.networks.details.stats', {
                url: '/stats',
                controller: 'NetworkStatsCtrl as networkStatsCtrl',
                templateUrl: 'networks/networkstats.html'
            })
        ;
    }])
    .controller('NetworkStatsCtrl',
        ['$state', '$stateParams', '$scope', '$interval', '$filter', 'NetworksModel', 'InspectService',
            function ($state, $stateParams, $scope, $interval, $filter, NetworksModel, InspectService) {

                var networkStatsCtrl = this;

                /* Gets the Network Operational state from the server */
                function getNetworkInspect(refresh){
                    NetworksModel.getInspectByKey($stateParams.key, ContivGlobals.NETWORKS_INSPECT_ENDPOINT, refresh)
                        .then(function (result) {
                            networkStatsCtrl.networkInspectStats = result.Oper;
                            networkStatsCtrl.config = result.Config;
                            if(result.Oper.endpoints!=undefined){
                                var containerDetails = InspectService.buildEndPoints(result.Oper.endpoints);
                                if(InspectService.checkContainerChanged(networkStatsCtrl.containerDetails,containerDetails)){
                                    networkStatsCtrl.endpoints = result.Oper.endpoints;
                                    networkStatsCtrl.containerDetails = containerDetails;
                                }
                            }
                            else{
                                networkStatsCtrl.endpoints = []
                                networkStatsCtrl.containerDetails = {};
                            }
                        });
                }

                getNetworkInspect(false);
                
                var promise;
                //Don't do autorefresh if one is already in progress
                if (!angular.isDefined(promise)) {
                    promise = $interval(function () {
                        getNetworkInspect(true);
                    }, ContivGlobals.REFRESH_INTERVAL);
                }

                //stop polling when user moves away from the page
                $scope.$on('$destroy', function () {
                    $interval.cancel(promise);
                });
            }]);