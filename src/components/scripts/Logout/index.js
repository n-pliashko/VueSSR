import {mapState} from 'vuex'
import PageHeader from '@/components/scripts/PageHeader/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'

export default {
  name: 'Logout',
  components: {
    PageHeader,
    PageFooter
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
      auth: (state) => state.authorization
    })
  },
  created () {
    this.$store.dispatch('onLogout', this.$router)
  }
}
