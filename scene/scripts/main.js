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
        initData();
    } else {
        $("#noWebGL").show();
    }

    function initMap() {
        var viewer = new Cesium.Viewer('mapContainer', {
            animation: false,
            baseLayerPicker:false,
            fullscreenButton:false,
            vrButton:false,
            geocoder:false,
            homeButton:false,
            infoBox:false,
            sceneModePicker:false,
            selectionIndicator:false,
            timeline:false,
            navigationHelpButton:false,
            sceneMode:Cesium.SceneMode.COLUMBUS_VIEW 
        });
        viewer.camera.flyTo({
            destination:Cesium.Cartesian3.fromDegrees(66,30, 18000000.0),
        });
    }

    function initData() {

    }
}