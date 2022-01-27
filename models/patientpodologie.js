const mongoose = require ('mongoose');

const patientpodologieSchema= new mongoose.Schema(
  {numero_BF
	: {
		type: String,
		required: true
	},
	
	nometprenom
	: {
		type: String,
		required: true,
	},
    cin
	: {
		type: String,
		required: true,
	},
    cnam
	: {
		type: String,
		required: true,
	},
    tel1
	: {
		type: String,
		required: true,
	},
    
    tel2
	: {
		type: String,
		required: true,
	},
	
    email
	: {
		type: String,
		required: true,
	},
    premiervisite
	: {
		type: String,
		required: true,
	},
    pathologie
	: {
		type: String,
		required: true,
	},
    produit
	: {
		type: String,
		required: true,
	},
    datedelivraison
	: {
		type: String,
		required: true,
	},
    datedecontrole
	: {
		type: String,

		required: true,
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
  patientpodologieSchema.index({ 
	'$**':'text',
   
},{
	weights:{
		'$**':5
	}
}


)







module.exports = mongoose.model('Patientpodologie', patientpodologieSchema);