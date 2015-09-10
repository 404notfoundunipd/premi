/**
	* Name: 		infographicEditorCtrl.js
	* Package: 		premi/client/infographicEditor/controllers/
	* Author: 		Cossu Mattia
	* Date: 		2015-07-12

	* Use:
	Template della vista associata allo $scope di infographicEditorCtrl. Fornisce
	tutti gli strumenti necessari alla modifica dell’infografica della presentazione

	
	* Changes:
	Version		Date		Who 			Changes				Reason
	    ----------------------------------------------------------------------------
	0.9         2015-08-26  Cossu Mattia    aggiunto 	        per listner wheel(zoom)
	                                        signalsCtrl         
    ----------------------------------------------------------------------------
	0.8         2015-08-23  Cossu Mattia    aggiunti metodi     shape modificate da                                                                     
	                                        per shape           tag <img> a <svg>
	----------------------------------------------------------------------------
	0.7			2015-08-06	Cossu Mattia	correzioni
	----------------------------------------------------------------------------
	0.6			2015-08-03	Cossu Mattia	init(), attributi	incremento
	----------------------------------------------------------------------------
	0.5			2015-07-30	Cossu Mattia	addGObject()		correzioni
	----------------------------------------------------------------------------
	0.4			2015-07-15	Cossu Mattia	init()				correzioni
	----------------------------------------------------------------------------
	0.3			2015-07-15	Cossu Mattia	incremento dei metodi
	----------------------------------------------------------------------------
	0.2			2015-07-13	Cossu Mattia	incremento dei metodi
	----------------------------------------------------------------------------
	0.1			2015-07-12	Cossu Mattia	scrittura scheletro 
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

angular.module("premi.editor.infographicEditor")
	.controller("infographicEditorCtrl", ['$window','$scope','$stateParams','databaseAPI','InteractInit' ,'Observer','InfographicFactory', 'OrderedGOListFactory', '$state','$timeout','signalsCtrl',
		function($window,$scope,$stateParams, databaseAPI, InteractInit,Observer,InfographicFactory,OrderedGOListFactory, $state,$timeout,signalsCtrl){
			
			$(document).ready(function(){
				$('.tooltipped').tooltip({delay: 50});
                $('.modal-trigger').leanModal();
			});

			$('body').click(function () {
	            $('#choiceShape').closeModal();
	        });

			$scope.enableStateMenu = function (stateMenu) {
	            switch(stateMenu) {
	                case 'framesAddedMenu':
	                    $scope.currentState = ($scope.currentState == $scope.states.goList ? 0 : $scope.states.goList);
	                    break;
	                case 'framesToBeAddedMenu':
	                	$scope.currentState = ($scope.currentState == $scope.states.framesList ? 0 : $scope.states.framesList);	                    
	                    break;
	                case 'addGraphicObjectMenu':
	                    $scope.currentState = ($scope.currentState == $scope.states.addingGO ? 0 : $scope.states.addingGO);	                 
	                    break;
	                case 'editTextMenu':
	                    $scope.currentState = ($scope.currentState == $scope.states.textEditing ? 0 : $scope.states.textEditing);	                    
	                    break;              
	                case 'editShapeMenu':
	                    $scope.currentState = ($scope.currentState == $scope.states.shapeEditing ? 0 : $scope.states.shapeEditing);	                    
	                    break;
	                default:
	                    $scope.disableAllStateMenu();
	            }
	        };

	        $scope.disableAllStateMenu = function () {
                $scope.currentState = $scope.states.noSelection;

                if(!$scope.$$phase) {
                    $scope.$apply();
                }
	        };

	        $scope.goToState = function (state) {
	            $state.go(state, $stateParams);
	        };

			var frameCollection       = Frames.find({'presid' : $stateParams.idpres}).fetch();
	        var infographicCollection = Infographics.findOne({'presid' : $stateParams.idpres});
	        var infFrames			  = Frames.find({_id : {$in:infographicCollection.framesId}}).fetch();
	        var observer              = Observer;
	        var interactIniter        = InteractInit.setObserver(observer);
	        var db                    = databaseAPI; // metodi di interazione col server
	        var imageSet              = false;
	        var frames                = {}; // lista dei frames inseriti nell'infografica
	        var hashFrameIndex        = {}; // lista dei codici identificativi in frames
	        var infContents			  = OrderedGOListFactory.initializeList().setOrderBy("lvl");	       
	        var infographic = InfographicFactory;
	        $scope.wraPrefix   = "wrapper-";	
	        $scope.states      = 
		        Object.freeze({
		            noSelection  : 0,
		            goList 		 : 1,
		            imageEditing : 2,
		            shapeEditing : 3,
		            textEditing  : 4,
		            frameEditing : 5,		           
		            addingFrame  : 6,
		            addingImage  : 7,
		            addingShape  : 8,
		            addingText   : 9,
		            addingGO     : 10,
		            framesList   : 11,		            
		        });
	        $scope.currentState = $scope.states.noSelection;
	        $scope.standard_height = 768;
            $scope.standard_width = 1024;
            $scope.inf = {}; 
            $scope.infTransOn = true;
            $scope.bgColor="white";
            $scope.showScale = false; // bottone Scale
            $scope.showDataZ = false; // bottone DataZ
            $scope.windX = window.innerWidth; // dimensioni finestra
            $scope.windY = window.innerHeight; 
            $scope.transparent = false; // trasparenza degli oggetti grafici per l'editing

	        var initInteract = function(GO){
	            switch(GO.type){
	                case "image" : 
	                    interactIniter.initializeFrame($scope.wraPrefix + GO._id);
	                    break;
	                case "shape" :
	                    interactIniter.initializeFrame($scope.wraPrefix + GO._id);
	                    break;
	                case "text"  :
	                    interactIniter.initializeText($scope.wraPrefix + GO._id);
	                    break;
	                case "frame" :
	                	interactIniter.initializeFrame($scope.wraPrefix + GO._id);
	            }
        	};
        	/* estrae il codice identificatvo di un oggetto grafico dal suo wrapper
        	(rimuovendo il prefisso del wrapper) */
	        var getIdGOByWrapper = function(idWrapperGO){
            	return idWrapperGO.substring($scope.wraPrefix.length);
        	};
        	/* Inserisce frames e oggetti grafici dentro infContents, estrendoli da inforaphic
        	tramite i metodi getFramesContent() e getGOContent() */
	        var insertInLvlArray = function(){
	        	var infFrames = infographic.getFramesContent();
	        	var infSimpleGO = infographic.getGOContent();
	        	for(var key in infFrames){
	        		if(infFrames.hasOwnProperty(key)){
	        			infContents.insertGO(infFrames[key]);
	        			initInteract(infFrames[key]);
	        		}
	        	}
	        	for(var key in infSimpleGO){
	        		if(infSimpleGO.hasOwnProperty(key)){
	        			infContents.insertGO(infSimpleGO[key]);
	        			initInteract(infSimpleGO[key]);
	        		}
	        	}
	        };
	        /* Riceve l'immagine caricata dall'utente, aggiorna l'oggetto
	        grafico corrente e mostra il cambiamento nella vista */
	        var imageIsLoaded = function(e) {	     	
	        	var image = new Image();
	        	image.src = e.target.result;
	        	var scale = 100/infographic.get('zoom');
	        	infographic.updateSelectedGO({src:e.target.result,width:image.width*scale,height:image.height*scale});
	        	delete image;
	            if(!$scope.$$phase){
	            	$scope.$apply();
	            }
	        };

            var getSvg = function(id,src,posX,posY,scale){
            	$('#svgIn').attr('src',src);            	
            	jQuery('#svgIn').each(function(){            		
		            var $img = jQuery(this);
		            var imgID = $img.attr('id');
		            var imgClass = $img.attr('class');
		            var imgURL = $img.attr('src');

		            jQuery.get(imgURL, function(data) {
		                // Get the SVG tag, ignore the rest
		                var $svg = jQuery(data).find('svg');

		                // Add replaced image's ID to the new SVG
		                if(typeof imgID !== 'undefined') {
		                    $svg = $svg.attr('id', imgID);
		                }
		                // Add replaced image's classes to the new SVG
		                if(typeof imgClass !== 'undefined') {
		                    $svg = $svg.attr('class', imgClass+' replaced-svg');
		                }

		                // Remove any invalid XML tags as per http://validator.w3.org
		                $svg = $svg.removeAttr('xmlns:a');
		                //$svg.children().removeAttr('xmlns');
		                var width = $svg.attr('width');
		                width = parseFloat(width.split("px")[0]);
		                var height = $svg.attr('height');
		                height = parseFloat(height.split("px")[0]);
		                var $path = $svg.find("path");		                
		                var tempSvg = {
		                	width 	: width*scale*3,
		                	height 	: height*scale*3,
		                	sWidth 	: width,
		                	sHeight : height,
		                	viewBox : $svg.attr('viewBox'),
		                	style 	: $svg.attr('style'),
		                	path 	: $path.attr("d"),
		                	src     : src,
		                	dataX 	: posX,
		                	dataY	: posY,
		                	zoom	: 100,
		                	type 	: 'shape',
		                	scale 	: 1,
		          		};
		          		infographic.updateSelectedGO(tempSvg);
		          		$(document).ready(function(){
			          		document.getElementById(id).setAttribute("style",$svg.attr('style'));
			          		document.getElementById(id).setAttribute("fill",$svg.attr('fill'));
			          		document.getElementById(id).setAttribute("viewBox",$svg.attr('viewBox'));
			          		$('#'+id+' path').attr('d',$path.attr("d"));
		          		});
		          		
		                // Replace image with new SVG
		                //$img.replaceWith($svg);
		                if(!$scope.$$phase) {
			                    $scope.$apply();
			            }
			            $('body').remove("#svgIn");
			            $timeout(function() {setSvgs();setSvgFramesOut();});
	            	}, 'xml');

        		});
            };
            var setSvgs = function(){
                var cont = infContents.getList();
                for(var key in cont){
                    if(cont[key].type == "shape"){
                        setOneSvg(cont[key],'');
                        setOneSvg(cont[key],'z-');
                        setOneSvg(cont[key],'sa-');
                        setOneSvg(cont[key],'a-');
                    }
                    else if(cont[key].type == "frame"){
        				setFrameSvg(cont[key]);
        			}
                }
            };

            var setFrameSvg = function(frame){
            	var fcont = frame.content;
				for(var sh in fcont){
					if(fcont[sh].type == "shape"){
						setOneSvg(fcont[sh],'');
                        setOneSvg(fcont[sh],'z-');
                        setOneSvg(fcont[sh],'sa-');
                        setOneSvg(fcont[sh],'a-');			        				
    				}
				}
            };

            var setSvgFramesOut = function(){
            	for(var i=0; i < frameCollection.length; i++){
            		if(!infographic.hasFrame(frameCollection[i]._id)){
            			setFrameSvg(frameCollection[i]);
            		}
            	}
            };

            var setOneSvg = function(svg,mod){
            	$('#'+mod+svg._id+' path').attr('fill',svg.color);
                $('#'+mod+svg._id+' path').attr('d',svg.path);
            };

            $scope.enableScale = function(){
                $scope.showScale = $scope.showScale ? false : true;
                $scope.showDataZ = false;
            };

            $scope.enableDataZ = function(){
                $scope.showDataZ = $scope.showDataZ ? false : true;
                $scope.showScale = false;
            };
            /* imposta l'attributo dataZ all'oggetto selezionato, estraendolo
            dall'input dell'utente */
            $scope.getSelectedDataZ = function(){
            	if(infographic.getSelectedGO())
            		return infographic.getSelectedGO().get('dataZ');
            	return 0;
            };

            $scope.getSelectedZoom = function(){
            	if(infographic.getSelectedGO())
            		return infographic.getSelectedGO().get('scale');
            	return 1;
            };

			$scope.changeTransparency = function(){
				$scope.transparent = !$scope.transparent;
			};

            $scope.changeGOZoom = function(value){
            	infographic.updateSelectedGO({scale:(value/100)});
            	if(!$scope.$$phase){
            		$scope.$apply();
            	}
            };

            $scope.changeDataZ = function(value){
            	infographic.updateSelectedGO({dataZ:value});
            	if(!$scope.$$phase){
            		$scope.$apply();
            	}
            };

            $scope.incrementLvl = function($event,idGO){
            	$event.stopPropagation();
            	infContents.upgradeGO(idGO);            	
            };

            $scope.decrementLvl = function($event,idGO){
            	$event.stopPropagation();
            	infContents.downgradeGO(idGO);            	
            };
            
			$scope.getGOContent = function(){
				return infContents.getList();
			};

			$scope.hasInfFrame = function(idFrame){
				return infographic.hasFrame(idFrame);
			};
			$scope.getSelectedGOId = function(){
				return infographic.getSelectedGOId();
			}
			/* riceve una collezione di files, preleva l'immagine inviata
			dall'utente e la interpreta attraverso il metodo FileReader() di JavaScript */
			$scope.changeImage = function(file){
				var posX = -infographic.get('dataX'),
	        		posY = -infographic.get('dataY');
				infographic.addGO({type:'image',dataX:posX,dataY:posY});
                infContents.insertGOAndSetLvl(infographic.getGOJSON(infographic.getSelectedGOId()));
                interactIniter.initializeFrame($scope.wraPrefix+infographic.getSelectedGOId());
	            file = file.files[0];	            
	            var reader = new FileReader();
	            reader.onload = imageIsLoaded; 
	            reader.readAsDataURL(file);
	            $scope.currentState = $scope.states.imageEditing;	 
	        };


	        $scope.selectGO = function($event,idGO,type){	    
	        	if(!type){
	        		type = infographic.selectGO(idGO).getSelectedGOType();
	        	}	        	
	        	$event.stopPropagation();
                infographic.selectGO(idGO);
                $scope.showScale = false;
            	$scope.showDataZ = false;
                $scope.disableAllStateMenu();
                $scope.currentState = $scope.states[type+'Editing'];                           
                var goPosX = /*((angular.element($window).width())/2)*100/infographic.get('zoom')*/-infographic.getSelectedGO().get('dataX');
                var goPosY = /*((angular.element($window).height())/2)*100/infographic.get('zoom')*/-infographic.getSelectedGO().get('dataY');
                infographic.drag(goPosX,goPosY); 

	        };

	        $scope.addGO = function(){
	        	$scope.currentState = $scope.states.addingGO;
	        };
	        /* Deseleziona l'oggetto grafico attualmente selezionato 
	        (utilizzato quando si preme un'area vuota dell'editor) */
			$scope.clickDropzone = function() {
                $scope.disableAllStateMenu();
                interactIniter.initializeInf("container");
	        	interactIniter.initializeInf("dropzone-inf");
                if (infographic) {
                    infographic.deselectGO();
                }            
            };
            /* Aggiunge un nuovo oggetto grafico all'infografica, e prepara
            l'editor alla sua modifica */
	        $scope.addGObject = function(type,params){
	        	infographic.deselectGO();
	        	var posX = -infographic.get('dataX') ,
	        		posY = -infographic.get('dataY') ,
	        		scale = 100/infographic.get('zoom');
	        	switch(type){
	        		case 'frame' : 
		        		$scope.currentState = $scope.states.framesList;
		        		break;
	        		case 'image' :	        
	                    $("#uploadImageBtnn").click();	                    
	        			break;
	        		case 'shape' : 
	        			infographic.addGO({type:'shape'});
	                    infContents.insertGOAndSetLvl(infographic.getGOJSON(infographic.getSelectedGOId()));
	                    //getSvg(params);
	                    interactIniter.initializeFrame($scope.wraPrefix+infographic.getSelectedGOId());
	                    $scope.currentState = $scope.states.shapeEditing;
	        			getSvg(infographic.getSelectedGOId(),params,posX,posY,scale);
	        			break;
	        	}
	        };
	        /* Aggiunge un frame all'infografica */
	        $scope.addFrame = function(idFrame){
	        	var posX = -infographic.get('dataX') ,
	        		posY = -infographic.get('dataY') ,
	        		scale = 100/infographic.get('zoom');
	        	infographic.addGO(frameCollection[hashFrameIndex[idFrame]], "frame");
	        	infographic.updateSelectedGO({dataX:posX,dataY:posY,scale:scale})
	        	interactIniter.initializeFrame($scope.wraPrefix+idFrame);	        	
	        	infContents.insertGOAndSetLvl(infographic.getGOJSON(idFrame));
	        	$currentState = $scope.states.frameEditing;
	        	$timeout(function(){setSvgs();})
	        };
	        /* Restituisce la collezione di tutti i frame creati finora dall'utente
	        (restituisce frameCollection) */
	        $scope.getPresFrames = function(){
	        	return frameCollection;
	        };
	        $scope.removeSelection = function(){
	        	infographic.deselectGO();
	        	$scope.currentState = $scope.states.noSelection;
	        };
	        /* Rimuove l'oggetto grafico attualmente selezionato dall'utente */
	        $scope.removeGO = function(){
	        	var idGO = infographic.getSelectedGOId();
	        	infographic.removeSelectedGO();
	        	infContents.removeGO(idGO);
	        	$scope.currentState = 0;
	        	$timeout(setSvgFramesOut);
	        };

	        $scope.saveInfographic = function(){
	        	infographic.save();
	        	databaseAPI.updateInfographic(infographic.getId(),{background:infographic.get('background')});
	        };

	        $scope.hasInfFrames = function(idFrame){
	        	return infographic.hasFrame(idFrame);
	        }
	        $scope.changeBackgroundColorDropzone = function(colorText) {               
                var back = infographic.get('background');
                back.color = colorText;                
                infographic.set('background',back);
                $scope.bgColor = back.color;
                if(!$scope.$$phase){
                    $scope.$apply();
                }  
            };
            $scope.getBackgroundColor = function(){            	
            	return infographic.get('background').color;
            };
            $scope.setGOColor = function (color) {
            	infographic.updateSelectedGO({color:color});
            	if(infographic.getSelectedGOType()=="shape"){
            		$('#'+infographic.getSelectedGOId()+' path').attr('fill',color);            		
            	}
            	if(!$scope.$$phase){
            		$scope.$apply();
            	}
            };

            $scope.changeFrameBackgroundColor = function(color){
            	infographic.updateSelectedGO({backgroundColor:color});
            	if(!$scope.$$phase){
            		$scope.$apply();
            	}
            };

            $scope.getBgColor = function(){
            	return infographic.get('background').color;
            };
            /* inizializza tutti i campi dati e le librerie dell'editor */
	        var init = function(){
	        	for(var i = 0; i < infFrames.length; i++){
	        		frames[infFrames[i]._id] = infFrames[i];
	        	}
	        	for(var i = 0; i < frameCollection.length; i++){
	        		hashFrameIndex[frameCollection[i]._id] = i;
	        	}
	        	infographic.initByJSON(infographicCollection,infographicCollection.framesId,frames);
	        	$scope.inf = infographic.getJSON();
	        	insertInLvlArray();
	        	$scope.bgColor = infographic.get('background').color;
	        	observer.on('select',function(idWrapperGO){
		        	var idGO = getIdGOByWrapper(idWrapperGO);
	                if(infographic.getSelectedGOId() != idGO){
	                    infographic.selectGO(idGO);
	                    $scope.currentState = $scope.states[infographic.getSelectedGOType() + 'Editing'];
	                    if(!$scope.$$phase) {
		                    $scope.$apply();
		                }	        
	                }
		        });
		        observer.on('drag',function(drag){
		        	var zoom = infographic.get('zoom');
		        	zoom = (100/zoom)*(100/zoom);
		        	var x = infographic.getSelectedGO().get('dataX');
		        	var y = infographic.getSelectedGO().get('dataY');
		        	var deltaX = x-drag.dataX;
		        	var deltaY = y-drag.dataY;
		        	x = x - deltaX*zoom;
		        	y = y - deltaY*zoom;
		        	drag.dataX = x;
		        	drag.dataY = y;
		        	infographic.dragGO(drag);
	                if(!$scope.$$phase) {
	                	$scope.$apply();
	                }
		        });
		        observer.on('resize',function(resize){
		        	infographic.resizeGO(resize);
	                if(!$scope.$$phase) {
	                    $scope.$apply();
	                }	
		        });
		        observer.on('selectInf',function(){

		        });
		        observer.on('dragInf',function(drag){
		        	var zoom = infographic.get('zoom');
		        	zoom = (100/zoom)*(100/zoom);
		        	var x = infographic.get('dataX');
		        	var y = infographic.get('dataY');
		        	var deltaX = x-drag.dataX;
		        	var deltaY = y-drag.dataY;
		        	x = x - deltaX*zoom;
		        	y = y - deltaY*zoom;	
		        	infographic.drag(x,y);
		        	//infographic.resize(Math.abs(drag.dataX),Math.abs(drag.dataY))
		        	if(!$scope.$$phase) {
	                    $scope.$apply();
	                }
		        });
		        observer.on('dragInfStart',function(){
		        	$scope.infTransOn = false;
		        });
		        observer.on('dragInfEnd',function(){
		        	$scope.infTransOn = true;
		        });
		        observer.on('changeLvl',function (idGO,lvl){
		        	infographic.updateGO({lvl:lvl},idGO);
		        	if(!$scope.$$phase){
                        $scope.$apply();
                    }

		        });
		        infContents.setObserver(observer);
		        
	        	$scope.disableAllStateMenu();
	        	interactIniter.initializeInf("container");
	        	interactIniter.initializeInf("dropzone-inf");
	        	signalsCtrl.removeAllSignals();
	        	signalsCtrl.initSignal('infographic',document,'keydown',function(event){
	        		event.preventDefault();
	        		var keyCode = event.keyCode || event.which,
                    arrow = {
                        left: 37,
                        up: 38,
                        right: 39,
                        down: 40,
                        enter : 13
                    };
                    var deltaX = 0;
                    var deltaY = 0;
                    var x,y;
	                switch (keyCode) {
	                    case arrow.left:
	                        deltaX = -10;                  
	                        break;
	                    case arrow.up:
	                        deltaY = -10;                        
	                        break;
	                    case arrow.right:
	                        deltaX = 10;                       
	                        break;
	                    case arrow.down:
	                        deltaY = 10;                        
	                        break;
	                    case arrow.enter:
	                    	if(infographic.getSelectedGO()){
	                    		$scope.selectGO(event,infographic.getSelectedGOId(),infographic.getSelectedGOType());
	                    	}
	                    	break;
	                }
	                if(!infographic.getSelectedGO()){
	                	x = infographic.get('dataX');
		        		y = infographic.get('dataY');
		        		x += deltaX;
		        		y += deltaY;
		        		observer.emit('dragInf',{dataX:x,dataY:y});
	                }
	                else {
	                	x = infographic.getSelectedGO().get('dataX');
		        		y = infographic.getSelectedGO().get('dataY');
		        		x += deltaX;
		        		y += deltaY;
		        		observer.emit('drag',{dataX:x,dataY:y});
	                }
	        	});
	        	signalsCtrl.initSignal('infographic',document.getElementById('dropzone-inf'),'wheel',function(event){
	        		event.preventDefault();
	        		$scope.infTransOn = false;
	        		var zoom = infographic.get('zoom')-(event.deltaY/Math.abs(event.deltaY))*0.5;	        		
	        		/*event.deltaY;
	        		event.clientX;
	        		event.clientY;*/
	        		
	        		if(zoom<=100 && zoom>=2){	        			
	        			infographic.set('zoom',(zoom));
	        			if(!$scope.$$phase){
	        				$scope.$apply();
	        			}
	        		}
	        		else if(zoom>100){
	        			infographic.set('zoom',(100));
	        			if(!$scope.$$phase){
	        				$scope.$apply();
	        			}
	        		}
	        		else if(zoom<2){
	        			infographic.set('zoom',2);
	        			if(!$scope.$$phase){
	        				$scope.$apply();
	        			}
	        		}
	        		$scope.infTransOn = true;
	        	});	       
	        	$timeout(function() {setSvgs();setSvgFramesOut();});

	        };
	        init();

		}]);