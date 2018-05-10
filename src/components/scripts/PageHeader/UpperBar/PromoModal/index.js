import {mapState} from 'vuex'

export default {
  name: 'PromoModal',
  computed: {
    ...mapState({
      currency: (state) => ({...state.currency.allCurrency[state.currency.selected]}),
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack
    })
  }
}
