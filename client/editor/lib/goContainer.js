/** 
    * Name:         goContainer.js    
    * Package:      premi/client/editor/lib/
    * Author:       De Lazzari Enrico
    * Date:         2015-6-14

    * Use:
    Rappresenta il contenitore degli oggetti che possono essere inseriti
    in un frame. Per inizializzare gli oggetti image, shape, text si utilizzano i metodi
    di GOProvider initByJSON(GO) e init(type).

    
    * Changes:
    Version     Date        Who                 Changes             Reason
    0.5         2015-7-07   Vegro Federico      initByJSON          cambiati alcuni valori
    ----------------------------------------------------------------------------
    0.4         2015-7-02   Camborata Marco     Aggiunti resizeGO, dragGO
    ----------------------------------------------------------------------------
    0.3         2015-6-16   De Lazzari Enrico   incremento metodi
    ----------------------------------------------------------------------------
    0.2         2015-6-15   De Lazzari Enrico   aggiunti init, initByJSon
    ----------------------------------------------------------------------------
    0.1         2015-6-14   De Lazzari Enrico   scrittura scheletro classe
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
	.factory('GOContainer', ['GObject','ImageFactory','ShapeFactory','TextFactory',
		function(GObject,ImageFactory,ShapeFactory,TextFactory) {
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
                    background : {
                        image : "",
                        size : "cover",
                        color : "antiquewhite",
                        repeat : "no-repeat",

                    },
                    content : {},
                    idpres : "",
                    owner : "",
                }
                this.selectedGO = null;		//contiene l'oggetto GObject contenuto nel goContainer corrente selezionato dall'utente
                this.findNewId = function(){
                    console.log('findNewId',this.info.content)
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
                    console.log("back-gocontainer",value)
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
                initByJSON : function(frameJSON){
                    this.supr(frameJSON);
                    this.info = frameJSON;
                    return this;
                },
                initByDefault : function(){
                    var defaultFrame = {
                        background : {
                            image : "",
                            size : "cover",
                            color : "antiquewhite",
                            repeat : "no-repeat",

                        },
                        content : {},
                        presid : "",
                        owner : "",
                        type : "",
                    };
                    this.info = this.supr().getJSON();
                    for(var key in defaultFrame){
                        this.info[key] = defaultFrame[key];
                    }
                    return this;
                },
                getGOContent : function(){
                    return this.info.content;
                },
                /* selectGO serve per selezionare l'oggetto grafico presente nel GOContainer che si sta modificando passando 
                   in input il suo identificativo. Il metodo seleziona l'oggetto controllando se è già selezionato. In caso contrario
                   lo seleziona inizializzando il campo selectedGO utilizzando il metodo initByJSON di GOProvider.
                */
                selectGO : function(idGO){                    
                    if(this.selectedGO && this.selectedGO.getId() == idGO){
                        return this;
                    }
                    if(this.info.content.hasOwnProperty(idGO)){                        
                        this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                    }
                    else{
                        this.selectedGO = null;
                    }
                    return this;
                },
                deselectGO : function(){
                    this.selectedGO = null;
                    return this;
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
                setSelectedGO : function(concreteGObj){
                    this.selectedGO = concreteGObj;
                    return this;
                },
                addGO : function(GO,type){
                    this.selectedGO = GOProvider.init((GO.type||type));
                    GO._id = this.findNewId();
                    this.selectedGO.update(GO);
                    console.log('addGO',GO._id)
                    this.info.content[this.selectedGO.getId()]=this.selectedGO.getJSON();
                    return this;
                },
                removeSelectedGO : function(idGO){
                    if(!idGO && this.selectedGO){
                        delete this.info.content[this.selectedGO.getId()];
                        this.selectedGO = null;
                    }
                    else if(this.info.content.hasOwnProperty(idGO)){
                        delete this.info.content[idGO];
                        this.selectedGO = null;
                    }
                    console.log("remove",this.info.content)
                    return this;
                },
                getGOJSON : function(idGO){
                    return this.info.content[idGO];
                },
                updateSelectedGO : function(update){
                    if(this.selectedGO){
                        this.selectedGO.update(update)
                    }
                    return this;
                },
                /* richiama su selectedGO, i metodi resize e drag appartenenti ad un oggetto GObject per effettuare il resizing dell'oggetto selezionato. 
                Viene utilizzato il metodo update(idGO,type,update) per appendere le operazioni di modifica nell'oggetto Saver che andrà
                ad aggiornare il database. resize è un oggetto JSON che contiene chiave e valore dei campi height, width, dataX e dataY per permettere di
                selezionare l'oggetto appartenente al GOContainer
                */
                resizeGO : function(resize,idGO){
                    if(!idGO && !this.selectedGO){
                        return this;
                    }
                    if(idGO){
                        if(!this.info.content.hasOwnProperty(idGO)){
                            return this;
                        }
                        if(this.selectedGO.getId() != idGO){
                            this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                        }
                    }
                    this.selectedGO.resize(resize.height,resize.width);
                    this.selectedGO.drag(resize.dataX,resize.dataY);
                    return this;
                },
                /* richiama su selectedGO, il metodo drag appartenenti ad un oggetto GObject per effettuare lo spostamento dell'oggetto selezionato. 
                Viene utilizzato il metodo update(idGO,type,update) per appendere le operazioni di modifica nell'oggetto Saver che andrà
                ad aggiornare il database. drag è un oggetto JSON che contiene chiave e valore dei campi dataX e dataY per permettere lo spostamento dell'oggetto 
                appartenente al GOContainer
                */
                dragGO : function(drag,idGO){
                    if(!idGO && !this.selectedGO){
                        return this;
                    }
                    if(idGO){
                        if(!this.info.content.hasOwnProperty(idGO)){
                            return this;
                        }
                        if(this.selectedGO.getId() != idGO){
                            this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                        }
                    }
                    this.selectedGO.drag(drag.dataX,drag.dataY);
                    return this;
                },
                /* update permette di aggiornare i campi dell'attributo info dell'oggetto selezionato presente su selectedGO.
                   l'attributo update è un oggetto JSON con chiave e valore congrui all'oggetto info del tipo dell'oggetto selezionato.
                */
                updateGO : function(update,idGO){
                    if(!idGO && !this.selectedGO){
                        return this;
                    }
                    if(idGO){
                        if(!this.info.content.hasOwnProperty(idGO)){
                            return this;
                        }
                        if(!this.selectedGO || this.selectedGO.getId() != idGO){
                            this.selectedGO = GOProvider.initByJSON(this.info.content[idGO]);
                        }
                    }
                    this.selectedGO.update(update);
                    return this;
                },
            
            });
            
        }
	]).factory('GOContainerFactory',['GOContainer',
        function(GOContainer){
            return new GOContainer;
        }]);
