barChart.initChart()
lineChart.initChart()

var $_countryName = $("#detail_countryName"),
  $_name = $("#detail_name"),
  $_imgWrap = $("#engineering_wrap .hasBorder"),
  $_content = $("#engineering_wrap .detail_message")

function changeDetail(detail) {
  $_countryName.html(detail.detail_country)
  $_name.html(detail.title)
  $_imgWrap.html(`<img src="${detail.detail_img}" alt="项目图片">`)
  $_content.html(detail.detail_message)
}

changeDetail(IDR.events[0])