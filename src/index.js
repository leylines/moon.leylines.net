import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/main.css";

// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNDhhNGY5MS1iZjMzLTRmZmUtYjE0Ny1kY2NjN2NlNmU0NTEiLCJpZCI6MTA3LCJpYXQiOjE0ODkxNTg0ODB9.b1pvDdm-eKF1QaCOhp_I8v8KCD51dTDcWryUkmp_yfg";

// Set the default ellipsoid to the Mars instead of WGS84
Cesium.Ellipsoid.default = Cesium.Ellipsoid.MOON;

const viewer = new Cesium.Viewer("cesiumContainer", {
  // This is a global 3D Tiles tileset so disable the
  // globe to prevent it from interfering with the data
  globe: false,
  // 2D and Columbus View are not currently supported
  // for global 3D Tiles tilesets
  sceneModePicker: false,
  // Imagery layers are not currently supported for
  // global 3D Tiles tilesets
  baseLayerPicker: false,
  // Geocoder is not currently supported for martian locations
  geocoder: false,
  // No timeline
  timeline: false,
  // No animation
  animation: false,
});

viewer.extend(Cesium.viewerDragDropMixin);

try {
  const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2684829);
  viewer.scene.primitives.add(tileset);
} catch (error) {
  console.log(error);
}
