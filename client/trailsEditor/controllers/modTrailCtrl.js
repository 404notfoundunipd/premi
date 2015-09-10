/**
    * Name:         modTrailCtrl
    * Package:      premi/client/trailsEditor/controllers
    * Author:       Camborata Marco
    * Date:         2015-08-06

    * Use:
    Controller della view modTrail.ng. Permette, tramite lo $scope, di modificare
    un trail in ogni suo aspetto, aggiungendo o togliendo frame, o creando percorsi
    di specializzazione. Fornisce all’utente la possibilità di scorrere il percorso con i
    quattro tasti freccia della tastiera

    
    * Changes:
    Version     Date        Who                 Changes             Reason
    ----------------------------------------------------------------------------
    0.6.1       2015-08-26  Camborata Marco     Rimossi $scope.$on  |troppi conflitti
                                                Aggiunto signalsCtrl|rimozione $on
    ----------------------------------------------------------------------------
    0.6         2015-08-25  Camborata Marco     Sistemati problemi con $on
                                                Aggiunta richiesta di conferma 
                                                eliminazione checkpoint
    ----------------------------------------------------------------------------
    0.5         2015-08-14  Camborata Marco     Riscritto l'algoritmo 
                                                di caricamento dei frame
    ----------------------------------------------------------------------------
    0.4         2015-08-08  Camborata Marco     Aggiunto  visualizzazione e
                                                inserimento dei frame
    ----------------------------------------------------------------------------
    0.3         2015-08-07  Camborata Marco     aggiunti tasti di scorrimento
    ----------------------------------------------------------------------------
    0.2         2015-08-06  Camborata Marco     Aggiunti metodi
    ----------------------------------------------------------------------------
    0.1         2015-08-06  Camborata Marco     Inizio scrittura del codice
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
	.controller("modTrailCtrl", ['$meteor','$scope', '$state','$stateParams','TrailFactory',
		function($meteor,$scope,$state, $stateParams,TrailFactory){

            $(document).ready(function(){
                $('.tooltipped').tooltip({delay: 50});
            });
            var frames = {};
            var infoG = Infographics.findOne({'presid':$stateParams.idpres})		//Collezione degli attributi dell'infografica della presentazione
            var frameCollection = Frames.find({"presid": $stateParams.idpres,'_id':{$in:infoG.framesId}}).fetch();	//Collezione di MongoDB di tutti i frames della presentazione che sono stati inseriti nell'infografica
            var trailCollection = Trails.findOne({"_id" : $stateParams.idtrail});	//Collezione di MongoDB di attributi del trail da modificare
            var idFrames = [];	//Array di codici identificativi dei frames presenti in FrameCollection
            var trilly = [[]]; //Matrice vuota, utilizzata come variabile d'appoggio per l'utilizzo del metodo di MTrail initPath per la sua inizializzazione
            var currentState = 0;
            var states = Object.freeze({
                noState      : 1,
                addingAfter  : 2,
                addingBefore : 3,
                addingIn     : 4,
            });

            $scope.showInSide = false;
            $scope.selectedFrameOut = "";
            $scope.removingChkPnt = false;
            var i = 0;
            $scope.getFramesId = function(){
                return idFrames;
            };
            $scope.getFrames = function(){
                return frames;
            };
            $scope.getTrail = function(){
                return trilly;
            };
            /* utilizza il metodo updateTrail di $meteor per il salvataggio della slide
            */
            $scope.save = function(){
                $meteor.call('updateTrail',$stateParams.idtrail,{trail : TrailFactory.getTrail()});
            };
            var init = function(){
                trilly = trailCollection.trail;
                for(var i=0;i<frameCollection.length;i++){
                    idFrames[i] = frameCollection[i]._id;
                    frames[frameCollection[i]._id] = frameCollection[i];

                }                
            };
            init();
		}]);
