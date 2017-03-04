'use strict';

(function (module) {

  function Article(opts) {
    // REVIEW: Lets review what's actually happening here, and check out some new syntax!!
    Object.keys(opts).forEach(e => this[e] = opts[e]);
  }

  Article.all = [];

  Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  Article.loadAll = rows => {
    rows.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));

  Article.all = rows.map(function(ele){
    return new Article(ele);
  })

  };

  Article.fetchAll = callback => {
    $.get('Articles')
    .then(
      results => {
        if (results.length) {
          Article.loadAll(results);
          callback();
        } else {
          $.getJSON('./data/hackerIpsum.json')
          .then(rawData => {
            rawData.forEach(item => {
              let article = new Article(item);
              article.insertRecord();
            })
          })
          .then(() => Article.fetchAll(callback))
          .catch(console.error);
        }
      }
    )
  };

  Article.numWordsAll = () => {
    return Article.all.map(function(article){
        return article.body.split(' ');
    }).reduce(function(preVal, newVal){
        let finalVal = preVal + newVal;
        return finalVal;
    }, 0);
  };

  Article.allAuthors = () => {
    return Article.all.map(function(article){
        return article.author;
    }).filter(function(author, index, authorArray){
        return authorArray.indexOf(author) === index;
    })
  };

  Article.numWordsByAuthor = () => {
    return Article.allAuthors().map(author => {
      return {
          name: author,
          count: Article.all.filter(function(article){
              return article.author === author;
          }).map(function(article){
              return article.body.split(' ')
          }).reduce(function(preVal, newVal){
              let finalVal = preVal + newVal;
              return finalVal;
          })
      }

    })
  };

  Article.truncateTable = callback => {
    $.ajax({
      url: '/articles',
      method: 'DELETE',
    })
    .then(console.log)
    .then(callback);
  };

  Article.prototype.insertRecord = function(callback) {
    $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
    .then(console.log)
    .then(callback);
  };

  Article.prototype.deleteRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'DELETE'
    })
    .then(console.log)
    .then(callback);
  };

  Article.prototype.updateRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'PUT',
      data: {
        author: this.author,
        authorUrl: this.authorUrl,
        body: this.body,
        category: this.category,
        publishedOn: this.publishedOn,
        title: this.title}
      })
      .then(console.log)
      .then(callback);
    };

    module.Article = Article;
})(window);
