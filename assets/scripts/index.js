
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
        let datalistOptions = document.querySelector("#parkEventsDatalistOptions")

        nationalParksArray.forEach((park) => {
            datalistOptions.innerHTML += `<option value="${park.LocationName}">${park.LocationName}</option>`
        })
        
        loadNPSNews("ACAD")



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

let loadNPSNews = async (parkCode) => {
    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");
    newsOutPutContainer.innerHTML = ""
    newsOutPutContainer.classList.remove("d-none");
    let response = await fetch(`https://developer.nps.gov/api/v1/newsreleases?parkCode=${parkCode}&api_key=Qljuiw8TZtWshEnVSv9ty3miWNXmxogbDyFkSSDZ`);
    let data = await response.json();
    if(data.data.length === 0) {
        let datalistOptions = document.querySelector("#parkEventsDatalistOptions")
        displayNoEvents(datalistOptions.value, newsOutPutContainer)
    } else {
        displayEvents(data.data, newsOutPutContainer)
    }

};

function displayEvents(events, outputContainer) {

    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");
    newsOutPutContainer.innerHTML = ""
    newsOutPutContainer.classList.remove("d-none");

    //Set cards per row
    let cardsPerRow = 3;

    //Calculate the number of rows to add by taking the array length and dividing by cards per row.
    let rowsToAdd = Math.ceil(events.length / cardsPerRow);

    //Add rows.
    for(let i = 1; i <= rowsToAdd; i++) {
        outputContainer.innerHTML += `<div class="row p-3 parkRows"></div>`
    }
    
    //Get all the newly added rows in an array.
    let newRows = document.querySelectorAll(".parkRows")

    //Reset coutners.
    let columnsAdded = 0;
    let rowIndex = 0;

    //Loop through the filtered array that was passed in the function.
    events.forEach((event) => {
        console.log(event)
        //Check to see if we move to a new row, first column added should be ignored but otherwise
        //We can check to see if there is no remainder for the columns added / the cards per row.
        if(columnsAdded % cardsPerRow === 0 && columnsAdded !== 0) {

            rowIndex++;

        };

        //Add to the park's data to the rows html.
        newRows[rowIndex].innerHTML += `
            <div class="col p-3 parkCards">
                <div class="card">
                    <div class="card-body" id="eventCard${event.id}">
                        <h5 class="card-title"><a href="${event.url}" target="_blank">${event.title}</a></h5>
                        <img src="${event.image.url}" class="newsImages">
                        <p>${event.abstract}</p>
                        <p>Released: ${event.releaseDate.slice(0,10)}</p>
                        
                    </div>
                </div>
            </div>`
        
        //Increment columns added.
        columnsAdded++;
    })
}



parkEventsDatalist.addEventListener("change", () => {
    let parkEventsDatalist = document.querySelector("#parkEventsDatalist")
    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");
    newsOutPutContainer.innerHTML = ""
    newsOutPutContainer.classList.remove("d-none");

    //Look for matches of the selected value in the national parks array.
    let matches = nationalParksArray.filter((park) => park.LocationName === parkEventsDatalist.value);
    console.log(matches[0], parkEventsDatalist.value)
    loadNPSNews(matches[0].LocationID)

})

function displayNoEvents(park) {

    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");
    newsOutPutContainer.innerHTML = ""
    newsOutPutContainer.classList.remove("d-none");
    newsOutPutContainer.innerHTML = `
    <div class="row p-3 parkRows">
        <div class="col p-3 parkCards">
            <div class="card">
                <div class="card-body" id="eventCard">
                    <h5 No News for ${park}</h5>
                </div>
            </div>
        </div>
    </div>`

}


