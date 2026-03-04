//Helper function
function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
} //To help convert strings in geojson(default uppercase) to title-case style

//Add mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoiamVzc2ljYWh1YW5nIiwiYSI6ImNtazNjNmdmeTBkN3AzZnEyZHRscHdod28ifQ.Pa9LhzBk1H75KBMwBngDjA";

//Create an initial map view variable for the default view button to return to
const initialView = {
  center: [-79.33, 43.72],
  zoom: 10.5,
  bearing: -17,
  pitch: 0,
};

//Create legend items
const legenditems = [
  {
    label: "Boulevard",
    colour: "#f4a261",
    value: "Boulevard",
    id: "boulevardcheck",
  },
  {
    label: "Building Grounds",
    colour: "#457b9d",
    value: "Building Grounds",
    id: "buildinggroundscheck",
  },
  {
    label: "Cemetery",
    colour: "#adb5bd",
    value: "Cemetery",
    id: "cemeterycheck",
  },
  {
    label: "Civic Centre Square",
    colour: "#1d3557",
    value: "Civic Centre Square",
    id: "civiccheck",
  },
  {
    label: "Cul de Sac",
    colour: "#f9844a",
    value: "Cul de Sac",
    id: "culdesaccheck",
  },
  {
    label: "Golf Course",
    colour: "#40916c",
    value: "Golf Course",
    id: "golfcheck",
  },
  {
    label: "Hydro Field/Utility Corridor",
    colour: "#74c69d",
    value: "Hydro Field/Utility Corridor",
    id: "hydrocheck",
  },
  {
    label: "Open Green Space",
    colour: "#52b788",
    value: "Open Green Space",
    id: "opengreencheck",
  },
  {
    label: "Orphaned Space",
    colour: "#95d5b2",
    value: "Orphaned Space",
    id: "orphancheck",
  },
  { label: "Park", colour: "#2a9d8f", value: "Park", id: "parkcheck" },
  {
    label: "Traffic Island",
    colour: "#e76f51",
    value: "Traffic Island",
    id: "trafficcheck",
  },
  { label: "Other", colour: "#6c757d", value: "OTHER_GROUP", id: "othercheck" },
];

//Store all the other-related values in geojson for easier filtering
const OTHER_TYPES = [
  "OTHER_CEMETERY",
  "OTHER_CITY",
  "OTHER_GOLFCOURSE",
  "OTHER_HYDRO",
  "OTHER_PROVINCIAL_FEDERAL",
  "OTHER_ROAD",
  "OTHER_TRCA",
  "OTHER_UNKNOWN",
];

//Track the search input
let currentSearch = "";

//Set up variables to get elements
const legendItemsContainer = document.getElementById("legend-items");
const searchInput = document.getElementById("searchpark");
const returnButton = document.getElementById("returnbutton");

//Create map view
const map = new mapboxgl.Map({
  container: "my-map",
  style: "mapbox://styles/jessicahuang/cmmaww18f009b01qrbwn81028", //added my mapbox style
  center: initialView.center,
  zoom: initialView.zoom,
  bearing: initialView.bearing,
  pitch: initialView.pitch,
});

//Add map navigation buttons and controls to bottom right of map
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

//Create legend items(label, checkbox, and circle symbology)
legenditems.forEach(({ label, colour, id }) => {
  const row = document.createElement("label");
  row.className = "legend-row";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.checked = true;

  const colcircle = document.createElement("span");
  colcircle.className = "legend-colcircle";
  colcircle.style.setProperty("--legendcolour", colour);

  const text = document.createElement("span");
  text.textContent = label;

  row.append(checkbox, colcircle, text);
  legendItemsContainer.appendChild(row);
});

//Implement the return button event
returnButton.addEventListener("click", () => {
  map.flyTo({
    center: initialView.center,
    zoom: initialView.zoom,
    bearing: initialView.bearing,
    pitch: initialView.pitch,
    duration: 1200,
    essential: true,
  });
});

//Implement the checkbox filtering functionality
legendItemsContainer.addEventListener("change", () => {
  applyFilters();
});

//Implement the search functionality for search bar
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value.toLowerCase().trim();
  applyFilters();
});

//Helper function to get allowed green space types based on checked boxes
function getAllowedTypesFromChecks() {
  const allowed = [];

  for (const item of legenditems) {
    const checked = document.getElementById(item.id).checked;
    if (!checked) continue;

    if (item.value === "OTHER_GROUP") {
      allowed.push(...OTHER_TYPES);
    } else {
      allowed.push(item.value);
    }
  }

  return allowed;
}

//Apply filtering based on checkbox selection and search input
function applyFilters() {
  //Only apply filter after the polygon layer exists
  if (!map.getLayer("park-polygon")) return;
  const allowedTypes = getAllowedTypesFromChecks();
  //Create a filter based on selected green space types in checkbox
  const typeFilter =
    allowedTypes.length === 0
      ? ["==", ["get", "AREA_CLASS"], "__NO_MATCH__"]
      : ["in", ["get", "AREA_CLASS"], ["literal", allowedTypes]];
  //Create a filter based on the search bar input
  const nameFilter =
    currentSearch === ""
      ? true
      : ["in", currentSearch, ["downcase", ["get", "AREA_NAME"]]];
  //Combine result from both checkbox and search bar to filter the polygon
  map.setFilter("park-polygon", ["all", typeFilter, nameFilter]);
}

map.on("load", () => {
  //Add green space data source
  map.addSource("park-data", {
    type: "geojson",
    data: "https://raw.githubusercontent.com/JessicaCHuang26/Lab-3/main/Green%20Spaces.geojson",
    promoteId: "_id",
  });

  //Add polygons and fill colour for each types of green space based on the AREA_CLASS geojson column
  map.addLayer({
    id: "park-polygon",
    type: "fill",
    source: "park-data",
    paint: {
      "fill-color": [
        "match",
        ["get", "AREA_CLASS"],
        "Boulevard",
        "#f4a261",
        "Building Grounds",
        "#457b9d",
        "Cemetery",
        "#adb5bd",
        "Civic Centre Square",
        "#1d3557",
        "Cul de Sac",
        "#f9844a",
        "Golf Course",
        "#40916c",
        "Hydro Field/Utility Corridor",
        "#74c69d",
        "Open Green Space",
        "#52b788",
        "Orphaned Space",
        "#95d5b2",
        "Park",
        "#2a9d8f",
        "Traffic Island",
        "#e76f51",
        "#6c757d", //Fill all the other categories grey
      ],
      "fill-opacity": 1,
      "fill-outline-color": "grey",
    },
  });

  //Add highlight effect when hover over polygons
  map.addLayer({
    id: "park-highlight",
    type: "line",
    source: "park-data",
    paint: {
      "line-color": "#ffff00",
      "line-width": 5,
      "line-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1, //Make lines visible when the 'hover' state is True
        0, //Hide the lines by default so it won't show when the map loads
      ],
    },
  });

  //Setup the initial filter once the map loads
  applyFilters();

  //Track which feature is hovered
  let hoveredFeatureId = null;

  //Setup the popup for when user hover the polygons
  const hoverPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  //Change cursor to pointer when mouse enter polygons
  map.on("mouseenter", "park-polygon", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  //Highlight polygon and show popup when hover
  map.on("mousemove", "park-polygon", (e) => {
    const feature = e.features[0];

    //Remove previous highlighted part
    if (hoveredFeatureId !== null) {
      map.setFeatureState(
        { source: "park-data", id: hoveredFeatureId },
        { hover: false },
      );
    }

    //Set a new hovered id
    hoveredFeatureId = feature.id;

    //Add highlight
    map.setFeatureState(
      { source: "park-data", id: hoveredFeatureId },
      { hover: true },
    );

    //Grab name and type of green space from geojson
    const name = feature.properties.AREA_NAME;
    const type = feature.properties.AREA_CLASS;
    const formattedName = toTitleCase(name); //Use my helper function to change everything to title-case
    const formattedType = toTitleCase(type);
    hoverPopup
      .setLngLat(e.lngLat)
      .setHTML(
        `
        <b>Name:</b> ${formattedName}<br>
        <b>Type:</b> ${formattedType}
      `,
      )
      .addTo(map);
  });

  map.on("mouseleave", "park-polygon", () => {
    map.getCanvas().style.cursor = "";
    if (hoveredFeatureId !== null) {
      map.setFeatureState(
        { source: "park-data", id: hoveredFeatureId },
        { hover: false },
      );
    }
    hoveredFeatureId = null; //Remove highlight and popup once mouse leave polygon
    hoverPopup.remove();
  });

  //Implement the zooming function once a polygon is clicked
  map.on("click", "park-polygon", (e) => {
    const feature = e.features[0];

    //Compute a bounding box consisting the polygon for the zooming function
    const coordinates = feature.geometry.coordinates[0];

    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach((coord) => bounds.extend(coord));

    //Zoom to the polygon once clicked
    map.fitBounds(bounds, {
      padding: 80,
      maxZoom: 16,
      duration: 1200,
      bearing: map.getBearing(),
    });
  });
});
