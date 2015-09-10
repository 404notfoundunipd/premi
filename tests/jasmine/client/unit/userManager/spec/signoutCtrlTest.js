describe('Controller: signoutCtrl', function () {

    // load the controller's module
    beforeEach(module('premi'));

    var signoutCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        signinCtrl = $controller('signoutCtrl', {
            $scope: scope
        });
    }));

    var testUser = {
        email : 'a.a@a.com',
        password : '1234567'
    };

    it('logut works properly', function (done, fail) {
        Meteor.loginWithPassword(testUser.email, testUser.password, function(error) {
            if (!error) {
                Meteor.logout(function() {
                    done();
                });
            } else {
                fail();
            }
        })
    });

});
