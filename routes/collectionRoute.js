const express = require('express');
const router = express.Router();
const {
    createCollection,
    getCollectionsByUser,
    updateCollection,
    deleteCollection,
    shareCollection,
    removeLinkFromCollection
  } = require('../controllers/collectionController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware


// Routes for managing collections
router.post('/',protect,createCollection);  // Create a collection
router.get('/user/:userId',protect,getCollectionsByUser);  // Get all collections by a user
router.put('/update/:collectionId',protect,updateCollection);  // Update a collection (name or description)
router.put('/removeLink/:collectionId',protect,removeLinkFromCollection);  // Update a collection (name or description)
router.delete('/delete/:collectionId',protect,deleteCollection);  // Delete a collection
router.post('/share',protect,shareCollection);  // Share a collection with other users

module.exports = router;
