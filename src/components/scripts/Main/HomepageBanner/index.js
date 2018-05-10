// import Slick from 'vue-slick'

export default {
  name: 'HomepageBanner',
  // components: { Slick },
  data () {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        autoplay: false,
        autoHeight: true,
        speed: 700,
        centeredSlides: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      slickOptions: {
        infinite: true,
        autoplay: false,
        speed: 700,
        swipeToSlide: true,
        arrows: true,
        prevArrow: '<button class="slick-prev slick-left slick-arrow slick-triangle" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next slick-right slick-arrow slick-triangle" aria-label="Next" type="button">Next</button>',
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  }
}
