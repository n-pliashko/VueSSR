import PageHeader from '@/components/scripts/PageHeader/index.vue'
import Breadcrumbs from '@/components/scripts/Breadcrumbs/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'
import PreviewBlock from '@/components/scripts/PreviewBlock/index.vue'

export default {
  name: 'BuyingGuides',
  components: {
    PageHeader,
    Breadcrumbs,
    PageFooter,
    PreviewBlock
  },
  data () {
    return {
      blockType: 'secondary',
      boxContents: [
        {
          header: 'Guide to Lenses',
          text: 'The lenses we offer and technology available.',
          links: [
            {
              route: '/guides/lenses/',
              text: 'View Guides »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/guide-to-lenses.jpg?20171207190136'
        },
        {
          header: 'Guide to Face Shapes',
          text: 'A guide to finding the right frame style to suit your face shape.',
          link: '/info/face-shapes/',
          linkText: 'View Guides »',
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/guide-to-face-shapes.jpg?20171207190136'
        },
        {
          header: 'Guide to Frame Measurements',
          text: 'We\'ll decipher the numbers on your glasses and explain what they mean.',
          link: '/guides/how-to/find-right-sized-glasses/',
          linkText: 'View Guides »',
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/guide-to-frame-size.jpg?20171207190136'
        },
        {
          header: 'Guide to Safe Sunglasses for Driving',
          text: 'Find the perfect sunglasses for driving in the summer or winter sun.',
          link: '/guides/how-to-choose-safe-sunglasses-for-driving/',
          linkText: 'View Guides »',
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/guide-driving-sun.jpg?20171207190136'
        },
        {
          header: 'Guide to Kids Sunglasses',
          text: 'Ensuring your childrens eyes are protected from harmful UV rays.',
          link: '/guides/kids-sunglasses/',
          linkText: 'View Guides »',
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/guide-to-kids-sun.jpg?20171207190136'
        },
        {
          header: 'Guide to Goggles',
          text: 'Everything you need to know about goggles for maximum protection and comfort.',
          link: '/guides/ski-mx-goggles/',
          linkText: 'View Guides »',
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/guide-to-goggles.jpg?20171207190136'
        },
        {
          header: 'Guide to Eye Health',
          text: 'Find out more about different eye conditions and ways to ensure good eye health.',
          link: '/eye-health/',
          linkText: 'View Guides »',
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/health-eye-structure.jpg?20171207190136'
        },
        {
          header: '\'How to\' Guides',
          text: 'A series of guides on how to get the best out of your glasses or sunglasses.',
          link: '/guides/how-to/',
          linkText: 'View Guides »',
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/featured-pages/hub-index/howto.jpg?20171207190136'
        }
      ]
    }
  }
}
