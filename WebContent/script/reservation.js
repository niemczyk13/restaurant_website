$(document).ready(function() {
	$('#reservationForm :text:first').focus();
	
	$("#reservationForm").submit(function() {
		let formData = $('#reservationForm').serialize();
		
//		$.post("http://localhost:8080/reservations", formData)
//		.done(doneResponse)
//		.fail(failResponse);
		
		$.ajax({
			type: 'POST',
			url: 'http://localhost:8080/reservations',
			data: formData,
			success: doneResponse,
			error: failResponse
		});
		
		return false;
	});

	$('input[class="timeTableRes"]').blur(function(e) {
		
		let timeTable = {
			tableNumber: $('#tableNumber').val(),
			date: $('#date').val(),
			startHour: $('#startHour').val(),
			endHour: $('#endHour').val()
		};
		if (validTimeTableRes(timeTable)) {
			$.ajax({
				type: 'POST',
				url: 'http://localhost:8080/resevations/freehours',
				data: timeTable,
				success: function(response) {
					$('.inf').remove();
				},
				error: function(response) {
					if (response.responseJSON.httpStatus != 'BAD_REQUEST') {
						$('.inf').remove();
						$('main').append('<p class="inf">Stolik w podanej godzinie jest zajety.</p>');
						$('main').append('<p class="inf">Oto wolne godziny:</p>');
						
						let timeIntervals = response.responseJSON.timeIntervals.timeIntervals;
						let length = timeIntervals.length;
						for (let i = 0; i < length; i++) {
							$('main').append('<p class="inf">' + timeIntervals[i].startHour + ' - ' + timeIntervals[i].endHour + ':</p>');
						}
					}
				}
			});
		}
	});
	
});

function validTimeTableRes(tt) {
	let flag = true;
	
	let now = new Date();
	let dat = new Date(tt.date);
	
	if (tt.tableNumber.length == 0) {
		flag = false;
	}
	
	if (flag && !(dat instanceof Date && !isNaN(dat))) {
		flag = false;
	}
	
	if (flag && dat < now) {
		flag = false;
	}
	
	if (flag && tt.startHour.length != 5) {
		flag = false;
	}
	
	if (flag && tt.endHour.length != 5) {
		flag = false;
	}
	
	
	
	return flag;
}

function changeName(response) {
	console.log(response);
}

function doneResponse(response) {
	location.replace('index.html');
}

function failResponse(xhr, status, error) {
	$('.error').remove();
	let respJSON = xhr.responseJSON;
	console.log(respJSON);
	for (let i = 0; i < respJSON.length; i++) {
		$('main').append('<p class="error">' + respJSON[i].defaultMessage + '</p>')
	}
	let restTables = respJSON.restaurantTables;
	console.log(restTables);
	for (let i = 0; i < restTables.length; i++) {
		$('main').append('<p class="error"> O podanej godzinie jest wolny stolik nr ' + restTables[i].tableNumber + '</p>');
	}
	
	let timeInterv = respJSON.timeIntervals.timeIntervals;
	console.log(timeInterv);
	for (let i = 0; i < timeInterv.length; i++) {
		$('main').append('<p class="error"> Stolik jest wolny w godzinach: ' + timeInterv[i].startHour + " - " + timeInterv[i].endHour + '</p>');
	}
}
