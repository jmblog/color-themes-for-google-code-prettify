;(function(window, $) {
  /* isotope */
  if ($.Isotope) {
    var $thumbnails = $('#thumbnails'),
        $filter = $('#filter');
    
    $thumbnails.isotope({
      itemSelector : '.item',
      layoutMode : 'fitRows'
    });
    
    $filter.find('a').click(function(){
      $filter.find('dd').removeClass('active');
      $(this).parent('dd').addClass('active');
      var selector = $(this).attr('data-filter');
      $thumbnails.isotope({ filter: selector });
      return false;
    });
  }
  
  /* google code prettify */
  if (window.prettyPrint) {
    window.prettyPrint();
  }
  
  /* smooth scroll */
  $('a').smoothScroll();
  
}(this, jQuery));