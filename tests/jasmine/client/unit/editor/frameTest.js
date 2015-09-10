describe('Frame', function () {

    var obj = null;
    var frame = null;

    beforeEach(module('premi'));

    beforeEach(inject(function(FrameFactory){
        obj = {
            _id: 1234
        };
        frame = FrameFactory;
    }));

    it('default init correctly set variables', function(){
        frame.initByDefault();
        expect(frame.info.backgroundColor).toBe("#FFFFFF");
        expect(frame.info.content).toEqual({});
        expect(frame.info.type).toBe("frame");
    });

    it('init by JSON return the reference to the object', function(){
        var tmp = {
            test: 'test'
        };
        frame.initByJSON(tmp);
        expect(frame.getJSON()).toBe(tmp);
    });

    it('addGO should add a GO to the frame', function(){
        frame.addGO(obj,'image');
        expect(frame.getGOContent()).not.toEqual({});
    });

    //it('select', function(){
    //    frame.addGO(obj,'image');
    //    expect(frame.getGOContent()).toEqual(obj._id);
    //})

});