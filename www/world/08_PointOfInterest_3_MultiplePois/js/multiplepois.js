/* Implementation of AR-Experience (aka "World"). */
var World = {
    /* True once data was fetched. */
    initiallyLoadedData: false,

    /* Different POI-Marker assets. */
    markerDrawableIdle: null,
    markerDrawableSelected: null,

    /* List of AR.GeoObjects that are currently shown in the scene / World. */
    markerList: [],

    /* the last selected marker. */
    currentMarker: null,

    /* Called to inject new POI data. */
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
        /* Empty list of visible markers. */
        World.markerList = [];

        /* Start loading marker assets. */
        World.markerDrawableIdle = new AR.ImageResource("assets/marker_idle.png", {
            onError: World.onError
        });
        World.markerDrawableSelected = new AR.ImageResource("assets/marker_selected.png", {
            onError: World.onError
        });

        /* Loop through POI-information and create an AR.GeoObject (=Marker) per POI. */
        for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
            var singlePoi = {
                "id": poiData[currentPlaceNr].id,
                "latitude": parseFloat(poiData[currentPlaceNr].latitude),
                "longitude": parseFloat(poiData[currentPlaceNr].longitude),
                "altitude": parseFloat(poiData[currentPlaceNr].altitude),
                "title": poiData[currentPlaceNr].name,
                "description": poiData[currentPlaceNr].description
            };

            /*
                To be able to deselect a marker while the user taps on the empty screen, the World object holds an
                 array that contains each marker.
            */
            World.markerList.push(new Marker(singlePoi));
        }

        World.updateStatusMessage(currentPlaceNr + ' places loaded');
    },

    /* Updates status message shown in small "i"-button aligned bottom center. */
    updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

        var themeToUse = isWarning ? "e" : "c";
        var iconToUse = isWarning ? "alert" : "info";

        $("#status-message").html(message);
        $("#popupInfoButton").buttonMarkup({
            theme: themeToUse,
            icon: iconToUse
        });
    },

    /* Location updates, fired every time you call architectView.setLocation() in native environment. */
    locationChanged: function locationChangedFn(lat, lon, alt, acc) {

        /*
            The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the
            function was already called. With the first call of World.onLocationChanged an object that contains geo
            information will be created which will be later used to create a marker using the
            World.loadPoisFromJsonData function.
        */
        if (!World.initiallyLoadedData) {
            /*
                requestDataFromLocal with the geo information as parameters (latitude, longitude) creates different
                poi data to a random location in the user's vicinity.
            */
            World.requestDataFromLocal(lat, lon);
            World.initiallyLoadedData = true;
        }
    },

    /* Fired when user pressed maker in cam. */
    onMarkerSelected: function onMarkerSelectedFn(marker) {

        /* Deselect previous marker. */
        if (World.currentMarker) {
            if (World.currentMarker.poiData.id === marker.poiData.id) {
                return;
            }
            World.currentMarker.setDeselected(World.currentMarker);
        }

        /* Highlight current one. */
        marker.setSelected(marker);
        World.currentMarker = marker;
    },

    /* Screen was clicked but no geo-object was hit. */
    onScreenClick: function onScreenClickFn() {
        if (World.currentMarker) {
            World.currentMarker.setDeselected(World.currentMarker);
        }
    },

    /* Request POI data. */
    requestDataFromLocal: function requestDataFromLocalFn(centerPointLatitude, centerPointLongitude) {
        var poisToCreate = 20;
        var poiData = [
            {
                "id": 1,
                "longitude": "32.686753", 
                "latitude": "35.390209",
                "description": ("tavor"),
                "altitude": "560.0",
                "name": ("תבור")
            },
            {
                "id": 2,
                "longitude": "32.67259", 
                "latitude": "35.08854",
                "description": ("muchraka"),
                "altitude": "463.0",
                "name": ("מוחרקה")
            },
            {
                "id": 3,
                "longitude": "32.53560", 
                "latitude": "35.37498",
                "description": ("gilboa"),
                "altitude": "294.0",
                "name": ("גילבוע")
            },
            {
                "id": 4,
                "longitude": "32.98995", 
                "latitude": "35.41678",
                "description": ("miron"),
                "altitude": "1145.0",
                "name": ("מירון")
            },
            {
                "id": 5,
                "longitude": "33.30109", 
                "latitude": "35.78644",
                "description": ("hermon"),
                "altitude": "2064.0",
                "name": ("חרמון")
            },
            {
                "id": 6,
                "longitude": "33.27211", 
                "latitude": "35.19454",
                "description": ("accer"),
                "altitude": "0.0",
                "name": ("עכו")
            },

        ];
        
        // for (var i = 0; i < poisToCreate; i++) {
        //     poiData.push({
        //         "id": (i + 1),
        //         "longitude": (centerPointLongitude + (Math.random() / 5 - 0.1)),
        //         "latitude": (centerPointLatitude + (Math.random() / 5 - 0.1)),
        //         "description": ("This is the description of POI#" + (i + 1)),
        //         "altitude": "100.0",
        //         "name": ("POI#" + (i + 1))
        //     });
        // }
        World.loadPoisFromJsonData(poiData);
    },

    onError: function onErrorFn(error) {
        alert(error);
    }
};

/*
    Set a custom function where location changes are forwarded to. There is also a possibility to set
    AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further
    location updates will be received.
*/
AR.context.onLocationChanged = World.locationChanged;

/*
    To detect clicks where no drawable was hit set a custom function on AR.context.onScreenClick where the
    currently selected marker is deselected.
*/
AR.context.onScreenClick = World.onScreenClick;

AR.context.scene.cullingDistance = 1000000;