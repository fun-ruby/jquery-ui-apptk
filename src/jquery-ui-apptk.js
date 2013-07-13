/*!
  jQuery UI Application Toolkit JavaScript Library
  https://github.com/fun-ruby/jquery-ui-apptk

  Copyright 2013 Long On
  Released under the MIT license

  Date: 2013-07-13
*/
(function($) {
  $.fn.apptk = function(action, options) {

    /* **************************************************

    Private - create a modal popup (dialog()) on caller, myself.
    Returns myself (this)

    Default Options:
      title:  "Title"
      height: 240
      width:  500
      show:   "puff"
        see http://api.jqueryui.com/category/effects/ for possible effects
      closebtn_text: "Close"

    ***************************************************** */
    $.popup = function(myself, opts) {
      var params = $.extend({
        title:  "Title",
        height: 240,
        width:  500,
        show:   "puff",
        closebtn_text: "Close"
      }, opts);

      return myself.dialog({
        title: params.title,
        show: params.show,
        height: params.height,
        width: params.width,
        autoOpen: false,
        modal: true,
        buttons: [{
          text: params.closebtn_text,
          click: function() {
            myself.dialog("close");
          }
        }]
      });
    };

    /* **************************************************

    Private - create a modal prompt (dialog()) on caller, myself
    Returns myself (this)

    Default options:
      title: "Title"
      message: ""
      css:    "info" - add custom classes: 'alert', 'warn', etc
      height: 240
      width:  500
      show:   "shake"
        see http://api.jqueryui.com/category/effects/ for possible effects
      closebtn_text: "Close"

    ***************************************************** */
    $.prompt = function(myself, opts) {
      var params = $.extend({
        css: "info",
        message: "",
        show: "shake"
      }, opts);

      return $.popup(myself, params)
        .dialog({
          open: function(event, ui) {
            // set the prompt message on open
            myself.text(params.message);
          },
          close: function(event, ui) {
            // clear the prompt message on close
            myself
              .text("")
              .removeClass(params.css);
          }
        })
        .addClass(params.css);
    };


    /* **************************************************

    Private - add a button to caller, myself (a popup)
    Returns myself (this)

    Default options:
      text:  "Ok"
      click: a button click handler function

    ***************************************************** */
    $.add_button = function(myself, opts) {
      var params = $.extend({
        text:  "Ok",
        click: function() {
          $.error("Button clicked. Must provide a handler function");
        }
      }, opts);

      var buttons = myself.dialog("option", "buttons");
      buttons.push({
        text: params.text,
        click: params.click
      });
      return myself.dialog("option", "buttons", buttons);
    };


    /* **************************************************

    API: .apptk("popup", {});
      See $.popup for description

    Returns this

    ***************************************************** */
    if (action === "popup") {
      return $.popup(this, options);
    };

    /* **************************************************

    API: .apptk("prompt", {});
      See $.prompt for description

    Returns this

    ***************************************************** */
    if (action === "prompt") {
      return $.prompt(this, options);
    };

    /* **************************************************

    API: .apptk("add_button", {});
      See $.add_button for description

    Returns this

    ***************************************************** */
    if (action === "add_button") {
      return $.add_button(this, options);
    };

    /* **************************************************

    API: .apptk("confirm", {});
      Create a modal confirm popup (dialog)

    Returns this

    Default options:
      title: 'Please Confirm'
      message: 'Are you sure?'
      show: 'blind'
      css: 'info'
      closebtn_text: 'No'
      yesbtn_text: 'Yes'
      yesbtn_click: a button click handler function

    ***************************************************** */
    if (action === "confirm") {
      var params = $.extend({
        title: 'Please Confirm',
        message: 'Are you sure?',
        show: 'blind',
        css: 'info',
        closebtn_text: 'No'
      }, options);

      $.prompt(this, params);

      return $.add_button(this, {
        text: options.yesbtn_text || 'Yes',
        click: options.yesbtn_click
      });

    };

    /* **************************************************

    API: .apptk("notify", {});
      Fade-out caller then fade-in with message

    Returns this

    Default options:
      message: "" (no default)
      fade_out_ms: 1000
      fade_in_ms:  1500

    ***************************************************** */
    if (action === "notify") {
      var params = $.extend({
        fade_out_ms: 1000,
        fade_in_ms: 1500,
      }, options);

      this.fadeOut(params.fade_out_ms,
        function() {
          // this == the Dom
          $( this )
            .text(params.message)
            .fadeIn(params.fade_in_ms);
        }
      );

      return this;
    };

    /* **************************************************

    API: .apptk("form_data", {});
      Serialize form entries into an http payload, in
      x-www-form-urlencoded (default) or JSON format.

    Returns Object or aJSON. Not jQuery chainable.

    Inspired by:
    http://onwebdev.blogspot.com/2012/02/jquery-serialize-form-as-json-object.html

    Default options:
      as_json: false

    ***************************************************** */
    if (action === "form_data") {
      var params = $.extend({
        as_json: false
      }, options);

      var data = {};
      var entries = this.serializeArray();

      $.each(entries, function() {
        var name = this.name;
        var value = this.value || '';

        if (data[name]) {
          // collect all values of fields with same 'name' in a collection
          // e.g. name => [ val1, ..., valN ]
          if (data[name].push === undefined) {
            data[name] = [ data[name] ];
          }
          data[name].push(value);
        } else {
          data[name] = value;
        }
      });
      if (params.as_json) {
        return JSON.stringify(data);
      }
      return data;
    }

    $.error("Undefined .apptk() action: " + action);
  }
}
)(jQuery);

