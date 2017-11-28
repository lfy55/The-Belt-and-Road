function CreateBar(domID) {
  return {
    __dom: document.getElementById(domID),
    __chart: null,
    __colors: ['#20efd5', '#20dac4', '#1bbba7', '#1ba998', '#15887a'],
    __option: {},
    /**
     * 
     * @param {object} data 
     */
    initChart(data) {
      this.__chart = echarts.init(this.__dom)

      this.__option = {
        tooltip: {
          show: false,
        },
        grid: {
          left: 100,
          right: 30,
          bottom: 0,
          top: 0,
          containLabel: false,
        },
        xAxis: [
          {
            type: 'value',
            show: false,
          }
        ],
        color: ['#00ffcc'],
        yAxis: [
          {
            show: true,
            type: 'category',
            data: data.xAxis,
            axisTick: {
              show: false,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#20efd5',
                width: 2,
              }
            },
            axisLabel: {
              color: '#fff',
              fontSize: 14,
              formatter: function (e, e1) {
                console.log(e, e1)
                return `{num|${5 - e1}}{name|${data.xName[e1]}}{${e}|}`
              },
              rich: {
                num: {
                  color: '#fff',
                  width: 15,
                  align: 'left'
                },
                name: {
                  color: '#fff',
                  width: 30,
                  align: 'right'
                },
                cn: {
                  height: 28,
                  backgroundColor: {
                    image: './images/flags/CN@2x.png'
                  }
                },
                de: {
                  height: 28,
                  backgroundColor: {
                    image: './images/flags/DE@2x.png'
                  }
                },
                fr: {
                  height: 28,
                  backgroundColor: {
                    image: './images/flags/FR@2x.png'
                  }
                },
                gb: {
                  height: 28,
                  backgroundColor: {
                    image: './images/flags/GB@2x.png'
                  }
                },
                jp: {
                  height: 28,
                  backgroundColor: {
                    image: './images/flags/JP@2x.png'
                  }
                },
                us: {
                  height: 28,
                  backgroundColor: {
                    image: './images/flags/US@2x.png'
                  }
                }
              },
            },
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '40%',
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '${c}万亿',
                fontSize: 14,
                distance: 15,
              },
            },
            data: data.series
          }
        ]
      }

      this.__chart.setOption(this.__option)
    },
    /**
       * 
       * @param {object} data 
       */
    upDateChart(data) {
    }
  }
}