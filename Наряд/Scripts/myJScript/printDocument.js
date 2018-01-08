//function addCanvas(canvasID) {
//    $('<canvas>').attr({
//        id: canvasID
//    }).css({
//        width: '300px',
//        height: '200px'
//    }).appendTo('#divPDF');
//}

//function addContentToCanvas(canvasID) {
//    var canvas = document.getElementById(canvasID).getContext('2d');
//    canvas.font = '24px serif'; 
//    canvas.textAlign = 'centr';   
//    canvas.fillText('Привіт !!!', 20, 20);

//    //var canvas = document.getElementById(canvasID);
//    //var ctx = canvas.getContext('2d');

//    //var data = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
//    //    "<foreignObject width='100%' height='100%'>" +
//    //    "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:40px'>" +
//    //    "<table border='1'><tr><td>row 1, cell 1</td><td>row 1, cell 2</td></tr><tr><td>row 2, cell 1</td><td>row 2, cell 2</td></tr></table>" +
//    //    "</div>" +
//    //    "</foreignObject>" +
//    //    "</svg>";

//    //var DOMURL = self.URL || self.webkitURL || self;
//    //var img = new Image();
//    //var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
//    //var url = DOMURL.createObjectURL(svg);
//    //img.onload = function () {
//    //    ctx.drawImage(img, 0, 0);
//    //    DOMURL.revokeObjectURL(url);
//    //};
//    //img.src = url;
//}

//function convertHtmlToPDF(canvasID) {
//    var docPDF = new jsPDF({
//        orientation: 'l',
//        unit: 'mm',
//        format: 'a4'
//    });

//    var canvas = document.getElementById(canvasID);
//    var imgData = canvas.toDataURL("image/png");
//    docPDF.addImage(imgData, 'PNG', 0, 0);
//    docPDF.save("download.pdf");
//}

//$('#convertPDF').click(function () {
//    var canvasID = 'PDF';

//    //addCanvas(canvasID);
//   // addContentToCanvas(canvasID);
//    convertHtmlToPDF('canvas');

//   // $('#divPDF canvas').remove();
//});


//$(document).ready(function () {
//    var canvas = document.getElementById("canvas");
//    var ctx = canvas.getContext("2d");
//    var data = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
//        "<style>" +
//        "td {background-color:yellow;" +
//        "padding: 10px;}" +
//        "</style>" +
//        "<foreignObject width='100%' height='100%'>" + $("#mytable").html() +
//        "</foreignObject>" +
//        "</svg>";
//    var DOMURL = self.URL || self.webkitURL || self;
//    var svg = new Blob([data], { type: "image/svg+xml" });
//    var url = DOMURL.createObjectURL(svg);

//    var img = new Image();   
//    img.onload = function () {
//        ctx.drawImage(img, 0, 0);
//        DOMURL.revokeObjectURL(url);       
//    };
//    img.src = url;
//});


$('#printDocument').click(function () {//печать докумета
    var printMe = document.getElementById('printDiv');
    var documentPrint = window.open(/*'', '', 'width = 400, height = 300'*/);
    documentPrint.document.write(printMe.outerHTML);
    documentPrint.document.close();
    documentPrint.focus();
    documentPrint.print();
    documentPrint.close();
});

$('#addDocument').click(function () { //сформировать документ
    copyDressNumber();
    copyTableFace($('#theadTableFase tr:eq(1)').find('td'), $('#theadTablePrint tr:eq(1)').find('td'));
    copyTableFace($('#theadFase td:odd'), $('#theadPrint td:odd'));
    copyTbodyFace($('#tbodyTableFase tbody tr:not(:first)'), $('#tbodyTablePrint tbody'));
    copyTableFace($('#tbodyTableFase tfoot td:not(:first)'), $('#tbodyTablePrint tfoot td:not(:first)'));
    copyTbodyFace($('#tfootTableFase tbody tr'), $('#tfootTablePrint tbody'));
});

function copyDressNumber() {
    $('#dressNumberPrint').text($('#dressNumberFase input').val());
}

function copyTableFace($tableCopy, $tablePrint) {
    $($tableCopy).each(function (index, val) {
        var str;
        if ($('input', this).length) {
            str = $('input', this).val();
        } else if ($('select', this).length) {
            str = $('select', this).val();
        } else {
            str = $(this).text();
        }
        $($tablePrint).eq(index).text(str);
    });
}

function copyTbodyFace($tableCopyTr, $tablePrintTbody) {
    $($tableCopyTr).each(function () {
        $("<tr>").appendTo($tablePrintTbody);//добавляем нижнюю строку  

        $('td', this).each(function () {
            if (!$('button', this).length) {             
                $("<td/>", { text: $(this).text() }).appendTo($("tr:last", $tablePrintTbody));
            }
        });
    });
}



