export default {
  name: 'GuidesToContactLenses',
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
            return '<li role="presentation" class="' + className + '"><button role="tab">' + (index + 1) + '</button></li>';
          }
        }
      },
      slickOptions: {
        infinite: true,
        autoplay: false,
        speed: 700,
        cssEase: 'linear',
        swipeToSlide: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        dotsClass: 'slick-dots white-dots',
        arrows: false
      }
    }
  }
}
