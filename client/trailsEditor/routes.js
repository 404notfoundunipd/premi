/** 
    * Name:         routes.js    
    * Package:      premi/client/trailsEditor
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

angular.module("premi.editor.trailsEditor")
	.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
		function($urlRouterProvider, $stateProvider, $locationProvider){

			$locationProvider.html5Mode(true);

			$stateProvider
				.state('premi.editor.trails', {
					abstract: true,
					views: {
						'' : {
							template: '<div ui-view></div>',
							controller: 'trailsEditorCtrl',
						},
					},
					data: {
						defaultState: 'premi.editor.trails.list'
					}
				})
				.state('premi.editor.trails.list', {
					url: '/editor/:idpres/trails',
					views: {
						'' : {
							templateUrl: 'client/trailsEditor/views/listTrail.ng.html',
							controller: 'listTrailCtrl',
						}
					},
					resolve: {
						'subscribe': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getTrailsByPresId', $stateParams.idpres);
						}]
					}
				})
				.state('premi.editor.trails.new', {
					url: '/editor/:idpres/trails/new',
					views: {
						'': {
							templateUrl: 'client/trailsEditor/views/newTrail.ng.html',
							controller: 'newTrailCtrl',
						}					}
				})
				.state('premi.editor.trails.remove', {
					url: '/editor/:idpres/trails/remove/:idtrail',
					views: {
						'': {
							templateUrl: 'client/trailsEditor/views/removeTrail.ng.html',
							controller: 'removeTrailCtrl',
						}
					},
					resolve: {
						'subscribe': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getTrailById', $stateParams.idtrail);
						}]
					}
				})
				.state('premi.editor.trails.edit', {
					url: '/editor/:idpres/trails/edit/:idtrail',
					views: {
						'': {
							templateUrl: 'client/trailsEditor/views/editTrail.ng.html',
							controller: 'editTrailCtrl',
						}
					},
					resolve: {
						'subscribe': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							return $meteor.subscribe('getTrailById', $stateParams.idtrail);
						}]
					}
				})
				.state('premi.editor.trails.modTrail', {
					url: '/editor/:idpres/trails/:idtrail',
					views: {
						'': {
							templateUrl: 'client/trailsEditor/views/modTrail.ng.html',
							controller: 'modTrailCtrl',
						}
					},
					resolve: {
						'subscribe1': [ "$meteor", "$stateParams", function($meteor, $stateParams) {
							console.log($stateParams.idtrail)
							$meteor.subscribe('getTrailById', $stateParams.idtrail).then(function(sub){});
						}],
						'subscribe2': [ "$meteor","$stateParams", function($meteor,$stateParams) {
							return $meteor.subscribe('getInfographicFrames',$stateParams.idpres);
						}],
						'subscribe3': [ "$meteor","$stateParams", function($meteor,$stateParams) {
							return $meteor.subscribe('getInfographicByPresId',$stateParams.idpres);
						}],
					},
				})
				.state('premi.editor.trails.removeChkPnt', {
					url: '/editor/:idpres/trails/:idtrail/removeChkPnt/:idChkPnt',
					views: {
						'': {
							templateUrl: 'client/trailsEditor/views/removeChkPnt.ng.html',
							controller: 'removeChkPntCtrl',
						}
					},
				});
		}
	]);