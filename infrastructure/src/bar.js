
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
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
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#3398DB'
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
          data: [10, 52, 200, 334, 390, 330, 220, 160, 180]
        }
      ]
    };
    this.__chart.setOption(this.__option);
  },
}
