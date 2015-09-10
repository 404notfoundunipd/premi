/**   
   * Name:        publish.js
   * Package:     premi/server/
   * Author:      Cossu Mattia
   * Date:        2015-06-03

   * Use:
   Lista di metodi che pubblicano al client solamente le informazioni a cui esso
   puo’ accedere. Utilizzano tutti Meteor.publish per rendere reperibili i metodi
   attraverso Meteor
   
   * Changes:
   Version     Date        Who            Changes              Reason
   ----------------------------------------------------------------------------
   0.2         2015-06-16  Cossu Mattia   getTrailsByPresId    aggiunto metodo        
   ----------------------------------------------------------------------------
   0.1         2015-06-03  Cossu Mattia   creati primi metodi
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

Meteor.publish('getInfographicByPresId', function publishFunction(id) {
   var currentUserId = this.userId;
   return Infographics.find({'presid' : id, 'owner' : currentUserId});
});

Meteor.publish('getFramesByPresId', function publishFunction(id) {
   var currentUserId = this.userId;
   return Frames.find({'presid' : id, 'owner' : currentUserId});
});

Meteor.publish('getInfographicFrames', function publishFunction(presid){
	var inf = Infographics.findOne({
		"presid" : presid, 
		"owner" : this.userId
	});

	return Frames.find({
		"presid" : presid, 
		"owner"  : this.userId,
		"_id"    : {
			$in : inf.framesId
		}
	});
});

Meteor.publish('getTrailsByPresId', function publishFunction(id) {
   var currentUserId = this.userId;
   return Trails.find({'presid' : id, 'owner' : currentUserId});
});

Meteor.publish('getPresentationById', function publishFunction(id) {
   var currentUserId = this.userId;
   return Presentations.find({'_id' : id, 'owner' : currentUserId});
});

Meteor.publish('getPresentations', function publishFunction() {
	var currentUserId = this.userId;	
   return Presentations.find({'owner':currentUserId});
});

Meteor.publish('getTrailById', function publishFunction(id) {
   return Trails.find({
   		'_id'   : id,
   		'owner' : this.userId
   });
});