describe('Shape', function () {
    var shape = null;
    beforeEach(module('premi'));

    beforeEach(inject(function(ShapeFactory){
        shape = ShapeFactory;
    }));

    it('default init correctly set variables', function(){
        shape.initByDefault();
        expect(shape.info.content).toBe("");
        expect(shape.info.color).toEqual("black");
        expect(shape.info.stroke).toEqual("black");
        expect(shape.info.strokeWidth).toEqual(2);
        expect(shape.info.src).toEqual("");
        expect(shape.info.type).toEqual("shape");
    });

    it('init by JSON return the reference to the object', function(){
        var tmp = {
            test: 'test'
        };
        shape.initByJSON(tmp);
        expect(shape.getJSON()).toBe(tmp);
    });

});