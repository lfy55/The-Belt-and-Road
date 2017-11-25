
let lineChart = {
  __dom: null,
  __chart: null,
  __option: {},
  initChart: function (data) {
    this.__dom = document.getElementById('lineChart');
    this.__chart = echarts.init(this.__dom);
    this.__option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['A', 'B', 'C', 'D'],
        left: 20,
        icon: 'rect',
        itemHeight: 3,
        textStyle: {
          color: '#eeeeee'
        }
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#333333',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#333333',
            },
          }
        }
      ],
      series: [
        {
          name: 'A',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'B',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'C',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: 'D',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320]
        }
      ]
    };
    this.__chart.setOption(this.__option);
  },
}
