const express = require('express');
const router = express.Router();
const {
  createLink,
  shareLink,
  deleteLink,
  updateDescription,
  getUserLinks
} = require('../controllers/linksController');

// Route to create a new link
router.post('/', createLink);

// Route to share a link
router.post('/share', shareLink);

// Route to delete a link
router.delete('/delete/:linkId', deleteLink);

// Route to update the link description
router.put('/update/:linkId', updateDescription);

router.get('/user/:userId', getUserLinks);


module.exports = router;
