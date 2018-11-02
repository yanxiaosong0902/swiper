//默认参数
const defaultOpt = {
  delay: 2000, //transform timeout
  duration: 1500, //animation speed
  slideCount: 1, //count of slide in view
  el: '', //render dom target
  interval: '', //interval
  direction: 'horizontal', //transition direction
  loop: true, //loop?
  prevBtn: 'swiper-prev-btn',
  nextBtn: 'swiper-next-btn',
  pagination: false
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
  // direction
  if(this.direction === 'vertical') {
    this.swiper.querySelector('.swiper-prev-btn').classList.add('swiper-prev-horization')
    this.swiper.querySelector('.swiper-next-btn').classList.add('swiper-next-horization')
    if(this.pagination) {
      this.swiper.querySelector('.swiper-pagination').classList.add('swiper-pagination-horizontal')
      this.swiper.querySelector('.swiper-pagination').style.left = this.pagination.position === 'left' ? '10px' : 'auto'
      this.swiper.querySelector('.swiper-pagination').style.right = this.pagination.position === 'left' ? 'auto' : '10px'
      this.swiper.querySelector('.swiper-pagination').style.top = this.pagination.position === 'top' ? '10px' : 'auto'
      this.swiper.querySelector('.swiper-pagination').style.bottom = this.pagination.position === 'top' ? 'auto' : '10px'
    }
  }
  //pagination
  if(this.pagination) {
    let html = ''
    if(typeof this.pagination === 'object' && this.pagination.customization) {
      const dot = this.pagination.customization
      for(let i = 0; i < this.count; i++) {
        let str = `<li class="navigation-item" data-index=${i+1}>${dot}</span></li>`
        html += str
      }
    } else if(this.pagination && !this.pagination.customization) {
      for(let i = 0; i < this.count; i++) {
        let str = `<li class="navigation-item" data-index=${i+1}><span class="dot"></span></li>`
        html += str
      }
    }
    let _html = `<ul>${html}</ul>`
    this.swiper.querySelector('.swiper-pagination').innerHTML = _html
  }
  // navigation
  if(typeof this.prevBtn === 'object') {
    const custom = this.prevBtn.customization
    this.swiper.querySelector('.swiper-prev-btn').innerHTML = custom
  }
  if(typeof this.nextBtn === 'object') {
    const custom = this.nextBtn.customization
    this.swiper.querySelector('.swiper-next-btn').innerHTML = custom
  }
  // loop
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
  navigation(this)
  this.startPlay()
}
//start play
Swiper.prototype.startPlay = function() {
  this.stopPlay()
  const self = this
  let duration = this.duration
  let delay = this.delay
  if(delay < duration + 100) {
    delay = duration + 100
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
    self.fix()
  }, delay)
}
//stop play
Swiper.prototype.stopPlay = function() {
  this.fix()
  clearInterval(this.interval)
}
//fixPosition
Swiper.prototype.fix = function() {
  let slide_width = this.slideOffset
  let x = this.container.style.webkitTransform
  let val = getTranslateVal(x, this.direction)
  let current_translate_x = x == '' ? 0 : val
  let absVal = Math.abs(current_translate_x % this.slideOffset)
  if(absVal != 0) {
    if(absVal > this.slideOffset / 2) {
      this.container.webkitTransform = setTranslateVal(current_translate_x - this.slideOffset + absVal, this.direction)
    } else {
      this.container.webkitTransform = setTranslateVal(current_translate_x + absVal, this.direction)
    }
  }
  if(this.loop) {
    //.................
  } else {
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
  let target, start_p, start_timestamp, s_p, flag = false
  document.querySelector(_this.el).addEventListener('mousedown', function(e) {
    flag = true
    target = e.target
    start_timestamp = e.timeStamp
    s_p = _this.direction === 'horizontal' ? e.x : e.y
    start_p = _this.direction === 'horizontal' ? e.x : e.y
  })
  document.querySelector(_this.el).addEventListener('mouseup', function(e) {
    flag = false
    target = null
    mouseUp(e)
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
  document.querySelector(_this.el).addEventListener('mouseleave', function(e) {
    target = null
    flag = false
    mouseUp(e)
  })
  /**
   *@description : 鼠标移出或者弹起，触发弹起事件逻辑
   *@param :
   *@return :
   */
  function mouseUp(e) {
    const container = _this.container
    let slide_width = _this.slideOffset
    let x = container.style.webkitTransform
    let val = getTranslateVal(x, _this.direction)
    let current_translate_x = x === '' ? 0 : val
    let transform_val = Math.abs(current_translate_x % slide_width)
    let c_p = _this.direction === 'horizontal' ? e.pageX : e.pageY
    let new_position
    /**
     *@description : fix position
     */
    let slide_count = _this.count
    if(e.timeStamp - start_timestamp > 100 && e.timeStamp - start_timestamp < 500 && (c_p - s_p) > 0) {
      new_position = current_translate_x + transform_val
    } else if(e.timeStamp - start_timestamp > 100 && e.timeStamp - start_timestamp < 500 && (c_p - s_p) < 0) {
      new_position = current_translate_x - (slide_width - transform_val)
    } else if(transform_val != 0 && transform_val < (slide_width / 2)) {
      new_position = current_translate_x + transform_val
    } else if(transform_val != 0 && transform_val > (slide_width / 2)) {
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
    start_p = null
  }
  /**
   *@description : 切换函数
   *@param :
   *@return :
   */
}

function navigation(_this) {
  function getParent(target, p_target) {
    let _target = target.parentElement
    if(target.classList.contains(p_target)) {
      return target
    } else {
      if(_target.classList.contains(p_target)) {
        return _target
      } else if(_target.classList.contains('yxs-swiper')) {
        return false
      } else {
        return getParent(_target)
      }
    }
  }
  _this.swiper.addEventListener('click', function(e) {
    if(getParent(e.target, 'swiper-btn')) {
      let target = getParent(e.target, 'swiper-btn')
      let transform_val = _this.container.style.webkitTransform
      let c_t = getTranslateVal(transform_val, _this.direction)
      let new_value
      if(target.classList.contains('swiper-prev-btn')) {
        new_value = c_t === 0 ? 0 : (c_t + _this.slideOffset)
      } else if(target.classList.contains('swiper-next-btn')) {
        if(_this.loop) {
          new_value = c_t - _this.slideOffset
          if(new_value < -_this.slideOffset * _this.count) {
            setTimeout(function() {
              _this.container.style.transitionDuration = '0ms'
              _this.container.style.webkitTransform = setTranslateVal(-_this.slideOffset * (_this.slideCount - 1), _this.direction)
            }, 600)
          }
        } else {
          new_value = c_t === _this.slideOffset * (_this.slideCount - _this.count) ? c_t : c_t - _this.slideOffset
        }
      }
      _this.container.style.transitionDuration = '500ms'
      _this.container.style.webkitTransform = setTranslateVal(new_value, _this.direction)
    } else if(getParent(e.target, 'navigation-item')) {
      let target = getParent(e.target, 'navigation-item')
      let index = target.getAttribute('data-index')
      let _index = index - 2
      if(index - 2 < 0) {
        _index = 0
      }
      let t_position = _this.loop === true ? -_this.slideOffset * (_index + _this.slideCount) : -_this.slideOffset * _index
      _this.container.style.webkitTransform = setTranslateVal(t_position, _this.direction)
      _this.container.style.transitionDuration = '0ms'
    }
  })
}
export default Swiper
