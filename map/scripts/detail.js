lineChart.initChart({
  dataY: [300, 150, 100, 250, 50, 330, 150, 400, 300, 330, 250, 400, 420, 450, 480, 520]
})

radarChart.initChart({
  data1: [100, 8, 0.40, -180, 2000],
  data2: [60, 5, 0.30, -100, 1500]
})

$("#menu_wrap").on("click", '.menu_item', function (e) {
  var $_click = $(e.currentTarget)
  if ($_click.hasClass('selected')) {
    return
  }
  $("#chart_wrap").empty()
  $("#chart_wrap").append(`<div id="chart_content"></div>`)
  $("#menu_wrap .selected").removeClass("selected")
  $_click.addClass('selected')

  switch ($_click.attr("id")) {
    case "item_1":
      radarChart.initChart({
        data1: [100, 8, 0.40, -180, 2000],
        data2: [60, 5, 0.30, -100, 1500]
      })
      break
    case "item_2":
      codeChart.initChart()
      break
    default:
      console.log($_click.attr("id"))
      break
  }
})
