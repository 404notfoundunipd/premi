/** 
    * Name:         routes.js    
    * Package:      premi/client/viewer
    * Author:       De Lazzari Enrico
    * Date:         2015-6-4

    * Use:
    I file routes.js utilizzano $rootScope, $state e $stateProvider per la configurazione
    degli stati, o posizioni, che l'utente può percorrere all'interno dell'applicazione.
    View e controller devono essere uniti tra loro, e le informazioni di cui hanno bisogno
    devono essere precaricate dal database e associate allo stato tramite $meteor.subscribe
    
    * Changes:
    Version     Date        Who             	Changes             Reason
    ----------------------------------------------------------------------------
    0.1         2015-6-4    De Lazzari Enrico   stesura iniziale
    ----------------------------------------------------------------------------

    * Created by 404Notfound for Premi - Better than Prezi!

    * Premi is a free software: you can redistribute it and/or modify
    * it under the terms of the GNU General Public License as published by
    * the Free Software Foundation, either version 3 of the License, or
    * (at your option) any later version.

    * This program is distributed in the hope that it will be useful,
    * but WITHOUT ANY WARRANTY; without even the implied warranty of
    * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    * GNU General Public License for more details.

    * You should have received a copy of the GNU General Public License
    * along with this program. If not, see <http://www.gnu.org/licenses/>
*/

angular.module("premi.viewer")
	.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
		function($urlRouterProvider, $stateProvider, $locationProvider){

			$locationProvider.html5Mode(true);

			$stateProvider
				.state('premi.viewer',{
					abstract: true,
					template: '<div ui-view></div>'
				})
				.state('premi.viewer.trails', {
					url: '/present/:idpres',
					views: {
						'' : {
							templateUrl: 'client/viewer/views/trails.ng.html',
							controller: 'trailsCtrl',
						}
					},
					resolve : {
						currentUser : ["$meteor", function($meteor){
					    	return $meteor.requireUser();
					    }],
					    'subscribe1': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getTrailsByPresId', $stateParams.idpres);
						}],
					}
				})
				.state('premi.viewer.show', {
					url: '/present/:idpres/trail/:idtrail',
					views: {
						'' : {
							templateUrl: 'client/viewer/views/viewer.ng.html',
							controller: 'viewerCtrl',
						}
					},
					resolve: {
						currentUser : ["$meteor", function($meteor){
					    	return $meteor.requireUser();
					    }],
					    'params' : ['$q', '$stateParams', function($q, $stateParams) {
					    	if ($stateParams.idpres == "" || $stateParams.idtrail == "") {
					    		return $q.reject("PARAMS_REQUIRED");
					    	}
					    	return true;
					    }],
					    'subscribe0': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getPresentationById', $stateParams.idpres);
						}],
					    'subscribe1': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getTrailById', $stateParams.idtrail);
						}],
						'subscribe2': [ "$meteor","$stateParams", function($meteor,$stateParams) {
							return $meteor.subscribe('getInfographicFrames',$stateParams.idpres);
						}],
						'subscribe3' : ["$meteor","$stateParams", function($meteor,$stateParams) {
							return $meteor.subscribe('getInfographicByPresId',$stateParams.idpres);
						}],
					}
				});
		}
	]);