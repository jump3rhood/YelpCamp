const cg = campground;
console.log(cg);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: cg.geometry.coordinates,
    zoom: 10 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

var marker = new mapboxgl.Marker()
    .setLngLat(cg.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 20 })
        .setHTML(`<h3>${cg.title}</h3><p>${cg.location}</p>`))
    .addTo(map);