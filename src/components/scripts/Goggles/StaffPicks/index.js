
export default {
  name: 'StaffPicks',
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
          bulletClass: 'pagination-bullet',
          clickable: true,
          renderBullet: function (index, className) {
            if (index === 0) {
              className += ' slick-active'
            }
            return '<li role="presentation" class="' + className + '"><button role="tab">' + (index + 1) + '</button></li>';
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
        arrows: false
      }
    }
  },
  mounted: function () {
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
