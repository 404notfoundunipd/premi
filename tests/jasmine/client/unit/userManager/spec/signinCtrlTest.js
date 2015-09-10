describe('Controller: signinCtrl', function () {

    // load the controller's module
    beforeEach(module('premi'));

    var signinCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        signinCtrl = $controller('signinCtrl', {
            $scope: scope
        });
    }));

    var testUser = {
        email : 'a.a@a.com',
        password : '1234567'
    };

    it('should empty scope fields', function () {
        expect(scope.email).toBe('');
        expect(scope.password).toBe('');
        //calling private function var_init()
        expect(scope.emailState).toBe('');
        expect(scope.passwordState).toBe('');
    });

    it('signin with wrong autentication data produce an error', function (done) {

        scope.email = 'wrong_user';
        scope.password = 'wrong_password';

        Meteor.loginWithPassword(scope.email, scope.password, function(err){
            expect(err).not.toBeUndefined();
            expect(Meteor.userId()).toBeNull();

            Meteor.logout(function() {
                done();
            });
        });
    });

    it('signin with right autentication does not produce an error', function (done) {

        scope.email = testUser.email;
        scope.password = testUser.password;

        Meteor.loginWithPassword(scope.email, scope.password, function(err){
            expect(err).toBeUndefined();
            expect(Meteor.userId()).not.toBeNull();

            Meteor.logout(function() {
                done();
            });
        });
    });


    it('after signIn there is a current user with the expected data', function (done) {

        scope.email = testUser.email;
        scope.password = testUser.password;

        Meteor.loginWithPassword(scope.email, scope.password, function(err){
            expect(Meteor.user()).toEqual({
                _id: jasmine.any(String),
                emails: [ Object({ address: scope.email, verified: false }) ],
                username: scope.email
            });

            Meteor.logout(function() {
                done();
            });
        });
    });
});
