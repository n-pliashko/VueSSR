import { mapState } from 'vuex'

import BasketConfirmModal from '@/components/scripts/PageItem/BasketConfirmModal/index.vue'
import InfoAccordion from '@/components/scripts/PageItem/PageItemMobile/InfoAccordion/index.vue'
import ShareButtons from '@/components/scripts/ShareButtons/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'

import config from '@/../config'
import { reverseRouteName } from '@/../config/helper'

export default {
  name: 'PageItem',
  components: {
    BasketConfirmModal,
    InfoAccordion,
    ShareButtons,
    TrustpilotWidget
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      breadcrumbs: (state) => state.breadcrumbs,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack
    }),
    item: function () { return this.$parent.item },
    designerUrl: function () { return this.$parent.designerUrl },
    options: function () { return this.$parent.options },
    selected: function () { return this.$parent.selected },
    defFrameSizeIndex: function () { return this.$parent.defFrameSizeIndex },
    addedState: function () { return this.item && this.item.item_number ? this.$store.getters.isExistWishlist(this.item.item_number) : false }
  },
  data () {
    return {
      cdnUrl: config.cdnUrl,
      cdnUrlPrefix: config.cdnUrlPrefix,
      slickOptions: {
        autoplay: false,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        swipeToSlide: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        pauseOnDotsHover: true
      },
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        speed: 500,
        watchOverflow: true,
        autoHeight: true,
        pagination: {
          el: '.slick-dots',
          type: 'bullets',
          bulletElement: 'li',
          // dynamicBullets: true,
          bulletActiveClass: 'slick-active',
          bulletClass: '',
          clickable: true,
          renderBullet: function (index, className) {
            return '<li class="' + className + '"><button>' + (index + 1) + '</button></li>'
          }
        }
      },
      swiperOptionColours: {
        slidesPerView: 3,
        spaceBetween: 3,
        speed: 500,
        navigation: {
          nextEl: '.slick-next',
          prevEl: '.slick-prev'
        },
        watchOverflow: true
      },
      slickOptionsColours: {
        autoplay: false,
        pauseOnDotsHover: true,
        infinite: false,
        speed: 500,
        cssEase: 'linear',
        swipeToSlide: true,
        slidesToShow: 3,
        slidesToScroll: 1
      },
      panelText: 'Removed from Wishlist',
      wishlist: {
        state: false
      }
    }
  },
  mounted() {
    if (this.swiperMobItem) {
      this.swiperMobItem.pagination.render()
      this.swiperMobItem.update()
    }
  },
  methods: {
    setWishlist (id) {
      let params = {
        item: this.item.item_number,
        option: this.selected.option
      }
      let itemData = {
        id: id,
        type: 'pageitem',
        params: params
      }
      this.$axios.post(this.apiHost + config.prefix + config.wishlist.switchWishlist, {params: itemData}).then(function (response) {
        self.wishlist.state = response.data
        // console.log(response)
      }, function (error) {
        console.log(error.statusText)
      })
    },
    reverseRouteName: function (str) {
      return reverseRouteName(str)
    },
    toggleBasket: function () {
      this.panelText = this.panelText === 'Removed from Wishlist' ? 'Added to Wishlist' : 'Removed from Wishlist'
      this.$parent.setSwitchWishlist(this.item.item_number)
      this.togglePopup()
    },
    togglePopup: function () {
      let popup = $('#confirmPanel')
      popup.fadeIn()
      setTimeout(function () {
        popup.fadeOut()
      }, 3000)
    }
  },
  watch: {
    'options': {
      handler: function () {
        // this.$forceUpdate()
      },
      deep: true
    },
    'selected.option': function () {
      if (this.swiperMobItem) {
        this.swiperMobItem.pagination.render()
        this.swiperMobItem.slideToLoop(0, 100, false)
      }
      /* if (this.$refs.slick) {
       this.$refs.slick.destroy()
       }
       if (this.$refs.slick) {
       this.$nextTick(() => {
       if (this.$refs.slick) {
       this.$refs.slick.create()
       }
       })
       }*/
    }
  }
}
