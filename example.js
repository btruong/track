(function($, Drupal, drupalSettings) {
  Drupal.behaviors.example = {
    attach: function (context, settings) {

      if ($('[data-track]').length) {
        var track = $TRACK('[data-track]');
        track.track('[data-track]');
      }

      if ($('[data-clone-attributes-to]').length) {
        var cloneAttributesTo = $TRACK('[data-clone-attributes-to]');
        cloneAttributesTo.cloneAttributesTo('[data-clone-attributes-to]');
      }

    },

  };
})(jQuery, Drupal, drupalSettings);