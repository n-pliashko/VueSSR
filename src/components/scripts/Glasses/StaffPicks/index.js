// import Slick from 'vue-slick'

export default {
  name: 'StaffPicks',
//  components: { Slick },
  data () {
    return {
      slickOptions: {
        infinite: true,
        autoplay: false,
        speed: 700,
        swipeToSlide: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        dotsClass: 'slick-dots white-dots',
        arrows: false
      }
    }
  }
}
