export default {
  name: 'sort',
  data () {
    return {
      sort: 'pageviews',
      selected: 'pageviews'
    }
  },
  methods: {
    clearAll: function () {
      Object.keys(this.$parent.filters).map(key => {
        this.$parent.filters[key] = []
      })
    }
  },
  watch: {
    selected: {
      handler: function () {
        if (this.sort !== '' || (this.sort === '' && this.selected !== 'pageviews')) {
          Object.assign(this.$parent.filters, {sort: this.selected})
        }
        this.sort = this.selected
      }
    },
    '$parent.filters.sort': {
      handler: function () {
        this.sort = this.$parent.filters.sort
        if (this.sort === '') {
          this.selected = 'pageviews'
        } else {
          this.selected = this.sort
        }
      },
      deep: true
    }
  }
}
