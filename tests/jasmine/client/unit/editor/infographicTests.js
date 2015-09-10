describe('GOContainer',function(){
	beforeEach(module('premi.editor'));
	var container = null;
	var frameTest = {
		"dataX"           : 0,
		"dataY"           : 0,
		"dataZ"           : 0,
		"height"          : 792,
		"width"           : 1024,
		"scale"           : 1,
		"backgroundColor" : "#FFFFFF",
		"content"         : {},
		"type"            : "frame",
        "lvl"             : 0,
	};
	var imageTest = {
		"dataX"           : 0,
		"dataY"           : 0,
		"dataZ"           : 0,
		"height"          : 792,
		"width"           : 1024,
		"scale"           : 1,
		"type"            : "image",
        "lvl"             : 0,
	};
	var shapeTest = {
		"dataX"           : 0,
		"dataY"           : 0,
		"dataZ"           : 0,
		"height"          : 792,
		"width"           : 1024,
		"scale"           : 1,
		"type"            : "shape",
		"src"             : "",
        "content"         : "",
        "fill"            : "black",
        "stroke"          : "black",
        "strokeWidth"     : 2,
        "lvl"             : 0,
	};
	var textTest = {
		"dataX"           : 0,
		"dataY"           : 0,
		"dataZ"           : 0,
		"height"          : 792,
		"width"           : 1024,
		"scale"           : 1,
		"type"            : "text",
        "lvl"             : 0,
        "text"            : "",        
        "colorText"       : "black",
        "weight"          : "",
        "fontStyle"       : "",
        "fontFamily"      : "",
        "textDecoration"  : "",
        "sizeFontText"    : "20"
	};
	beforeEach(inject(function(GOContainerFactory){
		container  = GOContainerFactory;
		container.initByDefault();
	}));
	it('test add graphic object image', function(){
		container.addGO(imageTest);
		expect(container.info.content[imageTest._id]).toBeDefined();
		expect(container.info.content[imageTest._id].type).toBe('image');
		//controllo che i campi dell'immagine passata siano rimasti invariati
	});

	it('test add graphic object shape', function(){
		container.addGO(shapeTest);
		expect(container.info.content[shapeTest._id]).toBeDefined();
		expect(container.info.content[shapeTest._id].type).toBe('shape');
	});

	it('test add graphic object text', function(){
		container.addGO(textTest);
		expect(container.info.content[textTest._id]).toBeDefined();
		expect(container.info.content[textTest._id].type).toBe('text');
	});

	it('test when adding a go, the object added has for each field of the passed obj the same field and the same value',function(){
		container.addGO(textTest);		
		var added = container.info.content[textTest._id];
		for(var key in textTest){
			expect(added[key]).toEqual(textTest[key]);
		}
		container.addGO(imageTest);		
		var added = container.info.content[imageTest._id];
		for(var key in imageTest){
			expect(added[key]).toEqual(imageTest[key]);
		}
		container.addGO(shapeTest);		
		var added = container.info.content[shapeTest._id];
		for(var key in shapeTest){
			expect(added[key]).toEqual(shapeTest[key]);
		}
	});

	it('test selection',function(){
		container.addGO(textTest);		
		container.addGO(imageTest);		
		container.addGO(shapeTest);	
		var text  = container.info.content[textTest._id];
		var image = container.info.content[imageTest._id];
		var shape = container.info.content[shapeTest._id];
		container.selectGO(imageTest._id);
		expect(container.selectedGO.getId()).toEqual(imageTest._id);
	});

	it("test select a object that don't exist",function () {
		container.selectGO("inexistent");
		expect(container.selectedGO).toBeNull();
	});

	it('test remove select go',function(){
		container.addGO(textTest);
		var text  = container.info.content[textTest._id];
		expect(container.info.content[text._id]).toBeDefined();
		container.selectGO(text._id);
		container.removeSelectedGO();
		expect(container.info.content[text._id]).toBeUndefined();
	});

	it('test update selected go', function(){
		container.addGO(textTest);
		var text  = container.info.content[textTest._id];
		var update = {
			"text"       : "ciao",
			"fontFamily" : "Arial",
			"notAField"  : "this field will not be modified"
		};
		expect(container.info.content[text._id]).toBeDefined();
		container.selectGO(text._id);
		container.updateSelectedGO(update);
		expect(container.selectedGO.get('text')).toEqual(update.text);
		expect(container.selectedGO.get('fontFamily')).toEqual(update.fontFamily);
		//se un campo non appartiene all'oggetto e si cerca di modificarlo la modifica non deve avvenire
		expect(container.selectedGO.get('notAField')).toBeUndefined();
	});

	it('test drag and resize go',function(){
		container.addGO(textTest);
		var text  = container.info.content[textTest._id];
		expect(container.info.content[text._id]).toBeDefined();
		container.selectGO(text._id);
		container.dragGO({dataX:100,dataY:100});
		expect(text.dataX).toBe(100);
		expect(text.dataY).toBe(100);
		container.resizeGO({dataX:200,dataY:200,height:100,width:100});
		expect(text.dataX).toBe(200);
		expect(text.dataY).toBe(200);
		expect(text.height).toBe(100);
		expect(text.width).toBe(100);
	});
});