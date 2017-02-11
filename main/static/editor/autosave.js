$(function saveInterval() {
    //gather data every half a second

    window.setInterval(save, 500);
});

$(window).bind('beforeunload', function triggerExitSave() {
    //if they try to leave, quick save
    save();
});

var previousSave = "";

function save() {
    //gather all data, check if it is different from the previous, if not, save it

    var save = assembleSave();
    var stringed = JSON.stringify(save);

    //now we want to see if this save is different from the prev save
    if (stringed !== previousSave) {
        $.ajax({
            type: "POST",
            url: "/main/save",
            data: save,
            success: function () {
            },
            dataType: 'json'
        });
        previousSave = stringed;
    }
}

function assembleSave() {
    var savePoint = {}; //we populate this with the field values
    savePoint.title = $("#name").val();
    savePoint.description = $("#description").val();
    savePoint.markdown = editor.getValue();
    savePoint.html = compile(editor.getValue(), false)[0];
    savePoint.answers = JSON.stringify(compile(editor.getValue(), false)[1]);
    savePoint.security = $("#security").is(":checked");
    savePoint.review = $("#review").is(":checked");
    savePoint.access_code = $("#access_code").val();
    savePoint.pk = $("#pk").val();
    return savePoint;
}