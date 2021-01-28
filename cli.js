const fs = require("fs/promises");
const generator = require(".");
const path = require("path");

const googleAPIKey = process.env.GOOGLE_API_KEY;

main().catch((err) => console.error(err));

async function main() {
  const base64Data = await generateImageData();
  await saveImage(base64Data);
  console.log("Done.");
}

/**
 * Returns PNG image in Base64 format.
 * @returns {Promise<string>}
 */
function generateImageData() {
  return new Promise((resolve) => {
    generator.getImage({
      callback: function(base64Data) {
        resolve(base64Data);
      },
      port: 1224,
      options: {
        lineHeight: "25px",
        fontSize: "17px",
        width: "400px"
      },
      googleAPIKey,
    });  
  });
}

/**
 * @param {string} base64Data
 * @returns {Promise<void>}
 */
async function saveImage(base64Data) {
  const listVersion = generateListVersion(new Date);
  const destPath = path.resolve(`dest/${listVersion}/google-font-image.png`);

  const dir = path.dirname(destPath);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(destPath, base64Data, "base64");
}

/**
 * @param {Date} date
 */
function generateListVersion(date) {
  const sYear = `${date.getFullYear()}`;
  const sMonth = `${date.getMonth() + 1}`.padStart(2, "0");
  const sDate = `${date.getDate()}`.padStart(2, "0");
  return `${sYear}${sMonth}${sDate}`;
}
