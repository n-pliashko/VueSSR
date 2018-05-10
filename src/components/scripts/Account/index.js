import PageHeader from '@/components/scripts/PageHeader/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import AccountLinks from '@/components/scripts/Account/AccountLinks/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'Account',
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      user: state => ({...state.user}),
      auth: (state) => state.authorization
    })
  },
  components: {
    PageHeader,
    NavigationLinks,
    AccountLinks,
    TrustpilotWidget,
    PageFooter,
    ScrollToTop
  }
}
