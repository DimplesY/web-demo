import './style.css'
import * as maptalks from 'maptalks'
import * as THREE from 'three'
import { ThreeLayer } from 'maptalks.three'
import { GroupGLLayer } from '@maptalks/gl-layers'

const map = new maptalks.Map('app', {
  center: [113.226255, 28.1887],
  zoom: 15,
  minZoom: 15,
  maxZoom: 16,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: 'http://localhost:3000/Satellite/{z}/{x}/{y}.png',
    renderOnMoving: true,
    renderOnZooming: true,
  }),

  layers: [new maptalks.VectorLayer('v')],
})

map.setMaxExtent(map.getExtent())

const threeLayer = new ThreeLayer('t', {
  forceRenderOnMoving: true,
  forceRenderOnRotating: true,
})
threeLayer.prepareToDraw = function (gl, scene, camera) {
  // 加载geojson数据
  fetch('/air.geojson')
    .then((res) => res.json())
    .then((geojson) => {
      const features = geojson.features

      features.forEach((feature: any) => {
        const coordinates = feature.geometry.coordinates
        const geom = new THREE.ExtrudeGeometry(
          new THREE.Shape(
            coordinates[0].map((coord) => {
              const [x, y] = threeLayer.coordinateToVector3(new maptalks.Coordinate(coord))
              return new THREE.Vector2(x, y)
            })
          ),
          {
            bevelEnabled: false,
          }
        )

        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          opacity: 0.6,
          transparent: true,
        })

        const mesh = new THREE.Mesh(geom, material)
        scene.add(mesh)
      })
    })
}

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: { enable: true },
  },
}

const groupLayer = new GroupGLLayer('group', [threeLayer], { sceneConfig })
groupLayer.addTo(map)
