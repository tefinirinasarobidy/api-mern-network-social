const router = require('express').Router();
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')

// register
router.post("/register",authController.singUp);
// get all user 
router.get("/",userController.getAllUsers);
// info user
router.get('/:id',userController.userInfo)
// modify user 
router.put('/:id',userController.modifyUser)
// delete user
router.delete('/:id',userController.deleteUser)

// follow user
router.patch('/follow/:id',userController.followUser)
// unfollow user
router.patch('/unfollow/:id',userController.unfollowUser)

module.exports = router;