<template lang="pug">
  #app
    MetaData
    ProjectVersion
    #pageWrapper
      SideBar(v-if="show")#sidebarNav.d-lg-none
      #mainWrapper
        router-view
        .sidebar-backdrop(v-if="show", @click="closeSidebar")
</template>

<script>
  import ProjectVersion from '@/components/scripts/ProjectVersion/index.vue'
  import MetaData from '@/components/scripts/MetaData/index.vue'
  import SideBar from '@/components/scripts/SideBar/index.vue'
  // import PageHeader from '@/components/scripts/PageHeader/index.vue'
  // import PageFooter from '@/components/scripts/PageFooter/index.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'mainApp',
    components: {
      ProjectVersion,
      MetaData,
      SideBar
    },
    computed: {
      ...mapState({
        redirects: (state) => state.redirects
      }),
      show: function () {
        return ['Checkout'].indexOf(this.$route.name) < 0
      }
    },
    methods: {
      closeSidebar: function () {
        this.$store.dispatch('closeSidebar')
      }
    },
    watch: {
      '$route' (to, from) {
        window.scrollTo(0,0)
      }
    }
    /* watch: {
     'redirects': {
     handler: function () {
     console.log('redirects watch')
     let path = this.$route.path
     let redirect = this.redirects.filter(obj => {
     return path.match(obj.path)
     })
     if (redirect && redirect.length === 1) {
     this.$router.push(redirect[0].redirect)
     }
     },
     deep: true
     }
     } */
  }
</script>

<style lang="scss" src="@/components/templates/default/_Styles/rateit-settings.scss"></style>
<style lang="scss" src="@/components/templates/default/_Styles/slick-settings.scss"></style>
<style lang="scss" src="@/components/templates/default/_Styles/swiper-settings.scss"></style>
<style lang="scss" src="@/components/templates/default/_Styles/main.scss"></style>
