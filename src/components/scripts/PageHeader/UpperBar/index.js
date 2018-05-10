import PromoModal from '@/components/scripts/PageHeader/UpperBar/PromoModal/index.vue'
import {mapState} from 'vuex'

export default {
  name: 'UpperBar',
  components: {PromoModal},
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      currencies: (state) => state.currency.allCurrency,
      selectedCurrency: (state) => state.currency.selected,
      calculatePrice: (state) => state.calculatePrice
    })
  },
  methods: {
    setCurrency(e) {
      this.$store.dispatch('setCurrency', e.target.value)
    }
  }
}
