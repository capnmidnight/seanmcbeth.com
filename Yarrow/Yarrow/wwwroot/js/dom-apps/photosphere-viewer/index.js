var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../Juniper/src/Juniper.TypeScript/node_modules/cardboard-vr-display/dist/cardboard-vr-display.js
var require_cardboard_vr_display = __commonJS({
  "../Juniper/src/Juniper.TypeScript/node_modules/cardboard-vr-display/dist/cardboard-vr-display.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.CardboardVRDisplay = factory();
    })(exports, function() {
      "use strict";
      var asyncGenerator = function() {
        function AwaitValue(value) {
          this.value = value;
        }
        function AsyncGenerator(gen) {
          var front, back;
          function send(key, arg) {
            return new Promise(function(resolve, reject) {
              var request = {
                key,
                arg,
                resolve,
                reject,
                next: null
              };
              if (back) {
                back = back.next = request;
              } else {
                front = back = request;
                resume(key, arg);
              }
            });
          }
          function resume(key, arg) {
            try {
              var result = gen[key](arg);
              var value = result.value;
              if (value instanceof AwaitValue) {
                Promise.resolve(value.value).then(function(arg2) {
                  resume("next", arg2);
                }, function(arg2) {
                  resume("throw", arg2);
                });
              } else {
                settle(result.done ? "return" : "normal", result.value);
              }
            } catch (err) {
              settle("throw", err);
            }
          }
          function settle(type2, value) {
            switch (type2) {
              case "return":
                front.resolve({
                  value,
                  done: true
                });
                break;
              case "throw":
                front.reject(value);
                break;
              default:
                front.resolve({
                  value,
                  done: false
                });
                break;
            }
            front = front.next;
            if (front) {
              resume(front.key, front.arg);
            } else {
              back = null;
            }
          }
          this._invoke = send;
          if (typeof gen.return !== "function") {
            this.return = void 0;
          }
        }
        if (typeof Symbol === "function" && Symbol.asyncIterator) {
          AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
            return this;
          };
        }
        AsyncGenerator.prototype.next = function(arg) {
          return this._invoke("next", arg);
        };
        AsyncGenerator.prototype.throw = function(arg) {
          return this._invoke("throw", arg);
        };
        AsyncGenerator.prototype.return = function(arg) {
          return this._invoke("return", arg);
        };
        return {
          wrap: function(fn) {
            return function() {
              return new AsyncGenerator(fn.apply(this, arguments));
            };
          },
          await: function(value) {
            return new AwaitValue(value);
          }
        };
      }();
      var classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      var createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
              descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();
      var slicedToArray = function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = void 0;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i)
                break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"])
                _i["return"]();
            } finally {
              if (_d)
                throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();
      var MIN_TIMESTEP = 1e-3;
      var MAX_TIMESTEP = 1;
      var dataUri = function dataUri2(mimeType, svg) {
        return "data:" + mimeType + "," + encodeURIComponent(svg);
      };
      var lerp3 = function lerp4(a, b, t2) {
        return a + (b - a) * t2;
      };
      var isIOS2 = function() {
        var isIOS3 = /iPad|iPhone|iPod/.test(navigator.platform);
        return function() {
          return isIOS3;
        };
      }();
      var isWebViewAndroid = function() {
        var isWebViewAndroid2 = navigator.userAgent.indexOf("Version") !== -1 && navigator.userAgent.indexOf("Android") !== -1 && navigator.userAgent.indexOf("Chrome") !== -1;
        return function() {
          return isWebViewAndroid2;
        };
      }();
      var isSafari2 = function() {
        var isSafari3 = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return function() {
          return isSafari3;
        };
      }();
      var isFirefoxAndroid = function() {
        var isFirefoxAndroid2 = navigator.userAgent.indexOf("Firefox") !== -1 && navigator.userAgent.indexOf("Android") !== -1;
        return function() {
          return isFirefoxAndroid2;
        };
      }();
      var getChromeVersion = function() {
        var match = navigator.userAgent.match(/.*Chrome\/([0-9]+)/);
        var value = match ? parseInt(match[1], 10) : null;
        return function() {
          return value;
        };
      }();
      var isSafariWithoutDeviceMotion = function() {
        var value = false;
        value = isIOS2() && isSafari2() && navigator.userAgent.indexOf("13_4") !== -1;
        return function() {
          return value;
        };
      }();
      var isChromeWithoutDeviceMotion = function() {
        var value = false;
        if (getChromeVersion() === 65) {
          var match = navigator.userAgent.match(/.*Chrome\/([0-9\.]*)/);
          if (match) {
            var _match$1$split = match[1].split("."), _match$1$split2 = slicedToArray(_match$1$split, 4), major = _match$1$split2[0], minor = _match$1$split2[1], branch = _match$1$split2[2], build = _match$1$split2[3];
            value = parseInt(branch, 10) === 3325 && parseInt(build, 10) < 148;
          }
        }
        return function() {
          return value;
        };
      }();
      var isR7 = function() {
        var isR72 = navigator.userAgent.indexOf("R7 Build") !== -1;
        return function() {
          return isR72;
        };
      }();
      var isLandscapeMode = function isLandscapeMode2() {
        var rtn = window.orientation == 90 || window.orientation == -90;
        return isR7() ? !rtn : rtn;
      };
      var isTimestampDeltaValid = function isTimestampDeltaValid2(timestampDeltaS) {
        if (isNaN(timestampDeltaS)) {
          return false;
        }
        if (timestampDeltaS <= MIN_TIMESTEP) {
          return false;
        }
        if (timestampDeltaS > MAX_TIMESTEP) {
          return false;
        }
        return true;
      };
      var getScreenWidth = function getScreenWidth2() {
        return Math.max(window.screen.width, window.screen.height) * window.devicePixelRatio;
      };
      var getScreenHeight = function getScreenHeight2() {
        return Math.min(window.screen.width, window.screen.height) * window.devicePixelRatio;
      };
      var requestFullscreen = function requestFullscreen2(element) {
        if (isWebViewAndroid()) {
          return false;
        }
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else {
          return false;
        }
        return true;
      };
      var exitFullscreen = function exitFullscreen2() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else {
          return false;
        }
        return true;
      };
      var getFullscreenElement = function getFullscreenElement2() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      };
      var linkProgram = function linkProgram2(gl, vertexSource, fragmentSource, attribLocationMap) {
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        for (var attribName in attribLocationMap) {
          gl.bindAttribLocation(program, attribLocationMap[attribName], attribName);
        }
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return program;
      };
      var getProgramUniforms = function getProgramUniforms2(gl, program) {
        var uniforms = {};
        var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        var uniformName = "";
        for (var i = 0; i < uniformCount; i++) {
          var uniformInfo = gl.getActiveUniform(program, i);
          uniformName = uniformInfo.name.replace("[0]", "");
          uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
      };
      var orthoMatrix = function orthoMatrix2(out, left, right, bottom, top, near, far) {
        var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
      };
      var isMobile3 = function isMobile4() {
        var check = false;
        (function(a) {
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      };
      var extend = function extend2(dest, src2) {
        for (var key in src2) {
          if (src2.hasOwnProperty(key)) {
            dest[key] = src2[key];
          }
        }
        return dest;
      };
      var safariCssSizeWorkaround = function safariCssSizeWorkaround2(canvas) {
        if (isIOS2()) {
          var width = canvas.style.width;
          var height = canvas.style.height;
          canvas.style.width = parseInt(width) + 1 + "px";
          canvas.style.height = parseInt(height) + "px";
          setTimeout(function() {
            canvas.style.width = width;
            canvas.style.height = height;
          }, 100);
        }
        window.canvas = canvas;
      };
      var frameDataFromPose = function() {
        var piOver180 = Math.PI / 180;
        var rad45 = Math.PI * 0.25;
        function mat4_perspectiveFromFieldOfView(out, fov, near, far) {
          var upTan = Math.tan(fov ? fov.upDegrees * piOver180 : rad45), downTan = Math.tan(fov ? fov.downDegrees * piOver180 : rad45), leftTan = Math.tan(fov ? fov.leftDegrees * piOver180 : rad45), rightTan = Math.tan(fov ? fov.rightDegrees * piOver180 : rad45), xScale = 2 / (leftTan + rightTan), yScale = 2 / (upTan + downTan);
          out[0] = xScale;
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
          out[4] = 0;
          out[5] = yScale;
          out[6] = 0;
          out[7] = 0;
          out[8] = -((leftTan - rightTan) * xScale * 0.5);
          out[9] = (upTan - downTan) * yScale * 0.5;
          out[10] = far / (near - far);
          out[11] = -1;
          out[12] = 0;
          out[13] = 0;
          out[14] = far * near / (near - far);
          out[15] = 0;
          return out;
        }
        function mat4_fromRotationTranslation(out, q, v) {
          var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
          out[0] = 1 - (yy + zz);
          out[1] = xy + wz;
          out[2] = xz - wy;
          out[3] = 0;
          out[4] = xy - wz;
          out[5] = 1 - (xx + zz);
          out[6] = yz + wx;
          out[7] = 0;
          out[8] = xz + wy;
          out[9] = yz - wx;
          out[10] = 1 - (xx + yy);
          out[11] = 0;
          out[12] = v[0];
          out[13] = v[1];
          out[14] = v[2];
          out[15] = 1;
          return out;
        }
        function mat4_translate(out, a, v) {
          var x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
          if (a === out) {
            out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
          } else {
            a00 = a[0];
            a01 = a[1];
            a02 = a[2];
            a03 = a[3];
            a10 = a[4];
            a11 = a[5];
            a12 = a[6];
            a13 = a[7];
            a20 = a[8];
            a21 = a[9];
            a22 = a[10];
            a23 = a[11];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a03;
            out[4] = a10;
            out[5] = a11;
            out[6] = a12;
            out[7] = a13;
            out[8] = a20;
            out[9] = a21;
            out[10] = a22;
            out[11] = a23;
            out[12] = a00 * x + a10 * y + a20 * z + a[12];
            out[13] = a01 * x + a11 * y + a21 * z + a[13];
            out[14] = a02 * x + a12 * y + a22 * z + a[14];
            out[15] = a03 * x + a13 * y + a23 * z + a[15];
          }
          return out;
        }
        function mat4_invert(out, a) {
          var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
          if (!det) {
            return null;
          }
          det = 1 / det;
          out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
          out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
          out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
          out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
          out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
          out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
          out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
          out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
          out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
          out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
          out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
          out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
          out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
          out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
          out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
          out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
          return out;
        }
        var defaultOrientation = new Float32Array([0, 0, 0, 1]);
        var defaultPosition = new Float32Array([0, 0, 0]);
        function updateEyeMatrices(projection, view, pose, fov, offset, vrDisplay) {
          mat4_perspectiveFromFieldOfView(projection, fov || null, vrDisplay.depthNear, vrDisplay.depthFar);
          var orientation = pose.orientation || defaultOrientation;
          var position = pose.position || defaultPosition;
          mat4_fromRotationTranslation(view, orientation, position);
          if (offset)
            mat4_translate(view, view, offset);
          mat4_invert(view, view);
        }
        return function(frameData, pose, vrDisplay) {
          if (!frameData || !pose)
            return false;
          frameData.pose = pose;
          frameData.timestamp = pose.timestamp;
          updateEyeMatrices(frameData.leftProjectionMatrix, frameData.leftViewMatrix, pose, vrDisplay._getFieldOfView("left"), vrDisplay._getEyeOffset("left"), vrDisplay);
          updateEyeMatrices(frameData.rightProjectionMatrix, frameData.rightViewMatrix, pose, vrDisplay._getFieldOfView("right"), vrDisplay._getEyeOffset("right"), vrDisplay);
          return true;
        };
      }();
      var isInsideCrossOriginIFrame = function isInsideCrossOriginIFrame2() {
        var isFramed = window.self !== window.top;
        var refOrigin = getOriginFromUrl(document.referrer);
        var thisOrigin = getOriginFromUrl(window.location.href);
        return isFramed && refOrigin !== thisOrigin;
      };
      var getOriginFromUrl = function getOriginFromUrl2(url2) {
        var domainIdx;
        var protoSepIdx = url2.indexOf("://");
        if (protoSepIdx !== -1) {
          domainIdx = protoSepIdx + 3;
        } else {
          domainIdx = 0;
        }
        var domainEndIdx = url2.indexOf("/", domainIdx);
        if (domainEndIdx === -1) {
          domainEndIdx = url2.length;
        }
        return url2.substring(0, domainEndIdx);
      };
      var getQuaternionAngle = function getQuaternionAngle2(quat) {
        if (quat.w > 1) {
          console.warn("getQuaternionAngle: w > 1");
          return 0;
        }
        var angle2 = 2 * Math.acos(quat.w);
        return angle2;
      };
      var warnOnce = function() {
        var observedWarnings = {};
        return function(key, message) {
          if (observedWarnings[key] === void 0) {
            console.warn("webvr-polyfill: " + message);
            observedWarnings[key] = true;
          }
        };
      }();
      var deprecateWarning = function deprecateWarning2(deprecated, suggested) {
        var alternative = suggested ? "Please use " + suggested + " instead." : "";
        warnOnce(deprecated, deprecated + " has been deprecated. This may not work on native WebVR displays. " + alternative);
      };
      function WGLUPreserveGLState(gl, bindings, callback) {
        if (!bindings) {
          callback(gl);
          return;
        }
        var boundValues = [];
        var activeTexture = null;
        for (var i = 0; i < bindings.length; ++i) {
          var binding = bindings[i];
          switch (binding) {
            case gl.TEXTURE_BINDING_2D:
            case gl.TEXTURE_BINDING_CUBE_MAP:
              var textureUnit = bindings[++i];
              if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) {
                console.error("TEXTURE_BINDING_2D or TEXTURE_BINDING_CUBE_MAP must be followed by a valid texture unit");
                boundValues.push(null, null);
                break;
              }
              if (!activeTexture) {
                activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
              }
              gl.activeTexture(textureUnit);
              boundValues.push(gl.getParameter(binding), null);
              break;
            case gl.ACTIVE_TEXTURE:
              activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
              boundValues.push(null);
              break;
            default:
              boundValues.push(gl.getParameter(binding));
              break;
          }
        }
        callback(gl);
        for (var i = 0; i < bindings.length; ++i) {
          var binding = bindings[i];
          var boundValue = boundValues[i];
          switch (binding) {
            case gl.ACTIVE_TEXTURE:
              break;
            case gl.ARRAY_BUFFER_BINDING:
              gl.bindBuffer(gl.ARRAY_BUFFER, boundValue);
              break;
            case gl.COLOR_CLEAR_VALUE:
              gl.clearColor(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
              break;
            case gl.COLOR_WRITEMASK:
              gl.colorMask(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
              break;
            case gl.CURRENT_PROGRAM:
              gl.useProgram(boundValue);
              break;
            case gl.ELEMENT_ARRAY_BUFFER_BINDING:
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundValue);
              break;
            case gl.FRAMEBUFFER_BINDING:
              gl.bindFramebuffer(gl.FRAMEBUFFER, boundValue);
              break;
            case gl.RENDERBUFFER_BINDING:
              gl.bindRenderbuffer(gl.RENDERBUFFER, boundValue);
              break;
            case gl.TEXTURE_BINDING_2D:
              var textureUnit = bindings[++i];
              if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
                break;
              gl.activeTexture(textureUnit);
              gl.bindTexture(gl.TEXTURE_2D, boundValue);
              break;
            case gl.TEXTURE_BINDING_CUBE_MAP:
              var textureUnit = bindings[++i];
              if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
                break;
              gl.activeTexture(textureUnit);
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, boundValue);
              break;
            case gl.VIEWPORT:
              gl.viewport(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
              break;
            case gl.BLEND:
            case gl.CULL_FACE:
            case gl.DEPTH_TEST:
            case gl.SCISSOR_TEST:
            case gl.STENCIL_TEST:
              if (boundValue) {
                gl.enable(binding);
              } else {
                gl.disable(binding);
              }
              break;
            default:
              console.log("No GL restore behavior for 0x" + binding.toString(16));
              break;
          }
          if (activeTexture) {
            gl.activeTexture(activeTexture);
          }
        }
      }
      var glPreserveState = WGLUPreserveGLState;
      var distortionVS = ["attribute vec2 position;", "attribute vec3 texCoord;", "varying vec2 vTexCoord;", "uniform vec4 viewportOffsetScale[2];", "void main() {", "  vec4 viewport = viewportOffsetScale[int(texCoord.z)];", "  vTexCoord = (texCoord.xy * viewport.zw) + viewport.xy;", "  gl_Position = vec4( position, 1.0, 1.0 );", "}"].join("\n");
      var distortionFS = ["precision mediump float;", "uniform sampler2D diffuse;", "varying vec2 vTexCoord;", "void main() {", "  gl_FragColor = texture2D(diffuse, vTexCoord);", "}"].join("\n");
      function CardboardDistorter(gl, cardboardUI, bufferScale, dirtySubmitFrameBindings) {
        this.gl = gl;
        this.cardboardUI = cardboardUI;
        this.bufferScale = bufferScale;
        this.dirtySubmitFrameBindings = dirtySubmitFrameBindings;
        this.ctxAttribs = gl.getContextAttributes();
        this.instanceExt = gl.getExtension("ANGLE_instanced_arrays");
        this.meshWidth = 20;
        this.meshHeight = 20;
        this.bufferWidth = gl.drawingBufferWidth;
        this.bufferHeight = gl.drawingBufferHeight;
        this.realBindFramebuffer = gl.bindFramebuffer;
        this.realEnable = gl.enable;
        this.realDisable = gl.disable;
        this.realColorMask = gl.colorMask;
        this.realClearColor = gl.clearColor;
        this.realViewport = gl.viewport;
        if (!isIOS2()) {
          this.realCanvasWidth = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, "width");
          this.realCanvasHeight = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, "height");
        }
        this.isPatched = false;
        this.lastBoundFramebuffer = null;
        this.cullFace = false;
        this.depthTest = false;
        this.blend = false;
        this.scissorTest = false;
        this.stencilTest = false;
        this.viewport = [0, 0, 0, 0];
        this.colorMask = [true, true, true, true];
        this.clearColor = [0, 0, 0, 0];
        this.attribs = {
          position: 0,
          texCoord: 1
        };
        this.program = linkProgram(gl, distortionVS, distortionFS, this.attribs);
        this.uniforms = getProgramUniforms(gl, this.program);
        this.viewportOffsetScale = new Float32Array(8);
        this.setTextureBounds();
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indexCount = 0;
        this.renderTarget = gl.createTexture();
        this.framebuffer = gl.createFramebuffer();
        this.depthStencilBuffer = null;
        this.depthBuffer = null;
        this.stencilBuffer = null;
        if (this.ctxAttribs.depth && this.ctxAttribs.stencil) {
          this.depthStencilBuffer = gl.createRenderbuffer();
        } else if (this.ctxAttribs.depth) {
          this.depthBuffer = gl.createRenderbuffer();
        } else if (this.ctxAttribs.stencil) {
          this.stencilBuffer = gl.createRenderbuffer();
        }
        this.patch();
        this.onResize();
      }
      CardboardDistorter.prototype.destroy = function() {
        var gl = this.gl;
        this.unpatch();
        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteTexture(this.renderTarget);
        gl.deleteFramebuffer(this.framebuffer);
        if (this.depthStencilBuffer) {
          gl.deleteRenderbuffer(this.depthStencilBuffer);
        }
        if (this.depthBuffer) {
          gl.deleteRenderbuffer(this.depthBuffer);
        }
        if (this.stencilBuffer) {
          gl.deleteRenderbuffer(this.stencilBuffer);
        }
        if (this.cardboardUI) {
          this.cardboardUI.destroy();
        }
      };
      CardboardDistorter.prototype.onResize = function() {
        var gl = this.gl;
        var self2 = this;
        var glState = [gl.RENDERBUFFER_BINDING, gl.TEXTURE_BINDING_2D, gl.TEXTURE0];
        glPreserveState(gl, glState, function(gl2) {
          self2.realBindFramebuffer.call(gl2, gl2.FRAMEBUFFER, null);
          if (self2.scissorTest) {
            self2.realDisable.call(gl2, gl2.SCISSOR_TEST);
          }
          self2.realColorMask.call(gl2, true, true, true, true);
          self2.realViewport.call(gl2, 0, 0, gl2.drawingBufferWidth, gl2.drawingBufferHeight);
          self2.realClearColor.call(gl2, 0, 0, 0, 1);
          gl2.clear(gl2.COLOR_BUFFER_BIT);
          self2.realBindFramebuffer.call(gl2, gl2.FRAMEBUFFER, self2.framebuffer);
          gl2.bindTexture(gl2.TEXTURE_2D, self2.renderTarget);
          gl2.texImage2D(gl2.TEXTURE_2D, 0, self2.ctxAttribs.alpha ? gl2.RGBA : gl2.RGB, self2.bufferWidth, self2.bufferHeight, 0, self2.ctxAttribs.alpha ? gl2.RGBA : gl2.RGB, gl2.UNSIGNED_BYTE, null);
          gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, gl2.LINEAR);
          gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, gl2.LINEAR);
          gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
          gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);
          gl2.framebufferTexture2D(gl2.FRAMEBUFFER, gl2.COLOR_ATTACHMENT0, gl2.TEXTURE_2D, self2.renderTarget, 0);
          if (self2.ctxAttribs.depth && self2.ctxAttribs.stencil) {
            gl2.bindRenderbuffer(gl2.RENDERBUFFER, self2.depthStencilBuffer);
            gl2.renderbufferStorage(gl2.RENDERBUFFER, gl2.DEPTH_STENCIL, self2.bufferWidth, self2.bufferHeight);
            gl2.framebufferRenderbuffer(gl2.FRAMEBUFFER, gl2.DEPTH_STENCIL_ATTACHMENT, gl2.RENDERBUFFER, self2.depthStencilBuffer);
          } else if (self2.ctxAttribs.depth) {
            gl2.bindRenderbuffer(gl2.RENDERBUFFER, self2.depthBuffer);
            gl2.renderbufferStorage(gl2.RENDERBUFFER, gl2.DEPTH_COMPONENT16, self2.bufferWidth, self2.bufferHeight);
            gl2.framebufferRenderbuffer(gl2.FRAMEBUFFER, gl2.DEPTH_ATTACHMENT, gl2.RENDERBUFFER, self2.depthBuffer);
          } else if (self2.ctxAttribs.stencil) {
            gl2.bindRenderbuffer(gl2.RENDERBUFFER, self2.stencilBuffer);
            gl2.renderbufferStorage(gl2.RENDERBUFFER, gl2.STENCIL_INDEX8, self2.bufferWidth, self2.bufferHeight);
            gl2.framebufferRenderbuffer(gl2.FRAMEBUFFER, gl2.STENCIL_ATTACHMENT, gl2.RENDERBUFFER, self2.stencilBuffer);
          }
          if (!gl2.checkFramebufferStatus(gl2.FRAMEBUFFER) === gl2.FRAMEBUFFER_COMPLETE) {
            console.error("Framebuffer incomplete!");
          }
          self2.realBindFramebuffer.call(gl2, gl2.FRAMEBUFFER, self2.lastBoundFramebuffer);
          if (self2.scissorTest) {
            self2.realEnable.call(gl2, gl2.SCISSOR_TEST);
          }
          self2.realColorMask.apply(gl2, self2.colorMask);
          self2.realViewport.apply(gl2, self2.viewport);
          self2.realClearColor.apply(gl2, self2.clearColor);
        });
        if (this.cardboardUI) {
          this.cardboardUI.onResize();
        }
      };
      CardboardDistorter.prototype.patch = function() {
        if (this.isPatched) {
          return;
        }
        var self2 = this;
        var canvas = this.gl.canvas;
        var gl = this.gl;
        if (!isIOS2()) {
          canvas.width = getScreenWidth() * this.bufferScale;
          canvas.height = getScreenHeight() * this.bufferScale;
          Object.defineProperty(canvas, "width", {
            configurable: true,
            enumerable: true,
            get: function get() {
              return self2.bufferWidth;
            },
            set: function set2(value) {
              self2.bufferWidth = value;
              self2.realCanvasWidth.set.call(canvas, value);
              self2.onResize();
            }
          });
          Object.defineProperty(canvas, "height", {
            configurable: true,
            enumerable: true,
            get: function get() {
              return self2.bufferHeight;
            },
            set: function set2(value) {
              self2.bufferHeight = value;
              self2.realCanvasHeight.set.call(canvas, value);
              self2.onResize();
            }
          });
        }
        this.lastBoundFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        if (this.lastBoundFramebuffer == null) {
          this.lastBoundFramebuffer = this.framebuffer;
          this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        }
        this.gl.bindFramebuffer = function(target, framebuffer) {
          self2.lastBoundFramebuffer = framebuffer ? framebuffer : self2.framebuffer;
          self2.realBindFramebuffer.call(gl, target, self2.lastBoundFramebuffer);
        };
        this.cullFace = gl.getParameter(gl.CULL_FACE);
        this.depthTest = gl.getParameter(gl.DEPTH_TEST);
        this.blend = gl.getParameter(gl.BLEND);
        this.scissorTest = gl.getParameter(gl.SCISSOR_TEST);
        this.stencilTest = gl.getParameter(gl.STENCIL_TEST);
        gl.enable = function(pname) {
          switch (pname) {
            case gl.CULL_FACE:
              self2.cullFace = true;
              break;
            case gl.DEPTH_TEST:
              self2.depthTest = true;
              break;
            case gl.BLEND:
              self2.blend = true;
              break;
            case gl.SCISSOR_TEST:
              self2.scissorTest = true;
              break;
            case gl.STENCIL_TEST:
              self2.stencilTest = true;
              break;
          }
          self2.realEnable.call(gl, pname);
        };
        gl.disable = function(pname) {
          switch (pname) {
            case gl.CULL_FACE:
              self2.cullFace = false;
              break;
            case gl.DEPTH_TEST:
              self2.depthTest = false;
              break;
            case gl.BLEND:
              self2.blend = false;
              break;
            case gl.SCISSOR_TEST:
              self2.scissorTest = false;
              break;
            case gl.STENCIL_TEST:
              self2.stencilTest = false;
              break;
          }
          self2.realDisable.call(gl, pname);
        };
        this.colorMask = gl.getParameter(gl.COLOR_WRITEMASK);
        gl.colorMask = function(r, g, b, a) {
          self2.colorMask[0] = r;
          self2.colorMask[1] = g;
          self2.colorMask[2] = b;
          self2.colorMask[3] = a;
          self2.realColorMask.call(gl, r, g, b, a);
        };
        this.clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
        gl.clearColor = function(r, g, b, a) {
          self2.clearColor[0] = r;
          self2.clearColor[1] = g;
          self2.clearColor[2] = b;
          self2.clearColor[3] = a;
          self2.realClearColor.call(gl, r, g, b, a);
        };
        this.viewport = gl.getParameter(gl.VIEWPORT);
        gl.viewport = function(x, y, w, h) {
          self2.viewport[0] = x;
          self2.viewport[1] = y;
          self2.viewport[2] = w;
          self2.viewport[3] = h;
          self2.realViewport.call(gl, x, y, w, h);
        };
        this.isPatched = true;
        safariCssSizeWorkaround(canvas);
      };
      CardboardDistorter.prototype.unpatch = function() {
        if (!this.isPatched) {
          return;
        }
        var gl = this.gl;
        var canvas = this.gl.canvas;
        if (!isIOS2()) {
          Object.defineProperty(canvas, "width", this.realCanvasWidth);
          Object.defineProperty(canvas, "height", this.realCanvasHeight);
        }
        canvas.width = this.bufferWidth;
        canvas.height = this.bufferHeight;
        gl.bindFramebuffer = this.realBindFramebuffer;
        gl.enable = this.realEnable;
        gl.disable = this.realDisable;
        gl.colorMask = this.realColorMask;
        gl.clearColor = this.realClearColor;
        gl.viewport = this.realViewport;
        if (this.lastBoundFramebuffer == this.framebuffer) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        this.isPatched = false;
        setTimeout(function() {
          safariCssSizeWorkaround(canvas);
        }, 1);
      };
      CardboardDistorter.prototype.setTextureBounds = function(leftBounds, rightBounds) {
        if (!leftBounds) {
          leftBounds = [0, 0, 0.5, 1];
        }
        if (!rightBounds) {
          rightBounds = [0.5, 0, 0.5, 1];
        }
        this.viewportOffsetScale[0] = leftBounds[0];
        this.viewportOffsetScale[1] = leftBounds[1];
        this.viewportOffsetScale[2] = leftBounds[2];
        this.viewportOffsetScale[3] = leftBounds[3];
        this.viewportOffsetScale[4] = rightBounds[0];
        this.viewportOffsetScale[5] = rightBounds[1];
        this.viewportOffsetScale[6] = rightBounds[2];
        this.viewportOffsetScale[7] = rightBounds[3];
      };
      CardboardDistorter.prototype.submitFrame = function() {
        var gl = this.gl;
        var self2 = this;
        var glState = [];
        if (!this.dirtySubmitFrameBindings) {
          glState.push(gl.CURRENT_PROGRAM, gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING, gl.TEXTURE_BINDING_2D, gl.TEXTURE0);
        }
        glPreserveState(gl, glState, function(gl2) {
          self2.realBindFramebuffer.call(gl2, gl2.FRAMEBUFFER, null);
          var positionDivisor = 0;
          var texCoordDivisor = 0;
          if (self2.instanceExt) {
            positionDivisor = gl2.getVertexAttrib(self2.attribs.position, self2.instanceExt.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE);
            texCoordDivisor = gl2.getVertexAttrib(self2.attribs.texCoord, self2.instanceExt.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE);
          }
          if (self2.cullFace) {
            self2.realDisable.call(gl2, gl2.CULL_FACE);
          }
          if (self2.depthTest) {
            self2.realDisable.call(gl2, gl2.DEPTH_TEST);
          }
          if (self2.blend) {
            self2.realDisable.call(gl2, gl2.BLEND);
          }
          if (self2.scissorTest) {
            self2.realDisable.call(gl2, gl2.SCISSOR_TEST);
          }
          if (self2.stencilTest) {
            self2.realDisable.call(gl2, gl2.STENCIL_TEST);
          }
          self2.realColorMask.call(gl2, true, true, true, true);
          self2.realViewport.call(gl2, 0, 0, gl2.drawingBufferWidth, gl2.drawingBufferHeight);
          if (self2.ctxAttribs.alpha || isIOS2()) {
            self2.realClearColor.call(gl2, 0, 0, 0, 1);
            gl2.clear(gl2.COLOR_BUFFER_BIT);
          }
          gl2.useProgram(self2.program);
          gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, self2.indexBuffer);
          gl2.bindBuffer(gl2.ARRAY_BUFFER, self2.vertexBuffer);
          gl2.enableVertexAttribArray(self2.attribs.position);
          gl2.enableVertexAttribArray(self2.attribs.texCoord);
          gl2.vertexAttribPointer(self2.attribs.position, 2, gl2.FLOAT, false, 20, 0);
          gl2.vertexAttribPointer(self2.attribs.texCoord, 3, gl2.FLOAT, false, 20, 8);
          if (self2.instanceExt) {
            if (positionDivisor != 0) {
              self2.instanceExt.vertexAttribDivisorANGLE(self2.attribs.position, 0);
            }
            if (texCoordDivisor != 0) {
              self2.instanceExt.vertexAttribDivisorANGLE(self2.attribs.texCoord, 0);
            }
          }
          gl2.activeTexture(gl2.TEXTURE0);
          gl2.uniform1i(self2.uniforms.diffuse, 0);
          gl2.bindTexture(gl2.TEXTURE_2D, self2.renderTarget);
          gl2.uniform4fv(self2.uniforms.viewportOffsetScale, self2.viewportOffsetScale);
          gl2.drawElements(gl2.TRIANGLES, self2.indexCount, gl2.UNSIGNED_SHORT, 0);
          if (self2.cardboardUI) {
            self2.cardboardUI.renderNoState();
          }
          self2.realBindFramebuffer.call(self2.gl, gl2.FRAMEBUFFER, self2.framebuffer);
          if (!self2.ctxAttribs.preserveDrawingBuffer) {
            self2.realClearColor.call(gl2, 0, 0, 0, 0);
            gl2.clear(gl2.COLOR_BUFFER_BIT);
          }
          if (!self2.dirtySubmitFrameBindings) {
            self2.realBindFramebuffer.call(gl2, gl2.FRAMEBUFFER, self2.lastBoundFramebuffer);
          }
          if (self2.cullFace) {
            self2.realEnable.call(gl2, gl2.CULL_FACE);
          }
          if (self2.depthTest) {
            self2.realEnable.call(gl2, gl2.DEPTH_TEST);
          }
          if (self2.blend) {
            self2.realEnable.call(gl2, gl2.BLEND);
          }
          if (self2.scissorTest) {
            self2.realEnable.call(gl2, gl2.SCISSOR_TEST);
          }
          if (self2.stencilTest) {
            self2.realEnable.call(gl2, gl2.STENCIL_TEST);
          }
          self2.realColorMask.apply(gl2, self2.colorMask);
          self2.realViewport.apply(gl2, self2.viewport);
          if (self2.ctxAttribs.alpha || !self2.ctxAttribs.preserveDrawingBuffer) {
            self2.realClearColor.apply(gl2, self2.clearColor);
          }
          if (self2.instanceExt) {
            if (positionDivisor != 0) {
              self2.instanceExt.vertexAttribDivisorANGLE(self2.attribs.position, positionDivisor);
            }
            if (texCoordDivisor != 0) {
              self2.instanceExt.vertexAttribDivisorANGLE(self2.attribs.texCoord, texCoordDivisor);
            }
          }
        });
        if (isIOS2()) {
          var canvas = gl.canvas;
          if (canvas.width != self2.bufferWidth || canvas.height != self2.bufferHeight) {
            self2.bufferWidth = canvas.width;
            self2.bufferHeight = canvas.height;
            self2.onResize();
          }
        }
      };
      CardboardDistorter.prototype.updateDeviceInfo = function(deviceInfo) {
        var gl = this.gl;
        var self2 = this;
        var glState = [gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING];
        glPreserveState(gl, glState, function(gl2) {
          var vertices = self2.computeMeshVertices_(self2.meshWidth, self2.meshHeight, deviceInfo);
          gl2.bindBuffer(gl2.ARRAY_BUFFER, self2.vertexBuffer);
          gl2.bufferData(gl2.ARRAY_BUFFER, vertices, gl2.STATIC_DRAW);
          if (!self2.indexCount) {
            var indices = self2.computeMeshIndices_(self2.meshWidth, self2.meshHeight);
            gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, self2.indexBuffer);
            gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, indices, gl2.STATIC_DRAW);
            self2.indexCount = indices.length;
          }
        });
      };
      CardboardDistorter.prototype.computeMeshVertices_ = function(width, height, deviceInfo) {
        var vertices = new Float32Array(2 * width * height * 5);
        var lensFrustum = deviceInfo.getLeftEyeVisibleTanAngles();
        var noLensFrustum = deviceInfo.getLeftEyeNoLensTanAngles();
        var viewport = deviceInfo.getLeftEyeVisibleScreenRect(noLensFrustum);
        var vidx = 0;
        for (var e = 0; e < 2; e++) {
          for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++, vidx++) {
              var u = i / (width - 1);
              var v = j / (height - 1);
              var s = u;
              var t2 = v;
              var x = lerp3(lensFrustum[0], lensFrustum[2], u);
              var y = lerp3(lensFrustum[3], lensFrustum[1], v);
              var d = Math.sqrt(x * x + y * y);
              var r = deviceInfo.distortion.distortInverse(d);
              var p = x * r / d;
              var q = y * r / d;
              u = (p - noLensFrustum[0]) / (noLensFrustum[2] - noLensFrustum[0]);
              v = (q - noLensFrustum[3]) / (noLensFrustum[1] - noLensFrustum[3]);
              u = (viewport.x + u * viewport.width - 0.5) * 2;
              v = (viewport.y + v * viewport.height - 0.5) * 2;
              vertices[vidx * 5 + 0] = u;
              vertices[vidx * 5 + 1] = v;
              vertices[vidx * 5 + 2] = s;
              vertices[vidx * 5 + 3] = t2;
              vertices[vidx * 5 + 4] = e;
            }
          }
          var w = lensFrustum[2] - lensFrustum[0];
          lensFrustum[0] = -(w + lensFrustum[0]);
          lensFrustum[2] = w - lensFrustum[2];
          w = noLensFrustum[2] - noLensFrustum[0];
          noLensFrustum[0] = -(w + noLensFrustum[0]);
          noLensFrustum[2] = w - noLensFrustum[2];
          viewport.x = 1 - (viewport.x + viewport.width);
        }
        return vertices;
      };
      CardboardDistorter.prototype.computeMeshIndices_ = function(width, height) {
        var indices = new Uint16Array(2 * (width - 1) * (height - 1) * 6);
        var halfwidth = width / 2;
        var halfheight = height / 2;
        var vidx = 0;
        var iidx = 0;
        for (var e = 0; e < 2; e++) {
          for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++, vidx++) {
              if (i == 0 || j == 0)
                continue;
              if (i <= halfwidth == j <= halfheight) {
                indices[iidx++] = vidx;
                indices[iidx++] = vidx - width - 1;
                indices[iidx++] = vidx - width;
                indices[iidx++] = vidx - width - 1;
                indices[iidx++] = vidx;
                indices[iidx++] = vidx - 1;
              } else {
                indices[iidx++] = vidx - 1;
                indices[iidx++] = vidx - width;
                indices[iidx++] = vidx;
                indices[iidx++] = vidx - width;
                indices[iidx++] = vidx - 1;
                indices[iidx++] = vidx - width - 1;
              }
            }
          }
        }
        return indices;
      };
      CardboardDistorter.prototype.getOwnPropertyDescriptor_ = function(proto, attrName) {
        var descriptor = Object.getOwnPropertyDescriptor(proto, attrName);
        if (descriptor.get === void 0 || descriptor.set === void 0) {
          descriptor.configurable = true;
          descriptor.enumerable = true;
          descriptor.get = function() {
            return this.getAttribute(attrName);
          };
          descriptor.set = function(val) {
            this.setAttribute(attrName, val);
          };
        }
        return descriptor;
      };
      var uiVS = ["attribute vec2 position;", "uniform mat4 projectionMat;", "void main() {", "  gl_Position = projectionMat * vec4( position, -1.0, 1.0 );", "}"].join("\n");
      var uiFS = ["precision mediump float;", "uniform vec4 color;", "void main() {", "  gl_FragColor = color;", "}"].join("\n");
      var DEG2RAD = Math.PI / 180;
      var kAnglePerGearSection = 60;
      var kOuterRimEndAngle = 12;
      var kInnerRimBeginAngle = 20;
      var kOuterRadius = 1;
      var kMiddleRadius = 0.75;
      var kInnerRadius = 0.3125;
      var kCenterLineThicknessDp = 4;
      var kButtonWidthDp = 28;
      var kTouchSlopFactor = 1.5;
      function CardboardUI(gl) {
        this.gl = gl;
        this.attribs = {
          position: 0
        };
        this.program = linkProgram(gl, uiVS, uiFS, this.attribs);
        this.uniforms = getProgramUniforms(gl, this.program);
        this.vertexBuffer = gl.createBuffer();
        this.gearOffset = 0;
        this.gearVertexCount = 0;
        this.arrowOffset = 0;
        this.arrowVertexCount = 0;
        this.projMat = new Float32Array(16);
        this.listener = null;
        this.onResize();
      }
      CardboardUI.prototype.destroy = function() {
        var gl = this.gl;
        if (this.listener) {
          gl.canvas.removeEventListener("click", this.listener, false);
        }
        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
      };
      CardboardUI.prototype.listen = function(optionsCallback, backCallback) {
        var canvas = this.gl.canvas;
        this.listener = function(event) {
          var midline = canvas.clientWidth / 2;
          var buttonSize = kButtonWidthDp * kTouchSlopFactor;
          if (event.clientX > midline - buttonSize && event.clientX < midline + buttonSize && event.clientY > canvas.clientHeight - buttonSize) {
            optionsCallback(event);
          } else if (event.clientX < buttonSize && event.clientY < buttonSize) {
            backCallback(event);
          }
        };
        canvas.addEventListener("click", this.listener, false);
      };
      CardboardUI.prototype.onResize = function() {
        var gl = this.gl;
        var self2 = this;
        var glState = [gl.ARRAY_BUFFER_BINDING];
        glPreserveState(gl, glState, function(gl2) {
          var vertices = [];
          var midline = gl2.drawingBufferWidth / 2;
          var physicalPixels = Math.max(screen.width, screen.height) * window.devicePixelRatio;
          var scalingRatio = gl2.drawingBufferWidth / physicalPixels;
          var dps = scalingRatio * window.devicePixelRatio;
          var lineWidth = kCenterLineThicknessDp * dps / 2;
          var buttonSize = kButtonWidthDp * kTouchSlopFactor * dps;
          var buttonScale = kButtonWidthDp * dps / 2;
          var buttonBorder = (kButtonWidthDp * kTouchSlopFactor - kButtonWidthDp) * dps;
          vertices.push(midline - lineWidth, buttonSize);
          vertices.push(midline - lineWidth, gl2.drawingBufferHeight);
          vertices.push(midline + lineWidth, buttonSize);
          vertices.push(midline + lineWidth, gl2.drawingBufferHeight);
          self2.gearOffset = vertices.length / 2;
          function addGearSegment(theta, r) {
            var angle2 = (90 - theta) * DEG2RAD;
            var x = Math.cos(angle2);
            var y = Math.sin(angle2);
            vertices.push(kInnerRadius * x * buttonScale + midline, kInnerRadius * y * buttonScale + buttonScale);
            vertices.push(r * x * buttonScale + midline, r * y * buttonScale + buttonScale);
          }
          for (var i = 0; i <= 6; i++) {
            var segmentTheta = i * kAnglePerGearSection;
            addGearSegment(segmentTheta, kOuterRadius);
            addGearSegment(segmentTheta + kOuterRimEndAngle, kOuterRadius);
            addGearSegment(segmentTheta + kInnerRimBeginAngle, kMiddleRadius);
            addGearSegment(segmentTheta + (kAnglePerGearSection - kInnerRimBeginAngle), kMiddleRadius);
            addGearSegment(segmentTheta + (kAnglePerGearSection - kOuterRimEndAngle), kOuterRadius);
          }
          self2.gearVertexCount = vertices.length / 2 - self2.gearOffset;
          self2.arrowOffset = vertices.length / 2;
          function addArrowVertex(x, y) {
            vertices.push(buttonBorder + x, gl2.drawingBufferHeight - buttonBorder - y);
          }
          var angledLineWidth = lineWidth / Math.sin(45 * DEG2RAD);
          addArrowVertex(0, buttonScale);
          addArrowVertex(buttonScale, 0);
          addArrowVertex(buttonScale + angledLineWidth, angledLineWidth);
          addArrowVertex(angledLineWidth, buttonScale + angledLineWidth);
          addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
          addArrowVertex(0, buttonScale);
          addArrowVertex(buttonScale, buttonScale * 2);
          addArrowVertex(buttonScale + angledLineWidth, buttonScale * 2 - angledLineWidth);
          addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
          addArrowVertex(0, buttonScale);
          addArrowVertex(angledLineWidth, buttonScale - lineWidth);
          addArrowVertex(kButtonWidthDp * dps, buttonScale - lineWidth);
          addArrowVertex(angledLineWidth, buttonScale + lineWidth);
          addArrowVertex(kButtonWidthDp * dps, buttonScale + lineWidth);
          self2.arrowVertexCount = vertices.length / 2 - self2.arrowOffset;
          gl2.bindBuffer(gl2.ARRAY_BUFFER, self2.vertexBuffer);
          gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(vertices), gl2.STATIC_DRAW);
        });
      };
      CardboardUI.prototype.render = function() {
        var gl = this.gl;
        var self2 = this;
        var glState = [gl.CULL_FACE, gl.DEPTH_TEST, gl.BLEND, gl.SCISSOR_TEST, gl.STENCIL_TEST, gl.COLOR_WRITEMASK, gl.VIEWPORT, gl.CURRENT_PROGRAM, gl.ARRAY_BUFFER_BINDING];
        glPreserveState(gl, glState, function(gl2) {
          gl2.disable(gl2.CULL_FACE);
          gl2.disable(gl2.DEPTH_TEST);
          gl2.disable(gl2.BLEND);
          gl2.disable(gl2.SCISSOR_TEST);
          gl2.disable(gl2.STENCIL_TEST);
          gl2.colorMask(true, true, true, true);
          gl2.viewport(0, 0, gl2.drawingBufferWidth, gl2.drawingBufferHeight);
          self2.renderNoState();
        });
      };
      CardboardUI.prototype.renderNoState = function() {
        var gl = this.gl;
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.attribs.position);
        gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 8, 0);
        gl.uniform4f(this.uniforms.color, 1, 1, 1, 1);
        orthoMatrix(this.projMat, 0, gl.drawingBufferWidth, 0, gl.drawingBufferHeight, 0.1, 1024);
        gl.uniformMatrix4fv(this.uniforms.projectionMat, false, this.projMat);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.drawArrays(gl.TRIANGLE_STRIP, this.gearOffset, this.gearVertexCount);
        gl.drawArrays(gl.TRIANGLE_STRIP, this.arrowOffset, this.arrowVertexCount);
      };
      function Distortion(coefficients) {
        this.coefficients = coefficients;
      }
      Distortion.prototype.distortInverse = function(radius) {
        var r0 = 0;
        var r1 = 1;
        var dr0 = radius - this.distort(r0);
        while (Math.abs(r1 - r0) > 1e-4) {
          var dr1 = radius - this.distort(r1);
          var r2 = r1 - dr1 * ((r1 - r0) / (dr1 - dr0));
          r0 = r1;
          r1 = r2;
          dr0 = dr1;
        }
        return r1;
      };
      Distortion.prototype.distort = function(radius) {
        var r2 = radius * radius;
        var ret = 0;
        for (var i = 0; i < this.coefficients.length; i++) {
          ret = r2 * (ret + this.coefficients[i]);
        }
        return (ret + 1) * radius;
      };
      var degToRad = Math.PI / 180;
      var radToDeg = 180 / Math.PI;
      var Vector34 = function Vector35(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
      };
      Vector34.prototype = {
        constructor: Vector34,
        set: function set2(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        },
        copy: function copy5(v) {
          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          return this;
        },
        length: function length3() {
          return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        normalize: function normalize4() {
          var scalar = this.length();
          if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.multiplyScalar(invScalar);
          } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
          }
          return this;
        },
        multiplyScalar: function multiplyScalar(scalar) {
          this.x *= scalar;
          this.y *= scalar;
          this.z *= scalar;
        },
        applyQuaternion: function applyQuaternion(q) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var qx = q.x;
          var qy = q.y;
          var qz = q.z;
          var qw = q.w;
          var ix = qw * x + qy * z - qz * y;
          var iy = qw * y + qz * x - qx * z;
          var iz = qw * z + qx * y - qy * x;
          var iw = -qx * x - qy * y - qz * z;
          this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
          this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
          this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
          return this;
        },
        dot: function dot3(v) {
          return this.x * v.x + this.y * v.y + this.z * v.z;
        },
        crossVectors: function crossVectors(a, b) {
          var ax = a.x, ay = a.y, az = a.z;
          var bx = b.x, by = b.y, bz = b.z;
          this.x = ay * bz - az * by;
          this.y = az * bx - ax * bz;
          this.z = ax * by - ay * bx;
          return this;
        }
      };
      var Quaternion2 = function Quaternion3(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w !== void 0 ? w : 1;
      };
      Quaternion2.prototype = {
        constructor: Quaternion2,
        set: function set2(x, y, z, w) {
          this.x = x;
          this.y = y;
          this.z = z;
          this.w = w;
          return this;
        },
        copy: function copy5(quaternion) {
          this.x = quaternion.x;
          this.y = quaternion.y;
          this.z = quaternion.z;
          this.w = quaternion.w;
          return this;
        },
        setFromEulerXYZ: function setFromEulerXYZ(x, y, z) {
          var c1 = Math.cos(x / 2);
          var c2 = Math.cos(y / 2);
          var c3 = Math.cos(z / 2);
          var s1 = Math.sin(x / 2);
          var s2 = Math.sin(y / 2);
          var s3 = Math.sin(z / 2);
          this.x = s1 * c2 * c3 + c1 * s2 * s3;
          this.y = c1 * s2 * c3 - s1 * c2 * s3;
          this.z = c1 * c2 * s3 + s1 * s2 * c3;
          this.w = c1 * c2 * c3 - s1 * s2 * s3;
          return this;
        },
        setFromEulerYXZ: function setFromEulerYXZ(x, y, z) {
          var c1 = Math.cos(x / 2);
          var c2 = Math.cos(y / 2);
          var c3 = Math.cos(z / 2);
          var s1 = Math.sin(x / 2);
          var s2 = Math.sin(y / 2);
          var s3 = Math.sin(z / 2);
          this.x = s1 * c2 * c3 + c1 * s2 * s3;
          this.y = c1 * s2 * c3 - s1 * c2 * s3;
          this.z = c1 * c2 * s3 - s1 * s2 * c3;
          this.w = c1 * c2 * c3 + s1 * s2 * s3;
          return this;
        },
        setFromAxisAngle: function setFromAxisAngle(axis, angle2) {
          var halfAngle = angle2 / 2, s = Math.sin(halfAngle);
          this.x = axis.x * s;
          this.y = axis.y * s;
          this.z = axis.z * s;
          this.w = Math.cos(halfAngle);
          return this;
        },
        multiply: function multiply3(q) {
          return this.multiplyQuaternions(this, q);
        },
        multiplyQuaternions: function multiplyQuaternions(a, b) {
          var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
          var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
          this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
          this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
          this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
          this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
          return this;
        },
        inverse: function inverse() {
          this.x *= -1;
          this.y *= -1;
          this.z *= -1;
          this.normalize();
          return this;
        },
        normalize: function normalize4() {
          var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
          if (l === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
          } else {
            l = 1 / l;
            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;
          }
          return this;
        },
        slerp: function slerp2(qb, t2) {
          if (t2 === 0)
            return this;
          if (t2 === 1)
            return this.copy(qb);
          var x = this.x, y = this.y, z = this.z, w = this.w;
          var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
          if (cosHalfTheta < 0) {
            this.w = -qb.w;
            this.x = -qb.x;
            this.y = -qb.y;
            this.z = -qb.z;
            cosHalfTheta = -cosHalfTheta;
          } else {
            this.copy(qb);
          }
          if (cosHalfTheta >= 1) {
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
          }
          var halfTheta = Math.acos(cosHalfTheta);
          var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
          if (Math.abs(sinHalfTheta) < 1e-3) {
            this.w = 0.5 * (w + this.w);
            this.x = 0.5 * (x + this.x);
            this.y = 0.5 * (y + this.y);
            this.z = 0.5 * (z + this.z);
            return this;
          }
          var ratioA = Math.sin((1 - t2) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t2 * halfTheta) / sinHalfTheta;
          this.w = w * ratioA + this.w * ratioB;
          this.x = x * ratioA + this.x * ratioB;
          this.y = y * ratioA + this.y * ratioB;
          this.z = z * ratioA + this.z * ratioB;
          return this;
        },
        setFromUnitVectors: function() {
          var v1, r;
          var EPS = 1e-6;
          return function(vFrom, vTo) {
            if (v1 === void 0)
              v1 = new Vector34();
            r = vFrom.dot(vTo) + 1;
            if (r < EPS) {
              r = 0;
              if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                v1.set(-vFrom.y, vFrom.x, 0);
              } else {
                v1.set(0, -vFrom.z, vFrom.y);
              }
            } else {
              v1.crossVectors(vFrom, vTo);
            }
            this.x = v1.x;
            this.y = v1.y;
            this.z = v1.z;
            this.w = r;
            this.normalize();
            return this;
          };
        }()
      };
      function Device(params) {
        this.width = params.width || getScreenWidth();
        this.height = params.height || getScreenHeight();
        this.widthMeters = params.widthMeters;
        this.heightMeters = params.heightMeters;
        this.bevelMeters = params.bevelMeters;
      }
      var DEFAULT_ANDROID = new Device({
        widthMeters: 0.11,
        heightMeters: 0.062,
        bevelMeters: 4e-3
      });
      var DEFAULT_IOS = new Device({
        widthMeters: 0.1038,
        heightMeters: 0.0584,
        bevelMeters: 4e-3
      });
      var Viewers = {
        CardboardV1: new CardboardViewer({
          id: "CardboardV1",
          label: "Cardboard I/O 2014",
          fov: 40,
          interLensDistance: 0.06,
          baselineLensDistance: 0.035,
          screenLensDistance: 0.042,
          distortionCoefficients: [0.441, 0.156],
          inverseCoefficients: [-0.4410035, 0.42756155, -0.4804439, 0.5460139, -0.58821183, 0.5733938, -0.48303202, 0.33299083, -0.17573841, 0.0651772, -0.01488963, 1559834e-9]
        }),
        CardboardV2: new CardboardViewer({
          id: "CardboardV2",
          label: "Cardboard I/O 2015",
          fov: 60,
          interLensDistance: 0.064,
          baselineLensDistance: 0.035,
          screenLensDistance: 0.039,
          distortionCoefficients: [0.34, 0.55],
          inverseCoefficients: [-0.33836704, -0.18162185, 0.862655, -1.2462051, 1.0560602, -0.58208317, 0.21609078, -0.05444823, 9177956e-9, -9904169e-10, 6183535e-11, -16981803e-13]
        })
      };
      function DeviceInfo(deviceParams, additionalViewers) {
        this.viewer = Viewers.CardboardV2;
        this.updateDeviceParams(deviceParams);
        this.distortion = new Distortion(this.viewer.distortionCoefficients);
        for (var i = 0; i < additionalViewers.length; i++) {
          var viewer = additionalViewers[i];
          Viewers[viewer.id] = new CardboardViewer(viewer);
        }
      }
      DeviceInfo.prototype.updateDeviceParams = function(deviceParams) {
        this.device = this.determineDevice_(deviceParams) || this.device;
      };
      DeviceInfo.prototype.getDevice = function() {
        return this.device;
      };
      DeviceInfo.prototype.setViewer = function(viewer) {
        this.viewer = viewer;
        this.distortion = new Distortion(this.viewer.distortionCoefficients);
      };
      DeviceInfo.prototype.determineDevice_ = function(deviceParams) {
        if (!deviceParams) {
          if (isIOS2()) {
            console.warn("Using fallback iOS device measurements.");
            return DEFAULT_IOS;
          } else {
            console.warn("Using fallback Android device measurements.");
            return DEFAULT_ANDROID;
          }
        }
        var METERS_PER_INCH = 0.0254;
        var metersPerPixelX = METERS_PER_INCH / deviceParams.xdpi;
        var metersPerPixelY = METERS_PER_INCH / deviceParams.ydpi;
        var width = getScreenWidth();
        var height = getScreenHeight();
        return new Device({
          widthMeters: metersPerPixelX * width,
          heightMeters: metersPerPixelY * height,
          bevelMeters: deviceParams.bevelMm * 1e-3
        });
      };
      DeviceInfo.prototype.getDistortedFieldOfViewLeftEye = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var outerDist = (device.widthMeters - viewer.interLensDistance) / 2;
        var innerDist = viewer.interLensDistance / 2;
        var bottomDist = viewer.baselineLensDistance - device.bevelMeters;
        var topDist = device.heightMeters - bottomDist;
        var outerAngle = radToDeg * Math.atan(distortion.distort(outerDist / eyeToScreenDistance));
        var innerAngle = radToDeg * Math.atan(distortion.distort(innerDist / eyeToScreenDistance));
        var bottomAngle = radToDeg * Math.atan(distortion.distort(bottomDist / eyeToScreenDistance));
        var topAngle = radToDeg * Math.atan(distortion.distort(topDist / eyeToScreenDistance));
        return {
          leftDegrees: Math.min(outerAngle, viewer.fov),
          rightDegrees: Math.min(innerAngle, viewer.fov),
          downDegrees: Math.min(bottomAngle, viewer.fov),
          upDegrees: Math.min(topAngle, viewer.fov)
        };
      };
      DeviceInfo.prototype.getLeftEyeVisibleTanAngles = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var fovLeft = Math.tan(-degToRad * viewer.fov);
        var fovTop = Math.tan(degToRad * viewer.fov);
        var fovRight = Math.tan(degToRad * viewer.fov);
        var fovBottom = Math.tan(-degToRad * viewer.fov);
        var halfWidth = device.widthMeters / 4;
        var halfHeight = device.heightMeters / 2;
        var verticalLensOffset = viewer.baselineLensDistance - device.bevelMeters - halfHeight;
        var centerX = viewer.interLensDistance / 2 - halfWidth;
        var centerY = -verticalLensOffset;
        var centerZ = viewer.screenLensDistance;
        var screenLeft = distortion.distort((centerX - halfWidth) / centerZ);
        var screenTop = distortion.distort((centerY + halfHeight) / centerZ);
        var screenRight = distortion.distort((centerX + halfWidth) / centerZ);
        var screenBottom = distortion.distort((centerY - halfHeight) / centerZ);
        var result = new Float32Array(4);
        result[0] = Math.max(fovLeft, screenLeft);
        result[1] = Math.min(fovTop, screenTop);
        result[2] = Math.min(fovRight, screenRight);
        result[3] = Math.max(fovBottom, screenBottom);
        return result;
      };
      DeviceInfo.prototype.getLeftEyeNoLensTanAngles = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var result = new Float32Array(4);
        var fovLeft = distortion.distortInverse(Math.tan(-degToRad * viewer.fov));
        var fovTop = distortion.distortInverse(Math.tan(degToRad * viewer.fov));
        var fovRight = distortion.distortInverse(Math.tan(degToRad * viewer.fov));
        var fovBottom = distortion.distortInverse(Math.tan(-degToRad * viewer.fov));
        var halfWidth = device.widthMeters / 4;
        var halfHeight = device.heightMeters / 2;
        var verticalLensOffset = viewer.baselineLensDistance - device.bevelMeters - halfHeight;
        var centerX = viewer.interLensDistance / 2 - halfWidth;
        var centerY = -verticalLensOffset;
        var centerZ = viewer.screenLensDistance;
        var screenLeft = (centerX - halfWidth) / centerZ;
        var screenTop = (centerY + halfHeight) / centerZ;
        var screenRight = (centerX + halfWidth) / centerZ;
        var screenBottom = (centerY - halfHeight) / centerZ;
        result[0] = Math.max(fovLeft, screenLeft);
        result[1] = Math.min(fovTop, screenTop);
        result[2] = Math.min(fovRight, screenRight);
        result[3] = Math.max(fovBottom, screenBottom);
        return result;
      };
      DeviceInfo.prototype.getLeftEyeVisibleScreenRect = function(undistortedFrustum) {
        var viewer = this.viewer;
        var device = this.device;
        var dist = viewer.screenLensDistance;
        var eyeX = (device.widthMeters - viewer.interLensDistance) / 2;
        var eyeY = viewer.baselineLensDistance - device.bevelMeters;
        var left = (undistortedFrustum[0] * dist + eyeX) / device.widthMeters;
        var top = (undistortedFrustum[1] * dist + eyeY) / device.heightMeters;
        var right = (undistortedFrustum[2] * dist + eyeX) / device.widthMeters;
        var bottom = (undistortedFrustum[3] * dist + eyeY) / device.heightMeters;
        return {
          x: left,
          y: bottom,
          width: right - left,
          height: top - bottom
        };
      };
      DeviceInfo.prototype.getFieldOfViewLeftEye = function(opt_isUndistorted) {
        return opt_isUndistorted ? this.getUndistortedFieldOfViewLeftEye() : this.getDistortedFieldOfViewLeftEye();
      };
      DeviceInfo.prototype.getFieldOfViewRightEye = function(opt_isUndistorted) {
        var fov = this.getFieldOfViewLeftEye(opt_isUndistorted);
        return {
          leftDegrees: fov.rightDegrees,
          rightDegrees: fov.leftDegrees,
          upDegrees: fov.upDegrees,
          downDegrees: fov.downDegrees
        };
      };
      DeviceInfo.prototype.getUndistortedFieldOfViewLeftEye = function() {
        var p = this.getUndistortedParams_();
        return {
          leftDegrees: radToDeg * Math.atan(p.outerDist),
          rightDegrees: radToDeg * Math.atan(p.innerDist),
          downDegrees: radToDeg * Math.atan(p.bottomDist),
          upDegrees: radToDeg * Math.atan(p.topDist)
        };
      };
      DeviceInfo.prototype.getUndistortedViewportLeftEye = function() {
        var p = this.getUndistortedParams_();
        var viewer = this.viewer;
        var device = this.device;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var screenWidth = device.widthMeters / eyeToScreenDistance;
        var screenHeight = device.heightMeters / eyeToScreenDistance;
        var xPxPerTanAngle = device.width / screenWidth;
        var yPxPerTanAngle = device.height / screenHeight;
        var x = Math.round((p.eyePosX - p.outerDist) * xPxPerTanAngle);
        var y = Math.round((p.eyePosY - p.bottomDist) * yPxPerTanAngle);
        return {
          x,
          y,
          width: Math.round((p.eyePosX + p.innerDist) * xPxPerTanAngle) - x,
          height: Math.round((p.eyePosY + p.topDist) * yPxPerTanAngle) - y
        };
      };
      DeviceInfo.prototype.getUndistortedParams_ = function() {
        var viewer = this.viewer;
        var device = this.device;
        var distortion = this.distortion;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var halfLensDistance = viewer.interLensDistance / 2 / eyeToScreenDistance;
        var screenWidth = device.widthMeters / eyeToScreenDistance;
        var screenHeight = device.heightMeters / eyeToScreenDistance;
        var eyePosX = screenWidth / 2 - halfLensDistance;
        var eyePosY = (viewer.baselineLensDistance - device.bevelMeters) / eyeToScreenDistance;
        var maxFov = viewer.fov;
        var viewerMax = distortion.distortInverse(Math.tan(degToRad * maxFov));
        var outerDist = Math.min(eyePosX, viewerMax);
        var innerDist = Math.min(halfLensDistance, viewerMax);
        var bottomDist = Math.min(eyePosY, viewerMax);
        var topDist = Math.min(screenHeight - eyePosY, viewerMax);
        return {
          outerDist,
          innerDist,
          topDist,
          bottomDist,
          eyePosX,
          eyePosY
        };
      };
      function CardboardViewer(params) {
        this.id = params.id;
        this.label = params.label;
        this.fov = params.fov;
        this.interLensDistance = params.interLensDistance;
        this.baselineLensDistance = params.baselineLensDistance;
        this.screenLensDistance = params.screenLensDistance;
        this.distortionCoefficients = params.distortionCoefficients;
        this.inverseCoefficients = params.inverseCoefficients;
      }
      DeviceInfo.Viewers = Viewers;
      var format = 1;
      var last_updated = "2019-11-09T17:36:14Z";
      var devices = [{ "type": "android", "rules": [{ "mdmh": "asus/*/Nexus 7/*" }, { "ua": "Nexus 7" }], "dpi": [320.8, 323], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "asus/*/ASUS_X00PD/*" }, { "ua": "ASUS_X00PD" }], "dpi": 245, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "asus/*/ASUS_X008D/*" }, { "ua": "ASUS_X008D" }], "dpi": 282, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "asus/*/ASUS_Z00AD/*" }, { "ua": "ASUS_Z00AD" }], "dpi": [403, 404.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Google/*/Pixel 2 XL/*" }, { "ua": "Pixel 2 XL" }], "dpi": 537.9, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Google/*/Pixel 3 XL/*" }, { "ua": "Pixel 3 XL" }], "dpi": [558.5, 553.8], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Google/*/Pixel XL/*" }, { "ua": "Pixel XL" }], "dpi": [537.9, 533], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Google/*/Pixel 3/*" }, { "ua": "Pixel 3" }], "dpi": 442.4, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Google/*/Pixel 2/*" }, { "ua": "Pixel 2" }], "dpi": 441, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "Google/*/Pixel/*" }, { "ua": "Pixel" }], "dpi": [432.6, 436.7], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "HTC/*/HTC6435LVW/*" }, { "ua": "HTC6435LVW" }], "dpi": [449.7, 443.3], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "HTC/*/HTC One XL/*" }, { "ua": "HTC One XL" }], "dpi": [315.3, 314.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "htc/*/Nexus 9/*" }, { "ua": "Nexus 9" }], "dpi": 289, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "HTC/*/HTC One M9/*" }, { "ua": "HTC One M9" }], "dpi": [442.5, 443.3], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "HTC/*/HTC One_M8/*" }, { "ua": "HTC One_M8" }], "dpi": [449.7, 447.4], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "HTC/*/HTC One/*" }, { "ua": "HTC One" }], "dpi": 472.8, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Huawei/*/Nexus 6P/*" }, { "ua": "Nexus 6P" }], "dpi": [515.1, 518], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Huawei/*/BLN-L24/*" }, { "ua": "HONORBLN-L24" }], "dpi": 480, "bw": 4, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "Huawei/*/BKL-L09/*" }, { "ua": "BKL-L09" }], "dpi": 403, "bw": 3.47, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "LENOVO/*/Lenovo PB2-690Y/*" }, { "ua": "Lenovo PB2-690Y" }], "dpi": [457.2, 454.713], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/Nexus 5X/*" }, { "ua": "Nexus 5X" }], "dpi": [422, 419.9], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/LGMS345/*" }, { "ua": "LGMS345" }], "dpi": [221.7, 219.1], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/LG-D800/*" }, { "ua": "LG-D800" }], "dpi": [422, 424.1], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/LG-D850/*" }, { "ua": "LG-D850" }], "dpi": [537.9, 541.9], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/VS985 4G/*" }, { "ua": "VS985 4G" }], "dpi": [537.9, 535.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/Nexus 5/*" }, { "ua": "Nexus 5 B" }], "dpi": [442.4, 444.8], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/Nexus 4/*" }, { "ua": "Nexus 4" }], "dpi": [319.8, 318.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/LG-P769/*" }, { "ua": "LG-P769" }], "dpi": [240.6, 247.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/LGMS323/*" }, { "ua": "LGMS323" }], "dpi": [206.6, 204.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "LGE/*/LGLS996/*" }, { "ua": "LGLS996" }], "dpi": [403.4, 401.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Micromax/*/4560MMX/*" }, { "ua": "4560MMX" }], "dpi": [240, 219.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Micromax/*/A250/*" }, { "ua": "Micromax A250" }], "dpi": [480, 446.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Micromax/*/Micromax AQ4501/*" }, { "ua": "Micromax AQ4501" }], "dpi": 240, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/G5/*" }, { "ua": "Moto G (5) Plus" }], "dpi": [403.4, 403], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/DROID RAZR/*" }, { "ua": "DROID RAZR" }], "dpi": [368.1, 256.7], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT830C/*" }, { "ua": "XT830C" }], "dpi": [254, 255.9], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1021/*" }, { "ua": "XT1021" }], "dpi": [254, 256.7], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1023/*" }, { "ua": "XT1023" }], "dpi": [254, 256.7], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1028/*" }, { "ua": "XT1028" }], "dpi": [326.6, 327.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1034/*" }, { "ua": "XT1034" }], "dpi": [326.6, 328.4], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1053/*" }, { "ua": "XT1053" }], "dpi": [315.3, 316.1], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1562/*" }, { "ua": "XT1562" }], "dpi": [403.4, 402.7], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/Nexus 6/*" }, { "ua": "Nexus 6 B" }], "dpi": [494.3, 489.7], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1063/*" }, { "ua": "XT1063" }], "dpi": [295, 296.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1064/*" }, { "ua": "XT1064" }], "dpi": [295, 295.6], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1092/*" }, { "ua": "XT1092" }], "dpi": [422, 424.1], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/XT1095/*" }, { "ua": "XT1095" }], "dpi": [422, 423.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "motorola/*/G4/*" }, { "ua": "Moto G (4)" }], "dpi": 401, "bw": 4, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/A0001/*" }, { "ua": "A0001" }], "dpi": [403.4, 401], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONE E1001/*" }, { "ua": "ONE E1001" }], "dpi": [442.4, 441.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONE E1003/*" }, { "ua": "ONE E1003" }], "dpi": [442.4, 441.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONE E1005/*" }, { "ua": "ONE E1005" }], "dpi": [442.4, 441.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONE A2001/*" }, { "ua": "ONE A2001" }], "dpi": [391.9, 405.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONE A2003/*" }, { "ua": "ONE A2003" }], "dpi": [391.9, 405.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONE A2005/*" }, { "ua": "ONE A2005" }], "dpi": [391.9, 405.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A3000/*" }, { "ua": "ONEPLUS A3000" }], "dpi": 401, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A3003/*" }, { "ua": "ONEPLUS A3003" }], "dpi": 401, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A3010/*" }, { "ua": "ONEPLUS A3010" }], "dpi": 401, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A5000/*" }, { "ua": "ONEPLUS A5000 " }], "dpi": [403.411, 399.737], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONE A5010/*" }, { "ua": "ONEPLUS A5010" }], "dpi": [403, 400], "bw": 2, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A6000/*" }, { "ua": "ONEPLUS A6000" }], "dpi": 401, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A6003/*" }, { "ua": "ONEPLUS A6003" }], "dpi": 401, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A6010/*" }, { "ua": "ONEPLUS A6010" }], "dpi": 401, "bw": 2, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "OnePlus/*/ONEPLUS A6013/*" }, { "ua": "ONEPLUS A6013" }], "dpi": 401, "bw": 2, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "OPPO/*/X909/*" }, { "ua": "X909" }], "dpi": [442.4, 444.1], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-I9082/*" }, { "ua": "GT-I9082" }], "dpi": [184.7, 185.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G360P/*" }, { "ua": "SM-G360P" }], "dpi": [196.7, 205.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/Nexus S/*" }, { "ua": "Nexus S" }], "dpi": [234.5, 229.8], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-I9300/*" }, { "ua": "GT-I9300" }], "dpi": [304.8, 303.9], "bw": 5, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-T230NU/*" }, { "ua": "SM-T230NU" }], "dpi": 216, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SGH-T399/*" }, { "ua": "SGH-T399" }], "dpi": [217.7, 231.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SGH-M919/*" }, { "ua": "SGH-M919" }], "dpi": [440.8, 437.7], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-N9005/*" }, { "ua": "SM-N9005" }], "dpi": [386.4, 387], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SAMSUNG-SM-N900A/*" }, { "ua": "SAMSUNG-SM-N900A" }], "dpi": [386.4, 387.7], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-I9500/*" }, { "ua": "GT-I9500" }], "dpi": [442.5, 443.3], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-I9505/*" }, { "ua": "GT-I9505" }], "dpi": 439.4, "bw": 4, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G900F/*" }, { "ua": "SM-G900F" }], "dpi": [415.6, 431.6], "bw": 5, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G900M/*" }, { "ua": "SM-G900M" }], "dpi": [415.6, 431.6], "bw": 5, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G800F/*" }, { "ua": "SM-G800F" }], "dpi": 326.8, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G906S/*" }, { "ua": "SM-G906S" }], "dpi": [562.7, 572.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-I9300/*" }, { "ua": "GT-I9300" }], "dpi": [306.7, 304.8], "bw": 5, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-T535/*" }, { "ua": "SM-T535" }], "dpi": [142.6, 136.4], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-N920C/*" }, { "ua": "SM-N920C" }], "dpi": [515.1, 518.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-N920P/*" }, { "ua": "SM-N920P" }], "dpi": [386.3655, 390.144], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-N920W8/*" }, { "ua": "SM-N920W8" }], "dpi": [515.1, 518.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-I9300I/*" }, { "ua": "GT-I9300I" }], "dpi": [304.8, 305.8], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-I9195/*" }, { "ua": "GT-I9195" }], "dpi": [249.4, 256.7], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SPH-L520/*" }, { "ua": "SPH-L520" }], "dpi": [249.4, 255.9], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SAMSUNG-SGH-I717/*" }, { "ua": "SAMSUNG-SGH-I717" }], "dpi": 285.8, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SPH-D710/*" }, { "ua": "SPH-D710" }], "dpi": [217.7, 204.2], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/GT-N7100/*" }, { "ua": "GT-N7100" }], "dpi": 265.1, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SCH-I605/*" }, { "ua": "SCH-I605" }], "dpi": 265.1, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/Galaxy Nexus/*" }, { "ua": "Galaxy Nexus" }], "dpi": [315.3, 314.2], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-N910H/*" }, { "ua": "SM-N910H" }], "dpi": [515.1, 518], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-N910C/*" }, { "ua": "SM-N910C" }], "dpi": [515.2, 520.2], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G130M/*" }, { "ua": "SM-G130M" }], "dpi": [165.9, 164.8], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G928I/*" }, { "ua": "SM-G928I" }], "dpi": [515.1, 518.4], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G920F/*" }, { "ua": "SM-G920F" }], "dpi": 580.6, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G920P/*" }, { "ua": "SM-G920P" }], "dpi": [522.5, 577], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G925F/*" }, { "ua": "SM-G925F" }], "dpi": 580.6, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G925V/*" }, { "ua": "SM-G925V" }], "dpi": [522.5, 576.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G930F/*" }, { "ua": "SM-G930F" }], "dpi": 576.6, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G935F/*" }, { "ua": "SM-G935F" }], "dpi": 533, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G950F/*" }, { "ua": "SM-G950F" }], "dpi": [562.707, 565.293], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G955U/*" }, { "ua": "SM-G955U" }], "dpi": [522.514, 525.762], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G955F/*" }, { "ua": "SM-G955F" }], "dpi": [522.514, 525.762], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G960F/*" }, { "ua": "SM-G960F" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G9600/*" }, { "ua": "SM-G9600" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G960T/*" }, { "ua": "SM-G960T" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G960N/*" }, { "ua": "SM-G960N" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G960U/*" }, { "ua": "SM-G960U" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G9608/*" }, { "ua": "SM-G9608" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G960FD/*" }, { "ua": "SM-G960FD" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G960W/*" }, { "ua": "SM-G960W" }], "dpi": [569.575, 571.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G965F/*" }, { "ua": "SM-G965F" }], "dpi": 529, "bw": 2, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Sony/*/C6903/*" }, { "ua": "C6903" }], "dpi": [442.5, 443.3], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "Sony/*/D6653/*" }, { "ua": "D6653" }], "dpi": [428.6, 427.6], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Sony/*/E6653/*" }, { "ua": "E6653" }], "dpi": [428.6, 425.7], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Sony/*/E6853/*" }, { "ua": "E6853" }], "dpi": [403.4, 401.9], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Sony/*/SGP321/*" }, { "ua": "SGP321" }], "dpi": [224.7, 224.1], "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "TCT/*/ALCATEL ONE TOUCH Fierce/*" }, { "ua": "ALCATEL ONE TOUCH Fierce" }], "dpi": [240, 247.5], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "THL/*/thl 5000/*" }, { "ua": "thl 5000" }], "dpi": [480, 443.3], "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Fly/*/IQ4412/*" }, { "ua": "IQ4412" }], "dpi": 307.9, "bw": 3, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "ZTE/*/ZTE Blade L2/*" }, { "ua": "ZTE Blade L2" }], "dpi": 240, "bw": 3, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "BENEVE/*/VR518/*" }, { "ua": "VR518" }], "dpi": 480, "bw": 3, "ac": 500 }, { "type": "ios", "rules": [{ "res": [640, 960] }], "dpi": [325.1, 328.4], "bw": 4, "ac": 1e3 }, { "type": "ios", "rules": [{ "res": [640, 1136] }], "dpi": [317.1, 320.2], "bw": 3, "ac": 1e3 }, { "type": "ios", "rules": [{ "res": [750, 1334] }], "dpi": 326.4, "bw": 4, "ac": 1e3 }, { "type": "ios", "rules": [{ "res": [1242, 2208] }], "dpi": [453.6, 458.4], "bw": 4, "ac": 1e3 }, { "type": "ios", "rules": [{ "res": [1125, 2001] }], "dpi": [410.9, 415.4], "bw": 4, "ac": 1e3 }, { "type": "ios", "rules": [{ "res": [1125, 2436] }], "dpi": 458, "bw": 4, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "Huawei/*/EML-L29/*" }, { "ua": "EML-L29" }], "dpi": 428, "bw": 3.45, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "Nokia/*/Nokia 7.1/*" }, { "ua": "Nokia 7.1" }], "dpi": [432, 431.9], "bw": 3, "ac": 500 }, { "type": "ios", "rules": [{ "res": [1242, 2688] }], "dpi": 458, "bw": 4, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G570M/*" }, { "ua": "SM-G570M" }], "dpi": 320, "bw": 3.684, "ac": 1e3 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G970F/*" }, { "ua": "SM-G970F" }], "dpi": 438, "bw": 2.281, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G973F/*" }, { "ua": "SM-G973F" }], "dpi": 550, "bw": 2.002, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G975F/*" }, { "ua": "SM-G975F" }], "dpi": 522, "bw": 2.054, "ac": 500 }, { "type": "android", "rules": [{ "mdmh": "samsung/*/SM-G977F/*" }, { "ua": "SM-G977F" }], "dpi": 505, "bw": 2.334, "ac": 500 }, { "type": "ios", "rules": [{ "res": [828, 1792] }], "dpi": 326, "bw": 5, "ac": 500 }];
      var DPDB_CACHE = {
        format,
        last_updated,
        devices
      };
      function Dpdb(url2, onDeviceParamsUpdated) {
        this.dpdb = DPDB_CACHE;
        this.recalculateDeviceParams_();
        if (url2) {
          this.onDeviceParamsUpdated = onDeviceParamsUpdated;
          var xhr = new XMLHttpRequest();
          var obj2 = this;
          xhr.open("GET", url2, true);
          xhr.addEventListener("load", function() {
            obj2.loading = false;
            if (xhr.status >= 200 && xhr.status <= 299) {
              obj2.dpdb = JSON.parse(xhr.response);
              obj2.recalculateDeviceParams_();
            } else {
              console.error("Error loading online DPDB!");
            }
          });
          xhr.send();
        }
      }
      Dpdb.prototype.getDeviceParams = function() {
        return this.deviceParams;
      };
      Dpdb.prototype.recalculateDeviceParams_ = function() {
        var newDeviceParams = this.calcDeviceParams_();
        if (newDeviceParams) {
          this.deviceParams = newDeviceParams;
          if (this.onDeviceParamsUpdated) {
            this.onDeviceParamsUpdated(this.deviceParams);
          }
        } else {
          console.error("Failed to recalculate device parameters.");
        }
      };
      Dpdb.prototype.calcDeviceParams_ = function() {
        var db = this.dpdb;
        if (!db) {
          console.error("DPDB not available.");
          return null;
        }
        if (db.format != 1) {
          console.error("DPDB has unexpected format version.");
          return null;
        }
        if (!db.devices || !db.devices.length) {
          console.error("DPDB does not have a devices section.");
          return null;
        }
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        var width = getScreenWidth();
        var height = getScreenHeight();
        if (!db.devices) {
          console.error("DPDB has no devices section.");
          return null;
        }
        for (var i = 0; i < db.devices.length; i++) {
          var device = db.devices[i];
          if (!device.rules) {
            console.warn("Device[" + i + "] has no rules section.");
            continue;
          }
          if (device.type != "ios" && device.type != "android") {
            console.warn("Device[" + i + "] has invalid type.");
            continue;
          }
          if (isIOS2() != (device.type == "ios"))
            continue;
          var matched = false;
          for (var j = 0; j < device.rules.length; j++) {
            var rule = device.rules[j];
            if (this.ruleMatches_(rule, userAgent, width, height)) {
              matched = true;
              break;
            }
          }
          if (!matched)
            continue;
          var xdpi = device.dpi[0] || device.dpi;
          var ydpi = device.dpi[1] || device.dpi;
          return new DeviceParams({ xdpi, ydpi, bevelMm: device.bw });
        }
        console.warn("No DPDB device match.");
        return null;
      };
      Dpdb.prototype.ruleMatches_ = function(rule, ua, screenWidth, screenHeight) {
        if (!rule.ua && !rule.res)
          return false;
        if (rule.ua && rule.ua.substring(0, 2) === "SM")
          rule.ua = rule.ua.substring(0, 7);
        if (rule.ua && ua.indexOf(rule.ua) < 0)
          return false;
        if (rule.res) {
          if (!rule.res[0] || !rule.res[1])
            return false;
          var resX = rule.res[0];
          var resY = rule.res[1];
          if (Math.min(screenWidth, screenHeight) != Math.min(resX, resY) || Math.max(screenWidth, screenHeight) != Math.max(resX, resY)) {
            return false;
          }
        }
        return true;
      };
      function DeviceParams(params) {
        this.xdpi = params.xdpi;
        this.ydpi = params.ydpi;
        this.bevelMm = params.bevelMm;
      }
      function SensorSample(sample, timestampS) {
        this.set(sample, timestampS);
      }
      SensorSample.prototype.set = function(sample, timestampS) {
        this.sample = sample;
        this.timestampS = timestampS;
      };
      SensorSample.prototype.copy = function(sensorSample) {
        this.set(sensorSample.sample, sensorSample.timestampS);
      };
      function ComplementaryFilter(kFilter, isDebug2) {
        this.kFilter = kFilter;
        this.isDebug = isDebug2;
        this.currentAccelMeasurement = new SensorSample();
        this.currentGyroMeasurement = new SensorSample();
        this.previousGyroMeasurement = new SensorSample();
        if (isIOS2()) {
          this.filterQ = new Quaternion2(-1, 0, 0, 1);
        } else {
          this.filterQ = new Quaternion2(1, 0, 0, 1);
        }
        this.previousFilterQ = new Quaternion2();
        this.previousFilterQ.copy(this.filterQ);
        this.accelQ = new Quaternion2();
        this.isOrientationInitialized = false;
        this.estimatedGravity = new Vector34();
        this.measuredGravity = new Vector34();
        this.gyroIntegralQ = new Quaternion2();
      }
      ComplementaryFilter.prototype.addAccelMeasurement = function(vector, timestampS) {
        this.currentAccelMeasurement.set(vector, timestampS);
      };
      ComplementaryFilter.prototype.addGyroMeasurement = function(vector, timestampS) {
        this.currentGyroMeasurement.set(vector, timestampS);
        var deltaT = timestampS - this.previousGyroMeasurement.timestampS;
        if (isTimestampDeltaValid(deltaT)) {
          this.run_();
        }
        this.previousGyroMeasurement.copy(this.currentGyroMeasurement);
      };
      ComplementaryFilter.prototype.run_ = function() {
        if (!this.isOrientationInitialized) {
          this.accelQ = this.accelToQuaternion_(this.currentAccelMeasurement.sample);
          this.previousFilterQ.copy(this.accelQ);
          this.isOrientationInitialized = true;
          return;
        }
        var deltaT = this.currentGyroMeasurement.timestampS - this.previousGyroMeasurement.timestampS;
        var gyroDeltaQ = this.gyroToQuaternionDelta_(this.currentGyroMeasurement.sample, deltaT);
        this.gyroIntegralQ.multiply(gyroDeltaQ);
        this.filterQ.copy(this.previousFilterQ);
        this.filterQ.multiply(gyroDeltaQ);
        var invFilterQ = new Quaternion2();
        invFilterQ.copy(this.filterQ);
        invFilterQ.inverse();
        this.estimatedGravity.set(0, 0, -1);
        this.estimatedGravity.applyQuaternion(invFilterQ);
        this.estimatedGravity.normalize();
        this.measuredGravity.copy(this.currentAccelMeasurement.sample);
        this.measuredGravity.normalize();
        var deltaQ = new Quaternion2();
        deltaQ.setFromUnitVectors(this.estimatedGravity, this.measuredGravity);
        deltaQ.inverse();
        if (this.isDebug) {
          console.log("Delta: %d deg, G_est: (%s, %s, %s), G_meas: (%s, %s, %s)", radToDeg * getQuaternionAngle(deltaQ), this.estimatedGravity.x.toFixed(1), this.estimatedGravity.y.toFixed(1), this.estimatedGravity.z.toFixed(1), this.measuredGravity.x.toFixed(1), this.measuredGravity.y.toFixed(1), this.measuredGravity.z.toFixed(1));
        }
        var targetQ = new Quaternion2();
        targetQ.copy(this.filterQ);
        targetQ.multiply(deltaQ);
        this.filterQ.slerp(targetQ, 1 - this.kFilter);
        this.previousFilterQ.copy(this.filterQ);
      };
      ComplementaryFilter.prototype.getOrientation = function() {
        return this.filterQ;
      };
      ComplementaryFilter.prototype.accelToQuaternion_ = function(accel) {
        var normAccel = new Vector34();
        normAccel.copy(accel);
        normAccel.normalize();
        var quat = new Quaternion2();
        quat.setFromUnitVectors(new Vector34(0, 0, -1), normAccel);
        quat.inverse();
        return quat;
      };
      ComplementaryFilter.prototype.gyroToQuaternionDelta_ = function(gyro, dt) {
        var quat = new Quaternion2();
        var axis = new Vector34();
        axis.copy(gyro);
        axis.normalize();
        quat.setFromAxisAngle(axis, gyro.length() * dt);
        return quat;
      };
      function PosePredictor(predictionTimeS, isDebug2) {
        this.predictionTimeS = predictionTimeS;
        this.isDebug = isDebug2;
        this.previousQ = new Quaternion2();
        this.previousTimestampS = null;
        this.deltaQ = new Quaternion2();
        this.outQ = new Quaternion2();
      }
      PosePredictor.prototype.getPrediction = function(currentQ, gyro, timestampS) {
        if (!this.previousTimestampS) {
          this.previousQ.copy(currentQ);
          this.previousTimestampS = timestampS;
          return currentQ;
        }
        var axis = new Vector34();
        axis.copy(gyro);
        axis.normalize();
        var angularSpeed = gyro.length();
        if (angularSpeed < degToRad * 20) {
          if (this.isDebug) {
            console.log("Moving slowly, at %s deg/s: no prediction", (radToDeg * angularSpeed).toFixed(1));
          }
          this.outQ.copy(currentQ);
          this.previousQ.copy(currentQ);
          return this.outQ;
        }
        var predictAngle = angularSpeed * this.predictionTimeS;
        this.deltaQ.setFromAxisAngle(axis, predictAngle);
        this.outQ.copy(this.previousQ);
        this.outQ.multiply(this.deltaQ);
        this.previousQ.copy(currentQ);
        this.previousTimestampS = timestampS;
        return this.outQ;
      };
      function FusionPoseSensor(kFilter, predictionTime, yawOnly, isDebug2) {
        this.yawOnly = yawOnly;
        this.accelerometer = new Vector34();
        this.gyroscope = new Vector34();
        this.filter = new ComplementaryFilter(kFilter, isDebug2);
        this.posePredictor = new PosePredictor(predictionTime, isDebug2);
        this.isFirefoxAndroid = isFirefoxAndroid();
        this.isIOS = isIOS2();
        var chromeVersion = getChromeVersion();
        this.isDeviceMotionInRadians = !this.isIOS && chromeVersion && chromeVersion < 66;
        this.isWithoutDeviceMotion = isChromeWithoutDeviceMotion() || isSafariWithoutDeviceMotion();
        this.filterToWorldQ = new Quaternion2();
        if (isIOS2()) {
          this.filterToWorldQ.setFromAxisAngle(new Vector34(1, 0, 0), Math.PI / 2);
        } else {
          this.filterToWorldQ.setFromAxisAngle(new Vector34(1, 0, 0), -Math.PI / 2);
        }
        this.inverseWorldToScreenQ = new Quaternion2();
        this.worldToScreenQ = new Quaternion2();
        this.originalPoseAdjustQ = new Quaternion2();
        this.originalPoseAdjustQ.setFromAxisAngle(new Vector34(0, 0, 1), -window.orientation * Math.PI / 180);
        this.setScreenTransform_();
        if (isLandscapeMode()) {
          this.filterToWorldQ.multiply(this.inverseWorldToScreenQ);
        }
        this.resetQ = new Quaternion2();
        this.orientationOut_ = new Float32Array(4);
        this.start();
      }
      FusionPoseSensor.prototype.getPosition = function() {
        return null;
      };
      FusionPoseSensor.prototype.getOrientation = function() {
        var orientation = void 0;
        if (this.isWithoutDeviceMotion && this._deviceOrientationQ) {
          this.deviceOrientationFixQ = this.deviceOrientationFixQ || function() {
            var z = new Quaternion2().setFromAxisAngle(new Vector34(0, 0, -1), 0);
            var y = new Quaternion2();
            if (window.orientation === -90) {
              y.setFromAxisAngle(new Vector34(0, 1, 0), Math.PI / -2);
            } else {
              y.setFromAxisAngle(new Vector34(0, 1, 0), Math.PI / 2);
            }
            return z.multiply(y);
          }();
          this.deviceOrientationFilterToWorldQ = this.deviceOrientationFilterToWorldQ || function() {
            var q = new Quaternion2();
            q.setFromAxisAngle(new Vector34(1, 0, 0), -Math.PI / 2);
            return q;
          }();
          orientation = this._deviceOrientationQ;
          var out = new Quaternion2();
          out.copy(orientation);
          out.multiply(this.deviceOrientationFilterToWorldQ);
          out.multiply(this.resetQ);
          out.multiply(this.worldToScreenQ);
          out.multiplyQuaternions(this.deviceOrientationFixQ, out);
          if (this.yawOnly) {
            out.x = 0;
            out.z = 0;
            out.normalize();
          }
          this.orientationOut_[0] = out.x;
          this.orientationOut_[1] = out.y;
          this.orientationOut_[2] = out.z;
          this.orientationOut_[3] = out.w;
          return this.orientationOut_;
        } else {
          var filterOrientation = this.filter.getOrientation();
          orientation = this.posePredictor.getPrediction(filterOrientation, this.gyroscope, this.previousTimestampS);
        }
        var out = new Quaternion2();
        out.copy(this.filterToWorldQ);
        out.multiply(this.resetQ);
        out.multiply(orientation);
        out.multiply(this.worldToScreenQ);
        if (this.yawOnly) {
          out.x = 0;
          out.z = 0;
          out.normalize();
        }
        this.orientationOut_[0] = out.x;
        this.orientationOut_[1] = out.y;
        this.orientationOut_[2] = out.z;
        this.orientationOut_[3] = out.w;
        return this.orientationOut_;
      };
      FusionPoseSensor.prototype.resetPose = function() {
        this.resetQ.copy(this.filter.getOrientation());
        this.resetQ.x = 0;
        this.resetQ.y = 0;
        this.resetQ.z *= -1;
        this.resetQ.normalize();
        if (isLandscapeMode()) {
          this.resetQ.multiply(this.inverseWorldToScreenQ);
        }
        this.resetQ.multiply(this.originalPoseAdjustQ);
      };
      FusionPoseSensor.prototype.onDeviceOrientation_ = function(e) {
        this._deviceOrientationQ = this._deviceOrientationQ || new Quaternion2();
        var alpha = e.alpha, beta = e.beta, gamma = e.gamma;
        alpha = (alpha || 0) * Math.PI / 180;
        beta = (beta || 0) * Math.PI / 180;
        gamma = (gamma || 0) * Math.PI / 180;
        this._deviceOrientationQ.setFromEulerYXZ(beta, alpha, -gamma);
      };
      FusionPoseSensor.prototype.onDeviceMotion_ = function(deviceMotion) {
        this.updateDeviceMotion_(deviceMotion);
      };
      FusionPoseSensor.prototype.updateDeviceMotion_ = function(deviceMotion) {
        var accGravity = deviceMotion.accelerationIncludingGravity;
        var rotRate = deviceMotion.rotationRate;
        var timestampS = deviceMotion.timeStamp / 1e3;
        var deltaS = timestampS - this.previousTimestampS;
        if (deltaS < 0) {
          warnOnce("fusion-pose-sensor:invalid:non-monotonic", "Invalid timestamps detected: non-monotonic timestamp from devicemotion");
          this.previousTimestampS = timestampS;
          return;
        } else if (deltaS <= MIN_TIMESTEP || deltaS > MAX_TIMESTEP) {
          warnOnce("fusion-pose-sensor:invalid:outside-threshold", "Invalid timestamps detected: Timestamp from devicemotion outside expected range.");
          this.previousTimestampS = timestampS;
          return;
        }
        this.accelerometer.set(-accGravity.x, -accGravity.y, -accGravity.z);
        if (rotRate) {
          if (isR7()) {
            this.gyroscope.set(-rotRate.beta, rotRate.alpha, rotRate.gamma);
          } else {
            this.gyroscope.set(rotRate.alpha, rotRate.beta, rotRate.gamma);
          }
          if (!this.isDeviceMotionInRadians) {
            this.gyroscope.multiplyScalar(Math.PI / 180);
          }
          this.filter.addGyroMeasurement(this.gyroscope, timestampS);
        }
        this.filter.addAccelMeasurement(this.accelerometer, timestampS);
        this.previousTimestampS = timestampS;
      };
      FusionPoseSensor.prototype.onOrientationChange_ = function(screenOrientation) {
        this.setScreenTransform_();
      };
      FusionPoseSensor.prototype.onMessage_ = function(event) {
        var message = event.data;
        if (!message || !message.type) {
          return;
        }
        var type2 = message.type.toLowerCase();
        if (type2 !== "devicemotion") {
          return;
        }
        this.updateDeviceMotion_(message.deviceMotionEvent);
      };
      FusionPoseSensor.prototype.setScreenTransform_ = function() {
        this.worldToScreenQ.set(0, 0, 0, 1);
        switch (window.orientation) {
          case 0:
            break;
          case 90:
            this.worldToScreenQ.setFromAxisAngle(new Vector34(0, 0, 1), -Math.PI / 2);
            break;
          case -90:
            this.worldToScreenQ.setFromAxisAngle(new Vector34(0, 0, 1), Math.PI / 2);
            break;
          case 180:
            break;
        }
        this.inverseWorldToScreenQ.copy(this.worldToScreenQ);
        this.inverseWorldToScreenQ.inverse();
      };
      FusionPoseSensor.prototype.start = function() {
        this.onDeviceMotionCallback_ = this.onDeviceMotion_.bind(this);
        this.onOrientationChangeCallback_ = this.onOrientationChange_.bind(this);
        this.onMessageCallback_ = this.onMessage_.bind(this);
        this.onDeviceOrientationCallback_ = this.onDeviceOrientation_.bind(this);
        if (isIOS2() && isInsideCrossOriginIFrame()) {
          window.addEventListener("message", this.onMessageCallback_);
        }
        window.addEventListener("orientationchange", this.onOrientationChangeCallback_);
        if (this.isWithoutDeviceMotion) {
          window.addEventListener("deviceorientation", this.onDeviceOrientationCallback_);
        } else {
          window.addEventListener("devicemotion", this.onDeviceMotionCallback_);
        }
      };
      FusionPoseSensor.prototype.stop = function() {
        window.removeEventListener("devicemotion", this.onDeviceMotionCallback_);
        window.removeEventListener("deviceorientation", this.onDeviceOrientationCallback_);
        window.removeEventListener("orientationchange", this.onOrientationChangeCallback_);
        window.removeEventListener("message", this.onMessageCallback_);
      };
      var SENSOR_FREQUENCY = 60;
      var X_AXIS = new Vector34(1, 0, 0);
      var Z_AXIS = new Vector34(0, 0, 1);
      var SENSOR_TO_VR = new Quaternion2();
      SENSOR_TO_VR.setFromAxisAngle(X_AXIS, -Math.PI / 2);
      SENSOR_TO_VR.multiply(new Quaternion2().setFromAxisAngle(Z_AXIS, Math.PI / 2));
      var PoseSensor = function() {
        function PoseSensor2(config2) {
          classCallCheck(this, PoseSensor2);
          this.config = config2;
          this.sensor = null;
          this.fusionSensor = null;
          this._out = new Float32Array(4);
          this.api = null;
          this.errors = [];
          this._sensorQ = new Quaternion2();
          this._outQ = new Quaternion2();
          this._onSensorRead = this._onSensorRead.bind(this);
          this._onSensorError = this._onSensorError.bind(this);
          this.init();
        }
        createClass(PoseSensor2, [{
          key: "init",
          value: function init() {
            var sensor = null;
            try {
              sensor = new RelativeOrientationSensor({
                frequency: SENSOR_FREQUENCY,
                referenceFrame: "screen"
              });
              sensor.addEventListener("error", this._onSensorError);
            } catch (error) {
              this.errors.push(error);
              if (error.name === "SecurityError") {
                console.error("Cannot construct sensors due to the Feature Policy");
                console.warn('Attempting to fall back using "devicemotion"; however this will fail in the future without correct permissions.');
                this.useDeviceMotion();
              } else if (error.name === "ReferenceError") {
                this.useDeviceMotion();
              } else {
                console.error(error);
              }
            }
            if (sensor) {
              this.api = "sensor";
              this.sensor = sensor;
              this.sensor.addEventListener("reading", this._onSensorRead);
              this.sensor.start();
            }
          }
        }, {
          key: "useDeviceMotion",
          value: function useDeviceMotion() {
            this.api = "devicemotion";
            this.fusionSensor = new FusionPoseSensor(this.config.K_FILTER, this.config.PREDICTION_TIME_S, this.config.YAW_ONLY, this.config.DEBUG);
            if (this.sensor) {
              this.sensor.removeEventListener("reading", this._onSensorRead);
              this.sensor.removeEventListener("error", this._onSensorError);
              this.sensor = null;
            }
          }
        }, {
          key: "getOrientation",
          value: function getOrientation() {
            if (this.fusionSensor) {
              return this.fusionSensor.getOrientation();
            }
            if (!this.sensor || !this.sensor.quaternion) {
              this._out[0] = this._out[1] = this._out[2] = 0;
              this._out[3] = 1;
              return this._out;
            }
            var q = this.sensor.quaternion;
            this._sensorQ.set(q[0], q[1], q[2], q[3]);
            var out = this._outQ;
            out.copy(SENSOR_TO_VR);
            out.multiply(this._sensorQ);
            if (this.config.YAW_ONLY) {
              out.x = out.z = 0;
              out.normalize();
            }
            this._out[0] = out.x;
            this._out[1] = out.y;
            this._out[2] = out.z;
            this._out[3] = out.w;
            return this._out;
          }
        }, {
          key: "_onSensorError",
          value: function _onSensorError(event) {
            this.errors.push(event.error);
            if (event.error.name === "NotAllowedError") {
              console.error("Permission to access sensor was denied");
            } else if (event.error.name === "NotReadableError") {
              console.error("Sensor could not be read");
            } else {
              console.error(event.error);
            }
            this.useDeviceMotion();
          }
        }, {
          key: "_onSensorRead",
          value: function _onSensorRead() {
          }
        }]);
        return PoseSensor2;
      }();
      var rotateInstructionsAsset = "<svg width='198' height='240' viewBox='0 0 198 240' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><path d='M149.625 109.527l6.737 3.891v.886c0 .177.013.36.038.549.01.081.02.162.027.242.14 1.415.974 2.998 2.105 3.999l5.72 5.062.081-.09s4.382-2.53 5.235-3.024l25.97 14.993v54.001c0 .771-.386 1.217-.948 1.217-.233 0-.495-.076-.772-.236l-23.967-13.838-.014.024-27.322 15.775-.85-1.323c-4.731-1.529-9.748-2.74-14.951-3.61a.27.27 0 0 0-.007.024l-5.067 16.961-7.891 4.556-.037-.063v27.59c0 .772-.386 1.217-.948 1.217-.232 0-.495-.076-.772-.236l-42.473-24.522c-.95-.549-1.72-1.877-1.72-2.967v-1.035l-.021.047a5.111 5.111 0 0 0-1.816-.399 5.682 5.682 0 0 0-.546.001 13.724 13.724 0 0 1-1.918-.041c-1.655-.153-3.2-.6-4.404-1.296l-46.576-26.89.005.012-10.278-18.75c-1.001-1.827-.241-4.216 1.698-5.336l56.011-32.345a4.194 4.194 0 0 1 2.099-.572c1.326 0 2.572.659 3.227 1.853l.005-.003.227.413-.006.004a9.63 9.63 0 0 0 1.477 2.018l.277.27c1.914 1.85 4.468 2.801 7.113 2.801 1.949 0 3.948-.517 5.775-1.572.013 0 7.319-4.219 7.319-4.219a4.194 4.194 0 0 1 2.099-.572c1.326 0 2.572.658 3.226 1.853l3.25 5.928.022-.018 6.785 3.917-.105-.182 46.881-26.965m0-1.635c-.282 0-.563.073-.815.218l-46.169 26.556-5.41-3.124-3.005-5.481c-.913-1.667-2.699-2.702-4.66-2.703-1.011 0-2.02.274-2.917.792a3825 3825 0 0 1-7.275 4.195l-.044.024a9.937 9.937 0 0 1-4.957 1.353c-2.292 0-4.414-.832-5.976-2.342l-.252-.245a7.992 7.992 0 0 1-1.139-1.534 1.379 1.379 0 0 0-.06-.122l-.227-.414a1.718 1.718 0 0 0-.095-.154c-.938-1.574-2.673-2.545-4.571-2.545-1.011 0-2.02.274-2.917.792L3.125 155.502c-2.699 1.559-3.738 4.94-2.314 7.538l10.278 18.75c.177.323.448.563.761.704l46.426 26.804c1.403.81 3.157 1.332 5.072 1.508a15.661 15.661 0 0 0 2.146.046 4.766 4.766 0 0 1 .396 0c.096.004.19.011.283.022.109 1.593 1.159 3.323 2.529 4.114l42.472 24.522c.524.302 1.058.455 1.59.455 1.497 0 2.583-1.2 2.583-2.852v-26.562l7.111-4.105a1.64 1.64 0 0 0 .749-.948l4.658-15.593c4.414.797 8.692 1.848 12.742 3.128l.533.829a1.634 1.634 0 0 0 2.193.531l26.532-15.317L193 192.433c.523.302 1.058.455 1.59.455 1.497 0 2.583-1.199 2.583-2.852v-54.001c0-.584-.312-1.124-.818-1.416l-25.97-14.993a1.633 1.633 0 0 0-1.636.001c-.606.351-2.993 1.73-4.325 2.498l-4.809-4.255c-.819-.725-1.461-1.933-1.561-2.936a7.776 7.776 0 0 0-.033-.294 2.487 2.487 0 0 1-.023-.336v-.886c0-.584-.312-1.123-.817-1.416l-6.739-3.891a1.633 1.633 0 0 0-.817-.219' fill='#455A64'/><path d='M96.027 132.636l46.576 26.891c1.204.695 1.979 1.587 2.242 2.541l-.01.007-81.374 46.982h-.001c-1.654-.152-3.199-.6-4.403-1.295l-46.576-26.891 83.546-48.235' fill='#FAFAFA'/><path d='M63.461 209.174c-.008 0-.015 0-.022-.002-1.693-.156-3.228-.609-4.441-1.309l-46.576-26.89a.118.118 0 0 1 0-.203l83.546-48.235a.117.117 0 0 1 .117 0l46.576 26.891c1.227.708 2.021 1.612 2.296 2.611a.116.116 0 0 1-.042.124l-.021.016-81.375 46.981a.11.11 0 0 1-.058.016zm-50.747-28.303l46.401 26.79c1.178.68 2.671 1.121 4.32 1.276l81.272-46.922c-.279-.907-1.025-1.73-2.163-2.387l-46.517-26.857-83.313 48.1z' fill='#607D8B'/><path d='M148.327 165.471a5.85 5.85 0 0 1-.546.001c-1.894-.083-3.302-1.038-3.145-2.132a2.693 2.693 0 0 0-.072-1.105l-81.103 46.822c.628.058 1.272.073 1.918.042.182-.009.364-.009.546-.001 1.894.083 3.302 1.038 3.145 2.132l79.257-45.759' fill='#FFF'/><path d='M69.07 211.347a.118.118 0 0 1-.115-.134c.045-.317-.057-.637-.297-.925-.505-.61-1.555-1.022-2.738-1.074a5.966 5.966 0 0 0-.535.001 14.03 14.03 0 0 1-1.935-.041.117.117 0 0 1-.103-.092.116.116 0 0 1 .055-.126l81.104-46.822a.117.117 0 0 1 .171.07c.104.381.129.768.074 1.153-.045.316.057.637.296.925.506.61 1.555 1.021 2.739 1.073.178.008.357.008.535-.001a.117.117 0 0 1 .064.218l-79.256 45.759a.114.114 0 0 1-.059.016zm-3.405-2.372c.089 0 .177.002.265.006 1.266.056 2.353.488 2.908 1.158.227.274.35.575.36.882l78.685-45.429c-.036 0-.072-.001-.107-.003-1.267-.056-2.354-.489-2.909-1.158-.282-.34-.402-.724-.347-1.107a2.604 2.604 0 0 0-.032-.91L63.846 208.97a13.91 13.91 0 0 0 1.528.012c.097-.005.194-.007.291-.007z' fill='#607D8B'/><path d='M2.208 162.134c-1.001-1.827-.241-4.217 1.698-5.337l56.011-32.344c1.939-1.12 4.324-.546 5.326 1.281l.232.41a9.344 9.344 0 0 0 1.47 2.021l.278.27c3.325 3.214 8.583 3.716 12.888 1.23l7.319-4.22c1.94-1.119 4.324-.546 5.325 1.282l3.25 5.928-83.519 48.229-10.278-18.75z' fill='#FAFAFA'/><path d='M12.486 181.001a.112.112 0 0 1-.031-.005.114.114 0 0 1-.071-.056L2.106 162.19c-1.031-1.88-.249-4.345 1.742-5.494l56.01-32.344a4.328 4.328 0 0 1 2.158-.588c1.415 0 2.65.702 3.311 1.882.01.008.018.017.024.028l.227.414a.122.122 0 0 1 .013.038 9.508 9.508 0 0 0 1.439 1.959l.275.266c1.846 1.786 4.344 2.769 7.031 2.769 1.977 0 3.954-.538 5.717-1.557a.148.148 0 0 1 .035-.013l7.284-4.206a4.321 4.321 0 0 1 2.157-.588c1.427 0 2.672.716 3.329 1.914l3.249 5.929a.116.116 0 0 1-.044.157l-83.518 48.229a.116.116 0 0 1-.059.016zm49.53-57.004c-.704 0-1.41.193-2.041.557l-56.01 32.345c-1.882 1.086-2.624 3.409-1.655 5.179l10.221 18.645 83.317-48.112-3.195-5.829c-.615-1.122-1.783-1.792-3.124-1.792a4.08 4.08 0 0 0-2.04.557l-7.317 4.225a.148.148 0 0 1-.035.013 11.7 11.7 0 0 1-5.801 1.569c-2.748 0-5.303-1.007-7.194-2.835l-.278-.27a9.716 9.716 0 0 1-1.497-2.046.096.096 0 0 1-.013-.037l-.191-.347a.11.11 0 0 1-.023-.029c-.615-1.123-1.783-1.793-3.124-1.793z' fill='#607D8B'/><path d='M42.434 155.808c-2.51-.001-4.697-1.258-5.852-3.365-1.811-3.304-.438-7.634 3.059-9.654l12.291-7.098a7.599 7.599 0 0 1 3.789-1.033c2.51 0 4.697 1.258 5.852 3.365 1.811 3.304.439 7.634-3.059 9.654l-12.291 7.098a7.606 7.606 0 0 1-3.789 1.033zm13.287-20.683a7.128 7.128 0 0 0-3.555.971l-12.291 7.098c-3.279 1.893-4.573 5.942-2.883 9.024 1.071 1.955 3.106 3.122 5.442 3.122a7.13 7.13 0 0 0 3.556-.97l12.291-7.098c3.279-1.893 4.572-5.942 2.883-9.024-1.072-1.955-3.106-3.123-5.443-3.123z' fill='#607D8B'/><path d='M149.588 109.407l6.737 3.89v.887c0 .176.013.36.037.549.011.081.02.161.028.242.14 1.415.973 2.998 2.105 3.999l7.396 6.545c.177.156.358.295.541.415 1.579 1.04 2.95.466 3.062-1.282.049-.784.057-1.595.023-2.429l-.003-.16v-1.151l25.987 15.003v54c0 1.09-.77 1.53-1.72.982l-42.473-24.523c-.95-.548-1.72-1.877-1.72-2.966v-34.033' fill='#FAFAFA'/><path d='M194.553 191.25c-.257 0-.54-.085-.831-.253l-42.472-24.521c-.981-.567-1.779-1.943-1.779-3.068v-34.033h.234v34.033c0 1.051.745 2.336 1.661 2.866l42.473 24.521c.424.245.816.288 1.103.122.285-.164.442-.52.442-1.002v-53.933l-25.753-14.868.003 1.106c.034.832.026 1.654-.024 2.439-.054.844-.396 1.464-.963 1.746-.619.309-1.45.173-2.28-.373a5.023 5.023 0 0 1-.553-.426l-7.397-6.544c-1.158-1.026-1.999-2.625-2.143-4.076a9.624 9.624 0 0 0-.027-.238 4.241 4.241 0 0 1-.038-.564v-.82l-6.68-3.856.117-.202 6.738 3.89.058.034v.954c0 .171.012.351.036.533.011.083.021.165.029.246.138 1.395.948 2.935 2.065 3.923l7.397 6.545c.173.153.35.289.527.406.758.499 1.504.63 2.047.359.49-.243.786-.795.834-1.551.05-.778.057-1.591.024-2.417l-.004-.163v-1.355l.175.1 25.987 15.004.059.033v54.068c0 .569-.198.996-.559 1.204a1.002 1.002 0 0 1-.506.131' fill='#607D8B'/><path d='M145.685 163.161l24.115 13.922-25.978 14.998-1.462-.307c-6.534-2.17-13.628-3.728-21.019-4.616-4.365-.524-8.663 1.096-9.598 3.62a2.746 2.746 0 0 0-.011 1.928c1.538 4.267 4.236 8.363 7.995 12.135l.532.845-25.977 14.997-24.115-13.922 75.518-43.6' fill='#FFF'/><path d='M94.282 220.818l-.059-.033-24.29-14.024.175-.101 75.577-43.634.058.033 24.29 14.024-26.191 15.122-.045-.01-1.461-.307c-6.549-2.174-13.613-3.725-21.009-4.614a13.744 13.744 0 0 0-1.638-.097c-3.758 0-7.054 1.531-7.837 3.642a2.62 2.62 0 0 0-.01 1.848c1.535 4.258 4.216 8.326 7.968 12.091l.016.021.526.835.006.01.064.102-.105.061-25.977 14.998-.058.033zm-23.881-14.057l23.881 13.788 24.802-14.32c.546-.315.846-.489 1.017-.575l-.466-.74c-3.771-3.787-6.467-7.881-8.013-12.168a2.851 2.851 0 0 1 .011-2.008c.815-2.199 4.203-3.795 8.056-3.795.557 0 1.117.033 1.666.099 7.412.891 14.491 2.445 21.041 4.621.836.175 1.215.254 1.39.304l25.78-14.884-23.881-13.788-75.284 43.466z' fill='#607D8B'/><path d='M167.23 125.979v50.871l-27.321 15.773-6.461-14.167c-.91-1.996-3.428-1.738-5.624.574a10.238 10.238 0 0 0-2.33 4.018l-6.46 21.628-27.322 15.774v-50.871l75.518-43.6' fill='#FFF'/><path d='M91.712 220.567a.127.127 0 0 1-.059-.016.118.118 0 0 1-.058-.101v-50.871c0-.042.023-.08.058-.101l75.519-43.6a.117.117 0 0 1 .175.101v50.871c0 .041-.023.08-.059.1l-27.321 15.775a.118.118 0 0 1-.094.01.12.12 0 0 1-.071-.063l-6.46-14.168c-.375-.822-1.062-1.275-1.934-1.275-1.089 0-2.364.686-3.5 1.881a10.206 10.206 0 0 0-2.302 3.972l-6.46 21.627a.118.118 0 0 1-.054.068L91.77 220.551a.12.12 0 0 1-.058.016zm.117-50.92v50.601l27.106-15.65 6.447-21.583a10.286 10.286 0 0 1 2.357-4.065c1.18-1.242 2.517-1.954 3.669-1.954.969 0 1.731.501 2.146 1.411l6.407 14.051 27.152-15.676v-50.601l-75.284 43.466z' fill='#607D8B'/><path d='M168.543 126.213v50.87l-27.322 15.774-6.46-14.168c-.91-1.995-3.428-1.738-5.624.574a10.248 10.248 0 0 0-2.33 4.019l-6.461 21.627-27.321 15.774v-50.87l75.518-43.6' fill='#FFF'/><path d='M93.025 220.8a.123.123 0 0 1-.059-.015.12.12 0 0 1-.058-.101v-50.871c0-.042.023-.08.058-.101l75.518-43.6a.112.112 0 0 1 .117 0c.036.02.059.059.059.1v50.871a.116.116 0 0 1-.059.101l-27.321 15.774a.111.111 0 0 1-.094.01.115.115 0 0 1-.071-.062l-6.46-14.168c-.375-.823-1.062-1.275-1.935-1.275-1.088 0-2.363.685-3.499 1.881a10.19 10.19 0 0 0-2.302 3.971l-6.461 21.628a.108.108 0 0 1-.053.067l-27.322 15.775a.12.12 0 0 1-.058.015zm.117-50.919v50.6l27.106-15.649 6.447-21.584a10.293 10.293 0 0 1 2.357-4.065c1.179-1.241 2.516-1.954 3.668-1.954.969 0 1.732.502 2.147 1.412l6.407 14.051 27.152-15.676v-50.601l-75.284 43.466z' fill='#607D8B'/><path d='M169.8 177.083l-27.322 15.774-6.46-14.168c-.91-1.995-3.428-1.738-5.625.574a10.246 10.246 0 0 0-2.329 4.019l-6.461 21.627-27.321 15.774v-50.87l75.518-43.6v50.87z' fill='#FAFAFA'/><path d='M94.282 220.917a.234.234 0 0 1-.234-.233v-50.871c0-.083.045-.161.117-.202l75.518-43.601a.234.234 0 1 1 .35.202v50.871a.233.233 0 0 1-.116.202l-27.322 15.775a.232.232 0 0 1-.329-.106l-6.461-14.168c-.36-.789-.992-1.206-1.828-1.206-1.056 0-2.301.672-3.415 1.844a10.099 10.099 0 0 0-2.275 3.924l-6.46 21.628a.235.235 0 0 1-.107.136l-27.322 15.774a.23.23 0 0 1-.116.031zm.233-50.969v50.331l26.891-15.525 6.434-21.539a10.41 10.41 0 0 1 2.384-4.112c1.201-1.265 2.569-1.991 3.753-1.991 1.018 0 1.818.526 2.253 1.48l6.354 13.934 26.982-15.578v-50.331l-75.051 43.331z' fill='#607D8B'/><path d='M109.894 199.943c-1.774 0-3.241-.725-4.244-2.12a.224.224 0 0 1 .023-.294.233.233 0 0 1 .301-.023c.78.547 1.705.827 2.75.827 1.323 0 2.754-.439 4.256-1.306 5.311-3.067 9.631-10.518 9.631-16.611 0-1.927-.442-3.56-1.278-4.724a.232.232 0 0 1 .323-.327c1.671 1.172 2.591 3.381 2.591 6.219 0 6.242-4.426 13.863-9.865 17.003-1.574.908-3.084 1.356-4.488 1.356zm-2.969-1.542c.813.651 1.82.877 2.968.877h.001c1.321 0 2.753-.327 4.254-1.194 5.311-3.067 9.632-10.463 9.632-16.556 0-1.979-.463-3.599-1.326-4.761.411 1.035.625 2.275.625 3.635 0 6.243-4.426 13.883-9.865 17.023-1.574.909-3.084 1.317-4.49 1.317-.641 0-1.243-.149-1.799-.341z' fill='#607D8B'/><path d='M113.097 197.23c5.384-3.108 9.748-10.636 9.748-16.814 0-2.051-.483-3.692-1.323-4.86-1.784-1.252-4.374-1.194-7.257.47-5.384 3.108-9.748 10.636-9.748 16.814 0 2.051.483 3.692 1.323 4.86 1.784 1.252 4.374 1.194 7.257-.47' fill='#FAFAFA'/><path d='M108.724 198.614c-1.142 0-2.158-.213-3.019-.817-.021-.014-.04.014-.055-.007-.894-1.244-1.367-2.948-1.367-4.973 0-6.242 4.426-13.864 9.865-17.005 1.574-.908 3.084-1.363 4.49-1.363 1.142 0 2.158.309 3.018.913a.23.23 0 0 1 .056.056c.894 1.244 1.367 2.972 1.367 4.997 0 6.243-4.426 13.783-9.865 16.923-1.574.909-3.084 1.276-4.49 1.276zm-2.718-1.109c.774.532 1.688.776 2.718.776 1.323 0 2.754-.413 4.256-1.28 5.311-3.066 9.631-10.505 9.631-16.598 0-1.909-.434-3.523-1.255-4.685-.774-.533-1.688-.799-2.718-.799-1.323 0-2.755.441-4.256 1.308-5.311 3.066-9.631 10.506-9.631 16.599 0 1.909.434 3.517 1.255 4.679z' fill='#607D8B'/><path d='M149.318 114.262l-9.984 8.878 15.893 11.031 5.589-6.112-11.498-13.797' fill='#FAFAFA'/><path d='M169.676 120.84l-9.748 5.627c-3.642 2.103-9.528 2.113-13.147.024-3.62-2.089-3.601-5.488.041-7.591l9.495-5.608-6.729-3.885-81.836 47.071 45.923 26.514 3.081-1.779c.631-.365.869-.898.618-1.39-2.357-4.632-2.593-9.546-.683-14.262 5.638-13.92 24.509-24.815 48.618-28.07 8.169-1.103 16.68-.967 24.704.394.852.145 1.776.008 2.407-.357l3.081-1.778-25.825-14.91' fill='#FAFAFA'/><path d='M113.675 183.459a.47.47 0 0 1-.233-.062l-45.924-26.515a.468.468 0 0 1 .001-.809l81.836-47.071a.467.467 0 0 1 .466 0l6.729 3.885a.467.467 0 0 1-.467.809l-6.496-3.75-80.9 46.533 44.988 25.973 2.848-1.644c.192-.111.62-.409.435-.773-2.416-4.748-2.658-9.814-.7-14.65 2.806-6.927 8.885-13.242 17.582-18.263 8.657-4.998 19.518-8.489 31.407-10.094 8.198-1.107 16.79-.97 24.844.397.739.125 1.561.007 2.095-.301l2.381-1.374-25.125-14.506a.467.467 0 0 1 .467-.809l25.825 14.91a.467.467 0 0 1 0 .809l-3.081 1.779c-.721.417-1.763.575-2.718.413-7.963-1.351-16.457-1.486-24.563-.392-11.77 1.589-22.512 5.039-31.065 9.977-8.514 4.916-14.456 11.073-17.183 17.805-1.854 4.578-1.623 9.376.666 13.875.37.725.055 1.513-.8 2.006l-3.081 1.78a.476.476 0 0 1-.234.062' fill='#455A64'/><path d='M153.316 128.279c-2.413 0-4.821-.528-6.652-1.586-1.818-1.049-2.82-2.461-2.82-3.975 0-1.527 1.016-2.955 2.861-4.02l9.493-5.607a.233.233 0 1 1 .238.402l-9.496 5.609c-1.696.979-2.628 2.263-2.628 3.616 0 1.34.918 2.608 2.585 3.571 3.549 2.049 9.343 2.038 12.914-.024l9.748-5.628a.234.234 0 0 1 .234.405l-9.748 5.628c-1.858 1.072-4.296 1.609-6.729 1.609' fill='#607D8B'/><path d='M113.675 182.992l-45.913-26.508M113.675 183.342a.346.346 0 0 1-.175-.047l-45.913-26.508a.35.35 0 1 1 .35-.607l45.913 26.508a.35.35 0 0 1-.175.654' fill='#455A64'/><path d='M67.762 156.484v54.001c0 1.09.77 2.418 1.72 2.967l42.473 24.521c.95.549 1.72.11 1.72-.98v-54.001' fill='#FAFAFA'/><path d='M112.727 238.561c-.297 0-.62-.095-.947-.285l-42.473-24.521c-1.063-.613-1.895-2.05-1.895-3.27v-54.001a.35.35 0 1 1 .701 0v54.001c0 .96.707 2.18 1.544 2.663l42.473 24.522c.344.198.661.243.87.122.206-.119.325-.411.325-.799v-54.001a.35.35 0 1 1 .7 0v54.001c0 .655-.239 1.154-.675 1.406a1.235 1.235 0 0 1-.623.162' fill='#455A64'/><path d='M112.86 147.512h-.001c-2.318 0-4.499-.522-6.142-1.471-1.705-.984-2.643-2.315-2.643-3.749 0-1.445.952-2.791 2.68-3.788l12.041-6.953c1.668-.962 3.874-1.493 6.212-1.493 2.318 0 4.499.523 6.143 1.472 1.704.984 2.643 2.315 2.643 3.748 0 1.446-.952 2.791-2.68 3.789l-12.042 6.952c-1.668.963-3.874 1.493-6.211 1.493zm12.147-16.753c-2.217 0-4.298.497-5.861 1.399l-12.042 6.952c-1.502.868-2.33 1.998-2.33 3.182 0 1.173.815 2.289 2.293 3.142 1.538.889 3.596 1.378 5.792 1.378h.001c2.216 0 4.298-.497 5.861-1.399l12.041-6.953c1.502-.867 2.33-1.997 2.33-3.182 0-1.172-.814-2.288-2.292-3.142-1.539-.888-3.596-1.377-5.793-1.377z' fill='#607D8B'/><path d='M165.63 123.219l-5.734 3.311c-3.167 1.828-8.286 1.837-11.433.02-3.147-1.817-3.131-4.772.036-6.601l5.734-3.31 11.397 6.58' fill='#FAFAFA'/><path d='M154.233 117.448l9.995 5.771-4.682 2.704c-1.434.827-3.352 1.283-5.399 1.283-2.029 0-3.923-.449-5.333-1.263-1.29-.744-2-1.694-2-2.674 0-.991.723-1.955 2.036-2.713l5.383-3.108m0-.809l-5.734 3.31c-3.167 1.829-3.183 4.784-.036 6.601 1.568.905 3.623 1.357 5.684 1.357 2.077 0 4.159-.46 5.749-1.377l5.734-3.311-11.397-6.58M145.445 179.667c-1.773 0-3.241-.85-4.243-2.245-.067-.092-.057-.275.023-.356.08-.081.207-.12.3-.055.781.548 1.706.812 2.751.811 1.322 0 2.754-.446 4.256-1.313 5.31-3.066 9.631-10.522 9.631-16.615 0-1.927-.442-3.562-1.279-4.726a.235.235 0 0 1 .024-.301.232.232 0 0 1 .3-.027c1.67 1.172 2.59 3.38 2.59 6.219 0 6.242-4.425 13.987-9.865 17.127-1.573.908-3.083 1.481-4.488 1.481zM142.476 178c.814.651 1.82 1.002 2.969 1.002 1.322 0 2.753-.452 4.255-1.32 5.31-3.065 9.631-10.523 9.631-16.617 0-1.98-.463-3.63-1.325-4.793.411 1.035.624 2.26.624 3.62 0 6.242-4.425 13.875-9.865 17.015-1.573.909-3.084 1.376-4.489 1.376a5.49 5.49 0 0 1-1.8-.283z' fill='#607D8B'/><path d='M148.648 176.704c5.384-3.108 9.748-10.636 9.748-16.813 0-2.052-.483-3.693-1.322-4.861-1.785-1.252-4.375-1.194-7.258.471-5.383 3.108-9.748 10.636-9.748 16.813 0 2.051.484 3.692 1.323 4.86 1.785 1.253 4.374 1.195 7.257-.47' fill='#FAFAFA'/><path d='M144.276 178.276c-1.143 0-2.158-.307-3.019-.911a.217.217 0 0 1-.055-.054c-.895-1.244-1.367-2.972-1.367-4.997 0-6.241 4.425-13.875 9.865-17.016 1.573-.908 3.084-1.369 4.489-1.369 1.143 0 2.158.307 3.019.91a.24.24 0 0 1 .055.055c.894 1.244 1.367 2.971 1.367 4.997 0 6.241-4.425 13.875-9.865 17.016-1.573.908-3.084 1.369-4.489 1.369zm-2.718-1.172c.773.533 1.687.901 2.718.901 1.322 0 2.754-.538 4.256-1.405 5.31-3.066 9.631-10.567 9.631-16.661 0-1.908-.434-3.554-1.256-4.716-.774-.532-1.688-.814-2.718-.814-1.322 0-2.754.433-4.256 1.3-5.31 3.066-9.631 10.564-9.631 16.657 0 1.91.434 3.576 1.256 4.738z' fill='#607D8B'/><path d='M150.72 172.361l-.363-.295a24.105 24.105 0 0 0 2.148-3.128 24.05 24.05 0 0 0 1.977-4.375l.443.149a24.54 24.54 0 0 1-2.015 4.46 24.61 24.61 0 0 1-2.19 3.189M115.917 191.514l-.363-.294a24.174 24.174 0 0 0 2.148-3.128 24.038 24.038 0 0 0 1.976-4.375l.443.148a24.48 24.48 0 0 1-2.015 4.461 24.662 24.662 0 0 1-2.189 3.188M114 237.476V182.584 237.476' fill='#607D8B'/><g><path d='M81.822 37.474c.017-.135-.075-.28-.267-.392-.327-.188-.826-.21-1.109-.045l-6.012 3.471c-.131.076-.194.178-.191.285.002.132.002.461.002.578v.043l-.007.128-6.591 3.779c-.001 0-2.077 1.046-2.787 5.192 0 0-.912 6.961-.898 19.745.015 12.57.606 17.07 1.167 21.351.22 1.684 3.001 2.125 3.001 2.125.331.04.698-.027 1.08-.248l75.273-43.551c1.808-1.069 2.667-3.719 3.056-6.284 1.213-7.99 1.675-32.978-.275-39.878-.196-.693-.51-1.083-.868-1.282l-2.086-.79c-.727.028-1.416.467-1.534.535L82.032 37.072l-.21.402' fill='#FFF'/><path d='M144.311 1.701l2.085.79c.358.199.672.589.868 1.282 1.949 6.9 1.487 31.887.275 39.878-.39 2.565-1.249 5.215-3.056 6.284L69.21 93.486a1.78 1.78 0 0 1-.896.258l-.183-.011c0 .001-2.782-.44-3.003-2.124-.56-4.282-1.151-8.781-1.165-21.351-.015-12.784.897-19.745.897-19.745.71-4.146 2.787-5.192 2.787-5.192l6.591-3.779.007-.128v-.043c0-.117 0-.446-.002-.578-.003-.107.059-.21.191-.285l6.012-3.472a.98.98 0 0 1 .481-.11c.218 0 .449.053.627.156.193.112.285.258.268.392l.211-.402 60.744-34.836c.117-.068.806-.507 1.534-.535m0-.997l-.039.001c-.618.023-1.283.244-1.974.656l-.021.012-60.519 34.706a2.358 2.358 0 0 0-.831-.15c-.365 0-.704.084-.98.244l-6.012 3.471c-.442.255-.699.69-.689 1.166l.001.15-6.08 3.487c-.373.199-2.542 1.531-3.29 5.898l-.006.039c-.009.07-.92 7.173-.906 19.875.014 12.62.603 17.116 1.172 21.465l.002.015c.308 2.355 3.475 2.923 3.836 2.98l.034.004c.101.013.204.019.305.019a2.77 2.77 0 0 0 1.396-.392l75.273-43.552c1.811-1.071 2.999-3.423 3.542-6.997 1.186-7.814 1.734-33.096-.301-40.299-.253-.893-.704-1.527-1.343-1.882l-.132-.062-2.085-.789a.973.973 0 0 0-.353-.065' fill='#455A64'/><path d='M128.267 11.565l1.495.434-56.339 32.326' fill='#FFF'/><path d='M74.202 90.545a.5.5 0 0 1-.25-.931l18.437-10.645a.499.499 0 1 1 .499.864L74.451 90.478l-.249.067M75.764 42.654l-.108-.062.046-.171 5.135-2.964.17.045-.045.171-5.135 2.964-.063.017M70.52 90.375V46.421l.063-.036L137.84 7.554v43.954l-.062.036L70.52 90.375zm.25-43.811v43.38l66.821-38.579V7.985L70.77 46.564z' fill='#607D8B'/><path d='M86.986 83.182c-.23.149-.612.384-.849.523l-11.505 6.701c-.237.139-.206.252.068.252h.565c.275 0 .693-.113.93-.252L87.7 83.705c.237-.139.428-.253.425-.256a11.29 11.29 0 0 1-.006-.503c0-.274-.188-.377-.418-.227l-.715.463' fill='#607D8B'/><path d='M75.266 90.782H74.7c-.2 0-.316-.056-.346-.166-.03-.11.043-.217.215-.317l11.505-6.702c.236-.138.615-.371.844-.519l.715-.464a.488.488 0 0 1 .266-.089c.172 0 .345.13.345.421 0 .214.001.363.003.437l.006.004-.004.069c-.003.075-.003.075-.486.356l-11.505 6.702a2.282 2.282 0 0 1-.992.268zm-.6-.25l.034.001h.566c.252 0 .649-.108.866-.234l11.505-6.702c.168-.098.294-.173.361-.214-.004-.084-.004-.218-.004-.437l-.095-.171-.131.049-.714.463c-.232.15-.616.386-.854.525l-11.505 6.702-.029.018z' fill='#607D8B'/><path d='M75.266 89.871H74.7c-.2 0-.316-.056-.346-.166-.03-.11.043-.217.215-.317l11.505-6.702c.258-.151.694-.268.993-.268h.565c.2 0 .316.056.346.166.03.11-.043.217-.215.317l-11.505 6.702a2.282 2.282 0 0 1-.992.268zm-.6-.25l.034.001h.566c.252 0 .649-.107.866-.234l11.505-6.702.03-.018-.035-.001h-.565c-.252 0-.649.108-.867.234l-11.505 6.702-.029.018zM74.37 90.801v-1.247 1.247' fill='#607D8B'/><path d='M68.13 93.901c-.751-.093-1.314-.737-1.439-1.376-.831-4.238-1.151-8.782-1.165-21.352-.015-12.784.897-19.745.897-19.745.711-4.146 2.787-5.192 2.787-5.192l74.859-43.219c.223-.129 2.487-1.584 3.195.923 1.95 6.9 1.488 31.887.275 39.878-.389 2.565-1.248 5.215-3.056 6.283L69.21 93.653c-.382.221-.749.288-1.08.248 0 0-2.781-.441-3.001-2.125-.561-4.281-1.152-8.781-1.167-21.351-.014-12.784.898-19.745.898-19.745.71-4.146 2.787-5.191 2.787-5.191l6.598-3.81.871-.119 6.599-3.83.046-.461L68.13 93.901' fill='#FAFAFA'/><path d='M68.317 94.161l-.215-.013h-.001l-.244-.047c-.719-.156-2.772-.736-2.976-2.292-.568-4.34-1.154-8.813-1.168-21.384-.014-12.654.891-19.707.9-19.777.725-4.231 2.832-5.338 2.922-5.382l6.628-3.827.87-.119 6.446-3.742.034-.334a.248.248 0 0 1 .273-.223.248.248 0 0 1 .223.272l-.059.589-6.752 3.919-.87.118-6.556 3.785c-.031.016-1.99 1.068-2.666 5.018-.007.06-.908 7.086-.894 19.702.014 12.539.597 16.996 1.161 21.305.091.691.689 1.154 1.309 1.452a1.95 1.95 0 0 1-.236-.609c-.781-3.984-1.155-8.202-1.17-21.399-.014-12.653.891-19.707.9-19.777.725-4.231 2.832-5.337 2.922-5.382-.004.001 74.444-42.98 74.846-43.212l.028-.017c.904-.538 1.72-.688 2.36-.433.555.221.949.733 1.172 1.52 2.014 7.128 1.46 32.219.281 39.983-.507 3.341-1.575 5.515-3.175 6.462L69.335 93.869a2.023 2.023 0 0 1-1.018.292zm-.147-.507c.293.036.604-.037.915-.217l75.273-43.551c1.823-1.078 2.602-3.915 2.934-6.106 1.174-7.731 1.731-32.695-.268-39.772-.178-.631-.473-1.032-.876-1.192-.484-.193-1.166-.052-1.921.397l-.034.021-74.858 43.218c-.031.017-1.989 1.069-2.666 5.019-.007.059-.908 7.085-.894 19.702.015 13.155.386 17.351 1.161 21.303.09.461.476.983 1.037 1.139.114.025.185.037.196.039h.001z' fill='#455A64'/><path d='M69.317 68.982c.489-.281.885-.056.885.505 0 .56-.396 1.243-.885 1.525-.488.282-.884.057-.884-.504 0-.56.396-1.243.884-1.526' fill='#FFF'/><path d='M68.92 71.133c-.289 0-.487-.228-.487-.625 0-.56.396-1.243.884-1.526a.812.812 0 0 1 .397-.121c.289 0 .488.229.488.626 0 .56-.396 1.243-.885 1.525a.812.812 0 0 1-.397.121m.794-2.459a.976.976 0 0 0-.49.147c-.548.317-.978 1.058-.978 1.687 0 .486.271.812.674.812a.985.985 0 0 0 .491-.146c.548-.317.978-1.057.978-1.687 0-.486-.272-.813-.675-.813' fill='#8097A2'/><path d='M68.92 70.947c-.271 0-.299-.307-.299-.439 0-.491.361-1.116.79-1.363a.632.632 0 0 1 .303-.096c.272 0 .301.306.301.438 0 .491-.363 1.116-.791 1.364a.629.629 0 0 1-.304.096m.794-2.086a.812.812 0 0 0-.397.121c-.488.283-.884.966-.884 1.526 0 .397.198.625.487.625a.812.812 0 0 0 .397-.121c.489-.282.885-.965.885-1.525 0-.397-.199-.626-.488-.626' fill='#8097A2'/><path d='M69.444 85.35c.264-.152.477-.031.477.272 0 .303-.213.67-.477.822-.263.153-.477.031-.477-.271 0-.302.214-.671.477-.823' fill='#FFF'/><path d='M69.23 86.51c-.156 0-.263-.123-.263-.337 0-.302.214-.671.477-.823a.431.431 0 0 1 .214-.066c.156 0 .263.124.263.338 0 .303-.213.67-.477.822a.431.431 0 0 1-.214.066m.428-1.412c-.1 0-.203.029-.307.09-.32.185-.57.618-.57.985 0 .309.185.524.449.524a.63.63 0 0 0 .308-.09c.32-.185.57-.618.57-.985 0-.309-.185-.524-.45-.524' fill='#8097A2'/><path d='M69.23 86.322l-.076-.149c0-.235.179-.544.384-.661l.12-.041.076.151c0 .234-.179.542-.383.66l-.121.04m.428-1.038a.431.431 0 0 0-.214.066c-.263.152-.477.521-.477.823 0 .214.107.337.263.337a.431.431 0 0 0 .214-.066c.264-.152.477-.519.477-.822 0-.214-.107-.338-.263-.338' fill='#8097A2'/><path d='M139.278 7.769v43.667L72.208 90.16V46.493l67.07-38.724' fill='#455A64'/><path d='M72.083 90.375V46.421l.063-.036 67.257-38.831v43.954l-.062.036-67.258 38.831zm.25-43.811v43.38l66.821-38.579V7.985L72.333 46.564z' fill='#607D8B'/></g><path d='M125.737 88.647l-7.639 3.334V84l-11.459 4.713v8.269L99 100.315l13.369 3.646 13.368-15.314' fill='#455A64'/></g></svg>";
      function RotateInstructions() {
        this.loadIcon_();
        var overlay = document.createElement("div");
        var s = overlay.style;
        s.position = "fixed";
        s.top = 0;
        s.right = 0;
        s.bottom = 0;
        s.left = 0;
        s.backgroundColor = "gray";
        s.fontFamily = "sans-serif";
        s.zIndex = 1e6;
        var img = document.createElement("img");
        img.src = this.icon;
        var s = img.style;
        s.marginLeft = "25%";
        s.marginTop = "25%";
        s.width = "50%";
        overlay.appendChild(img);
        var text2 = document.createElement("div");
        var s = text2.style;
        s.textAlign = "center";
        s.fontSize = "16px";
        s.lineHeight = "24px";
        s.margin = "24px 25%";
        s.width = "50%";
        text2.innerHTML = "Place your phone into your Cardboard viewer.";
        overlay.appendChild(text2);
        var snackbar = document.createElement("div");
        var s = snackbar.style;
        s.backgroundColor = "#CFD8DC";
        s.position = "fixed";
        s.bottom = 0;
        s.width = "100%";
        s.height = "48px";
        s.padding = "14px 24px";
        s.boxSizing = "border-box";
        s.color = "#656A6B";
        overlay.appendChild(snackbar);
        var snackbarText = document.createElement("div");
        snackbarText.style.float = "left";
        snackbarText.innerHTML = "No Cardboard viewer?";
        var snackbarButton = document.createElement("a");
        snackbarButton.href = "https://www.google.com/get/cardboard/get-cardboard/";
        snackbarButton.innerHTML = "get one";
        snackbarButton.target = "_blank";
        var s = snackbarButton.style;
        s.float = "right";
        s.fontWeight = 600;
        s.textTransform = "uppercase";
        s.borderLeft = "1px solid gray";
        s.paddingLeft = "24px";
        s.textDecoration = "none";
        s.color = "#656A6B";
        snackbar.appendChild(snackbarText);
        snackbar.appendChild(snackbarButton);
        this.overlay = overlay;
        this.text = text2;
        this.hide();
      }
      RotateInstructions.prototype.show = function(parent) {
        if (!parent && !this.overlay.parentElement) {
          document.body.appendChild(this.overlay);
        } else if (parent) {
          if (this.overlay.parentElement && this.overlay.parentElement != parent)
            this.overlay.parentElement.removeChild(this.overlay);
          parent.appendChild(this.overlay);
        }
        this.overlay.style.display = "block";
        var img = this.overlay.querySelector("img");
        var s = img.style;
        if (isLandscapeMode()) {
          s.width = "20%";
          s.marginLeft = "40%";
          s.marginTop = "3%";
        } else {
          s.width = "50%";
          s.marginLeft = "25%";
          s.marginTop = "25%";
        }
      };
      RotateInstructions.prototype.hide = function() {
        this.overlay.style.display = "none";
      };
      RotateInstructions.prototype.showTemporarily = function(ms, parent) {
        this.show(parent);
        this.timer = setTimeout(this.hide.bind(this), ms);
      };
      RotateInstructions.prototype.disableShowTemporarily = function() {
        clearTimeout(this.timer);
      };
      RotateInstructions.prototype.update = function() {
        this.disableShowTemporarily();
        if (!isLandscapeMode() && isMobile3()) {
          this.show();
        } else {
          this.hide();
        }
      };
      RotateInstructions.prototype.loadIcon_ = function() {
        this.icon = dataUri("image/svg+xml", rotateInstructionsAsset);
      };
      var DEFAULT_VIEWER = "CardboardV1";
      var VIEWER_KEY = "WEBVR_CARDBOARD_VIEWER";
      var CLASS_NAME = "webvr-polyfill-viewer-selector";
      function ViewerSelector(defaultViewer) {
        try {
          this.selectedKey = localStorage.getItem(VIEWER_KEY);
        } catch (error) {
          console.error("Failed to load viewer profile: %s", error);
        }
        if (!this.selectedKey) {
          this.selectedKey = defaultViewer || DEFAULT_VIEWER;
        }
        this.dialog = this.createDialog_(DeviceInfo.Viewers);
        this.root = null;
        this.onChangeCallbacks_ = [];
      }
      ViewerSelector.prototype.show = function(root) {
        this.root = root;
        root.appendChild(this.dialog);
        var selected = this.dialog.querySelector("#" + this.selectedKey);
        selected.checked = true;
        this.dialog.style.display = "block";
      };
      ViewerSelector.prototype.hide = function() {
        if (this.root && this.root.contains(this.dialog)) {
          this.root.removeChild(this.dialog);
        }
        this.dialog.style.display = "none";
      };
      ViewerSelector.prototype.getCurrentViewer = function() {
        return DeviceInfo.Viewers[this.selectedKey];
      };
      ViewerSelector.prototype.getSelectedKey_ = function() {
        var input = this.dialog.querySelector("input[name=field]:checked");
        if (input) {
          return input.id;
        }
        return null;
      };
      ViewerSelector.prototype.onChange = function(cb) {
        this.onChangeCallbacks_.push(cb);
      };
      ViewerSelector.prototype.fireOnChange_ = function(viewer) {
        for (var i = 0; i < this.onChangeCallbacks_.length; i++) {
          this.onChangeCallbacks_[i](viewer);
        }
      };
      ViewerSelector.prototype.onSave_ = function() {
        this.selectedKey = this.getSelectedKey_();
        if (!this.selectedKey || !DeviceInfo.Viewers[this.selectedKey]) {
          console.error("ViewerSelector.onSave_: this should never happen!");
          return;
        }
        this.fireOnChange_(DeviceInfo.Viewers[this.selectedKey]);
        try {
          localStorage.setItem(VIEWER_KEY, this.selectedKey);
        } catch (error) {
          console.error("Failed to save viewer profile: %s", error);
        }
        this.hide();
      };
      ViewerSelector.prototype.createDialog_ = function(options) {
        var container = document.createElement("div");
        container.classList.add(CLASS_NAME);
        container.style.display = "none";
        var overlay = document.createElement("div");
        var s = overlay.style;
        s.position = "fixed";
        s.left = 0;
        s.top = 0;
        s.width = "100%";
        s.height = "100%";
        s.background = "rgba(0, 0, 0, 0.3)";
        overlay.addEventListener("click", this.hide.bind(this));
        var width = 280;
        var dialog = document.createElement("div");
        var s = dialog.style;
        s.boxSizing = "border-box";
        s.position = "fixed";
        s.top = "24px";
        s.left = "50%";
        s.marginLeft = -width / 2 + "px";
        s.width = width + "px";
        s.padding = "24px";
        s.overflow = "hidden";
        s.background = "#fafafa";
        s.fontFamily = "'Roboto', sans-serif";
        s.boxShadow = "0px 5px 20px #666";
        dialog.appendChild(this.createH1_("Select your viewer"));
        for (var id in options) {
          dialog.appendChild(this.createChoice_(id, options[id].label));
        }
        dialog.appendChild(this.createButton_("Save", this.onSave_.bind(this)));
        container.appendChild(overlay);
        container.appendChild(dialog);
        return container;
      };
      ViewerSelector.prototype.createH1_ = function(name) {
        var h1 = document.createElement("h1");
        var s = h1.style;
        s.color = "black";
        s.fontSize = "20px";
        s.fontWeight = "bold";
        s.marginTop = 0;
        s.marginBottom = "24px";
        h1.innerHTML = name;
        return h1;
      };
      ViewerSelector.prototype.createChoice_ = function(id, name) {
        var div = document.createElement("div");
        div.style.marginTop = "8px";
        div.style.color = "black";
        var input = document.createElement("input");
        input.style.fontSize = "30px";
        input.setAttribute("id", id);
        input.setAttribute("type", "radio");
        input.setAttribute("value", id);
        input.setAttribute("name", "field");
        var label = document.createElement("label");
        label.style.marginLeft = "4px";
        label.setAttribute("for", id);
        label.innerHTML = name;
        div.appendChild(input);
        div.appendChild(label);
        return div;
      };
      ViewerSelector.prototype.createButton_ = function(label, onclick) {
        var button = document.createElement("button");
        button.innerHTML = label;
        var s = button.style;
        s.float = "right";
        s.textTransform = "uppercase";
        s.color = "#1094f7";
        s.fontSize = "14px";
        s.letterSpacing = 0;
        s.border = 0;
        s.background = "none";
        s.marginTop = "16px";
        button.addEventListener("click", onclick);
        return button;
      };
      var commonjsGlobal = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      function unwrapExports(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
      }
      function createCommonjsModule(fn, module2) {
        return module2 = { exports: {} }, fn(module2, module2.exports), module2.exports;
      }
      var NoSleep = createCommonjsModule(function(module2, exports2) {
        (function webpackUniversalModuleDefinition(root, factory) {
          module2.exports = factory();
        })(commonjsGlobal, function() {
          return function(modules) {
            var installedModules = {};
            function __webpack_require__(moduleId) {
              if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
              }
              var module3 = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
              };
              modules[moduleId].call(module3.exports, module3, module3.exports, __webpack_require__);
              module3.l = true;
              return module3.exports;
            }
            __webpack_require__.m = modules;
            __webpack_require__.c = installedModules;
            __webpack_require__.d = function(exports3, name, getter) {
              if (!__webpack_require__.o(exports3, name)) {
                Object.defineProperty(exports3, name, {
                  configurable: false,
                  enumerable: true,
                  get: getter
                });
              }
            };
            __webpack_require__.n = function(module3) {
              var getter = module3 && module3.__esModule ? function getDefault() {
                return module3["default"];
              } : function getModuleExports() {
                return module3;
              };
              __webpack_require__.d(getter, "a", getter);
              return getter;
            };
            __webpack_require__.o = function(object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            __webpack_require__.p = "";
            return __webpack_require__(__webpack_require__.s = 0);
          }([
            function(module3, exports3, __webpack_require__) {
              "use strict";
              var _createClass = function() {
                function defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor)
                      descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }
                return function(Constructor, protoProps, staticProps) {
                  if (protoProps)
                    defineProperties(Constructor.prototype, protoProps);
                  if (staticProps)
                    defineProperties(Constructor, staticProps);
                  return Constructor;
                };
              }();
              function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                  throw new TypeError("Cannot call a class as a function");
                }
              }
              var mediaFile = __webpack_require__(1);
              var oldIOS = typeof navigator !== "undefined" && parseFloat(("" + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) < 10 && !window.MSStream;
              var NoSleep2 = function() {
                function NoSleep3() {
                  _classCallCheck(this, NoSleep3);
                  if (oldIOS) {
                    this.noSleepTimer = null;
                  } else {
                    this.noSleepVideo = document.createElement("video");
                    this.noSleepVideo.setAttribute("playsinline", "");
                    this.noSleepVideo.setAttribute("src", mediaFile);
                    this.noSleepVideo.addEventListener("timeupdate", function(e) {
                      if (this.noSleepVideo.currentTime > 0.5) {
                        this.noSleepVideo.currentTime = Math.random();
                      }
                    }.bind(this));
                  }
                }
                _createClass(NoSleep3, [{
                  key: "enable",
                  value: function enable() {
                    if (oldIOS) {
                      this.disable();
                      this.noSleepTimer = window.setInterval(function() {
                        window.location.href = "/";
                        window.setTimeout(window.stop, 0);
                      }, 15e3);
                    } else {
                      this.noSleepVideo.play();
                    }
                  }
                }, {
                  key: "disable",
                  value: function disable() {
                    if (oldIOS) {
                      if (this.noSleepTimer) {
                        window.clearInterval(this.noSleepTimer);
                        this.noSleepTimer = null;
                      }
                    } else {
                      this.noSleepVideo.pause();
                    }
                  }
                }]);
                return NoSleep3;
              }();
              module3.exports = NoSleep2;
            },
            function(module3, exports3, __webpack_require__) {
              "use strict";
              module3.exports = "data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHAAAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkhAANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcAAAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plgAMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGgcAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAAkBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPkhAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgcAAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6plgAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQGgcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAAACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wALKCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQhP/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAAA1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAAAAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEAAr8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAEAABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABAAAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZAAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAAUrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gAABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMsdHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAAQLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAAABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAAAAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2lsc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA=";
            }
          ]);
        });
      });
      var NoSleep$1 = unwrapExports(NoSleep);
      var nextDisplayId = 1e3;
      var defaultLeftBounds = [0, 0, 0.5, 1];
      var defaultRightBounds = [0.5, 0, 0.5, 1];
      var raf = window.requestAnimationFrame;
      var caf = window.cancelAnimationFrame;
      function VRFrameData() {
        this.leftProjectionMatrix = new Float32Array(16);
        this.leftViewMatrix = new Float32Array(16);
        this.rightProjectionMatrix = new Float32Array(16);
        this.rightViewMatrix = new Float32Array(16);
        this.pose = null;
      }
      function VRDisplayCapabilities(config2) {
        Object.defineProperties(this, {
          hasPosition: {
            writable: false,
            enumerable: true,
            value: config2.hasPosition
          },
          hasExternalDisplay: {
            writable: false,
            enumerable: true,
            value: config2.hasExternalDisplay
          },
          canPresent: {
            writable: false,
            enumerable: true,
            value: config2.canPresent
          },
          maxLayers: {
            writable: false,
            enumerable: true,
            value: config2.maxLayers
          },
          hasOrientation: {
            enumerable: true,
            get: function get() {
              deprecateWarning("VRDisplayCapabilities.prototype.hasOrientation", "VRDisplay.prototype.getFrameData");
              return config2.hasOrientation;
            }
          }
        });
      }
      function VRDisplay(config2) {
        config2 = config2 || {};
        var USE_WAKELOCK = "wakelock" in config2 ? config2.wakelock : true;
        this.isPolyfilled = true;
        this.displayId = nextDisplayId++;
        this.displayName = "";
        this.depthNear = 0.01;
        this.depthFar = 1e4;
        this.isPresenting = false;
        Object.defineProperty(this, "isConnected", {
          get: function get() {
            deprecateWarning("VRDisplay.prototype.isConnected", "VRDisplayCapabilities.prototype.hasExternalDisplay");
            return false;
          }
        });
        this.capabilities = new VRDisplayCapabilities({
          hasPosition: false,
          hasOrientation: false,
          hasExternalDisplay: false,
          canPresent: false,
          maxLayers: 1
        });
        this.stageParameters = null;
        this.waitingForPresent_ = false;
        this.layer_ = null;
        this.originalParent_ = null;
        this.fullscreenElement_ = null;
        this.fullscreenWrapper_ = null;
        this.fullscreenElementCachedStyle_ = null;
        this.fullscreenEventTarget_ = null;
        this.fullscreenChangeHandler_ = null;
        this.fullscreenErrorHandler_ = null;
        if (USE_WAKELOCK && isMobile3()) {
          this.wakelock_ = new NoSleep$1();
        }
      }
      VRDisplay.prototype.getFrameData = function(frameData) {
        return frameDataFromPose(frameData, this._getPose(), this);
      };
      VRDisplay.prototype.getPose = function() {
        deprecateWarning("VRDisplay.prototype.getPose", "VRDisplay.prototype.getFrameData");
        return this._getPose();
      };
      VRDisplay.prototype.resetPose = function() {
        deprecateWarning("VRDisplay.prototype.resetPose");
        return this._resetPose();
      };
      VRDisplay.prototype.getImmediatePose = function() {
        deprecateWarning("VRDisplay.prototype.getImmediatePose", "VRDisplay.prototype.getFrameData");
        return this._getPose();
      };
      VRDisplay.prototype.requestAnimationFrame = function(callback) {
        return raf(callback);
      };
      VRDisplay.prototype.cancelAnimationFrame = function(id) {
        return caf(id);
      };
      VRDisplay.prototype.wrapForFullscreen = function(element) {
        if (isIOS2()) {
          return element;
        }
        if (!this.fullscreenWrapper_) {
          this.fullscreenWrapper_ = document.createElement("div");
          var cssProperties = ["height: " + Math.min(screen.height, screen.width) + "px !important", "top: 0 !important", "left: 0 !important", "right: 0 !important", "border: 0", "margin: 0", "padding: 0", "z-index: 999999 !important", "position: fixed"];
          this.fullscreenWrapper_.setAttribute("style", cssProperties.join("; ") + ";");
          this.fullscreenWrapper_.classList.add("webvr-polyfill-fullscreen-wrapper");
        }
        if (this.fullscreenElement_ == element) {
          return this.fullscreenWrapper_;
        }
        if (this.fullscreenElement_) {
          if (this.originalParent_) {
            this.originalParent_.appendChild(this.fullscreenElement_);
          } else {
            this.fullscreenElement_.parentElement.removeChild(this.fullscreenElement_);
          }
        }
        this.fullscreenElement_ = element;
        this.originalParent_ = element.parentElement;
        if (!this.originalParent_) {
          document.body.appendChild(element);
        }
        if (!this.fullscreenWrapper_.parentElement) {
          var parent = this.fullscreenElement_.parentElement;
          parent.insertBefore(this.fullscreenWrapper_, this.fullscreenElement_);
          parent.removeChild(this.fullscreenElement_);
        }
        this.fullscreenWrapper_.insertBefore(this.fullscreenElement_, this.fullscreenWrapper_.firstChild);
        this.fullscreenElementCachedStyle_ = this.fullscreenElement_.getAttribute("style");
        var self2 = this;
        function applyFullscreenElementStyle() {
          if (!self2.fullscreenElement_) {
            return;
          }
          var cssProperties2 = ["position: absolute", "top: 0", "left: 0", "width: " + Math.max(screen.width, screen.height) + "px", "height: " + Math.min(screen.height, screen.width) + "px", "border: 0", "margin: 0", "padding: 0"];
          self2.fullscreenElement_.setAttribute("style", cssProperties2.join("; ") + ";");
        }
        applyFullscreenElementStyle();
        return this.fullscreenWrapper_;
      };
      VRDisplay.prototype.removeFullscreenWrapper = function() {
        if (!this.fullscreenElement_) {
          return;
        }
        var element = this.fullscreenElement_;
        if (this.fullscreenElementCachedStyle_) {
          element.setAttribute("style", this.fullscreenElementCachedStyle_);
        } else {
          element.removeAttribute("style");
        }
        this.fullscreenElement_ = null;
        this.fullscreenElementCachedStyle_ = null;
        var parent = this.fullscreenWrapper_.parentElement;
        this.fullscreenWrapper_.removeChild(element);
        if (this.originalParent_ === parent) {
          parent.insertBefore(element, this.fullscreenWrapper_);
        } else if (this.originalParent_) {
          this.originalParent_.appendChild(element);
        }
        parent.removeChild(this.fullscreenWrapper_);
        return element;
      };
      VRDisplay.prototype.requestPresent = function(layers) {
        var wasPresenting = this.isPresenting;
        var self2 = this;
        if (!(layers instanceof Array)) {
          deprecateWarning("VRDisplay.prototype.requestPresent with non-array argument", "an array of VRLayers as the first argument");
          layers = [layers];
        }
        return new Promise(function(resolve, reject) {
          if (!self2.capabilities.canPresent) {
            reject(new Error("VRDisplay is not capable of presenting."));
            return;
          }
          if (layers.length == 0 || layers.length > self2.capabilities.maxLayers) {
            reject(new Error("Invalid number of layers."));
            return;
          }
          var incomingLayer = layers[0];
          if (!incomingLayer.source) {
            resolve();
            return;
          }
          var leftBounds = incomingLayer.leftBounds || defaultLeftBounds;
          var rightBounds = incomingLayer.rightBounds || defaultRightBounds;
          if (wasPresenting) {
            var layer = self2.layer_;
            if (layer.source !== incomingLayer.source) {
              layer.source = incomingLayer.source;
            }
            for (var i = 0; i < 4; i++) {
              layer.leftBounds[i] = leftBounds[i];
              layer.rightBounds[i] = rightBounds[i];
            }
            self2.wrapForFullscreen(self2.layer_.source);
            self2.updatePresent_();
            resolve();
            return;
          }
          self2.layer_ = {
            predistorted: incomingLayer.predistorted,
            source: incomingLayer.source,
            leftBounds: leftBounds.slice(0),
            rightBounds: rightBounds.slice(0)
          };
          self2.waitingForPresent_ = false;
          if (self2.layer_ && self2.layer_.source) {
            var fullscreenElement = self2.wrapForFullscreen(self2.layer_.source);
            var onFullscreenChange = function onFullscreenChange2() {
              var actualFullscreenElement = getFullscreenElement();
              self2.isPresenting = fullscreenElement === actualFullscreenElement;
              if (self2.isPresenting) {
                if (screen.orientation && screen.orientation.lock) {
                  screen.orientation.lock("landscape-primary").catch(function(error) {
                    console.error("screen.orientation.lock() failed due to", error.message);
                  });
                }
                self2.waitingForPresent_ = false;
                self2.beginPresent_();
                resolve();
              } else {
                if (screen.orientation && screen.orientation.unlock) {
                  screen.orientation.unlock();
                }
                self2.removeFullscreenWrapper();
                self2.disableWakeLock();
                self2.endPresent_();
                self2.removeFullscreenListeners_();
              }
              self2.fireVRDisplayPresentChange_();
            };
            var onFullscreenError = function onFullscreenError2() {
              if (!self2.waitingForPresent_) {
                return;
              }
              self2.removeFullscreenWrapper();
              self2.removeFullscreenListeners_();
              self2.disableWakeLock();
              self2.waitingForPresent_ = false;
              self2.isPresenting = false;
              reject(new Error("Unable to present."));
            };
            self2.addFullscreenListeners_(fullscreenElement, onFullscreenChange, onFullscreenError);
            if (requestFullscreen(fullscreenElement)) {
              self2.enableWakeLock();
              self2.waitingForPresent_ = true;
            } else if (isIOS2() || isWebViewAndroid()) {
              self2.enableWakeLock();
              self2.isPresenting = true;
              self2.beginPresent_();
              self2.fireVRDisplayPresentChange_();
              resolve();
            }
          }
          if (!self2.waitingForPresent_ && !isIOS2()) {
            exitFullscreen();
            reject(new Error("Unable to present."));
          }
        });
      };
      VRDisplay.prototype.exitPresent = function() {
        var wasPresenting = this.isPresenting;
        var self2 = this;
        this.isPresenting = false;
        this.layer_ = null;
        this.disableWakeLock();
        return new Promise(function(resolve, reject) {
          if (wasPresenting) {
            if (!exitFullscreen() && isIOS2()) {
              self2.endPresent_();
              self2.fireVRDisplayPresentChange_();
            }
            if (isWebViewAndroid()) {
              self2.removeFullscreenWrapper();
              self2.removeFullscreenListeners_();
              self2.endPresent_();
              self2.fireVRDisplayPresentChange_();
            }
            resolve();
          } else {
            reject(new Error("Was not presenting to VRDisplay."));
          }
        });
      };
      VRDisplay.prototype.getLayers = function() {
        if (this.layer_) {
          return [this.layer_];
        }
        return [];
      };
      VRDisplay.prototype.fireVRDisplayPresentChange_ = function() {
        var event = new CustomEvent("vrdisplaypresentchange", { detail: { display: this } });
        window.dispatchEvent(event);
      };
      VRDisplay.prototype.fireVRDisplayConnect_ = function() {
        var event = new CustomEvent("vrdisplayconnect", { detail: { display: this } });
        window.dispatchEvent(event);
      };
      VRDisplay.prototype.addFullscreenListeners_ = function(element, changeHandler, errorHandler) {
        this.removeFullscreenListeners_();
        this.fullscreenEventTarget_ = element;
        this.fullscreenChangeHandler_ = changeHandler;
        this.fullscreenErrorHandler_ = errorHandler;
        if (changeHandler) {
          if (document.fullscreenEnabled) {
            element.addEventListener("fullscreenchange", changeHandler, false);
          } else if (document.webkitFullscreenEnabled) {
            element.addEventListener("webkitfullscreenchange", changeHandler, false);
          } else if (document.mozFullScreenEnabled) {
            document.addEventListener("mozfullscreenchange", changeHandler, false);
          } else if (document.msFullscreenEnabled) {
            element.addEventListener("msfullscreenchange", changeHandler, false);
          }
        }
        if (errorHandler) {
          if (document.fullscreenEnabled) {
            element.addEventListener("fullscreenerror", errorHandler, false);
          } else if (document.webkitFullscreenEnabled) {
            element.addEventListener("webkitfullscreenerror", errorHandler, false);
          } else if (document.mozFullScreenEnabled) {
            document.addEventListener("mozfullscreenerror", errorHandler, false);
          } else if (document.msFullscreenEnabled) {
            element.addEventListener("msfullscreenerror", errorHandler, false);
          }
        }
      };
      VRDisplay.prototype.removeFullscreenListeners_ = function() {
        if (!this.fullscreenEventTarget_)
          return;
        var element = this.fullscreenEventTarget_;
        if (this.fullscreenChangeHandler_) {
          var changeHandler = this.fullscreenChangeHandler_;
          element.removeEventListener("fullscreenchange", changeHandler, false);
          element.removeEventListener("webkitfullscreenchange", changeHandler, false);
          document.removeEventListener("mozfullscreenchange", changeHandler, false);
          element.removeEventListener("msfullscreenchange", changeHandler, false);
        }
        if (this.fullscreenErrorHandler_) {
          var errorHandler = this.fullscreenErrorHandler_;
          element.removeEventListener("fullscreenerror", errorHandler, false);
          element.removeEventListener("webkitfullscreenerror", errorHandler, false);
          document.removeEventListener("mozfullscreenerror", errorHandler, false);
          element.removeEventListener("msfullscreenerror", errorHandler, false);
        }
        this.fullscreenEventTarget_ = null;
        this.fullscreenChangeHandler_ = null;
        this.fullscreenErrorHandler_ = null;
      };
      VRDisplay.prototype.enableWakeLock = function() {
        if (this.wakelock_) {
          this.wakelock_.enable();
        }
      };
      VRDisplay.prototype.disableWakeLock = function() {
        if (this.wakelock_) {
          this.wakelock_.disable();
        }
      };
      VRDisplay.prototype.beginPresent_ = function() {
      };
      VRDisplay.prototype.endPresent_ = function() {
      };
      VRDisplay.prototype.submitFrame = function(pose) {
      };
      VRDisplay.prototype.getEyeParameters = function(whichEye) {
        return null;
      };
      var config = {
        ADDITIONAL_VIEWERS: [],
        DEFAULT_VIEWER: "",
        MOBILE_WAKE_LOCK: true,
        DEBUG: false,
        DPDB_URL: "https://dpdb.webvr.rocks/dpdb.json",
        K_FILTER: 0.98,
        PREDICTION_TIME_S: 0.04,
        CARDBOARD_UI_DISABLED: false,
        ROTATE_INSTRUCTIONS_DISABLED: false,
        YAW_ONLY: false,
        BUFFER_SCALE: 0.5,
        DIRTY_SUBMIT_FRAME_BINDINGS: false
      };
      var Eye = {
        LEFT: "left",
        RIGHT: "right"
      };
      function CardboardVRDisplay2(config$$1) {
        var defaults = extend({}, config);
        config$$1 = extend(defaults, config$$1 || {});
        VRDisplay.call(this, {
          wakelock: config$$1.MOBILE_WAKE_LOCK
        });
        this.config = config$$1;
        this.displayName = "Cardboard VRDisplay";
        this.capabilities = new VRDisplayCapabilities({
          hasPosition: false,
          hasOrientation: true,
          hasExternalDisplay: false,
          canPresent: true,
          maxLayers: 1
        });
        this.stageParameters = null;
        this.bufferScale_ = this.config.BUFFER_SCALE;
        this.poseSensor_ = new PoseSensor(this.config);
        this.distorter_ = null;
        this.cardboardUI_ = null;
        this.dpdb_ = new Dpdb(this.config.DPDB_URL, this.onDeviceParamsUpdated_.bind(this));
        this.deviceInfo_ = new DeviceInfo(this.dpdb_.getDeviceParams(), config$$1.ADDITIONAL_VIEWERS);
        this.viewerSelector_ = new ViewerSelector(config$$1.DEFAULT_VIEWER);
        this.viewerSelector_.onChange(this.onViewerChanged_.bind(this));
        this.deviceInfo_.setViewer(this.viewerSelector_.getCurrentViewer());
        if (!this.config.ROTATE_INSTRUCTIONS_DISABLED) {
          this.rotateInstructions_ = new RotateInstructions();
        }
        if (isIOS2()) {
          window.addEventListener("resize", this.onResize_.bind(this));
        }
      }
      CardboardVRDisplay2.prototype = Object.create(VRDisplay.prototype);
      CardboardVRDisplay2.prototype._getPose = function() {
        return {
          position: null,
          orientation: this.poseSensor_.getOrientation(),
          linearVelocity: null,
          linearAcceleration: null,
          angularVelocity: null,
          angularAcceleration: null
        };
      };
      CardboardVRDisplay2.prototype._resetPose = function() {
        if (this.poseSensor_.resetPose) {
          this.poseSensor_.resetPose();
        }
      };
      CardboardVRDisplay2.prototype._getFieldOfView = function(whichEye) {
        var fieldOfView;
        if (whichEye == Eye.LEFT) {
          fieldOfView = this.deviceInfo_.getFieldOfViewLeftEye();
        } else if (whichEye == Eye.RIGHT) {
          fieldOfView = this.deviceInfo_.getFieldOfViewRightEye();
        } else {
          console.error("Invalid eye provided: %s", whichEye);
          return null;
        }
        return fieldOfView;
      };
      CardboardVRDisplay2.prototype._getEyeOffset = function(whichEye) {
        var offset;
        if (whichEye == Eye.LEFT) {
          offset = [-this.deviceInfo_.viewer.interLensDistance * 0.5, 0, 0];
        } else if (whichEye == Eye.RIGHT) {
          offset = [this.deviceInfo_.viewer.interLensDistance * 0.5, 0, 0];
        } else {
          console.error("Invalid eye provided: %s", whichEye);
          return null;
        }
        return offset;
      };
      CardboardVRDisplay2.prototype.getEyeParameters = function(whichEye) {
        var offset = this._getEyeOffset(whichEye);
        var fieldOfView = this._getFieldOfView(whichEye);
        var eyeParams = {
          offset,
          renderWidth: this.deviceInfo_.device.width * 0.5 * this.bufferScale_,
          renderHeight: this.deviceInfo_.device.height * this.bufferScale_
        };
        Object.defineProperty(eyeParams, "fieldOfView", {
          enumerable: true,
          get: function get() {
            deprecateWarning("VRFieldOfView", "VRFrameData's projection matrices");
            return fieldOfView;
          }
        });
        return eyeParams;
      };
      CardboardVRDisplay2.prototype.onDeviceParamsUpdated_ = function(newParams) {
        if (this.config.DEBUG) {
          console.log("DPDB reported that device params were updated.");
        }
        this.deviceInfo_.updateDeviceParams(newParams);
        if (this.distorter_) {
          this.distorter_.updateDeviceInfo(this.deviceInfo_);
        }
      };
      CardboardVRDisplay2.prototype.updateBounds_ = function() {
        if (this.layer_ && this.distorter_ && (this.layer_.leftBounds || this.layer_.rightBounds)) {
          this.distorter_.setTextureBounds(this.layer_.leftBounds, this.layer_.rightBounds);
        }
      };
      CardboardVRDisplay2.prototype.beginPresent_ = function() {
        var gl = this.layer_.source.getContext("webgl");
        if (!gl)
          gl = this.layer_.source.getContext("experimental-webgl");
        if (!gl)
          gl = this.layer_.source.getContext("webgl2");
        if (!gl)
          return;
        if (this.layer_.predistorted) {
          if (!this.config.CARDBOARD_UI_DISABLED) {
            gl.canvas.width = getScreenWidth() * this.bufferScale_;
            gl.canvas.height = getScreenHeight() * this.bufferScale_;
            this.cardboardUI_ = new CardboardUI(gl);
          }
        } else {
          if (!this.config.CARDBOARD_UI_DISABLED) {
            this.cardboardUI_ = new CardboardUI(gl);
          }
          this.distorter_ = new CardboardDistorter(gl, this.cardboardUI_, this.config.BUFFER_SCALE, this.config.DIRTY_SUBMIT_FRAME_BINDINGS);
          this.distorter_.updateDeviceInfo(this.deviceInfo_);
        }
        if (this.cardboardUI_) {
          this.cardboardUI_.listen(function(e) {
            this.viewerSelector_.show(this.layer_.source.parentElement);
            e.stopPropagation();
            e.preventDefault();
          }.bind(this), function(e) {
            this.exitPresent();
            e.stopPropagation();
            e.preventDefault();
          }.bind(this));
        }
        if (this.rotateInstructions_) {
          if (isLandscapeMode() && isMobile3()) {
            this.rotateInstructions_.showTemporarily(3e3, this.layer_.source.parentElement);
          } else {
            this.rotateInstructions_.update();
          }
        }
        this.orientationHandler = this.onOrientationChange_.bind(this);
        window.addEventListener("orientationchange", this.orientationHandler);
        this.vrdisplaypresentchangeHandler = this.updateBounds_.bind(this);
        window.addEventListener("vrdisplaypresentchange", this.vrdisplaypresentchangeHandler);
        this.fireVRDisplayDeviceParamsChange_();
      };
      CardboardVRDisplay2.prototype.endPresent_ = function() {
        if (this.distorter_) {
          this.distorter_.destroy();
          this.distorter_ = null;
        }
        if (this.cardboardUI_) {
          this.cardboardUI_.destroy();
          this.cardboardUI_ = null;
        }
        if (this.rotateInstructions_) {
          this.rotateInstructions_.hide();
        }
        this.viewerSelector_.hide();
        window.removeEventListener("orientationchange", this.orientationHandler);
        window.removeEventListener("vrdisplaypresentchange", this.vrdisplaypresentchangeHandler);
      };
      CardboardVRDisplay2.prototype.updatePresent_ = function() {
        this.endPresent_();
        this.beginPresent_();
      };
      CardboardVRDisplay2.prototype.submitFrame = function(pose) {
        if (this.distorter_) {
          this.updateBounds_();
          this.distorter_.submitFrame();
        } else if (this.cardboardUI_ && this.layer_) {
          var gl = this.layer_.source.getContext("webgl");
          if (!gl)
            gl = this.layer_.source.getContext("experimental-webgl");
          if (!gl)
            gl = this.layer_.source.getContext("webgl2");
          var canvas = gl.canvas;
          if (canvas.width != this.lastWidth || canvas.height != this.lastHeight) {
            this.cardboardUI_.onResize();
          }
          this.lastWidth = canvas.width;
          this.lastHeight = canvas.height;
          this.cardboardUI_.render();
        }
      };
      CardboardVRDisplay2.prototype.onOrientationChange_ = function(e) {
        this.viewerSelector_.hide();
        if (this.rotateInstructions_) {
          this.rotateInstructions_.update();
        }
        this.onResize_();
      };
      CardboardVRDisplay2.prototype.onResize_ = function(e) {
        if (this.layer_) {
          var gl = this.layer_.source.getContext("webgl");
          if (!gl)
            gl = this.layer_.source.getContext("experimental-webgl");
          if (!gl)
            gl = this.layer_.source.getContext("webgl2");
          var cssProperties = [
            "position: absolute",
            "top: 0",
            "left: 0",
            "width: 100vw",
            "height: 100vh",
            "border: 0",
            "margin: 0",
            "padding: 0px",
            "box-sizing: content-box"
          ];
          gl.canvas.setAttribute("style", cssProperties.join("; ") + ";");
          safariCssSizeWorkaround(gl.canvas);
        }
      };
      CardboardVRDisplay2.prototype.onViewerChanged_ = function(viewer) {
        this.deviceInfo_.setViewer(viewer);
        if (this.distorter_) {
          this.distorter_.updateDeviceInfo(this.deviceInfo_);
        }
        this.fireVRDisplayDeviceParamsChange_();
      };
      CardboardVRDisplay2.prototype.fireVRDisplayDeviceParamsChange_ = function() {
        var event = new CustomEvent("vrdisplaydeviceparamschange", {
          detail: {
            vrdisplay: this,
            deviceInfo: this.deviceInfo_
          }
        });
        window.dispatchEvent(event);
      };
      CardboardVRDisplay2.VRFrameData = VRFrameData;
      CardboardVRDisplay2.VRDisplay = VRDisplay;
      return CardboardVRDisplay2;
    });
  }
});

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
function isBadNumber(num) {
  return isNullOrUndefined(num) || !Number.isFinite(num) || Number.isNaN(num);
}
function isGoodNumber(obj2) {
  return isNumber(obj2) && !isBadNumber(obj2);
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
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
  val.constructor && val.constructor.name === "ArrayBuffer");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/arrays.ts
function arrayClear(arr) {
  return arr.splice(0);
}
function arrayCompare(arr1, arr2) {
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return -1;
}
function arrayRemove(arr, value) {
  const idx = arr.indexOf(value);
  if (idx > -1) {
    arrayRemoveAt(arr, idx);
    return true;
  }
  return false;
}
function arrayFilter(arr, predicate) {
  for (let i = arr.length - 1; i >= 0; --i) {
    if (predicate(arr[i])) {
      return arrayRemoveAt(arr, i);
    }
  }
  return null;
}
function arrayRemoveByKey(arr, key, getKey) {
  return arrayFilter(arr, (v) => getKey(v) === key);
}
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}
function _arrayScan(forward, arr, tests) {
  const start = forward ? 0 : arr.length - 1;
  const end = forward ? arr.length : -1;
  const inc = forward ? 1 : -1;
  for (const test of tests) {
    for (let i = start; i != end; i += inc) {
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
function arraySortByKeyInPlace(newArr, keySelector) {
  newArr.sort((a, b) => {
    const keyA = keySelector(a);
    const keyB = keySelector(b);
    if (keyA < keyB) {
      return -1;
    } else if (keyA > keyB) {
      return 1;
    } else {
      return 0;
    }
  });
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/EventBase.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/Task.ts
var Task = class {
  /**
   * Create a new Task
   *
   * @param autoStart - set to false to require manually starting the Task. Useful
   * for reusable tasks that run on timers.
   */
  constructor(autoStart = true) {
    this.autoStart = autoStart;
    this.onThens = new Array();
    this.onCatches = new Array();
    this._result = void 0;
    this._error = void 0;
    this._executionState = "waiting";
    this._resultState = "none";
    this.resolve = (value) => {
      if (this.running) {
        this._result = value;
        this._resultState = "resolved";
        for (const thenner of this.onThens) {
          thenner(value);
        }
        this.clear();
        this._executionState = "finished";
      }
    };
    this.reject = (reason) => {
      if (this.running) {
        this._error = reason;
        this._resultState = "errored";
        for (const catcher of this.onCatches) {
          catcher(reason);
        }
        this.clear();
        this._executionState = "finished";
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
  /**
   * If the task was not auto-started, signal that the task is now ready to recieve
   * resolutions or rejections.
   **/
  start() {
    this._executionState = "running";
  }
  /**
   * Creates a resolving callback for a static value.
   * @param value
   */
  resolver(value) {
    return () => this.resolve(value);
  }
  resolveOn(target, resolveEvt, value) {
    const resolver = this.resolver(value);
    target.addEventListener(resolveEvt, resolver);
    this.finally(() => target.removeEventListener(resolveEvt, resolver));
  }
  /**
   * Get the last result that the task had resolved to, if any is available.
   *
   * If the Task had been rejected, attempting to get the result will rethrow
   * the error that had rejected the task.
   **/
  get result() {
    if (isDefined(this.error)) {
      throw this.error;
    }
    return this._result;
  }
  /**
   * Get the last error that the task had been rejected by, if any.
   **/
  get error() {
    return this._error;
  }
  /**
   * Get the current state of the task.
   **/
  get executionState() {
    return this._executionState;
  }
  /**
   * Returns true when the Task is hasn't started yet.
   **/
  get waiting() {
    return this.executionState === "waiting";
  }
  /**
   * Returns true when the Task is waiting to be resolved or rejected.
   **/
  get started() {
    return this.executionState !== "waiting";
  }
  /**
   * Returns true after the Task has started, but before it has finished.
   **/
  get running() {
    return this.executionState === "running";
  }
  /**
   * Returns true when the Task has been resolved or rejected.
   **/
  get finished() {
    return this.executionState === "finished";
  }
  get resultState() {
    return this._resultState;
  }
  /**
   * Returns true if the Task had been resolved successfully.
   **/
  get resolved() {
    return this.resultState === "resolved";
  }
  /**
   * Returns true if the Task had been rejected, regardless of any
   * reason being given.
   **/
  get errored() {
    return this.resultState === "errored";
  }
  get [Symbol.toStringTag]() {
    return this.toString();
  }
  /**
   * Calling Task.then(), Task.catch(), or Task.finally() creates a new Promise.
   * This method creates that promise and links it with the task.
   **/
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
  /**
   * Attach a handler to the task that fires when the task is resolved.
   * 
   * @param onfulfilled
   * @param onrejected
   */
  then(onfulfilled, onrejected) {
    return this.project().then(onfulfilled, onrejected);
  }
  /**
   * Attach a handler that fires when the Task is rejected.
   * 
   * @param onrejected
   */
  catch(onrejected) {
    return this.project().catch(onrejected);
  }
  /**
   * Attach a handler that fires regardless of whether the Task is resolved
   * or rejected.
   * 
   * @param onfinally
   */
  finally(onfinally) {
    return this.project().finally(onfinally);
  }
  /**
   * Resets the Task to an unsignalled state, which is useful for
   * reducing GC pressure when working with lots of tasks.
   **/
  reset() {
    this._reset(this.autoStart);
  }
  restart() {
    this._reset(true);
  }
  _reset(start) {
    if (this.running) {
      this.reject("Resetting previous invocation");
    }
    this.clear();
    this._result = void 0;
    this._error = void 0;
    this._executionState = "waiting";
    this._resultState = "none";
    if (start) {
      this.start();
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/once.ts
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
  register(resolveEvt, (evt) => task.resolve(evt));
  const onReject = (evt) => task.reject(evt);
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
  /**
   * Creates a new setter functor for HTML Attributes
   * @param key - the attribute name.
   * @param value - the value to set for the attribute.
   * @param tags - the HTML tags that support this attribute.
   */
  constructor(key, value, bySetAttribute, ...tags) {
    this.key = key;
    this.value = value;
    this.bySetAttribute = bySetAttribute;
    this.tags = tags.map((t2) => t2.toLocaleUpperCase());
    Object.freeze(this);
  }
  /**
   * Set the attribute value on an HTMLElement
   * @param elem - the element on which to set the attribute.
   */
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
      const arr = this.value.filter(identity);
      if (arr.length > 0) {
        arr.forEach((v) => elem.classList.add(v));
      }
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
function htmlHeight(value) {
  return new Attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function rel(value) {
  return new Attr("rel", value, false, "a", "area", "link");
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
function rgb(...v) {
  return `rgb(${v.join(", ")})`;
}
function getMonospaceFonts() {
  return "ui-monospace, 'Droid Sans Mono', 'Cascadia Mono', 'Segoe UI Mono', 'Ubuntu Mono', 'Roboto Mono', Menlo, Monaco, Consolas, monospace";
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/tags.ts
function isErsatzElement(obj2) {
  if (!isObject(obj2)) {
    return false;
  }
  const elem = obj2;
  return elem.element instanceof Element;
}
function resolveElement(elem) {
  if (isErsatzElement(elem)) {
    return elem.element;
  } else if (isString(elem)) {
    return getElement(elem);
  }
  return elem;
}
function isIElementAppliable(obj2) {
  return isObject(obj2) && "applyToElement" in obj2 && isFunction(obj2.applyToElement);
}
function elementSetDisplay(elem, visible, visibleDisplayType = "") {
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
function getCanvas(selector) {
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
function Canvas(...rest) {
  return tag("canvas", ...rest);
}
function Img(...rest) {
  return tag("img", ...rest);
}
function Link(...rest) {
  return tag("link", ...rest);
}
function Script(...rest) {
  return tag("script", ...rest);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/assertSuccess.ts
function assertSuccess(response) {
  if (response.status >= 400) {
    throw new Error("Resource could not be retrieved: " + response.requestPath);
  }
  return response;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/unwrapResponse.ts
function unwrapResponse(response) {
  const { content } = assertSuccess(response);
  return content;
}

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/model.ts
var model = /* @__PURE__ */ specialize("model");
var Model_Gltf_Binary = /* @__PURE__ */ model("gltf-binary", "glb");
var Model_Gltf_Json = /* @__PURE__ */ model("gltf+json", "gltf");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/text.ts
var text = /* @__PURE__ */ specialize("text");
var Text_Css = /* @__PURE__ */ text("css", "css");
var Text_Plain = /* @__PURE__ */ text("plain", "txt", "text", "conf", "def", "list", "log", "in");
var Text_Xml = /* @__PURE__ */ text("xml");

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
function isCanvas(obj2) {
  return isHTMLCanvas(obj2) || isOffscreenCanvas(obj2);
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
function drawImageToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.drawImage(img, 0, 0);
}
function dispose2(val) {
  if (isCanvas(val)) {
    val.width = val.height = 0;
  } else {
    dispose(val);
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/Asset.ts
function isAsset(obj2) {
  return isDefined(obj2) && isFunction(obj2.then) && isFunction(obj2.catch) && isFunction(obj2.finally) && isFunction(obj2.fetch) && isFunction(obj2.getSize);
}
var BaseAsset = class {
  constructor(path, type2) {
    this.path = path;
    this.type = type2;
    this._result = null;
    this._error = null;
    this._started = false;
    this._finished = false;
    this.resolve = null;
    this.reject = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (value) => {
        this._result = value;
        this._finished = true;
        resolve(value);
      };
      this.reject = (reason) => {
        this._error = reason;
        this._finished = true;
        reject(reason);
      };
    });
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
  async getSize(fetcher) {
    try {
      const { contentLength } = await fetcher.head(this.path).accept(this.type).exec();
      return [this, contentLength || 1];
    } catch (exp) {
      console.warn(exp);
      return [this, 1];
    }
    ;
  }
  async fetch(fetcher, prog) {
    try {
      const result = await this.getResult(fetcher, prog);
      this.resolve(result);
    } catch (err) {
      this.reject(err);
    }
  }
  get [Symbol.toStringTag]() {
    return this.promise.toString();
  }
  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.promise.catch(onrejected);
  }
  finally(onfinally) {
    return this.promise.finally(onfinally);
  }
};
var BaseFetchedAsset = class extends BaseAsset {
  constructor(path, typeOrUseCache, useCache) {
    let type2;
    if (isBoolean(typeOrUseCache)) {
      useCache = typeOrUseCache;
    } else {
      type2 = typeOrUseCache;
    }
    super(path, type2);
    this.useCache = !!useCache;
  }
  getResult(fetcher, prog) {
    return this.getRequest(fetcher, prog).then(unwrapResponse);
  }
  getRequest(fetcher, prog) {
    const request = fetcher.get(this.path).useCache(this.useCache).progress(prog);
    return this.getResponse(request);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/flags.ts
function isChrome() {
  return "chrome" in globalThis && !navigator.userAgent.match("CriOS");
}
function isFirefox() {
  return "InstallTrigger" in globalThis;
}
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function isMacOS() {
  return /^mac/i.test(navigator.platform);
}
function isIOS() {
  return /iP(ad|hone|od)/.test(navigator.platform) || /Macintosh(.*?) FxiOS(.*?)\//.test(navigator.platform) || isMacOS() && "maxTouchPoints" in navigator && navigator.maxTouchPoints > 2;
}
function isMobileVR() {
  return /Mobile VR/.test(navigator.userAgent) || /Pico Neo 3 Link/.test(navigator.userAgent) || isOculusBrowser;
}
function hasWebXR() {
  return "xr" in navigator && "isSessionSupported" in navigator.xr;
}
function hasWebVR() {
  return "getVRDisplays" in navigator;
}
function hasVR() {
  return hasWebXR() || hasWebVR();
}
function isMobile() {
  return /Android/.test(navigator.userAgent) || /BlackBerry/.test(navigator.userAgent) || /(UC Browser |UCWEB)/.test(navigator.userAgent) || isIOS() || isMobileVR();
}
function isDesktop() {
  return !isMobile();
}
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
function feet2Meters(feet) {
  return feet / FEET_PER_METER;
}

// global-externals:three
var { ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AlphaFormat, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AmbientLightProbe, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, Audio: Audio2, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, BackSide, BasicDepthPacking, BasicShadowMap, Bone, BooleanKeyframeTrack, Box2, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasTexture, CapsuleBufferGeometry, CapsuleGeometry, CatmullRomCurve3, CineonToneMapping, CircleBufferGeometry, CircleGeometry, ClampToEdgeWrapping, Clock, Color, ColorKeyframeTrack, ColorManagement, CompressedArrayTexture, CompressedTexture, CompressedTextureLoader, ConeBufferGeometry, ConeGeometry, CubeCamera, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderBufferGeometry, CylinderGeometry, Cylindrical, Data3DTexture, DataArrayTexture, DataTexture, DataTextureLoader, DataUtils, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DisplayP3ColorSpace, DodecahedronBufferGeometry, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EllipseCurve, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExtrudeBufferGeometry, ExtrudeGeometry, FileLoader, Float16BufferAttribute, Float32BufferAttribute, Float64BufferAttribute, FloatType, Fog, FogExp2, FramebufferTexture, FrontSide, Frustum, GLBufferAttribute, GLSL1, GLSL3, GreaterDepth, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HalfFloatType, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, IcosahedronBufferGeometry, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InvertStencilOp, KeepStencilOp, KeyframeTrack, LOD, LatheBufferGeometry, LatheGeometry, Layers, LessDepth, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LineSegments, LinearEncoding, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearSRGBColorSpace, LinearToneMapping, Loader, LoaderUtils, LoadingManager, LoopOnce, LoopPingPong, LoopRepeat, LuminanceAlphaFormat, LuminanceFormat, MOUSE, Material, MaterialLoader, MathUtils, Matrix3, Matrix4, MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeverDepth, NeverStencilFunc, NoBlending, NoColorSpace, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronBufferGeometry, OctahedronGeometry, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, Path, PerspectiveCamera, Plane, PlaneBufferGeometry, PlaneGeometry, PlaneHelper, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronBufferGeometry, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, RED_GREEN_RGTC2_Format, RED_RGTC1_Format, REVISION, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat, RedIntegerFormat, ReinhardToneMapping, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingBufferGeometry, RingGeometry, SIGNED_RED_GREEN_RGTC2_Format, SIGNED_RED_RGTC1_Format, SRGBColorSpace, Scene, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeBufferGeometry, ShapeGeometry, ShapePath, ShapeUtils, ShortType, Skeleton, SkeletonHelper, SkinnedMesh, Source, Sphere, SphereBufferGeometry, SphereGeometry, Spherical, SphericalHarmonics3, SplineCurve, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage, StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronBufferGeometry, TetrahedronGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusGeometry, TorusKnotBufferGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeBufferGeometry, TubeGeometry, TwoPassDoubleSide, UVMapping, Uint16BufferAttribute, Uint32BufferAttribute, Uint8BufferAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsGroup, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt248Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, VideoTexture, WebGL1Renderer, WebGL3DRenderTarget, WebGLArrayRenderTarget, WebGLCubeRenderTarget, WebGLMultipleRenderTargets, WebGLRenderTarget, WebGLRenderer, WebGLUtils, WireframeGeometry, WrapAroundEnding, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, _SRGBAFormat, sRGBEncoding } = THREE;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/translateResponse.ts
async function translateResponse(response, translate) {
  const {
    status,
    requestPath,
    responsePath,
    content,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
  return {
    status,
    requestPath,
    responsePath,
    content: isDefined(translate) ? await translate(content) : void 0,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  };
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/AssetGltfModel.ts
var AssetGltfModel = class extends BaseFetchedAsset {
  constructor(env, path, type2, useCache) {
    if (!Model_Gltf_Binary.matches(type2) && !Model_Gltf_Json.matches(type2)) {
      throw new Error("Only GLTF model types are currently supported");
    }
    super(path, type2, useCache);
    this.env = env;
  }
  async getResponse(request) {
    const response = await request.file();
    return translateResponse(response, (file) => this.env.loadGltf(file));
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/BaseProgress.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/evts.ts
function isModifierless(evt) {
  return !(evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/onUserGesture.ts
var USER_GESTURE_EVENTS = [
  "change",
  "click",
  "contextmenu",
  "dblclick",
  "mouseup",
  "pointerup",
  "reset",
  "submit",
  "touchend"
];
function onUserGesture(callback, perpetual = false) {
  const check = async (evt) => {
    if (evt.isTrusted) {
      if (!perpetual) {
        for (const gesture of USER_GESTURE_EVENTS) {
          window.removeEventListener(gesture, check);
        }
      }
      callback();
    }
  };
  for (const gesture of USER_GESTURE_EVENTS) {
    window.addEventListener(gesture, check);
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/math.ts
var Pi = Math.PI;
var HalfPi = 0.5 * Pi;
var Tau = 2 * Pi;
var TIME_MAX = 864e13;
var TIME_MIN = -TIME_MAX;
function radiansClamp(radians) {
  return (radians % Tau + Tau) % Tau;
}
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
function deg2rad(degrees) {
  return degrees * Tau / 360;
}
function rad2deg(radians) {
  return radians * 360 / Tau;
}
function minly(...numbers) {
  let min = Number.MAX_VALUE;
  for (const n of numbers) {
    if (Math.abs(n) < min) {
      min = n;
    }
  }
  return min;
}
function lerp(a, b, p) {
  return (1 - p) * a + p * b;
}
function truncate(v) {
  if (Math.abs(v) > 1e-4) {
    return v;
  }
  return 0;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/animation/lookAngles.ts
var D = new Vector3();
function getLookHeadingRadians(dir) {
  D.copy(dir);
  D.y = 0;
  D.normalize();
  return radiansClamp(Math.atan2(D.x, D.z));
}
function getLookPitchRadians(dir) {
  return radiansClamp(Math.asin(dir.y));
}

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
function isMeshStandardMaterial(obj2) {
  return isNamedMaterial("MeshStandardMaterial", obj2);
}
function isMeshPhongMaterial(obj2) {
  return isNamedMaterial("MeshPhongMaterial", obj2);
}
function isMeshPhysicalMaterial(obj2) {
  return isNamedMaterial("MeshPhysicalMaterial", obj2);
}
function isObject3D(obj2) {
  return isDefined(obj2) && obj2.isObject3D;
}
function isQuaternion(obj2) {
  return isDefined(obj2) && obj2.isQuaternion;
}
function isEuler(obj2) {
  return isDefined(obj2) && obj2.isEuler;
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
function objectIsVisible(obj2) {
  obj2 = objectResolve(obj2);
  return obj2.visible;
}
function objectIsFullyVisible(obj2) {
  if (!obj2) {
    return false;
  }
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/resolveCamera.ts
function resolveCamera(renderer, camera) {
  if (renderer.xr.isPresenting) {
    return renderer.xr.getCamera();
  } else {
    return camera;
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/setUpFwdPosFromMatrix.ts
function setUpFwdPosFromMatrix(matrix, U2, F, P) {
  const m = matrix.elements;
  U2.set(m[4], m[5], m[6]);
  F.set(-m[8], -m[9], -m[10]);
  P.set(m[12], m[13], m[14]);
  U2.normalize();
  F.normalize();
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/AvatarLocal.ts
function isPermissionedDeviceOrientationEvent(obj2) {
  return obj2 === DeviceOrientationEvent && "requestPermission" in obj2 && isFunction(obj2.requestPermission);
}
var AvatarResetEvent = class extends TypedEvent {
  constructor() {
    super("avatarreset");
  }
};
var AvatarLocal = class extends TypedEventBase {
  constructor(env, fader) {
    super();
    this.env = env;
    this.avatarResetEvt = new AvatarResetEvent();
    this.controlMode = "none" /* None */;
    this.snapTurnRadians = deg2rad(30);
    this.sensitivities = /* @__PURE__ */ new Map([
      /**
       * The mouse is not as sensitive as the gamepad, so we have to bump up the
       * sensitivity quite a bit.
       **/
      ["mousedrag" /* MouseDrag */, 100],
      ["mousefirstperson" /* MouseFPS */, -100],
      /**
       * The touch points are not as sensitive as the gamepad, so we have to bump up the
       * sensitivity quite a bit.
       **/
      ["touchswipe" /* Touch */, 50],
      ["gamepad" /* Gamepad */, 1]
    ]);
    this.B = new Vector3(0, 0, 1);
    this.F = new Vector3();
    this.U = new Vector3();
    this.P = new Vector3();
    this.M = new Matrix4();
    this.E = new Euler();
    this.Q1 = new Quaternion();
    this.Q2 = new Quaternion();
    this.Q3 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    // - PI/2 around the x-axis
    this.Q4 = new Quaternion();
    this.motion = new Vector2();
    this.rotStage = new Matrix4();
    this.axisControl = new Vector2(0, 0);
    this.deviceQ = new Quaternion().identity();
    this.uv = new Vector2();
    this.duv = new Vector2();
    this.move = new Vector3();
    this.move2 = new Vector3();
    this.radialAcceleration = new Vector2(1.5, 1.5);
    this.radialSpeed = new Vector2(1, 1);
    this.radialEdgeFactor = 3 / 4;
    this.minFOVDegrees = 15;
    this.maxFOVDegrees = 120;
    this.minPitchRadians = deg2rad(-85);
    this.maxPitchRadians = deg2rad(85);
    this.followers = new Array();
    this.dz = 0;
    this._headingRadians = 0;
    this._pitchRadians = 0;
    this._rollRadians = 0;
    this.headX = 0;
    this.headZ = 0;
    this._worldHeadingRadians = 0;
    this._worldPitchRadians = 0;
    this.fwrd = false;
    this.back = false;
    this.left = false;
    this.rght = false;
    this.fwrd2 = false;
    this.back2 = false;
    this.left2 = false;
    this.rght2 = false;
    this.up = false;
    this.down = false;
    this.grow = false;
    this.shrk = false;
    this._keyboardControlEnabled = false;
    this.worldPos = new Vector3();
    this.worldQuat = new Quaternion();
    this.lockMovement = false;
    this.fovZoomEnabled = true;
    this.deviceOrientation = null;
    this.screenOrientation = 0;
    this.alphaOffset = 0;
    this.onDeviceOrientationChangeEvent = null;
    this.onScreenOrientationChangeEvent = null;
    this.motionEnabled = false;
    this.pointersToSend = new Array();
    this.disableHorizontal = false;
    this.disableVertical = false;
    this.invertHorizontal = false;
    this.invertVertical = true;
    this._height = this.env.defaultAvatarHeight;
    this.head = obj("Head", fader);
    let homeHit = false;
    const setKey = (key, ok) => {
      if (key === "w")
        this.fwrd = ok;
      if (key === "s")
        this.back = ok;
      if (key === "a")
        this.left = ok;
      if (key === "d")
        this.rght = ok;
      if (key === "e")
        this.up = ok;
      if (key === "q")
        this.down = ok;
      if (key === "ArrowUp")
        this.fwrd2 = ok;
      if (key === "ArrowDown")
        this.back2 = ok;
      if (key === "ArrowLeft")
        this.left2 = ok;
      if (key === "ArrowRight")
        this.rght2 = ok;
      if (key === "r")
        this.grow = ok;
      if (key === "f")
        this.shrk = ok;
      if (key === "Home") {
        const wasHome = homeHit;
        homeHit = ok;
        if (wasHome && !homeHit) {
          this.reset();
          this.dispatchEvent(this.avatarResetEvt);
        }
      }
    };
    this.onKeyDown = (evt) => setKey(evt.key, isModifierless(evt));
    this.onKeyUp = (evt) => setKey(evt.key, false);
    this.keyboardControlEnabled = true;
    if (matchMedia("(pointer: coarse)").matches) {
      this.controlMode = "touchswipe" /* Touch */;
    } else if (matchMedia("(pointer: fine)").matches) {
      this.controlMode = "mousedrag" /* MouseDrag */;
    }
    if (globalThis.isSecureContext && isMobile() && !isMobileVR()) {
      this.onDeviceOrientationChangeEvent = (event) => {
        this.deviceOrientation = event;
      };
      this.onScreenOrientationChangeEvent = () => {
        if ("screen" in globalThis && "orientation" in screen) {
          this.screenOrientation = screen.orientation.angle;
        } else if ("window" in globalThis && "orientation" in globalThis.window) {
          this.screenOrientation = globalThis.window.orientation || 0;
        }
      };
      if (isSafari) {
        onUserGesture(() => this.startMotionControl());
      } else {
        this.startMotionControl();
      }
    }
  }
  set disableVertical(v) {
    this._disableVertical = v;
    this.axisControl.x = this._disableVertical ? 0 : this._invertVertical ? 1 : -1;
  }
  set invertVertical(v) {
    this._invertVertical = v;
    this.axisControl.x = this._disableVertical ? 0 : this._invertVertical ? 1 : -1;
  }
  set disableHorizontal(v) {
    this._disableHorizontal = v;
    this.axisControl.y = this._disableHorizontal ? 0 : this._invertHorizontal ? 1 : -1;
  }
  set invertHorizontal(v) {
    this._invertHorizontal = v;
    this.axisControl.y = this._disableHorizontal ? 0 : this._invertHorizontal ? 1 : -1;
  }
  get height() {
    return this.head.position.y;
  }
  get object() {
    return this.head;
  }
  get worldHeadingRadians() {
    return this._worldHeadingRadians;
  }
  get worldPitchRadians() {
    return this._worldPitchRadians;
  }
  get fov() {
    return this.env.camera.fov;
  }
  set fov(v) {
    if (v !== this.fov) {
      this.env.camera.fov = v;
      this.env.camera.updateProjectionMatrix();
    }
  }
  get stage() {
    return this.head.parent;
  }
  snapTurn(direction) {
    this.setHeading(this.headingRadians - this.snapTurnRadians * direction);
  }
  get keyboardControlEnabled() {
    return this._keyboardControlEnabled;
  }
  set keyboardControlEnabled(v) {
    if (this._keyboardControlEnabled !== v) {
      this._keyboardControlEnabled = v;
      if (this._keyboardControlEnabled) {
        this.env.renderer.domElement.addEventListener("keydown", this.onKeyDown);
        this.env.renderer.domElement.addEventListener("keyup", this.onKeyUp);
      } else {
        this.env.renderer.domElement.removeEventListener("keydown", this.onKeyDown);
        this.env.renderer.domElement.removeEventListener("keyup", this.onKeyUp);
      }
    }
  }
  addFollower(follower) {
    this.followers.push(follower);
  }
  onMove(pointer, uv, duv) {
    this.setMode(pointer);
    if (pointer.canMoveView && this.controlMode !== "none" /* None */ && this.gestureSatisfied(pointer)) {
      this.uv.copy(uv);
      this.duv.copy(duv);
    }
  }
  setMode(pointer) {
    if (pointer.type === "remote" || pointer.type === "nose") {
    } else if (pointer.type === "hand") {
      this.controlMode = "none" /* None */;
    } else if (pointer.type === "gamepad") {
      this.controlMode = "gamepad" /* Gamepad */;
    } else if (pointer.rayTarget && pointer.rayTarget.draggable && !this.env.eventSys.mouse.isPointerLocked && pointer.isPressed(0 /* Primary */)) {
      this.controlMode = "mouseedge" /* ScreenEdge */;
    } else if (pointer.type === "touch" || pointer.type === "pen") {
      this.controlMode = "touchswipe" /* Touch */;
    } else if (pointer.type === "mouse") {
      this.controlMode = this.env.eventSys.mouse.isPointerLocked ? "mousefirstperson" /* MouseFPS */ : "mousedrag" /* MouseDrag */;
    } else {
      assertNever(pointer.type);
    }
  }
  gestureSatisfied(pointer) {
    if (this.controlMode === "none" /* None */) {
      return false;
    }
    return this.controlMode === "gamepad" /* Gamepad */ || this.controlMode === "mousefirstperson" /* MouseFPS */ || this.controlMode === "mouseedge" /* ScreenEdge */ || pointer.isPressed(0 /* Primary */);
  }
  get name() {
    return this.object.name;
  }
  set name(v) {
    this.object.name = v;
  }
  get headingRadians() {
    return this._headingRadians;
  }
  setHeading(radians) {
    this._headingRadians = radiansClamp(radians);
  }
  get pitchRadians() {
    return this._pitchRadians;
  }
  setPitch(radians, min, max) {
    this._pitchRadians = radiansClamp(radians + Pi) - Pi;
    this._pitchRadians = clamp(this._pitchRadians, min, max);
  }
  get rollRadians() {
    return this._rollRadians;
  }
  setRoll(radians) {
    this._rollRadians = radiansClamp(radians);
  }
  setHeadingImmediate(radians) {
    this.setHeading(radians);
    this.updateOrientation();
    this.resetFollowers();
  }
  setOrientationImmediate(headingRadians, pitchRadians) {
    this.setHeading(headingRadians);
    this._pitchRadians = radiansClamp(pitchRadians);
    this.updateOrientation();
  }
  zoom(dz) {
    this.dz = dz;
  }
  update(dt) {
    dt *= 1e-3;
    const device = this.deviceOrientation;
    if (device && isGoodNumber(device.alpha) && isGoodNumber(device.beta) && isGoodNumber(device.gamma)) {
      const alpha = deg2rad(device.alpha) + this.alphaOffset;
      const beta = deg2rad(device.beta);
      const gamma = deg2rad(device.gamma);
      const orient = this.screenOrientation ? deg2rad(this.screenOrientation) : 0;
      this.E.set(beta, alpha, -gamma, "YXZ");
      this.Q2.setFromAxisAngle(this.B, -orient);
      this.Q4.setFromEuler(this.E).multiply(this.Q3).multiply(this.Q2);
      this.deviceQ.slerp(this.Q4, 0.8);
    }
    if (!this.lockMovement) {
      if (this.fovZoomEnabled && Math.abs(this.dz) > 0) {
        const smoothing = Math.pow(0.95, 5e3 * dt);
        this.dz = truncate(smoothing * this.dz);
        this.fov = clamp(this.env.camera.fov - this.dz, this.minFOVDegrees, this.maxFOVDegrees);
      }
      if (this.controlMode === "mouseedge" /* ScreenEdge */) {
        if (this.uv.manhattanLength() > 0) {
          this.motion.set(
            this.scaleRadialComponent(-this.uv.x, this.radialSpeed.x, this.radialAcceleration.x),
            this.scaleRadialComponent(this.uv.y, this.radialSpeed.y, this.radialAcceleration.y)
          ).multiplyScalar(dt);
          this.setHeading(this.headingRadians + this.motion.x);
          this.setPitch(this.pitchRadians + this.motion.y, this.minPitchRadians, this.maxPitchRadians);
          this.setRoll(0);
        }
      } else if (this.sensitivities.has(this.controlMode)) {
        if (this.duv.manhattanLength() > 0) {
          const sensitivity = this.sensitivities.get(this.controlMode) || 1;
          this.motion.copy(this.duv).multiplyScalar(sensitivity * dt).multiply(this.axisControl);
          this.setHeading(this.headingRadians + this.motion.x);
          this.setPitch(this.pitchRadians + this.motion.y, this.minPitchRadians, this.maxPitchRadians);
          this.setRoll(0);
        }
      }
      this.Q1.setFromAxisAngle(this.stage.up, this.worldHeadingRadians);
      if (this.fwrd || this.back || this.left || this.rght || this.up || this.down) {
        const dx = (this.left ? 1 : 0) + (this.rght ? -1 : 0);
        const dy = (this.down ? 1 : 0) + (this.up ? -1 : 0);
        const dz = (this.fwrd ? 1 : 0) + (this.back ? -1 : 0);
        this.move.set(dx, dy, dz);
        const d = this.move.length();
        if (d > 0) {
          this.move.multiplyScalar(dt / d).applyQuaternion(this.Q1);
          this.stage.position.add(this.move);
        }
      }
      if (this.fwrd2 || this.back2 || this.left2 || this.rght2) {
        const dx = (this.left2 ? 1 : 0) + (this.rght2 ? -1 : 0);
        const dz = (this.fwrd2 ? 1 : 0) + (this.back2 ? -1 : 0);
        this.move2.set(dx, 0, dz);
        const d = this.move2.length();
        if (d > 0) {
          this.move2.multiplyScalar(dt / d).applyQuaternion(this.Q1);
          this.headX += this.move2.x;
          this.headZ += this.move2.z;
        }
      }
      if (this.grow || this.shrk) {
        const dy = (this.shrk ? -1 : 0) + (this.grow ? 1 : 0);
        this._height += dy * dt;
        this._height = clamp(this._height, 1, 2);
      }
      this.updateOrientation();
      const decay = Math.pow(0.95, 100 * dt);
      this.duv.multiplyScalar(decay);
      if (this.duv.manhattanLength() <= 1e-4) {
        this.duv.setScalar(0);
      }
    }
  }
  scaleRadialComponent(n, dn, ddn) {
    const absN = Math.abs(n);
    return Math.sign(n) * Math.pow(Math.max(0, absN - this.radialEdgeFactor) / (1 - this.radialEdgeFactor), ddn) * dn;
  }
  lookAt(obj2) {
    obj2.getWorldPosition(this.P);
    this.P.sub(this.worldPos);
    const heading = 3 * HalfPi - Math.atan2(this.P.z, this.P.x);
    const pitch = Math.atan2(this.P.y, this.P.length());
    this.setOrientationImmediate(heading, pitch);
  }
  updateOrientation() {
    const cam = resolveCamera(this.env.renderer, this.env.camera);
    this.rotStage.makeRotationY(this._headingRadians);
    this.stage.matrix.makeTranslation(
      this.stage.position.x,
      this.stage.position.y,
      this.stage.position.z
    ).multiply(this.rotStage);
    this.stage.matrix.decompose(
      this.stage.position,
      this.stage.quaternion,
      this.stage.scale
    );
    if (this.env.renderer.xr.isPresenting) {
      this.M.copy(this.stage.matrixWorld).invert();
      this.head.position.copy(cam.position).applyMatrix4(this.M);
      this.head.quaternion.copy(this.stage.quaternion).invert().multiply(cam.quaternion);
    } else {
      this.head.position.set(this.headX, this._height, this.headZ);
      this.E.set(this._pitchRadians, 0, this._rollRadians, "XYZ");
      this.head.quaternion.setFromEuler(this.E).premultiply(this.deviceQ);
    }
    this.env.camera.position.copy(this.head.position);
    this.env.camera.quaternion.copy(this.head.quaternion);
    this.head.getWorldPosition(this.worldPos);
    this.head.getWorldQuaternion(this.worldQuat);
    this.F.set(0, 0, -1).applyQuaternion(this.worldQuat);
    this._worldHeadingRadians = getLookHeadingRadians(this.F);
    this._worldPitchRadians = getLookPitchRadians(this.F);
    setUpFwdPosFromMatrix(this.head.matrixWorld, this.U, this.F, this.P);
  }
  reset() {
    this.stage.position.setScalar(0);
    this.setHeadingImmediate(0);
  }
  resetFollowers() {
    for (const follower of this.followers) {
      follower.reset(this.height, this.worldPos, this.worldHeadingRadians);
    }
  }
  async getPermission() {
    if (!("DeviceOrientationEvent" in window)) {
      return "not-supported";
    }
    if (isPermissionedDeviceOrientationEvent(DeviceOrientationEvent)) {
      return await DeviceOrientationEvent.requestPermission();
    }
    return "granted";
  }
  async startMotionControl() {
    if (!this.motionEnabled) {
      this.onScreenOrientationChangeEvent();
      const permission = await this.getPermission();
      this.motionEnabled = permission === "granted";
      if (this.motionEnabled) {
        if ("ScreenOrientation" in window) {
          screen.orientation.addEventListener("change", this.onScreenOrientationChangeEvent);
        } else {
          window.addEventListener("orientationchange", this.onScreenOrientationChangeEvent);
        }
        window.addEventListener("deviceorientation", this.onDeviceOrientationChangeEvent);
      }
    }
  }
  stopMotionControl() {
    if (this.motionEnabled) {
      if ("ScreenOrientation" in window) {
        screen.orientation.removeEventListener("change", this.onScreenOrientationChangeEvent);
      } else {
        window.removeEventListener("orientationchange", this.onScreenOrientationChangeEvent);
      }
      window.removeEventListener("deviceorientation", this.onDeviceOrientationChangeEvent);
      this.motionEnabled = false;
    }
  }
  dispose() {
    this.stopMotionControl();
  }
  get bufferSize() {
    return 133;
  }
  writeState(buffer) {
    arrayClear(this.pointersToSend);
    let size = this.env.avatar.bufferSize;
    for (const pointer of this.env.eventSys.pointers) {
      if (pointer.canSend) {
        size += pointer.bufferSize;
        this.pointersToSend.push(pointer);
      }
    }
    buffer.length = size;
    buffer.position = 0;
    buffer.writeFloat32(this.height);
    buffer.writeMatrix512(this.stage.matrix);
    buffer.writeMatrix512(this.head.matrixWorld);
    buffer.writeUint8(this.pointersToSend.length);
    for (const pointer of this.pointersToSend) {
      pointer.writeState(buffer);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/setGeometryUVsForCubemaps.ts
function setGeometryUVsForCubemaps(geom2) {
  const positions = geom2.attributes.position;
  const normals = geom2.attributes.normal;
  const uvs = geom2.attributes.uv;
  for (let n = 0; n < normals.count; ++n) {
    const _x = n * normals.itemSize, _y = n * normals.itemSize + 1, _z = n * normals.itemSize + 2, nx = normals.array[_x], ny = normals.array[_y], nz = normals.array[_z], _nx_ = Math.abs(nx), _ny_ = Math.abs(ny), _nz_ = Math.abs(nz), px2 = positions.array[_x], py = positions.array[_y], pz = positions.array[_z], _px_ = Math.abs(px2), _py_ = Math.abs(py), _pz_ = Math.abs(pz), _u = n * uvs.itemSize, _v = n * uvs.itemSize + 1;
    let u = uvs.array[_u], v = uvs.array[_v], largest = 0, mx = _nx_, max = _px_;
    if (_ny_ > mx) {
      largest = 1;
      mx = _ny_;
      max = _py_;
    }
    if (_nz_ > mx) {
      largest = 2;
      mx = _nz_;
      max = _pz_;
    }
    if (largest === 0) {
      if (px2 < 0) {
        u = -pz;
        v = py;
      } else {
        u = pz;
        v = py;
      }
    } else if (largest === 1) {
      if (py < 0) {
        u = px2;
        v = -pz;
      } else {
        u = px2;
        v = pz;
      }
    } else {
      if (pz < 0) {
        u = px2;
        v = py;
      } else {
        u = -px2;
        v = py;
      }
    }
    u = (u / max + 1) / 8;
    v = (v / max + 1) / 6;
    if (largest === 0) {
      if (px2 < 0) {
        u += 0;
        v += 1 / 3;
      } else {
        u += 0.5;
        v += 1 / 3;
      }
    } else if (largest === 1) {
      if (py < 0) {
        u += 0.25;
        v += 0;
      } else {
        u += 0.25;
        v += 2 / 3;
      }
    } else {
      if (pz < 0) {
        u += 0.25;
        v += 1 / 3;
      } else {
        u += 0.75;
        v += 1 / 3;
      }
    }
    const arr = uvs.array;
    arr[_u] = u;
    arr[_v] = v;
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/Cube.ts
var cubeGeom = /* @__PURE__ */ new BoxGeometry(1, 1, 1, 1, 1, 1);
cubeGeom.name = "CubeGeom";
cubeGeom.computeBoundingBox();
cubeGeom.computeBoundingSphere();
var invCubeGeom = /* @__PURE__ */ cubeGeom.clone();
invCubeGeom.name = "InvertedCubeGeom";
setGeometryUVsForCubemaps(invCubeGeom);
var Cube = class extends Mesh {
  constructor(sx, sy, sz, material) {
    super(cubeGeom, material);
    this.scale.set(sx, sy, sz);
  }
};
function cube(name, sx, sy, sz, material) {
  const c = new Cube(sx, sy, sz, material);
  c.name = name;
  return c;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/singleton.ts
function singleton(name, create7) {
  const box = globalThis;
  let value = box[name];
  if (isNullOrUndefined(value)) {
    if (isNullOrUndefined(create7)) {
      throw new Error(`No value ${name} found`);
    }
    value = create7();
    box[name] = value;
  }
  return value;
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
  // todo FIX - maybe change to totalSize
};
ShaderLib["line"] = {
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    UniformsLib.fog,
    UniformsLib.line
  ]),
  vertexShader: (
    /* glsl */
    `
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
		`
  ),
  fragmentShader: (
    /* glsl */
    `
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
  )
};
var LineMaterial = class extends ShaderMaterial {
  constructor(parameters) {
    super({
      type: "LineMaterial",
      uniforms: UniformsUtils.clone(ShaderLib["line"].uniforms),
      vertexShader: ShaderLib["line"].vertexShader,
      fragmentShader: ShaderLib["line"].fragmentShader,
      clipping: true
      // required for clipping support
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
function solid(options) {
  return makeMaterial("solid", MeshBasicMaterial, options);
}
function solidTransparent(options) {
  return makeMaterial("solidTransparent", MeshBasicMaterial, trans(options));
}
function lit(options) {
  return makeMaterial("lit", MeshPhongMaterial, options);
}
function line2(options) {
  return makeMaterial("line2", LineMaterial, options);
}
function convertMaterials(root, convertMaterial) {
  const oldMats = /* @__PURE__ */ new Set();
  root.traverse((obj2) => {
    if (isMesh(obj2) && isMaterial(obj2.material)) {
      const oldMat = obj2.material;
      const newMat = convertMaterial(oldMat);
      if (oldMat !== newMat) {
        oldMats.add(oldMat);
        obj2.material = newMat;
      }
    }
  });
  for (const oldMat of oldMats) {
    dispose2(oldMat);
  }
}
function materialStandardToBasic(oldMat) {
  if (oldMat.type !== "MeshStandardMaterial") {
    throw new Error("Input material is not MeshStandardMaterial");
  }
  const params = {
    alphaMap: oldMat.alphaMap,
    alphaTest: oldMat.alphaTest,
    alphaToCoverage: oldMat.alphaToCoverage,
    aoMap: oldMat.aoMap,
    aoMapIntensity: oldMat.aoMapIntensity,
    blendDst: oldMat.blendDst,
    blendDstAlpha: oldMat.blendDstAlpha,
    blendEquation: oldMat.blendEquation,
    blendEquationAlpha: oldMat.blendEquationAlpha,
    blending: oldMat.blending,
    blendSrc: oldMat.blendSrc,
    blendSrcAlpha: oldMat.blendSrcAlpha,
    clipIntersection: oldMat.clipIntersection,
    clippingPlanes: oldMat.clippingPlanes,
    clipShadows: oldMat.clipShadows,
    color: oldMat.color,
    colorWrite: oldMat.colorWrite,
    depthFunc: oldMat.depthFunc,
    depthTest: oldMat.depthTest,
    depthWrite: oldMat.depthWrite,
    dithering: oldMat.dithering,
    envMap: oldMat.envMap,
    fog: oldMat.fog,
    lightMap: oldMat.lightMap,
    lightMapIntensity: oldMat.lightMapIntensity,
    map: oldMat.emissiveMap || oldMat.map,
    name: oldMat.name + "-Standard-To-Basic",
    opacity: oldMat.opacity,
    polygonOffset: oldMat.polygonOffset,
    polygonOffsetFactor: oldMat.polygonOffsetFactor,
    polygonOffsetUnits: oldMat.polygonOffsetUnits,
    precision: oldMat.precision,
    premultipliedAlpha: oldMat.premultipliedAlpha,
    shadowSide: oldMat.shadowSide,
    side: oldMat.side,
    stencilFail: oldMat.stencilFail,
    stencilFunc: oldMat.stencilFunc,
    stencilFuncMask: oldMat.stencilFuncMask,
    stencilRef: oldMat.stencilRef,
    stencilWrite: oldMat.stencilWrite,
    stencilWriteMask: oldMat.stencilWriteMask,
    stencilZFail: oldMat.stencilZFail,
    stencilZPass: oldMat.stencilZPass,
    toneMapped: oldMat.toneMapped,
    transparent: oldMat.transparent,
    userData: oldMat.userData,
    vertexColors: oldMat.vertexColors,
    visible: oldMat.visible,
    wireframe: oldMat.wireframe,
    wireframeLinecap: oldMat.wireframeLinecap,
    wireframeLinejoin: oldMat.wireframeLinejoin,
    wireframeLinewidth: oldMat.wireframeLinewidth
  };
  for (const [key, value] of Object.entries(params)) {
    if (isNullOrUndefined(value)) {
      delete params[key];
    }
  }
  return new MeshBasicMaterial(params);
}
function materialStandardToPhong(oldMat) {
  if (oldMat.type !== "MeshStandardMaterial") {
    throw new Error("Input material is not MeshStandardMaterial");
  }
  const params = {
    alphaMap: oldMat.alphaMap,
    alphaTest: oldMat.alphaTest,
    alphaToCoverage: oldMat.alphaToCoverage,
    aoMap: oldMat.aoMap,
    aoMapIntensity: oldMat.aoMapIntensity,
    blendDst: oldMat.blendDst,
    blendDstAlpha: oldMat.blendDstAlpha,
    blendEquation: oldMat.blendEquation,
    blendEquationAlpha: oldMat.blendEquationAlpha,
    blending: oldMat.blending,
    blendSrc: oldMat.blendSrc,
    blendSrcAlpha: oldMat.blendSrcAlpha,
    bumpMap: oldMat.bumpMap,
    bumpScale: oldMat.bumpScale,
    clipIntersection: oldMat.clipIntersection,
    clippingPlanes: oldMat.clippingPlanes,
    clipShadows: oldMat.clipShadows,
    color: oldMat.color,
    colorWrite: oldMat.colorWrite,
    depthFunc: oldMat.depthFunc,
    depthTest: oldMat.depthTest,
    depthWrite: oldMat.depthWrite,
    displacementBias: oldMat.displacementBias,
    displacementMap: oldMat.displacementMap,
    displacementScale: oldMat.displacementScale,
    dithering: oldMat.dithering,
    emissive: oldMat.emissive,
    emissiveIntensity: oldMat.emissiveIntensity,
    emissiveMap: oldMat.emissiveMap,
    envMap: oldMat.envMap,
    flatShading: oldMat.flatShading,
    fog: oldMat.fog,
    lightMap: oldMat.lightMap,
    lightMapIntensity: oldMat.lightMapIntensity,
    map: oldMat.map,
    name: oldMat.name + "-Standard-To-Phong",
    normalMap: oldMat.normalMap,
    normalMapType: oldMat.normalMapType,
    normalScale: oldMat.normalScale,
    opacity: oldMat.opacity,
    polygonOffset: oldMat.polygonOffset,
    polygonOffsetFactor: oldMat.polygonOffsetFactor,
    polygonOffsetUnits: oldMat.polygonOffsetUnits,
    precision: oldMat.precision,
    premultipliedAlpha: oldMat.premultipliedAlpha,
    shadowSide: oldMat.shadowSide,
    side: oldMat.side,
    stencilFail: oldMat.stencilFail,
    stencilFunc: oldMat.stencilFunc,
    stencilFuncMask: oldMat.stencilFuncMask,
    stencilRef: oldMat.stencilRef,
    stencilWrite: oldMat.stencilWrite,
    stencilWriteMask: oldMat.stencilWriteMask,
    stencilZFail: oldMat.stencilZFail,
    stencilZPass: oldMat.stencilZPass,
    toneMapped: oldMat.toneMapped,
    transparent: oldMat.transparent,
    userData: oldMat.userData,
    vertexColors: oldMat.vertexColors,
    visible: oldMat.visible,
    wireframe: oldMat.wireframe,
    wireframeLinecap: oldMat.wireframeLinecap,
    wireframeLinejoin: oldMat.wireframeLinejoin,
    wireframeLinewidth: oldMat.wireframeLinewidth
  };
  for (const [key, value] of Object.entries(params)) {
    if (isNullOrUndefined(value)) {
      delete params[key];
    }
  }
  return new MeshPhongMaterial(params);
}
function materialPhysicalToPhong(oldMat) {
  if (oldMat.type !== "MeshPhysicalMaterial") {
    throw new Error("Input material is not MeshPhysicalMaterial");
  }
  const params = {
    alphaMap: oldMat.alphaMap,
    alphaTest: oldMat.alphaTest,
    alphaToCoverage: oldMat.alphaToCoverage,
    aoMap: oldMat.aoMap,
    aoMapIntensity: oldMat.aoMapIntensity,
    blendDst: oldMat.blendDst,
    blendDstAlpha: oldMat.blendDstAlpha,
    blendEquation: oldMat.blendEquation,
    blendEquationAlpha: oldMat.blendEquationAlpha,
    blending: oldMat.blending,
    blendSrc: oldMat.blendSrc,
    blendSrcAlpha: oldMat.blendSrcAlpha,
    bumpMap: oldMat.bumpMap,
    bumpScale: oldMat.bumpScale,
    clipIntersection: oldMat.clipIntersection,
    clippingPlanes: oldMat.clippingPlanes,
    clipShadows: oldMat.clipShadows,
    color: oldMat.color,
    colorWrite: oldMat.colorWrite,
    depthFunc: oldMat.depthFunc,
    depthTest: oldMat.depthTest,
    depthWrite: oldMat.depthWrite,
    displacementBias: oldMat.displacementBias,
    displacementMap: oldMat.displacementMap,
    displacementScale: oldMat.displacementScale,
    dithering: oldMat.dithering,
    emissive: oldMat.emissive,
    emissiveIntensity: oldMat.emissiveIntensity,
    emissiveMap: oldMat.emissiveMap,
    envMap: oldMat.envMap,
    flatShading: oldMat.flatShading,
    fog: oldMat.fog,
    lightMap: oldMat.lightMap,
    lightMapIntensity: oldMat.lightMapIntensity,
    map: oldMat.map,
    name: oldMat.name + "-Standard-To-Phong",
    normalMap: oldMat.normalMap,
    normalMapType: oldMat.normalMapType,
    normalScale: oldMat.normalScale,
    opacity: oldMat.opacity,
    polygonOffset: oldMat.polygonOffset,
    polygonOffsetFactor: oldMat.polygonOffsetFactor,
    polygonOffsetUnits: oldMat.polygonOffsetUnits,
    precision: oldMat.precision,
    premultipliedAlpha: oldMat.premultipliedAlpha,
    reflectivity: oldMat.reflectivity,
    shadowSide: oldMat.shadowSide,
    shininess: oldMat.sheen,
    side: oldMat.side,
    specular: oldMat.specularColor,
    specularMap: oldMat.specularColorMap,
    stencilFail: oldMat.stencilFail,
    stencilFunc: oldMat.stencilFunc,
    stencilFuncMask: oldMat.stencilFuncMask,
    stencilRef: oldMat.stencilRef,
    stencilWrite: oldMat.stencilWrite,
    stencilWriteMask: oldMat.stencilWriteMask,
    stencilZFail: oldMat.stencilZFail,
    stencilZPass: oldMat.stencilZPass,
    toneMapped: oldMat.toneMapped,
    transparent: oldMat.transparent,
    userData: oldMat.userData,
    vertexColors: oldMat.vertexColors,
    visible: oldMat.visible,
    wireframe: oldMat.wireframe,
    wireframeLinecap: oldMat.wireframeLinecap,
    wireframeLinejoin: oldMat.wireframeLinejoin,
    wireframeLinewidth: oldMat.wireframeLinewidth
  };
  for (const [key, value] of Object.entries(params)) {
    if (isNullOrUndefined(value)) {
      delete params[key];
    }
  }
  return new MeshPhongMaterial(params);
}
var grey = 12632256;
var white = 16777215;
var litGrey = /* @__PURE__ */ lit({ color: grey });
var litWhite = /* @__PURE__ */ lit({ color: white });

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/Fader.ts
var Fader = class {
  constructor(name, t2 = 0.15) {
    this.opacity = 1;
    this.direction = 0;
    this.task = new Task(false);
    this.material = solidTransparent({
      name: "FaderMaterial",
      color: 0,
      side: BackSide
    });
    this.object = cube(name, 1, 1, 1, this.material);
    this.object.renderOrder = Number.MAX_SAFE_INTEGER;
    this.speed = 1 / t2;
    this.object.layers.enableAll();
  }
  async start(direction) {
    this.direction = direction;
    this.task.restart();
    await this.task;
  }
  async fadeOut() {
    if (this.direction != 1) {
      await this.start(1);
    }
  }
  async fadeIn() {
    if (this.direction != -1) {
      await this.start(-1);
    }
  }
  update(dt) {
    if (this.direction !== 0) {
      const dOpacity = this.direction * this.speed * dt / 1e3;
      if (0 <= this.opacity && this.opacity <= 1) {
        this.opacity += dOpacity;
      }
      if (this.direction === 1 && this.opacity >= 1 || this.direction === -1 && this.opacity <= 0) {
        this.opacity = clamp(this.opacity, 0, 1);
        this.direction = 0;
        this.task.resolve();
      }
    }
    this.material.opacity = this.opacity;
    this.material.transparent = this.opacity < 1;
    this.material.needsUpdate = true;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/layers.ts
var FOREGROUND = 0;
var PURGATORY = 3;
function deepSetLayer(obj2, level) {
  obj2 = objectResolve(obj2);
  obj2.traverse((o) => o.layers.set(level));
}
function deepEnableLayer(obj2, level) {
  obj2 = objectResolve(obj2);
  obj2.traverse((o) => o.layers.enable(level));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/LoadingBar.ts
function chrome(x, y, z, w, h, d) {
  const chromeMesh = new Cube(w, h, d, litWhite);
  chromeMesh.position.set(x, y, z);
  return chromeMesh;
}
var velocity = 0.1;
var LoadingBar = class extends BaseProgress {
  constructor() {
    super();
    this.value = 0;
    this.targetValue = 0;
    this.object = obj("LoadingBar");
    this._enabled = true;
    this.valueBar = new Cube(0, 1, 1, litGrey);
    this.valueBar.scale.set(0, 1, 1);
    const valueBarContainer = obj("ValueBarContainer");
    valueBarContainer.scale.set(1, 0.1, 0.1);
    objGraph(
      this,
      objGraph(
        valueBarContainer,
        this.valueBar
      ),
      chrome(-0.5, 0, -0.05, 0.01, 0.1, 0.01),
      chrome(-0.5, 0, 0.05, 0.01, 0.1, 0.01),
      chrome(0.5, 0, -0.05, 0.01, 0.1, 0.01),
      chrome(0.5, 0, 0.05, 0.01, 0.1, 0.01),
      chrome(-0.5, -0.05, 0, 0.01, 0.01, 0.1),
      chrome(0.5, -0.05, 0, 0.01, 0.01, 0.1),
      chrome(-0.5, 0.05, 0, 0.01, 0.01, 0.1),
      chrome(0.5, 0.05, 0, 0.01, 0.01, 0.1),
      chrome(0, -0.05, -0.05, 1, 0.01, 0.01),
      chrome(0, 0.05, -0.05, 1, 0.01, 0.01),
      chrome(0, -0.05, 0.05, 1, 0.01, 0.01),
      chrome(0, 0.05, 0.05, 1, 0.01, 0.01)
    );
    deepSetLayer(this, PURGATORY);
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(v) {
    if (v !== this._enabled) {
      this._enabled = v;
      objectSetVisible(this, objectIsVisible(this) || this.enabled);
    }
  }
  report(soFar, total, msg) {
    super.report(soFar, total, msg);
    this.targetValue = this.p;
  }
  update(dt) {
    if (this.object.parent.visible) {
      this.value = Math.min(this.targetValue, this.value + velocity * dt);
      this.valueBar.scale.set(this.value, 1, 1);
      this.valueBar.position.x = this.value / 2 - 0.5;
      objectSetVisible(this, this.enabled && this.value > 0);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/fullscreen.ts
if (!hasFullscreenAPI()) {
  const Elm = Element.prototype;
  const Doc = Document.prototype;
  if ("webkitRequestFullscreen" in Elm) {
    Elm.requestFullscreen = Elm.webkitRequestFullscreen;
    Doc.exitFullscreen = Doc.webkitRequestFullscreen;
    Object.defineProperties(Doc, {
      "fullscreenEnabled": {
        get: function() {
          return this.webkitFullscreenEnabled;
        }
      },
      "fullscreenElement": {
        get: function() {
          return this.webkitFullscreenElement;
        }
      }
    });
  } else if ("mozRequestFullScreen" in Elm) {
    Elm.requestFullscreen = Elm.mozRequestFullScreen;
    Doc.exitFullscreen = Doc.mozCancelFullScreen;
    Object.defineProperties(Doc, {
      "fullscreenEnabled": {
        get: function() {
          return this.mozFullScreenEnabled;
        }
      },
      "fullscreenElement": {
        get: function() {
          return this.mozFullScreenElement;
        }
      }
    });
  } else if ("msRequestFullscreen" in Elm) {
    Elm.requestFullscreen = Elm.msRequestFullscreen;
    Doc.exitFullscreen = Doc.msExitFullscreen;
    Object.defineProperties(Doc, {
      "fullscreenEnabled": {
        get: function() {
          return this.msFullscreenEnabled;
        }
      },
      "fullscreenElement": {
        get: function() {
          return this.msFullscreenElement;
        }
      }
    });
  }
}
function hasFullscreenAPI() {
  return "requestFullscreen" in HTMLElement.prototype;
}

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/lib/global.js
var _global = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
var global_default = _global;

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/lib/EventTarget.js
var PRIVATE = Symbol("@@webxr-polyfill/EventTarget");
var EventTarget = class {
  constructor() {
    this[PRIVATE] = {
      listeners: /* @__PURE__ */ new Map()
    };
  }
  /**
   * @param {string} type
   * @param {Function} listener
   */
  addEventListener(type2, listener) {
    if (typeof type2 !== "string") {
      throw new Error("`type` must be a string");
    }
    if (typeof listener !== "function") {
      throw new Error("`listener` must be a function");
    }
    const typedListeners = this[PRIVATE].listeners.get(type2) || [];
    typedListeners.push(listener);
    this[PRIVATE].listeners.set(type2, typedListeners);
  }
  /**
   * @param {string} type
   * @param {Function} listener
   */
  removeEventListener(type2, listener) {
    if (typeof type2 !== "string") {
      throw new Error("`type` must be a string");
    }
    if (typeof listener !== "function") {
      throw new Error("`listener` must be a function");
    }
    const typedListeners = this[PRIVATE].listeners.get(type2) || [];
    for (let i = typedListeners.length; i >= 0; i--) {
      if (typedListeners[i] === listener) {
        typedListeners.pop();
      }
    }
  }
  /**
   * @param {string} type
   * @param {object} event
   */
  dispatchEvent(type2, event) {
    const typedListeners = this[PRIVATE].listeners.get(type2) || [];
    const queue = [];
    for (let i = 0; i < typedListeners.length; i++) {
      queue[i] = typedListeners[i];
    }
    for (let listener of queue) {
      listener(event);
    }
    if (typeof this[`on${type2}`] === "function") {
      this[`on${type2}`](event);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/node_modules/gl-matrix/src/gl-matrix/common.js
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var degree = Math.PI / 180;

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/node_modules/gl-matrix/src/gl-matrix/mat4.js
function create2() {
  let out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function identity2(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function fromRotationTranslation(out, q, v) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getRotation(out, mat) {
  let trace = mat[0] + mat[5] + mat[10];
  let S2 = 0;
  if (trace > 0) {
    S2 = Math.sqrt(trace + 1) * 2;
    out[3] = 0.25 * S2;
    out[0] = (mat[6] - mat[9]) / S2;
    out[1] = (mat[8] - mat[2]) / S2;
    out[2] = (mat[1] - mat[4]) / S2;
  } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
    S2 = Math.sqrt(1 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S2;
    out[0] = 0.25 * S2;
    out[1] = (mat[1] + mat[4]) / S2;
    out[2] = (mat[8] + mat[2]) / S2;
  } else if (mat[5] > mat[10]) {
    S2 = Math.sqrt(1 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S2;
    out[0] = (mat[1] + mat[4]) / S2;
    out[1] = 0.25 * S2;
    out[2] = (mat[6] + mat[9]) / S2;
  } else {
    S2 = Math.sqrt(1 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S2;
    out[0] = (mat[8] + mat[2]) / S2;
    out[1] = (mat[6] + mat[9]) / S2;
    out[2] = 0.25 * S2;
  }
  return out;
}
function perspective(out, fovy, aspect, near, far) {
  let f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/node_modules/gl-matrix/src/gl-matrix/vec3.js
function create3() {
  let out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
function fromValues(x, y, z) {
  let out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len2 = x * x + y * y + z * z;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
    out[0] = a[0] * len2;
    out[1] = a[1] * len2;
    out[2] = a[2] * len2;
  }
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function transformQuat(out, a, q) {
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  let x = a[0], y = a[1], z = a[2];
  let uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function angle(a, b) {
  let tempA = fromValues(a[0], a[1], a[2]);
  let tempB = fromValues(b[0], b[1], b[2]);
  normalize(tempA, tempA);
  normalize(tempB, tempB);
  let cosine = dot(tempA, tempB);
  if (cosine > 1) {
    return 0;
  } else if (cosine < -1) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}
var len = length;
var forEach = function() {
  let vec = create3();
  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/node_modules/gl-matrix/src/gl-matrix/mat3.js
function create4() {
  let out = new ARRAY_TYPE(9);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/node_modules/gl-matrix/src/gl-matrix/vec4.js
function create5() {
  let out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}
function clone2(a) {
  let out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function fromValues2(x, y, z, w) {
  let out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function copy3(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function normalize2(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len2 = x * x + y * y + z * z + w * w;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
    out[0] = x * len2;
    out[1] = y * len2;
    out[2] = z * len2;
    out[3] = w * len2;
  }
  return out;
}
var forEach2 = function() {
  let vec = create5();
  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
}();

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/node_modules/gl-matrix/src/gl-matrix/quat.js
function create6() {
  let out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function multiply2(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function slerp(out, a, b, t2) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  let omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > EPSILON) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t2) * omega) / sinom;
    scale1 = Math.sin(t2 * omega) / sinom;
  } else {
    scale0 = 1 - t2;
    scale1 = t2;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function invert2(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot3 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  let invDot = dot3 ? 1 / dot3 : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
function fromMat3(out, m) {
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    let i = 0;
    if (m[4] > m[0])
      i = 1;
    if (m[8] > m[i * 3 + i])
      i = 2;
    let j = (i + 1) % 3;
    let k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
function fromEuler(out, x, y, z) {
  let halfToRad = 0.5 * Math.PI / 180;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  let sx = Math.sin(x);
  let cx = Math.cos(x);
  let sy = Math.sin(y);
  let cy = Math.cos(y);
  let sz = Math.sin(z);
  let cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
var clone3 = clone2;
var fromValues3 = fromValues2;
var copy4 = copy3;
var normalize3 = normalize2;
var rotationTo = function() {
  let tmpvec3 = create3();
  let xUnitVec3 = fromValues(1, 0, 0);
  let yUnitVec3 = fromValues(0, 1, 0);
  return function(out, a, b) {
    let dot3 = dot(a, b);
    if (dot3 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 1e-6)
        cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot3 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot3;
      return normalize3(out, out);
    }
  };
}();
var sqlerp = function() {
  let temp1 = create6();
  let temp2 = create6();
  return function(out, a, b, c, d, t2) {
    slerp(temp1, a, d, t2);
    slerp(temp2, b, c, t2);
    slerp(out, temp1, temp2, 2 * t2 * (1 - t2));
    return out;
  };
}();
var setAxes = function() {
  let matr = create4();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize3(out, fromMat3(out, matr));
  };
}();

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRRigidTransform.js
var PRIVATE2 = Symbol("@@webxr-polyfill/XRRigidTransform");
var XRRigidTransform2 = class {
  // no arguments: identity transform
  // (Float32Array): transform based on matrix
  // (DOMPointReadOnly): transform based on position without any rotation
  // (DOMPointReadOnly, DOMPointReadOnly): transform based on position and
  // orientation quaternion
  constructor() {
    this[PRIVATE2] = {
      matrix: null,
      position: null,
      orientation: null,
      inverse: null
    };
    if (arguments.length === 0) {
      this[PRIVATE2].matrix = identity2(new Float32Array(16));
    } else if (arguments.length === 1) {
      if (arguments[0] instanceof Float32Array) {
        this[PRIVATE2].matrix = arguments[0];
      } else {
        this[PRIVATE2].position = this._getPoint(arguments[0]);
        this[PRIVATE2].orientation = DOMPointReadOnly.fromPoint({
          x: 0,
          y: 0,
          z: 0,
          w: 1
        });
      }
    } else if (arguments.length === 2) {
      this[PRIVATE2].position = this._getPoint(arguments[0]);
      this[PRIVATE2].orientation = this._getPoint(arguments[1]);
    } else {
      throw new Error("Too many arguments!");
    }
    if (this[PRIVATE2].matrix) {
      let position = create3();
      getTranslation(position, this[PRIVATE2].matrix);
      this[PRIVATE2].position = DOMPointReadOnly.fromPoint({
        x: position[0],
        y: position[1],
        z: position[2]
      });
      let orientation = create6();
      getRotation(orientation, this[PRIVATE2].matrix);
      this[PRIVATE2].orientation = DOMPointReadOnly.fromPoint({
        x: orientation[0],
        y: orientation[1],
        z: orientation[2],
        w: orientation[3]
      });
    } else {
      this[PRIVATE2].matrix = identity2(new Float32Array(16));
      fromRotationTranslation(
        this[PRIVATE2].matrix,
        fromValues3(
          this[PRIVATE2].orientation.x,
          this[PRIVATE2].orientation.y,
          this[PRIVATE2].orientation.z,
          this[PRIVATE2].orientation.w
        ),
        fromValues(
          this[PRIVATE2].position.x,
          this[PRIVATE2].position.y,
          this[PRIVATE2].position.z
        )
      );
    }
  }
  /**
   * Try to convert arg to a DOMPointReadOnly if it isn't already one.
   * @param {*} arg
   * @return {DOMPointReadOnly}
   */
  _getPoint(arg) {
    if (arg instanceof DOMPointReadOnly) {
      return arg;
    }
    return DOMPointReadOnly.fromPoint(arg);
  }
  /**
   * @return {Float32Array}
   */
  get matrix() {
    return this[PRIVATE2].matrix;
  }
  /**
   * @return {DOMPointReadOnly}
   */
  get position() {
    return this[PRIVATE2].position;
  }
  /**
   * @return {DOMPointReadOnly}
   */
  get orientation() {
    return this[PRIVATE2].orientation;
  }
  /**
   * @return {XRRigidTransform}
   */
  get inverse() {
    if (this[PRIVATE2].inverse === null) {
      let invMatrix = identity2(new Float32Array(16));
      invert(invMatrix, this[PRIVATE2].matrix);
      this[PRIVATE2].inverse = new XRRigidTransform2(invMatrix);
      this[PRIVATE2].inverse[PRIVATE2].inverse = this;
    }
    return this[PRIVATE2].inverse;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRSpace.js
var PRIVATE3 = Symbol("@@webxr-polyfill/XRSpace");
var XRSpace = class {
  /**
   * @param {string?} specialType
   * @param {XRInputSource?} inputSource 
   */
  constructor(specialType = null, inputSource = null) {
    this[PRIVATE3] = {
      specialType,
      inputSource,
      // The transform for the space in the base space, along with it's inverse
      baseMatrix: null,
      inverseBaseMatrix: null,
      lastFrameId: -1
    };
  }
  /**
   * @return {string?}
   */
  get _specialType() {
    return this[PRIVATE3].specialType;
  }
  /**
   * @return {XRInputSource?}
   */
  get _inputSource() {
    return this[PRIVATE3].inputSource;
  }
  /**
   * NON-STANDARD
   * Trigger an update for this space's base pose if necessary
   * @param {XRDevice} device
   * @param {Number} frameId
   */
  _ensurePoseUpdated(device, frameId) {
    if (frameId == this[PRIVATE3].lastFrameId)
      return;
    this[PRIVATE3].lastFrameId = frameId;
    this._onPoseUpdate(device);
  }
  /**
   * NON-STANDARD
   * Called when this space's base pose needs to be updated
   * @param {XRDevice} device
   */
  _onPoseUpdate(device) {
    if (this[PRIVATE3].specialType == "viewer") {
      this._baseMatrix = device.getBasePoseMatrix();
    }
  }
  /**
   * NON-STANDARD
   * @param {Float32Array(16)} matrix
   */
  set _baseMatrix(matrix) {
    this[PRIVATE3].baseMatrix = matrix;
    this[PRIVATE3].inverseBaseMatrix = null;
  }
  /**
   * NON-STANDARD
   * @return {Float32Array(16)}
   */
  get _baseMatrix() {
    if (!this[PRIVATE3].baseMatrix) {
      if (this[PRIVATE3].inverseBaseMatrix) {
        this[PRIVATE3].baseMatrix = new Float32Array(16);
        invert(this[PRIVATE3].baseMatrix, this[PRIVATE3].inverseBaseMatrix);
      }
    }
    return this[PRIVATE3].baseMatrix;
  }
  /**
   * NON-STANDARD
   * @param {Float32Array(16)} matrix
   */
  set _inverseBaseMatrix(matrix) {
    this[PRIVATE3].inverseBaseMatrix = matrix;
    this[PRIVATE3].baseMatrix = null;
  }
  /**
   * NON-STANDARD
   * @return {Float32Array(16)}
   */
  get _inverseBaseMatrix() {
    if (!this[PRIVATE3].inverseBaseMatrix) {
      if (this[PRIVATE3].baseMatrix) {
        this[PRIVATE3].inverseBaseMatrix = new Float32Array(16);
        invert(this[PRIVATE3].inverseBaseMatrix, this[PRIVATE3].baseMatrix);
      }
    }
    return this[PRIVATE3].inverseBaseMatrix;
  }
  /**
   * NON-STANDARD
   * Gets the transform of the given space in this space
   *
   * @param {XRSpace} space
   * @return {XRRigidTransform}
   */
  _getSpaceRelativeTransform(space) {
    if (!this._inverseBaseMatrix || !space._baseMatrix) {
      return null;
    }
    let out = new Float32Array(16);
    multiply(out, this._inverseBaseMatrix, space._baseMatrix);
    return new XRRigidTransform2(out);
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRReferenceSpace.js
var DEFAULT_EMULATION_HEIGHT = 1.6;
var PRIVATE4 = Symbol("@@webxr-polyfill/XRReferenceSpace");
var XRReferenceSpaceTypes = [
  "viewer",
  "local",
  "local-floor",
  "bounded-floor",
  "unbounded"
  // TODO: 'unbounded' is not supported by the polyfill.
];
function isFloor(type2) {
  return type2 === "bounded-floor" || type2 === "local-floor";
}
var XRReferenceSpace = class extends XRSpace {
  /**
   * Optionally takes a `transform` from a device's requestFrameOfReferenceMatrix
   * so device's can provide their own transforms for stage (or if they
   * wanted to override eye-level/head-model).
   *
   * @param {XRReferenceSpaceType} type
   * @param {Float32Array?} transform
   */
  constructor(type2, transform = null) {
    if (!XRReferenceSpaceTypes.includes(type2)) {
      throw new Error(`XRReferenceSpaceType must be one of ${XRReferenceSpaceTypes}`);
    }
    super(type2);
    if (type2 === "bounded-floor" && !transform) {
      throw new Error(`XRReferenceSpace cannot use 'bounded-floor' type if the platform does not provide the floor level`);
    }
    if (isFloor(type2) && !transform) {
      transform = identity2(new Float32Array(16));
      transform[13] = DEFAULT_EMULATION_HEIGHT;
    }
    this._inverseBaseMatrix = transform || identity2(new Float32Array(16));
    this[PRIVATE4] = {
      type: type2,
      transform,
      originOffset: identity2(new Float32Array(16))
    };
  }
  /**
   * NON-STANDARD
   * Takes a base pose model matrix and transforms it by the
   * frame of reference.
   *
   * @param {Float32Array} out
   * @param {Float32Array} pose
   */
  _transformBasePoseMatrix(out, pose) {
    multiply(out, this._inverseBaseMatrix, pose);
  }
  /**
   * NON-STANDARD
   * 
   * @return {Float32Array}
   */
  _originOffsetMatrix() {
    return this[PRIVATE4].originOffset;
  }
  /**
   * transformMatrix = Inv(OriginOffsetMatrix) * transformMatrix
   * @param {Float32Array} transformMatrix 
   */
  _adjustForOriginOffset(transformMatrix) {
    let inverseOriginOffsetMatrix = new Float32Array(16);
    invert(inverseOriginOffsetMatrix, this[PRIVATE4].originOffset);
    multiply(transformMatrix, inverseOriginOffsetMatrix, transformMatrix);
  }
  /**
   * Gets the transform of the given space in this space
   *
   * @param {XRSpace} space
   * @return {XRRigidTransform}
   */
  _getSpaceRelativeTransform(space) {
    let transform = super._getSpaceRelativeTransform(space);
    this._adjustForOriginOffset(transform.matrix);
    return new XRRigidTransform(transform.matrix);
  }
  /**
   * Doesn't update the bound geometry for bounded reference spaces.
   * @param {XRRigidTransform} additionalOffset
   * @return {XRReferenceSpace}
  */
  getOffsetReferenceSpace(additionalOffset) {
    let newSpace = new XRReferenceSpace(
      this[PRIVATE4].type,
      this[PRIVATE4].transform,
      this[PRIVATE4].bounds
    );
    multiply(newSpace[PRIVATE4].originOffset, this[PRIVATE4].originOffset, additionalOffset.matrix);
    return newSpace;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRSystem.js
var PRIVATE5 = Symbol("@@webxr-polyfill/XR");
var XRSessionModes = ["inline", "immersive-vr", "immersive-ar"];
var DEFAULT_SESSION_OPTIONS = {
  "inline": {
    requiredFeatures: ["viewer"],
    optionalFeatures: []
  },
  "immersive-vr": {
    requiredFeatures: ["viewer", "local"],
    optionalFeatures: []
  },
  "immersive-ar": {
    requiredFeatures: ["viewer", "local"],
    optionalFeatures: []
  }
};
var POLYFILL_REQUEST_SESSION_ERROR = `Polyfill Error: Must call navigator.xr.isSessionSupported() with any XRSessionMode
or navigator.xr.requestSession('inline') prior to requesting an immersive
session. This is a limitation specific to the WebXR Polyfill and does not apply
to native implementations of the API.`;
var XRSystem = class extends EventTarget {
  /**
   * Receives a promise of an XRDevice, so that the polyfill
   * can pass in some initial checks to asynchronously provide XRDevices
   * if content immediately requests `requestDevice()`.
   *
   * @param {Promise<XRDevice>} devicePromise
   */
  constructor(devicePromise) {
    super();
    this[PRIVATE5] = {
      device: null,
      devicePromise,
      immersiveSession: null,
      inlineSessions: /* @__PURE__ */ new Set()
    };
    devicePromise.then((device) => {
      this[PRIVATE5].device = device;
    });
  }
  /**
   * @param {XRSessionMode} mode
   * @return {Promise<boolean>}
   */
  async isSessionSupported(mode) {
    if (!this[PRIVATE5].device) {
      await this[PRIVATE5].devicePromise;
    }
    if (mode != "inline") {
      return Promise.resolve(this[PRIVATE5].device.isSessionSupported(mode));
    }
    return Promise.resolve(true);
  }
  /**
   * @param {XRSessionMode} mode
   * @param {XRSessionInit} options
   * @return {Promise<XRSession>}
   */
  async requestSession(mode, options) {
    if (!this[PRIVATE5].device) {
      if (mode != "inline") {
        throw new Error(POLYFILL_REQUEST_SESSION_ERROR);
      } else {
        await this[PRIVATE5].devicePromise;
      }
    }
    if (!XRSessionModes.includes(mode)) {
      throw new TypeError(
        `The provided value '${mode}' is not a valid enum value of type XRSessionMode`
      );
    }
    const defaultOptions = DEFAULT_SESSION_OPTIONS[mode];
    const requiredFeatures = defaultOptions.requiredFeatures.concat(
      options && options.requiredFeatures ? options.requiredFeatures : []
    );
    const optionalFeatures = defaultOptions.optionalFeatures.concat(
      options && options.optionalFeatures ? options.optionalFeatures : []
    );
    const enabledFeatures = /* @__PURE__ */ new Set();
    let requirementsFailed = false;
    for (let feature of requiredFeatures) {
      if (!this[PRIVATE5].device.isFeatureSupported(feature)) {
        console.error(`The required feature '${feature}' is not supported`);
        requirementsFailed = true;
      } else {
        enabledFeatures.add(feature);
      }
    }
    if (requirementsFailed) {
      throw new DOMException("Session does not support some required features", "NotSupportedError");
    }
    for (let feature of optionalFeatures) {
      if (!this[PRIVATE5].device.isFeatureSupported(feature)) {
        console.log(`The optional feature '${feature}' is not supported`);
      } else {
        enabledFeatures.add(feature);
      }
    }
    const sessionId = await this[PRIVATE5].device.requestSession(mode, enabledFeatures);
    const session = new XRSession(this[PRIVATE5].device, mode, sessionId);
    if (mode == "inline") {
      this[PRIVATE5].inlineSessions.add(session);
    } else {
      this[PRIVATE5].immersiveSession = session;
    }
    const onSessionEnd = () => {
      if (mode == "inline") {
        this[PRIVATE5].inlineSessions.delete(session);
      } else {
        this[PRIVATE5].immersiveSession = null;
      }
      session.removeEventListener("end", onSessionEnd);
    };
    session.addEventListener("end", onSessionEnd);
    return session;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/lib/now.js
var now;
if ("performance" in global_default === false) {
  let startTime = Date.now();
  now = () => Date.now() - startTime;
} else {
  now = () => performance.now();
}
var now_default = now;

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRPose.js
var PRIVATE6 = Symbol("@@webxr-polyfill/XRPose");
var XRPose2 = class {
  /**
   * @param {XRRigidTransform} transform 
   * @param {boolean} emulatedPosition 
   */
  constructor(transform, emulatedPosition) {
    this[PRIVATE6] = {
      transform,
      emulatedPosition
    };
  }
  /**
   * @return {XRRigidTransform}
   */
  get transform() {
    return this[PRIVATE6].transform;
  }
  /**
   * @return {bool}
   */
  get emulatedPosition() {
    return this[PRIVATE6].emulatedPosition;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRViewerPose.js
var PRIVATE7 = Symbol("@@webxr-polyfill/XRViewerPose");
var XRViewerPose = class extends XRPose2 {
  /**
   * @param {XRDevice} device
   */
  constructor(transform, views, emulatedPosition = false) {
    super(transform, emulatedPosition);
    this[PRIVATE7] = {
      views
    };
  }
  /**
   * @return {Array<XRView>}
   */
  get views() {
    return this[PRIVATE7].views;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRViewport.js
var PRIVATE8 = Symbol("@@webxr-polyfill/XRViewport");
var XRViewport = class {
  /**
   * Takes a proxy object that this viewport's XRView
   * updates and we serve here to match API.
   *
   * @param {Object} target
   */
  constructor(target) {
    this[PRIVATE8] = { target };
  }
  /**
   * @return {number}
   */
  get x() {
    return this[PRIVATE8].target.x;
  }
  /**
   * @return {number}
   */
  get y() {
    return this[PRIVATE8].target.y;
  }
  /**
   * @return {number}
   */
  get width() {
    return this[PRIVATE8].target.width;
  }
  /**
   * @return {number}
   */
  get height() {
    return this[PRIVATE8].target.height;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRView.js
var XREyes = ["left", "right", "none"];
var PRIVATE9 = Symbol("@@webxr-polyfill/XRView");
var XRView = class {
  /**
   * @param {XRDevice} device
   * @param {XREye} eye
   * @param {number} sessionId
   */
  constructor(device, transform, eye, sessionId) {
    if (!XREyes.includes(eye)) {
      throw new Error(`XREye must be one of: ${XREyes}`);
    }
    const temp = /* @__PURE__ */ Object.create(null);
    const viewport = new XRViewport(temp);
    this[PRIVATE9] = {
      device,
      eye,
      viewport,
      temp,
      sessionId,
      transform
    };
  }
  /**
   * @return {XREye}
   */
  get eye() {
    return this[PRIVATE9].eye;
  }
  /**
   * @return {Float32Array}
   */
  get projectionMatrix() {
    return this[PRIVATE9].device.getProjectionMatrix(this.eye);
  }
  /**
   * @return {XRRigidTransform}
   */
  get transform() {
    return this[PRIVATE9].transform;
  }
  /**
   * NON-STANDARD
   *
   * `getViewport` is now exposed via XRWebGLLayer instead of XRView.
   * XRWebGLLayer delegates all the actual work to this function.
   *
   * @param {XRWebGLLayer} layer
   * @return {XRViewport?}
   */
  _getViewport(layer) {
    if (this[PRIVATE9].device.getViewport(
      this[PRIVATE9].sessionId,
      this.eye,
      layer,
      this[PRIVATE9].temp
    )) {
      return this[PRIVATE9].viewport;
    }
    return void 0;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRFrame.js
var PRIVATE11 = Symbol("@@webxr-polyfill/XRFrame");
var NON_ACTIVE_MSG = "XRFrame access outside the callback that produced it is invalid.";
var NON_ANIMFRAME_MSG = "getViewerPose can only be called on XRFrame objects passed to XRSession.requestAnimationFrame callbacks.";
var NEXT_FRAME_ID = 0;
var XRFrame = class {
  /**
   * @param {XRDevice} device
   * @param {XRSession} session
   * @param {number} sessionId
   */
  constructor(device, session, sessionId) {
    this[PRIVATE11] = {
      id: ++NEXT_FRAME_ID,
      active: false,
      animationFrame: false,
      device,
      session,
      sessionId
    };
  }
  /**
   * @return {XRSession} session
   */
  get session() {
    return this[PRIVATE11].session;
  }
  /**
   * @param {XRReferenceSpace} referenceSpace
   * @return {XRViewerPose?}
   */
  getViewerPose(referenceSpace) {
    if (!this[PRIVATE11].animationFrame) {
      throw new DOMException(NON_ANIMFRAME_MSG, "InvalidStateError");
    }
    if (!this[PRIVATE11].active) {
      throw new DOMException(NON_ACTIVE_MSG, "InvalidStateError");
    }
    const device = this[PRIVATE11].device;
    const session = this[PRIVATE11].session;
    session[PRIVATE10].viewerSpace._ensurePoseUpdated(device, this[PRIVATE11].id);
    referenceSpace._ensurePoseUpdated(device, this[PRIVATE11].id);
    let viewerTransform = referenceSpace._getSpaceRelativeTransform(session[PRIVATE10].viewerSpace);
    const views = [];
    for (let viewSpace of session[PRIVATE10].viewSpaces) {
      viewSpace._ensurePoseUpdated(device, this[PRIVATE11].id);
      let viewTransform = referenceSpace._getSpaceRelativeTransform(viewSpace);
      let view = new XRView(device, viewTransform, viewSpace.eye, this[PRIVATE11].sessionId);
      views.push(view);
    }
    let viewerPose = new XRViewerPose(
      viewerTransform,
      views,
      false
      /* TODO: emulatedPosition */
    );
    return viewerPose;
  }
  /**
   * @param {XRSpace} space
   * @param {XRSpace} baseSpace
   * @return {XRPose?} pose
   */
  getPose(space, baseSpace) {
    if (!this[PRIVATE11].active) {
      throw new DOMException(NON_ACTIVE_MSG, "InvalidStateError");
    }
    const device = this[PRIVATE11].device;
    if (space._specialType === "target-ray" || space._specialType === "grip") {
      return device.getInputPose(
        space._inputSource,
        baseSpace,
        space._specialType
      );
    } else {
      space._ensurePoseUpdated(device, this[PRIVATE11].id);
      baseSpace._ensurePoseUpdated(device, this[PRIVATE11].id);
      let transform = baseSpace._getSpaceRelativeTransform(space);
      if (!transform) {
        return null;
      }
      return new XRPose(
        transform,
        false
        /* TODO: emulatedPosition */
      );
    }
    return null;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRRenderState.js
var PRIVATE12 = Symbol("@@webxr-polyfill/XRRenderState");
var XRRenderStateInit = Object.freeze({
  depthNear: 0.1,
  depthFar: 1e3,
  inlineVerticalFieldOfView: null,
  baseLayer: null
});
var XRRenderState = class {
  /**
   * @param {Object?} stateInit
   */
  constructor(stateInit = {}) {
    const config = Object.assign({}, XRRenderStateInit, stateInit);
    this[PRIVATE12] = { config };
  }
  /**
   * @return {number}
   */
  get depthNear() {
    return this[PRIVATE12].config.depthNear;
  }
  /**
   * @return {number}
   */
  get depthFar() {
    return this[PRIVATE12].config.depthFar;
  }
  /**
   * @return {number?}
   */
  get inlineVerticalFieldOfView() {
    return this[PRIVATE12].config.inlineVerticalFieldOfView;
  }
  /**
   * @return {XRWebGLLayer}
   */
  get baseLayer() {
    return this[PRIVATE12].config.baseLayer;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/constants.js
var POLYFILLED_XR_COMPATIBLE = Symbol("@@webxr-polyfill/polyfilled-xr-compatible");
var XR_COMPATIBLE = Symbol("@@webxr-polyfill/xr-compatible");

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRWebGLLayer.js
var PRIVATE13 = Symbol("@@webxr-polyfill/XRWebGLLayer");
var XRWebGLLayerInit = Object.freeze({
  antialias: true,
  depth: false,
  stencil: false,
  alpha: true,
  multiview: false,
  ignoreDepthValues: false,
  framebufferScaleFactor: 1
});
var XRWebGLLayer2 = class {
  /**
   * @param {XRSession} session 
   * @param {XRWebGLRenderingContext} context 
   * @param {Object?} layerInit 
   */
  constructor(session, context, layerInit = {}) {
    const config = Object.assign({}, XRWebGLLayerInit, layerInit);
    if (!(session instanceof XRSession2)) {
      throw new Error("session must be a XRSession");
    }
    if (session.ended) {
      throw new Error(`InvalidStateError`);
    }
    if (context[POLYFILLED_XR_COMPATIBLE]) {
      if (context[XR_COMPATIBLE] !== true) {
        throw new Error(`InvalidStateError`);
      }
    }
    const framebuffer = context.getParameter(context.FRAMEBUFFER_BINDING);
    this[PRIVATE13] = {
      context,
      config,
      framebuffer,
      session
    };
  }
  /**
   * @return {WebGLRenderingContext}
   */
  get context() {
    return this[PRIVATE13].context;
  }
  /**
   * @return {boolean}
   */
  get antialias() {
    return this[PRIVATE13].config.antialias;
  }
  /**
   * The polyfill will always ignore depth values.
   *
   * @return {boolean}
   */
  get ignoreDepthValues() {
    return true;
  }
  /**
   * @return {WebGLFramebuffer}
   */
  get framebuffer() {
    return this[PRIVATE13].framebuffer;
  }
  /**
   * @return {number}
   */
  get framebufferWidth() {
    return this[PRIVATE13].context.drawingBufferWidth;
  }
  /**
   * @return {number}
   */
  get framebufferHeight() {
    return this[PRIVATE13].context.drawingBufferHeight;
  }
  /**
   * @return {XRSession}
   */
  get _session() {
    return this[PRIVATE13].session;
  }
  /**
   * @TODO No mention in spec on not reusing the XRViewport on every frame.
   * 
   * @TODO In the future maybe all this logic should be handled here instead of
   * delegated to the XRView?
   *
   * @param {XRView} view
   * @return {XRViewport?}
   */
  getViewport(view) {
    return view._getViewport(this);
  }
  /**
   * Gets the scale factor to be requested if you want to match the device
   * resolution at the center of the user's vision. The polyfill will always
   * report 1.0.
   * 
   * @param {XRSession} session 
   * @return {number}
   */
  static getNativeFramebufferScaleFactor(session) {
    if (!session) {
      throw new TypeError("getNativeFramebufferScaleFactor must be passed a session.");
    }
    if (session[PRIVATE10].ended) {
      return 0;
    }
    return 1;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRInputSourceEvent.js
var PRIVATE14 = Symbol("@@webxr-polyfill/XRInputSourceEvent");
var XRInputSourceEvent = class extends Event {
  /**
   * @param {string} type
   * @param {Object} eventInitDict
   */
  constructor(type2, eventInitDict) {
    super(type2, eventInitDict);
    this[PRIVATE14] = {
      frame: eventInitDict.frame,
      inputSource: eventInitDict.inputSource
    };
    Object.setPrototypeOf(this, XRInputSourceEvent.prototype);
  }
  /**
   * @return {XRFrame}
   */
  get frame() {
    return this[PRIVATE14].frame;
  }
  /**
   * @return {XRInputSource}
   */
  get inputSource() {
    return this[PRIVATE14].inputSource;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRSessionEvent.js
var PRIVATE15 = Symbol("@@webxr-polyfill/XRSessionEvent");
var XRSessionEvent = class extends Event {
  /**
   * @param {string} type
   * @param {Object} eventInitDict
   */
  constructor(type2, eventInitDict) {
    super(type2, eventInitDict);
    this[PRIVATE15] = {
      session: eventInitDict.session
    };
    Object.setPrototypeOf(this, XRSessionEvent.prototype);
  }
  /**
   * @return {XRSession}
   */
  get session() {
    return this[PRIVATE15].session;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRInputSourcesChangeEvent.js
var PRIVATE16 = Symbol("@@webxr-polyfill/XRInputSourcesChangeEvent");
var XRInputSourcesChangeEvent = class extends Event {
  /**
   * @param {string} type
   * @param {Object} eventInitDict
   */
  constructor(type2, eventInitDict) {
    super(type2, eventInitDict);
    this[PRIVATE16] = {
      session: eventInitDict.session,
      added: eventInitDict.added,
      removed: eventInitDict.removed
    };
    Object.setPrototypeOf(this, XRInputSourcesChangeEvent.prototype);
  }
  /**
   * @return {XRSession}
   */
  get session() {
    return this[PRIVATE16].session;
  }
  /**
   * @return {Array<XRInputSource>}
   */
  get added() {
    return this[PRIVATE16].added;
  }
  /**
   * @return {Array<XRInputSource>}
   */
  get removed() {
    return this[PRIVATE16].removed;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRSession.js
var PRIVATE10 = Symbol("@@webxr-polyfill/XRSession");
var XRViewSpace = class extends XRSpace {
  constructor(eye) {
    super(eye);
  }
  get eye() {
    return this._specialType;
  }
  /**
   * Called when this space's base pose needs to be updated
   * @param {XRDevice} device
   */
  _onPoseUpdate(device) {
    this._inverseBaseMatrix = device.getBaseViewMatrix(this._specialType);
  }
};
var XRSession2 = class extends EventTarget {
  /**
   * @param {XRDevice} device
   * @param {XRSessionMode} mode
   * @param {number} id
   */
  constructor(device, mode, id) {
    super();
    let immersive = mode != "inline";
    let initialRenderState = new XRRenderState({
      inlineVerticalFieldOfView: immersive ? null : Math.PI * 0.5
    });
    this[PRIVATE10] = {
      device,
      mode,
      immersive,
      ended: false,
      suspended: false,
      frameCallbacks: [],
      currentFrameCallbacks: null,
      frameHandle: 0,
      deviceFrameHandle: null,
      id,
      activeRenderState: initialRenderState,
      pendingRenderState: null,
      viewerSpace: new XRReferenceSpace("viewer"),
      viewSpaces: [],
      currentInputSources: []
    };
    if (immersive) {
      this[PRIVATE10].viewSpaces.push(
        new XRViewSpace("left"),
        new XRViewSpace("right")
      );
    } else {
      this[PRIVATE10].viewSpaces.push(new XRViewSpace("none"));
    }
    this[PRIVATE10].onDeviceFrame = () => {
      if (this[PRIVATE10].ended || this[PRIVATE10].suspended) {
        return;
      }
      this[PRIVATE10].deviceFrameHandle = null;
      this[PRIVATE10].startDeviceFrameLoop();
      if (this[PRIVATE10].pendingRenderState !== null) {
        this[PRIVATE10].activeRenderState = new XRRenderState(this[PRIVATE10].pendingRenderState);
        this[PRIVATE10].pendingRenderState = null;
        if (this[PRIVATE10].activeRenderState.baseLayer) {
          this[PRIVATE10].device.onBaseLayerSet(
            this[PRIVATE10].id,
            this[PRIVATE10].activeRenderState.baseLayer
          );
        }
      }
      if (this[PRIVATE10].activeRenderState.baseLayer === null) {
        return;
      }
      const frame = new XRFrame(device, this, this[PRIVATE10].id);
      const callbacks = this[PRIVATE10].currentFrameCallbacks = this[PRIVATE10].frameCallbacks;
      this[PRIVATE10].frameCallbacks = [];
      frame[PRIVATE11].active = true;
      frame[PRIVATE11].animationFrame = true;
      this[PRIVATE10].device.onFrameStart(this[PRIVATE10].id, this[PRIVATE10].activeRenderState);
      this._checkInputSourcesChange();
      const rightNow = now_default();
      for (let i = 0; i < callbacks.length; i++) {
        try {
          if (!callbacks[i].cancelled && typeof callbacks[i].callback === "function") {
            callbacks[i].callback(rightNow, frame);
          }
        } catch (err) {
          console.error(err);
        }
      }
      this[PRIVATE10].currentFrameCallbacks = null;
      frame[PRIVATE11].active = false;
      this[PRIVATE10].device.onFrameEnd(this[PRIVATE10].id);
    };
    this[PRIVATE10].startDeviceFrameLoop = () => {
      if (this[PRIVATE10].deviceFrameHandle === null) {
        this[PRIVATE10].deviceFrameHandle = this[PRIVATE10].device.requestAnimationFrame(
          this[PRIVATE10].onDeviceFrame
        );
      }
    };
    this[PRIVATE10].stopDeviceFrameLoop = () => {
      const handle = this[PRIVATE10].deviceFrameHandle;
      if (handle !== null) {
        this[PRIVATE10].device.cancelAnimationFrame(handle);
        this[PRIVATE10].deviceFrameHandle = null;
      }
    };
    this[PRIVATE10].onPresentationEnd = (sessionId) => {
      if (sessionId !== this[PRIVATE10].id) {
        this[PRIVATE10].suspended = false;
        this[PRIVATE10].startDeviceFrameLoop();
        this.dispatchEvent("focus", { session: this });
        return;
      }
      this[PRIVATE10].ended = true;
      this[PRIVATE10].stopDeviceFrameLoop();
      device.removeEventListener("@@webxr-polyfill/vr-present-end", this[PRIVATE10].onPresentationEnd);
      device.removeEventListener("@@webxr-polyfill/vr-present-start", this[PRIVATE10].onPresentationStart);
      device.removeEventListener("@@webxr-polyfill/input-select-start", this[PRIVATE10].onSelectStart);
      device.removeEventListener("@@webxr-polyfill/input-select-end", this[PRIVATE10].onSelectEnd);
      this.dispatchEvent("end", new XRSessionEvent("end", { session: this }));
    };
    device.addEventListener("@@webxr-polyfill/vr-present-end", this[PRIVATE10].onPresentationEnd);
    this[PRIVATE10].onPresentationStart = (sessionId) => {
      if (sessionId === this[PRIVATE10].id) {
        return;
      }
      this[PRIVATE10].suspended = true;
      this[PRIVATE10].stopDeviceFrameLoop();
      this.dispatchEvent("blur", { session: this });
    };
    device.addEventListener("@@webxr-polyfill/vr-present-start", this[PRIVATE10].onPresentationStart);
    this[PRIVATE10].onSelectStart = (evt) => {
      if (evt.sessionId !== this[PRIVATE10].id) {
        return;
      }
      this[PRIVATE10].dispatchInputSourceEvent("selectstart", evt.inputSource);
    };
    device.addEventListener("@@webxr-polyfill/input-select-start", this[PRIVATE10].onSelectStart);
    this[PRIVATE10].onSelectEnd = (evt) => {
      if (evt.sessionId !== this[PRIVATE10].id) {
        return;
      }
      this[PRIVATE10].dispatchInputSourceEvent("selectend", evt.inputSource);
      this[PRIVATE10].dispatchInputSourceEvent("select", evt.inputSource);
    };
    device.addEventListener("@@webxr-polyfill/input-select-end", this[PRIVATE10].onSelectEnd);
    this[PRIVATE10].onSqueezeStart = (evt) => {
      if (evt.sessionId !== this[PRIVATE10].id) {
        return;
      }
      this[PRIVATE10].dispatchInputSourceEvent("squeezestart", evt.inputSource);
    };
    device.addEventListener("@@webxr-polyfill/input-squeeze-start", this[PRIVATE10].onSqueezeStart);
    this[PRIVATE10].onSqueezeEnd = (evt) => {
      if (evt.sessionId !== this[PRIVATE10].id) {
        return;
      }
      this[PRIVATE10].dispatchInputSourceEvent("squeezeend", evt.inputSource);
      this[PRIVATE10].dispatchInputSourceEvent("squeeze", evt.inputSource);
    };
    device.addEventListener("@@webxr-polyfill/input-squeeze-end", this[PRIVATE10].onSqueezeEnd);
    this[PRIVATE10].dispatchInputSourceEvent = (type2, inputSource) => {
      const frame = new XRFrame(device, this, this[PRIVATE10].id);
      const event = new XRInputSourceEvent(type2, { frame, inputSource });
      frame[PRIVATE11].active = true;
      this.dispatchEvent(type2, event);
      frame[PRIVATE11].active = false;
    };
    this[PRIVATE10].startDeviceFrameLoop();
    this.onblur = void 0;
    this.onfocus = void 0;
    this.onresetpose = void 0;
    this.onend = void 0;
    this.onselect = void 0;
    this.onselectstart = void 0;
    this.onselectend = void 0;
  }
  /**
   * @return {XRRenderState}
   */
  get renderState() {
    return this[PRIVATE10].activeRenderState;
  }
  /**
   * @return {XREnvironmentBlendMode}
   */
  get environmentBlendMode() {
    return this[PRIVATE10].device.environmentBlendMode || "opaque";
  }
  /**
   * @param {string} type
   * @return {XRReferenceSpace}
   */
  async requestReferenceSpace(type2) {
    if (this[PRIVATE10].ended) {
      return;
    }
    if (!XRReferenceSpaceTypes.includes(type2)) {
      throw new TypeError(`XRReferenceSpaceType must be one of ${XRReferenceSpaceTypes}`);
    }
    if (!this[PRIVATE10].device.doesSessionSupportReferenceSpace(this[PRIVATE10].id, type2)) {
      throw new DOMException(`The ${type2} reference space is not supported by this session.`, "NotSupportedError");
    }
    if (type2 === "viewer") {
      return this[PRIVATE10].viewerSpace;
    }
    let transform = await this[PRIVATE10].device.requestFrameOfReferenceTransform(type2);
    if (type2 === "bounded-floor") {
      if (!transform) {
        throw new DOMException(`${type2} XRReferenceSpace not supported by this device.`, "NotSupportedError");
      }
      let bounds = this[PRIVATE10].device.requestStageBounds();
      if (!bounds) {
        throw new DOMException(`${type2} XRReferenceSpace not supported by this device.`, "NotSupportedError");
      }
      throw new DOMException(`The WebXR polyfill does not support the ${type2} reference space yet.`, "NotSupportedError");
    }
    return new XRReferenceSpace(type2, transform);
  }
  /**
   * @param {Function} callback
   * @return {number}
   */
  requestAnimationFrame(callback) {
    if (this[PRIVATE10].ended) {
      return;
    }
    const handle = ++this[PRIVATE10].frameHandle;
    this[PRIVATE10].frameCallbacks.push({
      handle,
      callback,
      cancelled: false
    });
    return handle;
  }
  /**
   * @param {number} handle
   */
  cancelAnimationFrame(handle) {
    let callbacks = this[PRIVATE10].frameCallbacks;
    let index = callbacks.findIndex((d) => d && d.handle === handle);
    if (index > -1) {
      callbacks[index].cancelled = true;
      callbacks.splice(index, 1);
    }
    callbacks = this[PRIVATE10].currentFrameCallbacks;
    if (callbacks) {
      index = callbacks.findIndex((d) => d && d.handle === handle);
      if (index > -1) {
        callbacks[index].cancelled = true;
      }
    }
  }
  /**
   * @return {Array<XRInputSource>} input sources
   */
  get inputSources() {
    return this[PRIVATE10].device.getInputSources();
  }
  /**
   * @return {Promise<void>}
   */
  async end() {
    if (this[PRIVATE10].ended) {
      return;
    }
    if (this[PRIVATE10].immersive) {
      this[PRIVATE10].ended = true;
      this[PRIVATE10].device.removeEventListener(
        "@@webxr-polyfill/vr-present-start",
        this[PRIVATE10].onPresentationStart
      );
      this[PRIVATE10].device.removeEventListener(
        "@@webxr-polyfill/vr-present-end",
        this[PRIVATE10].onPresentationEnd
      );
      this[PRIVATE10].device.removeEventListener(
        "@@webxr-polyfill/input-select-start",
        this[PRIVATE10].onSelectStart
      );
      this[PRIVATE10].device.removeEventListener(
        "@@webxr-polyfill/input-select-end",
        this[PRIVATE10].onSelectEnd
      );
      this.dispatchEvent("end", new XRSessionEvent("end", { session: this }));
    }
    this[PRIVATE10].stopDeviceFrameLoop();
    return this[PRIVATE10].device.endSession(this[PRIVATE10].id);
  }
  /**
   * Queues an update to the active render state to be applied on the next
   * frame. Unset fields of newState will not be changed.
   * 
   * @param {XRRenderStateInit?} newState 
   */
  updateRenderState(newState) {
    if (this[PRIVATE10].ended) {
      const message = "Can't call updateRenderState on an XRSession that has already ended.";
      throw new Error(message);
    }
    if (newState.baseLayer && newState.baseLayer._session !== this) {
      const message = "Called updateRenderState with a base layer that was created by a different session.";
      throw new Error(message);
    }
    const fovSet = newState.inlineVerticalFieldOfView !== null && newState.inlineVerticalFieldOfView !== void 0;
    if (fovSet) {
      if (this[PRIVATE10].immersive) {
        const message = "inlineVerticalFieldOfView must not be set for an XRRenderState passed to updateRenderState for an immersive session.";
        throw new Error(message);
      } else {
        newState.inlineVerticalFieldOfView = Math.min(
          3.13,
          Math.max(0.01, newState.inlineVerticalFieldOfView)
        );
      }
    }
    if (this[PRIVATE10].pendingRenderState === null) {
      const activeRenderState = this[PRIVATE10].activeRenderState;
      this[PRIVATE10].pendingRenderState = {
        depthNear: activeRenderState.depthNear,
        depthFar: activeRenderState.depthFar,
        inlineVerticalFieldOfView: activeRenderState.inlineVerticalFieldOfView,
        baseLayer: activeRenderState.baseLayer
      };
    }
    Object.assign(this[PRIVATE10].pendingRenderState, newState);
  }
  /**
   * Compares the inputSources with the ones in the previous frame.
   * Fires imputsourceschange event if any added or removed
   * inputSource is found.
   */
  _checkInputSourcesChange() {
    const added = [];
    const removed = [];
    const newInputSources = this.inputSources;
    const oldInputSources = this[PRIVATE10].currentInputSources;
    for (const newInputSource of newInputSources) {
      if (!oldInputSources.includes(newInputSource)) {
        added.push(newInputSource);
      }
    }
    for (const oldInputSource of oldInputSources) {
      if (!newInputSources.includes(oldInputSource)) {
        removed.push(oldInputSource);
      }
    }
    if (added.length > 0 || removed.length > 0) {
      this.dispatchEvent("inputsourceschange", new XRInputSourcesChangeEvent("inputsourceschange", {
        session: this,
        added,
        removed
      }));
    }
    this[PRIVATE10].currentInputSources.length = 0;
    for (const newInputSource of newInputSources) {
      this[PRIVATE10].currentInputSources.push(newInputSource);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRInputSource.js
var PRIVATE17 = Symbol("@@webxr-polyfill/XRInputSource");
var XRInputSource = class {
  /**
   * @param {GamepadXRInputSource} impl 
   */
  constructor(impl) {
    this[PRIVATE17] = {
      impl,
      gripSpace: new XRSpace("grip", this),
      targetRaySpace: new XRSpace("target-ray", this)
    };
  }
  /**
   * @return {XRHandedness}
   */
  get handedness() {
    return this[PRIVATE17].impl.handedness;
  }
  /**
   * @return {XRTargetRayMode}
   */
  get targetRayMode() {
    return this[PRIVATE17].impl.targetRayMode;
  }
  /**
   * @return {XRSpace}
   */
  get gripSpace() {
    let mode = this[PRIVATE17].impl.targetRayMode;
    if (mode === "gaze" || mode === "screen") {
      return null;
    }
    return this[PRIVATE17].gripSpace;
  }
  /**
   * @return {XRSpace}
   */
  get targetRaySpace() {
    return this[PRIVATE17].targetRaySpace;
  }
  /**
   * @return {Array<String>}
   */
  get profiles() {
    return this[PRIVATE17].impl.profiles;
  }
  /**
   * @return {Gamepad}
   */
  get gamepad() {
    return this[PRIVATE17].impl.gamepad;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/XRReferenceSpaceEvent.js
var PRIVATE18 = Symbol("@@webxr-polyfill/XRReferenceSpaceEvent");
var XRReferenceSpaceEvent = class extends Event {
  /**
   * @param {string} type
   * @param {Object} eventInitDict
   */
  constructor(type2, eventInitDict) {
    super(type2, eventInitDict);
    this[PRIVATE18] = {
      referenceSpace: eventInitDict.referenceSpace,
      transform: eventInitDict.transform || null
    };
    Object.setPrototypeOf(this, XRReferenceSpaceEvent.prototype);
  }
  /**
   * @return {XRFrame}
   */
  get referenceSpace() {
    return this[PRIVATE18].referenceSpace;
  }
  /**
   * @return {XRInputSource}
   */
  get transform() {
    return this[PRIVATE18].transform;
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/api/index.js
var api_default = {
  XRSystem,
  XRSession: XRSession2,
  XRSessionEvent,
  XRFrame,
  XRView,
  XRViewport,
  XRViewerPose,
  XRWebGLLayer: XRWebGLLayer2,
  XRSpace,
  XRReferenceSpace,
  XRReferenceSpaceEvent,
  XRInputSource,
  XRInputSourceEvent,
  XRInputSourcesChangeEvent,
  XRRenderState,
  XRRigidTransform: XRRigidTransform2,
  XRPose: XRPose2
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/polyfill-globals.js
var polyfillMakeXRCompatible = (Context) => {
  if (typeof Context.prototype.makeXRCompatible === "function") {
    return false;
  }
  Context.prototype.makeXRCompatible = function() {
    this[XR_COMPATIBLE] = true;
    return Promise.resolve();
  };
  return true;
};
var polyfillGetContext = (Canvas2) => {
  const getContext = Canvas2.prototype.getContext;
  Canvas2.prototype.getContext = function(contextType, glAttribs) {
    const ctx = getContext.call(this, contextType, glAttribs);
    if (ctx) {
      ctx[POLYFILLED_XR_COMPATIBLE] = true;
      if (glAttribs && "xrCompatible" in glAttribs) {
        ctx[XR_COMPATIBLE] = glAttribs.xrCompatible;
      }
    }
    return ctx;
  };
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/utils.js
var isImageBitmapSupported = (global2) => !!(global2.ImageBitmapRenderingContext && global2.createImageBitmap);
var isMobile2 = (global2) => {
  var check = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
      check = true;
  })(global2.navigator.userAgent || global2.navigator.vendor || global2.opera);
  return check;
};
var applyCanvasStylesForMinimalRendering = (canvas) => {
  canvas.style.display = "block";
  canvas.style.position = "absolute";
  canvas.style.width = canvas.style.height = "1px";
  canvas.style.top = canvas.style.left = "0px";
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices/CardboardXRDevice.js
var import_cardboard_vr_display = __toESM(require_cardboard_vr_display());

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices/XRDevice.js
var XRDevice = class extends EventTarget {
  /**
   * Takes a VRDisplay object from the WebVR 1.1 spec.
   *
   * @param {Object} global
   */
  constructor(global2) {
    super();
    this.global = global2;
    this.onWindowResize = this.onWindowResize.bind(this);
    this.global.window.addEventListener("resize", this.onWindowResize);
    this.environmentBlendMode = "opaque";
  }
  /**
   * Called when a XRSession has a `baseLayer` property set.
   *
   * @param {number} sessionId
   * @param {XRWebGLLayer} layer
   */
  onBaseLayerSet(sessionId, layer) {
    throw new Error("Not implemented");
  }
  /**
   * @param {XRSessionMode} mode
   * @return {boolean}
   */
  isSessionSupported(mode) {
    throw new Error("Not implemented");
  }
  /**
   * @param {string} featureDescriptor
   * @return {boolean}
   */
  isFeatureSupported(featureDescriptor) {
    throw new Error("Not implemented");
  }
  /**
   * Returns a promise if creating a session is successful.
   * Usually used to set up presentation in the device.
   *
   * @param {XRSessionMode} mode
   * @param {Set<string>} enabledFeatures
   * @return {Promise<number>}
   */
  async requestSession(mode, enabledFeatures) {
    throw new Error("Not implemented");
  }
  /**
   * @return {Function}
   */
  requestAnimationFrame(callback) {
    throw new Error("Not implemented");
  }
  /**
   * @param {number} sessionId
   */
  onFrameStart(sessionId) {
    throw new Error("Not implemented");
  }
  /**
   * @param {number} sessionId
   */
  onFrameEnd(sessionId) {
    throw new Error("Not implemented");
  }
  /**
   * @param {number} sessionId
   * @param {XRReferenceSpaceType} type
   * @return {boolean}
   */
  doesSessionSupportReferenceSpace(sessionId, type2) {
    throw new Error("Not implemented");
  }
  /**
   * @return {Object?}
   */
  requestStageBounds() {
    throw new Error("Not implemented");
  }
  /**
   * Returns a promise resolving to a transform if XRDevice
   * can support frame of reference and provides its own values.
   * Can resolve to `undefined` if the polyfilled API can provide
   * a default. Rejects if this XRDevice cannot
   * support the frame of reference.
   *
   * @param {XRFrameOfReferenceType} type
   * @param {XRFrameOfReferenceOptions} options
   * @return {Promise<XRFrameOfReference>}
   */
  async requestFrameOfReferenceTransform(type2, options) {
    return void 0;
  }
  /**
   * @param {number} handle
   */
  cancelAnimationFrame(handle) {
    throw new Error("Not implemented");
  }
  /**
   * @param {number} sessionId
   */
  endSession(sessionId) {
    throw new Error("Not implemented");
  }
  /**
   * Takes a XREye and a target to apply properties of
   * `x`, `y`, `width` and `height` on. Returns a boolean
   * indicating if it successfully was able to populate
   * target's values.
   *
   * @param {number} sessionId
   * @param {XREye} eye
   * @param {XRWebGLLayer} layer
   * @param {Object?} target
   * @return {boolean}
   */
  getViewport(sessionId, eye, layer, target) {
    throw new Error("Not implemented");
  }
  /**
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getProjectionMatrix(eye) {
    throw new Error("Not implemented");
  }
  /**
   * Get model matrix unaffected by frame of reference.
   *
   * @return {Float32Array}
   */
  getBasePoseMatrix() {
    throw new Error("Not implemented");
  }
  /**
   * Get view matrix unaffected by frame of reference.
   *
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getBaseViewMatrix(eye) {
    throw new Error("Not implemented");
  }
  /**
   * Get a list of input sources.
   *
   * @return {Array<XRInputSource>}
   */
  getInputSources() {
    throw new Error("Not implemented");
  }
  /**
   * Get the current pose of an input source.
   *
   * @param {XRInputSource} inputSource
   * @param {XRCoordinateSystem} coordinateSystem
   * @param {String} poseType
   * @return {XRPose}
   */
  getInputPose(inputSource, coordinateSystem, poseType) {
    throw new Error("Not implemented");
  }
  /**
   * Called on window resize.
   */
  onWindowResize() {
    this.onWindowResize();
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices/GamepadMappings.js
var daydream = {
  mapping: "",
  profiles: ["google-daydream", "generic-trigger-touchpad"],
  buttons: {
    length: 3,
    0: null,
    1: null,
    2: 0
  }
};
var viveFocus = {
  mapping: "xr-standard",
  profiles: ["htc-vive-focus", "generic-trigger-touchpad"],
  buttons: {
    length: 3,
    0: 1,
    1: null,
    2: 0
  }
};
var oculusGo = {
  mapping: "xr-standard",
  profiles: ["oculus-go", "generic-trigger-touchpad"],
  buttons: {
    length: 3,
    0: 1,
    1: null,
    2: 0
  },
  // Grip adjustments determined experimentally.
  gripTransform: {
    orientation: [Math.PI * 0.11, 0, 0, 1]
  }
};
var oculusTouch = {
  mapping: "xr-standard",
  displayProfiles: {
    "Oculus Quest": ["oculus-touch-v2", "oculus-touch", "generic-trigger-squeeze-thumbstick"]
  },
  profiles: ["oculus-touch", "generic-trigger-squeeze-thumbstick"],
  axes: {
    length: 4,
    0: null,
    1: null,
    2: 0,
    3: 1
  },
  buttons: {
    length: 7,
    0: 1,
    1: 2,
    2: null,
    3: 0,
    4: 3,
    5: 4,
    6: null
  },
  // Grip adjustments determined experimentally.
  gripTransform: {
    position: [0, -0.02, 0.04, 1],
    orientation: [Math.PI * 0.11, 0, 0, 1]
  }
};
var openVr = {
  mapping: "xr-standard",
  profiles: ["htc-vive", "generic-trigger-squeeze-touchpad"],
  displayProfiles: {
    "HTC Vive": ["htc-vive", "generic-trigger-squeeze-touchpad"],
    "HTC Vive DVT": ["htc-vive", "generic-trigger-squeeze-touchpad"],
    "Valve Index": ["valve-index", "generic-trigger-squeeze-touchpad-thumbstick"]
  },
  buttons: {
    length: 3,
    0: 1,
    1: 2,
    2: 0
  },
  // Transform adjustments determined experimentally.
  gripTransform: {
    position: [0, 0, 0.05, 1]
  },
  targetRayTransform: {
    orientation: [Math.PI * -0.08, 0, 0, 1]
  },
  userAgentOverrides: {
    "Firefox": {
      axes: {
        invert: [1, 3]
      }
    }
  }
};
var samsungGearVR = {
  mapping: "xr-standard",
  profiles: ["samsung-gearvr", "generic-trigger-touchpad"],
  buttons: {
    length: 3,
    0: 1,
    1: null,
    2: 0
  },
  gripTransform: {
    orientation: [Math.PI * 0.11, 0, 0, 1]
  }
};
var samsungOdyssey = {
  mapping: "xr-standard",
  profiles: ["samsung-odyssey", "microsoft-mixed-reality", "generic-trigger-squeeze-touchpad-thumbstick"],
  buttons: {
    length: 4,
    0: 1,
    // index finger trigger
    1: 0,
    // pressable joystick
    2: 2,
    // grip trigger
    3: 4
    // pressable touchpad
  },
  // Grip adjustments determined experimentally.
  gripTransform: {
    position: [0, -0.02, 0.04, 1],
    orientation: [Math.PI * 0.11, 0, 0, 1]
  }
};
var windowsMixedReality = {
  mapping: "xr-standard",
  profiles: ["microsoft-mixed-reality", "generic-trigger-squeeze-touchpad-thumbstick"],
  buttons: {
    length: 4,
    0: 1,
    // index finger trigger
    1: 0,
    // pressable joystick
    2: 2,
    // grip trigger
    3: 4
    // pressable touchpad
  },
  // Grip adjustments determined experimentally.
  gripTransform: {
    position: [0, -0.02, 0.04, 1],
    orientation: [Math.PI * 0.11, 0, 0, 1]
  }
};
var GamepadMappings = {
  "Daydream Controller": daydream,
  "Gear VR Controller": samsungGearVR,
  "HTC Vive Focus Controller": viveFocus,
  "Oculus Go Controller": oculusGo,
  "Oculus Touch (Right)": oculusTouch,
  "Oculus Touch (Left)": oculusTouch,
  "OpenVR Gamepad": openVr,
  "Spatial Controller (Spatial Interaction Source) 045E-065A": windowsMixedReality,
  "Spatial Controller (Spatial Interaction Source) 045E-065D": samsungOdyssey,
  "Windows Mixed Reality (Right)": windowsMixedReality,
  "Windows Mixed Reality (Left)": windowsMixedReality
};
var GamepadMappings_default = GamepadMappings;

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/lib/OrientationArmModel.js
var HEAD_ELBOW_OFFSET_RIGHTHANDED = fromValues(0.155, -0.465, -0.15);
var HEAD_ELBOW_OFFSET_LEFTHANDED = fromValues(-0.155, -0.465, -0.15);
var ELBOW_WRIST_OFFSET = fromValues(0, 0, -0.25);
var WRIST_CONTROLLER_OFFSET = fromValues(0, 0, 0.05);
var ARM_EXTENSION_OFFSET = fromValues(-0.08, 0.14, 0.08);
var ELBOW_BEND_RATIO = 0.4;
var EXTENSION_RATIO_WEIGHT = 0.4;
var MIN_ANGULAR_SPEED = 0.61;
var MIN_ANGLE_DELTA = 0.175;
var MIN_EXTENSION_COS = 0.12;
var MAX_EXTENSION_COS = 0.87;
var RAD_TO_DEG = 180 / Math.PI;
function eulerFromQuaternion(out, q, order) {
  function clamp2(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }
  var sqx = q[0] * q[0];
  var sqy = q[1] * q[1];
  var sqz = q[2] * q[2];
  var sqw = q[3] * q[3];
  if (order === "XYZ") {
    out[0] = Math.atan2(2 * (q[0] * q[3] - q[1] * q[2]), sqw - sqx - sqy + sqz);
    out[1] = Math.asin(clamp2(2 * (q[0] * q[2] + q[1] * q[3]), -1, 1));
    out[2] = Math.atan2(2 * (q[2] * q[3] - q[0] * q[1]), sqw + sqx - sqy - sqz);
  } else if (order === "YXZ") {
    out[0] = Math.asin(clamp2(2 * (q[0] * q[3] - q[1] * q[2]), -1, 1));
    out[1] = Math.atan2(2 * (q[0] * q[2] + q[1] * q[3]), sqw - sqx - sqy + sqz);
    out[2] = Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), sqw - sqx + sqy - sqz);
  } else if (order === "ZXY") {
    out[0] = Math.asin(clamp2(2 * (q[0] * q[3] + q[1] * q[2]), -1, 1));
    out[1] = Math.atan2(2 * (q[1] * q[3] - q[2] * q[0]), sqw - sqx - sqy + sqz);
    out[2] = Math.atan2(2 * (q[2] * q[3] - q[0] * q[1]), sqw - sqx + sqy - sqz);
  } else if (order === "ZYX") {
    out[0] = Math.atan2(2 * (q[0] * q[3] + q[2] * q[1]), sqw - sqx - sqy + sqz);
    out[1] = Math.asin(clamp2(2 * (q[1] * q[3] - q[0] * q[2]), -1, 1));
    out[2] = Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), sqw + sqx - sqy - sqz);
  } else if (order === "YZX") {
    out[0] = Math.atan2(2 * (q[0] * q[3] - q[2] * q[1]), sqw - sqx + sqy - sqz);
    out[1] = Math.atan2(2 * (q[1] * q[3] - q[0] * q[2]), sqw + sqx - sqy - sqz);
    out[2] = Math.asin(clamp2(2 * (q[0] * q[1] + q[2] * q[3]), -1, 1));
  } else if (order === "XZY") {
    out[0] = Math.atan2(2 * (q[0] * q[3] + q[1] * q[2]), sqw - sqx + sqy - sqz);
    out[1] = Math.atan2(2 * (q[0] * q[2] + q[1] * q[3]), sqw + sqx - sqy - sqz);
    out[2] = Math.asin(clamp2(2 * (q[2] * q[3] - q[0] * q[1]), -1, 1));
  } else {
    console.log("No order given for quaternion to euler conversion.");
    return;
  }
}
var OrientationArmModel = class {
  constructor() {
    this.hand = "right";
    this.headElbowOffset = HEAD_ELBOW_OFFSET_RIGHTHANDED;
    this.controllerQ = create6();
    this.lastControllerQ = create6();
    this.headQ = create6();
    this.headPos = create3();
    this.elbowPos = create3();
    this.wristPos = create3();
    this.time = null;
    this.lastTime = null;
    this.rootQ = create6();
    this.position = create3();
  }
  setHandedness(hand) {
    if (this.hand != hand) {
      this.hand = hand;
      if (this.hand == "left") {
        this.headElbowOffset = HEAD_ELBOW_OFFSET_LEFTHANDED;
      } else {
        this.headElbowOffset = HEAD_ELBOW_OFFSET_RIGHTHANDED;
      }
    }
  }
  /**
   * Called on a RAF.
   */
  update(controllerOrientation, headPoseMatrix) {
    this.time = now_default();
    if (controllerOrientation) {
      copy4(this.lastControllerQ, this.controllerQ);
      copy4(this.controllerQ, controllerOrientation);
    }
    if (headPoseMatrix) {
      getTranslation(this.headPos, headPoseMatrix);
      getRotation(this.headQ, headPoseMatrix);
    }
    let headYawQ = this.getHeadYawOrientation_();
    let angleDelta = this.quatAngle_(this.lastControllerQ, this.controllerQ);
    let timeDelta = (this.time - this.lastTime) / 1e3;
    let controllerAngularSpeed = angleDelta / timeDelta;
    if (controllerAngularSpeed > MIN_ANGULAR_SPEED) {
      slerp(
        this.rootQ,
        this.rootQ,
        headYawQ,
        Math.min(angleDelta / MIN_ANGLE_DELTA, 1)
      );
    } else {
      copy4(this.rootQ, headYawQ);
    }
    let controllerForward = fromValues(0, 0, -1);
    transformQuat(controllerForward, controllerForward, this.controllerQ);
    let controllerDotY = dot(controllerForward, [0, 1, 0]);
    let extensionRatio = this.clamp_(
      (controllerDotY - MIN_EXTENSION_COS) / MAX_EXTENSION_COS,
      0,
      1
    );
    let controllerCameraQ = clone3(this.rootQ);
    invert2(controllerCameraQ, controllerCameraQ);
    multiply2(controllerCameraQ, controllerCameraQ, this.controllerQ);
    let elbowPos = this.elbowPos;
    copy2(elbowPos, this.headPos);
    add(elbowPos, elbowPos, this.headElbowOffset);
    let elbowOffset = clone(ARM_EXTENSION_OFFSET);
    scale(elbowOffset, elbowOffset, extensionRatio);
    add(elbowPos, elbowPos, elbowOffset);
    let totalAngle = this.quatAngle_(controllerCameraQ, create6());
    let totalAngleDeg = totalAngle * RAD_TO_DEG;
    let lerpSuppression = 1 - Math.pow(totalAngleDeg / 180, 4);
    sssss;
    let elbowRatio = ELBOW_BEND_RATIO;
    let wristRatio = 1 - ELBOW_BEND_RATIO;
    let lerpValue = lerpSuppression * (elbowRatio + wristRatio * extensionRatio * EXTENSION_RATIO_WEIGHT);
    let wristQ = create6();
    slerp(wristQ, wristQ, controllerCameraQ, lerpValue);
    let invWristQ = invert2(create6(), wristQ);
    let elbowQ = clone3(controllerCameraQ);
    multiply2(elbowQ, elbowQ, invWristQ);
    let wristPos = this.wristPos;
    copy2(wristPos, WRIST_CONTROLLER_OFFSET);
    transformQuat(wristPos, wristPos, wristQ);
    add(wristPos, wristPos, ELBOW_WRIST_OFFSET);
    transformQuat(wristPos, wristPos, elbowQ);
    add(wristPos, wristPos, elbowPos);
    let offset = clone(ARM_EXTENSION_OFFSET);
    scale(offset, offset, extensionRatio);
    add(this.position, this.wristPos, offset);
    transformQuat(this.position, this.position, this.rootQ);
    this.lastTime = this.time;
  }
  /**
   * Returns the position calculated by the model.
   */
  getPosition() {
    return this.position;
  }
  getHeadYawOrientation_() {
    let headEuler = create3();
    eulerFromQuaternion(headEuler, this.headQ, "YXZ");
    let destinationQ = fromEuler(create6(), 0, headEuler[1] * RAD_TO_DEG, 0);
    return destinationQ;
  }
  clamp_(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  quatAngle_(q1, q2) {
    let vec1 = [0, 0, -1];
    let vec2 = [0, 0, -1];
    transformQuat(vec1, vec1, q1);
    transformQuat(vec2, vec2, q2);
    return angle(vec1, vec2);
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices/GamepadXRInputSource.js
var PRIVATE19 = Symbol("@@webxr-polyfill/XRRemappedGamepad");
var PLACEHOLDER_BUTTON = { pressed: false, touched: false, value: 0 };
Object.freeze(PLACEHOLDER_BUTTON);
var XRRemappedGamepad = class {
  constructor(gamepad, display, map) {
    if (!map) {
      map = {};
    }
    if (map.userAgentOverrides) {
      for (let agent in map.userAgentOverrides) {
        if (navigator.userAgent.includes(agent)) {
          let override = map.userAgentOverrides[agent];
          for (let key in override) {
            if (key in map) {
              Object.assign(map[key], override[key]);
            } else {
              map[key] = override[key];
            }
          }
          break;
        }
      }
    }
    let axes = new Array(map.axes && map.axes.length ? map.axes.length : gamepad.axes.length);
    let buttons = new Array(map.buttons && map.buttons.length ? map.buttons.length : gamepad.buttons.length);
    let gripTransform = null;
    if (map.gripTransform) {
      let orientation = map.gripTransform.orientation || [0, 0, 0, 1];
      gripTransform = create2();
      fromRotationTranslation(
        gripTransform,
        normalize3(orientation, orientation),
        map.gripTransform.position || [0, 0, 0]
      );
    }
    let targetRayTransform = null;
    if (map.targetRayTransform) {
      let orientation = map.targetRayTransform.orientation || [0, 0, 0, 1];
      targetRayTransform = create2();
      fromRotationTranslation(
        targetRayTransform,
        normalize3(orientation, orientation),
        map.targetRayTransform.position || [0, 0, 0]
      );
    }
    let profiles = map.profiles;
    if (map.displayProfiles) {
      if (display.displayName in map.displayProfiles) {
        profiles = map.displayProfiles[display.displayName];
      }
    }
    this[PRIVATE19] = {
      gamepad,
      map,
      profiles: profiles || [gamepad.id],
      mapping: map.mapping || gamepad.mapping,
      axes,
      buttons,
      gripTransform,
      targetRayTransform
    };
    this._update();
  }
  _update() {
    let gamepad = this[PRIVATE19].gamepad;
    let map = this[PRIVATE19].map;
    let axes = this[PRIVATE19].axes;
    for (let i = 0; i < axes.length; ++i) {
      if (map.axes && i in map.axes) {
        if (map.axes[i] === null) {
          axes[i] = 0;
        } else {
          axes[i] = gamepad.axes[map.axes[i]];
        }
      } else {
        axes[i] = gamepad.axes[i];
      }
    }
    if (map.axes && map.axes.invert) {
      for (let axis of map.axes.invert) {
        if (axis < axes.length) {
          axes[axis] *= -1;
        }
      }
    }
    let buttons = this[PRIVATE19].buttons;
    for (let i = 0; i < buttons.length; ++i) {
      if (map.buttons && i in map.buttons) {
        if (map.buttons[i] === null) {
          buttons[i] = PLACEHOLDER_BUTTON;
        } else {
          buttons[i] = gamepad.buttons[map.buttons[i]];
        }
      } else {
        buttons[i] = gamepad.buttons[i];
      }
    }
  }
  get id() {
    return "";
  }
  get _profiles() {
    return this[PRIVATE19].profiles;
  }
  get index() {
    return -1;
  }
  get connected() {
    return this[PRIVATE19].gamepad.connected;
  }
  get timestamp() {
    return this[PRIVATE19].gamepad.timestamp;
  }
  get mapping() {
    return this[PRIVATE19].mapping;
  }
  get axes() {
    return this[PRIVATE19].axes;
  }
  get buttons() {
    return this[PRIVATE19].buttons;
  }
  // Non-standard extension
  get hapticActuators() {
    return this[PRIVATE19].gamepad.hapticActuators;
  }
};
var GamepadXRInputSource = class {
  constructor(polyfill, display, primaryButtonIndex = 0, primarySqueezeButtonIndex = -1) {
    this.polyfill = polyfill;
    this.display = display;
    this.nativeGamepad = null;
    this.gamepad = null;
    this.inputSource = new XRInputSource(this);
    this.lastPosition = create3();
    this.emulatedPosition = false;
    this.basePoseMatrix = create2();
    this.outputMatrix = create2();
    this.primaryButtonIndex = primaryButtonIndex;
    this.primaryActionPressed = false;
    this.primarySqueezeButtonIndex = primarySqueezeButtonIndex;
    this.primarySqueezeActionPressed = false;
    this.handedness = "";
    this.targetRayMode = "gaze";
    this.armModel = null;
  }
  get profiles() {
    return this.gamepad ? this.gamepad._profiles : [];
  }
  updateFromGamepad(gamepad) {
    if (this.nativeGamepad !== gamepad) {
      this.nativeGamepad = gamepad;
      if (gamepad) {
        this.gamepad = new XRRemappedGamepad(gamepad, this.display, GamepadMappings_default[gamepad.id]);
      } else {
        this.gamepad = null;
      }
    }
    this.handedness = gamepad.hand === "" ? "none" : gamepad.hand;
    if (this.gamepad) {
      this.gamepad._update();
    }
    if (gamepad.pose) {
      this.targetRayMode = "tracked-pointer";
      this.emulatedPosition = !gamepad.pose.hasPosition;
    } else if (gamepad.hand === "") {
      this.targetRayMode = "gaze";
      this.emulatedPosition = false;
    }
  }
  updateBasePoseMatrix() {
    if (this.nativeGamepad && this.nativeGamepad.pose) {
      let pose = this.nativeGamepad.pose;
      let position = pose.position;
      let orientation = pose.orientation;
      if (!position && !orientation) {
        return;
      }
      if (!position) {
        if (!pose.hasPosition) {
          if (!this.armModel) {
            this.armModel = new OrientationArmModel();
          }
          this.armModel.setHandedness(this.nativeGamepad.hand);
          this.armModel.update(orientation, this.polyfill.getBasePoseMatrix());
          position = this.armModel.getPosition();
        } else {
          position = this.lastPosition;
        }
      } else {
        this.lastPosition[0] = position[0];
        this.lastPosition[1] = position[1];
        this.lastPosition[2] = position[2];
      }
      fromRotationTranslation(this.basePoseMatrix, orientation, position);
    } else {
      copy(this.basePoseMatrix, this.polyfill.getBasePoseMatrix());
    }
    return this.basePoseMatrix;
  }
  /**
   * @param {XRReferenceSpace} coordinateSystem
   * @param {string} poseType
   * @return {XRPose?}
   */
  getXRPose(coordinateSystem, poseType) {
    this.updateBasePoseMatrix();
    switch (poseType) {
      case "target-ray":
        coordinateSystem._transformBasePoseMatrix(this.outputMatrix, this.basePoseMatrix);
        if (this.gamepad && this.gamepad[PRIVATE19].targetRayTransform) {
          multiply(this.outputMatrix, this.outputMatrix, this.gamepad[PRIVATE19].targetRayTransform);
        }
        break;
      case "grip":
        if (!this.nativeGamepad || !this.nativeGamepad.pose) {
          return null;
        }
        coordinateSystem._transformBasePoseMatrix(this.outputMatrix, this.basePoseMatrix);
        if (this.gamepad && this.gamepad[PRIVATE19].gripTransform) {
          multiply(this.outputMatrix, this.outputMatrix, this.gamepad[PRIVATE19].gripTransform);
        }
        break;
      default:
        return null;
    }
    coordinateSystem._adjustForOriginOffset(this.outputMatrix);
    return new XRPose(new XRRigidTransform(this.outputMatrix), this.emulatedPosition);
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices/WebVRDevice.js
var PRIVATE20 = Symbol("@@webxr-polyfill/WebVRDevice");
var TEST_ENV = false;
var EXTRA_PRESENTATION_ATTRIBUTES = {
  // Non-standard attribute to enable running at the native device refresh rate
  // on the Oculus Go.
  highRefreshRate: true
};
var PRIMARY_BUTTON_MAP = {
  oculus: 1,
  openvr: 1,
  "spatial controller (spatial interaction source)": 1
};
var SESSION_ID = 0;
var Session = class {
  constructor(mode, enabledFeatures, polyfillOptions = {}) {
    this.mode = mode;
    this.enabledFeatures = enabledFeatures;
    this.outputContext = null;
    this.immersive = mode == "immersive-vr" || mode == "immersive-ar";
    this.ended = null;
    this.baseLayer = null;
    this.id = ++SESSION_ID;
    this.modifiedCanvasLayer = false;
    if (this.outputContext && !TEST_ENV) {
      const renderContextType = polyfillOptions.renderContextType || "2d";
      this.renderContext = this.outputContext.canvas.getContext(renderContextType);
    }
  }
};
var WebVRDevice = class extends XRDevice {
  /**
   * Takes a VRDisplay instance and a VRFrameData
   * constructor from the WebVR 1.1 spec.
   *
   * @param {VRDisplay} display
   * @param {VRFrameData} VRFrameData
   */
  constructor(global2, display) {
    const { canPresent } = display.capabilities;
    super(global2);
    this.display = display;
    this.frame = new global2.VRFrameData();
    this.sessions = /* @__PURE__ */ new Map();
    this.immersiveSession = null;
    this.canPresent = canPresent;
    this.baseModelMatrix = create2();
    this.gamepadInputSources = {};
    this.tempVec3 = new Float32Array(3);
    this.onVRDisplayPresentChange = this.onVRDisplayPresentChange.bind(this);
    global2.window.addEventListener("vrdisplaypresentchange", this.onVRDisplayPresentChange);
    this.CAN_USE_GAMEPAD = global2.navigator && "getGamepads" in global2.navigator;
    this.HAS_BITMAP_SUPPORT = isImageBitmapSupported(global2);
  }
  /**
   * @return {number}
   */
  get depthNear() {
    return this.display.depthNear;
  }
  /**
   * @param {number}
   */
  set depthNear(val) {
    this.display.depthNear = val;
  }
  /**
   * @return {number}
   */
  get depthFar() {
    return this.display.depthFar;
  }
  /**
   * @param {number}
   */
  set depthFar(val) {
    this.display.depthFar = val;
  }
  /**
   * Called when a XRSession has a `baseLayer` property set.
   *
   * @param {number} sessionId
   * @param {XRWebGLLayer} layer
   */
  onBaseLayerSet(sessionId, layer) {
    const session = this.sessions.get(sessionId);
    const canvas = layer.context.canvas;
    if (session.immersive) {
      const left = this.display.getEyeParameters("left");
      const right = this.display.getEyeParameters("right");
      canvas.width = Math.max(left.renderWidth, right.renderWidth) * 2;
      canvas.height = Math.max(left.renderHeight, right.renderHeight);
      this.display.requestPresent([{
        source: canvas,
        attributes: EXTRA_PRESENTATION_ATTRIBUTES
      }]).then(() => {
        if (!TEST_ENV && !this.global.document.body.contains(canvas)) {
          session.modifiedCanvasLayer = true;
          this.global.document.body.appendChild(canvas);
          applyCanvasStylesForMinimalRendering(canvas);
        }
        session.baseLayer = layer;
      });
    } else {
      session.baseLayer = layer;
    }
  }
  /**
   * If a 1.1 VRDisplay cannot present, it could be a 6DOF device
   * that doesn't have its own way to present, but used in magic
   * window mode. So in WebXR lingo, this cannot support an
   * "immersive" session.
   *
   * @param {XRSessionMode} mode
   * @return {boolean}
   */
  isSessionSupported(mode) {
    if (mode == "immersive-ar") {
      return false;
    }
    if (mode == "immersive-vr" && this.canPresent === false) {
      return false;
    }
    return true;
  }
  /**
   * @param {string} featureDescriptor
   * @return {boolean}
   */
  isFeatureSupported(featureDescriptor) {
    switch (featureDescriptor) {
      case "viewer":
        return true;
      case "local":
        return true;
      case "local-floor":
        return true;
      case "bounded":
        return false;
      case "unbounded":
        return false;
      default:
        return false;
    }
  }
  /**
   * Returns a promise of a session ID if creating a session is successful.
   * Usually used to set up presentation in the device.
   * We can't start presenting in a 1.1 device until we have a canvas
   * layer, so use a dummy layer until `onBaseLayerSet` is called.
   * May reject if session is not supported, or if an error is thrown
   * when calling `requestPresent`.
   *
   * @param {XRSessionMode} mode
   * @param {Set<string>} enabledFeatures
   * @return {Promise<number>}
   */
  async requestSession(mode, enabledFeatures) {
    if (!this.isSessionSupported(mode)) {
      return Promise.reject();
    }
    let immersive = mode == "immersive-vr";
    if (immersive) {
      const canvas = this.global.document.createElement("canvas");
      if (!TEST_ENV) {
        const ctx = canvas.getContext("webgl");
      }
      await this.display.requestPresent([{
        source: canvas,
        attributes: EXTRA_PRESENTATION_ATTRIBUTES
      }]);
    }
    const session = new Session(mode, enabledFeatures, {
      renderContextType: this.HAS_BITMAP_SUPPORT ? "bitmaprenderer" : "2d"
    });
    this.sessions.set(session.id, session);
    if (immersive) {
      this.immersiveSession = session;
      this.dispatchEvent("@@webxr-polyfill/vr-present-start", session.id);
    }
    return Promise.resolve(session.id);
  }
  /**
   * @return {Function}
   */
  requestAnimationFrame(callback) {
    return this.display.requestAnimationFrame(callback);
  }
  getPrimaryButtonIndex(gamepad) {
    let primaryButton = 0;
    let name = gamepad.id.toLowerCase();
    for (let key in PRIMARY_BUTTON_MAP) {
      if (name.includes(key)) {
        primaryButton = PRIMARY_BUTTON_MAP[key];
        break;
      }
    }
    return Math.min(primaryButton, gamepad.buttons.length - 1);
  }
  onFrameStart(sessionId, renderState) {
    this.display.depthNear = renderState.depthNear;
    this.display.depthFar = renderState.depthFar;
    this.display.getFrameData(this.frame);
    const session = this.sessions.get(sessionId);
    if (session.immersive && this.CAN_USE_GAMEPAD) {
      let prevInputSources = this.gamepadInputSources;
      this.gamepadInputSources = {};
      let gamepads = this.global.navigator.getGamepads();
      for (let i = 0; i < gamepads.length; ++i) {
        let gamepad = gamepads[i];
        if (gamepad && gamepad.displayId > 0) {
          let inputSourceImpl = prevInputSources[i];
          if (!inputSourceImpl) {
            inputSourceImpl = new GamepadXRInputSource(this, this.display, this.getPrimaryButtonIndex(gamepad));
          }
          inputSourceImpl.updateFromGamepad(gamepad);
          this.gamepadInputSources[i] = inputSourceImpl;
          if (inputSourceImpl.primaryButtonIndex != -1) {
            let primaryActionPressed = gamepad.buttons[inputSourceImpl.primaryButtonIndex].pressed;
            if (primaryActionPressed && !inputSourceImpl.primaryActionPressed) {
              this.dispatchEvent("@@webxr-polyfill/input-select-start", { sessionId: session.id, inputSource: inputSourceImpl.inputSource });
            } else if (!primaryActionPressed && inputSourceImpl.primaryActionPressed) {
              this.dispatchEvent("@@webxr-polyfill/input-select-end", { sessionId: session.id, inputSource: inputSourceImpl.inputSource });
            }
            inputSourceImpl.primaryActionPressed = primaryActionPressed;
          }
          if (inputSourceImpl.primarySqueezeButtonIndex != -1) {
            let primarySqueezeActionPressed = gamepad.buttons[inputSourceImpl.primarySqueezeButtonIndex].pressed;
            if (primarySqueezeActionPressed && !inputSourceImpl.primarySqueezeActionPressed) {
              this.dispatchEvent("@@webxr-polyfill/input-squeeze-start", { sessionId: session.id, inputSource: inputSourceImpl.inputSource });
            } else if (!primarySqueezeActionPressed && inputSourceImpl.primarySqueezeActionPressed) {
              this.dispatchEvent("@@webxr-polyfill/input-squeeze-end", { sessionId: session.id, inputSource: inputSourceImpl.inputSource });
            }
            inputSourceImpl.primarySqueezeActionPressed = primarySqueezeActionPressed;
          }
        }
      }
    }
    if (TEST_ENV) {
      return;
    }
    if (!session.immersive && session.baseLayer) {
      const canvas = session.baseLayer.context.canvas;
      perspective(
        this.frame.leftProjectionMatrix,
        renderState.inlineVerticalFieldOfView,
        canvas.width / canvas.height,
        renderState.depthNear,
        renderState.depthFar
      );
    }
  }
  onFrameEnd(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session.ended || !session.baseLayer) {
      return;
    }
    if (session.outputContext && !(session.immersive && !this.display.capabilities.hasExternalDisplay)) {
      const mirroring = session.immersive && this.display.capabilities.hasExternalDisplay;
      const iCanvas = session.baseLayer.context.canvas;
      const iWidth = mirroring ? iCanvas.width / 2 : iCanvas.width;
      const iHeight = iCanvas.height;
      if (!TEST_ENV) {
        const oCanvas = session.outputContext.canvas;
        const oWidth = oCanvas.width;
        const oHeight = oCanvas.height;
        const renderContext = session.renderContext;
        if (this.HAS_BITMAP_SUPPORT) {
          if (iCanvas.transferToImageBitmap) {
            renderContext.transferFromImageBitmap(iCanvas.transferToImageBitmap());
          } else {
            this.global.createImageBitmap(iCanvas, 0, 0, iWidth, iHeight, {
              resizeWidth: oWidth,
              resizeHeight: oHeight
            }).then((bitmap) => renderContext.transferFromImageBitmap(bitmap));
          }
        } else {
          renderContext.drawImage(
            iCanvas,
            0,
            0,
            iWidth,
            iHeight,
            0,
            0,
            oWidth,
            oHeight
          );
        }
      }
    }
    if (session.immersive && session.baseLayer) {
      this.display.submitFrame();
    }
  }
  /**
   * @param {number} handle
   */
  cancelAnimationFrame(handle) {
    this.display.cancelAnimationFrame(handle);
  }
  /**
   * @TODO Spec
   */
  async endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session.ended) {
      return;
    }
    if (session.immersive) {
      return this.display.exitPresent();
    } else {
      session.ended = true;
    }
  }
  /**
   * @param {number} sessionId
   * @param {XRReferenceSpaceType} type
   * @return {boolean}
   */
  doesSessionSupportReferenceSpace(sessionId, type2) {
    const session = this.sessions.get(sessionId);
    if (session.ended) {
      return false;
    }
    return session.enabledFeatures.has(type2);
  }
  /**
   * If the VRDisplay has stage parameters, convert them
   * to an array of X, Z pairings.
   *
   * @return {Object?}
   */
  requestStageBounds() {
    if (this.display.stageParameters) {
      const width = this.display.stageParameters.sizeX;
      const depth = this.display.stageParameters.sizeZ;
      const data = [];
      data.push(-width / 2);
      data.push(-depth / 2);
      data.push(width / 2);
      data.push(-depth / 2);
      data.push(width / 2);
      data.push(depth / 2);
      data.push(-width / 2);
      data.push(depth / 2);
      return data;
    }
    return null;
  }
  /**
   * Returns a promise resolving to a transform if XRDevice
   * can support frame of reference and provides its own values.
   * Can resolve to `undefined` if the polyfilled API can provide
   * a default. Rejects if this XRDevice cannot
   * support the frame of reference.
   *
   * @param {XRFrameOfReferenceType} type
   * @param {XRFrameOfReferenceOptions} options
   * @return {Promise<float32rray>}
   */
  async requestFrameOfReferenceTransform(type2, options) {
    if ((type2 === "local-floor" || type2 === "bounded-floor") && this.display.stageParameters && this.display.stageParameters.sittingToStandingTransform) {
      return this.display.stageParameters.sittingToStandingTransform;
    }
    return null;
  }
  /**
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getProjectionMatrix(eye) {
    if (eye === "left") {
      return this.frame.leftProjectionMatrix;
    } else if (eye === "right") {
      return this.frame.rightProjectionMatrix;
    } else if (eye === "none") {
      return this.frame.leftProjectionMatrix;
    } else {
      throw new Error(`eye must be of type 'left' or 'right'`);
    }
  }
  /**
   * Takes a XREye and a target to apply properties of
   * `x`, `y`, `width` and `height` on. Returns a boolean
   * indicating if it successfully was able to populate
   * target's values.
   *
   * @param {number} sessionId
   * @param {XREye} eye
   * @param {XRWebGLLayer} layer
   * @param {Object?} target
   * @return {boolean}
   */
  getViewport(sessionId, eye, layer, target) {
    const session = this.sessions.get(sessionId);
    const { width, height } = layer.context.canvas;
    if (!session.immersive) {
      target.x = target.y = 0;
      target.width = width;
      target.height = height;
      return true;
    }
    if (eye === "left" || eye === "none") {
      target.x = 0;
    } else if (eye === "right") {
      target.x = width / 2;
    } else {
      return false;
    }
    target.y = 0;
    target.width = width / 2;
    target.height = height;
    return true;
  }
  /**
   * Get model matrix unaffected by frame of reference.
   *
   * @return {Float32Array}
   */
  getBasePoseMatrix() {
    let { position, orientation } = this.frame.pose;
    if (!position && !orientation) {
      return this.baseModelMatrix;
    }
    if (!position) {
      position = this.tempVec3;
      position[0] = position[1] = position[2] = 0;
    }
    fromRotationTranslation(this.baseModelMatrix, orientation, position);
    return this.baseModelMatrix;
  }
  /**
   * Get view matrix unaffected by frame of reference.
   *
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getBaseViewMatrix(eye) {
    if (eye === "left" || eye === "none") {
      return this.frame.leftViewMatrix;
    } else if (eye === "right") {
      return this.frame.rightViewMatrix;
    } else {
      throw new Error(`eye must be of type 'left' or 'right'`);
    }
  }
  getInputSources() {
    let inputSources = [];
    for (let i in this.gamepadInputSources) {
      inputSources.push(this.gamepadInputSources[i].inputSource);
    }
    return inputSources;
  }
  getInputPose(inputSource, coordinateSystem, poseType) {
    if (!coordinateSystem) {
      return null;
    }
    for (let i in this.gamepadInputSources) {
      let inputSourceImpl = this.gamepadInputSources[i];
      if (inputSourceImpl.inputSource === inputSource) {
        return inputSourceImpl.getXRPose(coordinateSystem, poseType);
      }
    }
    return null;
  }
  /**
   * Triggered on window resize.
   *
   */
  onWindowResize() {
  }
  /**
   * Listens to the Native 1.1 `window.addEventListener('vrdisplaypresentchange')`
   * event.
   *
   * @param {Event} event
   */
  onVRDisplayPresentChange(e) {
    if (!this.display.isPresenting) {
      this.sessions.forEach((session) => {
        if (session.immersive && !session.ended) {
          if (session.modifiedCanvasLayer) {
            const canvas = session.baseLayer.context.canvas;
            document.body.removeChild(canvas);
            canvas.setAttribute("style", "");
          }
          if (this.immersiveSession === session) {
            this.immersiveSession = null;
          }
          this.dispatchEvent("@@webxr-polyfill/vr-present-end", session.id);
        }
      });
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices/CardboardXRDevice.js
var CardboardXRDevice = class extends WebVRDevice {
  /**
   * Takes a VRDisplay instance and a VRFrameData
   * constructor from the WebVR 1.1 spec.
   *
   * @param {VRDisplay} display
   * @param {Object?} cardboardConfig
   */
  constructor(global2, cardboardConfig) {
    const display = new import_cardboard_vr_display.default(cardboardConfig || {});
    super(global2, display);
    this.display = display;
    this.frame = {
      rightViewMatrix: new Float32Array(16),
      leftViewMatrix: new Float32Array(16),
      rightProjectionMatrix: new Float32Array(16),
      leftProjectionMatrix: new Float32Array(16),
      pose: null,
      timestamp: null
    };
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices/InlineDevice.js
var TEST_ENV2 = false;
var SESSION_ID2 = 0;
var Session2 = class {
  constructor(mode, enabledFeatures) {
    this.mode = mode;
    this.enabledFeatures = enabledFeatures;
    this.ended = null;
    this.baseLayer = null;
    this.id = ++SESSION_ID2;
  }
};
var InlineDevice = class extends XRDevice {
  /**
   * Constructs an inline-only XRDevice
   */
  constructor(global2) {
    super(global2);
    this.sessions = /* @__PURE__ */ new Map();
    this.projectionMatrix = create2();
    this.identityMatrix = create2();
  }
  /**
   * Called when a XRSession has a `baseLayer` property set.
   *
   * @param {number} sessionId
   * @param {XRWebGLLayer} layer
   */
  onBaseLayerSet(sessionId, layer) {
    const session = this.sessions.get(sessionId);
    session.baseLayer = layer;
  }
  /**
   * Returns true if the requested mode is inline
   *
   * @param {XRSessionMode} mode
   * @return {boolean}
   */
  isSessionSupported(mode) {
    return mode == "inline";
  }
  /**
   * @param {string} featureDescriptor
   * @return {boolean}
   */
  isFeatureSupported(featureDescriptor) {
    switch (featureDescriptor) {
      case "viewer":
        return true;
      default:
        return false;
    }
  }
  /**
   * Returns a promise of a session ID if creating a session is successful.
   *
   * @param {XRSessionMode} mode
   * @param {Set<string>} enabledFeatures
   * @return {Promise<number>}
   */
  async requestSession(mode, enabledFeatures) {
    if (!this.isSessionSupported(mode)) {
      return Promise.reject();
    }
    const session = new Session2(mode, enabledFeatures);
    this.sessions.set(session.id, session);
    return Promise.resolve(session.id);
  }
  /**
   * @return {Function}
   */
  requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
  }
  /**
   * @param {number} handle
   */
  cancelAnimationFrame(handle) {
    window.cancelAnimationFrame(handle);
  }
  onFrameStart(sessionId, renderState) {
    if (TEST_ENV2) {
      return;
    }
    const session = this.sessions.get(sessionId);
    if (session.baseLayer) {
      const canvas = session.baseLayer.context.canvas;
      perspective(
        this.projectionMatrix,
        renderState.inlineVerticalFieldOfView,
        canvas.width / canvas.height,
        renderState.depthNear,
        renderState.depthFar
      );
    }
  }
  onFrameEnd(sessionId) {
  }
  /**
   * @TODO Spec
   */
  async endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    session.ended = true;
  }
  /**
   * @param {number} sessionId
   * @param {XRReferenceSpaceType} type
   * @return {boolean}
   */
  doesSessionSupportReferenceSpace(sessionId, type2) {
    const session = this.sessions.get(sessionId);
    if (session.ended) {
      return false;
    }
    return session.enabledFeatures.has(type2);
  }
  /**
   * Inline sessions don't have stage bounds
   *
   * @return {Object?}
   */
  requestStageBounds() {
    return null;
  }
  /**
   * Inline sessions don't have multiple frames of reference
   *
   * @param {XRFrameOfReferenceType} type
   * @param {XRFrameOfReferenceOptions} options
   * @return {Promise<Float32Array>}
   */
  async requestFrameOfReferenceTransform(type2, options) {
    return null;
  }
  /**
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getProjectionMatrix(eye) {
    return this.projectionMatrix;
  }
  /**
   * Takes a XREye and a target to apply properties of
   * `x`, `y`, `width` and `height` on. Returns a boolean
   * indicating if it successfully was able to populate
   * target's values.
   *
   * @param {number} sessionId
   * @param {XREye} eye
   * @param {XRWebGLLayer} layer
   * @param {Object?} target
   * @return {boolean}
   */
  getViewport(sessionId, eye, layer, target) {
    const session = this.sessions.get(sessionId);
    const { width, height } = layer.context.canvas;
    target.x = target.y = 0;
    target.width = width;
    target.height = height;
    return true;
  }
  /**
   * Get model matrix unaffected by frame of reference.
   *
   * @return {Float32Array}
   */
  getBasePoseMatrix() {
    return this.identityMatrix;
  }
  /**
   * Get view matrix unaffected by frame of reference.
   *
   * @param {XREye} eye
   * @return {Float32Array}
   */
  getBaseViewMatrix(eye) {
    return this.identityMatrix;
  }
  /**
   * No persistent input sources for the inline session
   */
  getInputSources() {
    return [];
  }
  getInputPose(inputSource, coordinateSystem, poseType) {
    return null;
  }
  /**
   * Triggered on window resize.
   */
  onWindowResize() {
  }
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/devices.js
var getWebVRDevice = async function(global2) {
  let device = null;
  if ("getVRDisplays" in global2.navigator) {
    try {
      const displays = await global2.navigator.getVRDisplays();
      if (displays && displays.length) {
        device = new WebVRDevice(global2, displays[0]);
      }
    } catch (e) {
    }
  }
  return device;
};
var requestXRDevice = async function(global2, config) {
  if (config.webvr) {
    let xr = await getWebVRDevice(global2);
    if (xr) {
      return xr;
    }
  }
  let mobile = isMobile2(global2);
  if (mobile && config.cardboard || !mobile && config.allowCardboardOnDesktop) {
    if (!global2.VRFrameData) {
      global2.VRFrameData = function() {
        this.rightViewMatrix = new Float32Array(16);
        this.leftViewMatrix = new Float32Array(16);
        this.rightProjectionMatrix = new Float32Array(16);
        this.leftProjectionMatrix = new Float32Array(16);
        this.pose = null;
      };
    }
    return new CardboardXRDevice(global2, config.cardboardConfig);
  }
  return new InlineDevice(global2);
};

// ../Juniper/src/Juniper.TypeScript/node_modules/webxr-polyfill/src/WebXRPolyfill.js
var CONFIG_DEFAULTS = {
  // The default global to use for needed APIs.
  global: global_default,
  // Whether support for a browser implementing WebVR 1.1 is enabled.
  // If enabled, XR support is powered by native WebVR 1.1 VRDisplays,
  // exposed as XRDevices.
  webvr: true,
  // Whether a CardboardXRDevice should be discoverable if on
  // a mobile device, and no other native (1.1 VRDisplay if `webvr` on,
  // or XRDevice) found.
  cardboard: true,
  // The configuration to be used for CardboardVRDisplay when used.
  // Has no effect if `cardboard: false` or another XRDevice is used.
  // Configuration can be found: https://github.com/immersive-web/cardboard-vr-display/blob/master/src/options.js
  cardboardConfig: null,
  // Whether a CardboardXRDevice should be created if no WebXR API found
  // on desktop or not. Stereoscopic rendering with a gyro often does not make sense on desktop, and probably only useful for debugging.
  allowCardboardOnDesktop: false
};
var partials = ["navigator", "HTMLCanvasElement", "WebGLRenderingContext"];
var WebXRPolyfill = class {
  /**
   * @param {object?} config
   */
  constructor(config = {}) {
    this.config = Object.freeze(Object.assign({}, CONFIG_DEFAULTS, config));
    this.global = this.config.global;
    this.nativeWebXR = "xr" in this.global.navigator;
    this.injected = false;
    if (!this.nativeWebXR) {
      this._injectPolyfill(this.global);
    } else {
      this._injectCompatibilityShims(this.global);
    }
  }
  _injectPolyfill(global2) {
    if (!partials.every((iface) => !!global2[iface])) {
      throw new Error(`Global must have the following attributes : ${partials}`);
    }
    for (const className2 of Object.keys(api_default)) {
      if (global2[className2] !== void 0) {
        console.warn(`${className2} already defined on global.`);
      } else {
        global2[className2] = api_default[className2];
      }
    }
    if (true) {
      const polyfilledCtx = polyfillMakeXRCompatible(global2.WebGLRenderingContext);
      if (polyfilledCtx) {
        polyfillGetContext(global2.HTMLCanvasElement);
        if (global2.OffscreenCanvas) {
          polyfillGetContext(global2.OffscreenCanvas);
        }
        if (global2.WebGL2RenderingContext) {
          polyfillMakeXRCompatible(global2.WebGL2RenderingContext);
        }
        if (!window.isSecureContext) {
          console.warn(`WebXR Polyfill Warning:
This page is not running in a secure context (https:// or localhost)!
This means that although the page may be able to use the WebXR Polyfill it will
not be able to use native WebXR implementations, and as such will not be able to
access dedicated VR or AR hardware, and will not be able to take advantage of
any performance improvements a native WebXR implementation may offer. Please
host this content on a secure origin for the best user experience.
`);
        }
      }
    }
    this.injected = true;
    this._patchNavigatorXR();
  }
  _patchNavigatorXR() {
    let devicePromise = requestXRDevice(this.global, this.config);
    this.xr = new api_default.XRSystem(devicePromise);
    Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: true
    });
  }
  _injectCompatibilityShims(global2) {
    if (!partials.every((iface) => !!global2[iface])) {
      throw new Error(`Global must have the following attributes : ${partials}`);
    }
    if (global2.navigator.xr && "supportsSession" in global2.navigator.xr && !("isSessionSupported" in global2.navigator.xr)) {
      let originalSupportsSession = global2.navigator.xr.supportsSession;
      global2.navigator.xr.isSessionSupported = function(mode) {
        return originalSupportsSession.call(this, mode).then(() => {
          return true;
        }).catch(() => {
          return false;
        });
      };
      global2.navigator.xr.supportsSession = function(mode) {
        console.warn("navigator.xr.supportsSession() is deprecated. Please call navigator.xr.isSessionSupported() instead and check the boolean value returned when the promise resolves.");
        return originalSupportsSession.call(this, mode);
      };
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/ScreenControl.ts
if (!navigator.xr) {
  console.info("Polyfilling WebXR API");
  new WebXRPolyfill();
}
var XRSessionToggleEvent = class extends TypedEvent {
  constructor(type2, mode, session, referenceSpaceType, sessionMode) {
    super(type2);
    this.mode = mode;
    this.session = session;
    this.referenceSpaceType = referenceSpaceType;
    this.sessionMode = sessionMode;
  }
};
var XRSessionStartedEvent = class extends XRSessionToggleEvent {
  constructor(mode, session, referenceSpaceType, sessionMode) {
    super("sessionstarted", mode, session, referenceSpaceType, sessionMode);
  }
};
var XRSessionStoppedEvent = class extends XRSessionToggleEvent {
  constructor(mode, session, referenceSpaceType, sessionMode) {
    super("sessionstopped", mode, session, referenceSpaceType, sessionMode);
  }
};
var xrModes = /* @__PURE__ */ new Map([
  ["VR" /* VR */, {
    referenceSpaceType: "local-floor",
    sessionMode: "immersive-vr"
  }],
  ["AR" /* AR */, {
    referenceSpaceType: "local-floor",
    sessionMode: "immersive-ar"
  }]
]);
var ScreenControl = class extends TypedEventBase {
  constructor(renderer, camera, fullscreenElement, enableFullResolution) {
    super();
    this.renderer = renderer;
    this.camera = camera;
    this.fullscreenElement = fullscreenElement;
    this.enableFullResolution = enableFullResolution;
    this._currentMode = "None" /* None */;
    this.buttons = /* @__PURE__ */ new Map();
    this.currentSession = null;
    this.screenUI = null;
    this.wasVisible = /* @__PURE__ */ new Map();
    this.lastFOV = 50;
    this.addEventListener("sessionstarted", (evt) => {
      if (evt.sessionMode === "inline") {
        this.lastFOV = this.camera.fov;
        this.camera.fov = rad2deg(evt.session.renderState.inlineVerticalFieldOfView);
      }
    });
    this.addEventListener("sessionstopped", (evt) => {
      if (evt.sessionMode === "inline") {
        this.camera.fov = this.lastFOV;
      }
    });
    this.renderer.xr.addEventListener("sessionstart", () => this.onSessionStarted());
    this.renderer.xr.addEventListener("sessionend", () => this.onSessionEnded());
    this.refresh();
  }
  setUI(screenUI, fullscreenButton, vrButton, arButton) {
    this.screenUI = screenUI;
    this.buttons.set(fullscreenButton.mode, fullscreenButton);
    this.buttons.set(vrButton.mode, vrButton);
    this.buttons.set(arButton.mode, arButton);
    for (const button of this.buttons.values()) {
      this.wasVisible.set(button, button.visible);
      button.addEventListener("click", this.toggleMode.bind(this, button.mode));
    }
    fullscreenButton.available = !isMobileVR() && hasFullscreenAPI();
    vrButton.available = hasVR();
    arButton.available = hasWebXR();
    this.refresh();
  }
  get visible() {
    return elementIsDisplayed(this.renderer.domElement);
  }
  set visible(v) {
    elementSetDisplay(this.renderer.domElement, v);
    if (this.screenUI) {
      if (v) {
        this.screenUI.show();
      } else {
        this.screenUI.hide();
      }
    }
  }
  get currentMode() {
    return this._currentMode;
  }
  resize() {
    if (!this.renderer.xr.isPresenting) {
      const {
        clientWidth,
        clientHeight,
        width,
        height
      } = this.renderer.domElement;
      const nextWidth = Math.floor(clientWidth * devicePixelRatio);
      const nextHeight = Math.floor(clientHeight * devicePixelRatio);
      if (clientWidth > 0 && clientHeight > 0 && (width !== nextWidth || height !== nextHeight)) {
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(clientWidth, clientHeight, false);
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
      }
    }
  }
  getMetrics() {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;
    const pixelRatio = this.renderer.getPixelRatio();
    const fov = this.camera.fov;
    return { width, height, pixelRatio, fov };
  }
  setMetrics(width, height, pixelRatio, fov) {
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }
  async refresh() {
    const toCheck = Array.from(this.buttons.values()).filter((btn) => btn.available && btn.mode !== "Fullscreen" /* Fullscreen */);
    await Promise.all(
      toCheck.map(async (btn) => {
        const xrMode = xrModes.get(btn.mode);
        btn.available = isDefined(xrMode);
        if (btn.available) {
          const typeSupported = navigator.xr && await navigator.xr.isSessionSupported(xrMode.sessionMode);
          const webVROverride = !hasWebXR() && hasWebVR() && xrMode.sessionMode === "immersive-vr" && xrMode.referenceSpaceType === "local-floor";
          btn.available = typeSupported || webVROverride;
        }
      })
    );
  }
  async toggleMode(mode) {
    if (mode === "Fullscreen" /* Fullscreen */) {
      await this.toggleFullscreen();
    } else if (mode !== "None" /* None */) {
      await this.toggleXR(mode);
    }
  }
  async start(mode) {
    if (mode !== this.currentMode) {
      await this.toggleMode(this.currentMode);
      await this.toggleMode(mode);
    }
  }
  async stop() {
    await this.toggleMode(this.currentMode);
  }
  get isFullscreen() {
    return document.fullscreen;
  }
  async startFullscreen() {
    if (!this.isFullscreen) {
      await this.fullscreenElement.requestFullscreen({
        navigationUI: "show"
      });
      this.setActive("Fullscreen" /* Fullscreen */);
      this.dispatchEvent(new XRSessionStartedEvent("Fullscreen" /* Fullscreen */, null, null, null));
    }
  }
  async stopFullscreen() {
    if (this.isFullscreen) {
      await document.exitFullscreen();
      this.setActive("None" /* None */);
      this.dispatchEvent(new XRSessionStoppedEvent("Fullscreen" /* Fullscreen */, null, null, null));
    }
  }
  async toggleFullscreen() {
    if (this.isFullscreen) {
      await this.stopFullscreen();
    } else {
      await this.startFullscreen();
    }
  }
  async toggleXR(mode) {
    const xrMode = xrModes.get(mode);
    if (isDefined(xrMode)) {
      if (this.currentSession) {
        this.currentSession.end();
      } else if (navigator.xr) {
        this.camera.position.setScalar(0);
        this.camera.quaternion.identity();
        try {
          const session = await navigator.xr.requestSession(xrMode.sessionMode, {
            optionalFeatures: [
              "local-floor",
              "bounded-floor",
              "high-refresh-rate",
              "hand-tracking",
              "layers"
            ]
          });
          this.setActive(mode);
          this.currentSession = session;
          this.renderer.xr.setReferenceSpaceType(xrMode.referenceSpaceType);
          if (this.enableFullResolution && "XRWebGLLayer" in window && "getNativeFramebufferScaleFactor" in XRWebGLLayer) {
            const size = XRWebGLLayer.getNativeFramebufferScaleFactor(session);
            this.renderer.xr.setFramebufferScaleFactor(size);
          }
          this.renderer.xr.setSession(session);
        } catch (exp) {
          console.error(`Couldn't start session type '${xrMode.sessionMode}'. Reason: ${exp && exp.message || exp || "UNKNOWN"}`);
        }
      }
    }
  }
  onSessionStarted() {
    const mode = this.currentMode;
    const xrMode = xrModes.get(this.currentMode);
    const session = this.currentSession;
    if (session.supportedFrameRates) {
      const max = Math.max(...session.supportedFrameRates);
      console.log("Changing framerate to", max);
      session.updateTargetFrameRate(max);
    }
    this.dispatchEvent(new XRSessionStartedEvent(
      mode,
      session,
      xrMode.referenceSpaceType,
      xrMode.sessionMode
    ));
  }
  onSessionEnded() {
    const mode = this.currentMode;
    const xrMode = xrModes.get(this.currentMode);
    const session = this.currentSession;
    this.currentSession = null;
    this.renderer.xr.setSession(null);
    this.setActive("None" /* None */);
    this.dispatchEvent(new XRSessionStoppedEvent(
      mode,
      session,
      xrMode.referenceSpaceType,
      xrMode.sessionMode
    ));
  }
  setActive(mode) {
    for (const button of this.buttons.values()) {
      button.active = button.mode === mode;
      button.visible = this.wasVisible.get(button) && (mode === "None" /* None */ || mode === "Fullscreen" /* Fullscreen */ || button.mode === mode);
    }
    this._currentMode = mode;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/animation/scaleOnHover.ts
var scaledItems = singleton("Juniper:ScaledItems", () => /* @__PURE__ */ new Map());
var timeScale = 5e-3;
function updateScalings(dt) {
  dt *= timeScale;
  for (const state of scaledItems.values()) {
    state.updateScaling(dt);
  }
}
function removeScaledObj(obj2) {
  const state = scaledItems.get(obj2);
  if (state) {
    scaledItems.delete(obj2);
    dispose(state);
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
      dispose2(here);
    }
  }
  cleanupSeen.clear();
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/Skybox.ts
var U = new Vector3(0, 1, 0);
var FACE_SIZE = 2048;
var FACE_SIZE_HALF = FACE_SIZE / 2;
var FACES = [
  1,
  0,
  2,
  3,
  4,
  5
];
var CUBEMAP_PATTERN = {
  rows: 3,
  columns: 4,
  indices: [
    [-1 /* None */, 2 /* Up */, -1 /* None */, -1 /* None */],
    [0 /* Left */, 5 /* Front */, 1 /* Right */, 4 /* Back */],
    [-1 /* None */, 3 /* Down */, -1 /* None */, -1 /* None */]
  ],
  rotations: [
    [0, Pi, 0, 0],
    [0, 0, 0, 0],
    [0, Pi, 0, 0]
  ]
};
var black = new Color(0);
var Skybox = class {
  constructor(env) {
    this.env = env;
    this.rt = new WebGLCubeRenderTarget(FACE_SIZE);
    this.rtScene = new Scene();
    this.rtCamera = new CubeCamera(0.01, 10, this.rt);
    this._rotation = new Quaternion();
    this.layerRotation = new Quaternion().identity();
    this.stageRotation = new Quaternion().identity();
    this.canvases = new Array(6);
    this.contexts = new Array(6);
    this.layerOrientation = null;
    this.images = null;
    this.curImagePath = null;
    this.layer = null;
    this.wasVisible = false;
    this.stageHeading = 0;
    this.rotationNeedsUpdate = false;
    this.imageNeedsUpdate = false;
    this.useWebXRLayers = true;
    this.wasWebXRLayerAvailable = null;
    this.visible = true;
    this.onNeedsRedraw = () => this.imageNeedsUpdate = true;
    this.env.scene.background = black;
    for (let i = 0; i < this.canvases.length; ++i) {
      const f = this.canvases[i] = createUtilityCanvas(FACE_SIZE, FACE_SIZE);
      this.contexts[i] = f.getContext("2d", { alpha: false });
    }
    for (let row = 0; row < CUBEMAP_PATTERN.rows; ++row) {
      const indices = CUBEMAP_PATTERN.indices[row];
      const rotations = CUBEMAP_PATTERN.rotations[row];
      for (let column = 0; column < CUBEMAP_PATTERN.columns; ++column) {
        const i = indices[column];
        if (i > -1) {
          const g = this.contexts[i];
          const rotation = rotations[column];
          if (rotation > 0) {
            if (rotation % 2 === 0) {
              g.translate(FACE_SIZE_HALF, FACE_SIZE_HALF);
            } else {
              g.translate(FACE_SIZE_HALF, FACE_SIZE_HALF);
            }
            g.rotate(rotation);
            g.translate(-FACE_SIZE_HALF, -FACE_SIZE_HALF);
          }
        }
      }
    }
    this.rt.texture.name = "SkyboxOutput";
    this.rtScene.add(this.rtCamera);
    this.flipped = createUtilityCanvas(FACE_SIZE, FACE_SIZE);
    this.flipper = this.flipped.getContext("2d", { alpha: false });
    this.flipper.fillStyle = black.getHexString();
    this.flipper.scale(-1, 1);
    this.flipper.translate(-FACE_SIZE, 0);
    this.setImages("", this.canvases);
    this.env.addScopedEventListener(this, "update", (evt) => this.checkWebXRLayer(evt.frame));
    Object.seal(this);
  }
  get envMap() {
    return this._cube;
  }
  clear() {
    this.setImage(null, null);
  }
  setImage(imageID, image) {
    if (imageID !== this.curImagePath) {
      if (isDefined(image)) {
        this.sliceImage(image);
        return this.setImages(imageID, this.canvases);
      } else {
        return this.setImages(imageID, null);
      }
    }
    return null;
  }
  sliceImage(image) {
    const width = image.width / CUBEMAP_PATTERN.columns;
    const height = image.height / CUBEMAP_PATTERN.rows;
    for (let row = 0; row < CUBEMAP_PATTERN.rows; ++row) {
      const indices = CUBEMAP_PATTERN.indices[row];
      for (let column = 0; column < CUBEMAP_PATTERN.columns; ++column) {
        const i = indices[column];
        if (i > -1) {
          const g = this.contexts[i];
          g.drawImage(
            image,
            column * width,
            row * height,
            width,
            height,
            0,
            0,
            FACE_SIZE,
            FACE_SIZE
          );
        }
      }
    }
    return this.canvases;
  }
  setImages(imageID, images) {
    if (imageID !== this.curImagePath || images !== this.images) {
      this.curImagePath = imageID;
      if (images !== this.images) {
        if (isDefined(this._cube)) {
          cleanup(this._cube);
          this._cube = null;
        }
        if (isDefined(this.images)) {
          for (const img of this.images) {
            cleanup(img);
          }
        }
        this.images = images;
        if (isDefined(this.images)) {
          this.rtScene.background = this._cube = new CubeTexture(this.images);
          this._cube.name = "SkyboxInput";
        } else {
          this.rtScene.background = black;
        }
      }
    }
    this.updateImages();
    return this._cube;
  }
  updateImages() {
    this._cube.needsUpdate = true;
    this.imageNeedsUpdate = true;
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(rotation) {
    const { x, y, z, w } = this._rotation;
    if (isQuaternion(rotation)) {
      this._rotation.copy(rotation);
    } else if (isEuler(rotation)) {
      this._rotation.setFromEuler(rotation);
    } else if (isArray(rotation)) {
      if (rotation.length === 4 && isNumber(rotation[0]) && isNumber(rotation[1]) && isNumber(rotation[2]) && isNumber(rotation[3])) {
        this._rotation.fromArray(rotation);
      } else {
        throw new Error("Skybox rotation was not a valid array format. Needs an array of 4 numbers.");
      }
    } else if (isGoodNumber(rotation)) {
      this._rotation.setFromAxisAngle(U, rotation);
    } else {
      if (isDefined(rotation)) {
        console.warn("Skybox rotation must be a THREE.Quaternion, THREE.Euler, number[] (representing a Quaternion), or a number (representing rotation about the Y-axis).");
      }
      this._rotation.identity();
    }
    this.rotationNeedsUpdate = this._rotation.x !== x || this._rotation.y !== y || this._rotation.z !== z || this._rotation.w !== w;
  }
  checkWebXRLayer(frame) {
    if (this._cube) {
      const isWebXRLayerAvailable = this.useWebXRLayers && this.env.hasXRCompositionLayers && isDefined(frame) && isDefined(this.env.xrBinding);
      const webXRLayerChanged = isWebXRLayerAvailable !== this.wasWebXRLayerAvailable;
      if (webXRLayerChanged) {
        if (isWebXRLayerAvailable) {
          const space = this.env.renderer.xr.getReferenceSpace();
          this.layer = this.env.xrBinding.createCubeLayer({
            space,
            layout: "mono",
            isStatic: false,
            viewPixelWidth: FACE_SIZE,
            viewPixelHeight: FACE_SIZE,
            orientation: this.layerOrientation
          });
          this.layer.addEventListener("redraw", this.onNeedsRedraw);
          this.env.addWebXRLayer(this.layer, Number.MAX_VALUE);
        } else if (this.layer) {
          this.env.removeWebXRLayer(this.layer);
          this.layer.removeEventListener("redraw", this.onNeedsRedraw);
          dispose2(this.layer);
          this.layer = null;
        }
        this.imageNeedsUpdate = true;
      }
      if (!this.layer || !webXRLayerChanged) {
        const visibleChanged = this.visible !== this.wasVisible;
        const headingChanged = this.env.avatar.headingRadians !== this.stageHeading;
        this.imageNeedsUpdate = this.imageNeedsUpdate || visibleChanged || this.layer && this.layer.needsRedraw;
        this.rotationNeedsUpdate = this.rotationNeedsUpdate || headingChanged;
        this.env.scene.background = this.layer ? null : this.visible ? this.rt.texture : black;
        if (this.rotationNeedsUpdate) {
          this.layerRotation.copy(this.rotation).invert();
          this.stageRotation.setFromAxisAngle(U, this.env.avatar.headingRadians).premultiply(this.layerRotation);
          this.layerOrientation = new DOMPointReadOnly(
            this.stageRotation.x,
            this.stageRotation.y,
            this.stageRotation.z,
            this.stageRotation.w
          );
          if (this.layer) {
            this.layer.orientation = this.layerOrientation;
          } else {
            this.rtCamera.quaternion.copy(this.layerRotation);
            this.imageNeedsUpdate = true;
          }
        }
        if (this.imageNeedsUpdate) {
          if (this.layer) {
            const gl = this.env.renderer.getContext();
            const gLayer = this.env.xrBinding.getSubImage(this.layer, frame);
            const imgs = this._cube.images;
            this.flipper.fillRect(0, 0, FACE_SIZE, FACE_SIZE);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, gLayer.colorTexture);
            for (let i = 0; i < imgs.length; ++i) {
              if (this.visible) {
                const img = imgs[FACES[i]];
                this.flipper.drawImage(
                  img,
                  0,
                  0,
                  img.width,
                  img.height,
                  0,
                  0,
                  FACE_SIZE,
                  FACE_SIZE
                );
              }
              gl.texSubImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                0,
                0,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                this.flipped
              );
            }
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
          } else {
            this.rtCamera.update(this.env.renderer, this.rtScene);
          }
        }
        this.stageHeading = this.env.avatar.headingRadians;
        this.imageNeedsUpdate = false;
        this.rotationNeedsUpdate = false;
        this.wasVisible = this.visible;
      }
      this.wasWebXRLayerAvailable = isWebXRLayerAvailable;
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/animation/BodyFollower.ts
var targetPos = new Vector3();
var targetHeadingRadians = 0;
var dPos = new Vector3();
var curPos = new Vector3();
var curDir = new Vector3();
var dQuat = new Quaternion();
var curHeadingRadians = 0;
var copyCounter = 0;
function minRotAngle(to, from) {
  const a = to - from;
  const b = a + Tau;
  const c = a - Tau;
  return minly(a, b, c);
}
var BodyFollower = class extends Object3D {
  constructor(name, minDistance, minHeadingDegrees, heightOffset, speed = 1) {
    super();
    this.minDistance = minDistance;
    this.heightOffset = heightOffset;
    this.speed = speed;
    this.name = name;
    this.lerp = this.minHeadingRadians > 0 || this.minDistance > 0;
    this.maxDistance = this.minDistance * 5;
    this.minHeadingRadians = deg2rad(minHeadingDegrees);
    this.maxHeadingRadians = Pi - this.minHeadingRadians;
    Object.seal(this);
  }
  copy(source, recursive = true) {
    super.copy(source, recursive);
    this.name = source.name + ++copyCounter;
    this.lerp = source.lerp;
    this.maxDistance = source.maxDistance;
    this.minHeadingRadians = source.minHeadingRadians;
    this.maxHeadingRadians = source.maxHeadingRadians;
    return this;
  }
  update(height, position, headingRadians, dt) {
    dt *= 1e-3;
    this.clampTo(this.lerp, height, position, this.minDistance, this.maxDistance, headingRadians, this.minHeadingRadians, this.maxHeadingRadians, dt);
  }
  reset(height, position, headingRadians) {
    this.clampTo(false, height, position, 0, 0, headingRadians, 0, 0, 0);
  }
  clampTo(lerp3, height, position, minDistance, maxDistance, headingRadians, minHeadingRadians, maxHeadingRadians, dt) {
    targetPos.copy(position);
    targetPos.y -= this.heightOffset * height;
    targetHeadingRadians = headingRadians;
    this.getWorldPosition(curPos);
    this.getWorldDirection(curDir);
    curDir.negate();
    curHeadingRadians = getLookHeadingRadians(curDir);
    dQuat.identity();
    let setPos = !lerp3;
    let setRot = !lerp3;
    if (lerp3) {
      const dist = dPos.copy(targetPos).sub(curPos).length();
      if (minDistance < dist) {
        if (dist < maxDistance) {
          targetPos.lerpVectors(curPos, targetPos, this.speed * dt);
        }
        setPos = true;
      }
      const dHeadingRadians = minRotAngle(targetHeadingRadians, curHeadingRadians);
      const mHeadingRadians = Math.abs(dHeadingRadians);
      if (minHeadingRadians < mHeadingRadians) {
        if (mHeadingRadians < maxHeadingRadians) {
          dQuat.setFromAxisAngle(this.up, dHeadingRadians * this.speed * dt);
        } else {
          dQuat.setFromAxisAngle(this.up, dHeadingRadians);
        }
        setRot = true;
      }
    }
    if (setPos || setRot) {
      if (setPos) {
        this.position.add(targetPos.sub(curPos));
      }
      if (setRot) {
        this.quaternion.multiply(dQuat);
      }
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/EventedGamepad.ts
var GamepadButtonEvent = class extends TypedEvent {
  constructor(type2, button) {
    super(type2);
    this.button = button;
  }
};
var GamepadButtonUpEvent = class extends GamepadButtonEvent {
  constructor(button) {
    super("gamepadbuttonup", button);
  }
};
var GamepadButtonDownEvent = class extends GamepadButtonEvent {
  constructor(button) {
    super("gamepadbuttondown", button);
  }
};
var GamepadAxisEvent = class extends TypedEvent {
  constructor(type2, axis, value) {
    super(type2);
    this.axis = axis;
    this.value = value;
  }
};
var GamepadAxisMaxedEvent = class extends GamepadAxisEvent {
  constructor(axis, value) {
    super("gamepadaxismaxed", axis, value);
  }
};
var EventedGamepad = class extends TypedEventBase {
  constructor() {
    super();
    this.lastAxisValues = new Array();
    this.btnDownEvts = new Array();
    this.btnUpEvts = new Array();
    this.wasPressed = new Array();
    this.axisMaxEvts = new Array();
    this.wasAxisMaxed = new Array();
    this.sticks = new Array();
    this.axisThresholdMax = 0.9;
    this.axisThresholdMin = 0.1;
    this._pad = null;
    Object.seal(this);
  }
  get displayId() {
    if ("displayId" in this.pad) {
      return this.pad.displayId;
    }
    return void 0;
  }
  get pad() {
    return this._pad;
  }
  set pad(pad) {
    this._pad = pad;
    if (this.pad) {
      if (this.btnUpEvts.length === 0) {
        for (let b = 0; b < pad.buttons.length; ++b) {
          this.btnDownEvts[b] = new GamepadButtonDownEvent(b);
          this.btnUpEvts[b] = new GamepadButtonUpEvent(b);
          this.wasPressed[b] = false;
        }
        for (let a = 0; a < pad.axes.length; ++a) {
          this.axisMaxEvts[a] = new GamepadAxisMaxedEvent(a, 0);
          this.wasAxisMaxed[a] = false;
          if (a % 2 === 0 && a < pad.axes.length - 1) {
            this.sticks[a / 2] = { x: 0, y: 0 };
          }
          this.lastAxisValues[a] = pad.axes[a];
        }
      }
      for (let b = 0; b < this.pad.buttons.length; ++b) {
        const wasPressed = this.wasPressed[b];
        const pressed = this.pad.buttons[b].pressed;
        if (pressed !== wasPressed) {
          this.wasPressed[b] = pressed;
          this.dispatchEvent((pressed ? this.btnDownEvts : this.btnUpEvts)[b]);
        }
      }
      for (let a = 0; a < this.pad.axes.length; ++a) {
        const wasMaxed = this.wasAxisMaxed[a];
        const val = this.pad.axes[a];
        const dir = Math.sign(val);
        const mag = Math.abs(val);
        const maxed = mag >= this.axisThresholdMax;
        const mined = mag <= this.axisThresholdMin;
        const correctedVal = dir * (maxed ? 1 : mined ? 0 : mag);
        if (maxed && !wasMaxed) {
          this.axisMaxEvts[a].value = correctedVal;
          this.dispatchEvent(this.axisMaxEvts[a]);
        }
        this.wasAxisMaxed[a] = maxed;
        this.lastAxisValues[a] = correctedVal;
      }
      for (let a = 0; a < this.axes.length - 1; a += 2) {
        const stick = this.sticks[a / 2];
        stick.x = this.axes[a];
        stick.y = this.axes[a + 1];
      }
    }
  }
  get id() {
    if (!this.pad) {
      return null;
    }
    return this.pad.id;
  }
  get index() {
    if (!this.pad) {
      return null;
    }
    return this.pad.index;
  }
  get connected() {
    return this.pad && this.pad.connected;
  }
  get mapping() {
    if (!this.pad) {
      return null;
    }
    return this.pad.mapping;
  }
  get timestamp() {
    if (!this.pad) {
      return null;
    }
    return this.pad.timestamp;
  }
  get hand() {
    if (!this.pad) {
      return null;
    }
    return this.pad.hand;
  }
  get pose() {
    if (!this.pad) {
      return null;
    }
    return this.pad.pose;
  }
  get buttons() {
    if (!this.pad) {
      return null;
    }
    return this.pad.buttons;
  }
  get axes() {
    if (!this.pad) {
      return null;
    }
    return this.pad.axes;
  }
  get hapticActuators() {
    if (!this.pad) {
      return null;
    }
    return this.pad.hapticActuators;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/timers/ITimer.ts
var BaseTimerTickEvent = class extends TypedEvent {
  constructor() {
    super("update");
    this.t = 0;
    this.dt = 0;
    this.sdt = 0;
    this.fps = 0;
  }
  set(t2, dt) {
    this.t = t2;
    this.dt = dt;
    this.sdt = lerp(this.sdt, dt, 0.01);
    if (dt > 0) {
      this.fps = 1e3 / dt;
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/setMatrixFromUpFwdPos.ts
var R = new Vector3();
function setMatrixFromUpFwdPos(U2, F, P, matrix) {
  R.crossVectors(F, U2);
  U2.crossVectors(R, F);
  R.normalize();
  U2.normalize();
  F.normalize();
  matrix.set(
    R.x,
    U2.x,
    -F.x,
    P.x,
    R.y,
    U2.y,
    -F.y,
    P.y,
    R.z,
    U2.z,
    -F.z,
    P.z,
    0,
    0,
    0,
    1
  );
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/cursors/BaseCursor.ts
var BaseCursor = class {
  constructor() {
    this._visible = true;
    this._style = "default";
  }
  get style() {
    return this._style;
  }
  set style(v) {
    this._style = v;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/cursors/BaseCursor3D.ts
var BaseCursor3D = class extends BaseCursor {
  constructor(env) {
    super();
    this.env = env;
    this._object = null;
    this.T = new Vector3();
    this.V = new Vector3();
    this.Q = new Quaternion();
    this._side = -1;
    this.f = new Vector3();
    this.up = new Vector3();
    this.right = new Vector3();
  }
  get side() {
    return this._side;
  }
  set side(v) {
    this._side = v;
  }
  get object() {
    return this._object;
  }
  set object(v) {
    this._object = v;
  }
  get position() {
    return this.object.position;
  }
  update(avatarHeadPos, comfortOffset, hit, target, defaultDistance, isLocal, canDragView, canTeleport, origin, direction, isPrimaryPressed) {
    if (hit && hit.face) {
      this.position.copy(hit.point);
      hit.object.getWorldQuaternion(this.Q);
      this.T.copy(hit.face.normal).applyQuaternion(this.Q);
      this.V.copy(this.T).multiplyScalar(0.02);
      this.position.add(this.V);
      this.V.copy(this.T).multiplyScalar(10).add(this.position);
    } else {
      if (isLocal) {
        this.position.copy(direction).multiplyScalar(2).add(origin).sub(this.env.avatar.worldPos).normalize().multiplyScalar(defaultDistance).add(this.env.avatar.worldPos);
      } else {
        this.V.copy(origin).add(comfortOffset).sub(avatarHeadPos).multiplyScalar(2);
        this.position.copy(direction).multiplyScalar(defaultDistance).add(this.V).add(this.env.avatar.worldPos);
      }
      this.V.copy(this.env.avatar.worldPos);
    }
    this.lookAt(this.position, this.V);
    this.style = !target || target.navigable && !canTeleport ? canDragView ? isPrimaryPressed ? "grabbing" : "grab" : "default" : !target.enabled ? "not-allowed" : target.draggable ? isPrimaryPressed ? "grabbing" : "move" : target.navigable ? "cell" : target.clickable ? "pointer" : "default";
  }
  lookAt(p, v) {
    this.f.copy(v).sub(p).normalize();
    this.up.set(0, 1, 0).applyQuaternion(this.env.avatar.worldQuat);
    this.right.crossVectors(this.up, this.f);
    this.up.crossVectors(this.f, this.right);
    setMatrixFromUpFwdPos(
      this.up,
      this.f,
      p,
      this.object.matrixWorld
    );
    this.object.matrix.copy(this.object.parent.matrixWorld).invert().multiply(this.object.matrixWorld);
    this.object.matrix.decompose(
      this.object.position,
      this.object.quaternion,
      this.object.scale
    );
    this.object.scale.x *= this.side;
    this.object.matrix.compose(
      this.object.position,
      this.object.quaternion,
      this.object.scale
    );
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/cursors/CursorColor.ts
var CursorColor = class extends BaseCursor3D {
  constructor(env) {
    super(env);
    this.material = solid({
      name: "CursorMat",
      color: 16776960
    });
    this.object = new Cube(0.01, 0.01, 0.01, this.material);
  }
  get style() {
    return this._currentStyle;
  }
  set style(v) {
    this._currentStyle = v;
    if (isMesh(this.object) && !isArray(this.object.material)) {
      switch (this._currentStyle) {
        case "pointer":
          this.material.color = new Color(65280);
          this.material.needsUpdate = true;
          break;
        case "not-allowed":
          this.material.color = new Color(16711680);
          this.material.needsUpdate = true;
          break;
        case "move":
          this.material.color = new Color(255);
          this.material.needsUpdate = true;
          break;
        case "grab":
          this.material.color = new Color(16711935);
          this.material.needsUpdate = true;
          break;
        case "grabbing":
          this.material.color = new Color(65535);
          this.material.needsUpdate = true;
          break;
        default:
          this._currentStyle = "default";
          this.material.color = new Color(16776960);
          this.material.needsUpdate = true;
          break;
      }
    }
  }
  get visible() {
    return objectIsVisible(this);
  }
  set visible(v) {
    objectSetVisible(this, v);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/lines/LineSegmentsGeometry.js
var _box = new Box3();
var _vector = new Vector3();
var LineSegmentsGeometry = class extends InstancedBufferGeometry {
  constructor() {
    super();
    this.type = "LineSegmentsGeometry";
    const positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0];
    const uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
    const index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
    this.setIndex(index);
    this.setAttribute("position", new Float32BufferAttribute(positions, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }
  applyMatrix4(matrix) {
    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;
    if (start !== void 0) {
      start.applyMatrix4(matrix);
      end.applyMatrix4(matrix);
      start.needsUpdate = true;
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
    let lineSegments;
    if (array instanceof Float32Array) {
      lineSegments = array;
    } else if (Array.isArray(array)) {
      lineSegments = new Float32Array(array);
    }
    const instanceBuffer = new InstancedInterleavedBuffer(lineSegments, 6, 1);
    this.setAttribute("instanceStart", new InterleavedBufferAttribute(instanceBuffer, 3, 0));
    this.setAttribute("instanceEnd", new InterleavedBufferAttribute(instanceBuffer, 3, 3));
    this.computeBoundingBox();
    this.computeBoundingSphere();
    return this;
  }
  setColors(array) {
    let colors;
    if (array instanceof Float32Array) {
      colors = array;
    } else if (Array.isArray(array)) {
      colors = new Float32Array(array);
    }
    const instanceColorBuffer = new InstancedInterleavedBuffer(colors, 6, 1);
    this.setAttribute("instanceColorStart", new InterleavedBufferAttribute(instanceColorBuffer, 3, 0));
    this.setAttribute("instanceColorEnd", new InterleavedBufferAttribute(instanceColorBuffer, 3, 3));
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
  fromMesh(mesh2) {
    this.fromWireframeGeometry(new WireframeGeometry(mesh2.geometry));
    return this;
  }
  fromLineSegments(lineSegments) {
    const geometry = lineSegments.geometry;
    if (geometry.isGeometry) {
      console.error("LineSegmentsGeometry no longer supports Geometry. Use BufferGeometry instead.");
      return;
    } else if (geometry.isBufferGeometry) {
      this.setPositions(geometry.attributes.position.array);
    }
    return this;
  }
  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3();
    }
    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;
    if (start !== void 0 && end !== void 0) {
      this.boundingBox.setFromBufferAttribute(start);
      _box.setFromBufferAttribute(end);
      this.boundingBox.union(_box);
    }
  }
  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere();
    }
    if (this.boundingBox === null) {
      this.computeBoundingBox();
    }
    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;
    if (start !== void 0 && end !== void 0) {
      const center = this.boundingSphere.center;
      this.boundingBox.getCenter(center);
      let maxRadiusSq = 0;
      for (let i = 0, il = start.count; i < il; i++) {
        _vector.fromBufferAttribute(start, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
        _vector.fromBufferAttribute(end, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
      }
      this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
      if (isNaN(this.boundingSphere.radius)) {
        console.error("LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.", this);
      }
    }
  }
  toJSON() {
  }
  applyMatrix(matrix) {
    console.warn("LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().");
    return this.applyMatrix4(matrix);
  }
};
LineSegmentsGeometry.prototype.isLineSegmentsGeometry = true;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/lines/LineSegments2.js
var _start = new Vector3();
var _end = new Vector3();
var _start4 = new Vector4();
var _end4 = new Vector4();
var _ssOrigin = new Vector4();
var _ssOrigin3 = new Vector3();
var _mvMatrix = new Matrix4();
var _line = new Line3();
var _closestPoint = new Vector3();
var _box2 = new Box3();
var _sphere = new Sphere();
var _clipToWorldVector = new Vector4();
function getWorldSpaceHalfWidth(camera, distance, lineWidth, resolution) {
  _clipToWorldVector.set(0, 0, -distance, 1).applyMatrix4(camera.projectionMatrix);
  _clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
  _clipToWorldVector.x = lineWidth / resolution.width;
  _clipToWorldVector.y = lineWidth / resolution.height;
  _clipToWorldVector.applyMatrix4(camera.projectionMatrixInverse);
  _clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
  return Math.abs(Math.max(_clipToWorldVector.x, _clipToWorldVector.y));
}
var LineSegments2 = class extends Mesh {
  constructor(geometry = new LineSegmentsGeometry(), material = new LineMaterial({ color: Math.random() * 16777215 })) {
    super(geometry, material);
    this.type = "LineSegments2";
  }
  // for backwards-compatability, but could be a method of LineSegmentsGeometry...
  computeLineDistances() {
    const geometry = this.geometry;
    const instanceStart = geometry.attributes.instanceStart;
    const instanceEnd = geometry.attributes.instanceEnd;
    const lineDistances = new Float32Array(2 * instanceStart.count);
    for (let i = 0, j = 0, l = instanceStart.count; i < l; i++, j += 2) {
      _start.fromBufferAttribute(instanceStart, i);
      _end.fromBufferAttribute(instanceEnd, i);
      lineDistances[j] = j === 0 ? 0 : lineDistances[j - 1];
      lineDistances[j + 1] = lineDistances[j] + _start.distanceTo(_end);
    }
    const instanceDistanceBuffer = new InstancedInterleavedBuffer(lineDistances, 2, 1);
    geometry.setAttribute("instanceDistanceStart", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0));
    geometry.setAttribute("instanceDistanceEnd", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1));
    return this;
  }
  raycast(raycaster, intersects) {
    if (raycaster.camera === null) {
      console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2.');
    }
    const threshold = raycaster.params.Line2 !== void 0 ? raycaster.params.Line2.threshold || 0 : 0;
    const ray = raycaster.ray;
    const camera = raycaster.camera;
    const projectionMatrix = camera.projectionMatrix;
    const matrixWorld = this.matrixWorld;
    const geometry = this.geometry;
    const material = this.material;
    const resolution = material.resolution;
    const lineWidth = material.linewidth + threshold;
    const instanceStart = geometry.attributes.instanceStart;
    const instanceEnd = geometry.attributes.instanceEnd;
    const near = -camera.near;
    if (geometry.boundingSphere === null) {
      geometry.computeBoundingSphere();
    }
    _sphere.copy(geometry.boundingSphere).applyMatrix4(matrixWorld);
    const distanceToSphere = Math.max(camera.near, _sphere.distanceToPoint(ray.origin));
    const sphereMargin = getWorldSpaceHalfWidth(camera, distanceToSphere, lineWidth, resolution);
    _sphere.radius += sphereMargin;
    if (raycaster.ray.intersectsSphere(_sphere) === false) {
      return;
    }
    if (geometry.boundingBox === null) {
      geometry.computeBoundingBox();
    }
    _box2.copy(geometry.boundingBox).applyMatrix4(matrixWorld);
    const distanceToBox = Math.max(camera.near, _box2.distanceToPoint(ray.origin));
    const boxMargin = getWorldSpaceHalfWidth(camera, distanceToBox, lineWidth, resolution);
    _box2.max.x += boxMargin;
    _box2.max.y += boxMargin;
    _box2.max.z += boxMargin;
    _box2.min.x -= boxMargin;
    _box2.min.y -= boxMargin;
    _box2.min.z -= boxMargin;
    if (raycaster.ray.intersectsBox(_box2) === false) {
      return;
    }
    ray.at(1, _ssOrigin);
    _ssOrigin.w = 1;
    _ssOrigin.applyMatrix4(camera.matrixWorldInverse);
    _ssOrigin.applyMatrix4(projectionMatrix);
    _ssOrigin.multiplyScalar(1 / _ssOrigin.w);
    _ssOrigin.x *= resolution.x / 2;
    _ssOrigin.y *= resolution.y / 2;
    _ssOrigin.z = 0;
    _ssOrigin3.copy(_ssOrigin);
    _mvMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
    for (let i = 0, l = instanceStart.count; i < l; i++) {
      _start4.fromBufferAttribute(instanceStart, i);
      _end4.fromBufferAttribute(instanceEnd, i);
      _start4.w = 1;
      _end4.w = 1;
      _start4.applyMatrix4(_mvMatrix);
      _end4.applyMatrix4(_mvMatrix);
      var isBehindCameraNear = _start4.z > near && _end4.z > near;
      if (isBehindCameraNear) {
        continue;
      }
      if (_start4.z > near) {
        const deltaDist = _start4.z - _end4.z;
        const t2 = (_start4.z - near) / deltaDist;
        _start4.lerp(_end4, t2);
      } else if (_end4.z > near) {
        const deltaDist = _end4.z - _start4.z;
        const t2 = (_end4.z - near) / deltaDist;
        _end4.lerp(_start4, t2);
      }
      _start4.applyMatrix4(projectionMatrix);
      _end4.applyMatrix4(projectionMatrix);
      _start4.multiplyScalar(1 / _start4.w);
      _end4.multiplyScalar(1 / _end4.w);
      _start4.x *= resolution.x / 2;
      _start4.y *= resolution.y / 2;
      _end4.x *= resolution.x / 2;
      _end4.y *= resolution.y / 2;
      _line.start.copy(_start4);
      _line.start.z = 0;
      _line.end.copy(_end4);
      _line.end.z = 0;
      const param = _line.closestPointToPointParameter(_ssOrigin3, true);
      _line.at(param, _closestPoint);
      const zPos = MathUtils.lerp(_start4.z, _end4.z, param);
      const isInClipSpace = zPos >= -1 && zPos <= 1;
      const isInside = _ssOrigin3.distanceTo(_closestPoint) < lineWidth * 0.5;
      if (isInClipSpace && isInside) {
        _line.start.fromBufferAttribute(instanceStart, i);
        _line.end.fromBufferAttribute(instanceEnd, i);
        _line.start.applyMatrix4(matrixWorld);
        _line.end.applyMatrix4(matrixWorld);
        const pointOnLine = new Vector3();
        const point = new Vector3();
        ray.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);
        intersects.push({
          point,
          pointOnLine,
          distance: ray.origin.distanceTo(point),
          object: this,
          face: null,
          faceIndex: i,
          uv: null,
          uv2: null
        });
      }
    }
  }
};
LineSegments2.prototype.isLineSegments2 = true;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/lines/LineGeometry.js
var LineGeometry = class extends LineSegmentsGeometry {
  constructor() {
    super();
    this.type = "LineGeometry";
  }
  setPositions(array) {
    var length3 = array.length - 3;
    var points = new Float32Array(2 * length3);
    for (var i = 0; i < length3; i += 3) {
      points[2 * i] = array[i];
      points[2 * i + 1] = array[i + 1];
      points[2 * i + 2] = array[i + 2];
      points[2 * i + 3] = array[i + 3];
      points[2 * i + 4] = array[i + 4];
      points[2 * i + 5] = array[i + 5];
    }
    super.setPositions(points);
    return this;
  }
  setColors(array) {
    var length3 = array.length - 3;
    var colors = new Float32Array(2 * length3);
    for (var i = 0; i < length3; i += 3) {
      colors[2 * i] = array[i];
      colors[2 * i + 1] = array[i + 1];
      colors[2 * i + 2] = array[i + 2];
      colors[2 * i + 3] = array[i + 3];
      colors[2 * i + 4] = array[i + 4];
      colors[2 * i + 5] = array[i + 5];
    }
    super.setColors(colors);
    return this;
  }
  fromLine(line) {
    var geometry = line.geometry;
    if (geometry.isGeometry) {
      console.error("LineGeometry no longer supports Geometry. Use BufferGeometry instead.");
      return;
    } else if (geometry.isBufferGeometry) {
      this.setPositions(geometry.attributes.position.array);
    }
    return this;
  }
};
LineGeometry.prototype.isLineGeometry = true;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/lines/Line2.js
var Line2 = class extends LineSegments2 {
  constructor(geometry = new LineGeometry(), material = new LineMaterial({ color: Math.random() * 16777215 })) {
    super(geometry, material);
    this.type = "Line2";
  }
};
Line2.prototype.isLine2 = true;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/Laser.ts
var geom = new LineGeometry();
geom.setPositions([
  0,
  0,
  0,
  0,
  0,
  -1
]);
var Laser = class extends Object3D {
  constructor(color, opacity, linewidth) {
    super();
    this._length = 1;
    this.line = new Line2(geom, line2({
      color,
      transparent: opacity < 1,
      opacity,
      linewidth
    }));
    this.line.computeLineDistances();
    objGraph(this, this.line);
  }
  get length() {
    return this._length;
  }
  set length(v) {
    this._length = v;
    this.line.scale.set(1, 1, v);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/Pointers.ts
var PointerID = /* @__PURE__ */ ((PointerID2) => {
  PointerID2[PointerID2["LocalUser"] = 0] = "LocalUser";
  PointerID2[PointerID2["Mouse"] = 1] = "Mouse";
  PointerID2[PointerID2["Pen"] = 2] = "Pen";
  PointerID2[PointerID2["Touch"] = 3] = "Touch";
  PointerID2[PointerID2["Gamepad"] = 4] = "Gamepad";
  PointerID2[PointerID2["MotionController"] = 5] = "MotionController";
  PointerID2[PointerID2["MotionControllerLeft"] = 6] = "MotionControllerLeft";
  PointerID2[PointerID2["MotionControllerRight"] = 7] = "MotionControllerRight";
  PointerID2[PointerID2["Nose"] = 8] = "Nose";
  PointerID2[PointerID2["RemoteUser"] = 9] = "RemoteUser";
  return PointerID2;
})(PointerID || {});

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/cursors/CursorSystem.ts
var CursorSystem = class extends BaseCursor {
  constructor(element) {
    super();
    this.element = element;
    this._hidden = false;
    this.visible = true;
    this.style = "default";
    document.addEventListener("pointerlockchange", () => {
      this._hidden = !!document.pointerLockElement;
      this.refresh();
    });
  }
  get style() {
    return super.style;
  }
  set style(v) {
    super.style = v;
    this.refresh();
  }
  get visible() {
    return super.visible && !this._hidden;
  }
  set visible(v) {
    super.visible = v;
    this.refresh();
  }
  refresh() {
    this.element.style.cursor = this.visible ? this.style : "none";
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/cursors/CursorXRMouse.ts
var CursorXRMouse = class extends BaseCursor3D {
  constructor(env) {
    super(env);
    this.xr = env.cursor3D && env.cursor3D.clone() || new CursorColor(this.env);
    this.system = new CursorSystem(this.env.renderer.domElement);
    this.xr.side = this.side;
    this.visible = false;
    Object.seal(this);
  }
  get object() {
    return this.xr.object;
  }
  get side() {
    return this.xr.side;
  }
  set side(v) {
    this.xr.side = v;
  }
  get cursor() {
    return this.xr;
  }
  set cursor(v) {
    this.xr = v;
    this._refresh();
  }
  get style() {
    return this.system.style;
  }
  get visible() {
    return super.visible;
  }
  set visible(v) {
    super.visible = v;
    this._refresh();
  }
  set style(v) {
    this.system.style = v;
    this.xr.style = v;
    this._refresh();
  }
  _refresh() {
    const isPointerLocked = this.env.eventSys && this.env.eventSys.mouse && this.env.eventSys.mouse.isPointerLocked;
    const showXR = this.env.renderer.xr.isPresenting || isPointerLocked;
    objectSetVisible(this.xr, this.visible && showXR);
    this.system.visible = this.visible && !showXR;
  }
  lookAt(p, v) {
    this.xr.lookAt(p, v);
  }
};

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
  removeMesh(mesh2) {
    if (arrayRemove(this.meshes, mesh2)) {
      delete mesh2.userData[RAY_TARGET_KEY];
    }
    return this;
  }
  addMeshes(...meshes) {
    for (const mesh2 of meshes) {
      this.addMesh(mesh2);
    }
    return this;
  }
  removeMeshes(...meshes) {
    for (const mesh2 of meshes) {
      this.removeMesh(mesh2);
    }
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
function isRayTarget(obj2) {
  return obj2 instanceof RayTarget;
}
function getRayTarget(obj2) {
  let target = null;
  if (obj2) {
    if (isRayTarget(obj2)) {
      target = obj2;
    } else {
      obj2 = objectResolve(obj2);
      if (obj2) {
        target = obj2.userData[RAY_TARGET_KEY];
      }
    }
    if (target && !objectIsFullyVisible(target)) {
      target = null;
    }
  }
  return target;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/Pointer3DEvent.ts
var Pointer3DEvent = class extends TypedEvent {
  constructor(type2, pointer) {
    super(type2);
    this.pointer = pointer;
    this._hit = null;
    this._point = null;
    this._distance = Number.POSITIVE_INFINITY;
    this._rayTarget = null;
    Object.seal(this);
  }
  set(v, t2) {
    if (v !== this.hit) {
      this._hit = v;
      if (v) {
        this._point = v.point;
        this._distance = v.distance;
      } else {
        this._point = null;
        this._distance = Number.POSITIVE_INFINITY;
      }
    }
    this._rayTarget = t2;
  }
  get hit() {
    return this._hit;
  }
  get rayTarget() {
    return this._rayTarget;
  }
  get point() {
    return this._point;
  }
  get distance() {
    return this._distance;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/BasePointer.ts
var MAX_DRAG_DISTANCE = 5;
var ZERO = new Vector3();
var BasePointer = class extends TypedEventBase {
  constructor(type2, id, env, cursor) {
    super();
    this.type = type2;
    this.id = id;
    this.env = env;
    this.origin = new Vector3();
    this.direction = new Vector3();
    this.up = new Vector3(0, 1, 0);
    this.canMoveView = false;
    this.mayTeleport = false;
    this.buttons = 0;
    this._isActive = false;
    this.moveDistance = 0;
    this.pointerEvents = /* @__PURE__ */ new Map();
    this.lastButtons = 0;
    this.canClick = false;
    this.dragDistance = 0;
    this._enabled = false;
    this._cursor = null;
    this._curHit = null;
    this._curTarget = null;
    this._hoveredHit = null;
    this._hoveredTarget = null;
    this._cursor = cursor;
    if (this.cursor) {
      this.cursor.visible = false;
    }
  }
  get isActive() {
    return this._isActive;
  }
  get canSend() {
    return this.enabled && this.isActive;
  }
  get curHit() {
    return this._curHit;
  }
  get curTarget() {
    return this._curTarget;
  }
  get hoveredHit() {
    return this._hoveredHit;
  }
  set hoveredHit(v) {
    if (v !== this.hoveredHit) {
      const t2 = getRayTarget(v);
      this._hoveredHit = v;
      this._hoveredTarget = t2;
    }
  }
  get name() {
    return PointerID[this.id];
  }
  get rayTarget() {
    return this._hoveredTarget;
  }
  get cursor() {
    return this._cursor;
  }
  set cursor(newCursor) {
    if (newCursor !== this.cursor) {
      const oldCursor = this.cursor;
      const oldName = this.cursor && this.cursor.object && this.cursor.object.name || "cursor";
      const oldParent = oldCursor && oldCursor.object && oldCursor.object.parent;
      if (oldParent) {
        oldCursor.object.removeFromParent();
      }
      if (newCursor) {
        newCursor.object.name = oldName;
        if (oldCursor instanceof CursorXRMouse) {
          oldCursor.cursor = newCursor;
          if (oldParent) {
            objGraph(oldParent, oldCursor);
          }
        } else {
          this._cursor = newCursor;
          if (oldCursor) {
            if (oldParent) {
              objGraph(oldParent, newCursor);
            }
            newCursor.style = oldCursor.style;
            newCursor.visible = oldCursor.visible;
          }
        }
      }
    }
  }
  get needsUpdate() {
    return this.enabled && this._isActive;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(v) {
    this._enabled = v;
    if (this.cursor) {
      this.cursor.visible = v;
    }
  }
  setButton(button, pressed) {
    this.lastButtons = this.buttons;
    const mask = 1 << button;
    if (pressed) {
      this.buttons |= mask;
    } else {
      this.buttons &= ~mask;
    }
    if (pressed) {
      this.canClick = true;
      this.dragDistance = 0;
      this.env.avatar.setMode(this);
      this.setEventState("down");
    } else {
      if (this.canClick) {
        const curButtons = this.buttons;
        this.buttons = this.lastButtons;
        this.setEventState("click");
        this.buttons = curButtons;
      }
      this.setEventState("up");
    }
  }
  isPressed(button) {
    const mask = 1 << button;
    return (this.buttons & mask) !== 0;
  }
  wasPressed(button) {
    const mask = 1 << button;
    return (this.lastButtons & mask) !== 0;
  }
  fireRay(origin, direction) {
    const minHit = this.env.eventSys.fireRay(origin, direction);
    if (minHit !== this.curHit) {
      const t2 = getRayTarget(minHit);
      this._curHit = minHit;
      this._curTarget = t2;
    }
  }
  getEvent(type2) {
    if (!this.pointerEvents.has(type2)) {
      this.pointerEvents.set(type2, new Pointer3DEvent(type2, this));
    }
    const evt = this.pointerEvents.get(type2);
    if (this.hoveredHit) {
      evt.set(this.hoveredHit, this.rayTarget);
    } else if (this.curHit) {
      evt.set(this.curHit, this.curTarget);
    } else {
      evt.set(null, null);
    }
    if (evt.hit) {
      const lastHit = this.curHit || this.hoveredHit;
      if (lastHit && evt.hit !== lastHit) {
        evt.hit.uv = lastHit.uv;
      }
    }
    return evt;
  }
  update() {
    if (this.needsUpdate) {
      this.onUpdate();
    }
  }
  onUpdate() {
    this.updatePointerOrientation();
    const primaryPressed = this.isPressed(0 /* Primary */);
    if (this.moveDistance > 0 || primaryPressed) {
      if (primaryPressed) {
        this.dragDistance += this.moveDistance;
        if (this.dragDistance > MAX_DRAG_DISTANCE) {
          this.canClick = false;
        }
      }
      this.setEventState("move");
    }
    this.moveDistance = 0;
  }
  setEventState(eventType) {
    this.fireRay(this.origin, this.direction);
    if (this.curTarget === this.rayTarget) {
      this.hoveredHit = this.curHit;
    } else {
      const isPressed = this.isPressed(0 /* Primary */);
      const wasPressed = this.wasPressed(0 /* Primary */);
      const openMove = eventType === "move" && !isPressed;
      const primaryDown = eventType === "down" && isPressed && !wasPressed;
      const primaryUp = eventType === "up" && !isPressed && wasPressed;
      if (openMove || primaryDown || primaryUp) {
        if (this.rayTarget) {
          const upEvt = this.getEvent("up");
          this.rayTarget.dispatchEvent(upEvt);
          const exitEvt = this.getEvent("exit");
          this.dispatchEvent(exitEvt);
          this.rayTarget.dispatchEvent(exitEvt);
        }
        this.hoveredHit = this.curHit;
        if (this.rayTarget) {
          const enterEvt = this.getEvent("enter");
          this.dispatchEvent(enterEvt);
          this.rayTarget.dispatchEvent(enterEvt);
        }
      }
      if (this.hoveredHit) {
        this.hoveredHit.point.copy(this.direction).multiplyScalar(this.hoveredHit.distance).add(this.origin);
      }
    }
    const evt = this.getEvent(eventType);
    this.dispatchEvent(evt);
    if (evt.rayTarget && (eventType !== "click" || evt.rayTarget.clickable || evt.rayTarget.navigable)) {
      if (eventType === "click" && evt.rayTarget.clickable) {
        this.vibrate();
      }
      if (evt.rayTarget.enabled) {
        evt.rayTarget.dispatchEvent(evt);
      }
    }
    this.updateCursor(this.env.avatar.worldPos, ZERO, true, 2);
  }
  get canDragView() {
    return this.canMoveView;
  }
  get canTeleport() {
    return this.mayTeleport;
  }
  updateCursor(avatarHeadPos, comfortOffset, isLocal, defaultDistance) {
    if (this.cursor) {
      this.cursor.update(
        avatarHeadPos,
        comfortOffset,
        this.hoveredHit || this.curHit,
        this.rayTarget || this.curTarget,
        defaultDistance,
        isLocal,
        this.canDragView,
        this.canTeleport,
        this.origin,
        this.direction,
        this.isPressed(0 /* Primary */)
      );
    }
  }
  get bufferSize() {
    return 37;
  }
  writeState(buffer) {
    buffer.writeUint8(this.id);
    buffer.writeVector48(this.origin);
    buffer.writeVector48(this.direction);
    buffer.writeVector48(this.up);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/PointerRemote.ts
var ARM_LENGTH = 0.2;
var ARM_DIST = 0.5 * ARM_LENGTH - 0.025;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/getRelativeXRRigidTransform.ts
var M = new Matrix4();
var P3 = new Vector3();
var P4 = new Vector4();
var Q = new Quaternion();

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/Plane.ts
var plane = /* @__PURE__ */ new PlaneGeometry(1, 1, 1, 1);
plane.name = "PlaneGeom";

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/widgets/Image2D.ts
var S = new Vector3();

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/fonts.ts
var loadedFonts = singleton("juniper::loadedFonts", () => []);

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/AvatarRemote.ts
var nameTagFont = {
  fontFamily: getMonospaceFonts(),
  fontSize: 20,
  fontWeight: "bold",
  textFillColor: "white",
  textStrokeColor: "black",
  textStrokeSize: 0.01,
  padding: {
    top: 0.025,
    right: 0.05,
    bottom: 0.025,
    left: 0.05
  },
  maxHeight: 0.2
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/BaseTele.ts
var HANDEDNESSES = [
  "none",
  "right",
  "left"
];

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/loaders/BufferGeometryUtils.js
function toTrianglesDrawMode(geometry, drawMode) {
  if (drawMode === TrianglesDrawMode) {
    console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.");
    return geometry;
  }
  if (drawMode === TriangleFanDrawMode || drawMode === TriangleStripDrawMode) {
    let index = geometry.getIndex();
    if (index === null) {
      const indices = [];
      const position = geometry.getAttribute("position");
      if (position !== void 0) {
        for (let i = 0; i < position.count; i++) {
          indices.push(i);
        }
        geometry.setIndex(indices);
        index = geometry.getIndex();
      } else {
        console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.");
        return geometry;
      }
    }
    const numberOfTriangles = index.count - 2;
    const newIndices = [];
    if (drawMode === TriangleFanDrawMode) {
      for (let i = 1; i <= numberOfTriangles; i++) {
        newIndices.push(index.getX(0));
        newIndices.push(index.getX(i));
        newIndices.push(index.getX(i + 1));
      }
    } else {
      for (let i = 0; i < numberOfTriangles; i++) {
        if (i % 2 === 0) {
          newIndices.push(index.getX(i));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i + 2));
        } else {
          newIndices.push(index.getX(i + 2));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i));
        }
      }
    }
    if (newIndices.length / 3 !== numberOfTriangles) {
      console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    }
    const newGeometry = geometry.clone();
    newGeometry.setIndex(newIndices);
    newGeometry.clearGroups();
    return newGeometry;
  } else {
    console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", drawMode);
    return geometry;
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/loaders/GLTFLoader.js
var GLTFLoader = class extends Loader {
  constructor(manager) {
    super(manager);
    this.dracoLoader = null;
    this.ktx2Loader = null;
    this.meshoptDecoder = null;
    this.pluginCallbacks = [];
    this.register(function(parser) {
      return new GLTFMaterialsClearcoatExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFTextureBasisUExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFTextureWebPExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFTextureAVIFExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsSheenExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsTransmissionExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsVolumeExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsIorExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsEmissiveStrengthExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsSpecularExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsIridescenceExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFLightsExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMeshoptCompression(parser);
    });
    this.register(function(parser) {
      return new GLTFMeshGpuInstancing(parser);
    });
  }
  load(url2, onLoad, onProgress, onError) {
    const scope = this;
    let resourcePath;
    if (this.resourcePath !== "") {
      resourcePath = this.resourcePath;
    } else if (this.path !== "") {
      resourcePath = this.path;
    } else {
      resourcePath = LoaderUtils.extractUrlBase(url2);
    }
    this.manager.itemStart(url2);
    const _onError = function(e) {
      if (onError) {
        onError(e);
      } else {
        console.error(e);
      }
      scope.manager.itemError(url2);
      scope.manager.itemEnd(url2);
    };
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    loader.load(url2, function(data) {
      try {
        scope.parse(data, resourcePath, function(gltf) {
          onLoad(gltf);
          scope.manager.itemEnd(url2);
        }, _onError);
      } catch (e) {
        _onError(e);
      }
    }, onProgress, _onError);
  }
  setDRACOLoader(dracoLoader) {
    this.dracoLoader = dracoLoader;
    return this;
  }
  setDDSLoader() {
    throw new Error(
      'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'
    );
  }
  setKTX2Loader(ktx2Loader) {
    this.ktx2Loader = ktx2Loader;
    return this;
  }
  setMeshoptDecoder(meshoptDecoder) {
    this.meshoptDecoder = meshoptDecoder;
    return this;
  }
  register(callback) {
    if (this.pluginCallbacks.indexOf(callback) === -1) {
      this.pluginCallbacks.push(callback);
    }
    return this;
  }
  unregister(callback) {
    if (this.pluginCallbacks.indexOf(callback) !== -1) {
      this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
    }
    return this;
  }
  parse(data, path, onLoad, onError) {
    let json;
    const extensions = {};
    const plugins = {};
    const textDecoder = new TextDecoder();
    if (typeof data === "string") {
      json = JSON.parse(data);
    } else if (data instanceof ArrayBuffer) {
      const magic = textDecoder.decode(new Uint8Array(data, 0, 4));
      if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
        try {
          extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
        } catch (error) {
          if (onError)
            onError(error);
          return;
        }
        json = JSON.parse(extensions[EXTENSIONS.KHR_BINARY_GLTF].content);
      } else {
        json = JSON.parse(textDecoder.decode(data));
      }
    } else {
      json = data;
    }
    if (json.asset === void 0 || json.asset.version[0] < 2) {
      if (onError)
        onError(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const parser = new GLTFParser(json, {
      path: path || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    parser.fileLoader.setRequestHeader(this.requestHeader);
    for (let i = 0; i < this.pluginCallbacks.length; i++) {
      const plugin = this.pluginCallbacks[i](parser);
      plugins[plugin.name] = plugin;
      extensions[plugin.name] = true;
    }
    if (json.extensionsUsed) {
      for (let i = 0; i < json.extensionsUsed.length; ++i) {
        const extensionName = json.extensionsUsed[i];
        const extensionsRequired = json.extensionsRequired || [];
        switch (extensionName) {
          case EXTENSIONS.KHR_MATERIALS_UNLIT:
            extensions[extensionName] = new GLTFMaterialsUnlitExtension();
            break;
          case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
            extensions[extensionName] = new GLTFDracoMeshCompressionExtension(json, this.dracoLoader);
            break;
          case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
            extensions[extensionName] = new GLTFTextureTransformExtension();
            break;
          case EXTENSIONS.KHR_MESH_QUANTIZATION:
            extensions[extensionName] = new GLTFMeshQuantizationExtension();
            break;
          default:
            if (extensionsRequired.indexOf(extensionName) >= 0 && plugins[extensionName] === void 0) {
              console.warn('THREE.GLTFLoader: Unknown extension "' + extensionName + '".');
            }
        }
      }
    }
    parser.setExtensions(extensions);
    parser.setPlugins(plugins);
    parser.parse(onLoad, onError);
  }
  parseAsync(data, path) {
    const scope = this;
    return new Promise(function(resolve, reject) {
      scope.parse(data, path, resolve, reject);
    });
  }
};
function GLTFRegistry() {
  let objects = {};
  return {
    get: function(key) {
      return objects[key];
    },
    add: function(key, object) {
      objects[key] = object;
    },
    remove: function(key) {
      delete objects[key];
    },
    removeAll: function() {
      objects = {};
    }
  };
}
var EXTENSIONS = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
var GLTFLightsExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;
    this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const parser = this.parser;
    const nodeDefs = this.parser.json.nodes || [];
    for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
      const nodeDef = nodeDefs[nodeIndex];
      if (nodeDef.extensions && nodeDef.extensions[this.name] && nodeDef.extensions[this.name].light !== void 0) {
        parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);
      }
    }
  }
  _loadLight(lightIndex) {
    const parser = this.parser;
    const cacheKey = "light:" + lightIndex;
    let dependency = parser.cache.get(cacheKey);
    if (dependency)
      return dependency;
    const json = parser.json;
    const extensions = json.extensions && json.extensions[this.name] || {};
    const lightDefs = extensions.lights || [];
    const lightDef = lightDefs[lightIndex];
    let lightNode;
    const color = new Color(16777215);
    if (lightDef.color !== void 0)
      color.fromArray(lightDef.color);
    const range = lightDef.range !== void 0 ? lightDef.range : 0;
    switch (lightDef.type) {
      case "directional":
        lightNode = new DirectionalLight(color);
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break;
      case "point":
        lightNode = new PointLight(color);
        lightNode.distance = range;
        break;
      case "spot":
        lightNode = new SpotLight(color);
        lightNode.distance = range;
        lightDef.spot = lightDef.spot || {};
        lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== void 0 ? lightDef.spot.innerConeAngle : 0;
        lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== void 0 ? lightDef.spot.outerConeAngle : Math.PI / 4;
        lightNode.angle = lightDef.spot.outerConeAngle;
        lightNode.penumbra = 1 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + lightDef.type);
    }
    lightNode.position.set(0, 0, 0);
    lightNode.decay = 2;
    assignExtrasToUserData(lightNode, lightDef);
    if (lightDef.intensity !== void 0)
      lightNode.intensity = lightDef.intensity;
    lightNode.name = parser.createUniqueName(lightDef.name || "light_" + lightIndex);
    dependency = Promise.resolve(lightNode);
    parser.cache.add(cacheKey, dependency);
    return dependency;
  }
  getDependency(type2, index) {
    if (type2 !== "light")
      return;
    return this._loadLight(index);
  }
  createNodeAttachment(nodeIndex) {
    const self2 = this;
    const parser = this.parser;
    const json = parser.json;
    const nodeDef = json.nodes[nodeIndex];
    const lightDef = nodeDef.extensions && nodeDef.extensions[this.name] || {};
    const lightIndex = lightDef.light;
    if (lightIndex === void 0)
      return null;
    return this._loadLight(lightIndex).then(function(light) {
      return parser._getNodeRef(self2.cache, lightIndex, light);
    });
  }
};
var GLTFMaterialsUnlitExtension = class {
  constructor() {
    this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return MeshBasicMaterial;
  }
  extendParams(materialParams, materialDef, parser) {
    const pending = [];
    materialParams.color = new Color(1, 1, 1);
    materialParams.opacity = 1;
    const metallicRoughness = materialDef.pbrMetallicRoughness;
    if (metallicRoughness) {
      if (Array.isArray(metallicRoughness.baseColorFactor)) {
        const array = metallicRoughness.baseColorFactor;
        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];
      }
      if (metallicRoughness.baseColorTexture !== void 0) {
        pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture, SRGBColorSpace));
      }
    }
    return Promise.all(pending);
  }
};
var GLTFMaterialsEmissiveStrengthExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const emissiveStrength = materialDef.extensions[this.name].emissiveStrength;
    if (emissiveStrength !== void 0) {
      materialParams.emissiveIntensity = emissiveStrength;
    }
    return Promise.resolve();
  }
};
var GLTFMaterialsClearcoatExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(materialIndex) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name])
      return null;
    return MeshPhysicalMaterial;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const pending = [];
    const extension = materialDef.extensions[this.name];
    if (extension.clearcoatFactor !== void 0) {
      materialParams.clearcoat = extension.clearcoatFactor;
    }
    if (extension.clearcoatTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "clearcoatMap", extension.clearcoatTexture));
    }
    if (extension.clearcoatRoughnessFactor !== void 0) {
      materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;
    }
    if (extension.clearcoatRoughnessTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "clearcoatRoughnessMap", extension.clearcoatRoughnessTexture));
    }
    if (extension.clearcoatNormalTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "clearcoatNormalMap", extension.clearcoatNormalTexture));
      if (extension.clearcoatNormalTexture.scale !== void 0) {
        const scale3 = extension.clearcoatNormalTexture.scale;
        materialParams.clearcoatNormalScale = new Vector2(scale3, scale3);
      }
    }
    return Promise.all(pending);
  }
};
var GLTFMaterialsIridescenceExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(materialIndex) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name])
      return null;
    return MeshPhysicalMaterial;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const pending = [];
    const extension = materialDef.extensions[this.name];
    if (extension.iridescenceFactor !== void 0) {
      materialParams.iridescence = extension.iridescenceFactor;
    }
    if (extension.iridescenceTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "iridescenceMap", extension.iridescenceTexture));
    }
    if (extension.iridescenceIor !== void 0) {
      materialParams.iridescenceIOR = extension.iridescenceIor;
    }
    if (materialParams.iridescenceThicknessRange === void 0) {
      materialParams.iridescenceThicknessRange = [100, 400];
    }
    if (extension.iridescenceThicknessMinimum !== void 0) {
      materialParams.iridescenceThicknessRange[0] = extension.iridescenceThicknessMinimum;
    }
    if (extension.iridescenceThicknessMaximum !== void 0) {
      materialParams.iridescenceThicknessRange[1] = extension.iridescenceThicknessMaximum;
    }
    if (extension.iridescenceThicknessTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "iridescenceThicknessMap", extension.iridescenceThicknessTexture));
    }
    return Promise.all(pending);
  }
};
var GLTFMaterialsSheenExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(materialIndex) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name])
      return null;
    return MeshPhysicalMaterial;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const pending = [];
    materialParams.sheenColor = new Color(0, 0, 0);
    materialParams.sheenRoughness = 0;
    materialParams.sheen = 1;
    const extension = materialDef.extensions[this.name];
    if (extension.sheenColorFactor !== void 0) {
      materialParams.sheenColor.fromArray(extension.sheenColorFactor);
    }
    if (extension.sheenRoughnessFactor !== void 0) {
      materialParams.sheenRoughness = extension.sheenRoughnessFactor;
    }
    if (extension.sheenColorTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "sheenColorMap", extension.sheenColorTexture, SRGBColorSpace));
    }
    if (extension.sheenRoughnessTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "sheenRoughnessMap", extension.sheenRoughnessTexture));
    }
    return Promise.all(pending);
  }
};
var GLTFMaterialsTransmissionExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(materialIndex) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name])
      return null;
    return MeshPhysicalMaterial;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const pending = [];
    const extension = materialDef.extensions[this.name];
    if (extension.transmissionFactor !== void 0) {
      materialParams.transmission = extension.transmissionFactor;
    }
    if (extension.transmissionTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "transmissionMap", extension.transmissionTexture));
    }
    return Promise.all(pending);
  }
};
var GLTFMaterialsVolumeExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(materialIndex) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name])
      return null;
    return MeshPhysicalMaterial;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const pending = [];
    const extension = materialDef.extensions[this.name];
    materialParams.thickness = extension.thicknessFactor !== void 0 ? extension.thicknessFactor : 0;
    if (extension.thicknessTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "thicknessMap", extension.thicknessTexture));
    }
    materialParams.attenuationDistance = extension.attenuationDistance || Infinity;
    const colorArray = extension.attenuationColor || [1, 1, 1];
    materialParams.attenuationColor = new Color(colorArray[0], colorArray[1], colorArray[2]);
    return Promise.all(pending);
  }
};
var GLTFMaterialsIorExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_IOR;
  }
  getMaterialType(materialIndex) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name])
      return null;
    return MeshPhysicalMaterial;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const extension = materialDef.extensions[this.name];
    materialParams.ior = extension.ior !== void 0 ? extension.ior : 1.5;
    return Promise.resolve();
  }
};
var GLTFMaterialsSpecularExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(materialIndex) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name])
      return null;
    return MeshPhysicalMaterial;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) {
      return Promise.resolve();
    }
    const pending = [];
    const extension = materialDef.extensions[this.name];
    materialParams.specularIntensity = extension.specularFactor !== void 0 ? extension.specularFactor : 1;
    if (extension.specularTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "specularIntensityMap", extension.specularTexture));
    }
    const colorArray = extension.specularColorFactor || [1, 1, 1];
    materialParams.specularColor = new Color(colorArray[0], colorArray[1], colorArray[2]);
    if (extension.specularColorTexture !== void 0) {
      pending.push(parser.assignTexture(materialParams, "specularColorMap", extension.specularColorTexture, SRGBColorSpace));
    }
    return Promise.all(pending);
  }
};
var GLTFTextureBasisUExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_TEXTURE_BASISU;
  }
  loadTexture(textureIndex) {
    const parser = this.parser;
    const json = parser.json;
    const textureDef = json.textures[textureIndex];
    if (!textureDef.extensions || !textureDef.extensions[this.name]) {
      return null;
    }
    const extension = textureDef.extensions[this.name];
    const loader = parser.options.ktx2Loader;
    if (!loader) {
      if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      } else {
        return null;
      }
    }
    return parser.loadTextureImage(textureIndex, extension.source, loader);
  }
};
var GLTFTextureWebPExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
    this.isSupported = null;
  }
  loadTexture(textureIndex) {
    const name = this.name;
    const parser = this.parser;
    const json = parser.json;
    const textureDef = json.textures[textureIndex];
    if (!textureDef.extensions || !textureDef.extensions[name]) {
      return null;
    }
    const extension = textureDef.extensions[name];
    const source = json.images[extension.source];
    let loader = parser.textureLoader;
    if (source.uri) {
      const handler = parser.options.manager.getHandler(source.uri);
      if (handler !== null)
        loader = handler;
    }
    return this.detectSupport().then(function(isSupported) {
      if (isSupported)
        return parser.loadTextureImage(textureIndex, extension.source, loader);
      if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {
        throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
      }
      return parser.loadTexture(textureIndex);
    });
  }
  detectSupport() {
    if (!this.isSupported) {
      this.isSupported = new Promise(function(resolve) {
        const image = new Image();
        image.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
        image.onload = image.onerror = function() {
          resolve(image.height === 1);
        };
      });
    }
    return this.isSupported;
  }
};
var GLTFTextureAVIFExtension = class {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.EXT_TEXTURE_AVIF;
    this.isSupported = null;
  }
  loadTexture(textureIndex) {
    const name = this.name;
    const parser = this.parser;
    const json = parser.json;
    const textureDef = json.textures[textureIndex];
    if (!textureDef.extensions || !textureDef.extensions[name]) {
      return null;
    }
    const extension = textureDef.extensions[name];
    const source = json.images[extension.source];
    let loader = parser.textureLoader;
    if (source.uri) {
      const handler = parser.options.manager.getHandler(source.uri);
      if (handler !== null)
        loader = handler;
    }
    return this.detectSupport().then(function(isSupported) {
      if (isSupported)
        return parser.loadTextureImage(textureIndex, extension.source, loader);
      if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {
        throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
      }
      return parser.loadTexture(textureIndex);
    });
  }
  detectSupport() {
    if (!this.isSupported) {
      this.isSupported = new Promise(function(resolve) {
        const image = new Image();
        image.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";
        image.onload = image.onerror = function() {
          resolve(image.height === 1);
        };
      });
    }
    return this.isSupported;
  }
};
var GLTFMeshoptCompression = class {
  constructor(parser) {
    this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
    this.parser = parser;
  }
  loadBufferView(index) {
    const json = this.parser.json;
    const bufferView = json.bufferViews[index];
    if (bufferView.extensions && bufferView.extensions[this.name]) {
      const extensionDef = bufferView.extensions[this.name];
      const buffer = this.parser.getDependency("buffer", extensionDef.buffer);
      const decoder = this.parser.options.meshoptDecoder;
      if (!decoder || !decoder.supported) {
        if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        } else {
          return null;
        }
      }
      return buffer.then(function(res) {
        const byteOffset = extensionDef.byteOffset || 0;
        const byteLength = extensionDef.byteLength || 0;
        const count = extensionDef.count;
        const stride = extensionDef.byteStride;
        const source = new Uint8Array(res, byteOffset, byteLength);
        if (decoder.decodeGltfBufferAsync) {
          return decoder.decodeGltfBufferAsync(count, stride, source, extensionDef.mode, extensionDef.filter).then(function(res2) {
            return res2.buffer;
          });
        } else {
          return decoder.ready.then(function() {
            const result = new ArrayBuffer(count * stride);
            decoder.decodeGltfBuffer(new Uint8Array(result), count, stride, source, extensionDef.mode, extensionDef.filter);
            return result;
          });
        }
      });
    } else {
      return null;
    }
  }
};
var GLTFMeshGpuInstancing = class {
  constructor(parser) {
    this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
    this.parser = parser;
  }
  createNodeMesh(nodeIndex) {
    const json = this.parser.json;
    const nodeDef = json.nodes[nodeIndex];
    if (!nodeDef.extensions || !nodeDef.extensions[this.name] || nodeDef.mesh === void 0) {
      return null;
    }
    const meshDef = json.meshes[nodeDef.mesh];
    for (const primitive of meshDef.primitives) {
      if (primitive.mode !== WEBGL_CONSTANTS.TRIANGLES && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN && primitive.mode !== void 0) {
        return null;
      }
    }
    const extensionDef = nodeDef.extensions[this.name];
    const attributesDef = extensionDef.attributes;
    const pending = [];
    const attributes = {};
    for (const key in attributesDef) {
      pending.push(this.parser.getDependency("accessor", attributesDef[key]).then((accessor) => {
        attributes[key] = accessor;
        return attributes[key];
      }));
    }
    if (pending.length < 1) {
      return null;
    }
    pending.push(this.parser.createNodeMesh(nodeIndex));
    return Promise.all(pending).then((results) => {
      const nodeObject = results.pop();
      const meshes = nodeObject.isGroup ? nodeObject.children : [nodeObject];
      const count = results[0].count;
      const instancedMeshes = [];
      for (const mesh2 of meshes) {
        const m = new Matrix4();
        const p = new Vector3();
        const q = new Quaternion();
        const s = new Vector3(1, 1, 1);
        const instancedMesh = new InstancedMesh(mesh2.geometry, mesh2.material, count);
        for (let i = 0; i < count; i++) {
          if (attributes.TRANSLATION) {
            p.fromBufferAttribute(attributes.TRANSLATION, i);
          }
          if (attributes.ROTATION) {
            q.fromBufferAttribute(attributes.ROTATION, i);
          }
          if (attributes.SCALE) {
            s.fromBufferAttribute(attributes.SCALE, i);
          }
          instancedMesh.setMatrixAt(i, m.compose(p, q, s));
        }
        for (const attributeName in attributes) {
          if (attributeName !== "TRANSLATION" && attributeName !== "ROTATION" && attributeName !== "SCALE") {
            mesh2.geometry.setAttribute(attributeName, attributes[attributeName]);
          }
        }
        Object3D.prototype.copy.call(instancedMesh, mesh2);
        this.parser.assignFinalMaterial(instancedMesh);
        instancedMeshes.push(instancedMesh);
      }
      if (nodeObject.isGroup) {
        nodeObject.clear();
        nodeObject.add(...instancedMeshes);
        return nodeObject;
      }
      return instancedMeshes[0];
    });
  }
};
var BINARY_EXTENSION_HEADER_MAGIC = "glTF";
var BINARY_EXTENSION_HEADER_LENGTH = 12;
var BINARY_EXTENSION_CHUNK_TYPES = { JSON: 1313821514, BIN: 5130562 };
var GLTFBinaryExtension = class {
  constructor(data) {
    this.name = EXTENSIONS.KHR_BINARY_GLTF;
    this.content = null;
    this.body = null;
    const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
    const textDecoder = new TextDecoder();
    this.header = {
      magic: textDecoder.decode(new Uint8Array(data.slice(0, 4))),
      version: headerView.getUint32(4, true),
      length: headerView.getUint32(8, true)
    };
    if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    } else if (this.header.version < 2) {
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    }
    const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
    const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
    let chunkIndex = 0;
    while (chunkIndex < chunkContentsLength) {
      const chunkLength = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;
      const chunkType = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;
      if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
        const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
        this.content = textDecoder.decode(contentArray);
      } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
        const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
        this.body = data.slice(byteOffset, byteOffset + chunkLength);
      }
      chunkIndex += chunkLength;
    }
    if (this.content === null) {
      throw new Error("THREE.GLTFLoader: JSON content not found.");
    }
  }
};
var GLTFDracoMeshCompressionExtension = class {
  constructor(json, dracoLoader) {
    if (!dracoLoader) {
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    }
    this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
    this.json = json;
    this.dracoLoader = dracoLoader;
    this.dracoLoader.preload();
  }
  decodePrimitive(primitive, parser) {
    const json = this.json;
    const dracoLoader = this.dracoLoader;
    const bufferViewIndex = primitive.extensions[this.name].bufferView;
    const gltfAttributeMap = primitive.extensions[this.name].attributes;
    const threeAttributeMap = {};
    const attributeNormalizedMap = {};
    const attributeTypeMap = {};
    for (const attributeName in gltfAttributeMap) {
      const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
      threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName];
    }
    for (const attributeName in primitive.attributes) {
      const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
      if (gltfAttributeMap[attributeName] !== void 0) {
        const accessorDef = json.accessors[primitive.attributes[attributeName]];
        const componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
        attributeTypeMap[threeAttributeName] = componentType.name;
        attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true;
      }
    }
    return parser.getDependency("bufferView", bufferViewIndex).then(function(bufferView) {
      return new Promise(function(resolve) {
        dracoLoader.decodeDracoFile(bufferView, function(geometry) {
          for (const attributeName in geometry.attributes) {
            const attribute = geometry.attributes[attributeName];
            const normalized = attributeNormalizedMap[attributeName];
            if (normalized !== void 0)
              attribute.normalized = normalized;
          }
          resolve(geometry);
        }, threeAttributeMap, attributeTypeMap);
      });
    });
  }
};
var GLTFTextureTransformExtension = class {
  constructor() {
    this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(texture, transform) {
    if ((transform.texCoord === void 0 || transform.texCoord === texture.channel) && transform.offset === void 0 && transform.rotation === void 0 && transform.scale === void 0) {
      return texture;
    }
    texture = texture.clone();
    if (transform.texCoord !== void 0) {
      texture.channel = transform.texCoord;
    }
    if (transform.offset !== void 0) {
      texture.offset.fromArray(transform.offset);
    }
    if (transform.rotation !== void 0) {
      texture.rotation = transform.rotation;
    }
    if (transform.scale !== void 0) {
      texture.repeat.fromArray(transform.scale);
    }
    texture.needsUpdate = true;
    return texture;
  }
};
var GLTFMeshQuantizationExtension = class {
  constructor() {
    this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;
  }
};
var GLTFCubicSplineInterpolant = class extends Interpolant {
  constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {
    super(parameterPositions, sampleValues, sampleSize, resultBuffer);
  }
  copySampleValue_(index) {
    const result = this.resultBuffer, values = this.sampleValues, valueSize = this.valueSize, offset = index * valueSize * 3 + valueSize;
    for (let i = 0; i !== valueSize; i++) {
      result[i] = values[offset + i];
    }
    return result;
  }
  interpolate_(i1, t0, t2, t1) {
    const result = this.resultBuffer;
    const values = this.sampleValues;
    const stride = this.valueSize;
    const stride2 = stride * 2;
    const stride3 = stride * 3;
    const td = t1 - t0;
    const p = (t2 - t0) / td;
    const pp = p * p;
    const ppp = pp * p;
    const offset1 = i1 * stride3;
    const offset0 = offset1 - stride3;
    const s2 = -2 * ppp + 3 * pp;
    const s3 = ppp - pp;
    const s0 = 1 - s2;
    const s1 = s3 - pp + p;
    for (let i = 0; i !== stride; i++) {
      const p0 = values[offset0 + i + stride];
      const m0 = values[offset0 + i + stride2] * td;
      const p1 = values[offset1 + i + stride];
      const m1 = values[offset1 + i] * td;
      result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
    }
    return result;
  }
};
var _q = new Quaternion();
var GLTFCubicSplineQuaternionInterpolant = class extends GLTFCubicSplineInterpolant {
  interpolate_(i1, t0, t2, t1) {
    const result = super.interpolate_(i1, t0, t2, t1);
    _q.fromArray(result).normalize().toArray(result);
    return result;
  }
};
var WEBGL_CONSTANTS = {
  FLOAT: 5126,
  //FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123
};
var WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};
var WEBGL_FILTERS = {
  9728: NearestFilter,
  9729: LinearFilter,
  9984: NearestMipmapNearestFilter,
  9985: LinearMipmapNearestFilter,
  9986: NearestMipmapLinearFilter,
  9987: LinearMipmapLinearFilter
};
var WEBGL_WRAPPINGS = {
  33071: ClampToEdgeWrapping,
  33648: MirroredRepeatWrapping,
  10497: RepeatWrapping
};
var WEBGL_TYPE_SIZES = {
  "SCALAR": 1,
  "VEC2": 2,
  "VEC3": 3,
  "VEC4": 4,
  "MAT2": 4,
  "MAT3": 9,
  "MAT4": 16
};
var ATTRIBUTES = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
};
var PATH_PROPERTIES = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
};
var INTERPOLATION = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: InterpolateLinear,
  STEP: InterpolateDiscrete
};
var ALPHA_MODES = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function createDefaultMaterial(cache) {
  if (cache["DefaultMaterial"] === void 0) {
    cache["DefaultMaterial"] = new MeshStandardMaterial({
      color: 16777215,
      emissive: 0,
      metalness: 1,
      roughness: 1,
      transparent: false,
      depthTest: true,
      side: FrontSide
    });
  }
  return cache["DefaultMaterial"];
}
function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
  for (const name in objectDef.extensions) {
    if (knownExtensions[name] === void 0) {
      object.userData.gltfExtensions = object.userData.gltfExtensions || {};
      object.userData.gltfExtensions[name] = objectDef.extensions[name];
    }
  }
}
function assignExtrasToUserData(object, gltfDef) {
  if (gltfDef.extras !== void 0) {
    if (typeof gltfDef.extras === "object") {
      Object.assign(object.userData, gltfDef.extras);
    } else {
      console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + gltfDef.extras);
    }
  }
}
function addMorphTargets(geometry, targets, parser) {
  let hasMorphPosition = false;
  let hasMorphNormal = false;
  let hasMorphColor = false;
  for (let i = 0, il = targets.length; i < il; i++) {
    const target = targets[i];
    if (target.POSITION !== void 0)
      hasMorphPosition = true;
    if (target.NORMAL !== void 0)
      hasMorphNormal = true;
    if (target.COLOR_0 !== void 0)
      hasMorphColor = true;
    if (hasMorphPosition && hasMorphNormal && hasMorphColor)
      break;
  }
  if (!hasMorphPosition && !hasMorphNormal && !hasMorphColor)
    return Promise.resolve(geometry);
  const pendingPositionAccessors = [];
  const pendingNormalAccessors = [];
  const pendingColorAccessors = [];
  for (let i = 0, il = targets.length; i < il; i++) {
    const target = targets[i];
    if (hasMorphPosition) {
      const pendingAccessor = target.POSITION !== void 0 ? parser.getDependency("accessor", target.POSITION) : geometry.attributes.position;
      pendingPositionAccessors.push(pendingAccessor);
    }
    if (hasMorphNormal) {
      const pendingAccessor = target.NORMAL !== void 0 ? parser.getDependency("accessor", target.NORMAL) : geometry.attributes.normal;
      pendingNormalAccessors.push(pendingAccessor);
    }
    if (hasMorphColor) {
      const pendingAccessor = target.COLOR_0 !== void 0 ? parser.getDependency("accessor", target.COLOR_0) : geometry.attributes.color;
      pendingColorAccessors.push(pendingAccessor);
    }
  }
  return Promise.all([
    Promise.all(pendingPositionAccessors),
    Promise.all(pendingNormalAccessors),
    Promise.all(pendingColorAccessors)
  ]).then(function(accessors) {
    const morphPositions = accessors[0];
    const morphNormals = accessors[1];
    const morphColors = accessors[2];
    if (hasMorphPosition)
      geometry.morphAttributes.position = morphPositions;
    if (hasMorphNormal)
      geometry.morphAttributes.normal = morphNormals;
    if (hasMorphColor)
      geometry.morphAttributes.color = morphColors;
    geometry.morphTargetsRelative = true;
    return geometry;
  });
}
function updateMorphTargets(mesh2, meshDef) {
  mesh2.updateMorphTargets();
  if (meshDef.weights !== void 0) {
    for (let i = 0, il = meshDef.weights.length; i < il; i++) {
      mesh2.morphTargetInfluences[i] = meshDef.weights[i];
    }
  }
  if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
    const targetNames = meshDef.extras.targetNames;
    if (mesh2.morphTargetInfluences.length === targetNames.length) {
      mesh2.morphTargetDictionary = {};
      for (let i = 0, il = targetNames.length; i < il; i++) {
        mesh2.morphTargetDictionary[targetNames[i]] = i;
      }
    } else {
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
    }
  }
}
function createPrimitiveKey(primitiveDef) {
  let geometryKey;
  const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
  if (dracoExtension) {
    geometryKey = "draco:" + dracoExtension.bufferView + ":" + dracoExtension.indices + ":" + createAttributesKey(dracoExtension.attributes);
  } else {
    geometryKey = primitiveDef.indices + ":" + createAttributesKey(primitiveDef.attributes) + ":" + primitiveDef.mode;
  }
  if (primitiveDef.targets !== void 0) {
    for (let i = 0, il = primitiveDef.targets.length; i < il; i++) {
      geometryKey += ":" + createAttributesKey(primitiveDef.targets[i]);
    }
  }
  return geometryKey;
}
function createAttributesKey(attributes) {
  let attributesKey = "";
  const keys = Object.keys(attributes).sort();
  for (let i = 0, il = keys.length; i < il; i++) {
    attributesKey += keys[i] + ":" + attributes[keys[i]] + ";";
  }
  return attributesKey;
}
function getNormalizedComponentScale(constructor) {
  switch (constructor) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function getImageURIMimeType(uri) {
  if (uri.search(/\.jpe?g($|\?)/i) > 0 || uri.search(/^data\:image\/jpeg/) === 0)
    return "image/jpeg";
  if (uri.search(/\.webp($|\?)/i) > 0 || uri.search(/^data\:image\/webp/) === 0)
    return "image/webp";
  return "image/png";
}
var _identityMatrix = new Matrix4();
var GLTFParser = class {
  constructor(json = {}, options = {}) {
    this.json = json;
    this.extensions = {};
    this.plugins = {};
    this.options = options;
    this.cache = new GLTFRegistry();
    this.associations = /* @__PURE__ */ new Map();
    this.primitiveCache = {};
    this.nodeCache = {};
    this.meshCache = { refs: {}, uses: {} };
    this.cameraCache = { refs: {}, uses: {} };
    this.lightCache = { refs: {}, uses: {} };
    this.sourceCache = {};
    this.textureCache = {};
    this.nodeNamesUsed = {};
    let isSafari2 = false;
    let isFirefox2 = false;
    let firefoxVersion = -1;
    if (typeof navigator !== "undefined") {
      isSafari2 = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === true;
      isFirefox2 = navigator.userAgent.indexOf("Firefox") > -1;
      firefoxVersion = isFirefox2 ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    if (typeof createImageBitmap === "undefined" || isSafari2 || isFirefox2 && firefoxVersion < 98) {
      this.textureLoader = new TextureLoader(this.options.manager);
    } else {
      this.textureLoader = new ImageBitmapLoader(this.options.manager);
    }
    this.textureLoader.setCrossOrigin(this.options.crossOrigin);
    this.textureLoader.setRequestHeader(this.options.requestHeader);
    this.fileLoader = new FileLoader(this.options.manager);
    this.fileLoader.setResponseType("arraybuffer");
    if (this.options.crossOrigin === "use-credentials") {
      this.fileLoader.setWithCredentials(true);
    }
  }
  setExtensions(extensions) {
    this.extensions = extensions;
  }
  setPlugins(plugins) {
    this.plugins = plugins;
  }
  parse(onLoad, onError) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;
    this.cache.removeAll();
    this.nodeCache = {};
    this._invokeAll(function(ext) {
      return ext._markDefs && ext._markDefs();
    });
    Promise.all(this._invokeAll(function(ext) {
      return ext.beforeRoot && ext.beforeRoot();
    })).then(function() {
      return Promise.all([
        parser.getDependencies("scene"),
        parser.getDependencies("animation"),
        parser.getDependencies("camera")
      ]);
    }).then(function(dependencies) {
      const result = {
        scene: dependencies[0][json.scene || 0],
        scenes: dependencies[0],
        animations: dependencies[1],
        cameras: dependencies[2],
        asset: json.asset,
        parser,
        userData: {}
      };
      addUnknownExtensionsToUserData(extensions, result, json);
      assignExtrasToUserData(result, json);
      Promise.all(parser._invokeAll(function(ext) {
        return ext.afterRoot && ext.afterRoot(result);
      })).then(function() {
        onLoad(result);
      });
    }).catch(onError);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  _markDefs() {
    const nodeDefs = this.json.nodes || [];
    const skinDefs = this.json.skins || [];
    const meshDefs = this.json.meshes || [];
    for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
      const joints = skinDefs[skinIndex].joints;
      for (let i = 0, il = joints.length; i < il; i++) {
        nodeDefs[joints[i]].isBone = true;
      }
    }
    for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
      const nodeDef = nodeDefs[nodeIndex];
      if (nodeDef.mesh !== void 0) {
        this._addNodeRef(this.meshCache, nodeDef.mesh);
        if (nodeDef.skin !== void 0) {
          meshDefs[nodeDef.mesh].isSkinnedMesh = true;
        }
      }
      if (nodeDef.camera !== void 0) {
        this._addNodeRef(this.cameraCache, nodeDef.camera);
      }
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  _addNodeRef(cache, index) {
    if (index === void 0)
      return;
    if (cache.refs[index] === void 0) {
      cache.refs[index] = cache.uses[index] = 0;
    }
    cache.refs[index]++;
  }
  /** Returns a reference to a shared resource, cloning it if necessary. */
  _getNodeRef(cache, index, object) {
    if (cache.refs[index] <= 1)
      return object;
    const ref = object.clone();
    const updateMappings = (original, clone4) => {
      const mappings = this.associations.get(original);
      if (mappings != null) {
        this.associations.set(clone4, mappings);
      }
      for (const [i, child] of original.children.entries()) {
        updateMappings(child, clone4.children[i]);
      }
    };
    updateMappings(object, ref);
    ref.name += "_instance_" + cache.uses[index]++;
    return ref;
  }
  _invokeOne(func) {
    const extensions = Object.values(this.plugins);
    extensions.push(this);
    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);
      if (result)
        return result;
    }
    return null;
  }
  _invokeAll(func) {
    const extensions = Object.values(this.plugins);
    extensions.unshift(this);
    const pending = [];
    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);
      if (result)
        pending.push(result);
    }
    return pending;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(type2, index) {
    const cacheKey = type2 + ":" + index;
    let dependency = this.cache.get(cacheKey);
    if (!dependency) {
      switch (type2) {
        case "scene":
          dependency = this.loadScene(index);
          break;
        case "node":
          dependency = this._invokeOne(function(ext) {
            return ext.loadNode && ext.loadNode(index);
          });
          break;
        case "mesh":
          dependency = this._invokeOne(function(ext) {
            return ext.loadMesh && ext.loadMesh(index);
          });
          break;
        case "accessor":
          dependency = this.loadAccessor(index);
          break;
        case "bufferView":
          dependency = this._invokeOne(function(ext) {
            return ext.loadBufferView && ext.loadBufferView(index);
          });
          break;
        case "buffer":
          dependency = this.loadBuffer(index);
          break;
        case "material":
          dependency = this._invokeOne(function(ext) {
            return ext.loadMaterial && ext.loadMaterial(index);
          });
          break;
        case "texture":
          dependency = this._invokeOne(function(ext) {
            return ext.loadTexture && ext.loadTexture(index);
          });
          break;
        case "skin":
          dependency = this.loadSkin(index);
          break;
        case "animation":
          dependency = this._invokeOne(function(ext) {
            return ext.loadAnimation && ext.loadAnimation(index);
          });
          break;
        case "camera":
          dependency = this.loadCamera(index);
          break;
        default:
          dependency = this._invokeOne(function(ext) {
            return ext != this && ext.getDependency && ext.getDependency(type2, index);
          });
          if (!dependency) {
            throw new Error("Unknown type: " + type2);
          }
          break;
      }
      this.cache.add(cacheKey, dependency);
    }
    return dependency;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(type2) {
    let dependencies = this.cache.get(type2);
    if (!dependencies) {
      const parser = this;
      const defs = this.json[type2 + (type2 === "mesh" ? "es" : "s")] || [];
      dependencies = Promise.all(defs.map(function(def, index) {
        return parser.getDependency(type2, index);
      }));
      this.cache.add(type2, dependencies);
    }
    return dependencies;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(bufferIndex) {
    const bufferDef = this.json.buffers[bufferIndex];
    const loader = this.fileLoader;
    if (bufferDef.type && bufferDef.type !== "arraybuffer") {
      throw new Error("THREE.GLTFLoader: " + bufferDef.type + " buffer type is not supported.");
    }
    if (bufferDef.uri === void 0 && bufferIndex === 0) {
      return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
    }
    const options = this.options;
    return new Promise(function(resolve, reject) {
      loader.load(LoaderUtils.resolveURL(bufferDef.uri, options.path), resolve, void 0, function() {
        reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(bufferViewIndex) {
    const bufferViewDef = this.json.bufferViews[bufferViewIndex];
    return this.getDependency("buffer", bufferViewDef.buffer).then(function(buffer) {
      const byteLength = bufferViewDef.byteLength || 0;
      const byteOffset = bufferViewDef.byteOffset || 0;
      return buffer.slice(byteOffset, byteOffset + byteLength);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(accessorIndex) {
    const parser = this;
    const json = this.json;
    const accessorDef = this.json.accessors[accessorIndex];
    if (accessorDef.bufferView === void 0 && accessorDef.sparse === void 0) {
      const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
      const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
      const normalized = accessorDef.normalized === true;
      const array = new TypedArray(accessorDef.count * itemSize);
      return Promise.resolve(new BufferAttribute(array, itemSize, normalized));
    }
    const pendingBufferViews = [];
    if (accessorDef.bufferView !== void 0) {
      pendingBufferViews.push(this.getDependency("bufferView", accessorDef.bufferView));
    } else {
      pendingBufferViews.push(null);
    }
    if (accessorDef.sparse !== void 0) {
      pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.indices.bufferView));
      pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.values.bufferView));
    }
    return Promise.all(pendingBufferViews).then(function(bufferViews) {
      const bufferView = bufferViews[0];
      const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
      const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
      const elementBytes = TypedArray.BYTES_PER_ELEMENT;
      const itemBytes = elementBytes * itemSize;
      const byteOffset = accessorDef.byteOffset || 0;
      const byteStride = accessorDef.bufferView !== void 0 ? json.bufferViews[accessorDef.bufferView].byteStride : void 0;
      const normalized = accessorDef.normalized === true;
      let array, bufferAttribute;
      if (byteStride && byteStride !== itemBytes) {
        const ibSlice = Math.floor(byteOffset / byteStride);
        const ibCacheKey = "InterleavedBuffer:" + accessorDef.bufferView + ":" + accessorDef.componentType + ":" + ibSlice + ":" + accessorDef.count;
        let ib = parser.cache.get(ibCacheKey);
        if (!ib) {
          array = new TypedArray(bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes);
          ib = new InterleavedBuffer(array, byteStride / elementBytes);
          parser.cache.add(ibCacheKey, ib);
        }
        bufferAttribute = new InterleavedBufferAttribute(ib, itemSize, byteOffset % byteStride / elementBytes, normalized);
      } else {
        if (bufferView === null) {
          array = new TypedArray(accessorDef.count * itemSize);
        } else {
          array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
        }
        bufferAttribute = new BufferAttribute(array, itemSize, normalized);
      }
      if (accessorDef.sparse !== void 0) {
        const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
        const TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
        const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
        const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
        const sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
        const sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
        if (bufferView !== null) {
          bufferAttribute = new BufferAttribute(bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized);
        }
        for (let i = 0, il = sparseIndices.length; i < il; i++) {
          const index = sparseIndices[i];
          bufferAttribute.setX(index, sparseValues[i * itemSize]);
          if (itemSize >= 2)
            bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
          if (itemSize >= 3)
            bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
          if (itemSize >= 4)
            bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
          if (itemSize >= 5)
            throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
      }
      return bufferAttribute;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(textureIndex) {
    const json = this.json;
    const options = this.options;
    const textureDef = json.textures[textureIndex];
    const sourceIndex = textureDef.source;
    const sourceDef = json.images[sourceIndex];
    let loader = this.textureLoader;
    if (sourceDef.uri) {
      const handler = options.manager.getHandler(sourceDef.uri);
      if (handler !== null)
        loader = handler;
    }
    return this.loadTextureImage(textureIndex, sourceIndex, loader);
  }
  loadTextureImage(textureIndex, sourceIndex, loader) {
    const parser = this;
    const json = this.json;
    const textureDef = json.textures[textureIndex];
    const sourceDef = json.images[sourceIndex];
    const cacheKey = (sourceDef.uri || sourceDef.bufferView) + ":" + textureDef.sampler;
    if (this.textureCache[cacheKey]) {
      return this.textureCache[cacheKey];
    }
    const promise = this.loadImageSource(sourceIndex, loader).then(function(texture) {
      texture.flipY = false;
      texture.name = textureDef.name || sourceDef.name || "";
      if (texture.name === "" && typeof sourceDef.uri === "string" && sourceDef.uri.startsWith("data:image/") === false) {
        texture.name = sourceDef.uri;
      }
      const samplers = json.samplers || {};
      const sampler = samplers[textureDef.sampler] || {};
      texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || LinearFilter;
      texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || LinearMipmapLinearFilter;
      texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || RepeatWrapping;
      texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || RepeatWrapping;
      parser.associations.set(texture, { textures: textureIndex });
      return texture;
    }).catch(function() {
      return null;
    });
    this.textureCache[cacheKey] = promise;
    return promise;
  }
  loadImageSource(sourceIndex, loader) {
    const parser = this;
    const json = this.json;
    const options = this.options;
    if (this.sourceCache[sourceIndex] !== void 0) {
      return this.sourceCache[sourceIndex].then((texture) => texture.clone());
    }
    const sourceDef = json.images[sourceIndex];
    const URL2 = self.URL || self.webkitURL;
    let sourceURI = sourceDef.uri || "";
    let isObjectURL = false;
    if (sourceDef.bufferView !== void 0) {
      sourceURI = parser.getDependency("bufferView", sourceDef.bufferView).then(function(bufferView) {
        isObjectURL = true;
        const blob = new Blob([bufferView], { type: sourceDef.mimeType });
        sourceURI = URL2.createObjectURL(blob);
        return sourceURI;
      });
    } else if (sourceDef.uri === void 0) {
      throw new Error("THREE.GLTFLoader: Image " + sourceIndex + " is missing URI and bufferView");
    }
    const promise = Promise.resolve(sourceURI).then(function(sourceURI2) {
      return new Promise(function(resolve, reject) {
        let onLoad = resolve;
        if (loader.isImageBitmapLoader === true) {
          onLoad = function(imageBitmap) {
            const texture = new Texture(imageBitmap);
            texture.needsUpdate = true;
            resolve(texture);
          };
        }
        loader.load(LoaderUtils.resolveURL(sourceURI2, options.path), onLoad, void 0, reject);
      });
    }).then(function(texture) {
      if (isObjectURL === true) {
        URL2.revokeObjectURL(sourceURI);
      }
      texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType(sourceDef.uri);
      return texture;
    }).catch(function(error) {
      console.error("THREE.GLTFLoader: Couldn't load texture", sourceURI);
      throw error;
    });
    this.sourceCache[sourceIndex] = promise;
    return promise;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise<Texture>}
   */
  assignTexture(materialParams, mapName, mapDef, colorSpace) {
    const parser = this;
    return this.getDependency("texture", mapDef.index).then(function(texture) {
      if (!texture)
        return null;
      if (mapDef.texCoord !== void 0 && mapDef.texCoord > 0) {
        texture = texture.clone();
        texture.channel = mapDef.texCoord;
      }
      if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
        const transform = mapDef.extensions !== void 0 ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : void 0;
        if (transform) {
          const gltfReference = parser.associations.get(texture);
          texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform);
          parser.associations.set(texture, gltfReference);
        }
      }
      if (colorSpace !== void 0) {
        texture.colorSpace = colorSpace;
      }
      materialParams[mapName] = texture;
      return texture;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(mesh2) {
    const geometry = mesh2.geometry;
    let material = mesh2.material;
    const useDerivativeTangents = geometry.attributes.tangent === void 0;
    const useVertexColors = geometry.attributes.color !== void 0;
    const useFlatShading = geometry.attributes.normal === void 0;
    if (mesh2.isPoints) {
      const cacheKey = "PointsMaterial:" + material.uuid;
      let pointsMaterial = this.cache.get(cacheKey);
      if (!pointsMaterial) {
        pointsMaterial = new PointsMaterial();
        Material.prototype.copy.call(pointsMaterial, material);
        pointsMaterial.color.copy(material.color);
        pointsMaterial.map = material.map;
        pointsMaterial.sizeAttenuation = false;
        this.cache.add(cacheKey, pointsMaterial);
      }
      material = pointsMaterial;
    } else if (mesh2.isLine) {
      const cacheKey = "LineBasicMaterial:" + material.uuid;
      let lineMaterial = this.cache.get(cacheKey);
      if (!lineMaterial) {
        lineMaterial = new LineBasicMaterial();
        Material.prototype.copy.call(lineMaterial, material);
        lineMaterial.color.copy(material.color);
        lineMaterial.map = material.map;
        this.cache.add(cacheKey, lineMaterial);
      }
      material = lineMaterial;
    }
    if (useDerivativeTangents || useVertexColors || useFlatShading) {
      let cacheKey = "ClonedMaterial:" + material.uuid + ":";
      if (useDerivativeTangents)
        cacheKey += "derivative-tangents:";
      if (useVertexColors)
        cacheKey += "vertex-colors:";
      if (useFlatShading)
        cacheKey += "flat-shading:";
      let cachedMaterial = this.cache.get(cacheKey);
      if (!cachedMaterial) {
        cachedMaterial = material.clone();
        if (useVertexColors)
          cachedMaterial.vertexColors = true;
        if (useFlatShading)
          cachedMaterial.flatShading = true;
        if (useDerivativeTangents) {
          if (cachedMaterial.normalScale)
            cachedMaterial.normalScale.y *= -1;
          if (cachedMaterial.clearcoatNormalScale)
            cachedMaterial.clearcoatNormalScale.y *= -1;
        }
        this.cache.add(cacheKey, cachedMaterial);
        this.associations.set(cachedMaterial, this.associations.get(material));
      }
      material = cachedMaterial;
    }
    mesh2.material = material;
  }
  getMaterialType() {
    return MeshStandardMaterial;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(materialIndex) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;
    const materialDef = json.materials[materialIndex];
    let materialType;
    const materialParams = {};
    const materialExtensions = materialDef.extensions || {};
    const pending = [];
    if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
      const kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
      materialType = kmuExtension.getMaterialType();
      pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
    } else {
      const metallicRoughness = materialDef.pbrMetallicRoughness || {};
      materialParams.color = new Color(1, 1, 1);
      materialParams.opacity = 1;
      if (Array.isArray(metallicRoughness.baseColorFactor)) {
        const array = metallicRoughness.baseColorFactor;
        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];
      }
      if (metallicRoughness.baseColorTexture !== void 0) {
        pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture, SRGBColorSpace));
      }
      materialParams.metalness = metallicRoughness.metallicFactor !== void 0 ? metallicRoughness.metallicFactor : 1;
      materialParams.roughness = metallicRoughness.roughnessFactor !== void 0 ? metallicRoughness.roughnessFactor : 1;
      if (metallicRoughness.metallicRoughnessTexture !== void 0) {
        pending.push(parser.assignTexture(materialParams, "metalnessMap", metallicRoughness.metallicRoughnessTexture));
        pending.push(parser.assignTexture(materialParams, "roughnessMap", metallicRoughness.metallicRoughnessTexture));
      }
      materialType = this._invokeOne(function(ext) {
        return ext.getMaterialType && ext.getMaterialType(materialIndex);
      });
      pending.push(Promise.all(this._invokeAll(function(ext) {
        return ext.extendMaterialParams && ext.extendMaterialParams(materialIndex, materialParams);
      })));
    }
    if (materialDef.doubleSided === true) {
      materialParams.side = DoubleSide;
    }
    const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
    if (alphaMode === ALPHA_MODES.BLEND) {
      materialParams.transparent = true;
      materialParams.depthWrite = false;
    } else {
      materialParams.transparent = false;
      if (alphaMode === ALPHA_MODES.MASK) {
        materialParams.alphaTest = materialDef.alphaCutoff !== void 0 ? materialDef.alphaCutoff : 0.5;
      }
    }
    if (materialDef.normalTexture !== void 0 && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, "normalMap", materialDef.normalTexture));
      materialParams.normalScale = new Vector2(1, 1);
      if (materialDef.normalTexture.scale !== void 0) {
        const scale3 = materialDef.normalTexture.scale;
        materialParams.normalScale.set(scale3, scale3);
      }
    }
    if (materialDef.occlusionTexture !== void 0 && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, "aoMap", materialDef.occlusionTexture));
      if (materialDef.occlusionTexture.strength !== void 0) {
        materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
      }
    }
    if (materialDef.emissiveFactor !== void 0 && materialType !== MeshBasicMaterial) {
      materialParams.emissive = new Color().fromArray(materialDef.emissiveFactor);
    }
    if (materialDef.emissiveTexture !== void 0 && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, "emissiveMap", materialDef.emissiveTexture, SRGBColorSpace));
    }
    return Promise.all(pending).then(function() {
      const material = new materialType(materialParams);
      if (materialDef.name)
        material.name = materialDef.name;
      assignExtrasToUserData(material, materialDef);
      parser.associations.set(material, { materials: materialIndex });
      if (materialDef.extensions)
        addUnknownExtensionsToUserData(extensions, material, materialDef);
      return material;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(originalName) {
    const sanitizedName = PropertyBinding.sanitizeNodeName(originalName || "");
    if (sanitizedName in this.nodeNamesUsed) {
      return sanitizedName + "_" + ++this.nodeNamesUsed[sanitizedName];
    } else {
      this.nodeNamesUsed[sanitizedName] = 0;
      return sanitizedName;
    }
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(primitives) {
    const parser = this;
    const extensions = this.extensions;
    const cache = this.primitiveCache;
    function createDracoPrimitive(primitive) {
      return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(primitive, parser).then(function(geometry) {
        return addPrimitiveAttributes(geometry, primitive, parser);
      });
    }
    const pending = [];
    for (let i = 0, il = primitives.length; i < il; i++) {
      const primitive = primitives[i];
      const cacheKey = createPrimitiveKey(primitive);
      const cached = cache[cacheKey];
      if (cached) {
        pending.push(cached.promise);
      } else {
        let geometryPromise;
        if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
          geometryPromise = createDracoPrimitive(primitive);
        } else {
          geometryPromise = addPrimitiveAttributes(new BufferGeometry(), primitive, parser);
        }
        cache[cacheKey] = { primitive, promise: geometryPromise };
        pending.push(geometryPromise);
      }
    }
    return Promise.all(pending);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  loadMesh(meshIndex) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;
    const meshDef = json.meshes[meshIndex];
    const primitives = meshDef.primitives;
    const pending = [];
    for (let i = 0, il = primitives.length; i < il; i++) {
      const material = primitives[i].material === void 0 ? createDefaultMaterial(this.cache) : this.getDependency("material", primitives[i].material);
      pending.push(material);
    }
    pending.push(parser.loadGeometries(primitives));
    return Promise.all(pending).then(function(results) {
      const materials2 = results.slice(0, results.length - 1);
      const geometries = results[results.length - 1];
      const meshes = [];
      for (let i = 0, il = geometries.length; i < il; i++) {
        const geometry = geometries[i];
        const primitive = primitives[i];
        let mesh2;
        const material = materials2[i];
        if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN || primitive.mode === void 0) {
          mesh2 = meshDef.isSkinnedMesh === true ? new SkinnedMesh(geometry, material) : new Mesh(geometry, material);
          if (mesh2.isSkinnedMesh === true) {
            mesh2.normalizeSkinWeights();
          }
          if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
            mesh2.geometry = toTrianglesDrawMode(mesh2.geometry, TriangleStripDrawMode);
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
            mesh2.geometry = toTrianglesDrawMode(mesh2.geometry, TriangleFanDrawMode);
          }
        } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
          mesh2 = new LineSegments(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
          mesh2 = new Line(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
          mesh2 = new LineLoop(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
          mesh2 = new Points(geometry, material);
        } else {
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + primitive.mode);
        }
        if (Object.keys(mesh2.geometry.morphAttributes).length > 0) {
          updateMorphTargets(mesh2, meshDef);
        }
        mesh2.name = parser.createUniqueName(meshDef.name || "mesh_" + meshIndex);
        assignExtrasToUserData(mesh2, meshDef);
        if (primitive.extensions)
          addUnknownExtensionsToUserData(extensions, mesh2, primitive);
        parser.assignFinalMaterial(mesh2);
        meshes.push(mesh2);
      }
      for (let i = 0, il = meshes.length; i < il; i++) {
        parser.associations.set(meshes[i], {
          meshes: meshIndex,
          primitives: i
        });
      }
      if (meshes.length === 1) {
        if (meshDef.extensions)
          addUnknownExtensionsToUserData(extensions, meshes[0], meshDef);
        return meshes[0];
      }
      const group = new Group();
      if (meshDef.extensions)
        addUnknownExtensionsToUserData(extensions, group, meshDef);
      parser.associations.set(group, { meshes: meshIndex });
      for (let i = 0, il = meshes.length; i < il; i++) {
        group.add(meshes[i]);
      }
      return group;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(cameraIndex) {
    let camera;
    const cameraDef = this.json.cameras[cameraIndex];
    const params = cameraDef[cameraDef.type];
    if (!params) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    if (cameraDef.type === "perspective") {
      camera = new PerspectiveCamera(MathUtils.radToDeg(params.yfov), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6);
    } else if (cameraDef.type === "orthographic") {
      camera = new OrthographicCamera(-params.xmag, params.xmag, params.ymag, -params.ymag, params.znear, params.zfar);
    }
    if (cameraDef.name)
      camera.name = this.createUniqueName(cameraDef.name);
    assignExtrasToUserData(camera, cameraDef);
    return Promise.resolve(camera);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(skinIndex) {
    const skinDef = this.json.skins[skinIndex];
    const pending = [];
    for (let i = 0, il = skinDef.joints.length; i < il; i++) {
      pending.push(this._loadNodeShallow(skinDef.joints[i]));
    }
    if (skinDef.inverseBindMatrices !== void 0) {
      pending.push(this.getDependency("accessor", skinDef.inverseBindMatrices));
    } else {
      pending.push(null);
    }
    return Promise.all(pending).then(function(results) {
      const inverseBindMatrices = results.pop();
      const jointNodes = results;
      const bones = [];
      const boneInverses = [];
      for (let i = 0, il = jointNodes.length; i < il; i++) {
        const jointNode = jointNodes[i];
        if (jointNode) {
          bones.push(jointNode);
          const mat = new Matrix4();
          if (inverseBindMatrices !== null) {
            mat.fromArray(inverseBindMatrices.array, i * 16);
          }
          boneInverses.push(mat);
        } else {
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', skinDef.joints[i]);
        }
      }
      return new Skeleton(bones, boneInverses);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(animationIndex) {
    const json = this.json;
    const animationDef = json.animations[animationIndex];
    const animationName = animationDef.name ? animationDef.name : "animation_" + animationIndex;
    const pendingNodes = [];
    const pendingInputAccessors = [];
    const pendingOutputAccessors = [];
    const pendingSamplers = [];
    const pendingTargets = [];
    for (let i = 0, il = animationDef.channels.length; i < il; i++) {
      const channel = animationDef.channels[i];
      const sampler = animationDef.samplers[channel.sampler];
      const target = channel.target;
      const name = target.node;
      const input = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.input] : sampler.input;
      const output = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.output] : sampler.output;
      if (target.node === void 0)
        continue;
      pendingNodes.push(this.getDependency("node", name));
      pendingInputAccessors.push(this.getDependency("accessor", input));
      pendingOutputAccessors.push(this.getDependency("accessor", output));
      pendingSamplers.push(sampler);
      pendingTargets.push(target);
    }
    return Promise.all([
      Promise.all(pendingNodes),
      Promise.all(pendingInputAccessors),
      Promise.all(pendingOutputAccessors),
      Promise.all(pendingSamplers),
      Promise.all(pendingTargets)
    ]).then(function(dependencies) {
      const nodes = dependencies[0];
      const inputAccessors = dependencies[1];
      const outputAccessors = dependencies[2];
      const samplers = dependencies[3];
      const targets = dependencies[4];
      const tracks = [];
      for (let i = 0, il = nodes.length; i < il; i++) {
        const node = nodes[i];
        const inputAccessor = inputAccessors[i];
        const outputAccessor = outputAccessors[i];
        const sampler = samplers[i];
        const target = targets[i];
        if (node === void 0)
          continue;
        node.updateMatrix();
        let TypedKeyframeTrack;
        switch (PATH_PROPERTIES[target.path]) {
          case PATH_PROPERTIES.weights:
            TypedKeyframeTrack = NumberKeyframeTrack;
            break;
          case PATH_PROPERTIES.rotation:
            TypedKeyframeTrack = QuaternionKeyframeTrack;
            break;
          case PATH_PROPERTIES.position:
          case PATH_PROPERTIES.scale:
          default:
            TypedKeyframeTrack = VectorKeyframeTrack;
            break;
        }
        const targetName = node.name ? node.name : node.uuid;
        const interpolation = sampler.interpolation !== void 0 ? INTERPOLATION[sampler.interpolation] : InterpolateLinear;
        const targetNames = [];
        if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
          node.traverse(function(object) {
            if (object.morphTargetInfluences) {
              targetNames.push(object.name ? object.name : object.uuid);
            }
          });
        } else {
          targetNames.push(targetName);
        }
        let outputArray = outputAccessor.array;
        if (outputAccessor.normalized) {
          const scale3 = getNormalizedComponentScale(outputArray.constructor);
          const scaled = new Float32Array(outputArray.length);
          for (let j = 0, jl = outputArray.length; j < jl; j++) {
            scaled[j] = outputArray[j] * scale3;
          }
          outputArray = scaled;
        }
        for (let j = 0, jl = targetNames.length; j < jl; j++) {
          const track = new TypedKeyframeTrack(
            targetNames[j] + "." + PATH_PROPERTIES[target.path],
            inputAccessor.array,
            outputArray,
            interpolation
          );
          if (sampler.interpolation === "CUBICSPLINE") {
            track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
              const interpolantType = this instanceof QuaternionKeyframeTrack ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;
              return new interpolantType(this.times, this.values, this.getValueSize() / 3, result);
            };
            track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
          }
          tracks.push(track);
        }
      }
      return new AnimationClip(animationName, void 0, tracks);
    });
  }
  createNodeMesh(nodeIndex) {
    const json = this.json;
    const parser = this;
    const nodeDef = json.nodes[nodeIndex];
    if (nodeDef.mesh === void 0)
      return null;
    return parser.getDependency("mesh", nodeDef.mesh).then(function(mesh2) {
      const node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh2);
      if (nodeDef.weights !== void 0) {
        node.traverse(function(o) {
          if (!o.isMesh)
            return;
          for (let i = 0, il = nodeDef.weights.length; i < il; i++) {
            o.morphTargetInfluences[i] = nodeDef.weights[i];
          }
        });
      }
      return node;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(nodeIndex) {
    const json = this.json;
    const parser = this;
    const nodeDef = json.nodes[nodeIndex];
    const nodePending = parser._loadNodeShallow(nodeIndex);
    const childPending = [];
    const childrenDef = nodeDef.children || [];
    for (let i = 0, il = childrenDef.length; i < il; i++) {
      childPending.push(parser.getDependency("node", childrenDef[i]));
    }
    const skeletonPending = nodeDef.skin === void 0 ? Promise.resolve(null) : parser.getDependency("skin", nodeDef.skin);
    return Promise.all([
      nodePending,
      Promise.all(childPending),
      skeletonPending
    ]).then(function(results) {
      const node = results[0];
      const children = results[1];
      const skeleton = results[2];
      if (skeleton !== null) {
        node.traverse(function(mesh2) {
          if (!mesh2.isSkinnedMesh)
            return;
          mesh2.bind(skeleton, _identityMatrix);
        });
      }
      for (let i = 0, il = children.length; i < il; i++) {
        node.add(children[i]);
      }
      return node;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(nodeIndex) {
    const json = this.json;
    const extensions = this.extensions;
    const parser = this;
    if (this.nodeCache[nodeIndex] !== void 0) {
      return this.nodeCache[nodeIndex];
    }
    const nodeDef = json.nodes[nodeIndex];
    const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : "";
    const pending = [];
    const meshPromise = parser._invokeOne(function(ext) {
      return ext.createNodeMesh && ext.createNodeMesh(nodeIndex);
    });
    if (meshPromise) {
      pending.push(meshPromise);
    }
    if (nodeDef.camera !== void 0) {
      pending.push(parser.getDependency("camera", nodeDef.camera).then(function(camera) {
        return parser._getNodeRef(parser.cameraCache, nodeDef.camera, camera);
      }));
    }
    parser._invokeAll(function(ext) {
      return ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex);
    }).forEach(function(promise) {
      pending.push(promise);
    });
    this.nodeCache[nodeIndex] = Promise.all(pending).then(function(objects) {
      let node;
      if (nodeDef.isBone === true) {
        node = new Bone();
      } else if (objects.length > 1) {
        node = new Group();
      } else if (objects.length === 1) {
        node = objects[0];
      } else {
        node = new Object3D();
      }
      if (node !== objects[0]) {
        for (let i = 0, il = objects.length; i < il; i++) {
          node.add(objects[i]);
        }
      }
      if (nodeDef.name) {
        node.userData.name = nodeDef.name;
        node.name = nodeName;
      }
      assignExtrasToUserData(node, nodeDef);
      if (nodeDef.extensions)
        addUnknownExtensionsToUserData(extensions, node, nodeDef);
      if (nodeDef.matrix !== void 0) {
        const matrix = new Matrix4();
        matrix.fromArray(nodeDef.matrix);
        node.applyMatrix4(matrix);
      } else {
        if (nodeDef.translation !== void 0) {
          node.position.fromArray(nodeDef.translation);
        }
        if (nodeDef.rotation !== void 0) {
          node.quaternion.fromArray(nodeDef.rotation);
        }
        if (nodeDef.scale !== void 0) {
          node.scale.fromArray(nodeDef.scale);
        }
      }
      if (!parser.associations.has(node)) {
        parser.associations.set(node, {});
      }
      parser.associations.get(node).nodes = nodeIndex;
      return node;
    });
    return this.nodeCache[nodeIndex];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(sceneIndex) {
    const extensions = this.extensions;
    const sceneDef = this.json.scenes[sceneIndex];
    const parser = this;
    const scene = new Group();
    if (sceneDef.name)
      scene.name = parser.createUniqueName(sceneDef.name);
    assignExtrasToUserData(scene, sceneDef);
    if (sceneDef.extensions)
      addUnknownExtensionsToUserData(extensions, scene, sceneDef);
    const nodeIds = sceneDef.nodes || [];
    const pending = [];
    for (let i = 0, il = nodeIds.length; i < il; i++) {
      pending.push(parser.getDependency("node", nodeIds[i]));
    }
    return Promise.all(pending).then(function(nodes) {
      for (let i = 0, il = nodes.length; i < il; i++) {
        scene.add(nodes[i]);
      }
      const reduceAssociations = (node) => {
        const reducedAssociations = /* @__PURE__ */ new Map();
        for (const [key, value] of parser.associations) {
          if (key instanceof Material || key instanceof Texture) {
            reducedAssociations.set(key, value);
          }
        }
        node.traverse((node2) => {
          const mappings = parser.associations.get(node2);
          if (mappings != null) {
            reducedAssociations.set(node2, mappings);
          }
        });
        return reducedAssociations;
      };
      parser.associations = reduceAssociations(scene);
      return scene;
    });
  }
};
function computeBounds(geometry, primitiveDef, parser) {
  const attributes = primitiveDef.attributes;
  const box = new Box3();
  if (attributes.POSITION !== void 0) {
    const accessor = parser.json.accessors[attributes.POSITION];
    const min = accessor.min;
    const max = accessor.max;
    if (min !== void 0 && max !== void 0) {
      box.set(
        new Vector3(min[0], min[1], min[2]),
        new Vector3(max[0], max[1], max[2])
      );
      if (accessor.normalized) {
        const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
        box.min.multiplyScalar(boxScale);
        box.max.multiplyScalar(boxScale);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else {
    return;
  }
  const targets = primitiveDef.targets;
  if (targets !== void 0) {
    const maxDisplacement = new Vector3();
    const vector = new Vector3();
    for (let i = 0, il = targets.length; i < il; i++) {
      const target = targets[i];
      if (target.POSITION !== void 0) {
        const accessor = parser.json.accessors[target.POSITION];
        const min = accessor.min;
        const max = accessor.max;
        if (min !== void 0 && max !== void 0) {
          vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
          vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
          vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));
          if (accessor.normalized) {
            const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
            vector.multiplyScalar(boxScale);
          }
          maxDisplacement.max(vector);
        } else {
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
        }
      }
    }
    box.expandByVector(maxDisplacement);
  }
  geometry.boundingBox = box;
  const sphere = new Sphere();
  box.getCenter(sphere.center);
  sphere.radius = box.min.distanceTo(box.max) / 2;
  geometry.boundingSphere = sphere;
}
function addPrimitiveAttributes(geometry, primitiveDef, parser) {
  const attributes = primitiveDef.attributes;
  const pending = [];
  function assignAttributeAccessor(accessorIndex, attributeName) {
    return parser.getDependency("accessor", accessorIndex).then(function(accessor) {
      geometry.setAttribute(attributeName, accessor);
    });
  }
  for (const gltfAttributeName in attributes) {
    const threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase();
    if (threeAttributeName in geometry.attributes)
      continue;
    pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName));
  }
  if (primitiveDef.indices !== void 0 && !geometry.index) {
    const accessor = parser.getDependency("accessor", primitiveDef.indices).then(function(accessor2) {
      geometry.setIndex(accessor2);
    });
    pending.push(accessor);
  }
  assignExtrasToUserData(geometry, primitiveDef);
  computeBounds(geometry, primitiveDef, parser);
  return Promise.all(pending).then(function() {
    return primitiveDef.targets !== void 0 ? addMorphTargets(geometry, primitiveDef.targets, parser) : geometry;
  });
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/webxr/motion-controllers.module.js
var Constants = {
  Handedness: Object.freeze({
    NONE: "none",
    LEFT: "left",
    RIGHT: "right"
  }),
  ComponentState: Object.freeze({
    DEFAULT: "default",
    TOUCHED: "touched",
    PRESSED: "pressed"
  }),
  ComponentProperty: Object.freeze({
    BUTTON: "button",
    X_AXIS: "xAxis",
    Y_AXIS: "yAxis",
    STATE: "state"
  }),
  ComponentType: Object.freeze({
    TRIGGER: "trigger",
    SQUEEZE: "squeeze",
    TOUCHPAD: "touchpad",
    THUMBSTICK: "thumbstick",
    BUTTON: "button"
  }),
  ButtonTouchThreshold: 0.05,
  AxisTouchThreshold: 0.1,
  VisualResponseProperty: Object.freeze({
    TRANSFORM: "transform",
    VISIBILITY: "visibility"
  })
};
async function fetchJsonFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    return response.json();
  }
}
async function fetchProfilesList(basePath) {
  if (!basePath) {
    throw new Error("No basePath supplied");
  }
  const profileListFileName = "profilesList.json";
  const profilesList = await fetchJsonFile(`${basePath}/${profileListFileName}`);
  return profilesList;
}
async function fetchProfile(xrInputSource, basePath, defaultProfile = null, getAssetPath = true) {
  if (!xrInputSource) {
    throw new Error("No xrInputSource supplied");
  }
  if (!basePath) {
    throw new Error("No basePath supplied");
  }
  const supportedProfilesList = await fetchProfilesList(basePath);
  let match;
  xrInputSource.profiles.some((profileId) => {
    const supportedProfile = supportedProfilesList[profileId];
    if (supportedProfile) {
      match = {
        profileId,
        profilePath: `${basePath}/${supportedProfile.path}`,
        deprecated: !!supportedProfile.deprecated
      };
    }
    return !!match;
  });
  if (!match) {
    if (!defaultProfile) {
      throw new Error("No matching profile name found");
    }
    const supportedProfile = supportedProfilesList[defaultProfile];
    if (!supportedProfile) {
      throw new Error(`No matching profile name found and default profile "${defaultProfile}" missing.`);
    }
    match = {
      profileId: defaultProfile,
      profilePath: `${basePath}/${supportedProfile.path}`,
      deprecated: !!supportedProfile.deprecated
    };
  }
  const profile = await fetchJsonFile(match.profilePath);
  let assetPath;
  if (getAssetPath) {
    let layout;
    if (xrInputSource.handedness === "any") {
      layout = profile.layouts[Object.keys(profile.layouts)[0]];
    } else {
      layout = profile.layouts[xrInputSource.handedness];
    }
    if (!layout) {
      throw new Error(
        `No matching handedness, ${xrInputSource.handedness}, in profile ${match.profileId}`
      );
    }
    if (layout.assetPath) {
      assetPath = match.profilePath.replace("profile.json", layout.assetPath);
    }
  }
  return { profile, assetPath };
}
var defaultComponentValues = {
  xAxis: 0,
  yAxis: 0,
  button: 0,
  state: Constants.ComponentState.DEFAULT
};
function normalizeAxes(x = 0, y = 0) {
  let xAxis = x;
  let yAxis = y;
  const hypotenuse = Math.sqrt(x * x + y * y);
  if (hypotenuse > 1) {
    const theta = Math.atan2(y, x);
    xAxis = Math.cos(theta);
    yAxis = Math.sin(theta);
  }
  const result = {
    normalizedXAxis: xAxis * 0.5 + 0.5,
    normalizedYAxis: yAxis * 0.5 + 0.5
  };
  return result;
}
var VisualResponse = class {
  constructor(visualResponseDescription) {
    this.componentProperty = visualResponseDescription.componentProperty;
    this.states = visualResponseDescription.states;
    this.valueNodeName = visualResponseDescription.valueNodeName;
    this.valueNodeProperty = visualResponseDescription.valueNodeProperty;
    if (this.valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
      this.minNodeName = visualResponseDescription.minNodeName;
      this.maxNodeName = visualResponseDescription.maxNodeName;
    }
    this.value = 0;
    this.updateFromComponent(defaultComponentValues);
  }
  /**
   * Computes the visual response's interpolation weight based on component state
   * @param {Object} componentValues - The component from which to update
   * @param {number} xAxis - The reported X axis value of the component
   * @param {number} yAxis - The reported Y axis value of the component
   * @param {number} button - The reported value of the component's button
   * @param {string} state - The component's active state
   */
  updateFromComponent({
    xAxis,
    yAxis,
    button,
    state
  }) {
    const { normalizedXAxis, normalizedYAxis } = normalizeAxes(xAxis, yAxis);
    switch (this.componentProperty) {
      case Constants.ComponentProperty.X_AXIS:
        this.value = this.states.includes(state) ? normalizedXAxis : 0.5;
        break;
      case Constants.ComponentProperty.Y_AXIS:
        this.value = this.states.includes(state) ? normalizedYAxis : 0.5;
        break;
      case Constants.ComponentProperty.BUTTON:
        this.value = this.states.includes(state) ? button : 0;
        break;
      case Constants.ComponentProperty.STATE:
        if (this.valueNodeProperty === Constants.VisualResponseProperty.VISIBILITY) {
          this.value = this.states.includes(state);
        } else {
          this.value = this.states.includes(state) ? 1 : 0;
        }
        break;
      default:
        throw new Error(`Unexpected visualResponse componentProperty ${this.componentProperty}`);
    }
  }
};
var Component = class {
  /**
   * @param {Object} componentId - Id of the component
   * @param {Object} componentDescription - Description of the component to be created
   */
  constructor(componentId, componentDescription) {
    if (!componentId || !componentDescription || !componentDescription.visualResponses || !componentDescription.gamepadIndices || Object.keys(componentDescription.gamepadIndices).length === 0) {
      throw new Error("Invalid arguments supplied");
    }
    this.id = componentId;
    this.type = componentDescription.type;
    this.rootNodeName = componentDescription.rootNodeName;
    this.touchPointNodeName = componentDescription.touchPointNodeName;
    this.visualResponses = {};
    Object.keys(componentDescription.visualResponses).forEach((responseName) => {
      const visualResponse = new VisualResponse(componentDescription.visualResponses[responseName]);
      this.visualResponses[responseName] = visualResponse;
    });
    this.gamepadIndices = Object.assign({}, componentDescription.gamepadIndices);
    this.values = {
      state: Constants.ComponentState.DEFAULT,
      button: this.gamepadIndices.button !== void 0 ? 0 : void 0,
      xAxis: this.gamepadIndices.xAxis !== void 0 ? 0 : void 0,
      yAxis: this.gamepadIndices.yAxis !== void 0 ? 0 : void 0
    };
  }
  get data() {
    const data = { id: this.id, ...this.values };
    return data;
  }
  /**
   * @description Poll for updated data based on current gamepad state
   * @param {Object} gamepad - The gamepad object from which the component data should be polled
   */
  updateFromGamepad(gamepad) {
    this.values.state = Constants.ComponentState.DEFAULT;
    if (this.gamepadIndices.button !== void 0 && gamepad.buttons.length > this.gamepadIndices.button) {
      const gamepadButton = gamepad.buttons[this.gamepadIndices.button];
      this.values.button = gamepadButton.value;
      this.values.button = this.values.button < 0 ? 0 : this.values.button;
      this.values.button = this.values.button > 1 ? 1 : this.values.button;
      if (gamepadButton.pressed || this.values.button === 1) {
        this.values.state = Constants.ComponentState.PRESSED;
      } else if (gamepadButton.touched || this.values.button > Constants.ButtonTouchThreshold) {
        this.values.state = Constants.ComponentState.TOUCHED;
      }
    }
    if (this.gamepadIndices.xAxis !== void 0 && gamepad.axes.length > this.gamepadIndices.xAxis) {
      this.values.xAxis = gamepad.axes[this.gamepadIndices.xAxis];
      this.values.xAxis = this.values.xAxis < -1 ? -1 : this.values.xAxis;
      this.values.xAxis = this.values.xAxis > 1 ? 1 : this.values.xAxis;
      if (this.values.state === Constants.ComponentState.DEFAULT && Math.abs(this.values.xAxis) > Constants.AxisTouchThreshold) {
        this.values.state = Constants.ComponentState.TOUCHED;
      }
    }
    if (this.gamepadIndices.yAxis !== void 0 && gamepad.axes.length > this.gamepadIndices.yAxis) {
      this.values.yAxis = gamepad.axes[this.gamepadIndices.yAxis];
      this.values.yAxis = this.values.yAxis < -1 ? -1 : this.values.yAxis;
      this.values.yAxis = this.values.yAxis > 1 ? 1 : this.values.yAxis;
      if (this.values.state === Constants.ComponentState.DEFAULT && Math.abs(this.values.yAxis) > Constants.AxisTouchThreshold) {
        this.values.state = Constants.ComponentState.TOUCHED;
      }
    }
    Object.values(this.visualResponses).forEach((visualResponse) => {
      visualResponse.updateFromComponent(this.values);
    });
  }
};
var MotionController = class {
  /**
   * @param {Object} xrInputSource - The XRInputSource to build the MotionController around
   * @param {Object} profile - The best matched profile description for the supplied xrInputSource
   * @param {Object} assetUrl
   */
  constructor(xrInputSource, profile, assetUrl) {
    if (!xrInputSource) {
      throw new Error("No xrInputSource supplied");
    }
    if (!profile) {
      throw new Error("No profile supplied");
    }
    this.xrInputSource = xrInputSource;
    this.assetUrl = assetUrl;
    this.id = profile.profileId;
    this.layoutDescription = profile.layouts[xrInputSource.handedness];
    this.components = {};
    Object.keys(this.layoutDescription.components).forEach((componentId) => {
      const componentDescription = this.layoutDescription.components[componentId];
      this.components[componentId] = new Component(componentId, componentDescription);
    });
    this.updateFromGamepad();
  }
  get gripSpace() {
    return this.xrInputSource.gripSpace;
  }
  get targetRaySpace() {
    return this.xrInputSource.targetRaySpace;
  }
  /**
   * @description Returns a subset of component data for simplified debugging
   */
  get data() {
    const data = [];
    Object.values(this.components).forEach((component) => {
      data.push(component.data);
    });
    return data;
  }
  /**
   * @description Poll for updated data based on current gamepad state
   */
  updateFromGamepad() {
    Object.values(this.components).forEach((component) => {
      component.updateFromGamepad(this.xrInputSource.gamepad);
    });
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/webxr/XRControllerModelFactory.ts
var DEFAULT_PROFILES_PATH = "https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles";
var DEFAULT_PROFILE = "generic-trigger";
var XRControllerModel = class extends Object3D {
  constructor() {
    super(...arguments);
    this.envMap = null;
    this.motionController = null;
  }
  setEnvironmentMap(envMap) {
    if (this.envMap == envMap) {
      return this;
    }
    this.envMap = envMap;
    this.traverse((child) => {
      if (isMesh(child) && (isMeshStandardMaterial(child.material) || isMeshPhongMaterial(child.material) || isMeshPhysicalMaterial(child.material))) {
        child.material.envMap = this.envMap;
        child.material.needsUpdate = true;
      }
    });
    return this;
  }
  /**
   * Polls data from the XRInputSource and updates the model's components to match
   * the real world data
   */
  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    if (!this.motionController)
      return;
    this.motionController.updateFromGamepad();
    Object.values(this.motionController.components).forEach((component) => {
      Object.values(component.visualResponses).forEach((visualResponse) => {
        const { valueNode, minNode, maxNode } = visualResponse;
        if (!valueNode)
          return;
        if (isVisibility(visualResponse)) {
          valueNode.visible = visualResponse.value;
        } else if (isTransform(visualResponse)) {
          valueNode.quaternion.slerpQuaternions(
            minNode.quaternion,
            maxNode.quaternion,
            visualResponse.value
          );
          valueNode.position.lerpVectors(
            minNode.position,
            maxNode.position,
            visualResponse.value
          );
        }
      });
    });
  }
};
function isVisualResponse(visualResponse, type2) {
  return visualResponse && visualResponse.valueNodeProperty === type2;
}
function isVisibility(visualResponse) {
  return isVisualResponse(visualResponse, "visibility");
}
function isTransform(visualResponse) {
  return isVisualResponse(visualResponse, "transform");
}
function findNodes(motionController, scene) {
  Object.values(motionController.components).forEach((component) => {
    const { type: type2, touchPointNodeName, visualResponses } = component;
    if (type2 === Constants.ComponentType.TOUCHPAD) {
      component.touchPointNode = scene.getObjectByName(touchPointNodeName);
      if (component.touchPointNode) {
        const sphereGeometry = new SphereGeometry(1e-3);
        const material = new MeshBasicMaterial({ color: 255 });
        const sphere = new Mesh(sphereGeometry, material);
        component.touchPointNode.add(sphere);
      } else {
        console.warn(`Could not find touch dot, ${component.touchPointNodeName}, in touchpad component ${component.id}`);
      }
    }
    Object.values(visualResponses).forEach((visualResponse) => {
      const { valueNodeName, minNodeName, maxNodeName, valueNodeProperty } = visualResponse;
      if (valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
        visualResponse.minNode = scene.getObjectByName(minNodeName);
        visualResponse.maxNode = scene.getObjectByName(maxNodeName);
        if (!visualResponse.minNode) {
          console.warn(`Could not find ${minNodeName} in the model`);
          return;
        }
        if (!visualResponse.maxNode) {
          console.warn(`Could not find ${maxNodeName} in the model`);
          return;
        }
      }
      visualResponse.valueNode = scene.getObjectByName(valueNodeName);
      if (!visualResponse.valueNode) {
        console.warn(`Could not find ${valueNodeName} in the model`);
      }
    });
  });
}
function addAssetSceneToControllerModel(controllerModel, scene) {
  findNodes(controllerModel.motionController, scene);
  if (controllerModel.envMap) {
    scene.traverse((child) => {
      if (isMesh(child) && (isMeshStandardMaterial(child.material) || isMeshPhongMaterial(child.material) || isMeshPhysicalMaterial(child.material))) {
        child.material.envMap = controllerModel.envMap;
        child.material.needsUpdate = true;
      }
    });
  }
  controllerModel.add(scene);
}
var XRControllerModelFactory = class {
  constructor(gltfLoader = null) {
    this.gltfLoader = gltfLoader || new GLTFLoader();
    this.path = DEFAULT_PROFILES_PATH;
    this._assetCache = {};
  }
  createControllerModel(controller, profileName = null) {
    const controllerModel = new XRControllerModel();
    let scene = null;
    controller.addEventListener("connected", async (event) => {
      const xrInputSource = event.data;
      if (xrInputSource.targetRayMode !== "tracked-pointer" || !xrInputSource.gamepad)
        return;
      try {
        const { profile, assetPath } = await fetchProfile(xrInputSource, this.path, profileName || DEFAULT_PROFILE);
        controllerModel.motionController = new MotionController(
          xrInputSource,
          profile,
          assetPath
        );
        const cachedAsset = this._assetCache[controllerModel.motionController.assetUrl];
        if (cachedAsset) {
          scene = cachedAsset.scene.clone();
          addAssetSceneToControllerModel(controllerModel, scene);
        } else {
          if (!this.gltfLoader) {
            throw new Error("GLTFLoader not set.");
          }
          this.gltfLoader.setPath("");
          this.gltfLoader.load(
            controllerModel.motionController.assetUrl,
            (asset) => {
              this._assetCache[controllerModel.motionController.assetUrl] = asset;
              scene = asset.scene.clone();
              addAssetSceneToControllerModel(controllerModel, scene);
            },
            null,
            () => {
              throw new Error(`Asset ${controllerModel.motionController.assetUrl} missing or malformed.`);
            }
          );
        }
      } catch (err) {
        console.warn(err);
      }
    });
    controller.addEventListener("disconnected", () => {
      cleanup(controllerModel.motionController);
      controllerModel.motionController = null;
      cleanup(scene);
      scene = null;
    });
    return controllerModel;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/PointerHand.ts
var mcModelFactory = new XRControllerModelFactory();
var riftSCorrection = new Matrix4().makeRotationX(-7 * Pi / 9);
var M2 = new Matrix4();
var pointerIDs = /* @__PURE__ */ new Map([
  ["none", 5 /* MotionController */],
  ["left", 6 /* MotionControllerLeft */],
  ["right", 7 /* MotionControllerRight */]
]);
var questToVirtualMap = /* @__PURE__ */ new Map([
  //[OculusQuestButton.Trigger, VirtualButton.Primary],
  //[OculusQuestButton.Grip, VirtualButton.Secondary],
  [5 /* Y_B */, 2 /* Menu */],
  [4 /* X_A */, 3 /* Info */]
]);
var PointerHand = class extends BasePointer {
  constructor(env, index) {
    super("hand", 5 /* MotionController */, env, new CursorColor(env));
    this.laser = new Laser(white, 0.75, 2e-3);
    this._isHand = false;
    this.inputSource = null;
    this._gamepad = new EventedGamepad();
    this.delta = new Vector3();
    this.newOrigin = new Vector3();
    this.quaternion = new Quaternion();
    this.newQuat = new Quaternion();
    this.useHaptics = true;
    this.mayTeleport = true;
    this.object = obj("PointerHand" + index);
    this.quaternion.identity();
    objGraph(
      this,
      objGraph(
        this.controller = this.env.renderer.xr.getController(index),
        this.laser
      ),
      objGraph(
        this.grip = this.env.renderer.xr.getControllerGrip(index),
        this.gripModel = mcModelFactory.createControllerModel(this.controller)
      ),
      objGraph(
        this.hand = this.env.renderer.xr.getHand(index),
        this.handModel = this.env.handModelFactory.createHandModel(this.hand)
      )
    );
    if (isDesktop() && isChrome() && !isOculusBrowser) {
      let maybeOculusRiftS = false;
      this.controller.traverse((child) => {
        const key = child.name.toLocaleLowerCase();
        if (key.indexOf("oculus") >= 0) {
          maybeOculusRiftS = true;
        }
      });
      if (maybeOculusRiftS) {
        this.laser.matrix.copy(riftSCorrection);
      }
    }
    this.gamepad.addEventListener("gamepadaxismaxed", (evt) => {
      if (evt.axis === 2) {
        this.env.avatar.snapTurn(evt.value);
      }
    });
    const setButton = (pressed) => {
      return (evt) => {
        if (questToVirtualMap.has(evt.button)) {
          this.setButton(questToVirtualMap.get(evt.button), pressed);
        }
      };
    };
    this.gamepad.addEventListener("gamepadbuttondown", setButton(true));
    this.gamepad.addEventListener("gamepadbuttonup", setButton(false));
    const setHandButton = (btn, pressed) => () => this.setButton(btn, pressed);
    this.controller.addEventListener("selectstart", setHandButton(0 /* Primary */, true));
    this.controller.addEventListener("selectend", setHandButton(0 /* Primary */, false));
    this.controller.addEventListener("squeezestart", setHandButton(1 /* Secondary */, true));
    this.controller.addEventListener("squeezeend", setHandButton(1 /* Secondary */, false));
    this.controller.addEventListener("connected", (evt) => {
      if (evt.target === this.controller) {
        this.inputSource = evt.data;
        this.gamepad.pad = this.inputSource.gamepad;
        this._isHand = isDefined(this.inputSource.hand);
        this.id = pointerIDs.get(this.handedness);
        this.grip.visible = !this.isHand;
        this.controller.visible = !this.isHand;
        this.hand.visible = this.isHand;
        this.enabled = true;
        this._isActive = true;
        this.env.eventSys.checkXRMouse();
        this.updateCursorSide();
      }
    });
    this.controller.addEventListener("disconnected", (evt) => {
      if (evt.target === this.controller) {
        this.inputSource = null;
        this.gamepad.pad = null;
        this._isHand = false;
        this.id = pointerIDs.get(this.handedness);
        this.grip.visible = false;
        this.controller.visible = false;
        this.hand.visible = false;
        this.enabled = false;
        this._isActive = false;
        this.env.eventSys.checkXRMouse();
        this.updateCursorSide();
      }
    });
    Object.seal(this);
  }
  vibrate() {
    this._vibrate();
  }
  async _vibrate() {
    if (this.useHaptics && this.gamepad.hapticActuators) {
      try {
        await Promise.all(this.gamepad.hapticActuators.map((actuator) => actuator.pulse(0.25, 125)));
      } catch {
        this.useHaptics = false;
      }
    }
  }
  get gamepad() {
    return this._gamepad;
  }
  get handedness() {
    if (isNullOrUndefined(this.inputSource)) {
      return null;
    }
    return this.inputSource.handedness;
  }
  get isHand() {
    return this._isHand;
  }
  get cursor() {
    return super.cursor;
  }
  set cursor(v) {
    super.cursor = v;
    this.updateCursorSide();
  }
  updateCursorSide() {
    this.cursor.side = this.handedness === "left" ? 1 : -1;
  }
  updatePointerOrientation() {
    this.laser.getWorldPosition(this.newOrigin);
    this.laser.getWorldQuaternion(this.newQuat);
    this.origin.lerp(this.newOrigin, 0.9);
    this.quaternion.slerp(this.newQuat, 0.9);
    this.delta.copy(this.origin).add(this.direction);
    this.direction.set(0, 0, -1).applyQuaternion(this.quaternion);
    this.up.set(0, 1, 0).applyQuaternion(this.quaternion);
    this.delta.sub(this.direction).sub(this.origin);
    this.moveDistance += 50 * this.delta.length();
  }
  onUpdate() {
    this.gamepad.pad = this.inputSource && this.inputSource.gamepad || null;
    super.onUpdate();
  }
  get bufferSize() {
    return super.bufferSize + 2 + this.handModel.count * 64;
  }
  writeState(buffer) {
    super.writeState(buffer);
    buffer.writeEnum8(this.handedness, HANDEDNESSES);
    buffer.writeUint8(this.handModel.count);
    if (this.handModel.isTracking) {
      for (let n = 0; n < this.handModel.count; ++n) {
        this.handModel.getMatrixAt(n, M2);
        buffer.writeMatrix512(M2);
      }
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/BaseScreenPointer.ts
var BaseScreenPointer = class extends BasePointer {
  constructor(type2, id, env, cursor) {
    super(type2, id, env, cursor);
    this.position = new Vector2();
    this.motion = new Vector2();
    this.uv = new Vector2();
    this.duv = new Vector2();
    this.uvComp = new Vector2(1, -1);
    this.uvOff = new Vector2(-1, 1);
    this.canMoveView = true;
    const onPointerEvent = (evt) => {
      this._isActive = this.onCheckEvent(evt);
      if (this._isActive) {
        this.onReadEvent(evt);
      }
    };
    this.element = this.env.renderer.domElement;
    this.element.addEventListener("pointerdown", onPointerEvent);
    this.element.addEventListener("pointermove", onPointerEvent);
    this.element.addEventListener("pointerup", onPointerEvent);
    this.element.addEventListener("pointercancel", onPointerEvent);
  }
  onCheckEvent(evt) {
    return evt.pointerType === this.type;
  }
  onReadEvent(_evt) {
    this.updatePointerOrientation();
  }
  updatePointerOrientation() {
    if (this.element.clientWidth > 0 && this.element.clientHeight > 0) {
      this.uv.copy(this.position);
      this.uv.x /= this.element.clientWidth;
      this.uv.y /= this.element.clientHeight;
      this.uv.multiplyScalar(2).multiply(this.uvComp).add(this.uvOff);
      this.duv.copy(this.motion);
      this.duv.x /= this.element.clientWidth;
      this.duv.y /= this.element.clientHeight;
      this.duv.multiplyScalar(2).multiply(this.uvComp);
      this.moveDistance = 200 * this.duv.length();
    }
    const cam = resolveCamera(this.env.renderer, this.env.camera);
    this.origin.setFromMatrixPosition(cam.matrixWorld);
    this.direction.set(this.uv.x, this.uv.y, 0.5).unproject(cam).sub(this.origin).normalize();
    this.up.set(0, 1, 0).applyQuaternion(this.env.avatar.worldQuat);
  }
  onUpdate() {
    this.env.avatar.onMove(this, this.uv, this.duv);
    super.onUpdate();
    this.motion.setScalar(0);
    this.duv.setScalar(0);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/BaseScreenPointerSinglePoint.ts
var BaseScreenPointerSinglePoint = class extends BaseScreenPointer {
  constructor(type2, id, env) {
    const onPrep = (evt) => {
      if (evt.pointerType === type2 && this.pointerID == null) {
        this.pointerID = evt.pointerId;
      }
    };
    const unPrep = (evt) => {
      if (evt.pointerType === type2 && this.pointerID != null) {
        this.pointerID = null;
      }
    };
    const element = env.renderer.domElement;
    element.addEventListener("pointerdown", onPrep);
    element.addEventListener("pointermove", onPrep);
    super(type2, id, env, new CursorXRMouse(env));
    this.pointerID = null;
    this.lastX = null;
    this.lastY = null;
    element.addEventListener("pointerup", unPrep);
    element.addEventListener("pointercancel", unPrep);
  }
  onCheckEvent(evt) {
    return super.onCheckEvent(evt) && evt.pointerId === this.pointerID;
  }
  onReadEvent(evt) {
    this.position.set(evt.offsetX, evt.offsetY);
    if (evt.type === "pointerdown") {
      this.motion.setScalar(0);
    } else {
      this.motion.x += evt.offsetX - this.lastX;
      this.motion.y += evt.offsetY - this.lastY;
    }
    this.lastX = evt.offsetX;
    this.lastY = evt.offsetY;
    super.onReadEvent(evt);
    if (evt.type === "pointerdown" || evt.type === "pointerup" || evt.type === "pointercancel") {
      this.setButton(evt.button, evt.type === "pointerdown");
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/PointerMouse.ts
var PointerMouse = class extends BaseScreenPointerSinglePoint {
  constructor(env) {
    super("mouse", 1 /* Mouse */, env);
    this.allowPointerLock = false;
    this.dz = 0;
    this.keyMap = /* @__PURE__ */ new Map([
      ["`", 3 /* Info */],
      ["ContextMenu", 2 /* Menu */]
    ]);
    this.element.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      this.dz += -evt.deltaY * 0.1;
    }, { passive: false });
    this.element.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
    });
    this.element.addEventListener("pointerdown", (evt) => {
      if (this.onCheckEvent(evt)) {
        if (this.allowPointerLock && !this.isPointerLocked) {
          this.lockPointer();
        } else if (!this.allowPointerLock && !this.isPointerCaptured) {
          this.capturePointer();
        }
      }
    });
    this.element.addEventListener("pointerup", (evt) => {
      if (this.onCheckEvent(evt)) {
        if (this.allowPointerLock && this.isPointerLocked) {
          this.unlockPointer();
        } else if (!this.allowPointerLock && this.isPointerCaptured) {
          this.releaseCapture();
        }
      }
    }, true);
    document.addEventListener("pointerlockchange", () => {
      this.cursor.visible = true;
    });
    window.addEventListener("keydown", (evt) => {
      if (this._isActive && this.keyMap.has(evt.key)) {
        this.setButton(this.keyMap.get(evt.key), isModifierless(evt));
      }
    });
    window.addEventListener("keyup", (evt) => {
      if (this.keyMap.has(evt.key)) {
        this.setButton(this.keyMap.get(evt.key), false);
      }
    });
    this.mayTeleport = true;
    Object.seal(this);
  }
  updatePointerOrientation() {
    if (this.isPointerLocked) {
      this.position.set(
        this.env.renderer.domElement.clientWidth,
        this.env.renderer.domElement.clientHeight
      ).multiplyScalar(0.5);
    }
    super.updatePointerOrientation();
  }
  onUpdate() {
    super.onUpdate();
    this.env.avatar.zoom(this.dz);
    this.dz = 0;
  }
  get isPointerLocked() {
    return document.pointerLockElement != null;
  }
  get isPointerCaptured() {
    return this.element.hasPointerCapture(this.pointerID);
  }
  get canDragView() {
    return super.canDragView && !this.isPointerLocked;
  }
  get canTeleport() {
    return super.canTeleport && this.isPointerLocked;
  }
  lockPointer() {
    this.element.requestPointerLock();
  }
  unlockPointer() {
    document.exitPointerLock();
  }
  capturePointer() {
    this.element.setPointerCapture(this.pointerID);
  }
  releaseCapture() {
    this.element.releasePointerCapture(this.pointerID);
  }
  vibrate() {
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/PointerNose.ts
var PointerNose = class extends BasePointer {
  constructor(env) {
    super("nose", 8 /* Nose */, env, null);
    this.point = new Vector3();
    this.lastPoint = new Vector3();
    this.mayTeleport = false;
    this.enabled = true;
    this._isActive = true;
    this.updatePointerOrientation();
    this.moveDistance = 0;
    Object.seal(this);
  }
  vibrate() {
  }
  get canSend() {
    return false;
  }
  updatePointerOrientation() {
    const camera = this.env.camera;
    camera.getWorldPosition(this.origin);
    camera.getWorldDirection(this.direction);
    this.up.copy(camera.up);
    this.point.copy(this.direction).add(this.origin);
    this.moveDistance = this.point.distanceTo(this.lastPoint);
    this.lastPoint.copy(this.point);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/PointerPen.ts
var PointerPen = class extends BaseScreenPointerSinglePoint {
  constructor(env) {
    super("pen", 2 /* Pen */, env);
    Object.seal(this);
  }
  vibrate() {
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/devices/PointerTouch.ts
function getPointerID(evt) {
  return evt.pointerId;
}
var PointerTouch = class extends BaseScreenPointer {
  constructor(env) {
    super("touch", 3 /* Touch */, env, null);
    this.dz = 0;
    this.lastZ = 0;
    this.points = new Array();
    this.lastXs = /* @__PURE__ */ new Map();
    this.lastYs = /* @__PURE__ */ new Map();
    this._canVibrate = null;
    Object.seal(this);
  }
  get enabled() {
    return super.enabled;
  }
  set enabled(v) {
    super.enabled = v;
    arrayClear(this.points);
  }
  onReadEvent(evt) {
    arrayRemoveByKey(this.points, evt.pointerId, getPointerID);
    const isMove = evt.type === "pointerdown" || evt.type === "pointermove";
    if (isMove) {
      this.points.push(evt);
    }
    if (this.points.length === 2) {
      const a = this.points[0];
      const b = this.points[1];
      const dx = b.offsetX - a.offsetX;
      const dy = b.offsetY - a.offsetY;
      const z = 5 * Math.sqrt(dx * dx + dy * dy);
      const ddz = z - this.lastZ;
      if (evt.type === "pointermove") {
        this.dz += ddz;
      }
      this.lastZ = z;
    }
    const K = 1 / this.points.length;
    if (isMove) {
      this.position.setScalar(0);
      for (const point of this.points) {
        this.position.x += K * point.offsetX;
        this.position.y += K * point.offsetY;
        if (this.lastXs.has(point.pointerId)) {
          const lastX = this.lastXs.get(point.pointerId);
          const lastY = this.lastYs.get(point.pointerId);
          const dx = point.offsetX - lastX;
          const dy = point.offsetY - lastY;
          this.motion.x += K * dx;
          this.motion.y += K * dy;
        }
      }
    }
    if (isMove) {
      this.lastXs.set(evt.pointerId, evt.offsetX);
      this.lastYs.set(evt.pointerId, evt.offsetY);
    } else {
      this.lastXs.delete(evt.pointerId);
      this.lastYs.delete(evt.pointerId);
    }
    super.onReadEvent(evt);
    if (evt.type !== "pointermove") {
      let curButtons = 0;
      for (let button = 0; button < this.points.length; ++button) {
        const point = this.points[button];
        const mask = 1 << button;
        if (point.buttons !== 0) {
          curButtons |= mask;
        } else {
          curButtons &= ~mask;
        }
      }
      for (let button = 0; button < 10; ++button) {
        const wasPressed = this.isPressed(button);
        const mask = 1 << button;
        const isPressed = (curButtons & mask) !== 0;
        if (isPressed !== wasPressed) {
          this.setButton(button, isPressed);
        }
      }
      if (evt.type === "pointerup") {
        setTimeout(() => this._isActive = false, 10);
      }
    }
  }
  onUpdate() {
    this.env.avatar.zoom(this.dz);
    super.onUpdate();
    this.dz = 0;
  }
  get canVibrate() {
    if (this._canVibrate === null) {
      this._canVibrate = "vibrate" in navigator && isFunction(navigator.vibrate);
    }
    return this._canVibrate;
  }
  vibrate() {
    if (this.canVibrate) {
      navigator.vibrate(125);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/EventSystem.ts
var defaultSortFunction = (a, b) => a.distance - b.distance;
var EventSystem = class extends TypedEventBase {
  constructor(env) {
    super();
    this.env = env;
    this.raycaster = new Raycaster();
    this.hands = new Array();
    this.hits = new Array();
    this.queue = new Array();
    this.targetsFound = /* @__PURE__ */ new Set();
    this.targets = new Array();
    this.customSortFunction = null;
    this.raycaster.camera = this.env.camera;
    this.raycaster.layers.set(FOREGROUND);
    this.mouse = new PointerMouse(this.env);
    this.pen = new PointerPen(this.env);
    this.touches = new PointerTouch(this.env);
    this.nose = new PointerNose(this.env);
    for (let i = 0; i < 2; ++i) {
      this.hands[i] = new PointerHand(this.env, i);
    }
    this.pointers = [
      this.mouse,
      this.pen,
      this.touches,
      this.nose,
      ...this.hands
    ];
    for (const pointer of this.pointers) {
      pointer.addBubbler(this);
      if (pointer.cursor) {
        objGraph(this.env.stage, pointer.cursor);
      }
    }
    this.checkXRMouse();
    Object.seal(this);
  }
  set sortFunction(func) {
    this.customSortFunction = func;
  }
  get sortFunction() {
    return this.customSortFunction || defaultSortFunction;
  }
  checkXRMouse() {
    let count = 0;
    for (const hand of this.hands.values()) {
      if (hand.enabled) {
        ++count;
      }
    }
    const enableScreenPointers = count === 0;
    this.mouse.enabled = enableScreenPointers;
    this.pen.enabled = enableScreenPointers;
    this.touches.enabled = enableScreenPointers;
  }
  refreshCursors() {
    for (const pointer of this.pointers) {
      if (pointer.cursor) {
        pointer.cursor = this.env.cursor3D.clone();
      }
    }
  }
  fireRay(origin, direction) {
    arrayClear(this.hits);
    this.raycaster.ray.origin.copy(origin);
    this.raycaster.ray.direction.copy(direction);
    this.raycaster.intersectObjects(this.targets, false, this.hits);
    this.hits.sort(this.sortFunction);
    return this.hits[0] || null;
  }
  update() {
    this.targetsFound.clear();
    arrayClear(this.targets);
    this.queue.push(this.env.scene);
    while (this.queue.length > 0) {
      const here = this.queue.shift();
      if (here.children.length > 0) {
        this.queue.push(...here.children);
      }
      const target = getRayTarget(here);
      if (target && !this.targetsFound.has(target)) {
        this.targetsFound.add(target);
        this.targets.push(...target.meshes);
      }
    }
    for (const pointer of this.pointers) {
      pointer.update();
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/cursors/Cursor3D.ts
var Cursor3D = class extends BaseCursor3D {
  constructor(env, cursorSystem) {
    super(env);
    this.cursorSystem = null;
    this.object = obj("Cursor3D");
    this.cursorSystem = cursorSystem;
    this.object.matrixAutoUpdate = false;
  }
  add(name, obj2) {
    objGraph(this, obj2);
    deepEnableLayer(obj2, PURGATORY);
    obj2.visible = name === "default";
  }
  get style() {
    for (const child of this.object.children) {
      if (child.visible) {
        return child.name;
      }
    }
    return null;
  }
  set style(v) {
    for (const child of this.object.children) {
      child.visible = child.name === v;
    }
    if (this.style == null && this.object.children.length > 0) {
      const defaultCursor = arrayScan(
        this.object.children,
        (child) => child.name === "default",
        (child) => child != null
      );
      if (defaultCursor != null) {
        defaultCursor.visible = true;
      }
    }
    if (this.cursorSystem) {
      this.cursorSystem.style = "none";
    }
  }
  get visible() {
    return objectIsVisible(this);
  }
  set visible(v) {
    objectSetVisible(this, v);
  }
  clone() {
    const obj2 = new Cursor3D(this.env);
    for (const child of this.object.children) {
      obj2.add(child.name, child.clone());
    }
    return obj2;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/webxr/XRHandMeshModel.ts
var _oculusBrowserV14CorrectionRight = new Quaternion().identity();
var _oculusBrowserV14CorrectionLeft = new Quaternion().identity();
if (/OculusBrowser\/14\./.test(navigator.userAgent)) {
  _oculusBrowserV14CorrectionRight.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
  _oculusBrowserV14CorrectionLeft.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI).premultiply(_oculusBrowserV14CorrectionRight);
}
var DEFAULT_HAND_PROFILE_PATH = "https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/generic-hand/";
var XRHandMeshModel = class extends Object3D {
  constructor(controller, handedness, color) {
    super();
    this.controller = controller;
    this.handedness = handedness;
    this.bones = /* @__PURE__ */ new Map();
    this.root = null;
    this.instanceMatrix = { needsUpdate: false };
    this.oculusBrowserV14Correction = this.handedness === "left" ? _oculusBrowserV14CorrectionLeft : _oculusBrowserV14CorrectionRight;
    const loader = new GLTFLoader();
    loader.setPath(DEFAULT_HAND_PROFILE_PATH);
    loader.load(`${this.handedness}.glb`, (gltf) => {
      this.root = gltf.scene.children[0];
      this.add(this.root);
      const mesh2 = this.root.getObjectByProperty("type", "SkinnedMesh");
      mesh2.frustumCulled = false;
      mesh2.castShadow = true;
      mesh2.receiveShadow = true;
      if (isMeshPhysicalMaterial(mesh2.material)) {
        mesh2.material = materialPhysicalToPhong(mesh2.material);
      } else if (isMeshStandardMaterial(mesh2.material)) {
        mesh2.material = materialStandardToPhong(mesh2.material);
      }
      if (isMeshPhongMaterial(mesh2.material)) {
        mesh2.material.color = color;
        mesh2.material.shininess = 0.1;
      }
      jointNames.forEach((jointName) => this.addBone(jointName));
    });
  }
  addBone(jointName) {
    if (this.root) {
      const bone = this.root.getObjectByName(jointName);
      if (bone) {
        this.bones.set(jointName, bone);
      }
    }
  }
  get count() {
    return this.bones.size;
  }
  set count(_v) {
  }
  getMatrixAt(n, M3) {
    if (0 <= n && n < jointNames.length) {
      const jointName = jointNames[n];
      if (this.bones.has(jointName)) {
        M3.copy(this.bones.get(jointName).matrix);
      }
    }
  }
  setMatrixAt(n, M3) {
    if (0 <= n && n < jointNames.length) {
      const jointName = jointNames[n];
      if (this.bones.has(jointName)) {
        const bone = this.bones.get(jointName);
        bone.matrix.copy(M3);
        bone.matrix.decompose(
          bone.position,
          bone.quaternion,
          bone.scale
        );
      }
    }
  }
  updateMesh() {
    if (this.controller) {
      for (const [jointName, bone] of this.bones) {
        const joint = this.controller.joints[jointName];
        if (joint && joint.visible) {
          bone.position.copy(joint.position);
          bone.quaternion.copy(joint.quaternion).multiply(this.oculusBrowserV14Correction);
        }
      }
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/webxr/XRHandPrimitiveModel.ts
var defaultRadius = 8e-3;
var _matrix = new Matrix4();
var _vector2 = new Vector3();
var _oculusBrowserV14CorrectionRight2 = new Matrix4().identity();
var _oculusBrowserV14CorrectionLeft2 = new Matrix4().identity();
if (/OculusBrowser\/14\./.test(navigator.userAgent)) {
  _oculusBrowserV14CorrectionRight2.makeRotationY(Math.PI / 2);
  _oculusBrowserV14CorrectionLeft2.makeRotationY(-Math.PI / 2);
}
var XRHandPrimitiveModel = class extends InstancedMesh {
  constructor(controller, handedness, color, primitive) {
    let geometry;
    if (primitive === "boxes") {
      geometry = new BoxGeometry(1, 1, 1);
    } else if (primitive === "bones") {
      geometry = new CylinderGeometry(0.5, 0.75, 2.25, 10, 1).rotateX(-Math.PI / 2);
    } else {
      geometry = new SphereGeometry(1, 10, 10);
    }
    const material = new MeshPhongMaterial({
      color,
      shininess: 0.1
    });
    super(geometry, material, 30);
    this.controller = controller;
    this.instanceMatrix.setUsage(DynamicDrawUsage);
    this.castShadow = true;
    this.receiveShadow = true;
    this.oculusBrowserV14Correction = handedness === "left" ? _oculusBrowserV14CorrectionLeft2 : _oculusBrowserV14CorrectionRight2;
  }
  updateMesh() {
    if (this.controller) {
      let count = 0;
      for (const jointName of jointNames) {
        const joint = this.controller.joints[jointName];
        if (joint && joint.visible) {
          _vector2.setScalar(joint.jointRadius || defaultRadius);
          _matrix.compose(joint.position, joint.quaternion, _vector2);
          _matrix.multiply(this.oculusBrowserV14Correction);
          this.setMatrixAt(count, _matrix);
          count++;
        }
      }
      this.count = count;
    }
    this.instanceMatrix.needsUpdate = true;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/webxr/XRHandModelFactory.ts
var jointNames = [
  "wrist",
  "thumb-metacarpal",
  "thumb-phalanx-proximal",
  "thumb-phalanx-distal",
  "thumb-tip",
  "index-finger-metacarpal",
  "index-finger-phalanx-proximal",
  "index-finger-phalanx-intermediate",
  "index-finger-phalanx-distal",
  "index-finger-tip",
  "middle-finger-metacarpal",
  "middle-finger-phalanx-proximal",
  "middle-finger-phalanx-intermediate",
  "middle-finger-phalanx-distal",
  "middle-finger-tip",
  "ring-finger-metacarpal",
  "ring-finger-phalanx-proximal",
  "ring-finger-phalanx-intermediate",
  "ring-finger-phalanx-distal",
  "ring-finger-tip",
  "pinky-finger-metacarpal",
  "pinky-finger-phalanx-proximal",
  "pinky-finger-phalanx-intermediate",
  "pinky-finger-phalanx-distal",
  "pinky-finger-tip"
];
var XRHandModel = class extends Object3D {
  constructor(controllerOrHandedness, color, profile) {
    super();
    this.controllerOrHandedness = controllerOrHandedness;
    this.color = color;
    this.profile = profile;
    this.impl = null;
    let controller = null;
    let handedness = null;
    if (isString(controllerOrHandedness)) {
      handedness = controllerOrHandedness;
    } else {
      controller = controllerOrHandedness;
    }
    const create7 = () => this.add(this.impl = this.createModel(controller, handedness));
    if (controller) {
      controller.addEventListener("connected", (event) => {
        const xrInputSource = event.data;
        if (xrInputSource.hand && !this.impl) {
          handedness = xrInputSource.handedness;
          create7();
        }
      });
      controller.addEventListener("disconnected", () => {
        const old = this.impl;
        this.impl = null;
        handedness = null;
        old.removeFromParent();
        cleanup(old);
      });
    } else if (handedness) {
      create7();
    }
  }
  get isTracking() {
    return !!this.impl;
  }
  createModel(controller, handedness) {
    if (this.profile === "mesh") {
      return new XRHandMeshModel(controller, handedness, this.color);
    } else {
      return new XRHandPrimitiveModel(controller, handedness, this.color, this.profile);
    }
  }
  get count() {
    if (this.impl) {
      return this.impl.count;
    }
    return 0;
  }
  set count(v) {
    if (this.impl) {
      this.impl.count = v;
    }
  }
  getMatrixAt(n, M3) {
    if (this.impl) {
      this.impl.getMatrixAt(n, M3);
    }
  }
  setMatrixAt(n, M3) {
    if (this.impl) {
      this.impl.setMatrixAt(n, M3);
    }
  }
  updateMesh() {
    if (this.impl) {
      this.impl.updateMesh();
    }
  }
  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    if (this.impl) {
      this.impl.updateMesh();
    }
  }
};
var XRHandModelFactory = class {
  constructor(color, profile) {
    this.color = color;
    this.profile = profile;
  }
  createHandModel(controllerOrHandedness) {
    return new XRHandModel(controllerOrHandedness, this.color, this.profile);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/environment/XRTimer.ts
var XRTimerTickEvent = class extends BaseTimerTickEvent {
  constructor() {
    super();
    this.frame = null;
    Object.seal(this);
  }
  set(t2, dt, frame) {
    super.set(t2, dt);
    this.frame = frame;
  }
};
var XRTimer = class {
  constructor(renderer) {
    this.renderer = renderer;
    this.tickHandlers = new Array();
    this.lt = -1;
    this._isRunning = false;
    const tickEvt = new XRTimerTickEvent();
    let dt = 0;
    this._onTick = (t2, frame) => {
      if (this.lt >= 0) {
        dt = t2 - this.lt;
        tickEvt.set(t2, dt, frame);
        this.tick(tickEvt);
      }
      this.lt = t2;
    };
  }
  get isRunning() {
    return this._isRunning;
  }
  restart() {
    this.stop();
    this.start();
  }
  addTickHandler(onTick) {
    this.tickHandlers.push(onTick);
  }
  removeTickHandler(onTick) {
    arrayRemove(this.tickHandlers, onTick);
  }
  setAnimationLoop(loop) {
    this.renderer.setAnimationLoop(loop);
    this._isRunning = isDefined(loop);
  }
  start() {
    if (!this.isRunning) {
      this.setAnimationLoop(this._onTick);
    }
  }
  stop() {
    if (this.isRunning) {
      this.setAnimationLoop(null);
      this.lt = -1;
    }
  }
  tick(evt) {
    for (const handler of this.tickHandlers) {
      handler(evt);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/environment/BaseEnvironment/index.ts
var gridWidth = 15;
var gridSize = feet2Meters(gridWidth);
var BaseEnvironment = class extends TypedEventBase {
  constructor(canvas, styleSheetPath, fetcher, enableFullResolution, DEBUG2 = null, defaultAvatarHeight = null, defaultFOV = null) {
    super();
    this.styleSheetPath = styleSheetPath;
    this.fetcher = fetcher;
    this.layers = new Array();
    this.layerSortOrder = /* @__PURE__ */ new Map();
    this.spectator = new PerspectiveCamera();
    this.lastViewport = new Vector4();
    this.curViewport = new Vector4();
    this.gltfLoader = new GLTFLoader();
    this.fadeDepth = 0;
    this.scene = new Scene();
    this.stage = obj("Stage");
    this.ambient = new AmbientLight(16777215, 0.5);
    this.sun = new DirectionalLight(16777215, 0.75);
    this.ground = new GridHelper(gridSize, gridWidth, 12632256, 8421504);
    this.foreground = obj("Foreground");
    this.loadingBar = new LoadingBar();
    this.handModelFactory = new XRHandModelFactory(new Color(12044521), "mesh");
    this.screenControl = null;
    this.enableSpectator = false;
    this._xrBinding = null;
    this._xrMediaBinding = null;
    this._hasXRMediaLayers = null;
    this._hasXRCompositionLayers = null;
    this.DEBUG = DEBUG2 || false;
    this.defaultAvatarHeight = defaultAvatarHeight || 1.75;
    defaultFOV = defaultFOV || 60;
    this.camera = new PerspectiveCamera(defaultFOV, 1, 0.01, 1e3);
    this.cursor3D = new Cursor3D(this);
    if (isHTMLCanvas(canvas)) {
      canvas.style.backgroundColor = "black";
      if (isNullOrUndefined(canvas.parentElement)) {
        throw new Error("The provided canvas must be included in a parent element before constructing the environment.");
      }
    }
    this.renderer = new WebGLRenderer({
      canvas,
      powerPreference: "high-performance",
      precision: "lowp",
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      depth: true,
      logarithmicDepthBuffer: true,
      stencil: false,
      preserveDrawingBuffer: false
    });
    this.renderer.domElement.setAttribute("touch-action", "none");
    this.renderer.domElement.tabIndex = 1;
    this.useNewColorModel = false;
    if (isHTMLCanvas(canvas)) {
      this.screenControl = new ScreenControl(
        this.renderer,
        this.camera,
        this.renderer.domElement.parentElement,
        enableFullResolution
      );
    }
    this.fader = new Fader("ViewFader");
    this.worldUISpace = new BodyFollower("WorldUISpace", 0.2, 20, 0.125);
    this.avatar = new AvatarLocal(this, this.fader);
    this.eventSys = new EventSystem(this);
    this.timer = new XRTimer(this.renderer);
    this.skybox = new Skybox(this);
    this.renderer.xr.enabled = true;
    this.sun.name = "Sun";
    this.sun.position.set(0, 1, 1);
    this.sun.lookAt(0, 0, 0);
    this.sun.layers.enableAll();
    const showGround = () => {
      this.ground.visible = this.renderer.xr.isPresenting;
    };
    this.screenControl.addEventListener("sessionstarted", showGround);
    this.screenControl.addEventListener("sessionstopped", showGround);
    showGround();
    this.ambient.name = "Fill";
    this.ambient.layers.enableAll();
    this.loadingBar.object.name = "MainLoadingBar";
    this.loadingBar.object.position.set(0, -0.25, -2);
    this.scene.layers.enableAll();
    this.avatar.addFollower(this.worldUISpace);
    objGraph(
      this.scene,
      this.sun,
      this.ambient,
      objGraph(
        this.stage,
        this.ground,
        this.camera,
        this.avatar,
        ...this.eventSys.hands
      ),
      this.foreground,
      objGraph(
        this.worldUISpace,
        this.loadingBar
      )
    );
    this.timer.addTickHandler((evt) => this.update(evt));
    this._start();
    globalThis.env = this;
  }
  get useNewColorModel() {
    return ColorManagement.enabled;
  }
  set useNewColorModel(enabled) {
    ColorManagement.enabled = enabled;
    this.renderer.outputEncoding = enabled ? sRGBEncoding : LinearEncoding;
  }
  async _start() {
    if (isDefined(this.styleSheetPath)) {
      await this.fetcher.get(this.styleSheetPath).style();
    }
    this.timer.start();
  }
  get gl() {
    return this.renderer.getContext();
  }
  get referenceSpace() {
    return this.renderer.xr.getReferenceSpace();
  }
  update(evt) {
    this.dispatchEvent(evt);
    if (this.screenControl.visible) {
      const session = this.xrSession;
      this._xrBinding = this.renderer.xr.getBinding();
      if (this.hasXRMediaLayers && this._xrMediaBinding === null === this.renderer.xr.isPresenting) {
        if (this._xrMediaBinding === null && isDefined(session)) {
          this._xrMediaBinding = new XRMediaBinding(session);
        } else {
          this._xrMediaBinding = null;
        }
      }
      const baseLayer = session && this.renderer.xr.getBaseLayer();
      if (baseLayer !== this.baseLayer) {
        if (isDefined(this.baseLayer)) {
          this.removeWebXRLayer(this.baseLayer);
          this.baseLayer = null;
        }
        if (isDefined(baseLayer)) {
          this.baseLayer = baseLayer;
          this.addWebXRLayer(baseLayer, 0);
        }
      }
      this.screenControl.resize();
      this.eventSys.update();
      this.avatar.update(evt.dt);
      this.worldUISpace.update(this.avatar.height, this.avatar.worldPos, this.avatar.worldHeadingRadians, evt.dt);
      this.fader.update(evt.dt);
      updateScalings(evt.dt);
      this.loadingBar.update(evt.sdt);
      this.preRender(evt);
      const cam = resolveCamera(this.renderer, this.camera);
      if (cam !== this.camera) {
        const vrCam = cam;
        vrCam.layers.mask = this.camera.layers.mask;
        for (let i = 0; i < vrCam.cameras.length; ++i) {
          const subCam = vrCam.cameras[i];
          subCam.layers.mask = this.camera.layers.mask;
          subCam.layers.enable(i + 1);
          vrCam.layers.enable(i + 1);
        }
      }
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      if (this.enableSpectator) {
        if (!this.renderer.xr.isPresenting) {
          this.lastViewport.copy(this.curViewport);
          this.renderer.getViewport(this.curViewport);
        } else if (isDesktop() && !isFirefox()) {
          this.drawSnapshot();
        }
      }
    }
  }
  drawSnapshot() {
    const isPresenting = this.renderer.xr.isPresenting;
    let curRT = null;
    if (isPresenting) {
      const cam = resolveCamera(this.renderer, this.camera);
      this.spectator.projectionMatrix.copy(this.camera.projectionMatrix);
      this.spectator.position.copy(cam.position);
      this.spectator.quaternion.copy(cam.quaternion);
      curRT = this.renderer.getRenderTarget();
      this.renderer.xr.isPresenting = false;
      this.renderer.setRenderTarget(null);
      this.renderer.setViewport(this.lastViewport);
    }
    this.renderer.clear();
    this.renderer.render(this.scene, isPresenting ? this.spectator : this.camera);
    if (isPresenting) {
      this.renderer.setViewport(this.curViewport);
      this.renderer.setRenderTarget(curRT);
      this.renderer.xr.isPresenting = true;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  preRender(_evt) {
  }
  async onQuitting() {
    this.dispatchEvent(new TypedEvent("quitting"));
    window.location.href = "/";
  }
  get hasAlpha() {
    return this.renderer.getContextAttributes().alpha;
  }
  get xrSession() {
    return this.renderer.xr.getSession();
  }
  get xrBinding() {
    return this._xrBinding;
  }
  get xrMediaBinding() {
    return this._xrMediaBinding;
  }
  get isReadyForLayers() {
    return this.hasAlpha && (!isOculusBrowser || oculusBrowserVersion.major >= 15);
  }
  get hasXRMediaLayers() {
    if (this._hasXRMediaLayers === null) {
      this._hasXRMediaLayers = this.isReadyForLayers && "XRMediaBinding" in globalThis && isFunction(XRMediaBinding.prototype.createQuadLayer);
    }
    return this._hasXRMediaLayers;
  }
  get hasXRCompositionLayers() {
    if (this._hasXRCompositionLayers === null) {
      this._hasXRCompositionLayers = this.isReadyForLayers && "XRWebGLBinding" in globalThis && isFunction(XRWebGLBinding.prototype.createCubeLayer);
    }
    return this._hasXRCompositionLayers;
  }
  addWebXRLayer(layer, sortOrder) {
    this.layers.push(layer);
    this.layerSortOrder.set(layer, sortOrder);
    arraySortByKeyInPlace(this.layers, (l) => -this.layerSortOrder.get(l));
    this.updateLayers();
  }
  removeWebXRLayer(layer) {
    this.layerSortOrder.delete(layer);
    arrayRemove(this.layers, layer);
    this.updateLayers();
  }
  updateLayers() {
    const session = this.xrSession;
    if (isDefined(session)) {
      session.updateRenderState({
        layers: this.layers
      });
    }
  }
  clearScene() {
    this.dispatchEvent(new TypedEvent("sceneclearing"));
    cleanup(this.foreground);
    this.dispatchEvent(new TypedEvent("scenecleared"));
  }
  async fadeOut() {
    ++this.fadeDepth;
    if (this.fadeDepth === 1) {
      await this.fader.fadeOut();
      this.skybox.visible = false;
      this.camera.layers.set(PURGATORY);
      this.loadingBar.start();
      await this.fader.fadeIn();
    }
  }
  async fadeIn() {
    if (this.fadeDepth === 1) {
      await this.fader.fadeOut();
      this.camera.layers.set(FOREGROUND);
      this.skybox.visible = true;
      await this.fader.fadeIn();
    }
    --this.fadeDepth;
  }
  async withFade(action) {
    try {
      await this.fadeOut();
      return await action();
    } finally {
      await this.fadeIn();
    }
  }
  get showWebXRLayers() {
    return this.fadeDepth === 0;
  }
  set3DCursor(model2) {
    const children = model2.children.slice(0);
    for (const child of children) {
      this.cursor3D.add(child.name, child);
    }
    this.eventSys.refreshCursors();
    this.dispatchEvent(new TypedEvent("newcursorloaded"));
  }
  async load(progOrAsset, ...assets) {
    let prog = null;
    if (isAsset(progOrAsset)) {
      assets.push(progOrAsset);
    } else {
      prog = progOrAsset;
    }
    const cursor3d = new AssetGltfModel(this, "/models/Cursors.glb", Model_Gltf_Binary, !this.DEBUG);
    assets.push(cursor3d);
    await this.fetcher.assets(prog, ...assets);
    convertMaterials(cursor3d.result.scene, materialStandardToBasic);
    this.set3DCursor(cursor3d.result.scene);
  }
  loadGltf(file) {
    return this.gltfLoader.loadAsync(file);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/ChildProgressCallback.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/BaseParentProgressCallback.ts
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
      const end = performance.now();
      const delta = end - this.start;
      const est = this.start - end + delta * this.weightTotal / soFar;
      this.prog.report(soFar, this.weightTotal, msg, est);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/progressSplit.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/progressTasks.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/waitFor.ts
function waitFor(test) {
  const task = new Task();
  const handle = setInterval(() => {
    if (test()) {
      clearInterval(handle);
      task.resolve();
    }
  }, 100);
  return task;
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
  constructor(fetcher, method, path, useBLOBs = false) {
    this.fetcher = fetcher;
    this.method = method;
    this.path = path;
    this.useBLOBs = useBLOBs;
    this.prog = null;
    this.request = {
      method,
      path: this.path.href,
      body: null,
      headers: null,
      timeout: null,
      withCredentials: false,
      useCache: false,
      retryCount: 3
    };
  }
  retries(count) {
    this.request.retryCount = count;
    return this;
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
    if (isDefined(body)) {
      const seen = /* @__PURE__ */ new Set();
      const queue = new Array();
      queue.push(body);
      let isForm = false;
      while (!isForm && queue.length > 0) {
        const here = queue.shift();
        if (here && !seen.has(here)) {
          seen.add(here);
          if (here instanceof Blob) {
            isForm = true;
            break;
          } else if (!isString(here)) {
            queue.push(...Object.values(here));
          }
        }
      }
      if (isForm) {
        const form = new FormData();
        const fileNames = /* @__PURE__ */ new Map();
        const toSkip = /* @__PURE__ */ new Set();
        for (const [key, value] of Object.entries(body)) {
          if (value instanceof Blob) {
            const fileNameKey = key + ".name";
            const fileName = body[fileNameKey];
            if (isString(fileName)) {
              fileNames.set(value, fileName);
              toSkip.add(fileNameKey);
            }
          }
        }
        for (let [key, value] of Object.entries(body)) {
          if (toSkip.has(key)) {
            continue;
          }
          if (value instanceof Blob) {
            form.append(key, value, fileNames.get(value));
          } else if (isString(value)) {
            form.append(key, value);
          } else if (isDefined(value) && isFunction(value.toString)) {
            form.append(key, value.toString());
          } else {
            console.warn("Can't serialize value to formdata", key, value);
          }
        }
        body = form;
        contentType = void 0;
      }
      this.request.body = body;
      this.content(contentType);
    }
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
  async file(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return await this.fetcher.sendObjectGetFile(this.request, this.prog);
    } else if (this.method === "GET") {
      if (this.useBLOBs) {
        return await this.fetcher.sendNothingGetFile(this.request, this.prog);
      } else {
        const response = await this.fetcher.sendNothingGetNothing(this.request);
        return translateResponse(response, () => this.request.path);
      }
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
  async audioBuffer(context, acceptType) {
    return translateResponse(
      await this.audioBlob(acceptType),
      async (blob) => await context.decodeAudioData(await blob.arrayBuffer())
    );
  }
  async htmlElement(element, resolveEvt, acceptType) {
    const response = await this.file(acceptType);
    const task = once(element, resolveEvt, "error");
    if (element instanceof HTMLLinkElement) {
      element.href = response.content;
    } else {
      element.src = response.content;
    }
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
  async style() {
    const tag2 = Link(
      type(Text_Css),
      rel("stylesheet")
    );
    document.head.append(tag2);
    const response = await this.htmlElement(
      tag2,
      "load",
      Text_Css
    );
    return translateResponse(response);
  }
  async getScript() {
    const tag2 = Script(type(Application_Javascript));
    document.head.append(tag2);
    const response = await this.htmlElement(
      tag2,
      "load",
      Application_Javascript
    );
    return translateResponse(response);
  }
  async script(test) {
    let response = null;
    const scriptPath = this.request.path;
    if (!test) {
      response = await this.getScript();
    } else if (!test()) {
      const scriptLoadTask = waitFor(test);
      response = await this.getScript();
      await scriptLoadTask;
    }
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return response;
  }
  async module() {
    const scriptPath = this.request.path;
    const response = await this.file(Application_Javascript);
    const value = await import(response.content);
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return translateResponse(response, () => value);
  }
  async wasm(imports) {
    const response = await this.buffer(Application_Wasm);
    if (!Application_Wasm.matches(response.contentType)) {
      throw new Error(`Server did not respond with WASM file. Was: ${response.contentType}`);
    }
    const module = await WebAssembly.compile(response.content);
    const instance = await WebAssembly.instantiate(module, imports);
    return translateResponse(response, () => instance.exports);
  }
  async worker(type2 = "module") {
    const scriptPath = this.request.path;
    const response = await this.file(Application_Javascript);
    this.prog = null;
    this.request.timeout = null;
    const worker = new Worker(response.content, { type: type2 });
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return translateResponse(response, () => worker);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/Fetcher.ts
var Fetcher = class {
  constructor(service, useBLOBs = false) {
    this.service = service;
    this.useBLOBs = useBLOBs;
    if (true) {
      const antiforgeryToken = getInput("input[name=__RequestVerificationToken]");
      if (antiforgeryToken) {
        this.service.setRequestVerificationToken(antiforgeryToken.value);
      }
    }
  }
  clearCache() {
    return this.service.clearCache();
  }
  evict(path, base) {
    return this.service.evict(new URL(path, base || location.href).href);
  }
  request(method, path, base) {
    return new RequestBuilder(
      this.service,
      method,
      new URL(path, base || location.href),
      this.useBLOBs
    );
  }
  head(path, base) {
    return this.request("HEAD", path, base);
  }
  options(path, base) {
    return this.request("OPTIONS", path, base);
  }
  get(path, base) {
    return this.request("GET", path, base);
  }
  post(path, base) {
    return this.request("POST", path, base);
  }
  put(path, base) {
    return this.request("PUT", path, base);
  }
  patch(path, base) {
    return this.request("PATCH", path, base);
  }
  delete(path, base) {
    return this.request("DELETE", path, base);
  }
  async assets(progressOrAsset, firstAsset, ...assets) {
    if (isNullOrUndefined(assets)) {
      assets = [];
    }
    assets.unshift(firstAsset);
    let progress;
    if (isAsset(progressOrAsset)) {
      assets.unshift(progressOrAsset);
    } else if (isDefined(progressOrAsset)) {
      progress = progressOrAsset;
    }
    assets = assets.filter(isDefined);
    const sizes = await Promise.all(assets.map((asset) => asset.getSize(this)));
    const assetSizes = new Map(sizes);
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
  evict(path) {
    return this.impl.evict(path);
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
  sendNothingGetObject(request, progress) {
    return this.impl.sendNothingGetSomething("json", request, progress);
  }
  sendObjectGetObject(request, progress) {
    return this.impl.sendSomethingGetSomething("json", request, this.defaultPostHeaders, progress);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/mapMap.ts
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/makeLookup.ts
function makeLookup(items, makeID) {
  return mapMap(items, makeID, identity);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/PriorityList.ts
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
  add(key, ...values) {
    for (const value of values) {
      if (isNullOrUndefined(key)) {
        this.defaultItems.push(value);
      } else {
        let list = this.items.get(key);
        if (isNullOrUndefined(list)) {
          this.items.set(key, list = []);
        }
        list.push(value);
      }
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/PriorityMap.ts
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
      const items = this.items.get(key1);
      const deleted = items.delete(key2);
      if (items.size === 0) {
        this.items.delete(key1);
      }
      return deleted;
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
  static delete(dbName) {
    const deleteRequest = indexedDB.deleteDatabase(dbName);
    const task = once(deleteRequest, "success", "error", "blocked");
    return success(task);
  }
  static async open(name, ...storeDefs) {
    const storesByName = makeLookup(storeDefs, (v) => v.name);
    const indexesByName = new PriorityMap(
      storeDefs.filter((storeDef) => isDefined(storeDef.indexes)).flatMap((storeDef) => storeDef.indexes.map((indexDef) => [storeDef.name, indexDef.name, indexDef]))
    );
    const storesToAdd = new Array();
    const storesToRemove = new Array();
    const storesToChange = new Array();
    const indexesToAdd = new PriorityList();
    const indexesToRemove = new PriorityList();
    let version3 = null;
    const D2 = indexedDB.open(name);
    if (await success(once(D2, "success", "error", "blocked"))) {
      const db = D2.result;
      version3 = db.version;
      const storesToScrutinize = new Array();
      for (const storeName of db.objectStoreNames) {
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
          const storeDef = storesByName.get(storeName);
          if (isDefined(storeDef.options) && store.keyPath !== storeDef.options.keyPath) {
            storesToRemove.push(storeName);
            storesToAdd.push(storeName);
          }
          for (const indexName of store.indexNames) {
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
      dispose(db);
    } else {
      version3 = 0;
      storesToAdd.push(...storesByName.keys());
      for (const storeDef of storeDefs) {
        if (isDefined(storeDef.indexes)) {
          for (const indexDef of storeDef.indexes) {
            indexesToAdd.add(storeDef.name, indexDef.name);
          }
        }
      }
    }
    if (storesToAdd.length > 0 || storesToRemove.length > 0 || indexesToAdd.size > 0 || indexesToRemove.size > 0) {
      ++version3;
    }
    const upgrading = new Task();
    const openRequest = isDefined(version3) ? indexedDB.open(name, version3) : indexedDB.open(name);
    const opening = once(openRequest, "success", "error", "blocked");
    const upgraded = success(upgrading);
    const opened = success(opening);
    const noUpgrade = upgrading.resolver(false);
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
    dispose(this.db);
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
  async has(query) {
    return await this.getCount(query) > 0;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/mapJoin.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/sleep.ts
var SleepTask = class extends Task {
  constructor(milliseconds) {
    super(false);
    this.milliseconds = milliseconds;
    this._timer = null;
  }
  start() {
    super.start();
    this._timer = setTimeout(() => {
      this._timer = null;
      this.resolve();
    }, this.milliseconds);
  }
  reset() {
    super.reset();
    if (isDefined(this._timer)) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
};
function sleep(milliseconds) {
  const task = new SleepTask(milliseconds);
  task.start();
  return task;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/withRetry.ts
function withRetry(retryCount, action) {
  return async () => {
    let lastError = null;
    let retryTime = 500;
    for (let retry = 0; retry <= retryCount; ++retry) {
      try {
        if (retry > 0) {
          await sleep(retryTime);
          retryTime *= 2;
        }
        return await action();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };
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
  const requestComplete = new Task();
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
        if (done) {
          requestComplete.resolve();
        }
      }
    }
  });
  target.addEventListener("load", () => {
    if (prevDone && !done) {
      if (prog) {
        prog.end(name);
      }
      done = true;
      if (loaded) {
        requestComplete.resolve();
      }
    }
  });
  const onError = (msg) => () => {
    if (prevDone) {
      requestComplete.reject(`${msg} (${xhr.status})`);
    }
  };
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
      imageOrientation: "from-image"
    }), (img) => {
      canvas.width = img.width;
      canvas.height = img.height;
      const g = canvas.getContext("2d");
      g.drawImage(img, 0, 0);
      return translateResponse(response);
    });
  }
  async openCache() {
    const options = {
      keyPath: "requestPath"
    };
    this.cache = await IDexDB.open(DB_NAME, {
      name: "files",
      options
    });
    this.store = await this.cache.getStore("files");
  }
  async clearCache() {
    await this.cacheReady;
    await this.store.clear();
  }
  async evict(path) {
    await this.cacheReady;
    if (this.store.has(path)) {
      await this.store.delete(path);
    }
  }
  async readResponseHeaders(requestPath, xhr) {
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
      requestPath,
      responsePath: xhr.responseURL,
      content: void 0,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    };
    return response;
  }
  async readResponse(requestPath, xhr) {
    const {
      responsePath,
      status,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    } = await this.readResponseHeaders(requestPath, xhr);
    const response = {
      requestPath,
      responsePath,
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
    return this.withCachedTask(
      request,
      withRetry(request.retryCount, async () => {
        const xhr = new XMLHttpRequest();
        const download = trackProgress(`requesting: ${request.path}`, xhr, xhr, null, true);
        sendRequest(xhr, request.method, request.path, request.timeout, request.headers);
        await download;
        return await this.readResponseHeaders(request.path, xhr);
      })
    );
  }
  sendNothingGetSomething(xhrType, request, progress) {
    return this.withCachedTask(
      request,
      withRetry(request.retryCount, async () => {
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
      })
    );
  }
  sendSomethingGetSomething(xhrType, request, defaultPostHeaders, progress) {
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
    const hasBody = isDefined(body);
    const progs = progressSplit(progress, hasBody ? 2 : 1);
    const [progUpload, progDownload] = progs;
    const query = async () => {
      const xhr = new XMLHttpRequest();
      const upload = hasBody ? trackProgress("uploading", xhr, xhr.upload, progUpload, false) : Promise.resolve();
      const download = trackProgress("saving", xhr, xhr, progDownload, true, upload);
      sendRequest(xhr, request.method, request.path, request.timeout, headers, body);
      await upload;
      await download;
      const response = await this.readResponse(request.path, xhr);
      return await this.decodeContent(xhrType, response);
    };
    return withRetry(request.retryCount, query)();
  }
};

// src/isDebug.ts
var url = /* @__PURE__ */ new URL(globalThis.location.href);
var isDebug = !url.searchParams.has("RELEASE");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/strings/stringRandom.ts
var DEFAULT_CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
function stringRandom(length3, charSet) {
  if (length3 < 0) {
    throw new Error("Length must be greater than 0");
  }
  if (isNullOrUndefined(charSet)) {
    charSet = DEFAULT_CHAR_SET;
  }
  let str = "";
  for (let i = 0; i < length3; ++i) {
    const idx = Math.floor(Math.random() * charSet.length);
    str += charSet[idx];
  }
  return str;
}

// package.json
var version = "3.7.24";

// src/settings.ts
var version2 = isDebug ? stringRandom(10) : version;
var DEMO_PPI = 50;
var DEMO_DIM = 12;
var DEMO_PX = DEMO_PPI * DEMO_DIM;
var defaultFont = {
  fontFamily: "Lato",
  fontSize: 20
};
var DLSBlue = rgb(30, 67, 136);
var BasicLabelColor = rgb(78, 77, 77);
var baseTextStyle = {
  fontFamily: defaultFont.fontFamily,
  fontSize: defaultFont.fontSize,
  textFillColor: "white"
};
var textButtonStyle = Object.assign({}, baseTextStyle, {
  bgFillColor: rgb(0, 120, 215),
  bgStrokeColor: "black",
  bgStrokeSize: 0.02,
  padding: {
    top: 0.025,
    left: 0.05,
    bottom: 0.025,
    right: 0.05
  },
  minHeight: 0.2,
  maxHeight: 0.2,
  scale: 300
});
var textLabelStyle = Object.assign({}, baseTextStyle, {
  textStrokeColor: "black",
  textStrokeSize: 0.01,
  minHeight: 0.25,
  maxHeight: 0.25
});
var CSS_EXT = isDebug ? ".css" : ".min.css";
function getAppUrl(ext, name) {
  return `/js/${name}/index${ext}?v=${version2}`;
}
function getStyleUrl(name) {
  return getAppUrl(CSS_EXT, name);
}
function getDOMStyleUrl(name) {
  return getStyleUrl("dom-apps/" + name);
}

// src/createFetcher.ts
function createFetcher(enableWorkers = true) {
  let fallback = new FetchingService(new FetchingServiceImplXHR());
  if (false) {
    fallback = new FetchingServicePool({
      scriptPath: getWorkerUrl("fetcher")
    }, fallback);
  }
  return new Fetcher(fallback, !isDebug);
}

// src/dom-apps/photosphere-viewer/index.ts
(async function() {
  const url2 = new URL(location.href);
  const fileID = url2.searchParams.get("FileID");
  const fetcher = createFetcher();
  const env = new BaseEnvironment(
    getCanvas("#frontBuffer"),
    getDOMStyleUrl("photosphere-viewer"),
    fetcher,
    false
  );
  await env.withFade(async () => {
    const path = `/vr/file/${fileID}`;
    const image = await fetcher.get(path).progress(env.loadingBar).image().then(unwrapResponse);
    await env.skybox.setImage(path, image);
  });
})();
//# sourceMappingURL=index.js.map
