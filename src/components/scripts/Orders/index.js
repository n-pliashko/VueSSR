import { mapState } from 'vuex'
import moment from 'moment'

import PageHeader from '@/components/scripts/PageHeader/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'

export default {
  name: 'Orders',
  components: {PageHeader, NavigationLinks, PageFooter},
  computed: {
    ...mapState({
      meta: (state) => ({
        ...state.formMeta.orders || {}
      }),
      loading: (state) => state.loading,
      orderLoading: (state) => state.orderLoading,
      apiHost: (state) => state.apiHost,
      user (state) {
        const {...user} = state.user

        if (user.user_number && !this.loaded++) {
          this.loaded = true
          this.fetchOrders(user)
        }

        return user
      },
      profile: (state) => {
        const {user: {profile: data}} = state
        const {...profile} = data

        return profile
      },
      orders: (state) => (state.orders || []),
      currencies: (state) => (state.currency.allCurrency || []),
      auth: (state) => state.authorization,
      exchange: (state) => state.currency.exchange,
      exchangeBack: (state) => state.currency.exchangeBack,
      vat: (state) => state.vat
    })
  },
  data () {
    return {
      period: 'half',
      'loaded': 0,
      'processed': [],
      'unprocessed': []
    }
  },
  watch: {
    orders (data) {
      if (!data || !data.length) {
        return []
      }
      this.acceptOrders('processed', 'unprocessed', this.orders.filter(order => (!!order.payment_record_id)))
      this.acceptOrders('unprocessed', 'processed', this.orders.filter(order => (!order.payment_record_id)))
    },
    user: () => {}
  },
  methods: {
    fetchOrders (user) {
      if (!user.user_number) {
        return
      }
      const time = moment(this.period === 'half' ? moment(new Date()).add(-6, 'month') : new Date((new Date()).getFullYear() + '-01-01 00:00:00')).format('YYYY-MM-DD HH:mm:ss')
      return this.$store.dispatch('fetchOrders', {user, time})
    },
    moment,
    deleteOrder (id) {
      const key = this.unprocessed.findIndex(item => (item.order_number == id))
      this.unprocessed.splice(key, 1)
      this.$store.dispatch('deleteOrder', {id, user: this.user})
        .then(() => this.$store.dispatch('getBasket'))
        .then(() => this.fetchOrders(this.user))
    },
    acceptOrders (field, remove, all) {
      all.map(item => {
        const key = this[field].findIndex(jtem => (jtem.order_number === item.order_number))

        const rkey = this[remove].findIndex(jtem => (jtem.order_number === item.order_number))
        if (rkey >= 0) {
          this[remove].splice(rkey, 1)
        }

        if (key === -1) {
          this[field].push(item)
          return
        }

        const old = this[field][key]
        Object.keys(old).map(jey => {
          old[jey] = item[jey]
        })
      })
    }
  },

  unmount () {
    this.loaded = 0
  }
}
