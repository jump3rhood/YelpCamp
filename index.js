const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Database connected!');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARE 
app.use( express.urlencoded( {extended: true})); // for parsing the req.body
app.use(methodOverride('_method'));

// ROUTES
app.get('/', (req, res)=> {
    res.render('home');
});
app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
});
app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
});
app.post('/campgrounds', async (req, res) =>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById( id );
    res.render('campgrounds/show', {campground});    
});
app.get('/campgrounds/:id/edit', async (req,res)=>{
    
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
});
app.put('/campgrounds/:id', async (req, res)=> {
   
    const campground = await Campground.findByIdAndUpdate( req.params.id, {...req.body.campground});
    res.redirect('/campgrounds');
});
app.delete('/campgrounds/:id', async(req, res)=> {
    const cg = await Campground.findById(req.params.id);
    console.log(cg);
    await Campground.findByIdAndDelete( req.params.id);
    res.redirect('/campgrounds');
})
app.listen(3000, ()=> {
    console.log('Server on port 3000....');
});
