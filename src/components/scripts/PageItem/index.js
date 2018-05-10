import { mapState } from 'vuex'

import PageHeader from '@/components/scripts/PageHeader/index.vue'
import PageItemMobile from '@/components/scripts/PageItem/PageItemMobile/index.vue'
import Breadcrumbs from '@/components/scripts/Breadcrumbs/index.vue'
// import BasketConfirmModal from '@/components/scripts/PageItem/BasketConfirmModal/index.vue'
import CustomerDescriptionModal from '@/components/scripts/PageItem/CustomerDescriptionModal/index.vue'
import SizeGuideModal from '@/components/scripts/PageItem/SizeGuideModal/index.vue'
import VideoModal from '@/components/scripts/PageItem/VideoModal/index.vue'
import ShareButtons from '@/components/scripts/ShareButtons/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'
// import Media360Modal from '@/components/scripts/PageItem/360MediaModal/index.vue'

import config from '@/../config'
import { reverseRouteName } from '@/../config/helper'
// import Slick from 'vue-slick'
import $ from 'jquery'

export default {
  name: 'PageItem',
  components: {
   // Slick,
    // BasketConfirmModal,
    CustomerDescriptionModal,
    SizeGuideModal,
    VideoModal,
    PageHeader,
    Breadcrumbs,
    PageItemMobile,
    ShareButtons,
    TrustpilotWidget,
    PageFooter,
    ScrollToTop
    // Media360Modal
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      breadcrumbs: (state) => state.breadcrumbs,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack,
      backRoute: (state) => state.backRoute,
      vat: (state) => state.vat
    }),
    isActive () {
      let isActive = true
      if (this.options && this.selected.option && this.selected.option.frame_sizes) {
        let option = this.options[this.selected.option]
        isActive = Object.values(option.frame_sizes).filter(obj => obj.status === 'IN_STOCK').length > 0
      }
      return isActive
    },
    hasView360 () {
      return this.options[this.selected.option] && this.options[this.selected.option].view360_images && this.options[this.selected.option].view360_images.length > 0
    },
    view360Images () {
      let self = this
      return this.hasView360 ? this.options[this.selected.option].view360_images.map(obj => self.cdnUrl + self.cdnUrlPrefix + obj.src) : []
    },
    lang () {
      return 'en'
    }
  },
  data () {
    return {
      item: {},
      changeSlick: false,
      cdnUrl: config.cdnUrl,
      cdnUrlPrefix: config.cdnUrlPrefix,
      options: {},
      generatedBreadcrumbs: null,
      selected: {
        item: null,
        option: null,
        frameSizeIndex: 0
      },
      defFrameSizeIndex: -1,
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true,
        credentials: true
      },
      designerUrl: '#',
      slickOptions: {
        autoplay: false,
        pauseOnDotsHover: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        swipeToSlide: true,
        slidesToShow: 1,
        // adaptiveHeight: true,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              dots: true,
              arrows: false
            }
          },
          {
            breakpoint: 1024,
            settings: {
              dots: false,
              arrows: true
            }
          }
        ]
      },
      slickOptionsColours: {
        autoplay: false,
        pauseOnDotsHover: true,
        infinite: true,
        speed: 500,
        cssEase: 'linear',
        swipeToSlide: true,
        slidesToShow: 3,
        slidesToScroll: 1
      },
      wishlist: {
        state: false
      }
    }
  },
  head: {
    title: function () {
      let title = ''
      if (Object.keys(this.item).length > 0) {
        title = this.item.designer.designer_name + ' ' + this.item.model_name
      }
      return {
        inner: title
      }
    }
  },
  beforeUpdate () {
    if (this.selected.option > 0 && this.options[this.selected.option] &&
      this.$refs.slick && this.$refs.slick.$el.slick.$slides && this.changeSlick) {
      this.$refs.slick.destroy()
    }
  },
  updated () {
    if (this.selected.option > 0 && this.options[this.selected.option] &&
      this.$refs.slick && this.$refs.slick.$el.slick.$slides && this.changeSlick) {
      this.$refs.slick.create(this.slickOptions)
    }
  },
  mounted () {
    let itemNumber = this.$route.params.item
    let clearItemNumber = itemNumber.toString().replace('.', '')
    this.fetchItem(clearItemNumber).then(() => {
      this.changeSlick = true
    })
    // this.getWishlistStateItem(clearItemNumber)
  },
  methods: {
    fetchItem (itemId) {
      let self = this
      return this.$axios.get(this.apiHost + config.prefix + config.products.itemFetch, Object.assign({}, this.requestOptions, {params: {item_number: itemId, lang: this.lang}}))
        .then(data => {
          if (data.data.item && Object.keys(data.data.item).length > 1 && data.data.item.options) {
            self.item = data.data.item
            const {main_category: {category_name, category_number, short_name}} = self.item
            self.item.category_number = category_number
            self.item.designer_number = self.item.designer.designer_number
            self.options = data.data.item.options
            self.selected.option = self.item.def_option
            /**
             * @todo if all frame sizes not IN_STOCK status user would put wrong item to basket
             */
            self.defFrameSizeIndex = self.selected.frameSizeIndex = self.options[self.item.def_option].frame_sizes.findIndex(obj => obj.status === 'IN_STOCK')
            if (category_number) {
              self.$http.get(self.apiHost + config.prefix + config.routes.findByCategory + '/' + category_number, self.requestOptions).then(response => response.json())
                .then(json => {
                  if (json.url) {
                    let itemPath = '/' + json.url + '/' + self.reverseRouteName(self.item.designer.designer_name) + '/' + self.reverseRouteName(self.item.model_name) + '/ss' + parseFloat(self.item.item_number / 100).toFixed(2) + '.html'
                    if (self.$route.path !== itemPath) {
                      self.$router.replace(itemPath)
                    }
                    let breadcrumbs = [{title: 'HOME', path: '/'}]
                    if (category_name) {
                      self.designerUrl = {
                        path: '/' + json.url + '/' + self.reverseRouteName(self.item.designer.designer_name),
                        params: {designer_id: self.item.designer.designer_number}
                      }
                      breadcrumbs = breadcrumbs.concat([
                        {title: category_name, path: '/' + json.url},
                        {
                          title: self.item.designer.designer_name,
                          path: self.designerUrl
                        },
                        {title: self.item.model_name, path: '#'}])
                    }
                    self.generatedBreadcrumbs = breadcrumbs
                    if (self.backRoute.path && self.backRoute.path.length > 0 && self.backRoute.params.category_name) {
                      breadcrumbs.splice(-1, 0, {
                        title: self.backRoute.params.category_name,
                        path: self.backRoute.path
                      })
                    }
                    self.$store.dispatch('setBreadcrumbs', breadcrumbs)
                  }
                })
            } else {
              let itemPath = '/' + self.reverseRouteName(short_name) + '/' + self.reverseRouteName(self.item.designer.designer_name) + '/' + self.reverseRouteName(self.item.model_name) + '/ss' + parseFloat(self.item.item_number / 100).toFixed(2) + '.html'
              if (self.$route.path !== itemPath) {
                self.$router.replace(itemPath)
              }
              let breadcrumbs = [{title: 'HOME', path: '/'}]
              if (category_name) {
                let category_path = category_name.split(' ').reverse().join('/').toLowerCase()
                self.designerUrl = {
                  path: '/' + category_path + '/' + self.reverseRouteName(self.item.designer.designer_name),
                  params: {designer_id: self.item.designer.designer_number}
                }
                breadcrumbs = breadcrumbs.concat([
                  {title: category_name, path: '/' + category_path},
                  {
                    title: self.item.designer.designer_name,
                    path: self.designerUrl
                  },
                  {title: self.item.model_name, path: '#'}])
              }
              self.generatedBreadcrumbs = breadcrumbs
              if (self.backRoute.path && self.backRoute.path.length > 0 && self.backRoute.params.category_name) {
                breadcrumbs.splice(-1, 0, {
                  title: self.backRoute.params.category_name,
                  path: self.backRoute.path
                })
              }
              self.$store.dispatch('setBreadcrumbs', breadcrumbs)
            }
          } else {
            self.$router.push('/')
          }
        }, (err) => console.log('err::', err))
    },
    setSelectedOption (id) {
      this.selected.option = id
    },
    setSelectedItem (id, e) {
      this.selected.item = id
      if (e) {
        e.preventDefault()
      }
    },
    setSwitchWishlist (id) {
      let params = {
        item: this.item.item_number,
        option: this.selected.option
      }
      let itemData = {
        id: id,
        type: 'pageitem',
        params: params
      }
      this.$store.dispatch('switchWishlist', itemData)
    },
    getWishlistStateItem (id) {
      let self = this
      this.$axios.post(this.apiHost + config.prefix + config.wishlist.existItemWishlist, {params: {id: id}}).then(function (response) {
        self.wishlist.state = response.data
      }, function (error) {
        console.log(error.statusText)
      })
    },
    reverseRouteName: function (str) {
      return reverseRouteName(str)
    },
    convertPrice: function (price) {
      try {
        return this.calculatePrice(price)
      } catch (e) {
        return parseFloat(this.exchange(price)).toFixed(2)
      }
    },
    animateBars: function () {
      this.$nextTick(function () {
        $('.progress-bar').each(function () {
          let maxAmount = $(this).attr('aria-valuenow')
          $(this).animate(
            {width: maxAmount},
            2000, 'linear'
          )
        })
      })
    }
  },
  watch: {
    'breadcrumbs': {
      handler: function () {
        if (this.breadcrumbs && this.generatedBreadcrumbs && this.breadcrumbs.length === 1 && this.generatedBreadcrumbs.length > 0) {
          this.$store.dispatch('setBreadcrumbs', this.generatedBreadcrumbs)
        }
      }
    },
    'item': {
      handler: function () {
        this.$emit('updateHead')
      },
      deep: true
    }
  }
}
