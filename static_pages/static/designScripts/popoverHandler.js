$(function () {
    var popover = $("#popover");
    popover.hide();

    var contents = $("#contents");

    //handle the previewer
    $("#preview").click(function () {
        var code = editor.getValue();
        code = compile(code, true);
        contents.html(code);
        popover.toggle();
    });

    //handle the help
    $("#help").click(function () {
        contents.html('<iframe src="help.html" frameborder="0" scrolling="no" onload="resizeIframe(this)" />');
        popover.toggle();
    });

    $("#publish").click(function () {
        contents.html('<h3>Shareable link:</h3>' + window.location.href.split("/main/")[0] + "/take/" +
            teacherName + "/" + $("#name").val() + "/ <br/>Please not that editing the test after " +
            "some students have taken it may result in malformed statistics.");
        popover.toggle();
    });

    //handle the x button
    $("#close").click(function () {
        popover.hide();
    });
});

function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}