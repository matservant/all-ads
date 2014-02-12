/*jslint browser: true*/
/*global YOC*/

YOC.draggableView = function (spec, my) {
  var that = YOC.view(spec, my),
    touchmove = function (event) {
      var x = event.touches[0].clientX,
        delegate = that.get_delegate();

      if (that.get_el().id === 'knife') {
        that.get_el().style.left = x - 70 + 'px';
      }

      if (delegate && delegate.hasOwnProperty('draggable_view_did_drag')) {
        delegate.draggable_view_did_drag(that, event);
      }
    },

    touchstart = function (event) {
      var delegate = that.get_delegate();
      if (delegate && delegate.hasOwnProperty('draggable_view_will_drag')) {
        delegate.draggable_view_will_drag(that, event);
      }
    };

  that.get_el().addEventListener('touchmove', touchmove);
  that.get_el().addEventListener('touchstart', touchstart);
  return that;
};
