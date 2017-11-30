const barData = {
  "2002": {
    xName: ['美国', '日本', '德国', '英国', '法国'],
    xAxis: ['us', 'jp', 'de', 'gb', 'fr'],
    series: [10.64, 3.98, 2.01, 1.6, 1.46],
  },
  "2003": {
    xName: ['美国', '日本', '德国', '英国', '法国'],
    xAxis: ['us', 'jp', 'de', 'gb', 'fr'],
    series: [11.14, 4.30, 2.45, 1.86, 1.79],
  },
  "2004": {
    xName: ['美国', '日本', '德国', '英国', '法国'],
    xAxis: ['us', 'jp', 'de', 'gb', 'fr'],
    series: [11.87, 4.66, 2.75, 2.19, 2.06],
  },
  "2005": {
    xName: ['美国', '日本', '德国', '英国', '中国'],
    xAxis: ['us', 'jp', 'de', 'gb', 'cn'],
    series: [12.64, 4.57, 2.79, 2.30, 2.26],
  },
  "2006": {
    xName: ['美国', '日本', '德国', '中国', '英国'],
    xAxis: ['us', 'jp', 'de', 'cn', 'gb'],
    series: [13.39, 4.36, 2.92, 2.71, 2.46],
  },
  "2007": {
    xName: ['美国', '日本', '中国', '德国', '英国'],
    xAxis: ['us', 'jp', 'cn', 'de', 'gb'],
    series: [14.06, 4.36, 3.49, 3.33, 2.83],
  },
  "2008": {
    xName: ['美国', '日本', '中国', '德国', '法国'],
    xAxis: ['us', 'jp', 'cn', 'de', 'fr'],
    series: [14.37, 4.85, 4.52, 3.65, 2.85],
  },
  "2009": {
    xName: ['美国', '日本', '中国', '德国', '法国'],
    xAxis: ['us', 'jp', 'cn', 'de', 'fr'],
    series: [13.94, 5.04, 4.99, 3.34, 2.62],
  },
  "2010": {
    xName: ['美国', '中国', '日本', '德国', '法国'],
    xAxis: ['us', 'cn', 'jp', 'de', 'fr'],
    series: [14.50, 5.93, 5.49, 3.31, 2.57],
  },
  "2011": {
    xName: ['美国', '中国', '日本', '德国', '法国'],
    xAxis: ['us', 'cn', 'jp', 'de', 'fr'],
    series: [15.08, 7.32, 5.89, 3.61, 2.78],
  },
  "2012": {
    xName: ['美国', '中国', '日本', '德国', '法国'],
    xAxis: ['us', 'cn', 'jp', 'de', 'fr'],
    series: [15.68, 8.23, 5.96, 3.4, 2.61],
  },
}

const lineData = [2.144, 2.915, 4.453, 3.846, 4.326, 4.256, 1.819, -1.735, 4.327, 3.156, 2.601]

const GDPData = {
  "2002": 34.612,
  "2003": 38.867,
  "2004": 43.771,
  "2005": 47.386,
  "2006": 51.307,
  "2007": 57.793,
  "2008": 63.386,
  "2009": 60.087,
  "2010": 65.906,
  "2011": 73.242,
  "2012": 74.802,
  "2013": 76.925,
  "2014": 78.87,
  "2015": 74.51,
  "2016": 75.544
}

function initTimeline() {
  let globeBtn = $("#globeBtn"), relationBtn = $("#relationBtn")
  globeBtn.on("click", function () {
    relationBtn.removeClass("isSelect")
    globeBtn.addClass("isSelect")
    switcher("gridSphere", false, 25)
  })
  relationBtn.on("click", function () {
    globeBtn.removeClass("isSelect")
    relationBtn.addClass("isSelect")
    switcher("productsphere", false, 5)
  })

  // 初始化UI 
  initUI()
  // 初始化南丁格尔图
  nightingaleChart.initChart({
    data: [randomNum(30, 50), randomNum(30, 50), randomNum(30, 50), randomNum(30, 50), randomNum(30, 50)]
  });

  barChart.initChart(barData["2002"])

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
      left: labelsValue[5].left + 20,
      imgUrl: './images/things/img1.jpg',
      context: '2007年2月13日美国新世纪金融公司（New Century Finance）发出2006年第四季度盈利预警，预示全球经济寒冬开始。'
    },
    {
      id: 3,
      left: labelsValue[2].left,
      imgUrl: './images/things/img3.jpg',
      context: '2004年美国总统选举于2004年11月2日举行，时任总统乔治·沃克·布希成功连任，这次他成功同时赢得普选票及选举人票。2005年1月6日选举人投票结束，确定总统人选，他于2005年1月20日宣誓就职。'
    },
    {
      id: 4,
      left: labelsValue[4].left,
      imgUrl: './images/things/img4.jpg',
      context: '中国解除人民币与美金的联系汇率，人民币升值进程开始。'
    },
    {
      id: 5,
      left: labelsValue[8].left - 30,
      imgUrl: './images/things/img5.jpg',
      context: '希腊债务危机，源于2009年12月希腊政府公布政府财政赤字，而后全球三大信用评级相继调低希腊主权信用评级从而揭开希腊债务危机的序幕。希腊债务危机的直接原因即是政府的财政赤字，除希腊外欧洲大部分国家都存在较高的财政赤字，因此，希腊债务危机也引爆了欧洲债务危机。'
    },
    {
      id: 6,
      left: labelsValue[3].left - 40,
      imgUrl: './images/things/img6.png',
      context: '股市泡沫后美联储利率的大幅下降刺激了美国的房地产泡沫，2003年下半年经济强劲复苏，需求快速上升拉动通胀和核心通胀抬头，2004年美联储开始收紧政策，连续17次将利率提高25个基点，2006年6月联邦基金利率达到5.25%。'
    },
    {
      id: 7,
      left: labelsValue[7].left,
      imgUrl: './images/things/img7.jpg',
      context: '美国宣布7000亿美元救市计划的前半段2900亿救助金融业不理想，后续改为救助消费者，等于宣示经济衰退已经从短期风暴变成长期抗战, 美国宣布以134亿美元紧急纾困濒临倒闭的通用、福特、克莱斯勒等三大车厂。'
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
      duration: 1000 * 45,
      dataY: lineData
    });
    var startAnimationTimer = performance.now()
    function moveSlider(timer) {
      var t = timer - startAnimationTimer
      // startAnimationTimer = timer
      var left = t * (maxLeft / 45000)
      left = isNaN(left) ? 1 : left
      if (left >= maxLeft) {
        left = maxLeft
        changeYear("2012")
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

      //更新折线图
      let lineChartDataLength = nowYear - 2002 + 1;
      let lineChartDataShow = lineData.splice(0, lineChartDataLength)

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
      .to({ tweeningNumber: GDPData[year] }, 1500)
      .onUpdate(function () {
        totalNumDom.innerText = this.tweeningNumber.toFixed(3)
      })
      .start()

    animate()

    // 更新柱状图
    barChart.upDateChart(barData[year])

    let data1 = randomNum(1, 100);
    let data2 = randomNum(1, 100 - data1);
    let data3 = randomNum(1, 100 - data1 - data2);
    let data4 = randomNum(1, 100 - data1 - data2 - data3);
    let data5 = 100 - data1 - data2 - data3 - data4;

    //更新南丁格尔图
    nightingaleChart.upDateChart({
      //更新数据，name,value,color
      data: [randomNum(30, 50), randomNum(30, 50), randomNum(30, 50), randomNum(30, 50), randomNum(30, 50)]
    })

  }

  function showThing(id) {
    $('#thing-content-content').empty()
    var nowThing = thingsValue.find(item => item.id === id)
    thingContent[0].style.left = nowThing.left + 10 + 'px'
    $('#thing-content-content').append(`<img src="${nowThing.imgUrl}" alt="图片"><div class="text">${nowThing.context}</div>`)
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

function initUI() {
  $("#title").addClass("isShow")
  $("#left-subtitle").addClass("isShow")
  $("#total-margin").addClass("isShow")
  $("#bar-chart").addClass("isShow")
  $("#start-timeline").addClass("isShow")
  $("#lineText").addClass("isShow")
  $("#timeline").addClass("isShow")
  $("#right-subtitle").addClass("isShow")
  $("#nightingale-chart").addClass("isShow")
  $("#topBtn").addClass("isShow")
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
