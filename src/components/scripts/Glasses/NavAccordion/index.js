export default {
  name: 'NavAccordionGlasses',
  data () {
    return {
      slickOptions: {
        autoplay: false,
        mobileFirst: true,
        infinite: true,
        swipeToSlide: true,
        slidesToShow: 8,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToScroll: 2,
              slidesToShow: 8
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
            breakpoint: 300,
            settings: {
              slidesToScroll: 1,
              slidesToShow: 3,
              arrows: false
            }
          }
        ]
      }
    }
  }
}
