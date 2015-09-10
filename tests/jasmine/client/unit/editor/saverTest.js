describe('Saver',function(){
	beforeEach(module('premi'));
	var saver = null;
	beforeEach(inject(function(SaverFactory){
		saver = SaverFactory;
		saver.containerId = "id";
		saver.containerType = "type";

		for(var key in saver.saveFunctions){
			saver.saveFunctions[key] = function(what,id,type){

			}
		}
		for(var key in saver.removeFunctions){
			saver.removeFunctions[key] = function(what,id,type){

			}
		}
		for(var key in saver.insertFunctions){
			saver.insertFunctions[key] = function(what,id,type){

			}
		}
	}));
	it('test insert a correct go',function(){
		var obj = {_id:"image",type:"image"};
		saver.insert(obj);
		expect(saver.inserted.image[0]).toEqual(obj);
	});
	it('test remove a correct go',function(){
		var obj = {_id:"image",type:"image"};
		saver.remove(obj._id,obj.type);
		expect(saver.removed.image[0]).toEqual(obj._id);
	});
	it('test update a correct go',function(){
		var obj = {_id:"image",type:"image"};
		saver.update(obj._id,obj.type,{a:1,b:2,c:3});
		expect(saver.updates.image[obj._id]).toEqual({a:1,b:2,c:3});
	});
	it('test removing update when remove one obj',function(){
		var obj = {_id:"image",type:"image"};
		saver.update(obj._id,obj.type,{a:1,b:2,c:3});
		expect(saver.updates.image[obj._id]).toEqual({a:1,b:2,c:3});
		saver.remove(obj._id,obj.type);
		expect(saver.updates.image[obj._id]).toBeUndefined();
	});
});