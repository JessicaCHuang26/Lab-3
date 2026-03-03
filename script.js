// //add Mapbox token
// mapboxgl.accessToken =
//   "pk.eyJ1IjoiamVzc2ljYWh1YW5nIiwiYSI6ImNtazNjNmdmeTBkN3AzZnEyZHRscHdod28ifQ.Pa9LhzBk1H75KBMwBngDjA";

// // create map view
// const map = new mapboxgl.Map({
//   container: "my-map",
//   style: "mapbox://styles/jessicahuang/cmmaww18f009b01qrbwn81028", //add my own style URL
//   center: [-79.38718, 43.658], //set starting position
//   zoom: 13,
//   //   pitch: 15, //tilt the map view
//   //   bearing: -15, //rotate map to upright position
// });

// map.on("load", () => {
//   //Add cafe feature data source
//   map.addSource("park-data", {
//     type: "geojson",
//     data: "Green Spaces.geojson",
//   });
// });

// //add cafe feature to map
// map.addLayer({
//   id: "park-polygon",
//   type: "fill",
//   source: "park-data",
//   paint: {
//     "fill-color": "#3bb143",
//     // ['step', // STEP expression produces stepped results based on value pairs
//     // ['get', 'POP2021'], // GET expression retrieves property value from 'population' data field
//     // '#fd8d3c', // Colour assigned to any values < first step
//     // 100000, '#fc4e2a', // Colours assigned to values >= each step
//     // 500000, '#e31a1c',
//     // 1000000, '#bd0026',
//     // 5000000, '#800026']
//     "fill-opacity": 0.5,
//     "fill-outline-color": "white",
//   },
// }); //make icon visible even if they collides with each other)

mapboxgl.accessToken =
  "pk.eyJ1IjoiamVzc2ljYWh1YW5nIiwiYSI6ImNtazNjNmdmeTBkN3AzZnEyZHRscHdod28ifQ.Pa9LhzBk1H75KBMwBngDjA";

const map = new mapboxgl.Map({
  container: "my-map",
  style: "mapbox://styles/jessicahuang/cmmaww18f009b01qrbwn81028",
  center: [-79.38718, 43.658],
  zoom: 13,
});

map.on("load", () => {
  map.addSource("park-data", {
    type: "geojson",
    data: "Green Spaces.geojson",
  });

  map.addLayer({
    id: "park-polygon",
    type: "fill",
    source: "park-data",
    paint: {
      "fill-color": "#3bb143",
      "fill-opacity": 0.5,
      "fill-outline-color": "white",
    },
  });
});
