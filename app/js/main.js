;(function(root,factory){
  if(typeof define  === 'function' && define.amd){
    define([],factory)
  }else if(typeof exports === 'object'){
    module.exports = factory()
  }else{
    root.swiper = factory()
  }
})(this,function(opt){
  const defaultOpt = {
    delay:1200,
    duration:1000,
    slideCount:1
  }
  let opt = Object.assign(defaultOpt,opt)
  const swiper = document.querySelector('.yxs-swiper')
  const container = swiper.querySelector('.swiper-container')
  let interval
  let slide_width = container.querySelector('.swiper-slide').offsetWidth
  let slide_count = container.querySelectorAll('.swiper-slide').length
  container.style.webkitTransform = `translate3d(${-slide_width}px,0,0)`
  let duration = opt.duration
  let delay = opt.delay
  if(delay<duration+10){
    delay = duration + 10
  }
  interval = setInterval(function () {
    let x = container.style.webkitTransform
    let current_translate_x = x == '' ? 0 : Number(x.split('(')[1].split(',')[0].split('px')[0])
    //current_translate_x = current_translate_x < (-slide_width*(slide_count-2)) ? 0 : current_translate_x
    container.style.transitionDuration = `${duration}ms`
    container.style.webkitTransform = `translate3d(${current_translate_x-slide_width}px,0,0)`
    if(current_translate_x == -slide_width*(slide_count-2)){
      setTimeout(function(){
        container.style.transitionDuration = '0ms'
        container.style.webkitTransform = `translate3d(${-slide_width}px,0,0)`
      },duration)
    }
  }, delay);
})
