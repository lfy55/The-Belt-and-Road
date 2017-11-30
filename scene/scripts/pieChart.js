function createPie(domID) {
  return {
    __dom: document.getElementById(domID),
    __chart: null,
    __colors: ['#3e86df', '#17e512'],
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
        color: this.__colors,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            hoverAnimation: false,
            data: [
              { value: 335, name: '宗教A' },
              { value: 1548, name: '宗教B' }
            ],
            label: {
              normal: {
                show: true
              }
            },
            labelLine: {
              normal: {
                length2: 50,
              }
            }
          }
        ]
      }

      this.__chart.setOption(this.__option)
    }
  }
}