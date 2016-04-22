var filterThemes = function() {
  var themes = document.getElementsByClassName('js-theme') || [];
  var filters = document.getElementsByClassName('js-theme-filter') || [];

  // Filter by theme types
  [].forEach.call(filters, function(filter) {
    filter.addEventListener('click', function(event) {
      event.preventDefault();
      selectTab(this);
      [].forEach.call(themes, function(theme) {
        theme.classList.remove('fadeInUp');
        window.setTimeout(function() {
          if (filter.getAttribute('data-filter') && filter.getAttribute('data-filter') != theme.getAttribute('data-theme-type')) {
            theme.classList.add('-hide');
          } else {
            theme.classList.remove('-hide');
            theme.classList.add('fadeInUp');
          }
        }, 100);
      });
      if (window.ga) {
        ga('send', 'event', 'Filter', 'click', filter.getAttribute('data-filter') || 'all');
      }
    })
  });
}

var selectTab = function(elem) {
  var filters = document.getElementsByClassName('js-theme-filter') || [];
  [].forEach.call(filters, function(filter) {
    if (filter == elem) {
      filter.classList.add('-selected');
    } else {
      filter.classList.remove('-selected');
    }
  });
}

var trackDownload = function() {
  var downloadLinks = document.getElementsByClassName('js-download-theme') || [];

  // Click tracking with Google Analytics
  [].forEach.call(downloadLinks, function(link) {
    link.addEventListener('click', function(event) {
      if (window.ga) {
        ga('send', 'event', 'Download', 'click', link.getAttribute('data-theme-id'));
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  filterThemes();
  trackDownload();
}, false);
