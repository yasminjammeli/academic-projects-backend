const mongoose= require('mongoose');
const Project = require('./Project');

const taskSchema = new mongoose.Schema( {
    titre: {type: String , required: true},
    description: {type: String , required: true},
    priorite: {type: String, enum: ['basse', 'moyenne', 'haute'], default: 'moyenne'},
    dateEchance: {type: Date},
    statut: { type: String, enum: ['a faire', 'en cours', 'terminée'], default: 'a faire' },
    assigneA: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    projet:{type: mongoose.Schema.Types.ObjectId, ref:'Project', required: true},

}, {timestamps: true}
);
module.exports= mongoose.model('Task', taskSchema);