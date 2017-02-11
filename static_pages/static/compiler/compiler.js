//coding utf-8

"use strict";   //fail hard

var urlPrefix = 'http://'; //change this to whatever you want

//utility functions
String.prototype.replaceAll = function (split, newSplit) {
    return this.split(split).join(newSplit);
};
String.prototype.replaceLast = function (split, newSplit) {
    var self = this;
    self = self.split(split);
    var last = self.pop();
    return self.join(split) + newSplit + last;
};
String.prototype.startsWith = function (string) {
    return this.slice(0, string.split('').length) === string;
};
String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};
String.prototype.endsWith = function (string) {
    var self = this;
    return self.reverse().startsWith(string.reverse());
};
String.prototype.occ = function (item, overlapping) {
    return occurrences(this.toString(), item, overlapping);
    function occurrences(string, subString, allowOverlapping) {

        string += "";
        subString += "";
        if (subString.length <= 0) return string.length + 1;

        var n = 0, pos = 0;
        var step = (allowOverlapping) ? (1) : (subString.length);

        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                n++;
                pos += step;
            } else break;
        }
        return (n);
    }
};
String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};
String.prototype.mult = function (n) {
    return stringFill(this, n);
    function stringFill(x, n) {
        var s = '';
        for (; ;) {
            if (n & 1) s += x;
            n >>= 1;
            if (n) x += x;
            else break;
        }
        return s;
    }
};
Array.prototype.split = function (split) {
    var newList = [];
    this.forEach(function (item) {
        item.split(split).forEach(function (item) {
            newList.push(item)
        })
    });
    return newList;
};
Array.prototype.clean = function () {
    var newArray = [];
    this.forEach(function (item) {
        if (item || item === 0) {
            newArray.push(item);
        }
    });
    return newArray;
};
Array.prototype.contains = function (item) {
    var contains = false;
    this.forEach(function (el) {
        if (el === item) {
            contains = true;
        }
    });
    return contains;
};


function compile(code, verbose) {
    "use strict";

    if (code == undefined || !code.trim()) return "";

    var answersMap = {};
    var questionIndex = 0; //reset those variables

    //very first thing to do, remove comments
    //split at lines
    code = code.trim().replaceAll('\r\n', 'NEWLINERESERVEDWORD').replaceAll('\n', 'NEWLINERESERVEDWORD')
        .replaceAll('\r', 'NEWLINERESERVEDWORD').split('NEWLINERESERVEDWORD');


    //remove comments
    code = code.map(function (line) {
        if (line.startsWith('//')) {
            return '';
        }
        return line.split(' //').shift();
    });
    code = code.join('NEWLINERESERVEDWORD');

    code = escape(code); //now we have \ as an escape character. cool.

    //add image and video support
    code = addMedia(code);

    //add link support
    code = addLinks(code);

    //deal with wrapppers
    code = assert('&', '&', '&amp;;', '&amp;', code); //stupid html
    code = assert('*', '*', '<b>', '</b>', code); //bold
    code = assert('_', '_', '<i>', '</i>', code); //italic
    code = assert('`', '`', '<code>', '</code>', code); //code
    code = assert('~~', '~~', '<strike>', '</strike>', code); //strike through
    code = assert('"', '"', '&ldquo;', '&rdquo;', code); //typographic correct quotes
    code = assert('...', '...', '&hellip;', '&hellip;', code); //typographic correct ellipses
    code = assert('(c)', '(c)', '&copy;', '&copy;', code); //should anyone be so audacious

    //now lets split it open again
    code = code.split('NEWLINERESERVEDWORD');

    //make headers
    code = code.map(function (line) {
        //I'm sure there is a more elegant way to do this, but this works
        if (line.startsWith('######')) {
            return '<h6>' + line.slice(6) + '</h6>';
        }
        if (line.startsWith('#####')) {
            return '<h5>' + line.slice(5) + '</h5>';
        }
        if (line.startsWith('####')) {
            return '<h4>' + line.slice(4) + '</h4>';
        }
        if (line.startsWith('###')) {
            return '<h3>' + line.slice(3) + '</h3>';
        }
        if (line.startsWith('##')) {
            return '<h2>' + line.slice(2) + '</h2>';
        }
        if (line.startsWith('#')) {
            return '<h1>' + line.slice(1) + '</h1>';
        }
        return line;
    });

    //make hr's
    code = code.map(function (line) {
        if (/^[-]{3,}$/.test(line.replaceAll('–', '--'))) {
            return '<hr />';
        }
        return line;
    });

    code = code.join('NEWLINERESERVEDWORD');
    code = assert('--', '--', '&mdash;', '&mdash;', code); //typographic correct m dashes
    code = code.split('NEWLINERESERVEDWORD');

    //let's turn two consecutive new lines into a <br/>, then split at double new lines
    code = formatNewLines(code.join('NEWLINERESERVEDWORD'));

    //okay, so now we have a list of blocks. Let's just map that to a block function, then return it, ya?
    code = code.map(formatBlock).join('<div class="blockJoin"></div>');

    //formatURL protected our urls from further formatting. Let's turn them back into Url's.
    code = readyUrl(code);

    //now unescape the code
    code = unescape(code);

    function formatBlock(block) {

        /*okay, so there are several different things this block could be. It could be:
         * A heading
         * A hr
         * A media: image, iframe, audio, video, object
         * some custom html they made

         So what I'm going to do is see if they have anything not in a tag, and if they don't, assume I shouldn't mess with
         it because it's html.
         */
        if (isPureHTML(block)) {
            //don't touch it, it's good
            return block;
        } else {
            try {

                block = block.trim(); //in case they indented or something
                /*okay. So we still need to do something. It could be:
                 * a blockquote
                 * a list
                 * a question
                 * a table
                 * a paragraph
                 */

                //they might start with <br/>
                var breaks = '';
                while (block.startsWith('<br/>')) {
                    breaks += '<br/>';
                    block = block.replace('<br/>', '');
                }
                var endBreaks = '';
                while (block.endsWith('<br/>')) {
                    endBreaks += '<br/>';
                    block = block.replaceLast('<br/>', '');
                }

                //check if blockquote
                if (block.startsWith('>')) {
                    return breaks + '<blockquote>' + block.slice(1) + '</blockquote>' + endBreaks;
                }

                //check if ===startblock===
                if (/===*?startblock===*?/i.test(block)) {
                    return breaks + '<div class="random">' + endBreaks;
                }

                //check if endblock
                if (/===*?endblock===*?/i.test(block)) {
                    return breaks + '</div>' + endBreaks;
                }

                //check if list.
                var trimmed = block.trim();
                if (trimmed.startsWith('1. ')
                    || trimmed.startsWith('- ')
                    || trimmed.startsWith('* ')
                    || trimmed.startsWith('A. ')
                    || trimmed.startsWith('a. ')) {
                    return breaks + formatList(block) + endBreaks;
                }

                //check if question
                var start = block.slice(0, block.indexOf(':'));
                switch (start) {
                    case 'tf':
                    case 'true or false':
                    case 'true/false':
                    case 'mc':
                    case 'multiple choice':
                    case 'mult choice':
                    case 'fb':
                    case 'fill in the blank':
                    case 'sr':
                    case 'short response':
                    case 'es':
                    case 'essay':
                    case 'ma':
                    case 'matching':
                        return breaks + formatQuestion(block) + endBreaks;
                    default:
                        break;
                }

                //check if table
                var checker = /^\|[–-]+\|.+/; //checks if starts with |, followed by at least one -, followed by a |
                if (checker.test(block)) {
                    return breaks + formatTable(block) + endBreaks;
                }

                //I guess it's a paragraph.
                return breaks + '<p>' + block + '</p>' + endBreaks;
            } catch (e) {
                console.log(e);
                if (verbose) {
                    alert("There was a problem compiling this code block: \n" + block.replace("<br/>", "\n" + "\nthe error"
                            + " is " + e))
                }
            }

        }
    }

    function assert(start, end, newStart, newEnd, code) {
        var newcode = '';
        //okay, so we want to replace start with newStart end end with newEnd

        //first, let's respect our escape character
        code = code.replaceAll('\\' + start, 'ESCAPEDSTARTRESERVE').replaceAll('\\' + end, 'ESCAPEDENDRESERVE');

        //cool, cool. Now, let's assume they formatted correctly and split at start or end.
        code = code.split(start).split(end);

        //okay, now loop through altenating newStart and newEn as our join. Also, the first one doesn't count;
        newcode += code.shift();
        var useStart = true;
        code.forEach(function (item) {
            newcode += (useStart ? newStart : newEnd) + item;
            useStart = !useStart;
        });

        return newcode.replaceAll('ESCAPEDSTARTRESERVE', start).replaceAll('ESCAPEDENDRESERVE', end);
    }   //done

    function addMedia(code) {


        var urlMap = {
            "vimeo.com": {
                'embedCode': "<iframe src='https://player.vimeo.com/video/URL' width='500' height='300' frameborder='0'" +
                'webkitallowfullscreen mozallowfullscreen allowfullscreen/>',
                'idExtract': '/'
            },
            "youtube.com": {
                'embedCode': "<iframe width='500' height='300' src='https://www.youtube.com/embed/URL' frameborder='0'" +
                " allowfullscreen/>",
                'idExtract': 'watch?v='
            },
            "gfycat.com": {
                'embedCode': "<iframe src='http:/\/gfycat.com/ifr/URL' frameborder='0' scrolling='no' width='500' height='300'" +
                "style='-webkit-backface-visibility: hidden;-webkit-transform: scale(1);'/>",
                'idExtract': '/'
            }
        };
        var fileTypeMap = {
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image',
            'bmp': 'image',
            'svg': 'image',
            'ico': 'image',
            'tif': 'image',

            'avi': 'video',
            'webm': 'video',
            'mp4': 'video',
            'mkv': 'video',
            'mov': 'video',
            'vob': 'video',
            'rec': 'video',
            'gifv': 'video',
            'ogv': 'video',
            'm4v': 'video',
            "moov": 'video',

            '3ga': 'audio',
            'mp3': 'audio',
            'flac': 'audio',
            'trm': 'audio',
            'aa': 'audio',
            'wav': 'audio',
            'caf': 'audio',
            'vox': 'audio',
            'ogg': 'audio',
            'm4p': 'audio',
            'midi': 'audio',
            'wma': 'audio',

            'pdf': 'pdf'
        };
        var embedCodeMap = {
            "image": "<image src='URL'/>",
            "video": "<video width='500' height='300' controls><source src='URL' type='video/EXT'/></video>",
            "audio": "<audio controls><source src='URL'></audio>",
            "pdf": "<iframe src='URL' width='500' height='300'/>"
        };

        var newCode = '';
        code = code.split(/media: ?http/g);
        newCode += code.shift();

        code.forEach(function (block) {
            var url = block.split(' ')[0];
            block = block.replace(url, '');

            newCode += formatURL('http' + url) + block;
        });


        function formatURL(url) {
            var newlines = 'NEWLINERESERVEDWORD'.mult(url.occ('NEWLINERESERVEDWORD')); //we need this later


            //okay, so first let's see if it is one of our special cases.
            url = url.replaceAll('http://', '').replaceAll('https://', '').replaceAll('NEWLINERESERVEDWORD', ' ').split(' ')[0];
            var base = url.replaceAll('www.', '').split('/')[0];
            if (urlMap[base]) {
                var id = url.split(urlMap[base].idExtract).pop();
                return urlMap[base].embedCode.replaceAll('URL', id) + newlines;
            } else {
                try {
                    var ext = url.split('.').pop();
                    var mediaType = fileTypeMap[ext];
                    url = formatUrl(url);
                    return embedCodeMap[mediaType]
                            .replaceAll('URL', url)
                            .replaceAll('EXT', ext)
                            .replaceAll('type="audio/mp3"', 'type="audio/mpeg"')//because why do we need consistency, we're w3
                        + newlines;
                } catch (e) {
                    return '<iframe width=500 height=300 src=' + url + '></iframe>' + newlines;
                }
            }
        }

        return newCode + 'NEWLINERESERVEDWORD';
    }

    function addLinks(code) {
        //[link](google.com)
        var checker = /\[.+?\]\(.+?\)/g;
        while (true) {
            var link = checker.exec(code);

            if (!link) {
                break;
            }

            code = code.slice(0, link.index)
                + htmlify(code.slice(link.index, link.index + link[0].length)) +
                code.slice(link[0].length + link.index);
        }
        return code;
    }

    function htmlify(link) {
        //[text](url)
        var text = link.slice(1, link.indexOf(']'));
        var url = link.slice(link.indexOf('(') + 1, link.length - 1);
        return "<a href='" + formatUrl(url) + "'>" + text + '</a>';
    }

    function formatNewLines(code) {
        var tester = /\|\|(?!\|)/g; //okay, so JavaScript has no lookbehind. So we do this evil reverse thing with pipes
        code = code.replaceAll('|', 'PIPERESERVEDWORD').replaceAll('NEWLINERESERVEDWORD', '|'); //so i don't have to type backwards
        code = code.reverse().split(tester).map(function (chunk) {
            return chunk.reverse()
        }).reverse();
        code = code.map(function (chunk) {
            return chunk.replaceAll('|', '<br/>').replaceAll('PIPERESERVEDWORD', '|');
        });
        return code;
    }

    function isPureHTML(block) {
        //so, a tag is <*> or <*/>
        var open = /<\s*[^/]+?\s*>/g;
        var close = /<\s*\/.+?\s*>/g;
        var useless = /<\s*.+?\/\s*>/gi;

        //but, inline tags don't count.
        ['span', 'strike', 'code', 'b', 'i', 'a'].forEach(function (tag) {
            block = block
                .replaceAll('<' + tag + '>')
                .replaceAll('</' + tag + '>')
                .replaceAll('<' + tag + '/>')
        });

        block = block
            .replace(useless, '')
            .replace(open, 'OPENRESERVE')
            .replace(close, 'CLOSERESERVE');
        block = block.replace(/</g, '&gt;').replace(/>/g, '&lt;')
            .replace(/OPENRESERVE/g, '<').replace(/CLOSERESERVE/g, '>');

        var depth = 0;
        var isPure = true;
        block.split('').forEach(function (letter) {
            if (letter === '<') {
                depth++;
            } else if (letter === '>') {
                depth--;
            } else {
                if (letter.trim() && depth < 1) {
                    isPure = false;
                }
            }
        });
        return isPure;
    }

    function formatList(l) {
        //okay, so this is pretty simple. We just keep a stack of what element we are currently in.
        l = l.split('<br/>');
        var newCode = '';
        var tab = -1;
        var stack = [];

        l.forEach(function (line) {
            var currTab = line.replace(/\t/g, 'TABRESERVED').occ('TABRESERVED');
            var diff = currTab - tab;

            var trimmed = line.trim();
            var type = false;  //defaults to not a ul or ol
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                type = 'ul';
            } else if (/^((\d+)|(\w))\. /g.test(trimmed)) { //start, digits or one letter, period, space
                type = 'ol';
            }

            if (!type) {
                newCode += line; //just append it to the previous line
                return
            }

            line = trimmed.slice(trimmed.indexOf(' ')); //cut out the - or 1.

            if (diff == 0) {  //no change, just make a new list item
                newCode += '</li><li>' + line;

            } else if (diff > 0) { //we tabbed in
                stack.push(type);
                newCode += '<' + type + '><li>' + line;

            } else { //we tabbed out
                newCode += '</li>'; //close the current open line

                //for every difference, close a list
                diff = diff * -1;
                while (diff > 0) {
                    newCode += '</' + stack.pop() + '>';
                    diff--;
                }
                newCode += '<li>' + line;
            }

            tab = currTab;
        });

        newCode += '</li>'; //close that off;
        //empty the remaining stack.
        while (stack.length) {
            newCode += '</' + stack.pop() + '>';
        }

        return newCode;
    }

    function formatQuestion(q) {
        questionIndex++;
        //map it to it's function
        switch (q.slice(0, q.indexOf(':')).toLowerCase()) {
            case 'tf':
            case 'true or false':
            case 'true/false':

                return wrapper(tf(parseQuestion(q)));
                break;
            case 'mc':
            case 'multiple choice':
            case 'mult choice':
                return wrapper(mc(parseQuestion(q)));
                break;
            case 'fb':
            case 'fill in the black':
                return wrapper(fb(parseQuestion(q)));
                break;
            case 'sr':
            case 'short response':
                return wrapper(sr(parseQuestion(q)));
                break;
            case 'es':
            case 'essay':
                return wrapper(es(parseQuestion(q)));
                break;
            case 'ma':
            case 'matching':
                return wrapper(ma(parseQuestion(q)));
                break;
            default:
                return q;
                break;
        }
    }

    function wrapper(result, q) {
        if (typeof result === 'string') {
            return result;
        } else {
            if (verbose) alert("the following code is not formatted correctly: \n" + result.replaceAll("<br/>", "\n"));
            return q;
        }
    }

    function tf(q) {
        var description = q[0];
        var answer = q[2];
        var weight = q.pop() || 1;

        if (answer == undefined) {
            answer = q[1][0];
        }

        if(answer == undefined) {
            //if its still undefined, they did something wrong
            throw "missing answer"
        }

        //fill in answers json
        if (answer === "t" || answer === 20 || answer === "1" || answer === 1) answer = true;
        if (answer === "f" || answer === 6 || !answer) answer = false; //this is so t and f are valid answers.

        answersMap[questionIndex] = {
            'answer': answer,
            'weight': weight,
            'type': "tf",
            "id": questionIndex
        };

        //return formatted html

        var wrapper = '<div id="QUEST-ID" class="question true-false">FILLIN</div>';
        var input = '<input type="checkbox" name="ID" id="ID"> <span class="description">DESC</span>';
        return wrapper
            .replace("QUEST-ID", questionIndex)
            .replace('FILLIN', input)
            .replaceAll('ID', questionIndex + '-1')
            .replaceAll('DESC', description);
    }

    function mc(q) {
        //FIXME: make answers mandatory
        var description = q[0];
        var options = q[1];
        var answer = q[2];
        var weight = q[3] || 1;

        if (answer) {
            //alert(answer);
            //so if we don't have an answer, nothing is put into the json
            answer = answer.toString().split(',').map(function (answer) {
                answer = answer.trim();
                var index = "abcdefghijklmnopqrstuvwxyz".indexOf(answer.trim().toLowerCase());
                return index !== -1 ? index : answer;
            });
            answersMap[questionIndex] = {"answers": answer, "type": "mc", "weight": weight};
        }

        var keepTrack = 0;
        options = options.map(function (option) {
            keepTrack++;
            return '<input id="QUESTION-TRACK" name="QUESTION-TRACK" type="checkbox"> OPTION <br/>'
                .replaceAll('QUESTION', questionIndex)
                .replaceAll('TRACK', keepTrack)
                .replace('OPTION', option)
        }).join('');

        return '<div id="QUEST-ID" class="question multiple-choice"><p class="description">DESC</p>OPTIONS</div>'
            .replace("QUEST-ID", questionIndex)
            .replace('DESC', description)
            .replace('OPTIONS', options);

    }

    function fb(q) {
        //several word response
        console.log(q);

        var description = q[0];
        var answers = q[1] == false ? false : q[1].split('\n').map(function (item) {
            return item.trim()
        });
        var weight = q[2];
        if(answers !== false) {
            var actualAnswer = answers.pop().split(",").map(function(item){return item.trim()});
            description += " " + answers.join(" ");
            answers = actualAnswer;
        }

        //if the answer is a single ["int"] and weight is undefined, then it should actually be weight
        //if they want to have a numerical answer, they should specify the weight
        if(answers.length === 1 && !isNaN(parseInt(answers[0])) && typeof weight === "undefined") {
            weight = parseInt(answers.pop());
            answers = false;
        } else {
            weight = weight || 2;
        }



        answersMap[questionIndex] = {
            'weight': weight,
            'answer': answers,
            "type": "fb"
        };

        return '<div id="QUEST-ID" class="question fill-in-the-blank"><p class="description">DESC</p><input type="text" id="ID" name="ID"></div>'
            .replace('DESC', description)
            .replace("QUEST-ID", questionIndex)
            .replaceAll('ID', questionIndex + '-1');
    }

    function sr(q) {
        //one paragraph response

        if(typeof q[2] !== "undefined") {
            q[1].push(q[2]+"");
        }

        var description = q[0];
        var otherLines = q[1] || [""];
        var weight = otherLines.pop().trim();
        description += (" " + otherLines.join(" "));
        if(isNaN(parseInt(weight))){
            description += " " + weight;
            weight = 5;
        } else {
            weight = Number(weight);
        }
        weight = weight || 5;

        answersMap[questionIndex] = {
            'weight': weight,
            "type": "sr"
        };

        return '<div id="QUEST-ID" class="question short-response"><p class="description">DESC</p><textarea id="ID" name="ID"></textarea></div>'
            .replace("QUEST-ID", questionIndex)
            .replace('DESC', description)
            .replaceAll('ID', questionIndex + '-1')
    }

    function es(q) {
        //numerous paragraph response

        if(typeof q[2] !== "undefined") {
            q[1].push(q[2]+"");
        }

        var description = q[0];
        var otherLines = q[1] || [""];
        var weight = otherLines.pop().trim();
        description += (" " + otherLines.join(" "));
        if(isNaN(parseInt(weight))){
            description += " " + weight;
            weight = 10;
        } else {
            weight = Number(weight);
        }
        weight = weight || 10;

        answersMap[questionIndex] = {
            'weight': weight,
            "type": "es"
        };


        return '<div id="QUEST-ID" class="question essay"><p class="description">DESC</p><textarea id="ID" name="ID"></textarea></div>'
            .replace('DESC', description)
            .replace("QUEST-ID", questionIndex)
            .replaceAll('ID', questionIndex + '-1');
    }

    function ma(q) {
        var description = q[0];
        var options = q[1]; //array
        var weight = q[2];

        //we're going to make output and answer json at the same time for this one
        var optionsMap = {}; //maps a description to an answer
        var altWeight = 0; //for keeping track of weight if they don't specify
        var answers = '';  //for the left side
        var questions = ''; //for the right side
        var answerIndex = 0;
        options.forEach(function (option) {
            option = option.split('|');
            if (option[1] && option[1].trim()) { //it has both an answer and question

                altWeight++; //update our alternate weight for answer json
                answerIndex++; //update the possible answer we are in


                optionsMap[answerIndex] = option[0];

                var left = '<p>' + option[0] + '</p>';
                var right = '<p><input type="text" name="ID" id="ID" class="fillin"/> <span class="description">DESC</span></p>'
                    .replaceAll('ID', questionIndex + '-' + answerIndex)
                    .replaceAll('DESC', option[1]);

                answers += left;
                questions += right;

            } else {
                if(option[0].trim()) {
                    //they are adding an option without a corresponding blank
                    answers += '<p>' + option[0] + '</p>';
                } else {
                    //okay they did something wrong
                    throw "malformed option"
                }

            }
        });

        //now we update out json
        answersMap[questionIndex] = {
            'weight': weight || altWeight,
            'optionsMap': optionsMap,
            'type': 'ma'
        };

        //and now return the question
        return '<div id="QUEST-ID" class="question matching"><p class="description">DESC</p><div class="matching-question-container"><div class="left random">LEFT</div><div class="right random">RIGHT</div></div></div>'
            .replace("QUEST-ID", questionIndex)
            .replaceAll('DESC', description)
            .replaceAll('LEFT', answers)
            .replaceAll('RIGHT', questions)
    }

    function parseQuestion(q) {

        var parsed = {
            "desc": "",
            "options": [],
            "weight": undefined,
            "answer": undefined
        };

        //we need to remove the type, it will be anything before :
        q = q.split(":");
        q.shift();
        q = q.join("");

        //now we need the description, it will be the first line
        q = q.split("<br/>");
        parsed.desc = q.shift();

        //so now we have an array of options, with answers and weights at the end. But everything is optional.
        //first, let's add to options until q is two items long
        //and if its a tf, the option[0] is the answer
        while (q.length > 2) {
            parsed.options.push(q.shift());
        }

        var possibleAnswer = q[0];
        var possibleWeight = q[1];

        //enforce number will turn a into 1, b into 2, etc. strings numbers are turned to ints. Everything else becomes null.
        var numericAnswer = enforceNumber(possibleAnswer);
        var numericWeight = enforceNumber(possibleWeight);

        if (numericAnswer && numericWeight) {
            parsed.answer = numericAnswer;
            parsed.weight = numericWeight;
        } else if (numericWeight) {
            parsed.answer = numericWeight;
            parsed.options.push(possibleAnswer);
        } else {
            parsed.options.push(possibleAnswer);
            parsed.options.push(possibleWeight);
        }
        parsed.options = parsed.options.clean(); //removes undefined and other falsy, keeps 0 though
        parsed.options = parsed.options.length > 0 ? parsed.options : false;

        return [parsed.desc, parsed.options, parsed.answer, parsed.weight];
    }

    function formatTable(t) {
        t = t.split('<br/>').clean();

        //okay, so the first thing we should do is remove the |--------| from the front and maybe back.
        t.shift();
        var last = t.pop();
        if (!/\|[–-]+\|/.test(last)) {
            t.push(last);
        }

        //fantastic. Now it's a simple map.
        return '<table>' + t.map(function (row) {
                return '<tr><td>' + row.replaceAll('|', '</td><td>') + '</td></tr>'
            }).join('') + '</table>';
    }

    function formatUrl(url) {
        return 'RESERVEURLSTART' +
            urlPrefix
            + url
                .replace('http://', '')
                .replace('https://', '')
                .replace('://')
                .replaceAll('_', 'RESERVEUND')
                .replaceAll('*', 'RESERVEAST')
                .replaceAll('~~', 'RESERVESLASHSLASH')
                .replaceAll('`', 'RESERVEBACKTICK')
                .replaceAll('"', 'RESERVEQUOTE')
                .replaceAll('...', 'RESERVEDOTDOTDOT')
                .replaceAll('--', 'RESERVEDASHDASH') +
            'RESERVEURLEND';
    }

    function readyUrl(code) {
        return code
            .replaceAll('RESERVEUND', '_')
            .replaceAll('RESERVEAST', '*')
            .replaceAll('RESERVESLASHSLASH', '~~')
            .replaceAll('RESERVEBACKTICK', '`')
            .replaceAll('RESERVEQUOTE', '"')
            .replaceAll('RESERVEDOTDOTDOT', '...')
            .replaceAll('RESERVEDASHDASH', '--')
            .replaceAll('RESERVEURLEND', '')
            .replaceAll('RESERVEURLSTART', '');
    }

    function escape(code) {
        //so we want to replace every \. with ESCAPED:charactercode|
        var escapedCode = '';
        code = code.split(/\\/g);
        escapedCode += code.shift();
        escapedCode += code.map(function (chunk) {
            if (chunk == "") chunk = "\\";
            return 'ESCAPEDCODE:' + chunk.slice(0, 1).charCodeAt(0) + '|' + chunk.slice(1);
        }).join('');
        return escapedCode;
    }

    function unescape(code) {
        //now we do the opposite
        var unescapedCode = '';
        code = code.split('ESCAPEDCODE:');
        unescapedCode += code.shift();
        unescapedCode += code.map(function (chunk) {
            return String.fromCharCode(Number(chunk.slice(0, chunk.indexOf('|')))) + chunk.slice(chunk.indexOf('|') + 1);
        }).join('');
        return unescapedCode;
    }

    function enforceNumber(stringToCheck) {
        //if it is a csv on numbers, return it unmodified
        //if it is a number, return coerced to type int
        //if it is a letter, return its alphabet index
        if (/^\d+$/.test(stringToCheck)) {
            //int
            return parseInt(stringToCheck);
        } else if (/^( |,|[1-9])+$/gi.test(stringToCheck)) {
            //csv
            return stringToCheck;
        }  else if (/^[a-z]$/gi.test(stringToCheck)) {
            //letter
            return "abcdefghijklmnopqrstuvwxyz".indexOf(stringToCheck) + 1;
        } else {
            //malformed
            return false;
        }
    }


    return [code.replaceAll('NEWLINERESERVEDWORD', ' '), answersMap];
}
