import Swiper from './js/main.js'
window.console.log(Swiper)
const swiper1 = new Swiper({
  el: '.swiper-one',
  slideCount: 2,
  direction: 'vertical'
})
const swiper2 = new Swiper({
  el: '.swiper-two',
  slideCount: 3,
  loop: false
})
window.console.log(swiper1, swiper2)
window.console.log(swiper2)
