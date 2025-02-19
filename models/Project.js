const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    titre: {type: String, required: true},
    description: {type: String, required: true},
    dateDebut: {type: Date, required: true},
    dateFin: {type: Date, required: true},
    membres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]  , // Membres du projet
    taches : [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}], // Task du projet

}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);