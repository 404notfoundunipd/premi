/** 
    * Name:         trail.js
    * Package:      premi/client/presentations/lib/
    * Author:       De Lazzari Enrico
    * Date:         2015-07-02

    * Use:
    Trail modella un percorso di presentazione, attraverso una lista delle slide con-
    tenute al suo interno, e una matrice che rappresenta la struttura del percorso e
    segnala la presenza di percorsi di specializzazione.
    
    * Changes:
    Version     Date        Who                 Changes             Reason
    ----------------------------------------------------------------------------
    0.6         2015-07-27  De Lazzari Enrico   initPath            corretto errore
    ----------------------------------------------------------------------------
    0.5         2015-07-27  De Lazzari Enrico   initPath            creato metodo, tolto init
    ----------------------------------------------------------------------------
    0.4         2015-07-26  De Lazzari Enrico   insertInSlide       corretto errore nel ciclo 
    ----------------------------------------------------------------------------
    0.3         2015-07-19  De Lazzari Enrico   incremento della classe
    ----------------------------------------------------------------------------
    0.2         2015-07-03  De Lazzari Enrico   incremento della classe
    ----------------------------------------------------------------------------
    0.1         2015-07-02  De Lazzari Enrico   prima stesura classe
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

angular.module("premi")
	.factory('Trail',[
		function(){
			return klass(function(){
				//array id slides
                /* Lista di tutte le slide contenute all'interno della presentazione create dall'utente. 
                   Contiene quindi anche quelle non aggiunte al percorso
                */
                this.slidesIndex = {}; 
                /* Matrice rettangolare che rappresenta il percorso di specializzazione. 
                   Contiene i codici identificativi delle slide presenti nel percorso.
                   Se non esistono percorsi di specializzazione la matrice sarà composta da una sola riga e tante colonne quante sono 
                   le slide presenti al suo interno, la prima collocata nella posizione [0][0]. 
                   Ogni riga aggiuntiva indicherà quindi un percorso di specializzazione, che parte dalla slide il cui codice identificativo 
                   è inserito nella posizione [riga][0]
                */
                this.path = [[]]; 	
                this.currentChkPnt = 0; 	//Il checkpoint nel quale l'utente sta lavorando
                this.currentStep = 0;		//Il punto del percorso di specializzazione nel quale l'utente sta lavorando
                this.hashSlidePos = {};		//Lista di codici identificativi delle slide di cui è composto il percorso di presentazione. Sono associati a due integer: row indica la riga in cui si trova la slide all'interno della matrice path, mentre col indica la colonna
                this.checkPointHash = {};	//Lista delle slide che fungono da checkpoint. È una lista di valori id_slide : riga nella matrice del percorso
                this.pipe = [];

//---------------- METODI PRIVATI --------------------------------------
                
                //findChkPntRow trova la riga corrispondente alla slide che si trova nel trail in posizione [row][col]
                this.findChkPntRow = function(checkPointSlide){
                    //var slideToFind = this.slidesIndex[this.path[checkPoint.row][checkPoint.col]];

                    if(this.checkPointHash.hasOwnProperty(checkPointSlide))
                    	return this.checkPointHash[checkPointSlide];
                    return -1;
                };
                
                /*cerca una certa slide all'interno del percorso
                ritorna le coordinate della slide (-1,-1) nel caso non ci sia. ritorna inoltre la riga del checkpoint se esiste
                */
                this.findSlideInPath = function(Slide, Path){
                    coordinate = {
                        row: -1,
                        col: -1,
                        chkRow: -1
                    }
                    var chk = false, found = false;
                    for (var i = 0; i < Path.length; i++) {
                        for(var k = 0; k < Path[i].length; k++){
                            if(Slide != Path[i][k]){
                            }
                            else if(k != 0){

                                coordinate.row = i;
                                coordinate.col = k;
                                found=true;
                                break;
                            }
                            else{
                                if(i == 0){
                                    coordinate.row = 0;
                                    coordinate.col = 0;
                                    coordinate.chkRow = 0;
                                    return coordinate
                                    chk = true;
                                }
                                else{
                                    coordinate.chkRow = i;
                                    chk = true;
                                }
                            }
                        }
                    }
                    if(found){
                        for (var i = 0; i < Path.length; i++) {
                            if(Slide == Path[i][0])
                                coordinate.chkRow = i;
                        };
                    }
                    return coordinate;
                };
//**************** Metodi privati per la modifica del percorso ***********************
                this.insertSlide = function(lvl, pos, what){
                    var coordinate = {
                        row : -1,
                        col : -1
                    };
                    if(lvl == 0 && pos == 0){
                        if(this.path[lvl][pos]){
                            delete this.checkPointHash[this.path[lvl][pos]];                            
                        }
                        this.checkPointHash[what] = 0;
                    }
                    if(this.path[lvl].length == pos){
                        this.path[lvl][pos] = what;
                        coordinate.row = lvl;
                        coordinate.col = pos;
                        this.hashSlidePos[what] = coordinate;
                    }
                    else{
                        var leng = this.path[lvl].length;
                        //vengono shiftate di una posizione tutte le slide dopo la posizione in cui inserire la 
                        //nuova slide 
                        for (var i = leng; i > pos; i--) {
                            
                            this.path[lvl][i] = this.path[lvl][i-1];
                            var slide = this.path[lvl][i];
                            //aggiorna il campo col che rappresenta l'indice della 
                            //colonna in cui si trova la slide
                            this.hashSlidePos[slide].col=i;
                        };
                        this.path[lvl][pos] = what;
                        coordinate.row = lvl;
                        coordinate.col = pos;
                        this.hashSlidePos[what] = coordinate;
                    }
                    this.currentStep = pos;
                    this.currentChkPnt = lvl;
                    return this;
                };
                /* metodo per la rimozione di una slide dal percorso
                   dopo l'eliminazione viene aggiornata la hash contenente le coordinate 
                   delle slide all'interno del percorso
                   rende la slide con id = IdSlide checkpoint
                   aggiunge una riga a path e aggiorna la hash contenente i checkpoint
                   rimuove la marcatura a checkpoint di una slide
                   elimina di conseguenza tutte le slide correlate al percorso
                   conn radice quel checkpoint
                */
                this.switchSlides  = function(pos1,pos2,lvl){
                    var temp = this.path[lvl][pos1] ;
                    this.path[lvl][pos1] = this.path[lvl][pos2];
                    this.path[lvl][pos2] = temp;
                    this.hashSlidePos[this.path[lvl][pos1]].col = pos1;
                    this.hashSlidePos[this.path[lvl][pos2]].col = pos2;
                };

                //ritorna l'indice nell'array di una certa slide
                this.findSlideIndex = function(IdSlide){
                    return this.slidesIndex[IdSlide];
                };
			})
			.methods({
//---------------- METODI PUBBLICI ----------------------------------------
//**************** Metodo di inizializzazione del percorso ************
                /* Data una lista di slides ed una matrice rettangolare, inizializza i tre hash slidesIndex, hashSlidePos e checkPointHash.
                   Restituisce un riferimento al this per consentire chiamate consecutive ai metodi della classe
                */
                initPath : function(Slides, inPath){
                    this.path = inPath;
                    for (var i = 0; i < Slides.length; i++) {
                        //riempimento hash delle slide correlate alla presentazione 
                        //KEY : Id della slide, VALUE : Posizione nell'array delle slide
                        this.slidesIndex[Slides[i]] = i;
                        var coordinate = this.findSlideInPath(Slides[i],inPath);
                        if(coordinate.row != -1){

                            //se la slide appartiene al percorso le sue coordinate vengono
                            //salvate nell'hash delle slide contenute nel percorso
                            this.hashSlidePos[Slides[i]] = {
                                row : coordinate.row,
                                col : coordinate.col
                            };
                            
                        }
                        if(coordinate.chkRow != -1){
                            //se la slide è un check point viene inserita nella hash dedicata ai checkpoint
                            this.checkPointHash[Slides[i]]=coordinate.chkRow;
                        }
                    }
            
                    return this;
                },
//***************** Metodi di spostamento nel percorso *********************
				//avanzamento nel percorso
                /* Restituisce la posizione (all'interno della lista di tutte le slides create dall'utente nella presentazione corrente) 
                   della prossima slide rispetto alla posizione in cui l'utente si trova nel percorso che sta visualizzando
                */
                nextSlide : function(){
					this.currentStep += 1;
                    if(this.currentStep >= this.path[this.currentChkPnt].length){
                        //se sono finite le slide del percorso di specializzazione si ritorna 
                        //all'ultimo checkpoint in cui si è entrati
                        if(this.returnToCheckPoint() == -1){
                            this.currentChkPnt = 0;
                            this.currentStep = 0;
                        }
                    }
                    //path[this.currentChkPnt][this.currentStep] rappresenta l'id della slide
                    //nell'array inizializzato durante la lettura del file html
                    this.pipe.push(this.path[this.currentChkPnt][this.currentStep]);
                    return this.slidesIndex[this.path[this.currentChkPnt][this.currentStep]];
				},
		   /* Restituisce la posizione (all'interno della lista di tutte le slides create dall'utente nella presentazione corrente) 
                   della slide precedente rispetto alla posizione in cui l'utente si trova nel percorso che sta visualizzando
                    */
		        prevSlide : function(){
					this.currentStep -= 1;
                    if(this.currentStep <= 0){
                        //se la slide precedente è il checkpoint del percorso viene ritornata
                        //la posizione all'interno del percorso di appartenenza del checkpoint
                        if(this.returnToCheckPoint() == -1){
                            this.currentChkPnt = 0;
                            this.currentStep = 0;
                        }
                    }
                    return this.slidesIndex[this.path[this.currentChkPnt][this.currentStep]];
				},
                
                previous : function(){
                    this.pipe.pop();
                    if(this.pipe.length > 0){
                        var coo = this.hashSlidePos[this.pipe[this.pipe.length-1]];
                        this.currentChkPnt = coo.row;
                        this.currentStep = coo.col;
                        return this.slidesIndex[this.path[this.currentChkPnt][this.currentStep]];
                    }
                },
				enterInCheckPoint : function(){
                    //controllo se la slide attuale è effettivamente un checkpoint
                    if(!this.isCurrentSlideChkPnt() || (this.currentChkPnt == 0 && this.currentStep == 0))
                        return -1;
                    var checkPoint = {
                        row: this.currentChkPnt,
                        col: this.currentStep
                    };
                    var slideToFind = this.path[checkPoint.row][checkPoint.col];
                    var checkRow = this.findChkPntRow(slideToFind);
                    //questo controllo è solo per sicurezza
                    if(checkRow != -1){
                        this.currentChkPnt = checkRow;

                        if(this.path[this.currentChkPnt].length > 1){
                            this.currentStep = 1;
                            this.pipe.push(this.path[this.currentChkPnt][this.currentStep]);
                        }
                        else{ 
                            //se il percorso di specializzazione contiene solo la slide checkpoint
                            return  this.returnToCheckPoint();
                        }
                    }
                    return this.path[this.currentChkPnt][this.currentStep]; 
				},
				returnToCheckPoint : function(){
                    if(this.currentChkPnt == 0){
                        return -1;
                    }
                    var idCheck = this.path[this.currentChkPnt][0];
                    var coordinate = this.hashSlidePos[idCheck];
                    if(coordinate){
                        this.currentChkPnt = coordinate.row;
                        this.currentStep = coordinate.col;
                        this.pipe.push(this.path[this.currentChkPnt][this.currentStep]);
                        return this.slidesIndex[this.path[this.currentChkPnt][this.currentStep]];
                    }
                    return -1;
				},
                //goToSlide richiede l'id della slide non la sua posizione nell'array
				goToSlide : function(idSlide){
                    if(this.hashSlidePos.hasOwnProperty(idSlide)){
                        var coo = this.hashSlidePos[idSlide];
                        this.currentChkPnt = coo.row;
                        this.currentStep = coo.col;
                        this.pipe.push(this.path[this.currentChkPnt][this.currentStep]);
                    }

                    return this.slidesIndex[this.path[this.currentChkPnt][this.currentStep]];
                },
                goToFirst : function(){
                    this.currentStep = 0;
                    this.currentChkPnt = 0;
                    return this;
                },
//****************** Metodi di utilità *************************
                //ritorna true se la slide attuale è un checkpoint
				isCurrentSlideChkPnt : function(){
					return this.isCheckPoint(this.path[this.currentChkPnt][this.currentStep]);
				},
                isCheckPoint : function(idSlide){
                    return this.checkPointHash.hasOwnProperty(idSlide);
                },
                //ritorna true se la slide con id SlideIndex appartiene al percorso
                isSlideInTrail : function(idSlide){                    
                    return this.hashSlidePos.hasOwnProperty(idSlide);
                },
                //ritorna l'indice dell'array in cui si trova la slide
				getCurrentIndex : function(){
                    return this.slidesIndex[this.path[this.currentChkPnt][this.currentStep]];
                },
                getCurrentId : function(){
                    return this.path[this.currentChkPnt][this.currentStep];
                },
                getCheckId : function(idSlide){
                    if(this.hashSlidePos.hasOwnProperty(idSlide)){
                        var lvl = this.hashSlidePos[idSlide].row;
                        return this.path[lvl][0];
                    }
                    return null;
                },
                getSpecPath : function(idSlide){
                    var specPath = [];
                    var tempCheck = this.getCheckId(idSlide);
                    while(tempCheck != this.path[0][0]){
                        specPath.unshift(tempCheck);                       
                        tempCheck = this.getCheckId(tempCheck);
                    }
                    specPath.unshift(this.path[0][0]);  
                    return specPath;                  
                },
//***************** Metodi di modifica del percorso ************
                //richiede l'id' della slide che si vuole inserire
                //inserisce una slide successivamente a quella attualmente selezionata
                insertSlideInPath : function(idSlide,idCheck){
                    var lvl = -1;
                    if(!this.slidesIndex.hasOwnProperty(idSlide)){
                        return this;
                    }
                    if(!idCheck){
                        lvl  = 0;
                    }
                    else {
                        lvl = this.checkPointHash[idCheck];
                        if(lvl<0){
                            return this;
                        }
                    }
                    this.insertSlide(lvl,this.path[lvl].length,idSlide);
                    return this;
                },
                //richiede l'id della slide che si vuole rimuovere
                //rimuove la slide attualmente selezionata
                removeSlide : function(IdSlide){
                    if(!this.hashSlidePos.hasOwnProperty(IdSlide)){
                        return this;
                    }
                    var lvl = this.hashSlidePos[IdSlide].row;
                    var pos = this.hashSlidePos[IdSlide].col;
                    if(pos == 0 && lvl == 0){
                        this.path = [[]]; 
                        this.currentChkPnt = 0;
                        this.currentStep = 0;
                        this.hashSlidePos = {};
                        this.checkPointHash = {};
                        return this;
                    }
                    if(this.checkPointHash.hasOwnProperty(IdSlide)){
                        this.removeChkPoint(IdSlide);
                    }
                    if(pos == this.path[lvl].length-1){
                        this.path[lvl].pop();
                        this.currentStep = this.path[lvl].length-1;
                    }
                    else{
                        this.path[lvl].splice(pos, 1);
                        //aggiorna il campo col 
                        for(var i = pos; i < this.path[lvl].length; i++){
                            this.hashSlidePos[this.path[lvl][i]].col = i;
                        }
                    }
                    delete this.hashSlidePos[IdSlide];
                    return this;
                },
                makeCheckPoint : function(IdSlide){
                    if(this.checkPointHash.hasOwnProperty(IdSlide)){
                        return this;
                    }
                    var lvl = this.hashSlidePos[IdSlide].row;
                    var pos = this.hashSlidePos[IdSlide].col;
                    this.path[this.path.length] = [];
                    this.path[this.path.length-1][0] = this.path[lvl][pos];
                    this.checkPointHash[IdSlide] = this.path.length - 1;
                    return this;
                },
                removeChkPoint : function(IdSlide){
                    //cerca la riga che determina il percorso di specializzazione
                    var where = this.findChkPntRow(IdSlide);
                    if(where == 0){
                        this.removeSlide(IdSlide);
                        return this;
                    }

                    if(where != -1){
                        var i= this.path[where].length -1; 
                        //rimozione slide appartenenti al percorso del checkpoint
                        //ATTENZIONE può essere ricorsiva
                        while(i>0){
                            this.removeSlide(this.path[where][i]);
                                i--;
                        }
                        //elimina la riga del checkpoint
                        this.path.splice(where, 1);
                        //elimina il checkpoint dall'hash dei checkpoint
                        delete this.checkPointHash[IdSlide];
                        for(var i=0; i < this.path.length; i++){
                            this.checkPointHash[this.path[i][0]] = i;
                        }
                    }
                    return this;
                },
                switchDxSlide : function(idSlide){
                    if(!this.hashSlidePos.hasOwnProperty(idSlide)){
                        return this;
                    }
                    var lvl = this.hashSlidePos[idSlide].row;
                    var pos = this.hashSlidePos[idSlide].col;
                    if(lvl == 0 && pos == 0 && this.path[0][1] && !this.checkPointHash.hasOwnProperty(this.path[0][1])){
                        delete this.checkPointHash[this.path[0][0]];
                        this.checkPointHash[this.path[0][1]] = 0;
                        this.switchSlides(1,0,0);
                        return this;
                    }
                    if(pos == 0 || (this.path[lvl].length-1) <= pos){
                        return this;
                    }
                    this.switchSlides(pos,pos+1,lvl);
                    return this;
                },
                switchSxSlide : function(idSlide){
                    if(!this.hashSlidePos.hasOwnProperty(idSlide)){
                        return this;
                    }
                    var lvl = this.hashSlidePos[idSlide].row;
                    var pos = this.hashSlidePos[idSlide].col;
                    if(lvl == 0 && pos == 1 && !this.checkPointHash.hasOwnProperty(this.path[0][1])){
                        delete this.checkPointHash[this.path[0][0]];
                        this.checkPointHash[idSlide] = 0;
                        this.switchSlides(1,0,0);
                        return this;
                    }
                    if(0 >= pos-1){
                        return this;
                    }
                    this.switchSlides(pos,pos-1,lvl);
                    return this;
                },
                //ritorna il percorso
                getTrail : function(){
                    return this.path;
                },
                isTrailEmpty : function(){
                    if(this.path[0][0] == null)
                        return true;
                    return false; 
                },
			})

		}

	])
	.factory('TrailFactory',['Trail',

		function(PathModel){
			return new PathModel;
		}

	]);
