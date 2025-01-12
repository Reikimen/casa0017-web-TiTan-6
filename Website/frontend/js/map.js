let map;
let accmarkers = [];
let directionsRenderer;
let directionsService;
let buildings;
let accommodations;
let selectedBuilding = undefined;
let selectedDuration = 10000;
let zoom = 12;
let buildingMarker;
const Info = {
    origin: "",
    destination: "",
    originaddress: "",
    destinationaddress: "",
    duration: "",
    distance: ""
}
let route;

$(document).ready(async function () {
    //Set a function for change event of the commuting select control
    $('#commuting-time').on('change', function () {
        var index = $(this).prop('selectedIndex');
        zoom = index === 0 ? 12 : 17 - index;
        if (selectedBuilding) map.setZoom(zoom);
    })
    //By async method we make sure that the required script element for google is ready or we cannot make the markers
    const googleReady = await AddGoogleScript();
    //Add all accommodations to the map with a marker
    $.ajax({
        url: `${window.location.origin}/uclaccommodations`,
        method: 'GET',
        success: async (data) => {
            accommodations = data;
            accommodations.forEach(acc => setMarker(acc));
            //Load buildings and add to select control now we are sure that we have all accommodations                  
            $.ajax({
                url: `${window.location.origin}/uclbuildings`,
                method: 'GET',
                success: (data) => {
                    buildings = data;
                    var $select = $('#buildingsSelect');
                    $.each(data, function (index, place) {
                        var $option = $('<option></option>').val(index).text(place.display_name);
                        $select.append($option);
                    });
                    //Add a callback funtion to set the selected building
                    $select.on('change', function () {
                        selectedBuilding = buildings[$(this).val()];
                        SetBuilding();
                    })
                },
                error: (error) => {
                    console.error('Error fetching options:', error);
                }
            });
        },
        error: (error) => {
            console.error('Error in fetching accommodations', error)
        }
    })

}
);

async function AddGoogleScript() {
    //Get google map key and add script referrence to the document body here when we are sure that we have all buildings
    return $.ajax({
        url: `${window.location.origin}/getGoogleMapKey`,
        method: 'GET',
        success: (response) => {
            var googlMapUrl = `https://maps.googleapis.com/maps/api/js?key=${response}&libraries=marker,geometry&callback=initMap&v=weekly&loading=async`;
            var script = document.createElement('script');
            script.src = googlMapUrl;
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        },
        error: (error) => console.log('Error fetching google api key', error)
    });
}

async function SetBuilding() {
    console.log(buildings);
    if (selectedBuilding != undefined) {
        setMarker(selectedBuilding);
        map.setCenter({ lat: selectedBuilding.location.x, lng: selectedBuilding.location.y });
        map.setZoom(zoom);
        Info.origin = selectedBuilding.display_name;
        Info.originaddress = selectedBuilding.address;
    }
    else {
        zoom = 12;
        map.setCenter({ lat: 51.524559, lng: -0.13404 })
        Info.origin = "";
        Info.destinaon = "";
        Info.originaddress = "";
        Info.destinaonaddress = "";
        Info.duration = "";
        Info.distance = "";
    }
    ShowInfo();
}

function ShowInfo() {
    $('#origin').text(Info.origin);
    $('#originaddress').text(Info.originaddress);
    $('#destination').text(Info.destination);
    $('#destinationaddress').text(Info.destinationaddress);
    $('#duration').text(Info.duration);
    $('#distance').text(Info.distance);
}

function ShowRoute(accmarker) {
    if (route) route.setMap(null);
    acc = accmarker.accommodation;
    Info.destination = acc.display_name;
    Info.destinationaddress = acc.address;
    $.ajax({
        url: `${window.location.origin}/getwalkingrouteto/?buildingId=${selectedBuilding.gmap_id}&accommodationId=${acc.gmap_id}`,
        method: 'GET',
        success: (data) => {
            var thisroute = data[0];
            console.log(thisroute);
            if (thisroute) {
                const decodedPath = google.maps.geometry.encoding.decodePath(thisroute.encoded_polyline);
                route = new google.maps.Polyline({
                    path: decodedPath,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map
                });
                Info.duration = thisroute.duration;
                Info.distance = thisroute.distance_meters;
            }                    
        },
        error: (error) => console.error(error)
    })
    ShowInfo();
}

// Initialize Google Map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
        center: { lat: 51.524559, lng: -0.13404 },
        zoom: 12,
        mapId: 'UCL-Accomm'
    });
}

async function setMarker(place) {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const pin = new PinElement({
        scale: place.type === 'Buildings' ? 1.5 : 1,
        background: place.type === 'Buildings' ? "#0000FF" : "#FBBC04"
    })
    const marker = new AdvancedMarkerElement({
        position: { lat: place.location.x, lng: place.location.y },
        map,
        title: `${place.display_name} , ${place.type}`,
        content: pin.element,
        gmpClickable: true,
    });
    if (place.type === 'Accommodation') {
        marker.addListener("click", () => {
            console.log("marker clicked")
            if (selectedBuilding) ShowRoute(accmarker)
        });
        const accmarker = { marker: marker, accommodation: place };
        accmarkers.push(accmarker);
    }
    else {
        if (buildingMarker) buildingMarker.position = null;
        buildingMarker = marker;
    }
}
