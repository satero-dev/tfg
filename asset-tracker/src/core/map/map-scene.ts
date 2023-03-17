import * as OBC from "openbim-components";
import { MAPBOX_KEY } from "../../config";
import { GisParameters } from "../../types";
import * as THREE from "three";
import * as MAPBOX from "mapbox-gl";

export class MapScene {
  private components = new OBC.Components();
  private readonly style = "mapbox://styles/mapbox/streets-v12";

  constructor(container: HTMLDivElement) {
    const config = this.getConfig(container);
    this.initializeComponent(config);
    this.setupScene();
  }

  dispose() {
    this.components.dispose();
    (this.components as any) = null;
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
    const map = this.createMap(config);
    const coords = this.getCoordinates(config);
    return new OBC.MapboxRenderer(this.components, map, coords);
  }

  private createMap(config: GisParameters) {
    return new MAPBOX.Map({
      ...config,
      style: this.style,
      antialias: true,
    });
  }

  private getConfig(container: HTMLDivElement) {
    const center = [2.112, 41.556] as [number, number];
    //this.center = { lng: center[0], lat: center[1] };
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
