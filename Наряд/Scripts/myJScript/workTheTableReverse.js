$('.addDetails').click(function () {//событие на нажатие кнопки ДОБАВИТ 
    var $table = $(this).parents('tbody');//таблица в которой добовляем строки
    var isAllValid = true;

    $("tr:first td input:not(:disabled)", $table).each(function () {//проверка не пустые строки
        if ($(this).val().trim() === '') {
            isAllValid = false;
        }
    });

    if (isAllValid) {//копирование строки  
        copyStringDetails(this); //копировать строку ввода  
    }
});

function copyStringDetails(element) {
    var $table = $(element).parents('tbody');//таблица в которой добовляем строки

    $("<tr>").appendTo($table);//добавляем нижнюю строку            
    $("tr:first td", $table).each(function (indx) {//заполняем последнюю строку данными     
        var str;

        if ($("input", this).attr('type', 'text')) {
            str = $("input", this).val();
        }

        $("<td/>", { text: str }).appendTo($("tr:last", $table));
    });

    var $newRow = $(element).clone();//клонирование кнопки add
    $($newRow).addClass('removeDetails').toggleClass('btn-success btn-danger');//сменить стиль success - danger
    $('#addIconDetails', $newRow).toggleClass('glyphicon-plus glyphicon-trash');//сменить иконку кнопки
    $($newRow).appendTo($("tr:last td:last", $table));//добавление клонированой кнопки add         

    clearRow($table);
}

$('.details').each(function () {
    $(this).on('click', '.removeDetails', function () {   //событие на нажатие кнопки удалить строку   
        deleteTr(this);//Удаление строки   
    })
});

function emmployeesChange(element) {
    var id = getIdList($(element).val(), 'П_І_Б', Employees);
    var $element = $(element).parents('table');
    $(element).parent('div').find('label:odd').text(Employees[id]['Професія']);     //указать должность DIV
    $('#timesheetNumber', $element).text(Employees[id]['Id_Робітника']);            //указать табельный номер  table 
    $('#position', $element).text(Employees[id]['Професія']);                       //указать должность        table
    var RankEmployee = Employees[id]['Тарифний_розряд']
    if (RankEmployee != null) {
        $('#RankEmployee', $element).text(RankEmployee);                            //указать Тарифний_розряд  table
    }
}

var $arrayHoursUsed = $('.employee tbody tr').filter(':eq(0), :eq(1)').find('td[id]');
$arrayHoursUsed.change(function () {
    var numberHours = getNumberHours();
    $('#hoursWorked').text(numberHours);
    $('#dayWorked').text(numberHours / 8);
    $('#fulfilledTheNorms').text(fulfilledTheNorms());
})

function getNumberHours() {
    var numberHours = 0;
    $arrayHoursUsed.each(function () {
        var day = this.id;
        var hours = +$('input', this).val();

        if ((day >= 1 || day <= 31) && hours > 0) {
            numberHours += hours;
        }
    });
    return numberHours;
}

function fulfilledTheNorms() {//расчет /Виконано норм/
    //columnSumNorm

}

$('.addEmployees').click(function myfunction() {
    var $table = $(this).parents('tbody');//таблица в которой добовляем строки

    addStringEmployee($table); //добавляем нижнюю строку в таблице
    clearRowEmployee($table);  //удаление строки
    columnSumEmployee($table); //сумма строк  
});

function addStringEmployee(element) {//добавляем нижнюю строку в таблице /employee(табель)/
   
    $("<tr>").css('height', '20px').appendTo($table);//добавляем нижнюю строку            
    $('tr:eq(0) td', $table).each(function (indx) {//копируем первую строку    
        var str;

        if ($('input', this).length) {
            str = $('input', this).val();
        } else if ($(':button', this).length) {
            str = '';
        }
        else {
            str = $(this).html();
        }

        if ((indx >= 0 && indx <= 4) || (indx >= 21 && indx <= 28)) {
            $("<td/>").attr("rowspan", "2").text(str).appendTo($("tr:last", $table));
        } else {
            $("<td/>", { text: str }).appendTo($("tr:last", $table));
        }
    });

    $("<tr>").css('height', '20px').appendTo($table);//добавляем нижнюю строку      
    $('tr:eq(1) td', $table).each(function () {//копируем вторую строку  
        var $val = $('input', this).val();
        var str = $val != 0 ? $val : '';
        $("<td/>", { text: str }).appendTo($("tr:last", $table));
    });

    var $newRow = $(element).clone();//клонирование кнопки add
    $($newRow).addClass('remove').toggleClass('btn-success btn-danger');//сменить стиль success - danger
    $('#addIcon', $newRow).toggleClass('glyphicon-plus glyphicon-trash');//сменить иконку кнопки
    $($newRow).appendTo($("tr:eq(-2) td:last", $table));//добавление клонированой кнопки add  
}

function clearRowEmployee($table) {
    $('input', $table).val('');
    $('tr:first td[rowspan]:not(:first, :last)', $table).text('');
}

function columnSumEmployee($table) {//сумма строк  
    $($table).next('tfoot').find('td:not(:first)').text(function (indx) {
        if (indx >= 16 && indx <= 23){
            var sum = 0;
            $("tr:not(:eq(0), :eq(1)) td:nth-child(" + (indx + 6) + ")", $table).each(function () {
                sum += +$(this).text().replace(',', '.');
            });
            $(this).text(sum > 0 ? (sum).toFixed(2) : '');
        } 
    });
};



