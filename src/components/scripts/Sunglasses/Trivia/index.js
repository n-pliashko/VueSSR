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
          nextEl: '.trivia .slick-next',
          prevEl: '.trivia .slick-prev'
        },
        pagination: {
          el: '.trivia .slick-dots',
          type: 'bullets',
          bulletActiveClass: 'slick-active',
          bulletClass: 'pagination-bullet',
          clickable: true,
          renderBullet: function (index, className) {
            if (index === 0) {
              className += ' slick-active'
            }
            return '<li class="' + className + '"><button role="tab">' + (index + 1) + '</button></li>';
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
  },
  mounted() {
    if (this.swiper) {
      this.swiper.update()
      this.swiper.pagination.render()
    }
  },
  updated() {
    if (this.swiper) {
      this.swiper.pagination.render()
    }
  }
}
