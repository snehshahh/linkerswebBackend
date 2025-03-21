const express = require('express');
const router = express.Router();
const { createCollection, addLinkToCollection, shareCollection, getUserCollections, updateCollection, deleteCollection } = require('../controllers/collectionController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/collections', protect, createCollection);
router.post('/collections/add-link', protect, addLinkToCollection);
router.post('/collections/share', protect, shareCollection);
router.get('/collections/:userId', protect, getUserCollections);
router.put('/update-collections/:collectionId', protect, updateCollection);
router.delete('/delete-collections/:collectionId', protect, deleteCollection);

module.exports = router;