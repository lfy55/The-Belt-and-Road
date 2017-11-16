
let lineChart = {
    __dom: null,
    __chart: null,
    __colors: ['#20efd5', '#20dac4', '#1bbba7', '#1ba998', '#15887a'],
    __option: {},
    __duration: 5000,
    __dataX: [],
    __dataY: [],
    initChart: function () {
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
                data: ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012']
            },
            yAxis: {
                show: false,
                type: 'value',
                // boundaryGap: [0, '100%']
            },
            grid: {
                top:0,
                bottom:0,
                left:0,
                right:0
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
                        },  {
                            offset: 0.8,
                            color: 'rgba(255,255,255,0)'
                        }])
                    }
                },
                data: ['300', '150', '100', '250', '50', '330', '150', '400', '300', '330', '250', '400'],
                animation: true,
                animationDuration: this.__duration
            }]
        };
        this.__chart.setOption(this.__option);
    },
}
