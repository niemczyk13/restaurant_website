$(document).ready(function() {
	$('#reservationForm :text:first').focus();
	$("#reservationForm").submit(postReservationForm);
	$('input[class="timeTableRes"]').blur(checkIfTheTableIsFree);
});

function checkIfTheTableIsFree() {
	let timeTable = {
		tableNumber: $('#tableNumber').val(),
		date: $('#date').val(),
		startHour: $('#startHour').val(),
		endHour: $('#endHour').val()
	};
	if (validTimeTableRes(timeTable)) {
		postCheckFreeHours(timeTable);
	}
}

function postCheckFreeHours(timeTable) {
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/resevations/freehours',
		data: timeTable,
		success: donePostCheckFreeHours,
		error: failPostCheckFreeHours
	});
}

function donePostCheckFreeHours() {
	$('.inf').remove();
}

function failPostCheckFreeHours(response) {
	if (response.responseJSON.httpStatus != 'BAD_REQUEST') {
		let alertString = 'Stolik w podanej godzinie jest zajety\n';
		alertString += 'Oto wolne godziny:\n';
		
		let timeIntervals = response.responseJSON.timeIntervals.timeIntervals;
		let length = timeIntervals.length;
		for (let i = 0; i < length; i++) {
			let startHour = getHourFromLocalDateTime(timeIntervals[i].startHour);
			let endHour = getHourFromLocalDateTime(timeIntervals[i].endHour);
			alertString += startHour + ' - ' + endHour + '\n';
		}
		alert(alertString);
	}
}

function getHourFromLocalDateTime(dateTime) {
	let size = dateTime.length;
	let hour = "";
	
	for (let i = 8; i >= 4; i--) {
		hour += dateTime[size - i];
	}
	return hour;
}

function postReservationForm() {
	let formData = $('#reservationForm').serialize();
	
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/reservations',
		data: formData,
		success: donePostReservationFormResponse,
		error: failPostReservationFormResponse
	});
	
	return false;
}

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

function donePostReservationFormResponse(response) {
	location.replace('index.html');
}

function failPostReservationFormResponse(xhr, status, error) {
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
