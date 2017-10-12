$(function () {//формат календаря
    $(".calendar").each(function () {
        $(this).datepicker({
            inline: true,
            dateFormat: 'dd/mm/yy',
            language: 'uk',
            changeYear: true,
            changeMonth: true
        }).width(100) 
    })
});

$(function ($) {//украинский язык календаря
	$.datepicker.regional['uk'] = {
		closeText: 'Закрити',
		prevText: '&#x3c;Попередній',
		nextText: 'Наступний&#x3e;',
		currentText: 'Сьогодні',
		monthNames: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
			'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
		monthNamesShort: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
			'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
		dayNames: ['неділя', 'понеділок', 'вівторок', 'середа', 'четверг', 'пятница', 'суббота'],
		dayNamesShort: ['ндл', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
		dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		weekHeader: 'Нед',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};
	$.datepicker.setDefaults($.datepicker.regional['uk']);
});

$(function () {// добавить годы в випадающий список от -5 до +15 в name='year'      
    var year = new Date().getFullYear() - 5;

    for (var newYear = year; newYear < year + 15; newYear++) {
        $("[name='year']").append($('<option/>').text(newYear));
    }

    $("[name='year']").prop('selectedIndex', 5); //значение по умолчанию
});


$(function () {// текущая дата    
    var data = new Date();

    var day = data.getDate();
    if (day < 10) day = '0' + day;
    var month = data.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var year = data.getFullYear();
    day = day + "/" + month + "/" + year;

    $('#getDate').each(function (index, element) {
        $(element).val(day);
    })
});

$(function () {// первый робочий день месяца   
    var data = new Date();
    var firstMonthDay = new Date(data.getFullYear(), data.getMonth(), 0);

    while (firstMonthDay.getDay() > 5 || firstMonthDay.getDay() < 1) {
        firstMonthDay.setDate(firstMonthDay.getDate() + 1);
    }

    var day = firstMonthDay.getDate();
    if (day < 10) day = '0' + day;
    var month = firstMonthDay.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var year = firstMonthDay.getFullYear();
    day = day + "/" + month + "/" + year;

    $('#firstWorkingDay').val(day);
});

$(function () {// последний робочий день месяца   
    var data = new Date();
    var lasMonthDay = new Date(data.getFullYear(), data.getMonth() + 1, 0);

    while (lasMonthDay.getDay() > 5 || lasMonthDay.getDay() < 1) {
        lasMonthDay.setDate(lasMonthDay.getDate() - 1);
    }

    var day = lasMonthDay.getDate();
    if (day < 10) day = '0' + day;
    var month = lasMonthDay.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var year = lasMonthDay.getFullYear();
    day = day + "/" + month + "/" + year;

    $('#lastWorkingDay').val(day);
});

