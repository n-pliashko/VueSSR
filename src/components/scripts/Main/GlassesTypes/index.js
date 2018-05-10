import PreviewBlock from '@/components/scripts/PreviewBlock/index.vue'

export default {
  name: 'GlassesTypes',
  components: {
    PreviewBlock
  },
  data () {
    return {
      blockType: 'grey',
      boxContents: [
        {
          header: 'World\'s Cheapest Glasses',
          text: 'Prescription glasses for <b>₴250</b> including lenses & coatings. That\'s what we call a <b>sweet deal!</b>',
          links: [
            {
              route: '/cheap-glasses/',
              text: 'Shop ₴250 Glasses »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.27/res/images/banners/home/sweet-deal.jpg?20180201184956',
          alt: ''
        },
        {
          header: 'Designer Sunglasses',
          text: 'The hottest sunglasses and fashion brands at the lowest prices.',
          links: [
            {
              route: '/sunglasses/designer/mens/c10/',
              text: 'Men »'
            },
            {
              route: '/sunglasses/designer/ladies/c11/',
              text: 'Women »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.27/res/images/banners/home/sunglasses-banner_v2.jpg?20180201184956',
          alt: ''
        },
        {
          header: 'Contact Lenses',
          text: 'Daily, weekly, monthly, and coloured disposable lenses from the leading brands.',
          links: [
            {
              route: '/contact-lenses/',
              text: 'Shop Lenses »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.27/res/images/banners/home/contact-lens-banner_v2.jpg?20180201184956',
          alt: ''
        },
        {
          header: 'Goggles',
          text: 'Ski, motocross and swimming goggles available from the leading brands.',
          links: [
            {
              route: '/goggles/',
              text: 'Shop Goggles »'
            }
          ],
          img: 'https://d9qzjwuieyamt.cloudfront.net/5.2.27/res/images/banners/home/goggles-banner_v2.jpg?20180201184956',
          alt: ''
        }
      ]
    }
  }
}
