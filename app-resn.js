/*var url = "http://ck101.com/thread-2589903-[i]-1.html";
var maxpage = 43;
var page = 1;*/

var http = require("http");
var https = require("https");
var fs = require('fs');
var $ = require('cheerio');

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
	<a class="ui button" id="prev" href="'
var html3 = '.html">&lt</a>\
	<div class="ui button" id="fontB">A+</div>\
	<div class="ui button" id="fontS">A-</div>\
	<a class="ui button" id="next" href="'
var html4 = '.html">&gt</a>\
</div>\
<script src="../data/data.js"></script>\
';

var html_end = '\
</body>\
</html>';

var http_get = (url.match(/^https:\/\//))? https.get : http.get;

var title;
var all = 0;
var maxcon = 3;
//var out = fs.createWriteStream(output_filename);

var get = function (page){
	var out = fs.createWriteStream(title + '/' + FormatNumberLength(page,3) + '.html');
	if(page == 1){
		out.write(html1 + title + html2 + '#' + html3 + FormatNumberLength(page+1,3) + html4);
	}else{
		if(page == maxpage){
			out.write(html1 + title + html2 + FormatNumberLength(page-1,3) + html3 + "#" + html4);
		}else{
			out.write(html1 + title + html2 + FormatNumberLength(page-1,3) + html3 + FormatNumberLength(page+1,3) + html4);
		}
	}
	http_get(url.replace(/\[i\]/, page ), function(res) {
		console.log("Got response: " + res.statusCode);
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
				out.write(temp1 + '<div class="ui ribbon blue label">'+ (i+1) +'</div>' + $(data[i]).html() + temp2 + '\n', 'utf8');
			}
			out.end(html_end);
			all--;
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
var get_title = function (){
	http_get(url.replace(/\[i\]/, 1 ), function(res) {
		console.log("Got response: " + res.statusCode);
		var str = [];
		res.on('data', function (chunk) {
			str.push(chunk);
		});
		res.on('end', function () {
			title = $('title', Buffer.concat(str).toString()).text().split(' - ')[0].trim();
			console.log('title:', title);
			fs.mkdirSync(title);
			j = page;
			go();
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
var j;
var go = function (){
	if(j <= maxpage){
		if(all < maxcon){
			all++;
			get(j);
			j++;
		}
		var t = setTimeout(go,0);
	}
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

