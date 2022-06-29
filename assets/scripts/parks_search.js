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

parkTypeRadio.addEventListener("click", () => {

    locationsListContainer.classList.add("d-none");
    locationOutPutContainer.classList.add("d-none")
    parkTypedatalistOptions.innerHTML = "";
    parkTypeListContainer.classList.remove("d-none");

    parkTypesArray.forEach((parkType) => {

        parkTypedatalistOptions.innerHTML += `<option value="${parkType}">${parkType}</option>`;

    });
});

locationRadio.addEventListener("click", () => {
    parkTypeListContainer.classList.add("d-none");
    parkTypeOutPutContainer.classList.add("d-none")
    parkTypedatalistOptions.innerHTML = "";
    locationsListContainer.classList.remove("d-none");
    locationsArray.forEach((location) => {
        parksSearchOptions.innerHTML += `<option value="${location}">${location}</option>`
    })
})

parksSearchDataList.addEventListener("change", () => {
    locationOutPutContainer.classList.remove("d-none")
    let matches = nationalParksArray.filter((park) => park.State === parksSearchDataList.value)
    displayParks(matches, locationOutPutContainer)
})

parkTypeDataList.addEventListener("change", () => {
    parkTypeOutPutContainer.classList.remove("d-none");
    let matches = nationalParksArray.filter((park) => park.LocationName.toUpperCase().includes(parkTypeDataList.value.toUpperCase()) === true)
    console.log(matches)
    displayParks(matches, parkTypeOutPutContainer)
})

function displayParks(matches, outputContainer) {
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

        getSunsetForMountain(park.Latitude, park.Longitude).then((data) => {
            console.log(data)
            let sunriseData = document.querySelector(`#parkCard${park.LocationID} > p.sunrise`);

            let sunsetData = document.querySelector(`#parkCard${park.LocationID} > p.sunset`);

            sunriseData.innerHTML = `<b>Sunrise: </b>${data.results.sunrise}`
            sunsetData.innerHTML = `<b>Sunset: </b>${data.results.sunset}`
            sunriseData.classList.remove("d-none")
            sunsetData.classList.remove("d-none")
        })
    })
}

showAllParksButton.addEventListener("click", () => {
    locationOutPutContainer.innerHTML = "";
    parkTypeOutPutContainer.innerHTML = "";
    locationOutPutContainer.classList.remove("d-none");
    parkTypeOutPutContainer.classList.add("d-none");
    displayParks(nationalParksArray, locationOutPutContainer);
})

async function getSunsetForMountain(lat, lng){
    let response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`)
    let data = await response.json()
    return data
}


