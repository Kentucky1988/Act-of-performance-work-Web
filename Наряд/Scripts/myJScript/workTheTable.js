﻿function LoadMaterials(element) { //сортименты   
    $.ajax({
        type: "GET",
        url: '/home/getMaterials',
        success: function (data) {
            renderCategory(element, data);
        }
    })
}

function worksTitlee(element) {//найменування заходу
    $.ajax({
        type: "GET",
        url: '/home/getworksTitlee',
        success: function (data) {
            renderCategory(element, data);
        }
    })
}

function typeOfFelling(element) {//вид рубок
    $.ajax({
        type: "GET",
        url: '/home/TypeOfFelling',
        success: function (data) {
            renderCategory(element, data);
        }
    })
}

var typeOfWork;//вид робот
var checkedConditionsWinter;//условия труда /зима/
var checkedConditionsHard;//условия труда /тяжелые/

function normOfWork(element) {//норма выроботки 
    if ($('#product').val() != 0) {
        var table = $('#productCategory').val();
        typeOfWork = element;
        checkedConditionsWinter = $('#workingConditionsWinter').hasClass('active') ? "Зимові умови" : "";
        checkedConditionsHard = $('#workingConditionsHard').hasClass('active') ? "Тяжкі умови" : "";
        var volumeWood = $("#volumeWood").val();
        var tractorMoving = $("#tractorMoving").val();
        var block = $("#block").val();
        var reduceDeforestationCoefficient = $('#reduceDeforestationCoefficient').val();
        $.ajax({
            type: "GET",
            url: '/home/normWork',
            data: {
                'table': table, 'typeOfWork': typeOfWork, 'volumeWood': volumeWood, 'checkedConditionsWinter': checkedConditionsWinter,
                'checkedConditionsHard': checkedConditionsHard, 'tractorMoving': tractorMoving, 'block': block, 'reduceDeforestationCoefficient': reduceDeforestationCoefficient
            },
            success: function (norm) {
                $('#norm').val(norm[0]);
                $("#executed").change();
            }
        });
    }
};

var pricingID     //РозцінкаID
var typeOfBrigade //Комплексна_индивідуальна 

function Unit(element) { //единица измерения  
    $.ajax({
        type: "GET",
        url: '/home/getUnit',
        data: { 'category': $('#productCategory').val() },
        success: function (unit) {
            $('#Unit').val(unit[0].Одиниця_виміру);
            typeOfBrigade = unit[0].Комплексна_индивідуальна;
            pricingID = unit[0].РозцінкаID;
            RankActiv();
        }
    });
};

function RankActiv() {//выпадающий список разряд робот Активный/Неактивный   
    if (typeOfBrigade == "комплексна") {
        $('#Rank').val(" ").prop("disabled", true)
    } else if (typeOfBrigade == "індивідуальна") {
        $('#Rank').val(" ").prop("disabled", false)
    }
};

function pricingUnit() {//расценка за единицу   
    if ($('#productCategory').val() != 0 && ((typeOfBrigade == "індивідуальна" && $('#Rank').val() > 0) || typeOfBrigade == "комплексна")) {
        $.ajax({
            type: "GET",
            url: '/home/PricingUnit',
            data: { 'pricingID': pricingID, 'rank': $("#Rank").val() },
            success: function (unitPrice) {
                $('#UnitPrice').val(unitPrice);
                $("#executed").change();
            }
        });
    }
};

$("#volumeWood").change(function () {// событие на изминеие обьема хлыста   
    normOfWork($('#product').val());
    $("#executed").change();
});

$("#worksTitlee").change(function () {// событие на изминеие найменування заходу   
    LoadCategory($('#productCategory'), $(this).val());
    normOfWork($('#product').val());
    $("#workingConditionsSummer").click();
    $('#coefficient input').val('');
    if ($(this).val() == "Трелювання деревини") {       
        $('#coefficient, #workingConditionsHard, #tractorCoefficient').show();//отобразить строку
        $('#deforestationCoefficient').hide();//скрыть строку /Поправочный коефициент лесозаготовка/
    } else if ($(this).val() == "Лісозаготівельні роботи") {      
        $('#coefficient, #deforestationCoefficient').show();//отобразить строку
        $('#workingConditionsHard, #tractorCoefficient').hide();//скрыть строку /Поправочный коефициент тежолые условия/
    }
    else {      
        $('#coefficient').hide();//скрыть строку
    }
});

$("#productCategory").change(function () {// событие на изминеие категории работ
    LoadProduct(this);
    Unit($('#productCategory').val());
    $('.tbodyTable .quantity').not('#Unit').val('');//очистка 1 строки
});

$("#Rank").change(function () {// событие на изминеие ячейки Разряд робот
    pricingUnit();//найти в БД расценку за единицу    
});

$("#executed").change(function changeExecuted() {// событие на изминеие ячейки выполнено    
    if ($('#executed').val() != 0 && $('#norm').val() != 0) {// расчет выполненно норм   
        $('#executedNorm').val(($('#executed').val().replace(',', '.') / $('#norm').val()).toFixed(3));
        $('#Sum').val(($('#executedNorm').val() * $('#UnitPrice').val()).toFixed(2));
    }
});

function changeWorksTitle(value) {//функция оброботчика изминения значения /найменування робіт/
    normOfWork(value);  // расчет норм
    pricingUnit();      //расценка за единицу  
}

function columnSum() {//сумма строк   
    $("tfoot tr td:not(:first)").text(function (indx) {//"tfoot tr td:not(:first)"
        if (indx == 1 || indx == 2) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {
                sum += +$(this).text().replace(',', '.');
            });
            $(this).text((sum).toFixed(3))
        } else if (indx == 4 || indx == 6 || indx == 7 || indx == 8) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {
                sum += +$(this).text()
            });
            $(this).text((sum).toFixed(2))
        }
    });
};

$(document).ready(function () {
    $('#coefficient').hide();//скрыть строку /Поправочный коефициент/
    typeOfFelling($('#typeOfFelling'));
    ColectionSortOil();
    worksTitlee('#worksTitlee');
});

$('.materials').each(function () {//выпадающий список сыря и материалов
    LoadMaterials($(this));
})

var colectionSortOil = []  //колекция расхода ГСМ по видам
function ColectionSortOil() {// виды ГСМ
    $.ajax({
        type: "GET",
        url: '/home/getcolectionSortOil',
        success: function (data) {
            $(data).each(function (i, val) {
                colectionSortOil.push({ 'Вид_палива': val, 'Витрити_ГСМ': 0 });
            })
        }
    })
}

var CollectionOilCosts = [] //колекция расхода ГСМ по строкам
function collectionOilCosts() { //расхода ГСМ по строке
    $.ajax({
        type: "GET",
        url: '/home/CollectionOilCosts',
        data: {
            'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val(), 'executed': $("#executed").val(),
            'checkedConditionsWinter': checkedConditionsWinter, 'checkedConditionsHard': checkedConditionsHard
        },//!!!!!!!!!!!!!!!!добавить проверку checkedConditionsWinter если Найменування заходу(worksTitlee) = Лісозаготівельні роботи тогда равно 1
        //чтоб не изминять норму расхода ГСМ при заготовке!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        success: function (data) {
            CollectionOilCosts.push(data);
            countValColectionSortOil();//подсчет расхода ГСМ по видам
            addStringDetails(colectionSortOil);//пересчитать строки расход материалов
        }
    })
}

function countValColectionSortOil() {//подсчет расхода ГСМ по видам
    $(colectionSortOil).each(function (iSort, valSort) {
        this['Витрити_ГСМ'] = 0;
        $(CollectionOilCosts).each(function (iCosts, valCosts) {
            $(this).each(function (i, val) {
                if (colectionSortOil[iSort]['Вид_палива'] == this['Вид_палива']) {
                    colectionSortOil[iSort]['Витрити_ГСМ'] += this['Витрити_ГСМ'];
                }
            })
        })
    })
}

function deleteValCollectionOilCosts(indexDeleteElement) {//удаление обекта из колекции /расход ГСМ по строкам/ при удалеине строки
    CollectionOilCosts.splice(indexDeleteElement, 1);
}

function notNullInColection(colection) {//убрать из колекции /расхода ГСМ по видам/ пустые поля 
    var colectionSortOilNotNull = []
    $(colection).each(function () {
        alert(this['Витрити_ГСМ']);
        if (this['Витрити_ГСМ'] > 0) {
            colectionSortOilNotNull.push({ 'Вид_палива': this['Вид_палива'], 'Витрити_ГСМ': this['Витрити_ГСМ'] });
        }
    })
    return colectionSortOilNotNull;
}

function addStringDetails(colection) {//добавить строку в таблицу расход материалов
    var index = 0;
    var $table = $('.material tbody');
    $('tr', $table).remove();

    for (var i = 0; i <= colection.length; i++) {

        var typeOil, unit, consumption, td_input, td;

        if (i < colection.length && colection[i]['Витрити_ГСМ'] > 0) {
            typeOil = colection[i]['Вид_палива'];
            unit = "л";
            consumption = colection[i]['Витрити_ГСМ'].toFixed(3);
            td_input = "<td><input type='text'/></td>";
            td = "<td/>";

            addString($table, index, typeOil, unit, consumption, td_input, td);
            index++;
        } else if (i == colection.length) {
            typeOil = "";
            unit = "";
            consumption = "";
            td_input = "<td/>";
            td = "<td/>";

            addString($table, index, typeOil, unit, consumption, td_input, td);
            index++;
        }
    }
}

function addString($table, index, typeOil, unit, consumption, td_input, td) {//добавляем нижнюю строку в таблице

    if (index == 0 || index % 2 == 0) {
        $("<tr>").appendTo($table);
    }

    $("<td/>", { text: typeOil }).appendTo($("tr:last", $table));
    $("<td/>", { text: unit }).appendTo($("tr:last", $table));
    $("<td/>", { text: consumption }).appendTo($("tr:last", $table));
    $(td_input).appendTo($("tr:last", $table));
    $(td).appendTo($("tr:last", $table));
}

$('#submit').click(function myfunction() {
    alert(colectionSortOil[1]['Вид_палива'] + '/' + colectionSortOil[1]['Витрити_ГСМ']);
})






