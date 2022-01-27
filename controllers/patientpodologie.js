const formidable = require ('formidable');
const _ = require('lodash');
const fs = require ('fs');
const Patientpodologie = require ("../models/patientpodologie");
const  {errorHandler}=require ("../helpers/dbErrorHandler");
exports.patientpodologieById=(req,res,next,id) =>{
    Patientpodologie .findById(id).exec((err,patientpodologie)=> {
        if (err || ! patientpodologie){
            return res.status(400).json({
                error: 'Patient not found'
            });
        }
        req.patientpodologie= patientpodologie
        next();
    }
    
    );
};

exports.read = (req,res)=>{
    req.patientpodologie.photo = undefined;
    return res.json(req.patientpodologie);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
       //check for all fieleds
       const {numero_BF,nometprenom,cin,cnam,tel1,tel2,email,premiervisite,pathologie,produit,datedelivraison,datedecontrole} =fields
if (!numero_BF || !nometprenom || !cin|| !cnam|| !tel1 || !tel2 || !email|| !premiervisite || !pathologie|| !produit || !datedelivraison || !datedecontrole){
    return res.status(400).json({
        error: 'all fieled are required'
    });
}
        let patientpodologie = new Patientpodologie(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
           // console.log("FILES PHOTO:",files.photo);
           if (files.photo.size > 1000000) {
            return res.status(400).json({
                error: 'Image should be less than 1mb in size'
            });
        }

        patientpodologie .photo.data = fs.readFileSync(files.photo.path);
        patientpodologie .photo.contentType = files.photo.type;
        }

        patientpodologie .save((err, result) => {
            if (err) {
                console.log('Patient CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};
exports.remove =(req,res)=>{
    let patientpodologie = req.patientpodologie
    patientpodologie.remove((err,deletedPatient1)=>{
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
res.json({
   
    message:"Patient deleted successfully"
});
    }

    )
}
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
       //check for all fieleds
    
        let patientpodologie = req.patientpodologie
        patientpodologie = _.extend(patientpodologie, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
           // console.log("FILES PHOTO:",files.photo);
           if (files.photo.size > 1000000) {
            return res.status(400).json({
                error: 'Image should be less than 1mb in size'
            });
        }

        patientpodologie.photo.data = fs.readFileSync(files.photo.path);
        patientpodologie.photo.contentType = files.photo.type;
        }

        patientpodologie.save((err, result) => {
            if (err) {
                console.log('Patient CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};
exports.list =(req,res) => {
    let order = req.query.order ? req.query.order:'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy :'_id'
    let limit = req.query.limit? parseInt(req.query.limit):6
    Patientpodologie.find()
    .select ("-photo")
    .sort ([[sortBy,order]])
    .limit (limit)
    .exec((err,patientpodologie) =>{
        if (err){
            return res.status(400).json({
                error:'Patients podologie not found'
            })
        }
res.send(patientpodologie)
    }
    )
};
exports.photo = (req, res, next) => {
    if (req.Patientpodologie.photo.data) {
 
        res.set('Content-Type', req.Patientpodologie.photo.contentType);
        console.log(`req.Patientpodologie.photo.data: `, req.Patientpodologie.photo.data);
        return res.send(req.Patientpodologie.photo.data);
        
    }
    next();
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    const query={}
    query.cin={$regex:req.body.SearchTerm,$options:'i'}
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
  
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            
                findArgs[key] = req.body.filters[key];
           
        }
    }
if (req.body.SearchTerm){
    Patientpodologie.find(findArgs)
    .find(query)
        .select('-photo')
       
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Patients not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
    }else{
        Patientpodologie.find(findArgs)
        .select('-photo')
       
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Patients not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });  
    }
   
};



exports.listSearch = (req,res)=>{
    const query={}
    if (req.query.search){
        query.name={$regex:req.query.search,$options:'i'}
    }
    Patientpodologie.find (query,(err,Patientpodologie) => {
        if (err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(patient1)
    }).select("-photo")
}


exports.listPatho = (req, res) => {
    Patientpodologie.distinct('pathologie', {}, (err,pathologie) => {
        if (err) {
            return res.status(400).json({
                error: 'pathologie not found'
            });
        }
        res.json(pathologie);
    });
};

