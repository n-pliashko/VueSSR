import Slideout from 'vue-slideout'
import SideBar from '@/components/scripts/PageHeader/LogoLine/SideBar/index.vue'
import SearchModal from '@/components/scripts/PageHeader/LogoLine/SearchModal/index.vue'
import BasketModal from '@/components/scripts/PageHeader/LogoLine/BasketModal/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'CheckoutHeaderSmall',
  components: {
    Slideout,
    SideBar,
    SearchModal,
    BasketModal
  },
  computed: {
    ...mapState({
      basket: (state) => state.basket,
      user: (state) => ({
        ...state.user
      })
    })
  }
}
