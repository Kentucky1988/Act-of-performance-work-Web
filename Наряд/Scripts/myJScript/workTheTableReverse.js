$('.addDetails').click(function () {//событие на нажатие кнопки ДОБАВИТ    
    copyStringDetails(this); //копировать строку ввода

    var $table = $(this).parents('tbody').find('tr:not(:first)');//таблица в которой добовляем строки
    volumeTotalTableDetails($table);//Загальний об'єм
    totalTableDetails($table);//Загальна кількість   
    notifyMessage("Дані успішно добавлено", "success");
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

        var $table = $(this).parents('tbody').find('tr:not(:first)');//таблица в которой добовляем строки
        volumeTotalTableDetails($table);//Загальний об'єм
        totalTableDetails($table);//Загальна кількість    
        notifyMessage("Дані успішно видалено", "success");
    })
});

function emmployeesChange(element) {
    var id = getIdList($(element).val(), 'П_І_Б', Employees);
    var $element = $(element).parents('table');
    $(element).parent('div').find('label:odd').text(Employees[id]['Професія']);  //указать должность DIV
    $('#timesheetNumber', $element).text(Employees[id]['Id_Робітника']);         //указать табельный номер  table 
    $('#position', $element).text(Employees[id]['Професія']);                    //указать должность        table
    var RankEmployee = Employees[id]['Тарифний_розряд']
    if (RankEmployee !== null) {
        $('#RankEmployee', $element).text(RankEmployee);                         //указать Тарифний_розряд  table
    }
}

var $arrayHoursUsed = $('.tbodyTableRevers tr').filter(':eq(0), :eq(1)').find('td[id]');
$arrayHoursUsed.change(function () {

    if (testDateValid()) {//проверка не пустые строки
        var numberHours = getNumberHours($arrayHoursUsed);
        var numberDay = getNumberDay($arrayHoursUsed);
        $('#hoursWorked').text(numberHours);
        $('.dayWorked').eq(0).text(numberDay / 8);

        var $table = $(this).parents('tbody');//таблица в которой считаем сумму строк
        columnSumEmployee($table);      //сумма строк  
        if (numberHours > 0) {           
            fulfilledTheNorms();        //выполнено норм     
            percentFulfilledTheNorms(); //процент выполнения норм 
            salary()                    //зарплата
            columnSumEmployee($table);  //сумма строк  
        }
    }
})

function getNumberHours($array) {
    var numberHours = 0;
    $array.each(function () {
        var day = this.id;
        var hours = +$('input', this).val();

        if ((day >= 1 || day <= 31) && hours > 0) {
            numberHours += hours;
        }
    });
    return numberHours;
}

function getNumberDay($array) {
    var numberDay = 0;
    $array.each(function () {
        var day = this.id;
        var hours = +$('input', this).val();
        hours = hours === 7 ? 8 : hours;

        if ((day >= 1 || day <= 31) && hours > 0) {
            numberDay += hours;
        }
    });
    return numberDay;
}

function fulfilledTheNorms() {//расчет Виконано норм
    var columnSumNorm = $('#columnSumNorm').html();             //всего выполнено норм
    var sumNumberDaysWorked = $('#sumNumberDaysWorked').html(); //всего отработано дней 
    $('.fulfilledTheNorms').each(function () {
        var $tr = $(this).parents('tr');
        var dayWorked = $('.dayWorked', $tr).html();            //отработано дней 
        var fulfilledTheNorms = (columnSumNorm / sumNumberDaysWorked) * dayWorked;

        if (fulfilledTheNorms > 0) {
            $(this).text(fulfilledTheNorms.toFixed(4));         //выполнено норм   
        } else {
            $(this).text('');                                   //выполнено норм  
        }
    })
}

function percentFulfilledTheNorms() {                 //процент выполнения норм  
    var columnSumNorm = $('#columnSumNorm').html();   //всего выполнено норм
    $('.fulfilledTheNorms').each(function () {
        var fulfilledTheNorms = $(this).html();       //выполнено норм  
        var percentFulfilledTheNorms = (fulfilledTheNorms / columnSumNorm) * 100;

        if (percentFulfilledTheNorms > 0) {
            $(this).next('td').text(percentFulfilledTheNorms.toFixed(2)); //выполнено норм  
        } else {
            $(this).next('td').text('');                                  //выполнено норм  
        }
    })
}

function salary() {                                             //зарплата
    var columnSumSalary = $('#columnSumSalary').html();         //всего начислено зарплаты
    var sumNumberDaysWorked = $('#sumNumberDaysWorked').html(); //всего отработано дней 
    $('.fulfilledTheNorms').each(function () {
        var $tr = $(this).parents('tr');
        var dayWorked = $('.dayWorked', $tr).html();            //отработано дней  
        var salary = (columnSumSalary / sumNumberDaysWorked) * dayWorked;

        if (salary > 0) {
            $(this).next('td').next('td').text(salary.toFixed(2));  //выполнено норм  
        } else {
            $(this).next('td').next('td').text('');              //выполнено норм  
        }
    })
}

function testDateValid() {//проверка выбора сотрудника и расчет норм
    var isAllValid = false;
    var isNormValid = false; 

    if ($('#columnSumNorm').length && $('#columnSumNorm').html() > 0) {
        isNormValid = true;
    } else {
        notifyMessage("Вкажіть виконану роботу", "warn");
    }

    if ($('.tbodyTableRevers .autocompleteCombobox').val() !== 'Вибрати') {
        isAllValid = true;
    } else {
        notifyMessage("Вкажіть П.І.Б. робітника", "warn");
    }

    if (isAllValid && isNormValid) {
        return true;
    }    
}

$('.addEmployees').click(function myfunction() {//добовляем строки в табл. Employees
    var $table = $(this).parents('tbody');//таблица в которой добовляем строки

    if (testDateValid() && $('.dayWorked').html() > 0) {//проверка не пустые строки
        addStringEmployee(this, $table);  //добавляем нижнюю строку в таблице
        clearRowEmployee($table);         //очистка строки ввода  
        numberPersons($table);            //количество человек в табеле    
       
    } else {
        notifyMessage("Вкажіть кількість відпрацьованих днів", "warn");
    }
});

function addStringEmployee(element, $table) {//добавляем нижнюю строку в таблице /employee(табель)/
    $("<tr>").css('height', '20px').appendTo($table);//добавляем нижнюю строку

    $('tr:eq(0) td', $table).each(function (indx) {  //копируем первую строку    
        var str;

        if ($('input', this).length) {
            str = $('input', this).val();
        } else if ($(':button', this).length) {
            str = '';
        } else {
            str = $(this).html();
        }

        if ((indx >= 0 && indx <= 4) || (indx >= 21 && indx <= 28)) {
            $("<td/>").attr("rowspan", "2").text(str).addClass(indx === 21 ? 'dayWorked' : '').addClass(indx === 25 ? 'fulfilledTheNorms' : '').appendTo($("tr:last", $table));
        } else {
            $("<td/>", { text: str }).appendTo($("tr:last", $table));
        }
    });

    $("<tr>").css('height', '20px').appendTo($table);//добавляем нижнюю строку      
    $('tr:eq(1) td', $table).each(function () {//копируем вторую строку  
        var $val = $('input', this).val();
        var str = $val !== 0 ? $val : '';
        $("<td/>", { text: str }).appendTo($("tr:last", $table));
    });

    var $newRow = $(element).clone();//клонирование кнопки add
    $($newRow).addClass('remove').toggleClass('btn-success btn-danger');//сменить стиль success - danger
    $('#addIcon', $newRow).toggleClass('glyphicon-plus glyphicon-trash');//сменить иконку кнопки
    $($newRow).appendTo($("tr:eq(-2) td:last", $table));//добавление клонированой кнопки add  
}

function clearRowEmployee($table) {///очистка строки ввода строки
    $('.autocompleteCombobox', $table).prop('selectedIndex', 0);
    $('input', $table).val('');
    $('tr:first td[rowspan]:not(:first, :last)', $table).text('');
}

function columnSumEmployee($table) {//сумма строк Табель 
    $($table).next('tfoot').find('td').text(function (indx) {
        if (indx >= 16 && indx <= 23) {
            var sum = 0;
            $("td:nth-child(" + (indx + 5) + ")", $table).each(function () {
                sum += +$(this).text().replace(',', '.');
            });

            if (indx === 21) {
                $(this).text(sum > 0 ? (sum).toFixed(3) : '');
            } else if (indx === 22) {
                $(this).text(sum > 0 ? (sum).toFixed(1) : '');
            } else {
                $(this).text(sum > 0 ? (sum).toFixed(2) : '');
            }

            if (indx === 17) {
                $('#tbodyTable').next('tfoot').find('td').eq(8).text(sum === 0 ? '' : (sum).toFixed(2));
            }
        }
    });
};

$('.tbodyTableRevers').each(function () {
    $(this).on('click', '.remove', function () {   //событие на нажатие кнопки удалить строку        
        deleteTrEmployee(this);        //Удаление строки  
        workFromtbodyTableRevers();    //пересчет даных в таблице тпбель
        notifyMessage("Дані успішно видалено", "success");
    })
});

function workFromtbodyTableRevers() {
    var $table = $('.tbodyTableRevers');//таблица в которой добовляем строки   
    columnSumEmployee($table);  //сумма строк  
    fulfilledTheNorms();        //выполнено норм     
    percentFulfilledTheNorms(); //процент выполнения норм 
    salary()                    //зарплата
    columnSumEmployee($table);  //сумма строк 
    numberPersons($table);      //количество человек в табеле   
}

function numberPersons($table) {  //количество человек в табеле  
    $('#numberPersons').text($('tr:not(:eq(0), :eq(1))', $table).length / 2);
}

function deleteTrEmployee(element) {//Удаление выбранной строки
    var $tr = $(element).parents('tr');
    $($tr).add($($tr).next('tr')).remove();
}


function volumeTotalTableDetails($table) {//Загальний об'єм таблица Лесопродукция (details)   
    $('#totalTableDetails').text(function () {
        var sum = 0;
        $('td:nth-child(3)', $table).each(function () {
            sum += +$(this).text().replace(',', '.');
        });
        $('td:nth-child(8)', $table).each(function () {
            sum += +$(this).text().replace(',', '.');
        });
        $(this).text(sum > 0 ? (sum).toFixed(0) : '');
    });
}

function totalTableDetails($table) {//Загальна кількість таблица Лесопродукция (details)
    $('#volumeTotalTableDetails').text(function () {
        var sum = 0;
        $('td:nth-child(4)', $table).each(function () {
            sum += +$(this).text().replace(',', '.');
        });
        $('td:nth-child(9)', $table).each(function () {
            sum += +$(this).text().replace(',', '.');
        });
        $(this).text(sum > 0 ? (sum).toFixed(3) : '');
    });
}



