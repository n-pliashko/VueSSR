import $ from 'jquery'

export default {
  name: 'FlashMessage',
  computed: {
    classType: function () {
      switch (this.message.type) {
        case 'success':
          return 'success-message'
        case 'error':
          return 'error-message'
        default:
          return 'error-message'
      }
    }
  },
  props: {
    message: {
      type: Object,
      default () {
        return {
          type: 'success', // pass -> error or success type should be
          text: 'Message text to be passed from response'  // pass text of a message
        }
      }
    },
    hide: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  updated () {
    if (this.hide) {
      return
    }

    $('#message').show()
    setTimeout(function () {
      $('#message').slideUp('slow', 'linear')
    }, 10000)
  },
  mounted () {
    if (this.hide) {
      return
    }

    $(this).ready(function () {
      $('#message').show()
      setTimeout(function () {
        $('#message').slideUp('slow', 'linear')
      }, 10000)
    })
  }
}
