const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const getDataUri = require("../utils.js/dataUri");
const cloudinary = require("../utils.js/cloudinary");
const postModel = require("../model/postModel");


const register = async (req, res) => {

    try {
        const { username, email, password } = req.body;  // object distructuring
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check !",
                success: false
            });
        };
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists !",
                success: false
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User created successfully.",
            success: true
        });


    } catch (error) {
        console.log("Registration error", error)
    }

}
const login = async (req, res) => {

    try {
        const { email, password } = req.body;  // object distructuring
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check !",
                success: false
            });
        };
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email !",
                success: false
            });
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect password !",
                success: false
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        //Populate each post in the posts array
        const populatedPost = await Promise.all(
            user.post.map(async (postId) => {
                const post = await postModel.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            post: populatedPost
        }




        return res.cookie('token', token, {
            httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000
        }).status(200).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });


    } catch (error) {
        console.log("Login error", error)
    }

}

const logout = async (req, res) => {
    try {
        return res.cookie('token', "", { maxAge: 0 }).json({
            message: 'Logout successfully',
            success: true
        })
    } catch (error) {
        console.log("logout error", error)
    }

}

const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await userModel.findById(userId).populate({ path: 'post', createdAt: -1 }).populate("bookmarks");
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log("getProfile error", error)
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { username, bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        } 

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        // Update fields if they exist
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture && cloudResponse) {
            user.profilePicture = cloudResponse.secure_url;
        } else if (profilePicture) {
            return res.status(500).json({ message: 'Image upload failed', success: false });
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated",
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                gender: user.gender,
                followers: user.followers,
                following: user.following,
            }
        });

    } catch (error) {
        console.log("editProfile error", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }

};

const getSuggestedUser = async (req, res) => {
    try {
        const suggestdUser = await userModel.find({ _id: { $ne: req.id } }).select("-password")
        if (!suggestdUser) {
            return res.status(400).json({
                message: "Currently do not have any users",
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestdUser
        })
    } catch (error) {
        console.log("Suggested User error", error)
    }
}

const followOrUnfollow = async (req, res) => {
    try {
        const followkrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;
        if (followkrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: "You can't follow/unfollow yourself",
                success: false
            });
        }

        const user = await userModel.findById(followkrneWala).select("-password");
        const targetUser = await userModel.findById(jiskoFollowKrunga).select("-password");

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        // Check follow and unfollow process

        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            //unfollow logic
            await Promise.all([
                userModel.updateOne({ _id: followkrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                userModel.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followkrneWala } }),
            ])
            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true
            });
        } else {
            // follow logic 
            await Promise.all([
                userModel.updateOne({ _id: followkrneWala }, { $push: { following: jiskoFollowKrunga } }),
                userModel.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followkrneWala } }),
            ])
            return res.status(200).json({
                message: "followed successfully",
                success: true
            });
        }



    } catch (error) {
        console.log("followOrUnfollow error", error)
    }
}



module.exports = { register, login, logout, getProfile, editProfile, getSuggestedUser, followOrUnfollow }
