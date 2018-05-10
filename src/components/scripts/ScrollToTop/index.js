import $ from 'jquery'

export default {
  name: 'ScrollToTop',
  mounted: function () {
    $(document.body).scroll(function (e) {
      if ($(this).scrollTop() > 800) {
        $('#backToTop').fadeIn()
      } else {
        $('#backToTop').fadeOut()
      }
    })
  },
  methods: {
    scrollToTop: function () {
      $(document.body).animate({
        scrollTop: 0
      }, 800)
      return false
    }
  }
}
