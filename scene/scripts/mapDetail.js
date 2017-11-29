let messageDom = $("#message_wrap"),
  pieDOM = $("#pie_wrap"),
  lineDom = $("#line_wrap"),
  populationDOM = $("#population_wrap"),
  GDPDOM = $("#GDP_wrap"),
  resourcesDOM = $("#resources_wrap")

var video = document.createElement('video')
video.className = 'video'


function showDetail() {
  $({ value: 0 }).animate({
    value: 1
  }, {
      step: function (now) {
        populationDOM.css('left', 40 - 510 * now + 'px')
        GDPDOM.css('left', 40 - 510 * now + 'px')
        resourcesDOM.css('right', 40 - 360 * now + 'px')
      },
      duration: 500,
      done: function () { }
    })

  $({ value: 0 }).animate({
    value: 1,
  }, {
      step: function (now) {
        messageDom.css('transform', 'scale(' + now + ')');
        messageDom.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        messageDom.css('bottom', +(1 - now) * 45 + 5 + '%');
        pieDOM.css('transform', 'scale(' + now + ')');
        pieDOM.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        pieDOM.css('top', +(1 - now) * 40 + 10 + '%');
        lineDom.css('transform', 'scale(' + now + ')');
        lineDom.css('right', +(1 - now) * 46.2 + 3.8 + '%');
        lineDom.css('bottom', +(1 - now) * 45 + 5 + '%');
      },
      duration: 1500,
      done: function () { }
    })

}

function hideDetail(callback) {
  setTimeout(function () {
    $({ value: 1 }).animate({
      value: 0
    }, {
        step: function (now) {
          populationDOM.css('left', 40 - 510 * now + 'px')
          GDPDOM.css('left', 40 - 510 * now + 'px')
          resourcesDOM.css('right', 40 - 360 * now + 'px')
        },
        duration: 500,
        done: function () { }
      })
  }, 500)

  $({ value: 1 }).animate({
    value: 0,
  }, {
      step: function (now) {
        messageDom.css('transform', 'scale(' + now + ')');
        messageDom.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        messageDom.css('bottom', +(1 - now) * 45 + 5 + '%');
        pieDOM.css('transform', 'scale(' + now + ')');
        pieDOM.css('left', +(1 - now) * 46.2 + 3.8 + '%');
        pieDOM.css('top', +(1 - now) * 40 + 10 + '%');
        lineDom.css('transform', 'scale(' + now + ')');
        lineDom.css('right', +(1 - now) * 46.2 + 3.8 + '%');
        lineDom.css('bottom', +(1 - now) * 45 + 5 + '%');
      },
      duration: 1500,
      done: function () {
        if (callback) callback();
      }
    })
}
// showDetail()

var populationChart = CreateBar('population_chart'),
  GDPChart = CreateBar('GDP_chart'),
  pieChart = createPie('detail_pie_chart')

populationChart.initChart({
  xName: ['法国', '英国', '德国', '日本', '中国', '法国', '英国', '德国', '日本', '中国'],
  xAxis: ['fr', 'gb', 'de', 'jp', 'cn', 'fr', 'gb', 'de', 'jp', 'cn'],
  series: [1.46, 1.6, 2.01, 3.98, 10.64, 1.46, 1.6, 2.01, 3.98, 10.64],
})
GDPChart.initChart({
  xName: ['法国', '英国', '德国', '中国', '美国', '法国', '英国', '德国', '中国', '美国'],
  xAxis: ['fr', 'gb', 'de', 'cn', 'us', 'fr', 'gb', 'de', 'cn', 'us'],
  series: [1.46, 1.6, 2.01, 3.98, 10.64, 1.46, 1.6, 2.01, 3.98, 10.64],
})
// pieChart.initChart()