
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
        data: ['中国', '美国', '日本', '德国'],
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
          data: ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']
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
      color: ['#e93213', '#eaef12', '#09906b', '#16d9ef'],
      series: [
        {
          name: '中国',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 360]
        },
        {
          name: '美国',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 270]
        },
        {
          name: '日本',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 361]
        },
        {
          name: '德国',
          type: 'line',
          symbolSize: 0,
          hoverAnimation: false,
          smooth: true,
          data: [320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320, 168]
        }
      ]
    };
    this.__chart.setOption(this.__option);
  },
}
