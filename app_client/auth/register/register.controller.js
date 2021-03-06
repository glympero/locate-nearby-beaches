(function () {

  angular
    .module('beachLocator')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location','authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Register',
      strapline: 'Create a new Beach Locator account',
      image: '/images/home-bg.jpg'
    };

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doRegister();
      }
    };

    vm.doRegister = function() {
      vm.formError = "";
      authentication
        .register(vm.credentials)
        .error(function(err){
          vm.formError = err;
        })
        .then(function(){
          $location.search('page', null); 
          $location.path(vm.returnPage);
        });
    };

  }

})();