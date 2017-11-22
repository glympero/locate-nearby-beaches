(function () {
	angular
		.module('beachLocator')
		.controller('beachModalCtrl', beachModalCtrl);
	beachModalCtrl.$inject = ['$uibModalInstance', 'beachData'];
	function beachModalCtrl($uibModalInstance, beachData) {
		var vm = this;
		
		vm.onSubmit = function () {
			vm.formError = "";
			if (!vm.formData.name || !vm.formData.image || !vm.formData.lng || !vm.formData.lat || !vm.formData.address || !vm.formData.facilities || !vm.formData.info) {
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				vm.doPost(vm.formData);
			}
		};

		vm.doPost = function (formData) {
			beachData.addLocation({
				name: formData.name,
				image: formData.image,
				lng: formData.lng,
				lat: formData.lat,
				address: formData.address,
				facilities: formData.facilities,
				info: formData.info
			})
				.success(function (data) {
					vm.modal.close(data);
					console.log("Success!");
			})
				.error(function (data) {
					vm.formError = "Your review has not been saved, try again";
			});
			return false;
		};
		
		vm.modal = {
			close: function (result) {
				$uibModalInstance.close(result);
			},
			cancel: function () {
				$uibModalInstance.dismiss('cancel');
			}
		};
	}
})();