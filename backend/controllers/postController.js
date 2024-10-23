const sharp = require("sharp")
const cloudinary = require("../utils.js/cloudinary")
const postModel = require("../model/postModel")
const userModel = require("../model/userModel");
const Comment = require("../model/commentModel");
const { getReceiverSocketId,io } = require("../socket/socket");


const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({
                message: 'Image required !'
            })
        }
        //Image upload
        const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: 'inside' }).toFormat('jpeg', { quality: 80 }).toBuffer();

        // convert buffer to dataUri 
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const post = await postModel.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })

        const user = await userModel.findById(authorId);

        if (user) {
            user.post.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true
        })


    } catch (error) {
        console.log("addNewPost error", error)
    }
}

const getAllPost = async (req, res) => {
    try {
        const post = await postModel.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'username profilePicture' }).populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilePicture' } });

        return res.status(200).json({
            post,
            success: true
        })
    } catch (error) {
        console.log("All post error", error)
    }
}

const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const post = await postModel.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilePicture' } });

        return res.status(200).json({
            post,
            success: true
        })
    } catch (error) {
        console.log("User post error", error)
    }
}

const likePost = async (req, res) => {
    try {
        const likeKrneWaleUserKiId = req.id;
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found", success: false });

        //like logic started 
        await post.updateOne({ $addToSet: { likes: likeKrneWaleUserKiId } });

        await post.save();

        //implement socket io for real time notification
        const user = await userModel.findById(likeKrneWaleUserKiId).select('username profilePicture');

        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKrneWaleUserKiId){
            //emit notification
            const notification = {
                type:'like',
                userId:likeKrneWaleUserKiId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        } 

        return res.status(200).json({
            message: 'Post liked',
            success: true
        })

    } catch (error) {
        console.log("like post error", error)
    }
}
const disLikePost = async (req, res) => {
    try {
        const likeKrneWaleUserKiId = req.id;
        const postId = req.params.id;
        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found", success: false });

        //like logic started 
        await post.updateOne({ $pull: { likes: likeKrneWaleUserKiId } });

        await post.save();

        //implement socket io for real time notification
          //implement socket io for real time notification
          const user = await userModel.findById(likeKrneWaleUserKiId).select('username profilePicture');

          const postOwnerId = post.author.toString();
          if(postOwnerId !== likeKrneWaleUserKiId){
              //emit notification
              const notification = {
                  type:'dislike',
                  userId:likeKrneWaleUserKiId,
                  userDetails:user,
                  postId,
                  message:'Your post was disliked'
              }
              const postOwnerSocketId = getReceiverSocketId(postOwnerId);
              io.to(postOwnerSocketId).emit('notification',notification);
          } 
  

        return res.status(200).json({
            message: 'Post disliked',
            success: true
        })

    } catch (error) {
        console.log("like post error", error)
    }
}

const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId = req.id;

        const { text } = req.body;
        const post = await postModel.findById(postId);
        if (!text) return res.status(400).json({ message: 'text is required !', success: false });

        const comment = await Comment.create({
            text,
            author: commentKrneWalaUserKiId,
            post: postId
        })

        await comment.populate({
             path: 'author',
            select: "username profilePicture"
        })

        post.comments.push(comment._id);
        await post.save()

        return res.status(201).json({
            message: "Comment Added",
            comment,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate({
            path: 'author',
            select: 'username profilePicture'
        });
        if (!comments) return res.status(404).json({
            message: 'No comments found for this post',
            success: false
        })
        return res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        console.log("Comment on posts error", error)
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await postModel.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found',success:false})

            //check logged-in user is the owner of the post
            if(post.author.toString() !== authorId) return res.status(403).json({
                message:"Only owner can delete this post !"
            });

            //delete post
            await postModel.findByIdAndDelete(postId);

            //remove the post id from user post
            let user = await userModel.findById(authorId);
            user.post = user.post.filter(id => id.toString() !== postId);

            await user.save();

            //delete associated comments
            await Comment.deleteMany({post:postId});

            return res.status(200).json({
                success:true,
                message:'Post deleted'
            })

    } catch (error) {
        console.log("Delete post error", error)
    }
}

const bookMarkedPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await postModel.findById(postId);
        if(!post) return res.status(404).json({
            message : "Post not found !",
            success : false
        })
        const user = await userModel.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            //already bookmarked -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}})
            await user.save();

            return res.status(200).json({
                type : 'unsaved',
                message : "Post removed from bookmark",
                success : true
            })
        }else{
            //bookmark
            await user.updateOne({$addToSet:{bookmarks:post._id}})
            await user.save();

            return res.status(201).json({
                type : 'saved',
                message : "Post bookmarked",
                success : true
            })
        }
    } catch (error) {
        console.log("Book marked error",error)
    }
}



module.exports = { addNewPost, getAllPost, getUserPost, likePost, disLikePost,addComment, getCommentOfPost,deletePost,bookMarkedPost }
