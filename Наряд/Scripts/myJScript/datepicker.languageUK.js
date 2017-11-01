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
        dayNames: ['неділя', 'понеділок', 'вівторок', 'середа', 'четверг', "п'ятница", 'суббота'],
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

$(function () {// добавить годы в випадающий список от -5 до +10 в name='year'      
    var year = new Date().getFullYear() - 5;

    for (var newYear = year; newYear < year + 10; newYear++) {
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

    $("[name='getDate']").val(day);
});

function firstWorkDay() {// первый робочий день месяца   

    var firstWorkingDate = $("[name='getDate']").val().split("/");
    var dateObject = new Date(firstWorkingDate[2], firstWorkingDate[1] - 1, firstWorkingDate[0]);
    var firstMonthDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);//первый день месяца

    while (firstMonthDay.getDay() > 5 || firstMonthDay.getDay() < 1) {
        firstMonthDay.setDate(firstMonthDay.getDate() + 1);
    }

    var day = firstMonthDay.getDate();
    if (day < 10) day = '0' + day;
    var month = firstMonthDay.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var year = firstMonthDay.getFullYear();
    day = day + "/" + month + "/" + year;

    $("[name='firstWorkingDay']").val(day);
};

function lastWorkDay() {// последний робочий день месяца   

    var firstWorkingDate = $("[name='getDate']").val().split("/");
    var dateObject = new Date(firstWorkingDate[2], firstWorkingDate[1] - 1, firstWorkingDate[0]);
    var lasMonthDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);//последний день месяца

    while (lasMonthDay.getDay() > 5 || lasMonthDay.getDay() < 1) {
        lasMonthDay.setDate(lasMonthDay.getDate() - 1);
    }

    var day = lasMonthDay.getDate();
    if (day < 10) day = '0' + day;
    var month = lasMonthDay.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var year = lasMonthDay.getFullYear();
    day = day + "/" + month + "/" + year;

    $("[name='lastWorkingDay']").val(day);
};

$(document).ready(function () {
    colorCellDayOff();
    titleDay();
    firstWorkDay();
    lastWorkDay();
});

$("[name='firstWorkingDay']").change(function () {// событие на изминеие ячейки начало робот
    colorCellDayOff();
    titleDay();
});

$("[name='getDate']").change(function () {// событие на изминеие ячейки начало робот   
    firstWorkDay();
    lastWorkDay();
    colorCellDayOff();
    titleDay();
});

function colorCellDayOff() { //выделение ячеек с выходным днем зеленым  

    var firstWorkingDate = $("[name='firstWorkingDay']").val().split("/");
    var dateObject = new Date(firstWorkingDate[2], firstWorkingDate[1] - 1, firstWorkingDate[0]);
    var lasMonthDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);//последний день месяца

    $('.employee thead td').each(function () {
        if ($(this).html() > 0 || $(this).html() < 31) {
            $(this).css('background-color', 'transparent');//очистить предыдущий цвет фона
            var lasMonthDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), $(this).html());
            if (lasMonthDay.getDay() > 5 || lasMonthDay.getDay() < 1) {
                $(this).css('background-color', '#5cb85c');
            }

            if ($(this).html() > lasMonthDay.getDate()) {
                $(this).css('background-color', '#f0ad4e');
            }
        }
    });
};

function titleDay() { //добавить вспл. подсказку /День недели: Дата/  

    var firstWorkingDate = $("[name='firstWorkingDay']").val().split("/");
    var dateObject = new Date(firstWorkingDate[2], firstWorkingDate[1] - 1, firstWorkingDate[0]);
    var lasMonthDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);//последний день месяца

    $('.employee tbody td[id]').each(function () {

        $('input', this).prop("disabled", false).removeAttr("title"); //отключить *не активен* убрать title
        var attrId = this.id;

        if (attrId > 0 && attrId <= lasMonthDay.getDate()) {
            var currentDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), attrId);
            var data = dayNames(currentDate.getDay()) + ": " + currentDate.getDate();
            $(this).attr('title', data);
        } else {
            $('input', this).prop("disabled", true).attr('title', 'В цьому місяці менше днів');
        }
    });
};

function dayNames(day) {//конвертирует дату в день недели 
    switch (day) {
        case 0: {
            return day = 'Неділя';
            break;
        }
        case 1: {
            return day = 'Понеділок';
            break;
        }
        case 2: {
            return day = 'Вівторок';
            break;
        }
        case 3: {
            return day = 'Середа';
            break;
        }
        case 4: {
            return day = 'Четверг';
            break;
        }
        case 5: {
            return day = "П'ятница";
            break;
        }
        case 6: {
            return day = 'Суббота';
            break;
        }
    }
}




