let parksSearchDataList = document.querySelector("#exampleDataList");
let parksSearchOptions = document.querySelector("#datalistOptions");
let locationRadio = document.querySelector("#locationRadio");
let parkTypeRadio = document.querySelector("#parkTypeRadio");
let locationsListContainer = document.querySelector(".locationsListContainer")
let datalistInput = document.querySelector("#exampleDataList");
let locationOutPutContainer = document.querySelector(".locationOutPutContainer");

parkTypeRadio.addEventListener("click", () => {
    locationsListContainer.classList.add("d-none");
    parksSearchOptions.innerHTML = ""
})

locationRadio.addEventListener("click", () => {
    locationsListContainer.classList.remove("d-none");
    locationsArray.forEach((location) => {
        parksSearchOptions.innerHTML += `<option value="${location}">${location}</option>`
    })
})

parksSearchDataList.addEventListener("change", () => {
    locationOutPutContainer.classList.remove("d-none")
    let matches = nationalParksArray.filter((State) => State === parksSearchDataList.value)
    console.log(matches)
    nationalParksArray.forEach((park) => {
        
        if(park.State === parksSearchDataList.value) {
            
            locationOutPutContainer.innerHTML += `<div class="row">${park.State}<div>`
            
        }
    })
    
})