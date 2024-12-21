require('dotenv').config(); // Load environment variables
const express = require('express');
const { listFiles, getSignedUrl } = require('./services/gcs'); // Import GCS services

const app = express();
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// List files in a bucket
app.get('/files/:bucketName', async (req, res) => {
  const { bucketName } = req.params;

  try {
    const files = await listFiles(bucketName);
    res.json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching files from bucket');
  }
});

// Generate a signed URL for a video file
app.get('/video/:bucketName/:fileName', async (req, res) => {
  const { bucketName } = req.params;
  const fileName = decodeURIComponent(req.params.fileName); // Decode special characters

  try {
    console.log('Bucket:', bucketName);
    console.log('File:', fileName);

    const signedUrl = await getSignedUrl(bucketName, fileName);
    res.json({ url: signedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating signed URL');
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
