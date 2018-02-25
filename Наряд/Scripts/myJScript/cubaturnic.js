$(document).ready(function () {
    getListDiametr();             //список диаметров 
    LoadLength('#lengthOfTree');  //длины   
    renderSelectOption('#diameter', getListDiameter()); //шаг диаметров
});

$('#addTableCubaturnic').click(function () {   //кнопка построения таблицы
    var $diameterFrom = +$('#diameterFrom').val();   //диаметр ОТ
    var $diameterUpTo = +$('#diameterUpTo').val();   //диаметр ДО

    if ($diameterFrom > $diameterUpTo) {
        notifyMessage('Значення "Діаметр від" повинно бути менше, або дорівнювати "Діаметр до"', "error");  //сообщение об ощибке diameterFrom > diameterUpTo
    } else {
        removeAllTrInTbody('#tableCubaturnic');    //удалить строки из tbody    
        removeValueTfoot('#tableCubaturnic');      //очистить значение в tfoot
        getListVolumeOfTree('#lengthOfTree');      //масив объемов необходимой длины       
    }
});

function LoadLength(element) { //длины   
     $.getJSON('/Cubaturnic/GetListColumn', { 'nameTable': 'Кубатурник' }, function (data) {
        renderSelectOption(element, data);
    });
}

function getListDiameter() {
    var listDiameter = [1, 2, 3, 4, 5];
    return listDiameter;
}

var DiametrsList = [];
function getListDiametr() {
    $.getJSON('/Cubaturnic/GetListDiameter', function (data) {
        DiametrsList = data;
        renderSelectOption('#diameterFrom', data);
        renderSelectOption('#diameterUpTo', data);
    });
}

function getListVolumeOfTree(element) {   //масив объемов необходимой длины 

    var lengthOfTree = $(element).val();  //длина бревна

    $.getJSON('/Cubaturnic/GetListVolumeOfTree', { 'length': lengthOfTree }, function (data) {
        addTrCubaturnic('#tableCubaturnic', DiametrsList, data); //создать таблицу
        onChangeAmountTree();        //добавляем к input .amountTree событие change
        validateInt('.amountTree');  //в input только целые числа
    });
}

function addTrCubaturnic(element, listDiametr, listVolumeOfTree) { //создать тпблицу
    var $table = $('tbody', element);
    var $diameterFrom = +$('#diameterFrom').val();   //диаметр ОТ
    var $diameterUpTo = +$('#diameterUpTo').val();   //диаметр ДО
    var $multiplicity = +$('#diameter').val();

    $(listDiametr).each(function (index, value) {
        if (+value % $multiplicity === 0 && $diameterFrom <= value && $diameterUpTo >= value) {

            $("<tr>").appendTo($table);//добавляем строку   

            for (var i = 0; i <= 3; i++) {
                if (i === 0) {
                    $("<td/>", { text: value }).appendTo($('tr:last', $table));
                } else if (i === 1) {
                    $("<td/>", { text: listVolumeOfTree[index] }).appendTo($('tr:last', $table));
                } else if (i === 2) {
                    $('<td> <input class="form-control amountTree" type="number" min="0"/> </td>').appendTo($('tr:last', $table));
                } else {
                    $('<td/>').appendTo($('tr:last', $table));
                }
            }
        }
    });
}

function onChangeAmountTree() {        //добавляем к input .amountTree событие change
    $('.amountTree').change(function () {
        sumPoStupeniam(this);          //расчитываем объем по ступеням толщины
        columnSumValueQuantity(this);  //общая сумма и количество        
    });
}

function sumPoStupeniam(element) {             //расчитываем объем по ступеням толщины
    var $td = $(element).parents('td');
    var valueAmountTree = +element.value;      //количество деревев
    var valueTree = +$($td).prev('td').html(); //значение предыдущего td (узнаем объем одной колодки)       
    $($td).next('td').text((valueTree * valueAmountTree).toFixed(3)); //находим следующий td (где будет расчитыватся общий объем)
}

function columnSumValueQuantity(element) {     //общая сумма и количество   
    var $tbody = $(element).parents('tbody');
    $($tbody).next('tfoot').find('td').not(':first').each(function (indx) {
        var x = 0;                            //количество знаков после запятой
        var sumColumn = 0;
        $("td:nth-child(" + (indx + 2) + ")", $tbody).each(function () {
            if (indx === 1) {
                sumColumn += +$('input', this).val();
            } else if (indx === 2) {
                x = 3;
                sumColumn += +$(this).html();
            }
        });
        $(this).text(sumColumn === 0 ? '' : (sumColumn).toFixed(x));
    });
}

function removeAllTrInTbody(element) {//удалить все строки из tbody
    $('tbody', element).find('tr').remove();
}

$('#clearAmountTree').click(function () {        //кнопка - Очистити кількість лісоматеріалів
    removeValueInput('#tableCubaturnic tbody');  //очистить значение input-ов в tbody (убрать количество колодок)   
    clearLastTd('#tableCubaturnic tbody');       //очистить значение колонки (Загальний обєм)
    removeValueTfoot('#tableCubaturnic');        //очистить значение в tfoot
});

function removeValueInput($tbody) { //очистить значение input-ов в tbody (убрать количество колодок)
    $('input', $tbody).each(function () {
        $(this).val('');
    });
}

function clearLastTd($tbody) {  //очистить значение колонки (Загальний обєм)
    $("td:nth-child(4)", $tbody).text('');
}

function removeValueTfoot(table) {  //очистить tfoot
    var $tbody = $('tfoot', table);
    $($tbody).find('td').not(':first').each(function () {
        $(this).text('');
    });
}

function renderSelectOption(element, List) {//создание выпадающего списка
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').text('Вибрати'));
    $.each(List, function (i, val) {
        $ele.append($('<option/>').text(val));
    });
    $ele.prop('selectedIndex', 0); //значение по умолчанию
}









