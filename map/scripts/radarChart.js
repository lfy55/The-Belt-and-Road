
let radarChart = {
    __dom: null,
    __chart: null,
    __option: {},
    initChart: function (data) {
        this.__dom = document.getElementById('chart_content');
        this.__chart = echarts.init(this.__dom);
        this.__option = {
            tooltip: {
                textStyle: {
                    color: 'rgb(34, 246, 218)',
                    fontSize: 18
                },
                extraCssText: 'box-shadow: 0 0 40px rgba(35,255,227,0.6);',
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
                            color: ['rgba(35,255,227,1)',
                                'rgba(0,0,0,1)', 'rgba(0,0,0,1)',
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
                            color: 'rgba(1,145,134,1)',
                            shadowColor: 'rgba(0, 255, 0, 0.8)',
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
                            value: data.data1,
                            name: '进口量',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(1,145,134, 0.7)'
                                }
                            }
                        },
                        {
                            value: data.data2,
                            name: '出口量',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(2,58,57,0.7)'
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
