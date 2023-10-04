const express = require('express');
const upload = require('../config/multerConfig');
const User = require('../models/User');


const router = express.Router();

router.post('/upload', upload.single('user_image'), async (req, res) => {
  try {
    // Get the file path of the uploaded image
    const imagePath = req.file.path;

    // Update the user's user_image column with the image path
    await User.update({ user_image: imagePath }, { where: { id: req.user.id } });

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;