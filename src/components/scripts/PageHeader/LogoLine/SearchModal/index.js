export default {
  name: 'SearchModal',
  data () {
    return {
      inputSearchText: ''
    }
  },
  methods: {
    handleSubmit: function (e) {
      e.preventDefault()
      if (this.inputSearchText) {
        this.$router.push({name: 'ProductListSearch', params: {search_term: this.inputSearchText}})
      } else {
        e.stopPropagation()
      }
    }
  }
}
