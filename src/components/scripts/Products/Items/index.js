import { mapState } from 'vuex'
import { reverseRouteName, getSearchString } from '@/../config/helper'
import config from '@/../config'

export default {
  name: 'Items',
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
        /*autoplay: {
          disableOnInteraction: false
        },*/
        autoplayDisableOnInteraction: false,
        slidesPerView: 1,
        speed: 700
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
      let ref = 'swiper_' + id
     /*
      let ref = 'slick_' + id
     if (this.$refs[ref]) {
        this.$refs[ref][0].play()
      }*/
     if (this[ref]) {
       this[ref].params.autoplay.enabled = true
       this[ref].params.autoplay.disableOnInteraction = false
       this[ref].autoplay.running = true
       this[ref].autoplay.start()
       console.log('autoPlaySlick', this[ref])
     }
    },
    stopPlaySlick (id, event) {
     /* let ref = 'slick_' + id
      if (this.$refs[ref]) {
        this.$refs[ref][0].goTo(0)
        this.$refs[ref][0].pause()
      }*/
      let ref = 'swiper_' + id
      if (this[ref]) {
        this[ref].params.autoplay.enabled = false
        this[ref].params.autoplay.disableOnInteraction = false
        this[ref].autoplay.running = false
        this[ref].autoplay.stop()
        this[ref].slideTo(1, 1000, false)
        console.log('stopPlaySlick', this[ref])
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
