const { home_get } = require("../controller/home.controller");

const router=require("express").Router();
router.get("/",home_get)

module.exports=router;