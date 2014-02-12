/**
 *
 * YOC Ad Plus - Page Slider
 * v2.0
 *
 * (c) 2010 - yoc (Jan Fanslau, Bjoern Hampe)
 *
 * History:
 *
 *   2.0 (2011-05-03)
 *   # tracking only if true in init.js
 *
 * 	 1.8 (2010-11-25)
 * 	 + added tracking
 *
 *   1.7 (2010-11-24)
 * 	 + updated positioning sliderControls (actually it is centered)
 *   + added counter output
 *   + added slidercontrols option
 *   1.6 (2010-11-21)
 *   + auto positioning sliderControls
 *
 **/

(function($){
  $.fn.extend({
    //plugin name - yoc-pageslider
  	yocPageSlider: function(options) {

      //Settings list and the default values
      var defaults = {
    		speed: '0.3s',
    		controls: false,
    		controlActiveClass: false,
    		controlInactiveClass: false,
    		controlSize: '20px',
    		counterOutputDiv: false,
    		counterOutputText: false,
    		slidercontrols: '.sliderControls', // slider controls DOM element
				tracking: tracking 						// global variable set in init.js
      },

      options = $.extend(defaults, options);

      return this.each( function( pageSliderIndex ) {
          var o =options,

          obj = jQuery( this ),


          items = jQuery( "ul:first > li", obj ),          //Get all LI in the UL

          liWidth = jQuery( "ul:first > li:first", obj ).width(),

          ulElement = jQuery( "ul:first", obj );

          ulElement.css({
	          	position:	"absolute",
	          	left:		"0px",
	          	height:		"100%",
	          	width: 		liWidth* items.length +"px"
          });

          /* Iphone EventListeners */
          var currentMoveStart = 0;
          var currentMoveEnd = 0;
          var touchStarted = false;
          ulElement.bind( "touchstart", function ( event ) {
              var e = event.originalEvent;

              currentMoveStart = e.targetTouches[0].pageX;

              currentMoveEnd   = e.targetTouches[0].pageX;

              touchStarted = true;
          });

          ulElement.bind("touchmove", function (event) {
        	  var e = event.originalEvent;

        	  event.preventDefault();
        	  currentMoveEnd = e.targetTouches[0].pageX;
        	  if(touchStarted){
	    		  touchStarted = false;
	    		  if(Math.abs(currentMoveStart-currentMoveEnd)>10){
	                  if(currentMoveStart > currentMoveEnd){
	                  	moveLeft();
	                  }else{
	                  	moveRight();
	                  }
	                  event.preventDefault();
	                }else{
	                	event.stopPropagation();
	                }
        	  }

          });

          ulElement.bind("touchend", function (event) {
            var e = event.originalEvent;
            touchStarted = false;
           /* if(Math.abs(currentMoveStart-currentMoveEnd)>10){
              if(currentMoveStart > currentMoveEnd){
              	moveLeft();
              }else{
              	moveRight();
              }
              event.preventDefault();
            }else{
            	event.stopPropagation();
            }
            */

          });

          /* Slide Functions */
          var currentIndex = 0;
          var totalIndex = items.length-1;

          var moveLeft = function(){
          	if(currentIndex != totalIndex) {
          		currentIndex++;
	        		ulElement.css({
	      				webkitTransformStyle:	"flat",
	      				webkitTransition:		"all " + o.speed + " linear",
	      				webkitTransform:		"translate3d(" + eval(currentIndex*-liWidth) + "px, 0px, 0px)"
		      		});
	          	clearActiveClasses();
		      		jQuery(objects[currentIndex].control).attr("class",o.controlActiveClass);
		      		updateCounter(currentIndex+1, items.length);
		      		if (options.tracking)
								trackAction(currentIndex+1, "PageSlider", "To Left");
          	}else{
          		if (options.tracking)
								trackAction(currentIndex+1, "PageSlider", "User wants to see next page, but there is no next");
          	}
          };

          var moveRight = function(){
          	if( currentIndex != 0 ) {
          		currentIndex--;

          		ulElement.css({
	      				webkitTransformStyle: 'flat',
						webkitTransition:"all "+o.speed+" linear",
						webkitTransform:"translate3d("+ eval(currentIndex*-liWidth) +"px, 0px, 0px)"
	      		});

          		clearActiveClasses();
	      		jQuery(objects[currentIndex].control).attr("class",o.controlActiveClass);
	      		updateCounter(currentIndex+1, items.length);
	      		if (options.tracking)
							trackAction(currentIndex+1, "PageSlider", "To Right");
          	}else{
          		if (options.tracking)
								trackAction(currentIndex+1, "PageSlider", "User wants to see next page, but there is no next");
          	}
          };

          var objects = new Array();
          var clearActiveClasses = function(){
          	jQuery(objects).each(function(){
          		jQuery(this.control).attr("class", o.controlInactiveClass);
          	});
          };
          var controlContainer =  jQuery("<div/>");
          items.each(function(index){

          	var itemsObject = new Object();
          	itemsObject.index = index;
          	itemsObject.item = jQuery(this);

          	if(o.controlActiveClass != false && o.controlInactiveClass!= false && o.controls){
          		var control =  jQuery("<div/>", {
              	"id":"yocPageSlider_"+pageSliderIndex+"_"+index,
              	"class": index==0?o.controlActiveClass:o.controlInactiveClass
              });
          	}else if(o.controls && o.controlActiveClass == false && o.controlInactiveClass == false){
          		var control =  jQuery("<div/>", {
              	"id":"yocPageSlider_"+pageSliderIndex+"_"+index,
              	"style": "float:left; width:20px; height:20px; background-color:#cccccc; margin-right:5px;"
              });
          	}
          	itemsObject.control = control;
          	controlContainer.append(control);
          	control.click(function(){

          				ulElement.css({
		    				webkitTransition:"all "+o.speed+" linear",
		    				webkitTransform:"translate3d("+ eval(index*-liWidth) +"px, 0px, 0px)"
		    			});
		    			clearActiveClasses();
		    			jQuery(control).attr("class",o.controlActiveClass);
		    			currentIndex = index;
		    			updateCounter(index+1, items.length);

          	});
          	objects.push(itemsObject);

          });

          jQuery(o.slidercontrols).addClass('sliderId_'+pageSliderIndex);
          jQuery('.sliderId_'+pageSliderIndex).append(controlContainer);

          var controlWidth = (((jQuery('.'+o.controlActiveClass).width() + parseInt(jQuery('.'+o.controlActiveClass).css('marginRight'), 10)) * items.length));
          var leftPos = ((controlWidth ) / 2 );
          updateCounter(1, items.length); // initially set counter
          controlContainer.css({
					  position: 'absolute',
					  left: "50%",
					  marginLeft:"-"+leftPos+"px",
					  width: controlWidth,
					  zIndex: "950"
				  });

          function updateCounter(current, all){
        	  var outputText = "";
        	  if(o.counterOutputDiv !== false && $(o.counterOutputDiv)){
        		  if(o.counterOutputText !== false){
        			  //regex
        			  var re = new RegExp("%1", "g");
        			  outputText = o.counterOutputText.replace(re, current);

        			  var re2 = new RegExp("%2", "g");
        			  outputText = outputText.replace(re2, all);

        		  }else{
        			  outputText = current + "/" + all;
        		  }

        		  $(o.counterOutputDiv).html(outputText);
        	  }

          }

      });

    }
  });
})(jQuery);