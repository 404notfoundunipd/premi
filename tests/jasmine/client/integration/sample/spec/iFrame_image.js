describe('Frame-Image', function () {

    var img = null;
    var frame = null;
    var saver = {
        insert  : function(){},
        remove  : function(){},
        update  : function(){},
        save    : function(){},
    };

    beforeEach(module('premi'));

    beforeEach(inject(function(FrameFactory,ImageFactory,SaverFactory){
        frame = FrameFactory.initByDefault();
        img = ImageFactory.initByDefault();
        saver = SaverFactory;
        saver.insert = function(){};
        saver.update = function(){};
        saver.remove = function(){};
        saver.save = function(){console.log("okkkkkk")};
    }));

    it('insert image',function(){
        frame.addGO(img.getJSON());
        expect(frame.getGOJSON(img.getId())).toEqual(img.getJSON());
    });
    it('update image',function(){
        frame.addGO(img.getJSON());
        frame.selectGO(img.getId());
        frame.updateSelectedGO({dataX:2000});
        expect(img.get('dataX')).toEqual(2000);
    });
    it('drag image',function(){
        frame.addGO(img.getJSON());
        frame.selectGO(img.getId());
        frame.dragGO({dataX:2000,dataY:2000});
        expect(img.get('dataX')).toEqual(2000);
        expect(img.get('dataY')).toEqual(2000);
    });
    it('resize image',function(){
        frame.addGO(img.getJSON());
        frame.selectGO(img.getId());
        frame.resizeGO({dataX:2000,dataY:2000,width:1000,height:1000});
        expect(img.get('dataX')).toEqual(2000);
        expect(img.get('dataY')).toEqual(2000);
        expect(img.get('width')).toEqual(1000);
        expect(img.get('height')).toEqual(1000);
    });

    //it('select', function(){
    //    frame.addGO(obj,'image');
    //    expect(frame.getGOContent()).toEqual(obj._id);
    //})

});

describe('Frame-Shape', function () {

    var shape = null;
    var frame = null;
    var saver = {
        insert  : function(){},
        remove  : function(){},
        update  : function(){},
        save    : function(){},
    };

    beforeEach(module('premi'));

    beforeEach(inject(function(FrameFactory,ShapeFactory,SaverFactory){
        frame = FrameFactory.initByDefault();
        shape = ShapeFactory.initByDefault();
        saver = SaverFactory;
        saver.insert = function(){};
        saver.update = function(){};
        saver.remove = function(){};
        saver.save = function(){console.log("okkkkkk")};
    }));

    it('insert shape',function(){
        frame.addGO(shape.getJSON());
        expect(frame.getGOJSON(shape.getId())).toEqual(shape.getJSON());
    });
    it('update shape',function(){
        frame.addGO(shape.getJSON());
        frame.selectGO(shape.getId());
        frame.updateSelectedGO({dataX:2000});
        expect(shape.get('dataX')).toEqual(2000);
    });
    it('drag shape',function(){
        frame.addGO(shape.getJSON());
        frame.selectGO(shape.getId());
        frame.dragGO({dataX:2000,dataY:2000});
        expect(shape.get('dataX')).toEqual(2000);
        expect(shape.get('dataY')).toEqual(2000);
    });
    it('resize shape',function(){
        frame.addGO(shape.getJSON());
        frame.selectGO(shape.getId());
        frame.resizeGO({dataX:2000,dataY:2000,width:1000,height:1000});
        expect(shape.get('dataX')).toEqual(2000);
        expect(shape.get('dataY')).toEqual(2000);
        expect(shape.get('width')).toEqual(1000);
        expect(shape.get('height')).toEqual(1000);
    });
});
describe('Frame-Text', function () {

    var text = null;
    var frame = null;
    var saver = {
        insert  : function(){},
        remove  : function(){},
        update  : function(){},
        save    : function(){},
    };

    beforeEach(module('premi'));

    beforeEach(inject(function(FrameFactory,TextFactory,SaverFactory){
        frame = FrameFactory.initByDefault();
        text = TextFactory.initByDefault();
        saver = SaverFactory;
        saver.insert = function(){};
        saver.update = function(){};
        saver.remove = function(){};
        saver.save = function(){console.log("okkkkkk")};
    }));

    it('insert text',function(){
        frame.addGO(text.getJSON());
        expect(frame.getGOJSON(text.getId())).toEqual(text.getJSON());
    });
    it('update text',function(){
        frame.addGO(text.getJSON());
        frame.selectGO(text.getId());
        frame.updateSelectedGO({dataX:2000});
        expect(text.get('dataX')).toEqual(2000);
    });
    it('drag text',function(){
        frame.addGO(text.getJSON());
        frame.selectGO(text.getId());
        frame.dragGO({dataX:2000,dataY:2000});
        expect(text.get('dataX')).toEqual(2000);
        expect(text.get('dataY')).toEqual(2000);
    });
    it('resize text',function(){
        frame.addGO(text.getJSON());
        frame.selectGO(text.getId());
        frame.resizeGO({dataX:2000,dataY:2000,width:1000,height:1000});
        expect(text.get('dataX')).toEqual(2000);
        expect(text.get('dataY')).toEqual(2000);
        expect(text.get('width')).toEqual(1000);
        expect(text.get('height')).toEqual(1000);
    });

    //it('select', function(){
    //    frame.addGO(obj,'image');
    //    expect(frame.getGOContent()).toEqual(obj._id);
    //})

});