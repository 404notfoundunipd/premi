/**
 * Created by Marco on 21/08/15.
 */
describe('OrderedGOListFactory', function () {
    var list = null;
    var obs = null;
    beforeEach(module('premi'));
    var toBeEqualArray= function(a1,a2) {
        if(!Array.isArray(a1) || !Array.isArray(a2) ){
            return false;
        }
        if(a1.length != a2.length){
            return false;
        }
        for(var i = 0; i < a1.length; i++){
            for(var key in a1[i]){
                if(!a2[i].hasOwnProperty(key)){
                    return false;
                }
                if(a2[i][key]!=a1[i][key]){
                    return false;
                }
            }
        }
        return true;
    };
    beforeEach(inject(function(OrderedGOListFactory,Observer){
        list = OrderedGOListFactory;
        obs = Observer;
        list.setObserver(obs);
        list.setOrderBy('lvl');
        var array = [{lvl:0,_id:0},{lvl:1,_id:1},{lvl:2,_id:2},{lvl:3,_id:3}];
        for(var i=0; i<array.length; i++){
            list.insertGO(array[i]);
        } 
        obs.on('changeLvl',function(objId,pos){
            console.log("pos",list.getList())
        }); 

    }));
    it('insert defined lvl go correctly',function(){
        var array = [{lvl:0,_id:0},{lvl:1,_id:1},{lvl:2,_id:2},{lvl:3,_id:3}];
        expect(list).toBeDefined();
        expect(toBeEqualArray(list.getList(),array)).toBe(true);
    });
    it('insert and set lvl correctly',function(){
        var objToInsert = {_id:4,lvl:0};
        var expectedList = [];
        
        //test insert an set  
        list.insertGOAndSetLvl(objToInsert);
        expect(objToInsert.lvl).toEqual(4);
        expect(list.getList()[list.getList().length-1]).toEqual(objToInsert);
    });
    it('remove and set lvl correctly',function(){  
        console.log("remove list",list.getList())
        //test remove
        list.removeGO(2);
        expectedList = [{lvl:0,_id:0},{lvl:1,_id:1},{lvl:2,_id:3}];
        expect(toBeEqualArray(list.getList(),expectedList)).toBe(true);
        console.log("remove list",list.getList())
    });
    it('upgrade and set lvl correctly',function(){
        //test upgradeGO
        console.log("upgrade list",list.getList())
        list.upgradeGO(1);
        expectedList = [{lvl:0,_id:0},{lvl:1,_id:2},{lvl:2,_id:1},{lvl:3,_id:3}];
        console.log("upgrade list",list.getList())
        expect(toBeEqualArray(list.getList(),expectedList)).toBe(true);
    });
    it('downgrade and set lvl correctly',function(){
        //test downgradeGO
        list.downgradeGO(1);
        expectedList = [{lvl:0,_id:1},{lvl:1,_id:0},{lvl:2,_id:2},{lvl:3,_id:3}];
        expect(toBeEqualArray(list.getList(),expectedList)).toBe(true);
    });
    it('multi insert',function(){
        var objs = [{_id:5,lvl:0},{_id:7,lvl:0},{_id:6,lvl:0}];
        for(var i = 0; i < objs.length; i++){
            list.insertGOAndSetLvl(objs[i]);
        }
        expectedList = [{lvl:0,_id:0},{lvl:1,_id:1},{lvl:2,_id:2},{lvl:3,_id:3},{_id:5,lvl:4},{_id:7,lvl:5},{_id:6,lvl:6}];
        expect(toBeEqualArray(list.getList(),expectedList)).toBe(true);
    });
    it('try to upgrade and downgrade max e min',function(){
        //upgrade test
        var temp = list.getList()[list.getList().length-1];
        list.upgradeGO(temp._id);        
        expect(list.getList()[list.getList().length-1].lvl).toBe(list.getList().length-1);
        expect(list.getList()[list.getList().length-1]).toBe(temp);

        //downgrade test
        var temp = list.getList()[0];
        list.downgradeGO(temp._id);
        expect(list.getList()[0].lvl).toBe(0);
        expect(list.getList()[0]).toBe(temp);
    });
});