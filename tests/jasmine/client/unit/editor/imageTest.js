describe('Image', function () {
    var img = null;
    beforeEach(module('premi'));

    beforeEach(inject(function(ImageFactory){
        img = ImageFactory;

    }));

    it('default init correctly set variables', function(){
        img.initByDefault();
        expect(img.info.src).toBe("ffff");
        expect(img.info.type).toBe('image');
    });

    it('init by JSON return the reference to the object', function(){
        var tmp = {
            test: 'test'
        };
        img.initByJSON(tmp);
        expect(img.getJSON()).toBe(tmp);
    });

});