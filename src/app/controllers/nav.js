function navCtrl($window) {
    var vm = this;
    vm.isActive = false;
    vm.button = function() {
        var result = !vm.isActive;
        vm.isActive = result;
    };
    vm.toBlog = function() {
        $window.location.href = '/blog';
    };
}

navCtrl.$inject = ['$window'];

export {navCtrl};