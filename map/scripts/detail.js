lineChart.initChart({
  dataY: [300, 150, 100, 250, 50, 330, 150, 400, 300, 330, 250, 400, 420, 450, 480, 520]
});

radarChart.initChart();

$("#menu_wrap").on("click", '.menu_item', function (e) {
  var $_click = $(e.currentTarget)
  if ($_click.hasClass('selected')) {
    return
  }
  $("#menu_wrap .selected").removeClass("selected")
  $_click.addClass('selected')

  switch ($_click.attr("id")) {
    case "item_1":
      radarChart.initChart()
      break
    case "item_2":
      radarChart.initChart()
      break
    default:
      console.log($_click.attr("id"))
      break
  }
})