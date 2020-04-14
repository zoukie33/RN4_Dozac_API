const express = require('express');
const router = express.Router();
const db = require('../models');
const ResizeImg = require('../functions/resize');
const upload = require('../functions/upload');

/**
 * @api {get} /users/profile Get USer profile
 * @apiName profile
 * @apiGroup users
 * @apiPermission Public
 * @apiVersion 1.0.0
 *
 * @apiError 500 SQL Error
 * @apiSuccessExample Success-Response:
 * {
 *   "idUser": 1,
 *   "username": "Zoukie",
 *   "email": "romain.gadrat@epitech.eu",
 *   "createdAt": "2020-02-13T14:13:07.000Z",
 *   "updatedAt": "2020-02-13T14:13:07.000Z",
 *   "profilePic": "default.png"
 * }
 * @apiDescription Route permettant la récupération de la liste des utilisateurs.
 */

router.get('/profile', function(req, res, next) {
  db.User.findOne({
    where: {
      idUSer: req.user.idUser
    }
  }).then(function(dbUser) {
    if (!dbUser) {
      res.status(404).send('Cet utilisateur est introuvable');
    } else {
      res.status(200).send(
        JSON.stringify({
          idUser: dbUser.idUser,
          username: dbUser.username,
          email: dbUser.email,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
          profPic: dbUser.profPic
        })
      );
    }
  });
});

/**
 * @api {put} /users/uploadProfPic Upload logo structure
 * @apiName uploadProfPic
 * @apiGroup users
 * @apiPermission Private
 * @apiVersion 1.0.0
 *
 * @apiError 500 SQL Error
 * @apiError 400 Bad Request
 * @apiError 401 Unauthorized
 * @apiDescription Route permettant l'upload du logo d'une structure.
 *
 * @apiParam {File} profPic profPic de la structure
 */

router.put('/uploadProfPic', upload.uploadImg.single('profPic'), async function(req, res, next) {
    const imagePath = './public/images';
    const fileUpload = new ResizeImg(imagePath);
    if (!req.file) {
      res.status(401).json({error: 'Please provide an image'});
    } else {
      try {
        const filename = await fileUpload.save(req.file.buffer);
        db.User.update(
          {
            profPic: filename
          },
          {
            where: { idUser: req.user.idUser }
          }
        ).then(function(User) {
          if (!User) {
            res.status(500).send('Err updating User');
          } else {
            return res.status(200).json({ name: filename });
          }
        });
      } catch (err) {
        next(err);
      }
    }
});

/**
 * @api {post} /users/updateProfil Update user profile Informations
 * @apiName updateProfil
 * @apiGroup users
 * @apiPermission Private
 * @apiVersion 1.0.0
 *
 * @apiError 500 SQL Error
 * @apiDescription Route permettant de compléter les informations de l'utilisateur.
 *
 * @apiParam {String} username Pseudo de l'utilisateur
 * @apiParam {String} email Email de l'utilisateur
 */

router.post('/updateProfil', function(req, res) {
  db.User.update(
    { username: req.body.username, email: req.body.email },
    {
      where: { idUser: req.user.idUser }
    }
  ).then(function(User) {
    if (!User) {
      res.status(500).send('Err getting missions');
    } else {
      res.status(200).send(JSON.stringify(User));
    }
  });
});

module.exports = router;
