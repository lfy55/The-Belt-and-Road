window.onload = function () {
  var map;
  var imgBaseLayer, vecBaseLayer, clusterLayer, clusterLayer2;
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

  var KazGeometry;
  var kazTypes = ['city', 'city', 'city', 'city', 'city', 'prog-ing', 'slg']; //'prog-ed',
  var kazCities = [
    '卡拉干达', '卡拉曼', '赞加达尔', '塔利斯塔', '埃索达', '中国援建项目Aresia', '中国驻哈萨克斯坦大使馆'
  ];
  var kazCitiesCoords = [
    [65.053389, 52.385164],
    [48.606205, 48.118782],
    [56.360838, 47.750121],
    [
      73.5679117807407,
      45.754579312746785
    ],
    [77.857907, 44.420788],
    [66.179648, 48.641949],
    [71.464757, 51.14244]
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
              map.removeLayer([vectorlayer, vectorlayer0, clusterLayer, clusterLayer2]);
              resetMap();
              hideUI1();
              map.panTo(new maptalks.Coordinate([80.55, 48.19]), {
                duration: 1000
              });
              setTimeout(function () {
                var iii = setInterval(function () {
                  if (map.getZoom() == 5) {
                    clearInterval(iii);
                    initVectorLayer2();
                    return;
                  }
                  map.zoomIn();
                }, 600);
              }, 1000);
            });
            KazGeometry = item;
          }
          arr.push(item);
        }

      });
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
    vectorlayer0 = new maptalks.VectorLayer('vector0', {
      forceRenderOnMoving: true,
      forceRenderOnRotating: true,
      forceRenderOnZooming: true
    });
    vectorlayer = new maptalks.VectorLayer('vector1', {
      forceRenderOnMoving: true,
      forceRenderOnRotating: true,
      forceRenderOnZooming: true
    });
    vectorlayer2 = new maptalks.VectorLayer('vector2', {
      forceRenderOnMoving: true,
      forceRenderOnRotating: true,
      forceRenderOnZooming: true
    });
    // vecBaseLayer.addGeometry(polygons);
    var allSDMarkers = [];

    Object.values(allSDs).forEach(function (k) {
      var marker = new maptalks.Marker(k);
      marker.setProperties({
        mag: Math.random()
      })
      allSDMarkers.push(marker);
    });
    var geometries = maptalks.GeoJSON.toGeometry(earthquakes);
    geometries.forEach(function (c) {
      c.setSymbol({
        'markerType': 'ellipse',
        'markerFill': 'rgba(245,12,12,1)',
        'markerLineWidth': 0,
        'markerWidth': 4,
        'markerHeight': 4
      });
    });
    clusterLayer = new maptalks.ClusterLayer('cluster', geometries, {
      'noClusterWithOneMarker': true,
      'maxClusterRadius': 100,
      'maxClusterZoom': 18,
      'textSymbol': {
        'textFaceName': '"microsoft yahei"',
        'textSize': 2,
        'textDx': 0,
        'textDy': 0
      },
      'symbol': {
        'markerType': 'ellipse',
        'markerFill': {
          property: 'count',
          type: 'interval',
          stops: [
            [1, 'rgb(255, 255, 255)'],
            [3, '#1bbc9b'],
            [33, 'rgb(255, 12, 12)']
          ]
        },
        'markerFillOpacity': 0.7,
        'markerLineOpacity': 1,
        'markerLineWidth': 1,
        'markerLineColor': '#f00',
        'markerWidth': {
          property: 'count',
          type: 'interval',
          stops: [
            [0, 15],
            [5, 25],
            [20, 40]
          ]
        },
        'markerHeight': {
          property: 'count',
          type: 'interval',
          stops: [
            [0, 15],
            [5, 25],
            [20, 40]
          ]
        }
      },
      'drawClusterText': true,
      'geometryEvents': true,
      'single': false
    });

    function getGradient(colors) {
      return {
        type: 'radial',
        colorStops: [
          [0.70, 'rgba(' + colors.join() + ', 0.5)'],
          [0.30, 'rgba(' + colors.join() + ', 1)'],
          [0.20, 'rgba(' + colors.join() + ', 1)'],
          [0.00, 'rgba(' + colors.join() + ', 0)']
        ]
      };
    }
    clusterLayer2 = new maptalks.AnimateMarkerLayer(
        'animatemarker',
        allSDMarkers, {
          'animation': 'scale,fade',
          'randomAnimation': true,
          'geometryEvents': false
        }
      )
      .setStyle([{
          filter: ['<=', 'mag', 0.4],
          symbol: {
            'markerType': 'ellipse',
            'markerLineWidth': 0,
            'markerFill': getGradient([135, 196, 240]),
            'markerFillOpacity': 0.8,
            'markerWidth': 40,
            'markerHeight': 40
          }
        },
        {
          filter: ['<=', 'mag', 0.8],
          symbol: {
            'markerType': 'ellipse',
            'markerLineWidth': 0,
            'markerFill': getGradient([255, 255, 0]),
            'markerFillOpacity': 0.8,
            'markerWidth': 40,
            'markerHeight': 40
          }
        },
        {
          filter: ['>', 'mag', 0.8],
          symbol: {
            'markerType': 'ellipse',
            'markerLineWidth': 0,
            'markerFill': getGradient([216, 115, 149]),
            'markerFillOpacity': 0.8,
            'markerWidth': 40,
            'markerHeight': 40
          }
        }
      ]);

    map = new maptalks.Map('mapContainer', {
      center: [66.7903012612708142, 20.976349249268345],
      zoom: 4.0,
      maxZoom: 18.0,
      minZoom: 4.0,
      layers: [imgBaseLayer, vecBaseLayer, vectorlayer0, clusterLayer, clusterLayer2, vectorlayer],
      pitch: 20
    });
    toggleBaseLayer('image');
  }

  function toggleBaseLayer(type) {
    if (type == 'image') {
      map.removeLayer(vecBaseLayer);
      map.addLayer(imgBaseLayer);
      imgBaseLayer.bringToBack();
      $('#map_shiliang').removeClass('select');
      $('#map_yingxiang').addClass('select');
    } else if (type == 'vector') {
      map.addLayer(vecBaseLayer);
      map.removeLayer(imgBaseLayer);
      vecBaseLayer.bringToBack();
      $('#map_shiliang').addClass('select');
      $('#map_yingxiang').removeClass('select');
    }
    $('.mapboxgl-control-container').hide();
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
      for (var i = 0; i < 1200; i++) {
        addData.push([data[0], data[1], Math.random()]);
      }
      for (var i = 0; i < 1200; i++) {
        addData.push([data[0], data[1], Math.random()]);
      }
    });
    heatLayer = new maptalks.HeatLayer('heat', addData).addTo(map);
    heatLayer.config({
      'blur': 12,
    });
  }

  function backFirstPage() {
    hideUI2();
    showUI1();
    map.animateTo({
      pitch: 20,
      center: [66.7903012612708142, 20.976349249268345],
      zoom: 4.0
    }, {
      duration: 1800,
      easing: 'out'
    }, function () {});
    map.removeLayer(vectorlayer2);
    $('.maptalks-ui').empty();
    KazGeometry.updateSymbol({
      polygonOpacity: 0.2
    });
    setTimeout(function () {
      map.addLayer([vectorlayer, vectorlayer0, clusterLayer, clusterLayer2]);
    }, 2000);
  }

  function ladderAddtoMap() {
    resetMap();
    ladderLayer = new maptalks.VectorLayer('ladder').addTo(map);
    var i = 0;
    var colors = ['#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00'];
    worldCollection.features.map(function (f) {
      var altitude = Math.floor(Math.random() * 7);
      if (f.properties.name == 'China') altitude = 6;
      ladderLayer.addGeometry(new maptalks.MultiPolygon(f.geometry.coordinates, {
        symbol: {
          lineWidth: 2,
          polygonFill: colors[altitude],
          polygonOpacity: 0.6
        }
      }));
    });
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
    // toggleBaseLayer('vector');
    map.addLayer(vectorlayer2);

    $.getJSON("./scripts/world_polygon.json", function (data) {
      polygonsAll = maptalks.GeoJSON.toGeometry(data);
      polygonsAll.forEach(function (geo) {
        if (geo.properties.NAME == 'Kazakhstan') {
          return;
        }
        geo.setSymbol({
          lineColor: '#15887a',
          lineWidth: 2,
          polygonFill: '#122926',
        });
        vectorlayer2.addGeometry(geo);
      });
    });
    var coors = KazGeometry.getCoordinates();
    KazGeometry.updateSymbol({
      polygonOpacity: 0
    });
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
    var i = 0;
    var arr1 = [];
    kazCities.forEach(function (c) {
      if (kazTypes[i] == 'city') {
        var m = new maptalks.Marker(kazCitiesCoords[i], {
          properties: {
            'name': c,
            'img': '../map/images/focus_city.png',
            'bordercolor': '#02dbef',
            'color': 'rgba(2,219,240,0.6)'
          },
          symbol: {
            'markerFile': '../map/images/city.png',
            'markerDx': 0,
            'markerDy': 14,
          }
        }).addTo(vectorlayer2);
        arr1.push(m);
        var m2 = new maptalks.Marker(kazCitiesCoords[i], {
          properties: {
            'name': c,
            'img': '../map/images/focus_city.png',
            'bordercolor': '#02dbef',
            'color': 'rgba(2,219,240,0.6)'
          },
          symbol: {
            'textFaceName': 'LiHeiTi',
            'textName': '{name}',
            'textSize': 14,
            'textDy': 30,
            'textFill': '#02dbef'
          }
        }).addTo(vectorlayer2);
        m.textMarker = m2;
      } else if (kazTypes[i] == 'prog-ing') {
        var m = new maptalks.Marker(kazCitiesCoords[i], {
          properties: {
            'name': c,
            'img': '../map/images/focus_ing.png',
            'bordercolor': '#ecef02',
            'color': 'rgba(236,239,2,0.6)'
          },
          symbol: {
            'markerFile': '../map/images/prog_ing.png',
            'markerDx': 0,
            'markerDy': 14,
          }
        }).addTo(vectorlayer2);
        arr1.push(m);
        var m2 = new maptalks.Marker(kazCitiesCoords[i], {
          properties: {
            'name': c,
            'img': '../map/images/focus_city.png',
            'bordercolor': '#02dbef',
            'color': 'rgba(2,219,240,0.6)'
          },
          symbol: {
            'textFaceName': 'LiHeiTi',
            'textName': '{name}',
            'textSize': 14,
            'textDy': 30,
            'textFill': '#ecef02'
          }
        }).addTo(vectorlayer2);
        m.textMarker = m2;
      } else if (kazTypes[i] == 'prog-ed') {
        var m = new maptalks.Marker(kazCitiesCoords[i], {
          properties: {
            'name': c,
            'img': '../map/images/focus_ed.png',
            'bordercolor': '#00ff18',
            'color': 'rgba(0,255,24,0.6)'
          },
          symbol: {
            'markerFile': '../map/images/prog_ed.png',
            'markerDx': 0,
            'markerDy': 14,
          }
        }).addTo(vectorlayer2);
        arr1.push(m);
        var m2 = new maptalks.Marker(kazCitiesCoords[i], {
          properties: {
            'name': c,
            'img': '../map/images/focus_city.png',
            'bordercolor': '#02dbef',
            'color': 'rgba(2,219,240,0.6)'
          },
          symbol: {
            'textFaceName': 'LiHeiTi',
            'textName': '{name}',
            'textSize': 14,
            'textDy': 30,
            'textFill': '#00ff18'
          }
        }).addTo(vectorlayer2);
        m.textMarker = m2;
      } else if (kazTypes[i] == 'slg') {
        var m = new maptalks.Marker(kazCitiesCoords[i], {
          properties: {
            'name': c,
            'img': '../map/images/focus_slg.png',
            'bordercolor': '#ff0000',
            'color': 'rgba(255,0,0,0.6)'
          },
          symbol: [{
            'markerFile': '../map/images/slg.png',
            'markerWidth': 30,
            'markerHeight': 30,
            'markerDx': 0,
            'markerDy': 15,
          }]
        }).addTo(vectorlayer2);
        m.addEventListener('click', function (e) {
          handleClick(e.target);
        });
      }
      i++;
    });

    arr1.forEach(function (m) {
      m.addEventListener('click', function (e) {
        handleClick(e.target);
      });
      m.flash(400 + Math.random() * 100, 500);
    });

    function handleClick(marker) {
      if (lastKazCity) {
        lastKazCity.remove();
        vectorlayer2.addGeometry(lastKazCity.textMarker);
      }
      vectorlayer2.removeGeometry(marker.textMarker);
      var coords = marker.getCoordinates();
      var props = marker.properties || marker.getProperties();
      var text = props['name'];
      var img = props['img'] || '../map/images/slg.png';
      var color = props['color'];
      var bordercolor = props['bordercolor'];
      lastKazCity = new maptalks.ui.UIMarker(coords, {
        'content': `
            <div>
                <div style="font-family: LiHeiTi;font-size: 18px;color: white;
                background: ` + color + `;border-width: 0px 6px;border-color: ` + bordercolor + `;
                border-style: solid;margin-bottom: 4px;padding: 6px;width: 200px;">` + text + `</div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 70px;margin-left: 50px;">
                    <path d="M0 0 L175 0 L209 90" style="stroke: #ff0000;stroke-width:2px;fill-opacity:0"></path>
                </svg>
                <div style="width: 122px;height: 122px; margin: -50px 9px 10px 193px;">
                      <img src = "` + img + `" style="width:120px;height:120px;">
                </div>
            </div>`,
        dx: -78,
        dy: -22
      }).addTo(map).show();
      lastKazCity.textMarker = marker.textMarker;
      // map.panTo(coords.add(-20, -12), {
      //     duration: 1800
      // });

      // map.animateTo({
      //     pitch: 30,
      //     center: coords,
      //     zoom: 16
      // }, {
      //     duration: 10000,
      //     easing: 'out'
      // });
      map.panTo(coords, {
        duration: 500
      });
      setTimeout(function () {
        var iii = setInterval(function () {
          if (map.getZoom() == 18) {
            clearInterval(iii);
            return;
          }
          map.zoomIn();
        }, 600);
      }, 500);

      hideSide();
      setTimeout(function () {
        showSideWindow();
        $('#videoContainer').empty();
        if (bordercolor == '#02dbef') {
          $('#videoContainer').append(`<video style="width: 100%;height: 100%;" autoplay>
                            <source src="./videos/cesium.mp4" type="video/mp4">
                        </video>`);
        } else if (bordercolor == '#ecef02') {
          $('#videoContainer').append(`<video style="width: 100%;height: 100%;" autoplay>
                            <source src="./videos/model.mp4" type="video/mp4">
                        </video>`);
        } else if (bordercolor == '#ff0000') {
          $('#videoContainer').append(`<video style="width: 100%;height: 100%;" autoplay>
                            <source src="./videos/spqd.mp4" type="video/mp4">
                        </video>`);
        }
        var vid = document.getElementsByTagName("video")[0];
        vid.onended = function () {
          hideSideWindow();
          map.animateTo({
            pitch: 30,
            center: coords,
            zoom: 5
          }, {
            duration: 10000,
            easing: 'out'
          });
        };
      }, 10000);
    }

    vectorlayer2.addEventListener('click', function () {
      if (lastKazCity) {
        lastKazCity.remove();
        vectorlayer2.addGeometry(lastKazCity.textMarker);
      }
    });
    showUI2();
    showSide();
  }

  $('.control_layer_select_item').click(function () {
    $('.control_layer_select_item').toggleClass('select');
    if (this.id == 'map_shiliang') {
      toggleBaseLayer('vector');
    } else {
      toggleBaseLayer('image');
    }
  });

  $('#route_wrap').click(function () {
    resetMap();
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

  $('#side_home').click(function () {
    backFirstPage();
  });
  $('#side_back').click(function () {
    map.panTo(map.getCenter().add(-10, 0), {
      duration: 1000
    });
    hideSide();
  });

  $('#side_left').click(function () {
    map.panTo([80.55, 48.19], {
      duration: 1000
    });
  });

}