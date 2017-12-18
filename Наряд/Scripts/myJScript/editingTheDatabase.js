var dataTable, popupForm;

$(document).ready(function () { //загрузка таблицы /Робітники/
    dataTable = $('#myDatatable').DataTable({
        'ajax': {
            'type': "GET",
            'url': '/EditingTheDatabase/getTableEmployees',
            'datatype': 'json'
        },
        'columns': [
            { 'data': 'П_І_Б', 'autoWidth': true },
            { 'data': 'Професія', 'autoWidth': true },
            { 'data': 'Тарифний_розряд', 'autoWidth': true },
            { 'data': 'Категорія', 'autoWidth': true },
            {
                "data": "Id_Робітника", "width": "50px", "render": function (data) {
                    return '<a class="popup" href="/EditingTheDatabase/Save/' + data + '">Редагувати</a>';
                }
            },
            {
                "data": "Id_Робітника", "width": "50px", "render": function (data) {
                    return '<a class="popup text-danger" href="/EditingTheDatabase/Delete/' + data + '">Видалити</a>';
                }
            }
        ],
        'language':
        {
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
    })
})


$('.tablecontainer').on('click', 'a.popup', function (e) {
    e.preventDefault();
    OpenPopup($(this).attr('href'));
})


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

function editingData() {
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
                    })
                }
            }
        })
        e.preventDefault();
    })
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
            height: 460,
            width: 500,
            close: function () {
                popupForm.dialog('destroy').remove();
            }
        })   
}
