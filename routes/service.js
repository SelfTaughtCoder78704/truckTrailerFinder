const express = require('express');
const User = require('../models/user-model');
const City = require('../models/cities');
const { ensureAuthenticated }  = require('../config/auth');
const TrailerService = require('../models/trailer-service');
const fetch = require('node-fetch');
const router = express.Router();




router.get('/', (req, res) => {
    TrailerService.find({}, (err, services) => {
        if(err) {
            console.log(err)
        }else {
            res.render('all-services', {title: 'All Services', services})
        }
    })
})

var apikey = '402ec7f90c9d4e9782856be5c02f2e32';

router.post('/',ensureAuthenticated, (req, res) => {
    if(!req.body.lat|| !req.body.long){
        req.flash(
            'error_msg',
            'Please Hit The Set Your Location Button'
          )
        res.redirect('/services/new')
    }
    convertGeoLocation(req.body.lat, req.body.long)
    function convertGeoLocation(latitude, longitude){

        var api_url = 'https://api.opencagedata.com/geocode/v1/json'
        
        var request_url = api_url
          + '?'
          + 'key=' + apikey
          + '&q=' + encodeURIComponent(latitude + ',' + longitude)
          + '&pretty=1'
          + '&no_annotations=1';
       
      
        fetch(request_url)
        .then(res => res.json())
        .then(data => {
            console.log("CITY " + data.results[0].components.city  + ', ' + data.results[0].components.state_code)
            User.findById(req.user._id, (err, user) => {
                if(err){
                    console.log(err)
                }
                let newService = new TrailerService({
                    typeOfTrailer : req.body.trailerType,
                    typeOfTruck : req.body.truckType,
                    pricePerHour : req.body.price,
                  
                    contactInfo : req.body.contact,
                    serviceArea :data.results[0].components.city  + ', ' + data.results[0].components.state_code,
                    description: req.body.description
                })
                
                City.findOne({cityName: data.results[0].components.city  + ', ' + data.results[0].components.state_code}, (err, city) => {
                    if(err) {
                        console.log(err)
                    }else{
                        console.log(city)
                        
                        if(!city){
                            let newCity = new City({
                                cityName: data.results[0].components.city  + ', ' + data.results[0].components.state_code
                            
                            })
                            newCity.save()
                            .then(() => console.log('Saved City'))
                        }else{
                            console.log("City in DB Already")
                        }
                    }
                })
                newService.save()
                .then(service => {
                    user.userPost.push(service)
                    user.save()
                    .then(() => console.log('Saved'))
                    // res.redirect('/services/addphoto')
                    res.render('add-photo', {title:'Add Photo', service})
                })
            })
            
            
        })
        
        
        }
    
   
})

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('new-service', {title: "New Service"})
})


router.post('/reviews/:id', ensureAuthenticated, (req, res) => {
    let newReview = {
        user: req.user.username,
        review: req.body.review
    }
    TrailerService.findById(req.params.id, (err, service) => {
        if(err){
            console.log(err)
        }else{
            service.reviews.push(newReview)
            service.save()
            res.redirect('/services')
        }
    })
})


router.get('/:id', (req, res) => {
    TrailerService.findById(req.params.id, (err, service)=>{
        if(err){
            console.log(err)
        }else{
            res.render('individual-service', {title: 'Closer Look', service})
        }
    })
})

router.get('/:id/edit', ensureAuthenticated, (req, res) => {
    TrailerService.findById(req.params.id, (err, service) => {
        if(err){
            console.log(err)
        }else{
            res.render('edit', {title: 'Edit/Delete', service})
        }
    })
})


router.post('/:id/edit',ensureAuthenticated, (req, res) => {
    
    TrailerService.findOneAndUpdate({_id: req.params.id},{
        typeOfTrailer : req.body.trailerType,
        typeOfTruck : req.body.truckType,
        pricePerHour : req.body.price,

        contactInfo : req.body.contact,
        serviceArea : req.body.serviceArea,
        description: req.body.description
    }, function(err, result){
        if(err){
            console.log(err)
        }else{
            res.redirect('/')
        }
    })
})

router.get('/:id/delete',ensureAuthenticated, (req, res) => {
        let found;
            req.user.userPost.forEach(p => {
                if(p == req.params.id){
                    found = p;
                }
            })
            TrailerService.findByIdAndRemove(found, (err, service) => {
                if (err){
                    console.log(err)
                }else{
                    res.redirect(`/`)
                }
            })
       
    
    
})

router.get('/city/:city', (req, res) => {
    let city = req.params.city
    TrailerService.find({serviceArea: req.params.city}, (err, services) => {
        if(err){
            console.log(err)
        }else{
            res.render('service-city', {title: req.params.city, services, city})
        }
    })
})

module.exports = router;