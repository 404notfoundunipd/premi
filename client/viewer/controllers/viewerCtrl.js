/**
    * Name:         viewerCtrl.js
    * Package:      premi/client/viewer/controllers
    * Author:       De Lazzari Enrico
    * Date:         2015-08-03

    * Use:
    Controller della vista generata dal template viewer.ng. Fornisce, tramite lo $sco-
    pe, gli attributi ed i metodi necessari alla visualizzazione a allo scorrimento della
    presentazione tramite la libreria impress.js
    
    * Changes:
    Version     Date        Who                 Changes                 Reason
        ----------------------------------------------------------------------------
    0.7         2015-08-26  Cossu Mattia        eliminazione $scope.$on |troppi conflitti
    ----------------------------------------------------------------------------
    0.6         2015-08-13  Cossu Mattia        correzione errore 
                                                uscita da checkpoint
    ----------------------------------------------------------------------------
    0.5         2015-08-12  De Lazzari Enrico   Correzione interazione con impress
    ----------------------------------------------------------------------------
    0.4         2015-08-10  De Lazzari Enrico   pre_init                Correzione errori,
                                                                            miglioramento algoritmo
    ----------------------------------------------------------------------------
    0.3         2015-08-05  De Lazzari Enrico   Incremento Controller, codifica 
                                                    della gestione degli eventi
    ----------------------------------------------------------------------------
    0.2         2015-08-04  Cossu Mattia        Incremento Controller
    ----------------------------------------------------------------------------
    0.1         2015-08-02  De Lazzari Enrico   inizio codifica controller
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
    .controller("viewerCtrl", [ '$scope', '$meteor', '$state', '$stateParams', 'TrailFactory','InfographicFactory','OrderedGOListFactory','$timeout','signalsCtrl',
        function($scope, $meteor, $state, $stateParams, TrailFactory, InfographicFactory,OrderedGOListFactory,$timeout,signalsCtrl){

            $scope.idtrail = $stateParams.idtrail;

            $scope.play_active = false; 
            $scope.bgColor = "white";    

            var infographicCollection = [];	//Contiene l'infografica della presentazione
            var frameCollection = [];		//Collezione dei frame inseriti all'interno dell'infografica
            var trailCollection = [];		//Contiene il trail che l'utente intende visualizzare
            var MTrail = TrailFactory;		//Oggetto Trail per la gestione del percorso di presentazione
            var list = OrderedGOListFactory.initializeList().setOrderBy('lvl');	//Oggetto OrderedGOList per il caricamento degli oggetti grafici dei frame e dell'infografica
            var setSvg = function(){
                $(document).ready(function(){
                    var cont = list.getList();
                    for(var key in cont){
                        if(cont[key].type == "shape"){
                            $('#'+cont[key]._id+' path').attr('fill',cont[key].color);
                            $('#'+cont[key]._id+' path').attr('d',cont[key].path);
                        }
                        else if(cont[key].type == "frame"){
                            var fcont = cont[key].content;
                            for(var sh in fcont){
                                if(fcont[sh].type == "shape"){
                                    $('#'+fcont[sh]._id+' path').attr('fill',fcont[sh].color);
                                    $('#'+fcont[sh]._id+' path').attr('d',fcont[sh].path);
                                }
                            }
                        }
                    }
                });
            };

	    /* Prepara gli attributi privati dello $scope per la visualizzazione della presentazione
	    */
            $scope.pre_init = function(){
                var pres = Presentations.findOne({'_id' : $stateParams.idpres});
                if (!pres) {
                    alert('testing');
                    $state.go('premi.presentationManager.presentations');
                }

                infographicCollection = Infographics.findOne({"presid" : $stateParams.idpres});
                $scope.bgColor = infographicCollection.background.color;

                frameCollection = Frames.find({"_id" : {$in : infographicCollection.framesId}}).fetch();

                console.log(frameCollection);

                trailCollection = Trails.findOne({"_id" : $stateParams.idtrail});
                simpleContentCollection = infographicCollection.content;
                console.log("simplecontent",simpleContentCollection);
                for(var i = 0; i < frameCollection.length; i++){
                    list.insertGO(frameCollection[i]);
                }
                var tempFrameList = [];
                for(var i = 0, li = list.getList(); i < li.length; i++){
                    tempFrameList[i] = li[i]._id;
                }
                for(var key in simpleContentCollection){
                    if(simpleContentCollection.hasOwnProperty(key)){
                        list.insertGO(simpleContentCollection[key]);
                    }
                }
                for(var i=0, li=list.getList(); i<li.length; i++){
                    tempFrameList[i] = li[i]._id;
                }
                MTrail.initPath(tempFrameList,trailCollection.trail);
                $timeout(function() {setSvg()});
            };
            
            /* Imposta play_active a true e invia un segnale a impress.js per avviare la presentazione
            */
            $scope.init = function(){               
                $scope.play_active = true;
                $('body').removeClass('grey darken-4');
                $('#impresshook').removeClass('hide');
                if(MTrail.isTrailEmpty()){
                    $timeout(function(){$scope.$emit('initImpress',0);});
                    return;
                }
                $timeout(function(){$scope.$emit('initImpress',MTrail.goToFirst().getCurrentIndex());});
            };
            $scope.getContent = function(){
                return list.getList();
            };

            $scope.isCurrentCheck = function(){
                console.log(MTrail.isCurrentSlideChkPnt())
                return MTrail.isCurrentSlideChkPnt();
            };

            $scope.prev = function(){
                MTrail.prevSlide(); 
                $scope.currentSlide = MTrail.getCurrentIndex();
                if(!MTrail.isTrailEmpty())
                    $scope.goToSlide();
            };

            $scope.next =function(){
                MTrail.nextSlide(); 
                $scope.currentSlide = MTrail.getCurrentIndex();
                if(!MTrail.isTrailEmpty())
                    $scope.goToSlide();
            };

            $scope.returnTo = function(){
                MTrail.returnToCheckPoint();
                $scope.currentSlide = MTrail.getCurrentIndex();
                if(!MTrail.isTrailEmpty())
                    $scope.goToSlide();
            };

            $scope.enterIn = function(){
                MTrail.enterInCheckPoint();
                $scope.currentSlide = MTrail.getCurrentIndex();
                if(!MTrail.isTrailEmpty())
                    $scope.goToSlide();
            };

            $scope.showCheck = function(){
                return !MTrail.isSlideInFirstPath();
            };

            signalsCtrl.removeAllSignals();
            signalsCtrl.initSignal('viewer',document,'keydown',function (e) {
                event.preventDefault();
                var keyCode = e.keyCode || e.which,
                    arrow = {
                        left: 37,
                        up: 38,
                        right: 39,
                        down: 40
                    };
                switch (keyCode) {
                    case arrow.left:
                        MTrail.prevSlide();                        
                        break;
                    case arrow.up:
                        MTrail.returnToCheckPoint();                        
                        break;
                    case arrow.right:
                        MTrail.nextSlide();                       
                        break;
                    case arrow.down:
                        MTrail.enterInCheckPoint();                        
                        break;
                }
                $scope.currentSlide = MTrail.getCurrentIndex();
                if(!MTrail.isTrailEmpty())
                    $scope.goToSlide();
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            });
            $scope.pre_init();
            
  }]);

  
