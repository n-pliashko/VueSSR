export default {
  name: 'BrandsCarousel',
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
          nextEl: '.slick-next',
          prevEl: '.slick-prev'
        },
        breakpoints: {
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
  },
  mounted() {
    if (this.swiperBrands) {
      this.swiperBrands.update()
    }
  }
}
