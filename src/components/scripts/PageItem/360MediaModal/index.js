import 'babel-loader!../../../../assets/js/spritespin/spritespin.js'

export default {
  name: 'Media360Modal',
  props: ['images'],
  data () {
    return {
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
  mounted () {
    this.create()
  },
  methods: {
    create () {
      var img = new Image()
      let self = this
      img.onload = function () {
        var first360width = this.width
        var first360height = this.height
        var mult = 650 / first360width
        self.loadSpritespin(first360height, mult)
      }
      img.src = this.img360_url[0]
    },
    loadSpritespin (first360height, mult) {
      window.jQuery('#block360').spritespin({
        source: this.img360_url.reverse(),
        width: parseInt(605),
        height: parseInt(first360height * mult),
        animate: true,
        frameTime: 100
      })
    }
  },
  watch: {
    'img360_url': function () {
      this.create()
    }
  }
}
