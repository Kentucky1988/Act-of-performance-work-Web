var Categories = []
//fetch categories from database
function LoadCategory(element) {
    if (Categories.length == 0) {
        //ajax function for fetch data
        $.ajax({
            type: "GET",
            url: '/home/getProductCategories',
            success: function (data) {
                Categories = data;
                //render catagory
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
        $ele.append($('<option/>').val(val.CategoryID).text(val.CategoryName));
    })
}

//fetch products
function LoadProduct(categoryDD) {
    $.ajax({
        type: "GET",
        url: "/home/getProducts",
        data: { 'categoryID': $(categoryDD).val() },
        success: function (data) {
            //render products to appropriate dropdown
            renderProduct($(categoryDD).parents('.mycontainer').find('select.product'), data);
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function renderProduct(element, data) {//создание ведомого списка   
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Вибрати'));
    $.each(data, function (i, val) {
        $ele.append($('<option/>').val(val.ProductID).text(val.ProductName));
    })
}

$(document).ready(function () {
    $('#add').click(function () {//событие на нажатие кнопки ДОБАВИТЬ
        //validation and add order items
        var isAllValid = true;
        if ($('#productCategory').val() == "0") {
            isAllValid = false;
            $('#productCategory').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#productCategory').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#product').val() == "0") {
            isAllValid = false;
            $('#product').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#product').siblings('span.error').css('visibility', 'hidden');
        }

        if (!($('#quantity').val().trim() != '' && (parseInt($('#quantity').val()) || 0))) {
            isAllValid = false;
            $('#quantity').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#quantity').siblings('span.error').css('visibility', 'hidden');
        }

        if (!($('#rate').val().trim() != '' && !isNaN($('#rate').val().trim()))) {
            isAllValid = false;
            $('#rate').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#rate').siblings('span.error').css('visibility', 'hidden');
        }

        if (isAllValid) {
            // var $newRow = $('#mainrow').clone().removeAttr('id');//клонирование строки          

            $("<tr>").appendTo("#tbodyTable");//добавляем нижнюю строку            
            $("#tbodyTable tr:first td").each(function (indx) {//заполняем последнюю строку данными     
                var str;

                if ($(this).find("input").attr('type', 'text')) {
                    str = $(this).find("input").val();
                }               

                if (indx == 1) {
                    $("<td/>").attr("colspan", "2").text(str).appendTo("#tbodyTable tr:last");
                } else if (indx > 1) {
                    $("<td/>", { text: str }).appendTo("#tbodyTable tr:last");
                } else {
                    return;
                }
            });

            var $newRow = $('#mainrow #add').clone();//клонирование кнопки add
            $($newRow).addClass('remove').toggleClass('btn-success btn-danger');//сменить стиль success - danger
            $('#addIcon', $newRow).toggleClass('glyphicon-plus glyphicon-trash');//сменить иконку кнопки
            $($newRow).appendTo("#tbodyTable tr:last td:last");//добавление клонированой кнопки add

            //$('.pc', $newRow).val($('#productCategory').val()); //копировать значение 
            //$('.product', $newRow).val($('#product').val());    //копировать значение          
            //  $('#add', $newRow).addClass('remove').toggleClass('btn-success btn-danger');//сменить стиль success - danger
            //  $('#addIcon', $newRow).toggleClass('glyphicon-plus glyphicon-trash');//сменить иконку кнопки
            //  $('a', $newRow).remove('a');//удаление кнопки combobox   

            // $('.custom-combobox', $newRow).css({ 'padding-right': '0px' }); //убрать отступ справа для выподающего списка    
            //  $('.custom-combobox-input', $newRow).width($('#product').parent("td").width());  //установить ширину ВС равной ширины колонки            

            // $('#productCategory,#product,#quantity,#rate,#add', $newRow).removeAttr('id'); //удалить атрибут id из новой клонированной строки
            // $('span.error', $newRow).remove();            
            //$('#headTable').append($newRow);//добавление клонированой строки

            $('span.error', $newRow).remove();
            $('input.custom-combobox-input:first').val('');
            $('#productCategory').val('0');
            $('#quantity,#rate').val('');
            $('#orderItemError').empty();
        }
        columnSum(); //сумма строк      
    });

    //Удаление строки
    $('#tbodyTable').on('click', '.remove', function () {
        $(this).parents('tr').remove();
        columnSum(); //сумма строк
    });

    function columnSum() {//сумма строк
        $("tfoot tr td:not(:first)").text(function (indx) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable").each(function () {
                sum += +$(this).text()
            });
            $(this).text(sum)
        });
    }

    //Сохранить
    $('#submit').click(function () {
        var isAllValid = true;

        //validate order items
        $('#orderItemError').text('');
        var list = [];
        var errorItemCount = 0;
        $('#orderdetailsItems tbody tr').each(function (index, ele) {
            if (
                $('select.product', this).val() == "0" ||
                (parseInt($('.quantity', this).val()) || 0) == 0 ||
                $('.rate', this).val() == "" ||
                isNaN($('.rate', this).val())
            ) {
                errorItemCount++;
                $(this).addClass('error');
            } else {
                var orderItem = {
                    ProductID: $('select.product', this).val(),
                    Quantity: parseInt($('.quantity', this).val()),
                    Rate: parseFloat($('.rate', this).val())
                }
                list.push(orderItem);
            }
        })

        if (errorItemCount > 0) {
            $('#orderItemError').text(errorItemCount + " invalid entry in order item list.");
            isAllValid = false;
        }

        if (list.length == 0) {
            $('#orderItemError').text('At least 1 order item required.');
            isAllValid = false;
        }

        if ($('#orderNo').val().trim() == '') {
            $('#orderNo').siblings('span.error').css('visibility', 'visible');
            isAllValid = false;
        }
        else {
            $('#orderNo').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#orderDate').val().trim() == '') {
            $('#orderDate').siblings('span.error').css('visibility', 'visible');
            isAllValid = false;
        }
        else {
            $('#orderDate').siblings('span.error').css('visibility', 'hidden');
        }

        if (isAllValid) {
            var data = {
                OrderNo: $('#orderNo').val().trim(),
                OrderDateString: $('#orderDate').val().trim(),
                Description: $('#description').val().trim(),
                OrderDetails: list
            }

            $(this).val('Please wait...');

            $.ajax({
                type: 'POST',
                url: '/home/save',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    if (data.status) {
                        alert('Successfully saved');
                        //here we will clear the form
                        list = [];
                        $('#orderNo,#orderDate,#description').val('');
                        $('#orderdetailsItems').empty();
                    }
                    else {
                        alert('Error');
                    }
                    $('#submit').val('Save');
                },
                error: function (error) {
                    console.log(error);
                    $('#submit').val('Save');
                }
            });
        }

    });
});

LoadCategory($('#productCategory'));

