//Grab the show all  parks button
let showAllParksButton = document.querySelector("#showAllParksButton");

//Parks Search data list
let parksSearchDataList = document.querySelector("#exampleDataList");
let parksSearchOptions = document.querySelector("#datalistOptions");

//Radio references
let locationRadio = document.querySelector("#locationRadio");
let parkTypeRadio = document.querySelector("#parkTypeRadio");

//Container for drop down to hide/reveal when radio is checked
let locationsListContainer = document.querySelector(".locationsListContainer")

//Container for output to hide/reveal when radio is checked and a selection is made
let locationOutPutContainer = document.querySelector(".locationOutPutContainer");

//Search by park type data list input and options
let parkTypeDataList = document.querySelector("#parkTypeDataList")
let parkTypedatalistOptions = document.querySelector("#parkTypedatalistOptions");

//Container for drop down to hide/reveal when radio is checked
let parkTypeListContainer = document.querySelector(".parkTypeListContainer");

//Container for output to hide/reveal when radio is checked and a selection is made
let parkTypeOutPutContainer = document.querySelector(".parkTypeOutPutContainer");

//Add an event listener to the park type radio search option.
parkTypeRadio.addEventListener("click", () => {

    //If clicked, hide and remove data from the output containers.
    locationsListContainer.classList.add("d-none");
    locationOutPutContainer.classList.add("d-none")
    parkTypedatalistOptions.innerHTML = "";

    //Show the park type dropdown.
    parkTypeListContainer.classList.remove("d-none");

    //Loop over the park type array and add the options to the datalist.
    parkTypesArray.forEach((parkType) => {

        parkTypedatalistOptions.innerHTML += `<option value="${parkType}">${parkType}</option>`;

    });
});

//Add an event listener to the location search radio.
locationRadio.addEventListener("click", () => {

    //If clicked, hide and remove data from the output containers.
    parkTypeListContainer.classList.add("d-none");
    parkTypeOutPutContainer.classList.add("d-none")
    parkTypedatalistOptions.innerHTML = "";

    //Show the locations dropdown.
    locationsListContainer.classList.remove("d-none");

    //Loop over each item in the location array and add it as an option to the datalist.
    locationsArray.forEach((location) => {
        parksSearchOptions.innerHTML += `<option value="${location}">${location}</option>`
    })
})

//When a change event occurs on the location search datalist...
parksSearchDataList.addEventListener("change", () => {

    //Show the output container.
    locationOutPutContainer.classList.remove("d-none")

    //Look for matches of the selected value in the national parks array.
    let matches = nationalParksArray.filter((park) => park.State === parksSearchDataList.value)

    //Call the display parks function.
    displayParks(matches, locationOutPutContainer)

})

//Add an event listener to the park type datalist.
parkTypeDataList.addEventListener("change", () => {

    //Show the park type output container.
    parkTypeOutPutContainer.classList.remove("d-none");

    //Find matches in the national parks array for the selected value in the location name.
    let matches = nationalParksArray.filter((park) => park.LocationName.toUpperCase().includes(parkTypeDataList.value.toUpperCase()) === true)

    //Call the display parks function
    displayParks(matches, parkTypeOutPutContainer)
})

//Function to display parks given an array of parks and a container to load them in.
function displayParks(matches, outputContainer) {

    //Set cards per row
    let cardsPerRow = 3;
    let rowsToAdd = Math.ceil(matches.length / cardsPerRow)

    for(let i = 1; i <= rowsToAdd; i++) {
        outputContainer.innerHTML += `<div class="row p-3 parkRows"></div>`
    }
    
    let newRows = document.querySelectorAll(".parkRows")

    let columnsAdded = 0;
    let rowIndex = 0;
    matches.forEach((park) => {
        if(columnsAdded % cardsPerRow === 0 && columnsAdded !== 0) {
            rowIndex++
        }
        newRows[rowIndex].innerHTML += `
            <div class="col p-3 parkCards">
                <div class="card">
                    <div class="card-body" id="parkCard${park.LocationID}">
                        <h5 class="card-title">${park.LocationName}</h5>
                        <p class="card-text">${park.Address}</p>
                        <p class="card-text">${park.City}, ${park.State}, ${park.ZipCode}</p>
                        <p class="card-text"><b>Phone: </b>${park.Phone}</p>
                        <p class="card-text"><b>Fax: </b>${park.Fax}</p>
                        <p class="card-text sunrise d-none"></p>
                        <p class="card-text sunset d-none"></p>
                    </div>
                </div>
            </div>`

        columnsAdded++
    })
}

showAllParksButton.addEventListener("click", () => {
    locationOutPutContainer.innerHTML = "";
    parkTypeOutPutContainer.innerHTML = "";
    locationOutPutContainer.classList.remove("d-none");
    parkTypeOutPutContainer.classList.add("d-none");
    displayParks(nationalParksArray, locationOutPutContainer);
})

async function getSunsetForParks(lat, lng){
    let response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`)
    let data = await response.json()
    return data
}

////The below can be added to the display parks function if numerous calls to the api are OK.
// getSunsetForMountain(park.Latitude, park.Longitude).then((data) => {

//     let sunriseData = document.querySelector(`#parkCard${park.LocationID} > p.sunrise`);

//     let sunsetData = document.querySelector(`#parkCard${park.LocationID} > p.sunset`);

//     sunriseData.innerHTML = `<b>Sunrise: </b>${data.results.sunrise}`
//     sunsetData.innerHTML = `<b>Sunset: </b>${data.results.sunset}`
//     sunriseData.classList.remove("d-none")
//     sunsetData.classList.remove("d-none")
// })
