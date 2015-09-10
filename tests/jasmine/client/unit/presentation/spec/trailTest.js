describe('TrailFactory', function () {
	beforeEach(module('premi'));
	var trail  = null;
	var slides = null;
	var path   = null;
	beforeEach(inject(function(TrailFactory){
		trail  = TrailFactory;
		slides = ["0","1","2","3","4","5","6","7","8"];
		path   = [["0","1","2"],
				  ["2","3","4"],
				  ["3","5","6"]];
		trail.initPath(slides,path);
	}));
	it('test findSlideInPath', function(){
		var coo = trail.findSlideInPath("0",path);
		expect(coo).toEqual({row:0,col:0,chkRow:0});
		coo = trail.findSlideInPath("3",path);
		expect(coo).toEqual({row:1,col:1,chkRow:2});
		coo = trail.findSlideInPath("4",path);
		expect(coo).toEqual({row:1,col:2,chkRow:-1});
	});
	it('test findChkPntRow',function(){
		expect(trail.findChkPntRow("3")).toBe(2);
		expect(trail.findChkPntRow("4")).toBe(-1);
	});
	it('test make check point', function(){
		trail.makeCheckPoint("4");
		expect(trail.findChkPntRow("4")).not.toBe(-1);
	});
	it('try to make check point a slide that already is', function(){
		//se venisse creato un nuovo check point la riga del checkpoint verrebbe cambiata
		var chk = trail.findChkPntRow("3");
		trail.makeCheckPoint("3");
		expect(trail.findChkPntRow("3")).toBe(chk);
	});
	it('test remove check point',function(){
		var expectedTrail = [["0","1","2"],
				  			 ["2","3","4"]];
		trail.removeChkPoint("3");
		expect(trail.path).toEqual(expectedTrail);
	});
	it('test remove first slide chkPoint',function(){
		var expectedTrail = [[]];
		trail.removeSlide("0");
		expect(trail.path).toEqual(expectedTrail);
	});
	it('test remove a not check point slide',function(){
		var expectedTrail = [["0","1","2"],
							 ["2","3"],
							 ["3","5","6"]];
		trail.removeSlide("4");
		expect(trail.path).toEqual(expectedTrail);
	});
	it('test insert slide',function(){
		var expectedTrail = [["0","1","2"],
							 ["2","3","7","4"],
							 ["3","5","6"]];
		trail.insertSlide(1,2,"7");
		expect(trail.path).toEqual(expectedTrail);
		expectedTrail = [["8","0","1","2"],
							 ["2","3","7","4"],
							 ["3","5","6"]];
		trail.insertSlide(0,0,"8");
		expect(trail.path).toEqual(expectedTrail);
	});
	it('test goToSlide',function(){
		trail.goToSlide("4");
		expect(trail.getCurrentIndex()).toBe(4);
		expect(trail.getCurrentId()).toBe("4");
	});
	it('test next slide',function(){
		trail.nextSlide();
		expect(trail.getCurrentIndex()).toBe(1);
		expect(trail.getCurrentId()).toBe("1");
	});
	it('test previous slide',function(){
		trail.goToSlide("4");
		trail.prevSlide();
		expect(trail.getCurrentIndex()).toBe(3);
		expect(trail.getCurrentId()).toBe("3");
	});
	it('test enter in check point',function(){
		trail.goToSlide("3");
		trail.enterInCheckPoint();
		expect(trail.getCurrentIndex()).toBe(5);
		expect(trail.getCurrentId()).toBe("5");
	});
	it('test return to check point',function(){
		trail.goToSlide("3");
		trail.enterInCheckPoint();
		trail.returnToCheckPoint();
		expect(trail.getCurrentIndex()).toBe(3);
		expect(trail.getCurrentId()).toBe("3");
	});
	it('test return to check point if the path is finish',function(){
		trail.goToSlide("4");
		trail.nextSlide();
		expect(trail.getCurrentIndex()).toBe(2);
		expect(trail.getCurrentId()).toBe("2");	
	});
	it('test return to check point if prev slide in first of path',function(){
		trail.goToSlide("3");
		trail.prevSlide();
		expect(trail.getCurrentIndex()).toBe(2);
		expect(trail.getCurrentId()).toBe("2");	
	});
	it('test some path',function(){
		trail.nextSlide(); //1
		trail.nextSlide(); //2
		trail.enterInCheckPoint(); //3
		trail.enterInCheckPoint(); //5
		trail.nextSlide(); //6
		trail.previous(); //5
		trail.previous(); //3
		trail.previous(); //2
		expect(trail.getCurrentId()).toBe("2");
	});
	it('test insert slide in path',function(){
		trail.insertSlideInPath("8","2");
		var expectedTrail = [["0","1","2"],
							 ["2","3","4","8"],
							 ["3","5","6"]];
		expect(trail.path).toEqual(expectedTrail);
	});
	it('test switch slide dx',function(){
		var expectedTrail = [["0","1","2"],
							 ["2","4","3"],
							 ["3","5","6"]];
		trail.switchDxSlide("3");
		expect(trail.path).toEqual(expectedTrail);
	});
	it('test switch slide sx',function(){
		var expectedTrail = [["0","1","2"],
							 ["2","3","4"],
							 ["3","6","5"]];
		trail.switchSxSlide("6");
		expect(trail.path).toEqual(expectedTrail);
	});
	it('try to switch sx a slide that is in position (*,1) where * is a number != 0',function(){
		expect(trail.path).toEqual(trail.switchSxSlide("7").path);
	});
	it('switch dx the slide in position (0,0), the slide must not to be checkpoint',function(){
		trail.switchDxSlide("0");
		expect(trail.checkPointHash["0"]).toBeUndefined();
		expect(trail.checkPointHash["1"]).toBeDefined();
		var expectedTrail = [["1","0","2"],
							 ["2","3","4"],
							 ["3","5","6"]];
		expect(trail.path).toEqual(expectedTrail);
	});
	it('test check id',function(){
		slides = ["0","1","2","3","4","5","6","7","8"];
		path   = [["0","1","2"],
				  ["2","3","4"],
				  ["3","5","6"],
				  ["6","8"],
				  ["8","7"]];
		trail.initPath(slides,path);
		expect(trail.getCheckId("8")).toEqual("6");
	});
	it('test getSpecPath',function(){
		slides = ["0","1","2","3","4","5","6","7","8"];
		path   = [["0","1","2"],
				  ["2","3","4"],
				  ["3","5","6"],
				  ["6","8"],
				  ["8","7"]];
		trail.initPath(slides,path);
		expect(trail.getSpecPath("8")).toEqual(["0","2","3","6"]);
	});
});