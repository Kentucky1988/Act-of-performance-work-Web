
//сообщение о заполнение всех ячеек и diameterUpTo >= diameterFrom

$(document).ready(function () {
    getListDiametr();             //список диаметров 
    LoadLength('#lengthOfTree');
    renderCategory('#diameter', getListDiameter());
});

$('#addTableCubaturnic').click(function () {//кнопка вызов модального окна очистки наряда  
    removeAllTrInTbody('#tableCubaturnic');           //удалить строки из tbody    
    getListVolumeOfTree('#lengthOfTree')              //масив объемов необходимой длины       
});

function LoadLength(element) { //длина   
    $.ajax({
        type: "GET",
        url: '/Cubaturnic/getListColumn',
        data: { 'nameTable': 'Кубатурник' },
        success: function (data) {
            renderCategory(element, data);
        }
    });
}

function getListDiameter() {
    var listDiameter = [1, 2, 3, 4, 5];
    return listDiameter;
}

var DiametrsList = [];
function getListDiametr() { //список диаметров   
    $.ajax({
        type: "GET",
        url: '/Cubaturnic/getListDiameter',
        success: function (data) {
            DiametrsList = data;
            renderCategory('#diameterFrom', data);
            renderCategory('#diameterUpTo', data);
        }
    });
}

function getListVolumeOfTree(element) { //масив объемов необходимой длины   
    var lengthOfTree = $(element).val();             //длина бревна

    $.ajax({
        type: "GET",
        url: '/Cubaturnic/getListVolumeOfTree',
        data: { 'length': lengthOfTree },
        success: function (data) {
            addTrCubaturnic('#tableCubaturnic', DiametrsList, data); //создать тпблицу
            onChangeAmountTree();   //добавляем к input .amountTree событие change
        }
    });
}

function addTrCubaturnic(element, listDiametr, listVolumeOfTree) { //создать тпблицу
    var $table = $('tbody', element);
    var $diameterFrom = +$('#diameterFrom').val();   //диаметр ОТ
    var $diameterUpTo = +$('#diameterUpTo').val();   //диаметр ДО
    var $multiplicity = +$('#diameter').val();

    $(listDiametr).each(function (index, value) {
        if (+value % $multiplicity == 0 && $diameterUpTo >= $diameterFrom && 
            $diameterFrom <= value && $diameterUpTo >= value) {

            $("<tr>").appendTo($table);//добавляем строку   

            for (var i = 0; i <= 3; i++) {
                if (i == 0) {
                    $("<td/>", { text: value }).appendTo($('tr:last', $table));
                } else if (i == 1) {
                    $("<td/>", { text: listVolumeOfTree[index] }).appendTo($('tr:last', $table));
                } else if (i == 2) {
                    $('<td> <input class="form-control amountTree" type="number"/> </td>').appendTo($('tr:last', $table));
                } else {
                    $('<td/>').appendTo($('tr:last', $table));
                }
            }
        }
    });
}

function onChangeAmountTree() {     //добавляем к input .amountTree событие change

    $('.amountTree').change(function () {
        var valueTree = $(this).parents('td').prev('td').html();//значение предыдущего td (узнаем объем одной колодки)
        var valurSum = '';     //находим следующий td (где бутит расчитыватся общий объем)
    });
}

function removeAllTrInTbody(element) {//удалить строки из tbody
    $('tbody', element).find('tr').remove();
}


