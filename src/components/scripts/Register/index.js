import { mapState } from 'vuex'
import $ from 'jquery'
import Vue from 'vue'
import VueResource from 'vue-resource'
import PageHeader from '@/components/scripts/PageHeader/index.vue'
import Profile from '@/components/scripts/Profile/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import Address from '@/components/scripts/Address/index.vue'
import config from '@/../config'
import Validator from '@/components/scripts/Validator'

Vue.use(VueResource)

export default {
  name: 'Register',
  components: {
    PageHeader,
    'edit-profile-form': Profile,
    'address-form': Address,
    PageFooter
  },
  computed: {
    ...mapState({
      data: (state) => {
        return {
          title: 'Mr.',
          ...state.formData['login']
        }
      },
      meta: (state) => {
        let val = new Validator('login')
        const result = val.prepare(state)

        if (!result.formError.profile) {
          result.formError.profile = {}
        }
        if (!result.formError.profile.billingAddress) {
          result.formError.profile.billingAddress = {}
        } else {
          result.formError.profile.billingAddress = result.formError.profile.billingAddress[0]
        }
        if (!result.formError.profile.deliveryAddress) {
          result.formError.profile.deliveryAddress = {}
        } else {
          let delivery = {}
          let data = result.formError.profile.deliveryAddress[0]
          Object.keys(data).map(key => {
            delivery['d_' + key] = data[key]
          })
          result.formError.profile.deliveryAddress = delivery
        }

        return result
      },
      loading: (state) => state.loading,
      user: (state) => {
        const {...user} = state.user
        return user
      },
      profile: (state) => {
        const {user: {profile: data = {}}} = state
        const {...profile} = data
        return profile
      },
      billing_address: (state) => {
        const {profile = {}} = state.user
        const {addresses = []} = profile
        return addresses.find((item) => {
          return item.address_type === 'billing'
        }) || {
          address_type: 'billing'
        }
      },
      delivery_address: (state) => {
        const {profile = {}} = state.user
        const {addresses = []} = profile
        return addresses.find((item) => {
          return item.address_type === 'delivery'
        }) || {
          address_type: 'delivery'
        }
      },
      alt_delivery_address: (state) => {
        const {profile = {}} = state.user
        const {addresses = []} = profile

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
      showDeliveryBlock: 'hidden',
      billing_as_delivery: 1,
      showPassword: 'Show'
    }
  },
  methods: {
    changePasswordVisibility () {
      let pass = $('#rPassword')
      if (this.showPassword === 'Hide') {
        pass.attr('type', 'password')
        this.showPassword = 'Show'
      } else {
        pass.attr('type', 'text')
        this.showPassword = 'Hide'
      }
    },
    fetchCountries () {
      const {hashedPassword} = this.user
      Vue.http.headers.common['Authorization'] = 'Basic ' + btoa(hashedPassword + ':')
      Vue.http.get(this.apiHost + config.prefix + config.profiles.countries)
        .then((data) => (this.countries = data.body.items), (err) => console.log('err::', err))
    },
    onSubmit (e) {
      e.preventDefault()

      const user = {
        user_number: this.user.user_number,
        email: this.data.email,
        password: this.data.password,
        profile: {
          profile_number: this.profile.profile_number,
          email: this.data.email,
          subscribed: this.data.subscribed,
          first_name: this.data.first_name,
          last_name: this.data.last_name,
          title: this.data.title,
          phone: this.data.phone,
          addresses: [
            this.billing_address,
            (this.billing_as_delivery ? {
              ...this.billing_address,
              address_type: 'delivery',
              number: this.delivery_address.number
            } : this.delivery_address)
          ]
        }
      }

      this.$store.dispatch('createNewUser', {data: user, router: this.$router})
    }
  },
  mounted () {
    if (!this.data.email) {
      this.$router.push('login')
      return
    }
    this.fetchCountries()
  },
  watch: {
    user (state) {
      if (state.active) {
        this.$router.push('profile/edit')
      }
    },
    meta (data) {
      let val = new Validator()
      val.goto(data.formError)
    }
  }
}
