import { mapState } from 'vuex'
import PageHeader from '@/components/scripts/PageHeader/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'
import Breadcrumbs from '@/components/scripts/Breadcrumbs/index.vue'

import { reverseRouteName } from '@/../config/helper'

export default {
  name: 'BrandList',
  components: {
    PageHeader,
    PageFooter,
    ScrollToTop,
    Breadcrumbs
  },
  computed: {
    ...mapState({
      apiHost: (state) => state.apiHost,
      routerObj: (state) => state.pageMenuDescription,
      brands: (state) => {
        return state.promiseData && state.promiseData.brands ? state.promiseData.brands : []
      }
    }),
    path: function () {
      return this.routerObj && this.routerObj.categoryPath ? this.routerObj.categoryPath : this.$route.path
    }
  },
  data () {
    return {
      requestOptions: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        emulateJSON: true,
        credentials: true
      }
    }
  },
  asyncData ({store, route}) {
    return store.dispatch('loadBrandsList')
  },
  destroyed () {
    this.$store.dispatch('clearPromiseData')
  },
  created() {
    this.$store.dispatch('loadBrandsList')
  },
  methods: {
    reverseRouteName: function (str) {
      return reverseRouteName(str)
    }
  }
}
