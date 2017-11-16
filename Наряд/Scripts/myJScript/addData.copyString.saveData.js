var Categories = []
//fetch categories from database
function LoadCategory(element) {
    if (Categories.length == 0) {
        //ajax function for fetch data
        $.ajax({
            type: "GET",
            url: '/home/getCategories',
            success: function (data) {
                Categories = data;
                renderCategory(element);
            }
        })
    }
    else {
        //render catagory to the element
        renderCategory(element);
    }
}

function renderCategory(element) {//создание списка категорий
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Вибрати'));
    $.each(Categories, function (i, val) {
        $ele.append($('<option/>').text(val));
    })
}

//вид робот
var TypeOfWork = []
function LoadProduct(element) {
    if (TypeOfWork.length == 0) {
        $.ajax({
            type: "GET",
            url: "/home/getTypeOfWork",
            data: { 'categoryOfWork': $(element).val() },
            success: function (data) {

                //render products to appropriate dropdown
                renderProduct($(element).parents('.mycontainer').find('select.product'), data);
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
    else {
        renderProduct(element);
    }
}

function renderProduct(element, data) {//создание ведомого списка   
    var $ele = $(element);
    $ele.empty();
    $.each(data, function (i, val) {
        $ele.append($('<option/>').val(val).text(val));
    })
    $('.custom-combobox-input').val(" ");
}

var Materials = []
function LoadMaterials(element) { //материалы
    if (Materials.length == 0) {
        $.ajax({
            type: "GET",
            url: '/home/getMaterials',
            success: function (data) {
                Materials = data;
                renderMaterials(element);
            }
        })
    }
    else {
        //добавляем материалы в список
        renderMaterials(element);
    }
}

function renderMaterials(element) {//создание списка материалов
    var $ele = $(element);
    $ele.empty();
    $.each(Materials, function (i, val) {
        $ele.append($('<option/>').val(val.Назва_сортименту).text(val.Назва_сортименту));
    })
}

$('.add').click(function () {//событие на нажатие кнопки ДОБАВИТ 
    collectionOilCosts(); //получить колекцию расхода ГСМ   
    copyString(this); //копировать строку ввода    
});

function copyString(element) {
    var $table = $(element).parents('.tbodyTable');//таблица в которой добовляем строки
    var isAllValid = true;

    $("tr td input:not(:disabled)", $table).each(function () {//проверка не пустые строки
        if ($(this).val().trim() == '') {
            isAllValid = false;
        }
    });

    if (isAllValid) {//копирование строки   

        $("<tr>").appendTo($table);//добавляем нижнюю строку            
        $("tr:first td", $table).each(function (indx) {//заполняем последнюю строку данными     
            var str;

            if ($("input", this).attr('type', 'text')) {
                str = $("input", this).val();
            }

            if (indx == 1 && ($($table).next().is("tfoot"))) {
                $("<td/>").attr("colspan", "3").text(str).appendTo($("tr:last", $table));
            } else if (indx >= 3 || (indx == 0 && !($($table).next().is("tfoot")))) {
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

        $('span.error', $newRow).remove();
        $('input.custom-combobox-input', $table).val('');
        //$('#productCategory', $table).val('0');
        $('#Rank', $table).not('#Unit').val('');
        $('.quantity', $table).not('#Unit').val('');
        $('#orderItemError', $table).empty();
    }

    if ($($table).next().is("tfoot")) {
        columnSum(); //сумма строк      
    }
}

//Удаление строки
$('.tbodyTable').each(function () {

    $(this).on('click', '.remove', function () {
        var $obj = $(this).parents('.tbodyTable').next().is("tfoot");
        $(this).parents('tr').remove();
        if ($obj) {
            columnSum(); //перещитать сумму строк после удаленных
        }
    })
});

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





