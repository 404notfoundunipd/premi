/** 
    * Name:         infographic.js    
    * Package:      premi/client/editor/lib/
    * Author:       De Lazzari Enrico
    * Date:         2015-6-25

    * Use:
    Rappresenta un oggetto infografica. Un infografica contiene i
    frame e gli oggetti che si vogliono visualizzare nella presentazione.

    
    * Changes:
    Version     Date        Who                 Changes             Reason
    ----------------------------------------------------------------------------
    0.5         2015-7-5    De Lazzari Enrico   removeSelectedGO     correzioni
    ----------------------------------------------------------------------------
    0.4         2015-7-3    De Lazzari Enrico   initByDefault,       correzioni
                                                addGO
    ----------------------------------------------------------------------------
    0.3         2015-6-28   De Lazzari Enrico   incremento classe
    ----------------------------------------------------------------------------
    0.2         2015-6-26   De Lazzari Enrico   incremento classe
    ----------------------------------------------------------------------------
    0.1         2015-6-25   De Lazzari Enrico   scrittura iniziale classe
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
	.factory('Infographic', ['GOContainer', 'FrameFactory','SaverFactory',
		function(GOContainer,FrameFactory,SaverFactory) {
				
            return GOContainer.extend(function () {
                this.info        = {
                    framesId : [],
                    backgroundColor : "white",
                    type     : "infographic"
                };  

                this.frames      = {};			// contiene gli oggetti JSON di tipo frame che appartengono all'infografica
                this.saver       = SaverFactory;	// contiene un oggetto saver che permette di interfacciarsi con il database
                this.removeFrame = function(idFrame){
                    delete this.frames[idFrame];
                    for(var i = 0, found=false; i < this.info.framesId.length && !found; i++){
                        if(this.info.framesId[i] == idFrame){
                            this.info.framesId.splice(i,1);
                            found = true;
                        }
                    }
                }
            })
            .methods({
                initByJSON : function(infJSON,framesId,frames){
                    this.supr(infJSON);
                    this.info = infJSON;
                    this.frames = frames;
                    this.info.framesId = framesId;
                    this.saver = SaverFactory.setContainer(this.info._id,'infographic').init();
                    return this;
                },
                initByDefault : function(){
                    var defaultInf = {
                        framesId : [],
                        type     : 'infographic'
                    };
                    this.info = this.supr().getJSON();
                    for(var key in defaultInf){
                        this.info[key] = defaultInf[key];
                    }
                    this.info.backgroundColor = "white";
                    this.frames = {};
                    this.saver.init();
                    return this;
                },
                getType : function(){
                    return "infographic";
                },
                getFramesContent : function(){
                    return this.frames;
                },
                getArrayFrameId : function(){
                    return this.info.framesId;
                },
                getSelectedGO : function(){
                    return this.supr();
                },
                setSelectedGO : function(concreteGObj){
                    this.supr(concreteGObj);
                    return this;
                },
                /* selectGO serve per selezionare l'oggetto grafico presente nell'infographic che si sta modificando passando 
                   in input il suo identificativo. Il metodo seleziona l'oggetto controllando se è già selezionato. In caso contrario
                   lo seleziona inizializzando il campo selectedGO utilizzando il metodo initByJSON di GOProvider.
                */
                selectGO : function(idGO){
                    if(this.getSelectedGO() && this.getSelectedGO().getId() == idGO){
                        return this;
                    }                    
                    if(this.info.content.hasOwnProperty(idGO)){
                        this.supr(idGO);
                    }
                    else if(this.frames.hasOwnProperty(idGO)){
                        this.setSelectedGO(FrameFactory.initByJSON(this.frames[idGO],true));
                    }
                    else{
                        this.setSelectedGO(null);
                    }
                    return this;
                },
                //@fixing request : 
                addGO : function(GO,type){
                    if(!type){
                        type = GO.type;
                    }
                    if(type != "frame"){
                        this.supr(GO,type);                        
                        this.saver.insert(this.getSelectedGO().getJSON());
                    }
                    else{
                        var temp = FrameFactory.initByJSON(GO,true);
                        //temp.update(GO);
                        this.setSelectedGO(temp);
                        this.info.framesId.push(temp.getId());
                        this.frames[this.info.framesId[this.info.framesId.length-1]] = temp.getJSON();
                        this.saver.insert({_id : GO._id, type : "frame"});
                    }
                    return this;
                },
                /*@fixing request: non serve idGO aggiungere metodo removeGO*/
                removeSelectedGO : function(idGO){
                    if(!idGO && !this.getSelectedGO()){

                        return this;
                    }
                    if(!idGO && this.getSelectedGO()){                        
                        idGO = this.getSelectedGO().getId();
                        if(this.getSelectedGO().get('type') != "frame"){                            
                            this.saver.remove(this.getSelectedGOId(),this.getSelectedGOType());
                            this.supr(idGO);
                            return this;
                        }
                        else{                            
                            this.saver.remove(this.getSelectedGOId(),this.getSelectedGOType());
                            this.removeFrame(idGO);
                            this.setSelectedGO(null);
                        }
                        this.setSelectedGO(null);
                    }
                    else if(this.info.content.hasOwnProperty(idGO)){
                        this.saver.remove(idGO,this.info.content[idGO].type);
                        this.supr(idGO);
                    }
                    else if(this.frames.hasOwnProperty(idGO)){
                        this.saver.remove(idGO,'frame');
                        this.removeFrame(idGO);
                        this.setSelectedGO(null);
                    }
                    return this;
                },
                getGOJSON : function(idGO){
                    if(this.info.content.hasOwnProperty(idGO)){
                        return this.info.content[idGO];
                    }
                    if(this.frames.hasOwnProperty(idGO)){
                        return this.frames[idGO];
                    }
                    return undefined;
                },
                updateSelectedGO : function(update){
                    if(this.getSelectedGO()){
                        this.getSelectedGO().update(update);
                        this.saver.update(this.getSelectedGO().getId(),this.getSelectedGO().getType(),update);
                    }
                    return this;
                },
                updateGO : function(update,idGO){
                    
                    if(this.info.content.hasOwnProperty(idGO)){
                        this.supr(update,idGO);
                    }
                    else{
                        this.selectGO(idGO);
                        this.getSelectedGO().update(update);

                    }
                    this.saver.update(this.getSelectedGO().getId(),this.getSelectedGO().getType(),update);
                },
                /* richiama il metodo della superclasse per effetturare il resizing dell'oggetto selezionato e tramite l'oggetto saver
                   appende le modifiche perchè venga aggiornato il database
                */
                resizeGO : function(resize,idGO){
                    this.supr(resize,idGO);
                    this.saver.update(this.getSelectedGO().getId(),this.getSelectedGO().getType(),resize);
                },
                /* richiama il metodo della superclasse per effetturare lo spostamento dell'oggetto selezionato e tramite l'oggetto saver
                   appende le modifiche perchè venga aggiornato il database
                */
                dragGO : function(drag,idGO){
                    this.supr(drag,idGO);
                    this.saver.update(this.getSelectedGO().getId(),this.getSelectedGO().getType(),drag);
                },
                hasFrame : function(idGO){
                    return this.frames.hasOwnProperty(idGO);
                },
                /*
                salva le operazioni pendenti nel database. Viene utilizzato il metodo save() che si occupa di inserire le operazioni 
                di inserimento, modifica, rimozione presenti nell'oggetto Saver nel database. 
                */
                save : function(){
                    this.saver.save();
                }
            });
            
        }
	]).factory('InfographicFactory',['Infographic',
        function(Infographic){
            return new Infographic;
        }]);
