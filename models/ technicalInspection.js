const mongoose = require("mongoose");

const TechnicalInspectionSchema = mongoose.Schema({
    policeName: {
        type: String,
        required: true
    },
    stateCarNumber: {
        type: String,
        required: true
    },
    engineNumber: {
        type: String,
        required: true
    },
    carColor: {
        type: String,
        required: true
    },
    carBrand: {
        type: String,
        required: true
    },
    technicalPassportNumber: {
        type: String,
        required: true
    },
    driversLicenseNumber: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    residenceAdress: {
        type: String,
        required: true
    },
    yearOfBird: {
        type: Date,
        required: true
    },


    dateOfInspection: {
        type: Date,
        required: true
    },
    // policePosition: {
    //     type: String,
    //     required: true
    // },
    result: {
        type: String,
        required: true
    },
    conclusion: {
        type: String,
        required: true
    }
});




const TechnicalInspection = module.exports = mongoose.model('TechnicalInspection', TechnicalInspectionSchema);

module.exports.addNewInspection = function(newInspection, callback) {
    newInspection.save((err) => {if(err) throw err});
};