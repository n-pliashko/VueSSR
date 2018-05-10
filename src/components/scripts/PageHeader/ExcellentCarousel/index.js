// import Slick from 'vue-slick'
import {mapState} from 'vuex'

export default {
  name: 'ExcellentCarousel',
  // components: { Slick },
  data () {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        autoHeight: true,
        speed: 700,
        centeredSlides: true
      },
      slickOptions: {
        autoplay: true,
        speed: 700,
        infinite: true,
        swipeToSlide: true,
        arrows: false,
        slidesToShow: 1,
        fade: true
      }
    }
  },
  computed: {
    ...mapState({
      calculatePrice: (state) => state.calculatePrice
    })
  }
}
