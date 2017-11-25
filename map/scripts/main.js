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
  var fillColor = 'rgba(4,60,60,1)';

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
      geo.config('shadowBlur', 50);
      geo.config('shadowColor', '#15887a');
      geo.setSymbol({
        lineColor: '#15887a',
        lineWidth: 2,
        polygonFill: '#111',
      });
      return geo;
    });
    map = new maptalks.Map('mapContainer', {
      center: [66.7903012612708142, 20.976349249268345],
      zoom: 4.0,
      maxZoom: 5.0,
      minZoom: 4.0,
      baseLayer: new maptalks.VectorLayer('v', {
        opacity: 1,
        enableAltitude: true,
        drawAltitude: {
          polygonFill: {
            'type': 'linear',
            'places': [0, 0, 0, 1],
            'colorStops': [
              [0, 'rgba(50,217,200, 0.7)'],
              [0.5, 'rgba(50,217,200, 0.5)'],
              [0.7, 'rgba(50,217,200, 0.3)'],
              [0.8, 'rgba(50,217,200, 0.2)'],
              [1, 'rgba(255 ,255 ,255,0.1)']
            ]
          },
          polygonOpacity: 1,
          lineWidth: 0,
        }
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
    vectorlayer2.setZIndex(1);

    var countryLineOptions = {
      symbol: {
        lineColor: lineColor,
        lineWidth: 0
      },
      properties: {
        altitude: 0
      }
    };
    var countryPolygonOptions = {
      symbol: {
        lineColor: lineColor,
        lineWidth: 0,
        polygonFill: fillColor,
        polygonOpacity: 0,
      },
      properties: {
        altitude: 0
      },
      shadowBlur: 35,
      shadowColor: lineColor
    };
    var iran1 = new maptalks.LineString(iranCoords, countryLineOptions);
    var iran2 = new maptalks.Polygon(iranCoords, countryPolygonOptions);
    iran2.setId('iranPolygon');
    countriesLD[4] = [iran1, iran2];
    var pakistan1 = new maptalks.LineString(pakistanCoords, countryLineOptions);
    var pakistan2 = new maptalks.Polygon(pakistanCoords, countryPolygonOptions);
    pakistan2.setId('pakistanPolygon');
    var afh1 = new maptalks.LineString(afhCoords, countryLineOptions);
    var afh2 = new maptalks.Polygon(afhCoords, countryPolygonOptions);
    afh2.setId('afhPolygon');
    var thailand1 = new maptalks.LineString(thailandCoords, countryLineOptions);
    var thailand2 = new maptalks.Polygon(thailandCoords, countryPolygonOptions);
    thailand2.setId('thailandPolygon');
    var malaysia1 = new maptalks.MultiLineString(MalaysiaCoords, countryLineOptions);
    var malaysia2 = new maptalks.MultiPolygon(MalaysiaCoords, countryPolygonOptions);
    malaysia2.setId('malaysiaPolygon');
    countriesHS[3] = [malaysia1, malaysia2];
    map.getBaseLayer().addGeometry(polygons);
    map.getBaseLayer().addGeometry([afh1, afh2, iran1, iran2, pakistan1, pakistan2,
      thailand1, thailand2, malaysia1, malaysia2
    ]);

    iran2.addEventListener('click', countryClick);
    pakistan2.addEventListener('click', countryClick);
    afh2.addEventListener('click', countryClick);
    thailand2.addEventListener('click', countryClick);
    malaysia2.addEventListener('click', countryClick);

    var _center, _line, _poly;

    function countryClick(e) {
      console.info('countryClick');
      var id = e.target.getId();
      if (_center && _line && _poly) {
        _line.updateSymbol({
          lineWidth: 0
        });
        _line.setProperties({
          altitude: 0
        });
        _poly.updateSymbol({
          lineWidth: 0,
          polygonOpacity: 0
        });
        _poly.setProperties({
          altitude: 0
        });
      }
      var _zoom = 5;
      if (id == 'iranPolygon') {
        _center = [51.25, 35.40];
        _line = iran1;
        _poly = iran2;
      } else if (id == 'pakistanPolygon') {
        _center = [69, 32];
        _line = pakistan1;
        _poly = pakistan2;
      } else if (id == 'afhPolygon') {
        _center = [69, 34];
        _line = afh1;
        _poly = afh2;
      } else if (id == 'thailandPolygon') {
        _center = [100.31, 13.45];
        _line = thailand1;
        _poly = thailand2;
      } else if (id == 'malaysiaPolygon') {
        _center = [100.31, 5.45];
        _line = malaysia1;
        _poly = malaysia2;
      } else if (id == 'russiaPolygon') {
        _center = [60.31, 55.45];
        _zoom = 3;
        _line = russia1;
        _poly = russia2;
      }

      map.animateTo({
        pitch: 60,
        center: _center,
        zoom: _zoom
      }, {
          duration: 800,
          easing: 'out'
        });
      _line.updateSymbol({
        lineWidth: 3
      });
      _poly.updateSymbol({
        lineWidth: 3,
        polygonFill: 'rgba(16,97,87,1.0)',
        polygonOpacity: 1.0
      });
      setTimeout(function () {
        maptalks.animation.Animation.animate({
          properties: {
            altitude: 500000
          }
        }, {
            'duration': 800
          }, frame => {
            if (frame.state.playState == 'running') {
              _line.setProperties(frame.styles.properties);
              _poly.setProperties(frame.styles.properties);
            }
          }).play();
      }, 800);
      e.domEvent.stopPropagation();
    }

    map.addEventListener('click', function (e) {
      console.info('mapclick');
      if (_line && _poly) {
        _line.updateSymbol({
          lineWidth: 0
        });
        _line.setProperties({
          altitude: 0
        });
        _poly.updateSymbol({
          lineWidth: 0,
          polygonOpacity: 0
        });
        _poly.setProperties({
          altitude: 0
        });
      }
      map.animateTo({
        pitch: 20,
        center: [66.7903012612708142, 20.976349249268345],
        zoom: 4.0,
      }, {
          duration: 1000,
          easing: 'in'
        });
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
            if (frame.state.playState === 'finished') { }
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
      });
    }, 650);

  }

}