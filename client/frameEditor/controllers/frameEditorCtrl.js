/** 
    * Name:         frameEditorCtrl.js
    * Package:      premi/client/frameEditor/controllers/
    * Author:       Manuto Monica
    * Date:         2015-07-02

    * Use:
    Questo controller crea lo $scope associato alla vista generata da frame.ng, for-
    nendo i dati e i metodi necessari per consentire all’utente di creare e modellare
    un frame, inserendo o rimuovendo oggetti grafici al suo interno.
    
    * Changes:
    Version     Date        Who                 Changes             Reason
    ----------------------------------------------------------------------------
    0.9.2       2015-08-25  De Lazzari Enrico   Aggiunto cambio lvl
    ----------------------------------------------------------------------------
    0.9.1       2015-08-23  Cossu Mattia        aggiunti metodi     shape modificate da                                                                     
                                                per shape           tag <img> a <svg>
    ----------------------------------------------------------------------------
    0.9         2015-07-29  De Lazzari Enrico                       correzioni
    ----------------------------------------------------------------------------
    0.8         2015-07-18  De Lazzari Enrico   aggiunta stati
    ----------------------------------------------------------------------------
    0.7         2015-07-16  De Lazzari Enrico   setObserver,        correzioni metodo
                                                addGObject
    ----------------------------------------------------------------------------
    0.6         2015-07-15  De Lazzari Enrico   incremento classe
    ----------------------------------------------------------------------------
    0.5         2015-07-12  De Lazzari Enrico   incremento classe
    ----------------------------------------------------------------------------
    0.4         2015-07-08  De Lazzari Enrico   incremento classe
    ----------------------------------------------------------------------------
    0.3         2015-07-08  Manuto Monica       interactIniter      modificato attributo e
                                                                    sue associazioni
    ----------------------------------------------------------------------------
    0.2         2015-07-07  Manuto Monica       incremento metodi 
    ----------------------------------------------------------------------------
    0.1         2015-07-02  Manuto Monica       inizio classe
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

angular.module("premi.editor.frameEditor")
    .controller("frameEditorCtrl", ['OrderedGOListFactory','$scope','$stateParams','databaseAPI','InteractInit' ,'FrameFactory','Observer','$state','$timeout','standardFrameResolution','signalsCtrl',
        function(OrderedGOListFactory,$scope,$stateParams, databaseAPI, InteractInit, FrameFactory,Observer,$state,$timeout, standardFrameResolution,signalsCtrl){

            $(document).ready(function(){
                $('.tooltipped').tooltip({delay: 50});
                $('.modal-trigger').leanModal();
            });

            $scope.standard_height = standardFrameResolution.height;
            $scope.standard_width  = standardFrameResolution.width;

            $('body').click(function () {
                $('#choiceShape').closeModal();
            });



            var framesId = [];
            var frames = {};
            var frameCollection = Frames.find({presid : $stateParams.idpres}).fetch();
            var observer = Observer;
            var interactIniter = InteractInit.setObserver(observer).setRestrictArea("dropzone");
            var db = databaseAPI;
            var imageSet = false;
            var list = OrderedGOListFactory.initializeList().setOrderBy('lvl');
            var currentFrame = FrameFactory;
            $scope.wraPrefix = "wrapper-";
            $scope.states = Object.freeze({ // gli stati che l'editor assume durante il suo utilizzo
                noSelection   : 1,
                imageEditing  : 2,
                shapeEditing  : 3,
                textEditing   : 4,
                addingGO      : 5,
                framesList    : 6,
                goList        : 7,
                removingFrame : 8,
                frameEditing  : 9,
            });
            $scope.currentState = $scope.states.noSelection;
                        

            var initInteract = function(GO){
                switch(GO.type){
                    case "image" : 
                        interactIniter.initializeImage($scope.wraPrefix + GO._id);
                        break;
                    case "shape" :
                        interactIniter.initializeShape($scope.wraPrefix + GO._id);
                        break;
                    case "text"  :
                        interactIniter.initializeText($scope.wraPrefix + GO._id);
                        break;
                }
            };
            var removeFrameFromIdArray = function(idFrame){
                for(var i = 0, found = false; i < framesId.length && !found; i++){
                    if(framesId[i] == idFrame){
                        framesId.splice(i,1);
                        if(framesId.length == 0){
                            return -1;
                        }
                        if(i == framesId.length){
                            return i-1;
                        }
                            
                        return i;
                    }
                }
                
                return 0;
            };
            /* restituisce il codice identificativo dell'oggetto grafico estraendolo
            dal codice identificativo del wrapper
            */
            var getIdGOByWrapper = function(idWrapperGO){
                return idWrapperGO.substring($scope.wraPrefix.length);
            };

            var setObserver = function(){
                observer
                    .on('select',function (idWrapperGO){
                        var idGO = getIdGOByWrapper(idWrapperGO);
                        if(currentFrame.getSelectedGOId() != idGO){
                            currentFrame.selectGO(idGO);
                            $scope.currentState = $scope.states[currentFrame.getSelectedGOType() + 'Editing'];
                            if(!$scope.$$phase){
                                $scope.$apply();
                            }                            
                        }
                    })
                    .on('resize',function (resize){
                        currentFrame.resizeGO(resize);
                        if(!$scope.$$phase){
                            $scope.$apply();
                        }
                    })
                    .on('drag',function (drag){
                        currentFrame.dragGO(drag);
                        if(!$scope.$$phase){
                            $scope.$apply();
                        }
                    })
                    .on('update',function (update){
                        currentFrame.updateGO(update);
                        if(!$scope.$$phase){
                            $scope.$apply();
                        }
                    })
                    .on('changeLvl',function (idGO,lvl){
                        currentFrame.updateGO({lvl:lvl},idGO);
                        if(!$scope.$$phase){
                            $scope.$apply();
                        }

                    });


            };
            /* aggiorna l'immagine appena modificata con nuovi attributi
            */
            var imageIsLoaded = function(e) {
                currentFrame.updateSelectedGO({src:e.target.result});
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            }; 

            var getSvg = function(id,src,posX,posY){
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
                            width   : width,
                            height  : height,
                            sWidth  : width,
                            sHeight : height,
                            viewBox : $svg.attr('viewBox'),
                            style   : $svg.attr('style'),
                            path    : $path.attr('d'),
                            src     : src,
                            dataX   : posX,
                            dataY   : posY,
                            zoom    : 100,
                            type    : 'shape'
                        };
                        currentFrame.updateSelectedGO(tempSvg);
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                        $timeout(function(){
                            $('#'+id+' path').attr('d',$path.attr("d"));
                            setSvg();
                        });
                    }, 'xml');
                });
            };

            var setSvg = function(){
                var cont = list.getList();
                for(var key in cont){
                    if(cont[key].type == "shape"){                        
                        setOneSvg(cont[key],'');
                        setOneSvg(cont[key],'s-');
                        setOneSvg(cont[key],'a-');
                        /*setOneSvg(cont[key],'');
                        setOneSvg(cont[key],'');*/
                    }
                }
            };

            var setSvgFrame = function(frame){
                var fcont = frame.content;
                for(var sh in fcont){
                    if(fcont[sh].type == "shape"){
                        setOneSvg(fcont[sh],'s-');  
                        setOneSvg(fcont[sh],'a-');                              
                    }
                }
            }

            var setSvgFrames = function(){
                for(var i=0; i < frameCollection.length; i++){
                    setSvgFrame(frameCollection[i]);
                }
            };

            var setOneSvg = function(svg,mod){
                $('#'+mod+svg._id+' path').attr('fill',svg.color);
                $('#'+mod+svg._id+' path').attr('d',svg.path);
            };

            $scope.disableAllStateMenu = function () {
                $scope.currentState = $scope.states.noSelection;
            };

            $scope.enableStateMenu = function (stateMenu) {
                switch(stateMenu) {
                    case 'framesListMenu':
                        $scope.currentState = ($scope.currentState == $scope.states.framesList ? 0 : $scope.states.framesList);                        
                        break;
                    case 'addGraphicObjectMenu':
                        $scope.currentState = ($scope.currentState == $scope.states.addingGO ? 0 : $scope.states.addingGO);                        
                        break;
                    case 'GOList':
                        $scope.currentState = ($scope.currentState == $scope.states.goList ? 0 : $scope.states.goList);                        
                        break;
                    case 'frameEditing' : 
                        $scope.currentState = ($scope.currentState == $scope.states.frameEditing ? 0 : $scope.states.frameEditing); 
                        break;
                    default:
                        $scope.disableAllStateMenu();

                }
            };

            $scope.goToState = function (state) {
                $state.go(state, $stateParams);
            };

            $scope.getCurrentId = function(){
                if(currentFrame)
                    return currentFrame.getId();
                else 
                    return null;
            };

            $scope.getTextFamily = function(){
                if(currentFrame.getSelectedGO() && currentFrame.getSelectedGO().getType()=="text"){
                    return currentFrame.getSelectedGO().get('fontFamily');
                }
                else{
                    return null;
                }
            };

            $scope.getTextSize = function(){
                if(currentFrame.getSelectedGO() && currentFrame.getSelectedGO().getType()=="text"){
                    return currentFrame.getSelectedGO().get('sizeFontText');
                }
                else{
                    return null;
                }
            };

            $scope.getBold = function(){
                if(currentFrame.getSelectedGO() && currentFrame.getSelectedGO().getType()=="text"){
                    return currentFrame.getSelectedGO().get('weight');
                }
                else{
                    return null;
                }
            };

            $scope.getUnderline = function(){
                if(currentFrame.getSelectedGO() && currentFrame.getSelectedGO().getType()=="text"){
                    return currentFrame.getSelectedGO().get('textDecoration');
                }
                else{
                    return null;
                }
            };

            $scope.getItalic = function(){
                if(currentFrame.getSelectedGO() && currentFrame.getSelectedGO().getType()=="text"){
                    return currentFrame.getSelectedGO().get('fontStyle');
                }
                else{
                    return null;
                }
            };

            $scope.getFramesId = function(){
                
                if(jQuery.isEmptyObject(frames)){
                    return null;
                }
                return frames;
            };

            $scope.getFrames = function(){
                
                if(framesId.length == 0){
                    return null;
                }
                return framesId;
            };
            
            $scope.getGOContent = function(){
                return list.getList();
            };

            $scope.getSelectedGOId = function(){
                if(currentFrame){
                    return currentFrame.getSelectedGOId();
                }
                else{
                    return undefined;
                }
            };

            $scope.changeImage = function(file){
                currentFrame.addGO({type:'image'});
                list.insertGO(currentFrame.getGOJSON(currentFrame.getSelectedGOId()));
                interactIniter.initializeImage($scope.wraPrefix+currentFrame.getSelectedGOId());
                $scope.currentState = $scope.states.imageEditing;
                file = file.files[0];
                var reader = new FileReader();
                reader.onload = imageIsLoaded; 
                reader.readAsDataURL(file);
            };
            /* seleziona il frame associato al codice identificativo ricevuto*/
            $scope.selectFrame = function(idFrame){
                if(currentFrame.getId() != idFrame){
                    $scope.saveFrame();
                    currentFrame.initByJSON(frames[idFrame]);
                    list.initializeList();
                    for(var key in currentFrame.getGOContent()){
                        /*modifica 2015-07-27*/   
                        list.insertGO(currentFrame.getGOContent()[key]);
                        initInteract(currentFrame.getGOContent()[key]);
                    }
                    $timeout(function() {setSvg()});
                }
            };
            $scope.saveFrame = function(){
                currentFrame.save();
                databaseAPI.updateFrame(currentFrame.getId(),{backgroundColor:currentFrame.get('backgroundColor')});
            };
            /* rimuove l'oggetto grafico attualmente selezionato dal frame
            che l'utente sta modificando */
            $scope.removeGO = function(){
                var idGO = currentFrame.getSelectedGOId();
                currentFrame.removeSelectedGO();
                list.removeGO(idGO);
                currentFrame.deselectGO();
                $scope.currentState = $scope.states.noSelection;
            }; 
            /* rimuove il frame attualmente selezionato */
            $scope.removeFrame = function(){
                if(currentFrame){
                    $scope.currentState = $scope.states.removingFrame;
                }
            };
            $scope.discardRemove = function(){
                $scope.currentState = 0;
            };

            $scope.confermRemove = function(){
                var idFrame = currentFrame.getId();
                if(!idFrame){
                    if(currentFrame)
                        idFrame = currentFrame.getId();
                    else 
                        return;
                }
                $scope.currentState = $scope.states.noSelection;
                db.removeFrame(idFrame, function(idFrame){
                    var pos = removeFrameFromIdArray(idFrame);
                    if(pos == -1){
                        currentFrame = null;
                        delete frames[idFrame];
                        return;
                    }
                    else if(currentFrame.getId() == idFrame){                        
                        $scope.selectFrame(framesId[pos]);
                        delete frames[idFrame];
                    }
                })
            }

            $scope.addGO = function(){
                $scope.currentState = $scope.states.addingGO;
            };
            /* prepara l'editor alla modifica dell'oggetto grafico in base
            al suo tipo */
            $scope.selectGO = function($event,idGO,type){
                $event.stopPropagation();
                currentFrame.selectGO(idGO);
                $scope.disableAllStateMenu();
                $scope.currentState = $scope.states[type+'Editing'];
                if(type == "shape"){
                }                
                if (type == 'text') {
                    $scope.textareaInput = currentFrame.getGOJSON(currentFrame.getSelectedGOId()).text;
                    setTextDimensionByText($scope.textareaInput);
                    $scope.colorTextSelected = currentFrame.getGOJSON(currentFrame.getSelectedGOId()).colorText;
                    var fontpx = currentFrame.getGOJSON(currentFrame.getSelectedGOId()).sizeFontText;
                    fontpx = parseInt(fontpx);
                    $scope.sizeFontText = fontpx;
                }
                if(type == 'image'){
    
                }
            };
            /* Annulla la selezione del frame, azzerando tutti gli attributi interesati
            alla selezione */
            $scope.removeSelection = function(){
                if(currentFrame)
                    currentFrame.deselectGO();
                $scope.currentState = $scope.states.noSelection;
                $scope.sizeFontText = 20;
                $scope.disableAllStateMenu();
            };

            $scope.addGObject = function (type,params) {
                $scope.disableAllStateMenu();
                switch(type){
                    case "frame" : 
                        if(!currentFrame){
                            currentFrame = FrameFactory;
                        }
                        currentFrame.initByDefault();
                        db.insertFrame($stateParams.idpres,function (newId){
                            frames[newId] = currentFrame.getJSON();
                            framesId.unshift(newId);
                            currentFrame.setId(newId);
                            currentFrame.initByJSON(currentFrame.getJSON());
                        });
                        list.initializeList();
                        break;
                    case "image" :
                        $("#uploadImageBtnn").click();
                        break;
                    case "shape" :
                        currentFrame.addGO({type:"shape"});
                        list.insertGOAndSetLvl(currentFrame.getGOJSON(currentFrame.getSelectedGOId()));
                        //getSvg(params);
                        interactIniter.initializeShape($scope.wraPrefix+currentFrame.getSelectedGOId());
                        $scope.currentState = $scope.states.shapeEditing;
                        getSvg(currentFrame.getSelectedGOId(),params,0,0);
                        break;
                    case "text" : 
                        currentFrame.addGO({type:'text',text:'text',colorText:'#000000',weight:'',fontStyle:'',textDecoration:'',sizeFontText:'20',fontFamily:'Arial'});
                        list.insertGO(currentFrame.getGOJSON(currentFrame.getSelectedGOId()));
                        interactIniter.initializeText($scope.wraPrefix+currentFrame.getSelectedGOId());                    
                        currentFrame.updateSelectedGO({width: '2', height: 'auto'});
                        var fontpx = currentFrame.getGOJSON(currentFrame.getSelectedGOId()).sizeFontText;
                        fontpx = parseInt(fontpx);
                        $scope.sizeFontText = fontpx; 
                        $scope.currentState = $scope.states.textEditing;
                        break;
                }
            };
            /* Cambia la dimensione dell'input di testo in base al numero
            di righe inserite finora */
            var setTextDimensionByText = function(textareaInput){
                var row = textareaInput;
                row = row.split('\n');
                var maxwidth = 0;
                for (var i=0;i<row.length;i++) {
                    if (row[i].length > maxwidth) {
                        maxwidth = row[i].length;
                    }
                }
                var heightText = row.length;
                
                $scope.textareaWidth = maxwidth/2 +0.5;
                $scope.textareaHeight = heightText*2+0.5;
            };
            /* Cambia la dimensione dell'input di testo in base al numero
            di righe inserite finora, richiamando il metodo setTextDimensionByText,
            e aggiorna l'oggetto grafico associato all'input attraverso il metodo
            updateSelectedGO di currentFrame */
            $scope.changeInputTextarea = function(textareaInput) {
                setTextDimensionByText(textareaInput);
                currentFrame.updateSelectedGO({text: textareaInput, width: $scope.textareaWidth-(10*$scope.textareaWidth/100), height: $scope.textareaHeight});
            };
            /* Deseleziona il frame attualmente selezionato (utilizzato quando
                si preme un'area vuota dell'editor) */
            $scope.clickDropzone = function() {
                $scope.disableAllStateMenu();
                if (currentFrame) {
                    currentFrame.deselectGO();
                }            
            };

            $scope.changeImageShape = function(srcShape) {
                //var idShape = $scope.currentFrame.selectedGo.getId();          
                //$scope.currentFrame.updateGO([src,srcShape],idShape);
                currentFrame.updateSelectedGO({src: '/svg/'+srcShape});
            };
            /* aggiunge o rimuove l'attributo Bold al testo selezionato */
            $scope.changeWeight = function(valueWeight) {
                if(currentFrame.getSelectedGO().get('weight') == ''){
                    valueWeight = 'bold';
                }
                else{
                    valueWeight = '';
                }
                currentFrame.updateSelectedGO({weight: valueWeight});
            };
            /* aggiunge o rimuove l'attributo Italic al testo selezionato */
            $scope.changeFontStyle = function(valueFontStyle) {
                if(currentFrame.getSelectedGO().get('fontStyle')==''){
                    valueFontStyle = 'italic';
                }
                else{
                    valueFontStyle = '';
                }
                currentFrame.updateSelectedGO({fontStyle: valueFontStyle});
            };
            /* aggiunge o rimuove l'attributo Underline al testo selezionato */
            $scope.changeTextDecoration = function(valueTextDecoration) {
                if(currentFrame.getSelectedGO().get('textDecoration')==''){
                    valueTextDecoration = 'underline';
                }
                else{
                    valueTextDecoration = '';
                }
                currentFrame.updateSelectedGO({textDecoration: valueTextDecoration});
            };

            $scope.setFontFamily = function(family){
                if(currentFrame.getSelectedGO() && currentFrame.getSelectedGO().getType()=="text"){
                    currentFrame.updateSelectedGO({fontFamily:family});
                }
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            };

            $scope.setFontSize = function(size){
                if(currentFrame.getSelectedGO() && currentFrame.getSelectedGO().getType()=="text"){
                    currentFrame.updateSelectedGO({sizeFontText:(parseFloat(size)||20)});
                }
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            };

            $scope.setGOColor = function(color) {
                currentFrame.updateSelectedGO({color: color}); 
                if(currentFrame.getSelectedGOType() == "shape"){
                    $('#'+currentFrame.getSelectedGOId() + ' path').attr('fill',color);
                } 
                if(!$scope.$$phase){
                    $scope.$apply();
                }      
            };

            $scope.changeFontSizeText = function(sizeFontText) {
                currentFrame.updateSelectedGO({sizeFontText: $scope.sizeFontText});         
            };
            /* Reimposta il testo attualmente selezionato allo stato iniziale */
            $scope.resetChange = function() {
                currentFrame.updateSelectedGO({textDecoration: '',fontStyle: '',weight: ''});
            };
            /* Cambia il colore del frame attualmente selezionato */
            $scope.getBackgroundColorDropzone = function() {
                return currentFrame.getBackgroundColor();
            };

            $scope.changeBackgroundColorDropzone = function(color) {
                currentFrame.set('backgroundColor',color);
                if(!$scope.$$phase){
                    $scope.$apply();
                }  
            };

            $scope.changeFontFamilyText = function(fontFamily) {
                currentFrame.updateSelectedGO({fontFamily: fontFamily});
            }
            /* Abilita lo spostamento del testo attualmente selezionato */
            $scope.dragTextEnable = function(){
                interactIniter.initializeText($scope.wraPrefix + currentFrame.getSelectedGOId());
            };
            /* Abilita la scrittura nel testo attualmente selezionato */
            $scope.dragTextDisable = function(){
                interactIniter.unSet($scope.wraPrefix + currentFrame.getSelectedGOId());
            };
            /* Riduce di livello il posizionamento dell'oggetto grafico */
            $scope.decrementLvl = function($event,idGO){
                $event.stopPropagation();
                list.downgradeGO(idGO);
            };
            /* Aumenta di livello il posizionamento dell'oggetto grafico */
            $scope.incrementLvl = function($event,idGO){
                $event.stopPropagation();
                list.upgradeGO(idGO);
            };
            /* Inizializza le variabili e le librerie utilizzate dall'editor */
            var init = function(){
                setObserver();
                interactIniter.setObserver(observer);
                list.setObserver(observer);
                for(var i=0; i < frameCollection.length; i++){
                    framesId[i] = frameCollection[i]._id;
                    frames[framesId[i]] = frameCollection[i];
                }
                if(framesId.length == 0){
                    currentFrame = null;
                }
                else{
                    for(var key in frames[framesId[0]].content){
                        list.insertGO(frames[framesId[0]].content[key]);
                        if(frames[framesId[0]].content[key].type!="text")
                        initInteract(frames[framesId[0]].content[key]);   
                    }
                    currentFrame.initByJSON(frames[framesId[0]]);
                }
                $scope.disableAllStateMenu();
                signalsCtrl.removeAllSignals();
                signalsCtrl.initSignal('infographic',document,'keydown',function(event){
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
                    }
                    if(currentFrame.getSelectedGO()){
                        x = currentFrame.getSelectedGO().get('dataX');
                        y = currentFrame.getSelectedGO().get('dataY');
                        x += deltaX;
                        y += deltaY;
                        observer.emit('drag',{dataX:x,dataY:y}); 
                    }  
                    if(!$scope.$$phase){
                        $scope.$apply();
                    }             
                });
                $timeout(function() {setSvg();setSvgFrames();});
                
            };
            
            init();
        
        }
    ]);