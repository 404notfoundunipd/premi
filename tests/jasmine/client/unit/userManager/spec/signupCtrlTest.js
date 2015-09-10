describe('Controller: signupCtrl', function () {

    // load the controller's module
    beforeEach(module('premi'));

    var signupCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        signinCtrl = $controller('signupCtrl', {
            $scope: scope
        });
    }));

    it('should empty scope fields', function () {
        expect(scope.email).toBe('');
        expect(scope.password).toBe('');
        expect(scope.pwdConfirm).toBe('');
        //calling private function var_init()
        expect(scope.emailState).toBe('');
        expect(scope.passwordState).toBe('');
        expect(scope.pwdConfirmState).toBe('');
    });

});