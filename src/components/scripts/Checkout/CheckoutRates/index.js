import ShareButtons from '@/components/scripts/ShareButtons/index.vue'
// import Slick from 'vue-slick'

export default {
  name: 'CheckoutRates',
  components: {
    ShareButtons
  //  Slick
  },
  data () {
    return {
      slickOptions: {
        arrows: false,
        autoplay: true,
        autoplaySpeed: 10000,
        mobileFirst: true,
        infinite: true,
        swipeToSlide: true,
        slidesToShow: 1,
        dots: true
      }
    }
  }
}
