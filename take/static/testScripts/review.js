//okay so right now we have all this data plopped into div tags
testHtml = $("#test").html();
studentResults = parse($("#studentResults").html());
studentGrade = parse($("#studentGrade").html());
answers = parse($("#answers").html());
$("#hidden").hide();

console.log(studentResults, studentGrade, answers);

//turn the object into an array for easy looping, and add a correct attribute
var questList = [];
for (questID in studentResults) {
    if (studentResults.hasOwnProperty(questID)) {
        question = studentResults[questID];
        question.correct = question.correctPoints === question.possiblePoints
        questList.push(question);
    }
}

var studentOrTeacherViewing = $("h2").text().trim().split(" ")[0] === "They" ? "teacher" : "student";

//generate display html for each question
questList.map(function (question) {
    //we want our html to match what the student inputted
    switch (question.type) {
        case "tf":
            //this one is easy, if it is true mark the box checked
            if (question.studentAnswer === true) {
                $("#" + question.id + "-1").prop("checked", true);
            }
            break;
        case "mc":
            //in studentAnswer we have a list of everything they selected
            question.studentAnswer.forEach(function (option) {
                $("#" + question.id + "-" + option).prop("checked", true);
            });
            break;
        case "fb":
        case "es":
        case "sa":
            //we just set the value of the input equal to what they entered
            $("#" + question.id + "-1").val(question.studentAnswer);
            break;
        case "ma":
            //just take everything from studentAnswer and put it in
            for (i in question.studentAnswer) {
                if (question.studentAnswer.hasOwnProperty(i)) {
                    $("#" + question.id + "-" + i).val(question.studentAnswer[i])
                }
            }
            question.studentAnswer = JSON.stringify(question.studentAnswer);
            question.correctAnswer = JSON.stringify(question.correctAnswer);
            break;
    }

    var description = "";
    if (question.possibleManualPoints === 0) {
        description = "<p>" +
            (studentOrTeacherViewing === "student" ? "You " : "They ")
            + "put " + question.studentAnswer + ". The correct answer was " + question.correctAnswer
            + ".</p>";
    } else {
        if (question.hasBeenGraded) {
            description = "<p>Awarded " + question.studentManualPoints + " points.</p>";
        } else {
            description = "<p>This question needs to be graded by a teacher </p>";
        }
    }

    $("#" + question.id).wrap(
        "<div class='questionBlock "
        + (question.correct ? "correct" : "incorrect")
        + "'>")
        .parent()
        .append(description)
        .prepend("<h3>" + question.id + "</h3>");
    return question;
});

//make questions that need to be manually graded blue