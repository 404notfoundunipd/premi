/**	
	* Name: 		trailMapCtrl.js
	* Package: 		premi/client/trailMap/controllers/
	* Author: 		Cossu Mattia
	* Date: 		2015-08-26

	* Use:
	Controller della view trailMap.ng. Fornisce, tramite lo $scope i metodi per la modifica 
	o l'aggiunta delle slide che formano il percorso di un trail

	
	* Changes:
	Version		Date		Who 			Changes				Reason
	----------------------------------------------------------------------------
	0.4			2015-08-26	Cossu Mattia	Creazione del controller
	----------------------------------------------------------------------------
	0.3			2015-08-28	Andrea Rettore	aggiunti metodi di settaggio
	----------------------------------------------------------------------------
	0.2			2015-08-30	Enrico De Lazzari  aggiunti metodi di modifica trail
	----------------------------------------------------------------------------
	0.1			2015-09-01	Cossu Mattia	correzzione errori e stesura finale
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

angular.module("premi.trailMap")
	.controller("trailMapCtrl",  ['$scope', 'TrailFactory','$timeout','OrderedGOListFactory', 'standardFrameResolution','signalsCtrl','$parse','$timeout',
		function($scope,TrailFactory,$timeout,OrderedGOListFactory, standardFrameResolution,signalsCtrl,$parse,$timeout){
			$(document).ready(function(){
                $('.tooltipped').tooltip({delay: 50});
            });
			$scope.width  = (standardFrameResolution.width*20)/100;
			$scope.height = (standardFrameResolution.height*20)/100;
			//$scope.trail = TrailMapDataFactory;

			//$scope.trailArray = Trails.findOne({"_id" : 'TAkCYEB8quFSypoyq'});
            var MTrail = TrailFactory;	//Oggetto Trail da modificare. Inizialmente vuoto, dev’essere inizializzato
            var frames = {};	//contiene degli oggetti JSON che rappresentano i frames appartenenti al trail che si sta modificando
            var idFrames = [];	//array che contiene gli identificativi dei frames appartenenti al trail che si sta modificando
            var trilly = [[]];	//Matrice vuota, utilizzata come variabile d’appoggio per l’utilizzo del metodo di MTrail initPath per la sua inizializzazione
            var idCheckForInsert = "";
            var selectedFrames={};	//contiene gli oggetti JSON dei frames che sono stati selezionati nella vista trailMap.ng

            $scope.showInSide = false;
            $scope.selectedFrameOut = null;
            $scope.removingChkPnt = false;
            $scope.selectedLvls = [];

		/* per ogni frame appartenente al trail viene chiamato il metodo setFrameSvg
		*/
		var setSvgFramesSide = function(){
	            for(var i in frames){
	                setFrameSvg(frames[i]);
	            }
	        };
		/* chiama il metodo setOneSvg per ogni shape contenuto nel frame ricevuto in input	
		*/
	        var setFrameSvg = function(frame){
	            var fcont = frame.content;
	            for(var sh in fcont){
	                if(fcont[sh].type == "shape"){
	                    setOneSvg(fcont[sh],'');
	                    setOneSvg(fcont[sh],'out-');
	                    setOneSvg(fcont[sh],'in-');
	                    setOneSvg(fcont[sh],'a-');                                  
	                }
	            }
	        };

		/* tramite due metodi JQuery setta il colore e il path dell'svg.	
		*/
	        var setOneSvg = function(svg,mod){
	            $('#'+mod+svg._id+' path').attr('fill',svg.color);
	            $('#'+mod+svg._id+' path').attr('d',svg.path);
	        };


            /*************METODI DI SETTAGGIO*************/
            /* inserisce i frame nella lista dei frames convertendo la lista in input in oggetti JSON di tipo frame
            */
            $scope.setFrames = function(hashFrames){
            	frames = $parse(hashFrames)($scope);
            };

	    /* inserisce i trail nella matrice trilly convertendo prima la lista in input in oggetti JSON di tipo trail
	    */
            $scope.setTrail = function(inTrail){
            	trilly = $parse(inTrail)($scope);
            };

	    /* inserisce gli id dei frame nell'array idframes convertendo prima la lista data in input in stringhe
	    */
            $scope.setFramesId = function(arrayId){
            	idFrames = $parse(arrayId)($scope);
            };

            /******************METODI DI GET****************/
            $scope.getFramesContent = function(){
                return frames;
            };

            /************METODI DI MODIFICA TRAIL***********/
            $scope.insertFrames = function(idCheck){
            	for(var key in selectedFrames){
            		MTrail.insertSlideInPath(key,idCheck);
            	}            	
            	selectedFrames = {};
            	$timeout(setSvgFramesSide);
            	
            };

	    /* viene aggiunto alla sezione Frame Out della vista associata il frame con l'id dato in input
	    */
            $scope.selectFrameOut = function(idFrame){
            	if(selectedFrames.hasOwnProperty(idFrame)){
            		delete selectedFrames[idFrame];
            	}
            	else{
            		selectedFrames[idFrame] = true;
            	}
            };

	    /* restituisce true se il frame appartiene alla sezione Frame Out, false viceversa
	    */
            $scope.isSelectedOut = function(idFrame){
            	if(selectedFrames.hasOwnProperty(idFrame)){
            		return "true";
            	}
            	return "false";
            };

	    /* viene aggiunto alla sezione Frame In della vista associata il frame con l'id dato in input
	    */
            $scope.selectFrameIn = function(idFrame){
                if($scope.selectedFrameIn == idFrame){
                    $scope.selectedFrameIn = null;
                    if(MTrail.isCheckPoint(idFrame)){
                        $scope.selectedLvls.pop();
                    }
                    return;
                }
                $scope.selectedFrameIn = idFrame;
                if(MTrail.isCheckPoint(idFrame)){
                    $scope.openLvl(idFrame);
                }
            };

            $scope.openLvl = function(idCheck){
                $scope.selectedLvls = MTrail.getSpecPath(idCheck);
                $scope.selectedLvls.push(idCheck);                
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            };

            $scope.isOpenLvl = function(idCheck){
                for(var i = 0; i < $scope.selectedLvls.length; i++){
                    if($scope.selectedLvls[i] == idCheck){
                        return true;
                    }
                }
                return false;
            };

            $scope.remove = function(idFrame){
            	MTrail.removeSlide(idFrame);
            	$timeout(setSvgFramesSide);
            };

	    /* sposta il frame identificato dal codice ricevuto nella posizione successiva rispetto a quella in cui si trova. 
	       Utilizza il metodo switchDxSlide di trail
	    */
            $scope.increment = function(idFrame){
            	MTrail.switchDxSlide(idFrame);
            	//da ottimizzare
            	$timeout(setSvgFramesSide);
            };

	    /* sposta il frame identificato dal codice ricevuto nella posizione precedente rispetto a quella in cui si trova. 
	       Utilizza il metodo switchSxSlide di trail
	    */
            $scope.decrement = function(idFrame){
            	MTrail.switchSxSlide(idFrame);
            	//da ottimizzare
            	$timeout(setSvgFramesSide);
            };

	    /* dichiara che un determinato frame è un checkpoint per un percorso di specializzazione.
	    */
            $scope.makeCheckPointFrame = function(idFrame){
            	MTrail.makeCheckPoint(idFrame);
            };

            $scope.removeChk = function(idFrame){
            	MTrail.removeChkPoint(idFrame);
            }

            $scope.discard = function(){
                $scope.removingChkPnt = false;
            };
		
	    /*  Attiva o disattiva la barra laterale destra dell’editor impostando a true
		showInSide se era impostato a false e viceversa
	    */
            $scope.showSideBarDx = function(){
            	$scope.showInSide = !$scope.showInSide;
            };

            $scope.isFrameInTrail = function(idFrame){
                return MTrail.isSlideInTrail(idFrame);
            };

            $scope.isFrameCheckPoint = function(idFrame){
            	return MTrail.isCheckPoint(idFrame);
            };

            $scope.isEmpty = function(){
            	return MTrail.isTrailEmpty();
            };

            $scope.getTrailDir = function(){
            	return MTrail.getTrail();
            };

	    /* inizializza il trail utilizzando il metodo initPath della classe trail
	    */
            $scope.init = function(){      	
                MTrail.initPath(idFrames,trilly);                
				$timeout(setSvgFramesSide);
                signalsCtrl.removeAllSignals();
                signalsCtrl.initSignal('trails',document,'keydown',function(event){
                    event.preventDefault();
                    var keyCode = event.keyCode || event.which,
                    arrow = {
                        left: 37,
                        right: 39,
                    };
                    if($scope.selectedFrameIn){
                        switch (keyCode) {
                            case arrow.left:
                                $scope.decrement($scope.selectedFrameIn);                 
                                break;
                            case arrow.right:
                                $scope.increment($scope.selectedFrameIn);                                       
                                break;
                        }
                        if(!$scope.$$phase){
                            $scope.$apply();
                        }
                    }
                });
            };
		}]);
