$(document).ready(function () {
    $('#addDataToDB').hide();//скрыть кнопку
});

var tableName;
$('#selectTheTableToEdit').change(function () {
    tableName = $(this).val();
    var $theadMyDatatableDB = $('#myDatatableDB thead');

    if ($('#myDatatableDB tr').length) {
        var table = $('#myDatatableDB').DataTable();   //очистка таблицы
        table.clear().draw();
        table.destroy();
    }

    if (tableName !== '') {

        if (tableName === 'Денна_тарифна_ставка') {
            $('#addDataToDB').hide(); //скрыть кнопку
        } else {
            $('#addDataToDB').show(); //отобразить кнопку редактирования таблицы
        }

        $('tr', $theadMyDatatableDB).remove(); //удалить  шапку таблицы
        addTr($theadMyDatatableDB, tableName); //добавить шапку таблицы
        showDataTable(tableName); //загрузка таблицы из БД
    } else if ($('#myDatatableDB tr').length) {
        $('tr', $theadMyDatatableDB).remove(); //удалить  шапку таблицы
        $('#addDataToDB').hide(); //скрыть кнопку
    }
});

var dataTable, popupForm;
function showDataTable(tableName) { //загрузка таблицы из БД
    dataTable = $('#myDatatableDB').DataTable({
        'ajax': {
            type: "GET",
            url: '/EditingTheDatabase' + tableName + '/GetTable', /*'/EditingTheDatabaseРобітники/GetTable',   */
            datatype: 'json',
            error: function () {
                notifyMessage("Ви не маєте права доступу до цієї таблиці", "error");
            }
        },
        'columns': returnTr(tableName),//получаем структуру таблицы
        'language': {
            "decimal": ",",
            "thousands": ".",
            "sProcessing": "Зачекайте...",
            "sLengthMenu": "Показати _MENU_ записів",
            "sZeroRecords": "Записи відсутні.",
            "sInfo": "Записи з _START_ по _END_ із _TOTAL_ записів",
            "sInfoEmpty": "Записи з 0 по 0 із 0 записів",
            "sInfoFiltered": "(відфільтровано з _MAX_ записів)",
            "sInfoPostFix": "",
            "sSearch": "Пошук:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Перша",
                "sPrevious": "Попередня",
                "sNext": "Наступна",
                "sLast": "Остання"
            },
            "oAria": {
                "sSortAscending": ": активувати для сортування стовпців за зростанням",
                "sSortDescending": ": активувати для сортування стовпців за спаданням"
            }
        }
    });
}


$('.tablecontainer').on('click', 'a.popup', function (e) {
    e.preventDefault();
    var str = $(this).attr('href');
    if ($(this).attr('id') === 'addDataToDB') {
        str = '/EditingTheDatabase' + tableName + '/Save';
    }
    OpenPopup(str);
});


function OpenPopup(pageUrl) {
    var $pageContent = $('<div/>');
    $pageContent.load(pageUrl, function () {
        $('#popupForm', $pageContent).removeData('validator');
        $('#popupForm', $pageContent).removeData('unobtrusiveValidation');
        $.validator.unobtrusive.parse('form');
    });

    PopupForm($pageContent);
    editingData();
    popupForm.dialog('open');
}

function editingData() {//изминение записей
    $('.popupWindow').on('submit', '#popupForm', function (e) {
        var url = $('#popupForm')[0].action;
        $.ajax({
            type: "POST",
            url: url,
            data: $('#popupForm').serialize(),
            success: function (data) {
                if (data.status) {
                    popupForm.dialog('close');
                    dataTable.ajax.reload();

                    $.notify(data.message, {
                        globalPosition: "top center",
                        className: "success"
                    });
                }
            }
        });
        e.preventDefault();
    });
}

function PopupForm($pageContent) {
    popupForm = $('<div class="popupWindow" style="overflow:auto"></div>')
        .html($pageContent)
        .dialog({
            draggable: false,
            autoOpen: false,
            resizable: false,
            model: true,
            title: 'Діалогове вікно',
            height: tableName === 'Денна_тарифна_ставка' ? 585 : 460,
            width: 500,
            close: function () {
                popupForm.dialog('destroy').remove();
            }
        });
}

function addTr($thead, tableName) {    //добавить шапку таблицы

    if (tableName === "Вид_рубки") {                  //построение таблицы Вид_рубки
        $($thead).append('<tr><td>Вид рубки</td><td>Редагувати</td><td>Видалити</td></tr>');
    } else if (tableName === "Денна_тарифна_ставка") {//построение таблицы Денна_тарифна_ставка
        $($thead).append('<tr><td>Вид робіт</td><td>Комплексна/Індивідуальна</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>Видалити</td></tr>');
    } else if (tableName === "Робітники") {           //построение таблицы Робітники       
        $($thead).append('<tr><td>П.І.Б.</td><td>Посада</td><td>Тарифний розряд</td><td>Категорія</td><td>Редагувати</td><td>Видалити</td></tr>');
    } else if (tableName === "Сортименти") {          //построение таблицы Сортименти
        $($thead).append('<tr><td>Назва сортименту</td><td>Редагувати</td><td>Видалити</td></tr>');
    }
}


function returnTr(tableName) {//получаем структуру таблицы
    var newTr;
    if (tableName === "Вид_рубки") {
        newTr = [//построение таблицы Вид_рубки
            { 'data': 'Вид_рубки1', 'autoWidth': true },
            {
                "data": "Id_Вид_робіт", "width": "50px", "render": function (data) {
                    return '<a class="popup" href="/EditingTheDatabaseВид_рубки/Save/' + data + '">Редагувати</a>';
                }
            },
            {
                "data": "Id_Вид_робіт", "width": "50px", "render": function (data) {
                    return '<a class="popup text-danger" href="/EditingTheDatabaseВид_рубки/Delete/' + data + '">Видалити</a>';
                }
            }
        ];
    } else if (tableName === "Денна_тарифна_ставка") {
        newTr = [//построение таблицы Денна_тарифна_ставка
            { 'data': 'Вид_робіт', 'autoWidth': true },
            { 'data': 'Комплексна_индивідуальна', 'autoWidth': true },
            { 'data': 'C1', 'autoWidth': true },
            { 'data': 'C2', 'autoWidth': true },
            { 'data': 'C3', 'autoWidth': true },
            { 'data': 'C4', 'autoWidth': true },
            { 'data': 'C5', 'autoWidth': true },
            { 'data': 'C6', 'autoWidth': true },
            {
                "data": "РозцінкаID", "width": "50px", "render": function (data) {
                    return '<a class="popup" href="/EditingTheDatabaseДенна_тарифна_ставка/Save/' + data + '">Редагувати</a>';
                }
            }
        ];
    } else if (tableName === "Робітники") {
        newTr = [//построение таблицы Робітники
            { 'data': 'П_І_Б', 'autoWidth': true },
            { 'data': 'Професія', 'autoWidth': true },
            { 'data': 'Тарифний_розряд', 'autoWidth': true },
            { 'data': 'Категорія', 'autoWidth': true },
            {
                "data": "Id_Робітника", "width": "50px", "render": function (data) {
                    return '<a class="popup" href="/EditingTheDatabaseРобітники/Save/' + data + '">Редагувати</a>';
                }
            },
            {
                "data": "Id_Робітника", "width": "50px", "render": function (data) {
                    return '<a class="popup text-danger" href="/EditingTheDatabaseРобітники/Delete/' + data + '">Видалити</a>';
                }
            }
        ];
    } else if (tableName === "Сортименти") {
        newTr = [//построение таблицы Сортименти
            { 'data': 'Назва_сортименту', 'autoWidth': true },
            {
                "data": "СортиментиID", "width": "50px", "render": function (data) {
                    return '<a class="popup" href="/EditingTheDatabaseСортименти/Save/' + data + '">Редагувати</a>';
                }
            },
            {
                "data": "СортиментиID", "width": "50px", "render": function (data) {
                    return '<a class="popup text-danger" href="/EditingTheDatabaseСортименти/Delete/' + data + '">Видалити</a>';
                }
            }
        ];
    }
    return newTr;
}









