
let barChart = {
  __dom: null,
  __chart: null,
  __option: {},
  initChart: function (data) {
    this.__dom = document.getElementById('barChart');
    this.__chart = echarts.init(this.__dom);
    this.__option = {
      color: ['#3398DB'],
      tooltip: {
        show: false,
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '0',
        top: '0',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['软件', '纺织', '工业', '商业', '金融', '食品', '交通', '通信', '化工'],
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              color: '#3398DB',
              fontSize: 14,
            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
        }
      ],
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: { color: '#333333' }
          },
          barGap: '-100%',
          barCategoryGap: '85%',
          data: new Array(9).fill(400),
          animation: false
        },
        {
          name: '直接访问',
          type: 'bar',
          data: [380, 320, 295, 276, 256, 210, 176, 160, 120]
        }
      ]
    };
    this.__chart.setOption(this.__option);
  },
}
