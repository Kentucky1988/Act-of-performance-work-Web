var typeOfWork;//вид робот
function normOfWork(element) {//норма выроботки
    typeOfWork = element;
    if ($('#productCategory').val() != 0 && $("#volumeWood").val() != 0) {
        $.ajax({
            type: "GET",
            url: '/home/normWork',
            data: { 'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val() },
            success: function (norm) {
                $('#norm').val(norm[0]);
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
            }
        });
    }
};

$("#volumeWood").change(function () {// событие на изминеие обьема хлыста   
    normOfWork($('#product').val());
    $("#executed").change();
});

$("#productCategory").change(function () {// событие на изминеие категории работ
    LoadProduct(this);
    Unit($('#productCategory').val());
    $('.tbodyTable .quantity').not('#Unit').val('');//очистка 1 строки
});

$("#Rank").change(function () {// событие на изминеие ячейки Разряд робот
    pricingUnit();//найти в БД расценку за единицу    
});

$("#executed").change(function () {// событие на изминеие ячейки выполнено    
    if ($('#executed').val() != 0 && $('#norm').val() != 0) {// расчет выполненно норм   
        $('#executedNorm').val(($('#executed').val().replace(',', '.') / $('#norm').val()).toFixed(3));
        $('#Sum').val(($('#executedNorm').val() * $('#UnitPrice').val()).toFixed(2));
    }
});

function columnSum() {//сумма строк   
    $("tfoot tr td:not(:first)").text(function (indx) {//"tfoot tr td:not(:first)"
        if (indx == 1 || indx == 2) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {//
                sum += +$(this).text().replace(',', '.');
            });
            $(this).text((sum).toFixed(3))
        } else if (indx == 4 || indx == 6 || indx == 7 || indx == 8) {
            var sum = 0;
            $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {//
                sum += +$(this).text()
            });
            $(this).text((sum).toFixed(2))
        }
    });
};

$(document).ready(function () {
    LoadCategory($('#productCategory'));
    typeOfFelling($('#typeOfFelling'));
    ColectionSortOil();
});

$('.materials').each(function () {//выпадающий список сыря и материалов
    LoadMaterials($(this));
})

var TypeOfFelling = []
function typeOfFelling(element) {//вид рубок
    $.ajax({
        type: "GET",
        url: '/home/TypeOfFelling',
        success: function (data) {
            TypeOfFelling = data;
            rendertypeOfFelling(element);
        }
    })
}

function rendertypeOfFelling(element) {//создание списка категорий
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Вибрати'));
    $.each(TypeOfFelling, function (i, val) {
        $ele.append($('<option/>').text(val));
    })
}

var colectionSortOil = []  //колекция расхода ГСМ по видам
function ColectionSortOil() {// виды ГСМ
    $.ajax({
        type: "GET",
        url: '/home/getcolectionSortOil',
        success: function (data) {
            //colectionSortOil = data;
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
            'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val(), 'executed': $("#executed").val()
        },
        success: function (data) {
            CollectionOilCosts.push(data);
            countValColectionSortOil();//подсчет расхода ГСМ по видам
            addStringDetails(colectionSortOil);//посчитать строки расход материалов
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

function addStringDetails(colection) {//добавить строку в расход материалов
    var index = 0;
    var $table = $('.material tbody');
    $('tr', $table).remove();

    for (var i = 0; i <= colection.length; i++) {

        var typeOil, unit, consumption, td_input, td;

        if (i < colection.length && colection[i]['Витрити_ГСМ'] > 0) {
            typeOil = colection[i]['Вид_палива'];
            unit = "кг";
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

function addString($table, index, typeOil, unit, consumption, td_input, td) {

    if (index == 0 || index % 2 == 0) {
        $("<tr>").appendTo($table);//добавляем нижнюю строку  
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






