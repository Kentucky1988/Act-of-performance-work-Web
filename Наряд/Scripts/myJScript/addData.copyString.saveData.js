
function LoadCategory(element, val) {//категории робот
    $.ajax({
        type: "GET",
        url: '/home/getCategories',
        data: { 'valueWorksTitlee': val },
        success: function (data) {
            renderCategory(element, data);
        }
    })
}

function renderCategory(element, List) {//создание списка категорий
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').text('Вибрати'));
    $.each(List, function (i, val) {
        $ele.append($('<option/>').text(val));
    })
}

function LoadProduct(element) {//вид робот
    $.ajax({
        type: "GET",
        url: "/home/getTypeOfWork",
        data: { 'categoryOfWork': $(element).val() },
        success: function (data) {
            element = $(element).parents('.mycontainer').find('select#product');
            renderCategory(element, data);

            $("option:contains('Вибрати')", element).remove();
            $(element).parents('td').find('.custom-combobox-input').val(" ");
        }
    })
}

$('.add').click(function () {//событие на нажатие кнопки ДОБАВИТ 
    var $table = $(this).parents('.tbodyTable');//таблица в которой добовляем строки
    var isAllValid = true;

    $("tr:first td input:not(:disabled)", $table).each(function () {//проверка не пустые строки
        if ($(this).val().trim() === '') {
            isAllValid = false;
        }
    });

    if (isAllValid) {//копирование строки   
        collectionOilCosts(); //получить колекцию расхода ГСМ   
        copyString(this); //копировать строку ввода  
    }
});

function copyString(element) {
    var $table = $(element).parents('.tbodyTable');//таблица в которой добовляем строки

    $("<tr>").appendTo($table);//добавляем нижнюю строку            
    $("tr:first td", $table).each(function (indx) {//заполняем последнюю строку данными     
        var str;

        if ($("input", this).attr('type', 'text')) {
            str = $("input", this).val();
        }

        if (indx === 1 && ($($table).next().is("tfoot"))) {
            $("<td/>").attr("colspan", "3").text(str).appendTo($("tr:last", $table));
        } else if (indx >= 3 || (indx === 0 && !($($table).next().is("tfoot")))) {
            $("<td/>", { text: str }).appendTo($("tr:last", $table));
        }
        else {
            return;
        }
    });

    var $newRow = $(element).clone();//клонирование кнопки add
    $($newRow).addClass('remove').toggleClass('btn-success btn-danger');//сменить стиль success - danger
    $('#addIcon', $newRow).toggleClass('glyphicon-plus glyphicon-trash');//сменить иконку кнопки
    $($newRow).appendTo($("tr:last td:last", $table));//добавление клонированой кнопки add         
       
    clearRow($table);

    if ($($table).next().is("tfoot")) {
        columnSum(); //сумма строк      
    }
}

$('.tbodyTable').each(function () {
    $(this).on('click', '.remove', function () {   //событие на нажатие кнопки удалить строку         
        var $obj = $(this).parents('.tbodyTable').next().is("tfoot");
        var indexDeleteElement = $('.tbodyTable tr:not(:first)').index($(this).parents('tr'))//получить номер удаляемой строки
        deleteTr(this);//Удаление строки      
        deleteValCollectionOilCosts(indexDeleteElement);//удаление обекта из колекции расход ГСМ при удалеине строки
        countValColectionSortOil();//пересчитать расхода ГСМ по строкам
        addStringDetails(colectionSortOil);//пересчитать строки расход материалов
        if ($obj) {
            columnSum(); //пересчитать сумму строк после удаленных
        }
    })
});

function deleteTr(element) {//Удаление строки
    $(element).parents('tr').remove();
}

function clearRow($table) {
    $('input.custom-combobox-input', $table).val('');
    //$('#productCategory', $table).val('0');
    $('#Rank', $table).val('');
    $('.quantity', $table).not('#Unit').val(''); 
}

 //Сохранить
 //$('#submit').click(function () {
 //    var isAllValid = true;

 //    //validate order items
 //    $('#orderItemError').text('');
 //    var list = [];
 //    var errorItemCount = 0;
 //    $('#orderdetailsItems tbody tr').each(function (index, ele) {
 //        if (
 //            $('select.product', this).val() == "0" ||
 //            (parseInt($('.quantity', this).val()) || 0) == 0 ||
 //            $('.rate', this).val() == "" ||
 //            isNaN($('.rate', this).val())
 //        ) {
 //            errorItemCount++;
 //            $(this).addClass('error');
 //        } else {
 //            var orderItem = {
 //                ProductID: $('select.product', this).val(),
 //                Quantity: parseInt($('.quantity', this).val()),
 //                Rate: parseFloat($('.rate', this).val())
 //            }
 //            list.push(orderItem);
 //        }
 //    })

 //    if (errorItemCount > 0) {
 //        $('#orderItemError').text(errorItemCount + " invalid entry in order item list.");
 //        isAllValid = false;
 //    }

 //    if (list.length == 0) {
 //        $('#orderItemError').text('At least 1 order item required.');
 //        isAllValid = false;
 //    }

 //    if ($('#orderNo').val().trim() == '') {
 //        $('#orderNo').siblings('span.error').css('visibility', 'visible');
 //        isAllValid = false;
 //    }
 //    else {
 //        $('#orderNo').siblings('span.error').css('visibility', 'hidden');
 //    }

 //    if ($('#orderDate').val().trim() == '') {
 //        $('#orderDate').siblings('span.error').css('visibility', 'visible');
 //        isAllValid = false;
 //    }
 //    else {
 //        $('#orderDate').siblings('span.error').css('visibility', 'hidden');
 //    }

 //    if (isAllValid) {
 //        var data = {
 //            OrderNo: $('#orderNo').val().trim(),
 //            OrderDateString: $('#orderDate').val().trim(),
 //            Description: $('#description').val().trim(),
 //            OrderDetails: list
 //        }

 //        $(this).val('Please wait...');

 //        $.ajax({
 //            type: 'POST',
 //            url: '/home/save',
 //            data: JSON.stringify(data),
 //            contentType: 'application/json',
 //            success: function (data) {
 //                if (data.status) {
 //                    alert('Successfully saved');
 //                    //here we will clear the form
 //                    list = [];
 //                    $('#orderNo,#orderDate,#description').val('');
 //                    $('#orderdetailsItems').empty();
 //                }
 //                else {
 //                    alert('Error');
 //                }
 //                $('#submit').val('Save');
 //            },
 //            error: function (error) {
 //                console.log(error);
 //                $('#submit').val('Save');
 //            }
 //        });
 //    }

 //});





