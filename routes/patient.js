const express = require("express");
const router = express.Router();
const {create,patient1ById,read,remove,update,list,photo,listBySearch,listYears,listSearch,listApp,listEmb,listPile}= require ("../controllers/patient");
const {requireSignin,isAuth}= require("../controllers/auth");
const {userById}= require("../controllers/user");
router .get ("/patient/:patientId1",read);
router.post("/patient/create/:userId",
    requireSignin,isAuth,create
);
router.delete('/patient/:patientId1/:userId',requireSignin,isAuth,remove);
router.get("/patient1/search",listSearch)
router.put('/patient/:patientId1/:userId',requireSignin,isAuth,update);
router.get('/patient1/years',listYears)
router.get('/patient1/app',listApp)
router.get('/patient1/emb',listEmb)
router.get('/patient1/pile',listPile)
router.get('/patient1/:userId',requireSignin,isAuth,list)
router.get('/patient1/photo/:patientId1',photo)
router.post("/patient1/by/search", listBySearch);
router.param("userId",userById)
router.param("patientId1",patient1ById);
module.exports = router;