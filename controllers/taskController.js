const Task = require('../models/Task');
const Project = require('../models/Project');

// create a new task 
exports.createTask = async (req , res)=>{
    try{
        const {projectId} = req.params;
        const {titre , description , priorite, dateEchance, assigneA} = req.body; 

        //verifier si le projet existe
        const project = await Project.findById(projectId);
        if(!project) return res.status(404).json({message: "Project not found"});

        const newTask = new Task({titre, description, priorite, projet: projectId, dateEchance, assigneA});

        await newTask.save();
        res.status(201).json(newTask);
    } catch(error){
        res.status(500).json({message: "error creating task"});
    }
};

// get all tasks
exports.getTasksByProject = async (req , res ) =>{
    try{
        const {projectId} = req.params;
        const tasks = await Task.find({projet: projectId}).populate('assigneA', 'nom email');
        res.status(200).json(tasks);
    } catch(error){
        res.status(500).json({message: "error getting tasks"});
    }
};

// update a task    
exports.updateTask = async (req , res)=>{
    try{
        const {taskId} = req.params;
        const {titre, description, priorite, dateEchance,assigneA} = req.body;

        const task = await Task.findByIdAndUpdate(taskId , {titre, description, priorite, dateEchance, assigneA} , {new: true}

        );

        if(!task) 
            return res.status(404).json({message: "Task not found"});
        
        res.status(200).json(task);
    }catch(error){
        res.status(500).json({message: "error updating task"});
    }
};

// delete a task
exports.deleteTask= async (req , res)=>{
    try{
        const {taskId} = req.params;
        const deleteTask = await Task.findByIdAndDelete(taskId);
        if(!deleteTask) return res.status(404).json({message: "Task not found"});
        res.status(200).json({message: "Task deleted successfully"});
    } catch(error){
        res.status(500).json({message: "error deleting task"});
    }
};

// update a task status
exports.updateTaskStatus = async(req , res)=>{
    try{
        const {taskId} = req.params;
        const {statut} = req.body;

        const task = await Task.findByIdAndUpdate(taskId, {statut}, {new: true});

        if(!task) return res.status(404).json({message: 'Task not found'});
        res.status(200).json(task);
    }catch(error){
        res.status(500).json({message: "error updating task status"});
    }
};