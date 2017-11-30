function createLine(domID) {
  return {
    __dom: document.getElementById(domID),
    __chart: null,
    __colors: ['#5de6f6', '#46f2b0'],
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
          show: false,
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
            textStyle: {
              color: "#fff",
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(35,97,110,0.5)',
              width: 5,
            },
          },
          splitLine: {
            interval: 2,
            lineStyle: {
              color: 'rgba(35,97,110,0.5)',
            }
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#fff',
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(35,97,110,0.5)',
            },
          },
          splitLine: {
            show: false,
          }
        },
        color: this.__colors,
        series: [
          {
            name: '当前国家GDP增长率',
            type: 'line',
            symbolSize: 0,
            lineStyle: {
              normal: {
                shadowColor: "#fff",
                shadowBlur: 10,
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#5de6f6',
                  }, {
                    offset: 0.6, color: 'rgba(255,255,255,0)',
                  }, {
                    offset: 1, color: 'rgba(255,255,255,0)',
                  }]
                }
              }
            },
            hoverAnimation: false,
            data: data.country1
          },
          {
            name: '世界GDP增长率',
            type: 'line',
            symbolSize: 0,
            lineStyle: {
              normal: {
                shadowColor: "#fff",
                shadowBlur: 10,
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#46f2b0',
                  }, {
                    offset: 0.6, color: 'rgba(255,255,255,0)',
                  }, {
                    offset: 1, color: 'rgba(255,255,255,0)',
                  }]
                }
              }
            },
            hoverAnimation: false,
            data: data.country2
          },
        ]
      }

      this.__chart.setOption(this.__option)
    },
    updataChart(data) {
      this.__chart.setOption({
        series: [
          {
            data: data.country1
          },
          {
            data: data.country2
          }
        ]
      })
    }
  }
}