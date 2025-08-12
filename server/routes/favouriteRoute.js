import express from "express";
import { addFavourite, getFavourites, isFavourite, removeFavourite } from "../controllers/favouriteController.js";


const favouriteRoute = express.Router();

favouriteRoute.post("/add", addFavourite);
favouriteRoute.post("/remove", removeFavourite);
favouriteRoute.get("/:donorId", getFavourites);
favouriteRoute.get("/check/single", isFavourite);

export default favouriteRoute;
