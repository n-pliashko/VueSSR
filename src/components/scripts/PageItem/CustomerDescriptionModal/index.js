import $ from 'jquery'

export default {
  name: 'CustomerDescriptionModal',
  data () {
    return {
      fitRating: {
        tooSmall: 21,
        modSmall: 14,
        asExpected: 55,
        modLarge: 10,
        tooLarge: 0
      }
    }
  },
  methods: {
    resetBars: function () {
      $('.progress-bar').each(function () {
        console.log('hidden')
        $(this).width(0)
      })
    }
  }
}
