'use strict';

(function (module) {
  const aboutController = {};

  aboutController.init = () => {
    $('#articles').hide();
    $('#about').show();
  }

  module.aboutController = aboutController;
})(window);
