import Vue from 'vue'
import circlr from 'circlr'

export default {
  name: 'Media360Modal',
  props: ['images'],
  data () {
    return {
      crl: null,
      img360_urlConst: [
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/01.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/02.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/03.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/04.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/05.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/06.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/07.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/08.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/09.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/10.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/11.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/12.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/13.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/14.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/15.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/16.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/17.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/18.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/19.jpg',
        'https://d9qzjwuieyamt.cloudfront.net/public/sd/res/360/161022/1/20.jpg'
      ]
    }
  },
  computed: {
    img360_url () {
      return this.images
    }
  },
  methods: {
    create () {
      const el = document.querySelector('#block360')
      this.crl = circlr(el)
        .reverse(true)
        .interval(200)
        .play()
    },
  },
  watch: {
    'img360_url': function () {
      if (this.crl) {
        this.crl.stop()
          .start(0)
      }
      Vue.nextTick(() => {
        this.create()
      })
    }
  }
}
