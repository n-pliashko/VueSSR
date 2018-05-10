import PageHeader from '@/components/scripts/PageHeader/index.vue'
import HomepageBanner from '@/components/scripts/Main/HomepageBanner/index.vue'
import FlashMessage from '@/components/scripts/FlashMessage/index.vue'
import ExcellentRating from '@/components/scripts/ExcellentRating/index.vue'
import GlassesTypes from '@/components/scripts/Main/GlassesTypes/index.vue'
import Sales from '@/components/scripts/Main/Sales/index.vue'
import BrandsCarousel from '@/components/scripts/BrandsCarousel/index.vue'
import StaffPicks from '@/components/scripts/Main/StaffPicks/index.vue'
import Guides from '@/components/scripts/Main/Guides/index.vue'
import NavAccordion from '@/components/scripts/Main/NavAccordion/index.vue'
import More from '@/components/scripts/Main/More/index.vue'
import AdvantagesList from '@/components/scripts/Main/AdvantagesList/index.vue'
import TrustpilotWidget from '@/components/scripts/TrustpilotWidget/index.vue'
import ScrollToTop from '@/components/scripts/ScrollToTop/index.vue'
import PageFooter from '@/components/scripts/PageFooter/index.vue'

export default {
  name: 'mainPage',
  components: {
    PageHeader,
    HomepageBanner,
    FlashMessage,
    ExcellentRating,
    GlassesTypes,
    NavAccordion,
    More,
    Sales,
    BrandsCarousel,
    StaffPicks,
    Guides,
    AdvantagesList,
    TrustpilotWidget,
    PageFooter,
    ScrollToTop
  },
  mounted () {
    let router = this.$route
    this.$store.dispatch('getMenuDescription', [{
      link: router.path
    }, router])
  }
}
