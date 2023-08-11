const hbs = require('hbs');

hbs.registerHelper('generateRatingStars', function(rating) {
  let stars = '';
  for (let i = 1; i <= rating; i++) {
    stars += '<img src="/images/ratingStar.png" alt="Rating Star" class="header-icon">';
  }
  return new hbs.SafeString(stars);
});
