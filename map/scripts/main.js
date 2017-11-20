window.onload = function () {
    var map;
    var vectorlayer;
    var markers = [];

    var citiesLD = ['西安', '兰州', '乌鲁木齐', '阿拉木图', '德黑兰', '伊斯坦布尔', '莫斯科', '杜伊斯堡'];
    var citiesCoordsLD = [
        [108.93, 34.27],
        [103.73, 36.03],
        [87.68, 43.77],
        [76.55, 43.19],
        [51.25, 35.40],
        [28.58, 41.02],
        [37.35, 55.45],
        [6.45, 51.25]
    ];

    var citiesHS = ['福州', '广州', '河内', '吉隆坡', '雅加达', '加尔各答', '科伦坡', '内罗毕', '雅典', '威尼斯', '鹿特丹'];
    var citiesCoordsHS = [
        [119.30, 26.08],
        [113.23, 23.16],
        [105.84, 21.03],
        [101.42, 3.08],
        [106.49, -6.10],
        [88.20, 22.33],
        [79.52, 6.55],
        [36.49, -1.17],
        [23.44, 38.02],
        [12.20, 45.26],
        [4.29, 51.55]
    ];

    var areaColor = ['rgba(102,153,153,0.3)', 'rgba(102,153,153,0.3)', 'rgba(102,153,153,0.3)',
        'rgba(51,0,102,0.3)', 'rgba(102,153,153,0.3)', 'rgba(51,0,102,0.3)', 'rgba(102,153,153,0.3)', 'rgba(102,153,153,0.3)',
        'rgba(51,0,102,0.3)'
    ];
    var areas = ['中亚', '西亚', '俄罗斯', '地中海', '欧洲', '南海', '东南亚', '南亚', '印度洋'];
    var areasCenters = [
        [60.55, 40.19],
        [43.56, 28.26],
        [46.81, 55],
        [8, 40],
        [0.29, 45.55],
        [114.56, 12.26],
        [113.81, 0],
        [78, 20],
        [60, 10],
    ];

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

    if (WebGLtest()) {
        initMap();
        initData();
    } else {
        $("#noWebGL").show();
    }

    function initMap() {
        // mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpeHVhbiIsImEiOiJjaXpoczR4ejEwMWtrMnFtaWtmanl5Yms0In0.pGiOt4qQJHvEScUBK7qgZw';
        // mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuZ2p1ZTExOTkiLCJhIjoiY2l3NzJsMXZ6MDA1MDJvcGVvOXZ5aGtxNiJ9.6Md6VaUCF6RJPQT5d95Lhw';
        // map = new maptalks.Map("mapContainer",{
        //     center:   [70.1, 29.44456],
        //     zoom   :  3,
        //     baseLayer : new maptalks.MapboxglLayer('tile',{
        //         glOptions : {
        //             'style' : 'mapbox://styles/wangjue1199/cja1sp6mu04hc2smyrdkc1460'
        //         }
        //     }),
        // });

        var features = topojson.feature(world, world.objects.land);
        var polygons = features.features.map(function (f) {
            var geo = maptalks.GeoJSON.toGeometry(f);
            geo._geometries.splice(53, 1);
            geo.setId(null);
            geo.config('antiMeridian', 'split');
            geo.setSymbol({
                lineColor: '#23ffe3',
                lineWidth: 2,
                polygonFill: 'rgba(35,256,237,0.3)'
            });
            return geo;
        });
        map = new maptalks.Map('mapContainer', {
            center: [67.7903012612708142, 25.976349249268345],
            zoom: 3,
            baseLayer: new maptalks.VectorLayer('v', {
                opacity: 0.3
            }),
            pitch: 20
        });

        map.setSpatialReference({
            projection: 'EPSG:4326',
            resolutions: (function () {
                const resolutions = [];
                for (let i = 0; i < 19; i++) {
                    resolutions[i] = 180 / (Math.pow(2, i) * 128);
                }
                return resolutions;
            })()
        });

        vectorlayer = new maptalks.VectorLayer('vector1').addTo(map);
        vectorlayer2 = new maptalks.VectorLayer('vector2').addTo(map);
        map.getLayer('v').addGeometry(polygons);
        vectorlayer2.setZIndex(1);
    }

    function initData() {

        var convertData = function (names, coords) {
            var res = [];
            for (var i = 0; i < names.length - 1; i++) {
                res.push({
                    fromName: names[i],
                    toName: names[i + 1],
                    coords: [coords[i], coords[i + 1]]
                });
            }
            return res;
        };

        var insertCoords = function (seg, b) {
            var st = seg[0];
            var ed = seg[1];
            var midx = (seg[0][0] + seg[1][0]) / 2;
            if (b) {
                var midy = (seg[0][1] + seg[1][1]) / 2 - Math.abs(seg[0][0] - seg[1][0]) * 0.16;
            } else {
                var midy = (seg[0][1] + seg[1][1]) / 2 + Math.abs(seg[0][0] - seg[1][0]) * 0.16;
            }
            return [st, [midx, midy], ed];
        }

        var addMarker = function (coord, name) {
            var marker = new maptalks.Marker(coord, {
                properties: {
                    'name': name
                },
                symbol: symbol
            }).addTo(vectorlayer);
            if (name == '杜伊斯堡' || name == '威尼斯') {
                marker.updateSymbol({
                    'textDx': 40,
                    'textDy': 0
                })
            } else if (name == '鹿特丹') {
                marker.updateSymbol({
                    'textDx': -40,
                    'textDy': 0
                })
            } else if (name == '伊斯坦布尔') {
                marker.updateSymbol({
                    'textDx': 40,
                    'textDy': 20
                })
            }
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
        }

        var road1 = convertData(citiesLD, citiesCoordsLD);
        var road2 = convertData(citiesHS, citiesCoordsHS);
        addMarker(road1[0].coords[0], citiesLD[0]);
        var ri = 0;
        var inteval = setInterval(function () {
            if (ri == road1.length - 1) {
                clearInterval(inteval);
            }
            var line = new maptalks.QuadBezierCurve(insertCoords(road1[ri].coords, ri % 2 == 0), {
                'symbol': {
                    lineColor: '#23ffe3',
                    lineWidth: 3,
                    shadowBlur: 5
                },
            }).addTo(vectorlayer);
            line.animateShow({
                duration: 500,
                easing: 'linear'
            }, function (frame, currCoord) {
                if (frame.state.playState == 'finished') {
                    addMarker(road1[ri].coords[1], citiesLD[ri + 1]);
                    ri++;
                }
                if (ri == road1.length) {
                    new maptalks.Marker(
                        [108.56, 40], {
                            'properties': {
                                'name': '丝绸之路经济带'
                            },
                            'symbol': {
                                'textFaceName': 'liHeiTi',
                                'textName': '{name}',
                                'textSize': 22,
                                'textFill': '#993333',
                            }
                        }
                    ).addTo(vectorlayer2);
                }
            });
        }, 650);

        addMarker(road2[0].coords[0], citiesHS[0]);
        var rj = 0;
        var inteval2 = setInterval(function () {
            if (rj == road2.length - 1) {
                clearInterval(inteval2);
            }
            if (citiesHS[rj + 1] == '吉隆坡') {
                var curveCoords = [
                    road2[rj].coords[0],
                    [112, 12.4],
                    road2[rj].coords[1]
                ];
            } else if (citiesHS[rj + 1] == '河内') {
                var curveCoords = [
                    road2[rj].coords[0],
                    [111, 18.4],
                    road2[rj].coords[1]
                ];
            } else if (citiesHS[rj + 1] == '雅加达') {
                var curveCoords = [
                    road2[rj].coords[0],
                    [108.6, 0.6],
                    road2[rj].coords[1]
                ];
            } else if (citiesHS[rj + 1] == '加尔各答') {
                var curveCoords = [
                    road2[rj].coords[0],
                    [89.3, 4.7],
                    road2[rj].coords[1]
                ];
            } else if (citiesHS[rj + 1] == '雅典') {
                var curveCoords = [
                    road2[rj].coords[0],
                    [58.93, 13.81],
                    [41.59, 11.19],
                    [34.03, 31.25],
                    road2[rj].coords[1]
                ];
            } else {
                var curveCoords = insertCoords(road2[rj].coords, rj % 2 == 0);
            }
            var line = new maptalks.QuadBezierCurve(curveCoords, {
                'symbol': {
                    lineColor: '#23ffe3',
                    lineWidth: 3,
                    lineDasharray: [5, 5]
                },
            }).addTo(vectorlayer);
            line.animateShow({
                duration: 500,
                easing: 'linear'
            }, function (frame, currCoord) {
                if (frame.state.playState == 'finished') {
                    addMarker(road2[rj].coords[1], citiesHS[rj + 1]);
                    rj++;
                }
                if (rj == road2.length) {
                    new maptalks.Marker(
                        [58.56, -3], {
                            'properties': {
                                'name': '丝绸之路海上经济带'
                            },
                            'symbol': {
                                'textFaceName': 'liHeiTi',
                                'textName': '{name}', //value from name in geometry's properties
                                'textSize': 22, //'bold', 'bolder'
                                'textFill': '#993333',
                            }
                        }
                    ).addTo(vectorlayer2);
                }
            });
        }, 650);

        for (var j = 0; j < areasCenters.length; j++) {
            var marker1 = new maptalks.Marker(areasCenters[j], {
                'properties': {
                    'name': areas[j]
                },
                symbol: [{
                    'markerType': 'ellipse',
                    'markerFill': {
                        'type': 'radial',
                        'colorStops': [
                            [0.00, 'rgba(255,255,255,0)'],
                            [0.10, areaColor[j]],
                            [1.00, areaColor[j]]
                        ]
                    },
                    'markerLineWidth': 0,
                    'markerWidth': 50,
                    'markerHeight': 50
                }, {
                    'textFaceName': 'liHeiTi',
                    'textName': '{name}', //value from name in geometry's properties
                    'textSize': 16, //'bold', 'bolder'
                    'textFill': '#993333',
                }]
            }).addTo(vectorlayer2);
        }

    }

}