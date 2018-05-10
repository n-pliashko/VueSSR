// import Slick from 'vue-slick'

export default {
  name: 'BrandsCarousel',
  // components: { Slick },
  data () {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 8,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        autoHeight: true,
        centeredSlides: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          300: {
          },
          600: {
            slidesPerView: 4
          },
          1024: {
            slidesPerView: 8
          }
        }
      },
      slickOptions: {
        autoplay: true,
        infinite: true,
        swipeToSlide: true,
        arrows: true,
        mobileFirst: true,
        slidesToShow: 3,
        responsive: [
          {
            breakpoint: 300,
            settings: {
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToScroll: 2,
              slidesToShow: 4
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToScroll: 2,
              slidesToShow: 8
            }
          }
        ]
      }
    }
  }
}
