const express = require('express');
const router = express.Router();
const {
  createLink,
  shareLink,
  deleteLink,
  updateLinkDetails,
  getUserLinks
} = require('../controllers/linksController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware


// Route to create a new link
router.post('/',protect, createLink);

// Route to share a link
router.post('/share',protect, shareLink);

// Route to delete a link
router.delete('/delete/:linkId',protect, deleteLink);

// Route to update the link description
router.put('/update/:linkId',protect, updateLinkDetails);

router.get('/user/:userId',protect, getUserLinks);


module.exports = router;
