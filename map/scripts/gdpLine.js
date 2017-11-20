
let lineChart = {
  __dom: null,
  __chart: null,
  __option: {},
  __dataX: ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
  initChart: function (data) {
    this.__dom = document.getElementById('gdp_line_content');
    this.__chart = echarts.init(this.__dom);
    this.__option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
        data: this.__dataX
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      grid: {
        top: 10,
        bottom: 0,
        left: 15,
        right: 15,
      },
      series: [{
        name: '模拟数据',
        type: 'line',
        smooth: false,
        sampling: 'average',
        itemStyle: {
          normal: {
            color: '#22f5da'
          }
        },
        clipOverflow: false,
        symbolSize: 10,
        hoverAnimation: false,
        lineStyle: {
          normal: {
            shadowColor: '#22f5da',
            shadowBlur: 20,
            width: 4
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            distance: 10,
            fontFamily: 'liHeiTi',
          }
        },
        data: data.dataY,
        animation: true,
      }]
    };
    this.__chart.setOption(this.__option);
  },
  upDateChart(data) {
    this.__chart.setOption({
      series: [
        {
          data: data.dataY
        }
      ]
    })
  }
}
