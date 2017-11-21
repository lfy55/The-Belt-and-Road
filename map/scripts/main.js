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

    var iranCoords = [
        [53.921598, 37.198918],
        [54.800304, 37.392421],
        [55.511578, 37.964117],
        [56.180375, 37.935127],
        [56.619366, 38.121394],
        [57.330434, 38.029229],
        [58.436154, 37.522309],
        [59.234762, 37.412988],
        [60.377638, 36.527383],
        [61.123071, 36.491597],
        [61.210817, 35.650072],
        [60.803193, 34.404102],
        [60.52843, 33.676446],
        [60.9637, 33.528832],
        [60.536078, 32.981269],
        [60.863655, 32.18292],
        [60.941945, 31.548075],
        [61.699314, 31.379506],
        [61.781222, 30.73585],
        [60.874248, 29.829239],
        [61.369309, 29.303276],
        [61.771868, 28.699334],
        [62.72783, 28.259645],
        [62.755426, 27.378923],
        [63.233898, 27.217047],
        [63.316632, 26.756532],
        [61.874187, 26.239975],
        [61.497363, 25.078237],
        [59.616134, 25.380157],
        [58.525761, 25.609962],
        [57.397251, 25.739902],
        [56.970766, 26.966106],
        [56.492139, 27.143305],
        [55.72371, 26.964633],
        [54.71509, 26.480658],
        [53.493097, 26.812369],
        [52.483598, 27.580849],
        [51.520763, 27.86569],
        [50.852948, 28.814521],
        [50.115009, 30.147773],
        [49.57685, 29.985715],
        [48.941333, 30.31709],
        [48.567971, 29.926778],
        [48.014568, 30.452457],
        [48.004698, 30.985137],
        [47.685286, 30.984853],
        [47.849204, 31.709176],
        [47.334661, 32.469155],
        [46.109362, 33.017287],
        [45.416691, 33.967798],
        [45.64846, 34.748138],
        [46.151788, 35.093259],
        [46.07634, 35.677383],
        [45.420618, 35.977546],
        [44.77267, 37.17045],
        [44.225756, 37.971584],
        [44.421403, 38.281281],
        [44.109225, 39.428136],
        [44.79399, 39.713003],
        [44.952688, 39.335765],
        [45.457722, 38.874139],
        [46.143623, 38.741201],
        [46.50572, 38.770605],
        [47.685079, 39.508364],
        [48.060095, 39.582235],
        [48.355529, 39.288765],
        [48.010744, 38.794015],
        [48.634375, 38.270378],
        [48.883249, 38.320245],
        [49.199612, 37.582874],
        [50.147771, 37.374567],
        [50.842354, 36.872814],
        [52.264025, 36.700422],
        [53.82579, 36.965031],
        [53.921598, 37.198918]

    ];
    var pakistanCoords = [
        [75.158028, 37.133031],
        [75.896897, 36.666806],
        [76.192848, 35.898403],
        [77.837451, 35.49401],
        [76.871722, 34.653544],
        [75.757061, 34.504923],
        [74.240203, 34.748887],
        [73.749948, 34.317699],
        [74.104294, 33.441473],
        [74.451559, 32.7649],
        [75.258642, 32.271105],
        [74.405929, 31.692639],
        [74.42138, 30.979815],
        [73.450638, 29.976413],
        [72.823752, 28.961592],
        [71.777666, 27.91318],
        [70.616496, 27.989196],
        [69.514393, 26.940966],
        [70.168927, 26.491872],
        [70.282873, 25.722229],
        [70.844699, 25.215102],
        [71.04324, 24.356524],
        [68.842599, 24.359134],
        [68.176645, 23.691965],
        [67.443667, 23.944844],
        [67.145442, 24.663611],
        [66.372828, 25.425141],
        [64.530408, 25.237039],
        [62.905701, 25.218409],
        [61.497363, 25.078237],
        [61.874187, 26.239975],
        [63.316632, 26.756532],
        [63.233898, 27.217047],
        [62.755426, 27.378923],
        [62.72783, 28.259645],
        [61.771868, 28.699334],
        [61.369309, 29.303276],
        [60.874248, 29.829239],
        [62.549857, 29.318572],
        [63.550261, 29.468331],
        [64.148002, 29.340819],
        [64.350419, 29.560031],
        [65.046862, 29.472181],
        [66.346473, 29.887943],
        [66.381458, 30.738899],
        [66.938891, 31.304911],
        [67.683394, 31.303154],
        [67.792689, 31.58293],
        [68.556932, 31.71331],
        [68.926677, 31.620189],
        [69.317764, 31.901412],
        [69.262522, 32.501944],
        [69.687147, 33.105499],
        [70.323594, 33.358533],
        [69.930543, 34.02012],
        [70.881803, 33.988856],
        [71.156773, 34.348911],
        [71.115019, 34.733126],
        [71.613076, 35.153203],
        [71.498768, 35.650563],
        [71.262348, 36.074388],
        [71.846292, 36.509942],
        [72.920025, 36.720007],
        [74.067552, 36.836176],
        [74.575893, 37.020841],
        [75.158028, 37.133031]
    ];


    var symbol = [{
        'markerFile': '../map/images/timeline/slibar.png',
        'markerWidth': 40,
        'markerHeight': 40,
        'markerDx': 0,
        'markerDy': 20,
        'markerRotation': 0
    }, {
        'textFaceName': 'YouYuan',
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
            geo.config('shadowBlur', 20);
            geo.config('shadowColor', '#23ffe3');
            geo.setSymbol({
                lineColor: '#23ffe3',
                lineWidth: 2,
                polygonFill: 'rgba(35,256,237,0.3)',
            });
            return geo;
        });
        map = new maptalks.Map('mapContainer', {
            center: [67.7903012612708142, 25.976349249268345],
            zoom: 3,
            baseLayer: new maptalks.VectorLayer('v', {
                opacity: 0.3,
                enableAltitude: true,
                drawAltitude: {
                    polygonFill: '#fff',
                    polygonOpacity: 0.8,
                    lineWidth: 0
                }
            }),
            pitch: 0
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
        vectorlayer2.setZIndex(1);

        // var altitudeArray = new Array(iranCoords.length);
        // fruits.fill("Runoob");
        var iran1 = new maptalks.LineString(iranCoords, {
            symbol: {
                lineColor: '#23ffe3',
                lineWidth: 2
            },
            properties: {
                altitude: 0
            }
        });

        var iran2 = new maptalks.Polygon(iranCoords, {
            symbol: {
                lineWidth: 0,
                polygonFill: '#23ffe3',
                polygonOpacity: 0.6
            },
            properties: {
                altitude: 0
            }
        });

        var pakistan1 = new maptalks.LineString(pakistanCoords, {
            symbol: {
                lineColor: '#23ffe3',
                lineWidth: 2
            },
            properties: {
                altitude: 0
            }
        });

        var pakistan2 = new maptalks.Polygon(pakistanCoords, {
            symbol: {
                lineWidth: 0,
                polygonFill: '#23ffe3',
                polygonOpacity: 0.6
            },
            properties: {
                altitude: 0
            }
        });

        map.getBaseLayer().addGeometry(polygons);
        map.getBaseLayer().addGeometry([iran1, iran2, pakistan1, pakistan2]);

        iran2.addEventListener('click', function () {
            map.animateTo({
                pitch: 45,
                center: [51.25, 35.40],
                zoom: 5
            }, {
                duration: 2000,
                easing: 'out'
            });
            setTimeout(function () {
                maptalks.animation.Animation.animate({
                    properties: {
                        altitude: 500000
                    }
                }, {
                    'duration': 2000
                }, frame => {
                    if (frame.state.playState == 'running') {
                        iran1.setProperties(frame.styles.properties);
                        iran2.setProperties(frame.styles.properties);
                    }
                }).play();
            }, 2000);
        });
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
                    var text = new maptalks.Marker(
                        [108.56, 50], {
                            'properties': {
                                'name': '丝绸之路经济带'
                            },
                            'symbol': [{
                                'markerType': 'rectangle',
                                'markerFill': 'rgba(0,0,0,0.6)',
                                'markerLineColor': '#fff',
                                'markerLineWidth': '2',
                                'markerHeight': 30,
                                'markerWidth': 200,
                                'markerDx': -100,
                                'markerDy': -18
                            }, {
                                'textFaceName': 'LiSu',
                                'textName': '{name}', //value from name in geometry's properties
                                'textSize': 22,
                                'textFill': '#00cc99',
                            }]
                        }
                    ).addTo(vectorlayer2);
                    text.setInfoWindow({
                        'dx': 270,
                        'dy': 100,
                        'animation': 'scale',
                        'single': false,
                        'content': '丝绸之路经济带重点畅通中国经中亚、俄罗斯至欧洲（波罗的海），中国经中亚、西亚至波斯湾地中海，中国至东南亚、南亚、印度洋。'
                    });

                    text.openInfoWindow();
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
                    var text2 = new maptalks.Marker(
                        [60.56, -8], {
                            'properties': {
                                'name': '21世纪海上丝绸之路'
                            },
                            'symbol': [{
                                'markerType': 'rectangle',
                                'markerFill': 'rgba(0,0,0,0.6)',
                                'markerLineColor': '#fff',
                                'markerLineWidth': '2',
                                'markerHeight': 30,
                                'markerWidth': 240,
                                'markerDx': -120,
                                'markerDy': -18
                            }, {
                                'textFaceName': 'LiSu',
                                'textName': '{name}', //value from name in geometry's properties
                                'textSize': 22,
                                'textFill': '#00cc99',
                            }]
                        }
                    ).addTo(vectorlayer2);
                    // text2.animateShow();
                    text2.setInfoWindow({
                        'dx': 120,
                        'dy': 180,
                        'animation': 'scale',
                        'single': false,
                        'content': '21世纪海上丝绸之路重点方向是从中国沿海港口过南海到印度洋，延伸至欧洲，从中国沿海港口过南海到南太平洋。'
                    });

                    text2.openInfoWindow();
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
                    'textSize': 14,
                    'textFill': '#00CC66',
                }]
            }).addTo(vectorlayer2);
        }

        const player = maptalks.animation.Animation.animate({}, {
            'duration': Number.MAX_VALUE
        }, frame => {});

        player.play();

        function randomColor() {
            return {
                r: Math.random(),
                g: Math.random(),
                b: Math.random()
            };
        }
    }

}