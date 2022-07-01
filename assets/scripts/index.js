
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

        //Get the events list datalist dropdown.
        let datalistOptions = document.querySelector("#parkEventsDatalistOptions")

        //Loop over the park and display the location name in the dropdown.
        nationalParksArray.forEach((park) => {

            //Add the option.
            datalistOptions.innerHTML += `<option value="${park.LocationName}">${park.LocationName}</option>`

        })
        
        //Load some events, default to acadia national park.
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

//Load news events given a four letter park code.
let loadNPSNews = async (parkCode) => {

    //Store the output container.
    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");

    //Reset the output container.
    newsOutPutContainer.innerHTML = "";

    //Make it visible.
    newsOutPutContainer.classList.remove("d-none");

    //Call the NPS api with the park code.
    let response = await fetch(`https://developer.nps.gov/api/v1/newsreleases?parkCode=${parkCode}&api_key=Qljuiw8TZtWshEnVSv9ty3miWNXmxogbDyFkSSDZ`);
    
    //Wait for the response.
    let data = await response.json();

    //If we have no data then display a message, if there is data display the events.
    if(data.data.length === 0) {
        
        //Show a generic message if no data.
        displayNoEvents();

    } else {

        //Display the events given the array of events and the output container.
        displayEventsCarousel(data.data);

    }

};

//Add an event listener to the datalist dropdown.
parkEventsDatalist.addEventListener("change", () => {

    //get the datalist dropdown.
    let parkEventsDatalist = document.querySelector("#parkEventsDatalist");

    //Get the output container.
    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");

    //Reset the output container.
    newsOutPutContainer.innerHTML = "";

    //Make it visible.
    newsOutPutContainer.classList.remove("d-none");

    //Look for matches of the selected value in the national parks array.
    let matches = nationalParksArray.filter((park) => park.LocationName === parkEventsDatalist.value);

    //Load the data given the four letter park code.
    loadNPSNews(matches[0].LocationID);

})

//Function to display a short message if there are no events to display.
function displayNoEvents() {

    //Get the datalist and output container.
    let datalistOptions = document.querySelector("#parkEventsDatalist");
    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");

    //Clear the output container and make it visible.
    newsOutPutContainer.innerHTML = "";
    newsOutPutContainer.classList.remove("d-none");

    //Put in some html given the selection of the datalist.
    newsOutPutContainer.innerHTML = `
    <div class="row p-3 parkRows">
        <div class="col p-3 parkCards">
            <div class="card">
                <div class="card-body" id="eventCard">
                    <h5>No News for ${datalistOptions.value}, sorry :(</h5>
                </div>
            </div>
        </div>
    </div>`;

};

//Function to display events in a carousel given an array of events.
function displayEventsCarousel(events) {

    //Get the output container.
    let newsOutPutContainer = document.querySelector(".newsOutPutContainer");

    //Clear its html.
    newsOutPutContainer.innerHTML = "";

    //Make it visible.
    newsOutPutContainer.classList.remove("d-none");

    //Place in the carousel so we can add items to it.
    newsOutPutContainer.innerHTML += `
        <div class="container carouselContainer p-5">
            <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>`;

    //Get the inner section of the carousel.
    let carouselInner = document.querySelector(".carousel-inner");
    
    //Store active state to be used for the first item.
    let active = "active";

    //Loop through the filtered array that was passed in the function.
    events.forEach((event) => {
        
        //If we don't have an image url then don't use the image tag, if we do add it.
        if(event.image.url.trim() !== '') {

            //Add html to the carousel inner section.
            carouselInner.innerHTML += `                
                <div class="carousel-item ${active}">    
                    <h5 class="card-title"><a href="${event.url}" target="_blank">${event.title}</a></h5>
                    <p>${event.abstract}</p>
                    <img src="${event.image.url}" class="d-block w-100 eventImages" alt="...">
                </div>`;
        } else {
            carouselInner.innerHTML += `                
            <div class="carousel-item ${active}">
                <h5 class="card-title"><a href="${event.url}" target="_blank">${event.title}</a></h5>
                <p>${event.abstract}</p>
            </div>`;
        };

        //Clear active state.
        active = ""

    });
};


