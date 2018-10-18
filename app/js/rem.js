(function(doc, win) {
  var docEI = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientataionchange' : 'resize',
    recalc = function() {
      var clientWidth = docEI.clientWidth
      if(!clientWidth) return
      docEI.style.fontSize = 100 * (clientWidth / 650) + 'px'
    }

  if(!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
