import SearchModal from '@/components/scripts/PageHeader/LogoLine/SearchModal/index.vue'
import BasketModal from '@/components/scripts/PageHeader/LogoLine/BasketModal/index.vue'
import MainMenu from '@/components/scripts/PageHeader/LogoLine/MainMenu/index.vue'
import ls from 'local-storage'

import { mapState } from 'vuex'

export default {
  name: 'logoLine',
  components: {
    MainMenu,
    SearchModal,
    BasketModal
  },
  data () {
    return {
      order: {},
      ssv4Redirect: false,
      ssv4UserData: {
        id: null
      }
    }
  },
  computed: {
    ...mapState({
      basket: (state) => state.basket,
      integrationHost: (state) => state.integrationHost,
      ssv4User: (state) => state.ssv4User,
      user: (state) =>
        ({
          ...state.user
        }),
      calculatePrice: (state) => state.calculatePrice,
      auth: (state) => state.authorization
    }),
    wishListCount () {
      return this.$store.getters.wishlistCount
    },
    basketOrderCount () {
      return this.basket.order && this.basket.order.orderItems ? this.basket.order.orderItems.filter(item => !item.buy_later).length : 0
    }
  },
  methods: {
    openSidebar () {
      this.$store.dispatch('openSidebar')
    },
    storage (val) {
      this.$store.state.wishlist = JSON.parse(localStorage.getItem('wishlist'))
    }
  },
  mounted: function () {
    if (this.$route.query.sspay) {
      this.ssv4Redirect = true
    }
  },
  created: function () {
    window.globalEvents.$on('setUser', (userData) => (this.ssv4UserData = userData))
    ls.on('wishlist', this.storage)
  }
}
