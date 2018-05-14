export default {
  name: 'TrustpilotWidget',
  data () {
    return {
      slickOptions: {
        autoplay: false,
        mobileFirst: true,
        infinite: true,
        swipeToSlide: true,
        nextArrow: '<i class="fa fa-chevron-right"></i>',
        prevArrow: '<i class="fa fa-chevron-left"></i>',
        responsive: [
          {
            breakpoint: 576,
            settings: {
              slidesToScroll: 0,
              slidesToShow: 0,
              arrows: false
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToScroll: 1,
              slidesToShow: 1,
              arrows: true
            }
          },
          {
            breakpoint: 940,
            settings: {
              slidesToScroll: 2,
              slidesToShow: 2,
              arrows: true
            }
          },
          {
            breakpoint: 1224,
            settings: {
              slidesToScroll: 4,
              slidesToShow: 4,
              arrows: true
            }
          }
        ]
      }
    }
  }
}
