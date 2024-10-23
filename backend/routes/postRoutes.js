const express = require("express");
const {addNewPost, getAllPost, getUserPost, likePost, disLikePost, addComment, getCommentOfPost, deletePost, bookMarkedPost} = require("../controllers/postController")
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");
const router = express.Router();

router.route('/addpost').post(isAuthenticated,upload.single('image'),addNewPost);
router.route('/all').get(isAuthenticated,getAllPost);
router.route('/userpost/all').get(isAuthenticated,getUserPost);
router.route('/:id/like').get(isAuthenticated,likePost);
router.route('/:id/dislike').get(isAuthenticated,disLikePost);
router.route('/:id/comment').post(isAuthenticated,addComment);
router.route('/:id/comment/all').post(isAuthenticated,getCommentOfPost);
router.route('/delete/:id').delete(isAuthenticated,deletePost);
router.route('/:id/bookmark').get(isAuthenticated,bookMarkedPost);



module.exports = router