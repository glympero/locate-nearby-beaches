(function () {
	angular
		.module('beachLocator')
		.controller('reviewModalCtrl', reviewModalCtrl);
	reviewModalCtrl.$inject = ['$uibModalInstance','beachData', 'locationData'];
	function reviewModalCtrl($uibModalInstance, beachData, locationData) {
		var vm = this;
		vm.locationData = locationData;
		
		vm.onSubmit = function () {
			vm.formError = "";
			if (!vm.formData.rating || !vm.formData.review) {
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				vm.doAddReview(vm.locationData.locationid, vm.formData);
			}
		};

		vm.doAddReview = function (locationid, formData) {
			beachData.addReviewById(locationid, {
				rating: formData.rating,
				reviewText: formData.review
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