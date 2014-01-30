/*var url = "http://ck101.com/thread-2589903-[i]-1.html";
var maxpage = 43;
var page = 1;*/

var http = require("http");
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
	<link rel="stylesheet" type="text/css" href="data/semantic.min.css">\
	<link rel="stylesheet" type="text/css" href="data/data.css">\
	<script src="data/jquery-2.0.3.min.js"></script>\
	<script src="data/semantic.min.js"></script>\
</head>\
<body>\
<div class="ui buttons" id="fontsize">\
  <div class="ui button" id="fontB">A+</div>\
  <div class="ui button" id="fontS">A-</div>\
</div>\
<script src="data/data.js"></script>\
';

var html_end = '\
</body>\
</html>';

var title;
var out;
//var out = fs.createWriteStream(output_filename);

var get = function (page){
	http.get(url.replace(/\[i\]/, page ), function(res) {
		console.log("Got response: " + res.statusCode);
		var str = [];
		res.on('data', function (chunk) {
			str.push(chunk);
		});
		res.on('end', function () {
			//console.log(str);
			//var data = $('.postmessage', str);
			var data = $('.t_f', Buffer.concat(str).toString());
			for(var i=0; i<data.length; i++){
				//console.log($(data[i]).html());
				out.write(temp1 + '<div class="ui ribbon blue label">'+ sn++ +'</div>' + $(data[i]).html() + temp2 + '\n', 'utf8');
			}
			page++;
			if(page <= maxpage){
				get(page);
			}else{
				out.end(html_end);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
var get_title = function (){
	http.get(url.replace(/\[i\]/, 1 ), function(res) {
		console.log("Got response: " + res.statusCode);
		var str = [];
		res.on('data', function (chunk) {
			str.push(chunk);
		});
		res.on('end', function () {
			title = $('title', Buffer.concat(str).toString()).text().split(' - ')[0];
			out = fs.createWriteStream(title + '.html');
			out.write(html1 + title + html2);
			get(page);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
var sn = 1;
get_title();
