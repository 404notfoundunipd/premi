/** 
    * Name:         routes.js    
    * Package:      premi/client/userManager
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

angular.module("premi.userManager")
	.config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
		function($urlRouterProvider, $stateProvider, $locationProvider){

			$locationProvider.html5Mode(true);

			$stateProvider
				.state('premi.userManager', { 
					abstract: true,
					templateUrl: 'client/userManager/views/userManager.ng.html',
					onEnter: function() {
						$('html').addClass('grey darken-4');
					},
					onExit: function () {
						$('html').removeClass('grey darken-4');
					}
				})
				.state('premi.userManager.signin', { 
					url: '/signin',
					views: {
						'' : {
							templateUrl: 'client/userManager/views/signin.ng.html',
							controller: 'signinCtrl'
						}
					},
					resolve: {
						currentUser : ["$meteor", function($meteor){
					    	return $meteor.waitForUser();
					    }]
					}
				})
				.state('premi.userManager.signup', { 
					url: '/signup',
					views: {
						'' : {
							templateUrl: 'client/userManager/views/signup.ng.html',
							controller: 'signupCtrl'
						}
					},
					resolve: {
						currentUser : ["$meteor", function($meteor){
					    	return $meteor.waitForUser();
					    }]
					}
				})
				.state('premi.userManager.changePassword', { 
					url: '/changepassword',
					views: {
						'' : {
							templateUrl: 'client/userManager/views/changePassword.ng.html',
							controller: 'changePasswordCtrl'
						}
					},
					resolve: {
						currentUser : ["$meteor", function($meteor){
					    	return $meteor.requireUser();
					    }]
					}
				})
                .state('premi.userManager.signout', {
					url: '/signout',
					views: {
						'' : {
							controller: 'signoutCtrl'
						},
					},
					resolve: {
						currentUser : ["$meteor", function($meteor){
					    	return $meteor.requireUser();
					    }]
					}
				});

			//$urlRouterProvider
			//	.when('/', '/home')
			//	.when('/presentation', '/presentation/list')
			//	.otherwise('home');
		}
	]);