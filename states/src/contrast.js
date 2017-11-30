$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function () {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  }
});

let data = {
  country1: new Array(15).fill(0),
  country2: new Array(15).fill(0),
},
  lineChart = createLine('contrast_chart'),
  contrast_wrap = $("#contrast_wrap")

function fillData(index) {
  switch (index) {
    case 1:
      data.country1.forEach((item, index) => {
        if (index === 0) {
          data.country1[index] = ~~(Math.random() * 5000) + 30000
          data.country2[index] = ~~(Math.random() * 4000) + 35000
        } else {
          data.country1[index] = data.country1[index - 1] - (~~(Math.random() * 1000))
          data.country2[index] = data.country2[index - 1] - (~~(Math.random() * 600))
        }
      })
      break;

    default:
      data.country1.forEach((item, index) => {
        if (index === 0) {
          data.country1[index] = ~~Math.random(50) + 300
          data.country2[index] = ~~Math.random(40) + 350
        } else {
          data.country1[index] = data.country1[index - 1] + (~~(Math.random() * 100))
          data.country2[index] = data.country2[index - 1] + (~~(Math.random() * 200))
        }
      })
      break;
  }
}

fillData(1)
lineChart.initChart(data)
// lineChart.updataChart(data)

$("#contrast_close").on('click', function () {
  contrast_wrap.animateCss('bounceOutLeft', function () {
    contrast_wrap.css('visibility', 'hidden')
  })
})
$(".contrast_item").on("click", function () {
  $(".contrast_item").removeClass('select')
  $(this).addClass('select')

  var i = +this.id.split('_')[2]
  fillData(i)
  lineChart.updataChart(data)
})

function showContrast() {
  contrast_wrap.css('visibility', 'visible')
  contrast_wrap.animateCss('bounceInLeft')
}