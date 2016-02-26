//Listen for submit event of review form
$('#addReview').submit(function (e) {
	$('.alert.alert-danger').hide();
	//Check for any missing values
	if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
		//Show or inject error message onto page if value is missing
		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again!</div>');
		}
		//Prevent form from submitting if value is missing
		return false;
	}
});