# Lab 3- Toronto Green Space Map

This interactive web map is built using Mapbox GL JS. It displays different types of green spaces across the City of Toronto, allowing users to explore the distribution and variety of urban green spaces throughout the city. The map helps users better understand how green spaces such as parks, boulevards, golf courses, and other open areas are distributed across Toronto.

The map includes several interactive tools that allow users to explore the data more easily. Users can hover over green space polygons to view a popup showing the name and type of the green space. Clicking on a green space will zoom the map to that polygon, allowing users to view it more closely. A reset button is also provided on the upper left corner so users can quickly return to the original map view.

The basemap of this web map is created using my own Mapbox Styles.
Here is the link to the style:
https://api.mapbox.com/styles/v1/jessicahuang/cmmaww18f009b01qrbwn81028.html?title=copy&access_token=pk.eyJ1IjoiamVzc2ljYWh1YW5nIiwiYSI6ImNtazNjNmdmeTBkN3AzZnEyZHRscHdod28ifQ.Pa9LhzBk1H75KBMwBngDjA&zoomwheel=true&fresh=true#11.16/43.6834/-79.5543

The web map contains one GeoJSON data layer: Green Spaces.geojson

- It contains polygon features representing green spaces across the City of Toronto
- Different colours are used to symbolize different types of green spaces
- Hovering over a polygon displays a popup showing the name and type of the green space as well as a yellow highlighted boundary
- Clicking a polygon zooms the map to the selected green space

Functionalities:

- The map also includes a legend with checkbox filters that allows users to toggle different types of green spaces on and off.
- A search bar allows users to search for green spaces by name.
- When users hover over a green space polygon, a popup appears as wells as a yellow highlight
- Clicking on a polygon will automatically zoom the map to the selected green space
- A reset button allows users to return the map to its original view after exploring different areas.

This map was created by Jessica Huang, updated March 2026
