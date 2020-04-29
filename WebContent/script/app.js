$(document).ready(function () {
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/tables',
		dataType: 'json',
		success: function (tables) {
//			$('body').append('<table>');
//			$('#table').html("<table>");
			for (var i = 0; i < tables.restaurantTables.length; i++) {
//				$('body').append('<tr>');
				
				$('.table_t').append('<tr><td>' + tables.restaurantTables[i].id + '</td><td>' + tables.restaurantTables[i].tableNumber + 
						'</td><td>' + tables.restaurantTables[i].numberOfSeats + '</td></tr>');
				
//				$('body').append('<td>' + tables.restaurantTables[i].tableNumber + '</td>');
				
//				$('body').append('<td>' + tables.restaurantTables[i].numberOfSeats + '</td></tr>');
				
//				$('body').append('</tr>');
			}
//			$('#table').html("</table>");
//			$('body').append('</table>');
			console.log(tables);
		}
	});
});