function readyMatching() {
    //make the matching part
    var $matching = $('.matching-question-container');

    //make the left draggable
    $('.left > p', $matching).draggable({
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        helper: "clone"
    });

    $('.right > p > .fillin', $matching).droppable({
        drop: function (event, ui) {
            $(this).val(ui.draggable.html());
        }
    });

    $("#draggable").draggable();
}

function randomize() {
    $('.random').each(function (index) {
        var array = $(this).children().toArray();
        //remove format blocks from array
        var newArray = [];
        array.forEach(function (item) {
            if ($(item).attr('class') !== 'blockJoin') {
                newArray.push(item);
            }
        });
        array = newArray;

        //now we shuffle the array
        array = shuffle(array);

        //now we join the array with our spacer
        newArray = [];
        newArray.push(array.shift());
        array.forEach(function (item) {
            if ($(item).text().trim()) {
                newArray.push('<div class="blockJoin"></div>');
                newArray.push(item);
            }
        });
        array = newArray;

        //now plug it in
        $(this).html(array);

        //actually we aren't done yet, because I don't understand javascript objects so I used .html() as a cheater
        //way of converting DivElements into strings.
    });

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}


$(function () {
    if(typeof dontShuffle === "undefined") {dontShuffle = false}
    if (!dontShuffle) { //this is so we don't shuffle on the results page
        randomize();
    }
    readyMatching();
    $("#submit").click(function () {
        if (!$("#name").val().trim()) {
            alert("please fill out your name"); //FIXME fuck chrome
            return;
        }
        if(typeof timeAway === "undefined") timeAway = 0;
        $("#time-away").val(timeAway);
        $("#form").submit();
    })
});

