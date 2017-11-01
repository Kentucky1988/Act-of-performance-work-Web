function columnSum() {//сумма строк
    $("tfoot tr td:not(:first)").text(function (indx) {
        var sum = 0;
        $("tr:not(:first) td:nth-child(" + (indx + 2) + ")", "#tbodyTable1").each(function () {
            sum += +$(this).text()
        });
        $(this).text(sum)
    });
};

$('#qwert').focusin(function (e) {// событие на изминеие ячейки вид ротобы  

    alert($("#volumeWood").val() + "/" + $(this));//!!!!!!!!!!!!!!!!!!!!!!!!!

    $.ajax({
        type: "GET",
        url: '/home/normWork',
        data: { 'volumeWood': $("#volumeWood").val() },  //'table': $("#SearchBy").val(),        
        success: function (norm) {
            $('#norm').val(norm);
        }
    })
});