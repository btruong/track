;(function (global, $) {

  // A tracking library that tracks actions on DOM elements
  // Example on how to use.
  // This targets all elements with the data attribute "data-track"
  // var track = $TRACK('[data-track]');
  // track.track();
  // 'new' an object.
  var TRACK = function (attribute) {
    var selector = '[' + attribute +']';
    return new TRACK.init(selector);
  }

  $.fn.trackAttrs = function () {
    var attributes = {};
    if (this.length) {
      $.each(this[0].attributes, function (index, attr) {
        // Only return non data attributes
        if (attr.name.indexOf('data-') !== 0) {
          attributes[attr.name] = attr.value;
        }
      });
    }
    return attributes;
  }

  $.fn.trackAttrsImg = function () {
    var attributes = {};
      if (this.length) {
        $.each(this[0].attributes, function (index, attr) {
          attributes[attr.name] = attr.value;
        });
      }
      return attributes;
  }

  $.fn.trackSanitize = function(input) {
    var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
    replace(/<[\/\!]*?[^<>]*?>/gi, '').
    replace(/<style[^>]*?>.*?<\/style>/gi, '').
    replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
    return output;
  }

  $.fn.trackBuildEvent = function () {
    var props = {};
    // Get data attributes and add to prop.
    $.each($(this).data(), function (item, value) {
      props[item] = value;
    });
    // Get non-data attributes with custom trackAttrs function and add to prop.
    $.each($(this).trackAttrs(), function (item, value) {
      props[item] = value;
    });
    // Add more info to prop.
    props['element'] = $(this).prop("tagName");
    props['html'] = $(this).html();
    // Check to see if it has an img tag as a child, if so load in those attributes to prop.
    if ($(this).has("img").length > 0) {
      $.each($(this).find("img").trackAttrsImg(), function (item, value) {
        props[item] = value;
      });
    }
    return props;
  }

  // Clones attributes to a target child element defined by the value (not the name) of the parameter "attribute"
  $.fn.copyAttributesToChild = function(attribute) {
    // 'that' contains a pointer to the destination element
    var that = $(this).find($(this).attr(attribute));
    // Place holder for all attributes
    var allAttributes = ($(this) && $(this).length > 0) ?
      $(this).prop("attributes") : null;
    // Iterate through attributes and add
    if (allAttributes && $(that) && $(that).length == 1) {
      $.each(allAttributes, function() {
        // Ensure that class names are not copied but rather added
        if (this.name == "class") {
          $(that).addClass(this.value);
        } else {
          // do not copy over attribute that was used as a flag to clone
          if (this.name != attribute) {
            that.attr(this.name, this.value);
          }
        }
      });
    }
    // Remove original wrapping div
    $(this).contents().unwrap();
    return that;
  };

  // Prototype holds methods (to save memory space).
  TRACK.prototype = {
    cloneAttributes: function (attribute) {
      $(this.selector).once('track').each(function () {
        $(this).copyAttributesToChild(attribute);
      });

      return this;
    },

    // Makes current element trackable with the type of tracking specified in value returned from "attribute" param
    // Example
    // var attribute = 'data-track-track';
    // if ($('[' + attribute + ']').length) {
    //   var track = $TRACK(attribute);
    //   track.trackTrack(attribute);
    // }
    track: function (attribute) {
      if (!$) {
        throw 'jQuery not loaded';
      }

      $(this.selector).once('track').each(function () {
        var props = $(this).trackBuildEvent();
        switch ($(this).attr(attribute)) {
          case "rollover":
              $(this).mouseover(function () {
                if (window.mixpanel) {
                  mixpanel.track(event_name, props);
                }
              });
            break;
          case "click":
              $(this).click(function () {
                if (window.mixpanel) {
                  mixpanel.track(event_name, props);
                }
              });
            break;
          case "track-link":
            if (window.mixpanel) {
              mixpanel.track(event_name, props);
            }
            break;
          case "dropdown":
            $(this).change(function() {
              props['selected'] = $(this).find(":selected").text();
              if (window.mixpanel) {
                mixpanel.track(event_name, props);
              }
            });
            break;
          case "textfield":
            $(this).focus(function () {
              if (window.mixpanel) {
                mixpanel.track(event_name, props);
              }
            });
            break;
          case "textfield_focusout":
            $(this).focusout(function () {
              // Only send if user entered a value in the textfield
              if ($(this)["0"].value !== '') {
                if (props['sendInputValue'] == '1') {
                  props['value'] = $(this).trackSanitize($(this)["0"].value);
                }
                if (window.mixpanel) {
                  mixpanel.track(event_name, props);
                }
              }
            });
            break;
          case "form":
              // Setup a handler to run when the form is submitted
              $(this).on('submit', function(e) {
                // If some client-side validation kicked in and wants to prevent
                // the form from submitting, bail out now without calling track or identify
                if (e.isDefaultPrevented()) {
                  return;
                }
                // needs a half second delay in order to get these events to fire in Firefox PC
                setTimeout(function() {
                  if (window.analytics === undefined && window.mixpanel) {
                    mixpanel.track(event_name, props);
                  }
                }, 500);

                // If we got here, it's okay to fire our events and submit the form
                // Stop the form from submitting...for now
                e.preventDefault();

                // Submit the form now that all our analytics stuff is done
                $(e.target).unbind('submit').trigger('submit');
              });
            break;
        }
      });

      // Make chainable.
      return this;
    }

  };

  // The actual object is created here, allowing us to 'new' an object without calling 'new'.
  TRACK.init = function (selector) {
    var self = this;
    self.selector = selector || '';
  }

  // Trick borrowed from jQuery so we don't have to use the 'new' keyword.
  TRACK.init.prototype = TRACK.prototype;

  // Attach our TRACK to the global object, and provide a shorthand '$TRACK' for ease our poor fingers.
  global.TRACK = global.$TRACK = TRACK;

}(window, jQuery));
