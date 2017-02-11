Array.prototype.clean = function () {
    var newArray = [];
    this.forEach(function (item) {
        if (item) {
            newArray.push(item);
        }
    });
    return newArray;
};

$(function () {
    $("table").on("click", ".archive", function () {
        //move a table row to the archived table

        //grab the row
        var row = $(this).parent().parent();

        //get the data
        var easyData = row.text().split(/\n/g).map(function (item) {
            return item.trim()
        }).clean();

        //ugly hack since I don't feel like dealing with javascript
        var title = easyData[0].split("archiveeditresults").shift();
        var grade = easyData.pop().split("archiveeditresults").pop();

        $.get("/main/archive/" + title);

        //kill the row
        row.remove();

        //now insert the row into the archive table
        $("#archivedTests").append(""
            + "<tr>"
            + "<td>" + title + "</td>"
            + '<td><a class="unarchive">unarchive</a></td>'
            + '<td><a class="delete">delete</a></td>'
            + '<td><a href="/results/overview/' + title + '">results</a></td>'
            + "</tr>"
        );
    });

    $("table").on("click", ".unarchive", function () {
        //we need to move this row to the archive table

        //grab the row
        var row = $(this).parent().parent();

        //get the data
        var easyData = row.text().split(/\n/g).map(function (item) {
            return item.trim()
        }).clean();

        var title = easyData[0].split("unarchivedeleteresults").shift();

        $.get("/main/unarchive/" + title);

        //kill the row
        row.remove();

        //now insert the row into the current table
        $("#currentTests").append(""
            + "<tr>"
            + '<td>' + title + '</td>'
            + '<td><a class="archive">archive</a></td>'
            + '<td><a href="/main/edit/' + title + '">edit</a></td>'
            + '<td><a href="/results/overview/' + title + '">results</a></td>'
            + "</tr>"
        );
    });

    $("table").on("click", ".delete", function () {
        //delete the table row

        var row = $(this).parent().parent();

        //get the data
        var easyData = row.text().split(/\n/g).map(function (item) {
            return item.trim()
        }).clean();

        var title = easyData[0].split("unarchivedeleteresults").shift();

        $.get("/main/delete/" + title);

        row.remove();
    })
});