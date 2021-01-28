const { default: fetch } = require("node-fetch");
const fs = require("fs/promises");
const generator = require(".");
const path = require("path");

const googleAPIKey = process.env.GOOGLE_API_KEY;

main().catch((err) => console.error(err));

async function main() {
  const [base64Data, json] = await Promise.all([
    generateImageData(),
    fetchListJson(),
  ]);
  
  const dir = await prepareDestDir();
  await Promise.all([
    saveImage(dir, base64Data),
    saveJson(dir, json),
  ]);

  console.log("Done.");
}

/**
 * Returns PNG image in Base64 format.
 * @returns {Promise<string>}
 */
function generateImageData() {
  return new Promise((resolve) => {
    generator.getImage({
      callback(base64Data) {
        resolve(base64Data);
      },
      googleAPIKey,
      options: {
        lineHeight: "25px",
        fontSize: "17px",
        width: "400px"
      },
      port: 1224,
    });
  });
}

function fetchListJson() {
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${googleAPIKey}`;
  return fetch(url).then((res) => {
    return res.text();
  });
}

/**
 * @return {Promise<string>} Created dir name
 */
async function prepareDestDir() {
  const listVersion = generateListVersion(new Date);
  const dir = path.resolve(`dest/${listVersion}`);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

/**
 * @param {string} dir
 * @param {string} base64Data
 * @returns {Promise<void>}
 */
async function saveImage(dir, base64Data) {
  const destPath = path.resolve(dir, "google-font-image.png");
  await fs.writeFile(destPath, base64Data, "base64");
}

/**
 * @param {string} dir
 * @param {string} json
 * @returns {Promise<void>}
 */
async function saveJson(dir, json) {
  const destPath = path.resolve(dir, "google-font-data.json");
  await fs.writeFile(destPath, json, "utf8");
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
