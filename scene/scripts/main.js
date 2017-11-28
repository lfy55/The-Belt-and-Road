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


    var lineColor = 'rgba(30,224,199,1)';
    var fillColor = 'rgba(13,85,79,1)';

    if (WebGLtest()) {
        initMap();
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
        // scene.screenSpaceCameraController.enableRotate = false;
        // scene.screenSpaceCameraController.enableTranslate = false;
        // scene.screenSpaceCameraController.enableZoom = false;
        // scene.screenSpaceCameraController.enableTilt = false;
        // scene.screenSpaceCameraController.enableLook = false;
        scene.camera.moveEnd.addEventListener(function () {
            initData();
        });

        // var dataSource = new WebGLGlobeDataSource();
        // dataSource.loadUrl('./scripts/population909500.json').then(function () {

        // });
        // viewer.dataSources.add(dataSource);

        var promise = Cesium.GeoJsonDataSource.load('./scripts/world.json');
        var _afhFeature, _pakFeature, _iranFeature, _kazFeature;
        promise.then(function (dataSource) {
            viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values;
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                entity.polygon.material = Cesium.Color.fromRgba(0x2036907e);
                entity.polygon.outline = true;
                entity.polygon.outlineColor = Cesium.Color.fromBytes(30, 224, 199, 255);
                entity.polygon.exheight = 0;
                if (entity.name == 'Afghanistan') {
                    _afhFeature = entity;
                } else if (entity.name == 'Pakistan') {
                    _pakFeature = entity;
                } else if (entity.name == 'Iran') {
                    _iranFeature = entity;
                } else if (entity.name == 'Kazakhstan') {
                    _kazFeature = entity;
                }
            }
        }).otherwise(function (error) {
            window.alert(error);
        });

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(function (movement) {
            var pickedFeature = scene.pick(movement.position);
            if (pickedFeature != undefined) {
                if (pickedFeature.id.name == 'Afghanistan') {
                    showCountry(_afhFeature);
                    hideCountry(_pakFeature);
                    hideCountry(_iranFeature);
                    hideCountry(_kazFeature);
                } else if (pickedFeature.id.name == 'Pakistan') {
                    showCountry(_pakFeature);
                    hideCountry(_afhFeature);
                    hideCountry(_iranFeature);
                    hideCountry(_kazFeature);
                } else if (pickedFeature.id.name == 'Iran') {
                    showCountry(_iranFeature);
                    hideCountry(_afhFeature);
                    hideCountry(_pakFeature);
                    hideCountry(_kazFeature);
                } else if (pickedFeature.id.name == 'Kazakhstan') {
                    showCountry(_kazFeature);
                    hideCountry(_afhFeature);
                    hideCountry(_pakFeature);
                    hideCountry(_iranFeature);
                } else {
                    hideCountry(_afhFeature);
                    hideCountry(_pakFeature);
                    hideCountry(_iranFeature);
                    hideCountry(_kazFeature);
                }
            } else {
                hideCountry(_afhFeature);
                hideCountry(_pakFeature);
                hideCountry(_iranFeature);
                hideCountry(_kazFeature);
            }

            function showCountry(feature) {
                var polygon = feature.polygon;
                polygon.extrudedHeight = new Cesium.CallbackProperty(function () {
                    polygon.material = Cesium.Color.fromRgba(0xff36907e);
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

    function initData() {
        // var path1 = [citiesCoordsLD[0][0], citiesCoordsLD[0][1]];
        // var i = 0;
        // var isConstant = false;
        // viewer.entities.add({
        //     polyline: {
        //         positions: new Cesium.CallbackProperty(function (time, result) {
        //             var t = (time.secondsOfDay % 30);
        //             if (t / 4 > i) {
        //                 i++;
        //                 if (i > 7) {
        //                     return;
        //                 }
        //                 path1.push(citiesCoordsLD[i][0], citiesCoordsLD[i][1]);
        //             }
        //             return Cesium.Cartesian3.fromDegreesArray(path1, Cesium.Ellipsoid.WGS84, result);
        //         }, isConstant),
        //         width: 10.0,
        //         material: new Cesium.PolylineGlowMaterialProperty({
        //             color: Cesium.Color.DEEPSKYBLUE,
        //             glowPower: 0.1
        //         })
        //     }
        // });

        // viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function (ds) {});

        //Set bounds of our simulation time
        var start = Cesium.JulianDate.fromDate(new Date(2017, 11, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(start, 2000, new Cesium.JulianDate());

        //Make sure viewer is at the desired time.
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; //Loop at the end
        viewer.clock.multiplier = 20;

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(citiesCoordsLD[0][0], citiesCoordsLD[0][1]),
            billboard: {
                image: './images/slibar.png'
            }
        });
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(citiesCoordsHS[0][0], citiesCoordsHS[0][1]),
            billboard: {
                image: './images/slibar.png'
            }
        });
        var ldp1 = 1,
            ldp2 = 1;
        viewer.clock.onTick.addEventListener(function (t) {
            var tsLD = positionLD.getValue(t.currentTime);
            if (tsLD) {
                var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(tsLD);
                var long = cartographicPosition.longitude / Math.PI * 180;
                if (ldp1 < citiesCoordsLD.length && Math.abs(citiesCoordsLD[ldp1][0] - long) <= 0.1) {
                    viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(citiesCoordsLD[ldp1][0], citiesCoordsLD[ldp1][1]),
                        billboard: {
                            image: './images/slibar.png'
                        }
                    });
                    ldp1++;
                }
            } else if (ldp1 == citiesCoordsLD.length - 1) {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(citiesCoordsLD[ldp1][0], citiesCoordsLD[ldp1][1]),
                    billboard: {
                        image: './images/slibar.png'
                    }
                });
                ldp1++;
            }
            var tsHS = positionHS.getValue(t.currentTime);

            if (tsHS) {
                var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(tsHS);
                var long = cartographicPosition.longitude / Math.PI * 180;
                if (ldp2 < citiesCoordsHS.length && Math.abs(citiesCoordsHS[ldp2][0] - long) <= 0.1) {
                    viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(citiesCoordsHS[ldp2][0], citiesCoordsHS[ldp2][1]),
                        billboard: {
                            image: './images/slibar.png'
                        }
                    });
                    ldp2++;
                }
            } else if (ldp2 == citiesCoordsHS.length - 1) {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(citiesCoordsHS[ldp2][0], citiesCoordsHS[ldp2][1]),
                    billboard: {
                        image: './images/slibar.png'
                    }
                });
                ldp2++;
            }
        });

        //Generate a random circular pattern with varying heights.
        function computeCirclularFlightLD() {
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i < path1.length; i++) {
                var position = Cesium.Cartesian3.fromDegrees(path1[i][0], path1[i][1], 0);
                var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                property.addSample(time, position);
            }
            return property;
        }

        function computeCirclularFlightHS() {
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i < path2.length; i++) {
                var position = Cesium.Cartesian3.fromDegrees(path2[i][0], path2[i][1], 0);
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

            billboard: {
                image: './images/plane.png',
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

            billboard: {
                image: './images/boat.png',
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
        // viewer.zoomTo(entity, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));
    }
}