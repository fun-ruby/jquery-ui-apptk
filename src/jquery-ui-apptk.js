
(function($) {
  $.fn.apptk = function(action, options) {

    var slef = $( this );

    /* **************************************************
    Private - create a modal popup on caller dom, with defaults
      title:  - popup title
      height: - default height is 240px
      width:  - default width is 500px
      show:   - default show effect is puff,
        see http://api.jqueryui.com/category/effects/
      closebtn_text: - default button text is 'Close'
    ***************************************************** */
    $.popup = function(opts) {
      var params = $.extend({
        title:  "Title",
        height: 240,
        width:  500,
        show:   "puff",
        closebtn_text: "Close"
      }, opts);

      slef.dialog({
        title: params.title,
        show: params.show,
        height: params.height,
        width:params.width,
        autoOpen: false,
        modal: true,
        buttons: [{
          text: params.closebtn_text,
          click: function() {
            $( this ).dialog("close");
          }
        }]
      });
    };

    /* **************************************************

    API: .apptk("popup", {});

    ***************************************************** */
    if (action === "popup") {
      $.popup(options);
      return this;
    };


  }
}
)(jQuery);

