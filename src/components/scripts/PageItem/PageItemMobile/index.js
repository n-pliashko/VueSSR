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
        loopAdditionalSlides: 0,
        autoHeight: true,
        effect: 'fade',
        navigation: {
          nextEl: '#item_images_block_mobile .slick-next',
          prevEl: '#item_images_block_mobile .slick-prev'
        },
        watchOverflow: true,
        pagination: {
          el: '.slick-dots',
          type: 'bullets',
          bulletActiveClass: 'slick-active',
          bulletClass: 'pagination-bullet',
          clickable: true,
          renderBullet: function (index, className) {
            if (index === 0) {
              className += ' slick-active'
            }
            return '<li class="' + className + '"><button>' + (index + 1) + '</button></li>'
          }
        }
      },
      swiperOptionColours: {
        slidesPerView: 3,
        spaceBetween: 3,
        speed: 500,
        navigation: {
          nextEl: '#availColourBarMobile .slick-next',
          prevEl: '#availColourBarMobile .slick-prev'
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
    }
  },
  updated () {
    if (this.swiperMobItem && this.$parent.changeSlick) {
      let slides = $('#item_images_block_mobile .swiper-slide:not(.swiper-slide-duplicate)').removeAttr('class').attr('class', 'swiper-slide')
      this.swiperMobItem.removeAllSlides()
      this.swiperMobItem.appendSlide(slides)
      this.swiperMobItem.update()
      this.swiperMobItem.slideTo(this.$parent.activeSwiperIndex, 100, false)
      this.swiperMobItem.pagination.render()
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
    '$parent.activeSwiperIndex': {
      handler: function() {
        if (this.swiperMobItem) {
          this.swiperMobItem.slideTo(this.$parent.activeSwiperIndex, 100, false)
        }
      },
      deep: true
    }
  }
}
