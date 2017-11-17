
let lineChart = {
    __dom: null,
    __chart: null,
    __option: {},
    __dataX: ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    initChart: function (data) {
        this.__dom = document.getElementById('line-chart-content');
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
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            series: [{
                name: '模拟数据',
                type: 'line',
                smooth: false,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#22f5da'
                    }
                },
                lineStyle: {
                    normal: {
                        shadowColor: '#22f5da',
                        shadowBlur: 20,
                        width: 4
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#22f5da'
                        }, {
                            offset: 0.8,
                            color: 'rgba(255,255,255,0)'
                        }])
                    }
                },
                data: data.dataY,
                animation: true,
                animationDuration: data.duration
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
