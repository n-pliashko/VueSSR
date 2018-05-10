import FilterBlock from '@/components/scripts/Products/FilterBlock/index.vue'
import FilterBlockMobile from '@/components/scripts/Products/FilterBlockMobile/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'filter_list',
  components: {FilterBlock, FilterBlockMobile},
  data () {
    return {
      priceTo: '',
      priceFrom: '',
      armFrom: '',
      armTo: '',
      bridgeFrom: '',
      bridgeTo: '',
      lensFrom: '',
      lensTo: ''
    }
  },
  computed: {
    ...mapState({
      exchangeBackFuncByCurrency: (state) => state.currency.exchangeBackFuncByCurrency,
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack,
      calculatePrice: (state) => state.calculatePrice,
      vat: (state) => state.vat
    }),
    loading: function () {
      return !(this.$parent.filtersList && Object.keys(this.$parent.filtersList).length > 0)
    },
    isSelectedFilters: function () {
      return Object.values(this.$parent.filters).findIndex(obj => obj && obj.length > 0) !== -1
    },
    _priceFrom: function () {
      return this.getFilterFrom('price_from', 'priceFrom')
    },
    _priceTo: function () {
      return this.getFilterTo('price_to', 'priceTo')
    },
    _armFrom: function () {
      return this.getFilterFrom('arm_from', 'armFrom')
    },
    _armTo: function () {
      return this.getFilterTo('arm_to', 'armTo')
    },
    _bridgeFrom: function () {
      return this.getFilterFrom('bridge_from', 'bridgeFrom')
    },
    _bridgeTo: function () {
      return this.getFilterTo('bridge_to', 'bridgeTo')
    },
    _lensFrom: function () {
      return this.getFilterFrom('lens_from', 'lensFrom')
    },
    _lensTo: function () {
      return this.getFilterTo('lens_to', 'lensTo')
    }
  },
  methods: {
    getFilterFrom (filterName, itemName) {
      let result = ''
      if (this.$parent.filters[filterName].length > 0) {
        result = this.$parent.filters[filterName]
      } else if (this.$parent.calculatedItems[itemName] >= 0) {
        result = 0
      }
      return !isNaN(parseInt(result)) ? parseInt(result) : result
    },
    getFilterTo (filterName, itemName) {
      let result = ''
      if (this.$parent.filters[filterName].length > 0) {
        result = this.$parent.filters[filterName]
      } else if (this.$parent.calculatedItems[itemName] >= 0 && !isNaN(parseFloat(this.$parent.calculatedItems[itemName]))) {
        result = parseFloat(this.$parent.calculatedItems[itemName]) + 1
      }
      return !isNaN(parseInt(result)) ? parseInt(result) : result
    },
    clearAllFilters: function () {
      Object.keys(this.$parent.filters).map(key => {
        if (Array.isArray(this.$parent.filters[key])) {
          this.$parent.filters[key] = []
        } else {
          this.$parent.filters[key] = ''
        }
      })
    },
    changePrice: function () {
      let _price = {
        price_from: this.priceFrom,
        price_to: this.priceTo
      }
      Object.assign(this.$parent.filters, _price)
    },
    changeArm: function () {
      let _arm = {
        arm_from: this.armFrom.length > 0 ? this.armFrom : this._armFrom,
        arm_to: this.armTo.length > 0 ? this.armTo : this._armTo
      }
      Object.assign(this.$parent.filters, _arm)
    },
    changeBridge: function () {
      let _bridge = {
        bridge_from: this.bridgeFrom.length > 0 ? this.bridgeFrom : this._bridgeFrom,
        bridge_to: this.bridgeTo.length > 0 ? this.bridgeTo : this._bridgeTo
      }
      Object.assign(this.$parent.filters, _bridge)
    },
    changeLens: function () {
      let _lens = {
        lens_from: this.lensFrom.length > 0 ? this.lensFrom : this._lensFrom,
        lens_to: this.lensTo.length > 0 ? this.lensTo : this._lensTo
      }
      Object.assign(this.$parent.filters, _lens)
    },
    handleInput: function (name, value, event) {
      let min = event.target.attributes && event.target.attributes.min ? event.target.attributes.min.nodeValue : 0
      let max = event.target.attributes && event.target.attributes.max ? event.target.attributes.max.nodeValue : 0

      let add_min = event.target.attributes && event.target.attributes.add_min ? event.target.attributes.add_min.nodeValue : 0
      let add_max = event.target.attributes && event.target.attributes.add_max ? event.target.attributes.add_max.nodeValue : 0

      if (add_min && parseInt(value) < parseInt(add_min)) {
        value = add_min
      }
      if (add_max && parseInt(value) > parseInt(add_max)) {
        value = add_max
      }

      if (parseInt(value) < parseInt(min)) {
        value = min
      }
      if (max && parseInt(value) > parseInt(max)) {
        value = max
      }
      this[name] = value
    },
    checkInput: function (event) {
      if (!(event.charCode >= 48 && event.charCode <= 57) && event.charCode !== 13) {
        event.preventDefault()
      }
      if (event.charCode === 13) {
        event.target.blur()
        this.$forceUpdate()
      }
    },
    convertPrice (price) {
      try {
        return this.calculatePrice(price)
      } catch (e) {
        return this.exchange(price)
      }
    },
    convertPriceBack (price, currency) {
      try {
        return this.vat(this.exchangeBackFuncByCurrency(price, currency), true).price
      } catch (e) {
        return this.exchangeBackFuncByCurrency(price)
      }
    }
  },
  watch: {
    currency (val, old) {
      if (old.rate) {
        let _price = {}
        if (this.$parent.filters.price_to) {
          let price = this.convertPriceBack(this.$parent.filters.price_to, old)
          _price.price_to = Math.ceil(this.convertPrice(price)).toString()
        }

        if (this.$parent.filters.price_from) {
          let price = this.convertPriceBack(this.$parent.filters.price_from, old)
          _price.price_from = parseInt(this.convertPrice(price)).toString()
        }

        if (_price) {
          Object.assign(this.$parent.filters, _price)
        }
      }
    },
    '$parent.filters.price_from': {
      handler: function () {
        this.priceFrom = this.$parent.filters.price_from
      },
      deep: true
    },
    '$parent.filters.price_to': {
      handler: function () {
        this.priceTo = this.$parent.filters.price_to
      },
      deep: true
    }
  }
}
