const Blacklist = require('../models/blacklist');

exports.getBlacklist = (req,res,next)=>{
    Blacklist.getBlacklist((err,data)=>{
        if(err) res.status(400).json(err);
        res.status(200).json(data);
    });
};

exports.banUser = (req,res,next) =>{
    if(!req.params.id){
        res.status(400).send('Need params bannedId');
    }

    const blacklist = new Blacklist({
        bannerId:req.user.uid,
        bannedId:req.params.id
    });

    Blacklist.banUser(blacklist,(err,data)=>{
        if(err) res.status(400).json(err);
        res.status(201).json(data);
    });
};

exports.unBanUser = (req,res,next) =>{
    if(!req.params.id){
        res.status(400).send('Need params bannedId');
    }

    const bannedId = req.params.id;

    Blacklist.unBanUser(bannedId,(err,data)=>{
        if(err) res.status(400).json(err);
        res.status(200).json(data);
    });
};