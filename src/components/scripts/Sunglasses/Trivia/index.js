export default {
  name: 'Trivia',
  data () {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        roundLengths: true,
        autoplay: false,
        speed: 700,
        centeredSlides: true,
        setWrapperSize: true,
        navigation: {
          nextEl: '.slick-next',
          prevEl: '.slick-prev'
        },
        pagination: {
          el: '.slick-dots',
          type: 'bullets',
          bulletActiveClass: 'slick-active',
          clickable: true,
          renderBullet: function (index, className) {
            return '<li class="' + className + '"><button>' + (index + 1) + '</button></li>';
          }
        }
      },
      slickOptions: {
        infinite: true,
        autoplay: false,
        speed: 700,
        swipeToSlide: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        dotsClass: 'slick-dots white-dots',
        arrows: true,
        prevArrow: '<button class="slick-prev slick-left slick-arrow slick-triangle" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next slick-right slick-arrow slick-triangle" aria-label="Next" type="button">Next</button>'
      }
    }
  }
}
