import { mapState } from 'vuex'
import Vue from 'vue'
import VueResource from 'vue-resource'
import PageHeader from '@/components/scripts/PageHeader/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import Address from '@/components/scripts/Address/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import config from '@/../config'
import Validator from '@/components/scripts/Validator'
import Flash from '@/components/scripts/FlashMessage/index.vue'

Vue.use(VueResource)

export default {
  name: 'Profile',
  components: {
    PageHeader,
    NavigationLinks,
    'address-form': Address,
    PageFooter,
    Flash
  },
  computed: {
    ...mapState({
      data: (state) => {
        const {user: {profile: data}} = state
        const {...profile} = data

        return {
          profile
        }
      },
      meta: (state) => {
        let val = new Validator('profile')
        const result = val.prepare(state)

        if (!result.formError.profile) {
          result.formError.profile = {}
        }

        if (!result.formError.billingAddress) {
          result.formError.billingAddress = {}
        }

        if (!result.formError.deliveryAddress) {
          result.formError.deliveryAddress = {}
        }

        if (!result.formError.alt_deliveryAddress) {
          result.formError.alt_deliveryAddress = {}
        }

        return result
      },
      loading: (state) => state.loading,
      user: (state) => {
        const {...user} = state.user
        return user
      },
      profile: (state) => {
        const {user: {profile: data}} = state
        const {...profile} = data
        return profile
      },
      billing_address: (state) => {
        const {profile: {addresses}} = state.user
        return addresses.find((item) => {
          return item.address_type === 'billing'
        }) || {
          address_type: 'billing'
        }
      },
      delivery_address: (state) => {
        const {profile: {addresses}} = state.user
        return addresses.find((item) => {
          return item.address_type === 'delivery'
        }) || {
          address_type: 'delivery'
        }
      },
      alt_delivery_address: (state) => {
        const {profile: {addresses}} = state.user

        return addresses.find((item) => {
          return item.address_type === 'alt_delivery'
        }) || {
          address_type: 'alt_delivery'
        }
      },
      apiHost: (state) => state.apiHost,
      auth: (state) => state.authorization
    })
  },
  data () {
    return {
      countries: {},
      languages: {},
      currencies: {},
      addresses: {}
    }
  },
  methods: {
    fetchCountries () {
      const {hashedPassword} = this.user
      Vue.http.headers.common['Authorization'] = 'Basic ' + btoa(hashedPassword + ':')
      Vue.http.get(this.apiHost + config.prefix + config.profiles.countries)
        .then((data) => (this.countries = data.body.items), (err) => console.log('err::', err))
    },
    fetchLanguages () {
      const {hashedPassword} = this.user
      Vue.http.headers.common['Authorization'] = 'Basic ' + btoa(hashedPassword + ':')
      Vue.http.get(this.apiHost + config.prefix + config.profiles.languages)
        .then((data) => (this.languages = data.body.items), (err) => console.log('err::', err))
    },
    fetchCurrencies () {
      const {hashedPassword} = this.user
      Vue.http.headers.common['Authorization'] = 'Basic ' + btoa(hashedPassword + ':')
      Vue.http.get(this.apiHost + config.prefix + config.profiles.currencies)
        .then((data) => (this.currencies = data.body.items), (err) => console.log('err::', err))
    },
    onSubmit (e) {
      var form = e.currentTarget.closest('form')
      let keys = Object.keys(this.addresses)
      let addresses = {}
      let promise = Promise.resolve(false)

      e.preventDefault()
      e.stopPropagation()

      form.classList.add('was-validated')
      var invalids = form.querySelectorAll('.form-control.is-invalid, .form-control:invalid')
      for (var i = 0; i < invalids.length; i++) {
        invalids[i].parentNode.classList.add('is-invalid-group')
      }

      if (keys.length > 0) {
        this.data.profile.addresses.map(address => {
          addresses[address.address_type] = address
        })
        keys.map(key => {
          let address = this.addresses[key]
          address.profile_id = this.data.profile.profile_number
          addresses[key] = address
          promise = promise.then((data) => {
            if (data) {
              addresses[data.address_type] = data
            }
            return this.$store.dispatch('onSubmitAddress', {e, address})
          })
        })
      }

      promise.then((data) => {
        if (data) {
          addresses[data.address_type] = data
        }
        this.data.profile.addresses = []
        Object.keys(addresses).map(key => {
          this.data.profile.addresses.push(addresses[key])
        })
        return this.$store.dispatch('onSubmitProfile', this.data)
      })
    },
    setAddress (data) {
      if (!data || !data.address_type) {
        return
      }
      this.addresses[data.address_type] = data
    }
  },
  mounted () {
    this.fetchCountries()
    this.fetchCurrencies()
    this.fetchLanguages()
  }
}
