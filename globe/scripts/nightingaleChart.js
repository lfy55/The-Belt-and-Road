
let nightingaleChart = {
    __dom: null,
    __chart: null,
    __colors: ['#20efd5', '#20dac4', '#1bbba7', '#1ba998', '#15887a'],
    __option: {},
    __duration: 5000,
    initChart: function () {
        this.__dom = document.getElementById('nightingale-chart-content');
        this.__chart = echarts.init(this.__dom);
        this.__option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            grid: {
                top:0,
                bottom:0,
                left:0,
                right:0
            },
            calculable: true,
            series: [
                {
                    name: '半径模式',
                    type: 'pie',
                    radius: [50, 180],
                    roseType: 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: [
                        { value: 10, name: 'rose1' },
                        { value: 5, name: 'rose2' },
                        { value: 15, name: 'rose3' },
                        { value: 25, name: 'rose4' },
                        { value: 20, name: 'rose5' },
                        { value: 35, name: 'rose6' },
                        { value: 30, name: 'rose7' },
                        { value: 40, name: 'rose8' }
                    ]
                }
            ]

        };
        this.__chart.setOption(this.__option);
    },
}
