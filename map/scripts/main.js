window.onload = function () {
    var map;
    var vectorlayer;
    var markers = [];
    var animDuration = 10000;

    var cities = ['南京', '兰州', '多哈', '雅典', '伦敦'];
    var intes = [0, animDuration * 0.3, animDuration * 0.58, animDuration * 0.85, animDuration];
    var areas = ['中亚', '西亚', '俄罗斯', '地中海', '欧洲'];
    var areaCenter = [
        [66.55, 43.19],
        [51.56, 25.26],
        [43.81, 50],
        [8, 40],
        [4.29, 51.55]
    ];
    var areaColor = ['#990099', '#999933', '#669999', '#330066', '#666633'];
    var intes2 = [0, animDuration * 0.2, animDuration * 0.6, animDuration * 0.85, animDuration];
    var pts = [
        [118, 29],
        [83, 34],
        [58, 30],
        [24, 47],
        [3, 52]
    ];
    if (WebGLtest()) {
        initMap();
        map.addEventListener('baselayerload', function () {
            initData(pts);
        });

    } else {
        $("#noWebGL").show();
    }

    function initMap() {
        // mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpeHVhbiIsImEiOiJjaXpoczR4ejEwMWtrMnFtaWtmanl5Yms0In0.pGiOt4qQJHvEScUBK7qgZw';
        mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuZ2p1ZTExOTkiLCJhIjoiY2l3NzJsMXZ6MDA1MDJvcGVvOXZ5aGtxNiJ9.6Md6VaUCF6RJPQT5d95Lhw';
        map = new maptalks.Map("mapContainer",{
            center:   [74.1, 29.44456],
            zoom   :  4,
            baseLayer : new maptalks.MapboxglLayer('tile',{
                glOptions : {
                    'style' : 'mapbox://styles/wangjue1199/cja1sp6mu04hc2smyrdkc1460'
                }
            }),
        });

        // var baseLayer = new maptalks.MapboxglLayer('tile', {
        //     glOptions: {
        //         style: 'http://192.168.9.13/mapbox/json/basic.json'
        //     },
        //     opactity: 0.3
        // });

        // map = new maptalks.Map("mapContainer", {
        //     center: [74.1, 29.44456],
        //     zoom: 4,
        //     baseLayer: baseLayer
        // });

        vectorlayer = new maptalks.VectorLayer('vector').addTo(map);
    }

    // function createTimelinePointDOM(id) {
    //     var dom = document.createElement('div');
    //     dom.className = 'timeline-point';
    //     dom.id = id;
    //     return dom;
    // }

    function initData(points) {
        var coors = [];
        for (var k = 0; k < points.length; k++) {
            var coor = new maptalks.Coordinate(points[k]);
            coors.push(coor);
        }

        var line = new maptalks.QuadBezierCurve(coors, {
            'symbol': {
                lineColor: '#23ffe3',
                lineWidth: 3
            },
        }).addTo(vectorlayer);

        var symbol = [{
            'markerFile': '../map/images/timeline/slibar.png',
            'markerWidth': 40,
            'markerHeight': 40,
            'markerDx': 0,
            'markerDy': 20,
            'markerRotation': 0
        }, {
            'textFaceName': 'liHeiTi',
            'textName': '{name}',
            'textSize': 14,
            'textDy': 30,
            'textFill': '#23ffe3'
        }];

        var j = 0,
            j2 = 0;
        line.animateShow({
            duration: animDuration,
            easing: 'linear'
        }, function (frame, currCoord) {
            if (j < points.length && frame.state.progress > intes[j]) {
                var marker = new maptalks.Marker(coors[j], {
                    properties: {
                        'name': cities[j]
                    },
                    symbol: symbol
                }).addTo(vectorlayer);
                marker.addEventListener('click', function () {
                    var i = 0;
                    var that = this;
                    this.animate({
                        'symbol': symbol
                    }, {
                        'duration': 2000
                    }, function (frame) {
                        symbol[0].markerRotation = (i++) * 5;
                        that.updateSymbol(symbol);
                        if (frame.state.playState === 'finished') {}
                    });
                });
                j++;
            }

            if (j2 < areas.length && frame.state.progress > intes[j2]) {
                var circle = new maptalks.Circle(areaCenter[j2], 250000, {
                    properties: {
                        'name': areas[j2]
                    },
                    symbol: [{
                        'lineWidth': 0,
                        'polygonFill': areaColor[j2],
                        'polygonOpacity': 0.6
                    }, {
                        'textFaceName': 'liHeiTi',
                        'textName': '{name}',
                        'textSize': 14,
                        'textFill': '#fff'
                    }]
                }).addTo(vectorlayer);
                circle.animateShow({
                    duration: 1500,
                    easing: 'out'
                });
                j2++;
            }

            if (frame.state.playState == 'finished') {
                vectorlayer.getGeometries().forEach(function (element) {
                    if (element.getType() == 'Point') element.flash(200, 1);
                }, this);

                var text = new maptalks.Marker(
                    [51.56, 43], {
                        'properties': {
                            'name': '丝绸之路经济带'
                        },
                        'symbol': {
                            'textFaceName': 'liHeiTi',
                            'textName': '{name}', //value from name in geometry's properties
                            'textSize': 24, //'bold', 'bolder'
                            'textFill': '#993333',
                        }
                    }
                ).addTo(vectorlayer);
            }
        });



    }

}