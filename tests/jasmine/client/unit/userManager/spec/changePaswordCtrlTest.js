describe('Controller: changePasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('premi'));

    var changePasswordCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        signinCtrl = $controller('changePasswordCtrl', {
            $scope: scope
        });
    }));

    it('should empty scope fields', function () {
        expect(scope.oldPassword).toBe('');
        expect(scope.psw).toBe('');
        expect(scope.psw_confirm).toBe('');
        //calling private function var_init()
        expect(scope.oldPasswordState).toBe('');
        expect(scope.pswState).toBe('');
        expect(scope.psw_confirmState).toBe('');
    });

});