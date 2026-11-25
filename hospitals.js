// Rwanda Health Atlas

var map = L.map("rwandaMap", {
    minZoom: 7,
    maxZoom: 14,
    zoomSnap: 0.25,
    zoomDelta: 0.5
}).setView([-1.9403, 29.8739], 8);

map.attributionControl.setPrefix(
    '<a href="https://leafletjs.com/">Leaflet</a>'
);

// Display Rwanda's 30 districts

var districts = L.geoJSON(rwandaDistricts, {

    style: {
        color: "#687b65",
        weight: 1.2,
        fillColor: "#f5e6b3",
        fillOpacity: 1
    },

    onEachFeature: function(feature, layer) {

        layer.bindTooltip(feature.properties.district, {
            permanent: true,
            direction: "center",
            className: "district-label"
        });

        layer.bindPopup(
            "<b>" + feature.properties.district + "</b><br>" +
            feature.properties.prov_engl
        );
    }

}).addTo(map);

// Fit Rwanda inside the map

map.fitBounds(districts.getBounds(), {
    padding: [45, 45]
});

// Government data attribution

map.attributionControl.addAttribution(
    '<a href="https://geodata.rw/">Rwanda National Geodata</a>'
);

// Geographical scale

L.control.scale({
    position: "bottomleft",
    metric: true,
    imperial: false
}).addTo(map);

// Map compass

var compass = L.control({
    position: "topright"
});

compass.onAdd = function() {

    var div = L.DomUtil.create("div", "map-compass");

    div.innerHTML =
        "N<br>" +
        "▲<br>" +
        "W + E<br>" +
        "S";

    return div;
};

compass.addTo(map);

// Neighbouring country labels

function addCountryLabel(lat, lng, name) {

    L.marker([lat, lng], {

        interactive: false,

        icon: L.divIcon({
            className: "country-label",
            html: name,
            iconSize: [140, 30],
            iconAnchor: [70, 15]
        })

    }).addTo(map);
}

addCountryLabel(-1.15, 29.95, "UGANDA");
addCountryLabel(-1.85, 31.15, "TANZANIA");
addCountryLabel(-2.95, 29.90, "BURUNDI");
addCountryLabel(-1.95, 28.95, "D.R. CONGO");

// Rwanda water bodies

fetch("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson")

.then(function(response) {
    return response.json();
})

.then(function(data) {

    var lakes = L.geoJSON(data, {

        filter: function(feature) {

            var bounds = L.geoJSON(feature).getBounds();

            return bounds.intersects(
                L.latLngBounds([-3.0, 28.5], [-1.0, 31.0])
            );
        },

        style: {
            color: "#459fc5",
            weight: 1,
            fillColor: "#a5d8ef",
            fillOpacity: 1
        },

        onEachFeature: function(feature, layer) {

            var name = feature.properties.name;

            if (name) {

                layer.bindTooltip(name, {
                    permanent: true,
                    direction: "center",
                    className: "lake-label"
                });
            }
        }

    }).addTo(map);

    map.attributionControl.addAttribution(
        '<a href="https://www.naturalearthdata.com/">Natural Earth</a>'
    );

})

.catch(function(error) {
    console.error("Lake data could not load:", error);
});
// Hospital classification colours

var hospitalColors = {
    "District Hospital": "#16856b",
    "Level II Teaching Hospital": "#2563eb",
    "National Teaching Hospital": "#7c3aed",
    "Specialized Hospital": "#db2777",
    "Provincial Hospital": "#ea580c",
    "Referral": "#dc2626"
};

// Display hospital locations

var hospitalLayer = L.geoJSON(rwandaHospitals, {

    pointToLayer: function(feature, latlng) {

        var type = feature.properties.Type;
        var color = hospitalColors[type] || "#555555";

        return L.marker(latlng, {
            icon: L.divIcon({
                className: "hospital-marker",
                html: '<div style="background-color:' +
                      color + '">+</div>',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            })
        });
    },

    onEachFeature: function(feature, layer) {

        var hospital = feature.properties;

        layer.bindPopup(
            "<h3>" + hospital.Hospital_Name + "</h3>" +
            "<b>Type:</b> " + hospital.Type + "<br>" +
            "<b>Province:</b> " + hospital.Province + "<br>" +
            "<b>District:</b> " + hospital.District + "<br>" +
            "<b>Sector:</b> " + hospital.Sector
        );

        layer.bindTooltip(hospital.Hospital_Name);
    }

}).addTo(map);

map.attributionControl.addAttribution(
    '<a href="https://gis.rbc.gov.rw/">Rwanda Biomedical Centre</a>'
);
// Hospital search and filters

var districtFilter = document.getElementById("districtFilter");
var typeFilter = document.getElementById("typeFilter");

var districtNames = [...new Set(
    rwandaHospitals.features.map(function(feature) {
        return feature.properties.District;
    })
)].sort();

districtNames.forEach(function(name) {
    districtFilter.add(new Option(name, name));
});

Object.keys(hospitalColors).sort().forEach(function(type) {
    typeFilter.add(new Option(type, type));
});

function filterHospitals() {

    var search = document.getElementById("hospitalSearch")
        .value.toLowerCase();

    var district = districtFilter.value;
    var type = typeFilter.value;

    hospitalLayer.clearLayers();

    var filtered = rwandaHospitals.features.filter(function(feature) {

        var hospital = feature.properties;

        return hospital.Hospital_Name.toLowerCase().includes(search)
            && (!district || hospital.District === district)
            && (!type || hospital.Type === type);

    });

    hospitalLayer.addData(filtered);

    document.getElementById("hospitalCount").textContent =
        "Showing " + filtered.length + " of 57 hospitals";
}