export interface GisParameters {
  container: HTMLDivElement;
  accessToken: string;
  zoom: number;
  pitch: number;
  center: [number, number];
  bearing: number;
  buildings: GisBuilding[];
}

export interface GisBuilding {
  uid: string;
  lat: number;
  lng: number;
  htmlElement: HTMLElement;
}
