/**
 * jQuery UI Application Toolkit JavaScript Library
 * https://github.com/fun-ruby/jquery-ui-apptk
 *
 * Copyright 2013 Long On
 * Released under the MIT license
 *
 * Date: 2013-07-14
 */
(function($) {
  $.fn.apptk = function(action, options) {

    /**
     * Private: tk_add_button(this, {})
     *   Add a button to caller, myself (a popup)
     *
     *   Default options:
     *     text:  "Close"
     *     click: handler function closes caller
     *
     *   Return myself (this)
     */
    var tk_add_button = function(myself, opts) {
      var params = $.extend({
        text:  "Close",
        click: function() {
          myself.dialog("close");
        }
      }, opts);

      var buttons = myself.dialog("option", "buttons");
      buttons.push({
        text: params.text,
        click: params.click
      });
      return myself.dialog("option", "buttons", buttons);
    };

    /**
     * Private: tk_popup(this, {})
     *   Create a modal popup (dialog()) on caller, myself
     *
     *   Default Options:
     *     title:  "Title"
     *     height: 220
     *     width:  500
     *     modal:  true
     *     show:   "puff"
     *       see http://api.jqueryui.com/category/effects/ for possible effects
     *
     *   Return myself (this)
     */
    var tk_popup = function(myself, opts) {
      var params = $.extend({
        title:  "Title",
        height: 220,
        width:  500,
        modal: true,
        show:   "puff"
      }, opts);

      return myself.dialog({
        title: params.title,
        show: params.show,
        height: params.height,
        width: params.width,
        autoOpen: false,
        modal: params.modal,
        buttons: []
      });
    };

    /**
     * Private: tk_prompt(this, {})
     *   Create a modal prompt (dialog()) on caller, myself
     *
     *   Default options:
     *     title: "Title"
     *     message: ""
     *     css:    "info" - add custom classes: 'alert', 'warn', etc
     *     height: 220
     *     width:  500
     *     modal:  true
     *     show:   "shake"
     *       see http://api.jqueryui.com/category/effects/ for possible effects
     *
     *   Returns myself (this)
     */
    var tk_prompt = function(myself, opts) {
      var params = $.extend({
        css: "info",
        message: "",
        show: "shake"
      }, opts);

      return tk_popup(myself, params)
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

    /**
     * Private: tk_render_checkbox(this, values-array)
     *   Determine if this (checkbox) should be checked.
     *   .apptk() helper function
     *
     *   Returns boolean
     */
    var tk_render_checkbox = function(checkbox, values) {
      if (values.push) {
        var checked = false;
        $.each(values, function() {
          if (this == checkbox.value) {
            checked = true;
            return false;  // break out of loop
          }
        });
        return checked;
      }
      return (values == checkbox.value);
    };


    /**
     * API: .apptk("add_button", {})
     *   Add a button to caller, this (a popup)
     *
     *   Default options:
     *     text:  "Close"
     *     click: handler function closes caller
     *
     *   Return this
     */
    if (action === "add_button") {
      return tk_add_button(this, options);
    };

    /**
     * API: .apptk("popup", {})
     *   Create a modal popup (dialog()) on caller, this
     *
     *   Default Options:
     *     title:  "Title"
     *     height: 220
     *     width:  500
     *     modal:  true
     *     show:   "puff"
     *       see http://api.jqueryui.com/category/effects/ for possible effects
     *
     *   Return this
     */
    if (action === "popup") {
      return tk_popup(this, options);
    };

    /**
     * API: .apptk("prompt", {})
     *   Create a modal prompt (dialog()) on caller, this
     *
     *   Default options:
     *     title: "Title"
     *     message: ""
     *     css:    "info" - add custom classes: 'alert', 'warn', etc
     *     height: 220
     *     width:  500
     *     modal:  true
     *     show:   "shake"
     *       see http://api.jqueryui.com/category/effects/ for possible effects
     *
     *   Returns this
     */
    if (action === "prompt") {
      return tk_prompt(this, options);
    };

    /**
     * API: .apptk("confirm", {})
     *   Create a modal confirm popup (dialog) on caller, this
     *
     *   Default options:
     *     title: 'Please Confirm'
     *     message: 'Are you sure?'
     *     show: 'blind'
     *     css: 'info'
     *     closebtn_text: 'No'
     *     closebtn_click: a button click handler function
     *     okbtn_text: 'Yes'
     *     okbtn_click: a button click handler function
     *
     *   Return this
     */
    if (action === "confirm") {
      var params = $.extend({
        title: 'Please Confirm',
        message: 'Are you sure?',
        show: 'blind',
        css: 'info',
      }, options);

      tk_prompt(this, params);

      tk_add_button(this, {
        text: options.closebtn_text || 'No',
        click: options.closebtn_click
      });

      return tk_add_button(this, {
        text: options.okbtn_text || 'Yes',
        click: options.okbtn_click
      });

    };

    /**
     * API: .apptk("notify", {})
     *   Fade-out caller then fade-in with message
     *
     *   Default options:
     *     message: "" (no default)
     *     fade_out_ms: 1000
     *     fade_in_ms:  1500
     *
     *   Return this
     */
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

    /**
     *  API: .apptk("form_data", {})
     *    Serialize form entries into an http payload, either
     *    x-www-form-urlencoded (default) or JSON format.
     *
     *    Inspired by:
     *      http://onwebdev.blogspot.com/2012/02/jquery-serialize-form-as-json-object.html
     *
     *    Default options:
     *      as_json: false
     *
     *    Return Object or aJSON string. Note, not jQuery chainable.
     */
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

    /**
     *  API: .apptk("form_render", {})
     *    Populate form entries with given data object
     *
     *    Default options:
     *      data: Object
     *
     *    Form tags supported thus far:
     *      SELECT, TEXTAREA
     *      INPUT types:
     *        checkbox, radio, hidden, text
     *
     *    Return this
     */
    if (action === "form_render") {
      var params = $.extend({
        data: {}
      }, options);

      var entries = this.find("[name]");
      var idx_of = {};

      $.each(entries, function() {
        var name = this.name;
        var value = params.data[name] || '';

        switch(this.tagName)
        {
          case "SELECT":
          case "TEXTAREA":
            $( this ).val(value);
            break;

          default:
            // do nothing
        }

        switch(this.type)
        {
          case "checkbox":
            var checked = tk_render_checkbox(this, value);
            $( this ).prop("checked", checked );
            break;

          case "radio":
            $( this ).prop("checked", (value == this.value) );
            break;

          case "hidden":
          case "text":
            if (value.push) {
              // handle multiple entries of same 'name'
              // assumes value is an array
              var i = idx_of[name] || 0;
              value = value[i] || '';
              idx_of[name] = i + 1;
            }
            $( this ).val(value);
            break;

          default:
            // do nothing
        }
      });
      return this;
    }

    /**
     * Action is unsupported. Throw error.
     */
    $.error("Undefined .apptk() action: " + action);

  }
}
)(jQuery);

