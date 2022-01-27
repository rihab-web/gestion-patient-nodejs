const formidable = require ('formidable');
const _ = require('lodash');
const fs = require ('fs');
const Patient1 = require ("../models/patientaudiologie");
const  {errorHandler}=require ("../helpers/dbErrorHandler");
exports.patient1ById=(req,res,next,id) =>{
    Patient1.findById(id).exec((err,patient1)=> {
        if (err || ! patient1){
            return res.status(400).json({
                error: 'Product not found'
            });
        }
        req.patient1 = patient1
        next();
    }
    
    );
};

exports.read = (req,res)=>{
    req.patient1.photo = undefined;
    return res.json(req.patient1);
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
       const {name,dateofbirth,cin,sex,portable,adresse,ville,gouvernerat,appareil,appareildroit,appareilgauche,affiliation,cnamnumero,annee} =fields
if (!name|| !dateofbirth|| !cin|| !sex|| !portable||!adresse||!ville||!gouvernerat||!appareil||!appareildroit||!appareilgauche||!affiliation||!cnamnumero||!annee){
    return res.status(400).json({
        error: 'all fieled are required'
    });
}
        let patient1 = new Patient1(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
           // console.log("FILES PHOTO:",files.photo);
           if (files.photo.size > 1000000) {
            return res.status(400).json({
                error: 'Image should be less than 1mb in size'
            });
        }

            patient1.photo.data = fs.readFileSync(files.photo.path);
            patient1.photo.contentType = files.photo.type;
        }

        patient1.save((err, result) => {
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
    let patient1 = req.patient1
    patient1.remove((err,deletedPatient1)=>{
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
res.json({
   
    message:"Patient1 deleted successfully"
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

        let patient1 = req.patient1
        patient1 = _.extend(patient1, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
           // console.log("FILES PHOTO:",files.photo);
           if (files.photo.size > 1000000) {
            return res.status(400).json({
                error: 'Image should be less than 1mb in size'
            });
        }

            patient1.photo.data = fs.readFileSync(files.photo.path);
            patient1.photo.contentType = files.photo.type;
        }

        patient1.save((err, result) => {
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
exports .list =(req,res) => {
    let order = req.query.order ? req.query.order:'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy :'_id'
    let limit = req.query.limit? parseInt(req.query.limit):6
    Patient1.find()
    .select ("-photo")
    .sort ([[sortBy,order]])
    .limit (limit)
    .exec((err,patient1) =>{
        if (err){
            return res.status(400).json({
                error:'Patient not found'
            })
        }
res.send(patient1)
    }
    )
};
exports.photo = (req, res, next) => {
    if (req.patient1.photo.data) {
 
        res.set('Content-Type', req.patient1.photo.contentType);
        console.log(`req.patient1.photo.data: `, req.patient1.photo.data);
        return res.send(req.patient1.photo.data);
        
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
    Patient1.find(findArgs)
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
        Patient1.find(findArgs)
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


exports.listYears = (req, res) => {
    Patient1.distinct('annee', {}, (err, years) => {
        if (err) {
            return res.status(400).json({
                error: 'years not found'
            });
        }
        res.json(years);
    });
};

exports.listSearch = (req,res)=>{
    const query={}
    if (req.query.search){
        query.name={$regex:req.query.search,$options:'i'}
    }
    Patient1.find (query,(err,patient1) => {
        if (err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(patient1)
    }).select("-photo")
}


exports.listApp = (req, res) => {
    Patient1.distinct('derniereappareillage', {}, (err,appareillage) => {
        if (err) {
            return res.status(400).json({
                error: 'derniereappareillage not found'
            });
        }
        res.json(appareillage);
    });
};


exports.listEmb= (req, res) => {
    Patient1.distinct('derniereembout', {}, (err,embout) => {
        if (err) {
            return res.status(400).json({
                error: 'derniereembout not found'
            });
        }
        res.json(embout);
    });
};

exports.listPile = (req, res) => {
    Patient1.distinct('dernierachatdepile', {}, (err,pile) => {
        if (err) {
            return res.status(400).json({
                error: 'dernierachatdepile not found'
            });
        }
        res.json(pile);
    });
};