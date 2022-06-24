import express from "express";
import {allPublicPlayList , createPlaylist , getMyPlaylist , addIntoPlaylist , deletePlaylist , getPlaylistById} from "../controllers/movie.js";
import { verifyUser } from "../utils/verifyToken.js";


const router = express.Router();


router.get('/public-playlist' ,  allPublicPlayList);

//Common routes for all users
// router.get('', detail);
router.put('/create-playlist', verifyUser ,  createPlaylist);
router.delete('/delete-playlist/:playlistId', verifyUser ,  deletePlaylist);
router.get('/playlist/:playlistId' ,  getPlaylistById);
router.get('/myplaylist',verifyUser , getMyPlaylist);
router.put('/add-into-playlist', verifyUser, addIntoPlaylist);

export default router;
