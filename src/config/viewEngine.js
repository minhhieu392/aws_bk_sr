import express from "express";
let configViewEngine = (app) => {
    app.use(express.static("./srs/public"));
    //chi dinh file co the truy cap
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
        //xet duong link lay view engine
}
module.exports = configViewEngine;