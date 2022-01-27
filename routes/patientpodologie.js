const express = require("express");
const router = express.Router();
const {create,patientpodologieById,read,remove,update,list,photo,listBySearch,listSearch,listPatho}= require ("../controllers/patientpodologie");
const {requireSignin,isAuth}= require("../controllers/auth");
const {userById}= require("../controllers/user");



router .get ("/patientpodologie/:patientpodologieId",read);
router.post(
    "/patientpodologie/create/:userId",
    requireSignin,isAuth,create
);
router.delete('/patientpodologie/:patientpodologieId/:userId',requireSignin,isAuth,remove);
router.get("/patientpodologie/search",listSearch)
router.put('/patientpodologie/:patientpodologieId/:userId',requireSignin,isAuth,update);

router.get('/patientpodologie',list);
router.get('/patientpodologie1/listpatho',listPatho);
router.get('/patientpodologie/photo/:patientpodologieId',photo)
router.post("/patientpodologie/by/search", listBySearch);
router.param("userId",userById)
router.param("patientpodologieId",patientpodologieById);
module.exports = router;