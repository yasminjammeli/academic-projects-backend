const Project = require('../models/Project');
const User = require('../models/User');

// cree un project
exports.createProject = async (req,res)=>{
    try{
        const {titre, description, dateDebut, dateFin} = req.body;

        const newProject = new Project({
            titre,
            description,
            dateDebut,
            dateFin,
            membres: [req.user.id],
        });

        await newProject.save();
        res.status(201).json(newProject);
    }catch(error){
        res.status(500).json({message: "error creating project"});
}
};

//affiche tous les projects
exports.getProjects= async(req,res)=>{
    try {
        const projects = await Project.find({membres: req.user.id}).populate('membres', 'nom email');
        res.status(200).json(projects);
    } catch(error){
        res.status(500).json({message: "error getting projects"});
    }
}

//modifier un projet
exports.updateProject= async (req,res)=>{
    try{
        const {id} = req.params;
        const {titre, description, dateDebut, dateFin} = req.body;

        const project= await Project.findById(id);
        if(!project) return res.status(404).json({message: "project not found"});

        //verifier si user est un membre du project
        if(!project.membres.includes(req.user.id)){
            return res.status(403).json({message: "Forbidden"});
        }

        project.titre = titre || project.titre;
        project.description = description || project.description;
        project.dateDebut = dateDebut || project.dateDebut;
        project.dateFin = dateFin || project.dateFin;

        await project.save();
        res.status(200).json(project);
    } catch(error){
        res.status(500).json({message: "error updating project"});
    }
};

//supprimer un projet
exports.deleteProject= async(req,res)=>{
    try {
        const {id} = req.params;

        const project = await Project.findById(id);
        if(!project) return res.status(404).json({message: "project not found"});

        //verifier si user est un membre du project
        if(!project.membres.includes(req.user.id)){
            return res.status(403).json({message: "Forbidden"});
        }

        await Project.findByIdAndDelete(id);
        res.status(200).json({message: "project deleted"});
    }catch(error){
        res.status(500).json({message: "error deleting project"});
    }
};

//ajouter un membre au project
exports.addMember= async(req,res)=>{
    try{
        const {id} = req.params; // id project
        const {membreId} = req.body; // id du membre a ajouté

        const project = await Project.findById(id);
        if(!project) return res.status(404).json({message: "project not found"});

        //verifier si membre existe deja dans le projet
        if(project.membres.includes(membreId)){
            return res.status(400).json({message: "user already a member"});
        }

        project.membres.push(membreId);
        await project.save();

        res.status(200).json({message: 'Membre ajoute avec succés.', project});

    } catch(error){
        res.status(500).json({message: "error adding member to project"});
    }
};