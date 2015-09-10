describe('graphicObject', function () {
    var obj = null;
    beforeEach(module('premi'));

    beforeEach(inject(function(GObject){
        obj = new GObject;

    }));

    it('default init correctly set variables', function(){
        obj.initByDefault();
        expect(obj.info.dataX).toBe(0);
        expect(obj.info.dataY).toBe(0);
        expect(obj.info.dataZ).toBe(0);
        expect(obj.info.width).toBe(100);
        expect(obj.info.height).toBe(100);
        expect(obj.info.scale).toBe(1);
        expect(obj.info.lvl).toBe(0);
    });

    it('resize works', function(){
        obj.initByDefault();
        obj.resize(150,150);
        expect(obj.info.height).toBe(150);
        expect(obj.info.width).toBe(150);
    });

    it('resize works', function(){
        obj.initByDefault();
        obj.resize(150,150);
        expect(obj.info.height).toBe(150);
        expect(obj.info.width).toBe(150);
    });

    it('drag works', function(){
        obj.initByDefault();
        obj.drag(100,200);
        expect(obj.info.dataX).toBe(100);
        expect(obj.info.dataY).toBe(200);
    });

    it('init by JSON return the reference to the object', function(){
        var tmp = {
            test: 'test'
        };
        obj.initByJSON(tmp);
        expect(obj.getJSON()).toBe(tmp);
    });

    it('test set method',function(){
        obj.initByDefault();
        obj.set('dataX',100);
        expect(obj.info.dataX).toBe(100);
    });

    it('test set method, try to set a field that does not exist' ,function(){
        obj.initByDefault();
        obj.set('blabla',100);
        expect(obj.info.blabla).toBeUndefined();
    });

    it('test get method',function(){
        obj.initByDefault();
        var value = 1000;
        obj.set('dataX',value);
        expect(obj.get('dataX')).toBe(value);
    })

});