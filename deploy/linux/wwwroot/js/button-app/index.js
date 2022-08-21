// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/Exception.ts
var Exception = class extends Error {
  constructor(message, innerError = null) {
    super(message);
    this.innerError = innerError;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/identity.ts
function identity(item) {
  return item;
}
function alwaysTrue() {
  return true;
}
function alwaysFalse() {
  return false;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/typeChecks.ts
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isFunction(obj2) {
  return t(obj2, "function", Function);
}
function isString(obj2) {
  return t(obj2, "string", String);
}
function isBoolean(obj2) {
  return t(obj2, "boolean", Boolean);
}
function isNumber(obj2) {
  return t(obj2, "number", Number);
}
function isObject(obj2) {
  return isDefined(obj2) && t(obj2, "object", Object);
}
function isArray(obj2) {
  return obj2 instanceof Array;
}
function assertNever(x, msg) {
  throw new Error((msg || "Unexpected object: ") + x);
}
function isNullOrUndefined(obj2) {
  return obj2 === null || obj2 === void 0;
}
function isDefined(obj2) {
  return !isNullOrUndefined(obj2);
}
function isArrayBufferView(obj2) {
  return obj2 instanceof Uint8Array || obj2 instanceof Uint8ClampedArray || obj2 instanceof Int8Array || obj2 instanceof Uint16Array || obj2 instanceof Int16Array || obj2 instanceof Uint32Array || obj2 instanceof Int32Array || obj2 instanceof Float32Array || obj2 instanceof Float64Array || "BigUint64Array" in globalThis && obj2 instanceof globalThis["BigUint64Array"] || "BigInt64Array" in globalThis && obj2 instanceof globalThis["BigInt64Array"];
}
function isArrayBuffer(val) {
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || val.constructor && val.constructor.name === "ArrayBuffer");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayClear.ts
function arrayClear(arr) {
  return arr.splice(0);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemoveAt.ts
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/EventBase.ts
var EventBase = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
    this.listenerOptions = /* @__PURE__ */ new Map();
  }
  addEventListener(type2, callback, options) {
    if (isFunction(callback)) {
      let listeners = this.listeners.get(type2);
      if (!listeners) {
        listeners = new Array();
        this.listeners.set(type2, listeners);
      }
      if (!listeners.find((c) => c === callback)) {
        listeners.push(callback);
        if (options) {
          this.listenerOptions.set(callback, options);
        }
      }
    }
  }
  removeEventListener(type2, callback) {
    if (isFunction(callback)) {
      const listeners = this.listeners.get(type2);
      if (listeners) {
        this.removeListener(listeners, callback);
      }
    }
  }
  clearEventListeners(type2) {
    for (const [evtName, handlers] of this.listeners) {
      if (isNullOrUndefined(type2) || type2 === evtName) {
        for (const handler of handlers) {
          this.removeEventListener(type2, handler);
        }
        arrayClear(handlers);
        this.listeners.delete(evtName);
      }
    }
  }
  removeListener(listeners, callback) {
    const idx = listeners.findIndex((c) => c === callback);
    if (idx >= 0) {
      arrayRemoveAt(listeners, idx);
      if (this.listenerOptions.has(callback)) {
        this.listenerOptions.delete(callback);
      }
    }
  }
  dispatchEvent(evt) {
    const listeners = this.listeners.get(evt.type);
    if (listeners) {
      for (const callback of listeners) {
        const options = this.listenerOptions.get(callback);
        if (isDefined(options) && !isBoolean(options) && options.once) {
          this.removeListener(listeners, callback);
        }
        callback.call(this, evt);
      }
    }
    return !evt.defaultPrevented;
  }
};
var TypedEvent = class extends Event {
  get type() {
    return super.type;
  }
  constructor(type2, eventInitDict) {
    super(type2, eventInitDict);
  }
};
var TypedEventBase = class extends EventBase {
  constructor() {
    super(...arguments);
    this.bubblers = /* @__PURE__ */ new Set();
    this.scopes = /* @__PURE__ */ new WeakMap();
  }
  addBubbler(bubbler) {
    this.bubblers.add(bubbler);
  }
  removeBubbler(bubbler) {
    this.bubblers.delete(bubbler);
  }
  addEventListener(type2, callback, options) {
    super.addEventListener(type2, callback, options);
  }
  removeEventListener(type2, callback) {
    super.removeEventListener(type2, callback);
  }
  clearEventListeners(type2) {
    return super.clearEventListeners(type2);
  }
  addScopedEventListener(scope, type2, callback, options) {
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, []);
    }
    this.scopes.get(scope).push([type2, callback]);
    this.addEventListener(type2, callback, options);
  }
  removeScope(scope) {
    const listeners = this.scopes.get(scope);
    if (listeners) {
      this.scopes.delete(scope);
      for (const [type2, listener] of listeners) {
        this.removeEventListener(type2, listener);
      }
    }
  }
  dispatchEvent(evt) {
    if (!super.dispatchEvent(evt)) {
      return false;
    }
    if (!evt.cancelBubble) {
      for (const bubbler of this.bubblers) {
        if (!bubbler.dispatchEvent(evt)) {
          return false;
        }
      }
    }
    return true;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/Task.ts
var Task = class {
  constructor(resolveTestOrAutoStart, rejectTestOrAutoStart, autoStart = true) {
    this.onThens = new Array();
    this.onCatches = new Array();
    this._result = void 0;
    this._error = void 0;
    this._started = false;
    this._errored = false;
    this._finished = false;
    if (isFunction(resolveTestOrAutoStart)) {
      this.resolveTest = resolveTestOrAutoStart;
    } else {
      this.resolveTest = alwaysTrue;
    }
    if (isFunction(rejectTestOrAutoStart)) {
      this.rejectTest = rejectTestOrAutoStart;
    } else {
      this.rejectTest = alwaysTrue;
    }
    if (isBoolean(resolveTestOrAutoStart)) {
      this.autoStart = resolveTestOrAutoStart;
    } else if (isBoolean(rejectTestOrAutoStart)) {
      this.autoStart = rejectTestOrAutoStart;
    } else if (isDefined(autoStart)) {
      this.autoStart = autoStart;
    } else {
      this.autoStart = false;
    }
    this.resolve = (value) => {
      if (this.running && this.resolveTest(value)) {
        this._result = value;
        for (const thenner of this.onThens) {
          thenner(value);
        }
        this.clear();
        this._finished = true;
      }
    };
    this.reject = (reason) => {
      if (this.running && this.rejectTest(reason)) {
        this._error = reason;
        this._errored = true;
        for (const catcher of this.onCatches) {
          catcher(reason);
        }
        this.clear();
        this._finished = true;
      }
    };
    if (this.autoStart) {
      this.start();
    }
  }
  clear() {
    arrayClear(this.onThens);
    arrayClear(this.onCatches);
  }
  start() {
    this._started = true;
  }
  get result() {
    if (isDefined(this.error)) {
      throw this.error;
    }
    return this._result;
  }
  get error() {
    return this._error;
  }
  get started() {
    return this._started;
  }
  get finished() {
    return this._finished;
  }
  get running() {
    return this.started && !this.finished;
  }
  get errored() {
    return this._errored;
  }
  get [Symbol.toStringTag]() {
    return this.toString();
  }
  project() {
    return new Promise((resolve, reject) => {
      if (!this.finished) {
        this.onThens.push(resolve);
        this.onCatches.push(reject);
      } else if (this.errored) {
        reject(this.error);
      } else {
        resolve(this.result);
      }
    });
  }
  then(onfulfilled, onrejected) {
    return this.project().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.project().catch(onrejected);
  }
  finally(onfinally) {
    return this.project().finally(onfinally);
  }
  reset() {
    if (this.running) {
      this.reject("Resetting previous invocation");
    }
    this.clear();
    this._result = void 0;
    this._error = void 0;
    this._errored = false;
    this._finished = false;
    this._started = false;
    if (this.autoStart) {
      this.start();
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/once.ts
function targetValidateEvent(target, type2) {
  return "on" + type2 in target;
}
function once(target, resolveEvt, rejectEvtOrTimeout, ...rejectEvts) {
  if (isNullOrUndefined(rejectEvts)) {
    rejectEvts = [];
  }
  let timeout = void 0;
  if (isString(rejectEvtOrTimeout)) {
    rejectEvts.unshift(rejectEvtOrTimeout);
  } else if (isNumber(rejectEvtOrTimeout)) {
    timeout = rejectEvtOrTimeout;
  }
  if (!(target instanceof EventBase)) {
    if (!targetValidateEvent(target, resolveEvt)) {
      throw new Exception(`Target does not have a ${resolveEvt} rejection event`);
    }
    for (const evt of rejectEvts) {
      if (!targetValidateEvent(target, evt)) {
        throw new Exception(`Target does not have a ${evt} rejection event`);
      }
    }
  }
  const task = new Task();
  if (isNumber(timeout)) {
    const timeoutHandle = setTimeout(task.reject, timeout, `'${resolveEvt}' has timed out.`);
    task.finally(clearTimeout.bind(globalThis, timeoutHandle));
  }
  const register = (evt, callback) => {
    target.addEventListener(evt, callback);
    task.finally(() => target.removeEventListener(evt, callback));
  };
  const onResolve = (evt) => task.resolve(evt);
  const onReject = (evt) => task.reject(evt);
  register(resolveEvt, onResolve);
  for (const rejectEvt of rejectEvts) {
    register(rejectEvt, onReject);
  }
  return task;
}
function success(task) {
  return task.then(alwaysTrue).catch(alwaysFalse);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/attrs.ts
var Attr = class {
  constructor(key, value, bySetAttribute, ...tags) {
    this.key = key;
    this.value = value;
    this.bySetAttribute = bySetAttribute;
    this.tags = tags.map((t2) => t2.toLocaleUpperCase());
    Object.freeze(this);
  }
  applyToElement(elem) {
    const isDataSet = this.key.startsWith("data-");
    const isValid = this.tags.length === 0 || this.tags.indexOf(elem.tagName) > -1 || isDataSet;
    if (!isValid) {
      console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
    } else if (isDataSet) {
      const subkey = this.key.substring(5);
      elem.dataset[subkey] = this.value;
    } else if (this.key === "style") {
      Object.assign(elem.style, this.value);
    } else if (this.key === "classList") {
      this.value.forEach((v) => elem.classList.add(v));
    } else if (this.bySetAttribute) {
      elem.setAttribute(this.key, this.value);
    } else if (this.key in elem) {
      elem[this.key] = this.value;
    } else if (this.value === false) {
      elem.removeAttribute(this.key);
    } else if (this.value === true) {
      elem.setAttribute(this.key, "");
    } else {
      elem.setAttribute(this.key, this.value);
    }
  }
};
function autoPlay(value) {
  return new Attr("autoplay", value, false, "audio", "video");
}
function controls(value) {
  return new Attr("controls", value, false, "audio", "video");
}
function htmlHeight(value) {
  return new Attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function id(value) {
  return new Attr("id", value, false);
}
function loop(value) {
  return new Attr("loop", value, false, "audio", "bgsound", "marquee", "video");
}
function muted(value) {
  return new Attr("muted", value, false, "audio", "video");
}
function playsInline(value) {
  return new Attr("playsInline", value, false, "audio", "video");
}
function type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return new Attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
}
function htmlWidth(value) {
  return new Attr("width", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/css.ts
var CssProp = class {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.name = key.replace(/[A-Z]/g, (m) => `-${m.toLocaleLowerCase()}`);
  }
  applyToElement(elem) {
    elem.style[this.key] = this.value;
  }
};
var CssPropSet = class {
  constructor(...rest) {
    this.rest = rest;
  }
  applyToElement(elem) {
    for (const prop of this.rest) {
      prop.applyToElement(elem);
    }
  }
};
function styles(...rest) {
  return new CssPropSet(...rest);
}
function display(v) {
  return new CssProp("display", v);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/tags.ts
function isErsatzElement(obj2) {
  if (!isObject(obj2)) {
    return false;
  }
  const elem = obj2;
  return elem.element instanceof HTMLElement;
}
function resolveElement(elem) {
  if (isErsatzElement(elem)) {
    return elem.element;
  }
  return elem;
}
function isIElementAppliable(obj2) {
  return isObject(obj2) && "applyToElement" in obj2 && isFunction(obj2.applyToElement);
}
function elementSetDisplay(elem, visible, visibleDisplayType = "block") {
  elem = resolveElement(elem);
  elem.style.display = visible ? visibleDisplayType : "none";
}
function elementIsDisplayed(elem) {
  elem = resolveElement(elem);
  return elem.style.display !== "none";
}
function elementApply(elem, ...children) {
  elem = resolveElement(elem);
  for (const child of children) {
    if (isDefined(child)) {
      if (child instanceof Node) {
        elem.append(child);
      } else if (isErsatzElement(child)) {
        elem.append(resolveElement(child));
      } else if (isIElementAppliable(child)) {
        child.applyToElement(elem);
      } else {
        elem.append(document.createTextNode(child.toLocaleString()));
      }
    }
  }
  return elem;
}
function getElement(selector) {
  return document.querySelector(selector);
}
function getInput(selector) {
  return getElement(selector);
}
function tag(name, ...rest) {
  let elem = null;
  for (const attr of rest) {
    if (attr instanceof Attr && attr.key === "id") {
      elem = document.getElementById(attr.value);
      break;
    }
  }
  if (elem == null) {
    elem = document.createElement(name);
  }
  elementApply(elem, ...rest);
  return elem;
}
function Audio2(...rest) {
  return tag("audio", ...rest);
}
function Canvas(...rest) {
  return tag("canvas", ...rest);
}
function Div(...rest) {
  return tag("div", ...rest);
}
function Img(...rest) {
  return tag("img", ...rest);
}
function Script(...rest) {
  return tag("script", ...rest);
}
function Video(...rest) {
  return tag("video", ...rest);
}
function BackgroundAudio(autoplay, mute, looping, ...rest) {
  return Audio2(
    playsInline(true),
    controls(false),
    muted(mute),
    autoPlay(autoplay),
    loop(looping),
    styles(display("none")),
    ...rest
  );
}
function BackgroundVideo(autoplay, mute, looping, ...rest) {
  return Video(
    playsInline(true),
    controls(false),
    muted(mute),
    autoPlay(autoplay),
    loop(looping),
    styles(display("none")),
    ...rest
  );
}

// global-externals:three
var { ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AlphaFormat, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AmbientLightProbe, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, Audio: Audio3, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, BackSide, BasicDepthPacking, BasicShadowMap, Bone, BooleanKeyframeTrack, Box2, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasTexture, CapsuleBufferGeometry, CapsuleGeometry, CatmullRomCurve3, CineonToneMapping, CircleBufferGeometry, CircleGeometry, ClampToEdgeWrapping, Clock, Color, ColorKeyframeTrack, ColorManagement, CompressedTexture, CompressedTextureLoader, ConeBufferGeometry, ConeGeometry, CubeCamera, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderBufferGeometry, CylinderGeometry, Cylindrical, Data3DTexture, DataArrayTexture, DataTexture, DataTexture2DArray, DataTexture3D, DataTextureLoader, DataUtils, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DodecahedronBufferGeometry, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EllipseCurve, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExtrudeBufferGeometry, ExtrudeGeometry, FileLoader, FlatShading, Float16BufferAttribute, Float32BufferAttribute, Float64BufferAttribute, FloatType, Fog, FogExp2, Font, FontLoader, FramebufferTexture, FrontSide, Frustum, GLBufferAttribute, GLSL1, GLSL3, GreaterDepth, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HalfFloatType, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, IcosahedronBufferGeometry, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, ImmediateRenderObject, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InvertStencilOp, KeepStencilOp, KeyframeTrack, LOD, LatheBufferGeometry, LatheGeometry, Layers, LessDepth, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LineSegments, LinearEncoding, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearSRGBColorSpace, LinearToneMapping, Loader, LoaderUtils, LoadingManager, LoopOnce, LoopPingPong, LoopRepeat, LuminanceAlphaFormat, LuminanceFormat, MOUSE, Material, MaterialLoader, MathUtils, Matrix3, Matrix4, MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeverDepth, NeverStencilFunc, NoBlending, NoColorSpace, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronBufferGeometry, OctahedronGeometry, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, ParametricGeometry, Path, PerspectiveCamera, Plane, PlaneBufferGeometry, PlaneGeometry, PlaneHelper, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronBufferGeometry, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, REVISION, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGBFormat, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat, RedIntegerFormat, ReinhardToneMapping, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingBufferGeometry, RingGeometry, SRGBColorSpace, Scene, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeBufferGeometry, ShapeGeometry, ShapePath, ShapeUtils, ShortType, Skeleton, SkeletonHelper, SkinnedMesh, SmoothShading, Source, Sphere, SphereBufferGeometry, SphereGeometry, Spherical, SphericalHarmonics3, SplineCurve, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage, StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronBufferGeometry, TetrahedronGeometry, TextGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusGeometry, TorusKnotBufferGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeBufferGeometry, TubeGeometry, UVMapping, Uint16BufferAttribute, Uint32BufferAttribute, Uint8BufferAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsGroup, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt248Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, VideoTexture, WebGL1Renderer, WebGL3DRenderTarget, WebGLArrayRenderTarget, WebGLCubeRenderTarget, WebGLMultipleRenderTargets, WebGLMultisampleRenderTarget, WebGLRenderTarget, WebGLRenderer, WebGLUtils, WireframeGeometry, WrapAroundEnding, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, _SRGBAFormat, sRGBEncoding } = THREE;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/typeChecks.ts
function isMesh(obj2) {
  return isDefined(obj2) && obj2.isMesh;
}
function isMaterial(obj2) {
  return isDefined(obj2) && obj2.isMaterial;
}
function isNamedMaterial(name, obj2) {
  return isMaterial(obj2) && obj2.type === name;
}
function isMeshBasicMaterial(obj2) {
  return isNamedMaterial("MeshBasicMaterial", obj2);
}
function isObject3D(obj2) {
  return isDefined(obj2) && obj2.isObject3D;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/objects.ts
function isErsatzObject(obj2) {
  return isDefined(obj2) && isObject3D(obj2.object);
}
function objectResolve(obj2) {
  if (isErsatzObject(obj2)) {
    return obj2.object;
  }
  return obj2;
}
function objectSetVisible(obj2, visible) {
  obj2 = objectResolve(obj2);
  obj2.visible = visible;
  return visible;
}
function objectIsFullyVisible(obj2) {
  obj2 = objectResolve(obj2);
  while (obj2) {
    if (!obj2.visible) {
      return false;
    }
    obj2 = obj2.parent;
  }
  return true;
}
function objGraph(obj2, ...children) {
  const toAdd = children.filter(isDefined).map(objectResolve);
  if (toAdd.length > 0) {
    objectResolve(obj2).add(...toAdd);
  }
  return obj2;
}
function obj(name, ...rest) {
  const obj2 = new Object3D();
  obj2.name = name;
  objGraph(obj2, ...rest);
  return obj2;
}
function mesh(name, geom, mat) {
  const mesh2 = new Mesh(geom, mat);
  mesh2.name = name;
  return mesh2;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/canvas.ts
var hasHTMLCanvas = "HTMLCanvasElement" in globalThis;
var hasHTMLImage = "HTMLImageElement" in globalThis;
var disableAdvancedSettings = false;
var hasOffscreenCanvas = !disableAdvancedSettings && "OffscreenCanvas" in globalThis;
var hasImageBitmap = !disableAdvancedSettings && "createImageBitmap" in globalThis;
function isHTMLCanvas(obj2) {
  return hasHTMLCanvas && obj2 instanceof HTMLCanvasElement;
}
function isOffscreenCanvas(obj2) {
  return hasOffscreenCanvas && obj2 instanceof OffscreenCanvas;
}
function isImageBitmap(img) {
  return hasImageBitmap && img instanceof ImageBitmap;
}
function isImageData(img) {
  return img instanceof ImageData;
}
function drawImageBitmapToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.drawImage(img, 0, 0);
}
function drawImageDataToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.putImageData(img, 0, 0);
}
function testOffscreen2D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("2d");
    return g != null;
  } catch (exp) {
    return false;
  }
}
var hasOffscreenCanvasRenderingContext2D = hasOffscreenCanvas && testOffscreen2D();
var createUtilityCanvas = hasOffscreenCanvasRenderingContext2D && createOffscreenCanvas || hasHTMLCanvas && createCanvas || null;
var createUICanvas = hasHTMLCanvas ? createCanvas : createUtilityCanvas;
function testOffscreen3D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("webgl2");
    return g != null;
  } catch (exp) {
    return false;
  }
}
var hasOffscreenCanvasRenderingContext3D = hasOffscreenCanvas && testOffscreen3D();
function createOffscreenCanvas(width, height) {
  return new OffscreenCanvas(width, height);
}
function createCanvas(w, h) {
  if (false) {
    throw new Error("HTML Canvas is not supported in workers");
  }
  return Canvas(htmlWidth(w), htmlHeight(h));
}
function createOffscreenCanvasFromImageBitmap(img) {
  const canv = createOffscreenCanvas(img.width, img.height);
  drawImageBitmapToCanvas(canv, img);
  return canv;
}
function createCanvasFromImageBitmap(img) {
  if (false) {
    throw new Error("HTML Canvas is not supported in workers");
  }
  const canv = createCanvas(img.width, img.height);
  drawImageBitmapToCanvas(canv, img);
  return canv;
}
var createUtilityCanvasFromImageBitmap = hasOffscreenCanvasRenderingContext2D && createOffscreenCanvasFromImageBitmap || hasHTMLCanvas && createCanvasFromImageBitmap || null;
function createOffscreenCanvasFromImageData(img) {
  const canv = createOffscreenCanvas(img.width, img.height);
  drawImageDataToCanvas(canv, img);
  return canv;
}
function createCanvasFromImageData(img) {
  if (false) {
    throw new Error("HTML Canvas is not supported in workers");
  }
  const canv = createCanvas(img.width, img.height);
  drawImageDataToCanvas(canv, img);
  return canv;
}
var createUtilityCanvasFromImageData = hasOffscreenCanvasRenderingContext2D && createOffscreenCanvasFromImageData || hasHTMLCanvas && createCanvasFromImageData || null;
function drawImageToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.drawImage(img, 0, 0);
}
function setCanvasSize(canv, w, h, superscale = 1) {
  w = Math.floor(w * superscale);
  h = Math.floor(h * superscale);
  if (canv.width != w || canv.height != h) {
    canv.width = w;
    canv.height = h;
    return true;
  }
  return false;
}
function is2DRenderingContext(ctx) {
  return isDefined(ctx.textBaseline);
}
function setCanvas2DContextSize(ctx, w, h, superscale = 1) {
  const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(
    ctx.canvas,
    w,
    h,
    superscale
  );
  if (resized) {
    ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
    ctx.textBaseline = oldTextBaseline;
    ctx.textAlign = oldTextAlign;
    ctx.font = oldFont;
  }
  return resized;
}
function setContextSize(ctx, w, h, superscale = 1) {
  if (is2DRenderingContext(ctx)) {
    return setCanvas2DContextSize(ctx, w, h, superscale);
  } else {
    return setCanvasSize(
      ctx.canvas,
      w,
      h,
      superscale
    );
  }
}
function canvasToBlob(canvas, type2, quality) {
  if (isOffscreenCanvas(canvas)) {
    return canvas.convertToBlob({ type: type2, quality });
  } else if (isHTMLCanvas(canvas)) {
    const blobCreated = new Task();
    canvas.toBlob(blobCreated.resolve, type2, quality);
    return blobCreated;
  } else {
    throw new Error("Cannot save image from canvas");
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/singleton.ts
function singleton(name, create2) {
  const box = globalThis;
  let value = box[name];
  if (isNullOrUndefined(value)) {
    if (isNullOrUndefined(create2)) {
      throw new Error(`No value ${name} found`);
    }
    value = create2();
    box[name] = value;
  }
  return value;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/fonts.ts
var DEFAULT_TEST_TEXT = "The quick brown fox jumps over the lazy dog";
var loadedFonts = singleton("juniper::loadedFonts", () => []);
function makeFont(style) {
  const fontParts = [];
  if (style.fontStyle && style.fontStyle !== "normal") {
    fontParts.push(style.fontStyle);
  }
  if (style.fontVariant && style.fontVariant !== "normal") {
    fontParts.push(style.fontVariant);
  }
  if (style.fontWeight && style.fontWeight !== "normal") {
    fontParts.push(style.fontWeight);
  }
  fontParts.push(`${style.fontSize}px`);
  fontParts.push(style.fontFamily);
  return fontParts.join(" ");
}
async function loadFont(font, testString = null, prog) {
  if (!isString(font)) {
    font = makeFont(font);
  }
  if (loadedFonts.indexOf(font) === -1) {
    testString = testString || DEFAULT_TEST_TEXT;
    if (prog) {
      prog.start(font);
    }
    const fonts = await document.fonts.load(font, testString);
    if (prog) {
      prog.end(font);
    }
    if (fonts.length === 0) {
      console.warn(`Failed to load font "${font}". If this is a system font, just set the object's \`value\` property, instead of calling \`loadFontAndSetText\`.`);
    } else {
      loadedFonts.push(font);
    }
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/math.ts
var Tau = 2 * Math.PI;
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/graphics2d/CanvasImage.ts
var CanvasImage = class extends TypedEventBase {
  constructor(width, height, options) {
    super();
    this._scale = 250;
    this._visible = true;
    this.wasVisible = null;
    this.redrawnEvt = new TypedEvent("redrawn");
    this.element = null;
    if (isDefined(options)) {
      if (isDefined(options.scale)) {
        this._scale = options.scale;
      }
    }
    this._canvas = createUICanvas(width, height);
    this._g = this.canvas.getContext("2d");
    if (isHTMLCanvas(this._canvas)) {
      this.element = this._canvas;
    }
  }
  fillRect(color, x, y, width, height, margin2) {
    this.g.fillStyle = color;
    this.g.fillRect(x + margin2, y + margin2, width - 2 * margin2, height - 2 * margin2);
  }
  drawText(text2, x, y, align) {
    this.g.textAlign = align;
    this.g.strokeText(text2, x, y);
    this.g.fillText(text2, x, y);
  }
  redraw() {
    if ((this.visible || this.wasVisible) && this.onRedraw()) {
      this.wasVisible = this.visible;
      this.dispatchEvent(this.redrawnEvt);
    }
  }
  get canvas() {
    return this._canvas;
  }
  get g() {
    return this._g;
  }
  get imageWidth() {
    return this.canvas.width;
  }
  get imageHeight() {
    return this.canvas.height;
  }
  get aspectRatio() {
    return this.imageWidth / this.imageHeight;
  }
  get width() {
    return this.imageWidth / this.scale;
  }
  get height() {
    return this.imageHeight / this.scale;
  }
  get scale() {
    return this._scale;
  }
  set scale(v) {
    if (this.scale !== v) {
      this._scale = v;
      this.redraw();
    }
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    if (this.visible !== v) {
      this.wasVisible = this._visible;
      this._visible = v;
      this.redraw();
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/graphics2d/TextImage.ts
var TextImage = class extends CanvasImage {
  constructor(options) {
    super(10, 10, options);
    this.trueWidth = null;
    this.trueHeight = null;
    this.trueFontSize = null;
    this.dx = null;
    this._minWidth = null;
    this._maxWidth = null;
    this._minHeight = null;
    this._maxHeight = null;
    this._freezeDimensions = false;
    this._dimensionsFrozen = false;
    this._bgFillColor = null;
    this._bgStrokeColor = null;
    this._bgStrokeSize = null;
    this._textStrokeColor = null;
    this._textStrokeSize = null;
    this._textFillColor = "black";
    this._textDirection = "horizontal";
    this._wrapWords = true;
    this._fontStyle = "normal";
    this._fontVariant = "normal";
    this._fontWeight = "normal";
    this._fontFamily = "sans-serif";
    this._fontSize = 20;
    this._value = null;
    if (isDefined(options)) {
      if (isDefined(options.minWidth)) {
        this._minWidth = options.minWidth;
      }
      if (isDefined(options.maxWidth)) {
        this._maxWidth = options.maxWidth;
      }
      if (isDefined(options.minHeight)) {
        this._minHeight = options.minHeight;
      }
      if (isDefined(options.maxHeight)) {
        this._maxHeight = options.maxHeight;
      }
      if (isDefined(options.freezeDimensions)) {
        this._freezeDimensions = options.freezeDimensions;
      }
      if (isDefined(options.textStrokeColor)) {
        this._textStrokeColor = options.textStrokeColor;
      }
      if (isDefined(options.textStrokeSize)) {
        this._textStrokeSize = options.textStrokeSize;
      }
      if (isDefined(options.bgFillColor)) {
        this._bgFillColor = options.bgFillColor;
      }
      if (isDefined(options.bgStrokeColor)) {
        this._bgStrokeColor = options.bgStrokeColor;
      }
      if (isDefined(options.bgStrokeSize)) {
        this._bgStrokeSize = options.bgStrokeSize;
      }
      if (isDefined(options.value)) {
        this._value = options.value;
      }
      if (isDefined(options.textFillColor)) {
        this._textFillColor = options.textFillColor;
      }
      if (isDefined(options.textDirection)) {
        this._textDirection = options.textDirection;
      }
      if (isDefined(options.wrapWords)) {
        this._wrapWords = options.wrapWords;
      }
      if (isDefined(options.fontStyle)) {
        this._fontStyle = options.fontStyle;
      }
      if (isDefined(options.fontVariant)) {
        this._fontVariant = options.fontVariant;
      }
      if (isDefined(options.fontWeight)) {
        this._fontWeight = options.fontWeight;
      }
      if (isDefined(options.fontFamily)) {
        this._fontFamily = options.fontFamily;
      }
      if (isDefined(options.fontSize)) {
        this._fontSize = options.fontSize;
      }
      if (isDefined(options.padding)) {
        if (isNumber(options.padding)) {
          this._padding = {
            left: options.padding,
            right: options.padding,
            top: options.padding,
            bottom: options.padding
          };
        } else {
          this._padding = options.padding;
        }
      }
    }
    if (isNullOrUndefined(this._padding)) {
      this._padding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
    this.redraw();
  }
  get minWidth() {
    return this._minWidth;
  }
  set minWidth(v) {
    if (this.minWidth !== v) {
      this._minWidth = v;
      this.redraw();
    }
  }
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(v) {
    if (this.maxWidth !== v) {
      this._maxWidth = v;
      this.redraw();
    }
  }
  get minHeight() {
    return this._minHeight;
  }
  set minHeight(v) {
    if (this.minHeight !== v) {
      this._minHeight = v;
      this.redraw();
    }
  }
  get maxHeight() {
    return this._maxHeight;
  }
  set maxHeight(v) {
    if (this.maxHeight !== v) {
      this._maxHeight = v;
      this.redraw();
    }
  }
  get padding() {
    return this._padding;
  }
  set padding(v) {
    if (v instanceof Array) {
      throw new Error("Invalid padding");
    }
    if (this.padding.top !== v.top || this.padding.right != v.right || this.padding.bottom != v.bottom || this.padding.left != v.left) {
      this._padding = v;
      this.redraw();
    }
  }
  get wrapWords() {
    return this._wrapWords;
  }
  set wrapWords(v) {
    if (this.wrapWords !== v) {
      this._wrapWords = v;
      this.redraw();
    }
  }
  get textDirection() {
    return this._textDirection;
  }
  set textDirection(v) {
    if (this.textDirection !== v) {
      this._textDirection = v;
      this.redraw();
    }
  }
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(v) {
    if (this.fontStyle !== v) {
      this._fontStyle = v;
      this.redraw();
    }
  }
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(v) {
    if (this.fontVariant !== v) {
      this._fontVariant = v;
      this.redraw();
    }
  }
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(v) {
    if (this.fontWeight !== v) {
      this._fontWeight = v;
      this.redraw();
    }
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(v) {
    if (this.fontSize !== v) {
      this._fontSize = v;
      this.redraw();
    }
  }
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(v) {
    if (this.fontFamily !== v) {
      this._fontFamily = v;
      this.redraw();
    }
  }
  get textFillColor() {
    return this._textFillColor;
  }
  set textFillColor(v) {
    if (this.textFillColor !== v) {
      this._textFillColor = v;
      this.redraw();
    }
  }
  get textStrokeColor() {
    return this._textStrokeColor;
  }
  set textStrokeColor(v) {
    if (this.textStrokeColor !== v) {
      this._textStrokeColor = v;
      this.redraw();
    }
  }
  get textStrokeSize() {
    return this._textStrokeSize;
  }
  set textStrokeSize(v) {
    if (this.textStrokeSize !== v) {
      this._textStrokeSize = v;
      this.redraw();
    }
  }
  get bgFillColor() {
    return this._bgFillColor;
  }
  set bgFillColor(v) {
    if (this.bgFillColor !== v) {
      this._bgFillColor = v;
      this.redraw();
    }
  }
  get bgStrokeColor() {
    return this._bgStrokeColor;
  }
  set bgStrokeColor(v) {
    if (this.bgStrokeColor !== v) {
      this._bgStrokeColor = v;
      this.redraw();
    }
  }
  get bgStrokeSize() {
    return this._bgStrokeSize;
  }
  set bgStrokeSize(v) {
    if (this.bgStrokeSize !== v) {
      this._bgStrokeSize = v;
      this.redraw();
    }
  }
  get value() {
    return this._value;
  }
  set value(v) {
    if (this.value !== v) {
      this._value = v;
      this.redraw();
    }
  }
  split(value) {
    if (this.wrapWords) {
      return value.split(" ").join("\n").replace(/\r\n/, "\n").split("\n");
    } else {
      return value.replace(/\r\n/, "\n").split("\n");
    }
  }
  unfreeze() {
    this._dimensionsFrozen = false;
  }
  onRedraw() {
    this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.visible && this.fontFamily && this.fontSize && (this.textFillColor || this.textStrokeColor && this.textStrokeSize) && this.value) {
      const lines = this.split(this.value);
      const isVertical = this.textDirection && this.textDirection.indexOf("vertical") === 0;
      if (this.trueWidth === null || this.trueHeight === null || this.dx === null || this.trueFontSize === null || !this._dimensionsFrozen) {
        this._dimensionsFrozen = this._freezeDimensions;
        const autoResize = this.minWidth != null || this.maxWidth != null || this.minHeight != null || this.maxHeight != null;
        const _targetMinWidth = ((this.minWidth || 0) - this.padding.right - this.padding.left) * this.scale;
        const _targetMaxWidth = ((this.maxWidth || 4096) - this.padding.right - this.padding.left) * this.scale;
        const _targetMinHeight = ((this.minHeight || 0) - this.padding.top - this.padding.bottom) * this.scale;
        const _targetMaxHeight = ((this.maxHeight || 4096) - this.padding.top - this.padding.bottom) * this.scale;
        const targetMinWidth = isVertical ? _targetMinHeight : _targetMinWidth;
        const targetMaxWidth = isVertical ? _targetMaxHeight : _targetMaxWidth;
        const targetMinHeight = isVertical ? _targetMinWidth : _targetMinHeight;
        const targetMaxHeight = isVertical ? _targetMaxWidth : _targetMaxHeight;
        const tried = [];
        this.trueWidth = 0;
        this.trueHeight = 0;
        this.dx = 0;
        let tooBig = false, tooSmall = false, highFontSize = 1e4, lowFontSize = 0;
        this.trueFontSize = clamp(this.fontSize * this.scale, lowFontSize, highFontSize);
        let minFont = null, minFontDelta = Number.MAX_VALUE;
        do {
          const realFontSize = this.fontSize;
          this._fontSize = this.trueFontSize;
          const font = makeFont(this);
          this._fontSize = realFontSize;
          this.g.textAlign = "center";
          this.g.textBaseline = "middle";
          this.g.font = font;
          this.trueWidth = 0;
          this.trueHeight = 0;
          for (const line of lines) {
            const metrics = this.g.measureText(line);
            this.trueWidth = Math.max(this.trueWidth, metrics.width);
            this.trueHeight += this.trueFontSize;
            if (isNumber(metrics.actualBoundingBoxLeft) && isNumber(metrics.actualBoundingBoxRight) && isNumber(metrics.actualBoundingBoxAscent) && isNumber(metrics.actualBoundingBoxDescent)) {
              if (!autoResize) {
                this.trueWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
                this.trueHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                this.dx = (metrics.actualBoundingBoxLeft - this.trueWidth / 2) / 2;
              }
            }
          }
          if (autoResize) {
            const dMinWidth = this.trueWidth - targetMinWidth;
            const dMaxWidth = this.trueWidth - targetMaxWidth;
            const dMinHeight = this.trueHeight - targetMinHeight;
            const dMaxHeight = this.trueHeight - targetMaxHeight;
            const mdMinWidth = Math.abs(dMinWidth);
            const mdMaxWidth = Math.abs(dMaxWidth);
            const mdMinHeight = Math.abs(dMinHeight);
            const mdMaxHeight = Math.abs(dMaxHeight);
            tooBig = dMaxWidth > 1 || dMaxHeight > 1;
            tooSmall = dMinWidth < -1 && dMinHeight < -1;
            const minDif = Math.min(mdMinWidth, Math.min(mdMaxWidth, Math.min(mdMinHeight, mdMaxHeight)));
            if (minDif < minFontDelta) {
              minFontDelta = minDif;
              minFont = this.g.font;
            }
            if ((tooBig || tooSmall) && tried.indexOf(this.g.font) > -1 && minFont) {
              this.g.font = minFont;
              tooBig = false;
              tooSmall = false;
            }
            if (tooBig) {
              highFontSize = this.trueFontSize;
              this.trueFontSize = (lowFontSize + this.trueFontSize) / 2;
            } else if (tooSmall) {
              lowFontSize = this.trueFontSize;
              this.trueFontSize = (this.trueFontSize + highFontSize) / 2;
            }
          }
          tried.push(this.g.font);
        } while (tooBig || tooSmall);
        if (autoResize) {
          if (this.trueWidth < targetMinWidth) {
            this.trueWidth = targetMinWidth;
          } else if (this.trueWidth > targetMaxWidth) {
            this.trueWidth = targetMaxWidth;
          }
          if (this.trueHeight < targetMinHeight) {
            this.trueHeight = targetMinHeight;
          } else if (this.trueHeight > targetMaxHeight) {
            this.trueHeight = targetMaxHeight;
          }
        }
        const newW = this.trueWidth + this.scale * (this.padding.right + this.padding.left);
        const newH = this.trueHeight + this.scale * (this.padding.top + this.padding.bottom);
        try {
          setContextSize(this.g, newW, newH);
        } catch (exp) {
          console.error(exp);
          throw exp;
        }
      }
      if (this.bgFillColor) {
        this.g.fillStyle = this.bgFillColor;
        this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (this.textStrokeColor && this.textStrokeSize) {
        this.g.lineWidth = this.textStrokeSize * this.scale;
        this.g.strokeStyle = this.textStrokeColor;
      }
      if (this.textFillColor) {
        this.g.fillStyle = this.textFillColor;
      }
      const di = 0.5 * (lines.length - 1);
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        const dy = (i - di) * this.trueFontSize;
        const x = this.dx + this.trueWidth / 2 + this.scale * this.padding.left;
        const y = dy + this.trueHeight / 2 + this.scale * this.padding.top;
        if (this.textStrokeColor && this.textStrokeSize) {
          this.g.strokeText(line, x, y);
        }
        if (this.textFillColor) {
          this.g.fillText(line, x, y);
        }
      }
      if (this.bgStrokeColor && this.bgStrokeSize) {
        this.g.strokeStyle = this.bgStrokeColor;
        this.g.lineWidth = this.bgStrokeSize * this.scale;
        const s = this.bgStrokeSize / 2;
        this.g.strokeRect(s, s, this.canvas.width - this.bgStrokeSize, this.canvas.height - this.bgStrokeSize);
      }
      if (isVertical) {
        const canv = createUtilityCanvas(this.canvas.height, this.canvas.width);
        const g = canv.getContext("2d");
        if (g) {
          g.translate(canv.width / 2, canv.height / 2);
          if (this.textDirection === "vertical" || this.textDirection === "vertical-left") {
            g.rotate(Math.PI / 2);
          } else if (this.textDirection === "vertical-right") {
            g.rotate(-Math.PI / 2);
          }
          g.translate(-this.canvas.width / 2, -this.canvas.height / 2);
          g.drawImage(this.canvas, 0, 0);
          setContextSize(this.g, canv.width, canv.height);
        } else {
          console.warn("Couldn't rotate the TextImage");
        }
        this.g.drawImage(canv, 0, 0);
      }
      return true;
    } else {
      return false;
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/strings/stringRandom.ts
var DEFAULT_CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
function stringRandom(length, charSet) {
  if (length < 0) {
    throw new Error("Length must be greater than 0");
  }
  if (isNullOrUndefined(charSet)) {
    charSet = DEFAULT_CHAR_SET;
  }
  let str = "";
  for (let i = 0; i < length; ++i) {
    const idx = Math.floor(Math.random() * charSet.length);
    str += charSet[idx];
  }
  return str;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/graphics2d/animation/tween.ts
function bump(t2, k) {
  const a = t2 * Math.PI;
  return 0.5 * (1 - Math.cos(a)) - k * Math.sin(2 * a);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/animation/scaleOnHover.ts
var scaledItems = singleton("Juniper:ScaledItems", () => /* @__PURE__ */ new Map());
var start = 1;
var end = 1.1;
var ScaleState = class {
  constructor(target) {
    this.target = target;
    this.obj = objectResolve(this.target);
    this.base = this.obj.scale.clone();
    this.p = 0;
    this.dir = 0;
    this.running = false;
    this.wasDisabled = this.disabled;
    this.target.addScopedEventListener(this, "enter", () => this.run(1));
    this.target.addScopedEventListener(this, "exit", () => this.run(-1));
    this.obj.traverse((child) => {
      if (isMesh(child)) {
        this.target.addMesh(child);
      }
    });
  }
  get disabled() {
    return this.target.disabled;
  }
  run(d) {
    if (!this.disabled || (d === -1 || this.p > 0)) {
      this.dir = d;
      this.running = true;
    }
  }
  updateScaling(dt) {
    if (this.disabled !== this.wasDisabled) {
      this.wasDisabled = this.disabled;
      if (this.disabled) {
        this.run(-1);
      }
    }
    if (this.running) {
      this.p += this.dir * dt;
      if (this.dir > 0 && this.p >= 1 || this.dir < 0 && this.p < 0) {
        this.p = Math.max(0, Math.min(1, this.p));
        this.running = false;
      }
      const q = bump(this.p, 1.1);
      this.obj.scale.copy(this.base).multiplyScalar(q * (end - start) + start);
    }
  }
  dispose() {
    this.target.removeScope(this);
  }
};
function removeScaledObj(obj2) {
  const state = scaledItems.get(obj2);
  if (state) {
    scaledItems.delete(obj2);
    state.dispose();
  }
}
function scaleOnHover(target, enabled) {
  const has = scaledItems.has(target);
  if (enabled != has) {
    if (enabled) {
      scaledItems.set(target, new ScaleState(target));
      ;
    } else {
      const scaler = scaledItems.get(target);
      scaler.dispose();
      scaledItems.delete(target);
    }
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/RayTarget.ts
var RAY_TARGET_KEY = "Juniper:ThreeJS:EventSystem:RayTarget";
var RayTarget = class extends TypedEventBase {
  constructor(object) {
    super();
    this.object = object;
    this.meshes = new Array();
    this._disabled = false;
    this._clickable = false;
    this._draggable = false;
    this._navigable = false;
    this.object.userData[RAY_TARGET_KEY] = this;
  }
  addMesh(mesh2) {
    mesh2.userData[RAY_TARGET_KEY] = this;
    this.meshes.push(mesh2);
    return this;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(v) {
    this._disabled = v;
  }
  get enabled() {
    return !this.disabled;
  }
  set enabled(v) {
    this.disabled = !v;
  }
  get clickable() {
    return this._clickable;
  }
  set clickable(v) {
    this._clickable = v;
  }
  get draggable() {
    return this._draggable;
  }
  set draggable(v) {
    this._draggable = v;
  }
  get navigable() {
    return this._navigable;
  }
  set navigable(v) {
    this._navigable = v;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayCompare.ts
function arrayCompare(arr1, arr2) {
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return -1;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayScan.ts
function _arrayScan(forward, arr, tests) {
  const start2 = forward ? 0 : arr.length - 1;
  const end2 = forward ? arr.length : -1;
  const inc = forward ? 1 : -1;
  for (const test of tests) {
    for (let i = start2; i != end2; i += inc) {
      const item = arr[i];
      if (test(item)) {
        return item;
      }
    }
  }
  return null;
}
function arrayScan(arr, ...tests) {
  return _arrayScan(true, arr, tests);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/units/length.ts
var MICROMETERS_PER_MILLIMETER = 1e3;
var MILLIMETERS_PER_CENTIMETER = 10;
var CENTIMETERS_PER_INCH = 2.54;
var CENTIMETERS_PER_METER = 100;
var INCHES_PER_HAND = 4;
var HANDS_PER_FOOT = 3;
var FEET_PER_YARD = 3;
var FEET_PER_ROD = 16.5;
var METERS_PER_KILOMETER = 1e3;
var RODS_PER_FURLONG = 40;
var FURLONGS_PER_MILE = 8;
var MICROMETERS_PER_CENTIMETER = MICROMETERS_PER_MILLIMETER * MILLIMETERS_PER_CENTIMETER;
var MICROMETERS_PER_INCH = MICROMETERS_PER_CENTIMETER * CENTIMETERS_PER_INCH;
var MICROMETERS_PER_HAND = MICROMETERS_PER_INCH * INCHES_PER_HAND;
var MICROMETERS_PER_FOOT = MICROMETERS_PER_HAND * HANDS_PER_FOOT;
var MICROMETERS_PER_YARD = MICROMETERS_PER_FOOT * FEET_PER_YARD;
var MICROMETERS_PER_METER = MICROMETERS_PER_CENTIMETER * CENTIMETERS_PER_METER;
var MICROMETERS_PER_ROD = MICROMETERS_PER_FOOT * FEET_PER_ROD;
var MICROMETERS_PER_FURLONG = MICROMETERS_PER_ROD * RODS_PER_FURLONG;
var MICROMETERS_PER_KILOMETER = MICROMETERS_PER_METER * METERS_PER_KILOMETER;
var MICROMETERS_PER_MILE = MICROMETERS_PER_FURLONG * FURLONGS_PER_MILE;
var MILLIMETERS_PER_INCH = MILLIMETERS_PER_CENTIMETER * CENTIMETERS_PER_INCH;
var MILLIMETERS_PER_HAND = MILLIMETERS_PER_INCH * INCHES_PER_HAND;
var MILLIMETERS_PER_FOOT = MILLIMETERS_PER_HAND * HANDS_PER_FOOT;
var MILLIMETERS_PER_YARD = MILLIMETERS_PER_FOOT * FEET_PER_YARD;
var MILLIMETERS_PER_METER = MILLIMETERS_PER_CENTIMETER * CENTIMETERS_PER_METER;
var MILLIMETERS_PER_ROD = MILLIMETERS_PER_FOOT * FEET_PER_ROD;
var MILLIMETERS_PER_FURLONG = MILLIMETERS_PER_ROD * RODS_PER_FURLONG;
var MILLIMETERS_PER_KILOMETER = MILLIMETERS_PER_METER * METERS_PER_KILOMETER;
var MILLIMETERS_PER_MILE = MILLIMETERS_PER_FURLONG * FURLONGS_PER_MILE;
var CENTIMETERS_PER_HAND = CENTIMETERS_PER_INCH * INCHES_PER_HAND;
var CENTIMETERS_PER_FOOT = CENTIMETERS_PER_HAND * HANDS_PER_FOOT;
var CENTIMETERS_PER_YARD = CENTIMETERS_PER_FOOT * FEET_PER_YARD;
var CENTIMETERS_PER_ROD = CENTIMETERS_PER_FOOT * FEET_PER_ROD;
var CENTIMETERS_PER_FURLONG = CENTIMETERS_PER_ROD * RODS_PER_FURLONG;
var CENTIMETERS_PER_KILOMETER = CENTIMETERS_PER_METER * METERS_PER_KILOMETER;
var CENTIMETERS_PER_MILE = CENTIMETERS_PER_FURLONG * FURLONGS_PER_MILE;
var INCHES_PER_FOOT = INCHES_PER_HAND * HANDS_PER_FOOT;
var INCHES_PER_YARD = INCHES_PER_FOOT * FEET_PER_YARD;
var INCHES_PER_METER = CENTIMETERS_PER_METER / CENTIMETERS_PER_INCH;
var INCHES_PER_ROD = INCHES_PER_FOOT * FEET_PER_ROD;
var INCHES_PER_FURLONG = INCHES_PER_ROD * RODS_PER_FURLONG;
var INCHES_PER_KILOMETER = INCHES_PER_METER * METERS_PER_KILOMETER;
var INCHES_PER_MILE = INCHES_PER_FURLONG * FURLONGS_PER_MILE;
var HANDS_PER_YARD = HANDS_PER_FOOT * FEET_PER_YARD;
var HANDS_PER_METER = CENTIMETERS_PER_METER / CENTIMETERS_PER_HAND;
var HANDS_PER_ROD = HANDS_PER_FOOT * FEET_PER_ROD;
var HANDS_PER_FURLONG = HANDS_PER_ROD * RODS_PER_FURLONG;
var HANDS_PER_KILOMETER = HANDS_PER_METER * METERS_PER_KILOMETER;
var HANDS_PER_MILE = HANDS_PER_FURLONG * FURLONGS_PER_MILE;
var FEET_PER_METER = INCHES_PER_METER / INCHES_PER_FOOT;
var FEET_PER_FURLONG = FEET_PER_ROD * RODS_PER_FURLONG;
var FEET_PER_KILOMETER = FEET_PER_METER * METERS_PER_KILOMETER;
var FEET_PER_MILE = FEET_PER_FURLONG * FURLONGS_PER_MILE;
var YARDS_PER_METER = INCHES_PER_METER / INCHES_PER_YARD;
var YARDS_PER_ROD = FEET_PER_ROD / FEET_PER_YARD;
var YARDS_PER_FURLONG = YARDS_PER_ROD * RODS_PER_FURLONG;
var YARDS_PER_KILOMETER = YARDS_PER_METER * METERS_PER_KILOMETER;
var YARDS_PER_MILE = YARDS_PER_FURLONG * FURLONGS_PER_MILE;
var METERS_PER_ROD = FEET_PER_ROD / FEET_PER_METER;
var METERS_PER_FURLONG = METERS_PER_ROD * RODS_PER_FURLONG;
var METERS_PER_MILE = METERS_PER_FURLONG * FURLONGS_PER_MILE;
var RODS_PER_KILOMETER = METERS_PER_KILOMETER / METERS_PER_ROD;
var RODS_PER_MILE = RODS_PER_FURLONG * FURLONGS_PER_MILE;
var FURLONGS_PER_KILOMETER = METERS_PER_KILOMETER / METERS_PER_FURLONG;
var KILOMETERS_PER_MILE = FURLONGS_PER_MILE / FURLONGS_PER_KILOMETER;
function inches2Meters(inches) {
  return inches / INCHES_PER_METER;
}
function meters2Inches(meters) {
  return meters * INCHES_PER_METER;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/using.ts
function interfaceSigCheck(obj2, ...funcNames) {
  if (!isObject(obj2)) {
    return false;
  }
  obj2 = obj2;
  for (const funcName of funcNames) {
    if (!(funcName in obj2)) {
      return false;
    }
    const func = obj2[funcName];
    if (!isFunction(func)) {
      return false;
    }
  }
  return true;
}
function isDisposable(obj2) {
  return interfaceSigCheck(obj2, "dispose");
}
function isDestroyable(obj2) {
  return interfaceSigCheck(obj2, "destroy");
}
function isClosable(obj2) {
  return interfaceSigCheck(obj2, "close");
}
function dispose(val) {
  if (isDisposable(val)) {
    val.dispose();
  }
  if (isClosable(val)) {
    val.close();
  }
  if (isDestroyable(val)) {
    val.destroy();
  }
}
function using(val, thunk) {
  try {
    return thunk(val);
  } finally {
    dispose(val);
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/cleanup.ts
function cleanup(obj2) {
  const cleanupQ = new Array();
  const cleanupSeen = /* @__PURE__ */ new Set();
  cleanupQ.push(obj2);
  while (cleanupQ.length > 0) {
    const here = cleanupQ.shift();
    if (here && !cleanupSeen.has(here)) {
      cleanupSeen.add(here);
      if (here.isMesh) {
        cleanupQ.push(
          here.material,
          here.geometry
        );
      }
      if (here.isMaterial) {
        cleanupQ.push(...Object.values(here));
      }
      if (here.isObject3D) {
        cleanupQ.push(...here.children);
        here.clear();
        removeScaledObj(here);
      }
      if (isArray(here)) {
        cleanupQ.push(...here);
      }
      dispose(here);
    }
  }
  cleanupSeen.clear();
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/lines/LineMaterial.js
UniformsLib.line = {
  worldUnits: { value: 1 },
  linewidth: { value: 1 },
  resolution: { value: new Vector2(1, 1) },
  dashOffset: { value: 0 },
  dashScale: { value: 1 },
  dashSize: { value: 1 },
  gapSize: { value: 1 }
};
ShaderLib["line"] = {
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    UniformsLib.fog,
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

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

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
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

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
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				// get the offset direction as perpendicular to the view vector
				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 offset;
				if ( position.y < 0.5 ) {

					offset = normalize( cross( start.xyz, worldDir ) );

				} else {

					offset = normalize( cross( end.xyz, worldDir ) );

				}

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// extend the line bounds to encompass  endcaps
					start.xyz += - worldDir * linewidth * 0.5;
					end.xyz += worldDir * linewidth * 0.5;

					// shift the position of the quad so it hugs the forward edge of the line
					offset.xy -= dir * forwardOffset;
					offset.z += 0.5;

				#endif

				// endcaps
				if ( position.y > 1.0 || position.y < 0.0 ) {

					offset.xy += dir * 2.0 * forwardOffset;

				}

				// adjust for linewidth
				offset *= linewidth * 0.5;

				// set the world position
				worldPos = ( position.y < 0.5 ) ? start : end;
				worldPos.xyz += offset;

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segements overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

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

			#endif

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
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`
};
var LineMaterial = class extends ShaderMaterial {
  constructor(parameters) {
    super({
      type: "LineMaterial",
      uniforms: UniformsUtils.clone(ShaderLib["line"].uniforms),
      vertexShader: ShaderLib["line"].vertexShader,
      fragmentShader: ShaderLib["line"].fragmentShader,
      clipping: true
    });
    Object.defineProperties(this, {
      color: {
        enumerable: true,
        get: function() {
          return this.uniforms.diffuse.value;
        },
        set: function(value) {
          this.uniforms.diffuse.value = value;
        }
      },
      worldUnits: {
        enumerable: true,
        get: function() {
          return "WORLD_UNITS" in this.defines;
        },
        set: function(value) {
          if (value === true) {
            this.defines.WORLD_UNITS = "";
          } else {
            delete this.defines.WORLD_UNITS;
          }
        }
      },
      linewidth: {
        enumerable: true,
        get: function() {
          return this.uniforms.linewidth.value;
        },
        set: function(value) {
          this.uniforms.linewidth.value = value;
        }
      },
      dashed: {
        enumerable: true,
        get: function() {
          return Boolean("USE_DASH" in this.defines);
        },
        set(value) {
          if (Boolean(value) !== Boolean("USE_DASH" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_DASH = "";
          } else {
            delete this.defines.USE_DASH;
          }
        }
      },
      dashScale: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashScale.value;
        },
        set: function(value) {
          this.uniforms.dashScale.value = value;
        }
      },
      dashSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashSize.value;
        },
        set: function(value) {
          this.uniforms.dashSize.value = value;
        }
      },
      dashOffset: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashOffset.value;
        },
        set: function(value) {
          this.uniforms.dashOffset.value = value;
        }
      },
      gapSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.gapSize.value;
        },
        set: function(value) {
          this.uniforms.gapSize.value = value;
        }
      },
      opacity: {
        enumerable: true,
        get: function() {
          return this.uniforms.opacity.value;
        },
        set: function(value) {
          this.uniforms.opacity.value = value;
        }
      },
      resolution: {
        enumerable: true,
        get: function() {
          return this.uniforms.resolution.value;
        },
        set: function(value) {
          this.uniforms.resolution.value.copy(value);
        }
      },
      alphaToCoverage: {
        enumerable: true,
        get: function() {
          return Boolean("USE_ALPHA_TO_COVERAGE" in this.defines);
        },
        set: function(value) {
          if (Boolean(value) !== Boolean("USE_ALPHA_TO_COVERAGE" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_ALPHA_TO_COVERAGE = "";
            this.extensions.derivatives = true;
          } else {
            delete this.defines.USE_ALPHA_TO_COVERAGE;
            this.extensions.derivatives = false;
          }
        }
      }
    });
    this.setValues(parameters);
  }
};
LineMaterial.prototype.isLineMaterial = true;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/materials.ts
var materials = singleton("Juniper:Three:Materials", () => /* @__PURE__ */ new Map());
function del(obj2, name) {
  if (name in obj2) {
    delete obj2[name];
  }
}
function makeMaterial(slug, material, options) {
  const key = `${slug}_${Object.keys(options).map((k) => `${k}:${options[k]}`).join(",")}`;
  if (!materials.has(key)) {
    del(options, "name");
    materials.set(key, new material(options));
  }
  return materials.get(key);
}
function trans(options) {
  return Object.assign(options, {
    transparent: true
  });
}
function solidTransparent(options) {
  return makeMaterial("solidTransparent", MeshBasicMaterial, trans(options));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/objectGetRelativePose.ts
var M = new Matrix4();
var P = new Vector3();
function objectGetRelativePose(ref, obj2, position, quaternion, scale) {
  M.copy(ref.matrixWorld).invert().multiply(obj2.matrixWorld).decompose(P, quaternion, scale);
  position.set(P.x, P.y, P.z, 1);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/Plane.ts
var plane = /* @__PURE__ */ new PlaneBufferGeometry(1, 1, 1, 1);
plane.name = "PlaneGeom";

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/widgets/Image2D.ts
var P2 = new Vector4();
var Q = new Quaternion();
var S = new Vector3();
var copyCounter = 0;
var Image2D = class extends Object3D {
  constructor(env, name, webXRLayerType, materialOrOptions = null) {
    super();
    this.webXRLayerType = webXRLayerType;
    this.lastMatrixWorld = new Matrix4();
    this.layer = null;
    this.wasUsingLayer = false;
    this._imageWidth = 0;
    this._imageHeight = 0;
    this.curImage = null;
    this.lastImage = null;
    this.lastWidth = null;
    this.lastHeight = null;
    this.env = null;
    this.mesh = null;
    this.stereoLayoutName = "mono";
    this.sizeMode = "none";
    this.onTick = (evt) => this.checkWebXRLayer(evt.frame);
    if (env) {
      this.setEnvAndName(env, name);
      let material = isMeshBasicMaterial(materialOrOptions) ? materialOrOptions : solidTransparent(Object.assign(
        {},
        materialOrOptions,
        { name: this.name }
      ));
      objGraph(
        this,
        this.mesh = mesh(name + "-Mesh", plane, material)
      );
    }
  }
  copy(source, recursive = true) {
    super.copy(source, recursive);
    this.webXRLayerType = source.webXRLayerType;
    this.setImageSize(source.imageWidth, source.imageHeight);
    this.setEnvAndName(source.env, source.name + ++copyCounter);
    this.mesh = arrayScan(this.children, isMesh);
    if (isNullOrUndefined(this.mesh)) {
      this.mesh = source.mesh.clone();
      objGraph(this, this.mesh);
    }
    this.setTextureMap(source.curImage);
    return this;
  }
  dispose() {
    this.env.timer.removeTickHandler(this.onTick);
    this.disposeImage();
    cleanup(this.mesh);
  }
  disposeImage() {
    this.removeWebXRLayer();
    cleanup(this.mesh.material.map);
    this.curImage = null;
  }
  setImageSize(width, height) {
    if (width !== this.imageWidth || height !== this.imageHeight) {
      const { objectWidth, objectHeight } = this;
      this._imageWidth = width;
      this._imageHeight = height;
      if (this.sizeMode !== "none") {
        if (this.sizeMode === "fixed-width") {
          this.objectWidth = objectWidth;
        } else {
          this.objectHeight = objectHeight;
        }
      }
    }
  }
  get imageWidth() {
    return this._imageWidth;
  }
  get imageHeight() {
    return this._imageHeight;
  }
  get imageAspectRatio() {
    return this.imageWidth / this.imageHeight;
  }
  get objectWidth() {
    return this.scale.x;
  }
  set objectWidth(v) {
    this.scale.set(v, this.scale.y = v / this.imageAspectRatio, 1);
  }
  get objectHeight() {
    return this.scale.y;
  }
  set objectHeight(v) {
    this.scale.set(this.imageAspectRatio * v, v, 1);
  }
  get pixelDensity() {
    const inches = meters2Inches(this.objectWidth);
    const ppi = this.imageWidth / inches;
    return ppi;
  }
  set pixelDensity(ppi) {
    const inches = this.imageWidth / ppi;
    const meters = inches2Meters(inches);
    this.objectWidth = meters;
  }
  setEnvAndName(env, name) {
    this.env = env;
    this.name = name;
    this.env.timer.addTickHandler(this.onTick);
  }
  get needsLayer() {
    if (!objectIsFullyVisible(this) || isNullOrUndefined(this.mesh.material.map) || isNullOrUndefined(this.curImage)) {
      return false;
    }
    if (!(this.curImage instanceof HTMLVideoElement)) {
      return true;
    }
    return !this.curImage.paused || this.curImage.currentTime > 0;
  }
  removeWebXRLayer() {
    if (isDefined(this.layer)) {
      this.wasUsingLayer = false;
      this.env.removeWebXRLayer(this.layer);
      this.mesh.visible = true;
      const layer = this.layer;
      this.layer = null;
      setTimeout(() => layer.destroy(), 100);
    }
  }
  setTextureMap(img) {
    if (this.curImage) {
      this.disposeImage();
    }
    if (img) {
      if (isImageBitmap(img)) {
        img = createUtilityCanvasFromImageBitmap(img);
      } else if (isImageData(img)) {
        img = createUtilityCanvasFromImageData(img);
      }
      if (isOffscreenCanvas(img)) {
        img = img;
      }
      this.curImage = img;
      if (img instanceof HTMLVideoElement) {
        this.setImageSize(img.videoWidth, img.videoHeight);
        this.mesh.material.map = new VideoTexture(img);
      } else {
        this.setImageSize(img.width, img.height);
        this.mesh.material.map = new Texture(img);
        this.mesh.material.map.needsUpdate = true;
      }
    }
    this.mesh.material.needsUpdate = true;
  }
  get isVideo() {
    return this.curImage instanceof HTMLVideoElement;
  }
  updateTexture() {
    if (isDefined(this.curImage)) {
      const curVideo = this.curImage;
      const newWidth = this.isVideo ? curVideo.videoWidth : this.curImage.width;
      const newHeight = this.isVideo ? curVideo.videoHeight : this.curImage.height;
      if (this.imageWidth !== newWidth || this.imageHeight !== newHeight) {
        const img = this.curImage;
        this.disposeImage();
        this.setTextureMap(img);
      }
    }
  }
  checkWebXRLayer(frame) {
    if (this.mesh.material.map && this.curImage) {
      const isLayersAvailable = this.webXRLayerType !== "none" && this.env.hasXRCompositionLayers && this.env.showWebXRLayers && isDefined(frame) && (this.isVideo && isDefined(this.env.xrMediaBinding) || !this.isVideo && isDefined(this.env.xrBinding));
      const useLayer = isLayersAvailable && this.needsLayer;
      const useLayerChanged = useLayer !== this.wasUsingLayer;
      const imageChanged = this.curImage !== this.lastImage || this.mesh.material.needsUpdate || this.mesh.material.map.needsUpdate;
      const sizeChanged = this.imageWidth !== this.lastWidth || this.imageHeight !== this.lastHeight;
      this.wasUsingLayer = useLayer;
      this.lastImage = this.curImage;
      this.lastWidth = this.imageWidth;
      this.lastHeight = this.imageHeight;
      if (useLayerChanged || sizeChanged) {
        if ((!useLayer || sizeChanged) && this.layer) {
          this.removeWebXRLayer();
        }
        if (useLayer) {
          const space = this.env.referenceSpace;
          objectGetRelativePose(this.env.stage, this.mesh, P2, Q, S);
          this.lastMatrixWorld.copy(this.matrixWorld);
          const transform = new XRRigidTransform(P2, Q);
          const width = S.x / 2;
          const height = S.y / 2;
          const layout = this.stereoLayoutName === "mono" ? "mono" : this.stereoLayoutName === "left-right" || this.stereoLayoutName === "right-left" ? "stereo-left-right" : "stereo-top-bottom";
          if (this.isVideo) {
            const invertStereo = this.stereoLayoutName === "right-left" || this.stereoLayoutName === "bottom-top";
            this.layer = this.env.xrMediaBinding.createQuadLayer(this.curImage, {
              space,
              layout,
              invertStereo,
              transform,
              width,
              height
            });
          } else {
            this.layer = this.env.xrBinding.createQuadLayer({
              space,
              layout,
              textureType: "texture",
              isStatic: this.webXRLayerType === "static",
              viewPixelWidth: this.curImage.width,
              viewPixelHeight: this.curImage.height,
              transform,
              width,
              height
            });
          }
          this.env.addWebXRLayer(this.layer, 500);
          this.mesh.visible = false;
        }
      }
      if (this.layer) {
        if (imageChanged || this.layer.needsRedraw) {
          const gl = this.env.gl;
          const gLayer = this.env.xrBinding.getSubImage(this.layer, frame);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.bindTexture(gl.TEXTURE_2D, gLayer.colorTexture);
          gl.texSubImage2D(
            gl.TEXTURE_2D,
            0,
            0,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.curImage
          );
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.bindTexture(gl.TEXTURE_2D, null);
        }
        if (arrayCompare(this.matrixWorld.elements, this.lastMatrixWorld.elements) >= 0) {
          objectGetRelativePose(this.env.stage, this.mesh, P2, Q, S);
          this.lastMatrixWorld.copy(this.matrixWorld);
          this.layer.transform = new XRRigidTransform(P2, Q);
          this.layer.width = S.x / 2;
          this.layer.height = S.y / 2;
        }
      }
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/widgets/CanvasImageMesh.ts
var redrawnEvt = { type: "redrawn" };
var CanvasImageMesh = class extends Image2D {
  constructor(env, name, webXRLayerType, image2, materialOptions) {
    super(env, name, webXRLayerType, materialOptions);
    this._image = null;
    this.image = image2;
  }
  get object() {
    return this;
  }
  get element() {
    if (isHTMLCanvas(this.image.canvas)) {
      return this.image.canvas;
    } else {
      return null;
    }
  }
  onRedrawn() {
    this.updateTexture();
    this.dispatchEvent(redrawnEvt);
  }
  get image() {
    return this._image;
  }
  set image(v) {
    if (this.image) {
      this.image.removeScope(this);
    }
    this._image = v;
    if (this.image) {
      this.image.addScopedEventListener(this, "redrawn", () => this.onRedrawn());
      this.setTextureMap(this.image.canvas);
      this.onRedrawn();
    }
  }
  get imageWidth() {
    return this.image.width;
  }
  get imageHeight() {
    return this.image.height;
  }
  copy(source, recursive = true) {
    super.copy(source, recursive);
    this.image = source.image;
    return this;
  }
  get isVisible() {
    return elementIsDisplayed(this);
  }
  set isVisible(v) {
    elementSetDisplay(this, v, "inline-block");
    objectSetVisible(this, v);
    objectSetVisible(this.mesh, v);
    this.image.visible = v;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/widgets/TextMesh.ts
var TextMesh = class extends CanvasImageMesh {
  constructor(env, name, textOptions, materialOptions) {
    let image2;
    if (textOptions instanceof TextImage) {
      image2 = textOptions;
    } else {
      image2 = new TextImage(textOptions);
    }
    super(env, name, "none", image2, materialOptions);
  }
  onRedrawn() {
    this.objectHeight = this.imageHeight;
    super.onRedrawn();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/widgets/TextMeshButton.ts
var TextMeshButton = class extends RayTarget {
  constructor(env, name, value, textImageOptions) {
    super(obj(name));
    this.env = env;
    if (isDefined(value)) {
      textImageOptions = Object.assign({
        textFillColor: "#ffffff",
        fontFamily: "Segoe UI Emoji",
        fontSize: 20,
        minHeight: 0.25,
        maxHeight: 0.25
      }, textImageOptions, {
        value
      });
      this.image = new TextImage(textImageOptions);
      const id2 = stringRandom(16);
      this.enabledImage = this.createImage(`${id2}-enabled`, 1);
      this.disabledImage = this.createImage(`${id2}-disabled`, 0.5);
      this.disabledImage.visible = false;
      objGraph(this, this.enabledImage, this.disabledImage);
    }
    this.addMesh(this.enabledImage.mesh);
    this.addMesh(this.disabledImage.mesh);
    this.clickable = true;
    if (isDefined(value)) {
      scaleOnHover(this, true);
    }
  }
  createImage(id2, opacity) {
    const image2 = new TextMesh(
      this.env,
      `text-${id2}`,
      this.image,
      {
        side: FrontSide,
        opacity
      }
    );
    return image2;
  }
  get disabled() {
    return super.disabled;
  }
  set disabled(v) {
    super.disabled = v;
    this.enabledImage.visible = !v;
    this.disabledImage.visible = v;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/util.ts
var typePattern = /([^\/]+)\/(.+)/;
var subTypePattern = /(?:([^\.]+)\.)?([^\+;]+)(?:\+([^;]+))?((?:; *([^=]+)=([^;]+))*)/;
var MediaType = class {
  constructor(_type, _fullSubType, extensions) {
    this._type = _type;
    this._fullSubType = _fullSubType;
    this._primaryExtension = null;
    this.depMessage = null;
    const parameters = /* @__PURE__ */ new Map();
    this._parameters = parameters;
    const subTypeParts = this._fullSubType.match(subTypePattern);
    this._tree = subTypeParts[1];
    this._subType = subTypeParts[2];
    this._suffix = subTypeParts[3];
    const paramStr = subTypeParts[4];
    this._value = this._fullValue = this._type + "/";
    if (isDefined(this._tree)) {
      this._value = this._fullValue += this._tree + ".";
    }
    this._value = this._fullValue += this._subType;
    if (isDefined(this._suffix)) {
      this._value = this._fullValue += "+" + this._suffix;
    }
    if (isDefined(paramStr)) {
      const pairs = paramStr.split(";").map((p) => p.trim()).filter((p) => p.length > 0).map((p) => p.split("="));
      for (const [key, ...values] of pairs) {
        const value = values.join("=");
        parameters.set(key, value);
        const slug = `; ${key}=${value}`;
        this._fullValue += slug;
        if (key !== "q") {
          this._value += slug;
        }
      }
    }
    this._extensions = extensions || [];
    this._primaryExtension = this._extensions[0] || null;
  }
  static parse(value) {
    if (!value) {
      return null;
    }
    const match = value.match(typePattern);
    if (!match) {
      return null;
    }
    const type2 = match[1];
    const subType = match[2];
    return new MediaType(type2, subType);
  }
  deprecate(message) {
    this.depMessage = message;
    return this;
  }
  check() {
    if (isDefined(this.depMessage)) {
      console.warn(`${this._value} is deprecated ${this.depMessage}`);
    }
  }
  matches(value) {
    if (isNullOrUndefined(value)) {
      return false;
    }
    if (this.typeName === "*" && this.subTypeName === "*") {
      return true;
    }
    let typeName = null;
    let subTypeName = null;
    if (isString(value)) {
      const match = value.match(typePattern);
      if (!match) {
        return false;
      }
      typeName = match[1];
      subTypeName = match[2];
    } else {
      typeName = value.typeName;
      subTypeName = value._fullSubType;
    }
    return this.typeName === typeName && (this._fullSubType === "*" || this._fullSubType === subTypeName);
  }
  withParameter(key, value) {
    const newSubType = `${this._fullSubType}; ${key}=${value}`;
    return new MediaType(this.typeName, newSubType, this.extensions);
  }
  get typeName() {
    this.check();
    return this._type;
  }
  get tree() {
    this.check();
    return this._tree;
  }
  get suffix() {
    return this._suffix;
  }
  get subTypeName() {
    this.check();
    return this._subType;
  }
  get value() {
    this.check();
    return this._value;
  }
  __getValueUnsafe() {
    return this._value;
  }
  get fullValue() {
    this.check();
    return this._fullValue;
  }
  get parameters() {
    this.check();
    return this._parameters;
  }
  get extensions() {
    this.check();
    return this._extensions;
  }
  __getExtensionsUnsafe() {
    return this._extensions;
  }
  get primaryExtension() {
    this.check();
    return this._primaryExtension;
  }
  toString() {
    if (this.parameters.get("q") === "1") {
      return this.value;
    } else {
      return this.fullValue;
    }
  }
  addExtension(fileName) {
    if (!fileName) {
      throw new Error("File name is not defined");
    }
    if (this.primaryExtension) {
      const idx = fileName.lastIndexOf(".");
      if (idx > -1) {
        const currentExtension = fileName.substring(idx + 1);
        ;
        if (this.extensions.indexOf(currentExtension) > -1) {
          fileName = fileName.substring(0, idx);
        }
      }
      fileName = `${fileName}.${this.primaryExtension}`;
    }
    return fileName;
  }
};
function create(group, value, ...extensions) {
  return new MediaType(group, value, extensions);
}
function specialize(group) {
  return create.bind(null, group);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/application.ts
var application = /* @__PURE__ */ specialize("application");
var Application_Javascript = /* @__PURE__ */ application("javascript", "js");
var Application_Json = /* @__PURE__ */ application("json", "json");
var Application_Wasm = /* @__PURE__ */ application("wasm", "wasm");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/image.ts
var image = /* @__PURE__ */ specialize("image");
var Image_Jpeg = /* @__PURE__ */ image("jpeg", "jpeg", "jpg", "jpe");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/text.ts
var text = /* @__PURE__ */ specialize("text");
var Text_Plain = /* @__PURE__ */ text("plain", "txt", "text", "conf", "def", "list", "log", "in");
var Text_Xml = /* @__PURE__ */ text("xml");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapInvert.ts
function mapInvert(map) {
  const mapOut = /* @__PURE__ */ new Map();
  for (const [key, value] of map) {
    mapOut.set(value, key);
  }
  return mapOut;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/units/fileSize.ts
function isBase2Units(label) {
  return label !== "B" && label[1] === "i";
}
function isBase10Units(label) {
  return label !== "B" && !isBase10Units(label);
}
var base2Labels = /* @__PURE__ */ new Map([
  [1, "KiB"],
  [2, "MiB"],
  [3, "GiB"],
  [4, "TiB"]
]);
var base10Labels = /* @__PURE__ */ new Map([
  [1, "KB"],
  [2, "MB"],
  [3, "GB"],
  [4, "TB"]
]);
var base2Sizes = /* @__PURE__ */ mapInvert(base2Labels);
var base10Sizes = /* @__PURE__ */ mapInvert(base10Labels);
function toBytes(value, units) {
  if (units === "B") {
    return value;
  } else {
    let systemBase;
    let size;
    if (isBase2Units(units)) {
      systemBase = 1024;
      size = base2Sizes.get(units);
    } else if (isBase10Units(units)) {
      systemBase = 1e3;
      size = base10Sizes.get(units);
    } else {
      assertNever(units);
    }
    const multiplier = Math.pow(systemBase, size);
    return value * multiplier;
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/BaseProgress.ts
var BaseProgress = class extends TypedEventBase {
  constructor() {
    super(...arguments);
    this.attached = new Array();
    this.soFar = null;
    this.total = null;
    this.msg = null;
    this.est = null;
  }
  get p() {
    return this.total > 0 ? this.soFar / this.total : 0;
  }
  report(soFar, total, msg, est) {
    this.soFar = soFar;
    this.total = total;
    this.msg = msg;
    this.est = est;
    for (const attach of this.attached) {
      attach.report(soFar, total, msg, est);
    }
  }
  attach(prog) {
    this.attached.push(prog);
    prog.report(this.soFar, this.total, this.msg, this.est);
  }
  clear() {
    this.report(0, 0);
    this._clear();
  }
  start(msg) {
    this.report(0, 1, msg || "starting");
  }
  end(msg) {
    this.report(1, 1, msg || "done");
    this._clear();
  }
  _clear() {
    this.soFar = null;
    this.total = null;
    this.msg = null;
    this.est = null;
    arrayClear(this.attached);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/ChildProgressCallback.ts
var ChildProgressCallback = class extends BaseProgress {
  constructor(i, prog) {
    super();
    this.i = i;
    this.prog = prog;
  }
  report(soFar, total, msg, est) {
    super.report(soFar, total, msg, est);
    this.prog.update(this.i, soFar, total, msg);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/BaseParentProgressCallback.ts
var BaseParentProgressCallback = class {
  constructor(prog) {
    this.prog = prog;
    this.weightTotal = 0;
    this.subProgressCallbacks = new Array();
    this.subProgressWeights = new Array();
    this.subProgressValues = new Array();
    this.start = performance.now();
    for (let i = 0; i < this.subProgressWeights.length; ++i) {
      this.subProgressValues[i] = 0;
      this.subProgressCallbacks[i] = new ChildProgressCallback(i, this);
    }
  }
  addSubProgress(weight) {
    weight = weight || 1;
    this.weightTotal += weight;
    this.subProgressWeights.push(weight);
    this.subProgressValues.push(0);
    const child = new ChildProgressCallback(this.subProgressCallbacks.length, this);
    this.subProgressCallbacks.push(child);
    return child;
  }
  update(i, subSoFar, subTotal, msg) {
    if (this.prog) {
      this.subProgressValues[i] = subSoFar / subTotal;
      let soFar = 0;
      for (let j = 0; j < this.subProgressWeights.length; ++j) {
        soFar += this.subProgressValues[j] * this.subProgressWeights[j];
      }
      const end2 = performance.now();
      const delta = end2 - this.start;
      const est = this.start - end2 + delta * this.weightTotal / soFar;
      this.prog.report(soFar, this.weightTotal, msg, est);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/progressSplit.ts
function progressSplitWeighted(prog, subProgressWeights) {
  const subProg = new WeightedParentProgressCallback(subProgressWeights, prog);
  return subProg.subProgressCallbacks;
}
function progressSplit(prog, taskCount) {
  const subProgressWeights = new Array(taskCount);
  for (let i = 0; i < taskCount; ++i) {
    subProgressWeights[i] = 1;
  }
  return progressSplitWeighted(prog, subProgressWeights);
}
var WeightedParentProgressCallback = class extends BaseParentProgressCallback {
  constructor(subProgressWeights, prog) {
    super(prog);
    for (const weight of subProgressWeights) {
      this.addSubProgress(weight);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/progressTasks.ts
async function progressTasksWeighted(prog, taskDefs) {
  const weights = new Array(taskDefs.length);
  const callbacks = new Array(taskDefs.length);
  for (let i = 0; i < taskDefs.length; ++i) {
    const taskDef = taskDefs[i];
    weights[i] = taskDef[0];
    callbacks[i] = taskDef[1];
  }
  const progs = progressSplitWeighted(prog, weights);
  const tasks = new Array(taskDefs.length);
  for (let i = 0; i < taskDefs.length; ++i) {
    tasks[i] = callbacks[i](progs[i]);
  }
  return await Promise.all(tasks);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/waitFor.ts
function waitFor(test) {
  const task = new Task(test);
  const handle = setInterval(() => {
    if (test()) {
      clearInterval(handle);
      task.resolve();
    }
  }, 100);
  return task;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/translateResponse.ts
async function translateResponse(response, translate) {
  const {
    status,
    path,
    content,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
  return {
    status,
    path,
    content: await translate(content),
    contentType,
    contentLength,
    fileName,
    headers,
    date
  };
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/RequestBuilder.ts
var testAudio = null;
function canPlay(type2) {
  if (testAudio === null) {
    testAudio = new Audio();
  }
  return testAudio.canPlayType(type2) !== "";
}
var RequestBuilder = class {
  constructor(fetcher, useFileBlobsForModules, method, path) {
    this.fetcher = fetcher;
    this.useFileBlobsForModules = useFileBlobsForModules;
    this.method = method;
    this.prog = null;
    this.path = path;
    this.request = {
      method,
      path: this.path.href,
      body: null,
      headers: null,
      timeout: null,
      withCredentials: false,
      useCache: false
    };
  }
  query(name, value) {
    this.path.searchParams.set(name, value);
    this.request.path = this.path.href;
    return this;
  }
  header(name, value) {
    if (this.request.headers === null) {
      this.request.headers = /* @__PURE__ */ new Map();
    }
    this.request.headers.set(name.toLowerCase(), value);
    return this;
  }
  headers(headers) {
    for (const [name, value] of headers.entries()) {
      this.header(name, value);
    }
    return this;
  }
  timeout(value) {
    this.request.timeout = value;
    return this;
  }
  progress(prog) {
    this.prog = prog;
    return this;
  }
  body(body, contentType) {
    this.request.body = body;
    this.content(contentType);
    return this;
  }
  withCredentials() {
    this.request.withCredentials = true;
    return this;
  }
  useCache(enabled = true) {
    this.request.useCache = enabled;
    return this;
  }
  media(key, mediaType) {
    if (isDefined(mediaType)) {
      if (!isString(mediaType)) {
        mediaType = mediaType.value;
      }
      this.header(key, mediaType);
    }
  }
  content(contentType) {
    this.media("content-type", contentType);
  }
  accept(acceptType) {
    this.media("accept", acceptType);
    return this;
  }
  blob(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetBlob(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetBlob(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  buffer(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetBuffer(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetBuffer(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  file(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetFile(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetFile(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  text(acceptType) {
    this.accept(acceptType || Text_Plain);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetText(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetText(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  object(acceptType) {
    this.accept(acceptType || Application_Json);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetObject(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetObject(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  xml(acceptType) {
    this.accept(acceptType || Text_Xml);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetXml(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetXml(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  imageBitmap(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetImageBitmap(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetImageBitmap(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  exec() {
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetNothing(this.request, this.prog);
    } else if (this.method === "GET") {
      throw new Exception("GET requests should expect a response type");
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      return this.fetcher.sendNothingGetNothing(this.request);
    } else {
      assertNever(this.method);
    }
  }
  async audioBlob(acceptType) {
    if (isDefined(acceptType)) {
      if (!isString(acceptType)) {
        acceptType = acceptType.value;
      }
      if (!canPlay(acceptType)) {
        throw new Error(`Probably can't play file of type "${acceptType}" at path: ${this.request.path}`);
      }
    }
    const response = await this.blob(acceptType);
    if (canPlay(response.contentType)) {
      return response;
    }
    throw new Error(`Cannot play file of type "${response.contentType}" at path: ${this.request.path}`);
  }
  async audioBuffer(audioCtx, acceptType) {
    return translateResponse(
      await this.audioBlob(acceptType),
      async (blob) => await audioCtx.decodeAudioData(await blob.arrayBuffer())
    );
  }
  async htmlElement(element, resolveEvt, acceptType) {
    const response = await this.file(acceptType);
    const task = once(element, resolveEvt, "error");
    element.src = response.content;
    await task;
    return await translateResponse(response, () => element);
  }
  image(acceptType) {
    return this.htmlElement(
      Img(),
      "load",
      acceptType
    );
  }
  async htmlCanvas(acceptType) {
    if (false) {
      throw new Error("HTMLCanvasElement not supported in Workers.");
    }
    const canvas = createCanvas(1, 1);
    if (this.method === "GET") {
      if (hasOffscreenCanvas) {
        this.accept(acceptType);
        const response = await this.fetcher.drawImageToCanvas(this.request, canvas.transferControlToOffscreen(), this.prog);
        return await translateResponse(response, () => canvas);
      } else {
        const response = await (false ? this.imageBitmap(acceptType) : this.image(acceptType));
        return await translateResponse(response, (img) => {
          canvas.width = img.width;
          canvas.height = img.height;
          drawImageToCanvas(canvas, img);
          dispose(img);
          return canvas;
        });
      }
    } else if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE" || this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  canvas(acceptType) {
    if (hasOffscreenCanvas) {
      return this.offscreenCanvas(acceptType);
    } else {
      return this.htmlCanvas(acceptType);
    }
  }
  async offscreenCanvas(acceptType) {
    if (!hasOffscreenCanvas) {
      throw new Error("This system does not support OffscreenCanvas");
    }
    if (this.method === "GET") {
      const response = await (false ? this.imageBitmap(acceptType) : this.image(acceptType));
      return await translateResponse(response, (img) => {
        const canvas = createOffscreenCanvas(img.width, img.height);
        drawImageToCanvas(canvas, img);
        dispose(img);
        return canvas;
      });
    } else if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE" || this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  audio(autoPlaying, looping, acceptType) {
    return this.htmlElement(
      BackgroundAudio(autoPlaying, false, looping),
      "canplay",
      acceptType
    );
  }
  video(autoPlaying, looping, acceptType) {
    return this.htmlElement(
      BackgroundVideo(autoPlaying, false, looping),
      "canplay",
      acceptType
    );
  }
  async getScript() {
    const tag2 = Script(type(Application_Javascript));
    document.body.append(tag2);
    if (this.useFileBlobsForModules) {
      await this.htmlElement(
        tag2,
        "load",
        Application_Javascript
      );
    } else {
      tag2.src = this.request.path;
    }
  }
  async script(test) {
    const scriptPath = this.request.path;
    if (!test) {
      await this.getScript();
    } else if (!test()) {
      const scriptLoadTask = waitFor(test);
      await this.getScript();
      await scriptLoadTask;
    }
    if (this.prog) {
      this.prog.end(scriptPath);
    }
  }
  async module() {
    const scriptPath = this.request.path;
    let requestPath = scriptPath;
    if (this.useFileBlobsForModules) {
      const { content: file } = await this.file(Application_Javascript);
      requestPath = file;
    }
    const value = await import(requestPath);
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return value;
  }
  async wasm(imports) {
    const { content: buffer, contentType } = await this.buffer(Application_Wasm);
    if (!Application_Wasm.matches(contentType)) {
      throw new Error(`Server did not respond with WASM file. Was: ${contentType}`);
    }
    const module = await WebAssembly.compile(buffer);
    const instance = await WebAssembly.instantiate(module, imports);
    return instance.exports;
  }
  async worker(type2 = "module") {
    const scriptPath = this.request.path;
    let requestPath = scriptPath;
    if (this.useFileBlobsForModules) {
      const { content: file } = await this.file(Application_Javascript);
      requestPath = file;
    }
    this.prog = null;
    this.request.timeout = null;
    const worker = new Worker(requestPath, { type: type2 });
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return worker;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/Fetcher.ts
var Fetcher = class {
  constructor(service, useFileBlobsForModules = true) {
    this.service = service;
    this.useFileBlobsForModules = useFileBlobsForModules;
    if (true) {
      const antiforgeryToken = getInput("input[name=__RequestVerificationToken]");
      if (antiforgeryToken) {
        this.service.setRequestVerificationToken(antiforgeryToken.value);
      }
    }
  }
  createRequest(method, path, base) {
    return new RequestBuilder(this.service, this.useFileBlobsForModules, method, new URL(path, base || location.href));
  }
  clearCache() {
    return this.service.clearCache();
  }
  head(path, base) {
    return this.createRequest("HEAD", path, base);
  }
  options(path, base) {
    return this.createRequest("OPTIONS", path, base);
  }
  get(path, base) {
    return this.createRequest("GET", path, base);
  }
  post(path, base) {
    return this.createRequest("POST", path, base);
  }
  put(path, base) {
    return this.createRequest("PUT", path, base);
  }
  patch(path, base) {
    return this.createRequest("PATCH", path, base);
  }
  delete(path, base) {
    return this.createRequest("DELETE", path, base);
  }
  async assets(progress, ...assets) {
    assets = assets.filter(isDefined);
    const assetSizes = new Map(await Promise.all(assets.map((asset) => asset.getSize(this))));
    await progressTasksWeighted(
      progress,
      assets.map((asset) => [assetSizes.get(asset), (prog) => asset.fetch(this, prog)])
    );
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingService.ts
var FetchingService = class {
  constructor(impl) {
    this.impl = impl;
    this.defaultPostHeaders = /* @__PURE__ */ new Map();
  }
  setRequestVerificationToken(value) {
    this.defaultPostHeaders.set("RequestVerificationToken", value);
  }
  clearCache() {
    return this.impl.clearCache();
  }
  sendNothingGetNothing(request) {
    return this.impl.sendNothingGetNothing(request);
  }
  sendNothingGetBlob(request, progress) {
    return this.impl.sendNothingGetSomething("blob", request, progress);
  }
  sendObjectGetBlob(request, progress) {
    return this.impl.sendSomethingGetSomething("blob", request, this.defaultPostHeaders, progress);
  }
  sendNothingGetBuffer(request, progress) {
    return this.impl.sendNothingGetSomething("arraybuffer", request, progress);
  }
  sendObjectGetBuffer(request, progress) {
    return this.impl.sendSomethingGetSomething("arraybuffer", request, this.defaultPostHeaders, progress);
  }
  sendNothingGetText(request, progress) {
    return this.impl.sendNothingGetSomething("text", request, progress);
  }
  sendObjectGetText(request, progress) {
    return this.impl.sendSomethingGetSomething("text", request, this.defaultPostHeaders, progress);
  }
  async sendNothingGetObject(request, progress) {
    const response = await this.impl.sendNothingGetSomething("json", request, progress);
    return response.content;
  }
  async sendObjectGetObject(request, progress) {
    const response = await this.impl.sendSomethingGetSomething("json", request, this.defaultPostHeaders, progress);
    return response.content;
  }
  sendObjectGetNothing(request, progress) {
    return this.impl.sendSomethingGetSomething("", request, this.defaultPostHeaders, progress);
  }
  drawImageToCanvas(request, canvas, progress) {
    return this.impl.drawImageToCanvas(request, canvas, progress);
  }
  async sendNothingGetFile(request, progress) {
    return translateResponse(
      await this.sendNothingGetBlob(request, progress),
      URL.createObjectURL
    );
  }
  async sendObjectGetFile(request, progress) {
    return translateResponse(
      await this.sendObjectGetBlob(request, progress),
      URL.createObjectURL
    );
  }
  async sendNothingGetXml(request, progress) {
    return translateResponse(
      await this.impl.sendNothingGetSomething("document", request, progress),
      (doc) => doc.documentElement
    );
  }
  async sendObjectGetXml(request, progress) {
    return translateResponse(
      await this.impl.sendSomethingGetSomething("document", request, this.defaultPostHeaders, progress),
      (doc) => doc.documentElement
    );
  }
  async sendNothingGetImageBitmap(request, progress) {
    return translateResponse(
      await this.sendNothingGetBlob(request, progress),
      createImageBitmap
    );
  }
  async sendObjectGetImageBitmap(request, progress) {
    return translateResponse(
      await this.sendObjectGetBlob(request, progress),
      createImageBitmap
    );
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapMap.ts
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemove.ts
function arrayRemove(arr, value) {
  const idx = arr.indexOf(value);
  if (idx > -1) {
    arrayRemoveAt(arr, idx);
    return true;
  }
  return false;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/PriorityList.ts
var PriorityList = class {
  constructor(init) {
    this.items = /* @__PURE__ */ new Map();
    this.defaultItems = new Array();
    if (isDefined(init)) {
      for (const [key, value] of init) {
        this.add(key, value);
      }
    }
  }
  add(key, value) {
    if (isNullOrUndefined(key)) {
      this.defaultItems.push(value);
    } else {
      let list = this.items.get(key);
      if (isNullOrUndefined(list)) {
        this.items.set(key, list = []);
      }
      list.push(value);
    }
    return this;
  }
  entries() {
    return this.items.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  keys() {
    return this.items.keys();
  }
  *values() {
    for (const item of this.defaultItems) {
      yield item;
    }
    for (const list of this.items.values()) {
      for (const item of list) {
        yield item;
      }
    }
  }
  has(key) {
    if (isDefined(key)) {
      return this.items.has(key);
    } else {
      return this.defaultItems.length > 0;
    }
  }
  get(key) {
    if (isNullOrUndefined(key)) {
      return this.defaultItems;
    }
    return this.items.get(key) || [];
  }
  count(key) {
    if (isNullOrUndefined(key)) {
      return this.defaultItems.length;
    }
    const list = this.get(key);
    if (isDefined(list)) {
      return list.length;
    }
    return 0;
  }
  get size() {
    let size = this.defaultItems.length;
    for (const list of this.items.values()) {
      size += list.length;
    }
    return size;
  }
  delete(key) {
    if (isNullOrUndefined(key)) {
      return arrayClear(this.defaultItems).length > 0;
    } else {
      return this.items.delete(key);
    }
  }
  remove(key, value) {
    if (isNullOrUndefined(key)) {
      arrayRemove(this.defaultItems, value);
    } else {
      const list = this.items.get(key);
      if (isDefined(list)) {
        arrayRemove(list, value);
        if (list.length === 0) {
          this.items.delete(key);
        }
      }
    }
  }
  clear() {
    this.items.clear();
    arrayClear(this.defaultItems);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/PriorityMap.ts
var PriorityMap = class {
  constructor(init) {
    this.items = /* @__PURE__ */ new Map();
    if (isDefined(init)) {
      for (const [key1, key2, value] of init) {
        this.add(key1, key2, value);
      }
    }
  }
  add(key1, key2, value) {
    let level1 = this.items.get(key1);
    if (isNullOrUndefined(level1)) {
      this.items.set(key1, level1 = /* @__PURE__ */ new Map());
    }
    level1.set(key2, value);
    return this;
  }
  *entries() {
    for (const [key1, level1] of this.items) {
      for (const [key2, value] of level1) {
        yield [key1, key2, value];
      }
    }
  }
  keys(key1) {
    if (isNullOrUndefined(key1)) {
      return this.items.keys();
    } else {
      return this.items.get(key1).keys();
    }
  }
  *values() {
    for (const level1 of this.items.values()) {
      for (const value of level1.values()) {
        yield value;
      }
    }
  }
  has(key1, key2) {
    return this.items.has(key1) && (isNullOrUndefined(key2) || this.items.get(key1).has(key2));
  }
  get(key1, key2) {
    if (isNullOrUndefined(key2)) {
      return this.items.get(key1);
    } else if (this.items.has(key1)) {
      return this.items.get(key1).get(key2);
    } else {
      return null;
    }
  }
  count(key1) {
    if (this.items.has(key1)) {
      return this.items.get(key1).size;
    }
    return null;
  }
  get size() {
    let size = 0;
    for (const list of this.items.values()) {
      size += list.size;
    }
    return size;
  }
  delete(key1, key2) {
    if (isNullOrUndefined(key2)) {
      return this.items.delete(key1);
    } else if (this.items.has(key1)) {
      return this.items.get(key1).delete(key2);
    } else {
      return false;
    }
  }
  clear() {
    this.items.clear();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/indexdb/index.ts
var IDexDB = class {
  constructor(db) {
    this.db = db;
  }
  static async getCurrentVersion(dbName) {
    if (isDefined(indexedDB.databases)) {
      const databases = await indexedDB.databases();
      for (const { name, version: version2 } of databases) {
        if (name === dbName) {
          return version2;
        }
      }
    }
    return null;
  }
  static delete(dbName) {
    const deleteRequest = indexedDB.deleteDatabase(dbName);
    const task = once(deleteRequest, "success", "error", "blocked");
    return success(task);
  }
  static async open(name, ...storeDefs) {
    const storesByName = mapMap(storeDefs, (v) => v.name, identity);
    const indexesByName = new PriorityMap(
      storeDefs.filter((storeDef) => isDefined(storeDef.indexes)).flatMap((storeDef) => storeDef.indexes.map((indexDef) => [storeDef.name, indexDef.name, indexDef]))
    );
    const storesToAdd = new Array();
    const storesToRemove = new Array();
    const storesToChange = new Array();
    const indexesToAdd = new PriorityList();
    const indexesToRemove = new PriorityList();
    let version2 = await this.getCurrentVersion(name);
    if (isNullOrUndefined(version2)) {
      storesToAdd.push(...storesByName.keys());
      for (const storeDef of storeDefs) {
        if (isDefined(storeDef.indexes)) {
          for (const indexDef of storeDef.indexes) {
            indexesToAdd.add(storeDef.name, indexDef.name);
          }
        }
      }
    } else {
      const D = indexedDB.open(name);
      if (await success(once(D, "success", "error", "blocked"))) {
        const db = D.result;
        const storesToScrutinize = new Array();
        for (const storeName of Array.from(db.objectStoreNames)) {
          if (!storesByName.has(storeName)) {
            storesToRemove.push(storeName);
          }
        }
        for (const storeName of storesByName.keys()) {
          if (!db.objectStoreNames.contains(storeName)) {
            storesToAdd.push(storeName);
          } else {
            storesToScrutinize.push(storeName);
          }
        }
        if (storesToScrutinize.length > 0) {
          const transaction = db.transaction(storesToScrutinize);
          const transacting = once(transaction, "complete", "error", "abort");
          const transacted = success(transacting);
          for (const storeName of storesToScrutinize) {
            const store = transaction.objectStore(storeName);
            for (const indexName of Array.from(store.indexNames)) {
              if (!indexesByName.has(storeName, indexName)) {
                if (storesToChange.indexOf(storeName) === -1) {
                  storesToChange.push(storeName);
                }
                indexesToRemove.add(storeName, indexName);
              }
            }
            if (indexesByName.has(storeName)) {
              for (const indexName of indexesByName.get(storeName).keys()) {
                if (!store.indexNames.contains(indexName)) {
                  if (storesToChange.indexOf(storeName) === -1) {
                    storesToChange.push(storeName);
                  }
                  indexesToAdd.add(storeName, indexName);
                } else {
                  const indexDef = indexesByName.get(storeName, indexName);
                  const index = store.index(indexName);
                  if (isString(indexDef.keyPath) !== isString(index.keyPath) || isString(indexDef.keyPath) && isString(index.keyPath) && indexDef.keyPath !== index.keyPath || isArray(indexDef.keyPath) && isArray(index.keyPath) && arrayCompare(indexDef.keyPath, index.keyPath)) {
                    if (storesToChange.indexOf(storeName) === -1) {
                      storesToChange.push(storeName);
                    }
                    indexesToRemove.add(storeName, indexName);
                    indexesToAdd.add(storeName, indexName);
                  }
                }
              }
            }
          }
          transaction.commit();
          await transacted;
        }
        db.close();
      }
      if (storesToAdd.length > 0 || storesToRemove.length > 0 || indexesToAdd.size > 0 || indexesToRemove.size > 0) {
        ++version2;
      }
    }
    const upgrading = new Task();
    const openRequest = isDefined(version2) ? indexedDB.open(name, version2) : indexedDB.open(name);
    const opening = once(openRequest, "success", "error", "blocked");
    const upgraded = success(upgrading);
    const opened = success(opening);
    const noUpgrade = () => upgrading.resolve(false);
    openRequest.addEventListener("success", noUpgrade);
    openRequest.addEventListener("upgradeneeded", () => {
      const transacting = once(openRequest.transaction, "complete", "error", "abort");
      const db = openRequest.result;
      for (const storeName of storesToRemove) {
        db.deleteObjectStore(storeName);
      }
      const stores = /* @__PURE__ */ new Map();
      for (const storeName of storesToAdd) {
        const storeDef = storesByName.get(storeName);
        const store = db.createObjectStore(storeName, storeDef.options);
        stores.set(storeName, store);
      }
      for (const storeName of storesToChange) {
        const store = openRequest.transaction.objectStore(storeName);
        stores.set(storeName, store);
      }
      for (const [storeName, store] of stores) {
        for (const indexName of indexesToRemove.get(storeName)) {
          store.deleteIndex(indexName);
        }
        for (const indexName of indexesToAdd.get(storeName)) {
          const indexDef = indexesByName.get(storeName, indexName);
          store.createIndex(indexName, indexDef.keyPath, indexDef.options);
        }
      }
      success(transacting).then(upgrading.resolve).catch(upgrading.reject).finally(() => openRequest.removeEventListener("success", noUpgrade));
    });
    if (!await upgraded) {
      throw upgrading.error;
    }
    if (!await opened) {
      throw opening.error;
    }
    return new IDexDB(openRequest.result);
  }
  dispose() {
    this.db.close();
  }
  get name() {
    return this.db.name;
  }
  get version() {
    return this.db.version;
  }
  get storeNames() {
    return Array.from(this.db.objectStoreNames);
  }
  getStore(storeName) {
    return new IDexStore(this.db, storeName);
  }
};
var IDexStore = class {
  constructor(db, storeName) {
    this.db = db;
    this.storeName = storeName;
  }
  async request(makeRequest, mode) {
    const transaction = this.db.transaction(this.storeName, mode);
    const transacting = once(transaction, "complete", "error");
    const store = transaction.objectStore(this.storeName);
    const request = makeRequest(store);
    const requesting = once(request, "success", "error");
    if (!await success(requesting)) {
      transaction.abort();
      throw requesting.error;
    }
    transaction.commit();
    if (!await success(transacting)) {
      throw transacting.error;
    }
    return request.result;
  }
  add(value, key) {
    return this.request((store) => store.add(value, key), "readwrite");
  }
  clear() {
    return this.request((store) => store.clear(), "readwrite");
  }
  getCount(query) {
    return this.request((store) => store.count(query), "readonly");
  }
  delete(query) {
    return this.request((store) => store.delete(query), "readwrite");
  }
  get(key) {
    return this.request((store) => store.get(key), "readonly");
  }
  getAll() {
    return this.request((store) => store.getAll(), "readonly");
  }
  getAllKeys() {
    return this.request((store) => store.getAllKeys(), "readonly");
  }
  getKey(query) {
    return this.request((store) => store.getKey(query), "readonly");
  }
  openCursor(query, direction) {
    return this.request((store) => store.openCursor(query, direction), "readonly");
  }
  openKeyCursor(query, direction) {
    return this.request((store) => store.openKeyCursor(query, direction), "readonly");
  }
  put(value, key) {
    return this.request((store) => store.put(value, key), "readwrite");
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapJoin.ts
function mapJoin(dest, ...sources) {
  for (const source of sources) {
    if (isDefined(source)) {
      for (const [key, value] of source) {
        dest.set(key, value);
      }
    }
  }
  return dest;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServiceImplXHR.ts
function isXHRBodyInit(obj2) {
  return isString(obj2) || isArrayBufferView(obj2) || obj2 instanceof Blob || obj2 instanceof FormData || isArrayBuffer(obj2) || "Document" in globalThis && obj2 instanceof Document;
}
function trackProgress(name, xhr, target, prog, skipLoading, prevTask) {
  let prevDone = !prevTask;
  if (prevTask) {
    prevTask.then(() => prevDone = true);
  }
  let done = false;
  let loaded = skipLoading;
  const requestComplete = new Task(
    () => loaded && done,
    () => prevDone
  );
  target.addEventListener("loadstart", () => {
    if (prevDone && !done && prog) {
      prog.start(name);
    }
  });
  target.addEventListener("progress", (ev) => {
    if (prevDone && !done) {
      const evt = ev;
      if (prog) {
        prog.report(evt.loaded, Math.max(evt.loaded, evt.total), name);
      }
      if (evt.loaded === evt.total) {
        loaded = true;
        requestComplete.resolve();
      }
    }
  });
  target.addEventListener("load", () => {
    if (prevDone && !done) {
      if (prog) {
        prog.end(name);
      }
      done = true;
      requestComplete.resolve();
    }
  });
  const onError = (msg) => () => requestComplete.reject(`${msg} (${xhr.status})`);
  target.addEventListener("error", onError("error"));
  target.addEventListener("abort", onError("abort"));
  target.addEventListener("timeout", onError("timeout"));
  return requestComplete;
}
function sendRequest(xhr, method, path, timeout, headers, body) {
  xhr.open(method, path);
  xhr.responseType = "blob";
  xhr.timeout = timeout;
  if (headers) {
    for (const [key, value] of headers) {
      xhr.setRequestHeader(key, value);
    }
  }
  if (isDefined(body)) {
    xhr.send(body);
  } else {
    xhr.send();
  }
}
function readResponseHeader(headers, key, translate) {
  if (!headers.has(key)) {
    return null;
  }
  const value = headers.get(key);
  try {
    const translated = translate(value);
    headers.delete(key);
    return translated;
  } catch (exp) {
    console.warn(key, exp);
  }
  return null;
}
var FILE_NAME_PATTERN = /filename=\"(.+)\"(;|$)/;
var DB_NAME = "Juniper:Fetcher:Cache";
var FetchingServiceImplXHR = class {
  constructor() {
    this.cache = null;
    this.store = null;
    this.tasks = new PriorityMap();
    this.cacheReady = this.openCache();
  }
  async drawImageToCanvas(request, canvas, progress) {
    const response = await this.sendNothingGetSomething("blob", request, progress);
    const blob = response.content;
    return using(await createImageBitmap(blob, {
      imageOrientation: "none"
    }), (img) => {
      canvas.width = img.width;
      canvas.height = img.height;
      const g = canvas.getContext("2d");
      g.drawImage(img, 0, 0);
      return translateResponse(response, () => null);
    });
  }
  async openCache() {
    this.cache = await IDexDB.open(DB_NAME, {
      name: "files",
      options: {
        keyPath: "path"
      }
    });
    this.store = await this.cache.getStore("files");
  }
  async clearCache() {
    await this.cacheReady;
    await this.store.clear();
  }
  async readResponseHeaders(path, xhr) {
    const headerParts = xhr.getAllResponseHeaders().split(/[\r\n]+/).map((v) => v.trim()).filter((v) => v.length > 0).map((line) => {
      const parts = line.split(": ");
      const key = parts.shift().toLowerCase();
      const value = parts.join(": ");
      return [key, value];
    });
    const pList = new PriorityList(headerParts);
    const normalizedHeaderParts = Array.from(pList.keys()).map((key) => [
      key,
      pList.get(key).join(", ")
    ]);
    const headers = new Map(normalizedHeaderParts);
    const contentType = readResponseHeader(headers, "content-type", identity);
    const contentLength = readResponseHeader(headers, "content-length", parseFloat);
    const date = readResponseHeader(headers, "date", (v) => new Date(v));
    const fileName = readResponseHeader(headers, "content-disposition", (v) => {
      if (isDefined(v)) {
        const match = v.match(FILE_NAME_PATTERN);
        if (isDefined(match)) {
          return match[1];
        }
      }
      return null;
    });
    const response = {
      status: xhr.status,
      path,
      content: void 0,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    };
    return response;
  }
  async readResponse(path, xhr) {
    const {
      status,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    } = await this.readResponseHeaders(path, xhr);
    const response = {
      path,
      status,
      contentType,
      contentLength,
      fileName,
      date,
      headers,
      content: xhr.response
    };
    if (isDefined(response.content)) {
      response.contentType = response.contentType || response.content.type;
      response.contentLength = response.contentLength || response.content.size;
    }
    return response;
  }
  async decodeContent(xhrType, response) {
    return translateResponse(response, async (contentBlob) => {
      if (xhrType === "") {
        return null;
      } else if (isNullOrUndefined(response.contentType)) {
        const headerBlock = Array.from(response.headers.entries()).map((kv) => kv.join(": ")).join("\n  ");
        throw new Error("No content type found in headers: \n  " + headerBlock);
      } else if (xhrType === "blob") {
        return contentBlob;
      } else if (xhrType === "arraybuffer") {
        return await contentBlob.arrayBuffer();
      } else if (xhrType === "json") {
        const text2 = await contentBlob.text();
        if (text2.length > 0) {
          return JSON.parse(text2);
        } else {
          return null;
        }
      } else if (xhrType === "document") {
        const parser = new DOMParser();
        if (response.contentType === "application/xhtml+xml" || response.contentType === "text/html" || response.contentType === "application/xml" || response.contentType === "image/svg+xml" || response.contentType === "text/xml") {
          return parser.parseFromString(await contentBlob.text(), response.contentType);
        } else {
          throw new Error("Couldn't parse document");
        }
      } else if (xhrType === "text") {
        return await contentBlob.text();
      } else {
        assertNever(xhrType);
      }
    });
  }
  async withCachedTask(request, action) {
    if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS") {
      return await action();
    }
    if (!this.tasks.has(request.method, request.path)) {
      this.tasks.add(
        request.method,
        request.path,
        action().finally(() => this.tasks.delete(request.method, request.path))
      );
    }
    return this.tasks.get(request.method, request.path);
  }
  sendNothingGetNothing(request) {
    return this.withCachedTask(request, async () => {
      const xhr = new XMLHttpRequest();
      const download = trackProgress(`requesting: ${request.path}`, xhr, xhr, null, true);
      sendRequest(xhr, request.method, request.path, request.timeout, request.headers);
      await download;
      return await this.readResponseHeaders(request.path, xhr);
    });
  }
  sendNothingGetSomething(xhrType, request, progress) {
    return this.withCachedTask(request, async () => {
      let response = null;
      const useCache = request.useCache && request.method === "GET";
      if (useCache) {
        if (isDefined(progress)) {
          progress.start();
        }
        await this.cacheReady;
        response = await this.store.get(request.path);
      }
      const noCachedResponse = isNullOrUndefined(response);
      if (noCachedResponse) {
        const xhr = new XMLHttpRequest();
        const download = trackProgress(`requesting: ${request.path}`, xhr, xhr, progress, true);
        sendRequest(xhr, request.method, request.path, request.timeout, request.headers);
        await download;
        response = await this.readResponse(request.path, xhr);
        if (useCache) {
          await this.store.add(response);
        }
      }
      const value = await this.decodeContent(xhrType, response);
      if (noCachedResponse && isDefined(progress)) {
        progress.end();
      }
      return value;
    });
  }
  async sendSomethingGetSomething(xhrType, request, defaultPostHeaders, progress) {
    let body = null;
    const headers = mapJoin(/* @__PURE__ */ new Map(), defaultPostHeaders, request.headers);
    if (request.body instanceof FormData && isDefined(headers)) {
      const toDelete = new Array();
      for (const key of headers.keys()) {
        if (key.toLowerCase() === "content-type") {
          toDelete.push(key);
        }
      }
      for (const key of toDelete) {
        headers.delete(key);
      }
    }
    if (isXHRBodyInit(request.body) && !isString(request.body)) {
      body = request.body;
    } else if (isDefined(request.body)) {
      body = JSON.stringify(request.body);
    }
    const progs = progressSplit(progress, 2);
    const xhr = new XMLHttpRequest();
    const upload = isDefined(body) ? trackProgress("uploading", xhr, xhr.upload, progs.shift(), false) : Promise.resolve();
    const downloadProg = progs.shift();
    const download = trackProgress("saving", xhr, xhr, downloadProg, true, upload);
    sendRequest(xhr, request.method, request.path, request.timeout, headers, body);
    await upload;
    await download;
    const response = await this.readResponse(request.path, xhr);
    return await this.decodeContent(xhrType, response);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/workers/WorkerPool.ts
var WorkerPool = class extends TypedEventBase {
  constructor(options, WorkerClientClass) {
    super();
    this.scriptPath = options.scriptPath;
    let workerPoolSize = -1;
    const workersDef = options.workers;
    let workers = null;
    if (isNumber(workersDef)) {
      workerPoolSize = workersDef;
    } else if (isDefined(workersDef)) {
      this.taskCounter = workersDef.curTaskCounter;
      workers = workersDef.workers;
      workerPoolSize = workers.length;
    } else {
      workerPoolSize = navigator.hardwareConcurrency || 4;
    }
    if (workerPoolSize < 1) {
      throw new Error("Worker pool size must be a postive integer greater than 0");
    }
    this.workers = new Array(workerPoolSize);
    if (isNullOrUndefined(workers)) {
      this.taskCounter = 0;
      for (let i = 0; i < workerPoolSize; ++i) {
        this.workers[i] = new WorkerClientClass(new Worker(this.scriptPath, { type: "module" }));
      }
    } else {
      for (let i = 0; i < workerPoolSize; ++i) {
        this.workers[i] = new WorkerClientClass(workers[i]);
      }
    }
    for (const worker of this.workers) {
      worker.addBubbler(this);
    }
  }
  dispose() {
    for (const worker of this.workers) {
      worker.dispose();
    }
    arrayClear(this.workers);
  }
  nextWorker() {
    const worker = this.peekWorker();
    this.taskCounter++;
    return worker;
  }
  peekWorker() {
    return this.workers[this.taskCounter % this.workers.length];
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/flags.ts
var oculusBrowserPattern = /OculusBrowser\/(\d+)\.(\d+)\.(\d+)/i;
var oculusMatch = /* @__PURE__ */ navigator.userAgent.match(oculusBrowserPattern);
var isOculusBrowser = !!oculusMatch;
var oculusBrowserVersion = isOculusBrowser && {
  major: parseFloat(oculusMatch[1]),
  minor: parseFloat(oculusMatch[2]),
  patch: parseFloat(oculusMatch[3])
};
var isOculusGo = isOculusBrowser && /pacific/i.test(navigator.userAgent);
var isOculusQuest = isOculusBrowser && /quest/i.test(navigator.userAgent);
var isOculusQuest2 = isOculusBrowser && /quest 2/i.test(navigator.userAgent);
var isWorkerSupported = "Worker" in globalThis;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/IProgress.ts
function isProgressCallback(obj2) {
  return isDefined(obj2) && isFunction(obj2.report) && isFunction(obj2.attach) && isFunction(obj2.end);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/workers/WorkerClient.ts
var WorkerClient = class extends TypedEventBase {
  constructor(worker) {
    super();
    this.worker = worker;
    this.invocations = /* @__PURE__ */ new Map();
    this.tasks = new Array();
    this.taskCounter = 0;
    if (!isWorkerSupported) {
      console.warn("Workers are not supported on this system.");
    }
    this.worker.addEventListener("message", (evt) => {
      const data = evt.data;
      switch (data.type) {
        case "event":
          this.propogateEvent(data);
          break;
        case "progress":
          this.progressReport(data);
          break;
        case "return":
          this.methodReturned(data);
          break;
        case "error":
          this.invocationError(data);
          break;
        default:
          assertNever(data);
      }
    });
  }
  postMessage(message, transferables) {
    if (message.type !== "methodCall") {
      assertNever(message.type);
    }
    if (transferables) {
      this.worker.postMessage(message, transferables);
    } else {
      this.worker.postMessage(message);
    }
  }
  dispose() {
    this.worker.terminate();
  }
  progressReport(data) {
    const invocation = this.invocations.get(data.taskID);
    if (invocation) {
      const { prog } = invocation;
      if (prog) {
        prog.report(data.soFar, data.total, data.msg, data.est);
      }
    }
  }
  methodReturned(data) {
    const messageHandler = this.removeInvocation(data.taskID);
    const { task } = messageHandler;
    task.resolve(data.returnValue);
  }
  invocationError(data) {
    const messageHandler = this.removeInvocation(data.taskID);
    const { task, methodName } = messageHandler;
    task.reject(new Error(`${methodName} failed. Reason: ${data.errorMessage}`));
  }
  removeInvocation(taskID) {
    const invocation = this.invocations.get(taskID);
    this.invocations.delete(taskID);
    return invocation;
  }
  callMethod(methodName, parameters, transferables, prog) {
    if (!isWorkerSupported) {
      return Promise.reject(new Error("Workers are not supported on this system."));
    }
    let params = null;
    let tfers = null;
    if (isProgressCallback(parameters)) {
      prog = parameters;
      parameters = null;
      transferables = null;
    }
    if (isProgressCallback(transferables) && !prog) {
      prog = transferables;
      transferables = null;
    }
    if (isArray(parameters)) {
      params = parameters;
    }
    if (isArray(transferables)) {
      tfers = transferables;
    }
    const taskID = this.taskCounter++;
    let task = arrayScan(this.tasks, (t2) => t2.finished);
    if (task) {
      task.reset();
    } else {
      task = new Task();
      this.tasks.push(task);
    }
    const invocation = {
      methodName,
      task,
      prog
    };
    this.invocations.set(taskID, invocation);
    let message = null;
    if (isDefined(parameters)) {
      message = {
        type: "methodCall",
        taskID,
        methodName,
        params
      };
    } else {
      message = {
        type: "methodCall",
        taskID,
        methodName
      };
    }
    this.postMessage(message, tfers);
    return task;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServiceClient.ts
function isDOMParsersSupportedType(type2) {
  return type2 === "application/xhtml+xml" || type2 === "application/xml" || type2 === "image/svg+xml" || type2 === "text/html" || type2 === "text/xml";
}
function bufferToXml(response) {
  const {
    status,
    path,
    content: buffer,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
  if (!isDOMParsersSupportedType(contentType)) {
    throw new Error(`Content-Type ${contentType} is not one supported by the DOM parser.`);
  }
  const decoder = new TextDecoder();
  const text2 = decoder.decode(buffer);
  const parser = new DOMParser();
  const doc = parser.parseFromString(text2, contentType);
  return {
    status,
    path,
    content: doc.documentElement,
    contentType,
    contentLength,
    fileName,
    date,
    headers
  };
}
function bufferToBlob(response) {
  const {
    status,
    path,
    content: buffer,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
  const blob = new Blob([buffer], {
    type: contentType
  });
  return {
    status,
    path,
    content: blob,
    contentType,
    contentLength,
    fileName,
    date,
    headers
  };
}
function cloneRequest(request) {
  request = {
    method: request.method,
    path: request.path,
    timeout: request.timeout,
    headers: request.headers,
    withCredentials: request.withCredentials,
    useCache: request.useCache
  };
  return request;
}
function cloneRequestWithBody(request) {
  request = {
    method: request.method,
    path: request.path,
    body: request.body,
    timeout: request.timeout,
    headers: request.headers,
    withCredentials: request.withCredentials,
    useCache: request.useCache
  };
  return request;
}
var FetchingServiceClient = class extends WorkerClient {
  setRequestVerificationToken(value) {
    this.callMethod("setRequestVerificationToken", [value]);
  }
  clearCache() {
    return this.callMethod("clearCache");
  }
  propogateEvent(data) {
    assertNever(data.eventName);
  }
  makeRequest(methodName, request, progress) {
    return this.callMethod(methodName, [cloneRequest(request)], progress);
  }
  makeRequestWithBody(methodName, request, progress) {
    return this.callMethod(methodName, [cloneRequestWithBody(request)], progress);
  }
  sendNothingGetNothing(request) {
    return this.makeRequest("sendNothingGetNothing", request, null);
  }
  sendNothingGetBuffer(request, progress) {
    return this.makeRequest("sendNothingGetBuffer", request, progress);
  }
  sendNothingGetText(request, progress) {
    return this.makeRequest("sendNothingGetText", request, progress);
  }
  sendNothingGetObject(request, progress) {
    return this.makeRequest("sendNothingGetObject", request, progress);
  }
  sendNothingGetFile(request, progress) {
    return this.makeRequest("sendNothingGetFile", request, progress);
  }
  sendNothingGetImageBitmap(request, progress) {
    return this.makeRequest("sendNothingGetImageBitmap", request, progress);
  }
  sendObjectGetNothing(request, progress) {
    return this.makeRequestWithBody("sendObjectGetNothing", request, progress);
  }
  sendObjectGetBuffer(request, progress) {
    return this.makeRequestWithBody("sendObjectGetBuffer", request, progress);
  }
  sendObjectGetText(request, progress) {
    return this.makeRequestWithBody("sendObjectGetText", request, progress);
  }
  sendObjectGetObject(request, progress) {
    return this.makeRequestWithBody("sendObjectGetObject", request, progress);
  }
  sendObjectGetFile(request, progress) {
    return this.makeRequestWithBody("sendObjectGetFile", request, progress);
  }
  sendObjectGetImageBitmap(request, progress) {
    return this.makeRequestWithBody("sendObjectGetImageBitmap", request, progress);
  }
  drawImageToCanvas(request, canvas, progress) {
    return this.callMethod("drawImageToCanvas", [cloneRequest(request), canvas], [canvas], progress);
  }
  async sendNothingGetBlob(request, progress) {
    const response = await this.sendNothingGetBuffer(request, progress);
    return bufferToBlob(response);
  }
  async sendNothingGetXml(request, progress) {
    const response = await this.sendNothingGetBuffer(request, progress);
    return bufferToXml(response);
  }
  async sendObjectGetBlob(request, progress) {
    const response = await this.sendObjectGetBuffer(request, progress);
    return bufferToBlob(response);
  }
  async sendObjectGetXml(request, progress) {
    const response = await this.sendObjectGetBuffer(request, progress);
    return bufferToXml(response);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServicePool.ts
var FetchingServicePool = class extends WorkerPool {
  constructor(options, fetcher) {
    super(options, FetchingServiceClient);
    this.fetcher = fetcher;
  }
  getFetcher(obj2) {
    if (obj2 instanceof FormData) {
      return this.fetcher;
    } else {
      return this.nextWorker();
    }
  }
  setRequestVerificationToken(value) {
    this.fetcher.setRequestVerificationToken(value);
    for (const worker of this.workers) {
      worker.setRequestVerificationToken(value);
    }
  }
  async clearCache() {
    await Promise.all(this.workers.map((w) => w.clearCache()));
  }
  sendNothingGetNothing(request) {
    return this.nextWorker().sendNothingGetNothing(request);
  }
  sendNothingGetBlob(request, progress) {
    return this.nextWorker().sendNothingGetBlob(request, progress);
  }
  sendNothingGetBuffer(request, progress) {
    return this.nextWorker().sendNothingGetBuffer(request, progress);
  }
  sendNothingGetFile(request, progress) {
    return this.nextWorker().sendNothingGetFile(request, progress);
  }
  sendNothingGetText(request, progress) {
    return this.nextWorker().sendNothingGetText(request, progress);
  }
  sendNothingGetObject(request, progress) {
    return this.nextWorker().sendNothingGetObject(request, progress);
  }
  sendNothingGetXml(request, progress) {
    return this.nextWorker().sendNothingGetXml(request, progress);
  }
  sendNothingGetImageBitmap(request, progress) {
    return this.nextWorker().sendNothingGetImageBitmap(request, progress);
  }
  drawImageToCanvas(request, canvas, progress) {
    return this.nextWorker().drawImageToCanvas(request, canvas, progress);
  }
  sendObjectGetBlob(request, progress) {
    return this.getFetcher(request.body).sendObjectGetBlob(request, progress);
  }
  sendObjectGetBuffer(request, progress) {
    return this.getFetcher(request.body).sendObjectGetBuffer(request, progress);
  }
  sendObjectGetFile(request, progress) {
    return this.getFetcher(request.body).sendObjectGetFile(request, progress);
  }
  sendObjectGetText(request, progress) {
    return this.getFetcher(request.body).sendObjectGetText(request, progress);
  }
  sendObjectGetNothing(request, progress) {
    return this.getFetcher(request.body).sendObjectGetNothing(request, progress);
  }
  sendObjectGetObject(request, progress) {
    return this.getFetcher(request.body).sendObjectGetObject(request, progress);
  }
  sendObjectGetXml(request, progress) {
    return this.getFetcher(request.body).sendObjectGetXml(request, progress);
  }
  sendObjectGetImageBitmap(request, progress) {
    return this.getFetcher(request.body).sendObjectGetImageBitmap(request, progress);
  }
};

// src/isDebug.ts
var url = /* @__PURE__ */ new URL(globalThis.location.href);
var isDebug = !url.searchParams.has("RELEASE") || false;
var JS_EXT = isDebug ? ".js" : ".min.js";

// src/settings.ts
var version = true ? stringRandom(10) : pkgVersion;
var defaultAvatarHeight = 1.75;
var enableFullResolution = false;
var defaultFont = {
  fontFamily: "Segoe UI",
  fontSize: 20
};
var emojiFont = {
  fontFamily: "Segoe UI Emoji",
  fontSize: 20
};
async function loadFonts() {
  await Promise.all([
    loadFont(emojiFont)
  ]);
}
function getUIImagePaths() {
  const imageNames = new PriorityList([
    ["arrow", "arrow-up"],
    ["arrow", "arrow-down"],
    ["arrow", "arrow-left"],
    ["arrow", "arrow-right"],
    ["chat", "user"],
    ["chat", "chat"],
    ["ui", "menu"],
    ["ui", "settings"],
    ["ui", "install"],
    ["ui", "quit"],
    ["ui", "lobby"],
    ["zoom", "zoom-in"],
    ["zoom", "zoom-out"],
    ["environment-audio", "environment-audio-mute"],
    ["environment-audio", "environment-audio-unmute"],
    ["headphones", "headphones-unmuted"],
    ["headphones", "headphones-muted"],
    ["microphone", "microphone-mute"],
    ["microphone", "microphone-unmute"],
    ["volume", "volume-muted"],
    ["volume", "volume-low"],
    ["volume", "volume-medium"],
    ["volume", "volume-high"],
    ["media", "media-pause"],
    ["media", "media-play"],
    ["media", "media-stop"],
    ["media", "media-replay"],
    ["ar", "ar-enter"],
    ["ar", "ar-exit"],
    ["vr", "vr-enter"],
    ["vr", "vr-exit"],
    ["fullscreen", "fullscreen-enter"],
    ["fullscreen", "fullscreen-exit"]
  ]);
  const uiImagePaths = new PriorityMap();
  for (const [setName, iconNames] of imageNames.entries()) {
    for (const iconName of iconNames) {
      uiImagePaths.add(
        setName,
        iconName.replace(setName + "-", ""),
        `/img/ui/${iconName}.png`
      );
    }
  }
  return uiImagePaths;
}

// src/createFetcher.ts
function createFetcher(enableWorkers = true) {
  let fallback = new FetchingService(new FetchingServiceImplXHR());
  if (enableWorkers) {
    fallback = new FetchingServicePool({
      scriptPath: `/js/fetcher-worker/index${JS_EXT}?${version}`
    }, fallback);
  }
  return new Fetcher(fallback, !isDebug);
}

// src/createTestEnvironment.ts
async function registerWorker() {
  const url2 = new URL(location.href);
  const scope = url2.pathname;
  const registration = await navigator.serviceWorker.register(`${scope}.service?${version}`, { scope });
  const { active, installing, waiting } = registration;
  console.log("register", waiting, installing, active);
}
async function createTestEnvironment(addServiceWorker = false) {
  if (addServiceWorker && "serviceWorker" in navigator) {
    registerWorker();
  }
  const canvas = Canvas(
    id("frontBuffer")
  );
  document.body.append(
    Div(
      id("appContainer"),
      canvas
    )
  );
  await loadFonts();
  const fetcher = createFetcher(!isDebug);
  const { default: EnvironmentConstructor } = await fetcher.get(`/js/environment/index${JS_EXT}?${version}`).useCache(!isDebug).module();
  const env = new EnvironmentConstructor(
    canvas,
    fetcher,
    defaultFont.fontFamily,
    getUIImagePaths(),
    defaultAvatarHeight,
    enableFullResolution,
    {
      DEBUG: isDebug
    }
  );
  if (isDebug) {
    const MAX_IMAGE_SIZE = toBytes(200, "KiB");
    window.addEventListener("keypress", async (evt) => {
      if (evt.key === "`") {
        env.drawSnapshot();
        const canv = env.renderer.domElement;
        const aspectRatio = canv.width / canv.height;
        let width = 640;
        let height = 480;
        if (aspectRatio >= 1) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
        const canvResize = createUICanvas(width, height);
        const gResize = canvResize.getContext("2d", { alpha: false, desynchronized: true });
        gResize.drawImage(canv, 0, 0, canv.width, canv.height, 0, 0, canvResize.width, canvResize.height);
        let blob = null;
        for (let quality = 1; quality >= 0.05; quality -= 0.05) {
          blob = await canvasToBlob(canvResize, Image_Jpeg.value, quality);
          if (blob.size <= MAX_IMAGE_SIZE) {
            break;
          }
        }
        if (isNullOrUndefined(blob)) {
          console.error("No image");
        } else {
          if (blob.size > MAX_IMAGE_SIZE) {
            console.warn("Image was pretty big");
          }
          const form = new FormData();
          form.append("File", blob, "screenshot.jpg");
          await fetcher.post(location.href).body(form).exec();
        }
      }
    });
  }
  return env;
}

// src/button-app/index.ts
var buttonStyle = {
  bgFillColor: "#1e4388",
  scale: 500,
  padding: 0.05,
  maxHeight: 0.25,
  minHeight: 0.25,
  wrapWords: false
};
(async function() {
  const env = await createTestEnvironment();
  await env.fadeOut();
  await env.load();
  const button1 = new TextMeshButton(env, "Button1", "Click Me?", buttonStyle);
  button1.enabled = false;
  button1.addEventListener("click", () => env.audio.playClip("footsteps"));
  button1.object.position.set(-0.5, 1.75, -3);
  const button2 = new TextMeshButton(env, "Button2", "Click Me.", buttonStyle);
  button2.addEventListener("click", () => button1.enabled = !button1.enabled);
  button2.object.position.set(0.5, 1.75, -3);
  objGraph(
    env.foreground,
    button1,
    button2
  );
  await env.fadeIn();
})();
//# sourceMappingURL=index.js.map
