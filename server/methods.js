/** 
    * Name:         methods.js
    * Package:      premi/server/
    * Author:       Cossu Mattia
    * Date:         2015-06-04

    * Use:
    Lista di metodi che permettono al client di interagire con il database del server.
    
    * Changes:
    Version     Date        Who             Changes                 Reason
    ----------------------------------------------------------------------------
    0.5         2015-06-17  Cossu Mattia    metodi Trail            incremento
    ----------------------------------------------------------------------------
    0.4         2015-06-14  Cossu Mattia    metodi Trail            aggiunti metodi gestione trail
    ----------------------------------------------------------------------------
    0.3         2015-06-14  Cossu Mattia    removeGOContentFramem   correzioni
                                            removeGOContentInfographic
    ----------------------------------------------------------------------------
    0.2         2015-06-05  Cossu Mattia    insertPresentation,     aggiunti campi dati
                                            insertFrameByIdPres
    ----------------------------------------------------------------------------
    0.1         2015-06-04  Cossu Mattia    Creazione primi metodi
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

Meteor.methods({
    'CurrentUser': function(){
		return Meteor.user();
    },
    'insertPresentation': function(title, description){
        var idPres = Presentations.insert({
			"title"       : title,
			"description" : description,
			"owner"       : this.userId,
			"isPublic"    : false,
		});
        var inf = Infographics.insert({
            "dataX"             : -5000,
            "dataY"             : -4000,
            "dataZ"             : 0,
            "scale"             : 1,
            "height"            : 0,
            "width"             : 0,
            "zoom"              : 10,
            "presid"            : idPres,
            "owner"             : this.userId,
            "background"        : {
                                    image : "",
                                    size : "cover",
                                    color : "antiquewhite",
                                    repeat : "no-repeat",
                                },
            "content"           : {},
            "framesId"          : [],
            "type"              : "infogrphics",
        });
        return idPres;
    },
    'editPresentation': function(id, title, description){
		Presentations.update({
			_id : id
		}, {
			$set: {
				"title"       : title,
				"description" : description
			}
		});
    },
    'publicPresentation': function(id, pub){
		Presentations.update({
			_id : id
		}, {
			$set: {
				"isPublic" : pub
			}
		});
    },
    'removePresentation': function(id){
		Presentations.remove({
			"_id" : id
		});

        Infographics.remove({
            "presid" : id,
            "owner"  : this.userId,
        });

        Frames.remove({
            "presid" : id,
            "owner"  : this.userId,
        });

        Trails.remove({
            "presid" : id,
            "owner"  : this.userId,
        });
        return true;
    },
	'getTrailById': function(id){
        Trails.insert({
			"_id"   : id,
			"owner" : this.userId,
		});
    },
	'insertTrail': function(title, presid){
        Trails.insert({
			"title"  : title,
			"owner"  : this.userId,
			"presid" : presid,
            "trail"  : [[]]
		});
    },
    'updateTrail' : function(idTrail,update){
    	Trails.update({
    		"_id"   : idTrail,
    		"owner" : this.userId,
    	},
    	{
    		$set    : update
    	});
    },
    'removeTrailById': function(id){
        Trails.remove({
			"_id"  : id,
			"owner"  : this.userId,
		});
		return true;
    },
    'removeTrailsByIdPres': function(id){
        Trails.remove({
			"presid" : id,
			"owner"  : Meteor.userId(),
		});
    },
    'editTrailById': function(id, title){
        Trails.update({
			"_id"    : id,
			"owner"  : Meteor.userId(),
		}, {
			$set : {
				"title" : title,
			}
		});
    },
    'insertFrameByIdPres': function(presid){
        return Frames.insert({
			"presid"          : presid,
			"owner"           : Meteor.userId(),
			"dataX"           : 0,
			"dataY"           : 0,
			"dataZ"           : 0,
			"height"          : 792,
			"width"           : 1024,
			"scale"           : 1,
			"backgroundColor" : "#FFFFFF",
			"content"         : {},
			"type"            : "frame",
            "lvl"             : 0,
		});
    },
    'editFrameById': function(idFrame,update){
        Frames.update({
			"_id"    : idFrame,
			"owner"  : Meteor.userId(),
		}, {
			$set : update
		});
    },
    'removeFrameById': function(id){        
        var frame = Frames.findOne({
        	'_id' : id,
        	'owner' : this.userId
        });
        var infographic = Infographics.findOne({
        	'presid' : frame.presid,
        	'owner'  : this.userId
        });        
        var trails = Trails.find({
        	"presid" : frame.presid,
        }).fetch();

        for(var i = 0; i < trails.length; i++){
        	removeFrameFromTrail(id,trails[i]._id,this.userId);
        }

        removeFrameInf(id,infographic._id,this.userId);
    

        Frames.remove({
			"_id" : id,
			"owner"  : this.userId,
		});
		return id;
    },
    'removeFramesByIdPres': function(id){
        Frames.remove({
			"presid" : id,
			"owner"  : Meteor.userId(),
		});
    },
    'insertInfographicByIdPres': function(presid){
        return Infographics.insert({
			"presid"     : presid,
			"owner"      : Meteor.userId(),
			"content"    : {},
			"frames"     : {},
			"type"       : "infographic", 
		});
    },
    'updateInfographicById' : function(idInf,update){
    	Infographics.update({
    		"_id"   : idInf,
    		"owner" : this.userId,
    	},
    	{
    		$set    : update,
    	})
    },
    'updateGOContentFrame' : function(idGO,update,idFrame){
        var prefix = "content.";
        var id = prefix + idGO;
        var up = {$set:{}};
        var content_ = Frames.findOne({_id:idFrame,owner:this.userId}).content;
        for(var key in update){
            content_[idGO][key] = update[key];
        }
        Frames.update({
            _id   : idFrame,
            owner : this.userId
        },
            {$set:{content:content_}}
        );
    },
    'insertGOContentFrame' : function(GO,idFrame){
        var content_ = Frames.findOne({_id:idFrame,owner:this.userId}).content;
        content_[GO._id]=GO;
        Frames.update({
            _id   : idFrame,
            owner : this.userId
        },
            {$set:{content:content_}}
        );
    },
    'removeGOContentFrame' : function(idGO,idFrame){
        var content = Frames.findOne({
            _id   : idFrame,
            owner : this.userId,
        }).content;
        delete content[idGO];
        Frames.update({
            _id   : idFrame,
            owner : this.userId,
        },{
            $set : {
                content : content
            }
        });
    },
    'updateGOContentInfographic' : function(idGO,update,idInf){
        var prefix = "content.";
        var id = prefix + idGO;
        var up = {$set:{}};
        for(var key in update){
            up.$set[id+"."+key] = update[key];
        }
        Infographics.update({ 
            _id   : idInf,
            owner : this.userId 
        },
            up
        );
    },
    'insertGOContentInfographic' : function(GO,idInf){
        var prefix = "content.";
        var id = prefix + GO._id;
        var up = {$set:{}};
        up.$set[id] = GO;
        Infographics.update({ 
            _id   : idInf,
            owner : this.userId 
        },
            up
        );
    },
    'removeGOContentInfographic' : function(idGO,idInf){
        var content = Infographics.findOne({
            _id   : idInf,
            owner : this.userId,
        }).content;
        delete content[idGO];
        Infographics.update({
            _id   : idInf,
            owner : this.userId,
        },{
            $set : {
                content : content
            }
        });
    },
    'insertFrameInfographic' : function(idFrame,idInf){
        var frames = Infographics.findOne({
            _id   : idInf,
            owner : this.userId,
        }).framesId;

        frames.push(idFrame);
        Infographics.update({
            _id   : idInf,
            owner : this.userId,
        },{
            $set : {framesId : frames}
        })
    },
    'removeFrameInfographic' : function(idFrame,idInf){
        removeFrameInf(idFrame,idInf,this.userId);

        var presid = Infographics.findOne({
            _id   : idInf,
            owner : this.userId,
        }).presid;        
        var trails = Trails.find({presid:presid}).fetch();
        for(var i = 0; i < trails.length; i++){
            removeFrameFromTrail(idFrame,trails[i]._id,this.userId);
        }
    },
    'checkUsername' : function(username) {
        if (Meteor.users.findOne({username: username}) === undefined) return false;
        return true;
    },
 });
var removeFrameInf = function(idFrame,idInf,user){
    var frames = Infographics.findOne({
        _id   : idInf,
        owner : user,
    }).framesId;
    for(var i = 0, found = false; !found && i < frames.length; i++){
        if(frames[i] == idFrame){
            found = true;
            frames.splice(i,1);
        }
    }
    Infographics.update({
        _id   : idInf,
        owner : user,
    },{
        $set : {framesId : frames}
    })
};
var removeFrameFromTrail = function(idFrame,idTrail,user){

    var trail = Trails.findOne({_id:idTrail}).trail;
    if(idFrame == trail[0][0]){
        trail[0].splice(0,1);
    }
    else{
        var foundInRow = false;
        for(var k = 1, found = false; k < trail.length && !found; k++){
            if(trail[k][0] == idFrame){
                trail.splice(k,1);
                found = true;
            }
        }
        for(var k = 0; k < trail.length && !foundInRow; k++){
            for(var j = 1; j < trail[k].length && !foundInRow; j++){
                if(trail[k][j] == idFrame){
                    trail[k].splice(j,1);
                    foundInRow = true;
                }
            }
        }
    }
    
    Trails.update({
        "_id" : idTrail,
    },
    {
        $set : {"trail" : trail}
    });
};