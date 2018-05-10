import {mapState} from 'vuex'
import moment from 'moment'

import PageHeader from '@/components/scripts/PageHeader/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import config from '@/../config'

export default {
  name: 'Order',
  components: {PageHeader, NavigationLinks, PageFooter},
  computed: {
    ...mapState({
      meta: (state) => ({
        ...state.formMeta.orders || {}
      }),
      loading: (state) => state.loading,
      apiHost: (state) => state.apiHost,
      user: (state) => {
        const {...user} = state.user

        return user
      },
      profile: (state) => {
        const {user: {profile: data}} = state
        const {...profile} = data

        return profile
      }
    })
  },
  data () {
    return {
      currencies: [],
      countries: [],
      deliveryAddressLine: undefined,
      order: undefined
    }
  },
  props: {
    id: {
      type: String,
      default: undefined
    }
  },
  methods: {
    fetchCurrencies () {
      const {hashedPassword} = this.user
      this.$axios.get(this.apiHost + config.prefix + config.profiles.currencies, {
        headers: {
          Authorization: 'Basic ' + btoa(hashedPassword + ':')
        }
      })
        .then((data) => {
          this.currencies = []
          data.data.items.forEach((item) => (this.currencies[item.number] = item))
        }, (err) => console.log('err::', err))
    },
    fetchCountries () {
      const {hashedPassword} = this.user
      this.$axios.get(this.apiHost + config.prefix + config.profiles.countries, {
        headers: {
          Authorization: 'Basic ' + btoa(hashedPassword + ':')
        }
      })
        .then((data) => {
          this.countries = []
          data.data.items.forEach((item) => (this.countries[item.number] = item))
        }, (err) => console.log('err::', err))
    },
    fetchOrder () {
      const {hashedPassword} = this.user
      this.$axios.get(this.apiHost + config.prefix + config.orders.get + '/' + this.id, {
        headers: {
          Authorization: 'Basic ' + btoa(hashedPassword + ':')
        }
      }).then((data) => (this.order = data.data), (err) => console.log('err::', err))
    },
    moment
  },
  watch: {
    user (data) {
      if (data.user_number) {
        this.fetchCurrencies()
        this.fetchCountries()
        this.fetchOrder()
      }
    },
    order (data) {
      const {deliveryAddress: address} = data
      if (address) {
        this.deliveryAddressLine = address.line1 + ','
        this.deliveryAddressLine += address.line2 ? address.line2 + ',' : ''
        this.deliveryAddressLine += address.town + ','
        this.deliveryAddressLine += address.zip + ','
        this.deliveryAddressLine += this.countries[address.country_id].translation
        console.log(this.deliveryAddressLine)
      }
    }
  },
  mounted () {
    if (this.user.user_number) {
      this.fetchCurrencies()
      this.fetchCountries()
      this.fetchOrder()
    }
  }
}
