const express = require('express');
const TrailerService = require('../models/trailer-service');
const City = require('../models/cities');
const path = require('path');
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/user-model');

const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  City.find({}, null, {sort: {cityName: 1}},(err, city) =>{
    if(err) {
      console.log(err)

    }else {
     
      TrailerService.find({}, (err, services) => {
        if(err){
          console.log(err)
        }else {
          res.render('index', { title: 'Home', services, city});
        }
      })
    }
  })
});


router.get('/profile', ensureAuthenticated,(req, res) => {
  User.findOne({username: req.user.username}).populate('userPosts').exec((err, posts) => {
    if(err){
      console.log(err)
    }else{
          // res.render('profile', {title: 'Profile',posts})
          // res.json(posts)
          TrailerService.find({_id: posts.userPost}, (err, doc) => {
            if(err){
              console.log(err)
            }else {
              res.render('profile', {title: "Profile", posts: doc})
            }
          })

      }
                
      // res.json(posts.userPost)
      //  res.render('profile', {title: 'Profile', posts})
    
  
  })
  // User.
  // findOne({username: req.user.username }).
  // populate('userPost').
  // exec(function (err, posts) {
  //   if (err) return handleError(err);
  //   // res.render('profile', {title: 'Profile', posts})
  //   res.json(posts)
  //   // prints "The author is Ian Fleming"
  // });
})


router.get('/addphoto/:id', ensureAuthenticated, (req, res) => {
  TrailerService.findById(req.params.id, (err, service)=> {
    if(err){
      console.log(err)
    }else {
      res.render('add-photo', {title: 'Change Photo', service})
    }
  })

})

router.post('/addphoto/:id', ensureAuthenticated, (req, res) => {
  
		TrailerService.findOneAndUpdate({
			_id: req.params.id
		},
		{
			'img': req.body.img
		},
		function(err, result){
			if(err) {
				console.log(err);
      }
      else{
        console.log(result)
      }
		});
	

	res.redirect('/');
})

router.get('/mostvotes/:city', (req, res) => {
 let service_area = req.params.city
  TrailerService.find({serviceArea: req.params.city}).sort({voteCount: -1}).exec(function(err, docs) { 
    if(err){
      console.log(err)
    }else{
      res.render('most-page', {title:'Most Votes' , docs, service_area})
    }
   });
})


router.post('/vote/up/:id', ensureAuthenticated, (req, res) => {
  
 
  TrailerService.findById(req.params.id, (err, service) => {
    
    let alreadyVoted = false
    if(err){
      console.log(err)
    }else {
      req.user.userPost.forEach(post => {
        if(post == service._id){
    
          res.redirect('/profile')
         
        }
      })
     
      for(let i= 0; i < service.votes.length; i++){
        if(service.votes[i].voter === req.user.username){
          alreadyVoted = true;
        }
      }
      
      if(alreadyVoted){
        res.redirect('/profile')
      }else{
        let newVote = {
          voter: req.user.username,
          voted: true,
          vote: 1
        }
        
          service.votes.push(newVote)
          service.voteCount++
          service.save()
          .then(v => {
            res.redirect(`/services/city/${service.serviceArea}`)
          })
      }
    }
  })
})

module.exports = router;
