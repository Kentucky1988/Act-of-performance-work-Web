$(document).ready(function () { //загрузка таблицы /Робітники/
    var employeesTable = $('#employeesDataTable').DataTable({
        'ajax': {
            'type': "GET",
            'url': '/EditingTheDatabase/getTableEmployees',
            'datatype': 'json'
        },
        'columns': [
            { 'data': 'П_І_Б', 'autoWidth': true },
            { 'data': 'Професія', 'autoWidth': true },
            { 'data': 'Тарифний_розряд', 'autoWidth': true },
            { 'data': 'Категорія', 'autoWidth': true }
        ]
    })
}) 