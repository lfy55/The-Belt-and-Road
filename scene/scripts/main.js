window.onload = function () {
    var viewer, scene;

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
        [89.20, 22.33],
        [80.52, 6.55],
        [36.49, -1.17],
        [23.44, 38.02],
        [12.20, 45.26],
        [4.29, 51.55]
    ];

    var chartsCities = ['Japan', 'Russia', 'Bangladesh', 'Nigeria', 'Pakistan', 'Brazil', 'Indonesia',
        'United States of America', 'India', 'China'
    ];
    var chartDatas = [1.27, 1.44, 1.62, 1.85, 1.93, 2.07, 2.61, 3.23, 13.24, 13.78];
    var chartCoords = [
        [139.686048, 35.975599],
        [95.718204, 62.959737],
        [90.234114, 23.831347],
        [7.372689, 9.255528],
        [69.702731, 29.770945],
        [-49.033423, -10.827221],
        [121.180063, -2.001823],
        [-97.087162, 40.021106],
        [78.939869, 22.572888],
        [107.198117, 34.618151]
    ];
    var chartEntities = [];
    var chartCities2 = ['Canada', 'Brazil', 'Italy', 'India', 'France', 'United Kingdom', 'Germany', 'Japan',
        'China', 'United States of America'
    ];
    var chartDatas2 = [1.53, 1.79, 1.85, 2.26, 2.46, 2.618, 3.46, 4.93, 11.19, 18.56];
    var chartCoords2 = [
        [-102.089532, 60.226911],
        [-49.033423, -10.827221],
        [13.003957, 42.844922],
        [78.939869, 22.572888],
        [2.480704, 46.670523],
        [-1.493113, 53.868551],
        [10.796282, 51.130062],
        [139.686048, 35.975599],
        [107.198117, 34.618151],
        [-97.087162, 40.021106]
    ];
    var chartEntities2 = [];

    var pathEntities = [];

    var countryEntities = [];
    if (WebGLtest()) {
        initMap();
        // setTimeout(showHighChart1, 5000);
        // setTimeout(hideHighChart1, 8000);
    } else {
        $("#noWebGL").show();
    }

    function initMap() {
        viewer = new Cesium.Viewer('mapContainer', {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            vrButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
            terrainProvider: new Cesium.CesiumTerrainProvider({
                url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
                requestWaterMask: true,
                requestVertexNormals: true
            })
        });
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(60, -35, 11800000.0),
            orientation: {
                pitch: Cesium.Math.toRadians(-60)
            }
        });
        scene = viewer.scene;
        var first = true;
        scene.camera.moveEnd.addEventListener(function () {
            if (first) {
                initData();
            }
            first = false;
        });

        var promise = Cesium.GeoJsonDataSource.load('./scripts/world.json');
        promise.then(function (dataSource) {
            viewer.dataSources.add(dataSource);
            countryEntities = dataSource.entities.values;
            for (var i = 0; i < countryEntities.length; i++) {
                var entity = countryEntities[i];
                entity.polygon.material = Cesium.Color.fromRgba(0x2036907e);
                entity.polygon.outline = true;
                entity.polygon.outlineColor = Cesium.Color.fromBytes(30, 224, 199, 255);
                entity.polygon.exheight = 0;
            }
        }).otherwise(function (error) {
            window.alert(error);
        });

        var _slcFeature = [];
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(function (movement) {
            var pickedFeature = scene.pick(movement.position);
            if (pickedFeature != undefined) {
                hidepath();
                if (_slcFeature.length > 0) {
                    _slcFeature.forEach(function (ee) {
                        hideCountry(ee);
                    });
                    _slcFeature = [];
                }
                _slcFeature = findCountry(pickedFeature.id.name);
                _slcFeature.forEach(function (ee) {
                    showCountry(ee);
                })
            } else {
                showpath();
                if (_slcFeature.length > 0) {
                    _slcFeature.forEach(function (ee) {
                        hideCountry(ee);
                    });
                    _slcFeature = [];
                }
            }

            function showCountry(feature) {
                var polygon = feature.polygon;
                polygon.extrudedHeight = new Cesium.CallbackProperty(function () {
                    polygon.material = Cesium.Color.fromCssColorString('#006363');

                    polygon.outlineWidth = 5;
                    polygon.exheight += 10000;
                    if (polygon.exheight > 500000) {
                        polygon.exheight = 500000;
                    }
                    return polygon.exheight;
                }, false);
                // viewer.camera.flyTo({
                //     destination: Cesium.Cartesian3.fromDegrees(60, -35, 11800000.0),
                //     orientation: {
                //         pitch: Cesium.Math.toRadians(-60)
                //     }
                // });
            }

            function hideCountry(feature) {
                var polygon = feature.polygon;
                polygon.extrudedHeight = new Cesium.CallbackProperty(function () {
                    polygon.exheight -= 10000;
                    if (polygon.exheight < 0) {
                        polygon.exheight = 0;
                        polygon.material = Cesium.Color.fromRgba(0x2036907e);
                        polygon.outlineWidth = 1;
                    }
                    return polygon.exheight;
                }, false);
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(60, -35, 11800000.0),
                    orientation: {
                        pitch: Cesium.Math.toRadians(-60)
                    }
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }

    function findCountry(name) {
        var fent = [];
        for (var i = 0; i < countryEntities.length; i++) {
            var entity = countryEntities[i];
            if (entity.name == name) {
                fent.push(entity);
            }
        }
        return fent;
    }

    function initData() {
        //Set bounds of our simulation time
        var start = Cesium.JulianDate.fromDate(new Date(2017, 11, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(start, 2000, new Cesium.JulianDate());

        //Make sure viewer is at the desired time.
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; //Loop at the end
        viewer.clock.multiplier = 20;

        pathEntities.push(viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(citiesCoordsLD[0][0], citiesCoordsLD[0][1], 5000),
            billboard: {
                image: './images/slibar.png'
            }
        }));
        pathEntities.push(viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(citiesCoordsHS[0][0], citiesCoordsHS[0][1]),
            billboard: {
                image: './images/slibar.png'
            }
        }));
        var ldp1 = 1,
            ldp2 = 1;
        viewer.clock.onTick.addEventListener(function (t) {
            var tsLD = positionLD.getValue(t.currentTime);
            if (tsLD) {
                var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(tsLD);
                var long = cartographicPosition.longitude / Math.PI * 180;
                if (ldp1 < citiesCoordsLD.length && Math.abs(citiesCoordsLD[ldp1][0] - long) <= 1.0) {
                    pathEntities.push(viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(citiesCoordsLD[ldp1][0], citiesCoordsLD[ldp1][1], 5000),
                        billboard: {
                            image: './images/slibar.png'
                        }
                    }));
                    ldp1++;
                }
            } else if (ldp1 == citiesCoordsLD.length - 1) {
                pathEntities.push(viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(citiesCoordsLD[ldp1][0], citiesCoordsLD[ldp1][1]),
                    billboard: {
                        image: './images/slibar.png'
                    }
                }));
                ldp1++;
            }
            var tsHS = positionHS.getValue(t.currentTime);

            if (tsHS) {
                var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(tsHS);
                var lat = cartographicPosition.latitude / Math.PI * 180;
                if (ldp2 < citiesCoordsHS.length && Math.abs(citiesCoordsHS[ldp2][1] - lat) <= 0.5) {
                    pathEntities.push(viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(citiesCoordsHS[ldp2][0], citiesCoordsHS[ldp2][1]),
                        billboard: {
                            image: './images/slibar.png'
                        }
                    }));
                    ldp2++;
                }
            } else if (ldp2 == citiesCoordsHS.length - 1) {
                pathEntities.push(viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(citiesCoordsHS[ldp2][0], citiesCoordsHS[ldp2][1]),
                    billboard: {
                        image: './images/slibar.png'
                    }
                }));
                ldp2++;
            }
        });

        //Generate a random circular pattern with varying heights.
        function computeCirclularFlightLD() {
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i < path1.length; i++) {
                var position = Cesium.Cartesian3.fromDegrees(path1[i][0], path1[i][1], 5000);
                if (i > 475 && i <= 675) {
                    var time = Cesium.JulianDate.addSeconds(start, 475 + (i - 475) * 5, new Cesium.JulianDate());
                } else if (i <= 475) {
                    var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                } else if (i > 675) {
                    var time = Cesium.JulianDate.addSeconds(start, i + 800, new Cesium.JulianDate());
                }
                property.addSample(time, position);
            }
            return property;
        }

        function computeCirclularFlightHS() {
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i < path2.length; i++) {
                var position = Cesium.Cartesian3.fromDegrees(path2[i][0], path2[i][1]);
                var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                property.addSample(time, position);
            }
            return property;
        }

        //Compute the entity position property.
        var positionLD = computeCirclularFlightLD();

        //Actually create the entity
        var entityLD = viewer.entities.add({

            //Set the entity availability to the same interval as the simulation time.
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: start,
                stop: stop
            })]),

            //Use our computed positions
            position: positionLD,

            //Automatically compute orientation based on position movement.
            orientation: new Cesium.VelocityOrientationProperty(positionLD),

            model: {
                uri: './SampleData/Cesium_Air.gltf',
                minimumPixelSize: 64
            },

            //Show the path as a pink line sampled in 1 second increments.
            path: {
                resolution: 5,
                leadTime: 0,
                trailTime: 2000,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.DEEPSKYBLUE
                }),
                width: 10
            }
        });
        entityLD.position.setInterpolationOptions({
            interpolationDegree: 3,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
        });
        var positionHS = computeCirclularFlightHS();
        var entityHS = viewer.entities.add({

            //Set the entity availability to the same interval as the simulation time.
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: start,
                stop: stop
            })]),

            //Use our computed positions
            position: positionHS,

            //Automatically compute orientation based on position movement.
            orientation: new Cesium.VelocityOrientationProperty(positionHS),

            model: {
                uri: './SampleData/Cesium_Air.gltf',
                minimumPixelSize: 64
            },

            //Show the path as a pink line sampled in 1 second increments.
            path: {
                resolution: 5,
                leadTime: 0,
                trailTime: 2000,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.DEEPSKYBLUE
                }),
                width: 10
            }
        });
        entityHS.position.setInterpolationOptions({
            interpolationDegree: 3,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
        });

        pathEntities.push(entityLD);
        pathEntities.push(entityHS);
        // viewer.zoomTo(entity, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));

        setTimeout(function () {
            viewer.trackedEntity = entityLD;
        }, 25000);
        setTimeout(function () {
            viewer.trackedEntity = undefined;
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(60, -35, 11800000.0),
                orientation: {
                    pitch: Cesium.Math.toRadians(-60)
                }
            });
        }, 73000);
    }

    var ctp = {
        'iran': [
            [51.25, 33.40],
            [53.25, 33.40],
            [55.25, 33.40],
        ],
        'afh': [
            [64.31, 34.34],
            [66.31, 34.34],
            [68.31, 34.34],
        ],
        'pak': [
            [67.4, 29.7],
            [69.4, 29.7],
            [71.4, 29.7],
        ],
        'kaz': [
            [65.12, 48.48],
            [67.12, 48.48],
            [69.12, 48.48]
        ]
    };

    var chartColors = ['#00cc00', '#11f0d4', '#1240ab']

    var lastcharts = [];

    function showChart(id) {
        for (var i = 0; i < lastcharts.length; i++) {
            viewer.entities.remove(lastcharts[i]);
        }
        lastcharts = [];
        if (!id) return;
        for (var i = 0; i < 3; i++) {
            var height = Math.random() % 0.5;
            var longitude = ctp[id][i][0];
            var latitude = ctp[id][i][1];
            var color = Cesium.Color.fromCssColorString(chartColors[i]);

            //WebGL Globe only contains lines, so that's the only graphics we create.
            var entity = new Cesium.Entity({
                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 500000 + height * 3000000),
                cylinder: {
                    length: 2 * (500000 + height * 3000000),
                    topRadius: 60000.0,
                    bottomRadius: 60000.0,
                    material: new Cesium.ColorMaterialProperty(color),
                    outline: false,
                }
            });
            viewer.entities.add(entity);
            lastcharts.push(entity);
        }
    }

    window.showHighChart1  = function showHighChart1() {
        var i = 0;
        hideHighChart1();
        chartCoords.forEach(function (chartCoord) {
            chartEntities.push(viewer.entities.add({
                rectangle: {
                    coordinates: Cesium.Rectangle.fromDegrees(chartCoord[0] - 1.0, chartCoord[1] - 1.0,
                        chartCoord[0] + 1.0, chartCoord[1] + 1.0),
                    extrudedHeight: chartDatas[i] * 200000.0,
                    outline: false,
                    material: Cesium.Color.fromRandom({
                        alpha: 1.0
                    })
                }
            }));
            i++;
        });
    }

    window.hideHighChart1  = function hideHighChart1() {
        chartEntities.forEach(function (e) {
            viewer.entities.remove(e);
        })
        chartEntities = [];
    }

    window.showHighChart2  = function showHighChart2() {
        var ents = [];
        var i = 1;
        ['Canada', 'Iraq', 'Saudi Arabia', 'Iran', 'Venezuela'].forEach(function (cty) {
            var arr = findCountry(cty);
            arr.forEach(function (a) {
                ents.push(a);
                a.colorindex = i;
            });
            i++;
        });
        ents.forEach(function (entity) {
            entity.polygon.material = new Cesium.ImageMaterialProperty({
                image: './images/hot' + entity.colorindex + '.png',
                transparent: true
            });
        });
    }

    window.hideHighChart2  = function hideHighChart2() {
        var ents = [];
        var i = 1;
        ['Canada', 'Iraq', 'Saudi Arabia', 'Iran', 'Venezuela'].forEach(function (cty) {
            var arr = findCountry(cty);
            arr.forEach(function (a) {
                ents.push(a);
                a.colorindex = i;
            });
            i++;
        });
        ents.forEach(function (entity) {
            entity.polygon.material = Cesium.Color.fromRgba(0x2036907e);
        });
    }

    window.showHighChart3  = function showHighChart3() {
        var i = 0;
        hideHighChart3();
        chartCoords2.forEach(function (chartCoord) {
            chartEntities2.push(viewer.entities.add({
                rectangle: {
                    coordinates: Cesium.Rectangle.fromDegrees(chartCoord[0] - 1.0, chartCoord[1] - 1.0,
                        chartCoord[0] + 1.0, chartCoord[1] + 1.0),
                    extrudedHeight: chartDatas2[i] * 200000.0,
                    outline: false,
                    material: Cesium.Color.fromRandom({
                        alpha: 1.0
                    })
                }
            }));
            i++;
        });
    }

    window.hideHighChart3  = function hideHighChart3() {
        chartEntities2.forEach(function (e) {
            viewer.entities.remove(e);
        })
        chartEntities2 = [];
    }

    function hidepath() {
        for (var i = 0; i < pathEntities.length; i++) {
            pathEntities[i].show = false;
        }
    }

    function showpath() {
        setTimeout(function () {
            for (var i = 0; i < pathEntities.length; i++) {
                pathEntities[i].show = true;
            }
        }, 1500);
    }
}