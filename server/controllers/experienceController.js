const Experience=require('../databases/experienceModel');

const getAllExperiences=async(req,res)=>{
    const experiences=await Experience.find({}).sort({createdAt:-1});
    res.status(200).json(experiences)
}

const getMyExperiences=async(req,res)=>{
    const {username}=req.query;
    if(!username){
        return res.status(400).json({message:'Username is required'})
    }
    const experiences=await Experience.find({username}).sort({createdAt:-1});
    res.status(200).json(experiences)
}

const createExperience=async(req,res)=>{
    console.log("Request received to /api/experiences/new");
    const {username,role,company,experience}=req.body;

    if(!username||!role || !company || !experience){
        return res.status(400).json({message:'Please fill all fields'})
    }
    console.log("Creating experience for:", username);
    const newExperience=await Experience.create({
        username,
        role,
        company,
        experience
    });

    res.status(201).json(newExperience);
}

module.exports={
    getAllExperiences,
    getMyExperiences,
    createExperience
}