/** 
    * Name:         frame.js    
    * Package:      premi/client/editor/lib/
    * Author:       Rettore Andrea
    * Date:         2015-6-8

    * Use:
    Frame e' una classe che rappresenta un frame di una presentazione. E’ un oggetto
    che può essere rappresentato nella presentazione. Per inizializzare gli oggetti
    image, shape, text si utilizzano i metodi di GOProvider initByJSON(GO) e
    init(type)

    
    * Changes:
    Version     Date        Who             Changes             Reason
    ----------------------------------------------------------------------------
    0.6         2015-6-22   Rettore Andrea  getBackgroundColor  aggiunta metodo
    ----------------------------------------------------------------------------
    0.5         2015-6-22   Rettore Andrea  resizeGO            correzioni
    ----------------------------------------------------------------------------
    0.4         2015-6-16   Rettore Andrea  incremento metodi
    ----------------------------------------------------------------------------
    0.3         2015-6-15   Rettore Andrea  incremento metodi
    ----------------------------------------------------------------------------
    0.2         2015-6-14   Rettore Andrea  incremento metodi 
    ----------------------------------------------------------------------------
    0.1         2015-6-12   Rettore Andrea  creazione della classe    
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


angular.module("premi.editor")
	.factory('Frame', ['GObject','ImageFactory','ShapeFactory','TextFactory', 'SaverFactory',
		function(GObject,ImageFactory,ShapeFactory,TextFactory,SaverFactory) {
            var GOProvider = {
                init : function(type){
                    if(type =="image"){
                        return ImageFactory.initByDefault();
                    }
                    else if(type =="shape"){
                        return ShapeFactory.initByDefault();
                    }
                    else if(type =="text"){
                        return TextFactory.initByDefault();
                    }
                },
                initByJSON : function(GO){
                    if(GO.type =="image"){
                        return ImageFactory.initByJSON(GO);
                    }
                    else if(GO.type =="shape"){
                        return ShapeFactory.initByJSON(GO);
                    }
                    else if(GO.type =="text"){
                        return TextFactory.initByJSON(GO);
                    }
                },
            }
			
            return GObject.extend(function () {
                this.info = {
                    backgroundColor : "#FFFFFF", 	
                    content : {}, 			//è un oggetto JSON che contiene gli oggetti che fanno parte del frame
                    type : "frame", 			
                }
                this.selectedGO = null;  		//contiene l'oggetto GObject contenuto nel frame corrente selezionato dall'utente
                this.saver = SaverFactory;  		//contiene un oggetto saver che permette di interfacciarsi con il database
                this.findNewId = function(){		
                    for(var i=0, found=false; i < 300 && !found; i++){
                        if(!this.info.content.hasOwnProperty(this.info._id+'-go-'+i)){
                            found = true;
                            return this.info._id+'-go-'+i;
                        }
                    }
                    return "not-found";
                };
                
            })
            .methods({
                get : function(field){				  
                    return this.supr(field) || this.info[field];  
                },
                set : function(field,value){			  
                    console.log("set-frame-ba",value)		  
                    if(this.info.hasOwnProperty(field)){	  
                        this.info[field] = value;
                    }
                    else{
                        this.supr(field,value);
                    }
                    return this;
                },
                /* update permette di aggiornare i campi dell'attributo info.
                   l'attributo update è un oggetto JSON con chiave e valore congrui all'oggetto info.
                */
                update : function(update){
                    this.supr(update);
                    for(var key in update){
                        if(this.info.hasOwnProperty(key))
                            this.info[key] = update[key];
                    }
                    return this;
                },
                getJSON : function(){
                    return this.info;
                },
                initByJSON : function(frameJSON,disableSaver){
                    this.info = this.supr(frameJSON).getJSON();
                    if(!disableSaver){
                        this.saver.setContainer(this.info._id,'frame');
                        this.saver.init();
                    }
                    return this;
                },
                initByDefault : function(disableSaver){
                    var defaultFrame = {
                        backgroundColor : "#FFFFFF",
                        content : {},
                        type : "frame",
                    };
                    this.info = this.supr().getJSON();
                    for(var key in defaultFrame){
                        this.info[key] = defaultFrame[key];
                    }
                    if(!disableSaver){
                        this.saver.setContainer(this.info._id,'frame');
                        this.saver.init();
                    }
                    return this;
                },
                getType : function(){
                    return "frame";
                },
                getGOContent : function(){
                    return this.info.content;
                },
                /* selectGO serve per selezionare l'oggetto grafico presente nel frame che si sta modificando passando 
                   in input il suo identificativo. Il metodo seleziona l'oggetto controllando se è già selezionato. In caso contrario
                   lo seleziona inizializzando il campo selectedGO utilizzando il metodo initByJSON di GOProvider.
                */
                selectGO : function(idGO){
                    console.log("selectedGO",idGO)
                    if(this.selectedGO && this.selectedGO.getId() == idGO){
                        return this;
                    }
                    if(this.info.content.hasOwnProperty(idGO)){
                        this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                        console.log("selectedGO",this.selectedGO.getJSON())
                    }
                    else{
                        this.selectedGO = null;
                    }
                    return this;
                },
                deselectGO : function(){
                    this.selectedGO = null;
                },
                getSelectedGOId : function(){
                    if(this.selectedGO){
                        return this.selectedGO.getId();
                    }
                    return undefined;
                },
                getSelectedGOType : function(){
                    if(this.selectedGO){
                        return this.selectedGO.getType();
                    }
                    return undefined;
                },
                getSelectedGO : function(){
                    return this.selectedGO;
                },
                addGO : function(GO,type){
                    this.selectedGO = GOProvider.init((GO.type||type));
                    GO._id = this.findNewId();
                    this.selectedGO.update(GO);
                    this.info.content[this.selectedGO.getId()]=this.selectedGO.getJSON();
                    this.saver.insert(this.selectedGO.getJSON());
                    return this;
                },
                removeSelectedGO : function(idGO){
                    if(!idGO && this.selectedGO){
                        console.log("remove",this.selectedGO.getJSON())
                        this.saver.remove(this.selectedGO.getId(),this.selectedGO.getType());
                        delete this.info.content[this.selectedGO.getId()];
                        this.selectedGO = null;
                    }
                    else if(this.info.content.hasOwnProperty(idGO)){
                        this.saver.remove(idGO,this.info.content[idGO].type);
                        delete this.info.content[idGO];
                        this.selectedGO = null;
                    }
                    return this;
                },
                getGOJSON : function(idGO){
                    return this.info.content[idGO];
                },
                updateSelectedGO : function(update){
                    if(this.selectedGO){
                        this.selectedGO.update(update);
                        this.saver.update(this.selectedGO.getId(),this.selectedGO.getType(),update);
                    }
                    return this;
                },
                /* richiama su selectedGO, i metodi resize e drag appartenenti ad un oggetto GObject per effettuare il resizing dell'oggetto selezionato. 
                Viene utilizzato il metodo update(idGO,type,update) per appendere le operazioni di modifica nell'oggetto Saver che andrà
                ad aggiornare il database. resize è un oggetto JSON che contiene chiave e valore dei campi height, width, dataX e dataY per permettere di
                selezionare l'oggetto appartenente al frame
                */
                resizeGO : function(resize,idGO){
                    /*if(!idGO){
                        if(!this.selectedGO){
                            return this;
                        }
                        idGO = this.selectedGO.getId();
                    }
                    if(!this.selectedGO || this.selectedGO.getId() != idGO){
                        if(!this.info.content.hasOwnProperty(idGO)){
                            return this;
                        }
                        this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                    }*/
                    this.selectedGO.resize(resize.height,resize.width);
                    this.selectedGO.drag(resize.dataX,resize.dataY);
                    this.saver.update(this.selectedGO.getId(),this.selectedGO.getType(),resize);
                },
                 /* richiama su selectedGO, il metodo drag appartenente ad un oggetto GObject per effettuare lo spostamento dell'oggetto selezionato. 
                Viene utilizzato il metodo update(idGO,type,update) per appendere le operazioni di modifica nell'oggetto Saver che andrà
                ad aggiornare il database. drag è un oggetto JSON che contiene chiave e valore dei campi dataX e dataY per permettere lo spostamento dell'oggetto 
                appartenente al frame
                */
                dragGO : function(drag,idGO){
                    if(!idGO){
                        if(!this.selectedGO){
                            return this;
                        }
                        idGO = this.selectedGO.getId();

                    }
                    if(!this.selectedGO || this.selectedGO.getId() != idGO){
                        if(!this.info.content.hasOwnProperty(idGO)){
                            return this;
                        }
                        this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                    }
                    this.selectedGO.drag(drag.dataX,drag.dataY);
                    this.saver.update(this.selectedGO.getId(),this.selectedGO.getType(),drag);
                },
                /* update permette di aggiornare i campi dell'attributo info dell'oggetto selezionato presente su selectedGO.
                   l'attributo update è un oggetto JSON con chiave e valore congrui all'oggetto info del tipo dell'oggetto selezionato.
                */
                updateGO : function(update,idGO){
                    if(!idGO){
                        if(!this.selectedGO){
                            return this;
                        }
                        idGO = this.selectedGO.getId();
                    }
                    if(!this.selectedGO || this.selectedGO.getId() != idGO){
                        if(!this.info.content.hasOwnProperty(idGO)){
                            return this;
                        }
                        this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                    }
                    this.selectedGO.update(update);
                    this.saver.update(this.selectedGO.getId(),this.selectedGO.getType(),update);
                },
                /*
                salva le operazioni pendenti nel database. Viene utilizzato il metodo save() che si occupa di inserire le operazioni 
                di inserimento, modifica, rimozione presenti nell'oggetto Saver nel database. 
                */
                save : function(){
                    this.saver.save();
                },
                getBackgroundColor : function() {
                    if (this.info.hasOwnProperty('backgroundColor')){
                        return this.info.backgroundColor;
                    }
                    return "#000000";
                }
            
            });
            
        }
	]).factory('FrameFactory',['Frame',
        function(frame){
            return new frame;
        }]);
