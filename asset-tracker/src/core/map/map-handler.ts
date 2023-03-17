import { MapScene } from "./map-scene";

export const mapHandler = {
  viewer: null as MapScene | null,

  start(conatiner: HTMLDivElement) {
    if (!this.viewer) {
      console.log("Map started!");
      this.viewer = new MapScene(conatiner);
    }
  },

  remove() {
    if (this.viewer) {
      console.log("Map removed!");
      this.viewer.dispose();
      this.viewer = null;
    }
  },
};
