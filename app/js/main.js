//默认参数
const defaultOpt = {
  delay: 1200, //transform timeout
  duration: 1000, //animation speed
  slideCount: 1, //count of slide in view
  el: '', //render dom target
  interval: '', //interval
  direction: 'horizontal', //transition direction
  loop: true //loop?
}
//Swiper function
const Swiper = function(opt) {
  for(let key in defaultOpt) {
    this[key] = opt[key] === undefined ? defaultOpt[key] : opt[key]
  }
  this.transform_direction = true
  this.swiper = document.querySelector(this.el)
  this.container = this.swiper.querySelector(`${this.el} .swiper-container`)
  return this.init()
}
/**
 *@description : 获取dom元素的宽高
 *@param : target,direction
 *@return : value
 */
function getDomOffset(target, direction) {
  return direction === 'horizontal' ? target.offsetWidth : target.offsetHeight
}
/**
 *@description : 设置translate的值
 *@param : value,direction
 *@return : translate_value
 */
function setTranslateVal(val, direction) {
  return direction === 'horizontal' ? `translate3d(${val}px,0,0)` : `translate3d(0,${val}px,0)`
}
/**
 *@description : 获取translate的值
 *@param : origin_value,direction
 *@return : translate_value
 */
function getTranslateVal(value, direction) {
  return direction === 'horizontal' ? Number(value.split('(')[1].split(',')[0].split('px')[0]) : Number(value.split('(')[1].split(',')[1].split('px')[0])
}
Swiper.prototype.init = function() {
  this.container.style.flexWrap = this.direction === 'horizontal' ? 'no-wrap' : 'wrap'
  const container_width = getDomOffset(this.container, this.direction)
  const self = this
  let slide_arr = Array.prototype.slice.call(this.container.querySelectorAll('.swiper-slide'))
  slide_arr.forEach(function(e) {
    if(self.direction === 'horizontal') {
      e.style.width = (container_width) / (self.slideCount) + 'px'
    } else if(self.direction === 'vertical') {
      e.style.height = (container_width) / (self.slideCount) + 'px'
    }
  })
  let slide_count = slide_arr.length
  this.count = slide_count
  //loop
  if(this.loop) {
    for(let i = 0; i < this.slideCount; i++) {
      let pre = slide_arr.slice(i, i + 1)[0].cloneNode()
      pre.innerHTML = slide_arr.slice(i, i + 1)[0].innerHTML
      let last = slide_arr[slide_count - i - 1].cloneNode()
      last.innerHTML = slide_arr[slide_count - i - 1].innerHTML
      self.container.appendChild(pre)
      self.container.insertBefore(last, self.container.firstElementChild)
    }
  }
  let slide_width = getDomOffset(self.container.querySelector('.swiper-slide'), self.direction)
  self.slideOffset = slide_width
  if(self.loop) {
    self.container.style.webkitTransform = setTranslateVal(-slide_width * this.slideCount, self.direction)
  } else {
    self.container.style.webkitTransform = 'translate3d(0,0,0)'
  }
  mouseEvent(this)
  mouseMOve(this)
  this.startPlay()
}
//start play
Swiper.prototype.startPlay = function() {
  this.stopPlay()
  const self = this
  let duration = this.duration
  let delay = this.delay
  if(delay < duration + 10) {
    delay = duration + 10
  }
  let slide_width = self.slideOffset
  let slide_count = self.count
  self.interval = setInterval(function() {
    let x = self.container.style.webkitTransform
    let val = getTranslateVal(x, self.direction)
    let current_translate_x = x == '' ? 0 : val
    //current_translate_x = current_translate_x < (-slide_width*(slide_count-2)) ? 0 : current_translate_x
    self.container.style.transitionDuration = `${duration}ms`
    const translate = self.transform_direction === true ? current_translate_x - slide_width : current_translate_x + slide_width
    self.container.style.webkitTransform = setTranslateVal(translate, self.direction)
    if(self.loop) {
      if(current_translate_x == -slide_width * (slide_count)) {
        setTimeout(function() {
          self.container.style.transitionDuration = '0ms'
          self.container.style.webkitTransform = setTranslateVal(-slide_width, self.direction)
        }, duration)
      }
    } else {
      if(translate == 0) {
        self.transform_direction = true
      } else if(translate == -slide_width * (slide_count - self.slideCount)) {
        self.transform_direction = false
      }
    }
  }, delay)
}
//stop play
Swiper.prototype.stopPlay = function() {
  this.fix()
  clearInterval(this.interval)
}
//fixPosition
Swiper.prototype.fix = function() {
  if(this.loop) {
    //.................
  } else {
    let slide_width = this.slideOffset
    let x = this.container.style.webkitTransform
    let val = getTranslateVal(x, this.direction)
    let current_translate_x = x == '' ? 0 : val
    if(current_translate_x == -slide_width * (this.count - this.slideCount)) {
      this.transform_direction = false
    } else if(current_translate_x == 0) {
      this.transform_direction = true
    }
  }
}
//mouse event
function mouseEvent(_this) {
  document.querySelector(_this.el).addEventListener('mouseenter', function() {
    _this.stopPlay()
  })
  document.querySelector(_this.el).addEventListener('mouseleave', function() {
    _this.startPlay()
  })
}
//mousemove event
function mouseMOve(_this) {
  let target, start_p, flag = false
  document.querySelector(_this.el).addEventListener('mousedown', function(e) {
    flag = true
    target = e.target
    start_p = _this.direction === 'horizontal' ? e.x : e.y
  })
  document.querySelector(_this.el).addEventListener('mouseup', function() {
    flag = false
    target = null
    start_p = null
    mouseUp()
  })
  document.querySelector(_this.el).addEventListener('mousemove', function(e) {
    if(target && flag) {
      // let slide_width = container.querySelector('.swiper-slide').offsetWidth
      let x = _this.container.style.webkitTransform
      let current_translate_x = x == '' ? 0 : getTranslateVal(x, _this.direction)
      _this.container.style.transitionDuration = '0ms'
      let this_p = _this.direction === 'horizontal' ? (e.x - start_p) : (e.y - start_p)
      _this.container.style.webkitTransform = setTranslateVal(current_translate_x + this_p, _this.direction)
      // container.style.webkitTransform = `translate3d(${current_translate_x+(e.x-start_x)}px,0,0)`
      start_p = _this.direction === 'horizontal' ? e.x : e.y
    }
  })
  document.querySelector(_this.el).addEventListener('mouseleave', function() {
    target = null
    flag = false
    start_p = null
    mouseUp()
  })
  /**
   *@description : 鼠标移出或者弹起，触发弹起事件逻辑
   *@param :
   *@return :
   */
  function mouseUp() {
    const container = _this.container
    let slide_width = _this.slideOffset
    let x = container.style.webkitTransform
    let val = getTranslateVal(x, _this.direction)
    let current_translate_x = x === '' ? 0 : val
    let transform_val = Math.abs(current_translate_x % slide_width)
    let new_position
    /**
     *@description : fix position
     */
    let slide_count = _this.count
    if(transform_val != 0 && transform_val < (slide_width / 2)) {
      new_position = current_translate_x + transform_val
    } else if(transform_val != 0 && transform_val > (-slide_width / 2)) {
      new_position = current_translate_x - (slide_width - transform_val)
    }
    let new_position_index = Math.floor(Math.abs(new_position) / slide_width)
    if(new_position_index > slide_count) {
      setTimeout(function() {
        container.style.transitionDuration = '0ms'
        container.style.webkitTransform = setTranslateVal(-slide_width * (new_position_index - slide_count), _this.direction)
      }, 500)
    }
    if(new_position > 0) {
      new_position = 0
    }
    if(!_this.loop && new_position < -(slide_count - _this.slideCount) * slide_width) {
      new_position = -(slide_count - _this.slideCount) * slide_width
    }
    container.style.transitionDuration = '400ms'
    container.style.webkitTransform = setTranslateVal(new_position, _this.direction)
  }
}
export default Swiper
