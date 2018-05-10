import $ from 'jquery'

export default {
  name: 'VideoModal',
  mounted () {
    $('.modal .close').on('click', function (e) {
      var o = $('.modal').find('iframe')
      o.each(function (e, o) {
        $(o).attr('src', $(o).attr('src'))
      })
    })
  }
}
