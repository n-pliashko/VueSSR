import { mapState } from 'vuex'

export default {
  name: 'CheckoutUpperBar',
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      currencies: (state) => state.currency.allCurrency,
      selectedCurrency: (state) => state.currency.selected,
      user: (state) => ({...state.user})
    })
  },
  methods: {
    setCurrency (e) {
      this.$store.dispatch('setCurrency', e.target.value)
    }
  }
}
