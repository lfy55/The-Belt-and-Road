
let pieChart = {
  __dom: null,
  __chart: null,
  __option: {},
  initChart: function (data) {
    this.__dom = document.getElementById('bChart1');
    this.__chart = echarts.init(this.__dom);
    this.__option = {
      title: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      color: ['rgb(16,164,146)', 'rgb(49,51,55)'],
      series: [
        {
          name: '占比',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          hoverAnimation: false,
          data: [
            { value: 0.6, name: '有' },
            { value: 0.4, name: '无' },
          ],
          label: {
            normal: { show: false }
          }
        }
      ]
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
