function getFlag(name) {
  return {
    height: 24,
    backgroundColor: {
      image: './images/flags/' + name.toLocaleUpperCase() + '@2x.png'
    }
  }
}
function CreateBar(domID, format) {
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

      var richClass = {
        num: {
          color: '#fff',
          width: 20,
          align: 'left',
          padding: [0, 0, 0, 5],
        },
        name: {
          color: '#fff',
          width: 40,
          align: 'right',
          padding: [0, 10, 0, 0],
        },
      }
      data.xAxis.forEach(function (item) {
        if (!richClass[item]) {
          richClass[item] = getFlag(item)
        }
      })

      this.__option = {
        tooltip: {
          show: false,
        },
        grid: {
          left: 130,
          right: 45,
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
                return `{num|${('0' + (10 - e1)).slice(-2)}}{name|${data.xName[e1]}} {${e}|}`
              },
              rich: richClass,
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
                formatter: format,
                fontSize: 14,
                distance: 5,
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