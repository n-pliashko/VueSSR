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
      timerSwiper: null,
      swiperOption: {
        loop: true,
        autoplay: false,
        autoplayDisableOnInteraction: false,
        loopAdditionalSlides: 0,
        setWrapperSize: true,
        slidesPerView: 1,
        speed: 700,
        watchOverflow: true,
        lazyLoading: true,
        navigation: {
          nextEl: '.slick-next',
          prevEl: '.slick-prev'
        }
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
      if (this[ref] && this[ref].slides && this[ref].slides.length > 3) {
        this.timerSwiper = setInterval(() => {
          if (this[ref]) {
            this[ref].slideNext()
          }
        }, 1000)
      }
    },
    stopPlaySlick (id, event) {
      let ref = 'swiper_' + id
      if (this[ref]) {
        if (this.timerSwiper) {
          clearInterval(this.timerSwiper)
        }
        this[ref].slideTo(1, 100, false)
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
