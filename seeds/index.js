const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // Your user id
            author: '600fdbc74641b403041899ec',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur minima quas, beatae molestiae quaerat ad',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {

                    url: 'https://res.cloudinary.com/dchvvlojm/image/upload/v1612935018/YelpCamp/ez878phrnoci3jevzr9m.jpg',
                    filename: 'YelpCamp/ez878phrnoci3jevzr9m'
                },
                {

                    url: 'https://res.cloudinary.com/dchvvlojm/image/upload/v1612935020/YelpCamp/qgrszhmzios2p44kkk1i.jpg',
                    filename: 'YelpCamp/qgrszhmzios2p44kkk1i'
                },
                {

                    url: 'https://res.cloudinary.com/dchvvlojm/image/upload/v1612935022/YelpCamp/hhlhrhbokv2p2xhbb7ot.jpg',
                    filename: 'YelpCamp/hhlhrhbokv2p2xhbb7ot'
                }
            ]

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})