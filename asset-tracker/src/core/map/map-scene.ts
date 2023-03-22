import * as OBC from "openbim-components";
import { MAPBOX_KEY } from "../../config";
import { GisParameters, Building, LngLat } from "../../types";
import * as THREE from "three";
import * as MAPBOX from "mapbox-gl";
import { User } from "@firebase/auth";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export class MapScene {
  private components = new OBC.Components();
  private readonly style = "mapbox://styles/mapbox/streets-v12";
  private map: MAPBOX.Map;
  private center: LngLat = { lat: 0, lng: 0 };
  private clickedCoordinates: LngLat = { lat: 0, lng: 0 };
  private labels: {[id: string]:CSS2DObject} = {};

  constructor(container: HTMLDivElement) {
    const configuration = this.getConfig(container);
    this.map = this.createMap(configuration);
    this.initializeComponent(configuration);
    this.setupScene();
  }

  dispose() {
    this.components.dispose();
    (this.map as any) = null;
    (this.components as any) = null;
    for(const id in this.labels) {
      const label = this.labels[id];
      label.removeFromParent();
      label.element.remove();
    }
    this.labels = {};
  }

  addBuilding(user: User) {
    const {lat, lng} = this.clickedCoordinates;
    const userID = user.uid;
    const building = {userID, lat, lng, uid: ""};
    this.addToScene([building]);
  }

  private addToScene(buildings: Building[]){
    for(const building of buildings) {
      const {uid, lng, lat} = building;
      
      const htmlElement = this.createHtmlElement();
      const label = new CSS2DObject(htmlElement);

      const center = MAPBOX.MercatorCoordinate.fromLngLat(
        { ...this.center},
        0
      );

      const units = center.meterInMercatorCoordinateUnits();
      const model = MAPBOX.MercatorCoordinate.fromLngLat({lng,lat});
      model.x /= units;
      model.y /= units;
      center.x /= units;
      center.y /= units;

      label.position.set(model.x - center.x,0,model.y - center.y);

      this.components.scene.get().add(label);
      this.labels[uid] = label;

    }
  }

  private createHtmlElement () {
    const div = document.createElement("div");
    div.textContent = "🏥";
    div.classList.add("thumbnail");
    return div;
  }

  private setupScene() {
    const scene = this.components.scene.get();
    scene.background = null;
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);
  }

  private initializeComponent(config: GisParameters) {
    this.components.scene = new OBC.SimpleScene(this.components);
    this.components.camera = new OBC.MapboxCamera();
    this.components.renderer = this.createRenderer(config);
    this.components.init();
  }

  private getCoordinates(config: GisParameters) {
    const merc = MAPBOX.MercatorCoordinate;
    return merc.fromLngLat(config.center, 0);
  }

  private createRenderer(config: GisParameters) {
    const coords = this.getCoordinates(config);
    return new OBC.MapboxRenderer(this.components, this.map, coords);
  }

  private createMap(config: GisParameters) {
    const map = new MAPBOX.Map({
      ...config,
      style: this.style,
      antialias: true,
    });

    map.on("contextmenu", this.storeMousePosition);

    map.addControl(
      new MAPBOX.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
        showAccuracyCircle: false,
      })
    );

    return map;
  }

  private storeMousePosition = (event: MAPBOX.MapMouseEvent) => {
    this.clickedCoordinates = {...event.lngLat};
  }

  private getConfig(container: HTMLDivElement) {
    //Coordenadas iniciales del mapa
    const center = [2.112, 41.556] as [number, number];
    this.center = { lng: center[0], lat: center[1] };
    return {
      container,
      accessToken: MAPBOX_KEY,
      zoom: 17,
      pitch: 50,
      bearing: -10,
      center,
      buildings: [],
    };
  }
}
