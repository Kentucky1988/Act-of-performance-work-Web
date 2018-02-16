$('#printDocument').click(function () {//печать докумета
    var printMe = document.getElementById('print');
    var documentPrint = window.open();
    documentPrint.document.write(printMe.outerHTML);
    documentPrint.document.close();
    documentPrint.focus();
    documentPrint.print();
    documentPrint.close();
});

$('#addDocument').click(function () { //сформировать документ Fase
    //копирование лицевой стороны
    copyDressNumber($('#dressNumberFase input').val(), $('#dressNumberPrint'));
    copyTableFace($('#theadTableFase tr:eq(1)').find('td'), $('#theadTablePrint tr:eq(1)').find('td'));
    copyTableFace($('#theadFase td:odd'), $('#theadPrint td:odd'));
    copyTableFace($('#tbodyTableFase tfoot td:not(:first)'), $('#tbodyTablePrint tfoot td:not(:first)'));
    deleteFromTbodyTr($('#tbodyTablePrint'));
    deleteFromTbodyTr($('#tfootTablePrint'));
    copyTbodyFace($('#tbodyTableFase tbody tr:not(:first)'), $('#tbodyTablePrint tbody'));
    copyTbodyFace($('#tfootTableFase tbody tr'), $('#tfootTablePrint tbody'));
    copyEmployeePosition($('#tfootTFase'), $('#tfootPrint'));
    copyCoefficientFromPrint($('#coefficient'), $('#coefficientPrint'));

    //копирование обратной стороны
    deleteFromTbodyTr($('#theadTablePrintReverse'));
    deleteFromTbodyTr($('#tbodyTablePrintReverse'));
    copyTableEmployee($('.tbodyTableRevers'), $('#theadTablePrintReverse tbody'));
    copyTableFace($('.employee tfoot td:not(:first)'), $('#theadTablePrintReverse tfoot td:not(:first)'));
    copyEmployeePosition($('#tbodyEmployeePositionReverse'), $('#theadPrintReverse'));
    copyDressNumber($('#totalTableDetails').text(), $(totalTableDetailsPrint));
    copyDressNumber($('#volumeTotalTableDetails').text(), $(volumeTotalTableDetailsPrint));
    copyTrtbodyPrintDetails($('.details tbody tr:not(:first)'), $('#tbodyTablePrintReverse tbody'));
    copyEmployeePosition($('#tfootEmployeePositionReverse'), $('#tfootPrintReverse'));
});

function copyDressNumber($valElementCopy, $elementPrint) {//копировать номер наряда
    $($elementPrint).text($valElementCopy);
}

function getTheText($element) {
    var str;
    if ($('input', $element).length) {
        str = $('input', $element).val();
    } else if ($('select', $element).length) {
        str = $('select', $element).val();
    } else {
        str = $($element).text();
    }
    return str;
}

function copyTrtbodyPrintDetails($tableCopyTr, $tablePrintTbody) {//копируем таблицу .details
    $('tr', $tablePrintTbody).remove();

    $($tableCopyTr).each(function (index) {

        if (index === 0 || index % 2 === 0) {
            $("<tr>").appendTo($tablePrintTbody);//добавляем нижнюю строку  
        }

        $('td', this).each(function () {
            if (!$('button', this).length) {
                var str = getTheText(this);
                $("<td/>", { text: str }).appendTo($("tr:last", $tablePrintTbody));
            }
        });

        if ($tableCopyTr.length === 1 || (index === $tableCopyTr.length - 1 && index % 2 === 0)) {
            $($tableCopyTr).filter(':eq(0)').find('td:not(:last)').each(function () {               
                $("<td/>").appendTo($("tr:last", $tablePrintTbody));
            });
        }
    });
}

function copyTableFace($tableCopyTd, $tablePrintTd) {
    $($tableCopyTd).each(function (index, val) {
        var str = getTheText(this);
        $($tablePrintTd).eq(index).text(str);
    });
}

function copyTbodyFace($tableCopyTr, $tablePrintTbody) {
    $($tableCopyTr).each(function () {

        $("<tr>").appendTo($tablePrintTbody);//добавляем нижнюю строку  

        $('td', this).each(function () {
            if (!$('button', this).length) {
                var str = getTheText(this);
                $("<td/>", { text: str }).appendTo($("tr:last", $tablePrintTbody));
            }
        });
    });
}

function deleteFromTbodyTr(table) {//удалить все строки в tbody таблицы   
    var $table = $('tbody', table);
    $('tr', $table).each(function () {
        $(this).remove();
    });
}

function copyEmployeePosition($employeePositionCopyDiv, $employeePositionPrintDiv) {
    var $lablePrint = $('label:nth-child(3n+3)', $employeePositionPrintDiv);
    $('div', $employeePositionCopyDiv).each(function (index, val) {
        var str;
        var $lable = $(this).children().eq(1);

        if ($($lable).is('label')) {
            str = $($lable).text();
        } else if ($($lable).is('input')) {
            str = $($lable).val();
        } else {
            str = $('select', this).val();
        }

        var $employee = $('.custom-combobox-input', this);
        if ($($employee).length) {
            str += ' ' + $($employee).val();
        }

        $($lablePrint).eq(index).text(str);
    });
}

function copyCoefficientFromPrint($coefficientFacial, $coefficientPrint) {

    var $tdCoefficientPrint = $('td', $coefficientPrint);
    $('#coefficientPrint td, #coefficientPrint label').show();

    $('div', $coefficientFacial).each(function (index, val) {

        if ($(this).is(':visible')) {//если div отображается 

            if (index === 1) {
                $(this).children().each(function (i, v) {
                    if (!$(this).hasClass('active')) { //если отмечен флажок
                        $($tdCoefficientPrint).eq(index).find('label').eq(i).hide();
                    }
                });
            } else if (index === 2 || index === 3) {
                $(this).children().each(function (i, v) {
                    if ($(this).is('input')) {
                        var str = $(this).val() === '' ? '-' : $(this).val();
                        $($tdCoefficientPrint).eq(index).find('label').eq(i).text(str);
                    }
                });
            } else if (index === 4) {
                $(this).children().each(function (i, v) {
                    if ($(this).is('select')) {
                        var str = $(this).val();
                        $($tdCoefficientPrint).eq(index).find('label').eq(i).text(str);
                    }
                });
            }
        } else {
            $('#coefficientPrint td').eq(index).hide();
        }
    });
}

function copyTableEmployee($tableCopyEmployee, $tablePrintEmployee) {
    $('tr:not(:eq(0), :eq(1))', $tableCopyEmployee).each(function (index, value) {

        $("<tr>").css('height', '15px').appendTo($tablePrintEmployee);//добавляем нижнюю строку           

        $('td:not(:last)', this).each(function (i) {  //копируем первую строку    
            var str = $(this).text();
            var $lastTr = $('tr:last', $tablePrintEmployee);

            if (index % 2 === 0 && (i <= 4 || i >= 21)) {
                $("<td/>").attr("rowspan", "2").text(str).appendTo($($lastTr));
            } else {
                $("<td/>", { text: str }).appendTo($($lastTr));
            }
        });
    });
}



