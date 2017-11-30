let messageDom = $("#message_wrap"),
  pieDOM = $("#pie_wrap"),
  lineDom = $("#line_wrap"),
  populationDOM = $("#population_wrap"),
  GDPDOM = $("#GDP_wrap"),
  resourcesDOM = $("#resources_wrap"),
  populationStatusDOM = $("#population_wrap .total_subtitle_status"),
  GDPStatusDOM = $("#GDP_wrap .total_subtitle_status"),
  resourcesStatusDOM = $("#resources_wrap .total_subtitle_status")

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

function showShipin() {
  $({ value: 0 }).animate({ value: 1 }, {
    step: function (now) {
      $("#shipinqiandao_wrap").css('transform', 'scale(' + now + ')');
      $("#shipinqiandao").css('transform', 'scale(' + now + ')');
    },
    duration: 1500,
  })
}

function hideShipin() {
  $({ value: 1 }).animate({ value: 0 }, {
    step: function (now) {
      $("#shipinqiandao_wrap").css('transform', 'scale(' + now + ')');
      $("#shipinqiandao").css('transform', 'scale(' + now + ')');
    },
    duration: 1500,
  })
}

var populationChart = CreateBar('population_chart', '{c}亿'),
  GDPChart = CreateBar('GDP_chart', '${c}万亿'),
  pieChart = createPie('detail_pie_chart'),
  lineChart = createLine('detail_line_chart')

populationChart.initChart({
  xName: ['日本', '俄罗斯', '孟加拉国', '尼日利亚', '巴基斯坦', '巴西', '印度尼西亚', '美国', '印度', '中国'],
  xAxis: ['jp', 'ru', 'bd', 'ng', 'pk', 'br', 'id', 'us', 'in', 'cn'],
  series: [1.27, 1.44, 1.62, 1.85, 1.93, 2.07, 2.61, 3.23, 13.24, 13.78],
})
GDPChart.initChart({
  xName: ['加拿大', '巴西', '意大利', '印度', '法国', '英国', '德国', '日本', '中国', '美国'],
  xAxis: ['ca', 'br', 'it', 'in', 'fr', 'gb', 'de', 'jp', 'cn', 'us'],
  series: [1.53, 1.79, 1.85, 2.26, 2.46, 2.618, 3.46, 4.93, 11.19, 18.56],
})
pieChart.initChart()
lineChart.initChart()

populationStatusDOM.on('click', function () {
  GDPStatusDOM.removeClass('select')
  GDPStatusDOM[0].src = './images/total/status_noselect.png'
  resourcesStatusDOM.removeClass('select')
  resourcesStatusDOM[0].src = './images/total/status_noselect.png'
  populationStatusDOM.addClass('select')
  populationStatusDOM[0].src = './images/total/status_select.png'
})

GDPStatusDOM.on('click', function () {
  populationStatusDOM.removeClass('select')
  populationStatusDOM[0].src = './images/total/status_noselect.png'
  resourcesStatusDOM.removeClass('select')
  resourcesStatusDOM[0].src = './images/total/status_noselect.png'
  GDPStatusDOM.addClass('select')
  GDPStatusDOM[0].src = './images/total/status_select.png'
})

resourcesStatusDOM.on('click', function () {
  GDPStatusDOM.removeClass('select')
  GDPStatusDOM[0].src = './images/total/status_noselect.png'
  populationStatusDOM.removeClass('select')
  populationStatusDOM[0].src = './images/total/status_noselect.png'
  resourcesStatusDOM.addClass('select')
  resourcesStatusDOM[0].src = './images/total/status_select.png'
})

$("#shipinqiandao_wrap").on('click', function (e) {
  console.log(e)
  if (e.target.id === 'shipinqiandao_wrap') {
    hideShipin()
  }
})
$("#shipin_close").on('click', function () {
  hideShipin()
})