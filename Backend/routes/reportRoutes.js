import express from "express";
const Router = expressRouter();

Router.get("/:id", getReport);

export default Router;