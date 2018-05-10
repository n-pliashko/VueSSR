import PreviewBlock from '@/components/scripts/PreviewBlock/index.vue'

export default {
  name: 'Guides',
  components: {
    PreviewBlock
  },
  data () {
    return {
      blockType: 'main',
      boxContents: [
        {
          header: 'Buying Guides',
          text: 'View our guides to helping you choose the right product for you and your vision.',
          links: [
            {
              route: '/guides/',
              text: 'View Guides »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/res/images/banners/home/content-guides.jpg?20170829201433',
          alt: ''
        },
        {
          header: '\'How To\' Guides',
          text: 'Learn how to get the best out of your glasses or sunglasses.',
          links: [
            {
              route: '/guides/how-to/',
              text: 'View Guides »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.23/res/images/banners/home/content-how-to.jpg?20171130143530',
          alt: ''
        },
        {
          header: 'Eye Health & Advice',
          text: 'View our central resource of eye health information to help explain different eye conditions.',
          links: [
            {
              route: '/eye-health/',
              text: 'More »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/res/images/banners/home/content-health.jpg?20170829201433',
          alt: ''
        },
        {
          header: 'About Us',
          text: 'Find out more about our company, our background, our team, and our cutting edge laboratory.',
          links: [
            {
              route: '/about-us/',
              text: 'More »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/res/images/banners/about/about-us-banner.jpg?20170829201433',
          alt: ''
        }
      ]
    }
  }
}
