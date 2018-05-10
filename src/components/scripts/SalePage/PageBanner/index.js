import {mapState} from 'vuex'

export default {
  name: 'PageBanner',
  computed: {
    ...mapState({
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack
    })
  }
}
