import { mapState } from 'vuex'

import PageHeader from '@/components/scripts/PageHeader/index.vue'
import Breadcrumbs from '@/components/scripts/Breadcrumbs/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import config from '@/../config'
import Vue from 'vue'
import VueRes from 'vue-resource'
import { reverseRouteName } from '@/../config/helper'

Vue.use(VueRes)

export default {
  name: 'Wishlist',
  components: {
    PageHeader,
    Breadcrumbs,
    NavigationLinks,
    PageFooter
  },
  computed: {
    ...mapState({
      data: (state) => {
        return {
          step: 1,
          ...state.formData['login']
        }
      },
      meta: (state) => ({
        ...state.formMeta.orders || {}
      }),
      loading: (state) => state.loading,
      apiHost: (state) => state.apiHost,
      user: (state) => {
        const {profile, ...user} = state.user
        if (profile) { return user }
        return user
      },
      profile: (state) => {
        const {user: {profile: data}} = state
        const {addresses, ...profile} = data
        if (addresses) { return profile }
        return profile
      },
      exchange: (state) => state.currency.exchange,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      activeWL: (state) => state.activeWL,
      vat: (state) => state.vat
    })
  },
  data () {
    return {
      cdnUrl: config.cdnUrl,
      fgrname: 'pageitem',
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        roundLengths: true,
        autoplay: false,
        speed: 700,
        centeredSlides: true,
        setWrapperSize: true
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
    switchWishlist: function (itemId, type, params) {
      var itemData = {
        id: itemId,
        type: type,
        params: params
      }
      this.$store.dispatch('switchWishlist', itemData)
    },
    cleanWishlist: function () {
      this.$store.dispatch('cleanWishlist')
    },
    reverseRouteName: function (str) {
      return reverseRouteName(str)
    },
    setSelected: function (itemId, optionId, type) {
      let selected = {
        id: itemId,
        optionId: optionId,
        type: type
      }
      this.$store.dispatch('setActiveWishlist', selected)
    },
    convertPrice: function (price) {
      try {
        return parseFloat(this.exchange(this.vat(price).price)).toFixed(2)
      } catch (e) {
        return parseFloat(this.exchange(price)).toFixed(2)
      }
    },
    autoPlaySlick (id, event) {
      let ref = 'slick_' + id
      if (this.$refs[ref]) {
        this.$refs[ref][0].play()
      }
    },
    stopPlaySlick (id, event) {
      let ref = 'slick_' + id
      if (this.$refs[ref]) {
        this.$refs[ref][0].goTo(0)
        this.$refs[ref][0].pause()
      }
    }
  }
}
