//Query document for necessary elements.
let mountainsOutPutContainer = document.querySelector(".mountainsOutPutContainer");
let mountainDataList = document.querySelector("#mountainDataList");
let showAllMountainsButton = document.querySelector("#showAllMountainsButton");

//Add event listener to the dropdown change event.
mountainDataList.addEventListener("change", () => {

    //Remove the no display class from the output container so elements can be loaded to it and visible.
    mountainsOutPutContainer.classList.remove("d-none");

    //Reset the output container in case it already has data.
    mountainsOutPutContainer.innerHTML = "";
    
    //Look through the mountains array for a match to the dropdown's value.
    let matches = mountainsArray.filter((mountain) => mountain.name === mountainDataList.value)
    
    //Call the display mountains function with the matches array and output container as inputs.
    displayMoutains(matches, mountainsOutPutContainer)
})

//Add event listner to the show all mountains button on click event.
showAllMountainsButton.addEventListener("click", () => {

    //Show the montains output container.
    mountainsOutPutContainer.classList.remove("d-none")

    //Call the display mountains function with the full mountains array and the output container as inputs.
    displayMoutains(mountainsArray, mountainsOutPutContainer);
})

//Function do load mountains data given an array and the container for output.
function displayMoutains(matches, outputContainer) {
    
    //Set how many cards per row you want.
    let cardsPerRow = 3;

    //Get the rows to add by taking the length of the array and dividing by the cards per row. Round up so any remainder has a row to go in.
    let rowsToAdd = Math.ceil(matches.length / cardsPerRow)

    //Add rows to the container.
    for(let i = 1; i <= rowsToAdd; i++) {
        outputContainer.innerHTML += `<div class="row p-3 mountainRows"></div>`
    }
    
    //Find the newly added rows.
    let newRows = document.querySelectorAll(".mountainRows");

    //Set the columns added to 0
    let columnsAdded = 0;
    let rowIndex = 0;

    //Loop over the matches array and load each mountain.
    matches.forEach((mountain) => {

        //If we hit a multiple of the cards per row value, up the index by one to move to the next row. Unless we're on the first one.
        if(columnsAdded % cardsPerRow === 0 && columnsAdded !== 0) {
            rowIndex++
        }

        //Look at the new rows array and use the row index to get the current row. Add the column div data using the current mountain value.
        newRows[rowIndex].innerHTML += `
            <div class="col p-3">
                <div class="card">
                    <div class="card-body" id="mountainCard${mountain.name.replace(" ", "").replace(".", "").replace("'", "")}">
                        <img src="./assets/images/mountains/${mountain.img}">
                        <h5 class="card-title">${mountain.name}</h5>
                        <p class="card-text">${mountain.desc}</p>
                        <p class="card-text"><b>Elevation:</b> ${mountain.elevation}</p>
                        <p class="card-text"><b>Effort:</b> ${mountain.effort}</p>
                        <p class="card-text sunrise d-none"></p>
                        <p class="card-text sunset d-none"></p>
                    </div>
                </div>
            </div>`

        //Increment the columns added value.
        columnsAdded++

        //Call the sunset info function to get the data for the mountains sunset/sunrise times. Only do it if we have one match... seeing timeouts
        //with the API and not sure if this is because of the large amount of calls...
        matches.length === 1 ? getSunsetForMountain(mountain.coords.lat, mountain.coords.lng).then((data) => {

            //Find the current data values, use the mountainCard id's that were used in the column div.
            let sunriseData = document.querySelector(`#mountainCard${mountain.name.replace(" ", "").replace(".", "").replace("'", "")} > p.sunrise`);
            let sunsetData = document.querySelector(`#mountainCard${mountain.name.replace(" ", "").replace(".", "").replace("'", "")} > p.sunset`);

            //Add the sunrise data results from the fetch call.
            sunriseData.innerHTML = `<b>Sunrise: </b>${data.results.sunrise}`
            sunsetData.innerHTML = `<b>Sunset: </b>${data.results.sunset}`

            //Show the sunrise/sunset data.
            sunriseData.classList.remove("d-none")
            sunsetData.classList.remove("d-none")

        }) : ""
        
    })
}

async function getSunsetForMountain(lat, lng){
    let response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`)
    let data = await response.json()
    return data
}

