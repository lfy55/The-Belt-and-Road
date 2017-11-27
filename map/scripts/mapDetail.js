let chartDom = $("#chart_wrap"),
  heatMapDOM = $("#heatmap_wrap"),
  textDom = $("#text_wrap")

var video = document.createElement('video')
video.className = 'video'
heatMapDOM.append(video)

function showDetail() {
  chartDom.animate({
    scaleIndex: 1,
  }, {
    step: function (now) {
      chartDom.css('transform', 'scale(' + now + ')');
      chartDom.css('right', +(1 - now) * 40 + 5 + '%');
      chartDom.css('bottom', +(1 - now) * 40 + 5 + '%');
      heatMapDOM.css('transform', 'scale(' + now + ')');
      heatMapDOM.css('left', +(1 - now) * 40 + 5 + '%');
      heatMapDOM.css('bottom', +(1 - now) * 40 + 5 + '%');
      textDom.css('transform', 'scale(' + now + ')');
      textDom.css('right', +(1 - now) * 40 + 5 + '%');
      textDom.css('top', +(1 - now) * 40 + 5 + '%');
    },
    duration: 1500,
    done: function () {}
  })
  video.src = './images/heatmap.mp4'
  video.play()
  changeChart("资源分布")
}

function hideDetail(callback) {
  chartDom.animate({
    scaleIndex: 0,
  }, {
    step: function (now) {
      chartDom.css('transform', 'scale(' + now + ')');
      chartDom.css('right', +(1 - now) * 40 + 5 + '%');
      chartDom.css('bottom', +(1 - now) * 40 + 5 + '%');
      heatMapDOM.css('transform', 'scale(' + now + ')');
      heatMapDOM.css('left', +(1 - now) * 40 + 5 + '%');
      heatMapDOM.css('bottom', +(1 - now) * 40 + 5 + '%');
      textDom.css('transform', 'scale(' + now + ')');
      textDom.css('right', +(1 - now) * 40 + 5 + '%');
      textDom.css('top', +(1 - now) * 40 + 5 + '%');
    },
    duration: 1500,
    done: function () {
      if (callback) callback();
    }
  })
}

const charts = ["资源分布", "国家组织"]
let index = 0
chartDom.on('click', function () {
  index++
  changeChart(charts[index % 2])
})

function changeChart(title) {
  chartDom.empty()
  chartDom.append(`<div id="chartSubTitle">${title}</div>
  <div id="chart"></div>`)

  setTimeout(() => {
    if (title === "资源分布") {
      radarChart.initChart({
        data1: [100, 8, 0.40, -180, 2000],
        data2: [60, 5, 0.30, -100, 1500]
      })
    } else {
      codeChart.initChart()
    }
  }, 0)
}
pieChart.initChart()
pieChart2.initChart()
pieChart3.initChart()
// showDetail()