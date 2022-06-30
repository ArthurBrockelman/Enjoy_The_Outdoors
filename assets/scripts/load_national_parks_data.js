"use strict"

let locationsArray = []
let nationalParksArray = []
let parkTypesArray = []

window.onload = function(){

    loadJsonData("assets/data/locations.json").then((locations) => {
        locationsArray = locations;
    })

    loadJsonData("assets/data/nationalparks.json").then((nationalParks) => {
        nationalParksArray = nationalParks.parks;
    })

    loadJsonData("assets/data/parktypes.json").then((parkTypes) => {
        parkTypesArray = parkTypes;
    })

}

let loadJsonData = async (path) => {
    let response = await fetch(path)
    let data = await response.json()
    return data
}

let loadNPSNews = async () => {

    let response = await fetch(`https://developer.nps.gov/api/v1/newsreleases?api_key=Qljuiw8TZtWshEnVSv9ty3miWNXmxogbDyFkSSDZ`);
    let data = await response.json();
    console.log(data)
    return data;
    
    
};
