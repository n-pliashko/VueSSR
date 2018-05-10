import $ from 'jquery'
import Vue from 'vue'
import MatchHeight from 'jquery-match-height'
// import Slick from 'vue-slick'

Vue.use(MatchHeight)

export default {
  name: 'Trivia',
  // components: { Slick },
  data () {
    return {
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
  mounted: function () {
    $('.guide-to-wrapper').matchHeight()
  }
}
