function initTimeline() {
  var slider = $("#timeline-point"),
    labels = $("#timeline .timeline-label>div"),
    totalNumDom = $("#total-margin .total-num")[0],
    labelsValue = [],
    sliderWidth = slider.width(),
    labelLength = labelsValue.length,
    nowYear = "2002",
    maxLeft = $("#timeline-line").width() - sliderWidth,
    animateCount = null

  labels.each((index, value) => {
    labelsValue.push({
      left: value.offsetLeft - 3 > 0 ? value.offsetLeft - 3 : 0,
      year: value.innerText
    })
  })
  labelsValue.sort((a, b) => {
    return b.left - a.left
  })
  labelLength = labelsValue.length

  function startTimeline() {
    function moveSlider() {
      var left = parseFloat(slider[0].style.left.slice(0, -2)) + 1
      left = isNaN(left) ? 1 : left
      if (left >= maxLeft) {
        left = maxLeft
        cancelAnimationFrame(animateCount)
      }
      left = left < 0 ? 0 : left
      for (let i = 0; i < labelLength; i++) {
        if (left + sliderWidth > labelsValue[i].left) {
          if (nowYear !== labelsValue[i].year) {
            nowYear = labelsValue[i].year
            changeYear(nowYear)
          }
          break
        }
      }
      slider[0].style.left = left + 'px'
      if (left < maxLeft) {
        animateCount = requestAnimationFrame(moveSlider)
      }
    }
    animateCount = requestAnimationFrame(moveSlider)
  }

  $("#start-timeline").on("click", startTimeline)

  labels.on('click', function (e) {
    var left = e.currentTarget.offsetLeft - 3
    slider[0].style.left = left > 0 ? left + 'px' : '0px'
    cancelAnimationFrame(animateCount)
    if (nowYear !== e.currentTarget.innerText) {
      nowYear = e.currentTarget.innerText
      changeYear(nowYear)
    }
  })

  function changeYear(year) {
    console.log(year)
    countUp(totalNumDom, ~~randomNum(600, 900), parseFloat(totalNumDom.innerText), 3000, 0)
  }
}

function countUp(elem, endVal, startVal, duration, decimal) {
  //传入参数依次为 数字要变化的元素，最终显示数字，数字变化开始值，变化持续时间，小数点位数
  var startTime = 0;
  var dec = Math.pow(10, decimal);
  var progress, value;
  function startCount(timestamp) {
    if (!startTime) startTime = timestamp;
    progress = timestamp - startTime;
    value = startVal + (endVal - startVal) * (progress / duration);
    value = (value > endVal) ? endVal : value;
    value = Math.floor(value * dec) / dec;
    elem.innerHTML = value.toFixed(decimal);
    progress < duration && requestAnimationFrame(startCount)
  }
  requestAnimationFrame(startCount)
}

/**
 * 
 * @desc 生成指定范围随机数
 * @param  {Number} min 
 * @param  {Number} max 
 * @return {Number} 
 */
function randomNum(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}
