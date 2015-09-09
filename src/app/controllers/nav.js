function navCtrl() {
    var vm = this;
    vm.isActive = false;
    vm.button = function() {
        var result = !vm.isActive;
        vm.isActive = result;
    };
}

export {navCtrl}