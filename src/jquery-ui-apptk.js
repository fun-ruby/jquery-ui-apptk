
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
    Private - create a modal prompt on caller dom, with defaults
      title:  - prompt title
      message: - prompt text
      css:    - default is 'info', add custom classes: 'alert', 'warn', etc
      height: - default height is 240px
      width:  - default width is 500px
      show:   - default show effect is shake,
        see http://api.jqueryui.com/category/effects/
      closebtn_text: - default button text is 'Close'
    ***************************************************** */
    $.prompt = function(opts) {
      var params = $.extend({
        css: "info",
        message: "",
        show: "shake"
      }, opts);

      $.popup(params);
      slef.dialog({
        open: function(event, ui) {
          // set the prompt message on open
          $( this ).text(params.message);
        },
        close: function(event, ui) {
          // clear the prompt message on close
          $( this ).text("");
        }
      })
      .addClass(params.css);
    };


    /* **************************************************
    Private - add a button to (this), a popup, with defaults
      text:  - default button text is 'Ok'
      click: - a handler function
    ***************************************************** */
    $.add_button = function(opts) {
      var params = $.extend({
        text:  "Ok",
        click: function() {
          throw "Button clicked. Must provide a handler function";
        }
      }, opts);

      var buttons = slef.dialog("option", "buttons");
      buttons.push({
        text: params.text,
        click: params.click
      });
      slef.dialog("option", "buttons", buttons);
    };


    /* **************************************************

    API: .apptk("popup", {});

    ***************************************************** */
    if (action === "popup") {
      $.popup(options);
      return this;
    };

    /* **************************************************

    API: .apptk("prompt", {});

    ***************************************************** */
    if (action === "prompt") {
      $.prompt(options);
      return this;
    };

    /* **************************************************

    API: .apptk("add_button", {});
    Add a button to (this), a popup, with defaults
      text:  - default button text is 'Ok'
      click: - a handler function

    ***************************************************** */
    if (action === "add_button") {
      $.add_button(options);
      return this;
    };

    /* **************************************************

    API: .apptk("confirm", {});
    Create a modal confirm popup, with defaults
      title: 'Please Confirm',
      message: 'Are you sure?',
      show: 'drop',
      css: 'info',
      closebtn_text: 'No',
      yesbtn_text: 'Yes'
      yesbtn_click: a handler function

    ***************************************************** */
    if (action === "confirm") {
      var params = $.extend({
        title: 'Please Confirm',
        message: 'Are you sure?',
        show: 'drop',
        css: 'info',
        closebtn_text: 'No'
      }, options);

      $.prompt(params);

      $.add_button({
        text: options.yesbtn_text || 'Yes',
        click: options.yesbtn_click
      });

      return this;
    };


  }
}
)(jQuery);

