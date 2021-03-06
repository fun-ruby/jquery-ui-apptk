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
     *   All .dialog() options can be used here. Except buttons:, which is
     *   initialized to []
     *
     *   Default Options:
     *     title:  "Title"
     *     height: 220
     *     width:  500
     *     autoOpen: false
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
        autoOpen: false,
        modal:  true,
        show:   "puff"
      }, opts);

      params.buttons = [];  // empty all buttons

      return myself.dialog(params);
    };

    /**
     * Private: tk_prompt(this, {})
     *   Create a modal prompt (dialog()) on caller, myself
     *   All .apptk("popup") options can be used here.
     *
     *   Default options:
     *     title: "Title"
     *     message: ""
     *     css:    "info" - add custom classes: 'alert', 'warn', etc
     *     height: 220
     *     width:  500
     *     autoOpen: false
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
     *   All .dialog() options can be used here. Except buttons:, which is
     *   initialized to []
     *
     *   Default Options:
     *     title:  "Title"
     *     height: 220
     *     width:  500
     *     autoOpen: false
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
     *   All .apptk("popup") options can be used here.
     *
     *   Default options:
     *     title: "Title"
     *     message: ""
     *     css:    "info" - add custom classes: 'alert', 'warn', etc
     *     height: 220
     *     width:  500
     *     autoOpen: false
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
     *   All .apptk("prompt") options can be used here.
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
     * API: .apptk("popup_form", {})
     *   Create a popup containing a (one) form on caller, this.
     *   All .apptk("popup") options can be used here.
     *
     *   Pass in handler functions to manage the full life-cycle of the form.
     *   E.g.
     *     open: function() {
     *         // when popup open, populate form with data to edit
     *       }
     *
     *     closebtn_click: function() {
     *         // optional, do some actions, then close this
     *       }
     *
     *     submitbtn_click: function() {
     *         // when form.submit, serialize form data, POST to service
     *       }
     *
     *   Default options:
     *     title: 'New Form'
     *     closebtn_text: 'Cancel'
     *     closebtn_click: default is close this
     *     submitbtn_text: 'Submit'
     *
     *   Return this
     */
    if (action === "popup_form") {
      var form = this.find("form").first();

      var params = $.extend({
        title: 'New Form',
        closebtn_text: 'Cancel',
        submitbtn_text: 'Submit'
      }, options);

      // register the form.submit handler
      form.submit(params.submitbtn_click);

      return this
        .apptk("popup", params)
        .apptk("add_button", {
          text: params.closebtn_text,
          click: params.closebtn_click
        })
        .apptk("add_button", {
          text: params.submitbtn_text,
          click: function() {
            // trigger the form.submit event
            form.submit();
          }
        });
    }


    /**
     * Action is unsupported. Throw error.
     */
    $.error("Undefined .apptk() action: " + action);

  }
}
)(jQuery);

