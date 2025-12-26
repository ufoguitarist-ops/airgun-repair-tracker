/*! QR Code generator library (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 */
var qrcodegen = (() => {
"use strict";
class QrCode {
  constructor(version, errorCorrectionLevel, dataCodewords, mask) {
    this.version = version;
    this.errorCorrectionLevel = errorCorrectionLevel;
    this.mask = mask;
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
    this.drawFormatBits(errorCorrectionLevel, mask);
  }
  static encodeText(text, ecl) {
    const segs = [QrSegment.makeBytes(QrSegment.toUtf8ByteArray(text))];
    return QrCode.encodeSegments(segs, ecl);
  }
  static encodeSegments(segs, ecl) {
    let dataUsedBits = QrSegment.getTotalBits(segs, 1);
    let version = 1;
    while (true) {
      const capacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
      if (dataUsedBits <= capacityBits) break;
      version++;
    }
    return new QrCode(version, ecl, QrCode.createData(version, ecl, segs), 0);
  }
  static getNumDataCodewords(ver, ecl) {
    return Math.floor((ver * 16 + 128) / 8);
  }
  static createData(ver, ecl, segs) {
    let bb = [];
    for (const seg of segs) {
      for (let i = 0; i < seg.data.length; i++)
        bb.push(seg.data[i]);
    }
    return bb;
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
  }
  drawCodewords(data) {
    let i = 0;
    for (let y = this.modules.length - 1; y >= 0; y -= 2) {
      for (let x = this.modules.length - 1; x >= 0; x--) {
        if (!this.isFunction[y][x]) {
          this.modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
          i++;
        }
      }
    }
  }
  applyMask(mask) {}
  drawFormatBits(ecl, mask) {}
}
class QrSegment {
  constructor(data) { this.data = data; }
  static makeBytes(data) { return new QrSegment(data); }
  static toUtf8ByteArray(str) {
    return Array.from(new TextEncoder().encode(str));
  }
  static getTotalBits(segs, ver) {
    let sum = 0;
    for (const seg of segs) sum += seg.data.length * 8;
    return sum;
  }
}
QrCode.Ecc = { LOW: 0 };
return { QrCode, QrSegment };
})();
