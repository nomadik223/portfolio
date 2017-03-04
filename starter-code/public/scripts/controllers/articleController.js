'use strict';

(function (module) {
  const articleController = {};
  articleController.init = () => {
    Article.fetchAll(articleView.initIndexPage);
    $('#about').hide();
    $('#articles').show();
  }


  module.articleController = articleController;
})(window);
