const RADIUS = 450, PI = Math.PI, SIN_30 = Math.sin(PI / 6), COS_30 = Math.cos(PI / 6)
let controlCenter = $("#control_center_wrap"),
  controlCenterOut = $("#control_center_out"),
  controlItems = $(".control_item_wrap"),
  route = $("#route_wrap"),
  population = $("#population_wrap"),
  city = $("#city_wrap"),
  GDPMessage = $("#GDPMessage_wrap"),
  itemIsShow = false

controlCenter.on('click', function () {
  itemIsShow = !itemIsShow
  if (itemIsShow) {
    itemControl(0, 1)
    controlCenterOut.removeClass('hasAnimate')
  } else {
    itemControl(1, 0)
    controlCenterOut.addClass('hasAnimate')
  }
})

controlItems.on('click', function (e) {
  controlItems.removeClass('select')
  $(this).addClass('select')
})

function itemControl(start, end) {
  $({ value: start }).animate({ value: end }, {
    step: function (now) {
      controlItems.css('transform', `scale(${now * 0.75})`)
      route.css('left', `-${RADIUS * COS_30 * now}px`)
      route.css('top', `-${RADIUS * SIN_30 * now}px`)
      population.css('left', `-${RADIUS * SIN_30 * now}px`)
      population.css('top', `-${RADIUS * COS_30 * now}px`)
      city.css('right', `-${RADIUS * SIN_30 * now}px`)
      city.css('top', `-${RADIUS * COS_30 * now}px`)
      GDPMessage.css('right', `-${RADIUS * COS_30 * now}px`)
      GDPMessage.css('top', `-${RADIUS * SIN_30 * now}px`)
    },
    duration: 1500,
  })
}