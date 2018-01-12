$(document).ready(function () {
    $('#coefficient').hide();//скрыть строку /Поправочный коефициент/
    typeOfFelling('#typeOfFelling');
    ColectionSortOil();
    worksTitlee('#worksTitlee');
    loadEmployees('.employees');
    LoadMaterials('.materials');
    Company('#company');
    addNumberAct();//номер акта

    $('#tbodyTable .custom-combobox-input, .details .custom-combobox-input').css('min-width', '340px');
    $('.employees').next('span').find('.custom-combobox-input').css('min-width', '250px');
});

function LoadMaterials(element) { //сортименты   
    $.ajax({
        type: "GET",
        url: '/home/getMaterials',
        success: function (data) {
            renderCategory(element, data);
        }
    });
}

var ListCompany = [];
function Company(element) { //предприятие   
    $.ajax({
        type: "GET",
        url: '/home/getCompany',
        success: function (data) {
            ListCompany = data;
            getEmployees(element, ListCompany, 'Підприємство1');
        }
    });
}

function subdivision(element) {//Підрозділи
    $.ajax({
        type: "GET",
        url: "/home/getSubdivision",
        data: { 'companyID': element },
        success: function (data) {
            $element = $('#subdivision');
            renderCategory($element, data);
        }
    });
}

var Employees = [];
function loadEmployees() { //роботники   
    $.ajax({
        type: "GET",
        url: '/home/getEmployees',
        success: function (data) {
            Employees = data;
            getEmployees('.employees', Employees, 'П_І_Б');
        }
    });
}

function worksTitlee(element) {//найменування заходу
    $.ajax({
        type: "GET",
        url: '/home/getWorksTitlee',
        success: function (data) {
            renderCategory(element, data);
        }
    });
}

function typeOfFelling(element) {//вид рубок
    $.ajax({
        type: "GET",
        url: '/home/TypeOfFelling',
        success: function (data) {
            renderCategory(element, data);
        }
    });
}

var typeOfWork;//вид робот
var checkedConditionsWinter;//условия труда /зима/
var checkedConditionsHard;//условия труда /тяжелые/

function normOfWork(element) {//норма выроботки 
    if ($('#product').val() !== '') {        
        typeOfWork = element;
        checkedConditionsWinter = $('#workingConditionsWinter').hasClass('active') ? "Зимові умови" : "";
        checkedConditionsHard = $('#workingConditionsHard').hasClass('active') ? "Тяжкі умови" : "";

        var volumeWood = $("#volumeWood").val().trim();
        if (volumeWood !== '') {
            var table = $('#productCategory').val();
            var tractorMoving = $("#tractorMoving").val();
            var block = $("#block").val();
            var reduceDeforestationCoefficient = $('#reduceDeforestationCoefficient').val();
            var forestPlantingConditions = $('#forestPlantingConditions').val();

            $.ajax({
                type: "GET",
                url: '/home/normWork',
                data: {
                    'table': table, 'typeOfWork': typeOfWork, 'volumeWood': volumeWood, 'checkedConditionsWinter': checkedConditionsWinter,
                    'checkedConditionsHard': checkedConditionsHard, 'tractorMoving': tractorMoving, 'block': block, 'reduceDeforestationCoefficient': reduceDeforestationCoefficient,
                    'forestPlantingConditions': forestPlantingConditions
                },
                success: function (norm) {
                    $('#norm').val(norm[0]);
                    $("#executed").change();
                }
            });
        }else {
            notifyMessage("Вкажіть середній об'єм хлиста", "warn"); 
        } 
    }
}

var pricingID;     //РозцінкаID
var typeOfBrigade; //Комплексна_индивідуальна 

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
}

function RankActiv() {//выпадающий список разряд робот Активный/Неактивный   
    if (typeOfBrigade === "комплексна") {
        $('#Rank').val('').prop("disabled", true);
    } else if (typeOfBrigade === "індивідуальна") {
        $('#Rank').val('').prop("disabled", false);
    }
}

function pricingUnit() {//расценка за единицу   
    if ($('#productCategory').val() !== 0 && ((typeOfBrigade === "індивідуальна" && $('#Rank').val() > 0) || typeOfBrigade === "комплексна")) {
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
}

$("#volumeWood").change(function () {// событие на изминеие обьема хлыста   
    normOfWork($('#product').val());
    $("#executed").change();
});

$("#worksTitlee").change(function () {// событие на изминеие найменування заходу   
    LoadCategory($('#productCategory'), $(this).val());
    // normOfWork($('#product').val());
    $("#workingConditionsSummer").click();
    $('#coefficient input').val('');
    if ($(this).val() === "Трелювання деревини") {
        $('#coefficient, #conditionsLumbering, #workingConditionsHard, #tractorCoefficient').show();//отобразить строку
        $('#deforestationCoefficient, #divForestPlantingConditions').hide();//скрыть строку /Поправочный коефициент лесозаготовка/
    } else if ($(this).val() === "Лісозаготівельні роботи") {
        $('#coefficient, #conditionsLumbering, #deforestationCoefficient').show();//отобразить строку
        $('#workingConditionsHard, #tractorCoefficient, #divForestPlantingConditions').hide();//скрыть строку /Поправочный коефициент тежолые условия/
    }
    else {
        $('#coefficient').hide();//скрыть строку
    }
    clearRow($('#tbodyTable'));
});

function showDivForestPlantingConditions(elementValue) {
    if ($('#worksTitlee').val() === "Лісокультурні роботи") {
        if (elementValue === "Садіння_лісу" || elementValue === "Прополювання_лісу" || elementValue === "Ручний_догляд_за_л_к") {
            $('#coefficient, #divForestPlantingConditions').show();//отобразить строку   
            $('#conditionsLumbering, #tractorCoefficient, #deforestationCoefficient').hide();//скрыть строку 
        } else {
            $('#coefficient').hide();//скрыть строку 
            $('#forestPlantingConditions').prop('selectedIndex', 0);
        }
    }
}

$("#productCategory").change(function () {// событие на изминеие категории работ
    var productCategory = $('#productCategory').val();
    showDivForestPlantingConditions(productCategory);
    LoadProduct(this);
    Unit(productCategory);
    $('#tbodyTable input:not(":first, #Unit")').val('');//очистка 1 строки
});

$("#Rank").change(function () {// событие на изминеие ячейки Разряд робот
    pricingUnit();//найти в БД расценку за единицу    
});

$("#company").change(function () {// событие на изминеие ячейки /Предприятие/
    var id = getIdList($(this).val(), 'Підприємство1', ListCompany);//получить Id выбраного елемента   
    $('#codeEDRPOY').empty().text(ListCompany[id]['Код_ЄДРПОУ']);//вывести код ЭДРПОУ   
    subdivision(ListCompany[id]['Id_Підприємства']);//создать выпадающий список /Підрозділи/
});

function getIdList(val, colum, List) {//получить Id выбраного елемента 
    var id;
    $.each(List, function (i, value) {
        if (val === this[colum]) {
            id = i;
        }
    });
    return id;
}

$("#executed").change(function changeExecuted() {// событие на изминеие ячейки выполнено    
    if ($('#executed').val().trim() !== '' && $("#volumeWood").val().trim() !== '') {// расчет выполненно норм 
        var norm = +$('#norm').val();
        var executedNorm = ($('#executed').val().replace(',', '.') / norm).toFixed(3);

        if (norm === 0) {
            executedNorm = 0;
        }

        $('#executedNorm').val(executedNorm);
        $('#Sum').val(($('#executedNorm').val() * $('#UnitPrice').val()).toFixed(2));
    } else {
        $('#executedNorm, #Sum').val('');
    }
});

function changeWorksTitle(value) {//функция оброботчика изминения значения /найменування робіт/
    normOfWork(value);  // расчет норм
    pricingUnit();      //расценка за единицу  
}

function columnSum($table) {//сумма строк нормы   

    $($table).next('tfoot').find('td:not(:first)').text(function (indx) {//"tfoot tr td:not(:first)"
        var sumColumn = 0;
        if (indx === 1 || indx === 2) {            
            $("#tbodyTable tr:not(:first) td:nth-child(" + (indx + 2) + ")").each(function () {
                var str = $(this).parents('tr').find('td:eq(1)').text();
                if (str === 'м3' || str === 'га' || str === 'скл/м' || str === 'тис. шт.') {
                    sumColumn += +$(this).text().replace(',', '.');
                }
            });
            $(this).text(sumColumn === 0 ? '' : (sumColumn).toFixed(3));
        } else if (indx === 4) {
           // var sumColumn = 0;
            $("#tbodyTable tr:not(:first) td:nth-child(" + (indx + 2) + ")").each(function () {
                sumColumn += +$(this).text().replace(',', '.');
            });
            $(this).attr('id', 'columnSumNorm').text(sumColumn === 0 ? '' : (sumColumn).toFixed(3));
        } else if (indx === 6) {
           // var sumColumn = 0;
            $("#tbodyTable tr:not(:first) td:nth-child(" + (indx + 2) + ")").each(function () {
                sumColumn += +$(this).text().replace(',', '.');
            });
            $(this).attr('id', 'columnSumSalary').text(sumColumn === 0 ? '' : (sumColumn).toFixed(2));
        }
    });
}

var colectionSortOil = [];  //колекция расхода ГСМ по видам
function ColectionSortOil() {// виды ГСМ
    $.ajax({
        type: "GET",
        url: '/home/getcolectionSortOil',
        success: function (data) {
            $(data).each(function (i, val) {
                colectionSortOil.push({ 'Вид_палива': val, 'Витрити_ГСМ': 0 });
            });
        }
    });
}

var CollectionOilCosts = []; //колекция расхода ГСМ по строкам
function collectionOilCosts() { //расхода ГСМ по строке
    var checkedConditionsWinterOil = $('#worksTitlee').val() === 'Лісозаготівельні роботи' ? '' : checkedConditionsWinter;
    $.ajax({
        type: "GET",
        url: '/home/CollectionOilCosts',
        data: {
            'table': $('#productCategory').val(), 'typeOfWork': typeOfWork, 'volumeWood': $("#volumeWood").val(), 'executed': $("#executed").val(),
            'checkedConditionsWinter': checkedConditionsWinterOil, 'checkedConditionsHard': checkedConditionsHard, 'hoursUsed': $("#hoursUsed").val()
        },
        success: function (data) {
            CollectionOilCosts.push(data);
            countValColectionSortOil();//подсчет расхода ГСМ по видам
            addStringDetails(colectionSortOil);//пересчитать строки расход материалов               
        }
    });
}

function countValColectionSortOil() {//подсчет расхода ГСМ по видам
    $(colectionSortOil).each(function (iSort, valSort) {
        this['Витрити_ГСМ'] = 0;
        $(CollectionOilCosts).each(function (iCosts, valCosts) {
            $(this).each(function (i, val) {
                if (colectionSortOil[iSort]['Вид_палива'] === this['Вид_палива']) {
                    colectionSortOil[iSort]['Витрити_ГСМ'] += this['Витрити_ГСМ'];
                }
            });
        });
    });
}

function deleteValCollectionOilCosts(indexDeleteElement) {//удаление обекта из колекции /расход ГСМ по строкам/ при удалеине строки
    CollectionOilCosts.splice(indexDeleteElement, 1);
}

function notNullInColection(colection) {//убрать из колекции /расхода ГСМ по видам/ пустые поля 
    var colectionSortOilNotNull = [];
    $(colection).each(function () {
        alert(this['Витрити_ГСМ']);
        if (this['Витрити_ГСМ'] > 0) {
            colectionSortOilNotNull.push({ 'Вид_палива': this['Вид_палива'], 'Витрити_ГСМ': this['Витрити_ГСМ'] });
        }
    });
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
            consumption = colection[i]['Витрити_ГСМ'].toFixed(2);
            td_input = "<td><input type='text'/></td>";
            td = "<td/>";

            addString($table, index, typeOil, unit, consumption, td_input, td);
            index++;
        } else if (i === colection.length && index % 2 != 0) {
            typeOil = "";
            unit = "";
            consumption = "";
            td_input = "<td/>";
            td = "<td/>";

            addString($table, index, typeOil, unit, consumption, td_input, td);                  
        }       
    }
    notifyMessage("Витрати ГСМ успішно перераховано", "success"); 
}

function addString($table, index, typeOil, unit, consumption, td_input, td) {//добавляем нижнюю строку в таблице /details(лісопродукція)/

    if (index === 0 || index % 2 === 0) {
        $("<tr>").appendTo($table);
    }

    $("<td/>", { text: typeOil }).appendTo($("tr:last", $table));
    $("<td/>", { text: unit }).appendTo($("tr:last", $table));
    $("<td/>", { text: consumption }).appendTo($("tr:last", $table));
    $(td_input).appendTo($("tr:last", $table));
    $(td).appendTo($("tr:last", $table));
}

function getEmployees(element, List, nameColum) {//добавить список сотрудников в выподающий список 
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').text('Вибрати'));
    $.each(List, function () {
        $ele.append($('<option/>').text(this[nameColum]));
    });
}

$(document).ajaxStart(function () {//индикатор работы AJAX
    $('#loader').show();
}).ajaxStop(function () {
    $('#loader').hide();
});

$('#buttonModalClear').click(function () {//кнопка вызов модального окна очистки наряда  
    $('#myModal').modal('show');
});

$('#cleaningAll').click(function () {//кнопка очистить полностю наряду  
    try {
        clearingThead();
        clearingEmployee();
        clearingTableTbodyTable();
        clearingTableTbodyTableRevers();
        clearingTableDetails();
        addNumberAct();//номер акта
        notifyMessage("Дані успішно видалено", "success");
    } catch (e) {
        notifyMessage("Помилка видалено", "error");
    }

});

$('#cleaningPart').click(function () {//кнопка очистить частину наряду
    var work = false;
    if ($('#clearingThead').is(':checked')) {
        clearingThead();
        work = true;
    }
    if ($('#clearingEmployee').is(':checked')) {
        clearingEmployee();
        work = true;
    }
    if ($('#clearingTableTbodyTable').is(':checked')) {
        clearingTableTbodyTable();
        work = true;
    }
    if ($('#clearingTableTbodyTableRevers').is(':checked')) {
        clearingTableTbodyTableRevers();
        work = true;
    }
    if ($('#clearingTableDetails').is(':checked')) {
        clearingTableDetails();
        work = true;
    }

    if (work) {
        addNumberAct();//номер акта
        notifyMessage("Дані успішно видалено", "success");
    }
});

function addNumberAct() {//номер акта

    var $elementValue = +$('#numberAct').val();   
    if ($elementValue === '') {
        $('#numberAct').val('1');
    } else {        
        $('#numberAct').val($elementValue + 1);
    }
}

function clearingThead() {//Очистити шапку наряду
    var $table = $('.thead');
    $('input, select', $table).not('.calendar, [name="year"]').val('');
    $('select', $table).not('[name="year"]').prop('selectedIndex', 0);
    $('[name="year"]').prop('selectedIndex', 5);
    $('#codeEDRPOY, #timesheetNumber, #numberPersons', $table).text('');
    $("#worksTitlee").change();
    documentReadyDatepicker();
}

function clearingEmployee() {//Очистити перелік відповідальних осіб
    $('.employees').each(function () {
        $(this).next('span').find('input').val('');
        $(this).prev('label').text('');
    });
    $('#PerformanceEvaluation').prop('selectedIndex', 0);
    $('#timesheetNumber').text('');
}

function clearingTableTbodyTable() {                //очистити таблицю: Перелік виконаних робіт
    var $table = $('#tbodyTable');                  //таблица в которой удаляем строки
    clearRow($table);                               //очистка страки ввода 
    $('tr:not(:first)', $table).remove();           //Удаление строки       
    CollectionOilCosts.length = 0;                  //очищаем колекцию расхода ГСМ 
    $('.material tbody tr').remove();               //очистить таблицу расход материалов      
    columnSum($table);                              //пересчитать сумму строк после удаленных 
    $('#tbodyTableFase tfoot input').val('');       //удалить количество машино-змин
}

function clearingTableTbodyTableRevers() {          //Очистити таблицю: Табель
    var $table = $('.tbodyTableRevers');            //таблица в которой удаляем строки
    clearRowEmployee($table);                       //очистка страки ввода       
    $('tr:not(:eq(0), :eq(1))', $table).remove();   //Удаление строки    
    columnSumEmployee($table);                      //сумма строк 
    $('.thead #numberPersons').text('');
}

function clearingTableDetails() {                   //Очистити таблицю: Лісопродукція
    var $table = $('.details tbody');               //таблица в которой удаляем строки
    clearRow($table);                               //очистка страки ввода       
    $('tr:not(:first)', $table).remove();           //Удаление строки    
    $('#volumeTotalTableDetails, #totalTableDetails').text('');
}

function notifyMessage(textMessage, classStyles) {
    $.notify(textMessage, {
        globalPosition: "top center",
        className: classStyles
    });
}

