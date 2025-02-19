const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {type: String , required: true},
    date: { type : Date, default: Date.now() },
    utilisateurId: {type : mongoose.Schema.Types.ObjectId, ref : 'User', required: true},  // Référence à l'utilisateur concerné
    ProjectId: {type : mongoose.Schema.Types.ObjectId, ref : 'Project'}, // Facultatif : référence au projet concerné
    vue : { type : Boolean, default: false}, // Indique si la notification a été vue


});

module.exports= mongoose.model('Notification', notificationSchema);