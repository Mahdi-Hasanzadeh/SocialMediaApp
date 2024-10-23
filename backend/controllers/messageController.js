const conversationModel = require("../model/conversationModel")
const messageModel = require("../model/messageModel");
const { getReceiverSocketId, io } = require("../socket/socket");

// for chatting
const sendMessage = async(req,res)=>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage:message} = req.body;

        let conversation = await conversationModel.findOne({
            participants:{$all:[senderId,receiverId]}
        })

        //establish the conversation if not started yet
        if(!conversation){
            conversation = await conversationModel.create({
                participants:[senderId,receiverId]
            })
        };

        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            message
        })
        if(newMessage) conversation.message.push(newMessage._id);
        await Promise.all([conversation.save(),newMessage.save()])

        // implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }

        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log("Send message error",error)
    }
}

const getMessage = async(req,res)=>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await conversationModel.findOne({
            participants : {$all:[senderId,receiverId]}
        }).populate('message');
        if(!conversation) return res.status(200).json({success:true,message:[]})

            return res.status(200).json({
                success:true,
                message:conversation?.message
            })
    } catch (error) {
        console.log("Get messages error",error)
    }
}

module.exports = {sendMessage,getMessage}