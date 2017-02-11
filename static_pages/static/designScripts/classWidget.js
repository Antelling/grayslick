$(function () {
    var table = $("#classes");

    //new class button
    $("#newClass").click(function () {
        table.append("<tr>" +
            '<td><input type="text"></td>' +
            '<td><input type="text"></td>' +
            '<td><input type="checkbox" class="publicCheckbox"></td>' +
            '<td><a class="delete">delete</a></td>' +
            '</tr>'
        );
    });

    //delete button
    $("table").on("click", ".delete", function () {
        $(this).parent().parent().remove();
    });

    //highlight all button
    $("#allPublic").click(function(){
        $(".publicCheckbox").prop('checked', true)
    });

    //unhighlight all button
    $("#allPrivate").click(function(){
        $(".publicCheckbox").prop('checked', false)
    });
});