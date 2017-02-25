'use strict';

(function(module) {
  const repos = {};
  repos.all = [];

  repos.requestRepos = function(callback) {
    $.get('/github/user/repos?per_page=5&sort=updated')
    .then(data => repos.all = data, err => console.error(err))
    .then(callback);
  };

  repos.with = attr => repos.all.filter(repo => repo[attr]);

  module.repos = repos;
})(window);
