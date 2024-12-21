const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage client with Application Default Credentials
const storage = new Storage();

// Function to list all files in a bucket
async function listFiles(bucketName) {
  try {
    console.log(`Fetching files from bucket: ${bucketName}`);
    const [files] = await storage.bucket(bucketName).getFiles();
    return files.map(file => file.name);
  } catch (error) {
    console.error('Error fetching files:', error);
    throw new Error('Failed to list files');
  }
}

// Function to generate a signed URL for a file
async function getSignedUrl(bucketName, fileName) {
  try {
    console.log('Generating signed URL...');
    console.log(`Bucket Name: ${bucketName}`);
    console.log(`File Name: ${fileName}`);

    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // URL valid for 15 minutes
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    console.log('Signed URL generated:', url);
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}

module.exports = { listFiles, getSignedUrl };
