import ExcellentCarousel from '@/components/scripts/PageHeader/ExcellentCarousel/index.vue'
import UpperBar from '@/components/scripts/PageHeader/UpperBar/index.vue'
import LogoLine from '@/components/scripts/PageHeader/LogoLine/index.vue'
import MessageBlock from '@/components/scripts/PageHeader/MessageBlock/index.vue'

export default {
  name: 'PageHeader',
  components: {
    ExcellentCarousel,
    UpperBar,
    LogoLine,
    MessageBlock
  },
  computed: {
    showCarousel () {
      return ['Register', 'Login', 'Reviews', 'SalePage'].indexOf(this.$route.name) < 0
    },
  }
}
