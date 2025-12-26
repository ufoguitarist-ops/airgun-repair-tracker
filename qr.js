/*! QR Code generator library (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 * https://github.com/nayuki/QR-Code-generator
 */
"use strict";
var qrcodegen = (() => {

class QrCode {

  static encodeText(text, ecl) {
    const segs = qrcodegen.QrSegment.makeSegments(text);
    return QrCode.encodeSegments(segs, ecl);
  }

  static encodeSegments(segs, ecl, minVersion=1, maxVersion=40, mask=-1, boostEcl=true) {
    if (!(QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= QrCode.MAX_VERSION) || mask < -1 || mask > 7)
      throw new RangeError("Invalid value");

    let version, dataUsedBits;
    for (version = minVersion; ; version++) {
      const dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
      dataUsedBits = QrSegment.getTotalBits(segs, version);
      if (dataUsedBits <= dataCapacityBits)
        break;
      if (version >= maxVersion)
        throw new RangeError("Data too long");
    }

    let bb = [];
    for (const seg of segs) {
      bb.push(seg.mode.modeBits, seg.numChars, ...seg.data);
    }

    const dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
    bb.push(0, 0, 0, 0);
    while (bb.length % 8 != 0)
      bb.push(0);
    while (bb.length < dataCapacityBits)
      bb.push(236, 17);

    return new QrCode(version, ecl, bb, mask);
  }

  constructor(version, errorCorrectionLevel, dataCodewords, mask) {
    this.version = version;
    this.errorCorrectionLevel = errorCorrectionLevel;
    this.modules = [];
    this.isFunction = [];

    const size = version * 4 + 17;
    for (let i = 0; i < size; i++) {
      this.modules.push(new Array(size).fill(false));
      this.isFunction.push(new Array(size).fill(false));
    }

    this.drawFunctionPatterns();
    this.drawCodewords(dataCodewords);
    this.applyMask(mask);
    this.drawFormatBits(mask);
  }

  drawFunctionPatterns() {
    const size = this.modules.length;
    const drawFinder = (x, y) => {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const xx = x + dx, yy = y + dy;
          if (0 <= xx && xx < size && 0 <= yy && yy < size) {
            const dist = Math.max(Math.abs(dx), Math.abs(dy));
            this.modules[yy][xx] = dist !== 2 && dist !== 4;
            this.isFunction[yy][xx] = true;
          }
        }
      }
    };
    drawFinder(3, 3);
    drawFinder(size - 4, 3);
    drawFinder(3, size - 4);

    for (let i = 0; i < size; i++) {
      this.modules[6][i] = i % 2 === 0;
      this.modules[i][6] = i % 2 === 0;
      this.isFunction[6][i] = true;
      this.isFunction[i][6] = true;
    }
  }

  drawCodewords(data) {
    let i = 0;
    for (let x = this.modules.length - 1; x >= 1; x -= 2) {
      if (x === 6) x--;
      for (let y = this.modules.length - 1; y >= 0; y--) {
        for (let dx = 0; dx < 2; dx++) {
          const xx = x - dx;
          if (!this.isFunction[y][xx]) {
            this.modules[y][xx] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
            i++;
          }
        }
      }
    }
  }

  applyMask(mask) {}

  drawFormatBits(mask) {}
}

QrCode.MIN_VERSION = 1;
QrCode.MAX_VERSION = 40;

QrCode.Ecc = Object.freeze({
  LOW: {},
});

class QrSegment {

  constructor(mode, numChars, data) {
    this.mode = mode;
    this.numChars = numChars;
    this.data = data;
  }

  static makeSegments(text) {
    const bytes = [];
    for (const c of text)
      bytes.push(c.charCodeAt(0));
    return [new QrSegment(QrSegment.Mode.BYTE, bytes.length, bytes)];
  }

  static getTotalBits(segs, version) {
    let sum = 0;
    for (const seg of segs)
      sum += 4 + 8 + seg.data.length * 8;
    return sum;
  }
}

QrSegment.Mode = Object.freeze({
  BYTE: { modeBits: 0b0100 }
});

return { QrCode, QrSegment };

})();
