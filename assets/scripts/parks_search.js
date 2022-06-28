let parksSearchDataList = document.querySelector("#exampleDataList");
let parksSearchOptions = document.querySelector("#datalistOptions");
let locationRadio = document.querySelector("#locationRadio");
let parkTypeRadio = document.querySelector("#parkTypeRadio");
let locationsListContainer = document.querySelector(".locationsListContainer")
let datalistInput = document.querySelector("#exampleDataList");
let locationOutPutContainer = document.querySelector(".locationOutPutContainer");
let parkTypedatalistOptions = document.querySelector("#parkTypedatalistOptions");
let parkTypeListContainer = document.querySelector(".parkTypeListContainer");


parkTypeRadio.addEventListener("click", () => {
    locationsListContainer.classList.add("d-none");
    parkTypedatalistOptions.innerHTML = "";
    parkTypeListContainer.classList.remove("d-none");
    console.log(parkTypesArray)
    parkTypesArray.forEach((parkType) => {
        console.log(parkType)
        parkTypedatalistOptions.innerHTML += `<option value="${parkType}">${parkType}</option>`
    })
});

locationRadio.addEventListener("click", () => {
    parkTypeListContainer.classList.add("d-none");
    parkTypedatalistOptions.innerHTML = "";
    locationsListContainer.classList.remove("d-none");
    locationsArray.forEach((location) => {
        parksSearchOptions.innerHTML += `<option value="${location}">${location}</option>`
    })
})

parksSearchDataList.addEventListener("change", () => {
    locationOutPutContainer.classList.remove("d-none")
    let matches = nationalParksArray.filter((park) => park.State === parksSearchDataList.value)
    console.log(matches)
    matches.forEach((park) => {
            
            locationOutPutContainer.innerHTML += `<div class="row">${JSON.stringify(park)}<div>`
    })
    
})