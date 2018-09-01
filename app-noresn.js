/*var url = "http://ck101.com/thread-2589903-[i]-1.html";
var maxpage = 43;
var page = 1;*/

var http = require("http");
var https = require("https");
var fs = require('fs');
var cheerio = require('cheerio');

var fileJSON = fs.readFileSync('./config.txt');
var config = JSON.parse(fileJSON);
var url = config.url;
var maxpage = config.maxpage;
var page = config.startpage;

var temp1 = '<div class="ui segment"><p>';
var temp2 = '</p></div>';

var html1 = '\
<html>\
<head>\
	<meta charset="utf-8" />\
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />\
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">\
	<title>';
var html2 = '</title>\
	<link rel="stylesheet" type="text/css" href="../data/semantic.min.css">\
	<link rel="stylesheet" type="text/css" href="../data/data.css">\
	<script src="../data/jquery-2.0.3.min.js"></script>\
	<script src="../data/semantic.min.js"></script>\
</head>\
<body>\
<div class="ui buttons" id="fontsize">\
	<a class="ui button" id="prev" href="';
var html3 = '.html">&lt</a>\
	<div class="ui button" id="inverted">I</div>\
	<div class="ui button" id="fontB">A+</div>\
	<div class="ui button" id="fontS">A-</div>\
	<a class="ui button" id="next" href="';
var html4 = '.html">&gt</a>\
</div>\
<script src="../data/data.js"></script>';

var html5 = '<div class="ui grid">\
	<div class="seven wide column">\
		<a class="ui button massive fluid left" href="';
var html6 = '.html">&lt</a>\
	</div>\
	<div class="two wide column"></div>\
	<div class="seven wide column">\
		<a class="ui button massive fluid right floated" href="';
var html7 = '.html">&gt</a>\
	</div>\
</div>';

var html_end = '\
</body>\
</html>';

var http_get = (url.match(/^https:\/\//))? https.get : http.get;

var title;
var out;
//var out = fs.createWriteStream(output_filename);

var get = function (page){
	var out = fs.createWriteStream(title + '/' + FormatNumberLength(page,3) + '.html');
	var html_endall = '';
	if(page == 1){
		if(page == maxpage){
			out.write(html1 + title + html2 + '#' + html3 + '#' + html4);
			html_endall = html5 + '#' + html6 + '#' + html7 +html_end;
		}else{
			out.write(html1 + title + html2 + '#' + html3 + FormatNumberLength(page+1,3) + html4);
			html_endall = html5 + '#' + html6 + FormatNumberLength(page+1,3) + html7 +html_end;
		}
	}else{
		if(page == maxpage){
			out.write(html1 + title + html2 + FormatNumberLength(page-1,3) + html3 + "#" + html4);
			html_endall = html5 + FormatNumberLength(page-1,3) + html6 + '#' + html7 +html_end;
		}else{
			out.write(html1 + title + html2 + FormatNumberLength(page-1,3) + html3 + FormatNumberLength(page+1,3) + html4);
			html_endall = html5 + FormatNumberLength(page-1,3) + html6 + FormatNumberLength(page+1,3) + html7 +html_end;
		}
	}
	var error = 0;
	var doit = function (){
		http_get(url.replace(/\[i\]/, page ), function(res) {
			console.log("page: " + page,"Got response: " + res.statusCode);
			if(res.statusCode == 200){
				var str = [];
				res.on('data', function (chunk) {
					str.push(chunk);
				});
				res.on('end', function () {
					//console.log(str);
					//var data = $('.postmessage', str);
					var $ = cheerio.load(Buffer.concat(str).toString(), { decodeEntities: false });
					var data = $('.t_f');
					for(var i=0; i<data.length; i++){
						//console.log($(data[i]).html());
						out.write(temp1 + '<div class="ui ribbon blue label">'+ sn++ +'</div>' + $(data[i]).html() + temp2 + '\n', 'utf8');
					}
					out.end(html_endall);
					page++;
					if(page <= maxpage){
						get(page);
					}
				});
			}else{
				//var t = setTimeout(doit,10);
				doit();
			}
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
			//var t = setTimeout(doit,10);
			doit();
		});
	};
	doit();
};
var get_title = function (){
	http_get(url.replace(/\[i\]/, 1 ), function(res) {
		console.log("Got response: " + res.statusCode);
		var str = [];
		res.on('data', function (chunk) {
			str.push(chunk);
		});
		res.on('end', function () {
			var $ = require('cheerio').load(Buffer.concat(str).toString());
			title = $('title').text().split(' - ')[0].trim();
			console.log('title:', title);
			if(maxpage < 0){
				var maxp = 1;
				if($('.pg')){
					var tmp = $('.pg > *');
					var count = tmp.length - 1;
					$(tmp).each(function(i,e){
						var p;
						if(p = $(e).text().match(/([0-9]+)/)){
							//console.log(parseInt(p[0]), parseInt(p[0]) > maxp);
							if(parseInt(p[0]) > maxp) maxp = parseInt(p[0]);
						}
						if(i == count){
							console.log("maxpage = "+maxp);
							maxpage = maxp;
							fs.mkdirSync(title);
							get(page);
						}
					});
				}else{
					maxpage = 1;
					fs.mkdirSync(title);
					get(page);
				}
			}else{
				/*out = fs.createWriteStream(title + '.html');
				out.write(html1 + title + html2);*/
				fs.mkdirSync(title);
				get(page);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
var sn = 1;
get_title();

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
