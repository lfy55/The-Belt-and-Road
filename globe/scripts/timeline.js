function initTimeline() {


  // 初始化南丁格尔图
  nightingaleChart.initChart();

  barChart.initChart({
    xAxis: ['美国', '中国', '日本', '德国', '英国'],
    series: [18.56, 11.21, 4.93, 3.46, 2.62],
  })

  var slider = $("#timeline-point"),
    labels = $("#timeline .timeline-label>div"),
    timelineFlags = $("#timeline-flag"),
    totalNumDom = $("#total-margin .total-num")[0],
    thingContent = $("#thing-content"),
    labelsValue = [],
    thingsValue = [],
    sliderWidth = slider.width(),
    labelLength = labelsValue.length,
    thingLength = thingsValue.length,
    nowYear = "2002",
    nowThing = null,
    maxLeft = $("#timeline-line").width() - sliderWidth,
    animateCount = null

  thingContent.hide()

  labels.each((index, value) => {
    labelsValue.push({
      left: value.offsetLeft - 3 > 0 ? value.offsetLeft - 3 : 0,
      year: value.innerText
    })
  })
  thingsValue = [
    {
      id: 1,
      left: labelsValue[5].left,
      imgUrl: '',
      context: '2007年2月13日美国新世纪金融公司（New Century Finance）发出2006年第四季度盈利预警。'
    },
    {
      id: 2,
      left: ~~((labelsValue[5].left + labelsValue[6].left) / 2),
      imgUrl: '',
      context: '汶川大地震，也称2008年四川大地震或5·12大地震，发生于北京时间（UTC+8）2008年5月12日（星期一）14时28分04秒，震中位于中国四川省阿坝藏族羌族自治州汶川县映秀镇附近、四川省省会成都市西北偏西方向79千米处。'
    },
    {
      id: 3,
      left: labelsValue[2].left,
      imgUrl: '',
      context: '2004年美国总统选举于2004年11月2日举行，时任总统乔治·沃克·布希成功连任，这次他成功同时赢得普选票及选举人票。2005年1月6日选举人投票结束，确定总统人选，他于2005年1月20日宣誓就职。'
    },
    {
      id: 4,
      left: labelsValue[4].left,
      imgUrl: '',
      context: '中国解除人民币与美金的联系汇率，人民币升值进程开始。'
    }
  ]
  labelsValue.sort((a, b) => b.left - a.left)
  thingsValue.sort((a, b) => b.left - a.left)
  labelLength = labelsValue.length
  thingLength = thingsValue.length

  for (var i = 0; i < thingLength; i++) {
    var flagDom = document.createElement('div')
    flagDom.className = "timeline-flag"
    flagDom.id = "flag" + thingsValue[i].id
    flagDom.style.left = thingsValue[i].left + 10 + 'px'
    flagDom.onmouseover = function (e) {
      showThing(~~e.currentTarget.id.slice(4))
    }
    flagDom.onmouseleave = function () {
      hideThing(0)
    }

    timelineFlags.append(flagDom)
  }

  function startTimeline() {
    // 初始化折线图
    lineChart.initChart({
      duration: 1000*45,
      dataY: ['300', '150', '100', '250', '50', '330', '150', '400', '300', '330', '250', '400']
    });

    function moveSlider() {
      var left = parseFloat(slider[0].style.left.slice(0, -2)) + 1
      left = isNaN(left) ? 1 : left
      if (left >= maxLeft) {
        left = maxLeft
        cancelAnimationFrame(animateCount)
      }
      left = left < 0 ? 0 : left
      for (let i = 0; i < labelLength; i++) {
        if (left > labelsValue[i].left) {
          if (nowYear !== labelsValue[i].year) {
            nowYear = labelsValue[i].year
            changeYear(nowYear)
          }
          break
        }
      }
      for (let i = 0; i < thingLength; i++) {
        if (left > thingsValue[i].left) {
          if (nowThing !== thingsValue[i].id) {
            nowThing = thingsValue[i].id
            showThing(nowThing)
            hideThing(3)
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
      changeYear(nowYear);
      let lineChartDataLength = nowYear - 2002 + 1;
      let lineChartData = ['300', '150', '100', '250', '50', '330', '150', '400', '300', '330', '250', '400']
      let lineChartDataShow = lineChartData.splice(0, lineChartDataLength)

      //更新折线图
      lineChart.upDateChart({
        dataY: lineChartDataShow
      })
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

  function showThing(id) {
    $('#thing-content-content').empty()
    var nowThing = thingsValue.find(item => item.id === id)
    thingContent[0].style.left = nowThing.left + 10 + 'px'
    $('#thing-content-content').append(`<img src="http://iph.href.lu/300x200" alt="占位"><div class="text">${nowThing.context}</div>`)
    thingContent.fadeIn()
  }

  var hideThingTime = null
  function hideThing(delay) {
    clearTimeout(hideThingTime)
    hideThingTime = setTimeout(() => {
      thingContent.fadeOut()
    }, delay * 1000)
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
