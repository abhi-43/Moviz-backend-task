import User from "../models/user.js";
import Movies from "../models/movies.js";

export const createPlaylist = async (req, res, next) => {

    try {
      console.log(req.body , "===n==" );
      console.log("===res", res.locals.user);
      const email = res.locals.user.email;
      
      const user = await User.findOne({ email })
  
      req.body.user = email
  
      if (email) {
        console.log(req.body)
        const movie = new Movies(req.body);
        await movie.save();
        const newMovie = JSON.parse(JSON.stringify(movie));
        res.status(200).send({ message: newMovie })
        console.log(newMovie);
      }
      else {
        return next(new AppError('Password not valid!', 401));
      }
    } catch (err) {
      console.log("err" , err);
    }
  }
  
  
  export const getMyPlaylist = async (req, res, next) => {
  
    try {
      const email = res.locals.user.email
      const user = await User.findOne({ email })
  
  
      if (email) {
  
        const playlist = await Movies.find({ user: email });
  
        console.log(playlist)
        res.status(200).send({ data: JSON.parse(JSON.stringify(playlist)) })
      }
      else {
        return next(new AppError('Password not valid!', 401));
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  
  export const addIntoPlaylist = async (req, res, next) => {
    try {
      const email = res.locals.user.email
      const user = await User.findOne({ email })
      console.log(email)
  
      if (email) {
        const playlistId = req.body.playlistId;
        const movieId = req.body.movieId;
        const playlist = await Movies.findOne({ _id: playlistId });
        for (let i = 0; i < playlist.movies.length; i++) {
          if (playlist.movies[i] == movieId) {
            return res.status(404).send({ msg: "movie already exist" });
          }
        }
        let p = playlist.movies
        p.push(movieId);
        
        const filter = { _id: playlistId }
        const update = { movies: p };
  
        let doc = await Movies.findOneAndUpdate(filter, update,{
          new: true
        });
        res.status(200).send({ data: JSON.parse(JSON.stringify(doc)) })
      }
      else {
        return next(new AppError('Password not valid!', 401));
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  
  export const deletePlaylist = async (req, res, next) => {
    try {

      const email = res.locals.user.email
      const user = await User.findOne({ email })
      
      if (email) {
        const m = await Movies.deleteOne({_id: req.params.playlistId, user: {$eq: user.email} });
        
        if(m.deletedCount === 0){
          return res.status(200).send("You are not allowed to delete others playlist");
        }
        else {
          return res.status(200).send("deleted succesfully")
        }
      }
      else {
        return res.status(500).send("Failed");
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  
  export const getPlaylistById = async (req, res, next) => {
    try {
      const p = await Movies.findOne({'_id': {$eq: req.params.playlistId}})
      return res.status(200).send({data : p});
    }
    catch (err) {
      console.log(err);
    }
  }
  
  export const allPublicPlayList = async (req, res, next) => {
    try {
      const doc = await Movies.find({isPublic: true});
      res.status(200).send({ data: JSON.parse(JSON.stringify(doc)) })
    
    }
    catch (err) {
      console.log(err);
    }
  }