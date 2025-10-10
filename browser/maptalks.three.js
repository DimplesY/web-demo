/*!
 * maptalks.three v0.41.2
 * LICENSE : MIT
 * (c) 2016-2025 maptalks.org
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('three')) :
    typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'three'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.maptalks = global.maptalks || {}, global.maptalks, global.THREE));
})(this, (function (exports, maptalks, THREE) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var maptalks__namespace = /*#__PURE__*/_interopNamespace(maptalks);
    var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

    /**
     * three api adapt
     */
    const REVISION = parseInt(THREE__namespace.REVISION.replace('dev', ''));
    //Three does not print version information now. Output the version of three to find compatibility problems
    console.log(`maptalks.three log: current three.js version is %c${REVISION}`, 'color:red;font-size: 16px;font-weight: bold;');
    /**
     *
     * @param {THREE.BufferGeometry} bufferGeomertry
     * @param {String} key
     * @param {*} value
     */
    function addAttribute(bufferGeomertry, key, value) {
        if (REVISION > 109) {
            bufferGeomertry.setAttribute(key, value);
        }
        else {
            bufferGeomertry.addAttribute(key, value);
        }
        return bufferGeomertry;
    }
    function setRaycasterLinePrecision(raycaster, linePrecision) {
        if (REVISION > 113) {
            raycaster.params.Line.threshold = linePrecision;
        }
        else {
            raycaster.linePrecision = linePrecision;
        }
    }
    function getThreeNameSpace() {
        const three = THREE__namespace;
        return three;
    }
    function _getThreeVertexColors(threeNameSpace) {
        if (threeNameSpace['VertexColors']) {
            return threeNameSpace['VertexColors'];
        }
        return 2;
    }
    function getVertexColors() {
        // const vertexColors = THREE?.['VertexColors'] ?? false
        // if (vertexColors) {
        //     return vertexColors;
        // }
        // return true;
        return _getThreeVertexColors(getThreeNameSpace());
    }
    function getBoxGeometry(width, height, depth) {
        const three = getThreeNameSpace();
        if (REVISION >= 144) {
            return new three.BoxGeometry(width, height, depth);
        }
        if (three.BoxBufferGeometry) {
            return new three.BoxBufferGeometry(width, height, depth);
        }
        else if (three.BoxGeometry) {
            return new three.BoxGeometry(width, height, depth);
        }
    }
    function createWebGLRenderTarget() {
        //https://github.com/mrdoob/three.js/pull/25771
        if (REVISION >= 152) {
            return new THREE__namespace.WebGLRenderTarget(1, 1, {
                format: THREE__namespace.RGBAFormat,
                //@ts-ignore
                colorSpace: THREE__namespace.SRGBColorSpace
            });
        }
        else {
            return new THREE__namespace.WebGLRenderTarget(1, 1, {});
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineSegmentsGeometry extends THREE__namespace.InstancedBufferGeometry {
        constructor() {
            super();
            this.isLineSegmentsGeometry = true;
            this.type = 'LineSegmentsGeometry';
            var positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0];
            var uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
            var index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
            this.setIndex(index);
            addAttribute(this, 'position', new THREE__namespace.Float32BufferAttribute(positions, 3));
            addAttribute(this, 'uv', new THREE__namespace.Float32BufferAttribute(uvs, 2));
        }
        // THREE.InstancedBufferGeometry.call(this);
        // var plane = new THREE.BufferGeometry();
        // this.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        applyMatrix(matrix) {
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined) {
                matrix.applyToBufferAttribute(start);
                matrix.applyToBufferAttribute(end);
                start.data.needsUpdate = true;
            }
            if (this.boundingBox !== null) {
                this.computeBoundingBox();
            }
            if (this.boundingSphere !== null) {
                this.computeBoundingSphere();
            }
            return this;
        }
        setPositions(array) {
            var lineSegments;
            if (array instanceof Float32Array) {
                lineSegments = array;
            }
            else if (Array.isArray(array)) {
                lineSegments = new Float32Array(array);
            }
            var instanceBuffer = new THREE__namespace.InstancedInterleavedBuffer(lineSegments, 6, 1); // xyz, xyz
            addAttribute(this, 'instanceStart', new THREE__namespace.InterleavedBufferAttribute(instanceBuffer, 3, 0));
            addAttribute(this, 'instanceEnd', new THREE__namespace.InterleavedBufferAttribute(instanceBuffer, 3, 3));
            // this.addAttribute('instanceStart', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 0)); // xyz
            // this.addAttribute('instanceEnd', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 3)); // xyz
            //
            this.computeBoundingBox();
            this.computeBoundingSphere();
            return this;
        }
        setColors(array) {
            var colors;
            if (array instanceof Float32Array) {
                colors = array;
            }
            else if (Array.isArray(array)) {
                colors = new Float32Array(array);
            }
            var instanceColorBuffer = new THREE__namespace.InstancedInterleavedBuffer(colors, 6, 1); // rgb, rgb
            addAttribute(this, 'instanceColorStart', new THREE__namespace.InterleavedBufferAttribute(instanceColorBuffer, 3, 0));
            addAttribute(this, 'instanceColorEnd', new THREE__namespace.InterleavedBufferAttribute(instanceColorBuffer, 3, 3));
            // this.addAttribute('instanceColorStart', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 0)); // rgb
            // this.addAttribute('instanceColorEnd', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 3)); // rgb
            return this;
        }
        fromWireframeGeometry(geometry) {
            this.setPositions(geometry.attributes.position.array);
            return this;
        }
        fromEdgesGeometry(geometry) {
            this.setPositions(geometry.attributes.position.array);
            return this;
        }
        fromMesh(mesh) {
            this.fromWireframeGeometry(new THREE__namespace.WireframeGeometry(mesh.geometry));
            // set colors, maybe
            return this;
        }
        fromLineSegements(lineSegments) {
            var geometry = lineSegments.geometry;
            if (geometry.isGeometry) {
                this.setPositions(geometry.vertices);
            }
            else if (geometry.isBufferGeometry) {
                this.setPositions(geometry.position.array); // assumes non-indexed
            }
            // set colors, maybe
            return this;
        }
        computeBoundingBox() {
            var box = new THREE__namespace.Box3();
            if (this.boundingBox === null) {
                this.boundingBox = new THREE__namespace.Box3();
            }
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined && end !== undefined) {
                this.boundingBox.setFromBufferAttribute(start);
                box.setFromBufferAttribute(end);
                this.boundingBox.union(box);
            }
        }
        computeBoundingSphere() {
            var vector = new THREE__namespace.Vector3();
            if (this.boundingSphere === null) {
                this.boundingSphere = new THREE__namespace.Sphere();
            }
            if (this.boundingBox === null) {
                this.computeBoundingBox();
            }
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined && end !== undefined) {
                var center = this.boundingSphere.center;
                this.boundingBox.getCenter(center);
                var maxRadiusSq = 0;
                for (var i = 0, il = start.count; i < il; i++) {
                    vector.fromBufferAttribute(start, i);
                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                    vector.fromBufferAttribute(end, i);
                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                }
                this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
                if (isNaN(this.boundingSphere.radius)) {
                    console.error('THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.', this);
                }
            }
        }
        toJSON() {
            // todo
        }
        // clone: function () {
        //     // todo
        // },
        // eslint-disable-next-line no-unused-vars
        copy(source) {
            // todo
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     * parameters = {
     *  color: <hex>,
     *  linewidth: <float>,
     *  dashed: <boolean>,
     *  dashScale: <float>,
     *  dashSize: <float>,
     *  gapSize: <float>,
     *  resolution: <Vector2>, // to be set by renderer
     * }
     */
    const UniformsLib = {}, ShaderLib = {};
    UniformsLib.line = {
        linewidth: { value: 1 },
        resolution: { value: new THREE__namespace.Vector2(1, 1) },
        dashScale: { value: 1 },
        dashSize: { value: 1 },
        gapSize: { value: 1 } // todo FIX - maybe change to totalSize
    };
    ShaderLib['line'] = {
        uniforms: THREE__namespace.UniformsUtils.merge([
            THREE__namespace.UniformsLib.common,
            THREE__namespace.UniformsLib.fog,
            UniformsLib.line
        ]),
        vertexShader: `
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		varying vec2 vUv;

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			vUv = uv;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec2 ndcStart = clipStart.xy / clipStart.w;
			vec2 ndcEnd = clipEnd.xy / clipEnd.w;

			// direction
			vec2 dir = ndcEnd - ndcStart;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			// perpendicular to dir
			vec2 offset = vec2( dir.y, - dir.x );

			// undo aspect ratio adjustment
			dir.x /= aspect;
			offset.x /= aspect;

			// sign flip
			if ( position.x < 0.0 ) offset *= - 1.0;

			// endcaps
			if ( position.y < 0.0 ) {

				offset += - dir;

			} else if ( position.y > 1.0 ) {

				offset += dir;

			}

			// adjust for linewidth
			offset *= linewidth;

			// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
			offset /= resolution.y;

			// select end
			vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

			// back to clip space
			offset *= clip.w;

			clip.xy += offset;

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,
        fragmentShader: `
		uniform vec3 diffuse;
		uniform float opacity;

		#ifdef USE_DASH

			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		varying vec2 vUv;

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			if ( abs( vUv.y ) > 1.0 ) {

				float a = vUv.x;
				float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
				float len2 = a * a + b * b;

				if ( len2 > 1.0 ) discard;

			}

			vec4 diffuseColor = vec4( diffuse, opacity );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, diffuseColor.a );

			#include <premultiplied_alpha_fragment>
			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>

		}
		`
    };
    class LineMaterial extends THREE__namespace.ShaderMaterial {
        constructor(parameters) {
            super({
                uniforms: THREE__namespace.UniformsUtils.clone(ShaderLib['line'].uniforms),
                vertexShader: ShaderLib['line'].vertexShader,
                fragmentShader: ShaderLib['line'].fragmentShader
            });
            this.dashed = true;
            this.isLineMaterial = true;
            this.type = 'LineMaterial';
            Object.defineProperties(this, {
                color: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.diffuse.value;
                    },
                    set: function (value) {
                        this.uniforms.diffuse.value = value;
                    }
                },
                linewidth: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.linewidth.value;
                    },
                    set: function (value) {
                        this.uniforms.linewidth.value = value;
                    }
                },
                dashScale: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.dashScale.value;
                    },
                    set: function (value) {
                        this.uniforms.dashScale.value = value;
                    }
                },
                dashSize: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.dashSize.value;
                    },
                    set: function (value) {
                        this.uniforms.dashSize.value = value;
                    }
                },
                gapSize: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.gapSize.value;
                    },
                    set: function (value) {
                        this.uniforms.gapSize.value = value;
                    }
                },
                resolution: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.resolution.value;
                    },
                    set: function (value) {
                        this.uniforms.resolution.value.copy(value);
                    }
                }
            });
            this.setValues(parameters);
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineSegments2 extends THREE__namespace.Mesh {
        constructor(geometry, material) {
            super(geometry, material);
            this.isLineSegments2 = true;
            this.type = 'LineSegments2';
            this.geometry = geometry !== undefined ? geometry : new LineSegmentsGeometry();
            this.material = material !== undefined ? material : new LineMaterial({ color: Math.random() * 0xffffff });
        }
        computeLineDistances() {
            var start = new THREE__namespace.Vector3();
            var end = new THREE__namespace.Vector3();
            var geometry = this.geometry;
            var instanceStart = geometry.attributes.instanceStart;
            var instanceEnd = geometry.attributes.instanceEnd;
            if (!instanceStart || !instanceEnd) {
                return this;
            }
            var lineDistances = new Float32Array(2 * instanceStart.data.count);
            for (var i = 0, j = 0, l = instanceStart.data.count; i < l; i++, j += 2) {
                start.fromBufferAttribute(instanceStart, i);
                end.fromBufferAttribute(instanceEnd, i);
                lineDistances[j] = (j === 0) ? 0 : lineDistances[j - 1];
                lineDistances[j + 1] = lineDistances[j] + start.distanceTo(end);
            }
            var instanceDistanceBuffer = new THREE__namespace.InstancedInterleavedBuffer(lineDistances, 2, 1); // d0, d1
            addAttribute(geometry, 'instanceDistanceStart', new THREE__namespace.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0));
            addAttribute(geometry, 'instanceDistanceEnd', new THREE__namespace.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1));
            // geometry.addAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)); // d0
            // geometry.addAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)); // d1
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineGeometry extends LineSegmentsGeometry {
        constructor() {
            super();
            this.isLineGeometry = true;
            this.type = 'LineGeometry';
        }
        fromLine(line) {
            var geometry = line.geometry;
            if (geometry.isGeometry) {
                this.setPositions(geometry.vertices);
            }
            else if (geometry.isBufferGeometry) {
                this.setPositions(geometry.position.array); // assumes non-indexed
            }
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class Line2 extends LineSegments2 {
        constructor(geometry, material) {
            super(geometry, material);
            this.isLine2 = true;
            this.type = 'Line2';
            this.geometry = geometry !== undefined ? geometry : new LineGeometry();
            this.material = material !== undefined ? material : new LineMaterial({ color: Math.random() * 0xffffff });
        }
        copy(source) {
            return this;
        }
    }

    const OPTIONS$m = {
        interactive: true,
        altitude: 0,
        minZoom: 0,
        maxZoom: 30,
        asynchronous: false,
        bloom: false,
        pickWeight: -1
    };
    /**
     * a Class for Eventable
     */
    function Base() {
    }
    // class Base {
    //     constructor() {
    //     }
    // }
    /**
     * EVENTS=[
     *  'add',
     *  'remove',
        'mousemove',
        'click',
        'mousedown',
        'mouseup',
        'dblclick',
        'contextmenu',
        'touchstart',
        'touchmove',
        'touchend',
        'mouseover',
        'mouseout',
        'idchange',
        'propertieschange',
        'show',
        'hide',
        'symbolchange'
         empty
    ];
     * This is the base class for all 3D objects
     *
     *
     * Its function and maptalks.geometry are as similar as possible
     *
     * maptalks.Eventable(Base) return a Class  https://github.com/maptalks/maptalks.js/blob/master/src/core/Eventable.js
     *
     */
    class BaseObject extends maptalks__namespace.Eventable(Base) {
        constructor(id) {
            super();
            this.isAdd = false;
            this._mouseover = false;
            this._visible = true;
            this._zoomVisible = true;
            this.picked = false;
            this.isBaseObject = true;
            if (id === undefined) {
                id = maptalks__namespace.Util.GUID();
            }
            this.id = id;
        }
        addTo(layer) {
            if (layer && layer.type === 'ThreeLayer') {
                layer.addMesh([this]);
            }
            else {
                console.error('layer only support maptalks.ThreeLayer');
            }
            return this;
        }
        remove() {
            const layer = this.getLayer();
            if (layer) {
                layer.removeMesh([this]);
            }
            return this;
        }
        getObject3d() {
            return this.object3d;
        }
        getId() {
            return this.id;
        }
        setId(id) {
            const oldId = this.getId();
            this.id = id;
            this._fire('idchange', {
                'old': oldId,
                'new': id,
                'target': this
            });
            return this;
        }
        getType() {
            return this.type;
        }
        getOptions() {
            return this.options;
        }
        getProperties() {
            return (this.options || {}).properties;
        }
        setProperties(property) {
            const old = Object.assign({}, this.getProperties());
            this.options.properties = property;
            this._fire('propertieschange', {
                'old': old,
                'new': property,
                'target': this
            });
            return this;
        }
        getLayer() {
            return this.options.layer;
        }
        // eslint-disable-next-line consistent-return
        getMap() {
            const layer = this.getLayer();
            if (layer) {
                return layer.getMap();
            }
        }
        // eslint-disable-next-line consistent-return
        getCenter() {
            const options = this.getOptions();
            const { coordinate, lineString, polygon } = options;
            if (coordinate) {
                return coordinate instanceof maptalks__namespace.Coordinate ? coordinate : new maptalks__namespace.Coordinate(coordinate);
            }
            else {
                const geometry = polygon || lineString;
                if (geometry && geometry.getCenter) {
                    return geometry.getCenter();
                }
            }
        }
        getAltitude() {
            return this.getOptions().altitude;
        }
        /**
         * Different objects need to implement their own methods
         * @param {*} altitude
         */
        setAltitude(altitude) {
            if (maptalks__namespace.Util.isNumber(altitude)) {
                const z = this.getLayer().altitudeToVector3(altitude, altitude).x;
                this.getObject3d().position.z = z;
                this.options.altitude = altitude;
                if (this.pickObject3d) {
                    this.pickObject3d.position.z = z;
                }
                //fix merged mesh
                if (this._baseObjects && Array.isArray(this._baseObjects)) {
                    for (let i = 0, len = this._baseObjects.length; i < len; i++) {
                        if (this._baseObjects[i]) {
                            this._baseObjects[i].getObject3d().position.z = z;
                        }
                    }
                }
            }
            return this;
        }
        supportHeight() {
            return this.getOptions().heightEnable;
        }
        getHeight() {
            const { height } = this.getOptions();
            return maptalks__namespace.Util.isNumber(height) ? height : 0;
        }
        setHeight(height) {
            if (!maptalks__namespace.Util.isNumber(height) || this._baseObjects || !this.supportHeight()) {
                return this;
            }
            const layer = this.getLayer();
            if (!layer) {
                return this;
            }
            const { geometry } = this.getObject3d();
            if (geometry instanceof THREE__namespace.BufferGeometry) {
                const { position } = geometry.attributes || {};
                if (!position) {
                    return this;
                }
                const array = position.array;
                let min = Infinity, max = -Infinity;
                for (let i = 0, len = array.length; i < len; i += 3) {
                    const z = array[i + 2];
                    min = Math.min(z, min);
                    max = Math.max(z, max);
                }
                const middle = (min + max) / 2;
                let z = layer.altitudeToVector3(height, height).x;
                // z>0
                z = Math.max(z, 0.000001);
                for (let i = 0, len = array.length; i < len; i += 3) {
                    if (array[i + 2] > middle) {
                        array[i + 2] = z;
                    }
                }
                geometry.attributes.position.needsUpdate = true;
                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();
                this.getOptions().height = height;
            }
            return this;
        }
        show() {
            //  in zoom range
            if (this._zoomVisible) {
                this.getObject3d().visible = true;
                this._fire('show');
            }
            this._visible = true;
            return this;
        }
        hide() {
            this.getObject3d().visible = false;
            this._fire('hide');
            this._visible = false;
            this._hideUI();
            return this;
        }
        isVisible() {
            return (!!this.getObject3d().visible);
        }
        /**
         *  Different objects need to implement their own methods
         */
        getSymbol() {
            return this.getObject3d().material;
        }
        /**
         *  Different objects need to implement their own methods
         * @param {*} material
         */
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                material.vertexColors = this.getObject3d().material.vertexColors;
                const old = this.getObject3d().material.clone();
                this.getObject3d().material = material;
                this._fire('symbolchange', {
                    'old': old,
                    'new': material,
                    'target': this
                });
            }
            return this;
        }
        setInfoWindow(options) {
            this.removeInfoWindow();
            this.infoWindow = new maptalks__namespace.ui.InfoWindow(options);
            this.infoWindow.addTo(this);
            return this;
        }
        getInfoWindow() {
            return this.infoWindow;
        }
        openInfoWindow(coordinate) {
            coordinate = coordinate || this.getCenter();
            if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            // eslint-disable-next-line no-unused-expressions
            (coordinate && this.infoWindow && this.infoWindow.show(coordinate));
            return this;
        }
        closeInfoWindow() {
            // eslint-disable-next-line no-unused-expressions
            (this.infoWindow && this.infoWindow.hide());
            return this;
        }
        removeInfoWindow() {
            // eslint-disable-next-line no-unused-expressions
            if (this.infoWindow) {
                this.infoWindow.remove();
                delete this.infoWindow;
            }
            return this;
        }
        setToolTip(content, options) {
            this.removeToolTip();
            this.toolTip = new maptalks__namespace.ui.ToolTip(content, options);
            this.toolTip.addTo(this);
            return this;
        }
        getToolTip() {
            return this.toolTip;
        }
        openToolTip(coordinate) {
            // coordinate = coordinate || this.getCenter();
            // if (!(coordinate instanceof maptalks.Coordinate)) {
            //     coordinate = new maptalks.Coordinate(coordinate);
            // }
            // eslint-disable-next-line no-unused-expressions
            // (coordinate && this.toolTip && this.toolTip.show(coordinate));
            return this;
        }
        closeToolTip() {
            // eslint-disable-next-line no-unused-expressions
            (this.toolTip && this.toolTip.hide());
            return this;
        }
        removeToolTip() {
            // eslint-disable-next-line no-unused-expressions
            if (this.toolTip) {
                this.toolTip.remove();
                delete this.toolTip;
            }
            return this;
        }
        _hideUI() {
            this.closeInfoWindow();
            this.closeToolTip();
            return this;
        }
        /**
         * different components should implement their own animation methods
         * @param {*} options
         * @param {*} cb
         */
        // eslint-disable-next-line no-unused-vars
        animateShow(options = {}, cb) {
            if (this._showPlayer) {
                this._showPlayer.cancel();
            }
            if (maptalks__namespace.Util.isFunction(options)) {
                options = {};
                cb = options;
            }
            const duration = options['duration'] || 1000, easing = options['easing'] || 'out';
            const player = this._showPlayer = maptalks__namespace.animation.Animation.animate({
                'scale': 1
            }, {
                'duration': duration,
                'easing': easing
            }, frame => {
                const scale = frame.styles.scale;
                if (scale > 0) {
                    this.getObject3d().scale.z = scale;
                }
                if (cb) {
                    cb(frame, scale);
                }
            });
            player.play();
            return player;
        }
        getMinZoom() {
            return this.getOptions().minZoom;
        }
        getMaxZoom() {
            return this.getOptions().maxZoom;
        }
        isAsynchronous() {
            return this.getOptions().asynchronous;
        }
        get bloom() {
            return this.getOptions().bloom;
        }
        fire(eventType, param) {
            this._fire(eventType, param);
            if (this._vt && this._vt.onSelectMesh) {
                this._vt.onSelectMesh(eventType, param);
            }
            return this;
        }
        config() {
            return this;
        }
        setPickObject3d(object3d) {
            this.pickObject3d = object3d;
            this.pickObject3d['__parent'] = this;
            return this;
        }
        getPickObject3d() {
            return this.pickObject3d;
        }
        /**
         * more method support
         * @param {*} options
         */
        /**
         *
         * @param {*} options
         */
        _initOptions(options) {
            this.options = maptalks__namespace.Util.extend({}, OPTIONS$m, options);
            return this;
        }
        _createMesh(geometry, material) {
            this.object3d = new THREE__namespace.Mesh(geometry, material);
            this.object3d['__parent'] = this;
            return this;
        }
        _createInstancedMesh(geometry, material, count) {
            this.object3d = new THREE__namespace.InstancedMesh(geometry, material, count);
            this.object3d['__parent'] = this;
            return this;
        }
        _createGroup() {
            this.object3d = new THREE__namespace.Group();
            this.object3d['__parent'] = this;
            return this;
        }
        _createLine(geometry, material) {
            this.object3d = new THREE__namespace.Line(geometry, material);
            // (this.object3d as THREE.Line).computeLineDistances();
            this._computeLineDistances(geometry);
            this.object3d['__parent'] = this;
            return this;
        }
        _createLine2(geometry, material) {
            this.object3d = new Line2(geometry, material);
            this.object3d.computeLineDistances();
            this.object3d['__parent'] = this;
            return this;
        }
        // eslint-disable-next-line no-unused-vars
        _createPoints(geometry, material) {
            //Serving for particles
            this.object3d = new THREE__namespace.Points(geometry, material);
            this.object3d['__parent'] = this;
            return this;
        }
        _createLineSegments(geometry, material) {
            this.object3d = new THREE__namespace.LineSegments(geometry, material);
            // (this.object3d as THREE.LineSegments).computeLineDistances();
            this._computeLineDistances(geometry);
            this.object3d['__parent'] = this;
            return this;
        }
        /**
         * rewrite three.js computeLineDistances ,1.7 speed
         * @param geometry
         */
        _computeLineDistances(geometry) {
            const position = geometry.attributes.position.array;
            const count = geometry.attributes.position.count;
            const lineDistances = new Float32Array(count);
            lineDistances[0] = 0;
            const start = new THREE__namespace.Vector3(0, 0, 0), end = new THREE__namespace.Vector3(0, 0, 0);
            for (let i = 1; i < count; i++) {
                const idx = (i - 1) * 3;
                start.x = position[idx];
                start.y = position[idx + 1];
                start.z = position[idx + 2];
                const idx1 = i * 3;
                end.x = position[idx1];
                end.y = position[idx1 + 1];
                end.z = position[idx1 + 2];
                const distance = end.distanceTo(start);
                lineDistances[i] = lineDistances[i - 1] + distance;
            }
            addAttribute(geometry, 'lineDistance', new THREE__namespace.BufferAttribute(lineDistances, 1));
        }
    }

    /* eslint-disable indent */
    const TYPES = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];
    function getGeoJSONType(feature) {
        return feature.geometry ? feature.geometry.type : null;
    }
    function isGeoJSON(feature) {
        const type = getGeoJSONType(feature);
        if (type) {
            for (let i = 0, len = TYPES.length; i < len; i++) {
                if (TYPES[i] === type) {
                    return true;
                }
            }
        }
        return false;
    }
    function isGeoJSONPolygon(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[4] || type === TYPES[5])) {
            return true;
        }
        return false;
    }
    function isGeoJSONLine(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[2] || type === TYPES[3])) {
            return true;
        }
        return false;
    }
    function isGeoJSONPoint(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[0] || type === TYPES[1])) {
            return true;
        }
        return false;
    }
    function isGeoJSONMulti(feature) {
        const type = getGeoJSONType(feature);
        if (type) {
            if (type.indexOf('Multi') > -1) {
                return true;
            }
        }
        return false;
    }
    function getGeoJSONCoordinates(feature) {
        return feature.geometry ? feature.geometry.coordinates : [];
    }
    function getGeoJSONCenter(feature, out) {
        const type = getGeoJSONType(feature);
        if (!type || !feature.geometry) {
            return null;
        }
        const geometry = feature.geometry;
        const coordinates = geometry.coordinates;
        if (!coordinates) {
            return null;
        }
        // const coords: Array<Array<number>> = [];
        let sumX = 0, sumY = 0, coordLen = 0;
        switch (type) {
            case 'Point': {
                sumX = coordinates[0];
                sumY = coordinates[1];
                // coords.push(coordinates as Array<number>);
                coordLen++;
                break;
            }
            case 'MultiPoint':
            case 'LineString': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    sumX += coordinates[i][0];
                    sumY += coordinates[i][1];
                    coordLen++;
                    // coords.push(coordinates[i] as Array<number>);
                }
                break;
            }
            case 'MultiLineString':
            case 'Polygon': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    for (let j = 0, len1 = coordinates[i].length; j < len1; j++) {
                        // coords.push((coordinates[i] as Array<Array<number>>)[j]);
                        sumX += coordinates[i][j][0];
                        sumY += coordinates[i][j][1];
                        coordLen++;
                    }
                }
                break;
            }
            case 'MultiPolygon': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    for (let j = 0, len1 = coordinates[i].length; j < len1; j++) {
                        for (let m = 0, len2 = coordinates[i][j].length; m < len2; m++) {
                            // coords.push(((coordinates[i] as Array<Array<Array<number>>>)[j])[m]);
                            sumX += coordinates[i][j][m][0];
                            sumY += coordinates[i][j][m][1];
                            coordLen++;
                        }
                    }
                }
                break;
            }
        }
        const x = sumX / coordLen, y = sumY / coordLen;
        if (out) {
            out.x = x;
            out.y = y;
            return out;
        }
        return new maptalks__namespace.Coordinate(x, y);
    }
    function spliteGeoJSONMulti(feature) {
        const type = getGeoJSONType(feature);
        if (!type || !feature.geometry) {
            return null;
        }
        const geometry = feature.geometry;
        const properties = feature.properties || {};
        const coordinates = geometry.coordinates;
        if (!coordinates) {
            return null;
        }
        const features = [];
        let fType;
        switch (type) {
            case 'MultiPoint': {
                fType = 'Point';
                break;
            }
            case 'MultiLineString': {
                fType = 'LineString';
                break;
            }
            case 'MultiPolygon': {
                fType = 'Polygon';
                break;
            }
        }
        if (fType) {
            for (let i = 0, len = coordinates.length; i < len; i++) {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: fType,
                        coordinates: coordinates[i]
                    },
                    properties
                });
            }
        }
        else {
            features.push(feature);
        }
        return features;
    }

    var GeoJSONUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isGeoJSON: isGeoJSON,
        isGeoJSONPolygon: isGeoJSONPolygon,
        isGeoJSONLine: isGeoJSONLine,
        isGeoJSONPoint: isGeoJSONPoint,
        isGeoJSONMulti: isGeoJSONMulti,
        getGeoJSONCoordinates: getGeoJSONCoordinates,
        getGeoJSONCenter: getGeoJSONCenter,
        spliteGeoJSONMulti: spliteGeoJSONMulti
    });

    /*!
     * poly-extrude v0.16.0
      */
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }

    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;

      _setPrototypeOf(subClass, superClass);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
      return _setPrototypeOf(o, p);
    }

    function earcut$3(data, holeIndices, dim) {
      if (dim === void 0) {
        dim = 2;
      }

      var hasHoles = holeIndices && holeIndices.length;
      var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
      var outerNode = linkedList$1(data, 0, outerLen, dim, true);
      var triangles = [];
      if (!outerNode || outerNode.next === outerNode.prev) return triangles;
      var minX, minY, invSize;
      if (hasHoles) outerNode = eliminateHoles$1(data, holeIndices, outerNode, dim); // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox

      if (data.length > 80 * dim) {
        minX = Infinity;
        minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;

        for (var i = dim; i < outerLen; i += dim) {
          var x = data[i];
          var y = data[i + 1];
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        } // minX, minY and invSize are later used to transform coords into integers for z-order calculation


        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 32767 / invSize : 0;
      }

      earcutLinked$1(outerNode, triangles, dim, minX, minY, invSize, 0);
      return triangles;
    } // create a circular doubly linked list from polygon points in the specified winding order

    function linkedList$1(data, start, end, dim, clockwise) {
      var last;

      if (clockwise === signedArea$1(data, start, end, dim) > 0) {
        for (var i = start; i < end; i += dim) {
          last = insertNode$1(i / dim | 0, data[i], data[i + 1], last);
        }
      } else {
        for (var _i = end - dim; _i >= start; _i -= dim) {
          last = insertNode$1(_i / dim | 0, data[_i], data[_i + 1], last);
        }
      }

      if (last && equals$1(last, last.next)) {
        removeNode$1(last);
        last = last.next;
      }

      return last;
    } // eliminate colinear or duplicate points


    function filterPoints$1(start, end) {
      if (!start) return start;
      if (!end) end = start;
      var p = start,
          again;

      do {
        again = false;

        if (!p.steiner && (equals$1(p, p.next) || area$2(p.prev, p, p.next) === 0)) {
          removeNode$1(p);
          p = end = p.prev;
          if (p === p.next) break;
          again = true;
        } else {
          p = p.next;
        }
      } while (again || p !== end);

      return end;
    } // main ear slicing loop which triangulates a polygon (given as a linked list)


    function earcutLinked$1(ear, triangles, dim, minX, minY, invSize, pass) {
      if (!ear) return; // interlink polygon nodes in z-order

      if (!pass && invSize) indexCurve$1(ear, minX, minY, invSize);
      var stop = ear; // iterate through ears, slicing them one by one

      while (ear.prev !== ear.next) {
        var prev = ear.prev;
        var next = ear.next;

        if (invSize ? isEarHashed$1(ear, minX, minY, invSize) : isEar$1(ear)) {
          triangles.push(prev.i, ear.i, next.i); // cut off the triangle

          removeNode$1(ear); // skipping the next vertex leads to less sliver triangles

          ear = next.next;
          stop = next.next;
          continue;
        }

        ear = next; // if we looped through the whole remaining polygon and can't find any more ears

        if (ear === stop) {
          // try filtering points and slicing again
          if (!pass) {
            earcutLinked$1(filterPoints$1(ear), triangles, dim, minX, minY, invSize, 1); // if this didn't work, try curing all small self-intersections locally
          } else if (pass === 1) {
            ear = cureLocalIntersections$1(filterPoints$1(ear), triangles);
            earcutLinked$1(ear, triangles, dim, minX, minY, invSize, 2); // as a last resort, try splitting the remaining polygon into two
          } else if (pass === 2) {
            splitEarcut$1(ear, triangles, dim, minX, minY, invSize);
          }

          break;
        }
      }
    } // check whether a polygon node forms a valid ear with adjacent nodes


    function isEar$1(ear) {
      var a = ear.prev,
          b = ear,
          c = ear.next;
      if (area$2(a, b, c) >= 0) return false; // reflex, can't be an ear
      // now make sure we don't have other points inside the potential ear

      var ax = a.x,
          bx = b.x,
          cx = c.x,
          ay = a.y,
          by = b.y,
          cy = c.y; // triangle bbox

      var x0 = Math.min(ax, bx, cx),
          y0 = Math.min(ay, by, cy),
          x1 = Math.max(ax, bx, cx),
          y1 = Math.max(ay, by, cy);
      var p = c.next;

      while (p !== a) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, p.x, p.y) && area$2(p.prev, p, p.next) >= 0) return false;
        p = p.next;
      }

      return true;
    }

    function isEarHashed$1(ear, minX, minY, invSize) {
      var a = ear.prev,
          b = ear,
          c = ear.next;
      if (area$2(a, b, c) >= 0) return false; // reflex, can't be an ear

      var ax = a.x,
          bx = b.x,
          cx = c.x,
          ay = a.y,
          by = b.y,
          cy = c.y; // triangle bbox

      var x0 = Math.min(ax, bx, cx),
          y0 = Math.min(ay, by, cy),
          x1 = Math.max(ax, bx, cx),
          y1 = Math.max(ay, by, cy); // z-order range for the current triangle bbox;

      var minZ = zOrder$1(x0, y0, minX, minY, invSize),
          maxZ = zOrder$1(x1, y1, minX, minY, invSize);
      var p = ear.prevZ,
          n = ear.nextZ; // look for points inside the triangle in both directions

      while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, p.x, p.y) && area$2(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, n.x, n.y) && area$2(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
      } // look for remaining points in decreasing z-order


      while (p && p.z >= minZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, p.x, p.y) && area$2(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
      } // look for remaining points in increasing z-order


      while (n && n.z <= maxZ) {
        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, n.x, n.y) && area$2(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
      }

      return true;
    } // go through all polygon nodes and cure small local self-intersections


    function cureLocalIntersections$1(start, triangles) {
      var p = start;

      do {
        var a = p.prev,
            b = p.next.next;

        if (!equals$1(a, b) && intersects$1(a, p, p.next, b) && locallyInside$1(a, b) && locallyInside$1(b, a)) {
          triangles.push(a.i, p.i, b.i); // remove two nodes involved

          removeNode$1(p);
          removeNode$1(p.next);
          p = start = b;
        }

        p = p.next;
      } while (p !== start);

      return filterPoints$1(p);
    } // try splitting polygon into two and triangulate them independently


    function splitEarcut$1(start, triangles, dim, minX, minY, invSize) {
      // look for a valid diagonal that divides the polygon into two
      var a = start;

      do {
        var b = a.next.next;

        while (b !== a.prev) {
          if (a.i !== b.i && isValidDiagonal$1(a, b)) {
            // split the polygon in two by the diagonal
            var c = splitPolygon$1(a, b); // filter colinear points around the cuts

            a = filterPoints$1(a, a.next);
            c = filterPoints$1(c, c.next); // run earcut on each half

            earcutLinked$1(a, triangles, dim, minX, minY, invSize, 0);
            earcutLinked$1(c, triangles, dim, minX, minY, invSize, 0);
            return;
          }

          b = b.next;
        }

        a = a.next;
      } while (a !== start);
    } // link every hole into the outer loop, producing a single-ring polygon without holes


    function eliminateHoles$1(data, holeIndices, outerNode, dim) {
      var queue = [];

      for (var i = 0, len = holeIndices.length; i < len; i++) {
        var start = holeIndices[i] * dim;
        var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        var list = linkedList$1(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost$1(list));
      }

      queue.sort(compareXYSlope); // process holes from left to right

      for (var _i2 = 0; _i2 < queue.length; _i2++) {
        outerNode = eliminateHole$1(queue[_i2], outerNode);
      }

      return outerNode;
    }

    function compareXYSlope(a, b) {
      var result = a.x - b.x; // when the left-most point of 2 holes meet at a vertex, sort the holes counterclockwise so that when we find
      // the bridge to the outer shell is always the point that they meet at.

      if (result === 0) {
        result = a.y - b.y;

        if (result === 0) {
          var aSlope = (a.next.y - a.y) / (a.next.x - a.x);
          var bSlope = (b.next.y - b.y) / (b.next.x - b.x);
          result = aSlope - bSlope;
        }
      }

      return result;
    } // find a bridge between vertices that connects hole with an outer ring and and link it


    function eliminateHole$1(hole, outerNode) {
      var bridge = findHoleBridge$1(hole, outerNode);

      if (!bridge) {
        return outerNode;
      }

      var bridgeReverse = splitPolygon$1(bridge, hole); // filter collinear points around the cuts

      filterPoints$1(bridgeReverse, bridgeReverse.next);
      return filterPoints$1(bridge, bridge.next);
    } // David Eberly's algorithm for finding a bridge between hole and outer polygon


    function findHoleBridge$1(hole, outerNode) {
      var p = outerNode;
      var hx = hole.x;
      var hy = hole.y;
      var qx = -Infinity;
      var m; // find a segment intersected by a ray from the hole's leftmost point to the left;
      // segment's endpoint with lesser x will be potential connection point
      // unless they intersect at a vertex, then choose the vertex

      if (equals$1(hole, p)) return p;

      do {
        if (equals$1(hole, p.next)) return p.next;else if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
          var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);

          if (x <= hx && x > qx) {
            qx = x;
            m = p.x < p.next.x ? p : p.next;
            if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
          }
        }
        p = p.next;
      } while (p !== outerNode);

      if (!m) return null; // look for points inside the triangle of hole point, segment intersection and endpoint;
      // if there are no points found, we have a valid connection;
      // otherwise choose the point of the minimum angle with the ray as connection point

      var stop = m;
      var mx = m.x;
      var my = m.y;
      var tanMin = Infinity;
      p = m;

      do {
        if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle$1(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
          var tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

          if (locallyInside$1(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector$1(m, p)))) {
            m = p;
            tanMin = tan;
          }
        }

        p = p.next;
      } while (p !== stop);

      return m;
    } // whether sector in vertex m contains sector in vertex p in the same coordinates


    function sectorContainsSector$1(m, p) {
      return area$2(m.prev, m, p.prev) < 0 && area$2(p.next, m, m.next) < 0;
    } // interlink polygon nodes in z-order


    function indexCurve$1(start, minX, minY, invSize) {
      var p = start;

      do {
        if (p.z === 0) p.z = zOrder$1(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
      } while (p !== start);

      p.prevZ.nextZ = null;
      p.prevZ = null;
      sortLinked$1(p);
    } // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html


    function sortLinked$1(list) {
      var numMerges;
      var inSize = 1;

      do {
        var p = list;
        var e = void 0;
        list = null;
        var tail = null;
        numMerges = 0;

        while (p) {
          numMerges++;
          var q = p;
          var pSize = 0;

          for (var i = 0; i < inSize; i++) {
            pSize++;
            q = q.nextZ;
            if (!q) break;
          }

          var qSize = inSize;

          while (pSize > 0 || qSize > 0 && q) {
            if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
              e = p;
              p = p.nextZ;
              pSize--;
            } else {
              e = q;
              q = q.nextZ;
              qSize--;
            }

            if (tail) tail.nextZ = e;else list = e;
            e.prevZ = tail;
            tail = e;
          }

          p = q;
        }

        tail.nextZ = null;
        inSize *= 2;
      } while (numMerges > 1);

      return list;
    } // z-order of a point given coords and inverse of the longer side of data bbox


    function zOrder$1(x, y, minX, minY, invSize) {
      // coords are transformed into non-negative 15-bit integer range
      x = (x - minX) * invSize | 0;
      y = (y - minY) * invSize | 0;
      x = (x | x << 8) & 0x00FF00FF;
      x = (x | x << 4) & 0x0F0F0F0F;
      x = (x | x << 2) & 0x33333333;
      x = (x | x << 1) & 0x55555555;
      y = (y | y << 8) & 0x00FF00FF;
      y = (y | y << 4) & 0x0F0F0F0F;
      y = (y | y << 2) & 0x33333333;
      y = (y | y << 1) & 0x55555555;
      return x | y << 1;
    } // find the leftmost node of a polygon ring


    function getLeftmost$1(start) {
      var p = start,
          leftmost = start;

      do {
        if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
        p = p.next;
      } while (p !== start);

      return leftmost;
    } // check if a point lies within a convex triangle


    function pointInTriangle$1(ax, ay, bx, by, cx, cy, px, py) {
      return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
    } // check if a point lies within a convex triangle but false if its equal to the first point of the triangle


    function pointInTriangleExceptFirst(ax, ay, bx, by, cx, cy, px, py) {
      return !(ax === px && ay === py) && pointInTriangle$1(ax, ay, bx, by, cx, cy, px, py);
    } // check if a diagonal between two polygon nodes is valid (lies in polygon interior)


    function isValidDiagonal$1(a, b) {
      return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon$1(a, b) && ( // dones't intersect other edges
      locallyInside$1(a, b) && locallyInside$1(b, a) && middleInside$1(a, b) && ( // locally visible
      area$2(a.prev, a, b.prev) || area$2(a, b.prev, b)) || // does not create opposite-facing sectors
      equals$1(a, b) && area$2(a.prev, a, a.next) > 0 && area$2(b.prev, b, b.next) > 0); // special zero-length case
    } // signed area of a triangle


    function area$2(p, q, r) {
      return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    } // check if two points are equal


    function equals$1(p1, p2) {
      return p1.x === p2.x && p1.y === p2.y;
    } // check if two segments intersect


    function intersects$1(p1, q1, p2, q2) {
      var o1 = sign$1(area$2(p1, q1, p2));
      var o2 = sign$1(area$2(p1, q1, q2));
      var o3 = sign$1(area$2(p2, q2, p1));
      var o4 = sign$1(area$2(p2, q2, q1));
      if (o1 !== o2 && o3 !== o4) return true; // general case

      if (o1 === 0 && onSegment$1(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1

      if (o2 === 0 && onSegment$1(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1

      if (o3 === 0 && onSegment$1(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2

      if (o4 === 0 && onSegment$1(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

      return false;
    } // for collinear points p, q, r, check if point q lies on segment pr


    function onSegment$1(p, q, r) {
      return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    function sign$1(num) {
      return num > 0 ? 1 : num < 0 ? -1 : 0;
    } // check if a polygon diagonal intersects any polygon segments


    function intersectsPolygon$1(a, b) {
      var p = a;

      do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects$1(p, p.next, a, b)) return true;
        p = p.next;
      } while (p !== a);

      return false;
    } // check if a polygon diagonal is locally inside the polygon


    function locallyInside$1(a, b) {
      return area$2(a.prev, a, a.next) < 0 ? area$2(a, b, a.next) >= 0 && area$2(a, a.prev, b) >= 0 : area$2(a, b, a.prev) < 0 || area$2(a, a.next, b) < 0;
    } // check if the middle point of a polygon diagonal is inside the polygon


    function middleInside$1(a, b) {
      var p = a;
      var inside = false;
      var px = (a.x + b.x) / 2;
      var py = (a.y + b.y) / 2;

      do {
        if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
        p = p.next;
      } while (p !== a);

      return inside;
    } // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring


    function splitPolygon$1(a, b) {
      var a2 = createNode(a.i, a.x, a.y),
          b2 = createNode(b.i, b.x, b.y),
          an = a.next,
          bp = b.prev;
      a.next = b;
      b.prev = a;
      a2.next = an;
      an.prev = a2;
      b2.next = a2;
      a2.prev = b2;
      bp.next = b2;
      b2.prev = bp;
      return b2;
    } // create a node and optionally link it with previous one (in a circular doubly linked list)


    function insertNode$1(i, x, y, last) {
      var p = createNode(i, x, y);

      if (!last) {
        p.prev = p;
        p.next = p;
      } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
      }

      return p;
    }

    function removeNode$1(p) {
      p.next.prev = p.prev;
      p.prev.next = p.next;
      if (p.prevZ) p.prevZ.nextZ = p.nextZ;
      if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function createNode(i, x, y) {
      return {
        i: i,
        // vertex index in coordinates array
        x: x,
        y: y,
        // vertex coordinates
        prev: null,
        // previous and next vertex nodes in a polygon ring
        next: null,
        z: 0,
        // z-order curve value
        prevZ: null,
        // previous and next nodes in z-order
        nextZ: null,
        steiner: false // indicates whether this is a steiner point

      };
    } // return a percentage difference between the polygon area and its triangulation area;

    function signedArea$1(data, start, end, dim) {
      var sum = 0;

      for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
      }

      return sum;
    } // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts

    // code copy from https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js
    // import { clamp } from './MathUtils.js';
    var Quaternion = /*#__PURE__*/function () {
      function Quaternion(x, y, z, w) {
        if (x === void 0) {
          x = 0;
        }

        if (y === void 0) {
          y = 0;
        }

        if (z === void 0) {
          z = 0;
        }

        if (w === void 0) {
          w = 1;
        }

        this.isQuaternion = true;
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
      }

      Quaternion.slerpFlat = function slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
        // fuzz-free, array-based Quaternion SLERP operation
        var x0 = src0[srcOffset0 + 0],
            y0 = src0[srcOffset0 + 1],
            z0 = src0[srcOffset0 + 2],
            w0 = src0[srcOffset0 + 3];
        var x1 = src1[srcOffset1 + 0],
            y1 = src1[srcOffset1 + 1],
            z1 = src1[srcOffset1 + 2],
            w1 = src1[srcOffset1 + 3];

        if (t === 0) {
          dst[dstOffset + 0] = x0;
          dst[dstOffset + 1] = y0;
          dst[dstOffset + 2] = z0;
          dst[dstOffset + 3] = w0;
          return;
        }

        if (t === 1) {
          dst[dstOffset + 0] = x1;
          dst[dstOffset + 1] = y1;
          dst[dstOffset + 2] = z1;
          dst[dstOffset + 3] = w1;
          return;
        }

        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
          var s = 1 - t;
          var cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
              dir = cos >= 0 ? 1 : -1,
              sqrSin = 1 - cos * cos; // Skip the Slerp for tiny steps to avoid numeric problems:

          if (sqrSin > Number.EPSILON) {
            var sin = Math.sqrt(sqrSin),
                len = Math.atan2(sin, cos * dir);
            s = Math.sin(s * len) / sin;
            t = Math.sin(t * len) / sin;
          }

          var tDir = t * dir;
          x0 = x0 * s + x1 * tDir;
          y0 = y0 * s + y1 * tDir;
          z0 = z0 * s + z1 * tDir;
          w0 = w0 * s + w1 * tDir; // Normalize in case we just did a lerp:

          if (s === 1 - t) {
            var f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
            x0 *= f;
            y0 *= f;
            z0 *= f;
            w0 *= f;
          }
        }

        dst[dstOffset] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
      };

      Quaternion.multiplyQuaternionsFlat = function multiplyQuaternionsFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1) {
        var x0 = src0[srcOffset0];
        var y0 = src0[srcOffset0 + 1];
        var z0 = src0[srcOffset0 + 2];
        var w0 = src0[srcOffset0 + 3];
        var x1 = src1[srcOffset1];
        var y1 = src1[srcOffset1 + 1];
        var z1 = src1[srcOffset1 + 2];
        var w1 = src1[srcOffset1 + 3];
        dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
        dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
        dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
        dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
        return dst;
      };

      var _proto = Quaternion.prototype;

      _proto.set = function set(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;

        this._onChangeCallback();

        return this;
      };

      _proto.clone = function clone() {
        return new this.constructor(this._x, this._y, this._z, this._w);
      };

      _proto.copy = function copy(quaternion) {
        this._x = quaternion.x;
        this._y = quaternion.y;
        this._z = quaternion.z;
        this._w = quaternion.w;

        this._onChangeCallback();

        return this;
      };

      _proto.setFromEuler = function setFromEuler(euler, update) {
        if (update === void 0) {
          update = true;
        }

        var x = euler._x,
            y = euler._y,
            z = euler._z,
            order = euler._order; // http://www.mathworks.com/matlabcentral/fileexchange/
        // 20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        // content/SpinCalc.m

        var cos = Math.cos;
        var sin = Math.sin;
        var c1 = cos(x / 2);
        var c2 = cos(y / 2);
        var c3 = cos(z / 2);
        var s1 = sin(x / 2);
        var s2 = sin(y / 2);
        var s3 = sin(z / 2);

        switch (order) {
          case 'XYZ':
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

          case 'YXZ':
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

          case 'ZXY':
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

          case 'ZYX':
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

          case 'YZX':
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

          case 'XZY':
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

          default:
            console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order);
        }

        if (update === true) this._onChangeCallback();
        return this;
      };

      _proto.setFromAxisAngle = function setFromAxisAngle(axis, angle) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        // assumes axis is normalized
        var halfAngle = angle / 2,
            s = Math.sin(halfAngle);
        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos(halfAngle);

        this._onChangeCallback();

        return this;
      };

      _proto.setFromRotationMatrix = function setFromRotationMatrix(m) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        var te = m.elements,
            m11 = te[0],
            m12 = te[4],
            m13 = te[8],
            m21 = te[1],
            m22 = te[5],
            m23 = te[9],
            m31 = te[2],
            m32 = te[6],
            m33 = te[10],
            trace = m11 + m22 + m33;

        if (trace > 0) {
          var s = 0.5 / Math.sqrt(trace + 1.0);
          this._w = 0.25 / s;
          this._x = (m32 - m23) * s;
          this._y = (m13 - m31) * s;
          this._z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
          var _s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

          this._w = (m32 - m23) / _s;
          this._x = 0.25 * _s;
          this._y = (m12 + m21) / _s;
          this._z = (m13 + m31) / _s;
        } else if (m22 > m33) {
          var _s2 = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

          this._w = (m13 - m31) / _s2;
          this._x = (m12 + m21) / _s2;
          this._y = 0.25 * _s2;
          this._z = (m23 + m32) / _s2;
        } else {
          var _s3 = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

          this._w = (m21 - m12) / _s3;
          this._x = (m13 + m31) / _s3;
          this._y = (m23 + m32) / _s3;
          this._z = 0.25 * _s3;
        }

        this._onChangeCallback();

        return this;
      };

      _proto.setFromUnitVectors = function setFromUnitVectors(vFrom, vTo) {
        // assumes direction vectors vFrom and vTo are normalized
        var r = vFrom.dot(vTo) + 1;

        if (r < Number.EPSILON) {
          // vFrom and vTo point in opposite directions
          r = 0;

          if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
            this._x = -vFrom.y;
            this._y = vFrom.x;
            this._z = 0;
            this._w = r;
          } else {
            this._x = 0;
            this._y = -vFrom.z;
            this._z = vFrom.y;
            this._w = r;
          }
        } else {
          // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
          this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
          this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
          this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
          this._w = r;
        }

        return this.normalize();
      } // angleTo(q) {
      //     return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
      // }
      ;

      _proto.rotateTowards = function rotateTowards(q, step) {
        var angle = this.angleTo(q);
        if (angle === 0) return this;
        var t = Math.min(1, step / angle);
        this.slerp(q, t);
        return this;
      };

      _proto.identity = function identity() {
        return this.set(0, 0, 0, 1);
      };

      _proto.invert = function invert() {
        // quaternion is assumed to have unit length
        return this.conjugate();
      };

      _proto.conjugate = function conjugate() {
        this._x *= -1;
        this._y *= -1;
        this._z *= -1;

        this._onChangeCallback();

        return this;
      };

      _proto.dot = function dot(v) {
        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
      };

      _proto.lengthSq = function lengthSq() {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
      };

      _proto.length = function length() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
      };

      _proto.normalize = function normalize() {
        var l = this.length();

        if (l === 0) {
          this._x = 0;
          this._y = 0;
          this._z = 0;
          this._w = 1;
        } else {
          l = 1 / l;
          this._x = this._x * l;
          this._y = this._y * l;
          this._z = this._z * l;
          this._w = this._w * l;
        }

        this._onChangeCallback();

        return this;
      };

      _proto.multiply = function multiply(q) {
        return this.multiplyQuaternions(this, q);
      };

      _proto.premultiply = function premultiply(q) {
        return this.multiplyQuaternions(q, this);
      };

      _proto.multiplyQuaternions = function multiplyQuaternions(a, b) {
        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
        var qax = a._x,
            qay = a._y,
            qaz = a._z,
            qaw = a._w;
        var qbx = b._x,
            qby = b._y,
            qbz = b._z,
            qbw = b._w;
        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        this._onChangeCallback();

        return this;
      };

      _proto.slerp = function slerp(qb, t) {
        if (t === 0) return this;
        if (t === 1) return this.copy(qb);
        var x = this._x,
            y = this._y,
            z = this._z,
            w = this._w; // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

        var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        if (cosHalfTheta < 0) {
          this._w = -qb._w;
          this._x = -qb._x;
          this._y = -qb._y;
          this._z = -qb._z;
          cosHalfTheta = -cosHalfTheta;
        } else {
          this.copy(qb);
        }

        if (cosHalfTheta >= 1.0) {
          this._w = w;
          this._x = x;
          this._y = y;
          this._z = z;
          return this;
        }

        var sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {
          var s = 1 - t;
          this._w = s * w + t * this._w;
          this._x = s * x + t * this._x;
          this._y = s * y + t * this._y;
          this._z = s * z + t * this._z;
          this.normalize(); // normalize calls _onChangeCallback()

          return this;
        }

        var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        this._w = w * ratioA + this._w * ratioB;
        this._x = x * ratioA + this._x * ratioB;
        this._y = y * ratioA + this._y * ratioB;
        this._z = z * ratioA + this._z * ratioB;

        this._onChangeCallback();

        return this;
      };

      _proto.slerpQuaternions = function slerpQuaternions(qa, qb, t) {
        return this.copy(qa).slerp(qb, t);
      };

      _proto.random = function random() {
        // sets this quaternion to a uniform random unit quaternnion
        // Ken Shoemake
        // Uniform random rotations
        // D. Kirk, editor, Graphics Gems III, pages 124-132. Academic Press, New York, 1992.
        var theta1 = 2 * Math.PI * Math.random();
        var theta2 = 2 * Math.PI * Math.random();
        var x0 = Math.random();
        var r1 = Math.sqrt(1 - x0);
        var r2 = Math.sqrt(x0);
        return this.set(r1 * Math.sin(theta1), r1 * Math.cos(theta1), r2 * Math.sin(theta2), r2 * Math.cos(theta2));
      };

      _proto.equals = function equals(quaternion) {
        return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
      };

      _proto.fromArray = function fromArray(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }

        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2];
        this._w = array[offset + 3];

        this._onChangeCallback();

        return this;
      };

      _proto.toArray = function toArray(array, offset) {
        if (array === void 0) {
          array = [];
        }

        if (offset === void 0) {
          offset = 0;
        }

        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._w;
        return array;
      };

      _proto.fromBufferAttribute = function fromBufferAttribute(attribute, index) {
        this._x = attribute.getX(index);
        this._y = attribute.getY(index);
        this._z = attribute.getZ(index);
        this._w = attribute.getW(index);

        this._onChangeCallback();

        return this;
      };

      _proto.toJSON = function toJSON() {
        return this.toArray();
      };

      _proto._onChange = function _onChange(callback) {
        this._onChangeCallback = callback;
        return this;
      };

      _proto._onChangeCallback = function _onChangeCallback() {} // * [Symbol.iterator]() {
      //     yield this._x;
      //     yield this._y;
      //     yield this._z;
      //     yield this._w;
      // }
      ;

      _createClass(Quaternion, [{
        key: "x",
        get: function get() {
          return this._x;
        },
        set: function set(value) {
          this._x = value;

          this._onChangeCallback();
        }
      }, {
        key: "y",
        get: function get() {
          return this._y;
        },
        set: function set(value) {
          this._y = value;

          this._onChangeCallback();
        }
      }, {
        key: "z",
        get: function get() {
          return this._z;
        },
        set: function set(value) {
          this._z = value;

          this._onChangeCallback();
        }
      }, {
        key: "w",
        get: function get() {
          return this._w;
        },
        set: function set(value) {
          this._w = value;

          this._onChangeCallback();
        }
      }]);

      return Quaternion;
    }();

    // import * as MathUtils from './MathUtils.js';

    var _quaternion = new Quaternion();

    var Vector3 = /*#__PURE__*/function () {
      function Vector3(x, y, z) {
        if (x === void 0) {
          x = 0;
        }

        if (y === void 0) {
          y = 0;
        }

        if (z === void 0) {
          z = 0;
        }

        this.x = x;
        this.y = y;
        this.z = z;
      }

      var _proto = Vector3.prototype;

      _proto.set = function set(x, y, z) {
        if (z === undefined) z = this.z; // sprite.scale.set(x,y)

        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      } // setScalar(scalar) {
      //     this.x = scalar;
      //     this.y = scalar;
      //     this.z = scalar;
      //     return this;
      // }
      // setX(x) {
      //     this.x = x;
      //     return this;
      // }
      // setY(y) {
      //     this.y = y;
      //     return this;
      // }
      // setZ(z) {
      //     this.z = z;
      //     return this;
      // }
      // setComponent(index, value) {
      //     switch (index) {
      //         case 0: this.x = value; break;
      //         case 1: this.y = value; break;
      //         case 2: this.z = value; break;
      //         default: throw new Error('index is out of range: ' + index);
      //     }
      //     return this;
      // }
      // getComponent(index) {
      //     switch (index) {
      //         case 0: return this.x;
      //         case 1: return this.y;
      //         case 2: return this.z;
      //         default: throw new Error('index is out of range: ' + index);
      //     }
      // }
      ;

      _proto.clone = function clone() {
        return new this.constructor(this.x, this.y, this.z);
      };

      _proto.copy = function copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
      };

      _proto.add = function add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
      };

      _proto.addScalar = function addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
      };

      _proto.addVectors = function addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
      };

      _proto.addScaledVector = function addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
      };

      _proto.sub = function sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
      };

      _proto.subScalar = function subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
      };

      _proto.subVectors = function subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
      };

      _proto.multiply = function multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
      };

      _proto.multiplyScalar = function multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
      };

      _proto.multiplyVectors = function multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
      } // applyEuler(euler) {
      //     return this.applyQuaternion(_quaternion.setFromEuler(euler));
      // }
      ;

      _proto.applyAxisAngle = function applyAxisAngle(axis, angle) {
        return this.applyQuaternion(_quaternion.setFromAxisAngle(axis, angle));
      } // applyMatrix3(m) {
      //     const x = this.x, y = this.y, z = this.z;
      //     const e = m.elements;
      //     this.x = e[0] * x + e[3] * y + e[6] * z;
      //     this.y = e[1] * x + e[4] * y + e[7] * z;
      //     this.z = e[2] * x + e[5] * y + e[8] * z;
      //     return this;
      // }
      // applyNormalMatrix(m) {
      //     return this.applyMatrix3(m).normalize();
      // }
      ;

      _proto.applyMatrix4 = function applyMatrix4(m) {
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        return this;
      };

      _proto.applyQuaternion = function applyQuaternion(q) {
        var x = this.x,
            y = this.y,
            z = this.z;
        var qx = q.x,
            qy = q.y,
            qz = q.z,
            qw = q.w; // calculate quat * vector

        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
      } // project(camera) {
      //     return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
      // }
      // unproject(camera) {
      //     return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
      // }
      // transformDirection(m) {
      //     // input: THREE.Matrix4 affine matrix
      //     // vector interpreted as a direction
      //     const x = this.x, y = this.y, z = this.z;
      //     const e = m.elements;
      //     this.x = e[0] * x + e[4] * y + e[8] * z;
      //     this.y = e[1] * x + e[5] * y + e[9] * z;
      //     this.z = e[2] * x + e[6] * y + e[10] * z;
      //     return this.normalize();
      // }
      ;

      _proto.divide = function divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
      };

      _proto.divideScalar = function divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
      };

      _proto.min = function min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
      };

      _proto.max = function max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
      };

      _proto.clamp = function clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
      };

      _proto.clampScalar = function clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));
        return this;
      };

      _proto.clampLength = function clampLength(min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
      } // floor() {
      //     this.x = Math.floor(this.x);
      //     this.y = Math.floor(this.y);
      //     this.z = Math.floor(this.z);
      //     return this;
      // }
      // ceil() {
      //     this.x = Math.ceil(this.x);
      //     this.y = Math.ceil(this.y);
      //     this.z = Math.ceil(this.z);
      //     return this;
      // }
      // round() {
      //     this.x = Math.round(this.x);
      //     this.y = Math.round(this.y);
      //     this.z = Math.round(this.z);
      //     return this;
      // }
      // roundToZero() {
      //     this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
      //     this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
      //     this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
      //     return this;
      // }
      // negate() {
      //     this.x = -this.x;
      //     this.y = -this.y;
      //     this.z = -this.z;
      //     return this;
      // }
      ;

      _proto.dot = function dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
      } // TODO lengthSquared?
      ;

      _proto.lengthSq = function lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      };

      _proto.length = function length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      } // manhattanLength() {
      //     return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
      // }
      ;

      _proto.normalize = function normalize() {
        return this.divideScalar(this.length() || 1);
      };

      _proto.setLength = function setLength(length) {
        return this.normalize().multiplyScalar(length);
      };

      _proto.lerp = function lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
      };

      _proto.lerpVectors = function lerpVectors(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        this.z = v1.z + (v2.z - v1.z) * alpha;
        return this;
      };

      _proto.cross = function cross(v) {
        return this.crossVectors(this, v);
      };

      _proto.crossVectors = function crossVectors(a, b) {
        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
      } // projectOnVector(v) {
      //     const denominator = v.lengthSq();
      //     if (denominator === 0) return this.set(0, 0, 0);
      //     const scalar = v.dot(this) / denominator;
      //     return this.copy(v).multiplyScalar(scalar);
      // }
      // projectOnPlane(planeNormal) {
      //     _vector.copy(this).projectOnVector(planeNormal);
      //     return this.sub(_vector);
      // }
      // reflect(normal) {
      //     // reflect incident vector off plane orthogonal to normal
      //     // normal is assumed to have unit length
      //     return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
      // }
      // angleTo(v) {
      //     const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
      //     if (denominator === 0) return Math.PI / 2;
      //     const theta = this.dot(v) / denominator;
      //     // clamp, to handle numerical problems
      //     return Math.acos(MathUtils.clamp(theta, -1, 1));
      // }
      ;

      _proto.distanceTo = function distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
      } // distanceToSquared(v) {
      //     const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
      //     return dx * dx + dy * dy + dz * dz;
      // }
      // manhattanDistanceTo(v) {
      //     return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
      // }
      // setFromSpherical(s) {
      //     return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
      // }
      // setFromSphericalCoords(radius, phi, theta) {
      //     const sinPhiRadius = Math.sin(phi) * radius;
      //     this.x = sinPhiRadius * Math.sin(theta);
      //     this.y = Math.cos(phi) * radius;
      //     this.z = sinPhiRadius * Math.cos(theta);
      //     return this;
      // }
      // setFromCylindrical(c) {
      //     return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
      // }
      // setFromCylindricalCoords(radius, theta, y) {
      //     this.x = radius * Math.sin(theta);
      //     this.y = y;
      //     this.z = radius * Math.cos(theta);
      //     return this;
      // }
      // setFromMatrixPosition(m) {
      //     const e = m.elements;
      //     this.x = e[12];
      //     this.y = e[13];
      //     this.z = e[14];
      //     return this;
      // }
      // setFromMatrixScale(m) {
      //     const sx = this.setFromMatrixColumn(m, 0).length();
      //     const sy = this.setFromMatrixColumn(m, 1).length();
      //     const sz = this.setFromMatrixColumn(m, 2).length();
      //     this.x = sx;
      //     this.y = sy;
      //     this.z = sz;
      //     return this;
      // }
      // setFromMatrixColumn(m, index) {
      //     return this.fromArray(m.elements, index * 4);
      // }
      // setFromMatrix3Column(m, index) {
      //     return this.fromArray(m.elements, index * 3);
      // }
      // setFromEuler(e) {
      //     this.x = e._x;
      //     this.y = e._y;
      //     this.z = e._z;
      //     return this;
      // }
      // setFromColor(c) {
      //     this.x = c.r;
      //     this.y = c.g;
      //     this.z = c.b;
      //     return this;
      // }
      ;

      _proto.equals = function equals(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z;
      };

      _proto.fromArray = function fromArray(array, offset) {
        if (offset === void 0) {
          offset = 0;
        }

        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
      } // toArray(array = [], offset = 0) {
      //     array[offset] = this.x;
      //     array[offset + 1] = this.y;
      //     array[offset + 2] = this.z;
      //     return array;
      // }
      // fromBufferAttribute(attribute, index) {
      //     this.x = attribute.getX(index);
      //     this.y = attribute.getY(index);
      //     this.z = attribute.getZ(index);
      //     return this;
      // }
      ;

      _proto.random = function random() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        return this;
      } // randomDirection() {
      //     // Derived from https://mathworld.wolfram.com/SpherePointPicking.html
      //     const u = (Math.random() - 0.5) * 2;
      //     const t = Math.random() * Math.PI * 2;
      //     const f = Math.sqrt(1 - u ** 2);
      //     this.x = f * Math.cos(t);
      //     this.y = f * Math.sin(t);
      //     this.z = u;
      //     return this;
      // }
      ;

      return Vector3;
    }();

    /**
     * https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-clockwise/index.ts
     * @param {*} ring
     * @returns
     */
    function isClockwise(ring) {
        let sum = 0;
        let i = 1;
        let prev;
        let cur;
        const len = ring.length;
        while (i < len) {
            prev = cur || ring[0];
            cur = ring[i];
            sum += (cur[0] - prev[0]) * (cur[1] + prev[1]);
            i++;
        }
        return sum > 0;
    }
    function v3Sub$1(out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];
        out[2] = v1[2] - v2[2];
        return out;
    }
    function v3Normalize$1(out, v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const d = Math.sqrt(x * x + y * y + z * z) || 1;
        out[0] = x / d;
        out[1] = y / d;
        out[2] = z / d;
        return out;
    }
    function v3Cross$1(out, v1, v2) {
        const ax = v1[0], ay = v1[1], az = v1[2], bx = v2[0], by = v2[1], bz = v2[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }
    function generateNormal$1(indices, position) {
        function v3Set(p, a, b, c) {
            p[0] = a;
            p[1] = b;
            p[2] = c;
        }
        const p1 = [];
        const p2 = [];
        const p3 = [];
        const v21 = [];
        const v32 = [];
        const n = [];
        const len = indices.length;
        const normals = new Float32Array(position.length);
        let f = 0;
        while (f < len) {
            // const i1 = indices[f++] * 3;
            // const i2 = indices[f++] * 3;
            // const i3 = indices[f++] * 3;
            // const i1 = indices[f];
            // const i2 = indices[f + 1];
            // const i3 = indices[f + 2];
            const a = indices[f], b = indices[f + 1], c = indices[f + 2];
            const i1 = a * 3, i2 = b * 3, i3 = c * 3;
            v3Set(p1, position[i1], position[i1 + 1], position[i1 + 2]);
            v3Set(p2, position[i2], position[i2 + 1], position[i2 + 2]);
            v3Set(p3, position[i3], position[i3 + 1], position[i3 + 2]);
            v3Sub$1(v32, p3, p2);
            v3Sub$1(v21, p1, p2);
            v3Cross$1(n, v32, v21);
            // Already be weighted by the triangle area
            for (let i = 0; i < 3; i++) {
                normals[i1 + i] += n[i];
                normals[i2 + i] += n[i];
                normals[i3 + i] += n[i];
            }
            f += 3;
        }
        let i = 0;
        const l = normals.length;
        while (i < l) {
            v3Set(n, normals[i], normals[i + 1], normals[i + 2]);
            v3Normalize$1(n, n);
            normals[i] = n[0] || 0;
            normals[i + 1] = n[1] || 0;
            normals[i + 2] = n[2] || 0;
            i += 3;
        }
        return normals;
    }
    function merge(results) {
        if (results.length === 1) {
            const result = {
                position: results[0].position,
                normal: results[0].normal,
                uv: results[0].uv,
                indices: results[0].indices,
                results
            };
            return result;
        }
        let plen = 0, ilen = 0;
        for (let i = 0, len = results.length; i < len; i++) {
            const { position, indices } = results[i];
            plen += position.length;
            ilen += indices.length;
        }
        const result = {
            position: new Float32Array(plen),
            normal: new Float32Array(plen),
            uv: new Float32Array(plen / 3 * 2),
            indices: new Uint32Array(ilen),
            results
        };
        let pOffset = 0, pCount = 0, iIdx = 0, uvOffset = 0;
        for (let i = 0, len = results.length; i < len; i++) {
            const { position, indices, normal, uv } = results[i];
            result.position.set(position, pOffset);
            result.normal.set(normal, pOffset);
            result.uv.set(uv, uvOffset);
            let j = 0;
            const len1 = indices.length;
            while (j < len1) {
                const pIndex = indices[j] + pCount;
                result.indices[iIdx] = pIndex;
                iIdx++;
                j++;
            }
            uvOffset += uv.length;
            pOffset += position.length;
            pCount += position.length / 3;
        }
        return result;
    }
    function radToDeg(rad) {
        return rad * 180 / Math.PI;
    }
    function degToRad(angle) {
        return angle / 180 * Math.PI;
    }
    // https://github.com/mrdoob/three.js/blob/16f13e3b07e31d0e9a00df7c3366bbe0e464588c/src/geometries/ExtrudeGeometry.js?_pjax=%23js-repo-pjax-container#L736
    function generateSideWallUV(uvs, vertices, indexA, indexB, indexC, indexD) {
        const idx1 = indexA * 3, idx2 = indexB * 3, idx3 = indexC * 3, idx4 = indexD * 3;
        const a_x = vertices[idx1];
        const a_y = vertices[idx1 + 1];
        const a_z = vertices[idx1 + 2];
        const b_x = vertices[idx2];
        const b_y = vertices[idx2 + 1];
        const b_z = vertices[idx2 + 2];
        const c_x = vertices[idx3];
        const c_y = vertices[idx3 + 1];
        const c_z = vertices[idx3 + 2];
        const d_x = vertices[idx4];
        const d_y = vertices[idx4 + 1];
        const d_z = vertices[idx4 + 2];
        let uIndex = uvs.length - 1;
        if (Math.abs(a_y - b_y) < Math.abs(a_x - b_x)) {
            uvs[++uIndex] = a_x;
            uvs[++uIndex] = 1 - a_z;
            uvs[++uIndex] = b_x;
            uvs[++uIndex] = 1 - b_z;
            uvs[++uIndex] = c_x;
            uvs[++uIndex] = 1 - c_z;
            uvs[++uIndex] = d_x;
            uvs[++uIndex] = 1 - d_z;
            // uvs.push(a_x, 1 - a_z);
            // uvs.push(b_x, 1 - b_z);
            // uvs.push(c_x, 1 - c_z);
            // uvs.push(d_x, 1 - d_z);
        }
        else {
            uvs[++uIndex] = a_y;
            uvs[++uIndex] = 1 - a_z;
            uvs[++uIndex] = b_y;
            uvs[++uIndex] = 1 - b_z;
            uvs[++uIndex] = c_y;
            uvs[++uIndex] = 1 - c_z;
            uvs[++uIndex] = d_y;
            uvs[++uIndex] = 1 - d_z;
            // uvs.push(a_y, 1 - a_z);
            // uvs.push(b_y, 1 - b_z);
            // uvs.push(c_y, 1 - c_z);
            // uvs.push(d_y, 1 - d_z);
        }
    }
    function line2Vectors(line) {
        const points = [];
        for (let i = 0, len = line.length; i < len; i++) {
            const p = line[i];
            const [x, y, z] = p;
            const v = new Vector3(x, y, z || 0);
            points[i] = v;
        }
        return points;
    }
    function calLineDistance(line) {
        let distance = 0;
        for (let i = 0, len = line.length; i < len; i++) {
            const p1 = line[i], p2 = line[i + 1];
            if (i === 0) {
                p1.distance = 0;
            }
            if (p1 && p2) {
                const [x1, y1, z1] = p1;
                const [x2, y2, z2] = p2;
                const dx = x1 - x2, dy = y1 - y2, dz = (z1 || 0) - (z2 || 0);
                const dis = Math.sqrt(dx * dx + dy * dy + dz * dz);
                distance += dis;
                p2.distance = distance;
            }
        }
        return distance;
    }

    function extrudePolygons(polygons, options) {
        options = Object.assign({}, { depth: 2, top: true }, options);
        const results = polygons.map(polygon => {
            for (let i = 0, len = polygon.length; i < len; i++) {
                const ring = polygon[i];
                validateRing(ring);
                if (i === 0) {
                    if (!isClockwise(ring)) {
                        polygon[i] = ring.reverse();
                    }
                }
                else if (isClockwise(ring)) {
                    polygon[i] = ring.reverse();
                }
                if (isClosedRing(ring)) {
                    ring.splice(ring.length - 1, 1);
                }
            }
            const result = flatVertices(polygon, options);
            result.polygon = polygon;
            const triangles = earcut$3(result.flatVertices, result.holes, 2);
            generateTopAndBottom$1(result, triangles, options);
            generateSides$1(result, options);
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.indices);
            result.uv = new Float32Array(result.uv);
            result.normal = generateNormal$1(result.indices, result.position);
            return result;
        });
        const result = merge(results);
        result.polygons = polygons;
        return result;
    }
    function generateTopAndBottom$1(result, triangles, options) {
        const indices = [];
        const { count } = result;
        const top = options.top;
        for (let i = 0, len = triangles.length; i < len; i += 3) {
            // top
            const a = triangles[i], b = triangles[i + 1], c = triangles[i + 2];
            if (top) {
                indices[i] = a;
                indices[i + 1] = b;
                indices[i + 2] = c;
            }
            // bottom
            let idx = len + i;
            const a1 = count + a, b1 = count + b, c1 = count + c;
            if (!top) {
                idx = i;
            }
            indices[idx] = a1;
            indices[idx + 1] = b1;
            indices[idx + 2] = c1;
        }
        result.indices = indices;
    }
    function generateSides$1(result, options) {
        const { points, indices, polygon, uv } = result;
        const depth = options.depth;
        let pIndex = points.length - 1;
        let iIndex = indices.length - 1;
        for (let i = 0, len = polygon.length; i < len; i++) {
            const ring = polygon[i];
            let j = 0;
            const len1 = ring.length;
            while (j < len1) {
                const v1 = ring[j];
                let v2 = ring[j + 1];
                if (j === len1 - 1) {
                    v2 = ring[0];
                }
                const idx = points.length / 3;
                const x1 = v1[0], y1 = v1[1], z1 = v1[2] || 0, x2 = v2[0], y2 = v2[1], z2 = v2[2] || 0;
                points[++pIndex] = x1;
                points[++pIndex] = y1;
                points[++pIndex] = z1 + depth;
                points[++pIndex] = x2;
                points[++pIndex] = y2;
                points[++pIndex] = z2 + depth;
                points[++pIndex] = x1;
                points[++pIndex] = y1;
                points[++pIndex] = z1;
                points[++pIndex] = x2;
                points[++pIndex] = y2;
                points[++pIndex] = z2;
                // points.push(x1, y1, z, x2, y2, z, x1, y1, 0, x2, y2, 0);
                const a = idx + 2, b = idx + 3, c = idx, d = idx + 1;
                // points.push(p3, p4, p1, p2);
                // index.push(a, c, b, c, d, b);
                indices[++iIndex] = a;
                indices[++iIndex] = c;
                indices[++iIndex] = b;
                indices[++iIndex] = c;
                indices[++iIndex] = d;
                indices[++iIndex] = b;
                // index.push(c, d, b);
                generateSideWallUV(uv, points, a, b, c, d);
                j++;
            }
        }
    }
    function calPolygonPointsCount(polygon) {
        let count = 0;
        let i = 0;
        const len = polygon.length;
        while (i < len) {
            count += (polygon[i].length);
            i++;
        }
        return count;
    }
    function flatVertices(polygon, options) {
        const count = calPolygonPointsCount(polygon);
        const len = polygon.length;
        const holes = [], flatVertices = new Float32Array(count * 2), points = [], uv = [];
        const pOffset = count * 3, uOffset = count * 2;
        const depth = options.depth;
        let idx0 = 0, idx1 = 0, idx2 = 0;
        for (let i = 0; i < len; i++) {
            const ring = polygon[i];
            if (i > 0) {
                holes.push(idx0 / 2);
            }
            let j = 0;
            const len1 = ring.length;
            while (j < len1) {
                const c = ring[j];
                const x = c[0], y = c[1], z = c[2] || 0;
                flatVertices[idx0++] = x;
                flatVertices[idx0++] = y;
                // top vertices
                points[idx1] = x;
                points[idx1 + 1] = y;
                points[idx1 + 2] = depth + z;
                // bottom vertices
                points[pOffset + idx1] = x;
                points[pOffset + idx1 + 1] = y;
                points[pOffset + idx1 + 2] = z;
                uv[idx2] = x;
                uv[idx2 + 1] = y;
                uv[uOffset + idx2] = x;
                uv[uOffset + idx2 + 1] = y;
                idx1 += 3;
                idx2 += 2;
                j++;
            }
        }
        return {
            flatVertices,
            holes,
            points,
            count,
            uv
        };
    }
    function validateRing(ring) {
        if (!isClosedRing(ring)) {
            ring.push(ring[0]);
        }
    }
    function isClosedRing(ring) {
        const len = ring.length;
        const [x1, y1] = ring[0], [x2, y2] = ring[len - 1];
        return (x1 === x2 && y1 === y2);
    }

    function checkOptions(options) {
        options.lineWidth = Math.max(0, options.lineWidth);
        options.depth = Math.max(0, options.depth);
        options.sideDepth = Math.max(0, options.sideDepth);
    }
    function extrudePolylines(lines, options) {
        options = Object.assign({}, { depth: 2, lineWidth: 1, bottomStickGround: false, pathUV: false }, options);
        checkOptions(options);
        const results = lines.map(line => {
            const result = expandLine(line, options);
            result.line = line;
            generateTopAndBottom(result, options);
            generateSides(result, options);
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.indices);
            result.uv = new Float32Array(result.uv);
            result.normal = generateNormal$1(result.indices, result.position);
            return result;
        });
        const result = merge(results);
        result.lines = lines;
        return result;
    }
    function extrudeSlopes(lines, options) {
        options = Object.assign({}, { depth: 2, lineWidth: 1, side: 'left', sideDepth: 0, bottomStickGround: false, pathUV: false, isSlope: true }, options);
        checkOptions(options);
        const { depth, side, sideDepth } = options;
        const results = lines.map(line => {
            const tempResult = expandLine(line, options);
            tempResult.line = line;
            const { leftPoints, rightPoints } = tempResult;
            const result = { line };
            let depths;
            for (let i = 0, len = line.length; i < len; i++) {
                line[i][2] = line[i][2] || 0;
            }
            if (side === 'left') {
                result.leftPoints = leftPoints;
                result.rightPoints = line;
                depths = [sideDepth, depth];
            }
            else {
                result.leftPoints = line;
                result.rightPoints = rightPoints;
                depths = [depth, sideDepth];
            }
            result.depths = depths;
            generateTopAndBottom(result, options);
            generateSides(result, options);
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.indices);
            result.uv = new Float32Array(result.uv);
            result.normal = generateNormal$1(result.indices, result.position);
            return result;
        });
        const result = merge(results);
        result.lines = lines;
        return result;
    }
    function generateTopAndBottom(result, options) {
        const bottomStickGround = options.bottomStickGround;
        const z = options.depth;
        const depths = result.depths;
        let lz = z, rz = z;
        if (depths) {
            lz = depths[0];
            rz = depths[1];
        }
        const { leftPoints, rightPoints } = result;
        const line = result.line;
        const pathUV = options.pathUV;
        if (pathUV) {
            calLineDistance(line);
            for (let i = 0, len = line.length; i < len; i++) {
                leftPoints[i].distance = rightPoints[i].distance = line[i].distance;
            }
        }
        let i = 0, len = leftPoints.length;
        const points = [], indices = [], uv = [];
        while (i < len) {
            // top left
            const idx0 = i * 3;
            const [x1, y1, z1] = leftPoints[i];
            points[idx0] = x1;
            points[idx0 + 1] = y1;
            points[idx0 + 2] = lz + z1;
            // top right
            const [x2, y2, z2] = rightPoints[i];
            const idx1 = len * 3 + idx0;
            points[idx1] = x2;
            points[idx1 + 1] = y2;
            points[idx1 + 2] = rz + z2;
            // bottom left
            const idx2 = (len * 2) * 3 + idx0;
            points[idx2] = x1;
            points[idx2 + 1] = y1;
            points[idx2 + 2] = z1;
            if (bottomStickGround) {
                points[idx2 + 2] = 0;
            }
            // bottom right
            const idx3 = (len * 2) * 3 + len * 3 + idx0;
            points[idx3] = x2;
            points[idx3 + 1] = y2;
            points[idx3 + 2] = z2;
            if (bottomStickGround) {
                points[idx3 + 2] = 0;
            }
            // generate path uv
            if (pathUV) {
                const p = line[i];
                const uvx = p.distance;
                const uIndex0 = i * 2;
                uv[uIndex0] = uvx;
                uv[uIndex0 + 1] = 1;
                const uIndex1 = len * 2 + uIndex0;
                uv[uIndex1] = uvx;
                uv[uIndex1 + 1] = 0;
                const uIndex2 = (len * 2) * 2 + uIndex0;
                uv[uIndex2] = uvx;
                uv[uIndex2 + 1] = 1;
                const uIndex3 = (len * 2) * 2 + len * 2 + uIndex0;
                uv[uIndex3] = uvx;
                uv[uIndex3 + 1] = 0;
            }
            i++;
        }
        if (!pathUV) {
            i = 0;
            len = points.length;
            let uIndex = uv.length - 1;
            while (i < len) {
                const x = points[i], y = points[i + 1];
                uv[++uIndex] = x;
                uv[++uIndex] = y;
                // uvs.push(x, y);
                i += 3;
            }
        }
        i = 0;
        len = leftPoints.length;
        let iIndex = indices.length - 1;
        while (i < len - 1) {
            // top
            // left1 left2 right1,right2
            const a1 = i, b1 = i + 1, c1 = a1 + len, d1 = b1 + len;
            indices[++iIndex] = a1;
            indices[++iIndex] = c1;
            indices[++iIndex] = b1;
            indices[++iIndex] = c1;
            indices[++iIndex] = d1;
            indices[++iIndex] = b1;
            // index.push(a1, c1, b1);
            // index.push(c1, d1, b1);
            // bottom
            // left1 left2 right1,right2
            const len2 = len * 2;
            const a2 = i + len2, b2 = a2 + 1, c2 = a2 + len, d2 = b2 + len;
            indices[++iIndex] = a2;
            indices[++iIndex] = c2;
            indices[++iIndex] = b2;
            indices[++iIndex] = c2;
            indices[++iIndex] = d2;
            indices[++iIndex] = b2;
            // index.push(a2, c2, b2);
            // index.push(c2, d2, b2);
            i++;
        }
        result.indices = indices;
        result.points = points;
        result.uv = uv;
        if (depths) {
            len = leftPoints.length;
            i = 0;
            while (i < len) {
                leftPoints[i].depth = lz;
                rightPoints[i].depth = rz;
                i++;
            }
        }
    }
    function generateSides(result, options) {
        const { points, indices, leftPoints, rightPoints, uv } = result;
        const z = options.depth;
        const bottomStickGround = options.bottomStickGround;
        const rings = [leftPoints, rightPoints];
        const depthsEnable = result.depths;
        const pathUV = options.pathUV;
        const lineWidth = options.lineWidth;
        let pIndex = points.length - 1;
        let iIndex = indices.length - 1;
        let uIndex = uv.length - 1;
        function addOneSideIndex(v1, v2) {
            const idx = points.length / 3;
            // let pIndex = points.length - 1;
            const v1Depth = (depthsEnable ? v1.depth : z);
            const v2Depth = (depthsEnable ? v2.depth : z);
            // top
            points[++pIndex] = v1[0];
            points[++pIndex] = v1[1];
            points[++pIndex] = v1Depth + v1[2];
            points[++pIndex] = v2[0];
            points[++pIndex] = v2[1];
            points[++pIndex] = v2Depth + v2[2];
            // points.push(v1[0], v1[1], (depthsEnable ? v1.depth : z) + v1[2], v2[0], v2[1], (depthsEnable ? v2.depth : z) + v2[2]);
            // bottom
            points[++pIndex] = v1[0];
            points[++pIndex] = v1[1];
            points[++pIndex] = bottomStickGround ? 0 : v1[2];
            points[++pIndex] = v2[0];
            points[++pIndex] = v2[1];
            points[++pIndex] = bottomStickGround ? 0 : v2[2];
            // points.push(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
            const a = idx + 2, b = idx + 3, c = idx, d = idx + 1;
            indices[++iIndex] = a;
            indices[++iIndex] = c;
            indices[++iIndex] = b;
            indices[++iIndex] = c;
            indices[++iIndex] = d;
            indices[++iIndex] = b;
            // index.push(a, c, b, c, d, b);
            if (!pathUV) {
                generateSideWallUV(uv, points, a, b, c, d);
            }
            else {
                uv[++uIndex] = v1.distance;
                uv[++uIndex] = v1Depth / lineWidth;
                uv[++uIndex] = v2.distance;
                uv[++uIndex] = v2Depth / lineWidth;
                uv[++uIndex] = v1.distance;
                uv[++uIndex] = 0;
                uv[++uIndex] = v2.distance;
                uv[++uIndex] = 0;
            }
        }
        for (let i = 0, len = rings.length; i < len; i++) {
            let ring = rings[i];
            if (i > 0) {
                ring = ring.map(p => {
                    return p;
                });
                ring = ring.reverse();
            }
            let j = 0;
            const len1 = ring.length - 1;
            while (j < len1) {
                const v1 = ring[j];
                const v2 = ring[j + 1];
                addOneSideIndex(v1, v2);
                j++;
            }
        }
        const len = leftPoints.length;
        const vs = [rightPoints[0], leftPoints[0], leftPoints[len - 1], rightPoints[len - 1]];
        for (let i = 0; i < vs.length; i += 2) {
            const v1 = vs[i], v2 = vs[i + 1];
            addOneSideIndex(v1, v2);
        }
    }
    const TEMPV1 = { x: 0, y: 0 }, TEMPV2 = { x: 0, y: 0 };
    function expandLine(line, options) {
        // let preAngle = 0;
        let radius = options.lineWidth / 2;
        if (options.isSlope) {
            radius *= 2;
        }
        const points = [], leftPoints = [], rightPoints = [];
        const len = line.length;
        let i = 0;
        while (i < len) {
            let p1 = line[i], p2 = line[i + 1];
            const currentp = line[i];
            // last vertex
            if (i === len - 1) {
                p1 = line[len - 2];
                p2 = line[len - 1];
            }
            const dy = p2[1] - p1[1], dx = p2[0] - p1[0];
            let rAngle = 0;
            const rad = Math.atan(dy / dx);
            const angle = radToDeg(rad);
            // preAngle = angle;
            if (i === 0 || i === len - 1) {
                rAngle = angle;
                rAngle -= 90;
            }
            else {
                // 至少3个顶点才会触发
                const p0 = line[i - 1];
                TEMPV1.x = p0[0] - p1[0];
                TEMPV1.y = p0[1] - p1[1];
                TEMPV2.x = p2[0] - p1[0];
                TEMPV2.y = p2[1] - p1[1];
                const vAngle = getAngle(TEMPV1, TEMPV2);
                rAngle = angle - vAngle / 2;
            }
            const rRad = degToRad(rAngle);
            const p3 = currentp;
            const x = Math.cos(rRad) + p3[0], y = Math.sin(rRad) + p3[1];
            const p4 = [x, y];
            const [line1, line2] = translateLine(p1, p2, radius);
            let op1 = lineIntersection$1(line1[0], line1[1], p3, p4);
            let op2 = lineIntersection$1(line2[0], line2[1], p3, p4);
            // 平行，回头路
            if (!op1 || !op2) {
                const len1 = points.length;
                const point1 = points[len1 - 2];
                const point2 = points[len1 - 1];
                if (!point1 || !point2) {
                    continue;
                }
                op1 = [point1[0], point1[1]];
                op2 = [point2[0], point2[1]];
            }
            op1[2] = currentp[2] || 0;
            op2[2] = currentp[2] || 0;
            // const [op1, op2] = calOffsetPoint(rRad, radius, p1);
            points.push(op1, op2);
            if (leftOnLine(op1, p1, p2)) {
                leftPoints.push(op1);
                rightPoints.push(op2);
            }
            else {
                leftPoints.push(op2);
                rightPoints.push(op1);
            }
            i++;
        }
        return { offsetPoints: points, leftPoints, rightPoints, line };
    }
    const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
        const dot = x1 * x2 + y1 * y2;
        const det = x1 * y2 - y1 * x2;
        const angle = Math.atan2(det, dot) / Math.PI * 180;
        return (angle + 360) % 360;
    };
    function leftOnLine(p, p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const [x, y] = p;
        return (y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1 > 0;
    }
    /**
     * 平移线
     * @param {*} p1
     * @param {*} p2
     * @param {*} distance
     * @returns
     */
    function translateLine(p1, p2, distance) {
        const dy = p2[1] - p1[1], dx = p2[0] - p1[0];
        const rad = Math.atan2(dy, dx);
        const rad1 = rad + Math.PI / 2;
        let offsetX = Math.cos(rad1) * distance, offsetY = Math.sin(rad1) * distance;
        const tp1 = [p1[0] + offsetX, p1[1] + offsetY];
        const tp2 = [p2[0] + offsetX, p2[1] + offsetY];
        const rad2 = rad - Math.PI / 2;
        offsetX = Math.cos(rad2) * distance;
        offsetY = Math.sin(rad2) * distance;
        const tp3 = [p1[0] + offsetX, p1[1] + offsetY];
        const tp4 = [p2[0] + offsetX, p2[1] + offsetY];
        return [[tp1, tp2], [tp3, tp4]];
    }
    /**
     * 直线交点
     * @param {*} p1
     * @param {*} p2
     * @param {*} p3
     * @param {*} p4
     * @returns
     */
    function lineIntersection$1(p1, p2, p3, p4) {
        const dx1 = p2[0] - p1[0], dy1 = p2[1] - p1[1];
        const dx2 = p4[0] - p3[0], dy2 = p4[1] - p3[1];
        if (dx1 === 0 && dx2 === 0) {
            return null;
        }
        if (dy1 === 0 && dy2 === 0) {
            return null;
        }
        const k1 = dy1 / dx1;
        const k2 = dy2 / dx2;
        const b1 = p1[1] - k1 * p1[0];
        const b2 = p3[1] - k2 * p3[0];
        let x, y;
        if (dx1 === 0) {
            x = p1[0];
            y = k2 * x + b2;
        }
        else if (dx2 === 0) {
            x = p3[0];
            y = k1 * x + b1;
        }
        else if (dy1 === 0) {
            y = p1[1];
            x = (y - b2) / k2;
        }
        else if (dy2 === 0) {
            y = p3[1];
            x = (y - b1) / k1;
        }
        else {
            x = (b2 - b1) / (k1 - k2);
            y = k1 * x + b1;
        }
        return [x, y];
    }

    function cylinder(point, options) {
        options = Object.assign({}, { radius: 1, height: 2, radialSegments: 6 }, options);
        const radialSegments = Math.round(Math.max(4, options.radialSegments));
        let { radius, height } = options;
        radius = radius;
        height = height;
        const aRad = 360 / radialSegments / 360 * Math.PI * 2;
        const circlePointsLen = (radialSegments + 1);
        const points = new Float32Array(circlePointsLen * 3 * 2);
        const [centerx, centery] = point;
        let idx = 0, uIdx = 0;
        const offset = circlePointsLen * 3, uOffset = circlePointsLen * 2;
        const indices = [], uv = [];
        let iIndex = indices.length - 1;
        for (let i = -1; i < radialSegments; i++) {
            const rad = aRad * i;
            const x = Math.cos(rad) * radius + centerx, y = Math.sin(rad) * radius + centery;
            // bottom vertices
            points[idx] = x;
            points[idx + 1] = y;
            points[idx + 2] = 0;
            // top vertices
            points[idx + offset] = x;
            points[idx + 1 + offset] = y;
            points[idx + 2 + offset] = height;
            let u = 0, v = 0;
            u = 0.5 + x / radius / 2;
            v = 0.5 + y / radius / 2;
            uv[uIdx] = u;
            uv[uIdx + 1] = v;
            uv[uIdx + uOffset] = u;
            uv[uIdx + 1 + uOffset] = v;
            idx += 3;
            uIdx += 2;
            if (i > 1) {
                // bottom indices
                // indices.push(0, i - 1, i);
                indices[++iIndex] = 0;
                indices[++iIndex] = i - 1;
                indices[++iIndex] = i;
            }
        }
        idx -= 3;
        points[idx] = points[0];
        points[idx + 1] = points[1];
        points[idx + 2] = points[2];
        const pointsLen = points.length;
        points[pointsLen - 3] = points[0];
        points[pointsLen - 2] = points[1];
        points[pointsLen - 1] = height;
        const indicesLen = indices.length;
        // top indices
        iIndex = indices.length - 1;
        for (let i = 0; i < indicesLen; i++) {
            const index = indices[i];
            indices[++iIndex] = index + circlePointsLen;
            // indices.push(index + circlePointsLen);
        }
        const sidePoints = new Float32Array((circlePointsLen * 3 * 2 - 6) * 2);
        let pIndex = -1;
        idx = circlePointsLen * 2;
        uIdx = 0;
        iIndex = indices.length - 1;
        let uvIndex = uv.length - 1;
        for (let i = 0, len = points.length / 2; i < len - 3; i += 3) {
            const x1 = points[i], y1 = points[i + 1], x2 = points[i + 3], y2 = points[i + 4];
            sidePoints[++pIndex] = x1;
            sidePoints[++pIndex] = y1;
            sidePoints[++pIndex] = height;
            sidePoints[++pIndex] = x2;
            sidePoints[++pIndex] = y2;
            sidePoints[++pIndex] = height;
            sidePoints[++pIndex] = x1;
            sidePoints[++pIndex] = y1;
            sidePoints[++pIndex] = 0;
            sidePoints[++pIndex] = x2;
            sidePoints[++pIndex] = y2;
            sidePoints[++pIndex] = 0;
            const a = idx + 2, b = idx + 3, c = idx, d = idx + 1;
            // indices.push(a, c, b, c, d, b);
            indices[++iIndex] = c;
            indices[++iIndex] = a;
            indices[++iIndex] = d;
            indices[++iIndex] = a;
            indices[++iIndex] = b;
            indices[++iIndex] = d;
            // indices.push(c, a, d, a, b, d);
            idx += 4;
            const u1 = uIdx / circlePointsLen, u2 = (uIdx + 1) / circlePointsLen;
            uv[++uvIndex] = u1;
            uv[++uvIndex] = height / radius / 2;
            uv[++uvIndex] = u2;
            uv[++uvIndex] = height / radius / 2;
            uv[++uvIndex] = u1;
            uv[++uvIndex] = 0;
            uv[++uvIndex] = u2;
            uv[++uvIndex] = 0;
            // uvs.push(u1, height / radius / 2, u2, height / radius / 2, u1, 0, u2, 0);
            uIdx++;
        }
        const position = new Float32Array(points.length + sidePoints.length);
        position.set(points, 0);
        position.set(sidePoints, points.length);
        const normal = generateNormal$1(indices, position);
        return { points, indices: new Uint32Array(indices), position, normal, uv: new Float32Array(uv) };
    }

    /* eslint-disable no-tabs */
    /**
     * PathPoint
     */

    var PathPoint = /*#__PURE__*/function () {
      function PathPoint() {
        this.pos = new Vector3();
        this.dir = new Vector3();
        this.right = new Vector3();
        this.up = new Vector3(); // normal

        this.dist = 0; // distance from start

        this.widthScale = 1; // for corner

        this.sharp = false; // marks as sharp corner
      }

      var _proto = PathPoint.prototype;

      _proto.lerpPathPoints = function lerpPathPoints(p1, p2, alpha) {
        this.pos.lerpVectors(p1.pos, p2.pos, alpha);
        this.dir.lerpVectors(p1.dir, p2.dir, alpha);
        this.up.lerpVectors(p1.up, p2.up, alpha);
        this.right.lerpVectors(p1.right, p2.right, alpha);
        this.dist = (p2.dist - p1.dist) * alpha + p1.dist;
        this.widthScale = (p2.widthScale - p1.widthScale) * alpha + p1.widthScale;
      };

      _proto.copy = function copy(source) {
        this.pos.copy(source.pos);
        this.dir.copy(source.dir);
        this.up.copy(source.up);
        this.right.copy(source.right);
        this.dist = source.dist;
        this.widthScale = source.widthScale;
      };

      return PathPoint;
    }();

    // code copy from https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
    // import { WebGLCoordinateSystem, WebGPUCoordinateSystem } from '../constants.js';
    // import { Vector3 } from './Vector3.js';
    var Matrix4 = /*#__PURE__*/function () {
      function Matrix4(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        if (n11 !== undefined) {
          this.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
        }
      }

      var _proto = Matrix4.prototype;

      _proto.set = function set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        var te = this.elements;
        te[0] = n11;
        te[4] = n12;
        te[8] = n13;
        te[12] = n14;
        te[1] = n21;
        te[5] = n22;
        te[9] = n23;
        te[13] = n24;
        te[2] = n31;
        te[6] = n32;
        te[10] = n33;
        te[14] = n34;
        te[3] = n41;
        te[7] = n42;
        te[11] = n43;
        te[15] = n44;
        return this;
      } // identity() {
      //     this.set(
      //         1, 0, 0, 0,
      //         0, 1, 0, 0,
      //         0, 0, 1, 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      // clone() {
      //     return new Matrix4().fromArray(this.elements);
      // }
      // copy(m) {
      //     const te = this.elements;
      //     const me = m.elements;
      //     te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
      //     te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
      //     te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
      //     te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];
      //     return this;
      // }
      // copyPosition(m) {
      //     const te = this.elements, me = m.elements;
      //     te[12] = me[12];
      //     te[13] = me[13];
      //     te[14] = me[14];
      //     return this;
      // }
      // setFromMatrix3(m) {
      //     const me = m.elements;
      //     this.set(
      //         me[0], me[3], me[6], 0,
      //         me[1], me[4], me[7], 0,
      //         me[2], me[5], me[8], 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      // extractBasis(xAxis, yAxis, zAxis) {
      //     xAxis.setFromMatrixColumn(this, 0);
      //     yAxis.setFromMatrixColumn(this, 1);
      //     zAxis.setFromMatrixColumn(this, 2);
      //     return this;
      // }
      // makeBasis(xAxis, yAxis, zAxis) {
      //     this.set(
      //         xAxis.x, yAxis.x, zAxis.x, 0,
      //         xAxis.y, yAxis.y, zAxis.y, 0,
      //         xAxis.z, yAxis.z, zAxis.z, 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      // extractRotation(m) {
      //     // this method does not support reflection matrices
      //     const te = this.elements;
      //     const me = m.elements;
      //     const scaleX = 1 / _v1.setFromMatrixColumn(m, 0).length();
      //     const scaleY = 1 / _v1.setFromMatrixColumn(m, 1).length();
      //     const scaleZ = 1 / _v1.setFromMatrixColumn(m, 2).length();
      //     te[0] = me[0] * scaleX;
      //     te[1] = me[1] * scaleX;
      //     te[2] = me[2] * scaleX;
      //     te[3] = 0;
      //     te[4] = me[4] * scaleY;
      //     te[5] = me[5] * scaleY;
      //     te[6] = me[6] * scaleY;
      //     te[7] = 0;
      //     te[8] = me[8] * scaleZ;
      //     te[9] = me[9] * scaleZ;
      //     te[10] = me[10] * scaleZ;
      //     te[11] = 0;
      //     te[12] = 0;
      //     te[13] = 0;
      //     te[14] = 0;
      //     te[15] = 1;
      //     return this;
      // }
      // makeRotationFromEuler(euler) {
      //     const te = this.elements;
      //     const x = euler.x, y = euler.y, z = euler.z;
      //     const a = Math.cos(x), b = Math.sin(x);
      //     const c = Math.cos(y), d = Math.sin(y);
      //     const e = Math.cos(z), f = Math.sin(z);
      //     if (euler.order === 'XYZ') {
      //         const ae = a * e, af = a * f, be = b * e, bf = b * f;
      //         te[0] = c * e;
      //         te[4] = -c * f;
      //         te[8] = d;
      //         te[1] = af + be * d;
      //         te[5] = ae - bf * d;
      //         te[9] = -b * c;
      //         te[2] = bf - ae * d;
      //         te[6] = be + af * d;
      //         te[10] = a * c;
      //     } else if (euler.order === 'YXZ') {
      //         const ce = c * e, cf = c * f, de = d * e, df = d * f;
      //         te[0] = ce + df * b;
      //         te[4] = de * b - cf;
      //         te[8] = a * d;
      //         te[1] = a * f;
      //         te[5] = a * e;
      //         te[9] = -b;
      //         te[2] = cf * b - de;
      //         te[6] = df + ce * b;
      //         te[10] = a * c;
      //     } else if (euler.order === 'ZXY') {
      //         const ce = c * e, cf = c * f, de = d * e, df = d * f;
      //         te[0] = ce - df * b;
      //         te[4] = -a * f;
      //         te[8] = de + cf * b;
      //         te[1] = cf + de * b;
      //         te[5] = a * e;
      //         te[9] = df - ce * b;
      //         te[2] = -a * d;
      //         te[6] = b;
      //         te[10] = a * c;
      //     } else if (euler.order === 'ZYX') {
      //         const ae = a * e, af = a * f, be = b * e, bf = b * f;
      //         te[0] = c * e;
      //         te[4] = be * d - af;
      //         te[8] = ae * d + bf;
      //         te[1] = c * f;
      //         te[5] = bf * d + ae;
      //         te[9] = af * d - be;
      //         te[2] = -d;
      //         te[6] = b * c;
      //         te[10] = a * c;
      //     } else if (euler.order === 'YZX') {
      //         const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
      //         te[0] = c * e;
      //         te[4] = bd - ac * f;
      //         te[8] = bc * f + ad;
      //         te[1] = f;
      //         te[5] = a * e;
      //         te[9] = -b * e;
      //         te[2] = -d * e;
      //         te[6] = ad * f + bc;
      //         te[10] = ac - bd * f;
      //     } else if (euler.order === 'XZY') {
      //         const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
      //         te[0] = c * e;
      //         te[4] = -f;
      //         te[8] = d * e;
      //         te[1] = ac * f + bd;
      //         te[5] = a * e;
      //         te[9] = ad * f - bc;
      //         te[2] = bc * f - ad;
      //         te[6] = b * e;
      //         te[10] = bd * f + ac;
      //     }
      //     // bottom row
      //     te[3] = 0;
      //     te[7] = 0;
      //     te[11] = 0;
      //     // last column
      //     te[12] = 0;
      //     te[13] = 0;
      //     te[14] = 0;
      //     te[15] = 1;
      //     return this;
      // }
      // makeRotationFromQuaternion(q) {
      //     return this.compose(_zero, q, _one);
      // }
      // lookAt(eye, target, up) {
      //     const te = this.elements;
      //     _z.subVectors(eye, target);
      //     if (_z.lengthSq() === 0) {
      //         // eye and target are in the same position
      //         _z.z = 1;
      //     }
      //     _z.normalize();
      //     _x.crossVectors(up, _z);
      //     if (_x.lengthSq() === 0) {
      //         // up and z are parallel
      //         if (Math.abs(up.z) === 1) {
      //             _z.x += 0.0001;
      //         } else {
      //             _z.z += 0.0001;
      //         }
      //         _z.normalize();
      //         _x.crossVectors(up, _z);
      //     }
      //     _x.normalize();
      //     _y.crossVectors(_z, _x);
      //     te[0] = _x.x; te[4] = _y.x; te[8] = _z.x;
      //     te[1] = _x.y; te[5] = _y.y; te[9] = _z.y;
      //     te[2] = _x.z; te[6] = _y.z; te[10] = _z.z;
      //     return this;
      // }
      ;

      _proto.multiply = function multiply(m) {
        return this.multiplyMatrices(this, m);
      } // premultiply(m) {
      //     return this.multiplyMatrices(m, this);
      // }
      // multiplyMatrices(a, b) {
      //     const ae = a.elements;
      //     const be = b.elements;
      //     const te = this.elements;
      //     const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
      //     const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
      //     const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
      //     const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
      //     const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
      //     const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
      //     const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
      //     const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
      //     te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
      //     te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
      //     te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
      //     te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
      //     te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
      //     te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
      //     te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
      //     te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
      //     te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
      //     te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
      //     te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
      //     te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
      //     te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
      //     te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
      //     te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
      //     te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
      //     return this;
      // }
      // multiplyScalar(s) {
      //     const te = this.elements;
      //     te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
      //     te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
      //     te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
      //     te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;
      //     return this;
      // }
      // determinant() {
      //     const te = this.elements;
      //     const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
      //     const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
      //     const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
      //     const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
      //     //TODO: make this more efficient
      //     //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
      //     return (
      //         n41 * (
      //             + n14 * n23 * n32
      //             - n13 * n24 * n32
      //             - n14 * n22 * n33
      //             + n12 * n24 * n33
      //             + n13 * n22 * n34
      //             - n12 * n23 * n34
      //         ) +
      //         n42 * (
      //             + n11 * n23 * n34
      //             - n11 * n24 * n33
      //             + n14 * n21 * n33
      //             - n13 * n21 * n34
      //             + n13 * n24 * n31
      //             - n14 * n23 * n31
      //         ) +
      //         n43 * (
      //             + n11 * n24 * n32
      //             - n11 * n22 * n34
      //             - n14 * n21 * n32
      //             + n12 * n21 * n34
      //             + n14 * n22 * n31
      //             - n12 * n24 * n31
      //         ) +
      //         n44 * (
      //             - n13 * n22 * n31
      //             - n11 * n23 * n32
      //             + n11 * n22 * n33
      //             + n13 * n21 * n32
      //             - n12 * n21 * n33
      //             + n12 * n23 * n31
      //         )
      //     );
      // }
      // transpose() {
      //     const te = this.elements;
      //     let tmp;
      //     tmp = te[1]; te[1] = te[4]; te[4] = tmp;
      //     tmp = te[2]; te[2] = te[8]; te[8] = tmp;
      //     tmp = te[6]; te[6] = te[9]; te[9] = tmp;
      //     tmp = te[3]; te[3] = te[12]; te[12] = tmp;
      //     tmp = te[7]; te[7] = te[13]; te[13] = tmp;
      //     tmp = te[11]; te[11] = te[14]; te[14] = tmp;
      //     return this;
      // }
      // setPosition(x, y, z) {
      //     const te = this.elements;
      //     if (x.isVector3) {
      //         te[12] = x.x;
      //         te[13] = x.y;
      //         te[14] = x.z;
      //     } else {
      //         te[12] = x;
      //         te[13] = y;
      //         te[14] = z;
      //     }
      //     return this;
      // }
      // invert() {
      //     // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
      //     const te = this.elements,
      //         n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3],
      //         n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7],
      //         n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11],
      //         n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15],
      //         t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
      //         t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
      //         t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
      //         t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
      //     const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
      //     if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      //     const detInv = 1 / det;
      //     te[0] = t11 * detInv;
      //     te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
      //     te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
      //     te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
      //     te[4] = t12 * detInv;
      //     te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
      //     te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
      //     te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
      //     te[8] = t13 * detInv;
      //     te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
      //     te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
      //     te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
      //     te[12] = t14 * detInv;
      //     te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
      //     te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
      //     te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
      //     return this;
      // }
      // scale(v) {
      //     const te = this.elements;
      //     const x = v.x, y = v.y, z = v.z;
      //     te[0] *= x; te[4] *= y; te[8] *= z;
      //     te[1] *= x; te[5] *= y; te[9] *= z;
      //     te[2] *= x; te[6] *= y; te[10] *= z;
      //     te[3] *= x; te[7] *= y; te[11] *= z;
      //     return this;
      // }
      // getMaxScaleOnAxis() {
      //     const te = this.elements;
      //     const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
      //     const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
      //     const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
      //     return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
      // }
      // makeTranslation(x, y, z) {
      //     if (x.isVector3) {
      //         this.set(
      //             1, 0, 0, x.x,
      //             0, 1, 0, x.y,
      //             0, 0, 1, x.z,
      //             0, 0, 0, 1
      //         );
      //     } else {
      //         this.set(
      //             1, 0, 0, x,
      //             0, 1, 0, y,
      //             0, 0, 1, z,
      //             0, 0, 0, 1
      //         );
      //     }
      //     return this;
      // }
      // makeRotationX(theta) {
      //     const c = Math.cos(theta), s = Math.sin(theta);
      //     this.set(
      //         1, 0, 0, 0,
      //         0, c, -s, 0,
      //         0, s, c, 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      // makeRotationY(theta) {
      //     const c = Math.cos(theta), s = Math.sin(theta);
      //     this.set(
      //         c, 0, s, 0,
      //         0, 1, 0, 0,
      //         -s, 0, c, 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      // makeRotationZ(theta) {
      //     const c = Math.cos(theta), s = Math.sin(theta);
      //     this.set(
      //         c, -s, 0, 0,
      //         s, c, 0, 0,
      //         0, 0, 1, 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      ;

      _proto.makeRotationAxis = function makeRotationAxis(axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var t = 1 - c;
        var x = axis.x,
            y = axis.y,
            z = axis.z;
        var tx = t * x,
            ty = t * y;
        this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        return this;
      } // makeScale(x, y, z) {
      //     this.set(
      //         x, 0, 0, 0,
      //         0, y, 0, 0,
      //         0, 0, z, 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      // makeShear(xy, xz, yx, yz, zx, zy) {
      //     this.set(
      //         1, yx, zx, 0,
      //         xy, 1, zy, 0,
      //         xz, yz, 1, 0,
      //         0, 0, 0, 1
      //     );
      //     return this;
      // }
      // compose(position, quaternion, scale) {
      //     const te = this.elements;
      //     const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
      //     const x2 = x + x, y2 = y + y, z2 = z + z;
      //     const xx = x * x2, xy = x * y2, xz = x * z2;
      //     const yy = y * y2, yz = y * z2, zz = z * z2;
      //     const wx = w * x2, wy = w * y2, wz = w * z2;
      //     const sx = scale.x, sy = scale.y, sz = scale.z;
      //     te[0] = (1 - (yy + zz)) * sx;
      //     te[1] = (xy + wz) * sx;
      //     te[2] = (xz - wy) * sx;
      //     te[3] = 0;
      //     te[4] = (xy - wz) * sy;
      //     te[5] = (1 - (xx + zz)) * sy;
      //     te[6] = (yz + wx) * sy;
      //     te[7] = 0;
      //     te[8] = (xz + wy) * sz;
      //     te[9] = (yz - wx) * sz;
      //     te[10] = (1 - (xx + yy)) * sz;
      //     te[11] = 0;
      //     te[12] = position.x;
      //     te[13] = position.y;
      //     te[14] = position.z;
      //     te[15] = 1;
      //     return this;
      // }
      // decompose(position, quaternion, scale) {
      //     const te = this.elements;
      //     let sx = _v1.set(te[0], te[1], te[2]).length();
      //     const sy = _v1.set(te[4], te[5], te[6]).length();
      //     const sz = _v1.set(te[8], te[9], te[10]).length();
      //     // if determine is negative, we need to invert one scale
      //     const det = this.determinant();
      //     if (det < 0) sx = -sx;
      //     position.x = te[12];
      //     position.y = te[13];
      //     position.z = te[14];
      //     // scale the rotation part
      //     _m1.copy(this);
      //     const invSX = 1 / sx;
      //     const invSY = 1 / sy;
      //     const invSZ = 1 / sz;
      //     _m1.elements[0] *= invSX;
      //     _m1.elements[1] *= invSX;
      //     _m1.elements[2] *= invSX;
      //     _m1.elements[4] *= invSY;
      //     _m1.elements[5] *= invSY;
      //     _m1.elements[6] *= invSY;
      //     _m1.elements[8] *= invSZ;
      //     _m1.elements[9] *= invSZ;
      //     _m1.elements[10] *= invSZ;
      //     quaternion.setFromRotationMatrix(_m1);
      //     scale.x = sx;
      //     scale.y = sy;
      //     scale.z = sz;
      //     return this;
      // }
      // makePerspective(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
      //     const te = this.elements;
      //     const x = 2 * near / (right - left);
      //     const y = 2 * near / (top - bottom);
      //     const a = (right + left) / (right - left);
      //     const b = (top + bottom) / (top - bottom);
      //     let c, d;
      //     if (coordinateSystem === WebGLCoordinateSystem) {
      //         c = - (far + near) / (far - near);
      //         d = (- 2 * far * near) / (far - near);
      //     } else if (coordinateSystem === WebGPUCoordinateSystem) {
      //         c = - far / (far - near);
      //         d = (- far * near) / (far - near);
      //     } else {
      //         throw new Error('THREE.Matrix4.makePerspective(): Invalid coordinate system: ' + coordinateSystem);
      //     }
      //     te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
      //     te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
      //     te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
      //     te[3] = 0; te[7] = 0; te[11] = - 1; te[15] = 0;
      //     return this;
      // }
      // makeOrthographic(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
      //     const te = this.elements;
      //     const w = 1.0 / (right - left);
      //     const h = 1.0 / (top - bottom);
      //     const p = 1.0 / (far - near);
      //     const x = (right + left) * w;
      //     const y = (top + bottom) * h;
      //     let z, zInv;
      //     if (coordinateSystem === WebGLCoordinateSystem) {
      //         z = (far + near) * p;
      //         zInv = - 2 * p;
      //     } else if (coordinateSystem === WebGPUCoordinateSystem) {
      //         z = near * p;
      //         zInv = - 1 * p;
      //     } else {
      //         throw new Error('THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ' + coordinateSystem);
      //     }
      //     te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = - x;
      //     te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = - y;
      //     te[2] = 0; te[6] = 0; te[10] = zInv; te[14] = - z;
      //     te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;
      //     return this;
      // }
      ;

      _proto.equals = function equals(matrix) {
        var te = this.elements;
        var me = matrix.elements;

        for (var i = 0; i < 16; i++) {
          if (te[i] !== me[i]) return false;
        }

        return true;
      } // fromArray(array, offset = 0) {
      //     for (let i = 0; i < 16; i++) {
      //         this.elements[i] = array[i + offset];
      //     }
      //     return this;
      // }
      // toArray(array = [], offset = 0) {
      //     const te = this.elements;
      //     array[offset] = te[0];
      //     array[offset + 1] = te[1];
      //     array[offset + 2] = te[2];
      //     array[offset + 3] = te[3];
      //     array[offset + 4] = te[4];
      //     array[offset + 5] = te[5];
      //     array[offset + 6] = te[6];
      //     array[offset + 7] = te[7];
      //     array[offset + 8] = te[8];
      //     array[offset + 9] = te[9];
      //     array[offset + 10] = te[10];
      //     array[offset + 11] = te[11];
      //     array[offset + 12] = te[12];
      //     array[offset + 13] = te[13];
      //     array[offset + 14] = te[14];
      //     array[offset + 15] = te[15];
      //     return array;
      // }
      ;

      return Matrix4;
    }(); // const _v1 = new Vector3();

    // code copy from https://github.com/mrdoob/three.js/blob/dev/src/extras/core/Curve.js
    // import * as MathUtils from '../../math/MathUtils.js';
    // import { Vector2 } from '../../math/Vector2.js';
    // import { Vector3 } from '../../math/Vector3.js';
    // import { Matrix4 } from '../../math/Matrix4.js';

    /**
     * Extensible curve object.
     *
     * Some common of curve methods:
     * .getPoint( t, optionalTarget ), .getTangent( t, optionalTarget )
     * .getPointAt( u, optionalTarget ), .getTangentAt( u, optionalTarget )
     * .getPoints(), .getSpacedPoints()
     * .getLength()
     * .updateArcLengths()
     *
     * This following curves inherit from THREE.Curve:
     *
     * -- 2D curves --
     * THREE.ArcCurve
     * THREE.CubicBezierCurve
     * THREE.EllipseCurve
     * THREE.LineCurve
     * THREE.QuadraticBezierCurve
     * THREE.SplineCurve
     *
     * -- 3D curves --
     * THREE.CatmullRomCurve3
     * THREE.CubicBezierCurve3
     * THREE.LineCurve3
     * THREE.QuadraticBezierCurve3
     *
     * A series of curves can be represented as a THREE.CurvePath.
     *
     **/
    var Curve = /*#__PURE__*/function () {
      function Curve() {
        this.type = 'Curve';
        this.arcLengthDivisions = 200;
      } // Virtual base class method to overwrite and implement in subclasses


      var _proto = Curve.prototype;

      _proto.getPoint = function getPoint() {
        console.warn('THREE.Curve: .getPoint() not implemented.');
        return null;
      } // Get point at relative position in curve according to arc length
      // - u [0 .. 1]
      ;

      _proto.getPointAt = function getPointAt(u, optionalTarget) {
        var t = this.getUtoTmapping(u);
        return this.getPoint(t, optionalTarget);
      } // Get sequence of points using getPoint( t )
      ;

      _proto.getPoints = function getPoints(divisions) {
        if (divisions === void 0) {
          divisions = 5;
        }

        var points = [];

        for (var d = 0; d <= divisions; d++) {
          points.push(this.getPoint(d / divisions));
        }

        return points;
      } // // Get sequence of points using getPointAt( u )
      // getSpacedPoints(divisions = 5) {
      //     const points = [];
      //     for (let d = 0; d <= divisions; d++) {
      //         points.push(this.getPointAt(d / divisions));
      //     }
      //     return points;
      // }
      // Get total curve arc length
      ;

      _proto.getLength = function getLength() {
        var lengths = this.getLengths();
        return lengths[lengths.length - 1];
      } // Get list of cumulative segment lengths
      ;

      _proto.getLengths = function getLengths(divisions) {
        if (divisions === void 0) {
          divisions = this.arcLengthDivisions;
        }

        if (this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate) {
          return this.cacheArcLengths;
        }

        this.needsUpdate = false;
        var cache = [];
        var current,
            last = this.getPoint(0);
        var sum = 0;
        cache.push(0);

        for (var p = 1; p <= divisions; p++) {
          current = this.getPoint(p / divisions);
          sum += current.distanceTo(last);
          cache.push(sum);
          last = current;
        }

        this.cacheArcLengths = cache;
        return cache; // { sums: cache, sum: sum }; Sum is in the last element.
      } // updateArcLengths() {
      //     this.needsUpdate = true;
      //     this.getLengths();
      // }
      // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant
      ;

      _proto.getUtoTmapping = function getUtoTmapping(u, distance) {
        var arcLengths = this.getLengths();
        var i = 0;
        var il = arcLengths.length;
        var targetArcLength; // The targeted u distance value to get

        if (distance) {
          targetArcLength = distance;
        } else {
          targetArcLength = u * arcLengths[il - 1];
        } // binary search for the index with largest value smaller than target u distance


        var low = 0,
            high = il - 1,
            comparison;

        while (low <= high) {
          i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

          comparison = arcLengths[i] - targetArcLength;

          if (comparison < 0) {
            low = i + 1;
          } else if (comparison > 0) {
            high = i - 1;
          } else {
            high = i;
            break; // DONE
          }
        }

        i = high;

        if (arcLengths[i] === targetArcLength) {
          return i / (il - 1);
        } // we could get finer grain at lengths, or use simple interpolation between two points


        var lengthBefore = arcLengths[i];
        var lengthAfter = arcLengths[i + 1];
        var segmentLength = lengthAfter - lengthBefore; // determine where we are between the 'before' and 'after' points

        var segmentFraction = (targetArcLength - lengthBefore) / segmentLength; // add that fractional amount to t

        var t = (i + segmentFraction) / (il - 1);
        return t;
      } // Returns a unit vector tangent at t
      // In case any sub curve does not implement its tangent derivation,
      // 2 points a small delta apart will be used to find its gradient
      // which seems to give a reasonable approximation
      // getTangent(t, optionalTarget) {
      //     const delta = 0.0001;
      //     let t1 = t - delta;
      //     let t2 = t + delta;
      //     // Capping in case of danger
      //     if (t1 < 0) t1 = 0;
      //     if (t2 > 1) t2 = 1;
      //     const pt1 = this.getPoint(t1);
      //     const pt2 = this.getPoint(t2);
      //     const tangent = optionalTarget || ((pt1.isVector2) ? new Vector2() : new Vector3());
      //     tangent.copy(pt2).sub(pt1).normalize();
      //     return tangent;
      // }
      // getTangentAt(u, optionalTarget) {
      //     const t = this.getUtoTmapping(u);
      //     return this.getTangent(t, optionalTarget);
      // }
      // computeFrenetFrames(segments, closed) {
      //     // see http://www.cs.indiana.edu/pub/techreports/TR425.pdf
      //     const normal = new Vector3();
      //     const tangents = [];
      //     const normals = [];
      //     const binormals = [];
      //     const vec = new Vector3();
      //     const mat = new Matrix4();
      //     // compute the tangent vectors for each segment on the curve
      //     for (let i = 0; i <= segments; i++) {
      //         const u = i / segments;
      //         tangents[i] = this.getTangentAt(u, new Vector3());
      //     }
      //     // select an initial normal vector perpendicular to the first tangent vector,
      //     // and in the direction of the minimum tangent xyz component
      //     normals[0] = new Vector3();
      //     binormals[0] = new Vector3();
      //     let min = Number.MAX_VALUE;
      //     const tx = Math.abs(tangents[0].x);
      //     const ty = Math.abs(tangents[0].y);
      //     const tz = Math.abs(tangents[0].z);
      //     if (tx <= min) {
      //         min = tx;
      //         normal.set(1, 0, 0);
      //     }
      //     if (ty <= min) {
      //         min = ty;
      //         normal.set(0, 1, 0);
      //     }
      //     if (tz <= min) {
      //         normal.set(0, 0, 1);
      //     }
      //     vec.crossVectors(tangents[0], normal).normalize();
      //     normals[0].crossVectors(tangents[0], vec);
      //     binormals[0].crossVectors(tangents[0], normals[0]);
      //     // compute the slowly-varying normal and binormal vectors for each segment on the curve
      //     for (let i = 1; i <= segments; i++) {
      //         normals[i] = normals[i - 1].clone();
      //         binormals[i] = binormals[i - 1].clone();
      //         vec.crossVectors(tangents[i - 1], tangents[i]);
      //         if (vec.length() > Number.EPSILON) {
      //             vec.normalize();
      //             const theta = Math.acos(MathUtils.clamp(tangents[i - 1].dot(tangents[i]), - 1, 1)); // clamp for floating pt errors
      //             normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
      //         }
      //         binormals[i].crossVectors(tangents[i], normals[i]);
      //     }
      //     // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same
      //     if (closed === true) {
      //         let theta = Math.acos(MathUtils.clamp(normals[0].dot(normals[segments]), - 1, 1));
      //         theta /= segments;
      //         if (tangents[0].dot(vec.crossVectors(normals[0], normals[segments])) > 0) {
      //             theta = - theta;
      //         }
      //         for (let i = 1; i <= segments; i++) {
      //             // twist a little...
      //             normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
      //             binormals[i].crossVectors(tangents[i], normals[i]);
      //         }
      //     }
      //     return {
      //         tangents: tangents,
      //         normals: normals,
      //         binormals: binormals
      //     };
      // }
      // clone() {
      //     return new this.constructor().copy(this);
      // }
      // copy(source) {
      //     this.arcLengthDivisions = source.arcLengthDivisions;
      //     return this;
      // }
      // toJSON() {
      //     const data = {
      //         metadata: {
      //             version: 4.6,
      //             type: 'Curve',
      //             generator: 'Curve.toJSON'
      //         }
      //     };
      //     data.arcLengthDivisions = this.arcLengthDivisions;
      //     data.type = this.type;
      //     return data;
      // }
      // fromJSON(json) {
      //     this.arcLengthDivisions = json.arcLengthDivisions;
      //     return this;
      // }
      ;

      return Curve;
    }();

    /**
     * // code copy from https://github.com/mrdoob/three.js/blob/dev/src/extras/core/Interpolations.js
     * Bezier Curves formulas obtained from
     * https://en.wikipedia.org/wiki/B%C3%A9zier_curve
     */


    function QuadraticBezierP0(t, p) {
      var k = 1 - t;
      return k * k * p;
    }

    function QuadraticBezierP1(t, p) {
      return 2 * (1 - t) * t * p;
    }

    function QuadraticBezierP2(t, p) {
      return t * t * p;
    }

    function QuadraticBezier(t, p0, p1, p2) {
      return QuadraticBezierP0(t, p0) + QuadraticBezierP1(t, p1) + QuadraticBezierP2(t, p2);
    } //

    var QuadraticBezierCurve3 = /*#__PURE__*/function (_Curve) {
      _inheritsLoose(QuadraticBezierCurve3, _Curve);

      function QuadraticBezierCurve3(v0, v1, v2) {
        var _this;

        if (v0 === void 0) {
          v0 = new Vector3();
        }

        if (v1 === void 0) {
          v1 = new Vector3();
        }

        if (v2 === void 0) {
          v2 = new Vector3();
        }

        _this = _Curve.call(this) || this;
        _this.isQuadraticBezierCurve3 = true;
        _this.type = 'QuadraticBezierCurve3';
        _this.v0 = v0;
        _this.v1 = v1;
        _this.v2 = v2;
        return _this;
      }

      var _proto = QuadraticBezierCurve3.prototype;

      _proto.getPoint = function getPoint(t, optionalTarget) {
        if (optionalTarget === void 0) {
          optionalTarget = new Vector3();
        }

        var point = optionalTarget;
        var v0 = this.v0,
            v1 = this.v1,
            v2 = this.v2;
        point.set(QuadraticBezier(t, v0.x, v1.x, v2.x), QuadraticBezier(t, v0.y, v1.y, v2.y), QuadraticBezier(t, v0.z, v1.z, v2.z));
        return point;
      } // copy(source) {
      //     super.copy(source);
      //     this.v0.copy(source.v0);
      //     this.v1.copy(source.v1);
      //     this.v2.copy(source.v2);
      //     return this;
      // }
      // toJSON() {
      //     const data = super.toJSON();
      //     data.v0 = this.v0.toArray();
      //     data.v1 = this.v1.toArray();
      //     data.v2 = this.v2.toArray();
      //     return data;
      // }
      // fromJSON(json) {
      //     super.fromJSON(json);
      //     this.v0.fromArray(json.v0);
      //     this.v1.fromArray(json.v1);
      //     this.v2.fromArray(json.v2);
      //     return this;
      // }
      ;

      return QuadraticBezierCurve3;
    }(Curve);

    /* eslint-disable no-tabs */
    var helpVec3_1 = new Vector3();
    var helpVec3_2 = new Vector3();
    var helpVec3_3 = new Vector3();
    var helpMat4 = new Matrix4();
    var helpCurve = new QuadraticBezierCurve3();

    function _getCornerBezierCurve(last, current, next, cornerRadius, firstCorner, out) {
      var lastDir = helpVec3_1.subVectors(current, last);
      var nextDir = helpVec3_2.subVectors(next, current);
      var lastDirLength = lastDir.length();
      var nextDirLength = nextDir.length();
      lastDir.normalize();
      nextDir.normalize(); // cornerRadius can not bigger then lineDistance / 2, auto fix this

      var v0Dist = Math.min((firstCorner ? lastDirLength / 2 : lastDirLength) * 0.999999, cornerRadius);
      out.v0.copy(current).sub(lastDir.multiplyScalar(v0Dist));
      out.v1.copy(current);
      var v2Dist = Math.min(nextDirLength / 2 * 0.999999, cornerRadius);
      out.v2.copy(current).add(nextDir.multiplyScalar(v2Dist));
      return out;
    }
    /**
     * PathPointList
     * input points to generate a PathPoint list
     */


    var PathPointList = /*#__PURE__*/function () {
      function PathPointList() {
        this.array = []; // path point array

        this.count = 0;
      }
      /**
       * Set points
       * @param {THREE.Vector3[]} points key points array
       * @param {number} cornerRadius? the corner radius. set 0 to disable round corner. default is 0.1
       * @param {number} cornerSplit? the corner split. default is 10.
       * @param {number} up? force up. default is auto up (calculate by tangent).
       * @param {boolean} close? close path. default is false.
       */


      var _proto = PathPointList.prototype;

      _proto.set = function set(points, cornerRadius, cornerSplit, up, close) {
        if (cornerRadius === void 0) {
          cornerRadius = 0.1;
        }

        if (cornerSplit === void 0) {
          cornerSplit = 10;
        }

        if (up === void 0) {
          up = null;
        }

        if (close === void 0) {
          close = false;
        }

        points = points.slice(0);

        if (points.length < 2) {
          console.warn('PathPointList: points length less than 2.');
          this.count = 0;
          return;
        } // Auto close


        if (close && !points[0].equals(points[points.length - 1])) {
          points.push(new Vector3().copy(points[0]));
        } // Generate path point list


        for (var i = 0, l = points.length; i < l; i++) {
          if (i === 0) {
            this._start(points[i], points[i + 1], up);
          } else if (i === l - 1) {
            if (close) {
              // Connect end point and start point
              this._corner(points[i], points[1], cornerRadius, cornerSplit, up); // Fix start point


              var dist = this.array[0].dist; // should not copy dist

              this.array[0].copy(this.array[this.count - 1]);
              this.array[0].dist = dist;
            } else {
              this._end(points[i]);
            }
          } else {
            this._corner(points[i], points[i + 1], cornerRadius, cornerSplit, up);
          }
        }
      }
      /**
       * Get distance of this path
       * @return {number}
       */
      ;

      _proto.distance = function distance() {
        if (this.count > 0) {
          return this.array[this.count - 1].dist;
        }

        return 0;
      };

      _proto._getByIndex = function _getByIndex(index) {
        if (!this.array[index]) {
          this.array[index] = new PathPoint();
        }

        return this.array[index];
      };

      _proto._start = function _start(current, next, up) {
        this.count = 0;

        var point = this._getByIndex(this.count);

        point.pos.copy(current);
        point.dir.subVectors(next, current); // init start up dir

        if (up) {
          point.up.copy(up);
        } else {
          // select an initial normal vector perpendicular to the first tangent vector
          var min = Number.MAX_VALUE;
          var tx = Math.abs(point.dir.x);
          var ty = Math.abs(point.dir.y);
          var tz = Math.abs(point.dir.z);

          if (tx < min) {
            min = tx;
            point.up.set(1, 0, 0);
          }

          if (ty < min) {
            min = ty;
            point.up.set(0, 1, 0);
          }

          if (tz < min) {
            point.up.set(0, 0, 1);
          }
        }

        point.right.crossVectors(point.dir, point.up).normalize();
        point.up.crossVectors(point.right, point.dir).normalize();
        point.dist = 0;
        point.widthScale = 1;
        point.sharp = false;
        point.dir.normalize();
        this.count++;
      };

      _proto._end = function _end(current) {
        var lastPoint = this.array[this.count - 1];

        var point = this._getByIndex(this.count);

        point.pos.copy(current);
        point.dir.subVectors(current, lastPoint.pos);
        var dist = point.dir.length();
        point.dir.normalize();
        point.up.copy(lastPoint.up); // copy last up

        var vec = helpVec3_1.crossVectors(lastPoint.dir, point.dir);

        if (vec.length() > Number.EPSILON) {
          vec.normalize();
          var theta = Math.acos(Math.min(Math.max(lastPoint.dir.dot(point.dir), -1), 1)); // clamp for floating pt errors

          point.up.applyMatrix4(helpMat4.makeRotationAxis(vec, theta));
        }

        point.right.crossVectors(point.dir, point.up).normalize();
        point.dist = lastPoint.dist + dist;
        point.widthScale = 1;
        point.sharp = false;
        this.count++;
      };

      _proto._corner = function _corner(current, next, cornerRadius, cornerSplit, up) {
        if (cornerRadius > 0 && cornerSplit > 0) {
          var lastPoint = this.array[this.count - 1];

          var curve = _getCornerBezierCurve(lastPoint.pos, current, next, cornerRadius, this.count - 1 === 0, helpCurve);

          var samplerPoints = curve.getPoints(cornerSplit); // TODO optimize

          for (var f = 0; f < cornerSplit; f++) {
            this._sharpCorner(samplerPoints[f], samplerPoints[f + 1], up, f === 0 ? 1 : 0);
          }

          if (!samplerPoints[cornerSplit].equals(next)) {
            this._sharpCorner(samplerPoints[cornerSplit], next, up, 2);
          }
        } else {
          this._sharpCorner(current, next, up, 0, true);
        }
      } // dirType: 0 - use middle dir / 1 - use last dir / 2- use next dir
      ;

      _proto._sharpCorner = function _sharpCorner(current, next, up, dirType, sharp) {
        if (dirType === void 0) {
          dirType = 0;
        }

        if (sharp === void 0) {
          sharp = false;
        }

        var lastPoint = this.array[this.count - 1];

        var point = this._getByIndex(this.count);

        var lastDir = helpVec3_1.subVectors(current, lastPoint.pos);
        var nextDir = helpVec3_2.subVectors(next, current);
        var lastDirLength = lastDir.length();
        lastDir.normalize();
        nextDir.normalize();
        point.pos.copy(current);

        if (dirType === 1) {
          point.dir.copy(lastDir);
        } else if (dirType === 2) {
          point.dir.copy(nextDir);
        } else {
          point.dir.addVectors(lastDir, nextDir);
          point.dir.normalize();
        }

        if (up) {
          if (point.dir.dot(up) === 1) {
            point.right.crossVectors(nextDir, up).normalize();
          } else {
            point.right.crossVectors(point.dir, up).normalize();
          }

          point.up.crossVectors(point.right, point.dir).normalize();
        } else {
          point.up.copy(lastPoint.up);
          var vec = helpVec3_3.crossVectors(lastPoint.dir, point.dir);

          if (vec.length() > Number.EPSILON) {
            vec.normalize();
            var theta = Math.acos(Math.min(Math.max(lastPoint.dir.dot(point.dir), -1), 1)); // clamp for floating pt errors

            point.up.applyMatrix4(helpMat4.makeRotationAxis(vec, theta));
          }

          point.right.crossVectors(point.dir, point.up).normalize();
        }

        point.dist = lastPoint.dist + lastDirLength;

        var _cos = lastDir.dot(nextDir);

        point.widthScale = Math.min(1 / Math.sqrt((1 + _cos) / 2), 1.415) || 1;
        point.sharp = Math.abs(_cos - 1) > 0.05 && sharp;
        this.count++;
      };

      return PathPointList;
    }();

    const UP$1 = new Vector3(0, 0, 1);
    const right = new Vector3();
    const left = new Vector3();
    // for sharp corners
    const leftOffset = new Vector3();
    const rightOffset = new Vector3();
    const tempPoint1 = new Vector3();
    const tempPoint2 = new Vector3();
    function expandPaths(lines, options) {
        options = Object.assign({}, { lineWidth: 1, cornerRadius: 0, cornerSplit: 10 }, options);
        const results = lines.map(line => {
            const points = line2Vectors(line);
            const pathPointList = new PathPointList();
            //@ts-ignore
            pathPointList.set(points, options.cornerRadius, options.cornerSplit, UP$1);
            const params = generatePathVertexData(pathPointList, options);
            const result = {
                position: new Float32Array(params.position),
                indices: new Uint32Array(params.indices),
                uv: new Float32Array(params.uv),
                normal: new Float32Array(params.normal),
                line,
                count: params.count
            };
            return result;
        });
        const result = merge(results);
        result.lines = lines;
        return result;
    }
    // Vertex Data Generate Functions
    // code copy from https://github.com/shawn0326/three.path/blob/master/src/PathGeometry.js
    function generatePathVertexData(pathPointList, options) {
        const width = options.lineWidth || 0.1;
        const progress = 1;
        const halfWidth = width / 2;
        const sideWidth = (width);
        const totalDistance = pathPointList.distance();
        const progressDistance = progress * totalDistance;
        let count = 0;
        // modify data
        const position = [];
        const normal = [];
        const uv = [];
        const indices = [];
        let verticesCount = 0;
        if (totalDistance === 0) {
            return {
                position: position,
                normal,
                uv: uv,
                indices: indices,
                count
            };
        }
        const sharpUvOffset = halfWidth / sideWidth;
        // const sharpUvOffset2 = halfWidth / totalDistance;
        let pIndex = position.length - 1;
        let nIndex = normal.length - 1;
        let uIndex = uv.length - 1;
        let iIndex = indices.length - 1;
        function addVertices(pathPoint) {
            const first = position.length === 0;
            const sharpCorner = pathPoint.sharp && !first;
            const uvDist = pathPoint.dist / sideWidth;
            // const uvDist2 = pathPoint.dist / totalDistance;
            const dir = pathPoint.dir;
            const up = pathPoint.up;
            const _right = pathPoint.right;
            //@ts-ignore
            {
                right.copy(_right).multiplyScalar(halfWidth * pathPoint.widthScale);
            }
            //@ts-ignore
            {
                left.copy(_right).multiplyScalar(-halfWidth * pathPoint.widthScale);
            }
            right.add(pathPoint.pos);
            left.add(pathPoint.pos);
            if (sharpCorner) {
                leftOffset.fromArray(position, position.length - 6).sub(left);
                rightOffset.fromArray(position, position.length - 3).sub(right);
                const leftDist = leftOffset.length();
                const rightDist = rightOffset.length();
                const sideOffset = leftDist - rightDist;
                let longerOffset, longEdge;
                if (sideOffset > 0) {
                    longerOffset = leftOffset;
                    longEdge = left;
                }
                else {
                    longerOffset = rightOffset;
                    longEdge = right;
                }
                tempPoint1.copy(longerOffset).setLength(Math.abs(sideOffset)).add(longEdge);
                // eslint-disable-next-line prefer-const
                let _cos = tempPoint2.copy(longEdge).sub(tempPoint1).normalize().dot(dir);
                // eslint-disable-next-line prefer-const
                let _len = tempPoint2.copy(longEdge).sub(tempPoint1).length();
                // eslint-disable-next-line prefer-const
                let _dist = _cos * _len * 2;
                tempPoint2.copy(dir).setLength(_dist).add(tempPoint1);
                if (sideOffset > 0) {
                    position[++pIndex] = tempPoint1.x;
                    position[++pIndex] = tempPoint1.y;
                    position[++pIndex] = tempPoint1.z;
                    position[++pIndex] = right.x;
                    position[++pIndex] = right.y;
                    position[++pIndex] = right.z;
                    position[++pIndex] = left.x;
                    position[++pIndex] = left.y;
                    position[++pIndex] = left.z;
                    position[++pIndex] = right.x;
                    position[++pIndex] = right.y;
                    position[++pIndex] = right.z;
                    position[++pIndex] = tempPoint2.x;
                    position[++pIndex] = tempPoint2.y;
                    position[++pIndex] = tempPoint2.z;
                    position[++pIndex] = right.x;
                    position[++pIndex] = right.y;
                    position[++pIndex] = right.z;
                    // position.push(
                    //     tempPoint1.x, tempPoint1.y, tempPoint1.z, // 6
                    //     right.x, right.y, right.z, // 5
                    //     left.x, left.y, left.z, // 4
                    //     right.x, right.y, right.z, // 3
                    //     tempPoint2.x, tempPoint2.y, tempPoint2.z, // 2
                    //     right.x, right.y, right.z // 1
                    // );
                    verticesCount += 6;
                    indices[++iIndex] = verticesCount - 6;
                    indices[++iIndex] = verticesCount - 8;
                    indices[++iIndex] = verticesCount - 7;
                    indices[++iIndex] = verticesCount - 6;
                    indices[++iIndex] = verticesCount - 7;
                    indices[++iIndex] = verticesCount - 5;
                    indices[++iIndex] = verticesCount - 4;
                    indices[++iIndex] = verticesCount - 6;
                    indices[++iIndex] = verticesCount - 5;
                    indices[++iIndex] = verticesCount - 2;
                    indices[++iIndex] = verticesCount - 4;
                    indices[++iIndex] = verticesCount - 1;
                    // indices.push(
                    //     verticesCount - 6, verticesCount - 8, verticesCount - 7,
                    //     verticesCount - 6, verticesCount - 7, verticesCount - 5,
                    //     verticesCount - 4, verticesCount - 6, verticesCount - 5,
                    //     verticesCount - 2, verticesCount - 4, verticesCount - 1
                    // );
                    count += 12;
                }
                else {
                    position[++pIndex] = left.x;
                    position[++pIndex] = left.y;
                    position[++pIndex] = left.z;
                    position[++pIndex] = tempPoint1.x;
                    position[++pIndex] = tempPoint1.y;
                    position[++pIndex] = tempPoint1.z;
                    position[++pIndex] = left.x;
                    position[++pIndex] = left.y;
                    position[++pIndex] = left.z;
                    position[++pIndex] = right.x;
                    position[++pIndex] = right.y;
                    position[++pIndex] = right.z;
                    position[++pIndex] = left.x;
                    position[++pIndex] = left.y;
                    position[++pIndex] = left.z;
                    position[++pIndex] = tempPoint2.x;
                    position[++pIndex] = tempPoint2.y;
                    position[++pIndex] = tempPoint2.z;
                    // position.push(
                    //     left.x, left.y, left.z, // 6
                    //     tempPoint1.x, tempPoint1.y, tempPoint1.z, // 5
                    //     left.x, left.y, left.z, // 4
                    //     right.x, right.y, right.z, // 3
                    //     left.x, left.y, left.z, // 2
                    //     tempPoint2.x, tempPoint2.y, tempPoint2.z // 1
                    // );
                    verticesCount += 6;
                    indices[++iIndex] = verticesCount - 6;
                    indices[++iIndex] = verticesCount - 8;
                    indices[++iIndex] = verticesCount - 7;
                    indices[++iIndex] = verticesCount - 6;
                    indices[++iIndex] = verticesCount - 7;
                    indices[++iIndex] = verticesCount - 5;
                    indices[++iIndex] = verticesCount - 6;
                    indices[++iIndex] = verticesCount - 5;
                    indices[++iIndex] = verticesCount - 3;
                    indices[++iIndex] = verticesCount - 2;
                    indices[++iIndex] = verticesCount - 3;
                    indices[++iIndex] = verticesCount - 1;
                    // indices.push(
                    //     verticesCount - 6, verticesCount - 8, verticesCount - 7,
                    //     verticesCount - 6, verticesCount - 7, verticesCount - 5,
                    //     verticesCount - 6, verticesCount - 5, verticesCount - 3,
                    //     verticesCount - 2, verticesCount - 3, verticesCount - 1
                    // );
                    count += 12;
                }
                for (let i = 0; i < 6; i++) {
                    normal[++nIndex] = up.x;
                    normal[++nIndex] = up.y;
                    normal[++nIndex] = up.z;
                }
                // normal.push(
                //     up.x, up.y, up.z,
                //     up.x, up.y, up.z,
                //     up.x, up.y, up.z,
                //     up.x, up.y, up.z,
                //     up.x, up.y, up.z,
                //     up.x, up.y, up.z
                // );
                uv[++uIndex] = uvDist - sharpUvOffset;
                uv[++uIndex] = 0;
                uv[++uIndex] = uvDist - sharpUvOffset;
                uv[++uIndex] = 1;
                uv[++uIndex] = uvDist;
                uv[++uIndex] = 0;
                uv[++uIndex] = uvDist;
                uv[++uIndex] = 1;
                uv[++uIndex] = uvDist + sharpUvOffset;
                uv[++uIndex] = 0;
                uv[++uIndex] = uvDist + sharpUvOffset;
                uv[++uIndex] = 1;
                // uv.push(
                //     uvDist - sharpUvOffset, 0,
                //     uvDist - sharpUvOffset, 1,
                //     uvDist, 0,
                //     uvDist, 1,
                //     uvDist + sharpUvOffset, 0,
                //     uvDist + sharpUvOffset, 1
                // );
                // if (generateUv2) {
                //     uv2.push(
                //         uvDist2 - sharpUvOffset2, 0,
                //         uvDist2 - sharpUvOffset2, 1,
                //         uvDist2, 0,
                //         uvDist2, 1,
                //         uvDist2 + sharpUvOffset2, 0,
                //         uvDist2 + sharpUvOffset2, 1
                //     );
                // }
            }
            else {
                position[++pIndex] = left.x;
                position[++pIndex] = left.y;
                position[++pIndex] = left.z;
                position[++pIndex] = right.x;
                position[++pIndex] = right.y;
                position[++pIndex] = right.z;
                // position.push(
                //     left.x, left.y, left.z,
                //     right.x, right.y, right.z
                // );
                normal[++nIndex] = up.x;
                normal[++nIndex] = up.y;
                normal[++nIndex] = up.z;
                normal[++nIndex] = up.x;
                normal[++nIndex] = up.y;
                normal[++nIndex] = up.z;
                // normal.push(
                //     up.x, up.y, up.z,
                //     up.x, up.y, up.z
                // );
                uv[++uIndex] = uvDist;
                uv[++uIndex] = 0;
                uv[++uIndex] = uvDist;
                uv[++uIndex] = 1;
                // uv.push(
                //     uvDist, 0,
                //     uvDist, 1
                // );
                // if (generateUv2) {
                //     uv2.push(
                //         uvDist2, 0,
                //         uvDist2, 1
                //     );
                // }
                verticesCount += 2;
                if (!first) {
                    indices[++iIndex] = verticesCount - 2;
                    indices[++iIndex] = verticesCount - 4;
                    indices[++iIndex] = verticesCount - 3;
                    indices[++iIndex] = verticesCount - 2;
                    indices[++iIndex] = verticesCount - 3;
                    indices[++iIndex] = verticesCount - 1;
                    // indices.push(
                    //     verticesCount - 2, verticesCount - 4, verticesCount - 3,
                    //     verticesCount - 2, verticesCount - 3, verticesCount - 1
                    // );
                    count += 6;
                }
            }
        }
        let lastPoint;
        if (progressDistance > 0) {
            for (let i = 0; i < pathPointList.count; i++) {
                const pathPoint = pathPointList.array[i];
                if (pathPoint.dist > progressDistance) {
                    const prevPoint = pathPointList.array[i - 1];
                    lastPoint = new PathPoint();
                    // linear lerp for progress
                    const alpha = (progressDistance - prevPoint.dist) / (pathPoint.dist - prevPoint.dist);
                    lastPoint.lerpPathPoints(prevPoint, pathPoint, alpha);
                    addVertices(lastPoint);
                    break;
                }
                else {
                    addVertices(pathPoint);
                }
            }
        }
        else {
            lastPoint = pathPointList.array[0];
        }
        return {
            position: position,
            normal,
            uv: uv,
            indices: indices,
            count
        };
    }

    const UP = new Vector3(0, 0, 1);
    const normalDir = new Vector3();
    function expandTubes(lines, options) {
        options = Object.assign({}, { radius: 1, cornerSplit: 0, radialSegments: 8, startRad: -Math.PI / 4 }, options);
        const results = lines.map(line => {
            const points = line2Vectors(line);
            const pathPointList = new PathPointList();
            //@ts-ignore
            pathPointList.set(points, 0, options.cornerSplit, UP);
            const result = generateTubeVertexData(pathPointList, options);
            result.line = line;
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.indices);
            result.uv = new Float32Array(result.uv);
            result.normal = new Float32Array(result.normal);
            return result;
        });
        const result = merge(results);
        result.lines = lines;
        return result;
    }
    // Vertex Data Generate Functions
    // code copy from https://github.com/shawn0326/three.path/blob/master/src/PathGeometry.js
    function generateTubeVertexData(pathPointList, options) {
        const radius = Math.max(options.radius || 1, 0.00000001);
        const progress = options.progress !== undefined ? options.progress : 1;
        const radialSegments = Math.max(3, options.radialSegments || 8);
        const startRad = options.startRad || 0;
        const circum = radius * 2 * Math.PI;
        const totalDistance = pathPointList.distance();
        const progressDistance = progress * totalDistance;
        if (progressDistance === 0) {
            return null;
        }
        let count = 0;
        // modify data
        const points = [];
        const normal = [];
        const uv = [];
        // const uv2 = [];
        const indices = [];
        let verticesCount = 0;
        let pIndex = -1;
        let nIndex = -1;
        let uIndex = -1;
        let iIndex = -1;
        function addVertices(pathPoint, radius, radialSegments) {
            const first = points.length === 0;
            const uvDist = pathPoint.dist / circum;
            // const uvDist2 = pathPoint.dist / totalDistance;
            for (let i = 0; i <= radialSegments; i++) {
                let r = i;
                if (r === radialSegments) {
                    r = 0;
                }
                normalDir.copy(pathPoint.up).applyAxisAngle(pathPoint.dir, startRad + Math.PI * 2 * r / radialSegments).normalize();
                const scale = radius * pathPoint.widthScale;
                points[++pIndex] = pathPoint.pos.x + normalDir.x * scale;
                points[++pIndex] = pathPoint.pos.y + normalDir.y * scale;
                points[++pIndex] = pathPoint.pos.z + normalDir.z * scale;
                normal[++nIndex] = normalDir.x;
                normal[++nIndex] = normalDir.y;
                normal[++nIndex] = normalDir.z;
                uv[++uIndex] = uvDist;
                uv[++uIndex] = i / radialSegments;
                // uvs.push(uvDist, r / radialSegments);
                // if (generateUv2) {
                //     uv2.push(uvDist2, r / radialSegments);
                // }
                verticesCount++;
            }
            if (!first) {
                const begin1 = verticesCount - (radialSegments + 1) * 2;
                const begin2 = verticesCount - (radialSegments + 1);
                for (let i = 0; i < radialSegments; i++) {
                    indices[++iIndex] = begin2 + i;
                    indices[++iIndex] = begin1 + i;
                    indices[++iIndex] = begin1 + i + 1;
                    indices[++iIndex] = begin2 + i;
                    indices[++iIndex] = begin1 + i + 1;
                    indices[++iIndex] = begin2 + i + 1;
                    // index.push(
                    //     begin2 + i,
                    //     begin1 + i,
                    //     begin1 + i + 1,
                    //     begin2 + i,
                    //     begin1 + i + 1,
                    //     begin2 + i + 1
                    // );
                    count += 6;
                }
            }
        }
        if (progressDistance > 0) {
            for (let i = 0; i < pathPointList.count; i++) {
                const pathPoint = pathPointList.array[i];
                if (pathPoint.dist > progressDistance) {
                    const prevPoint = pathPointList.array[i - 1];
                    const lastPoint = new PathPoint();
                    // linear lerp for progress
                    const alpha = (progressDistance - prevPoint.dist) / (pathPoint.dist - prevPoint.dist);
                    lastPoint.lerpPathPoints(prevPoint, pathPoint, alpha);
                    addVertices(lastPoint, radius, radialSegments);
                    break;
                }
                else {
                    addVertices(pathPoint, radius, radialSegments);
                }
            }
        }
        return {
            points,
            normal,
            uv,
            // uv2,
            indices,
            count
        };
    }

    function plane(width, height, devideW, devideH) {
        devideW = Math.max(1, devideW);
        devideH = Math.max(1, devideH);
        const dx = width / devideW, dy = height / devideH;
        const minX = -width / 2, maxY = height / 2, minY = -height / 2;
        const len = (devideW + 1) * (devideH + 1);
        const position = new Float32Array(len * 3), uv = new Float32Array(len * 2), normal = new Float32Array(len * 3), indices = new Uint32Array(len * 10);
        let index = 0, uIndex = 0, iIndex = 0;
        for (let j = 0; j <= devideH; j++) {
            for (let i = 0; i <= devideW; i++) {
                const x = minX + dx * i;
                const y = maxY - dy * j;
                position[index] = x;
                position[index + 1] = y;
                position[index + 2] = 0;
                normal[index] = 0;
                normal[index + 1] = 0;
                normal[index + 2] = 1;
                // position.push(x, y, 0);
                // normal.push(0, 0, 1);
                const uvx = (x - minX) / width, uvy = (y - minY) / height;
                // uv.push(uvx, uvy);
                uv[uIndex] = uvx;
                uv[uIndex + 1] = uvy;
                index += 3;
                uIndex += 2;
                if (i < devideW && j < devideH) {
                    const a = j * (devideW + 1) + i, b = a + 1, c = (devideW + 1) * (j + 1) + i, d = c + 1;
                    indices[iIndex] = a;
                    indices[iIndex + 1] = c;
                    indices[iIndex + 2] = b;
                    indices[iIndex + 3] = c;
                    indices[iIndex + 4] = d;
                    indices[iIndex + 5] = b;
                    iIndex += 6;
                    // indexs.push(a, c, b, c, d, b);
                }
            }
        }
        const indexArray = new Uint32Array(iIndex);
        for (let i = 0, len = indexArray.length; i < len; i++) {
            indexArray[i] = indices[i];
        }
        // for (let j = 0; j < devideH; j++) {
        //     for (let i = 0; i < devideW; i++) {
        //         const a = j * (devideW + 1) + i, b = a + 1, c = (devideW + 1) * (j + 1) + i, d = c + 1;
        //         indexs.push(a, c, b, c, d, b);
        //     }
        // }
        return {
            position,
            uv,
            normal,
            indices: indexArray
        };
    }

    var polyExtrude = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cylinder: cylinder,
        expandLine: expandLine,
        expandPaths: expandPaths,
        expandTubes: expandTubes,
        extrudePolygons: extrudePolygons,
        extrudePolylines: extrudePolylines,
        extrudeSlopes: extrudeSlopes,
        isClockwise: isClockwise,
        leftOnLine: leftOnLine,
        merge: merge,
        plane: plane
    });

    //Using cache to reduce computation
    function distanceToVector3(distance, layer, cache = {}) {
        if (cache[distance] === undefined) {
            cache[distance] = layer.distanceToVector3(distance, distance).x;
        }
        return cache[distance];
    }
    function altitudeToVector3(altitude, layer, cache = {}) {
        if (cache[altitude] === undefined) {
            cache[altitude] = layer.altitudeToVector3(altitude, altitude).x;
        }
        return cache[altitude];
    }
    /**
     *Get the center point of the point set
     * @param {*} coordinates
     */
    function getCenterOfPoints(coordinates = []) {
        let sumX = 0, sumY = 0;
        const len = coordinates.length;
        for (let i = 0; i < len; i++) {
            const { coordinate, lnglat, lnglats, xy, xys } = coordinates[i];
            const c = coordinate || lnglat || lnglats || xy || xys || coordinates[i];
            let x, y;
            if (Array.isArray(c)) {
                x = c[0];
                y = c[1];
            }
            else if (c instanceof maptalks__namespace.Coordinate) {
                x = c.x;
                y = c.y;
            }
            sumX += x;
            sumY += y;
        }
        return new maptalks__namespace.Coordinate(sumX / len, sumY / len);
    }
    function setBottomHeight(geometry, bottomHeight, layer, cache) {
        if (bottomHeight === undefined || typeof bottomHeight !== 'number' || bottomHeight === 0) {
            return 0;
        }
        let position;
        if (geometry instanceof THREE__namespace.BufferGeometry) {
            position = geometry.attributes.position.array;
        }
        else if (Array.isArray(geometry) || geometry instanceof Float32Array) {
            position = geometry;
        }
        else {
            position = geometry.position;
        }
        let h = 0;
        if (position) {
            if (cache) {
                if (cache[bottomHeight] === undefined) {
                    cache[bottomHeight] = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                }
                h = cache[bottomHeight];
            }
            else {
                h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
            }
            const len = position.length;
            if (position[0] instanceof THREE__namespace.Vector3) {
                for (let i = 0; i < len; i++) {
                    position[i].z += h;
                }
            }
            else {
                for (let i = 0; i < len; i += 3) {
                    position[i + 2] += h;
                }
            }
        }
        return h;
    }
    function getGeometriesColorArray(geometriesAttributes) {
        const len = geometriesAttributes.length;
        let colorsLen = 0;
        for (let i = 0; i < len; i++) {
            const { count } = geometriesAttributes[i].position;
            colorsLen += count;
        }
        return new Float32Array(colorsLen * 3);
    }
    const TEMP_VECTOR3$2 = new THREE__namespace.Vector3();
    const heightCache$3 = new Map();
    function coordiantesToArrayBuffer(coordiantes = [], layer) {
        const len = coordiantes.length;
        const hasHeight = !!layer;
        const dimensional = hasHeight ? 3 : 2;
        const array = new Float64Array(len * dimensional);
        heightCache$3.clear();
        for (let i = 0; i < len; i++) {
            let x, y;
            const c = coordiantes[i];
            let height;
            if (c.x) {
                x = c.x;
                y = c.y;
                height = c.z;
            }
            else {
                x = c[0];
                y = c[1];
                height = c[2];
            }
            array[i * dimensional] = x;
            array[i * dimensional + 1] = y;
            height = height || 0;
            if (hasHeight && height !== 0) {
                if (!heightCache$3.has(height)) {
                    const z = layer.altitudeToVector3(height, height, null, TEMP_VECTOR3$2).x;
                    heightCache$3.set(height, z);
                }
                array[i * dimensional + 2] = heightCache$3.get(height);
            }
        }
        return array.buffer;
    }
    function getPolygonProperties(polygon) {
        return (isGeoJSONPolygon(polygon) ? polygon['properties'] : polygon.getProperties()) || {};
    }
    function getLineStringProperties(lineString) {
        return (isGeoJSONLine(lineString) ? lineString['properties'] : lineString.getProperties()) || {};
    }

    const topColor$1 = new THREE__namespace.Color('#fff'), bottomColor$1 = new THREE__namespace.Color('#fff');
    /**
     * this is for ExtrudeMesh util
     */
    /**
     * Fix the bug in the center of multipoygon
     * @param {maptalks.Polygon} polygon
     * @param {*} layer
     */
    // export function toShape(datas = []) {
    //     const shapes = [];
    //     for (let i = 0, len = datas.length; i < len; i++) {
    //         const { outer, holes } = datas[i];
    //         const shape = [outer];
    //         if (holes && holes.length) {
    //             for (let j = 0, len1 = holes.length; j < len1; j++) {
    //                 shape.push(holes[j]);
    //             }
    //         }
    //         shapes.push(shape);
    //     }
    //     return shapes;
    // }
    /**
     *  Support custom center point
     * @param {maptalks.Polygon|maptalks.MultiPolygon} polygon
     * @param {*} height
     * @param {*} layer
     */
    function getExtrudeGeometry(polygon, height, top, layer, center) {
        const { position, normal, uv, indices } = getExtrudeGeometryParams(polygon, height, top, layer, center);
        const color = new Float32Array(position.length);
        color.fill(1, 0, position.length);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'color', new THREE__namespace.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    function getExtrudeGeometryParams(polygon, height, top, layer, center, centerPt, altCache) {
        const datas = getPolygonPositions(polygon, layer, center, centerPt, false);
        const shapes = datas;
        //Possible later use of geojson
        if (!shapes)
            return null;
        //Reduce height and repeat calculation
        if (altCache) {
            if (altCache[height] == null) {
                altCache[height] = layer.altitudeToVector3(height, height).x;
            }
            height = altCache[height];
        }
        else {
            height = layer.altitudeToVector3(height, height).x;
        }
        const { position, normal, uv, indices } = extrudePolygons(shapes, {
            depth: height,
            top
        });
        return {
            position, normal, uv, indices
        };
    }
    /**
     *
     * @param {*} geometry
     * @param {*} color
     * @param {*} _topColor
     */
    function initVertexColors$1(geometry, color, _topColor, minZ) {
        if (minZ === undefined) {
            minZ = 0;
        }
        const position = geometry.attributes.position.array;
        const len = position.length;
        bottomColor$1.setStyle(color);
        topColor$1.setStyle(_topColor);
        let colors;
        if (Array.isArray(minZ)) {
            let colorLen = 0;
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { count } = minZ[i].position;
                colorLen += count * 3;
            }
            colors = new Float32Array(colorLen);
        }
        else {
            colors = new Float32Array(position.length);
        }
        if (Array.isArray(minZ)) {
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { middleZ, start, end } = minZ[i].position;
                for (let j = start; j < end; j += 3) {
                    const z = position[j + 2];
                    if (z > middleZ) {
                        colors[j] = topColor$1.r;
                        colors[j + 1] = topColor$1.g;
                        colors[j + 2] = topColor$1.b;
                    }
                    else {
                        colors[j] = bottomColor$1.r;
                        colors[j + 1] = bottomColor$1.g;
                        colors[j + 2] = bottomColor$1.b;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < len; i += 3) {
                const z = position[i + 2];
                if (z > minZ) {
                    colors[i] = topColor$1.r;
                    colors[i + 1] = topColor$1.g;
                    colors[i + 2] = topColor$1.b;
                }
                else {
                    colors[i] = bottomColor$1.r;
                    colors[i + 1] = bottomColor$1.g;
                    colors[i + 2] = bottomColor$1.b;
                }
            }
        }
        addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
        return colors;
    }
    /**
     *
     * @param {*} polygon
     * @param {*} layer
     * @param {*} center
     */
    function getPolygonPositions(polygon, layer, center, centerPt, isArrayBuff = false) {
        if (!polygon) {
            return null;
        }
        let datas = [];
        if (polygon instanceof maptalks__namespace.MultiPolygon) {
            datas = polygon.getGeometries().map(p => {
                return getSinglePolygonPositions(p, layer, center || polygon.getCenter(), centerPt, isArrayBuff);
            });
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            const data = getSinglePolygonPositions(polygon, layer, center || polygon.getCenter(), centerPt, isArrayBuff);
            datas.push(data);
        }
        else if (isGeoJSONPolygon(polygon)) {
            // const cent = getGeoJSONCenter(polygon);
            if (!isGeoJSONMulti(polygon)) {
                const data = getSinglePolygonPositions(polygon, layer, center || getGeoJSONCenter(polygon), centerPt, isArrayBuff);
                datas.push(data);
            }
            else {
                const fs = spliteGeoJSONMulti(polygon);
                for (let i = 0, len = fs.length; i < len; i++) {
                    datas.push(getSinglePolygonPositions(fs[i], layer, center || getGeoJSONCenter(polygon), centerPt, isArrayBuff));
                }
            }
        }
        return datas;
    }
    function getSinglePolygonPositions(polygon, layer, center, centerPt, isArrayBuff = false) {
        let shell, holes;
        //it is pre for geojson,Possible later use of geojson
        if (isGeoJSONPolygon(polygon)) {
            const coordinates = getGeoJSONCoordinates(polygon);
            shell = coordinates[0];
            holes = coordinates.slice(1, coordinates.length);
            center = center || getGeoJSONCenter(polygon);
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            shell = polygon.getShell();
            holes = polygon.getHoles();
            center = center || polygon.getCenter();
        }
        centerPt = centerPt || layer.coordinateToVector3(center);
        let outer;
        if (isArrayBuff) {
            outer = layer.coordinatiesToGLFloatArray(shell, centerPt).positons2d;
        }
        else {
            outer = layer.coordinatiesToGLArray(shell, centerPt);
        }
        const data = [(isArrayBuff ? outer.buffer : outer)];
        if (holes && holes.length > 0) {
            for (let i = 0, len = holes.length; i < len; i++) {
                let pts;
                if (isArrayBuff) {
                    pts = layer.coordinatiesToGLFloatArray(holes[i], centerPt).positons2d;
                }
                else {
                    pts = layer.coordinatiesToGLArray(holes[i], centerPt);
                }
                data.push((isArrayBuff ? pts.buffer : pts));
            }
        }
        return data;
    }
    function getPolygonArrayBuffer(polygon) {
        if (!polygon) {
            return null;
        }
        let datas = [];
        if (polygon instanceof maptalks__namespace.MultiPolygon) {
            datas = polygon.getGeometries().map(p => {
                return getSinglePolygonArrayBuffer(p, false);
            });
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            const data = getSinglePolygonArrayBuffer(polygon, false);
            datas.push(data);
        }
        else if (isGeoJSONPolygon(polygon)) {
            // const cent = getGeoJSONCenter(polygon);
            if (!isGeoJSONMulti(polygon)) {
                const data = getSinglePolygonArrayBuffer(polygon, true);
                datas.push(data);
            }
            else {
                const fs = spliteGeoJSONMulti(polygon);
                for (let i = 0, len = fs.length; i < len; i++) {
                    datas.push(getSinglePolygonArrayBuffer(fs[i], true));
                }
            }
        }
        return datas;
    }
    function getSinglePolygonArrayBuffer(polygon, isGeoJSON) {
        let shell, holes;
        //it is pre for geojson,Possible later use of geojson
        if (isGeoJSON) {
            const coordinates = getGeoJSONCoordinates(polygon);
            shell = coordinates[0];
            holes = coordinates.slice(1, coordinates.length);
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            shell = polygon.getShell();
            holes = polygon.getHoles();
        }
        const outer = coordiantesToArrayBuffer(shell);
        const data = [outer];
        if (holes && holes.length > 0) {
            for (let i = 0, len = holes.length; i < len; i++) {
                const pts = coordiantesToArrayBuffer(holes[i]);
                data.push(pts);
            }
        }
        return data;
    }

    var ExtrudeUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getExtrudeGeometry: getExtrudeGeometry,
        getExtrudeGeometryParams: getExtrudeGeometryParams,
        initVertexColors: initVertexColors$1,
        getPolygonPositions: getPolygonPositions,
        getSinglePolygonPositions: getSinglePolygonPositions,
        getPolygonArrayBuffer: getPolygonArrayBuffer,
        getSinglePolygonArrayBuffer: getSinglePolygonArrayBuffer
    });

    const COMMA = ',';
    const heightCache$2 = new Map();
    const TEMP_VECTOR3$1 = new THREE__namespace.Vector3();
    /**
     *
     * @param {maptalks.LineString} lineString
     * @param {ThreeLayer} layer
     */
    function getLinePosition(lineString, layer, center, hasVectorArray = true) {
        let positionsV = [];
        let positions, positions2d;
        if (Array.isArray(lineString) && lineString[0] instanceof THREE__namespace.Vector3) {
            positionsV = lineString;
        }
        else {
            if (Array.isArray(lineString)) {
                lineString = new maptalks__namespace.LineString(lineString);
            }
            const z = 0;
            //support geojson
            let coordinates, cent;
            if (isGeoJSON(lineString)) {
                coordinates = getGeoJSONCoordinates(lineString);
                if (!center) {
                    cent = getGeoJSONCenter(lineString);
                }
            }
            else if (lineString instanceof maptalks__namespace.LineString) {
                coordinates = lineString.getCoordinates();
                if (!center) {
                    cent = lineString.getCenter();
                }
            }
            const centerPt = layer.coordinateToVector3(center || cent);
            if (hasVectorArray) {
                heightCache$2.clear();
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    const coordinate = coordinates[i];
                    const height = coordinate.z || coordinate[2] || 0;
                    if (!heightCache$2.has(height)) {
                        const vz = layer.altitudeToVector3(height, height, null, TEMP_VECTOR3$1).x;
                        heightCache$2.set(height, vz);
                    }
                    const v = layer.coordinateToVector3(coordinate, z).sub(centerPt);
                    v.z += (heightCache$2.get(height) || 0);
                    positionsV.push(v);
                }
            }
            else {
                const result = layer.coordinatiesToGLFloatArray(coordinates, centerPt, true);
                positions = result.positions;
                positions2d = result.positons2d;
            }
        }
        if (!hasVectorArray) {
            return {
                positions,
                positionsV,
                positions2d,
                arrayBuffer: positions.buffer
            };
        }
        positions2d = new Float32Array(positionsV.length * 2);
        positions = new Float32Array(positionsV.length * 3);
        for (let i = 0, len = positionsV.length; i < len; i++) {
            const idx = i * 3;
            const v = positionsV[i];
            positions[idx] = v.x;
            positions[idx + 1] = v.y;
            positions[idx + 2] = v.z;
            const idx1 = i * 2;
            positions2d[idx1] = v.x;
            positions2d[idx1 + 1] = v.y;
        }
        return {
            positions,
            positionsV,
            positions2d,
            arrayBuffer: positions.buffer
        };
    }
    /**
     *
     * @param {maptalks.LineString} lineString
     * @param {Number} lineWidth
     * @param {Number} depth
     * @param {ThreeLayer} layer
     */
    function getExtrudeLineGeometry(lineString, lineWidth = 1, depth = 1, pathUV = false, layer, center) {
        const { indices, position, normal, uv } = getExtrudeLineParams(lineString, lineWidth, depth, pathUV, layer, center);
        const geometry = new THREE__namespace.BufferGeometry();
        addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(geometry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(geometry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        geometry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return geometry;
    }
    /**
     *
     * @param {Array[Array]} chunkLines
     * @param {*} layer
     */
    function getChunkLinesPosition(chunkLines, layer, positionMap, centerPt) {
        const positions = [], positionsV = [], lnglats = [];
        let preKey;
        let v;
        for (let i = 0, len = chunkLines.length; i < len; i++) {
            const line = chunkLines[i];
            for (let j = 0, len1 = line.length; j < len1; j++) {
                const lnglat = line[j];
                const key = lnglat.join(COMMA).toString();
                if (!preKey) {
                    lnglats.push(lnglat);
                    preKey = key;
                    v = layer.coordinateToVector3(lnglat, 0).sub(centerPt);
                    positions.push(v.x, v.y, v.z);
                    positionsV.push(v);
                    continue;
                }
                if (key !== preKey) {
                    v = layer.coordinateToVector3(lnglat, 0).sub(centerPt);
                    positions.push(v.x, v.y, v.z);
                    positionsV.push(v);
                    lnglats.push(lnglat);
                }
                preKey = key;
            }
        }
        return {
            positions: positions,
            positionsV: positionsV,
            lnglats: lnglats
        };
    }
    function mergeChunkLineCoordinates(chunkLines) {
        let preKey;
        const lnglats = [];
        for (let i = 0, len = chunkLines.length; i < len; i++) {
            const line = chunkLines[i];
            for (let j = 0, len1 = line.length; j < len1; j++) {
                const lnglat = line[j];
                const key = lnglat.join(COMMA).toString();
                if (!preKey) {
                    lnglats.push(lnglat);
                    preKey = key;
                    continue;
                }
                if (key !== preKey) {
                    lnglats.push(lnglat);
                }
                preKey = key;
            }
        }
        return lnglats;
    }
    /**
     *
     * @param {*} lineString
     * @param {*} lineWidth
     * @param {*} depth
     * @param {*} layer
     */
    function getExtrudeLineParams(lineString, lineWidth = 1, depth = 1, pathUV = false, layer, center) {
        const positions = getLinePosition(lineString, layer, center).positionsV;
        const ps = [];
        for (let i = 0, len = positions.length; i < len; i++) {
            const p = positions[i];
            ps.push([p.x, p.y, p.z]);
        }
        const { indices, position, normal, uv } = extrudePolylines([ps], {
            lineWidth: lineWidth,
            depth: depth,
            pathUV
        });
        return {
            position: position,
            normal: normal,
            indices: indices,
            uv
        };
    }
    /**
     *
     * @param {*} lineString
     * @param {*} lineWidth
     * @param {*} cornerRadius
     * @param {*} layer
     */
    function getPathParams(lineString, lineWidth = 1, cornerRadius = 1, layer, center) {
        const positions = getLinePosition(lineString, layer, center).positionsV;
        const ps = [];
        for (let i = 0, len = positions.length; i < len; i++) {
            const p = positions[i];
            ps.push([p.x, p.y, p.z]);
        }
        const { indices, position, normal, uv } = expandPaths([ps], {
            lineWidth: lineWidth,
            cornerRadius: cornerRadius
        });
        return {
            position: position,
            normal: normal,
            indices: indices,
            uv
        };
    }
    function LineStringSplit(lineString) {
        let lineStrings = [], center;
        if (lineString instanceof maptalks__namespace.MultiLineString) {
            lineStrings = lineString.getGeometries();
            center = lineString.getCenter();
        }
        else if (lineString instanceof maptalks__namespace.LineString) {
            lineStrings.push(lineString);
            center = lineString.getCenter();
        }
        else if (isGeoJSON(lineString)) {
            center = getGeoJSONCenter(lineString);
            if (isGeoJSONMulti(lineString)) {
                lineStrings = spliteGeoJSONMulti(lineString);
            }
            else {
                lineStrings.push(lineString);
            }
        }
        return {
            lineStrings,
            center
        };
    }
    function setLineSegmentPosition(position, positionsV) {
        for (let i = 0, len = positionsV.length; i < len; i++) {
            const v = positionsV[i];
            if (i > 0 && i < len - 1) {
                position.push(v.x, v.y, v.z);
            }
            position.push(v.x, v.y, v.z);
        }
    }
    function getLineSegmentPosition(ps) {
        const position = new Float32Array(ps.length * 2 - 6);
        let j = 0;
        for (let i = 0, len = ps.length / 3; i < len; i++) {
            const x = ps[i * 3], y = ps[i * 3 + 1], z = ps[i * 3 + 2];
            if (i > 0 && i < len - 1) {
                const idx = j * 3;
                position[idx] = x;
                position[idx + 1] = y;
                position[idx + 2] = z;
                j++;
            }
            const idx = j * 3;
            position[idx] = x;
            position[idx + 1] = y;
            position[idx + 2] = z;
            j++;
        }
        return position;
    }
    function mergeLinePositions(positionsList) {
        let len = 0;
        const l = positionsList.length;
        if (l === 1) {
            return positionsList[0];
        }
        for (let i = 0; i < l; i++) {
            len += positionsList[i].length;
        }
        const position = new Float32Array(len);
        let offset = 0;
        for (let i = 0; i < l; i++) {
            position.set(positionsList[i], offset);
            offset += positionsList[i].length;
        }
        return position;
    }
    function getLineArrayBuffer(lineString, layer) {
        if (lineString instanceof maptalks__namespace.LineString) {
            return coordiantesToArrayBuffer(lineString.getCoordinates(), layer);
        }
        else if (isGeoJSONLine(lineString)) {
            return coordiantesToArrayBuffer(lineString.geometry.coordinates, layer);
        }
    }
    let defaultGeometry;
    function getDefaultLineGeometry() {
        if (!defaultGeometry) {
            defaultGeometry = new THREE__namespace.BufferGeometry();
            addAttribute(defaultGeometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(3), 3));
        }
        return defaultGeometry;
    }

    var LineUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getLinePosition: getLinePosition,
        getExtrudeLineGeometry: getExtrudeLineGeometry,
        getChunkLinesPosition: getChunkLinesPosition,
        mergeChunkLineCoordinates: mergeChunkLineCoordinates,
        getExtrudeLineParams: getExtrudeLineParams,
        getPathParams: getPathParams,
        LineStringSplit: LineStringSplit,
        setLineSegmentPosition: setLineSegmentPosition,
        getLineSegmentPosition: getLineSegmentPosition,
        mergeLinePositions: mergeLinePositions,
        getLineArrayBuffer: getLineArrayBuffer,
        getDefaultLineGeometry: getDefaultLineGeometry
    });

    // eslint-disable-next-line quotes
    const workerName = '__maptalks.three__';
    function getWorkerName() {
        return workerName;
    }

    let MeshActor;
    if (maptalks__namespace.worker) {
        MeshActor = class extends maptalks__namespace.worker.Actor {
            test(info, cb) {
                //send data to worker thread
                this.send(info, null, cb);
            }
            pushQueue(q = {}) {
                const { type, data, callback, layer, key, center, lineStrings, options, id, baseOptions } = q;
                let params;
                if (type.indexOf('ExtrudePolygon') > -1) {
                    params = gengerateExtrudePolygons(data, center, layer, options, baseOptions);
                }
                else if (type === 'ExtrudeLines' || type === 'Paths') {
                    params = gengerateExtrudeLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'Point') ;
                else if (type === 'Line' || type === 'FatLine') {
                    params = gengerateLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'Lines' || type === 'FatLines') {
                    params = gengerateLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'ExtrudeLine' || type === 'Path') {
                    params = gengerateExtrudeLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'Bar' || type === 'Bars') {
                    params = generateBars(data);
                }
                if (!params) {
                    console.error(`No processing logic found for type:${type}`);
                    return;
                }
                this.send({ type, datas: params.datas, glRes: params.glRes, matrix: params.matrix, center: params.center }, params.transfer, function (err, message) {
                    if (err) {
                        console.error(err);
                    }
                    message.key = key;
                    message.id = id;
                    callback(message);
                });
            }
        };
    }
    var actor$1;
    function getActor() {
        if (!maptalks__namespace.worker) {
            console.error('maptalks.worker is not defined,You can\'t use ThreeVectorTileLayer');
        }
        if (!actor$1 && MeshActor) {
            actor$1 = new MeshActor(getWorkerName());
        }
        return actor$1;
    }
    /**
     *
     * @param distance
     * @param layer
     * @param altCache
     * @returns
     */
    function getDistance(distance, layer, altCache = {}) {
        if (distance !== undefined && typeof distance === 'number' && distance !== 0) {
            if (altCache[distance] === undefined) {
                altCache[distance] = layer.distanceToVector3(distance, distance).x;
            }
            return altCache[distance];
        }
        return 0;
    }
    function getAltitude(altitude, layer, altCache = {}) {
        if (altitude !== undefined && typeof altitude === 'number' && altitude !== 0) {
            if (altCache[altitude] === undefined) {
                altCache[altitude] = layer.altitudeToVector3(altitude, altitude).x;
            }
            return altCache[altitude];
        }
        return 0;
    }
    function mergeOptions(properties, baseOptions) {
        if (!baseOptions) {
            return properties || {};
        }
        return Object.assign({}, baseOptions, properties);
    }
    /**
     * generate extrudepolygons data for worker
     * @param {*} polygons
     * @param {*} layer
     */
    function gengerateExtrudePolygons(polygons = [], center, layer, options = [], baseOptions) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const len = polygons.length;
        const datas = [], transfer = [], altCache = {};
        for (let i = 0; i < len; i++) {
            const polygon = polygons[i];
            const p = polygon;
            let properties = options[i] ? options[i] : getPolygonProperties(p);
            properties = mergeOptions(properties, baseOptions);
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let data;
            if (isMercator) {
                data = getPolygonArrayBuffer(polygon);
            }
            else {
                data = getPolygonPositions(polygon, layer, properties.center || center, centerPt, true);
            }
            for (let j = 0, len1 = data.length; j < len1; j++) {
                const d = data[j];
                for (let m = 0, len2 = d.length; m < len2; m++) {
                    //ring
                    transfer.push(d[m]);
                }
            }
            let height = properties.height || 1;
            let bottomHeight = properties.bottomHeight || 0;
            const top = properties.top;
            height = getAltitude(height, layer, altCache);
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const d = {
                id: properties.id,
                data,
                height,
                bottomHeight,
                top
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
            //delete Internal properties
            if (p._properties) {
                delete p._properties;
            }
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    /**
     * generate ExtrudeLines data for worker
     * @param {*} lineStringList
     * @param {*} center
     * @param {*} layer
     */
    function gengerateExtrudeLines(lineStringList, center, layer, lineStrings, options = [], baseOptions) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const datas = [], transfer = [], cache = {}, altCache = {};
        const len = lineStringList.length;
        for (let i = 0; i < len; i++) {
            const multiLineString = lineStringList[i];
            let properties = options[i] ? options[i] : getLineStringProperties(lineStrings[i]);
            properties = mergeOptions(properties, baseOptions);
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let width = properties.width || 1;
            let height = properties.height || 1;
            let cornerRadius = properties.cornerRadius || 0;
            let bottomHeight = properties.bottomHeight || 0;
            const pathUV = properties.pathUV;
            //for ExtrudeLineTrail ,slice lines the center is lineCenter
            const parentCenter = properties.parentCenter;
            width = getDistance(width, layer, cache);
            cornerRadius = getDistance(cornerRadius, layer, cache);
            height = getAltitude(height, layer, altCache);
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const data = [];
            for (let j = 0, len1 = multiLineString.length; j < len1; j++) {
                const lineString = multiLineString[j];
                let arrayBuffer;
                if (isMercator) {
                    arrayBuffer = getLineArrayBuffer(lineString, layer);
                }
                else {
                    arrayBuffer = getLinePosition(lineString, layer, parentCenter || center, false).arrayBuffer;
                }
                transfer.push(arrayBuffer);
                data.push(arrayBuffer);
            }
            const d = {
                id: properties.id,
                data,
                height,
                width,
                cornerRadius,
                bottomHeight,
                pathUV
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    /**
     * generate Lines data for worker
     * @param lineStringList
     * @param center
     * @param layer
     * @param lineStrings
     * @param options
     * @returns
     */
    function gengerateLines(lineStringList, center, layer, lineStrings, options = [], baseOptions) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const datas = [], transfer = [], altCache = {};
        const len = lineStringList.length;
        for (let i = 0; i < len; i++) {
            const multiLineString = lineStringList[i];
            let properties = options[i] ? options[i] : getLineStringProperties(lineStrings[i]);
            properties = mergeOptions(properties, baseOptions);
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let bottomHeight = properties.bottomHeight || 0;
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const data = [];
            for (let j = 0, len1 = multiLineString.length; j < len1; j++) {
                const lineString = multiLineString[j];
                if (isMercator) {
                    const arrayBuffer = getLineArrayBuffer(lineString, layer);
                    transfer.push(arrayBuffer);
                    data.push(arrayBuffer);
                }
                else {
                    const arrayBuffer = getLinePosition(lineString, layer, center, false).arrayBuffer;
                    transfer.push(arrayBuffer);
                    data.push(arrayBuffer);
                }
            }
            const d = {
                id: properties.id,
                data,
                bottomHeight
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    function generateBars(data) {
        const len = data.length;
        const datas = new Float32Array(len * 7);
        let idx = 0;
        for (let i = 0; i < len; i++) {
            let { center, radialSegments, radius, height, altitude, id } = data[i];
            center = center || [0, 0];
            datas[idx] = center[0];
            datas[idx + 1] = center[1];
            datas[idx + 2] = radialSegments || 6;
            datas[idx + 3] = radius || 1;
            datas[idx + 4] = height;
            datas[idx + 5] = altitude || 0;
            datas[idx + 6] = id;
            idx += 7;
        }
        const buffer = datas.buffer;
        return {
            datas: buffer, transfer: [buffer]
        };
    }

    function getDatas(queues) {
        return queues.map(q => {
            return q.data;
        });
    }
    function getOptions(queues) {
        return queues.map(q => {
            return q.option || q.baseObject.getOptions();
        });
    }
    class BaseObjectTask {
        constructor() {
            this.queueMap = {};
            this.tempQueue = [];
            this.time = this.getCurrentTime();
            this.deQueueCount = 5;
            this.resultQueue = [];
        }
        getActor() {
            return getActor();
        }
        getCurrentTime() {
            return maptalks__namespace.Util.now();
        }
        loop() {
            this.deQueue();
        }
        push(data) {
            this.tempQueue.push(data);
            if (data.id) {
                this.queueMap[data.id] = data;
            }
            return this;
        }
        reset() {
            this.time = this.getCurrentTime();
            this.tempQueue = [];
            return this;
        }
        pushResult(result) {
            if (!result) {
                return;
            }
            if (!Array.isArray(result)) {
                result = [result];
            }
            result.forEach(d => {
                this.resultQueue.push(d);
            });
            return this;
        }
        deQueue() {
            if (!this.resultQueue.length) {
                return this;
            }
            const count = this.deQueueCount;
            const resultList = this.resultQueue.slice(0, count) || [];
            resultList.forEach(result => {
                const { id } = result;
                if (this.queueMap[id]) {
                    const { baseObject } = this.queueMap[id];
                    if (baseObject && baseObject._workerLoad) {
                        const layer = baseObject.getLayer();
                        if (layer) {
                            baseObject._workerLoad(result);
                        }
                        else {
                            console.warn(baseObject, ' worker Processing completed but removed from the layer');
                        }
                    }
                    delete this.queueMap[id];
                }
            });
            this.resultQueue.splice(0, count);
            return this;
        }
    }
    class ExtrudePolygonTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'ExtrudePolygon',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudePolygonsTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'ExtrudePolygons',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudeLineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'ExtrudeLine',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudeLinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'ExtrudeLines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class LineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 200;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'Line',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class LinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'Lines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class FatLineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'FatLine',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class FatLinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'FatLines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class BarTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'Bar',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class BarsTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 1;
        }
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'Bars',
                        layer: queue.layer,
                        data: queue.data,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class PathTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'Path',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class PathsTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'Paths',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    const ExtrudePolygonTaskIns = new ExtrudePolygonTask();
    const ExtrudePolygonsTaskIns = new ExtrudePolygonsTask();
    const ExtrudeLineTaskIns = new ExtrudeLineTask();
    const ExtrudeLinesTaskIns = new ExtrudeLinesTask();
    const LineTaskIns = new LineTask();
    const LinesTaskIns = new LinesTask();
    const FatLineTaskIns = new FatLineTask();
    const FatLinesTaskIns = new FatLinesTask();
    const BarTaskIns = new BarTask();
    const BarsTaskIns = new BarsTask();
    const PathTaskIns = new PathTask();
    const PathsTaskIns = new PathsTask();
    const BaseObjectTaskManager = {
        isRunning: false,
        tasks: [],
        addTask: (taskIns) => {
            if (taskIns) {
                BaseObjectTaskManager.tasks.push(taskIns);
            }
        },
        removeTask: (taskIns) => {
            const index = BaseObjectTaskManager.tasks.indexOf(taskIns);
            if (index > -1) {
                BaseObjectTaskManager.tasks.splice(index, 1);
            }
        },
        loop() {
            ExtrudePolygonTaskIns.loop();
            ExtrudePolygonsTaskIns.loop();
            ExtrudeLineTaskIns.loop();
            ExtrudeLinesTaskIns.loop();
            LineTaskIns.loop();
            LinesTaskIns.loop();
            FatLineTaskIns.loop();
            FatLinesTaskIns.loop();
            BarTaskIns.loop();
            BarsTaskIns.loop();
            PathTaskIns.loop();
            PathsTaskIns.loop();
            BaseObjectTaskManager.tasks.forEach(taskIns => {
                if (taskIns && taskIns.loop) {
                    taskIns.loop();
                }
            });
            requestAnimationFrame(BaseObjectTaskManager.loop);
        },
        star() {
            if (!BaseObjectTaskManager.isRunning) {
                BaseObjectTaskManager.isRunning = true;
                BaseObjectTaskManager.loop();
            }
        }
    };

    function mergeBufferGeometries(geometries) {
        const { position, normal, uv, indices } = mergeBufferGeometriesAttribute(geometries);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        const color = new Float32Array(position.length);
        color.fill(1, 0, position.length);
        addAttribute(bufferGeomertry, 'color', new THREE__namespace.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        if (uv && uv.length) {
            addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        }
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    function mergeBufferGeometriesAttribute(geometries) {
        const attributes = {}, attributesLen = {};
        for (let i = 0; i < geometries.length; ++i) {
            const geometry = geometries[i];
            for (const name in geometry) {
                if (attributes[name] === undefined) {
                    attributes[name] = [];
                    attributesLen[name] = 0;
                }
                attributes[name].push(geometry[name]);
                attributesLen[name] += geometry[name].length;
            }
        }
        // merge attributes
        const mergedGeometry = {};
        let indexOffset = 0;
        const mergedIndex = new Uint32Array(attributesLen['indices']);
        for (const name in attributes) {
            if (name === 'indices') {
                const indices = attributes[name];
                let iIndex = 0;
                for (let i = 0, len = indices.length; i < len; i++) {
                    const index = indices[i];
                    for (let j = 0, len1 = index.length; j < len1; j++) {
                        mergedIndex[iIndex] = index[j] + indexOffset;
                        iIndex++;
                        // mergedIndex.push(index[j] + indexOffset);
                    }
                    indexOffset += attributes['position'][i].length / 3;
                }
            }
            else {
                const mergedAttribute = mergeBufferAttributes(attributes[name], attributesLen[name]);
                if (!mergedAttribute)
                    return null;
                mergedGeometry[name] = mergedAttribute;
            }
        }
        mergedGeometry['indices'] = mergedIndex;
        return mergedGeometry;
    }
    function mergeBufferAttributes(attributes, arrayLength) {
        const array = new Float32Array(arrayLength);
        let offset = 0;
        for (let i = 0; i < attributes.length; ++i) {
            array.set(attributes[i], offset);
            offset += attributes[i].length;
        }
        return array;
    }
    function generateBufferGeometry(data) {
        //arraybuffer data
        const { position, normal, uv, indices } = data;
        // const color = new Float32Array(position.length);
        // color.fill(1, 0, position.length);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        // addAttribute(bufferGeomertry, 'color', new THREE.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(new Float32Array(normal), 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(position), 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(new Float32Array(uv), 2));
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(new Uint32Array(indices), 1));
        return bufferGeomertry;
    }
    function generatePickBufferGeometry(geometry) {
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'normal', geometry.getAttribute('normal'));
        addAttribute(bufferGeomertry, 'position', geometry.getAttribute('position').clone());
        bufferGeomertry.setIndex(geometry.getIndex());
        return bufferGeomertry;
    }
    let defaultBufferGeometry;
    function getDefaultBufferGeometry() {
        if (!defaultBufferGeometry) {
            const SIZE = 0.000001;
            defaultBufferGeometry = getBoxGeometry(SIZE, SIZE, SIZE);
        }
        return defaultBufferGeometry;
    }
    getDefaultBufferGeometry();

    var MergeGeometryUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mergeBufferGeometries: mergeBufferGeometries,
        mergeBufferGeometriesAttribute: mergeBufferGeometriesAttribute,
        generateBufferGeometry: generateBufferGeometry,
        generatePickBufferGeometry: generatePickBufferGeometry,
        getDefaultBufferGeometry: getDefaultBufferGeometry
    });

    // type Cache = {
    //     [key: number]: THREE.BufferGeometry
    // }
    // const barGeometryCache: Cache = {};
    const defaultBoxGeometry = getBoxGeometry(1, 1, 1);
    defaultBoxGeometry.translate(0, 0, 0.5);
    const topColor = new THREE__namespace.Color('#fff'), bottomColor = new THREE__namespace.Color('#fff');
    // function getDefaultCylinderBufferGeometry(radialSegments: number = 6): THREE.BufferGeometry {
    //     if (!barGeometryCache[radialSegments]) {
    //         const geometry = new THREE.CylinderBufferGeometry(1, 1, 1, radialSegments, 1);
    //         geometry.rotateX(Math.PI / 2);
    //         geometry.translate(0, 0, 0.5);
    //         geometry.rotateZ(Math.PI / 6);
    //         barGeometryCache[radialSegments] = geometry;
    //     }
    //     return barGeometryCache[radialSegments];
    // }
    function getClylinderGeometry(property) {
        const { position, normal, uv, indices } = cylinder(property.center || [0, 0], property);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    /**
     * Reuse Geometry   , Meter as unit
     * @param {*} property
     */
    // eslint-disable-next-line no-unused-vars
    function getGeometry(property) {
        // const {
        //     height,
        //     radialSegments,
        //     radius
        // } = property;
        // const geometry = getDefaultCylinderBufferGeometry(radialSegments).clone();
        // geometry.scale(radius, radius, height);
        // return geometry;
        const options = Object.assign({}, property);
        if (options._radius) {
            options.radius = options._radius;
        }
        return getClylinderGeometry(options);
    }
    /**
     * init Colors
     * @param {*} geometry
     * @param {*} color
     * @param {*} _topColor
     */
    function initVertexColors(geometry, color, _topColor, key = 'y', minZ = 0) {
        let offset = 0;
        if (key === 'y') {
            offset = 1;
        }
        else if (key === 'z') {
            offset = 2;
        }
        const position = geometry.attributes.position.array;
        const len = position.length;
        bottomColor.setStyle(color);
        topColor.setStyle(_topColor);
        const colors = new Float32Array(len);
        if (Array.isArray(minZ)) {
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { middleZ, start, end } = minZ[i].position;
                for (let j = start; j < end; j += 3) {
                    const z = position[j + 2];
                    if (z > middleZ) {
                        colors[j] = topColor.r;
                        colors[j + 1] = topColor.g;
                        colors[j + 2] = topColor.b;
                    }
                    else {
                        colors[j] = bottomColor.r;
                        colors[j + 1] = bottomColor.g;
                        colors[j + 2] = bottomColor.b;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < len; i += 3) {
                const y = position[i + offset];
                if (y > minZ) {
                    colors[i] = topColor.r;
                    colors[i + 1] = topColor.g;
                    colors[i + 2] = topColor.b;
                    // colors.push(topColor.r, topColor.g, topColor.b);
                }
                else {
                    colors[i] = bottomColor.r;
                    colors[i + 1] = bottomColor.g;
                    colors[i + 2] = bottomColor.b;
                    // colors.push(bottomColor.r, bottomColor.g, bottomColor.b);
                }
            }
        }
        addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
        return colors;
    }
    function mergeBarGeometry(geometries) {
        const attributes = [];
        const len = geometries.length;
        let colorLen = 0;
        for (let i = 0; i < len; i++) {
            const { color } = geometries[i].attributes;
            if (color) {
                colorLen += color.array.length;
            }
        }
        const colors = new Float32Array(colorLen);
        let offset = 0;
        for (let i = 0, len = geometries.length; i < len; i++) {
            const { color, normal, position, uv } = geometries[i].attributes;
            const index = geometries[i].index;
            if (color) {
                colors.set(color.array, offset);
                offset += color.array.length;
                // for (let j = 0, len1 = color.array.length; j < len1; j++) {
                //     colors.push(color.array[j]);
                // }
            }
            attributes.push({
                // color: color.array,
                normal: normal.array,
                uv: uv.array,
                position: position.array,
                indices: index.array
            });
        }
        const bufferGeometry = mergeBufferGeometries(attributes);
        if (colors.length) {
            addAttribute(bufferGeometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            // for (let i = 0, len = colors.length; i < len; i++) {
            //     bufferGeometry.attributes.color.array[i] = colors[i];
            // }
        }
        for (let i = 0, len = geometries.length; i < len; i++) {
            geometries[i].dispose();
        }
        return bufferGeometry;
    }
    function getDefaultBoxGeometry() {
        return defaultBoxGeometry;
    }

    const OPTIONS$l = {
        radius: 10,
        height: 100,
        radialSegments: 6,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class Bar extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$l, options, { layer, coordinate });
            super();
            this._initOptions(options);
            const { height, radius, topColor, bottomColor, altitude, asynchronous } = options;
            options.height = layer.altitudeToVector3(height, height).x;
            options.radius = layer.distanceToVector3(radius, radius).x;
            let geometry;
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                BarTaskIns.push({
                    data: { radius: options.radius, height: options.height, radialSegments: options.radialSegments, id },
                    layer,
                    id,
                    baseObject: this
                });
            }
            else {
                geometry = getGeometry(options);
                if (topColor) {
                    initVertexColors(geometry, bottomColor, topColor, 'z', options.height / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Bar';
        }
        _workerLoad(data) {
            const bufferGeometry = generateBufferGeometry(data);
            const { topColor, bottomColor, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors(bufferGeometry, bottomColor, topColor, 'z', extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    function initColors(cs) {
        const colors = [];
        if (cs && cs.length) {
            cs.forEach(color => {
                color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                colors.push(color.r, color.g, color.b);
            });
        }
        return colors;
    }
    const OPTIONS$k = {
        altitude: 0,
        bottomHeight: 0,
        colors: null
    };
    /**
     *
     */
    class Line extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$k, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { lineStrings, center } = LineStringSplit(lineString);
            const { asynchronous } = options;
            let geometry;
            if (asynchronous) {
                geometry = getDefaultLineGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                LineTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    key: options.key,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const positionList = [];
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const lineString = lineStrings[i];
                    const { positions } = getLinePosition(lineString, layer, center, false);
                    positionList.push(getLineSegmentPosition(positions));
                }
                const position = mergeLinePositions(positionList);
                geometry = new THREE__namespace.BufferGeometry();
                addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
                setBottomHeight(geometry, options.bottomHeight, layer);
                const colors = initColors(options.colors);
                if (colors && colors.length) {
                    addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3));
                    material.vertexColors = getVertexColors();
                }
            }
            this._createLineSegments(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'Line';
        }
        _workerLoad(result) {
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(result.position), 3));
            const colors = initColors(this.getOptions().colors);
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (colors && colors.length) {
                addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3));
                material.vertexColors = getVertexColors();
            }
            this._computeLineDistances(geometry);
            object3d.geometry = geometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$j = {
        bottomHeight: 0,
        width: 3,
        height: 1,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true,
        pathUV: false
    };
    /**
     *
     */
    class ExtrudeLine extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$j, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { height, width, bottomColor, topColor, bottomHeight, altitude, asynchronous, pathUV } = options;
            const h = layer.altitudeToVector3(height, height).x;
            const w = layer.distanceToVector3(width, width).x;
            const { lineStrings, center } = LineStringSplit(lineString);
            let geometry;
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                ExtrudeLineTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    center,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const extrudeParams = [];
                let minZ = 0;
                const cache = {};
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const attribute = getExtrudeLineParams(lineStrings[i], w, h, pathUV, layer, center);
                    minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                    extrudeParams.push(attribute);
                }
                geometry = mergeBufferGeometries(extrudeParams);
                if (topColor) {
                    initVertexColors$1(geometry, bottomColor, topColor, minZ + h / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            // const center = (isGeoJSON(lineString) ? getGeoJSONCenter(lineString) : lineString.getCenter());
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'ExtrudeLine';
        }
        _workerLoad(result) {
            const bufferGeometry = generateBufferGeometry(result);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors$1(bufferGeometry, bottomColor, topColor, h + extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$i = {
        altitude: 0,
        height: 1,
        bottomHeight: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true,
        top: true
    };
    /**
     *
     */
    class ExtrudePolygon extends BaseObject {
        constructor(polygon, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$i, options, { layer, polygon });
            super();
            this._initOptions(options);
            const { height, topColor, bottomColor, altitude, bottomHeight, asynchronous, top } = options;
            let geometry;
            const center = (isGeoJSONPolygon(polygon) ? getGeoJSONCenter(polygon) : polygon.getCenter());
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                ExtrudePolygonTaskIns.push({
                    data: polygon,
                    layer,
                    id,
                    baseObject: this
                });
            }
            else {
                geometry = getExtrudeGeometry(polygon, height, top, layer);
                const h = setBottomHeight(geometry, bottomHeight, layer);
                if (topColor) {
                    const extrudeH = layer.altitudeToVector3(height, height).x;
                    initVertexColors$1(geometry, bottomColor, topColor, h + extrudeH / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'ExtrudePolygon';
        }
        _workerLoad(data) {
            const bufferGeometry = generateBufferGeometry(data);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors$1(bufferGeometry, bottomColor, topColor, h + extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$h = {
        altitude: 0,
        coordinate: null
    };
    /**
     * Model container
     */
    class Model extends BaseObject {
        constructor(model, options = {}, layer) {
            if (!options.coordinate) {
                console.warn('coordinate is null,it is important to locate the model');
                options.coordinate = layer.getMap().getCenter();
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$h, options, { layer, model });
            super();
            this._initOptions(options);
            this._createGroup();
            this.getObject3d().add(model);
            const { altitude, coordinate } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Model';
        }
        getCoordinates() {
            const coordinate = this.options.coordinate;
            const altitude = this.options.altitude;
            const c = new maptalks__namespace.Coordinate(coordinate);
            c.z = altitude;
            return c;
        }
    }

    const PI = Math.PI / 180;
    const R = 6378137;
    const MINLENGTH = 0.1;
    function formatLineArray(polyline) {
        const lnglats = polyline.getCoordinates();
        return lnglats.map(lnglat => {
            return lnglat.toArray();
        });
    }
    function degreesToRadians(d) {
        return d * PI;
    }
    function distance(c1, c2) {
        if (!c1 || !c2) {
            return 0;
        }
        if (!Array.isArray(c1)) {
            c1 = c1.toArray();
        }
        if (!Array.isArray(c2)) {
            c2 = c2.toArray();
        }
        let b = degreesToRadians(c1[1]);
        const d = degreesToRadians(c2[1]), e = b - d, f = degreesToRadians(c1[0]) - degreesToRadians(c2[0]);
        b = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(e / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin(f / 2), 2)));
        b *= R;
        return Math.round(b * 1E5) / 1E5;
    }
    function lineLength(polyline) {
        let lnglatArray = polyline;
        if (!Array.isArray(polyline)) {
            lnglatArray = formatLineArray(polyline);
        }
        let l = 0;
        for (let i = 0, len = lnglatArray.length; i < len - 1; i++) {
            l += distance(lnglatArray[i], lnglatArray[i + 1]);
        }
        return l;
    }
    function getPercentLngLat(l, length) {
        const { len, c1, c2 } = l;
        const dx = c2[0] - c1[0], dy = c2[1] - c1[1];
        const percent = length / len;
        const lng = c1[0] + percent * dx;
        const lat = c1[1] + percent * dy;
        return [lng, lat];
    }
    /**
     * This is not an accurate line segment cutting method, but rough, in order to speed up the calculation,
     * the correct cutting algorithm can be referred to. http://turfjs.org/docs/#lineChunk
     * @param {*} cs
     * @param {*} lineChunkLength
     */
    function lineSlice(cs, lineChunkLength = 10) {
        lineChunkLength = Math.max(lineChunkLength, MINLENGTH);
        if (!Array.isArray(cs)) {
            cs = formatLineArray(cs);
        }
        const LEN = cs.length;
        let list = [];
        let totalLen = 0;
        for (let i = 0; i < LEN - 1; i++) {
            const len = distance(cs[i], cs[i + 1]);
            const floorlen = Math.floor(len);
            list.push({
                c1: cs[i],
                len: floorlen,
                c2: cs[i + 1]
            });
            totalLen += floorlen;
        }
        if (totalLen <= lineChunkLength) {
            const lnglats = list.map(d => {
                return [d.c1, d.c2];
            });
            return lnglats;
        }
        if (list.length === 1) {
            if (list[0].len <= lineChunkLength) {
                return [
                    [list[0].c1, list[0].c2]
                ];
            }
        }
        const LNGLATSLEN = list.length;
        const first = list[0];
        let idx = 0;
        let currentLngLat;
        let currentLen = 0;
        const lines = [];
        let lls = [first.c1];
        while (idx < LNGLATSLEN) {
            const { len, c2 } = list[idx];
            currentLen += len;
            if (currentLen < lineChunkLength) {
                lls.push(c2);
                if (idx === LNGLATSLEN - 1) {
                    lines.push(lls);
                }
                idx++;
            }
            if (currentLen === lineChunkLength) {
                lls.push(c2);
                currentLen = 0;
                lines.push(lls);
                //next
                lls = [c2];
                idx++;
            }
            if (currentLen > lineChunkLength) {
                const offsetLen = (len - currentLen + lineChunkLength);
                currentLngLat = getPercentLngLat(list[idx], offsetLen);
                lls.push(currentLngLat);
                lines.push(lls);
                currentLen = 0;
                list[idx].c1 = currentLngLat;
                list[idx].len = len - offsetLen;
                //next
                lls = [];
                lls.push(currentLngLat);
            }
        }
        return lines;
    }

    var GeoUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        distance: distance,
        lineLength: lineLength,
        lineSlice: lineSlice
    });

    const MAX_POINTS = 1000;
    /**
     *
     * @param {THREE.BufferGeometry} geometry
     * @param {*} ps
     * @param {*} norls
     * @param {*} indices
     */
    function setExtrudeLineGeometryAttribute(geometry, ps, norls, indices) {
        const len = ps.length;
        geometry.attributes.normal.count = len;
        geometry.attributes.position.count = len;
        const positions = geometry.attributes.position.array;
        const normals = geometry.attributes.normal.array;
        for (let i = 0; i < len; i++) {
            positions[i] = ps[i];
            normals[i] = norls[i];
        }
        // geometry.index.array = new Uint16Array(indices.length);
        geometry.index.count = indices.length;
        // geometry.index.needsUpdate = true;
        for (let i = 0, len1 = indices.length; i < len1; i++) {
            geometry.index.array[i] = indices[i];
        }
        // geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
        // geometry.setDrawRange(0, len / 3);
    }
    const OPTIONS$g = {
        trail: 5,
        chunkLength: 50,
        width: 2,
        height: 1,
        speed: 1,
        altitude: 0,
        interactive: false,
        heightEnable: true,
        pathUV: false
    };
    /**
     *
     */
    class ExtrudeLineTrail extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$g, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { width, height, altitude, speed, chunkLength, trail, pathUV } = options;
            let center, coordinates;
            if (isGeoJSON(lineString)) {
                center = getGeoJSONCenter(lineString);
                coordinates = getGeoJSONCoordinates(lineString);
            }
            else {
                center = lineString.getCenter();
                coordinates = lineString;
            }
            const chunkLines = lineSlice(coordinates, chunkLength);
            const centerPt = layer.coordinateToVector3(center);
            //cache position for  faster computing,reduce double counting
            // const positionMap: { [key: string]: THREE.Vector3 } = {};
            // const positions = getChunkLinesPosition(chunkLines.slice(0, 1), layer, positionMap, centerPt).positionsV;
            //generate geometry
            const geometry = new THREE__namespace.BufferGeometry();
            const ps = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            const norls = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            const inds = new Uint16Array(MAX_POINTS);
            addAttribute(geometry, 'position', (new THREE__namespace.BufferAttribute(ps, 3)));
            addAttribute(geometry, 'normal', (new THREE__namespace.BufferAttribute(norls, 3)));
            geometry.setIndex(new THREE__namespace.BufferAttribute(inds, 1));
            const lineWidth = layer.distanceToVector3(width, width).x;
            const depth = layer.altitudeToVector3(height, height).x;
            // const params = getExtrudeLineParams(positions, lineWidth, depth, layer);
            // setExtrudeLineGeometryAttribute(geometry, params.position, params.normal, params.indices);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this._params = {
                index: 0,
                chunkLines,
                geometries: [],
                layer,
                trail: Math.max(1, trail),
                lineWidth,
                depth,
                speed: Math.min(1, speed),
                idx: 0,
                loaded: true,
                center,
                // positionMap,
                centerPt,
                workerInitCount: 0,
                pathUV
            };
            this._init(this._params);
            this.type = 'ExtrudeLineTrail';
        }
        /**
         * Follow-up support for adding webworker
         * @param {*} params
         */
        _init(params) {
            const { layer, trail, lineWidth, depth, chunkLines, positionMap, centerPt, center, pathUV } = params;
            const len = chunkLines.length, geometries = [];
            if (this.options.asynchronous) {
                params.loaded = false;
                const parentId = maptalks__namespace.Util.GUID();
                for (let i = 0; i < len; i++) {
                    const lines = chunkLines.slice(i, i + trail);
                    const coordinates = mergeChunkLineCoordinates(lines);
                    const lineString = {
                        type: 'Feature',
                        geometry: {
                            type: "LineString",
                            coordinates
                        }
                    };
                    const id = `${parentId}-${i}`;
                    const option = maptalks__namespace.Util.extend({}, this.options);
                    option.parentCenter = center;
                    option.id = id;
                    option.center = center;
                    ExtrudeLineTaskIns.push({
                        id,
                        data: [lineString],
                        layer,
                        center,
                        lineString,
                        baseObject: this,
                        option
                    });
                }
            }
            else {
                for (let i = 0; i < len; i++) {
                    const lines = chunkLines.slice(i, i + trail);
                    const ps = getChunkLinesPosition(lines, layer, positionMap, centerPt).positionsV;
                    geometries.push(getExtrudeLineParams(ps, lineWidth, depth, pathUV, layer));
                }
            }
        }
        _animation() {
            const { index, geometries, speed, idx, chunkLines, trail, lineWidth, depth, loaded, layer, positionMap, centerPt, pathUV } = this._params;
            if (!loaded)
                return;
            const i = Math.round(index);
            if (i > idx && i <= chunkLines.length - 1) {
                // console.log(i, geometries.length);
                this._params.idx++;
                let p = geometries[i];
                //if not init, this is will running
                if (!p) {
                    const lines = chunkLines.slice(i, i + trail);
                    const ps = getChunkLinesPosition(lines, layer, positionMap, centerPt).positionsV;
                    p = getExtrudeLineParams(ps, lineWidth, depth, pathUV, layer);
                    geometries[i] = p;
                }
                const object3d = this.getObject3d();
                setExtrudeLineGeometryAttribute(object3d.geometry, p.position, p.normal, p.indices);
                object3d.geometry.attributes.position.needsUpdate = true;
                object3d.geometry.attributes.normal.needsUpdate = true;
                object3d.geometry.index.needsUpdate = true;
            }
            if (index >= chunkLines.length - 1) {
                this._params.index = -1;
                this._params.idx = -1;
            }
            this._params.index += speed;
        }
        _workerLoad(result) {
            if (!result) {
                return this;
            }
            const { id, indices, position, normal, uv } = result;
            if (!id || !indices || !position || !normal || !uv) {
                return;
            }
            let index = id.split('-')[1];
            index = parseInt(index);
            if (maptalks__namespace.Util.isNumber(index)) {
                const geometries = this._params.geometries;
                geometries[index] = {
                    indices: new Uint32Array(indices),
                    position: new Float32Array(position),
                    uv: new Float32Array(uv),
                    normal: new Float32Array(normal)
                };
                this._params.workerInitCount++;
            }
            if (this._params.workerInitCount === this._params.chunkLines.length) {
                this._params.loaded = true;
                this._fire('workerload', { target: this });
            }
        }
    }

    const EVENTS$1 = ['click', 'mousemove', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].join(' ').toString();
    const defaultMaterial = new THREE__namespace.MeshBasicMaterial();
    defaultMaterial.vertexColors = getVertexColors();
    /**
     * This is for the merger, MergedExtrudeMesh,Points ...
     * @param {*} Base
     */
    const MergedMixin = (Base) => {
        return class extends Base {
            // this._faceMap=[];
            // this._baseObjects = [];
            // this._datas = [];
            // this.faceIndex = null;
            // this.index=null;
            // this._geometriesAttributes = [];
            // this._geometryCache = geometry.clone();
            // this.isHide = false;
            /**
             *
             * @param {*} baseObjects
             */
            _initBaseObjectsEvent(baseObjects) {
                if (baseObjects && Array.isArray(baseObjects) && baseObjects.length) {
                    for (let i = 0, len = baseObjects.length; i < len; i++) {
                        const baseObject = baseObjects[i];
                        this._proxyEvent(baseObject);
                    }
                }
                return this;
            }
            /**
             *Events representing the merge
             * @param {*} baseObject
             */
            _proxyEvent(baseObject) {
                baseObject.on('add', (e) => {
                    this._showGeometry(e.target, true);
                });
                baseObject.on('remove', (e) => {
                    this._showGeometry(e.target, false);
                });
                baseObject.on('mouseout', (e) => {
                    this._mouseover = false;
                    this.fire('mouseout', Object.assign({}, e, { target: this, selectMesh: (this.getSelectMesh ? this.getSelectMesh() : null) }));
                    // this._showGeometry(e.target, false);
                });
                baseObject.on(EVENTS$1, (e) => {
                    this.fire(e.type, Object.assign({}, e, { target: this, selectMesh: (this.getSelectMesh ? this.getSelectMesh() : null) }));
                });
            }
            /**
             * Get the index of the monomer to be hidden
             * @param {*} attribute
             */
            _getHideGeometryIndex(attribute) {
                const indexs = [];
                let count = 0;
                for (let i = 0, len = this._geometriesAttributes.length; i < len; i++) {
                    if (this._geometriesAttributes[i].hide === true) {
                        indexs.push(i);
                        count += this._geometriesAttributes[i][attribute].count;
                    }
                }
                return {
                    indexs,
                    count
                };
            }
            /**
             * update geometry attributes
             * @param {*} bufferAttribute
             * @param {*} attribute
             */
            _updateAttribute(bufferAttribute, attribute) {
                const { indexs } = this._getHideGeometryIndex(attribute);
                const array = this._geometryCache.attributes[attribute].array;
                const len = array.length;
                for (let i = 0; i < len; i++) {
                    bufferAttribute.array[i] = array[i];
                }
                let value = NaN;
                if (this.getObject3d() instanceof THREE__namespace.LineSegments) {
                    value = 0;
                }
                for (let j = 0; j < indexs.length; j++) {
                    const index = indexs[j];
                    const { start, end } = this._geometriesAttributes[index][attribute];
                    for (let i = start; i < end; i++) {
                        bufferAttribute.array[i] = value;
                    }
                }
                return this;
            }
            /**
             * show or hide monomer
             * @param {*} baseObject
             * @param {*} isHide
             */
            _showGeometry(baseObject, isHide) {
                let index;
                if (baseObject) {
                    index = baseObject.getOptions().index;
                }
                if (index != null) {
                    const geometryAttributes = this._geometriesAttributes[index];
                    const { hide } = geometryAttributes;
                    if (hide === isHide) {
                        return this;
                    }
                    geometryAttributes.hide = isHide;
                    const buffGeom = this.getObject3d().geometry;
                    this._updateAttribute(buffGeom.attributes.position, 'position');
                    // this._updateAttribute(buffGeom.attributes.normal, 'normal', 3);
                    // this._updateAttribute(buffGeom.attributes.color, 'color', 3);
                    // this._updateAttribute(buffGeom.attributes.uv, 'uv', 2);
                    buffGeom.attributes.position.needsUpdate = true;
                    // buffGeom.attributes.color.needsUpdate = true;
                    // buffGeom.attributes.normal.needsUpdate = true;
                    // buffGeom.attributes.uv.needsUpdate = true;
                    this.isHide = isHide;
                }
                return this;
            }
            /**
             * Get selected monomer
             */
            // eslint-disable-next-line consistent-return
            getSelectMesh() {
                const index = this._getIndex();
                if (index != null) {
                    return {
                        data: this._datas[index],
                        baseObject: this._baseObjects[index]
                    };
                }
            }
            _getIndex(faceIndex) {
                if (faceIndex == null) {
                    faceIndex = this.faceIndex || this.index;
                }
                return faceIndex;
            }
            _init() {
                const pick = this.getLayer().getPick();
                this.on('add', () => {
                    pick.add(this.pickObject3d);
                });
                this.on('remove', () => {
                    pick.remove(this.pickObject3d);
                });
            }
            //Different objects need to implement their own methods
            _setPickObject3d() {
                if (!this._colorMap) {
                    return;
                }
                // multiplexing geometry
                const geometry = this._geometryCache || this.getObject3d().geometry.clone();
                const pick = this.getLayer().getPick();
                const { _geometriesAttributes } = this;
                const len = _geometriesAttributes.length;
                const colors = getGeometriesColorArray(_geometriesAttributes);
                let cIndex = 0;
                for (let i = 0; i < len; i++) {
                    const color = pick.getColor();
                    const colorIndex = color.getHex();
                    this._colorMap[colorIndex] = i;
                    const { count } = _geometriesAttributes[i].position;
                    this._datas[i].colorIndex = colorIndex;
                    for (let j = 0; j < count; j++) {
                        colors[cIndex] = color.r;
                        colors[cIndex + 1] = color.g;
                        colors[cIndex + 2] = color.b;
                        cIndex += 3;
                    }
                }
                addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
                // const material = new THREE.MeshBasicMaterial();
                // material.vertexColors = THREE.VertexColors;
                const color = pick.getColor();
                const colorIndex = color.getHex();
                const mesh = new THREE__namespace.Mesh(geometry, defaultMaterial);
                mesh.position.copy(this.getObject3d().position);
                mesh['_colorIndex'] = colorIndex;
                this.setPickObject3d(mesh);
            }
        };
    };

    const OPTIONS$f = {
        altitude: 0,
        height: 1,
        bottomHeight: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        top: true
    };
    const TEMP_COORD$1 = new maptalks__namespace.Coordinate(0, 0);
    class ExtrudePolygons extends MergedMixin(BaseObject) {
        constructor(polygons, options, material, layer) {
            if (!Array.isArray(polygons)) {
                polygons = [polygons];
            }
            const len = polygons.length;
            if (len === 0) {
                console.error('polygons is empty');
            }
            // const centers = [];
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0; i < len; i++) {
                const polygon = polygons[i];
                const center = (polygon.getCenter ? polygon.getCenter() : getGeoJSONCenter(polygon, TEMP_COORD$1));
                let x, y;
                if (Array.isArray(center)) {
                    x = center[0];
                    y = center[1];
                }
                else if (center instanceof maptalks__namespace.Coordinate) {
                    x = center.x;
                    y = center.y;
                }
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            // Get the center point of the point set
            const center = new maptalks__namespace.Coordinate((minX + maxX) / 2, (minY + maxY) / 2);
            options = maptalks__namespace.Util.extend({}, OPTIONS$f, options, { layer, polygons, coordinate: center });
            const { topColor, bottomColor, altitude, asynchronous, top } = options;
            let bufferGeometry;
            const extrudePolygons = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                ExtrudePolygonsTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: polygons,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                const centerPt = layer.coordinateToVector3(center);
                const geometries = [];
                let psIndex = 0;
                const altCache = {};
                for (let i = 0; i < len; i++) {
                    const polygon = polygons[i];
                    const opts = maptalks__namespace.Util.extend({}, options, getPolygonProperties(polygon));
                    const height = opts.height || 1;
                    const bottomHeight = opts.bottomHeight || 0;
                    const buffGeom = getExtrudeGeometryParams(polygon, height, top, layer, center, centerPt, altCache);
                    geometries.push(buffGeom);
                    const minZ = setBottomHeight(buffGeom, bottomHeight, layer, altCache);
                    // const extrudePolygon = new ExtrudePolygon(polygon, Object.assign({}, options, { height, index: i }), material, layer);
                    // extrudePolygons.push(extrudePolygon);
                    const { position, normal, uv, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3; uv.length / 2;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ + altCache[height] / 2,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // // color: {
                        // //     count: colorCount,
                        // //     start: colorIndex,
                        // //     end: colorIndex + colorCount * 3,
                        // // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
                if (topColor) {
                    initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                    material.vertexColors = getVertexColors();
                }
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudePolygons;
            this._datas = polygons;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudePolygons);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'ExtrudePolygons';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const polygon = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONPolygon(polygon) ? polygon.properties : polygon.getProperties(), { index });
                    this._baseObjects[index] = new ExtrudePolygon(polygon, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    function positionsConvert(worldPoints, altitude = 0, layer) {
        const vectors = [], cache = {};
        for (let i = 0, len = worldPoints.length; i < len; i += 3) {
            let x = worldPoints[i], y = worldPoints[i + 1], z = worldPoints[i + 2];
            if (altitude > 0) {
                z += altitudeToVector3(altitude, layer, cache);
            }
            vectors.push(new THREE__namespace.Vector3(x, y, z));
        }
        return vectors;
    }
    function vectors2Pixel(worldPoints, size, camera, altitude = 0, layer) {
        if (!(worldPoints[0] instanceof THREE__namespace.Vector3)) {
            worldPoints = positionsConvert(worldPoints, altitude, layer);
        }
        const pixels = worldPoints.map(worldPoint => {
            return vector2Pixel(worldPoint, size, camera);
        });
        return pixels;
    }
    // eslint-disable-next-line camelcase
    function vector2Pixel(world_vector, size, camera) {
        // eslint-disable-next-line camelcase
        const vector = world_vector.project(camera);
        const halfWidth = size.width / 2;
        const halfHeight = size.height / 2;
        const result = {
            x: Math.round(vector.x * halfWidth + halfWidth),
            y: Math.round(-vector.y * halfHeight + halfHeight)
        };
        return result;
    }

    var IdentifyUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        vectors2Pixel: vectors2Pixel,
        vector2Pixel: vector2Pixel
    });

    const OPTIONS$e = {
        altitude: 0,
        height: 0,
        color: null
    };
    const vector$1 = new THREE__namespace.Vector3();
    class Point extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$e, options, { layer, coordinate });
            super();
            let { height, altitude, color, size } = options;
            const vs = [], colors = [];
            if (color) {
                color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                colors.push(color.r, color.g, color.b);
            }
            const z = layer.altitudeToVector3(height, height).x;
            const v = layer.coordinateToVector3(coordinate, z);
            vs.push(0, 0, v.z);
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.Float32BufferAttribute(vs, 3, true));
            if (colors.length) {
                addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3, true));
            }
            if (size !== undefined) {
                addAttribute(geometry, 'size', new THREE__namespace.Float32BufferAttribute([size], 1, true));
            }
            options.positions = v;
            this._initOptions(options);
            this._createPoints(geometry, material);
            const z1 = layer.altitudeToVector3(altitude, altitude).x;
            const v1 = new THREE__namespace.Vector3(v.x, v.y, z1);
            this.getObject3d().position.copy(v1);
            this.type = 'Point';
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         */
        identify(coordinate) {
            const layer = this.getLayer(), size = this.getMap().getSize(), camera = this.getLayer().getCamera(), positions = this.getOptions().positions, altitude = this.getOptions().altitude;
            //Size of points
            let pointSize = this.getObject3d().material.size;
            if (pointSize === undefined) {
                pointSize = this.options.size || 1;
            }
            const pixel = this.getMap().coordToContainerPoint(coordinate);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            vector$1.x = positions.x;
            vector$1.y = positions.y;
            vector$1.z = positions.z + z;
            //3D vector to screen coordinates
            const p = vector2Pixel(vector$1, size, camera);
            //Distance between two points
            const distance = Math.sqrt(Math.pow(pixel.x - p.x, 2) + Math.pow(pixel.y - p.y, 2));
            return (distance <= pointSize / 2);
        }
    }

    const ROW = 30, COL = 30;
    function contains(b, p) {
        const { minx, miny, maxx, maxy } = b;
        const [x, y] = p;
        if (minx <= x && x <= maxx && miny <= y && y <= maxy) {
            return true;
        }
        return false;
    }
    class BBox {
        constructor(minlng, minlat, maxlng, maxlat) {
            this.minlng = minlng;
            this.minlat = minlat;
            this.maxlng = maxlng;
            this.maxlat = maxlat;
            this.minx = Infinity;
            this.miny = Infinity;
            this.maxx = -Infinity;
            this.maxy = -Infinity;
            this.coordinates = [];
            this.positions = [];
            this.indexs = [];
            this.key = null;
        }
        /**
         *
         * @param {*} map
         */
        updateBBoxPixel(map) {
            let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
            const { minlng, minlat, maxlng, maxlat } = this;
            [
                [minlng, minlat],
                [minlng, maxlat],
                [maxlng, minlat],
                [maxlng, maxlat]
            ].map(lnglat => {
                return new maptalks__namespace.Coordinate(lnglat);
            }).map(coordinate => {
                return map.coordToContainerPoint(coordinate);
            }).forEach(pixel => {
                minx = Math.min(minx, pixel.x);
                miny = Math.min(miny, pixel.y);
                maxx = Math.max(maxx, pixel.x);
                maxy = Math.max(maxy, pixel.y);
            });
            this.minx = minx;
            this.miny = miny;
            this.maxx = maxx;
            this.maxy = maxy;
            return this;
        }
        /**
         *Determine whether a point is included
         * @param {*} c
         */
        containsCoordinate(c) {
            let lng, lat;
            if (Array.isArray(c)) {
                lng = c[0];
                lat = c[1];
            }
            else if (c instanceof maptalks__namespace.Coordinate) {
                lng = c.x;
                lat = c.y;
            }
            const { minlng, minlat, maxlng, maxlat } = this;
            return (minlng <= lng && lng <= maxlng && minlat <= lat && lat <= maxlat);
        }
        /**
         *Judge rectangle intersection
         * @param {*} pixel
         * @param {*} size
         */
        isRecCross(pixel, size) {
            const { x, y } = pixel;
            const rec = {
                minx: x - size / 2,
                miny: y - size / 2,
                maxx: x + size / 2,
                maxy: y + size / 2
            };
            const { minx, miny, maxx, maxy } = rec;
            if (contains(this, [minx, miny]) ||
                contains(this, [minx, maxy]) ||
                contains(this, [maxx, miny]) ||
                contains(this, [maxx, maxy]) ||
                contains(rec, [this.minx, this.miny]) ||
                contains(rec, [this.minx, this.maxy]) ||
                contains(rec, [this.maxx, this.miny]) ||
                contains(rec, [this.maxx, this.maxy])) {
                return true;
            }
            return false;
        }
        /**
         *generate grids
         * @param {*} minlng
         * @param {*} minlat
         * @param {*} maxlng
         * @param {*} maxlat
         */
        static initGrids(minlng, minlat, maxlng, maxlat) {
            const grids = [], offsetX = maxlng - minlng, offsetY = maxlat - minlat;
            const averageX = offsetX / COL, averageY = offsetY / ROW;
            let x = minlng, y = minlat;
            for (let i = 0; i < COL; i++) {
                x = minlng + i * averageX;
                for (let j = 0; j < ROW; j++) {
                    y = minlat + j * averageY;
                    const bounds = new BBox(x, y, x + averageX, y + averageY);
                    bounds.key = j + '-' + i;
                    grids.push(bounds);
                }
            }
            return { grids, averageX, averageY, ROWS: ROW, COLS: COL };
        }
    }

    const OPTIONS$d = {
        altitude: 0
    };
    const vector = new THREE__namespace.Vector3();
    function roundFun(value, n) {
        const tempValue = Math.pow(10, n);
        return Math.round(value * tempValue) / tempValue;
    }
    /**
     *points
     */
    class Points extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$d, options, { layer, points });
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0, len = points.length; i < len; i++) {
                const { coordinate } = points[i];
                let x, y;
                if (Array.isArray(coordinate)) {
                    x = coordinate[0];
                    y = coordinate[1];
                }
                else if (coordinate instanceof maptalks__namespace.Coordinate) {
                    x = coordinate.x;
                    y = coordinate.y;
                }
                points[i].coords = [x, y];
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            const centerPt = layer.coordinateToVector3([(minX + maxX) / 2, (minY + maxY) / 2]);
            const { grids, averageX, averageY, ROWS, COLS } = BBox.initGrids(minX, minY, maxX, maxY);
            grids.length;
            const vs = new Float32Array(points.length * 3), vectors = [], colors = new Float32Array(points.length * 3), sizes = new Float32Array(points.length), pointMeshes = [], geometriesAttributes = [];
            const cache = {};
            let maxSize = 0;
            let hasColor = false, hasSize = false;
            const TEMP_VECTOR = new THREE__namespace.Vector3(0, 0, 0);
            for (let i = 0, len = points.length; i < len; i++) {
                let { coordinate, height, color, size, coords } = points[i];
                const idx = i * 3;
                if (color) {
                    hasColor = true;
                    color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                    colors[idx] = color.r;
                    colors[idx + 1] = color.g;
                    colors[idx + 2] = color.b;
                }
                if (size) {
                    hasSize = true;
                    sizes[i] = size;
                    maxSize = Math.max(maxSize, size);
                }
                const z = altitudeToVector3(height, layer, cache);
                const v = layer.coordinateToVector3(coordinate, z);
                TEMP_VECTOR.x = v.x;
                TEMP_VECTOR.y = v.y;
                TEMP_VECTOR.z = v.z;
                TEMP_VECTOR.sub(centerPt);
                // const v1 = v.clone().sub(centerPt);
                vs[idx] = TEMP_VECTOR.x;
                vs[idx + 1] = TEMP_VECTOR.y;
                vs[idx + 2] = TEMP_VECTOR.z;
                vectors.push(v);
                geometriesAttributes[i] = {
                    position: {
                        count: 1,
                        start: i * 3,
                        end: i * 3 + 3
                    },
                    hide: false
                };
                let row = roundFun(((coords[1] - minY) / averageY), 4);
                let col = roundFun(((coords[0] - minX) / averageX), 4);
                row -= 1;
                col -= 1;
                row = Math.max(0, row);
                col = Math.max(0, col);
                row = Math.ceil(row);
                col = Math.ceil(col);
                const gridIndex = col * ROWS + row;
                if (grids[gridIndex]) {
                    grids[gridIndex].positions.push(v);
                    grids[gridIndex].indexs.push(i);
                }
                // for (let j = 0; j < gridslen; j++) {
                //     if (grids[j].containsCoordinate(coordinate)) {
                //         // grids[j].coordinates.push(coordinate);
                //         grids[j].positions.push(v);
                //         grids[j].indexs.push(i);
                //         console.log(j, gridIndex);
                //         break;
                //     }
                // }
            }
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(vs, 3, true));
            if (hasColor) {
                addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            }
            if (hasSize) {
                addAttribute(geometry, 'size', new THREE__namespace.BufferAttribute(sizes, 1, true));
            }
            //for identify
            options.positions = vectors;
            super();
            this._initOptions(options);
            this._createPoints(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            this._baseObjects = pointMeshes;
            this._datas = points;
            this.faceIndex = null;
            this._geometriesAttributes = geometriesAttributes;
            this._geometryCache = geometry.clone();
            this.isHide = false;
            this._initBaseObjectsEvent(pointMeshes);
            this._grids = grids;
            this._bindMapEvents();
            this.type = 'Points';
            this.maxSize = maxSize;
        }
        _bindMapEvents() {
            const map = this.getMap();
            const events = 'zoomstart zooming zoomend movestart moving moveend pitch rotate';
            this.on('add', () => {
                this._updateGrids();
                map.on(events, this._updateGrids, this);
            });
            this.on('remove', () => {
                map.off(events, this._updateGrids, this);
            });
        }
        _updateGrids() {
            const map = this.getMap();
            this._grids.forEach(b => {
                if (b.indexs.length) {
                    b.updateBBoxPixel(map);
                }
            });
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this.faceIndex;
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const data = this._datas[index];
                    const { coordinate, height, color, size } = data;
                    this._baseObjects[index] = new Point(coordinate, { height, index, color, size }, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        /**
       *
       * @param {maptalks.Coordinate} coordinate
       */
        identify(coordinate) {
            const layer = this.getLayer(), size = this.getMap().getSize(), camera = this.getLayer().getCamera(), altitude = this.getOptions().altitude, map = this.getMap();
            const z = layer.altitudeToVector3(altitude, altitude).x;
            let pointSize = this.getObject3d().material.size;
            const isDynamicSize = pointSize === undefined;
            const pixel = map.coordToContainerPoint(coordinate);
            const bs = [];
            this._grids.forEach(b => {
                if (b.indexs.length) {
                    if (b.isRecCross(pixel, isDynamicSize ? this.maxSize : pointSize)) {
                        bs.push(b);
                    }
                }
            });
            if (bs.length < 1) {
                return false;
            }
            for (let i = 0, len = bs.length; i < len; i++) {
                for (let len1 = bs[i].positions.length, j = len1 - 1; j >= 0; j--) {
                    if (isDynamicSize) {
                        pointSize = this._datas[bs[i].indexs[j]].size || 1;
                    }
                    const v = bs[i].positions[j];
                    vector.x = v.x;
                    vector.y = v.y;
                    vector.z = v.z + z;
                    const p = vector2Pixel(vector, size, camera);
                    const distance = Math.sqrt(Math.pow(pixel.x - p.x, 2) + Math.pow(pixel.y - p.y, 2));
                    if (distance <= pointSize / 2) {
                        this.faceIndex = bs[i].indexs[j];
                        return true;
                    }
                }
            }
            return false;
        }
    }

    const OPTIONS$c = {
        coordinate: '',
        radius: 10,
        height: 100,
        radialSegments: 6,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
    };
    /**
     * merged bars
     */
    class Bars extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            const len = points.length;
            const center = getCenterOfPoints(points);
            const centerPt = layer.coordinateToVector3(center);
            const geometries = [], bars = [], geometriesAttributes = [];
            let psIndex = 0;
            const cache = {}, altCache = {};
            super();
            options = maptalks__namespace.Util.extend({}, { altitude: 0, layer, points }, OPTIONS$c, options);
            this._initOptions(options);
            let geometry;
            const TEMP_VECTOR = new THREE__namespace.Vector3();
            if (options.asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                const datas = [];
                for (let i = 0; i < len; i++) {
                    const opts = maptalks__namespace.Util.extend({ index: i }, options, points[i]);
                    const { radius, radialSegments, altitude, height, coordinate } = opts;
                    const r = distanceToVector3(radius, layer, cache);
                    points[i]._radius = r;
                    const h = altitudeToVector3(height, layer, altCache);
                    const alt = altitudeToVector3(altitude, layer, altCache);
                    const v = layer.coordinateToVector3(coordinate, 0, TEMP_VECTOR).sub(centerPt);
                    datas.push({ radialSegments, radius: r, height: h, center: [v.x, v.y], altitude: alt });
                }
                BarsTaskIns.push({
                    id,
                    data: datas,
                    layer,
                    baseObject: this
                });
            }
            else {
                for (let i = 0; i < len; i++) {
                    const opts = maptalks__namespace.Util.extend({ index: i }, options, points[i]);
                    const { radius, radialSegments, altitude, topColor, bottomColor, height, coordinate } = opts;
                    const r = distanceToVector3(radius, layer, cache);
                    const h = altitudeToVector3(height, layer, altCache);
                    const alt = altitudeToVector3(altitude, layer, altCache);
                    const v = layer.coordinateToVector3(coordinate, 0, TEMP_VECTOR).sub(centerPt);
                    const buffGeom = getGeometry({ radius: r, height: h, radialSegments, center: [v.x, v.y] });
                    if (topColor) {
                        initVertexColors(buffGeom, bottomColor, topColor, 'z', h / 2);
                        material.vertexColors = getVertexColors();
                    }
                    // buffGeom.rotateX(Math.PI / 2);
                    const parray = buffGeom.attributes.position.array;
                    for (let j = 0, len1 = parray.length; j < len1; j += 3) {
                        parray[j + 2] += alt;
                        // parray[j] += v.x;
                        // parray[j + 1] += v.y;
                        // parray[j + 2] += v.z;
                    }
                    geometries.push(buffGeom);
                    const bar = new Bar(coordinate, opts, material, layer);
                    bars.push(bar);
                    buffGeom.index.count / 3;
                    const psCount = buffGeom.attributes.position.count; 
                    //  colorCount = buffGeom.attributes.color.count,
                    buffGeom.attributes.normal.count; buffGeom.attributes.uv.count;
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // // color: {
                        // //     count: colorCount,
                        // //     start: colorIndex,
                        // //     end: colorIndex + colorCount * 3,
                        // // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                geometry = mergeBarGeometry(geometries);
            }
            this._createMesh(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = bars;
            this._datas = points;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(geometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(bars);
            if (!options.asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'Bars';
        }
        // eslint-disable-next-line no-unused-vars
        identify() {
            return this.picked;
        }
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const bar = this._datas[index];
                    const opts = Object.assign({}, this.options, bar, { index, asynchronous: false });
                    this._baseObjects[index] = new Bar(bar.coordinate, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors(bufferGeometry, bottomColor, topColor, 'z', geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$b = {
        width: 3,
        height: 1,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        pathUV: false
    };
    class ExtrudeLines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$b, options, { layer, lineStrings, coordinate: center });
            const { altitude, topColor, bottomColor, asynchronous, pathUV } = options;
            let bufferGeometry;
            const extrudeLines = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                ExtrudeLinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                const geometries = [];
                let psIndex = 0;
                const cache = {}, altCache = {};
                for (let i = 0; i < len; i++) {
                    const lineString = lineStrings[i];
                    const opts = maptalks__namespace.Util.extend({}, options, getLineStringProperties(lineString), { index: i });
                    const { height, width, bottomHeight } = opts;
                    const w = distanceToVector3(width, layer, cache);
                    const h = altitudeToVector3(height, layer, altCache);
                    const lls = lineStringList[i];
                    const extrudeParams = [];
                    let minZ = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const attribute = getExtrudeLineParams(lls[m], w, h, pathUV, layer, center);
                        minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                        extrudeParams.push(attribute);
                    }
                    const buffGeom = mergeBufferGeometriesAttribute(extrudeParams);
                    geometries.push(buffGeom);
                    // const extrudeLine = new ExtrudeLine(lineString, opts, material, layer);
                    // extrudeLines.push(extrudeLine);
                    const { position, normal, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ + h / 2,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // color: {
                        //     count: colorCount,
                        //     start: colorIndex,
                        //     end: colorIndex + colorCount * 3,
                        // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                    // colorIndex += colorCount * 3;
                    // uvIndex += uvCount * 2;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
                if (topColor) {
                    initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                    material.vertexColors = getVertexColors();
                }
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudeLines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudeLines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'ExtrudeLines';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties(), { index });
                    this._baseObjects[index] = new ExtrudeLine(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            this.getObject3d().geometry = bufferGeometry;
            this.getObject3d().material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$a = {
        altitude: 0,
        colors: null
    };
    /**
     *
     */
    class Lines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$a, options, { layer, lineStrings, coordinate: center });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            let geometry;
            const lines = [], cache = {};
            let geometriesAttributes = [], psIndex = 0, positionList = [];
            if (asynchronous) {
                geometry = getDefaultLineGeometry();
                LinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                for (let i = 0; i < len; i++) {
                    const lls = lineStringList[i];
                    let psCount = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const properties = getLineStringProperties(lls[m]);
                        const opts = maptalks__namespace.Util.extend({}, options, properties);
                        const { positions } = getLinePosition(lls[m], layer, center, false);
                        setBottomHeight(positions, opts.bottomHeight, layer, cache);
                        psCount += (positions.length / 3 * 2 - 2);
                        positionList.push(getLineSegmentPosition(positions));
                    }
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                const position = mergeLinePositions(positionList);
                geometry = new THREE__namespace.BufferGeometry();
                addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
            }
            this._createLineSegments(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = lines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this.index = null;
            this._geometryCache = geometry.clone();
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(lines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'Lines';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = maptalks__namespace.Util.extend({}, this.getOptions(), { index }, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties());
                    this._baseObjects[index] = new Line(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        _setPickObject3d() {
            if (!this._colorMap) {
                return;
            }
            const geometry = this._geometryCache || this.getObject3d().geometry.clone();
            const pick = this.getLayer().getPick();
            const { _geometriesAttributes } = this;
            const len = _geometriesAttributes.length;
            const colors = getGeometriesColorArray(_geometriesAttributes);
            let cIndex = 0;
            for (let i = 0; i < len; i++) {
                const color = pick.getColor();
                const colorIndex = color.getHex();
                this._colorMap[colorIndex] = i;
                const { count } = _geometriesAttributes[i].position;
                this._datas[i].colorIndex = colorIndex;
                for (let j = 0; j < count; j++) {
                    colors[cIndex] = color.r;
                    colors[cIndex + 1] = color.g;
                    colors[cIndex + 2] = color.b;
                    cIndex += 3;
                }
            }
            addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            const material = this.getObject3d().material.clone();
            material.color.set('#fff');
            material.vertexColors = getVertexColors();
            const color = pick.getColor();
            const colorIndex = color.getHex();
            const mesh = new THREE__namespace.LineSegments(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh['_colorIndex'] = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { position, geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(position), 3));
            this._computeLineDistances(geometry);
            this._geometryCache = geometry.clone();
            this.getObject3d().geometry = geometry;
            this.getObject3d().material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    /*

    Global sharing

    */
    //Maximum concurrent
    const MAX = 10;
    const waitingQueue = [];
    const currentQueue = [];
    function getQueues() {
        return {
            waitingQueue,
            currentQueue
        };
    }
    /**
     *
     * @param {*} key
     * @param {*} url
     * @param {*} callback
     * @param {*} img
     * @param {*} vt
     */
    function pushQueue(key, url, callback, img, vt) {
        // url += `?key=${key}`;
        const q = {
            key,
            url,
            callback,
            img,
            vt
        };
        if (currentQueue.length < MAX) {
            currentQueue.push(q);
            vt.loopMessage(q);
        }
        else {
            waitingQueue.push(q);
        }
    }
    /**
     *
     * @param {*} index
     */
    function outQueue(index) {
        const callback = deleteQueueItem(waitingQueue, index);
        if (callback) {
            callback(index);
        }
    }
    /**
     *
     * @param {*} queArray
     * @param {*} index
     */
    function deleteQueueItem(queArray, index) {
        for (let i = 0, len = queArray.length; i < len; i++) {
            const q = queArray[i];
            if (q) {
                const { key, callback } = q;
                if (index === key) {
                    queArray.splice(i, 1);
                    return callback;
                }
            }
        }
        return null;
    }
    /**
     *
     * @param {*} key
     * @param {*} vt
     */
    function nextLoop(key, vt) {
        deleteQueueItem(currentQueue, key);
        if (waitingQueue.length) {
            currentQueue.push(waitingQueue[0]);
            waitingQueue.splice(0, 1);
            const last = currentQueue[currentQueue.length - 1];
            vt.loopMessage(last);
        }
    }

    const canvas$1 = document.createElement('canvas');
    const SIZE = 256;
    canvas$1.width = canvas$1.height = SIZE;
    let DEFAULT_IMAGE;
    function generateImage$1(key, debug = false) {
        if (DEFAULT_IMAGE) {
            return DEFAULT_IMAGE;
        }
        const ctx = canvas$1.getContext('2d');
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.save();
        DEFAULT_IMAGE = canvas$1.toDataURL();
        return DEFAULT_IMAGE;
    }
    function createCanvas(width = 1, height = 1) {
        let canvas;
        if (typeof document === 'undefined') ;
        else {
            canvas = document.createElement('canvas');
            if (width) {
                canvas.width = width;
            }
            if (height) {
                canvas.height = height;
            }
        }
        return canvas;
    }

    /**
     *
     */
    class BaseVectorTileLayer extends maptalks__namespace.TileLayer {
        constructor(url, options = {}) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, options));
            this._opts = null;
            this._layer = null;
            this.material = null;
            this.getMaterial = null;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._layerLaodTime = new Date().getTime();
        }
        isAsynchronous() {
            return this._opts.worker;
        }
        /**
         *get current all baseobject
         */
        getBaseObjects() {
            const loadTiles = this._loadTiles;
            const baseos = [];
            for (let key in loadTiles) {
                const baseobjects = this._baseObjectKeys[key];
                if (baseobjects && Array.isArray(baseobjects) && baseobjects.length) {
                    for (let i = 0, len = baseobjects.length; i < len; i++) {
                        baseos.push(baseobjects[i]);
                    }
                }
            }
            return baseos;
        }
        /**
       * This method should be overridden for event handling
       * @param {*} type
       * @param {*} e
       */
        // eslint-disable-next-line no-unused-vars
        onSelectMesh(type, e) {
        }
        /**
       * this is can override
       * @param {*} index
       * @param {*} json
       */
        // eslint-disable-next-line no-unused-vars
        formatBaseObjects(index, json) {
            return [];
        }
        //queue loop
        // eslint-disable-next-line no-unused-vars
        loopMessage(q) {
        }
        /**
        *
        * @param {*} q
        */
        getTileData(q) {
            const { key, url, callback, img } = q;
            maptalks__namespace.Ajax.getJSON(url, {}, function (error, res) {
                if (error) {
                    console.error(error);
                    callback(key, null, img);
                }
                else {
                    callback(key, res, img);
                }
            });
        }
        _getCurentTileKeys() {
            const tileGrids = this.getTiles().tileGrids || [];
            const keys = [], keysMap = {};
            for (let i = 0, len = tileGrids.length; i < len; i++) {
                const d = tileGrids[i];
                const tiles = d.tiles || [];
                for (let j = 0, len1 = tiles.length; j < len1; j++) {
                    const { id } = tiles[j];
                    keys.push(id);
                    keysMap[id] = true;
                }
            }
            return { keys, keysMap };
        }
        _isLoad() {
            const { keys } = this._getCurentTileKeys();
            const keys1 = Object.keys(this._renderer.tilesInView);
            if (keys.length === keys1.length) {
                return true;
            }
            return false;
        }
        _layerOnLoad() {
            // This event will be triggered multiple times per unit time
            const time = new Date().getTime();
            const offsetTime = time - this._layerLaodTime;
            if (offsetTime < 20) {
                return;
            }
            this._layerLaodTime = time;
            const tilesInView = this._renderer.tilesInView, loadTiles = this._loadTiles, threeLayer = this._layer, keys = this._baseObjectKeys;
            const tilesInViewLen = Object.keys(tilesInView).length, loadTilesLen = Object.keys(loadTiles).length;
            const needsRemoveBaseObjects = [];
            if (tilesInViewLen && loadTilesLen) {
                for (let index in loadTiles) {
                    if (!tilesInView[index]) {
                        if (keys[index]) {
                            (keys[index] || []).forEach(baseobject => {
                                needsRemoveBaseObjects.push(baseobject);
                            });
                        }
                    }
                }
            }
            if (needsRemoveBaseObjects.length) {
                threeLayer.removeMesh(needsRemoveBaseObjects, false);
            }
            if (tilesInViewLen && loadTilesLen) {
                for (let index in tilesInView) {
                    if (!loadTiles[index]) {
                        if (keys[index]) {
                            const baseobject = keys[index];
                            threeLayer.addMesh(baseobject);
                        }
                        else {
                            const { x, y, z } = this._getXYZOfIndex(index);
                            this.getTileUrl(x, y, z);
                        }
                    }
                }
            }
            this._loadTiles = Object.assign({}, tilesInView);
            this._diffCache();
        }
        _init() {
        }
        _workerLoad(e) {
            const baseobject = e.target;
            const img = baseobject._img;
            img.currentCount++;
            if (img.currentCount === img.needCount) {
                img.src = generateImage$1(img._key, this._opts.debug);
            }
        }
        _generateBaseObjects(index, res, img) {
            if (res && img) {
                const { keysMap } = this._getCurentTileKeys();
                //not in current ,ignore
                if (!keysMap[index]) {
                    img.src = generateImage$1(index, this._opts.debug);
                    return;
                }
                const baseobjects = this.formatBaseObjects(index, res);
                if (baseobjects.length) {
                    img.needCount = baseobjects.length;
                    img.currentCount = 0;
                    for (let i = 0, len = baseobjects.length; i < len; i++) {
                        const baseobject = baseobjects[i];
                        baseobject._img = img;
                        baseobject._vt = this;
                        if (!this.isVisible()) {
                            baseobject.hide();
                        }
                        this._cachetile(index, baseobject);
                        if (!baseobject.isAsynchronous()) {
                            img.currentCount++;
                        }
                    }
                    this._layer.addMesh(baseobjects, false);
                    if (img.needCount === img.currentCount) {
                        img.src = generateImage$1(index, this._opts.debug);
                    }
                    if (this.isAsynchronous()) {
                        baseobjects.filter(baseobject => {
                            return baseobject.isAsynchronous();
                        }).forEach(baseobject => {
                            baseobject.on('workerload', this._workerLoad, this);
                        });
                    }
                    else {
                        img.src = generateImage$1(index, this._opts.debug);
                    }
                }
                else {
                    img.src = generateImage$1(index, this._opts.debug);
                }
                this._loadTiles[index] = true;
            }
            else if (img) {
                img.src = generateImage$1(index, this._opts.debug);
            }
        }
        _diffCache() {
            // if (this._layer.getMap().isInteracting()) {
            //     return;
            // }
            if (Object.keys(this._baseObjectKeys).length > this._renderer.tileCache.max) {
                const tileCache = this._renderer.tileCache.data;
                const tilesInView = this._renderer.tilesInView;
                const needsRemoveBaseObjects = [];
                for (let index in this._baseObjectKeys) {
                    if (!tileCache[index] && !tilesInView[index]) {
                        (this._baseObjectKeys[index] || []).forEach(baseobject => {
                            if (baseobject.isAdd) {
                                needsRemoveBaseObjects.push(baseobject);
                            }
                        });
                        this._diposeBaseObject(index);
                        delete this._baseObjectKeys[index];
                    }
                }
                // Batch deletion can have better performance
                if (needsRemoveBaseObjects.length) {
                    this._layer.removeMesh(needsRemoveBaseObjects, false);
                }
            }
        }
        _diposeBaseObject(index) {
            const baseobjects = this._baseObjectKeys[index];
            if (baseobjects && baseobjects.length) {
                baseobjects.forEach(baseobject => {
                    baseobject.getObject3d().geometry.dispose();
                    if (baseobject._geometryCache) {
                        baseobject._geometryCache.dispose();
                    }
                    const bos = baseobject._baseObjects;
                    if (bos && bos.length) {
                        bos.forEach(bo => {
                            bo.getObject3d().geometry.dispose();
                            bo = null;
                        });
                    }
                    baseobject._datas = null;
                    baseobject._geometriesAttributes = null;
                    baseobject._faceMap = null;
                    baseobject._colorMap = null;
                    if (baseobject.pickObject3d) {
                        baseobject.pickObject3d.geometry.dispose();
                        // baseobject.pickObject3d.material.dispose();
                    }
                    baseobject = null;
                });
            }
        }
        _cachetile(index, baseobject) {
            if (!this._baseObjectKeys[index]) {
                this._baseObjectKeys[index] = [];
            }
            this._baseObjectKeys[index].push(baseobject);
        }
        _getXYZOfIndex(index) {
            const splitstr = index.indexOf('_') > -1 ? '_' : '-';
            let [y, x, z] = index.split(splitstr).slice(1, 4);
            const x1 = parseInt(x);
            const y1 = parseInt(y);
            const z1 = parseInt(z);
            return { x: x1, y: y1, z: z1 };
        }
        _getTileExtent(x, y, z) {
            const map = this.getMap(), res = map._getResolution(z), tileConfig = this._getTileConfig(), tileExtent = tileConfig.getTilePrjExtent(x, y, res);
            return tileExtent;
        }
        /**
         *
         * @param {} x
         * @param {*} y
         * @param {*} z
         */
        _getTileLngLatExtent(x, y, z) {
            const tileExtent = this._getTileExtent(x, y, z);
            let max = tileExtent.getMax(), min = tileExtent.getMin();
            const map = this.getMap();
            const projection = map.getProjection();
            min = projection.unproject(min);
            max = projection.unproject(max);
            return new maptalks__namespace.Extent(min, max);
        }
    }

    const OPTIONS$9 = {
        worker: false
    };
    /**
     *Provide a simple data loading layer with large amount of data
     */
    class ThreeVectorTileLayer extends BaseVectorTileLayer {
        constructor(url, options = {}, getMaterial, layer) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, OPTIONS$9, options));
            this._opts = options;
            this._layer = layer;
            this.getMaterial = getMaterial;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._layerLaodTime = new Date().getTime();
            this._init();
        }
        /**
         * this is can override
         * @param {*} index
         * @param {*} json
         */
        formatBaseObjects(index, json) {
            const opts = this._opts, baseobjects = [];
            const asynchronous = this.isAsynchronous();
            for (let layerName in json) {
                const geojson = json[layerName] || {};
                let features;
                if (Array.isArray(geojson)) {
                    features = geojson;
                }
                else if (geojson.type === 'FeatureCollection') {
                    features = geojson.features;
                }
                if (features && features.length) {
                    const polygons = [], lineStrings = [], points = [];
                    for (let i = 0, len = features.length; i < len; i++) {
                        const feature = features[i];
                        if (isGeoJSONPolygon(feature)) {
                            polygons.push(feature);
                        }
                        else if (isGeoJSONLine(feature)) {
                            const fs = spliteGeoJSONMulti(feature);
                            for (let j = 0, len1 = fs.length; j < len1; j++) {
                                lineStrings.push(fs[j]);
                            }
                        }
                        else if (isGeoJSONPoint(feature)) {
                            const fs = spliteGeoJSONMulti(feature);
                            for (let j = 0, len1 = fs.length; j < len1; j++) {
                                points.push(maptalks__namespace.Util.extend({}, fs[j].properties, fs[j], { coordinate: getGeoJSONCoordinates(fs[j]) }));
                            }
                        }
                    }
                    if (polygons.length) {
                        const material = this._getMaterial(layerName, polygons, index, geojson);
                        if (material) {
                            const extrudepolygons = this._layer.toExtrudePolygons(polygons, maptalks__namespace.Util.extend({}, { topColor: '#fff', layerName, asynchronous, key: index }, opts), material);
                            baseobjects.push(extrudepolygons);
                        }
                    }
                    if (lineStrings.length) {
                        const material = this._getMaterial(layerName, lineStrings, index, geojson);
                        if (material && (material instanceof THREE__namespace.LineBasicMaterial || material instanceof THREE__namespace.LineDashedMaterial)) {
                            const lines = this._layer.toLines(lineStrings, maptalks__namespace.Util.extend({}, { layerName, asynchronous }, opts), material);
                            baseobjects.push(lines);
                        }
                    }
                    if (points.length) {
                        const material = this._getMaterial(layerName, points, index, geojson);
                        if (material && material instanceof THREE__namespace.PointsMaterial) {
                            const ps = this._layer.toPoints(points, maptalks__namespace.Util.extend({}, { layerName, asynchronous }, opts), material);
                            baseobjects.push(ps);
                        }
                    }
                }
            }
            return baseobjects;
        }
        //queue loop
        loopMessage(q) {
            const { currentQueue } = getQueues();
            if (currentQueue.length > 0) {
                this.getTileData(q);
            }
        }
        _init() {
            this.on('layerload', this._layerOnLoad);
            this.on('add', () => {
                if (this._add === false) {
                    const baseobjects = this.getBaseObjects();
                    this._layer.addMesh(baseobjects);
                }
                this._add = true;
                /**
                 * layerload have a bug ,Sometimes it doesn't trigger,I don't know why
                 * Add heartbeat detection mechanism
                 */
                this.intervalId = setInterval(() => {
                    if (this._isLoad() && (!this._layer.getMap().isInteracting())) {
                        this.fire('layerload');
                    }
                }, 1000);
            });
            this.on('remove', () => {
                this._add = false;
                const baseobjects = this.getBaseObjects();
                this._layer.removeMesh(baseobjects);
                clearInterval(this.intervalId);
            });
            this.on('show', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.show();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.show();
                    });
                }
            });
            this.on('hide', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.hide();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.hide();
                    });
                }
            });
            this.on('renderercreate', (e) => {
                e.renderer.loadTile = function loadTile(tile) {
                    var tileSize = this.layer.getTileSize();
                    var tileImage = new Image();
                    tileImage.width = tileSize['width'];
                    tileImage.height = tileSize['height'];
                    tileImage.onload = this.onTileLoad.bind(this, tileImage, tile);
                    tileImage.onerror = this.onTileError.bind(this, tileImage, tile);
                    this.loadTileImage(tileImage, tile['url'], tile.id);
                    return tileImage;
                };
                e.renderer.deleteTile = function (tile) {
                    if (!tile || !tile.image) {
                        return;
                    }
                    tile.image.onload = null;
                    tile.image.onerror = null;
                    const tileinfo = tile.info || {};
                    outQueue(tileinfo.id);
                };
                e.renderer.loadTileImage = (img, url, key) => {
                    img._key = key;
                    pushQueue(key, url, (index, json, image) => {
                        // img.src = generateImage(key, this._opts.debug);
                        this._generateBaseObjects(index, json, image);
                        nextLoop(index, this);
                    }, img, this);
                };
            });
        }
        _getMaterial(layerName, data, index, geojson) {
            if (this.getMaterial && maptalks__namespace.Util.isFunction(this.getMaterial)) {
                return this.getMaterial(layerName, data, index, geojson);
            }
            return null;
        }
    }

    function getPlaneGeometryAttribute(width, height, devideW, devideH) {
        const dx = width / devideW, dy = height / devideH;
        const minX = -width / 2, maxY = height / 2, minY = -height / 2;
        const len = (devideW + 1) * (devideH + 1);
        const position = new Float32Array(len * 3), uv = new Float32Array(len * 2), normal = new Float32Array(len * 3), tempIndex = new Uint32Array(len * 10);
        let index = 0, uIndex = 0, iIndex = 0;
        for (let j = 0; j <= devideH; j++) {
            for (let i = 0; i <= devideW; i++) {
                const x = minX + dx * i;
                const y = maxY - dy * j;
                position[index] = x;
                position[index + 1] = y;
                position[index + 2] = 0;
                normal[index] = 0;
                normal[index + 1] = 0;
                normal[index + 2] = 1;
                const uvx = (x - minX) / width, uvy = (y - minY) / height;
                uv[uIndex] = uvx;
                uv[uIndex + 1] = uvy;
                index += 3;
                uIndex += 2;
                if (i < devideW && j < devideH) {
                    const a = j * (devideW + 1) + i, b = a + 1, c = (devideW + 1) * (j + 1) + i, d = c + 1;
                    tempIndex[iIndex] = a;
                    tempIndex[iIndex + 1] = c;
                    tempIndex[iIndex + 2] = b;
                    tempIndex[iIndex + 3] = c;
                    tempIndex[iIndex + 4] = d;
                    tempIndex[iIndex + 5] = b;
                    iIndex += 6;
                }
            }
        }
        const indexArray = new Uint32Array(iIndex);
        for (let i = 0, len = indexArray.length; i < len; i++) {
            indexArray[i] = tempIndex[i];
        }
        return {
            position,
            uv,
            normal,
            indexs: indexArray
        };
    }
    function getPlaneGeometry(width, height, devideW, devideH) {
        const { position, uv, normal, indexs } = getPlaneGeometryAttribute(width, height, devideW, devideH);
        const geometry = new THREE__namespace.BufferGeometry();
        addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(geometry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(geometry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        geometry.setIndex(new THREE__namespace.BufferAttribute(indexs, 1));
        return geometry;
    }

    // import { addAttribute } from './util/ThreeAdaptUtil';
    const textureLoader = new THREE__namespace.TextureLoader();
    const canvas = document.createElement('canvas'), tileSize = 256;
    function getRGBData(image, width = tileSize, height = tileSize) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        return ctx.getImageData(0, 0, width, height).data;
    }
    function generateImage(image) {
        if (!image) {
            return null;
        }
        let img;
        if (typeof image === 'string') {
            img = new Image();
            img.src = image;
        }
        else if (image instanceof HTMLCanvasElement) {
            img = new Image();
            img.src = image.toDataURL();
        }
        else if (image instanceof Image) {
            img = new Image();
            img.src = image.src;
            img.crossOrigin = image.crossOrigin;
        }
        if (img && !img.crossOrigin) {
            img.crossOrigin = 'Anonymous';
        }
        return img;
    }
    const heightCache$1 = new Map();
    function updateGeometryPosition(image, geometry, layer, options) {
        if (!geometry || !layer) {
            return;
        }
        const { imageWidth, imageHeight, flaserBoundary } = options;
        let imgdata;
        if (image instanceof Uint32Array || image instanceof Uint8ClampedArray) {
            imgdata = image;
        }
        else {
            imgdata = getRGBData(image, imageWidth, imageHeight);
        }
        if (!imgdata) {
            console.error('image is error type data', image);
            return;
        }
        let idx = 0, row = 0, rowIndex = 0;
        const isBoundary = () => {
            return (row === 0 || (row + 1) === imageHeight || rowIndex === 0 || (rowIndex + 1) === imageWidth);
        };
        const out = new THREE__namespace.Vector3();
        const cache = heightCache$1;
        //rgb to height  https://docs.mapbox.com/help/troubleshooting/access-elevation-data/
        for (let i = 0, len = imgdata.length; i < len; i += 4) {
            const R = imgdata[i], G = imgdata[i + 1], B = imgdata[i + 2];
            const height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1);
            let z = 0;
            if (!isBoundary() || !flaserBoundary) {
                const value = cache.get(height);
                if (value !== undefined) {
                    z = value;
                }
                else {
                    z = layer.altitudeToVector3(height, height, null, out).x;
                    cache.set(height, z);
                }
            }
            geometry.attributes.position.array[idx * 3 + 2] = z;
            idx++;
            rowIndex++;
            if (rowIndex === imageWidth) {
                row++;
                rowIndex = 0;
            }
        }
        geometry.attributes.position.needsUpdate = true;
    }
    const OPTIONS$8 = {
        interactive: false,
        altitude: 0,
        image: null,
        imageWidth: 256,
        imageHeight: 256,
        texture: null,
        flaserBoundary: true,
        bufferPixel: 1
    };
    /**
     *
     */
    class Terrain extends BaseObject {
        constructor(extent, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$8, options, { layer, extent });
            const { texture, image, altitude, imageHeight, imageWidth, flaserBoundary, bufferPixel } = options;
            // if (!image) {
            //     console.error('not find image');
            // }
            if (!(extent instanceof maptalks__namespace.Extent)) {
                extent = new maptalks__namespace.Extent(extent);
            }
            const { xmin, ymin, xmax, ymax } = extent;
            const coords = [
                [xmin, ymin],
                [xmin, ymax],
                [xmax, ymax],
                [xmax, ymin]
            ];
            let vxmin = Infinity, vymin = Infinity, vxmax = -Infinity, vymax = -Infinity;
            coords.forEach(coord => {
                const v = layer.coordinateToVector3(coord);
                const { x, y } = v;
                vxmin = Math.min(x, vxmin);
                vymin = Math.min(y, vymin);
                vxmax = Math.max(x, vxmax);
                vymax = Math.max(y, vymax);
            });
            const dx = vxmax - vxmin, dy = vymax - vymin;
            const ax = dx / imageWidth, ay = dy / imageHeight;
            //buffer pixel size
            vxmin -= ax * bufferPixel;
            vxmax += ax * bufferPixel;
            vymin -= ay * bufferPixel;
            vymax += ay * bufferPixel;
            const w = Math.abs(vxmax - vxmin), h = Math.abs(vymax - vymin);
            const rgbImg = generateImage(image), img = generateImage(texture);
            // const geometry = new THREE.PlaneBufferGeometry(w, h, imageWidth - 1, imageHeight - 1);
            const geometry = getPlaneGeometry(w, h, imageWidth - 1, imageHeight - 1);
            super();
            this._initOptions(options);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(extent.getCenter(), z);
            this.getObject3d().position.copy(v);
            material.transparent = true;
            if (rgbImg) {
                rgbImg.onload = () => {
                    updateGeometryPosition(rgbImg, geometry, layer, { imageWidth, imageHeight, flaserBoundary });
                    this.fire('dataload', {});
                };
                rgbImg.onerror = (error) => {
                    console.error(error);
                    console.error(`can not  load terrain data: ${rgbImg.src}`);
                    this.fire('dataerror', { image: rgbImg, error, url: rgbImg.src });
                };
            }
            if (img) {
                material.opacity = 0;
                textureLoader.load(img.src, (texture) => {
                    material.map = texture;
                    material.opacity = 1;
                    material.needsUpdate = true;
                    this.fire('textureload', {});
                }, () => { }, (error) => {
                    console.error(error);
                    console.error(`can not load terrain texture ${img.src}`, error);
                    this.fire('textureerror', { image: img, error, url: img.src });
                });
            }
            else {
                material.opacity = 1;
            }
            this.type = 'Terrain';
        }
        updateData(image) {
            const geometry = this.getObject3d().geometry;
            const layer = this.getLayer();
            updateGeometryPosition(image, geometry, layer, this.getOptions());
            this.fire('updatedata', {});
            return this;
        }
    }

    const OPTIONS$7 = {
        // worker: false
        scale: 1,
        tileDivisor: 4
    };
    /**
     *
     */
    class TerrainVectorTileLayer extends BaseVectorTileLayer {
        constructor(url, options = {}, material, layer) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, OPTIONS$7, options));
            this._opts = options;
            this._layer = layer;
            this.material = material;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._imgQueue = {};
            this._layerLaodTime = new Date().getTime();
            this._init();
        }
        isAsynchronous() {
            return false;
        }
        /**
         * this is can override
         * @param {*} index
         * @param {*} json
         */
        formatBaseObjects(index, image) {
            const opts = this.options, baseobjects = [];
            const { scale, tileDivisor } = opts;
            const { x, y, z } = this._getXYZOfIndex(index);
            const zoom = this.getMap().getZoom();
            const texture = this.getTileUrl(x, y, z);
            const [imageWidth, imageHeight] = this.options.tileSize;
            const extent = this._getTileLngLatExtent(x, y, z);
            const material = this.material.clone();
            if ((z + 1) >= Math.round(zoom)) {
                const terrain = new Terrain(extent, {
                    image,
                    imageWidth: imageWidth / tileDivisor,
                    imageHeight: imageHeight / tileDivisor,
                    texture
                }, material, this._layer);
                terrain.getObject3d().scale.set(scale, scale, 1);
                baseobjects.push(terrain);
            }
            return baseobjects;
        }
        //queue loop
        loopMessage(q) {
            this.getTileData(q);
        }
        _init() {
            this.on('layerload', this._layerOnLoad);
            this.on('add', () => {
                if (this._add === false) {
                    const baseobjects = this.getBaseObjects();
                    this._layer.addMesh(baseobjects);
                }
                this._add = true;
                /**
                 * layerload have a bug ,Sometimes it doesn't trigger,I don't know why
                 * Add heartbeat detection mechanism
                 */
                this.intervalId = setInterval(() => {
                    if (this._isLoad() && (!this._layer.getMap().isInteracting())) {
                        this.fire('layerload');
                    }
                }, 1000);
            });
            this.on('remove', () => {
                this._add = false;
                const baseobjects = this.getBaseObjects();
                this._layer.removeMesh(baseobjects);
                clearInterval(this.intervalId);
            });
            this.on('show', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.show();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.show();
                    });
                }
            });
            this.on('hide', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.hide();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.hide();
                    });
                }
            });
            this.on('renderercreate', (e) => {
                e.renderer.loadTile = function loadTile(tile) {
                    var tileSize = this.layer.getTileSize();
                    var tileImage = new Image();
                    tileImage.width = tileSize['width'];
                    tileImage.height = tileSize['height'];
                    tileImage.onload = this.onTileLoad.bind(this, tileImage, tile);
                    tileImage.onerror = this.onTileError.bind(this, tileImage, tile);
                    this.loadTileImage(tileImage, tile['url'], tile.id);
                    return tileImage;
                };
                e.renderer.deleteTile = (tile) => {
                    if (!tile || !tile.image) {
                        return;
                    }
                    tile.image.onload = null;
                    tile.image.onerror = null;
                    const tileinfo = tile.info || {};
                    const rgbImage = this._imgQueue[tileinfo.id];
                    if (rgbImage) {
                        rgbImage.src = '';
                        rgbImage.onload = null;
                        rgbImage.onerror = null;
                        delete this._imgQueue[tileinfo.id];
                    }
                };
                e.renderer.loadTileImage = (img, url, key) => {
                    img._key = key;
                    const rgbImage = new Image();
                    this._imgQueue[key] = rgbImage;
                    const q = {
                        key,
                        url,
                        rgbImage,
                        callback: (index, rgbImage, image) => {
                            this._generateBaseObjects(index, rgbImage, image);
                        },
                        img,
                        vt: this
                    };
                    this.loopMessage(q);
                };
            });
        }
    }

    /*!
     * Code from baidu mapv
     * License: BSD-3
     * https://github.com/huiyan-fe/mapv
     *
     */
    /**
     * Category
     * @param {Object} [options]   Available options:
     *                             {Object} gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}
     */
    function Intensity(options) {
        options = options || {};
        this.gradient = options.gradient || {
            0.25: 'rgba(0, 0, 255, 1)',
            0.55: 'rgba(0, 255, 0, 1)',
            0.85: 'rgba(255, 255, 0, 1)',
            1.0: 'rgba(255, 0, 0, 1)'
        };
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.min = options.min || 0;
        this.initPalette();
    }
    Intensity.prototype.setMax = function (value) {
        this.max = value || 100;
    };
    Intensity.prototype.setMin = function (value) {
        this.min = value || 0;
    };
    Intensity.prototype.setMaxSize = function (maxSize) {
        this.maxSize = maxSize || 35;
    };
    Intensity.prototype.setMinSize = function (minSize) {
        this.minSize = minSize || 0;
    };
    Intensity.prototype.initPalette = function () {
        var gradient = this.gradient;
        var canvas = createCanvas(256, 1);
        var paletteCtx = this.paletteCtx = canvas.getContext('2d');
        var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, 256, 1);
    };
    Intensity.prototype.getColor = function (value) {
        var imageData = this.getImageData(value);
        return 'rgba(' + imageData[0] + ', ' + imageData[1] + ', ' + imageData[2] + ', ' + imageData[3] / 256 + ')';
    };
    Intensity.prototype.getImageData = function (value) {
        var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;
        if (value === undefined) {
            return imageData;
        }
        var max = this.max;
        var min = this.min;
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        var index = Math.floor((value - min) / (max - min) * (256 - 1)) * 4;
        return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
    };
    /**
     * @param Number value
     * @param Number max of value
     * @param Number max of size
     * @param Object other options
     */
    Intensity.prototype.getSize = function (value) {
        var size = 0;
        var max = this.max;
        var min = this.min;
        var maxSize = this.maxSize;
        var minSize = this.minSize;
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        if (max > min) {
            size = minSize + (value - min) / (max - min) * (maxSize - minSize);
        }
        else {
            return maxSize;
        }
        return size;
    };
    Intensity.prototype.getLegend = function (options) {
        var gradient = this.gradient;
        var width = options.width || 20;
        var height = options.height || 180;
        var canvas = createCanvas(width, height);
        var paletteCtx = canvas.getContext('2d');
        var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);
        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, width, height);
        return canvas;
    };

    /*!
     * Code from baidu mapv
     * License: BSD-3
     * https://github.com/huiyan-fe/mapv
     *
     */
    function createCircle(size) {
        var shadowBlur = size / 2;
        var r2 = size + shadowBlur;
        var offsetDistance = 10000;
        var circle = createCanvas(r2 * 2, r2 * 2);
        var context = circle.getContext('2d');
        context.shadowBlur = shadowBlur;
        context.shadowColor = 'black';
        context.shadowOffsetX = context.shadowOffsetY = offsetDistance;
        context.beginPath();
        context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        return circle;
    }
    function colorize(pixels, gradient, options) {
        var max = getMax(options);
        var min = getMin(options);
        var diff = max - min;
        var range = options.range || null;
        var jMin = 0;
        var jMax = 1024;
        if (range && range.length === 2) {
            jMin = (range[0] - min) / diff * 1024;
        }
        if (range && range.length === 2) {
            jMax = (range[1] - min) / diff * 1024;
        }
        var maxOpacity = options.maxOpacity || 0.8;
        var minOpacity = options.minOpacity || 0;
        // var range = options.range;
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value
            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }
            if (pixels[i] / 256 < minOpacity) {
                pixels[i] = 256 * minOpacity;
            }
            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            }
            else {
                pixels[i] = 0;
            }
        }
    }
    function getMax(options) {
        var max = options.max || 100;
        return max;
    }
    function getMin(options) {
        var min = options.min || 0;
        return min;
    }
    function drawGray(context, dataSet, options) {
        var max = getMax(options);
        // var min = getMin(options);
        // console.log(max)
        var size = options._size || options.size || 13;
        var circle = createCircle(size);
        var circleHalfWidth = circle.width / 2;
        var circleHalfHeight = circle.height / 2;
        var data = dataSet;
        var dataOrderByAlpha = {};
        data.forEach(function (item) {
            var count = item.count === undefined ? 1 : item.count;
            var alpha = Math.min(1, count / max).toFixed(2);
            dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
            dataOrderByAlpha[alpha].push(item);
        });
        for (var i in dataOrderByAlpha) {
            if (isNaN(i))
                continue;
            var _data = dataOrderByAlpha[i];
            context.beginPath();
            if (!options.withoutAlpha) {
                context.globalAlpha = i;
            }
            // context.strokeStyle = intensity.getColor(i * max);
            _data.forEach(function (item) {
                var coordinates = item.coordinate;
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.drawImage(circle, coordinates[0] - circleHalfWidth, coordinates[1] - circleHalfHeight);
            });
        }
    }
    function draw(context, data, options) {
        if (context.canvas.width <= 0 || context.canvas.height <= 0) {
            return;
        }
        var strength = options.strength || 0.3;
        context.strokeStyle = 'rgba(0,0,0,' + strength + ')';
        // var shadowCanvas = new Canvas(context.canvas.width, context.canvas.height);
        var shadowCanvas = createCanvas(context.canvas.width, context.canvas.height);
        var shadowContext = shadowCanvas.getContext('2d');
        shadowContext.scale(devicePixelRatio, devicePixelRatio);
        options = options || {};
        // var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        context.save();
        var intensity = new Intensity({
            gradient: options.gradient
        });
        drawGray(shadowContext, data, options);
        // return false;
        if (!options.absolute) {
            var colored = shadowContext.getImageData(0, 0, context.canvas.width, context.canvas.height);
            colorize(colored.data, intensity.getImageData(), options);
            context.putImageData(colored, 0, 0);
            context.restore();
        }
        intensity = null;
        shadowCanvas = null;
    }
    var HeatMapUitl = {
        draw,
        drawGray,
        colorize
    };

    const OPTIONS$6 = {
        altitude: 0,
        interactive: false,
        min: 0,
        max: 100,
        size: 13,
        gradient: { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)' },
        gridScale: 0.5
    };
    const CANVAS_MAX_SIZE = 2048;
    /**
     *
     */
    class HeatMap extends BaseObject {
        constructor(data, options, material, layer) {
            if (!Array.isArray(data)) {
                data = [data];
            }
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            const vs = [];
            //Calculate bbox
            for (let i = 0, len = data.length; i < len; i++) {
                const { coordinate, lnglat, xy } = data[i];
                const coord = coordinate || lnglat || xy;
                if (!coord) {
                    console.warn('not find coordinate');
                    continue;
                }
                const v = layer.coordinateToVector3(coord);
                vs.push(v);
                const { x, y } = v;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$6, options, { layer, points: data });
            // Calculate canvas width and height
            let { gridScale, altitude, size } = options;
            const offsetX = Math.abs(maxX - minX), offsetY = Math.abs(maxY - minY);
            const maxOffset = Math.max((offsetX * gridScale), (offsetY * gridScale));
            if (maxOffset > CANVAS_MAX_SIZE) {
                console.warn(`gridScale: ${gridScale} it's too big. I hope it's a smaller value,canvas max size is ${CANVAS_MAX_SIZE}* ${CANVAS_MAX_SIZE}`);
                const offset = maxOffset / gridScale;
                gridScale = CANVAS_MAX_SIZE / offset;
            }
            let canvasWidth = Math.ceil(offsetX * gridScale), canvasHeight = Math.ceil(offsetY * gridScale);
            const scaleX = canvasWidth / offsetX, scaleY = canvasHeight / offsetY;
            const pixels = [];
            const bufferSize = Math.ceil(size * 2);
            for (let i = 0, len = vs.length; i < len; i++) {
                const v = vs[i];
                v.x -= minX;
                v.y -= minY;
                v.x *= scaleX;
                v.y *= scaleY;
                v.y = canvasHeight - v.y;
                //translate x y
                v.x += bufferSize;
                v.y += bufferSize;
                //for heat draw data
                pixels.push({
                    coordinate: [v.x, v.y],
                    count: data[i].count
                });
            }
            //buffer canvas size
            canvasWidth += bufferSize * 2;
            canvasHeight += bufferSize * 2;
            let shadowCanvas = createCanvas(canvasWidth, canvasHeight);
            let shadowContext = shadowCanvas.getContext('2d');
            // shadowContext.scale(devicePixelRatio, devicePixelRatio);
            HeatMapUitl.drawGray(shadowContext, pixels, options);
            const colored = shadowContext.getImageData(0, 0, shadowContext.canvas.width, shadowContext.canvas.height);
            let maxAlpha = -Infinity;
            const blackps = new Float32Array(colored.data.length / 4), alphas = new Float32Array(colored.data.length / 4);
            for (let i = 3, len = colored.data.length, j = 0; i < len; i += 4) {
                const alpha = colored.data[i];
                maxAlpha = Math.max(maxAlpha, alpha);
                alphas[j] = alpha;
                //Points that do not need to be drawn
                if (alpha <= 0) {
                    blackps[j] = 1;
                }
                j++;
            }
            const intensity = new Intensity({
                gradient: options.gradient
            });
            HeatMapUitl.colorize(colored.data, intensity.getImageData(), options);
            shadowCanvas = null;
            shadowContext = null;
            // const geometry = new THREE.PlaneBufferGeometry(offsetX, offsetY, canvasWidth - 1, canvasHeight - 1);
            const geometry = getPlaneGeometry(offsetX, offsetY, canvasWidth - 1, canvasHeight - 1);
            const index = geometry.getIndex().array;
            const position = geometry.attributes.position.array;
            // Index of the points that really need to be drawn
            const colors = new Float32Array(position.length);
            const tempIndex = new Uint32Array(position.length * 6);
            const color = new THREE__namespace.Color();
            let iIndex = 0;
            for (let i = 0, len = position.length, j = 0, len1 = index.length, m = 0, len2 = colored.data.length, n = 0; i < Math.max(len, len1, len2); i += 3) {
                if (i < len) {
                    const alpha = alphas[n];
                    if (alpha > 0) {
                        position[i + 2] = alpha / maxAlpha;
                    }
                }
                if (j < len1) {
                    const a = index[j], b = index[j + 1], c = index[j + 2];
                    if ((!blackps[a]) || (!blackps[b]) || (!blackps[c])) {
                        tempIndex[iIndex] = a;
                        tempIndex[iIndex + 1] = b;
                        tempIndex[iIndex + 2] = c;
                        iIndex += 3;
                    }
                }
                if (m < len2) {
                    const r = colored.data[m], g = colored.data[m + 1], b = colored.data[m + 2]; // a = colored.data[i + 3];
                    const rgb = `rgb(${r},${g},${b})`;
                    color.setStyle(rgb);
                    colors[j] = color.r;
                    colors[j + 1] = color.g;
                    colors[j + 2] = color.b;
                }
                j += 3;
                m += 4;
                n++;
            }
            const filterIndex = new Uint32Array(iIndex);
            for (let i = 0; i < iIndex; i++) {
                filterIndex[i] = tempIndex[i];
            }
            geometry.setIndex(new THREE__namespace.BufferAttribute(filterIndex, 1));
            addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            material.vertexColors = getVertexColors();
            super();
            this._initOptions(options);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            this.getObject3d().position.copy(new THREE__namespace.Vector3((minX + maxX) / 2, (minY + maxY) / 2, z));
            this.type = 'HeatMap';
        }
    }

    const color = new THREE__namespace.Color();
    let colorIndex = 1;
    /**
     *https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_gpu.html
     */
    class GPUPick {
        constructor(layer) {
            this.object3ds = [];
            this.layer = layer;
            this.camera = layer.getCamera();
            this.renderer = layer.getThreeRenderer();
            this.pickingTexture = createWebGLRenderTarget();
            this.pickingScene = new THREE__namespace.Scene();
        }
        getColor() {
            color.setHex(colorIndex);
            colorIndex++;
            return color;
        }
        add(object3d) {
            if (object3d) {
                const colorIndex = object3d['_colorIndex'];
                if (colorIndex) {
                    this.object3ds[colorIndex] = object3d;
                    this.pickingScene.add(object3d);
                }
            }
            return this;
        }
        remove(object3d) {
            if (object3d) {
                const colorIndex = object3d['_colorIndex'];
                if (colorIndex) {
                    this.object3ds[colorIndex] = null;
                    this.pickingScene.remove(object3d);
                }
            }
            return this;
        }
        isEmpty() {
            if (this.pickingScene.children.length === 0) {
                return true;
            }
            for (let i = 0, len = this.pickingScene.children.length; i < len; i++) {
                const mesh = this.pickingScene.children[i];
                if (mesh) {
                    const object3d = mesh['__parent'];
                    if (object3d && object3d.getOptions().interactive === true) {
                        return false;
                    }
                }
            }
            return true;
        }
        pick(pixel) {
            if (!pixel) {
                return;
            }
            if (this.isEmpty()) {
                return;
            }
            const { camera, renderer, pickingTexture, pickingScene, object3ds, layer } = this;
            const len = this.pickingScene.children.length;
            // reset all object3d picked
            for (let i = 0; i < len; i++) {
                const object3d = this.pickingScene.children[i];
                if (object3d && object3d['__parent']) {
                    object3d['__parent'].picked = false;
                }
            }
            //resize size
            const { width, height } = layer._getRenderer().canvas;
            const pw = pickingTexture.width, ph = pickingTexture.height;
            if (width !== pw || height !== ph) {
                pickingTexture.setSize(width, height);
            }
            //render the picking scene off-screen
            // set the view offset to represent just a single pixel under the mouse
            // camera.setViewOffset(width, height, mouse.x, mouse.y, 1, 1);
            // render the scene
            renderer.setRenderTarget(pickingTexture);
            renderer.clear();
            if (camera && camera.layers) {
                this.camera.layers.set(0);
            }
            renderer.render(pickingScene, camera);
            // clear the view offset so rendering returns to normal
            // camera.clearViewOffset();
            //create buffer for reading single pixel
            const pixelBuffer = new Uint8Array(4);
            //read the pixel
            const { x, y } = pixel;
            let devicePixelRatio = window.devicePixelRatio;
            const map = layer.getMap();
            if (map) {
                devicePixelRatio = map.getDevicePixelRatio ? map.getDevicePixelRatio() : map.options.devicePixelRatio;
            }
            const offsetX = (x * devicePixelRatio), offsetY = (pickingTexture.height - y * devicePixelRatio);
            renderer.readRenderTargetPixels(pickingTexture, Math.round(offsetX), Math.round(offsetY), 1, 1, pixelBuffer);
            //interpret the pixel as an ID
            const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
            const object3d = object3ds[id];
            if (object3d) {
                if (object3d['__parent']) {
                    object3ds[id]['__parent'].picked = true;
                }
            }
            else {
                //for merged mesh
                for (let i = 0; i < len; i++) {
                    const object3d = this.pickingScene.children[i];
                    if (object3d && object3d['__parent']) {
                        const parent = object3d['__parent'];
                        if (parent._colorMap && parent._colorMap[id] != null) {
                            parent.picked = true;
                            parent.index = parent._colorMap[id];
                            break;
                        }
                    }
                }
            }
            renderer.setRenderTarget(null);
        }
    }

    const OPTIONS$5 = {
        bottomHeight: 0,
        altitude: 0
    };
    class FatLine extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$5, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            const { lineStrings, center } = LineStringSplit(lineString);
            const geometry = new LineGeometry();
            let position;
            if (asynchronous) {
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                FatLineTaskIns.push({
                    id,
                    data: lineStrings,
                    lineString,
                    center,
                    layer,
                    baseObject: this
                });
            }
            else {
                const positionList = [], cache = {};
                for (let m = 0, le = lineStrings.length; m < le; m++) {
                    const positions = getLinePosition(lineStrings[m], layer, center, false).positions;
                    setBottomHeight(positions, options.bottomHeight, layer, cache);
                    positionList.push(getLineSegmentPosition(positions));
                }
                position = mergeLinePositions(positionList);
                geometry.setPositions(position);
            }
            this._setMaterialRes(layer, material);
            this._createLine2(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            if (!asynchronous) {
                this._setPickObject3d(position, material.linewidth);
                this._init();
            }
            this.type = 'FatLine';
        }
        _init() {
            const pick = this.getLayer().getPick();
            this.on('add', () => {
                pick.add(this.pickObject3d);
            });
            this.on('remove', () => {
                pick.remove(this.pickObject3d);
            });
        }
        _setMaterialRes(layer, material) {
            const map = layer.getMap();
            if (!map) {
                return this;
            }
            const size = map.getSize();
            const width = size.width, height = size.height;
            material.resolution.set(width, height);
        }
        _setPickObject3d(ps, linewidth) {
            // if (!this._colorMap) {
            //     return;
            // }
            const geometry = new LineGeometry();
            geometry.setPositions(ps);
            const pick = this.getLayer().getPick();
            const color = pick.getColor();
            const colors = [];
            for (let i = 0, len = ps.length / 3; i < len; i++) {
                colors.push(color.r, color.g, color.b);
            }
            geometry.setColors(colors);
            const material = new LineMaterial({
                color: '#fff',
                // side: THREE.BackSide,
                linewidth,
                vertexColors: getVertexColors()
            });
            this._setMaterialRes(this.getLayer(), material);
            const colorIndex = color.getHex();
            const mesh = new Line2(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh._colorIndex = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                const size = this.getMap().getSize();
                const width = size.width, height = size.height;
                material.resolution.set(width, height);
                this.getObject3d().material = material;
            }
            return this;
        }
        _workerLoad(result) {
            const position = new Float32Array(result.position);
            const object3d = this.getObject3d();
            object3d.geometry.setPositions(position);
            object3d.computeLineDistances();
            this._setPickObject3d(position, object3d.material.linewidth);
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
        _animation() {
            const layer = this.getLayer();
            if (!layer) {
                return this;
            }
            const object3d = this.getObject3d();
            const pickObject3d = this.getPickObject3d();
            [object3d, pickObject3d].forEach(object3d => {
                if (object3d) {
                    this._setMaterialRes(layer, object3d.material);
                }
            });
        }
    }

    const OPTIONS$4 = {
        altitude: 0,
        colors: null
    };
    /**
     *
     */
    class FatLines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$4, options, { layer, lineStrings, coordinate: center });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            const geometry = new LineGeometry();
            const lines = [], cache = {};
            let geometriesAttributes = [], psIndex = 0, positionList = [];
            let position;
            let newPosition;
            if (asynchronous) {
                FatLinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    data: lineStringList,
                    key: options.key,
                    center,
                    layer,
                    baseObject: this,
                    lineStrings,
                    option: options,
                });
            }
            else {
                //LineSegmentsGeometry
                for (let i = 0; i < len; i++) {
                    const lls = lineStringList[i];
                    let psCount = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const properties = getLineStringProperties(lls[m]);
                        const opts = maptalks__namespace.Util.extend({}, options, properties);
                        const { positions } = getLinePosition(lls[m], layer, center, false);
                        setBottomHeight(positions, opts.bottomHeight, layer, cache);
                        psCount += (positions.length / 3 * 2 - 2);
                        positionList.push(getLineSegmentPosition(positions));
                    }
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        instanceStart: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        instanceEnd: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                position = mergeLinePositions(positionList);
                geometry.setPositions(position);
            }
            this._setMaterialRes(layer, material);
            this._createLine2(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = lines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this.index = null;
            this._geometryCache = new LineGeometry();
            if (!asynchronous) {
                newPosition = new Float32Array(position);
                this._geometryCache.setPositions(newPosition);
            }
            this._colorMap = {};
            this.isHide = false;
            this._initBaseObjectsEvent(lines);
            if (!asynchronous) {
                this._setPickObject3d(newPosition, material.linewidth);
                this._init();
            }
            this.type = 'FatLines';
        }
        _setMaterialRes(layer, material) {
            const map = layer.getMap();
            if (!map) {
                return this;
            }
            const size = map.getSize();
            const width = size.width, height = size.height;
            material.resolution.set(width, height);
        }
        _setPickObject3d(ps, linewidth) {
            if (!this._colorMap) {
                return;
            }
            const geometry = this._geometryCache || new LineGeometry();
            geometry.setPositions(ps);
            const pick = this.getLayer().getPick();
            const { _geometriesAttributes } = this;
            const colors = getGeometriesColorArray(_geometriesAttributes);
            let cIndex = 0;
            for (let i = 0, len = _geometriesAttributes.length; i < len; i++) {
                const color = pick.getColor();
                const colorIndex = color.getHex();
                this._colorMap[colorIndex] = i;
                const { count } = _geometriesAttributes[i].position;
                this._datas[i].colorIndex = colorIndex;
                for (let j = 0; j < count; j++) {
                    colors[cIndex] = color.r;
                    colors[cIndex + 1] = color.g;
                    colors[cIndex + 2] = color.b;
                    cIndex += 3;
                }
            }
            geometry.setColors(colors);
            const material = new LineMaterial({
                // color: color.getStyle(),
                // side: THREE.BackSide,
                color: '#fff',
                linewidth,
                vertexColors: getVertexColors()
                // dashed: false
            });
            this._setMaterialRes(this.getLayer(), material);
            const color = pick.getColor();
            const colorIndex = color.getHex();
            const mesh = new Line2(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh._colorIndex = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                const size = this.getMap().getSize();
                const width = size.width, height = size.height;
                material.resolution.set(width, height);
                this.getObject3d().material = material;
            }
            return this;
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = maptalks__namespace.Util.extend({}, this.getOptions(), { index }, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties());
                    this._baseObjects[index] = new FatLine(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        /**
           * update geometry attributes
           * @param {*} bufferAttribute
           * @param {*} attribute
           */
        _updateAttribute(bufferAttribute, attribute) {
            const { indexs } = this._getHideGeometryIndex(attribute);
            const array = this._geometryCache.attributes[attribute].array;
            const len = array.length;
            for (let i = 0; i < len; i++) {
                bufferAttribute.array[i] = array[i];
            }
            let value = -100000;
            for (let j = 0; j < indexs.length; j++) {
                const index = indexs[j];
                const { start, end } = this._geometriesAttributes[index][attribute];
                for (let i = start; i < end; i++) {
                    bufferAttribute.array[i] = value;
                }
            }
            return this;
        }
        _showGeometry(baseObject, isHide) {
            let index;
            if (baseObject) {
                index = baseObject.getOptions().index;
            }
            if (index != null) {
                const geometryAttributes = this._geometriesAttributes[index];
                const { hide } = geometryAttributes;
                if (hide === isHide) {
                    return this;
                }
                geometryAttributes.hide = isHide;
                const buffGeom = this.getObject3d().geometry;
                this._updateAttribute(buffGeom.attributes.instanceStart, 'instanceStart');
                this._updateAttribute(buffGeom.attributes.instanceEnd, 'instanceEnd');
                // this._updateAttribute(buffGeom.attributes.instanceDistanceStart, 'instanceDistanceStart');
                // this._updateAttribute(buffGeom.attributes.instanceDistanceEnd, 'instanceDistanceEnd');
                buffGeom.attributes.instanceStart.data.needsUpdate = true;
                buffGeom.attributes.instanceEnd.data.needsUpdate = true;
                // buffGeom.attributes.instanceDistanceStart.data.needsUpdate = true;
                // buffGeom.attributes.instanceDistanceEnd.data.needsUpdate = true;
                this.isHide = isHide;
            }
            return this;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const object3d = this.getObject3d();
            const position = new Float32Array(result.position);
            const newPosition = new Float32Array(position);
            object3d.geometry.setPositions(new Float32Array(position));
            object3d.computeLineDistances();
            this._geometryCache.setPositions(newPosition);
            this._setPickObject3d(newPosition, object3d.material.linewidth);
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
        _animation() {
            const layer = this.getLayer();
            if (!layer) {
                return this;
            }
            const object3d = this.getObject3d();
            const pickObject3d = this.getPickObject3d();
            [object3d, pickObject3d].forEach(object3d => {
                if (object3d) {
                    this._setMaterialRes(layer, object3d.material);
                }
            });
        }
    }

    const OPTIONS$3 = {
        radius: 10,
        height: 100,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    class Box extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$3, options, { layer, coordinate });
            super();
            this._initOptions(options);
            const { height, radius, topColor, bottomColor, altitude } = options;
            const h = layer.altitudeToVector3(height, height).x;
            const r = layer.distanceToVector3(radius, radius).x;
            const geometry = getDefaultBoxGeometry().clone();
            geometry.scale(r * 2, r * 2, h);
            if (topColor) {
                initVertexColors(geometry, bottomColor, topColor, 'z', h / 2);
                material.vertexColors = getVertexColors();
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Box';
        }
    }

    const OPTIONS$2 = {
        radius: 10,
        height: 100,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
    };
    class Boxs extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            const len = points.length;
            const center = getCenterOfPoints(points);
            const centerPt = layer.coordinateToVector3(center);
            const geometries = [], bars = [], geometriesAttributes = [];
            let psIndex = 0;
            options = maptalks__namespace.Util.extend({}, { altitude: 0, layer, points }, OPTIONS$2, options);
            const cache = {}, altCache = {};
            for (let i = 0; i < len; i++) {
                const opts = maptalks__namespace.Util.extend({ index: i }, options, points[i]);
                const { radius, altitude, topColor, bottomColor, height, coordinate } = opts;
                const r = distanceToVector3(radius, layer, cache);
                const h = altitudeToVector3(height, layer, altCache);
                const alt = altitudeToVector3(altitude, layer, altCache);
                const buffGeom = getDefaultBoxGeometry().clone();
                buffGeom.scale(r * 2, r * 2, h);
                if (topColor) {
                    initVertexColors(buffGeom, bottomColor, topColor, 'z', h / 2);
                    material.vertexColors = getVertexColors();
                }
                const v = layer.coordinateToVector3(coordinate).sub(centerPt);
                const parray = buffGeom.attributes.position.array;
                for (let j = 0, len1 = parray.length; j < len1; j += 3) {
                    parray[j + 2] += alt;
                    parray[j] += v.x;
                    parray[j + 1] += v.y;
                    parray[j + 2] += v.z;
                }
                geometries.push(buffGeom);
                const bar = new Box(coordinate, opts, material, layer);
                bars.push(bar);
                buffGeom.index.count / 3;
                const psCount = buffGeom.attributes.position.count; 
                //  colorCount = buffGeom.attributes.color.count,
                buffGeom.attributes.normal.count; buffGeom.attributes.uv.count;
                geometriesAttributes[i] = {
                    position: {
                        count: psCount,
                        start: psIndex,
                        end: psIndex + psCount * 3,
                    },
                    // normal: {
                    //     count: normalCount,
                    //     start: normalIndex,
                    //     end: normalIndex + normalCount * 3,
                    // },
                    // // color: {
                    // //     count: colorCount,
                    // //     start: colorIndex,
                    // //     end: colorIndex + colorCount * 3,
                    // // },
                    // uv: {
                    //     count: uvCount,
                    //     start: uvIndex,
                    //     end: uvIndex + uvCount * 2,
                    // },
                    hide: false
                };
                psIndex += psCount * 3;
            }
            super();
            this._initOptions(options);
            const geometry = mergeBarGeometry(geometries);
            this._createMesh(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = bars;
            this._datas = points;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(geometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(bars);
            this._setPickObject3d();
            this._init();
            this.type = 'Boxs';
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
    }

    var earcut$2 = {exports: {}};

    earcut$2.exports = earcut;
    earcut$2.exports.default = earcut;

    function earcut(data, holeIndices, dim) {

        dim = dim || 2;

        var hasHoles = holeIndices && holeIndices.length,
            outerLen = hasHoles ? holeIndices[0] * dim : data.length,
            outerNode = linkedList(data, 0, outerLen, dim, true),
            triangles = [];

        if (!outerNode || outerNode.next === outerNode.prev) return triangles;

        var minX, minY, maxX, maxY, x, y, invSize;

        if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }

            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

        return triangles;
    }

    // create a circular doubly linked list from polygon points in the specified winding order
    function linkedList(data, start, end, dim, clockwise) {
        var i, last;

        if (clockwise === (signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
        } else {
            for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
        }

        if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
        }

        return last;
    }

    // eliminate colinear or duplicate points
    function filterPoints(start, end) {
        if (!start) return start;
        if (!end) end = start;

        var p = start,
            again;
        do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area$1(p.prev, p, p.next) === 0)) {
                removeNode(p);
                p = end = p.prev;
                if (p === p.next) break;
                again = true;

            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

    // main ear slicing loop which triangulates a polygon (given as a linked list)
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear) return;

        // interlink polygon nodes in z-order
        if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

        var stop = ear,
            prev, next;

        // iterate through ears, slicing them one by one
        while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

                removeNode(ear);

                // skipping the next vertex leads to less sliver triangles
                ear = next.next;
                stop = next.next;

                continue;
            }

            ear = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (ear === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

                // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                    earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

                // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    splitEarcut(ear, triangles, dim, minX, minY, invSize);
                }

                break;
            }
        }
    }

    // check whether a polygon node forms a valid ear with adjacent nodes
    function isEar(ear) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area$1(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area$1(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, invSize),
            maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

        var p = ear.prevZ,
            n = ear.nextZ;

        // look for points inside the triangle in both directions
        while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;

            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area$1(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        // look for remaining points in decreasing z-order
        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        // look for remaining points in increasing z-order
        while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area$1(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        return true;
    }

    // go through all polygon nodes and cure small local self-intersections
    function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                removeNode(p);
                removeNode(p.next);

                p = start = b;
            }
            p = p.next;
        } while (p !== start);

        return filterPoints(p);
    }

    // try splitting polygon into two and triangulate them independently
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        // look for a valid diagonal that divides the polygon into two
        var a = start;
        do {
            var b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    var c = splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = filterPoints(a, a.next);
                    c = filterPoints(c, c.next);

                    // run earcut on each half
                    earcutLinked(a, triangles, dim, minX, minY, invSize);
                    earcutLinked(c, triangles, dim, minX, minY, invSize);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

    // link every hole into the outer loop, producing a single-ring polygon without holes
    function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [],
            i, len, start, end, list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
        }

        queue.sort(compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        outerNode = findHoleBridge(hole, outerNode);
        if (outerNode) {
            var b = splitPolygon(outerNode, hole);
            filterPoints(b, b.next);
        }
    }

    // David Eberly's algorithm for finding a bridge between hole and outer polygon
    function findHoleBridge(hole, outerNode) {
        var p = outerNode,
            hx = hole.x,
            hy = hole.y,
            qx = -Infinity,
            m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
                var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        var stop = m,
            mx = m.x,
            my = m.y,
            tanMin = Infinity,
            tan;

        p = m;

        do {
            if (hx >= p.x && p.x >= mx && hx !== p.x &&
                    pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

                if (locallyInside(p, hole) &&
                    (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        } while (p !== stop);

        return m;
    }

    // whether sector in vertex m contains sector in vertex p in the same coordinates
    function sectorContainsSector(m, p) {
        return area$1(m.prev, m, p.prev) < 0 && area$1(p.next, m, m.next) < 0;
    }

    // interlink polygon nodes in z-order
    function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        sortLinked(p);
    }

    // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize,
            inSize = 1;

        do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }
                qSize = inSize;

                while (pSize > 0 || (qSize > 0 && q)) {

                    if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else list = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;

        } while (numMerges > 1);

        return list;
    }

    // z-order of a point given coords and inverse of the longer side of data bbox
    function zOrder(x, y, minX, minY, invSize) {
        // coords are transformed into non-negative 15-bit integer range
        x = 32767 * (x - minX) * invSize;
        y = 32767 * (y - minY) * invSize;

        x = (x | (x << 8)) & 0x00FF00FF;
        x = (x | (x << 4)) & 0x0F0F0F0F;
        x = (x | (x << 2)) & 0x33333333;
        x = (x | (x << 1)) & 0x55555555;

        y = (y | (y << 8)) & 0x00FF00FF;
        y = (y | (y << 4)) & 0x0F0F0F0F;
        y = (y | (y << 2)) & 0x33333333;
        y = (y | (y << 1)) & 0x55555555;

        return x | (y << 1);
    }

    // find the leftmost node of a polygon ring
    function getLeftmost(start) {
        var p = start,
            leftmost = start;
        do {
            if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

    // check if a point lies within a convex triangle
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
    function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
               (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
                (area$1(a.prev, a, b.prev) || area$1(a, b.prev, b)) || // does not create opposite-facing sectors
                equals(a, b) && area$1(a.prev, a, a.next) > 0 && area$1(b.prev, b, b.next) > 0); // special zero-length case
    }

    // signed area of a triangle
    function area$1(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

    // check if two points are equal
    function equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // check if two segments intersect
    function intersects(p1, q1, p2, q2) {
        var o1 = sign(area$1(p1, q1, p2));
        var o2 = sign(area$1(p1, q1, q2));
        var o3 = sign(area$1(p2, q2, p1));
        var o4 = sign(area$1(p2, q2, q1));

        if (o1 !== o2 && o3 !== o4) return true; // general case

        if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
        if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
        if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
        if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

        return false;
    }

    // for collinear points p, q, r, check if point q lies on segment pr
    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
    }

    // check if a polygon diagonal intersects any polygon segments
    function intersectsPolygon(a, b) {
        var p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                    intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

    // check if a polygon diagonal is locally inside the polygon
    function locallyInside(a, b) {
        return area$1(a.prev, a, a.next) < 0 ?
            area$1(a, b, a.next) >= 0 && area$1(a, a.prev, b) >= 0 :
            area$1(a, b, a.prev) < 0 || area$1(a, a.next, b) < 0;
    }

    // check if the middle point of a polygon diagonal is inside the polygon
    function middleInside(a, b) {
        var p = a,
            inside = false,
            px = (a.x + b.x) / 2,
            py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                    (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                inside = !inside;
            p = p.next;
        } while (p !== a);

        return inside;
    }

    // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring
    function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y),
            b2 = new Node(b.i, b.x, b.y),
            an = a.next,
            bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

    // create a node and optionally link it with previous one (in a circular doubly linked list)
    function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);

        if (!last) {
            p.prev = p;
            p.next = p;

        } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
        }
        return p;
    }

    function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;

        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function Node(i, x, y) {
        // vertex index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertex nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }

    // return a percentage difference between the polygon area and its triangulation area;
    // used to verify correctness of triangulation
    earcut.deviation = function (data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
                var start = holeIndices[i] * dim;
                var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
        }

        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0 :
            Math.abs((trianglesArea - polygonArea) / polygonArea);
    };

    function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

    // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    earcut.flatten = function (data) {
        var dim = data[0][0].length,
            result = {vertices: [], holes: [], dimensions: dim},
            holeIndex = 0;

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    };

    var earcut$1 = earcut$2.exports;

    /*
     (c) 2017, Vladimir Agafonkin
     Simplify.js, a high-performance JS polyline simplification library
     mourner.github.io/simplify-js
    */

    // to suit your point format, run search/replace for '.x' and '.y';
    // for 3D version, see 3d branch (configurability would draw significant performance overhead)

    // square distance between 2 points
    function getSqDist(p1, p2) {

        var dx = p1[0] - p2[0],
            dy = p1[1] - p2[1];

        return dx * dx + dy * dy;
    }

    // square distance from a point to a segment
    function getSqSegDist(p, p1, p2) {

        var x = p1[0],
            y = p1[1],
            dx = p2[0] - x,
            dy = p2[1] - y;

        if (dx !== 0 || dy !== 0) {

            var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = p2[0];
                y = p2[1];

            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = p[0] - x;
        dy = p[1] - y;

        return dx * dx + dy * dy;
    }
    // rest of the code doesn't care about point format

    // basic distance-based simplification
    function simplifyRadialDist(points, sqTolerance) {

        var prevPoint = points[0],
            newPoints = [prevPoint],
            point;

        for (var i = 1, len = points.length; i < len; i++) {
            point = points[i];

            if (getSqDist(point, prevPoint) > sqTolerance) {
                newPoints.push(point);
                prevPoint = point;
            }
        }

        if (prevPoint !== point) newPoints.push(point);

        return newPoints;
    }

    function simplifyDPStep(points, first, last, sqTolerance, simplified) {
        var maxSqDist = sqTolerance,
            index;

        for (var i = first + 1; i < last; i++) {
            var sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
            simplified.push(points[index]);
            if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }

    // simplification using Ramer-Douglas-Peucker algorithm
    function simplifyDouglasPeucker(points, sqTolerance) {
        var last = points.length - 1;

        var simplified = [points[0]];
        simplifyDPStep(points, 0, last, sqTolerance, simplified);
        simplified.push(points[last]);

        return simplified;
    }

    // both algorithms combined for awesome performance
    function simplify(points, tolerance, highestQuality) {

        if (points.length <= 2) return points;

        var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

        points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
        points = simplifyDouglasPeucker(points, sqTolerance);

        return points;
    }

    function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }
    function v2Dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    }

    function normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const d = Math.sqrt(x * x + y * y + z * z);
        out[0] = x / d;
        out[1] = y / d;
        out[2] = z / d;
        return out;
    }

    function v2Normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const d = Math.sqrt(x * x + y * y);
        out[0] = x / d;
        out[1] = y / d;
        return out;
    }

    function scale(out, v, s) {
        out[0] = v[0] * s;
        out[1] = v[1] * s;
        out[2] = v[2] * s;
        return out;
    }

    function scaleAndAdd(out, v1, v2, s) {
        out[0] = v1[0] + v2[0] * s;
        out[1] = v1[1] + v2[1] * s;
        out[2] = v1[2] + v2[2] * s;
        return out;
    }

    function v2Add(out, v1, v2) {
        out[0] = v1[0] + v2[0];
        out[1] = v1[1] + v2[1];
        return out;
    }

    function v3Sub(out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];
        out[2] = v1[2] - v2[2];
        return out;
    }

    function v3Normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const d = Math.sqrt(x * x + y * y + z * z);
        out[0] = x / d;
        out[1] = y / d;
        out[2] = z / d;
        return out;
    }

    function v3Cross(out, v1, v2) {
        var ax = v1[0], ay = v1[1], az = v1[2],
            bx = v2[0], by = v2[1], bz = v2[2];

        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    const rel = [];
    // start and end must be normalized
    function slerp(out, start, end, t) {
        // https://keithmaggio.wordpress.com/2011/02/15/math-magician-lerp-slerp-and-nlerp/
        const cosT = dot(start, end);
        const theta = Math.acos(cosT) * t;

        scaleAndAdd(rel, end, start, -cosT);
        normalize(rel, rel);// start and rel Orthonormal basis

        scale(out, start, Math.cos(theta));
        scaleAndAdd(out, out, rel, Math.sin(theta));

        return out;
    }

    function lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4, out, writeOffset) {
        const dx1 = x2 - x1;
        const dx2 = x4 - x3;
        const dy1 = y2 - y1;
        const dy2 = y4 - y3;

        const cross = dy2 * dx1 - dx2 * dy1;
        const tmp1 = y1 - y3;
        const tmp2 = x1 - x3;
        const t1 = (dx2 * tmp1 - dy2 * tmp2) / cross;
        // const t2 = (dx1 * tmp1 - dy1 * tmp2) / cross;

        if (out) {
            writeOffset = writeOffset || 0;
            out[writeOffset] = x1 + t1 * (x2 - x1);
            out[writeOffset + 1] = y1 + t1 * (y2 - y1);
        }

        return t1;
    }

    function area(points, start, end) {
        // Signed polygon area
        const n = end - start;
        if (n < 3) {
            return 0;
        }
        let area = 0;
        for (let i = (end - 1) * 2, j = start * 2; j < end * 2;) {
            const x0 = points[i];
            const y0 = points[i + 1];
            const x1 = points[j];
            const y1 = points[j + 1];
            i = j;
            j += 2;
            area += x0 * y1 - x1 * y0;
        }

        return area;
    }

    // TODO fitRect x, y are negative?

    function triangulate(vertices, holes, dimensions = 2) {
        return earcut$1(vertices, holes, dimensions);
    }
    function flatten(data) {
        return earcut$1.flatten(data);
    }

    const v1 = [];
    const v2 = [];
    const v = [];

    function innerOffsetPolygon(
        vertices, out, start, end, outStart, offset, miterLimit, close,
        removeIntersections,
        // offsetLines
    ) {
        const checkMiterLimit = miterLimit != null;
        let cursor = outStart;
        let indicesMap = null;
        if (checkMiterLimit) {
            indicesMap = new Uint32Array(end - start);
        }
        let prevOffsetX;
        let prevOffsetY;
        let prevCursor;
        let tmpIntersection = [];

        for (let i = start; i < end; i++) {
            const nextIdx = i === end - 1 ? start : i + 1;
            const prevIdx = i === start ? end - 1 : i - 1;
            const x1 = vertices[prevIdx * 2];
            const y1 = vertices[prevIdx * 2 + 1];
            const x2 = vertices[i * 2];
            const y2 = vertices[i * 2 + 1];
            const x3 = vertices[nextIdx * 2];
            const y3 = vertices[nextIdx * 2 + 1];

            v1[0] = x2 - x1;
            v1[1] = y2 - y1;
            v2[0] = x3 - x2;
            v2[1] = y3 - y2;

            v2Normalize(v1, v1);
            v2Normalize(v2, v2);

            checkMiterLimit && (indicesMap[i] = cursor);

            let needCheckIntersection = false;
            let offsetX;
            let offsetY;
            if (!close && i === start) {
                v[0] = v2[1];
                v[1] = -v2[0];
                v2Normalize(v, v);
                prevOffsetX = out[cursor * 2] = x2 + v[0] * offset;
                prevOffsetY = out[cursor * 2 + 1] = y2 + v[1] * offset;
                prevCursor = cursor;

                // offsetLines && offsetLines.push([x2, y2, prevOffsetX, prevOffsetY, cursor])
                cursor++;
            }
            else if (!close && i === end - 1) {
                v[0] = v1[1];
                v[1] = -v1[0];
                v2Normalize(v, v);

                offsetX = x2 + v[0] * offset;
                offsetY = y2 + v[1] * offset;

                needCheckIntersection = true;
            }
            else {
                // PENDING Why using sub will lost the direction info.
                v2Add(v, v2, v1);
                const tmp = v[1];
                v[1] = -v[0];
                v[0] = tmp;

                v2Normalize(v, v);

                const cosA = v2Dot(v, v2);
                const sinA = Math.sqrt(1 - cosA * cosA);
                // PENDING
                // Make sure it's offset lines instead of vertices.
                const miter = offset * Math.min(10, 1 / sinA);

                const isCovex = offset * cosA < 0;

                if (checkMiterLimit && (1 / sinA) > miterLimit && isCovex) {
                    // No need to check line intersection on the outline.
                    const mx = x2 + v[0] * offset;
                    const my = y2 + v[1] * offset;
                    const halfA = Math.acos(sinA) / 2;
                    const dist = Math.tan(halfA) * Math.abs(offset);
                    out[cursor * 2] = mx + v[1] * dist;
                    out[cursor * 2 + 1] = my - v[0] * dist;
                    cursor++;
                    out[cursor * 2] = mx - v[1] * dist;
                    out[cursor * 2 + 1] = my + v[0] * dist;
                    cursor++;
                }
                else {
                    offsetX = x2 + v[0] * miter;
                    offsetY = y2 + v[1] * miter;
                    needCheckIntersection = true;
                }

                if (needCheckIntersection) {
                    // TODO Handle with whole.
                    if (removeIntersections && prevOffsetX != null) {
                        // Greedy, only check with previous offset line
                        // PENDING: Is it necessary to check with other lines?
                        const t = lineIntersection(
                            x1, y1, prevOffsetX, prevOffsetY,
                            x2, y2, offsetX, offsetY, tmpIntersection, 0
                        );
                        // Use a eplison
                        if (t >= -1e-2 && t <= 1 + 1e-2) {
                            // Update previous offset points.
                            out[prevCursor * 2] = offsetX = tmpIntersection[0];
                            out[prevCursor * 2 + 1] = offsetY = tmpIntersection[1];
                        }
                    }

                    prevOffsetX = out[cursor * 2] = offsetX;
                    prevOffsetY = out[cursor * 2 + 1] = offsetY;
                    prevCursor = cursor;

                    // offsetLines && offsetLines.push([x2, y2, offsetX, offsetY, cursor])

                    cursor++;
                }
            }
        }


        return indicesMap;
    }



    function innerOffsetPolyline(
        vertices, out, start, end, outStart, offset, miterLimit, close
    ) {
        const checkMiterLimit = miterLimit != null;
        let outOff = outStart;
        let indicesMap = null;
        if (checkMiterLimit) {
            indicesMap = new Uint32Array(end - start);
        }
        for (let i = start; i < end; i++) {
            const nextIdx = i === end - 1 ? start : i + 1;
            const prevIdx = i === start ? end - 1 : i - 1;
            const x1 = vertices[prevIdx * 2];
            const y1 = vertices[prevIdx * 2 + 1];
            const x2 = vertices[i * 2];
            const y2 = vertices[i * 2 + 1];
            const x3 = vertices[nextIdx * 2];
            const y3 = vertices[nextIdx * 2 + 1];

            v1[0] = x2 - x1;
            v1[1] = y2 - y1;
            v2[0] = x3 - x2;
            v2[1] = y3 - y2;

            v2Normalize(v1, v1);
            v2Normalize(v2, v2);

            checkMiterLimit && (indicesMap[i] = outOff);
            if (!close && i === start) {
                v[0] = v2[1];
                v[1] = -v2[0];
                v2Normalize(v, v);
                out[outOff * 2] = x2 + v[0] * offset;
                out[outOff * 2 + 1] = y2 + v[1] * offset;
                outOff++;
            }
            else if (!close && i === end - 1) {
                v[0] = v1[1];
                v[1] = -v1[0];
                v2Normalize(v, v);
                out[outOff * 2] = x2 + v[0] * offset;
                out[outOff * 2 + 1] = y2 + v[1] * offset;
                outOff++;
            }
            else {
                // PENDING Why using sub will lost the direction info.
                v2Add(v, v2, v1);
                const tmp = v[1];
                v[1] = -v[0];
                v[0] = tmp;

                v2Normalize(v, v);

                const cosA = v2Dot(v, v2);
                const sinA = Math.sqrt(1 - cosA * cosA);
                // PENDING
                const miter = offset * Math.min(10, 1 / sinA);

                const isCovex = offset * cosA < 0;

                if (checkMiterLimit && (1 / sinA) > miterLimit && isCovex) {
                    const mx = x2 + v[0] * offset;
                    const my = y2 + v[1] * offset;
                    const halfA = Math.acos(sinA) / 2;
                    const dist = Math.tan(halfA) * Math.abs(offset);
                    out[outOff * 2] = mx + v[1] * dist;
                    out[outOff * 2 + 1] = my - v[0] * dist;
                    outOff++;
                    out[outOff * 2] = mx - v[1] * dist;
                    out[outOff * 2 + 1] = my + v[0] * dist;
                    outOff++;
                }
                else {
                    out[outOff * 2] = x2 + v[0] * miter;
                    out[outOff * 2 + 1] = y2 + v[1] * miter;
                    outOff++;
                }
            }
        }

        return indicesMap;
    }

    function offsetPolygon(vertices, holes, offset, miterLimit, close) {
        const offsetVertices = miterLimit != null ? [] : new Float32Array(vertices.length);
        const exteriorSize = (holes && holes.length) ? holes[0] : vertices.length / 2;

        innerOffsetPolygon(
            vertices, offsetVertices, 0, exteriorSize, 0, offset, miterLimit, close, true
        );

        if (holes) {
            for (let i = 0; i < holes.length; i++) {
                const start = holes[i];
                const end = holes[i + 1] || vertices.length / 2;
                innerOffsetPolygon(
                    vertices, offsetVertices, start, end,
                    miterLimit != null ? offsetVertices.length / 2 : start,
                    offset, miterLimit, close, false
                );
            }
        }

        // TODO holes
        // Remove intersections of offseted polygon
        // let len = offsetLines.length;
        // let tmpIntersection = [];
        // for (let i = 0; i < len; i++) {
        //     const line1 = offsetLines[i];
        //     for (let k = i + 1; k < len; k++) {
        //         const line2 = offsetLines[k];

        //         const t = lineIntersection(
        //             line1[0], line1[1], line1[2], line1[3],
        //             line2[0], line2[1], line2[2], line2[3], tmpIntersection, 0
        //         );
        //         // Use a eplison
        //         if (t >= -1e-2 && t <= 1 + 1e-2) {
        //             const cursor1 = line1[4] * 2;
        //             const cursor2 = line2[4] * 2;
        //             // Update
        //             offsetVertices[cursor1] = offsetVertices[cursor2] = line1[2] = line2[2] = tmpIntersection[0];
        //             offsetVertices[cursor1 + 1] = offsetVertices[cursor2 + 1] = line1[3] = line2[3]= tmpIntersection[1];
        //         }
        //     }
        // }
        return offsetVertices;
    }

    function reversePoints(points, stride, start, end) {
        for (let i = 0; i < Math.floor((end - start) / 2); i++) {
            for (let j = 0; j < stride; j++) {
                const a = (i + start) * stride + j;
                const b = (end - i - 1) * stride + j;
                const tmp = points[a];
                points[a] = points[b];
                points[b] = tmp;
            }
        }

        return points;
    }

    function convertToClockwise(vertices, holes) {
        let polygonVertexCount = vertices.length / 2;
        let start = 0;
        let end = holes && holes.length ? holes[0] : polygonVertexCount;
        if (area(vertices, start, end) > 0) {
            reversePoints(vertices, 2, start, end);
        }
        for (let h = 1; h < (holes ? holes.length : 0) + 1; h++) {
            start = holes[h - 1];
            end = holes[h] || polygonVertexCount;
            if (area(vertices, start, end) < 0) {
                reversePoints(vertices, 2, start, end);
            }
        }
    }

    function normalizeOpts(opts) {

        opts.depth = opts.depth || 1;
        opts.bevelSize = opts.bevelSize || 0;
        opts.bevelSegments = opts.bevelSegments == null ? 2 : opts.bevelSegments;
        opts.smoothBevel = opts.smoothBevel || false;
        opts.simplify = opts.simplify || 0;

        if (opts.smoothSide == null) {
            opts.smoothSide = 'auto';
        }
        if (opts.smoothSideThreshold == null) {
            opts.smoothSideThreshold = 0.9;
        }

        // Normalize bevel options.
        if (typeof opts.depth === 'number') {
            opts.bevelSize = Math.min(!(opts.bevelSegments > 0) ? 0 : opts.bevelSize, opts.depth / 2);
        }
        if (!(opts.bevelSize > 0)) {
            opts.bevelSegments = 0;
        }
        opts.bevelSegments = Math.round(opts.bevelSegments);

        const boundingRect = opts.boundingRect;
        opts.translate = opts.translate || [0, 0];
        opts.scale = opts.scale || [1, 1];
        if (opts.fitRect) {
            let targetX = opts.fitRect.x == null
                ? (boundingRect.x || 0)
                : opts.fitRect.x;
            let targetY = opts.fitRect.y == null
                ? (boundingRect.y || 0)
                : opts.fitRect.y;
            let targetWidth = opts.fitRect.width;
            let targetHeight = opts.fitRect.height;
            if (targetWidth == null) {
                if (targetHeight != null) {
                    targetWidth = targetHeight / boundingRect.height * boundingRect.width;
                }
                else {
                    targetWidth = boundingRect.width;
                    targetHeight = boundingRect.height;
                }
            }
            else if (targetHeight == null) {
                targetHeight = targetWidth / boundingRect.width * boundingRect.height;
            }
            opts.scale = [
                targetWidth / boundingRect.width,
                targetHeight / boundingRect.height
            ];
            opts.translate = [
                (targetX - boundingRect.x) * opts.scale[0],
                (targetY - boundingRect.y) * opts.scale[1]
            ];
        }
    }

    function generateNormal(indices, position) {

        function v3Set(p, a, b, c) {
            p[0] = a; p[1] = b; p[2] = c;
        }

        const p1 = [];
        const p2 = [];
        const p3 = [];

        const v21 = [];
        const v32 = [];

        const n = [];

        const len = indices.length;
        const normals = new Float32Array(position.length);

        for (let f = 0; f < len;) {
            const i1 = indices[f++] * 3;
            const i2 = indices[f++] * 3;
            const i3 = indices[f++] * 3;

            v3Set(p1, position[i1], position[i1 + 1], position[i1 + 2]);
            v3Set(p2, position[i2], position[i2 + 1], position[i2 + 2]);
            v3Set(p3, position[i3], position[i3 + 1], position[i3 + 2]);

            v3Sub(v21, p1, p2);
            v3Sub(v32, p2, p3);
            v3Cross(n, v21, v32);
            // Already be weighted by the triangle area
            for (let i = 0; i < 3; i++) {
                normals[i1 + i] = normals[i1 + i] + n[i];
                normals[i2 + i] = normals[i2 + i] + n[i];
                normals[i3 + i] = normals[i3 + i] + n[i];
            }
        }

        for (var i = 0; i < normals.length;) {
            v3Set(n, normals[i], normals[i + 1], normals[i + 2]);
            v3Normalize(n, n);
            normals[i++] = n[0];
            normals[i++] = n[1];
            normals[i++] = n[2];

        }

        return normals;
    }
    // 0,0----1,0
    // 0,1----1,1
    const quadToTriangle = [
        [0, 0], [1, 0], [1, 1],
        [0, 0], [1, 1], [0, 1]
    ];

    function ringDistance(vertices, start, end) {
        let distance = 0;
        let preX = vertices[start], preY = vertices[start + 1];
        const firstX = preX, firstY = preY;
        for (let i = start + 2; i < end; i += 2) {
            const x = vertices[i], y = vertices[i + 1];
            distance += Math.sqrt((x - preX) * (x - preX) + (y - preY) * (y - preY));
            preX = x;
            preY = y;
        }
        distance += Math.sqrt((preX - firstX) * (preX - firstX) + (preY - firstY) * (preY - firstY));
        return distance;
    }

    // Add side vertices and indices. Include bevel.
    function addExtrudeSide(
        out, { vertices, topVertices, splittedMap, depth, rect }, start, end,
        cursors, opts
    ) {
        const ringVertexCount = end - start;

        const splitBevel = opts.smoothBevel ? 1 : 2;
        const bevelSize = Math.min(depth / 2, opts.bevelSize);
        const bevelSegments = opts.bevelSegments;
        const vertexOffset = cursors.vertex;
        const ringPerimeter = cursors.ringPerimeter;
        const size = Math.max(rect.width, rect.height, depth, ringPerimeter);

        function isDuplicateVertex(idx) {
            const nextIdx = (idx + 1) % ringVertexCount;
            const x0 = vertices[idx * 2];
            const y0 = vertices[idx * 2 + 1];
            const x1 = vertices[nextIdx * 2];
            const y1 = vertices[nextIdx * 2 + 1];
            return x0 === x1 && y0 === y1;
        }

        // Side vertices
        if (bevelSize > 0) {
            const v0 = [0, 0, 1];
            const v1 = [];
            const v2 = [0, 0, -1];
            const v = [];

            let ringCount = 0;
            let vLen = new Float32Array(ringVertexCount);
            for (let k = 0; k < 2; k++) {
                const z = (k === 0 ? (depth - bevelSize) : bevelSize);
                for (let s = 0; s <= bevelSegments * splitBevel; s++) {
                    let uLen = 0;
                    let prevX;
                    let prevY;
                    for (let i = 0; i < ringVertexCount; i++) {
                        const idx = (i % ringVertexCount + start) * 2;
                        const rawIdx = splittedMap ? splittedMap[idx / 2] * 2 : idx;
                        v1[0] = vertices[idx] - topVertices[rawIdx];
                        v1[1] = vertices[idx + 1] - topVertices[rawIdx + 1];
                        v1[2] = 0;
                        const l = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
                        v1[0] /= l;
                        v1[1] /= l;

                        const t = (Math.floor(s / splitBevel) + (s % splitBevel)) / bevelSegments;
                        k === 0 ? slerp(v, v0, v1, t)
                            : slerp(v, v1, v2, t);

                        const t2 = k === 0 ? t : 1 - t;
                        const a = bevelSize * Math.sin(t2 * Math.PI / 2);
                        const b = l * Math.cos(t2 * Math.PI / 2);

                        // ellipse radius
                        const r = bevelSize * l / Math.sqrt(a * a + b * b);

                        const x = v[0] * r + topVertices[rawIdx];
                        const y = v[1] * r + topVertices[rawIdx + 1];
                        const zz = v[2] * r + z;
                        out.position[cursors.vertex * 3] = x;
                        out.position[cursors.vertex * 3 + 1] = y;
                        out.position[cursors.vertex * 3 + 2] = zz;

                        // TODO Cache and optimize
                        if (i > 0) {
                            uLen += Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y));
                        }
                        if (s > 0 || k > 0) {
                            let tmp = (cursors.vertex - ringVertexCount) * 3;
                            let prevX2 = out.position[tmp];
                            let prevY2 = out.position[tmp + 1];
                            let prevZ2 = out.position[tmp + 2];

                            vLen[i] += Math.sqrt(
                                (prevX2 - x) * (prevX2 - x)
                                + (prevY2 - y) * (prevY2 - y)
                                + (prevZ2 - zz) * (prevZ2 - zz)
                            );
                        }
                        out.uv[cursors.vertex * 2] = uLen / size;
                        out.uv[cursors.vertex * 2 + 1] = vLen[i] / size;

                        prevX = x;
                        prevY = y;
                        cursors.vertex++;

                        // Just ignore this face if vertex are duplicted in `splitVertices`
                        if (isDuplicateVertex(i)) {
                            continue;
                        }
                        if ((splitBevel > 1 && (s % splitBevel)) || (splitBevel === 1 && s >= 1)) {
                            for (let f = 0; f < 6; f++) {
                                const m = (quadToTriangle[f][0] + i) % ringVertexCount;
                                const n = quadToTriangle[f][1] + ringCount;
                                out.indices[cursors.index++] = (n - 1) * ringVertexCount + m + vertexOffset;
                            }
                        }
                    }

                    ringCount++;
                }
            }
        }
        else {
            for (let k = 0; k < 2; k++) {
                const z = k === 0 ? depth - bevelSize : bevelSize;
                let uLen = 0;
                let prevX;
                let prevY;
                for (let i = 0; i < ringVertexCount; i++) {
                    const idx = (i % ringVertexCount + start) * 2;
                    const x = vertices[idx];
                    const y = vertices[idx + 1];
                    out.position[cursors.vertex * 3] = x;
                    out.position[cursors.vertex * 3 + 1] = y;
                    out.position[cursors.vertex * 3 + 2] = z;
                    if (i > 0) {
                        uLen += Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y));
                    }
                    out.uv[cursors.vertex * 2] = uLen / size;
                    out.uv[cursors.vertex * 2 + 1] = z / size;
                    prevX = x;
                    prevY = y;

                    cursors.vertex++;
                }
            }
        }
        // Connect the side
        const sideStartRingN = bevelSize > 0 ? (bevelSegments * splitBevel + 1) : 1;
        for (let i = 0; i < ringVertexCount; i++) {
            // Just ignore this face if vertex are duplicted in `splitVertices`
            if (isDuplicateVertex(i)) {
                continue;
            }
            for (let f = 0; f < 6; f++) {
                const m = (quadToTriangle[f][0] + i) % ringVertexCount;
                const n = quadToTriangle[f][1] + sideStartRingN;
                out.indices[cursors.index++] = (n - 1) * ringVertexCount + m + vertexOffset;
            }
        }
    }

    function addTopAndBottom({ indices, topVertices, rect, depth }, out, cursors, opts) {
        if (topVertices.length <= 4) {
            return;
        }

        const vertexOffset = cursors.vertex;
        // Top indices
        const indicesLen = indices.length;
        for (let i = 0; i < indicesLen; i++) {
            out.indices[cursors.index++] = vertexOffset + indices[i];
        }
        const size = Math.max(rect.width, rect.height);
        // Top and bottom vertices
        for (let k = 0; k < (opts.excludeBottom ? 1 : 2); k++) {
            for (let i = 0; i < topVertices.length; i += 2) {
                const x = topVertices[i];
                const y = topVertices[i + 1];
                out.position[cursors.vertex * 3] = x;
                out.position[cursors.vertex * 3 + 1] = y;
                out.position[cursors.vertex * 3 + 2] = (1 - k) * depth;

                out.uv[cursors.vertex * 2] = (x - rect.x) / size;
                out.uv[cursors.vertex * 2 + 1] = (y - rect.y) / size;
                cursors.vertex++;
            }
        }
        // Bottom indices
        if (!opts.excludeBottom) {
            const vertexCount = topVertices.length / 2;
            for (let i = 0; i < indicesLen; i += 3) {
                for (let k = 0; k < 3; k++) {
                    out.indices[cursors.index++] = vertexOffset + vertexCount + indices[i + 2 - k];
                }
            }
        }
    }

    /**
     * Split vertices for sharp side.
     */
    function splitVertices(vertices, holes, smoothSide, smoothSideThreshold) {
        const isAutoSmooth = smoothSide == null || smoothSide === 'auto';
        if (smoothSide === true) {
            return { vertices, holes };
        }
        const newVertices = [];
        const newHoles = holes && [];
        const count = vertices.length / 2;
        const v1 = [];
        const v2 = [];

        // Map of splitted index to raw index
        const splittedMap = [];

        let start = 0;
        let end = 0;

        const polysCount = (holes ? holes.length : 0) + 1;
        for (let h = 0; h < polysCount; h++) {
            if (h === 0) {
                end = holes && holes.length ? holes[0] : count;
            }
            else {
                start = holes[h - 1];
                end = holes[h] || count;
            }

            for (let i = start; i < end; i++) {
                const x2 = vertices[i * 2];
                const y2 = vertices[i * 2 + 1];
                const nextIdx = i === end - 1 ? start : i + 1;
                const x3 = vertices[nextIdx * 2];
                const y3 = vertices[nextIdx * 2 + 1];

                if (isAutoSmooth) {
                    const prevIdx = i === start ? end - 1 : i - 1;
                    const x1 = vertices[prevIdx * 2];
                    const y1 = vertices[prevIdx * 2 + 1];

                    v1[0] = x1 - x2;
                    v1[1] = y1 - y2;
                    v2[0] = x3 - x2;
                    v2[1] = y3 - y2;

                    v2Normalize(v1, v1);
                    v2Normalize(v2, v2);

                    const angleCos = v2Dot(v1, v2) * 0.5 + 0.5;

                    if ((1 - angleCos) > smoothSideThreshold) {
                        newVertices.push(x2, y2);
                        splittedMap.push(i);
                    }
                    else {
                        newVertices.push(x2, y2, x2, y2);
                        splittedMap.push(i, i);
                    }
                }
                else {
                    newVertices.push(x2, y2, x2, y2);
                    splittedMap.push(i, i);
                }
            }

            if (h < polysCount - 1 && newHoles) {
                newHoles.push(newVertices.length / 2);
            }
        }

        return {
            vertices: new Float32Array(newVertices),
            splittedMap,
            holes: newHoles
        };
    }

    function innerExtrudeTriangulatedPolygon(preparedData, opts) {
        let indexCount = 0;
        let vertexCount = 0;

        for (let p = 0; p < preparedData.length; p++) {
            const { indices, vertices, splittedMap, topVertices, depth } = preparedData[p];
            const bevelSize = Math.min(depth / 2, opts.bevelSize);
            const bevelSegments = !(bevelSize > 0) ? 0 : opts.bevelSegments;

            const holes = preparedData[p].holes || [];

            indexCount += indices.length * (opts.excludeBottom ? 1 : 2);
            vertexCount += topVertices.length / 2 * (opts.excludeBottom ? 1 : 2);
            const ringCount = 2 + bevelSegments * 2;

            let start = 0;
            let end = 0;
            for (let h = 0; h < holes.length + 1; h++) {
                if (h === 0) {
                    end = holes.length ? holes[0] : vertices.length / 2;
                }
                else {
                    start = holes[h - 1];
                    end = holes[h] || vertices.length / 2;
                }

                const faceEnd = splittedMap ? splittedMap[end - 1] + 1 : end;
                const faceStart = splittedMap ? splittedMap[start] : start;
                indexCount += (faceEnd - faceStart) * 6 * (ringCount - 1);

                const sideRingVertexCount = end - start;
                vertexCount += sideRingVertexCount * ringCount
                    // Double the bevel vertex number if not smooth
                    + (!opts.smoothBevel ? bevelSegments * sideRingVertexCount * 2 : 0);
            }
        }

        const data = {
            position: new Float32Array(vertexCount * 3),
            indices: new (vertexCount > 0xffff ? Uint32Array : Uint16Array)(indexCount),
            uv: new Float32Array(vertexCount * 2)
        };

        const cursors = {
            vertex: 0, index: 0, ringPerimeter: 0
        };

        for (let d = 0; d < preparedData.length; d++) {
            addTopAndBottom(preparedData[d], data, cursors, opts);
        }

        for (let d = 0; d < preparedData.length; d++) {
            const { holes, vertices } = preparedData[d];
            const vertexCount = vertices.length / 2;

            let start = 0;
            let end = (holes && holes.length) ? holes[0] : vertexCount;
            cursors.ringPerimeter = ringDistance(preparedData[d].topVertices, start, end);
            // Add exterior
            addExtrudeSide(data, preparedData[d], start, end, cursors, opts);
            // Add holes
            if (holes) {
                for (let h = 0; h < holes.length; h++) {
                    start = holes[h];
                    end = holes[h + 1] || vertexCount;
                    cursors.ringPerimeter = ringDistance(preparedData[d].topVertices, start, end);
                    addExtrudeSide(data, preparedData[d], start, end, cursors, opts);
                }
            }
        }

        // Wrap uv
        for (let i = 0; i < data.uv.length; i++) {
            const val = data.uv[i];
            if (val > 0 && Math.round(val) === val) {
                data.uv[i] = 1;
            }
            else {
                data.uv[i] = val % 1;
            }
        }

        data.normal = generateNormal(data.indices, data.position);
        // PENDING
        data.boundingRect = preparedData[0] && preparedData[0].rect;

        return data;
    }

    function convertPolylineToTriangulatedPolygon(polyline, polylineIdx, opts) {
        const lineWidth = opts.lineWidth;
        const pointCount = polyline.length;
        const points = new Float32Array(pointCount * 2);
        const translate = opts.translate || [0, 0];
        const scale = opts.scale || [1, 1];
        for (let i = 0, k = 0; i < pointCount; i++) {
            points[k++] = polyline[i][0] * scale[0] + translate[0];
            points[k++] = polyline[i][1] * scale[1] + translate[1];
        }

        if (area(points, 0, pointCount) < 0) {
            reversePoints(points, 2, 0, pointCount);
        }

        const insidePoints = [];
        const outsidePoints = [];
        const miterLimit = opts.miterLimit;
        const outsideIndicesMap = innerOffsetPolyline(
            points, outsidePoints, 0, pointCount, 0, -lineWidth / 2, miterLimit, false);
        reversePoints(points, 2, 0, pointCount);
        const insideIndicesMap = innerOffsetPolyline(
            points, insidePoints, 0, pointCount, 0, -lineWidth / 2, miterLimit, false);

        const polygonVertexCount = (insidePoints.length + outsidePoints.length) / 2;
        const polygonVertices = new Float32Array(polygonVertexCount * 2);

        let offset = 0;
        const outsidePointCount = outsidePoints.length / 2;
        for (let i = 0; i < outsidePoints.length; i++) {
            polygonVertices[offset++] = outsidePoints[i];
        }
        for (let i = 0; i < insidePoints.length; i++) {
            polygonVertices[offset++] = insidePoints[i];
        }

        // Built indices
        const indices = new (polygonVertexCount > 0xffff ? Uint32Array : Uint16Array)(
            ((pointCount - 1) * 2 + (polygonVertexCount - pointCount * 2)) * 3
        );
        let off = 0;
        for (let i = 0; i < pointCount - 1; i++) {
            const i2 = i + 1;
            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i];
            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i] - 1;
            indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;

            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i];
            indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;
            indices[off++] = insideIndicesMap[i] + outsidePointCount;

            if (insideIndicesMap[i2] - insideIndicesMap[i] === 2) {
                indices[off++] = insideIndicesMap[i] + 2 + outsidePointCount;
                indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;
                indices[off++] = outsidePointCount - outsideIndicesMap[i2] - 1;
            }
            else if (outsideIndicesMap[i2] - outsideIndicesMap[i] === 2) {
                indices[off++] = insideIndicesMap[i2] + outsidePointCount;
                indices[off++] = outsidePointCount - 1 - (outsideIndicesMap[i] + 1);
                indices[off++] = outsidePointCount - 1 - (outsideIndicesMap[i] + 2);
            }
        }

        const topVertices = opts.bevelSize > 0
            ? offsetPolygon(polygonVertices, [], opts.bevelSize, null, true) : polygonVertices;
        const boundingRect = opts.boundingRect;

        const res = splitVertices(polygonVertices, null, opts.smoothSide, opts.smoothSideThreshold);
        return {
            vertices: res.vertices,
            rawVertices: topVertices,
            splittedMap: res.splittedMap,
            indices,
            topVertices,
            rect: {
                x: boundingRect.x * scale[0] + translate[0],
                y: boundingRect.y * scale[1] + translate[1],
                width: boundingRect.width * scale[0],
                height: boundingRect.height * scale[1],
            },
            depth: typeof opts.depth === 'function' ? opts.depth(polylineIdx) : opts.depth,
            holes: []
        };
    }

    function removeClosePointsOfPolygon(polygon, epsilon) {
        const newPolygon = [];
        for (let k = 0; k < polygon.length; k++) {
            const points = polygon[k];
            const newPoints = [];
            const len = points.length;
            let x1 = points[len - 1][0];
            let y1 = points[len - 1][1];
            let dist = 0;
            for (let i = 0; i < len; i++) {
                let x2 = points[i][0];
                let y2 = points[i][1];
                const dx = x2 - x1;
                const dy = y2 - y1;
                dist += Math.sqrt(dx * dx + dy * dy);
                if (dist > epsilon) {
                    newPoints.push(points[i]);
                    dist = 0;
                }
                x1 = x2;
                y1 = y2;
            }
            if (newPoints.length >= 3) {
                newPolygon.push(newPoints);
            }
        }
        return newPolygon.length > 0 ? newPolygon : null;
    }

    function simplifyPolygon(polygon, tolerance) {
        const newPolygon = [];
        for (let k = 0; k < polygon.length; k++) {
            let points = polygon[k];
            points = simplify(points, tolerance, true);
            if (points.length >= 3) {
                newPolygon.push(points);
            }
        }
        return newPolygon.length > 0 ? newPolygon : null;
    }
    /**
     *
     * @param {Array} polygons Polygons array that match GeoJSON MultiPolygon geometry.
     * @param {Object} [opts]
     * @param {number|Function} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     *
     * @return {Object} {indices, position, uv, normal, boundingRect}
     */
    function extrudePolygon(polygons, opts) {

        opts = Object.assign({}, opts);

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];
        for (let i = 0; i < polygons.length; i++) {
            updateBoundingRect(polygons[i][0], min, max);
        }
        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        normalizeOpts(opts);

        const preparedData = [];
        const translate = opts.translate || [0, 0];
        const scale = opts.scale || [1, 1];
        const boundingRect = opts.boundingRect;
        const transformdRect = {
            x: boundingRect.x * scale[0] + translate[0],
            y: boundingRect.y * scale[1] + translate[1],
            width: boundingRect.width * scale[0],
            height: boundingRect.height * scale[1],
        };

        const epsilon = Math.min(
            boundingRect.width, boundingRect.height
        ) / 1e5;
        for (let i = 0; i < polygons.length; i++) {
            let newPolygon = removeClosePointsOfPolygon(polygons[i], epsilon);
            if (!newPolygon) {
                continue;
            }
            const simplifyTolerance = opts.simplify / Math.max(scale[0], scale[1]);
            if (simplifyTolerance > 0) {
                newPolygon = simplifyPolygon(newPolygon, simplifyTolerance);
            }
            if (!newPolygon) {
                continue;
            }

            const { vertices, holes, dimensions } = earcut$1.flatten(newPolygon);

            for (let k = 0; k < vertices.length;) {
                vertices[k] = vertices[k++] * scale[0] + translate[0];
                vertices[k] = vertices[k++] * scale[1] + translate[1];
            }

            convertToClockwise(vertices, holes);

            if (dimensions !== 2) {
                throw new Error('Only 2D polygon points are supported');
            }
            const topVertices = opts.bevelSize > 0
                ? offsetPolygon(vertices, holes, opts.bevelSize, null, true) : vertices;
            const indices = triangulate(topVertices, holes, dimensions);
            const res = splitVertices(vertices, holes, opts.smoothSide, opts.smoothSideThreshold);

            preparedData.push({
                indices,
                vertices: res.vertices,
                rawVertices: vertices,
                topVertices,
                holes: res.holes,
                splittedMap: res.splittedMap,
                rect: transformdRect,
                depth: typeof opts.depth === 'function' ? opts.depth(i) : opts.depth
            });
        }
        return innerExtrudeTriangulatedPolygon(preparedData, opts);
    }
    /**
     *
     * @param {Array} polylines Polylines array that match GeoJSON MultiLineString geometry.
     * @param {Object} [opts]
     * @param {number} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {boolean} [opts.lineWidth = 1]
     * @param {boolean} [opts.miterLimit = 2]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     * @param {Object} [opts.boundingRect]
     * @return {Object} {indices, position, uv, normal, boundingRect}
     */
    function extrudePolyline(polylines, opts) {

        opts = Object.assign({}, opts);

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];
        for (let i = 0; i < polylines.length; i++) {
            updateBoundingRect(polylines[i], min, max);
        }
        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        normalizeOpts(opts);
        const scale = opts.scale || [1, 1];

        if (opts.lineWidth == null) {
            opts.lineWidth = 1;
        }
        if (opts.miterLimit == null) {
            opts.miterLimit = 2;
        }
        const preparedData = [];
        // Extrude polyline to polygon
        for (let i = 0; i < polylines.length; i++) {
            let newPolyline = polylines[i];
            const simplifyTolerance = opts.simplify / Math.max(scale[0], scale[1]);
            if (simplifyTolerance > 0) {
                newPolyline = simplify(newPolyline, simplifyTolerance, true);
            }
            preparedData.push(convertPolylineToTriangulatedPolygon(newPolyline, i, opts));
        }

        return innerExtrudeTriangulatedPolygon(preparedData, opts);
    }

    function updateBoundingRect(points, min, max) {
        for (let i = 0; i < points.length; i++) {
            min[0] = Math.min(points[i][0], min[0]);
            min[1] = Math.min(points[i][1], min[1]);
            max[0] = Math.max(points[i][0], max[0]);
            max[1] = Math.max(points[i][1], max[1]);
        }
    }

    /**
     *
     * @param {Object} geojson
     * @param {Object} [opts]
     * @param {number} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {boolean} [opts.lineWidth = 1]
     * @param {boolean} [opts.miterLimit = 2]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     * @param {Object} [opts.boundingRect]
     * @return {Object} {polyline: {indices, position, uv, normal}, polygon: {indices, position, uv, normal}}
     */

    // TODO Not merge feature
    function extrudeGeoJSON(geojson, opts) {

        opts = Object.assign({}, opts);

        const polylines = [];
        const polygons = [];

        const polylineFeatureIndices = [];
        const polygonFeatureIndices = [];

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];

        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i];
            const geometry = feature.geometry;
            if (geometry && geometry.coordinates) {
                switch (geometry.type) {
                    case 'LineString':
                        polylines.push(geometry.coordinates);
                        polylineFeatureIndices.push(i);
                        updateBoundingRect(geometry.coordinates, min, max);
                        break;
                    case 'MultiLineString':
                        for (let k = 0; k < geometry.coordinates.length; k++) {
                            polylines.push(geometry.coordinates[k]);
                            polylineFeatureIndices.push(i);
                            updateBoundingRect(geometry.coordinates[k], min, max);
                        }
                        break;
                    case 'Polygon':
                        polygons.push(geometry.coordinates);
                        polygonFeatureIndices.push(i);
                        updateBoundingRect(geometry.coordinates[0], min, max);
                        break;
                    case 'MultiPolygon':
                        for (let k = 0; k < geometry.coordinates.length; k++) {
                            polygons.push(geometry.coordinates[k]);
                            polygonFeatureIndices.push(i);
                            updateBoundingRect(geometry.coordinates[k][0], min, max);
                        }
                        break;
                }
            }
        }

        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        const originalDepth = opts.depth;
        return {
            polyline: extrudePolyline(polylines, Object.assign(opts, {
                depth: function (idx) {
                    if (typeof originalDepth === 'function') {
                        return originalDepth(
                            geojson.features[polylineFeatureIndices[idx]]
                        );
                    }
                    return originalDepth;
                }
            })),
            polygon: extrudePolygon(polygons, Object.assign(opts, {
                depth: function (idx) {
                    if (typeof originalDepth === 'function') {
                        return originalDepth(
                            geojson.features[polygonFeatureIndices[idx]]
                        );
                    }
                    return originalDepth;
                }
            }))
        };
    }

    var main = /*#__PURE__*/Object.freeze({
        __proto__: null,
        triangulate: triangulate,
        flatten: flatten,
        offsetPolygon: offsetPolygon,
        extrudePolygon: extrudePolygon,
        extrudePolyline: extrudePolyline,
        extrudeGeoJSON: extrudeGeoJSON
    });

    const fetchDataWorkerKey = '__maptalks.three.fetchdata__';
    function fetchDataWorkerCode(exports) {
        const tasks = [], taskings = [], concurrentCount = 5;
        exports.initialize = function () {
        };
        exports.onmessage = function (message, postResponse) {
            const data = message.data;
            const task = {
                url: data,
                postResponse,
                abort: false
            };
            loopTask(task);
        };
        function loopTask(task) {
            if (task.abort) {
                taskings.splice(taskings.indexOf(task), 1);
                if (tasks.length) {
                    taskings.push(tasks[0]);
                    tasks.splice(0, 1);
                    fetchData(taskings[taskings.length - 1]);
                }
            }
            else if (taskings.length < concurrentCount) {
                taskings.push(task);
                fetchData(task);
            }
            else {
                tasks.push(task);
            }
        }
        function fetchData(task) {
            fetch(task.url).then(res => res.text()).then((json) => {
                const blob = new Blob([json], { type: 'application/json' });
                blob.arrayBuffer().then(arrayBuffer => {
                    task.postResponse(null, arrayBuffer, [arrayBuffer]);
                    task.abort = true;
                    loopTask(task);
                });
            }).catch(error => {
                console.error(error);
                task.abort = true;
                loopTask(task);
            });
        }
    }
    var actor;
    function getFetchDataActor() {
        if (!maptalks__namespace.worker) {
            console.error('maptalks.worker is not defined,You can\'t use');
        }
        if (!actor) {
            actor = new maptalks__namespace.worker.Actor(fetchDataWorkerKey);
        }
        return actor;
    }

    const OPTIONS$1 = {
        bottomHeight: 0,
        width: 3,
        cornerRadius: 0,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class Path extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$1, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { width, cornerRadius, bottomHeight, altitude, asynchronous } = options;
            const cr = layer.distanceToVector3(cornerRadius, cornerRadius).x;
            const w = layer.distanceToVector3(width, width).x;
            const { lineStrings, center } = LineStringSplit(lineString);
            let geometry;
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                PathTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    center,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const extrudeParams = [];
                const cache = {};
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const attribute = getPathParams(lineStrings[i], w, cr, layer, center);
                    setBottomHeight(attribute, bottomHeight, layer, cache);
                    extrudeParams.push(attribute);
                }
                geometry = mergeBufferGeometries(extrudeParams);
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'Path';
        }
        _workerLoad(result) {
            const bufferGeometry = generateBufferGeometry(result);
            const object3d = this.getObject3d();
            object3d.geometry = bufferGeometry;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS = {
        width: 3,
        cornerRadius: 0,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61'
    };
    class Paths extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS, options, { layer, lineStrings, coordinate: center });
            const { altitude, asynchronous } = options;
            let bufferGeometry;
            const extrudeLines = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                PathsTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                const geometries = [];
                let psIndex = 0;
                const cache = {}, altCache = {};
                for (let i = 0; i < len; i++) {
                    const lineString = lineStrings[i];
                    const opts = maptalks__namespace.Util.extend({}, options, getLineStringProperties(lineString), { index: i });
                    const { cornerRadius, width, bottomHeight } = opts;
                    const w = distanceToVector3(width, layer, cache);
                    const rc = distanceToVector3(cornerRadius, layer, altCache);
                    const lls = lineStringList[i];
                    const extrudeParams = [];
                    let minZ = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const attribute = getPathParams(lls[m], w, rc, layer, center);
                        minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                        extrudeParams.push(attribute);
                    }
                    const buffGeom = mergeBufferGeometriesAttribute(extrudeParams);
                    geometries.push(buffGeom);
                    // const extrudeLine = new ExtrudeLine(lineString, opts, material, layer);
                    // extrudeLines.push(extrudeLine);
                    const { position, normal, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // color: {
                        //     count: colorCount,
                        //     start: colorIndex,
                        //     end: colorIndex + colorCount * 3,
                        // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                    // colorIndex += colorCount * 3;
                    // uvIndex += uvCount * 2;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudeLines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudeLines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'Paths';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties(), { index });
                    this._baseObjects[index] = new Path(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.getObject3d().geometry = bufferGeometry;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    var workerCode = `(function(t){"use strict";
/*!
   * poly-extrude v0.16.0
    */function n(t,n){for(var i=0;i<n.length;i++){var e=n[i];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}function i(t,n){return(i=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t})(t,n)}function e(t,n,i){void 0===i&&(i=2);var e,s,h,a=n&&n.length,u=a?n[0]*i:t.length,c=r(t,0,u,i,!0),x=[];if(!c||c.next===c.prev)return x;if(a&&(c=function(t,n,i,e){for(var s=[],o=0,h=n.length;o<h;o++){var a=r(t,n[o]*e,o<h-1?n[o+1]*e:t.length,e,!1);a===a.next&&(a.steiner=!0),s.push(d(a))}s.sort(l);for(var u=0;u<s.length;u++)i=f(s[u],i);return i}(t,n,c,i)),t.length>80*i){e=1/0,s=1/0;for(var y=-1/0,p=-1/0,v=i;v<u;v+=i){var g=t[v],_=t[v+1];g<e&&(e=g),_<s&&(s=_),g>y&&(y=g),_>p&&(p=_)}h=0!==(h=Math.max(y-e,p-s))?32767/h:0}return o(c,x,i,e,s,h,0),x}function r(t,n,i,e,r){var s;if(r===function(t,n,i,e){for(var r=0,s=n,o=i-e;s<i;s+=e)r+=(t[o]-t[s])*(t[s+1]+t[o+1]),o=s;return r}(t,n,i,e)>0)for(var o=n;o<i;o+=e)s=P(o/e|0,t[o],t[o+1],s);else for(var h=i-e;h>=n;h-=e)s=P(h/e|0,t[h],t[h+1],s);return s&&m(s,s.next)&&(S(s),s=s.next),s}function s(t,n){if(!t)return t;n||(n=t);var i,e=t;do{if(i=!1,e.steiner||!m(e,e.next)&&0!==_(e.prev,e,e.next))e=e.next;else{if(S(e),(e=n=e.prev)===e.next)break;i=!0}}while(i||e!==n);return n}function o(t,n,i,e,r,l,f){if(t){!f&&l&&function(t,n,i,e){var r=t;do{0===r.z&&(r.z=y(r.x,r.y,n,i,e)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next}while(r!==t);r.prevZ.nextZ=null,r.prevZ=null,function(t){var n,i=1;do{var e=t,r=void 0;t=null;var s=null;for(n=0;e;){n++;for(var o=e,h=0,a=0;a<i&&(h++,o=o.nextZ);a++);for(var u=i;h>0||u>0&&o;)0!==h&&(0===u||!o||e.z<=o.z)?(r=e,e=e.nextZ,h--):(r=o,o=o.nextZ,u--),s?s.nextZ=r:t=r,r.prevZ=s,s=r;e=o}s.nextZ=null,i*=2}while(n>1)}(r)}(t,e,r,l);for(var x=t;t.prev!==t.next;){var d=t.prev,p=t.next;if(l?a(t,e,r,l):h(t))n.push(d.i,t.i,p.i),S(t),t=p.next,x=p.next;else if((t=p)===x){f?1===f?o(t=u(s(t),n),n,i,e,r,l,2):2===f&&c(t,n,i,e,r,l):o(s(t),n,i,e,r,l,1);break}}}}function h(t){var n=t.prev,i=t,e=t.next;if(_(n,i,e)>=0)return!1;for(var r=n.x,s=i.x,o=e.x,h=n.y,a=i.y,u=e.y,c=Math.min(r,s,o),l=Math.min(h,a,u),f=Math.max(r,s,o),x=Math.max(h,a,u),y=e.next;y!==n;){if(y.x>=c&&y.x<=f&&y.y>=l&&y.y<=x&&v(r,h,s,a,o,u,y.x,y.y)&&_(y.prev,y,y.next)>=0)return!1;y=y.next}return!0}function a(t,n,i,e){var r=t.prev,s=t,o=t.next;if(_(r,s,o)>=0)return!1;for(var h=r.x,a=s.x,u=o.x,c=r.y,l=s.y,f=o.y,x=Math.min(h,a,u),d=Math.min(c,l,f),p=Math.max(h,a,u),g=Math.max(c,l,f),m=y(x,d,n,i,e),z=y(p,g,n,i,e),w=t.prevZ,M=t.nextZ;w&&w.z>=m&&M&&M.z<=z;){if(w.x>=x&&w.x<=p&&w.y>=d&&w.y<=g&&w!==r&&w!==o&&v(h,c,a,l,u,f,w.x,w.y)&&_(w.prev,w,w.next)>=0)return!1;if(w=w.prevZ,M.x>=x&&M.x<=p&&M.y>=d&&M.y<=g&&M!==r&&M!==o&&v(h,c,a,l,u,f,M.x,M.y)&&_(M.prev,M,M.next)>=0)return!1;M=M.nextZ}for(;w&&w.z>=m;){if(w.x>=x&&w.x<=p&&w.y>=d&&w.y<=g&&w!==r&&w!==o&&v(h,c,a,l,u,f,w.x,w.y)&&_(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;M&&M.z<=z;){if(M.x>=x&&M.x<=p&&M.y>=d&&M.y<=g&&M!==r&&M!==o&&v(h,c,a,l,u,f,M.x,M.y)&&_(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function u(t,n){var i=t;do{var e=i.prev,r=i.next.next;!m(e,r)&&z(e,i,i.next,r)&&b(e,r)&&b(r,e)&&(n.push(e.i,i.i,r.i),S(i),S(i.next),i=t=r),i=i.next}while(i!==t);return s(i)}function c(t,n,i,e,r,h){var a=t;do{for(var u=a.next.next;u!==a.prev;){if(a.i!==u.i&&g(a,u)){var c=A(a,u);return a=s(a,a.next),c=s(c,c.next),o(a,n,i,e,r,h,0),void o(c,n,i,e,r,h,0)}u=u.next}a=a.next}while(a!==t)}function l(t,n){var i=t.x-n.x;0===i&&(0===(i=t.y-n.y)&&(i=(t.next.y-t.y)/(t.next.x-t.x)-(n.next.y-n.y)/(n.next.x-n.x)));return i}function f(t,n){var i=function(t,n){var i,e=n,r=t.x,s=t.y,o=-1/0;if(m(t,e))return e;do{if(m(t,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){var h=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=r&&h>o&&(o=h,i=e.x<e.next.x?e:e.next,h===r))return i}e=e.next}while(e!==n);if(!i)return null;var a=i,u=i.x,c=i.y,l=1/0;e=i;do{if(r>=e.x&&e.x>=u&&r!==e.x&&p(s<c?r:o,s,u,c,s<c?o:r,s,e.x,e.y)){var f=Math.abs(s-e.y)/(r-e.x);b(e,t)&&(f<l||f===l&&(e.x>i.x||e.x===i.x&&x(i,e)))&&(i=e,l=f)}e=e.next}while(e!==a);return i}(t,n);if(!i)return n;var e=A(i,t);return s(e,e.next),s(i,i.next)}function x(t,n){return _(t.prev,t,n.prev)<0&&_(n.next,t,t.next)<0}function y(t,n,i,e,r){return(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=(t-i)*r|0)|t<<8))|t<<4))|t<<2))|t<<1))|(n=1431655765&((n=858993459&((n=252645135&((n=16711935&((n=(n-e)*r|0)|n<<8))|n<<4))|n<<2))|n<<1))<<1}function d(t){var n=t,i=t;do{(n.x<i.x||n.x===i.x&&n.y<i.y)&&(i=n),n=n.next}while(n!==t);return i}function p(t,n,i,e,r,s,o,h){return(r-o)*(n-h)>=(t-o)*(s-h)&&(t-o)*(e-h)>=(i-o)*(n-h)&&(i-o)*(s-h)>=(r-o)*(e-h)}function v(t,n,i,e,r,s,o,h){return!(t===o&&n===h)&&p(t,n,i,e,r,s,o,h)}function g(t,n){return t.next.i!==n.i&&t.prev.i!==n.i&&!function(t,n){var i=t;do{if(i.i!==t.i&&i.next.i!==t.i&&i.i!==n.i&&i.next.i!==n.i&&z(i,i.next,t,n))return!0;i=i.next}while(i!==t);return!1}(t,n)&&(b(t,n)&&b(n,t)&&function(t,n){var i=t,e=!1,r=(t.x+n.x)/2,s=(t.y+n.y)/2;do{i.y>s!=i.next.y>s&&i.next.y!==i.y&&r<(i.next.x-i.x)*(s-i.y)/(i.next.y-i.y)+i.x&&(e=!e),i=i.next}while(i!==t);return e}(t,n)&&(_(t.prev,t,n.prev)||_(t,n.prev,n))||m(t,n)&&_(t.prev,t,t.next)>0&&_(n.prev,n,n.next)>0)}function _(t,n,i){return(n.y-t.y)*(i.x-n.x)-(n.x-t.x)*(i.y-n.y)}function m(t,n){return t.x===n.x&&t.y===n.y}function z(t,n,i,e){var r=M(_(t,n,i)),s=M(_(t,n,e)),o=M(_(i,e,t)),h=M(_(i,e,n));return r!==s&&o!==h||(!(0!==r||!w(t,i,n))||(!(0!==s||!w(t,e,n))||(!(0!==o||!w(i,t,e))||!(0!==h||!w(i,n,e)))))}function w(t,n,i){return n.x<=Math.max(t.x,i.x)&&n.x>=Math.min(t.x,i.x)&&n.y<=Math.max(t.y,i.y)&&n.y>=Math.min(t.y,i.y)}function M(t){return t>0?1:t<0?-1:0}function b(t,n){return _(t.prev,t,t.next)<0?_(t,n,t.next)>=0&&_(t,t.prev,n)>=0:_(t,n,t.prev)<0||_(t,t.next,n)<0}function A(t,n){var i=C(t.i,t.x,t.y),e=C(n.i,n.x,n.y),r=t.next,s=n.prev;return t.next=n,n.prev=t,i.next=r,r.prev=i,e.next=i,i.prev=e,s.next=e,e.prev=s,e}function P(t,n,i,e){var r=C(t,n,i);return e?(r.next=e.next,r.prev=e,e.next.prev=r,e.next=r):(r.prev=r,r.next=r),r}function S(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function C(t,n,i){return{i:t,x:n,y:i,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}var k=new(function(){function t(t,n,i,e){void 0===t&&(t=0),void 0===n&&(n=0),void 0===i&&(i=0),void 0===e&&(e=1),this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=e}t.slerpFlat=function(t,n,i,e,r,s,o){var h=i[e+0],a=i[e+1],u=i[e+2],c=i[e+3],l=r[s+0],f=r[s+1],x=r[s+2],y=r[s+3];if(0===o)return t[n+0]=h,t[n+1]=a,t[n+2]=u,void(t[n+3]=c);if(1===o)return t[n+0]=l,t[n+1]=f,t[n+2]=x,void(t[n+3]=y);if(c!==y||h!==l||a!==f||u!==x){var d=1-o,p=h*l+a*f+u*x+c*y,v=p>=0?1:-1,g=1-p*p;if(g>Number.EPSILON){var _=Math.sqrt(g),m=Math.atan2(_,p*v);d=Math.sin(d*m)/_,o=Math.sin(o*m)/_}var z=o*v;if(h=h*d+l*z,a=a*d+f*z,u=u*d+x*z,c=c*d+y*z,d===1-o){var w=1/Math.sqrt(h*h+a*a+u*u+c*c);h*=w,a*=w,u*=w,c*=w}}t[n]=h,t[n+1]=a,t[n+2]=u,t[n+3]=c},t.multiplyQuaternionsFlat=function(t,n,i,e,r,s){var o=i[e],h=i[e+1],a=i[e+2],u=i[e+3],c=r[s],l=r[s+1],f=r[s+2],x=r[s+3];return t[n]=o*x+u*c+h*f-a*l,t[n+1]=h*x+u*l+a*c-o*f,t[n+2]=a*x+u*f+o*l-h*c,t[n+3]=u*x-o*c-h*l-a*f,t};var i,e,r,s=t.prototype;return s.set=function(t,n,i,e){return this._x=t,this._y=n,this._z=i,this._w=e,this._onChangeCallback(),this},s.clone=function(){return new this.constructor(this._x,this._y,this._z,this._w)},s.copy=function(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this},s.setFromEuler=function(t,n){void 0===n&&(n=!0);var i=t._x,e=t._y,r=t._z,s=t._order,o=Math.cos,h=Math.sin,a=o(i/2),u=o(e/2),c=o(r/2),l=h(i/2),f=h(e/2),x=h(r/2);switch(s){case"XYZ":this._x=l*u*c+a*f*x,this._y=a*f*c-l*u*x,this._z=a*u*x+l*f*c,this._w=a*u*c-l*f*x;break;case"YXZ":this._x=l*u*c+a*f*x,this._y=a*f*c-l*u*x,this._z=a*u*x-l*f*c,this._w=a*u*c+l*f*x;break;case"ZXY":this._x=l*u*c-a*f*x,this._y=a*f*c+l*u*x,this._z=a*u*x+l*f*c,this._w=a*u*c-l*f*x;break;case"ZYX":this._x=l*u*c-a*f*x,this._y=a*f*c+l*u*x,this._z=a*u*x-l*f*c,this._w=a*u*c+l*f*x;break;case"YZX":this._x=l*u*c+a*f*x,this._y=a*f*c+l*u*x,this._z=a*u*x-l*f*c,this._w=a*u*c-l*f*x;break;case"XZY":this._x=l*u*c-a*f*x,this._y=a*f*c-l*u*x,this._z=a*u*x+l*f*c,this._w=a*u*c+l*f*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return!0===n&&this._onChangeCallback(),this},s.setFromAxisAngle=function(t,n){var i=n/2,e=Math.sin(i);return this._x=t.x*e,this._y=t.y*e,this._z=t.z*e,this._w=Math.cos(i),this._onChangeCallback(),this},s.setFromRotationMatrix=function(t){var n=t.elements,i=n[0],e=n[4],r=n[8],s=n[1],o=n[5],h=n[9],a=n[2],u=n[6],c=n[10],l=i+o+c;if(l>0){var f=.5/Math.sqrt(l+1);this._w=.25/f,this._x=(u-h)*f,this._y=(r-a)*f,this._z=(s-e)*f}else if(i>o&&i>c){var x=2*Math.sqrt(1+i-o-c);this._w=(u-h)/x,this._x=.25*x,this._y=(e+s)/x,this._z=(r+a)/x}else if(o>c){var y=2*Math.sqrt(1+o-i-c);this._w=(r-a)/y,this._x=(e+s)/y,this._y=.25*y,this._z=(h+u)/y}else{var d=2*Math.sqrt(1+c-i-o);this._w=(s-e)/d,this._x=(r+a)/d,this._y=(h+u)/d,this._z=.25*d}return this._onChangeCallback(),this},s.setFromUnitVectors=function(t,n){var i=t.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()},s.rotateTowards=function(t,n){var i=this.angleTo(t);if(0===i)return this;var e=Math.min(1,n/i);return this.slerp(t,e),this},s.identity=function(){return this.set(0,0,0,1)},s.invert=function(){return this.conjugate()},s.conjugate=function(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this},s.dot=function(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w},s.lengthSq=function(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w},s.length=function(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)},s.normalize=function(){var t=this.length();return 0===t?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this},s.multiply=function(t){return this.multiplyQuaternions(this,t)},s.premultiply=function(t){return this.multiplyQuaternions(t,this)},s.multiplyQuaternions=function(t,n){var i=t._x,e=t._y,r=t._z,s=t._w,o=n._x,h=n._y,a=n._z,u=n._w;return this._x=i*u+s*o+e*a-r*h,this._y=e*u+s*h+r*o-i*a,this._z=r*u+s*a+i*h-e*o,this._w=s*u-i*o-e*h-r*a,this._onChangeCallback(),this},s.slerp=function(t,n){if(0===n)return this;if(1===n)return this.copy(t);var i=this._x,e=this._y,r=this._z,s=this._w,o=s*t._w+i*t._x+e*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=s,this._x=i,this._y=e,this._z=r,this;var h=1-o*o;if(h<=Number.EPSILON){var a=1-n;return this._w=a*s+n*this._w,this._x=a*i+n*this._x,this._y=a*e+n*this._y,this._z=a*r+n*this._z,this.normalize(),this}var u=Math.sqrt(h),c=Math.atan2(u,o),l=Math.sin((1-n)*c)/u,f=Math.sin(n*c)/u;return this._w=s*l+this._w*f,this._x=i*l+this._x*f,this._y=e*l+this._y*f,this._z=r*l+this._z*f,this._onChangeCallback(),this},s.slerpQuaternions=function(t,n,i){return this.copy(t).slerp(n,i)},s.random=function(){var t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),e=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(e*Math.sin(t),e*Math.cos(t),r*Math.sin(n),r*Math.cos(n))},s.equals=function(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w},s.fromArray=function(t,n){return void 0===n&&(n=0),this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this},s.toArray=function(t,n){return void 0===t&&(t=[]),void 0===n&&(n=0),t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t},s.fromBufferAttribute=function(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this},s.toJSON=function(){return this.toArray()},s._onChange=function(t){return this._onChangeCallback=t,this},s._onChangeCallback=function(){},i=t,(e=[{key:"x",get:function(){return this._x},set:function(t){this._x=t,this._onChangeCallback()}},{key:"y",get:function(){return this._y},set:function(t){this._y=t,this._onChangeCallback()}},{key:"z",get:function(){return this._z},set:function(t){this._z=t,this._onChangeCallback()}},{key:"w",get:function(){return this._w},set:function(t){this._w=t,this._onChangeCallback()}}])&&n(i.prototype,e),r&&n(i,r),Object.defineProperty(i,"prototype",{writable:!1}),t}()),V=function(){function t(t,n,i){void 0===t&&(t=0),void 0===n&&(n=0),void 0===i&&(i=0),this.x=t,this.y=n,this.z=i}var n=t.prototype;return n.set=function(t,n,i){return void 0===i&&(i=this.z),this.x=t,this.y=n,this.z=i,this},n.clone=function(){return new this.constructor(this.x,this.y,this.z)},n.copy=function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this},n.add=function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this},n.addScalar=function(t){return this.x+=t,this.y+=t,this.z+=t,this},n.addVectors=function(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this},n.addScaledVector=function(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this},n.sub=function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this},n.subScalar=function(t){return this.x-=t,this.y-=t,this.z-=t,this},n.subVectors=function(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this},n.multiply=function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this},n.multiplyScalar=function(t){return this.x*=t,this.y*=t,this.z*=t,this},n.multiplyVectors=function(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this},n.applyAxisAngle=function(t,n){return this.applyQuaternion(k.setFromAxisAngle(t,n))},n.applyMatrix4=function(t){var n=this.x,i=this.y,e=this.z,r=t.elements,s=1/(r[3]*n+r[7]*i+r[11]*e+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*e+r[12])*s,this.y=(r[1]*n+r[5]*i+r[9]*e+r[13])*s,this.z=(r[2]*n+r[6]*i+r[10]*e+r[14])*s,this},n.applyQuaternion=function(t){var n=this.x,i=this.y,e=this.z,r=t.x,s=t.y,o=t.z,h=t.w,a=h*n+s*e-o*i,u=h*i+o*n-r*e,c=h*e+r*i-s*n,l=-r*n-s*i-o*e;return this.x=a*h+l*-r+u*-o-c*-s,this.y=u*h+l*-s+c*-r-a*-o,this.z=c*h+l*-o+a*-s-u*-r,this},n.divide=function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this},n.divideScalar=function(t){return this.multiplyScalar(1/t)},n.min=function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this},n.max=function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this},n.clamp=function(t,n){return this.x=Math.max(t.x,Math.min(n.x,this.x)),this.y=Math.max(t.y,Math.min(n.y,this.y)),this.z=Math.max(t.z,Math.min(n.z,this.z)),this},n.clampScalar=function(t,n){return this.x=Math.max(t,Math.min(n,this.x)),this.y=Math.max(t,Math.min(n,this.y)),this.z=Math.max(t,Math.min(n,this.z)),this},n.clampLength=function(t,n){var i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(n,i)))},n.dot=function(t){return this.x*t.x+this.y*t.y+this.z*t.z},n.lengthSq=function(){return this.x*this.x+this.y*this.y+this.z*this.z},n.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},n.normalize=function(){return this.divideScalar(this.length()||1)},n.setLength=function(t){return this.normalize().multiplyScalar(t)},n.lerp=function(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this},n.lerpVectors=function(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this},n.cross=function(t){return this.crossVectors(this,t)},n.crossVectors=function(t,n){var i=t.x,e=t.y,r=t.z,s=n.x,o=n.y,h=n.z;return this.x=e*h-r*o,this.y=r*s-i*h,this.z=i*o-e*s,this},n.distanceTo=function(t){return Math.sqrt(this.distanceToSquared(t))},n.equals=function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z},n.fromArray=function(t,n){return void 0===n&&(n=0),this.x=t[n],this.y=t[n+1],this.z=t[n+2],this},n.random=function(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this},t}();function Z(t){let n,i,e=0,r=1;const s=t.length;for(;r<s;)n=i||t[0],i=t[r],e+=(i[0]-n[0])*(i[1]+n[1]),r++;return e>0}function F(t,n,i){return t[0]=n[0]-i[0],t[1]=n[1]-i[1],t[2]=n[2]-i[2],t}function L(t,n){const i=n[0],e=n[1],r=n[2],s=Math.sqrt(i*i+e*e+r*r)||1;return t[0]=i/s,t[1]=e/s,t[2]=r/s,t}function q(t,n,i){const e=n[0],r=n[1],s=n[2],o=i[0],h=i[1],a=i[2];return t[0]=r*a-s*h,t[1]=s*o-e*a,t[2]=e*h-r*o,t}function E(t,n){function i(t,n,i,e){t[0]=n,t[1]=i,t[2]=e}const e=[],r=[],s=[],o=[],h=[],a=[],u=t.length,c=new Float32Array(n.length);let l=0;for(;l<u;){const u=3*t[l],f=3*t[l+1],x=3*t[l+2];i(e,n[u],n[u+1],n[u+2]),i(r,n[f],n[f+1],n[f+2]),i(s,n[x],n[x+1],n[x+2]),F(h,s,r),F(o,e,r),q(a,h,o);for(let t=0;t<3;t++)c[u+t]+=a[t],c[f+t]+=a[t],c[x+t]+=a[t];l+=3}let f=0;const x=c.length;for(;f<x;)i(a,c[f],c[f+1],c[f+2]),L(a,a),c[f]=a[0]||0,c[f+1]=a[1]||0,c[f+2]=a[2]||0,f+=3;return c}function I(t){if(1===t.length){return{position:t[0].position,normal:t[0].normal,uv:t[0].uv,indices:t[0].indices,results:t}}let n=0,i=0;for(let e=0,r=t.length;e<r;e++){const{position:r,indices:s}=t[e];n+=r.length,i+=s.length}const e={position:new Float32Array(n),normal:new Float32Array(n),uv:new Float32Array(n/3*2),indices:new Uint32Array(i),results:t};let r=0,s=0,o=0,h=0;for(let n=0,i=t.length;n<i;n++){const{position:i,indices:a,normal:u,uv:c}=t[n];e.position.set(i,r),e.normal.set(u,r),e.uv.set(c,h);let l=0;const f=a.length;for(;l<f;){const t=a[l]+s;e.indices[o]=t,o++,l++}h+=c.length,r+=i.length,s+=i.length/3}return e}function O(t){return 180*t/Math.PI}function U(t){return t/180*Math.PI}function N(t,n,i,e,r,s){const o=3*i,h=3*e,a=3*r,u=3*s,c=n[o],l=n[o+1],f=n[o+2],x=n[h],y=n[h+1],d=n[h+2],p=n[a],v=n[a+1],g=n[a+2],_=n[u],m=n[u+1],z=n[u+2];let w=t.length-1;Math.abs(l-y)<Math.abs(c-x)?(t[++w]=c,t[++w]=1-f,t[++w]=x,t[++w]=1-d,t[++w]=p,t[++w]=1-g,t[++w]=_,t[++w]=1-z):(t[++w]=l,t[++w]=1-f,t[++w]=y,t[++w]=1-d,t[++w]=v,t[++w]=1-g,t[++w]=m,t[++w]=1-z)}function j(t,n){n=Object.assign({},{depth:2,top:!0},n);const i=I(t.map((t=>{for(let n=0,i=t.length;n<i;n++){const i=t[n];Q(i),0===n?Z(i)||(t[n]=i.reverse()):Z(i)&&(t[n]=i.reverse()),R(i)&&i.splice(i.length-1,1)}const i=function(t,n){const i=function(t){let n=0,i=0;const e=t.length;for(;i<e;)n+=t[i].length,i++;return n}(t),e=t.length,r=[],s=new Float32Array(2*i),o=[],h=[],a=3*i,u=2*i,c=n.depth;let l=0,f=0,x=0;for(let n=0;n<e;n++){const i=t[n];n>0&&r.push(l/2);let e=0;const y=i.length;for(;e<y;){const t=i[e],n=t[0],r=t[1],y=t[2]||0;s[l++]=n,s[l++]=r,o[f]=n,o[f+1]=r,o[f+2]=c+y,o[a+f]=n,o[a+f+1]=r,o[a+f+2]=y,h[x]=n,h[x+1]=r,h[u+x]=n,h[u+x+1]=r,f+=3,x+=2,e++}}return{flatVertices:s,holes:r,points:o,count:i,uv:h}}(t,n);i.polygon=t;return function(t,n,i){const e=[],{count:r}=t,s=i.top;for(let t=0,i=n.length;t<i;t+=3){const o=n[t],h=n[t+1],a=n[t+2];s&&(e[t]=o,e[t+1]=h,e[t+2]=a);let u=i+t;const c=r+o,l=r+h,f=r+a;s||(u=t),e[u]=c,e[u+1]=l,e[u+2]=f}t.indices=e}(i,e(i.flatVertices,i.holes,2),n),function(t,n){const{points:i,indices:e,polygon:r,uv:s}=t,o=n.depth;let h=i.length-1,a=e.length-1;for(let t=0,n=r.length;t<n;t++){const n=r[t];let u=0;const c=n.length;for(;u<c;){const t=n[u];let r=n[u+1];u===c-1&&(r=n[0]);const l=i.length/3,f=t[0],x=t[1],y=t[2]||0,d=r[0],p=r[1],v=r[2]||0;i[++h]=f,i[++h]=x,i[++h]=y+o,i[++h]=d,i[++h]=p,i[++h]=v+o,i[++h]=f,i[++h]=x,i[++h]=y,i[++h]=d,i[++h]=p,i[++h]=v;const g=l+2,_=l+3,m=l,z=l+1;e[++a]=g,e[++a]=m,e[++a]=_,e[++a]=m,e[++a]=z,e[++a]=_,N(s,i,g,_,m,z),u++}}}(i,n),i.position=new Float32Array(i.points),i.indices=new Uint32Array(i.indices),i.uv=new Float32Array(i.uv),i.normal=E(i.indices,i.position),i})));return i.polygons=t,i}function Q(t){R(t)||t.push(t[0])}function R(t){const n=t.length,[i,e]=t[0],[r,s]=t[n-1];return i===r&&e===s}function W(t,n){!function(t){t.lineWidth=Math.max(0,t.lineWidth),t.depth=Math.max(0,t.depth),t.sideDepth=Math.max(0,t.sideDepth)}(n=Object.assign({},{depth:2,lineWidth:1,bottomStickGround:!1,pathUV:!1},n));const i=I(t.map((t=>{const i=function(t,n){let i=n.lineWidth/2;n.isSlope&&(i*=2);const e=[],r=[],s=[],o=t.length;let h=0;for(;h<o;){let n=t[h],a=t[h+1];const u=t[h];h===o-1&&(n=t[o-2],a=t[o-1]);const c=a[1]-n[1],l=a[0]-n[0];let f=0;const x=O(Math.atan(c/l));if(0===h||h===o-1)f=x,f-=90;else{const i=t[h-1];B.x=i[0]-n[0],B.y=i[1]-n[1],T.x=a[0]-n[0],T.y=a[1]-n[1];f=x-H(B,T)/2}const y=U(f),d=u,p=[Math.cos(y)+d[0],Math.sin(y)+d[1]],[v,g]=Y(n,a,i);let _=D(v[0],v[1],d,p),m=D(g[0],g[1],d,p);if(!_||!m){const t=e.length,n=e[t-2],i=e[t-1];if(!n||!i)continue;_=[n[0],n[1]],m=[i[0],i[1]]}_[2]=u[2]||0,m[2]=u[2]||0,e.push(_,m),X(_,n,a)?(r.push(_),s.push(m)):(r.push(m),s.push(_)),h++}return{offsetPoints:e,leftPoints:r,rightPoints:s,line:t}}(t,n);return i.line=t,function(t,n){const i=n.bottomStickGround,e=n.depth,r=t.depths;let s=e,o=e;r&&(s=r[0],o=r[1]);const{leftPoints:h,rightPoints:a}=t,u=t.line,c=n.pathUV;if(c){!function(t){let n=0;for(let i=0,e=t.length;i<e;i++){const e=t[i],r=t[i+1];if(0===i&&(e.distance=0),e&&r){const[t,i,s]=e,[o,h,a]=r,u=t-o,c=i-h,l=(s||0)-(a||0);n+=Math.sqrt(u*u+c*c+l*l),r.distance=n}}}(u);for(let t=0,n=u.length;t<n;t++)h[t].distance=a[t].distance=u[t].distance}let l=0,f=h.length;const x=[],y=[],d=[];for(;l<f;){const t=3*l,[n,e,r]=h[l];x[t]=n,x[t+1]=e,x[t+2]=s+r;const[y,p,v]=a[l],g=3*f+t;x[g]=y,x[g+1]=p,x[g+2]=o+v;const _=2*f*3+t;x[_]=n,x[_+1]=e,x[_+2]=r,i&&(x[_+2]=0);const m=2*f*3+3*f+t;if(x[m]=y,x[m+1]=p,x[m+2]=v,i&&(x[m+2]=0),c){const t=u[l].distance,n=2*l;d[n]=t,d[n+1]=1;const i=2*f+n;d[i]=t,d[i+1]=0;const e=2*f*2+n;d[e]=t,d[e+1]=1;const r=2*f*2+2*f+n;d[r]=t,d[r+1]=0}l++}if(!c){l=0,f=x.length;let t=d.length-1;for(;l<f;){const n=x[l],i=x[l+1];d[++t]=n,d[++t]=i,l+=3}}l=0,f=h.length;let p=y.length-1;for(;l<f-1;){const t=l,n=l+1,i=t+f,e=n+f;y[++p]=t,y[++p]=i,y[++p]=n,y[++p]=i,y[++p]=e,y[++p]=n;const r=l+2*f,s=r+1,o=r+f,h=s+f;y[++p]=r,y[++p]=o,y[++p]=s,y[++p]=o,y[++p]=h,y[++p]=s,l++}if(t.indices=y,t.points=x,t.uv=d,r)for(f=h.length,l=0;l<f;)h[l].depth=s,a[l].depth=o,l++}(i,n),function(t,n){const{points:i,indices:e,leftPoints:r,rightPoints:s,uv:o}=t,h=n.depth,a=n.bottomStickGround,u=[r,s],c=t.depths,l=n.pathUV,f=n.lineWidth;let x=i.length-1,y=e.length-1,d=o.length-1;function p(t,n){const r=i.length/3,s=c?t.depth:h,u=c?n.depth:h;i[++x]=t[0],i[++x]=t[1],i[++x]=s+t[2],i[++x]=n[0],i[++x]=n[1],i[++x]=u+n[2],i[++x]=t[0],i[++x]=t[1],i[++x]=a?0:t[2],i[++x]=n[0],i[++x]=n[1],i[++x]=a?0:n[2];const p=r+2,v=r+3,g=r,_=r+1;e[++y]=p,e[++y]=g,e[++y]=v,e[++y]=g,e[++y]=_,e[++y]=v,l?(o[++d]=t.distance,o[++d]=s/f,o[++d]=n.distance,o[++d]=u/f,o[++d]=t.distance,o[++d]=0,o[++d]=n.distance,o[++d]=0):N(o,i,p,v,g,_)}for(let t=0,n=u.length;t<n;t++){let n=u[t];t>0&&(n=n.map((t=>t)),n=n.reverse());let i=0;const e=n.length-1;for(;i<e;){p(n[i],n[i+1]),i++}}const v=r.length,g=[s[0],r[0],r[v-1],s[v-1]];for(let t=0;t<g.length;t+=2){p(g[t],g[t+1])}}(i,n),i.position=new Float32Array(i.points),i.indices=new Uint32Array(i.indices),i.uv=new Float32Array(i.uv),i.normal=E(i.indices,i.position),i})));return i.lines=t,i}const B={x:0,y:0},T={x:0,y:0};const H=({x:t,y:n},{x:i,y:e})=>{const r=t*i+n*e,s=t*e-n*i;return(Math.atan2(s,r)/Math.PI*180+360)%360};function X(t,n,i){const[e,r]=n,[s,o]=i,[h,a]=t;return(r-o)*h+(s-e)*a+e*o-s*r>0}function Y(t,n,i){const e=n[1]-t[1],r=n[0]-t[0],s=Math.atan2(e,r),o=s+Math.PI/2;let h=Math.cos(o)*i,a=Math.sin(o)*i;const u=[t[0]+h,t[1]+a],c=[n[0]+h,n[1]+a],l=s-Math.PI/2;h=Math.cos(l)*i,a=Math.sin(l)*i;return[[u,c],[[t[0]+h,t[1]+a],[n[0]+h,n[1]+a]]]}function D(t,n,i,e){const r=n[0]-t[0],s=n[1]-t[1],o=e[0]-i[0],h=e[1]-i[1];if(0===r&&0===o)return null;if(0===s&&0===h)return null;const a=s/r,u=h/o,c=t[1]-a*t[0],l=i[1]-u*i[0];let f,x;return 0===r?(f=t[0],x=u*f+l):0===o?(f=i[0],x=a*f+c):0===s?(x=t[1],f=(x-l)/u):0===h?(x=i[1],f=(x-c)/a):(f=(l-c)/(a-u),x=a*f+c),[f,x]}function G(t,n){n=Object.assign({},{radius:1,height:2,radialSegments:6},n);const i=Math.round(Math.max(4,n.radialSegments));let{radius:e,height:r}=n;e=e,r=r;const s=360/i/360*Math.PI*2,o=i+1,h=new Float32Array(3*o*2),[a,u]=t;let c=0,l=0;const f=3*o,x=2*o,y=[],d=[];let p=y.length-1;for(let t=-1;t<i;t++){const n=s*t,i=Math.cos(n)*e+a,o=Math.sin(n)*e+u;h[c]=i,h[c+1]=o,h[c+2]=0,h[c+f]=i,h[c+1+f]=o,h[c+2+f]=r;let v=0,g=0;v=.5+i/e/2,g=.5+o/e/2,d[l]=v,d[l+1]=g,d[l+x]=v,d[l+1+x]=g,c+=3,l+=2,t>1&&(y[++p]=0,y[++p]=t-1,y[++p]=t)}c-=3,h[c]=h[0],h[c+1]=h[1],h[c+2]=h[2];const v=h.length;h[v-3]=h[0],h[v-2]=h[1],h[v-1]=r;const g=y.length;p=y.length-1;for(let t=0;t<g;t++){const n=y[t];y[++p]=n+o}const _=new Float32Array(2*(3*o*2-6));let m=-1;c=2*o,l=0,p=y.length-1;let z=d.length-1;for(let t=0,n=h.length/2;t<n-3;t+=3){const n=h[t],i=h[t+1],s=h[t+3],a=h[t+4];_[++m]=n,_[++m]=i,_[++m]=r,_[++m]=s,_[++m]=a,_[++m]=r,_[++m]=n,_[++m]=i,_[++m]=0,_[++m]=s,_[++m]=a,_[++m]=0;const u=c+2,f=c+3,x=c,v=c+1;y[++p]=x,y[++p]=u,y[++p]=v,y[++p]=u,y[++p]=f,y[++p]=v,c+=4;const g=l/o,w=(l+1)/o;d[++z]=g,d[++z]=r/e/2,d[++z]=w,d[++z]=r/e/2,d[++z]=g,d[++z]=0,d[++z]=w,d[++z]=0,l++}const w=new Float32Array(h.length+_.length);w.set(h,0),w.set(_,h.length);const M=E(y,w);return{points:h,indices:new Uint32Array(y),position:w,normal:M,uv:new Float32Array(d)}}var J=function(){function t(){this.pos=new V,this.dir=new V,this.right=new V,this.up=new V,this.dist=0,this.widthScale=1,this.sharp=!1}var n=t.prototype;return n.lerpPathPoints=function(t,n,i){this.pos.lerpVectors(t.pos,n.pos,i),this.dir.lerpVectors(t.dir,n.dir,i),this.up.lerpVectors(t.up,n.up,i),this.right.lerpVectors(t.right,n.right,i),this.dist=(n.dist-t.dist)*i+t.dist,this.widthScale=(n.widthScale-t.widthScale)*i+t.widthScale},n.copy=function(t){this.pos.copy(t.pos),this.dir.copy(t.dir),this.up.copy(t.up),this.right.copy(t.right),this.dist=t.dist,this.widthScale=t.widthScale},t}(),K=function(){function t(t,n,i,e,r,s,o,h,a,u,c,l,f,x,y,d){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],void 0!==t&&this.set(t,n,i,e,r,s,o,h,a,u,c,l,f,x,y,d)}var n=t.prototype;return n.set=function(t,n,i,e,r,s,o,h,a,u,c,l,f,x,y,d){var p=this.elements;return p[0]=t,p[4]=n,p[8]=i,p[12]=e,p[1]=r,p[5]=s,p[9]=o,p[13]=h,p[2]=a,p[6]=u,p[10]=c,p[14]=l,p[3]=f,p[7]=x,p[11]=y,p[15]=d,this},n.multiply=function(t){return this.multiplyMatrices(this,t)},n.makeRotationAxis=function(t,n){var i=Math.cos(n),e=Math.sin(n),r=1-i,s=t.x,o=t.y,h=t.z,a=r*s,u=r*o;return this.set(a*s+i,a*o-e*h,a*h+e*o,0,a*o+e*h,u*o+i,u*h-e*s,0,a*h-e*o,u*h+e*s,r*h*h+i,0,0,0,0,1),this},n.equals=function(t){for(var n=this.elements,i=t.elements,e=0;e<16;e++)if(n[e]!==i[e])return!1;return!0},t}();function $(t,n,i,e){return function(t,n){var i=1-t;return i*i*n}(t,n)+function(t,n){return 2*(1-t)*t*n}(t,i)+function(t,n){return t*t*n}(t,e)}var tt=function(t){var n,e;function r(n,i,e){var r;return void 0===n&&(n=new V),void 0===i&&(i=new V),void 0===e&&(e=new V),(r=t.call(this)||this).isQuadraticBezierCurve3=!0,r.type="QuadraticBezierCurve3",r.v0=n,r.v1=i,r.v2=e,r}return e=t,(n=r).prototype=Object.create(e.prototype),n.prototype.constructor=n,i(n,e),r.prototype.getPoint=function(t,n){void 0===n&&(n=new V);var i=n,e=this.v0,r=this.v1,s=this.v2;return i.set($(t,e.x,r.x,s.x),$(t,e.y,r.y,s.y),$(t,e.z,r.z,s.z)),i},r}(function(){function t(){this.type="Curve",this.arcLengthDivisions=200}var n=t.prototype;return n.getPoint=function(){return console.warn("THREE.Curve: .getPoint() not implemented."),null},n.getPointAt=function(t,n){var i=this.getUtoTmapping(t);return this.getPoint(i,n)},n.getPoints=function(t){void 0===t&&(t=5);for(var n=[],i=0;i<=t;i++)n.push(this.getPoint(i/t));return n},n.getLength=function(){var t=this.getLengths();return t[t.length-1]},n.getLengths=function(t){if(void 0===t&&(t=this.arcLengthDivisions),this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;var n,i=[],e=this.getPoint(0),r=0;i.push(0);for(var s=1;s<=t;s++)r+=(n=this.getPoint(s/t)).distanceTo(e),i.push(r),e=n;return this.cacheArcLengths=i,i},n.getUtoTmapping=function(t,n){var i,e=this.getLengths(),r=0,s=e.length;i=n||t*e[s-1];for(var o,h=0,a=s-1;h<=a;)if((o=e[r=Math.floor(h+(a-h)/2)]-i)<0)h=r+1;else{if(!(o>0)){a=r;break}a=r-1}if(e[r=a]===i)return r/(s-1);var u=e[r];return(r+(i-u)/(e[r+1]-u))/(s-1)},t}()),nt=new V,it=new V,et=new V,rt=new K,st=new tt;var ot=function(){function t(){this.array=[],this.count=0}var n=t.prototype;return n.set=function(t,n,i,e,r){if(void 0===n&&(n=.1),void 0===i&&(i=10),void 0===e&&(e=null),void 0===r&&(r=!1),(t=t.slice(0)).length<2)return console.warn("PathPointList: points length less than 2."),void(this.count=0);r&&!t[0].equals(t[t.length-1])&&t.push((new V).copy(t[0]));for(var s=0,o=t.length;s<o;s++)if(0===s)this._start(t[s],t[s+1],e);else if(s===o-1)if(r){this._corner(t[s],t[1],n,i,e);var h=this.array[0].dist;this.array[0].copy(this.array[this.count-1]),this.array[0].dist=h}else this._end(t[s]);else this._corner(t[s],t[s+1],n,i,e)},n.distance=function(){return this.count>0?this.array[this.count-1].dist:0},n._getByIndex=function(t){return this.array[t]||(this.array[t]=new J),this.array[t]},n._start=function(t,n,i){this.count=0;var e=this._getByIndex(this.count);if(e.pos.copy(t),e.dir.subVectors(n,t),i)e.up.copy(i);else{var r=Number.MAX_VALUE,s=Math.abs(e.dir.x),o=Math.abs(e.dir.y),h=Math.abs(e.dir.z);s<r&&(r=s,e.up.set(1,0,0)),o<r&&(r=o,e.up.set(0,1,0)),h<r&&e.up.set(0,0,1)}e.right.crossVectors(e.dir,e.up).normalize(),e.up.crossVectors(e.right,e.dir).normalize(),e.dist=0,e.widthScale=1,e.sharp=!1,e.dir.normalize(),this.count++},n._end=function(t){var n=this.array[this.count-1],i=this._getByIndex(this.count);i.pos.copy(t),i.dir.subVectors(t,n.pos);var e=i.dir.length();i.dir.normalize(),i.up.copy(n.up);var r=nt.crossVectors(n.dir,i.dir);if(r.length()>Number.EPSILON){r.normalize();var s=Math.acos(Math.min(Math.max(n.dir.dot(i.dir),-1),1));i.up.applyMatrix4(rt.makeRotationAxis(r,s))}i.right.crossVectors(i.dir,i.up).normalize(),i.dist=n.dist+e,i.widthScale=1,i.sharp=!1,this.count++},n._corner=function(t,n,i,e,r){if(i>0&&e>0){for(var s=function(t,n,i,e,r,s){var o=nt.subVectors(n,t),h=it.subVectors(i,n),a=o.length(),u=h.length();o.normalize(),h.normalize();var c=Math.min(.999999*(r?a/2:a),e);s.v0.copy(n).sub(o.multiplyScalar(c)),s.v1.copy(n);var l=Math.min(u/2*.999999,e);return s.v2.copy(n).add(h.multiplyScalar(l)),s}(this.array[this.count-1].pos,t,n,i,this.count-1==0,st).getPoints(e),o=0;o<e;o++)this._sharpCorner(s[o],s[o+1],r,0===o?1:0);s[e].equals(n)||this._sharpCorner(s[e],n,r,2)}else this._sharpCorner(t,n,r,0,!0)},n._sharpCorner=function(t,n,i,e,r){void 0===e&&(e=0),void 0===r&&(r=!1);var s=this.array[this.count-1],o=this._getByIndex(this.count),h=nt.subVectors(t,s.pos),a=it.subVectors(n,t),u=h.length();if(h.normalize(),a.normalize(),o.pos.copy(t),1===e?o.dir.copy(h):2===e?o.dir.copy(a):(o.dir.addVectors(h,a),o.dir.normalize()),i)1===o.dir.dot(i)?o.right.crossVectors(a,i).normalize():o.right.crossVectors(o.dir,i).normalize(),o.up.crossVectors(o.right,o.dir).normalize();else{o.up.copy(s.up);var c=et.crossVectors(s.dir,o.dir);if(c.length()>Number.EPSILON){c.normalize();var l=Math.acos(Math.min(Math.max(s.dir.dot(o.dir),-1),1));o.up.applyMatrix4(rt.makeRotationAxis(c,l))}o.right.crossVectors(o.dir,o.up).normalize()}o.dist=s.dist+u;var f=h.dot(a);o.widthScale=Math.min(1/Math.sqrt((1+f)/2),1.415)||1,o.sharp=Math.abs(f-1)>.05&&r,this.count++},t}();const ht=new V(0,0,1),at=new V,ut=new V,ct=new V,lt=new V,ft=new V,xt=new V;function yt(t,n){n=Object.assign({},{lineWidth:1,cornerRadius:0,cornerSplit:10},n);const i=I(t.map((t=>{const i=function(t){const n=[];for(let i=0,e=t.length;i<e;i++){const e=t[i],[r,s,o]=e,h=new V(r,s,o||0);n[i]=h}return n}(t),e=new ot;e.set(i,n.cornerRadius,n.cornerSplit,ht);const r=function(t,n){const i=n.lineWidth||.1,e=1,r=i/2,s=i,o=t.distance(),h=e*o;let a=0;const u=[],c=[],l=[],f=[];let x=0;if(0===o)return{position:u,normal:c,uv:l,indices:f,count:a};const y=r/s;let d,p=u.length-1,v=c.length-1,g=l.length-1,_=f.length-1;function m(t){const n=0===u.length,i=t.sharp&&!n,e=t.dist/s,o=t.dir,h=t.up,d=t.right;if(at.copy(d).multiplyScalar(r*t.widthScale),ut.copy(d).multiplyScalar(-r*t.widthScale),at.add(t.pos),ut.add(t.pos),i){ct.fromArray(u,u.length-6).sub(ut),lt.fromArray(u,u.length-3).sub(at);const t=ct.length()-lt.length();let n,i;t>0?(n=ct,i=ut):(n=lt,i=at),ft.copy(n).setLength(Math.abs(t)).add(i);let r=xt.copy(i).sub(ft).normalize().dot(o)*xt.copy(i).sub(ft).length()*2;xt.copy(o).setLength(r).add(ft),t>0?(u[++p]=ft.x,u[++p]=ft.y,u[++p]=ft.z,u[++p]=at.x,u[++p]=at.y,u[++p]=at.z,u[++p]=ut.x,u[++p]=ut.y,u[++p]=ut.z,u[++p]=at.x,u[++p]=at.y,u[++p]=at.z,u[++p]=xt.x,u[++p]=xt.y,u[++p]=xt.z,u[++p]=at.x,u[++p]=at.y,u[++p]=at.z,x+=6,f[++_]=x-6,f[++_]=x-8,f[++_]=x-7,f[++_]=x-6,f[++_]=x-7,f[++_]=x-5,f[++_]=x-4,f[++_]=x-6,f[++_]=x-5,f[++_]=x-2,f[++_]=x-4,f[++_]=x-1,a+=12):(u[++p]=ut.x,u[++p]=ut.y,u[++p]=ut.z,u[++p]=ft.x,u[++p]=ft.y,u[++p]=ft.z,u[++p]=ut.x,u[++p]=ut.y,u[++p]=ut.z,u[++p]=at.x,u[++p]=at.y,u[++p]=at.z,u[++p]=ut.x,u[++p]=ut.y,u[++p]=ut.z,u[++p]=xt.x,u[++p]=xt.y,u[++p]=xt.z,x+=6,f[++_]=x-6,f[++_]=x-8,f[++_]=x-7,f[++_]=x-6,f[++_]=x-7,f[++_]=x-5,f[++_]=x-6,f[++_]=x-5,f[++_]=x-3,f[++_]=x-2,f[++_]=x-3,f[++_]=x-1,a+=12);for(let t=0;t<6;t++)c[++v]=h.x,c[++v]=h.y,c[++v]=h.z;l[++g]=e-y,l[++g]=0,l[++g]=e-y,l[++g]=1,l[++g]=e,l[++g]=0,l[++g]=e,l[++g]=1,l[++g]=e+y,l[++g]=0,l[++g]=e+y,l[++g]=1}else u[++p]=ut.x,u[++p]=ut.y,u[++p]=ut.z,u[++p]=at.x,u[++p]=at.y,u[++p]=at.z,c[++v]=h.x,c[++v]=h.y,c[++v]=h.z,c[++v]=h.x,c[++v]=h.y,c[++v]=h.z,l[++g]=e,l[++g]=0,l[++g]=e,l[++g]=1,x+=2,n||(f[++_]=x-2,f[++_]=x-4,f[++_]=x-3,f[++_]=x-2,f[++_]=x-3,f[++_]=x-1,a+=6)}if(h>0)for(let n=0;n<t.count;n++){const i=t.array[n];if(i.dist>h){const e=t.array[n-1];d=new J;const r=(h-e.dist)/(i.dist-e.dist);d.lerpPathPoints(e,i,r),m(d);break}m(i)}else d=t.array[0];return{position:u,normal:c,uv:l,indices:f,count:a}}(e,n);return{position:new Float32Array(r.position),indices:new Uint32Array(r.indices),uv:new Float32Array(r.uv),normal:new Float32Array(r.normal),line:t,count:r.count}})));return i.lines=t,i}new V(0,0,1),new V;var dt={x:0,y:0},pt={x:0,y:0};function vt(t,n,i,e){for(var r=t.length,s=0;s<r;s++){var o=t[s].data;n=t[s].center||n;for(var h=0,a=o.length;h<a;h++)for(var u=o[h],c=0,l=u.length;c<l;c++)t[s].data[h][c]=gt(u[c],n,i,e)}}function gt(t,n,i,e,r){for(var s,o=[],h=r?3:2,a=0,u=(s=i?new Float64Array(t):new Float32Array(t)).length;a<u;a+=h){var c=s[a],l=s[a+1],f=s[a+2];if(n&&i&&e){dt.x=c,dt.y=l;var x=kt(dt,pt);dt.x=x.x,dt.y=x.y,c=(x=Vt(e,dt,i,pt)).x,l=x.y,c-=n[0],l-=n[1]}r?o.push([c,l,f]):o.push([c,l])}return o}function _t(t,n){void 0===n&&(n=1);for(var i=t.length,e=[],r=[],s=0,o=0;o<i;o++){var h=void 0;1===n?h=mt(t[o]):2===n?h=zt(t[o]):3===n&&(h=wt(t[o]));var a=t[o].bottomHeight||0,u=h.position;r.push(h);var c=u.length/3;e[o]={position:{middleZ:a+(t[o].height||0)/2,count:c,start:s,end:s+3*c},hide:!1},s+=3*c}var l=bt(r),f=l.position,x=l.normal,y=l.uv,d=l.indices;return{position:f.buffer,normal:x.buffer,uv:y.buffer,indices:d.buffer,geometriesAttributes:e}}function mt(t){var n=t.data,i=t.height,e=t.bottomHeight,r=j(n,{depth:i,top:t.top}),s=r.position,o=r.normal,h=r.uv,a=r.indices;return At(s,e),{position:s,normal:o,uv:h,indices:a}}function zt(t){var n=t.data,i=t.height,e=t.width,r=t.bottomHeight,s=W(n,{lineWidth:e,depth:i,pathUV:t.pathUV}),o=s.position,h=s.normal,a=s.uv,u=s.indices;return At(o,r),{position:o,normal:h,uv:a,indices:u}}function wt(t){var n=t.data,i=t.cornerRadius,e=t.width,r=t.bottomHeight,s=yt(n,{lineWidth:e,cornerRadius:i}),o=s.position,h=s.normal,a=s.uv,u=s.indices;return At(o,r),{position:o,normal:h,uv:a,indices:u}}function Mt(t,n){for(var i=new Float32Array(n),e=0,r=0;r<t.length;++r)i.set(t[r],e),e+=t[r].length;return i}function bt(t){for(var n={},i={},e=0;e<t.length;++e){var r=t[e];for(var s in r)void 0===n[s]&&(n[s]=[],i[s]=0),n[s].push(r[s]),i[s]+=r[s].length}var o={},h=0,a=[];for(var u in n)if("indices"===u)for(var c=n[u],l=0,f=c.length;l<f;l++){for(var x=c[l],y=0,d=x.length;y<d;y++)a.push(x[y]+h);h+=n.position[l].length/3}else{var p=Mt(n[u],i[u]);if(!p)return null;o[u]=p}return o.indices=new Uint32Array(a),o}function At(t,n){if(void 0!==n&&"number"==typeof n&&0!==n)for(var i=0,e=t.length;i<e;i+=3)t[i+2]+=n}function Pt(t){for(var n=[],i=0,e=t.length;i<e;i+=7){var r=t[i],s=t[i+1],o=t[i+2],h=t[i+3],a=t[i+4],u=t[i+5];n.push({radialSegments:o,radius:h,height:a,altitude:u,center:[r,s]})}for(var c=n.length,l=[],f=[],x=0,y=0;y<c;y++){var d=G(n[y].center||[0,0],n[y]),p=d.position;if(n[y].altitude)for(var v=n[y].altitude,g=0,_=p.length;g<_;g+=3)d[g+2]+=v;f.push(d);var m=p.length/3;l[y]={position:{middleZ:n[y].height/2,count:m,start:x,end:x+3*m},hide:!1},x+=3*m}var z=bt(f),w=z.position,M=z.normal,b=z.uv,A=z.indices;return{position:w.buffer,normal:M.buffer,uv:b.buffer,indices:A.buffer,geometriesAttributes:l}}var St=Math.PI/180,Ct=6378137*Math.PI/180;function kt(t,n){var i,e=85.0511287798,r=t.x,s=Math.max(Math.min(e,t.y),-e);i=0===s?0:Math.log(Math.tan((90+s)*St/2))/St;var o=r*Ct,h=i*Ct;return n?(n.x=o,n.y=h,n):{x:o,y:h}}function Vt(t,n,i,e){var r=t[0]*(n.x-t[2])/i,s=-t[1]*(n.y-t[3])/i;return e?(e.x=r,e.y=s,e):{x:r,y:s}}function Zt(t){void 0===t&&(t=[]);for(var n=t.length,i=new Float32Array(3*n),e=0;e<n;e++){var r=t[e],s=3*e;i[s]=r[0],i[s+1]=r[1],i[s+2]=r[2]||0}return i}function Ft(t){for(var n=new Float32Array(2*t.length-6),i=0,e=0,r=t.length/3;e<r;e++){var s=t[3*e],o=t[3*e+1],h=t[3*e+2];if(e>0&&e<r-1){var a=3*i;n[a]=s,n[a+1]=o,n[a+2]=h,i++}var u=3*i;n[u]=s,n[u+1]=o,n[u+2]=h,i++}return n}function Lt(t){var n=0,i=t.length;if(1===i)return t[0];for(var e=0;e<i;e++)n+=t[e].length;for(var r=new Float32Array(n),s=0,o=0;o<i;o++)r.set(t[o],s),s+=t[o].length;return r}t.initialize=function(){},t.onmessage=function(t,n){var i=t.data,e=i.type,r=i.datas,s=i.glRes,o=i.matrix,h=i.center;if("ExtrudePolygons"===e){vt(r,h,s,o);var a=_t(r);n(null,a,[a.position,a.normal,a.uv,a.indices])}else if("ExtrudeLines"===e||"Paths"===e){for(var u=0,c=r.length;u<c;u++)for(var l=0,f=r[u].data.length;l<f;l++)r[u].data[l]=gt(r[u].data[l],r[u].center||h,s,o,!0);var x=_t(r,"ExtrudeLines"===e?2:3);n(null,x,[x.position,x.normal,x.uv,x.indices])}else if("ExtrudePolygon"===e){var y=[],d=[];r.forEach((function(t){var n=[t];vt(n,h,s,o);var i=_t(n),e=i.position,r=i.normal,a=i.uv,u=i.indices;y.push({id:t.id,position:e,normal:r,uv:a,indices:u}),d.push(e,r,a,u)})),n(null,y,d)}else if("Line"===e||"FatLine"===e){for(var p=[],v=[],g=0,_=r.length;g<_;g++){for(var m=[],z=0,w=r[g].data.length;z<w;z++){r[g].data[z]=gt(r[g].data[z],r[g].center||h,s,o,!0);var M=Zt(r[g].data[z]);m.push(Ft(M))}var b=Lt(m);At(b,r[g].bottomHeight),p.push({id:r[g].id,position:b.buffer}),v.push(b.buffer)}n(null,p,v)}else if("Lines"===e||"FatLines"===e){for(var A=0,P=[],S=[],C=0,k=[],V=0,Z=r.length;V<Z;V++){for(var F=0,L=0,q=r[V].data.length;L<q;L++){r[V].data[L]=gt(r[V].data[L],r[V].center||h,s,o,!0);var E=Zt(r[V].data[L]);At(E,r[V].bottomHeight),F+=E.length/3*2-2,k.push(Ft(E))}var I=F;P[V]=[A,A+I],A+=I,S[V]={position:{count:F,start:C,end:C+3*F},hide:!1},"FatLines"===e&&(S[V].instanceStart={count:F,start:C,end:C+3*F},S[V].instanceEnd={count:F,start:C,end:C+3*F}),C+=3*F}var O=Lt(k);n(null,{id:r.id,position:O.buffer,geometriesAttributes:S,faceMap:P},[O.buffer])}else if("ExtrudeLine"===e||"Path"===e){for(var U=0,N=r.length;U<N;U++)for(var j=0,Q=r[U].data.length;j<Q;j++)r[U].data[j]=gt(r[U].data[j],r[U].center||h,s,o,!0);var R=[],W=[];r.forEach((function(t){var n=_t([t],"ExtrudeLine"===e?2:3),i=n.position,r=n.normal,s=n.uv,o=n.indices;R.push({id:t.id,position:i,normal:r,uv:s,indices:o}),W.push(i,r,s,o)})),n(null,R,W)}else if("Bar"===e){for(var B=[],T=[],H=(r=new Float32Array(r)).length/7,X=0;X<H;){var Y=r.slice(7*X,7*(X+1)),D=Pt(Y),G=D.position,J=D.normal,K=D.uv,$=D.indices;B.push({id:parseInt(Y[6]),position:G,normal:J,uv:K,indices:$}),T.push(G,J,K,$),X++}n(null,B,T)}else if("Bars"===e){var tt=Pt(r=new Float32Array(r));n(null,tt,[tt.position,tt.normal,tt.uv,tt.indices])}else console.error("No processing logic found for type:"+e)},Object.defineProperty(t,"__esModule",{value:!0})})`;

    const options = {
        'renderer': 'gl',
        'doubleBuffer': false,
        'glOptions': null,
        'geometryEvents': true,
        'identifyCountOnEvent': 0,
        'forceRenderOnZooming': true,
        'loopRenderCount': 50
    };
    const RADIAN = Math.PI / 180;
    const LINEPRECISIONS = [
        [4000, 220],
        [2000, 100],
        [1000, 30],
        [500, 15],
        [100, 5],
        [50, 2],
        [10, 1],
        [5, 0.7],
        [2, 0.1],
        [1, 0.05],
        [0.5, 0.02],
        [0.4, 0.01],
        [0.1, 0.005],
        [0.05, 0.002],
        [0.01, 0.001]
    ];
    const EVENTS = [
        'mouseout',
        'mousemove',
        'click',
        'mousedown',
        'mouseup',
        'dblclick',
        'contextmenu',
        'touchstart',
        'touchmove',
        'touchend'
    ];
    const TEMP_COORD = new maptalks__namespace.Coordinate(0, 0);
    const TEMP_POINT = new maptalks__namespace.Point(0, 0);
    const TEMP_VECTOR3 = new THREE__namespace.Vector3();
    const heightCache = new Map();
    const KEY_FBO = '__webglFramebuffer';
    const TEMP_V4 = new THREE__namespace.Vector4();
    // const MATRIX4 = new THREE.Matrix4();
    /**
     * A Layer to render with THREE.JS (http://threejs.org), the most popular library for WebGL. <br>
     *
     * @classdesc
     * A layer to render with THREE.JS
     * @example
     *  var layer = new maptalks.ThreeLayer('three');
     *
     *  layer.prepareToDraw = function (gl, scene, camera) {
     *      var size = map.getSize();
     *      return [size.width, size.height]
     *  };
     *
     *  layer.draw = function (gl, view, scene, camera, width,height) {
     *      //...
     *  };
     *  layer.addTo(map);
     * @class
     * @category layer
     * @extends {maptalks.CanvasLayer}
     * @param {String|Number} id - layer's id
     * @param {Object} options - options defined in [options]{@link maptalks.ThreeLayer#options}
     */
    class ThreeLayer extends maptalks__namespace.CanvasLayer {
        constructor(id, options) {
            super(id, options);
            this._animationBaseObjectMap = {};
            this._needsUpdate = true;
            this._mousemoveTimeOut = 0;
            this._mousedownTime = 0;
            this._baseObjects = [];
            this._delayMeshes = [];
            this._meshes = [];
            this.type = 'ThreeLayer';
        }
        isMercator() {
            const map = this.getMap();
            if (!map) {
                return false;
            }
            const sp = map.getSpatialReference();
            const prj = sp._projection, res = sp._resolutions;
            if (prj && prj.code === 'EPSG:3857' && res && res.length && Math.floor(res[0]) === 156543 && map.getGLRes) {
                return true;
            }
            return false;
        }
        isRendering() {
            const map = this.getMap();
            if (!map) {
                return false;
            }
            return map.isInteracting() || map.isAnimating();
        }
        prepareToDraw(...args) {
        }
        /**
         * Draw method of ThreeLayer
         * In default, it calls renderScene, refresh the camera and the scene
         */
        draw(gl, view, scene, camera, timeStamp, context) {
            this.renderScene(context, this);
        }
        /**
         * Draw method of ThreeLayer when map is interacting
         * In default, it calls renderScene, refresh the camera and the scene
         */
        drawOnInteracting(gl, view, scene, camera, event, timeStamp, context) {
            this.renderScene(context, this);
        }
        /**
         * transform height to glpoint
         * @param enableHeight
         * @param height
         * @returns
         */
        _transformHeight(enableHeight, height) {
            if (!enableHeight) {
                return 0;
            }
            height = height || 0;
            if (height === 0) {
                return 0;
            }
            const v = this.altitudeToVector3(height, height, null, TEMP_VECTOR3);
            return v.x;
        }
        /**
         * Convert a geographic coordinate to THREE Vector3
         * @param  {maptalks.Coordinate} coordinate - coordinate
         * @param {Number} [z=0] z value
         * @return {THREE.Vector3}
         */
        coordinateToVector3(coordinate, z = 0, out) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const isArray = Array.isArray(coordinate);
            if (isArray) {
                TEMP_COORD.x = coordinate[0];
                TEMP_COORD.y = coordinate[1];
            }
            else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            const res = getGLRes(map);
            const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
            if (out) {
                out.x = p.x;
                out.y = p.y;
                out.z = z;
            }
            return new THREE__namespace.Vector3(p.x, p.y, z);
        }
        coordinatiesToGLFloatArray(coordinaties, centerPt, hasHeight) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const res = getGLRes(map);
            const len = coordinaties.length;
            const array = new Float32Array(len * 2);
            const array3d = new Float32Array(len * 3);
            heightCache.clear();
            for (let i = 0; i < len; i++) {
                let coordinate = coordinaties[i];
                const isArray = Array.isArray(coordinate);
                if (isArray) {
                    TEMP_COORD.x = coordinate[0];
                    TEMP_COORD.y = coordinate[1];
                }
                else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                    coordinate = new maptalks__namespace.Coordinate(coordinate);
                }
                const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
                p.x -= centerPt.x;
                p.y -= centerPt.y;
                const idx = i * 2;
                array[idx] = p.x;
                array[idx + 1] = p.y;
                const coord = coordinate;
                let height = coord.z || coord[2] || 0;
                if (hasHeight && !heightCache.has(height)) {
                    const z = this._transformHeight(hasHeight, height);
                    heightCache.set(height, z);
                }
                let z = 0;
                if (hasHeight) {
                    z = heightCache.get(height) || 0;
                }
                const idx1 = i * 3;
                array3d[idx1] = p.x;
                array3d[idx1 + 1] = p.y;
                array3d[idx1 + 2] = z;
            }
            return {
                positions: array3d,
                positons2d: array
            };
        }
        coordinatiesToGLArray(coordinaties, centerPt) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const res = getGLRes(map);
            const len = coordinaties.length;
            const array = new Array(len);
            for (let i = 0; i < len; i++) {
                let coordinate = coordinaties[i];
                const isArray = Array.isArray(coordinate);
                if (isArray) {
                    TEMP_COORD.x = coordinate[0];
                    TEMP_COORD.y = coordinate[1];
                }
                else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                    coordinate = new maptalks__namespace.Coordinate(coordinate);
                }
                const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
                p.x -= centerPt.x;
                p.y -= centerPt.y;
                array[i] = [p.x, p.y];
            }
            return array;
        }
        /**
         * Convert geographic distance to THREE Vector3
         * @param  {Number} w - width
         * @param  {Number} h - height
         * @return {THREE.Vector3}
         */
        distanceToVector3(w, h, coord) {
            if ((w === 0 && h === 0) || (!maptalks__namespace.Util.isNumber(w) || !maptalks__namespace.Util.isNumber(h))) {
                return new THREE__namespace.Vector3(0, 0, 0);
            }
            const map = this.getMap();
            const res = getGLRes(map);
            let center = coord || map.getCenter();
            if (!(center instanceof maptalks__namespace.Coordinate)) {
                center = new maptalks__namespace.Coordinate(center);
            }
            const target = map.locate(center, w, h);
            const p0 = coordinateToPoint(map, center, res), p1 = coordinateToPoint(map, target, res);
            const x = Math.abs(p1.x - p0.x) * maptalks__namespace.Util.sign(w);
            const y = Math.abs(p1.y - p0.y) * maptalks__namespace.Util.sign(h);
            return new THREE__namespace.Vector3(x, y, 0);
        }
        altitudeToVector3(altitude, altitude1, coord, out) {
            if ((altitude === 0) || (!maptalks__namespace.Util.isNumber(altitude))) {
                return new THREE__namespace.Vector3(0, 0, 0);
            }
            const map = this.getMap();
            if (map.altitudeToPoint) {
                const res = getGLRes(map);
                let z = map.altitudeToPoint(altitude, res);
                if (altitude < 0 && z > 0) {
                    z = -z;
                }
                if (out) {
                    out.x = z;
                    out.y = z;
                    out.z = 0;
                    return out;
                }
                return new THREE__namespace.Vector3(z, z, 0);
            }
            return this.distanceToVector3(altitude, altitude, coord);
        }
        /**
         * Convert a Polygon or a MultiPolygon to THREE shape
         * @param  {maptalks.Polygon|maptalks.MultiPolygon} polygon - polygon or multipolygon
         * @return {THREE.Shape}
         */
        toShape(polygon) {
            if (!polygon) {
                return null;
            }
            if (polygon instanceof maptalks__namespace.MultiPolygon) {
                return polygon.getGeometries().map(c => this.toShape(c));
            }
            const center = polygon.getCenter();
            const centerPt = this.coordinateToVector3(center);
            const shell = polygon.getShell();
            const outer = shell.map(c => {
                const vector = this.coordinateToVector3(c).sub(centerPt);
                return new THREE__namespace.Vector2(vector.x, vector.y);
            });
            const shape = new THREE__namespace.Shape(outer);
            const holes = polygon.getHoles();
            if (holes && holes.length > 0) {
                shape.holes = holes.map(item => {
                    const pts = item.map(c => {
                        const vector = this.coordinateToVector3(c).sub(centerPt);
                        return new THREE__namespace.Vector2(vector.x, vector.y);
                    });
                    return new THREE__namespace.Shape(pts);
                });
            }
            return shape;
        }
        /**
         * todo   This should also be extracted as a component
         * @param {*} polygon
         * @param {*} altitude
         * @param {*} material
         * @param {*} height
         */
        toExtrudeMesh(polygon, altitude, material, height) {
            if (!polygon) {
                return null;
            }
            if (polygon instanceof maptalks__namespace.MultiPolygon) {
                return polygon.getGeometries().map(c => this.toExtrudeMesh(c, altitude, material, height));
            }
            const rings = polygon.getCoordinates();
            rings.forEach(ring => {
                const length = ring.length;
                for (let i = length - 1; i >= 1; i--) {
                    if (ring[i].equals(ring[i - 1])) {
                        ring.splice(i, 1);
                    }
                }
            });
            polygon.setCoordinates(rings);
            const shape = this.toShape(polygon);
            const center = this.coordinateToVector3(polygon.getCenter());
            height = maptalks__namespace.Util.isNumber(height) ? height : altitude;
            height = this.altitudeToVector3(height, height).x;
            const amount = this.altitudeToVector3(altitude, altitude).x;
            //{ amount: extrudeH, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
            const config = { 'bevelEnabled': false, 'bevelSize': 1 };
            const name = parseInt(THREE__namespace.REVISION) >= 93 ? 'depth' : 'amount';
            config[name] = height;
            const geom = new THREE__namespace.ExtrudeGeometry(shape, config);
            let buffGeom = geom;
            if (THREE__namespace.BufferGeometry.prototype.fromGeometry) {
                buffGeom = new THREE__namespace.BufferGeometry();
                buffGeom.fromGeometry(geom);
            }
            const mesh = new THREE__namespace.Mesh(buffGeom, material);
            mesh.position.set(center.x, center.y, amount - height);
            return mesh;
        }
        /**
         *
         * @param {maptalks.Polygon|maptalks.MultiPolygon} polygon
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toExtrudePolygon(polygon, options, material) {
            return new ExtrudePolygon(polygon, options, material, this);
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toBar(coordinate, options, material) {
            return new Bar(coordinate, options, material, this);
        }
        /**
        *
        * @param {maptalks.LineString} lineString
        * @param {Object} options
        * @param {THREE.LineMaterial} material
        */
        toLine(lineString, options, material) {
            return new Line(lineString, options, material, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toExtrudeLine(lineString, options, material) {
            return new ExtrudeLine(lineString, options, material, this);
        }
        /**
         *
         * @param {THREE.Mesh|THREE.Group} model
         * @param {Object} options
         */
        toModel(model, options) {
            return new Model(model, options, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {*} options
         * @param {THREE.Material} material
         */
        toExtrudeLineTrail(lineString, options, material) {
            return new ExtrudeLineTrail(lineString, options, material, this);
        }
        /**
         *
         * @param {*} polygons
         * @param {*} options
         * @param {*} material
         */
        toExtrudePolygons(polygons, options, material) {
            return new ExtrudePolygons(polygons, options, material, this);
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         * @param {*} options
         * @param {*} material
         */
        toPoint(coordinate, options, material) {
            return new Point(coordinate, options, material, this);
        }
        /**
         *
         * @param {Array} points
         * @param {*} options
         * @param {*} material
         */
        toPoints(points, options, material) {
            return new Points(points, options, material, this);
        }
        /**
         *
         * @param {Array} points
         * @param {*} options
         * @param {*} material
         */
        toBars(points, options, material) {
            return new Bars(points, options, material, this);
        }
        /**
         *
         * @param {Array[maptalks.LineString]} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toExtrudeLines(lineStrings, options, material) {
            return new ExtrudeLines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {Array[maptalks.LineString]} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toLines(lineStrings, options, material) {
            return new Lines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {*} url
         * @param {*} options
         * @param {*} getMaterial
         * @param {*} worker
         */
        toThreeVectorTileLayer(url, options, getMaterial) {
            return new ThreeVectorTileLayer(url, options, getMaterial, this);
        }
        /**
         *
         * @param {*} extent
         * @param {*} options
         * @param {*} material
         */
        toTerrain(extent, options, material) {
            return new Terrain(extent, options, material, this);
        }
        /**
         *
         * @param {*} url
         * @param {*} options
         * @param {*} material
         */
        toTerrainVectorTileLayer(url, options, material) {
            return new TerrainVectorTileLayer(url, options, material, this);
        }
        /**
         *
         * @param {*} data
         * @param {*} options
         * @param {*} material
         */
        toHeatMap(data, options, material) {
            return new HeatMap(data, options, material, this);
        }
        /**
         *
         * @param {*} lineString
         * @param {*} options
         * @param {*} material
         */
        toFatLine(lineString, options, material) {
            return new FatLine(lineString, options, material, this);
        }
        /**
         *
         * @param {*} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toFatLines(lineStrings, options, material) {
            return new FatLines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {*} coorindate
         * @param {*} options
         * @param {*} material
         */
        toBox(coorindate, options, material) {
            return new Box(coorindate, options, material, this);
        }
        /**
         *
         * @param {*} points
         * @param {*} options
         * @param {*} material
         */
        toBoxs(points, options, material) {
            return new Boxs(points, options, material, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toPath(lineString, options, material) {
            return new Path(lineString, options, material, this);
        }
        toPaths(lineStrings, options, material) {
            return new Paths(lineStrings, options, material, this);
        }
        getBaseObjects() {
            return this.getMeshes().filter((mesh => {
                return mesh instanceof BaseObject;
            }));
        }
        getMeshes() {
            const scene = this.getScene();
            if (!scene) {
                return [];
            }
            const meshes = [];
            for (let i = 0, len = scene.children.length; i < len; i++) {
                const child = scene.children[i];
                if (child instanceof THREE__namespace.Object3D && !(child instanceof THREE__namespace.Camera)) {
                    meshes.push(child['__parent'] || child);
                }
            }
            return meshes;
        }
        /**
         * clear all object3ds
         * @returns
         */
        clear() {
            return this.clearMesh();
        }
        clearBaseObjects() {
            return this.removeMesh(this.getBaseObjects());
        }
        clearMesh() {
            const scene = this.getScene();
            if (!scene) {
                return this;
            }
            for (let i = scene.children.length - 1; i >= 0; i--) {
                const child = scene.children[i];
                if (child instanceof THREE__namespace.Object3D && !(child instanceof THREE__namespace.Camera)) {
                    scene.remove(child);
                    const parent = child['__parent'];
                    if (parent && parent instanceof BaseObject) {
                        parent.isAdd = false;
                        parent.options.layer = null;
                        parent._fire('remove', { target: parent });
                        delete this._animationBaseObjectMap[child.uuid];
                        parent._hideUI();
                    }
                }
            }
            this._meshes = [];
            return this;
        }
        lookAt(vector) {
            const camera = this.getCamera();
            if (camera && camera.lookAt && vector) {
                camera.lookAt(vector);
            }
            return this;
        }
        getCamera() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.camera;
            }
            return null;
        }
        getScene() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.scene;
            }
            return null;
        }
        renderScene(context, layer) {
            const renderer = this._getRenderer();
            if (renderer) {
                renderer.clearCanvas();
                renderer.renderScene(context);
                //外部调用时，直接redraw
                if (!layer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        loop(render = false) {
            const delayMeshes = this._delayMeshes;
            if (!delayMeshes.length) {
                return;
            }
            const map = this.getMap();
            if (!map || map.isAnimating() || map.isInteracting()) {
                return;
            }
            const loopRenderCount = this.options.loopRenderCount || 50;
            const meshes = delayMeshes.slice(0, loopRenderCount);
            if (meshes) {
                this.addMesh(meshes, render);
            }
            delayMeshes.splice(0, loopRenderCount);
        }
        renderPickScene() {
            const renderer = this._getRenderer();
            if (renderer) {
                const pick = renderer.pick;
                if (pick) {
                    pick.pick(this._containerPoint);
                }
            }
            return this;
        }
        getThreeRenderer() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.context;
            }
            return null;
        }
        getPick() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.pick;
            }
            return null;
        }
        delayAddMesh(meshes) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            for (let i = 0, len = meshes.length; i < len; i++) {
                this._delayMeshes.push(meshes[i]);
            }
            return this;
        }
        /**
         * add object3ds
         * @param {BaseObject} meshes
         */
        addMesh(meshes, render = true) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            const scene = this.getScene();
            meshes.forEach(mesh => {
                if (mesh instanceof BaseObject) {
                    scene.add(mesh.getObject3d());
                    if (!mesh.isAdd) {
                        mesh.isAdd = true;
                        mesh.options.layer = this;
                        mesh._fire('add', { target: mesh });
                    }
                    if (mesh._animation && maptalks__namespace.Util.isFunction(mesh._animation)) {
                        this._animationBaseObjectMap[mesh.getObject3d().uuid] = mesh;
                    }
                }
                else if (mesh instanceof THREE__namespace.Object3D) {
                    scene.add(mesh);
                }
                const index = this._meshes.indexOf(mesh);
                if (index === -1) {
                    this._meshes.push(mesh);
                }
            });
            this._zoomend();
            if (render) {
                const renderer = this._getRenderer();
                if (renderer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        /**
         * remove object3ds
         * @param {BaseObject} meshes
         */
        removeMesh(meshes, render = true) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            const scene = this.getScene();
            meshes.forEach(mesh => {
                if (mesh instanceof BaseObject) {
                    scene.remove(mesh.getObject3d());
                    if (mesh.isAdd) {
                        mesh.isAdd = false;
                        mesh.options.layer = null;
                        mesh._fire('remove', { target: mesh });
                        mesh._hideUI();
                    }
                    if (mesh._animation && maptalks__namespace.Util.isFunction(mesh._animation)) {
                        delete this._animationBaseObjectMap[mesh.getObject3d().uuid];
                    }
                    const delayMeshes = this._delayMeshes;
                    if (delayMeshes.length) {
                        for (let i = 0, len = delayMeshes.length; i < len; i++) {
                            if (delayMeshes[i] === mesh) {
                                delayMeshes.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
                else if (mesh instanceof THREE__namespace.Object3D) {
                    scene.remove(mesh);
                }
                for (let i = 0, len = this._meshes.length; i < len; i++) {
                    const object3d = this._meshes[i];
                    if (!object3d) {
                        continue;
                    }
                    if (object3d === mesh) {
                        this._meshes.splice(i, 1);
                    }
                }
            });
            if (render) {
                const renderer = this._getRenderer();
                if (renderer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        _initRaycaster() {
            if (!this._raycaster) {
                this._raycaster = new THREE__namespace.Raycaster();
                this._mouse = new THREE__namespace.Vector2();
            }
            return this;
        }
        getRaycaster() {
            return this._raycaster;
        }
        /**
         *
         * @param {Coordinate} coordinate
         * @param {Object} options
         * @return {Array}
         */
        identify(coordinate, options) {
            if (!coordinate) {
                console.error('coordinate is null,it should be Coordinate');
                return [];
            }
            if (Array.isArray(coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                console.error('coordinate type is error,it should be Coordinate');
                return [];
            }
            const p = this.getMap().coordToContainerPoint(coordinate);
            this._containerPoint = p;
            const { x, y } = p;
            this._initRaycaster();
            this.fire('identify', { coordinate, options });
            const raycaster = this._raycaster, mouse = this._mouse, camera = this.getCamera(), scene = this.getScene(), size = this.getMap().getSize();
            //fix Errors will be reported when the layer is not initialized
            if (!scene) {
                return [];
            }
            const width = size.width, height = size.height;
            mouse.x = (x / width) * 2 - 1;
            mouse.y = -(y / height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            if (raycaster.layers && raycaster.layers.enableAll) {
                raycaster.layers.enableAll();
            }
            //set linePrecision for THREE.Line
            setRaycasterLinePrecision(raycaster, this._getLinePrecision(this.getMap().getResolution()));
            const children = [], hasidentifyChildren = [];
            scene.children.forEach(mesh => {
                const parent = mesh['__parent'];
                if (parent && parent.getOptions) {
                    const baseObject = parent;
                    const interactive = baseObject.getOptions().interactive;
                    if (interactive && baseObject.isVisible()) {
                        //If baseobject has its own hit detection
                        if (baseObject.identify && maptalks__namespace.Util.isFunction(baseObject.identify)) {
                            hasidentifyChildren.push(baseObject);
                        }
                        else {
                            children.push(mesh);
                        }
                    }
                }
                else if (mesh instanceof THREE__namespace.Mesh || mesh instanceof THREE__namespace.Group) {
                    children.push(mesh);
                }
            });
            let baseObjects = [];
            const intersects = raycaster.intersectObjects(children, true);
            if (intersects && Array.isArray(intersects) && intersects.length) {
                baseObjects = intersects.map(intersect => {
                    let object = intersect.object;
                    const instanceId = intersect.instanceId;
                    object = this._recursionMesh(object) || {};
                    const baseObject = object['__parent'] || object;
                    baseObject.faceIndex = intersect.faceIndex;
                    baseObject.index = intersect.index;
                    baseObject.intersect = intersect;
                    if (maptalks__namespace.Util.isNumber(instanceId)) {
                        baseObject.instanceId = instanceId;
                    }
                    return baseObject;
                });
            }
            this.renderPickScene();
            if (hasidentifyChildren.length) {
                hasidentifyChildren.forEach(baseObject => {
                    // baseObject identify
                    if (baseObject.identify(coordinate)) {
                        baseObjects.push(baseObject);
                    }
                });
            }
            const len = baseObjects.length;
            for (let i = 0; i < len; i++) {
                if (baseObjects[i]) {
                    for (let j = i + 1; j < len; j++) {
                        if (baseObjects[i] === baseObjects[j]) {
                            baseObjects.splice(j, 1);
                        }
                    }
                }
            }
            let pickResult = baseObjects.filter(mesh => {
                return mesh instanceof BaseObject;
            });
            pickResult = pickResult.sort((a, b) => {
                return a['options'].pickWeight - b['options'].pickWeight;
            });
            baseObjects.forEach(mesh => {
                if (!(mesh instanceof BaseObject)) {
                    pickResult.push(mesh);
                }
            });
            options = maptalks__namespace.Util.extend({}, options);
            const count = options['count'];
            return (maptalks__namespace.Util.isNumber(count) && count > 0 ? pickResult.slice(0, count) : baseObjects);
        }
        identifyAtPoint(point, options = {}) {
            const map = this.getMap();
            if (!map) {
                return [];
            }
            const coordinate = map.containerPointToCoordinate(point);
            return this.identify(coordinate, options);
        }
        /**
        * Recursively finding the root node of mesh,Until it is scene node
        * @param {*} mesh
        */
        _recursionMesh(mesh) {
            while (mesh && ((mesh.parent !== this.getScene()))) {
                mesh = mesh.parent;
            }
            return mesh;
        }
        //get Line Precision by Resolution
        _getLinePrecision(res = 10) {
            for (let i = 0, len = LINEPRECISIONS.length; i < len; i++) {
                const [resLevel, precision] = LINEPRECISIONS[i];
                if (res > resLevel) {
                    return precision;
                }
            }
            return 0.01;
        }
        fireGeoEvent(baseObject, event, type) {
            if (!(baseObject instanceof BaseObject)) {
                return this;
            }
            type = type || event.type;
            const e = this._getEventParams(event);
            const { coordinate } = e;
            const map = this.getMap();
            function showInfoWindow(baseObject, eventType) {
                eventType = eventType || type;
                const infoWindow = baseObject.getInfoWindow();
                if (infoWindow && (!infoWindow._owner)) {
                    infoWindow.addTo(baseObject);
                }
                const infoOptions = infoWindow ? infoWindow.options : {};
                const autoOpenOn = infoOptions['autoOpenOn'] || 'click';
                if (autoOpenOn === eventType) {
                    if (!map.options.supportPluginEvent) {
                        baseObject.openInfoWindow(coordinate);
                    }
                    baseObject.fire('showinfowindow', { infoWindow });
                }
            }
            if (type === 'mousemove') {
                baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                // tooltip
                const tooltip = baseObject.getToolTip();
                if (tooltip && (!tooltip._owner)) {
                    tooltip.addTo(baseObject);
                }
                baseObject.openToolTip(coordinate);
                showInfoWindow(baseObject);
            }
            else if (type === 'mouseover') {
                if (!baseObject._mouseover) {
                    baseObject.fire('mouseover', Object.assign({}, e, { target: baseObject, type: 'mouseover', selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                    baseObject._mouseover = true;
                    showInfoWindow(baseObject, 'mouseover');
                }
            }
            else if (type === 'mouseout') {
                if (baseObject.getSelectMesh) {
                    if (!baseObject.isHide) {
                        baseObject._mouseover = false;
                        baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout', selectMesh: null }));
                        baseObject.closeToolTip();
                    }
                }
                else {
                    baseObject._mouseover = false;
                    baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout' }));
                    baseObject.closeToolTip();
                }
            }
            else {
                baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                showInfoWindow(baseObject);
            }
        }
        _emptyIdentify(options = {}) {
            const event = options.domEvent;
            const scene = this.getScene();
            if (!scene) {
                return this;
            }
            const map = this.map || this.getMap();
            if (!map) {
                return this;
            }
            const e = map._getEventParams ? map._getEventParams(event) : this._getEventParams(event);
            for (let i = 0, len = scene.children.length; i < len; i++) {
                const child = scene.children[i] || {};
                const parent = child['__parent'];
                if (parent) {
                    parent.fire('empty', Object.assign({}, e, { target: parent }));
                }
            }
        }
        /**
         * fire baseObject events
         * @param {*} e
         */
        _identifyBaseObjectEvents(event) {
            if (!this.options.geometryEvents) {
                return this;
            }
            const map = this.map || this.getMap();
            //When map interaction, do not carry out mouse movement detection, which can have better performance
            if (map.isInteracting() || !map.options.geometryEvents || map._ignoreEvent(event)) {
                return this;
            }
            const eventType = event.type;
            const e = map._getEventParams ? map._getEventParams(event) : this._getEventParams(event);
            e.type = eventType;
            const { type, coordinate } = e;
            const now = maptalks__namespace.Util.now();
            if (this._mousemoveTimeOut && type === 'mousemove') {
                if (now - this._mousemoveTimeOut < 64) {
                    return this;
                }
            }
            this._mousemoveTimeOut = now;
            // record mousedown/touchstart time
            if (type === 'mousedown' || type === 'touchstart') {
                this._mousedownTime = maptalks__namespace.Util.now();
            }
            let isClick = false;
            if (type === 'click' || type === 'touchend') {
                const clickTimeThreshold = map.options.clickTimeThreshold || 280;
                isClick = (maptalks__namespace.Util.now() - this._mousedownTime < clickTimeThreshold);
            }
            //ignore click event
            if (type === 'click' && !isClick) {
                return this;
            }
            // map.resetCursor('default');
            const identifyCountOnEvent = this.options['identifyCountOnEvent'];
            let count = Math.max(0, maptalks__namespace.Util.isNumber(identifyCountOnEvent) ? identifyCountOnEvent : 0);
            if (count === 0) {
                count = Infinity;
            }
            const outBaseObjectsFunc = (baseObjects) => {
                const outBaseObjects = [];
                if (this._baseObjects) {
                    this._baseObjects.forEach(baseObject => {
                        let isOut = true;
                        baseObjects.forEach(baseO => {
                            if (baseObject === baseO) {
                                isOut = false;
                            }
                        });
                        if (isOut) {
                            outBaseObjects.push(baseObject);
                        }
                    });
                }
                outBaseObjects.forEach(baseObject => {
                    if (baseObject && baseObject instanceof BaseObject) {
                        // reset _mouseover status
                        // Deal with the mergedmesh
                        if (baseObject.getSelectMesh) {
                            if (!baseObject.isHide) {
                                baseObject._mouseover = false;
                                baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout', selectMesh: null }));
                                baseObject.closeToolTip();
                            }
                        }
                        else {
                            baseObject._mouseover = false;
                            baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout' }));
                            baseObject.closeToolTip();
                        }
                    }
                });
            };
            if (type === 'mouseout') {
                outBaseObjectsFunc([]);
                this._baseObjects = [];
                return this;
            }
            const baseObjects = this.identify(coordinate, { count });
            const scene = this.getScene();
            if (baseObjects.length === 0 && scene) {
                for (let i = 0, len = scene.children.length; i < len; i++) {
                    const child = scene.children[i] || {};
                    const parent = child['__parent'];
                    if (parent) {
                        parent.fire('empty', Object.assign({}, e, { target: parent }));
                    }
                }
            }
            function showInfoWindow(baseObject, eventType) {
                eventType = eventType || type;
                const infoWindow = baseObject.getInfoWindow();
                if (infoWindow && (!infoWindow._owner)) {
                    infoWindow.addTo(baseObject);
                }
                const infoOptions = infoWindow ? infoWindow.options : {};
                const autoOpenOn = infoOptions['autoOpenOn'] || 'click';
                if (autoOpenOn === eventType) {
                    baseObject.openInfoWindow(coordinate);
                    baseObject.fire('showinfowindow', { infoWindow });
                }
            }
            if (type === 'mousemove') {
                // if (baseObjects.length) {
                //     map.setCursor('pointer');
                // }
                // mouseout objects
                outBaseObjectsFunc(baseObjects);
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        if (!baseObject._mouseover) {
                            baseObject.fire('mouseover', Object.assign({}, e, { target: baseObject, type: 'mouseover', selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                            baseObject._mouseover = true;
                            showInfoWindow(baseObject, 'mouseover');
                        }
                        baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        // tooltip
                        const tooltip = baseObject.getToolTip();
                        if (tooltip && (!tooltip._owner)) {
                            tooltip.addTo(baseObject);
                        }
                        baseObject.openToolTip(coordinate);
                        showInfoWindow(baseObject);
                    }
                });
                this._baseObjects = baseObjects;
            }
            else {
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        showInfoWindow(baseObject);
                    }
                });
            }
            //simulation mouse click on mobile device
            if (type === 'touchend' && isClick) {
                const eventParam = maptalks__namespace.Util.extend({}, e, { domEvent: event });
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        baseObject.fire('click', Object.assign({}, eventParam, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        showInfoWindow(baseObject, 'click');
                    }
                });
            }
            return this;
        }
        _getEventParams(e) {
            const map = this.getMap();
            const eventParam = {
                domEvent: e
                // type: e.type
            };
            if (!map) {
                return eventParam;
            }
            const actual = e.touches && e.touches.length > 0 ? e.touches[0] : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : e;
            if (actual) {
                const getEventContainerPoint = maptalks__namespace.DomUtil.getEventContainerPoint;
                const containerPoint = getEventContainerPoint(actual, map._containerDOM);
                eventParam['coordinate'] = map.containerPointToCoordinate(containerPoint);
                eventParam['containerPoint'] = containerPoint;
                eventParam['viewPoint'] = map.containerPointToViewPoint(containerPoint);
                eventParam['pont2d'] = map._containerPointToPoint(containerPoint);
            }
            return eventParam;
        }
        /**
         *map zoom event
         */
        _zoomend() {
            const scene = this.getScene();
            if (!scene) {
                return;
            }
            const zoom = this.getMap().getZoom();
            scene.children.forEach(mesh => {
                const parent = mesh['__parent'];
                if (parent && parent.getOptions) {
                    const baseObject = parent;
                    if (baseObject.zoomChange && maptalks__namespace.Util.isFunction(baseObject.zoomChange)) {
                        baseObject.zoomChange(zoom);
                    }
                    const minZoom = baseObject.getMinZoom(), maxZoom = baseObject.getMaxZoom();
                    if (zoom < minZoom || zoom > maxZoom) {
                        if (baseObject.isVisible()) {
                            baseObject.getObject3d().visible = false;
                        }
                        baseObject._zoomVisible = false;
                    }
                    else if (minZoom <= zoom && zoom <= maxZoom) {
                        if (baseObject._visible) {
                            baseObject.getObject3d().visible = true;
                        }
                        baseObject._zoomVisible = true;
                    }
                }
            });
        }
        _getGeometryEventMapPanel() {
            const map = this.map || this.getMap();
            const dom = map._panels.allLayers || map._containerDOM;
            return dom;
        }
        onAdd() {
            super.onAdd();
            const map = this.map || this.getMap();
            if (!map)
                return this;
            const dom = this._getGeometryEventMapPanel();
            if (!this._identifyBaseObjectEventsThis) {
                this._identifyBaseObjectEventsThis = this._identifyBaseObjectEvents.bind(this);
            }
            if (!this._zoomendThis) {
                this._zoomendThis = this._zoomend.bind(this);
            }
            if (!this._emptyIdentifyThis) {
                this._emptyIdentifyThis = this._emptyIdentify.bind(this);
            }
            if (!map.options.supportPluginEvent) {
                maptalks__namespace.DomUtil.on(dom, EVENTS.join(' '), this._identifyBaseObjectEventsThis, this);
            }
            else {
                // @ts-ignore
                this.on('identifyempty', this._emptyIdentifyThis);
            }
            this._needsUpdate = true;
            if (!this._animationBaseObjectMap) {
                this._animationBaseObjectMap = {};
            }
            map.on('zooming zoomend', this._zoomendThis, this);
            return this;
        }
        onRemove() {
            super.onRemove();
            const map = this.map || this.getMap();
            if (!map)
                return this;
            const dom = this._getGeometryEventMapPanel();
            if (!map.options.supportPluginEvent) {
                maptalks__namespace.DomUtil.off(dom, EVENTS.join(' '), this._identifyBaseObjectEventsThis, this);
            }
            else {
                // @ts-ignore
                this.off('identifyempty', this._emptyIdentifyThis);
            }
            map.off('zooming zoomend', this._zoomendThis, this);
            // this.clear();
            return this;
        }
        _addBaseObjectsWhenInit() {
            this.addMesh(this._meshes);
            return this;
        }
        _callbackBaseObjectAnimation() {
            const layer = this;
            if (layer._animationBaseObjectMap) {
                for (const uuid in layer._animationBaseObjectMap) {
                    const baseObject = layer._animationBaseObjectMap[uuid];
                    baseObject._animation();
                }
            }
            return this;
        }
        /**
         * To make map's 2d point's 1 pixel euqal with 1 pixel on XY plane in THREE's scene:
         * 1. fov is 90 and camera's z is height / 2 * scale,
         * 2. if fov is not 90, a ratio is caculated to transfer z to the equivalent when fov is 90
         * @return {Number} fov ratio on z axis
         */
        _getFovRatio() {
            const map = this.getMap();
            const fov = map.getFov();
            return Math.tan(fov / 2 * RADIAN);
        }
    }
    ThreeLayer.mergeOptions(options);
    const TEMPMESH = {
        bloom: true
    };
    class ThreeRenderer extends maptalks__namespace.renderer.CanvasLayerRenderer {
        constructor() {
            super(...arguments);
            this._renderTime = 0;
            this._renderTarget = null;
        }
        getPrepareParams() {
            return [this.scene, this.camera];
        }
        getDrawParams() {
            return [this.scene, this.camera];
        }
        _drawLayer() {
            super._drawLayer.apply(this, arguments);
            // this.renderScene();
        }
        hitDetect() {
            return false;
        }
        createCanvas() {
            super.createCanvas();
            this.createContext();
        }
        createContext() {
            if (this.canvas.gl && this.canvas.gl.wrap) {
                this.gl = this.canvas.gl.wrap();
            }
            else {
                const layer = this.layer;
                const attributes = layer.options.glOptions || {
                    alpha: true,
                    depth: true,
                    antialias: true,
                    stencil: true,
                    preserveDrawingBuffer: false
                };
                attributes.preserveDrawingBuffer = true;
                this.gl = this.gl || this._createGLContext(this.canvas, attributes);
            }
            this._initThreeRenderer();
            this.layer.onCanvasCreate(this.context, this.scene, this.camera);
        }
        _initThreeRenderer() {
            var _a;
            this.matrix4 = new THREE__namespace.Matrix4();
            const renderer = new THREE__namespace.WebGLRenderer({ 'context': this.gl, alpha: true });
            renderer.autoClear = false;
            renderer.setClearColor(new THREE__namespace.Color(1, 1, 1), 0);
            renderer.setSize(this.canvas.width, this.canvas.height);
            renderer.clear();
            // renderer.canvas = this.canvas;
            this.context = renderer;
            const scene = this.scene = (_a = this.layer.options.scene) !== null && _a !== void 0 ? _a : new THREE__namespace.Scene();
            const map = this.layer.getMap();
            const fov = map.getFov() * Math.PI / 180;
            const camera = this.camera = new THREE__namespace.PerspectiveCamera(fov, map.width / map.height, map.cameraNear, map.cameraFar);
            camera.matrixAutoUpdate = false;
            this._syncCamera();
            scene.add(camera);
            this.pick = new GPUPick(this.layer);
            BaseObjectTaskManager.star();
            this.layer._addBaseObjectsWhenInit();
        }
        onCanvasCreate() {
            super.onCanvasCreate();
        }
        resizeCanvas(canvasSize) {
            if (!this.canvas) {
                return;
            }
            let size, map = this.getMap();
            if (!canvasSize) {
                size = map.getSize();
            }
            else {
                size = canvasSize;
            }
            // const r = maptalks.Browser.retina ? 2 : 1;
            const r = map.getDevicePixelRatio ? map.getDevicePixelRatio() : (maptalks__namespace.Browser.retina ? 2 : 1);
            const canvas = this.canvas;
            const { width, height, cssWidth, cssHeight } = maptalks__namespace.Util.calCanvasSize(size, r);
            if (this.layer._canvas && (canvas.style.width !== cssWidth || canvas.style.height !== cssHeight)) {
                canvas.style.width = cssWidth;
                canvas.style.height = cssHeight;
            }
            if (canvas.width === width && canvas.height === height) {
                return this;
            }
            //retina support
            canvas.width = width;
            canvas.height = height;
            this.context.setSize(canvas.width, canvas.height);
        }
        clearCanvas() {
            if (!this.canvas) {
                return;
            }
            this.context.clear();
        }
        prepareCanvas() {
            if (!this.canvas) {
                this.createCanvas();
            }
            else {
                this.clearCanvas();
            }
            this.layer.fire('renderstart', { 'context': this.context });
            return null;
        }
        renderScene(context) {
            // const time = maptalks.Util.now();
            // Make sure to execute only once in a frame
            // if (time - this._renderTime >= 16) {
            //     this.layer._callbackBaseObjectAnimation();
            //     this._renderTime = time;
            // }
            this.layer._callbackBaseObjectAnimation();
            this._syncCamera();
            // 把 WebglRenderTarget 中的 framebuffer 替换为 GroupGLLayer 中的 fbo
            // 参考: https://stackoverflow.com/questions/55082573/use-webgl-texture-as-a-three-js-texture-map
            // 实现有点 hacky，需要留意 three 版本变动 对它的影响
            if (context && context.renderTarget) {
                const { width, height } = context.renderTarget.fbo;
                if (!this._renderTarget) {
                    this._renderTarget = new THREE__namespace.WebGLRenderTarget(width, height, {
                        // depthTexture: new THREE.DepthTexture(width, height, THREE.UnsignedInt248Type)
                        depthBuffer: false
                    });
                    // 绘制一次以后，才会生成 framebuffer 对象
                    this.context.setRenderTarget(this._renderTarget);
                    this.context.render(this.scene, this.camera);
                }
                else {
                    // 这里不能setSize，因为setSize中会把原有的fbo dipose掉
                    // this._renderTarget.setSize(width, height);
                    this._renderTarget.viewport.set(0, 0, width, height);
                    this._renderTarget.scissor.set(0, 0, width, height);
                }
                const renderTargetProps = this.context.properties.get(this._renderTarget);
                const threeCreatedFBO = renderTargetProps[KEY_FBO];
                // 用GroupGLLayer的webgl fbo对象替换WebglRenderTarget的fbo对象
                renderTargetProps[KEY_FBO] = context.renderTarget.getFramebuffer(context.renderTarget.fbo);
                this.context.setRenderTarget(this._renderTarget);
                const bloomEnable = context.bloom === 1 && context.sceneFilter;
                const object3ds = this.scene.children || [];
                //是否是bloom渲染帧
                let isBloomFrame = false;
                if (bloomEnable) {
                    const sceneFilter = context.sceneFilter;
                    // test 是否是bloom渲染帧
                    isBloomFrame = sceneFilter(TEMPMESH);
                    for (let i = 0, len = object3ds.length; i < len; i++) {
                        if (!object3ds[i] || !object3ds[i].layers) {
                            continue;
                        }
                        const parent = object3ds[i]['__parent'];
                        object3ds[i]['bloom'] = false;
                        //判断当前ojbect3d是否开启bloom
                        if (parent) {
                            object3ds[i]['bloom'] = parent.bloom;
                        }
                        let layer = 0;
                        //当object3d找不到parent(baseobject)时，也加入当前渲染帧，这种情况的一般都是灯光对象
                        //sceneFilter 用来过滤符合当前模式的meshes
                        if (object3ds[i] && sceneFilter(object3ds[i]) || !parent) {
                            //当时bloom渲染帧时，将meshes分组到layer=1
                            if (isBloomFrame) {
                                layer = 1;
                            }
                        }
                        // object3ds[i].layers.set(layer);
                        if (object3ds[i].__layer !== layer) {
                            recursionObject3dLayer(object3ds[i], layer);
                            object3ds[i].__layer = layer;
                        }
                    }
                }
                else {
                    //reset all object3ds layers
                    for (let i = 0, len = object3ds.length; i < len; i++) {
                        if (!object3ds[i] || !object3ds[i].layers) {
                            continue;
                        }
                        // object3ds[i].layers.set(0);
                        if (object3ds[i].__layer !== 0) {
                            recursionObject3dLayer(object3ds[i], 0);
                            object3ds[i].__layer = 0;
                        }
                    }
                }
                this.camera.layers.set(isBloomFrame ? 1 : 0);
                this.context.render(this.scene, this.camera);
                renderTargetProps[KEY_FBO] = threeCreatedFBO;
            }
            else {
                const { width, height } = this.canvas;
                const viewport = this.context.getViewport(TEMP_V4);
                if (viewport.width !== width || viewport.height !== height) {
                    this.context.setViewport(0, 0, width, height);
                }
                this.context.render(this.scene, this.camera);
            }
            this.context.setRenderTarget(null);
            this.completeRender();
        }
        remove() {
            delete this._drawContext;
            if (this._renderTarget) {
                this._renderTarget.dispose();
                delete this._renderTarget;
            }
            super.remove();
        }
        _syncCamera() {
            const map = this.getMap();
            const camera = this.camera;
            camera.matrix.elements = map.cameraWorldMatrix;
            camera.projectionMatrix.elements = map.projMatrix;
            //https://github.com/mrdoob/three.js/commit/d52afdd2ceafd690ac9e20917d0c968ff2fa7661
            if (this.matrix4.invert) {
                camera.projectionMatrixInverse.elements = this.matrix4.copy(camera.projectionMatrix).invert().elements;
                //r95 no projectionMatrixInverse properties
            }
            else if (camera.projectionMatrixInverse) {
                camera.projectionMatrixInverse.elements = this.matrix4.getInverse(camera.projectionMatrix).elements;
            }
        }
        _createGLContext(canvas, options) {
            const names = ['webgl2', 'webgl', 'experimental-webgl'];
            let context = null;
            /* eslint-disable no-empty */
            for (let i = 0; i < names.length; ++i) {
                try {
                    context = canvas.getContext(names[i], options);
                }
                catch (e) { }
                if (context) {
                    break;
                }
            }
            return context;
            /* eslint-enable no-empty */
        }
    }
    ThreeLayer.registerRenderer('gl', ThreeRenderer);
    function recursionObject3dLayer(object3d, layer) {
        if (!object3d) {
            return;
        }
        if (object3d.layers) {
            object3d.layers.set(layer);
        }
        const children = object3d.children;
        if (children && children.length) {
            for (let i = 0, len = children.length; i < len; i++) {
                recursionObject3dLayer(children[i], layer);
            }
        }
    }
    function getGLRes(map) {
        return map.getGLRes ? map.getGLRes() : map.getGLZoom();
    }
    function coordinateToPoint(map, coordinate, res, out) {
        if (map.coordToPointAtRes) {
            return map.coordToPointAtRes(coordinate, res, out);
        }
        return map.coordinateToPoint(coordinate, res, out);
    }
    if (maptalks__namespace.registerWorkerAdapter) {
        maptalks__namespace.registerWorkerAdapter(getWorkerName(), workerCode);
        maptalks__namespace.registerWorkerAdapter(fetchDataWorkerKey, fetchDataWorkerCode);
    }

    exports.BaseObject = BaseObject;
    exports.BaseObjectTask = BaseObjectTask;
    exports.BaseObjectTaskManager = BaseObjectTaskManager;
    exports.ExtrudeUtil = ExtrudeUtil;
    exports.GeoJSONUtil = GeoJSONUtil;
    exports.GeoUtil = GeoUtil;
    exports.IdentifyUtil = IdentifyUtil;
    exports.LineMaterial = LineMaterial;
    exports.LineUtil = LineUtil;
    exports.MergeGeometryUtil = MergeGeometryUtil;
    exports.MergedMixin = MergedMixin;
    exports.ThreeLayer = ThreeLayer;
    exports.ThreeRenderer = ThreeRenderer;
    exports.geometryExtrude = main;
    exports.getFetchDataActor = getFetchDataActor;
    exports.polyextrude = polyExtrude;

    Object.defineProperty(exports, '__esModule', { value: true });

    typeof console !== 'undefined' && console.log('maptalks.three v0.41.2');

}));
//# sourceMappingURL=maptalks.three.js.map
