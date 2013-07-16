/**
 * jQuery Form Toolkit JavaScript Library
 * https://github.com/fun-ruby/jquery-ui-apptk
 *
 * Copyright 2013 Long On
 * Released under the MIT license
 *
 * Date: 2013-07-15
 */
(function($) {
  $.fn.formtk = function(action, options) {

    /**
     * Private: tk_render_checkbox(this, values-array)
     *   Determine if this (checkbox) should be checked.
     *   .formtk() helper function
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
     *  API: .formtk("serialize", {})
     *    Serialize form entries into a usable http payload.
     *
     *    Inspired by:
     *      http://onwebdev.blogspot.com/2012/02/jquery-serialize-form-as-json-object.html
     *
     *    Default options:
     *      as_json: false
     *
     *    Return Object or aJSON string.
     */
    if (action === "serialize") {
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
     *  API: .formtk("deserialize", {})
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
    if (action === "deserialize") {
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
    $.error("Undefined .formtk() action: " + action);

  }
}
)(jQuery);

