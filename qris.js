const sharp = require('sharp');
const jsQR = require('jsqr');

function parseQRIS(data) {
    const result = {};
    let i = 0;
    while (i < data.length) {
        const id = data.substr(i, 2);
        const len = parseInt(data.substr(i + 2, 2));
        const value = data.substr(i + 4, len);
        result[id] = value;
        i += 4 + len;
    }
    return result;
}

async function readQRISFromImage(imagePath) {
    const image = await sharp(imagePath)
        .raw()
        .ensureAlpha()
        .resize({ width: 400 })
        .toBuffer({ resolveWithObject: true });

    const { data, info } = image;
    const qrCode = jsQR(data, info.width, info.height);
    if (!qrCode) return null;

    return parseQRIS(qrCode.data);
}

module.exports = { parseQRIS, readQRISFromImage };
