// import Slick from 'vue-slick'

export default {
  name: 'PageBanner',
 // components: { Slick },
  data () {
    return {
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
