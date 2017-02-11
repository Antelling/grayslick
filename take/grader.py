import json


def grade(providedAnswers, actualAnswers):
    # okay so we need an object that holds
    # - the total grade they got, as a ratio
    # - the individual ratios per question
    # - what the student answered for every question

    actualAnswers = json.loads(actualAnswers)

    gradedResponse = {}

    # region loop
    for id in actualAnswers:

        question = actualAnswers[id]
        questionBlock = {
            "type": question["type"],
            "correctPoints": 0,  # how many points the student earned
            "possiblePoints": question["weight"],
            "studentAnswer": "",  # what the student answered
            "correctAnswer": "",  # what the actual answer was
            "possibleManualPoints": 0,  # essay question weights
            "studentManualPoints": 0,  # essay question actual scores
            "hasBeenGraded": True,
            "id": id
        }

        # region questions
        # region tf
        if question["type"] == "tf":
            questionBlock["correctAnswer"] = question["answer"]
            questionBlock["studentAnswer"] = id + "-1" in providedAnswers
            questionBlock["correctPoints"] = question["weight"] if questionBlock["studentAnswer"] == question[
                "answer"] else 0
        # endregion
        # region mc
        elif question["type"] == "mc":
            questionBlock["correctAnswer"] = question["answers"]
            totalCorrect = 0
            totalPossible = 0
            studentAnswers = []
            for answer in question["answers"]:
                totalPossible += 1
                totalCorrect += 1 if id + "-" + str(answer) in providedAnswers else 0
                studentAnswers.append(answer)
            questionBlock["studentAnswer"] = studentAnswers
            questionBlock["correctPoints"] = question["weight"] * (totalCorrect / totalPossible)
        # endregion
        # region sr or es
        elif question["type"] == "sr" or question["type"] == "es":
            questionBlock["possiblePoints"] = 0  # to make totaling simple
            questionBlock["possibleManualPoints"] = question["weight"]
            questionBlock["studentAnswer"] = providedAnswers[id + "-1"]
            questionBlock["hasBeenGraded"] = False
        # endregion
        # region ma
        elif question["type"] == "ma":
            totalAnswers = 0
            correctAnswers = 0
            for answerID in actualAnswers[id]["optionsMap"]:
                totalAnswers += 1
                answerText = actualAnswers[id]["optionsMap"][answerID]
                if providedAnswers[id + "-" + answerID] == answerText:
                    correctAnswers += 1
            questionBlock["correctAnswer"] = actualAnswers[id]["optionsMap"]
            questionBlock["correctPoints"] = (correctAnswers / totalAnswers) * questionBlock["possiblePoints"]
            #now we need to fill in the student answers for review purposes
            questionBlock["studentAnswer"] = {}
            for i in range(1, 1000):
                try:
                    a = providedAnswers[id + "-" + str(i)]
                    questionBlock["studentAnswer"][str(i)] = a
                except KeyError:
                    break
        # endregion
        # region fb
        elif question["type"] == "fb":
            # so this one is weird because we can have either provided answer or no answers
            answers = actualAnswers[id]["answer"]
            if answers:
                questionBlock["studentAnswer"] = providedAnswers[id + "-1"]
                studentAnswer = questionBlock["studentAnswer"].lower()
                questionBlock["correctAnswer"] = answers
                answers = map(lambda x: x.lower(), answers)
                if studentAnswer in answers:
                    questionBlock["correctPoints"] = questionBlock["possiblePoints"]
            else:
                questionBlock["possiblePoints"] = 0  # to make totaling simple
                questionBlock["possibleManualPoints"] = question["weight"]
                questionBlock["studentAnswer"] = providedAnswers[id + "-1"]
                questionBlock["hasBeenGraded"] = False
            pass
        # endregion
        # endregion

        gradedResponse[id] = questionBlock
    # endregion

    return gradedResponse


def total(gradedQuestions):
    totalPoints = 0
    scoredPoints = 0
    ungradedPoints = 0
    ungradedQuestions = False
    for question in gradedQuestions:
        question = gradedQuestions[question]
        totalPoints += question["possiblePoints"]
        scoredPoints += question["correctPoints"] if question["correctPoints"] is not False else 0
        ungradedPoints += question["possibleManualPoints"]
        if not question["hasBeenGraded"]:
            ungradedQuestions = True

    if scoredPoints > 0:
        percent = scoredPoints / totalPoints * 100

    return {
        "totalPoints": totalPoints,
        "scoredPoints": scoredPoints,
        "ungradedPoints": ungradedPoints,
        "percent": 0 if scoredPoints == 0 else "{0:.2f}".format(scoredPoints / totalPoints * 100),
        "ungradedQuestions": ungradedQuestions
    }
