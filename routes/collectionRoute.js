// routes/collectionRoute.js
const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/collectionController');

router.post('/collections', CollectionController.createCollection);
router.get('/collections/:userId', CollectionController.getCollectionsByUser);
router.post('/collections/share', CollectionController.shareCollection);
router.delete('/collections/:collectionId', CollectionController.deleteCollection);
router.put('/collections/:collectionId', CollectionController.updateCollection);
router.post('/collections/:collectionId/links', CollectionController.addLinkToCollection);
router.delete('/collections/:collectionId/links', CollectionController.removeLinkFromCollection);

module.exports = router;