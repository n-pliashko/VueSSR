import { mapState } from 'vuex'

export default {
  name: 'BasketModal',
  computed: {
    ...mapState({
      basket: (state) => {
        return {
          ...state.basket
        }
      }
    }),
    hasProducts: function () {
      return this.basket.order && this.basket.order.totalItems > 0
    }
  },
  mounted () {
    if (this.$route.params.addPrice) {
     // this.$store.dispatch('putAdditionalPrice', this.$route.params.addPrice)
    }
  },
  methods: {
    checkout: function () {
    }
  }
}
