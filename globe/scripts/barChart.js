var barChart = {
  __dom: null,
  __chart: null,
  __colors: ['#20efd5', '#20dac4', '#1bbba7', '#1ba998', '#15887a'],
  __option: {},
  /**
   * 
   * @param {object} data 
   */
  initChart(data) {
    this.__dom = document.getElementById('chart-content')
    this.__chart = echarts.init(this.__dom)

    var seriesData = data.series.map((item, index) => {
      return {
        value: item,
        itemStyle: {
          normal: {
            color: this.__colors[index]
          },
          emphasis: {
            color: this.__colors[index]
          }
        },
      }
    })

    this.__option = {
      tooltip: {
        show: false,
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: 34,
        containLabel: false,
      },
      xAxis: [
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
            formatter: function (e) {
              return `{${e}|}`
            },
            rich: {
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
      yAxis: [
        {
          type: 'value',
          show: false,
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
              position: 'top',
              formatter: '${c}万亿',
              fontSize: 14,
              distance: 15,
              fontFamily: 'liHeiTi',
            },
          },
          data: seriesData
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
    var seriesData = data.series.map((item, index) => {
      return {
        value: item,
        itemStyle: {
          normal: {
            color: this.__colors[index]
          },
          emphasis: {
            color: this.__colors[index]
          }
        },
      }
    })

    this.__chart.setOption({
      xAxis: [
        {
          data: data.xAxis,
        }
      ],
      series: [
        {
          data: seriesData
        }
      ]
    })
  }
}