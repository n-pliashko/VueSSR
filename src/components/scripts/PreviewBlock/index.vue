<template lang="pug">
  .col-12.col-md-6.col-lg-3()
    div(:class="classType")
      p.preview-image
        img(:src="img", :alt="alt").img-fluid
      p.preview-header {{ header }}
      p(v-html="text").small
      br
      p
        a(v-for="link in links", :key="link.id", :href="link.route",
        :class="['Main'].indexOf($route.name) > -1 ? 'mb-0' : ''").btn.big-button {{ link.text }}

</template>

<style lang="scss" scoped>
  .preview-main {
    background-color: #fff;
    padding-bottom: 0.5rem;
    margin: 1rem 0 0.5rem;
    height: 100%;
    img.img-fluid {
      margin-bottom:1.25rem;
    }
    .preview-header {
      font-weight: 700;
      @media (max-width: 64em) {
        font-size: 1rem;
      }
      @media (min-width: 64em) {
        font-size: 1.1rem;
      }
    }
  }
  .preview-secondary {
    background: #fff;
    padding: .75rem;
    height: 100%;
    img.img-fluid {
      margin-bottom: .5rem;
    }
    .preview-header {
      font-weight: 700;
    }
    .big-button {
      margin-bottom: 1rem;
    }
  }
  .grey-preview {
    background-color: #ecf0f1;
    img.img-fluid {
      margin-bottom:2.25rem;
    }
    .preview-header {
      font-weight: 700;
      @media (max-width: 64em) {
        font-size: 1.125rem;
      }
      @media (min-width: 64em) {
        font-size: 1.2rem;
      }
    }
  }

</style>

<script>
  export default {
    name: 'PreviewBlock',
    computed: {
      classType: function () {
        switch (this.blockType) {
          case 'main':
            return 'preview-main'
          case 'secondary':
            return 'preview-secondary box-shadow'
          case 'grey':
            return 'preview-main grey-preview'
          default:
            break
        }
      }
    },
    props: ['img', 'header', 'text', 'links', 'alt', 'blockType'],
    mounted () {
      // console.log(this.blockType)
    }
  }
</script>
