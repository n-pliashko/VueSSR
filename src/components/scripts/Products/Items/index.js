import { mapState } from 'vuex'
import { reverseRouteName, getSearchString } from '@/../config/helper'
import config from '@/../config'
// import Slick from 'vue-slick'

export default {
  name: 'Items',
 // components: {Slick},
  computed: {
    ...mapState({
      routerObj: (state) => state.pageMenuDescription
    })
  },
  data () {
    return {
      cdnUrl: config.cdnUrl,
      currentRoute: this.$route,
      category_name: this.$parent.categoryObj !== null ? this.$parent.categoryObj.name : '',
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        autoplay: false,
        autoHeight: true,
        speed: 700,
        centeredSlides: true
      },
      slickOptions: {
        infinite: true,
        autoplay: false,
        autoplaySpeed: 0,
        speed: 700,
        swipeToSlide: false,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        pauseOnFocus: false
      }
    }
  },
  methods: {
    reverseRouteName: function (str) {
      return reverseRouteName(str)
    },
    setSwitchWishlist (itemId) {
      let self = this
      let itemData = {
        id: itemId,
        type: 'catalogue',
        params: ''
      }
      self.$store.dispatch('switchWishlist', itemData)
    },
    rememberRoute () {
      let path = this.currentRoute.path
      if (Object.keys(this.currentRoute.query).length > 0) {
        path += getSearchString(this.currentRoute.query)
      }
      this.$store.dispatch('setRouterBack', {path: path, params: {category_name: this.category_name}})
    },
    autoPlaySlick (id, event) {
      console.log('autoPlaySlick', this)
      let ref = 'swipper_' + id
     /*
      let ref = 'slick_' + id
     if (this.$refs[ref]) {
        this.$refs[ref][0].play()
      }*/
     if (this[ref]) {
       this[ref].autoplay.start()
     }
    },
    stopPlaySlick (id, event) {
     /* let ref = 'slick_' + id
      if (this.$refs[ref]) {
        this.$refs[ref][0].goTo(0)
        this.$refs[ref][0].pause()
      }*/
      let ref = 'swipper_' + id
      if (this[ref]) {
        this[ref].autoplay.stop()
        this[ref].slideTo(1, 1000, false)
      }
    }
  },
  watch: {
    '$parent.categoryObj': {
      handler: function () {
        this.category_name = this.$parent.categoryObj !== null ? this.$parent.categoryObj.name : ''
      },
      deep: true
    },
    '$route' (to, from) {
      this.currentRoute = from
    }
  }
}
