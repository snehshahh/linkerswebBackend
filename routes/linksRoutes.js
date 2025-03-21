// routes/linksRoute.js
const express = require('express');
const router = express.Router();
const LinksController = require('../controllers/linksController');
const {protect} =require('../middlewares/authMiddleware')


router.post('/links',protect, LinksController.createLink);
router.post('/links/share',protect, LinksController.shareLink);
router.delete('/links/:linkId',protect, LinksController.deleteLink);
router.put('/links/:linkId',protect, LinksController.updateLinkDetails);
router.get('/links/:user_id',protect,LinksController.getUserLinks);
router.get('/links/public',protect, LinksController.getPublicLinks);

module.exports = router;