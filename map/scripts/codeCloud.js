
let codeChart = {
  __dom: null,
  __chart: null,
  __option: {},
  initChart: function (data) {
    this.__dom = document.getElementById('chart_content');
    this.__chart = dcharts.init(this.__dom);

    var presents = ['圣诞树', '贺卡', '圣诞礼盒', '围巾', '袜子', '苹果', '手链', '巧克力', '玫瑰', '香水', '乐高', '芭比', '项链', '抱枕', '变形金刚', '摆件', '魔方', '文具', '棒棒糖', '蓝牙耳帽', '超级飞侠', '暖手宝', '夜灯', '堆袜', '耳钉', '公仔', '手机壳', '八音盒', '剃须刀', '打火机', '手表', '巴克球', '模型', '音响', '蒙奇奇', '保温杯']

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
        sizeRange: [10, 35],
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
        width: 600,
        height: 500,
        top: 40,
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
