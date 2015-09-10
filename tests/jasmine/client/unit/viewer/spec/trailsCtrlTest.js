describe('Controller: trailsCtrl', function () {

    // load the controller's module
    beforeEach(module('premi'));

    var trailsCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        signinCtrl = $controller('trailsCtrl', {
            $scope: scope
        });
    }));

    it('pre_init should call $state.go', inject(function($state) {
        spyOn($state, 'go');
        scope.pre_init();
        expect($state.go).toHaveBeenCalledWith('premi.viewer');
    }));

    it('should init Trails', function() {
        expect(scope.Trails).toBeDefined();
    });

});
