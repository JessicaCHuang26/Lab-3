function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

//add Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoiamVzc2ljYWh1YW5nIiwiYSI6ImNtazNjNmdmeTBkN3AzZnEyZHRscHdod28ifQ.Pa9LhzBk1H75KBMwBngDjA";

const map = new mapboxgl.Map({
  container: "my-map",
  style: "mapbox://styles/jessicahuang/cmmaww18f009b01qrbwn81028",
  center: [-79.38718, 43.658],
  zoom: 13,
  bearing: -17, //rotate map to upright position
});

const legendItemsContainer = document.getElementById("legend-items");

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
  {
    label: "Other",
    colour: "#6c757d",
    value: "OTHER_GROUP",
    id: "othercheck",
  },
];

// Build ONE combined legend/filter UI
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

map.on("load", () => {
  map.addSource("park-data", {
    type: "geojson",
    data: "https://raw.githubusercontent.com/JessicaCHuang26/Lab-3/main/Green%20Spaces.geojson",
    promoteId: "_id",
  });

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

        // all OTHER_* fall to default grey unless you list them
        "#6c757d",
      ],
      "fill-opacity": 1,
      "fill-outline-color": "grey",
    },
  });

  map.on("mouseenter", "park-polygon", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "park-polygon", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("click", "park-polygon", (e) => {
    const feature = e.features[0];

    // get bounding box of the polygon
    const coordinates = feature.geometry.coordinates[0];

    let bounds = new mapboxgl.LngLatBounds();

    coordinates.forEach((coord) => {
      bounds.extend(coord);
    });

    // fly to the polygon
    map.fitBounds(bounds, {
      padding: 80,
      maxZoom: 16,
      duration: 1200,
      bearing: map.getBearing(),
    });
  });

  updateGreenSpaceFilter();
  let hoverPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mousemove", "park-polygon", (e) => {
    map.getCanvas().style.cursor = "pointer";

    const feature = e.features[0];
    const name = feature.properties.AREA_NAME;
    const Type = feature.properties.AREA_CLASS;
    const formattedName = toTitleCase(name);
    const formattedType = toTitleCase(Type);

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

  /*--------------------------------------------------------------------
HOVER HIGHLIGHT (DEMO STYLE)
--------------------------------------------------------------------*/

  // 1) Add an OUTLINE layer above your fill layer (this is the highlight)
  map.addLayer({
    id: "park-highlight",
    type: "line",
    source: "park-data",
    paint: {
      "line-color": "#ffff00",
      "line-width": 5,
      "line-opacity": 0, // hidden by default
    },
  });

  // 2) Track which feature is hovered
  let hoveredFeatureId = null;

  // 3) On mouse move, highlight ONLY the feature under the mouse
  map.on("mousemove", "park-polygon", (e) => {
    map.getCanvas().style.cursor = "pointer";

    // remove previous highlight
    if (hoveredFeatureId !== null) {
      map.setFeatureState(
        { source: "park-data", id: hoveredFeatureId },
        { hover: false },
      );
    }

    // set new hovered id
    hoveredFeatureId = e.features[0].id;

    // add highlight
    map.setFeatureState(
      { source: "park-data", id: hoveredFeatureId },
      { hover: true },
    );

    // show the highlight outline
    map.setPaintProperty("park-highlight", "line-opacity", [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0,
    ]);
  });

  // 4) When mouse leaves the layer, remove highlight
  map.on("mouseleave", "park-polygon", () => {
    map.getCanvas().style.cursor = "";

    if (hoveredFeatureId !== null) {
      map.setFeatureState(
        { source: "park-data", id: hoveredFeatureId },
        { hover: false },
      );
    }

    hoveredFeatureId = null;
  });

  map.on("mouseleave", "park-polygon", () => {
    map.getCanvas().style.cursor = "";
    hoverPopup.remove();
  });

  // When ANY checkbox changes, update the filter (demo-style: one listener)
  legendItemsContainer.addEventListener("change", () => {
    updateGreenSpaceFilter();
  });

  function updateGreenSpaceFilter() {
    // read checkbox states (prof-style: explicit variables)
    let boulevardcheck = document.getElementById("boulevardcheck").checked;
    let buildinggroundscheck = document.getElementById(
      "buildinggroundscheck",
    ).checked;
    let cemeterycheck = document.getElementById("cemeterycheck").checked;
    let civiccheck = document.getElementById("civiccheck").checked;
    let culdesaccheck = document.getElementById("culdesaccheck").checked;
    let golfcheck = document.getElementById("golfcheck").checked;
    let hydrocheck = document.getElementById("hydrocheck").checked;
    let opengreencheck = document.getElementById("opengreencheck").checked;
    let orphancheck = document.getElementById("orphancheck").checked;
    let parkcheck = document.getElementById("parkcheck").checked;
    let trafficcheck = document.getElementById("trafficcheck").checked;
    let othercheck = document.getElementById("othercheck").checked;

    // build allowed list
    let allowedTypes = [];

    if (boulevardcheck) allowedTypes.push("Boulevard");
    if (buildinggroundscheck) allowedTypes.push("Building Grounds");
    if (cemeterycheck) allowedTypes.push("Cemetery");
    if (civiccheck) allowedTypes.push("Civic Centre Square");
    if (culdesaccheck) allowedTypes.push("Cul de Sac");
    if (golfcheck) allowedTypes.push("Golf Course");
    if (hydrocheck) allowedTypes.push("Hydro Field/Utility Corridor");
    if (opengreencheck) allowedTypes.push("Open Green Space");
    if (orphancheck) allowedTypes.push("Orphaned Space");
    if (parkcheck) allowedTypes.push("Park");
    if (trafficcheck) allowedTypes.push("Traffic Island");

    // handle OTHER_* (your data has many OTHER_ values)
    if (othercheck) {
      allowedTypes.push(
        "OTHER_CEMETERY",
        "OTHER_CITY",
        "OTHER_GOLFCOURSE",
        "OTHER_HYDRO",
        "OTHER_PROVINCIAL_FEDERAL",
        "OTHER_ROAD",
        "OTHER_TRCA",
        "OTHER_UNKNOWN",
      );
    }

    // apply filter to your layer
    // If none checked, show nothing:
    if (allowedTypes.length === 0) {
      map.setFilter("park-polygon", [
        "==",
        ["get", "AREA_CLASS"],
        "__NO_MATCH__",
      ]);
    } else {
      map.setFilter("park-polygon", [
        "in",
        ["get", "AREA_CLASS"],
        ["literal", allowedTypes],
      ]);
    }
  }

  document.getElementById("searchpark").addEventListener("input", (e) => {
    const search = e.target.value.toLowerCase();

    map.setFilter("park-polygon", [
      "in",
      search,
      ["downcase", ["get", "AREA_NAME"]],
    ]);
  });
});

const csvUrl = "YOUR_CSV_URL";

const csvButton = document.getElementById("csvbutton");
const csvPanel = document.getElementById("csvpanel");
const csvTable = document.getElementById("csvtable");

let csvLoaded = false;

csvButton.addEventListener("click", async () => {
  // toggle panel
  if (csvPanel.style.display === "block") {
    csvPanel.style.display = "none";
    return;
  }

  csvPanel.style.display = "block";

  // load csv only once
  if (csvLoaded) return;
  csvLoaded = true;

  const text = await fetch(csvUrl).then((r) => r.text());

  const rows = text
    .trim()
    .split("\n")
    .map((r) => r.split(","));

  const table = document.createElement("table");

  rows.forEach((row, i) => {
    const tr = document.createElement("tr");

    row.forEach((cell) => {
      const el = document.createElement(i === 0 ? "th" : "td");
      el.textContent = cell;
      tr.appendChild(el);
    });

    table.appendChild(tr);
  });

  csvTable.appendChild(table);
});
