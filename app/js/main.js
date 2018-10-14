;(function(root,factory){
  if(typeof define  === 'function' && define.amd){
    define([],factory)
  }else if(typeof exports === 'object'){
    module.exports = factory()
  }else{
    root.Swiper = factory()
  }
})(this,function(){
  //默认参数
  const defaultOpt = {
    delay:1200,//播放间隔速度
    duration:1000,//动画播放速度
    slideCount:1,//同时显示的个数
    el:null,//渲染目标元素
    loop:true//是否无缝循环
  }
  //Swiper构造函数
  const Swiper = function(opt){
    this.opt = Object.assign(defaultOpt,opt)
    return this.init()
  }
  Swiper.prototype.init = function(){
    const swiper = document.querySelector(this.opt.el)
    const container = swiper.querySelector(`${this.opt.el} .swiper-container`)
    const container_width = container.offsetWidth
    let interval
    const self = this;
    let slide_width = container.querySelector('.swiper-slide').offsetWidth
    let slide_arr = Array.prototype.slice.call(container.querySelectorAll('.swiper-slide'))
    // slide_arr.forEach(function(e){
    //   e.style.width = (container_width)/(self.opt.slideCount)+'px'
    // })
    let slide_count = slide_arr.length
    //环路
    if(this.opt.loop){
      for(let i = 0 ; i < this.opt.slideCount ; i++){
        container.appendChild(slide_arr.slice(i,i+1)[0].cloneNode())
        container.insertBefore(slide_arr[slide_count-i-1].cloneNode(),container.firstElementChild)
      }
    }
    container.style.webkitTransform = `translate3d(${-slide_width*this.opt.slideCount}px,0,0)`
    let duration = this.opt.duration
    let delay = this.opt.delay
    if(delay<duration+10){
      delay = duration + 10
    }
    interval = setInterval(function () {
      let x = container.style.webkitTransform
      let current_translate_x = x == '' ? 0 : Number(x.split('(')[1].split(',')[0].split('px')[0])
      //current_translate_x = current_translate_x < (-slide_width*(slide_count-2)) ? 0 : current_translate_x
      container.style.transitionDuration = `${duration}ms`
      container.style.webkitTransform = `translate3d(${current_translate_x-slide_width}px,0,0)`
      if(current_translate_x == -slide_width*(slide_count)){
        setTimeout(function(){
          container.style.transitionDuration = '0ms'
          container.style.webkitTransform = `translate3d(${-slide_width}px,0,0)`
        },duration)
      }
    }, delay);
  }
  window.Swiper = Swiper
  return Swiper
})
