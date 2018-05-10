export default {
  name: 'pagination',
  computed: {
    disabledNext: function () {
      return this.$parent.pagination.skip + this.$parent.pagination.limit > this.$parent.items.total
    },
    disabledPrevious: function () {
      return this.$parent.pagination.skip === 0
    }
  },
  methods: {
    loadNext: function () {
      this.$parent.pagination.skip += this.$parent.pagination.limit
      this.$parent.pagination.currentPage++
    },
    loadPrevious: function () {
      this.$parent.pagination.skip -= this.$parent.pagination.limit
      this.$parent.pagination.currentPage--
    }
  },
  watch: {
    '$parent.pagination.currentPage': function () {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: this.$parent.pagination.currentPage
        }
      })
    }
  }
}
