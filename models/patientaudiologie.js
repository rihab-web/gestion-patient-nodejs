const mongoose = require ('mongoose');

const patientaudiologieSchema= new mongoose.Schema(
  { name: {
		type: String,
		required: true
	},
	
	dateofbirth: {
		type: String,
		required: true,
	},
    cin: {
		type: String,
		required: true,
	},
    sex: {
		type: String,
		required: true,
	},
    portable: {
		type: String,
		
	},
    
    telephone: {
		type: String,
		
	},
	
    adresse: {
		type: String,
		required: true,
	},
    ville: {
		type: String,
		required: true,
	},
    gouvernerat: {
		type: String,
		required: true,
	},
    appareil: {
		type: String,
		required: true,
	},
    appareildroit: {
		type: String,
		required: true,
	},
    appareilgauche: {
		type: String,
		required: true,
	},
    affiliation: {
		type: String,
		required: true,
	},
    cnamnumero: {
		type: String,
		required: true,
	},
    hospital: {
		type: String,
	
	},
    docteur: {
		type: String,
		
	},
    derniereappareillage: {
		type: String,
		
	},
    derniereembout
    : {
		type: String,
	
		
	},
    dernierachatdepile
    : {
		type: String,
	
	},
    observations
    : {
		type: String,
		
	},
    depose
    : {
		type: String,
		
	},
    accorde
    : {
		type: String,
		
	},
    emploi
    : {
		type: String,
		
	},
	annee
    : {
		type: String,
		
	},
	photo
    : {
		data: Buffer,
            contentType: String
		
	},
},
  {
    timestamps: true,
  }

  
  );
  patientaudiologieSchema.index({ 
	'$**':'text',
   
},{
	weights:{
		'$**':5
	}
}


)







module.exports = mongoose.model('Patientaudiologie', patientaudiologieSchema);