import {mapState} from 'vuex'

import PageHeader from '@/components/scripts/PageHeader/index.vue'
import NavigationLinks from '@/components/scripts/NavigationLinks/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'

import config from '@/../config'
import Vue from 'vue'
import VueRes from 'vue-resource'

Vue.use(VueRes)

export default {
  name: 'Reviews',
  components: {
    PageHeader,
    NavigationLinks,
    PageFooter,
    ScrollToTop
  },
  computed: {...mapState({
    data: (state) => {
      const {user: {profile: data}} = state
      const {...profile} = data

      return {
        step: 1,
        ...state.formData['login'],
        profile
      }
    },
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
      items: {
        has_no_review: {},
        has_review: {}
      }
    }
  },
  methods: {
    loadItemsReview: function () {
      let self = this
      Vue.http.get(config.apiHost + config.prefix + config.reviews.reviewList).then(function (response) {
        self.items = response.data
      }, function (error) {
        console.log(error.statusText)
      })
    }
  },
  mounted () {
    this.loadItemsReview()
  }
}
