describe('Text', function () {
    var text = null;
    beforeEach(module('premi'));

    beforeEach(inject(function(TextFactory){
        text = TextFactory;

    }));

    it('default init correctly set variables', function(){
        text.initByDefault();
        expect(text.info.text).toBe("text");
        expect(text.info.type).toBe("text");
        expect(text.info.color).toBe("#000000");
        expect(text.info.weight).toBe("");
        expect(text.info.fontStyle).toBe("");
        expect(text.info.textDecoration).toBe("");
        expect(text.info.sizeFontText).toBe('20');
        expect(text.info.fontFamily).toBe('Arial');
    });

    it('init by JSON return the reference to the object', function(){
        var tmp = {
            test: 'test'
        };
        text.initByJSON(tmp);
        expect(text.getJSON()).toBe(tmp);
    });

});