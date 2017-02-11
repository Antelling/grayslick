$(function() {
   //so we have the data loaded from our data/sampleData.js file
    var data = results;

    //that data is an array of students
    //every student has their name, their class/group, and their percentage grade
    //we need to sort the students according to their class
    var sorted = splitIntoClasses(data);

    //now loop over every class
    for(var group in sorted) {
        if(sorted.hasOwnProperty(group)){
            var table = makeTable(sorted[group]);
            insertIntoPage(group, table);
        }
    }
});

function splitIntoClasses(data) {
    //sort an array of student objects into a dictionary of classes holding an array of students

    var sorted = {};

    data.forEach(function(student) {
        if(sorted[student.class]) {
            sorted[student.class].push(student);
        } else {
            sorted[student.class] = [student]
        }
    });

    return sorted;
}

function makeTable(group) {
    //we recieve one class at a time

    var template = "<table><tr><th>Name</th><th>Grade</th></tr>FILLIN</table>";
    return template.replace("FILLIN", group.map(function(student){
        return "<tr><td><a href='studentResult.html'>" + student.name + "</a></td><td>" + student.grade + "</td></tr>";
    }).join(""));
}

function insertIntoPage(group, table) {
    $("#tableGroup").append("<h1>" + group + "</h1>" + table);
}
