import PageHeader from '@/components/scripts/PageHeader/index.vue'
import PaymentsTypes from '@/components/scripts/PageFooter/FooterNavigation/PaymentsTypes/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ConfirmDeleteModal from './ConfirmDeleteModal/index.vue'
import DeliveryInfoModal from './DeliveryInfoModal/index.vue'
import ReturnsInfoModal from './ReturnsInfoModal/index.vue'
import TermsInfoModal from './TermsInfoModal/index.vue'

import { mapState } from 'vuex'
import {reverseRouteName} from '@/../config/helper'
import $ from 'jquery'
import config from '@/../config'

export default {
  name: 'Basket',
  components: {
    PageHeader,
    PaymentsTypes,
    TrustpilotWidget,
    PageFooter,
    ConfirmDeleteModal,
    DeliveryInfoModal,
    ReturnsInfoModal,
    TermsInfoModal
  },
  data () {
    return {
      cdnUrl: config.cdnUrl + '/',
      delOrderedItemID: null,
      hasDiscount: false,
      promoCode: undefined,
      hasExpress: false,
      movedItem: '',
      movedTo: '',
      showInfo: false
    }
  },
  computed: {
    ...mapState({
      basket: (state) => ({...state.basket}),
      meta: (state) => ({
        ...state.formMeta['basket']
      }),
      basketLoading: (state) => {
        return state.basketLoading
      },
      loading: (state) => {
        return state.loading
      },
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      wishlist: (state) => state.wishlist,
      exchange: (state) => state.currency.exchange
    }),
    items () {
      const {...data} = this.basket
      if (!data || !data.order || !data.order.orderItems) {
        return []
      }
      return data.order.orderItems.filter(item => !item.buy_later) || []
    },
    laterItems () {
      const {...data} = this.basket
      if (!data || !data.order || !data.order.orderItems) {
        return []
      }
      return data.order.orderItems.filter(item => item.buy_later) || []
    },
    hasProducts: function () {
      return this.basket.order && this.basket.order.totalItems > 0
    },
    basketOrderCount () {
      return this.basket.order && this.basket.order.orderItems ? this.basket.order.orderItems.filter(item => !item.buy_later).length : 0
    },
    savedAmount: function () {
      return this.basket.order ? this.basket.order.orderItems.filter(item => item.buy_later).length : 0
    },
    somethingSaved: function () {
      return this.savedAmount > 0
    }
  },
  methods: {
    convertPrice: function (price) {
      try {
        return parseFloat(this.exchange(this.vat(price).price)).toFixed(2)
      } catch (e) {
        return parseFloat(this.exchange(price)).toFixed(2)
      }
    },
    getTotal () {
      return (parseFloat(this.calculatePrice(this.basket.order ? this.basket.order.order_amount: 0.00)) +
        parseFloat(this.exchange(this.basket.order ? this.basket.order.shipping_cost : 0.00))).toFixed(this.currency && this.currency.precis || 2)
    },
    assignItems (field, newItems) {
      newItems.map(item => {
        const index = this[field].findIndex(jtem => jtem.ordered_item_number == item.ordered_item_number)
        if (index >= 0) {
          Object.keys(item).map(key => {
            this[field][index][key] = item[key]
          })
          return
        }

        this[field].push(item)
      })

      this[field].map((item, index) => {
        const jndex = newItems.findIndex(jtem => jtem.ordered_item_number == item.ordered_item_number)
        if (jndex < 0) {
          this[field].splice(index, 1)
        }
      })
    },
    checkout: function () {
      this.$router.push('/payment/' + this.basket.order.hash)
    },
    changeQtyItem (itemOrderedID, e) {
      let data = {
        'quantity': e.target.value,
        'ordered_item_number': itemOrderedID
      }
      this.$store.dispatch('setQtyItem', data)
    },
    removeItem (itemID) {
      this.$store.dispatch('removeItemFromBasket', itemID)
    },
    reverseRouteName: function (str, defaultName = 'route-name') {
      if (str && str.length > 0) {
        return reverseRouteName(str)
      }
      return defaultName
    },
    addToSave: function (itemID) {
      this.$store.dispatch('addToSave', itemID)
      this.showMovedBlock(itemID, 'later')
    },
    delFromSave: function (itemID) {
      this.$store.dispatch('delFromSave', itemID)
      this.showMovedBlock(itemID, 'basket')
    },
    submitDiscount (e) {
      e.preventDefault()
      this.$store.dispatch('onSubmitPromoCode', this.promoCode)
    },
    toggleDiscountBox (e) {
      e.preventDefault()
      this.hasDiscount = !this.hasDiscount
    },
    showMovedBlock (id, to) {
      let self = this
      if (!!id.designerName && !!id.modelName) {
        this.movedItem = id.designerName + ' ' + id.modelName
      } else {
        this.movedItem = 'The item '
      }
      if (to === 'basket') {
        self.movedTo = 'the Shopping Basket'
        $('#savedToBasketBlock').fadeIn()
        $(window).on('beforeunload', function () {
          $('#savedToBasketBlock').fadeOut()
        })
      } else if (to === 'later') {
        self.movedTo = 'Saved for Later'
        $('#savedForLaterBlock', '#saveForLaterEmptyBasket').fadeIn()
        $(window).on('beforeunload', function () {
          $('#savedForLaterBlock', '#saveForLaterEmptyBasket').fadeOut()
        })
      }
      this.showInfo = true
    },
    getItemPrice (item) {
      return this.calculatePrice(parseFloat(item.option.price) * parseInt(item.quantity))
    }
  },
  mounted () {
   /* if (this.$route.params.addPrice) {
       this.$store.dispatch('putAdditionalPrice', this.$route.params.addPrice)
    } */
  },
  created () {
    $('#emptyBasketWithSavedBlock').show()
  }
}
