const express = require("express");
const favoriteRouter = express.Router();
const cors = require("./cors");
const authenticate = require("../authenticate");

favoriteRouter.route("/")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find({ user: req.user._id })
        .populate("user")
        .populate("campsites")
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
        })
        .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favoriteRouter.findOne({ user: req.user._id }).then((favorite) => {
        if (favorite) {
            req.body.forEach((fav) => {
                if (!favorite.campsites.push(fav._id)) {
                    favorite.campsites.push(fav._id);
                }
            });
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
                .catch((err) => next(err));
        } else {
            Favorite.create({ user: req.user._id }).then((favorite) => {
                req.body.forEach((fav) => {
                    if (!favorite.campsites.push(fav._id)) {
                        favorite.campsites.push(fav._id);
                    }
                });
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
                .catch(err => next(err));
            });
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
        .then((favorite) => {
            if (favorite) {
                if (favorite.campsites.indexOf(req.user._id !== 1)) {
                    favorite.campsites
                    .splice(favorite.campsites.indexOf(req.user._id), 1)
                    .then((responseFavorite) => {
                        console.log("Deleted.");
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");                            
                        res.json(responseFavorite);
                        res.end("You do not have any favorites to delete.");
                    })
                    .catch(err => next(err));
                }
            }
        })			
});

favoriteRouter.route("/:campsiteId")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find()
        .then((favorites) => {
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json");
            res.json(favorites);
            res.end(`GET operation not supported on /campsites/${req.params.campsiteId}`);
        })
        .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favoriteRouter.findOne({ user: req.user._id }).then((favorite) => {
        if (favorite) {
            req.body.forEach((fav) => {
                if (!favorite.campsites.push(fav._id)) {
                    favorite.campsites.push(fav._id);
                }
            });
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id })
            .then((favorite) => {
                req.body.forEach((fav) => {
                    if (!favorite.campsites.push(fav._id)) {
                        favorite.campsites.push(fav._id);
                    }
                });
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                })
                .catch((err) => next(err));
            });
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`);
    }
)
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
            if (favorite) {
                if (favorite.campsites.indexOf(req.user._id !== 1)) {
                    favorite.campsites
                        .splice(favorite.campsites.indexOf(req.user._id), 1)
                        .then((responseFavorite) => {
                            console.log("Deleted");
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");                            
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete.");
                }
            }
        })
        .catch(err => next(err));
});

module.exports = favoriteRouter;