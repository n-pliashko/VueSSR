import VerticalMenu from '@/components/scripts/SideBar/VerticalMenu/index.vue'

export default {
  name: 'SideBar',
  components: {VerticalMenu},
  methods: {
    closeSidebar: function () {
      this.$store.dispatch('closeSidebar')
    }
  }
}
