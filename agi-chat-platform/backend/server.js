const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

let agiModel = null;

// Endpoint to upload AGI model JSON file
app.post('/upload-model', upload.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = path.join(__dirname, req.file.path);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read uploaded file' });
    }
    try {
      agiModel = JSON.parse(data);
      // Delete the uploaded file after reading
      fs.unlinkSync(filePath);
      res.json({ message: 'Model uploaded successfully' });
    } catch (parseErr) {
      res.status(400).json({ error: 'Invalid JSON file' });
    }
  });
});

// Endpoint to chat with AGI
app.post('/chat', (req, res) => {
  const { message } = req.body;
  if (!agiModel) {
    return res.status(400).json({ error: 'No AGI model loaded' });
  }
  // For demo, respond with a simple echo or a fixed response
  // In real scenario, use agiModel to generate response
  const response = `AGI Response to: "${message}"`;
  res.json({ response });
});

app.listen(port, () => {
  console.log(\`AGI chat server listening at http://localhost:\${port}\`);
});
