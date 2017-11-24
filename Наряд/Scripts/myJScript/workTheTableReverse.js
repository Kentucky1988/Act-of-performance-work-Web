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

    clearRowDetails($table);
}

$('.details').each(function () {
    $(this).on('click', '.removeDetails', function () {   //событие на нажатие кнопки удалить строку   
        deleteTr(this);//Удаление строки   
    })
});

function clearRowDetails($table) {
    $('.details input').each(function () {
        $(this).val('');
    })
}

function position(element) {
    $.each(Employees, function () {
        if ($(element).val() === this['П_І_Б']) {           
            $(element).parent('div').find('label:odd').text(this['Професія']);
        }
    })
}




