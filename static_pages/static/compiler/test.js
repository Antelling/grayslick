var testData = [
    {
        "name": "bold",
        "code": "*bold*",
        "out": "<p><b>bold</b></p><br/>"
    },
    {
        "name": "italic",
        "code": "_italic_",
        "out": "<p><i>italic</i></p><br/>"
    }, {
        "name": "link",
        "code": "[link](google.com)",
        "out": "<a href='http://google.com'>link</a><br/>"
    }, {
        "name": "escape",
        "code": "\\_ \\* \\\\ \\\" \\& ",
        "out": "<p>_ * \\ \" &</p><br/>"
    }, {
        "name": "paragraph formatting",
        "code": "hello\n\ngoodbye",
        "out": '<p>hello</p><div class="blockJoin"></div><p>goodbye</p><br/>'
    }, {
        "name": "media",
        "code": "media: https://gfycat.com/DiligentHardKingfisher",
        "out": "<iframe src='http://gfycat.com/ifr/DiligentHardKingfisher' frameborder='0' scrolling='no' width='500' height='300'style='-webkit-backface-visibility: hidden;-webkit-transform: scale(1);'/><br/>"
    }, {
        "name": "header",
        "code": "#big \n######small",
        "out": '<h1>big </h1><br/><h6>small</h6><br/>'
    }, {
        "name": "hrs",
        "code": "-\n---\n----\n--------",
        "out": '<p>-<br/><hr /><br/><hr /><br/><hr /></p><br/>'
    }, {
        "name": "blockquote",
        "code": ">ayy lamo",
        "out": '<blockquote>ayy lamo</blockquote><br/>'
    }, {
        "name": "blocks",
        "code": "===startblock===\n\nayy lamo\n\n===endblock===",
        "out": '<div class="random"><div class="blockJoin"></div><p>ayy lamo</p><div class="blockJoin"></div></div><br/>'
    }, {
        "name": "list",
        "code": "\nA. ayy lamo\nB. kek\nC. pip\nD. lel",
        "out": '<ol><li> ayy lamo</li><li> kek</li><li> pip</li><li> lel</li></ol><br/>'
    }, {
        "name": "tf",
        "code": "tf: is there a santa?\nt",
        "out": '<div id="1" class="question true-false"><input type="checkbox" name="1-1" id="1-1"> <span class="description"> is there a santa?</span></div><br/>'
        , "json": '{"1":{"answer":true,"weight":1,"type":"tf","id":1}}'
    }, {
        "name": "es",
        "code": "es: generic essay question",
        "out": '<div id="1" class="question essay"><p class="description"> generic essay question  </p><textarea id="1-1" name="1-1"></textarea></div><br/>'
        , "json": '{"1":{"weight":10,"type":"es"}}'
    }, {
        "name": "es with weight",
        "code": "es: write me an essay question\n5",
        "out": '<div id="1" class="question essay"><p class="description"> write me an essay question </p><textarea id="1-1" name="1-1"></textarea></div><br/>'
        , "json": '{"1":{"weight":5,"type":"es"}}'
    }, {
        "name": "es with multiple lines",
        "code": "es: write me an essay question\nthis is the second line\nthis is the third line\nfourth\nfifth",
        "out": '<div id="1" class="question essay"><p class="description"> write me an essay question this is the second line this is the third line fourth fifth</p><textarea id="1-1" name="1-1"></textarea></div><br/>'
        , "json": '{"1":{"weight":10,"type":"es"}}'
    }, {
        "name": "es with multiple lines and weight",
        "code": "es: write me an essay question\nsecond line\n2",
        "out": '<div id="1" class="question essay"><p class="description"> write me an essay question second line</p><textarea id="1-1" name="1-1"></textarea></div><br/>',
        "json": '{"1":{"weight":2,"type":"es"}}'
    }, {
        "name": "fb with no answer",
        "code": "fb: give me a color",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color</p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":2,"answer":false,"type":"fb"}}'
    },{
        "name": "fb with answer",
        "code": "fb: give me a color\nanswer",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color </p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":2,"answer":["answer"],"type":"fb"}}'
    }, {
        "name": "fb with multiple lines",
        "code": "fb: give me a color\nplease\nanswer",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color please</p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":2,"answer":["answer"],"type":"fb"}}'
    }, {
        "name": "fb with no answer and weight",
        "code": "fb: give me a color\n7",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color </p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":7,"answer":false,"type":"fb"}}'
    }, {
        "name": "fb with multiple lines, answer, and weight",
        "code": "fb: give me a color\nplease\ndo it\nanswer\n7",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color please do it</p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":7,"answer":["answer"],"type":"fb"}}'
    },{
        "name": "fb with multiple answers",
        "code": "fb: give me a color\nanswer1, answer2",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color </p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":2,"answer":["answer1","answer2"],"type":"fb"}}'
    },{
        "name": "fb with multiple lines and answers",
        "code": "fb: give me a color\nline 2\nanswer1, answer2",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color line 2</p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":2,"answer":["answer1","answer2"],"type":"fb"}}'
    },{
        "name": "fb with multiple answers and weight",
        "code": "fb: give me a color\nanswer1, answer2\n7",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color </p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":7,"answer":["answer1","answer2"],"type":"fb"}}'
    },{
        "name": "fb with multiple lines, answers, and weight",
        "code": "fb: give me a color\nplease\nanswer1, answer2\n7",
        "out": '<div id="1" class="question fill-in-the-blank"><p class="description"> give me a color please</p><input type="text" id="1-1" name="1-1"></div><br/>',
        "json": '{"1":{"weight":7,"answer":["answer1","answer2"],"type":"fb"}}'
    }, {
        "name": "sr",
        "code": "sr: generic short response question",
        "out": '<div id="1" class="question short-response"><p class="description"> generic short response question </p><textarea id="1-1" name="1-1"></textarea></div><br/>'
        , "json": '{"1":{"weight":5,"type":"sr"}}'
    }, {
        "name": "sr with weight",
        "code": "sr: write me an sr question\n7",
        "out": '<div id="1" class="question short-response"><p class="description"> write me an sr question </p><textarea id="1-1" name="1-1"></textarea></div><br/>'
        , "json": '{"1":{"weight":7,"type":"sr"}}'
    }, {
        "name": "sr with multiple lines",
        "code": "sr: write me an sr question\nthis is the second line\nthis is the third line\nfourth\nfifth",
        "out": '<div id="1" class="question short-response"><p class="description"> write me an sr question this is the second line this is the third line fourth fifth</p><textarea id="1-1" name="1-1"></textarea></div><br/>'
        , "json": '{"1":{"weight":5,"type":"sr"}}'
    }, {
        "name": "sr with multiple lines and weight",
        "code": "sr: write me an sr question\nsecond line\n2",
        "out": '<div id="1" class="question short-response"><p class="description"> write me an sr question second line</p><textarea id="1-1" name="1-1"></textarea></div><br/>',
        "json": '{"1":{"weight":2,"type":"sr"}}'
    }
];

testData.map(function (test) {
    var results = compile(test.code, false);
    test.actual = results[0];
    test.answers = JSON.stringify(results[1]);
    test.json = test.json ? test.json : "{}";
});

var template = "<div class='PASS'><h1>NAME</h1><p>CODE</p><p>OUT</p><p>ACTUAL</p><p>JSON</p><p>ANSWERS</p></div>";

var code = "";

testData.forEach(function (test) {
    var pass = test.out.replace(/  /g, " ") == test.actual.replace(/  /g, " ") &&
    test.json.replace(/  /g, " ") == test.answers.replace(/  /g, " ") ? "green" : "red";

    code += template
        .replace("PASS", pass)
        .replace("NAME", test.name)
        .replace("CODE", test.code)
        .replace("OUT", escape(test.out))
        .replace("ACTUAL", escape(test.actual))
        .replace("JSON", test.json)
        .replace("ANSWERS", test.answers);
});
$(function () {
    $("#code").html(code);
});

function escape(code) {
    return code.replace(/</g, "&lt;")
}