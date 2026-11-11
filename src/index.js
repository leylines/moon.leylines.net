import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/main.css";
import GUI from 'lil-gui';

// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNDhhNGY5MS1iZjMzLTRmZmUtYjE0Ny1kY2NjN2NlNmU0NTEiLCJpZCI6MTA3LCJpYXQiOjE0ODkxNTg0ODB9.b1pvDdm-eKF1QaCOhp_I8v8KCD51dTDcWryUkmp_yfg";

// Set the default ellipsoid to the Mars instead of WGS84
Cesium.Ellipsoid.default = Cesium.Ellipsoid.MOON;

const viewer = new Cesium.Viewer("cesiumContainer", {
  //terrainProvider: false,
  baseLayer: false,
  // 2D and Columbus View are not currently supported
  // for global 3D Tiles tilesets
  sceneModePicker: false,
  // Imagery layers are not currently supported for
  // global 3D Tiles tilesets
  baseLayerPicker: false,
  // Geocoder is not currently supported for martian locations
  geocoder: true,
  // No timeline
  timeline: false,
  // No animation
  animation: false,
  // improvements for mars
  shadows: false,
  globe: new Cesium.Globe(Cesium.Ellipsoid.MOON),
  skyBox: Cesium.SkyBox.createEarthSkyBox(),
});

viewer.scene.globe.show = false;

viewer.extend(Cesium.viewerDragDropMixin);

const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2684829);
viewer.scene.primitives.add(tileset);

var layers = {}
layers['Clementine 750nm V2'] = {}
layers['Clementine 750nm V2']['name'] = "uv_v2"
layers['Clementine 750nm Warp'] = {}
layers['Clementine 750nm Warp']['name'] = "uv_warp"
layers['Clementine/Lunar Hybrid'] = {}
layers['Clementine/Lunar Hybrid']['name'] = "uv_lo"
layers['Lunar Orbiter'] = {}
layers['Lunar Orbiter']['name'] = "LO"
layers['LRO WAC'] = {}
layers['LRO WAC']['name'] = "LROC_WAC"
layers['Lola Color'] = {}
layers['Lola Color']['name'] = "LOLA_color"
layers['Lola Steel'] = {}
layers['Lola Steel']['name'] = "LOLA_steel"
layers['Lola Steel'] = {}
layers['Lola Steel']['name'] = "LOLA_steel"
layers['Lola Grayscale'] = {}
layers['Lola Grayscale']['name'] = "LOLA_bw"
layers['Lola/Kaguya'] = {}
layers['Lola/Kaguya']['name'] = "LOLA_Kaguya_Shade"
layers['Kaguya TC'] = {}
layers['Kaguya TC']['name'] = "KaguyaTC_Ortho"

var gui_settings = {}

Object.keys(layers).forEach(layer => {

  layers[layer]['wms'] = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    url: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/earth/moon_simp_cyl.map',
    layers: layers[layer]['name'],
    parameters: {
        transparent: 'false',
        format: 'image/png'
    }
  }));
  tileset.imageryLayers.add(layers[layer]['wms']);
  layers[layer]['wms'].show = false;
  gui_settings[layers[layer]['name']] = layers[layer]['wms'].show;
});

var anthropogenic_objects = await Cesium.GeoJsonDataSource.load('geojson/anthropogenic_objects.geojson', {
  credit: "Coordinates of anthropogenic (man-made) objects on the Moon as measured by Wagner, et al. (2017) using Lunar Reconnaissance Orbiter Camera (LROC) NAC images combined with Earth-based laser-ranging measurements.",
  clampToGround: true,
});

var new_craters = await Cesium.GeoJsonDataSource.load('geojson/new_craters.geojson', {
  credit: "Speyerer, E., Povilaitis, R., Robinson, M., Thomas, P., and Wagner, R. Quantifying crater production and regolith overturn on the Moon with temporal imaging. Nature 538, 215–218 (2016). https://doi.org/10.1038/nature19829",
  clampToGround: true,
});

var entities;
entities = anthropogenic_objects.entities.values;
entities.forEach((entity) => {
  entity.label = new Cesium.LabelGraphics({
    text: entity.properties.Mission,
    font: "16pt Verdana",
    outlineColor: Cesium.Color.DARKSLATEGREY,
    outlineWidth: 2,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    pixelOffset: new Cesium.Cartesian2(0, -22),
    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
    translucencyByDistance: new Cesium.NearFarScalar(2.5e7, 1.0, 4.0e7, 0.0),
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: new Cesium.CallbackProperty(() => {
      return Cesium.Cartesian3.magnitude(viewer.scene.camera.positionWC);
    }, false),
  });
  entity.point = new Cesium.PointGraphics({
    pixelSize: 10,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
    scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.0e7, 0.1),
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: new Cesium.CallbackProperty(() => {
      return Cesium.Cartesian3.magnitude(viewer.scene.camera.positionWC);
    }, false),
  });
});
viewer.dataSources.add(anthropogenic_objects);
anthropogenic_objects.show = false;

entities = new_craters.entities.values;
entities.forEach((entity) => {
  entity.point = new Cesium.PointGraphics({
    pixelSize: 6,
    color: Cesium.Color.ORANGE,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 1,
    scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.0e7, 0.1),
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: new Cesium.CallbackProperty(() => {
      return Cesium.Cartesian3.magnitude(viewer.scene.camera.positionWC);
    }, false),
  });
});
viewer.dataSources.add(new_craters);
new_craters.show = false;


gui_settings['anthropogenic_objects'] = false
gui_settings['new_craters'] = false

const gui = new GUI();
gui.title("Leylines Moon");

var basemaps = gui.addFolder("Basemaps")
basemaps.open(false);
Object.keys(layers).forEach(layer => {
  basemaps.add(gui_settings, layers[layer]['name']).listen()
    .name(layer)
});

var pois = gui.addFolder("Points of Interest");
pois.add(gui_settings, 'anthropogenic_objects').listen()
  .name("Anthropogenic Objects")
  .onChange(function() {
    anthropogenic_objects.show = gui_settings.anthropogenic_objects
  });
pois.add(gui_settings, 'new_craters').listen()
  .name("New Craters")
  .onChange(function() {
    new_craters.show = gui_settings.new_craters
  });

gui.onChange( event => {
  Object.keys(layers).forEach(layer => {
    if (event.property == layers[layer]['name']) {
      layers[layer]['wms'].show = gui_settings[layers[layer]['name']]
    } else {
      layers[layer]['wms'].show = false;
      gui_settings[layers[layer]['name']] = false;
    }
  });
});
