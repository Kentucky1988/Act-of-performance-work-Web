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
    $('.dayWorked').eq(0).text(numberHours / 8);
   
    var $table = $(this).parents('tbody');//таблица в которой считаем сумму строк
    columnSumEmployee($table);  //сумма строк  
    fulfilledTheNorms();        //выполнено норм     
    percentFulfilledTheNorms(); //процент выполнения норм 
    columnSumEmployee($table);  //сумма строк  
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

function fulfilledTheNorms() {//расчет Виконано норм
    var columnSumNorm = $('#columnSumNorm').html();             //всего выполнено норм
    var sumNumberDaysWorked = $('#sumNumberDaysWorked').html(); //всего отработано дней 
    $('.fulfilledTheNorms').each(function() {
        var $tr = $(this).parents('tr');        
        var dayWorked = $('.dayWorked', $tr).html();            //отработано дней  
               
        var fulfilledTheNorms = (columnSumNorm / sumNumberDaysWorked) * dayWorked;
        fulfilledTheNorms = fulfilledTheNorms > 0 ? fulfilledTheNorms : 0;
        $(this).text(fulfilledTheNorms.toFixed(4));             //выполнено норм  
    })    
}

function percentFulfilledTheNorms() {//процент выполнения норм  
    var columnSumNorm = $('#columnSumNorm').html();       //всего выполнено норм
    $('.fulfilledTheNorms').each(function () {        
        var fulfilledTheNorms = $(this).html();           //выполнено норм  
        var percentFulfilledTheNorms = (fulfilledTheNorms / columnSumNorm) * 100;
        $(this).next('td').text(percentFulfilledTheNorms.toFixed(2)); //выполнено норм  
    })    
}

$('.addEmployees').click(function myfunction() {
    var $table = $(this).parents('tbody');//таблица в которой добовляем строки
    addStringEmployee(this, $table); //добавляем нижнюю строку в таблице
    clearRowEmployee($table);        //очистка строки ввода строки    
});

function addStringEmployee(element, $table) {//добавляем нижнюю строку в таблице /employee(табель)/

    $("<tr>").css('height', '20px').appendTo($table);//добавляем нижнюю строку
  
    $('tr:eq(0) td', $table).each(function (indx) {//копируем первую строку    
        var str;     

        if ($('input', this).length) {
            str = $('input', this).val();
        } else if ($(':button', this).length) {
            str = '';
        }else {
            str = $(this).html();
        }

        if ((indx >= 0 && indx <= 4) || (indx >= 21 && indx <= 28)) {
            $("<td/>").attr("rowspan", "2").text(str).addClass(indx == 21 ? 'dayWorked' : '').addClass(indx == 25 ?'fulfilledTheNorms':'').appendTo($("tr:last", $table));
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

function clearRowEmployee($table) {///очистка строки ввода строки
    $('input', $table).val('');
    $('tr:first td[rowspan]:not(:first, :last)', $table).text('');
}

function columnSumEmployee($table) {//сумма строк  
    $($table).next('tfoot').find('td').text(function (indx) {
        if (indx >= 16 && indx <= 23) {
            var sum = 0;
            $("td:nth-child(" + (indx + 5) + ")", $table).each(function () {
                sum += +$(this).text().replace(',', '.');
            });
            
            if (indx == 21) {                   
                $(this).text(sum > 0 ? (sum).toFixed(3) : '');
            } else if (indx == 22) {
                $(this).text(sum > 0 ? (sum).toFixed(1) : '');
            } else {
            $(this).text(sum > 0 ? (sum).toFixed(2) : '');
            }
        }
    });
};

$('.tbodyTableRevers').each(function () {
    $(this).on('click', '.remove', function () {   //событие на нажатие кнопки удалить строку 
        var $table = $(this).parents('tbody');//таблица в которой добовляем строки       
        deleteTrEmployee(this);      //Удаление строки  
        $arrayHoursUsed.change();
       // columnSumEmployee($table);   //пересчитать сумму строк после удаленных 
    })
});

function deleteTrEmployee(element) {//Удаление выбранной строки
    var $tr = $(element).parents('tr');
    $($tr).add($($tr).next('tr')).remove();
}



