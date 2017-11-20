
let radarChart = {
    __dom: null,
    __chart: null,
    __option: {},
    initChart: function () {
        this.__dom = document.getElementById('chart_content');
        this.__chart = echarts.init(this.__dom);
        this.__option = {
            title: {
                text: '自定义雷达图'
            },
            radar: [
                {
                    indicator: [
                        { text: '石油' },
                        { text: '煤炭' },
                        { text: '天然气' },
                        { text: '有色金属' },
                        { text: '其他' }
                    ],
                    center: ['50%', '50%'],
                    radius: 240,
                    startAngle: 90,
                    splitNumber: 4,
                    shape: 'circle',
                    name: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#fff7c9',
                            fontSize: 18
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(34, 246, 218, 1)',
                                'rgba(0,0,0, 1)', 'rgba(0,0,0, 1)',
                                'rgba(0,0,0,1)', 'rgba(0,0,0,1)'],
                            shadowColor: 'rgba(0, 255, 0, 0.1)',
                            shadowBlur: 20
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.8)',
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '雷达图',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            color: 'green',
                            shadowColor: '',
                            shadowBlur: 20
                        },
                        emphasis: {
                            color: 'white',
                            lineStyle: {
                                width: 4
                            }
                        }
                    },
                    data: [
                        {
                            value: [100, 8, 0.40, -180, 2000],
                            name: '图一',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(34, 246, 218, 0.5)'
                                }
                            }
                        },
                        {
                            value: [60, 5, 0.30, -100, 1500],
                            name: '图二',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(34, 246, 218, 0.7)'
                                }
                            }
                        }
                    ]
                }
            ]
        };
        this.__chart.setOption(this.__option);
    },
    clearChart(data) {
        this.__chart.setOption({
            series: [
                {
                }
            ]
        })
    }
}
