/**
 * deploy-netlify.cjs — Manual Netlify deploy script
 *
 * Reads the built dist/ directory, computes SHA-1 hashes for each file,
 * creates a Netlify deployment via their REST API, and uploads any files
 * the CDN doesn't already have. Used when you need to deploy outside of
 * Netlify's git integration.
 *
 * Requires: NETLIFY_TOKEN, NETLIFY_SITE_ID in env
 * Usage: node deploy-netlify.cjs
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
const SITE_ID = process.env.NETLIFY_SITE_ID;

if (!NETLIFY_TOKEN || !SITE_ID) {
  console.error('Missing required env vars: NETLIFY_TOKEN, NETLIFY_SITE_ID');
  process.exit(1);
}
const DIST_DIR = './dist';

function sha1(data) {
  return crypto.createHash('sha1').update(data).digest('hex');
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

async function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function uploadFile(deployId, sha, filePath) {
  const fileContent = fs.readFileSync(filePath);
  const options = {
    hostname: 'api.netlify.com',
    path: `/api/v1/deploys/${deployId}/files/${sha}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${NETLIFY_TOKEN}`,
      'Content-Length': fileContent.length
    }
  };
  return makeRequest(options, fileContent);
}

async function deploy() {
  try {
    // Get all files and their SHAs
    const files = getAllFiles(DIST_DIR);
    const fileManifest = {};

    files.forEach((file) => {
      const content = fs.readFileSync(file);
      const sha = sha1(content);
      const relativePath = '/' + path.relative(DIST_DIR, file).replace(/\\/g, '/');
      fileManifest[relativePath] = sha;
    });

    console.log('Files to deploy:', Object.keys(fileManifest));

    // Create deployment
    const deployOptions = {
      hostname: 'api.netlify.com',
      path: `/api/v1/sites/${SITE_ID}/deploys`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const deployData = JSON.stringify({ files: fileManifest });
    const deployment = await makeRequest(deployOptions, deployData);
    console.log('Deployment created:', deployment.id);

    // Upload required files
    if (deployment.required && deployment.required.length > 0) {
      console.log('Uploading', deployment.required.length, 'files...');

      for (const requiredSha of deployment.required) {
        const fileEntry = Object.entries(fileManifest).find(([_, sha]) => sha === requiredSha);
        if (fileEntry) {
          const [relativePath] = fileEntry;
          const fullPath = path.join(DIST_DIR, relativePath.slice(1));
          console.log('Uploading:', relativePath);
          await uploadFile(deployment.id, requiredSha, fullPath);
        }
      }
    }

    console.log('Deployment complete!');
    console.log('URL:', deployment.ssl_url || deployment.url);
    console.log('Admin URL:', deployment.admin_url);

  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
