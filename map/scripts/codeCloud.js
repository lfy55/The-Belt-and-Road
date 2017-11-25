
let codeChart = {
  __dom: null,
  __chart: null,
  __option: {},
  initChart: function (data) {
    this.__dom = document.getElementById('chart');
    this.__chart = dcharts.init(this.__dom);

    var presents = ['一带一路', '亚投行', '穆斯林', '执政党', '民主党']

    var data = [];
    for (var i = 0; i < presents.length; ++i) {
      data.push({
        name: presents[i],
        value: (presents.length - i) * 20
      });
    }
    this.__option = {
      tooltip: {
        show: false
      },
      series: [{
        type: 'wordCloud',
        gridSize: 1,
        sizeRange: [25, 35],
        rotationRange: [0, 90],
        rotationStep: 90,
        textStyle: {
          normal: {
            color: function () {
              // Random color
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          }
        },
        width: 350,
        height: 240,
        top: 0,
        data: data
      }]
    };
    this.__chart.setOption(this.__option);
  },
  clearChart(data) {
    this.__chart.setOption({
      series: [
        {
        }
      ]
    })
  }
}
