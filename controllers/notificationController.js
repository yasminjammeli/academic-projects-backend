const Notification = require('../models/Notification');
const io = require('../index').io;

//cree une notification et l'envoyer en temps réel via webSocket
exports.createNotification = async (req , res)=>{
    try{
        const {message , utilisateurId , projectId} = req.body;
        
        const newNotification = new Notification({
            message,
            utilisateurId,
            projectId,
        });

        await newNotification.save();

        // envoyer la notification en temps réel via webSocket
        io.to(utilisateurId.toString()).emit('notification', newNotification);

        res.status(201).json(newNotification);
    } catch(err){
        res.status(500).json({message: 'Error creating notification'});
    }
}

//Recuperer toutes les notifications d'un utilisateur
exports.getNotificationsByUser = async (req, res)=>{
    try{
        const notification = await Notification.find({ utilisateurId: req.user.id}).sort({ date : -1});

        res.status(200).json(notification);
    }catch(error){
        res.status(500).json({message: "error getting notifications"});
    }
};

//Récupérer uniquement les notification non lues
exports.getUnreadNotifications = async (req, res)=>{
    try{
        const notifications = await Notification.find({utilisateurId: req.user.id , vue: false}).sort({date : -1});

        res.status(200).json(notifications);
        }catch(error){
            res.status(500).json({message: "error getting unread notifications"});
        }
}

//Marquer une notification comme vue
exports.markAsRead = async (req , res)=>{
    try{
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { vue: true },
            { new: true }
        );

        if(!notification) return res.status(404).json({message: "Notification not found"});
        res.status(200).json(notification);

    }catch(error){
        res.status(500).json({message: "error marking notification as read"});
    }
};

//Marquer toutes les notifications comme lues
exports.markAllAsRead = async(req, res)=>{
    try{
        await Notification.updateMany(
            { utilisateurId: req.user.id, vue:false},
            {$set : {vue: true}}
        );

        res.status(200).json({message: "All notifications marked as read"});
    }catch(error){
        res.status(500).json({message: "error marking all notifications as read"});
    }
};