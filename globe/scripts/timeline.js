function initTimeline() {
  lineChart.initChart();
  nightingaleChart.initChart();
  
  barChart.initChart({
    xAxis: ['美国', '中国', '日本', '德国', '英国'],
    series: [18.56, 11.21, 4.93, 3.46, 2.62],
  })

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
    // 更新统计数字
    function animate() {
      if (TWEEN.update()) {
        requestAnimationFrame(animate)
      }
    }
    new TWEEN.Tween({ tweeningNumber: +totalNumDom.innerText })
      .easing(TWEEN.Easing.Quadratic.Out)
      .to({ tweeningNumber: ~~randomNum(600, 800) }, 1500)
      .onUpdate(function () {
        totalNumDom.innerText = this.tweeningNumber.toFixed(0)
      })
      .start()

    animate()

    // 更新柱状图
    barChart.upDateChart({
      xAxis: ['美国', '中国', '日本', '德国', '英国'],
      series: [randomFolat(18, 20), randomFolat(11, 14), randomFolat(4.5, 6), randomFolat(3, 4), randomFolat(2, 3)],
    })
  }
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

/**
 * 
 * @description 生成指定位数的小数
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} fix 
 * @return {Number}
 */
function randomFolat(min, max, fix) {
  fix = fix || 2
  return Number(min + Math.random() * (max - min)).toFixed(fix)
}
