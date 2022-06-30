//Grab the show all  parks button
let showAllParksButton = document.querySelector("#showAllParksButton");

//Parks Search data list
let parksSearchDataList = document.querySelector("#exampleDataList");
let parksSearchOptions = document.querySelector("#datalistOptions");

//Radio references
let locationRadio = document.querySelector("#locationRadio");
let parkTypeRadio = document.querySelector("#parkTypeRadio");

//Container for drop down to hide/reveal when radio is checked
let locationsListContainer = document.querySelector(".locationsListContainer");

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
    locationOutPutContainer.classList.add("d-none");
    parkTypedatalistOptions.innerHTML = "";

    //Show the park type dropdown.
    parkTypeListContainer.classList.remove("d-none");

    //Loop over the park type array and add the options to the datalist.
    parkTypesArray.forEach((parkType) => {
        
        //Append options to the list.
        parkTypedatalistOptions.innerHTML += `<option value="${parkType}">${parkType}</option>`;

    });

});

//Add an event listener to the location search radio.
locationRadio.addEventListener("click", () => {

    //If clicked, hide and remove data from the output containers.
    parkTypeListContainer.classList.add("d-none");
    parkTypeOutPutContainer.classList.add("d-none");
    parkTypedatalistOptions.innerHTML = "";

    //Show the locations dropdown.
    locationsListContainer.classList.remove("d-none");

    //Loop over each item in the location array and add it as an option to the datalist.
    locationsArray.forEach((location) => {

        parksSearchOptions.innerHTML += `<option value="${location}">${location}</option>`;

    });

});

//When a change event occurs on the location search datalist...
parksSearchDataList.addEventListener("change", () => {

    //Show the output container.
    locationOutPutContainer.classList.remove("d-none");

    //If the selected value changes, reset state by deleting the container's html.
    locationOutPutContainer.innerHTML = "";

    //Look for matches of the selected value in the national parks array.
    let matches = nationalParksArray.filter((park) => park.State === parksSearchDataList.value);

    //Call the display parks function.
    displayParks(matches, locationOutPutContainer);

    //Call a function to add event listeners to the buttons.
    addShowMoreInfoEventListeners(matches, locationOutPutContainer);
});

//Add an event listener to the park type datalist.
parkTypeDataList.addEventListener("change", () => {

    //Show the park type output container.
    parkTypeOutPutContainer.classList.remove("d-none");

    //Reset state by clearing out the container's html.
    parkTypeOutPutContainer.innerHTML = "";

    //Find matches in the national parks array for the selected value in the location name.
    let matches = nationalParksArray.filter((park) => park.LocationName.toUpperCase().includes(parkTypeDataList.value.toUpperCase()) === true);

    //Call the display parks function.
    displayParks(matches, parkTypeOutPutContainer);

    //Call a function to add event listeners to the more info buttons.
    addShowMoreInfoEventListeners(matches, parkTypeOutPutContainer);
})

showAllParksButton.addEventListener("click", () => {
    locationOutPutContainer.innerHTML = "";
    parkTypeOutPutContainer.innerHTML = "";
    locationOutPutContainer.classList.remove("d-none");
    parkTypeOutPutContainer.classList.add("d-none");
    displayParks(nationalParksArray, locationOutPutContainer);
    addShowMoreInfoEventListeners(nationalParksArray, locationOutPutContainer);

})

//Function to display parks given an array of parks and a container to load them in.
function displayParks(matches, outputContainer) {

    //Set cards per row
    let cardsPerRow = 3;

    //Calculate the number of rows to add by taking the array length and dividing by cards per row.
    let rowsToAdd = Math.ceil(matches.length / cardsPerRow);

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
    matches.forEach((park) => {

        //Check to see if we move to a new row, first column added should be ignored but otherwise
        //We can check to see if there is no remainder for the columns added / the cards per row.
        if(columnsAdded % cardsPerRow === 0 && columnsAdded !== 0) {

            rowIndex++;

        };

        //Add to the park's data to the rows html.
        newRows[rowIndex].innerHTML += `
            <div class="col p-3 parkCards">
                <div class="card">
                    <div class="card-body" id="parkCard${park.LocationID}">
                        <h5 class="card-title">${park.LocationName}</h5>
                        <p class="card-text">${park.Address}</p>
                        <p class="card-text">${park.City}, ${park.State}, ${park.ZipCode}</p>
                        ${checkPhone(park)}
                        <p class="card-text"><b>Fax: </b>${park.Fax}</p>
                        ${checkVisitor(park)}
                        <p class="card-text sunrise d-none"></p>
                        <p class="card-text sunset d-none"></p>
                        <button type="button" class="btn btn-success" id="ShowMoreInfoButton${park.LocationID.toUpperCase()}">More Info</button>
                        <div class="spinner-border text-primary d-none" role="status" id="LoadingSpinner${park.LocationID}">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>`
        
        //Increment columns added.
        columnsAdded++;
    })
}

//Function to handle getting latitude and longitude.
async function getSunsetForParks(lat, lng){
    let response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`);
    let data = await response.json();
    return data;
};

//Check to see if we have a url for the Visit prop on the park.
function checkVisitor(park) {
    if(typeof(park.Visit) != "undefined") {
        return `<p class="card-text"><b>Visit Us: </b><a href="${park.Visit}" target="_blank">${park.Visit}</a></p>`;
    } else {
        return "";
    };
};

//Check to see if we have a phone number for a park.
function checkPhone(park) {
    if(park.Phone !== 0) {
        return `<p class="card-text"><b>Phone: </b>${park.Phone}</p>`;
    } else {
        return "";
    };
};

//Fetch park data from the nps API.
//key Qljuiw8TZtWshEnVSv9ty3miWNXmxogbDyFkSSDZ
let loadParkData = async (parkCode) => {

    let response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=Qljuiw8TZtWshEnVSv9ty3miWNXmxogbDyFkSSDZ`);
    let data = await response.json();
    return data;

};

//Function to add event listeners to the show more info button. Takes an array of parks and an output container as arguments.
function addShowMoreInfoEventListeners(matches, OutPutContainer) {

    matches.forEach((park) => {

        //Pull the button, the park location id was used in the id prop of the button when it was loaded.
        let ShowMoreInfoButton = document.querySelector(`#ShowMoreInfoButton${park.LocationID.toUpperCase()}`)

        //Add an event listener for clicking.
        ShowMoreInfoButton.addEventListener("click", () => {

            //Reset the output container's state.
            OutPutContainer.innerHTML = ""

            //Get the park data, could add something for failures?
            loadParkData(park.LocationID).then((data) => {

                //The data returned has park data located in an array.
                let park = data.data[0]
                
                //Add the park data to the output container.
                OutPutContainer.innerHTML += `
                <div class="col p-3 individualparkCards">
                    <div class="card">
                        <div class="card-body" id="parkCard${park.fullName}">
                            <h1 class="card-title">${park.fullName}</h1>
                            <p class="card-text">${park.description}</p>
                            <h2 class="card-title">Activities</h2>
                            <ul id="${park.parkCode}Activities">
                            </ul>
                            <div id="${park.parkCode}ImageContainer">
                            </div>
                        </div>
                    </div>
                </div>`
            
            //Load activities to the ul.
            loadActivities(park);

            //Load images to the image container.
            loadImages(park);

            });
            
        });
    });
};

//Function to load activities given a park.
function loadActivities(park) {
    
    //Find the activities list given the parks unique code.
    let parkActivitiesList = document.querySelector(`#${park.parkCode}Activities`);

    //Loop over the activities array.
    park.activities.forEach((activity) => {

        //Append the activity to the list's html.
        parkActivitiesList.innerHTML += `<li>${activity.name}</li>`;

    });

}

//Function to load images to the card's image container.
function loadImages(park) {

    //Get the image container given the park's unique code.
    let imageContainer = document.querySelector(`#${park.parkCode}ImageContainer`);

    //Loop through the image array.
    park.images.forEach((image) => {

        //Add each image to the container's html.
        imageContainer.innerHTML += `<img src="${image.url}" class="parkImages p-2">`;

    });

};

////The below can be added to the display parks function if numerous calls to the api are OK. But the API didn't really like when I did that.
// getSunsetForMountain(park.Latitude, park.Longitude).then((data) => {

//     let sunriseData = document.querySelector(`#parkCard${park.LocationID} > p.sunrise`);

//     let sunsetData = document.querySelector(`#parkCard${park.LocationID} > p.sunset`);

//     sunriseData.innerHTML = `<b>Sunrise: </b>${data.results.sunrise}`
//     sunsetData.innerHTML = `<b>Sunset: </b>${data.results.sunset}`
//     sunriseData.classList.remove("d-none")
//     sunsetData.classList.remove("d-none")
// })