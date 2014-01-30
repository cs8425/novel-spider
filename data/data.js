var size = 100;
var i = 0;
$("#fontB").on("click", function(d){size+=5;$(".ui.segment").css("font-size",size+"%")});
$("#fontS").on("click", function(d){size-=5;$(".ui.segment").css("font-size",size+"%")});
$("#inverted").on("click", function(d){
	if(i){
		$("body").css("background","rgb(100%,100%,100%)");
		$('.segment').removeClass('inverted');
		$('.ui.button').removeClass('black');
	}else{
		$("body").css("background","rgb(0%,0%,0%)");
		$('.segment').addClass('inverted');
		$('.ui.button').addClass('black');
	}
	i = 1-i;
});
