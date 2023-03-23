import * as OBC from "openbim-components";
import { MAPBOX_KEY } from "../../config";
import { GisParameters, Building, LngLat } from "../../types";
import * as THREE from "three";
import * as MAPBOX from "mapbox-gl";
import { User } from "@firebase/auth";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { MapDatabase } from "./map-database";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Events } from "../../middleware/event-handler";

export class MapScene {
  private components = new OBC.Components();
  private readonly style = "mapbox://styles/mapbox/streets-v12";
  private map: MAPBOX.Map;
  private center: LngLat = { lat: 0, lng: 0 };
  private clickedCoordinates: LngLat = { lat: 0, lng: 0 };
  private labels: { [id: string]: CSS2DObject } = {};
  private database = new MapDatabase();
  private events: Events;

  constructor(container: HTMLDivElement, events: Events) {
    this.events = events;
    const configuration = this.getConfig(container);
    this.map = this.createMap(configuration);
    this.initializeComponent(configuration);
    this.setupScene();
  }

  dispose() {
    this.components.dispose();
    (this.map as any) = null;
    (this.components as any) = null;
    for (const id in this.labels) {
      const label = this.labels[id];
      label.removeFromParent();
      label.element.remove();
    }
    this.labels = {};
  }

  async getAllBuildings(user: User) {
    const building = await this.database.getBuildings(user);
    if (this.components) {
      this.addToScene(building);
    }
  }

  async addBuilding(user: User) {
    const { lat, lng } = this.clickedCoordinates;
    const userID = user.uid;
    const building = { userID, lat, lng, uid: "", nombre: "" };
    building.uid = await this.database.add(building);
    this.addToScene([building]);
  }

  private addToScene(buildings: Building[]) {
    for (const building of buildings) {
      const { uid, lng, lat, nombre } = building;

      const htmlElement = this.createHtmlElement(uid, nombre);
      const label = new CSS2DObject(htmlElement);

      const center = MAPBOX.MercatorCoordinate.fromLngLat(
        { ...this.center },
        0
      );

      const units = center.meterInMercatorCoordinateUnits();
      const model = MAPBOX.MercatorCoordinate.fromLngLat({ lng, lat });
      model.x /= units;
      model.y /= units;
      center.x /= units;
      center.y /= units;

      label.position.set(model.x - center.x, 50, model.y - center.y);

      this.components.scene.get().add(label);
      this.labels[uid] = label;

      const scene = this.components.scene.get();
      const loader = new GLTFLoader();
      //'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf'

      //https://github.com/mrdoob/three.js/blob/master/examples/models/gltf/Parrot.glb
      loader.load(
        'assets/TAU.glb',
        (gltf) => {
          //console.log(gltf);

          gltf.scene.traverse((child) => {
            console.log(child);
            /*if (child.type == "Mesh") {

              (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: 0x1976d2 });
            }*/

            let obj = <THREE.Mesh>child;

            if ((<THREE.Mesh>child).isMesh) {
              obj.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
              obj.material.side = THREE.BackSide;
            }


          })

          scene.add(gltf.scene);

          gltf.scene.position.set(model.x - center.x, -6.6, model.y - center.y);
          let sc = 0.3;
          gltf.scene.scale.set(sc, sc, sc);
          gltf.scene.rotation.y = -0.5;
        }
      );

    }
  }

  private createHtmlElement(id: string, nombre: string) {
    const div = document.createElement("div");
    div.textContent = nombre;
    div.onclick = () => {
      this.events.trigger({ type: "OPEN_BUILDING", payload: id });
    };
    div.classList.add("thumbnail");
    return div;
  }

  private setupScene() {
    const scene = this.components.scene.get();
    scene.background = null;
    const directionalLight = new THREE.HemisphereLight(0xaaaaaa);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0x0000ff);
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
    this.clickedCoordinates = { ...event.lngLat };
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
