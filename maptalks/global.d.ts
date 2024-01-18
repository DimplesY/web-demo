declare module 'maptalks' {
  export class Map  {
    constructor(element: string | HTMLElement, options?: any)
    getExtent(): any
    setMaxExtent(extent: any): this
    getCenter():any
  }

  export class Coordinate {
    constructor(...options?: any[])
  }

  export class TileLayer {
    constructor(id: string, options?: any)
    addTo(map: maptalks.Map): this
  }
  export class VectorLayer {
    constructor(id: string, options?: any)
  }
  export class Extent {
    constructor(...options?: any[])
  }
}

declare module 'maptalks.heatmap' {
  import * as maptalks from 'maptalks'
  export class HeatLayer extends maptalks.Layer {
    constructor(id: string, data: any, options?: any)
    addTo(map: maptalks.Map): this
    redraw(): this
  }
}

declare module '@maptalks/gl-layers' {
  import * as maptalks from 'maptalks'
  export class GroupGLLayer {
    constructor(id: string, layers: any, options?: any)
    addTo(map: maptalks.Map): this
  }
}
