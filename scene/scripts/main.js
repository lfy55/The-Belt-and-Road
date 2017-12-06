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
        scene = viewer.scene;
        var first = true;
        scene.camera.moveEnd.addEventListener(function () {
            if (first) {
                init();
            }
            first = false;
        });
    }

    function init() {

        //Set the random number seed for consistent results.
        Cesium.Math.setRandomNumberSeed(3);

        //Set bounds of our simulation time
        var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

        //Make sure viewer is at the desired time.
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        viewer.clock.multiplier = 10;

        //Set timeline to simulation bounds
        // viewer.timeline.zoomTo(start, stop);

        //Generate a random circular pattern with varying heights.
        function computeCirclularFlight(lon, lat, radius) {
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i <= 360; i += 45) {
                var radians = Cesium.Math.toRadians(i);
                var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                var position = Cesium.Cartesian3.fromDegrees(29.9077 + (0.05 * 1.5 * Math.cos(radians)),
                    36.2246 + (0.05 * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 1750);
                property.addSample(time, position);

            }
            return property;
        }

        //Compute the entity position property.
        var position = computeCirclularFlight(-112.110693, 36.0994841, 0.03);

        //Actually create the entity
        var entity = viewer.entities.add({

            //Set the entity availability to the same interval as the simulation time.
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: start,
                stop: stop
            })]),

            //Use our computed positions
            position: position,

            //Automatically compute orientation based on position movement.
            orientation: new Cesium.VelocityOrientationProperty(position),

            //Load the Cesium plane model to represent the entity
            model: {
                uri: './SampleData/Cesium_Air.gltf',
                minimumPixelSize: 64
            },

            //Show the path as a pink line sampled in 1 second increments.
            path: {
                resolution: 1,
                leadTime: 0,
                trailTime: 2000,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.DEEPSKYBLUE
                }),
                width: 10
            }
        });

        // //Add button to view the path from the top down
        // Sandcastle.addDefaultToolbarButton('View Top Down', function () {
        //     viewer.trackedEntity = undefined;
        //     viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));
        // });

        // //Add button to view the path from the side
        // Sandcastle.addToolbarButton('View Side', function () {
        //     viewer.trackedEntity = undefined;
        //     viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(-15), 7500));
        // });

        // //Add button to track the entity as it moves
        // Sandcastle.addToolbarButton('View Aircraft', function () {
        viewer.trackedEntity = entity;
        // });

        // //Add a combo box for selecting each interpolation mode.
        // Sandcastle.addToolbarMenu([{
        //     text: 'Interpolation: Linear Approximation',
        //     onselect: function () {
        //         entity.position.setInterpolationOptions({
        //             interpolationDegree: 1,
        //             interpolationAlgorithm: Cesium.LinearApproximation
        //         });
        //     }
        // }, {
        //     text: 'Interpolation: Lagrange Polynomial Approximation',
        //     onselect: function () {
        //         entity.position.setInterpolationOptions({
        //             interpolationDegree: 5,
        //             interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        //         });
        //     }
        // }, {
        //     text: 'Interpolation: Hermite Polynomial Approximation',
        //     onselect: function () {
        entity.position.setInterpolationOptions({
            interpolationDegree: 2,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
        });
        //     }
        // }], 'interpolationMenu');

    }

    function initData() {
        //Set bounds of our simulation time
        var start = Cesium.JulianDate.fromDate(new Date(2017, 11, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(start, 2000, new Cesium.JulianDate());

        //Make sure viewer is at the desired time.
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        viewer.clock.multiplier = 2;

        //Generate a random circular pattern with varying heights.
        function computeCirclularFlightLD() {

            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i <= 360; i += 5) {
                var radians = Cesium.Math.toRadians(i);
                var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                var position = Cesium.Cartesian3.fromDegrees(29.9077 + (0.5 * 1.5 * Math.cos(radians)),
                    36.4246 + (0.5 * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 1750);
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
                minimumPixelSize: 64,
                // scale:1.0
            },

            //Show the path as a pink line sampled in 1 second increments.
            path: {
                resolution: 1,
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
        viewer.trackedEntity = entityLD;
    }

}