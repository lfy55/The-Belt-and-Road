
let nightingaleChart = {
    __dom: null,
    __chart: null,
    __colors: ['#20efd5', '#20dac4', '#1bbba7', '#1ba998', '#15887a'],
    __option: {},
    initChart: function () {
        this.__dom = document.getElementById('nightingale-chart-content');
        this.__chart = echarts.init(this.__dom);
        this.__option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            grid: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            calculable: true,
            series: [
                {
                    name: '经济产品',
                    type: 'pie',
                    radius: [50, 180],
                    roseType: 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal:{
                            borderWidth:8,
                            borderColor:'rgba(0,0,0,1)'
                        }
                    },
                    data: [
                        {
                            value: 10, name: '农业', itemStyle: {
                                normal: {
                                    color: '#20dac4'
                                }
                            }
                        },
                        {
                            value: 5, name: '运输邮电业', itemStyle: {
                                normal: {
                                    color: '#20efd5'
                                }
                            }
                        },
                        {
                            value: 15, name: '建筑业', itemStyle: {
                                normal: {
                                    color: '#1bbba7'
                                }
                            }
                        },
                        {
                            value: 25, name: '工业', itemStyle: {
                                normal: {
                                    color: '#1ba998'
                                }
                            }
                        },
                        {
                            value: 20, name: '商业', itemStyle: {
                                normal: {
                                    color: '#15887a'
                                }
                            }
                        }
                    ]
                }
            ]

        };
        this.__chart.setOption(this.__option);
    },
}
