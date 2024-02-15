let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 8,
    });
}

function addLocation() {
    const address = document.getElementById("addressInput").value;
    if (!address) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            const location = results[0].geometry.location;
            const marker = new google.maps.Marker({
                position: location,
                map: map,
            });
            markers.push(marker);
            map.setCenter(location);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function planRoute() {
    // array to store job location coordinates
    const jobLocations = markers.map(marker => marker.getPosition());

    // DirectionsService object
    const directionsService = new google.maps.DirectionsService();

    // DirectionsRenderer object to display the route on the map
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
    });

    // waypoints array excluding the technician's location
    const waypoints = jobLocations.slice(1, -1).map(location => ({
        location: location,
        stopover: true,
    }));

    // request object for route calculation
    const request = {
        origin: jobLocations[0],
        destination: jobLocations[jobLocations.length - 1],
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    // send the request to the DirectionsService
    directionsService.route(request, (response, status) => {
        if (status === 'OK') {
            // Display the route on the map
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Route calculation failed due to ' + status);
        }
    });
}
