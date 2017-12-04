window.onload = function () {
    var map;
    var imgBaseLayer, vecBaseLayer, clusterLayer;
    var vectorlayer0, vectorlayer, vectorlayer2;
    var heatLayer, ladderLayer;
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
    var inteLD = [0, 1, 2.5, 1.5, 3.5, 2, 1.8, 2.2];
    var countriesLD = [];
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
    var countriesHS = [];
    var inteHS = [0, 1, 1, 2.5, 1.5, 4.5, 2, 5, 6, 1.5, 1.2];
    var ydylCountries = [
        'Panama', 'Morocco', 'India', 'Ethiopia', 'New Zealand', 'Bosnia and Herz.', 'Montenegro', 'Turkmenistan', 'Lithuania', 'Latvia', 'Palestine', 'Albania', 'Afghanistan', 'Estonia', 'Pakistan', 'Slovenia',
        'Croatia', 'Lebanon', 'Oman', 'Bahrain', 'Yemen', 'Egypt', 'Jordan', 'Syria', 'Indonesia', 'Philippines', 'Myanmar', 'Brunei', 'Timor-Leste', 'Thailand', 'United Arab Emirates', 'Vietnam', 'Singapore', 'Armenia', 'Azerbaijan', 'Israel', 'Belarus', 'Czech Rep.', 'Bangladesh',
        'Georgia', 'Hungary', 'Iraq', 'Cambodia', 'Iran', 'Kyrgyzstan', 'Lao PDR', 'Kazakhstan', 'Qatar', 'Kuwait', 'Moldova', 'Maldives',
        'Poland', 'Macedonia', 'Nepal', 'Mongolia', 'Malaysia', 'Serbia', 'Romania', 'Bulgaria', 'Tajikistan', 'Saudi Arabia', 'Slovakia', 'Russia', 'South Africa', 'Sri Lanka', 'Korea', 'Turkey', 'Ukraine', 'Uzbekistan'
    ];

    var polygonsAll = [];
    var kazTypes = ['city', 'city', 'city', 'city', 'city', 'prog-ing', 'slg']; //'prog-ed',
    var kazCities = [
        '卡拉干达', '卡拉曼', '赞加达尔', '塔利斯塔', '埃索达', '中国援建项目Aresia', '中国驻哈萨克斯坦大使馆'
    ];
    var kazCitiesCoords = [
        [65.053389, 52.385164],
        [48.606205, 48.118782],
        [56.360838, 47.750121],
        [71.30847, 44.893521],
        [77.857907, 44.420788],
        [66.179648, 48.641949],
        [71.26, 51.11]
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

    var lineColor = 'rgba(30,224,199,1)';
    var fillColor = 'rgba(13,85,79,1)';

    if (WebGLtest()) {
        initMap();
        $('.mapboxgl-control-container').hide();
    } else {
        $("#noWebGL").show();
    }

    function initMap() {
        // mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpeHVhbiIsImEiOiJjaXpoczR4ejEwMWtrMnFtaWtmanl5Yms0In0.pGiOt4qQJHvEScUBK7qgZw';
        mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuZ2p1ZTExOTkiLCJhIjoiY2l3NzJsMXZ6MDA1MDJvcGVvOXZ5aGtxNiJ9.6Md6VaUCF6RJPQT5d95Lhw';

        var features = topojson.feature(world, world.objects.land);
        var polygons = features.features.map(function (f) {
            var geo = maptalks.GeoJSON.toGeometry(f);
            geo._geometries.splice(53, 1);
            geo.setId(null);
            geo.config('antiMeridian', 'split');
            geo.config('shadowBlur', 50);
            geo.config('shadowColor', '#15887a');
            geo.setSymbol({
                lineColor: '#15887a',
                lineWidth: 2,
                polygonFill: '#111',
            });
            return geo;
        });
        var arr = [];
        $.getJSON("./scripts/world_polygon.json", function (data) {
            polygonsAll = maptalks.GeoJSON.toGeometry(data);
            polygonsAll.forEach(function (geo) {
                geo.setSymbol({
                    lineColor: '#15887a',
                    lineWidth: 2,
                    polygonFill: '#111',
                });
                if (ydylCountries.indexOf(geo.properties.NAME) > -1) {
                    ydylCountries.splice(ydylCountries.indexOf(geo.properties.NAME), 1);
                    var item = new maptalks.MultiPolygon(geo.getCoordinates(), {
                        'symbol': {
                            lineColor: '#15887a',
                            lineWidth: 2,
                            polygonFill: '#15887a',
                            polygonOpacity: 0.2
                        }
                    });
                    if (geo.properties.NAME == 'Kazakhstan') {
                        item.addEventListener('click', function () {
                            map.removeLayer(vectorlayer);
                            map.animateTo({
                                pitch: 30,
                                center: [69.55, 45.19],
                                zoom: 5
                            }, {
                                duration: 800,
                                easing: 'out'
                            }, function (frame) {
                                if (frame.state.playState === 'finished') {
                                    initVectorLayer2(item);
                                }
                            });
                        });

                    }
                    arr.push(item);
                }

            });
            // vecBaseLayer.addGeometry(polygonsAll);
            vectorlayer0.addGeometry(arr);
        });

        imgBaseLayer = new maptalks.MapboxglLayer('tile', {
            glOptions: {
                'style': 'mapbox://styles/wangjue1199/cjan7vnxf1qwe2rpdadqdblqu'
            }
        });
        // vecBaseLayer = new maptalks.VectorLayer('v', {
        //     opacity: 1
        // });
        vecBaseLayer = new maptalks.MapboxglLayer('tile2', {
            glOptions: {
                'style': 'mapbox://styles/wangjue1199/cjanogmb0esol2qmfage0f1wl'
            }
        });
        vectorlayer0 = new maptalks.VectorLayer('vector0');
        vectorlayer = new maptalks.VectorLayer('vector1');
        vectorlayer2 = new maptalks.VectorLayer('vector2');

        // vecBaseLayer.addGeometry(polygons);

        var allSDMarkers = [];
        Object.values(allSDs).forEach(function (k) {
            var marker = new maptalks.Marker(k, {
                'symbol': {
                    'markerType': 'ellipse',
                    'markerFill': 'rgb(135,196,240)',
                    'markerFillOpacity': 1,
                    'markerLineColor': '#34495e',
                    'markerLineWidth': 1,
                    'markerWidth': 10,
                    'markerHeight': 10,
                    'markerDx': 0,
                    'markerDy': 0,
                }
            });
            allSDMarkers.push(marker);
        });
        var clusterLayer = new maptalks.ClusterLayer('cluster', allSDMarkers, {
            'noClusterWithOneMarker': true,
            'maxClusterRadius': 30,
            'maxClusterZoom': 18,
            'symbol': {
                'markerType': 'ellipse',
                'markerFill': {
                    property: 'count',
                    type: 'interval',
                    stops: [
                        [0, 'rgb(135, 196, 240)'],
                        [9, '#1bbc9b'],
                        [99, 'rgb(216, 115, 149)']
                    ]
                },
                'markerFillOpacity': 0.7,
                'markerLineOpacity': 1,
                'markerLineWidth': 3,
                'markerLineColor': '#fff',
                'markerWidth': {
                    property: 'count',
                    type: 'interval',
                    stops: [
                        [0, 30],
                        [9, 45],
                        [99, 60]
                    ]
                },
                'markerHeight': {
                    property: 'count',
                    type: 'interval',
                    stops: [
                        [0, 30],
                        [9, 45],
                        [99, 60]
                    ]
                }
            },
            'drawClusterText': true,
            'geometryEvents': true,
            'single': true
        });

        map = new maptalks.Map('mapContainer', {
            center: [66.7903012612708142, 20.976349249268345],
            zoom: 4.0,
            maxZoom: 8.0,
            minZoom: 4.0,
            layers: [imgBaseLayer, vecBaseLayer, vectorlayer0, clusterLayer, vectorlayer, vectorlayer2],
            pitch: 20
        });
        toggleBaseLayer('image');



        // map.setSpatialReference({
        //     projection: 'EPSG:4326',
        //     resolutions: (function () {
        //         const resolutions = [];
        //         for (let i = 0; i < 19; i++) {
        //             resolutions[i] = 180 / (Math.pow(2, i) * 128);
        //         }
        //         return resolutions;
        //     })()
        // });

        // var countryLineOptions = {
        //     symbol: {
        //         lineColor: lineColor,
        //         lineWidth: 0
        //     },
        //     properties: {
        //         altitude: 0
        //     }
        // };
        // var countryPolygonOptions = {
        //     symbol: {
        //         lineWidth: 0,
        //         polygonFill: fillColor,
        //     },
        //     properties: {
        //         altitude: 0
        //     }
        // };
        // var iran1 = new maptalks.LineString(iranCoords, countryLineOptions);
        // var iran2 = new maptalks.Polygon(iranCoords, countryPolygonOptions);
        // iran2.setId('iranPolygon');
        // countriesLD[4] = [iran1, iran2];
        // var pakistan1 = new maptalks.LineString(pakistanCoords, countryLineOptions);
        // var pakistan2 = new maptalks.Polygon(pakistanCoords, countryPolygonOptions);
        // pakistan2.setId('pakistanPolygon');
        // var afh1 = new maptalks.LineString(afhCoords, countryLineOptions);
        // var afh2 = new maptalks.Polygon(afhCoords, countryPolygonOptions);
        // afh2.setId('afhPolygon');
        // var thailand1 = new maptalks.LineString(thailandCoords, countryLineOptions);
        // var thailand2 = new maptalks.Polygon(thailandCoords, countryPolygonOptions);
        // thailand2.setId('thailandPolygon');
        // var malaysia1 = new maptalks.MultiLineString(MalaysiaCoords, countryLineOptions);
        // var malaysia2 = new maptalks.MultiPolygon(MalaysiaCoords, countryPolygonOptions);
        // malaysia2.setId('malaysiaPolygon');
        // countriesHS[3] = [malaysia1, malaysia2];

        // map.getBaseLayer().addGeometry([afh1, afh2, iran1, iran2, pakistan1, pakistan2,
        //     thailand1, thailand2, malaysia1, malaysia2
        // ]);

        // iran2.addEventListener('click', countryClick);
        // pakistan2.addEventListener('click', countryClick);
        // afh2.addEventListener('click', countryClick);
        // thailand2.addEventListener('click', countryClick);
        // malaysia2.addEventListener('click', countryClick);

        // var _center, _line, _poly;

        // function countryClick(e) {
        //     console.info('countryClick');
        //     var id = e.target.getId();
        //     if (_center && _line && _poly) {
        //         _line.updateSymbol({
        //             lineWidth: 0
        //         });
        //         _line.setProperties({
        //             altitude: 0
        //         });
        //         _poly.updateSymbol({
        //             lineWidth: 0,
        //             polygonFill: fillColor
        //         });
        //         _poly.setProperties({
        //             altitude: 0
        //         });
        //         hideDetail();
        //     }
        //     var _zoom = 5;
        //     if (id == 'iranPolygon') {
        //         _center = [51.25, 35.40];
        //         _line = iran1;
        //         _poly = iran2;
        //     } else if (id == 'pakistanPolygon') {
        //         _center = [69, 32];
        //         _line = pakistan1;
        //         _poly = pakistan2;
        //     } else if (id == 'afhPolygon') {
        //         _center = [69, 34];
        //         _line = afh1;
        //         _poly = afh2;
        //     } else if (id == 'thailandPolygon') {
        //         _center = [100.31, 13.45];
        //         _line = thailand1;
        //         _poly = thailand2;
        //     } else if (id == 'malaysiaPolygon') {
        //         _center = [100.31, 5.45];
        //         _line = malaysia1;
        //         _poly = malaysia2;
        //     } else if (id == 'russiaPolygon') {
        //         _center = [60.31, 55.45];
        //         _zoom = 3;
        //         _line = russia1;
        //         _poly = russia2;
        //     }

        //     map.animateTo({
        //         pitch: 60,
        //         center: _center,
        //         zoom: _zoom
        //     }, {
        //         duration: 800,
        //         easing: 'out'
        //     });
        //     _line.updateSymbol({
        //         lineWidth: 3
        //     });
        //     _poly.updateSymbol({
        //         lineWidth: 3,
        //         lineColor: 'rgb(  35 ,255, 227 )',
        //         polygonFill: 'rgba(16,97,87,1.0)'
        //     });
        //     $('#btmDiv').hide();
        //     setTimeout(function () {
        //         maptalks.animation.Animation.animate({
        //             properties: {
        //                 altitude: 500000
        //             }
        //         }, {
        //             'duration': 800
        //         }, frame => {
        //             if (frame.state.playState == 'running') {
        //                 _line.setProperties(frame.styles.properties);
        //                 _poly.setProperties(frame.styles.properties);
        //             }
        //             if (frame.state.playState == 'finished') {
        //                 showDetail();
        //             }
        //         }).play();
        //     }, 800);
        //     e.domEvent.stopPropagation();
        // }

        // map.addEventListener('click', function (e) {
        //     console.info('mapclick');
        //     if (_line && _poly) {
        //         _line.updateSymbol({
        //             lineWidth: 0
        //         });
        //         _line.setProperties({
        //             altitude: 0
        //         });
        //         _poly.updateSymbol({
        //             lineWidth: 0,
        //             polygonFill: fillColor
        //         });
        //         _poly.setProperties({
        //             altitude: 0
        //         });
        //     }
        //     map.animateTo({
        //         pitch: 20,
        //         center: [66.7903012612708142, 10.976349249268345],
        //         zoom: 3.8,
        //     }, {
        //         duration: 1000,
        //         easing: 'in'
        //     });
        //     hideDetail(function(){
        //         $('#btmDiv').show();
        //     });
        // });

    }

    function toggleBaseLayer(type) {
        if (type == 'image') {
            map.removeLayer(vecBaseLayer);
            map.addLayer(imgBaseLayer);
            imgBaseLayer.bringToBack();

        } else if (type == 'vector') {
            map.addLayer(vecBaseLayer);
            map.removeLayer(imgBaseLayer);
            vecBaseLayer.bringToBack();
        }
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
            // marker.addEventListener('click', function () {
            //     var i = 0;
            //     var that = this;
            //     this.animate({
            //         'symbol': symbol
            //     }, {
            //         'duration': 2000
            //     }, function (frame) {
            //         symbol[0].markerRotation = (i++) * 5;
            //         that.updateSymbol(symbol);
            //         if (frame.state.playState === 'finished') {}
            //     });
            // });
            markers.push(marker);
            return marker;
        }

        var road1 = convertData(citiesLD, citiesCoordsLD);
        var road2 = convertData(citiesHS, citiesCoordsHS);
        for (let r1 = 0; r1 < road1.length; r1++) {
            road1[r1].coords = insertCoords(road1[r1].coords, r1 % 2 == 0);
        }
        for (let r2 = 0; r2 < road2.length; r2++) {
            if (citiesHS[r2 + 1] == '吉隆坡') {
                var curveCoords = [
                    road2[r2].coords[0],
                    [112, 12.4],
                    road2[r2].coords[1]
                ];
            } else if (citiesHS[r2 + 1] == '河内') {
                var curveCoords = [
                    road2[r2].coords[0],
                    [111, 18.4],
                    road2[r2].coords[1]
                ];
            } else if (citiesHS[r2 + 1] == '雅加达') {
                var curveCoords = [
                    road2[r2].coords[0],
                    [108.6, 0.6],
                    road2[r2].coords[1]
                ];
            } else if (citiesHS[r2 + 1] == '加尔各答') {
                var curveCoords = [
                    road2[r2].coords[0],
                    [89.3, 4.7],
                    road2[r2].coords[1]
                ];
            } else if (citiesHS[r2 + 1] == '雅典') {
                var curveCoords = [
                    road2[r2].coords[0],
                    [58.93, 13.81],
                    [41.59, 11.19],
                    [34.03, 31.25],
                    road2[r2].coords[1]
                ];
            } else {
                var curveCoords = insertCoords(road2[r2].coords, r2 % 2 == 0);
            }
            road2[r2].coords = curveCoords;
        }
        addMarker(road1[0].coords[0], citiesLD[0]);
        var ri = 0;

        addMarker(road2[0].coords[0], citiesHS[0]);

        var clc = 0;
        for (var i = 0; i < inteLD.length - 1; i++) {
            clc = clc + inteLD[i];
            anim1(i, clc);
        }
        clc = 0;
        for (var i = 0; i < inteHS.length - 1; i++) {
            clc = clc + inteHS[i];
            anim2(i, clc);
        }

        function anim1(rj, clc) {
            setTimeout(function () {
                var line = new maptalks.QuadBezierCurve(road1[rj].coords, {
                    'symbol': {
                        lineColor: '#23ffe3',
                        lineWidth: 3
                    },
                }).addTo(vectorlayer);
                line.animateShow({
                    duration: inteLD[rj + 1] * 650,
                    easing: 'linear'
                }, function (frame, currCoord) {
                    if (frame.state.playState == 'finished') {
                        addMarker(road1[rj].coords[road1[rj].coords.length - 1], citiesLD[rj + 1]);
                    }
                });
            }, clc * 650 + 100 * rj);
        }

        function anim2(rj, clc) {
            setTimeout(function () {
                var line = new maptalks.QuadBezierCurve(road2[rj].coords, {
                    'symbol': {
                        lineColor: '#23ffe3',
                        lineWidth: 3
                    },
                }).addTo(vectorlayer);
                line.animateShow({
                    duration: inteHS[rj + 1] * 650,
                    easing: 'linear'
                }, function (frame, currCoord) {
                    if (frame.state.playState == 'finished') {
                        addMarker(road2[rj].coords[road2[rj].coords.length - 1], citiesHS[rj + 1]);
                    }
                });
            }, clc * 650 + 100 * rj);
        }

    }

    function heatAddtoMap() {
        resetMap();
        var addData = [];
        allHeatData.forEach(function (data) {
            addData.push(data);
            for (var i = 0; i < 4; i++) {
                addData.push([data[0] + 0.001 * i, data[1], Math.random()]);
            }
            for (var i = 0; i < 4; i++) {
                addData.push([data[0], data[1] - 0.001 * i, Math.random()]);
            }
        });
        heatLayer = new maptalks.HeatLayer('heat', addData).addTo(map);
    }

    function backFirstPage() {
        map.animateTo({
            pitch: 20,
            center: [66.7903012612708142, 20.976349249268345],
            zoom: 4.0
        }, {
            duration: 800,
            easing: 'out'
        });
        map.addLayer(vectorlayer);
    }

    function ladderAddtoMap() {
        resetMap();
        ladderLayer = new maptalks.VectorLayer('ladder', {
            opacity: 1,
            enableAltitude: true,
            drawAltitude: {
                polygonFill: 'rgba(50,217,200, 0.5)',
                polygonOpacity: 1,
                lineWidth: 0,
            }
        }).addTo(map);
        var countryLineOptions = {
            symbol: {
                lineColor: lineColor,
                lineWidth: 2
            },
            properties: {
                altitude: 0
            }
        };
        var countryPolygonOptions = {
            symbol: {
                lineWidth: 0,
                polygonFill: fillColor,
            },
            properties: {
                altitude: 0
            }
        };
        var i = 0;
        worldCollection.features.map(function (f) {
            var ctyFeatures = [];
            if (typeof (f.geometry.coordinates[0][0][0]) == 'number') {
                ctyFeatures.push(new maptalks.MultiLineString(f.geometry.coordinates, countryLineOptions));
            } else {
                f.geometry.coordinates.forEach(function (gc) {
                    ctyFeatures.push(new maptalks.MultiLineString(f.geometry.coordinates[gc], countryLineOptions));
                })
            }
            ctyFeatures.push(new maptalks.MultiPolygon(f.geometry.coordinates, countryPolygonOptions));
            var altitude = (Math.random() * 10) * 50000;
            ctyFeatures.forEach(function (f) {
                f.setProperties({
                    altitude: altitude
                });
            });
            ladderLayer.addGeometry(ctyFeatures);
        });
        map.setPitch(60);
    }

    function resetMap() {
        if (vectorlayer) map.removeLayer(vectorlayer);
        if (heatLayer) map.removeLayer(heatLayer);
        if (ladderLayer) map.removeLayer(ladderLayer);

        markers.forEach(function (marker) {
            if (marker.player) {
                marker.player.finish();
            }
        });
        map.setPitch(20);
    }

    var lastKazCity;

    function initVectorLayer2() {
        toggleBaseLayer('vector');
        $.getJSON("./scripts/world_polygon.json", function (data) {
            polygonsAll = maptalks.GeoJSON.toGeometry(data);
            polygonsAll.forEach(function (geo) {
                if (geo.properties.NAME == 'Kazakhstan') {
                    var coors = geo.getCoordinates();
                    var newitem = new maptalks.MultiPolygon(coors, {
                        'symbol': {
                            lineColor: '#15887a',
                            lineWidth: 4,
                            polygonOpacity: 0
                        },
                        'shadowBlur': 50,
                        'shadowColor': '#15887a'
                    });
                    newitem.addTo(vectorlayer2);
                    return;
                }
                geo.setSymbol({
                    lineColor: '#15887a',
                    lineWidth: 2,
                    polygonFill: '#444',
                });
                vectorlayer2.addGeometry(geo);
            });
        });
        var i = 0;
        kazCities.forEach(function (c) {
            if (kazTypes[i] == 'city') {
                var m = new maptalks.Marker(kazCitiesCoords[i], {
                    properties: {
                        'name': c
                    },
                    symbol: [{
                        'markerFile': '../map/images/city.png',
                        'markerDx': 0,
                        'markerDy': 14,
                    }, {
                        'textFaceName': 'LiHeiTi',
                        'textName': '{name}',
                        'textSize': 14,
                        'textDy': -20,
                        'textFill': '#ffffff'
                    }]
                }).addTo(vectorlayer2);
            } else if (kazTypes[i] == 'prog-ing') {
                var m = new maptalks.Marker(kazCitiesCoords[i], {
                    properties: {
                        'name': c
                    },
                    symbol: [{
                        'markerFile': '../map/images/prog_ing.png',
                        'markerDx': 0,
                        'markerDy': 14,
                    }, {
                        'textFaceName': 'LiHeiTi',
                        'textName': '{name}',
                        'textSize': 14,
                        'textDy': 30,
                        'textFill': '#ffff00'
                    }]
                }).addTo(vectorlayer2);
            } else if (kazTypes[i] == 'prog-ed') {
                var m = new maptalks.Marker(kazCitiesCoords[i], {
                    properties: {
                        'name': c
                    },
                    symbol: [{
                        'markerFile': '../map/images/prog_ed.png',
                        'markerDx': 0,
                        'markerDy': 14,
                    }, {
                        'textFaceName': 'LiHeiTi',
                        'textName': '{name}',
                        'textSize': 14,
                        'textDy': 30,
                        'textFill': '#00ff00'
                    }]
                }).addTo(vectorlayer2);
            } else if (kazTypes[i] == 'slg') {
                var m = new maptalks.Marker([71.26, 51.11], {
                    properties: {
                        'name': c
                    },
                    symbol: {
                        'markerType': 'ellipse',
                        'markerFillPatternFile': '../map/images/slg.png',
                        'markerLineColor': '#fff',
                        'markerWidth': 50,
                        'markerHeight': 50,
                        'markerDx': 0,
                        'markerDy': 0,
                    }
                }).addTo(vectorlayer2);
            }
            m.addEventListener('click', function (e) {
                handleClick(m);
                console.info(e);
            });
            i++;
        });

        function handleClick(marker) {
            if (lastKazCity) {
                lastKazCity.remove();
            }
            var coords = marker.getCoordinates();
            var props = marker.getProperties();
            var text = props['name'];
            var img = props['img'] || '../map/images/slg.png';
            lastKazCity = new maptalks.ui.UIMarker(coords, {
                'content': `
            <div>
                <div style="font-family: LiHeiTi;font-size: 18px;color: white;background: #f00;border-width: 0px 6px;border-color: #ff0;border-style: solid;margin-bottom: 4px;padding: 6px;width: 200px;">` + text + `</div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 70px;margin-left: 50px;">
                    <path d="M0 0 L175 0 L209 90" style="stroke: #ff0000;stroke-width:2px;fill-opacity:0"></path>
                </svg>
                <div style="width: 112px;height: 112px;    border: solid 3px #fff;    border-radius: 50%;margin: -50px 10px 10px 190px;    ">
                    <div style="width: 88px;    height: 88px;    border: solid 2px #fff;    border-radius: 50%;    margin: 10px;">
                        <div style="width: 64px;    height: 64px;    border: solid 2px #fff;    border-radius: 50%;    margin: 10px;">
                            <div style="width: 40px;    height: 40px;      box-shadow: 0 0 15px #fff;    border-radius: 50%;    margin: 12px;">
                                <div style="width: 40px;    height: 40px;    border-radius: 50%;overflow:hidden">
                                    <img src="` + img + `" style="width:50px;height:50px;margin:0">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,
                dx: -75,
                dy: -25
            }).addTo(map).show();
        }
    }

    var tog = 0;
    $('#toogleBase').click(function () {
        if (tog % 2 == 0) {
            toggleBaseLayer('vector');
        } else {
            toggleBaseLayer('image');
        }
        tog++;
    });

    $('#route_wrap').click(function () {
        map.addLayer(vectorlayer);
        initData();
    });

    $('#population_wrap').click(function () {
        heatAddtoMap();
    });

    $('#GDPMessage_wrap').click(function () {
        ladderAddtoMap();
    });

    $('#city_wrap').click(function () {
        resetMap();
        map.addLayer(vectorlayer);
        markers.forEach(function (marker) {
            var i = 0;
            marker.player = marker.animate({
                'symbol': symbol
            }, {
                'duration': 200000
            }, function (frame) {
                symbol[0].markerRotation = (i++) * 5;
                marker.updateSymbol(symbol);
            });
        });
    });
}