function createLine(domID) {
  return {
    __dom: document.getElementById(domID),
    __chart: null,
    __colors: ['#1dcf59', '#e23517'],
    __option: {},
    /**
     * 
     * @param {object} data 
     */
    initChart(data) {
      this.__chart = echarts.init(this.__dom)

      this.__option = {
        title: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        legend: {
          data: ['当前国家GDP增长率', '世界GDP增长率'],
          icon: 'rect',
          itemHeight: 3,
          right: 20,
          textStyle: {
            color: '#eeeeee'
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 5,
          top: 30,
          containLabel: true
        },
        toolbox: {
          show: false,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#c3c3c3',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#c3c3c3',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#c3c3c3',
            },
          }
        },
        color: this.__colors,
        series: [
          {
            name: '当前国家GDP增长率',
            type: 'line',
            symbolSize: 0,
            hoverAnimation: false,
            data: [2, 2, 3, 4, 5, 6, 6.5, 6.7, 1, 3.2, 3.3, 3.8, 6.5, 9, 9.5]
          },
          {
            name: '世界GDP增长率',
            type: 'line',
            symbolSize: 0,
            hoverAnimation: false,
            data: [6, 6.5, 8, 7, 9, 10, 10.6, 8.6, 5.5, 9.4, 11.5, 12.7, 14.2, 15.3, 17.6]
          },
        ]
      }

      this.__chart.setOption(this.__option)
    }
  }
}