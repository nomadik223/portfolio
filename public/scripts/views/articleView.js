'use strict';

(function(module) {
  const articleView = {};

  const render = function(article) {
    let template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? `published ${article.daysAgo} days ago` : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  articleView.populateFilters = function() {
    let template = Handlebars.compile($('#option-template').text());

    let options = Article.allAuthors().map(author => template({val: author}));
    if ($('#author-filter option').length < 2) {
      $('#author-filter').append(options);
    }

    Article.allCategories(function(rows) {
      if ($('#category-filter option').length < 2) {
        $('#category-filter').append(rows.map(row => template({val: row.category})));
      }
    });
  };

  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      let resource = this.id.replace('-filter', '');
      $(this).parent().siblings().find('select').val('');
      page(`/${resource}/${$(this).val().replace(/\W+/g, '+')}`);
    });
  };

  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();
    $('#articles article').remove();
    articles.forEach(a => $('#articles').append(render(a)))
    // REVIEW: Call the new unified filter handler function
    articleView.populateFilters();
    articleView.handleFilters();

    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  module.articleView = articleView;
})(window);
