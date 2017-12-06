let lineChart = {
  __dom: null,
  __chart: null,
  __option: {},
  __dataX: ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
  initChart: function (data) {
    this.__dom = document.getElementById('linebar_chart');
    this.__chart = echarts.init(this.__dom);
    this.__option = {
      tooltip: {
        trigger: 'axis',
        extraCssText: 'box-shadow: 0 0 40px rgba(35,255,227,0.6);',
        textStyle: {
          color: 'rgb(34, 246, 218)',
          fontSize: 18
        }
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: this.__dataX,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#00ffea'
          }
        },
        axisLabel: {
          color: '#00ffea'
        },
        splitLine: {
          show: false
        },
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#00ffea'
          }
        },
        axisLabel: {
          color: '#00ffea'
        },
        splitLine: {
          show: false
        },
      },
      grid: {
        top: 60,
        bottom: 10,
        left: 15,
        right: 15,
        containLabel: true,
      },
      series: [{
        name: 'GDP增长率',
        type: 'line',
        smooth: false,
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgba(6, 82, 78, 0.75)'
          }
        },
        clipOverflow: false,
        symbolSize: 0,
        hoverAnimation: false,
        areaStyle: {
          normal: {
            color: 'rgba(6, 82, 78, 0.75)',
          }
        },
        label: {
          normal: {
            show: false,
          }
        },
        data: data.dataLine,
        animation: true,
      }, {
        name: 'GDP增值',
        type: 'bar',
        barWidth: 5,
        itemStyle: {
          normal: {
            color: '#00ffea'
          }
        },
        data: data.dataBar
      }]
    };
    this.__chart.setOption(this.__option);
  },
  upDateChart(data) {
    this.__chart.setOption({
      series: [{
        data: data.dataY
      }]
    })
  }
}