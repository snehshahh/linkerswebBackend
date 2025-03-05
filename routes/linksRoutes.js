// routes/linksRoute.js
const express = require('express');
const router = express.Router();
const LinksController = require('../controllers/linksController');

router.post('/links', LinksController.createLink);
router.post('/links/share', LinksController.shareLink);
router.delete('/links/:linkId', LinksController.deleteLink);
router.put('/links/:linkId', LinksController.updateLinkDetails);
router.get('/links/:userId', LinksController.getUserLinks);

module.exports = router;