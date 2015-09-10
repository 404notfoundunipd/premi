describe('Frame-Saver', function () {

    var text  = null;
    var shape = null;
    var image = null;
    var frame = null;
    var saver = {
        insert  : function(){},
        remove  : function(){},
        update  : function(){},
        save    : function(){},
    };

    beforeEach(module('premi'));

    beforeEach(inject(function(FrameFactory,TextFactory,ImageFactory,ShapeFactory,SaverFactory){
        frame   = FrameFactory.initByDefault();
        text    = TextFactory.initByDefault();
        image   = ImageFactory.initByDefault();
        shape   = ShapeFactory.initByDefault();
        saver   = SaverFactory;
        saver.saverFunction = {
            image   : function(){},
            shape   : function(){},
            text    : function(){},
        };
        saver.removeFunctions = {
            image   : function(){},
            shape   : function(){},
            text    : function(){},
        };
        saver.insertFunctions = {
            image   : function(){},
            shape   : function(){},
            text    : function(){},
        };
    }));

    it('testing insert',function(){
        frame.addGO(text.getJSON());
        frame.addGO(image.getJSON());
        frame.addGO(shape.getJSON());
        expect(saver.inserted.image[0]).toEqual(image.getJSON());
        expect(saver.inserted.text[0]).toEqual(text.getJSON());
        expect(saver.inserted.shape[0]).toEqual(shape.getJSON());
    });
    it('testing update',function(){
        var update ={dataX:2000};
        frame.addGO(text.getJSON());
        frame.addGO(image.getJSON());
        frame.addGO(shape.getJSON());
        frame.updateGO(update,text.getId());
        frame.updateGO(update,image.getId());
        frame.updateGO(update,shape.getId());
        expect(saver.updates.image[image.getId()]).toEqual(update);
        expect(saver.updates.text[text.getId()]).toEqual(update);
        expect(saver.updates.shape[shape.getId()]).toEqual(update);
    });
    it('testing remove',function(){
        frame.addGO(text.getJSON());
        frame.addGO(image.getJSON());
        frame.addGO(shape.getJSON());
        frame.removeSelectedGO(text.getId());
        frame.removeSelectedGO(image.getId());
        frame.removeSelectedGO(shape.getId());
        expect(saver.removed.image[0]).toEqual(image.getId());
        expect(saver.removed.shape[0]).toEqual(shape.getId());
        expect(saver.removed.text[0]).toEqual(text.getId());
    });

});