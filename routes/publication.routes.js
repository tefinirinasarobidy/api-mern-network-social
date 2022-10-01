const router = require('express').Router();
const publicationController = require('../controllers/publication.controller.js')



router.post('/create',publicationController.create)
router.get('/',publicationController.getAll)
router.put('/:id',publicationController.update)
router.delete('/:id',publicationController.destroy)

router.patch('/like/:id',publicationController.like)
router.patch('/unlike/:id',publicationController.unlike)

router.patch('/comment/:id',publicationController.comments)
router.patch('/comment-edit/:id',publicationController.editComment)
router.patch('/comment-delete/:id',publicationController.deleteComment)



module.exports = router;