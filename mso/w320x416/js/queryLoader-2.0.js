var QueryLoader={overlay:"",loadBar:"",preloader:"",items:new Array(),doneStatus:0,doneNow:0,selectorPreload:"body",checkDoubleItems:true,amtShow:true,amtClass:"QAmtImage",init:function(){if(QueryLoader.selectorPreload=="body"){QueryLoader.spawnLoader();QueryLoader.getImages(QueryLoader.selectorPreload);QueryLoader.createPreloading();}else{$(document).ready(function(){QueryLoader.spawnLoader();QueryLoader.getImages(QueryLoader.selectorPreload);QueryLoader.createPreloading();});}},imgCallback:function(){QueryLoader.doneNow++;QueryLoader.animateLoader();},getImages:function(a){var b=$(a).find("*:not(script)").each(function(){var c="";if($(this).css("background-image")!="none"){var c=$(this).css("background-image");}else{if(typeof($(this).attr("src"))!="undefined"&&$(this).attr("tagName").toLowerCase()=="img"){var c=$(this).attr("src");}}c=c.replace('url("',"");c=c.replace("url(","");c=c.replace('")',"");c=c.replace(")","");if(c.length>0){if(QueryLoader.checkDoubleItems){if($.inArray(c,QueryLoader.items)===-1){QueryLoader.items.push(c);}}else{QueryLoader.items.push(c);}}});},createPreloading:function(){QueryLoader.preloader=$("<div></div>").appendTo(QueryLoader.selectorPreload);$(QueryLoader.preloader).css({height:"0px",width:"0px",overflow:"hidden"});var b=QueryLoader.items.length;QueryLoader.doneStatus=b;for(var a=0;a<b;a++){var c=$("<img></img>");$(c).attr("src",QueryLoader.items[a]);$(c).unbind("load");$(c).bind("load",function(){QueryLoader.imgCallback();});$(c).appendTo($(QueryLoader.preloader));}},spawnLoader:function(){if(QueryLoader.selectorPreload=="body"){var b=$(window).height();var c=$(window).width();var a="fixed";}else{var b=$(QueryLoader.selectorPreload).outerHeight();var c=$(QueryLoader.selectorPreload).outerWidth();var a="absolute";}var e=$(QueryLoader.selectorPreload).offset()["left"];var d=$(QueryLoader.selectorPreload).offset()["top"];QueryLoader.overlay=$("<div></div>").appendTo($(QueryLoader.selectorPreload));$(QueryLoader.overlay).addClass("QOverlay");$(QueryLoader.overlay).css({position:a,top:d,left:e,width:c+"px",height:b+"px"});QueryLoader.loadBar=$("<div></div>").appendTo($(QueryLoader.overlay));$(QueryLoader.loadBar).addClass("QLoader");$(QueryLoader.loadBar).css({position:"relative",top:"50%",width:"0%"});if(QueryLoader.amtShow){if(QueryLoader.amtClass!=""){QueryLoader.loadAmt=$("<div></div>").appendTo($(QueryLoader.overlay));}else{QueryLoader.loadAmt=$("<div>0%</div>").appendTo($(QueryLoader.overlay));}$(QueryLoader.loadAmt).addClass(QueryLoader.amtClass);if(QueryLoader.amtClass==""){$(QueryLoader.loadAmt).css({position:"relative",top:"50%",left:"50%"});}else{$(QueryLoader.loadAmt).css({position:"absolute",left:(($(document).width()-$(QueryLoader.loadAmt).width())/2),top:((($(document).height()-$(QueryLoader.loadAmt).height())/2)-$(QueryLoader.loadAmt).height())});}}},animateLoader:function(){var a=(100/QueryLoader.doneStatus)*QueryLoader.doneNow;if(a>99){if(QueryLoader.amtShow&&QueryLoader.amtClass==""){$(QueryLoader.loadAmt).html("100%");}$(QueryLoader.loadBar).stop().animate({width:a+"%"},500,"linear",function(){QueryLoader.doneLoad();});}else{$(QueryLoader.loadBar).stop().animate({width:a+"%"},500,"linear",function(){});if(QueryLoader.amtShow&&QueryLoader.amtClass==""){$(QueryLoader.loadAmt).html(Math.floor(a)+"%");}}},doneLoad:function(){if(QueryLoader.selectorPreload=="body"){var a=$(window).height();}else{var a=$(QueryLoader.selectorPreload).outerHeight();}if(QueryLoader.amtShow){$(QueryLoader.loadAmt).fadeOut(250);}$(QueryLoader.loadBar).animate({},500,"linear",function(){$(QueryLoader.overlay).fadeOut(250);$(QueryLoader.preloader).remove();var b=jQuery("body > #viewport");if(b.length){b.removeClass("hideme");}});}};