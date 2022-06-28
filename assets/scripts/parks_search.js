let parksSearchDataList = document.querySelector("#exampleDataList");
let parksSearchOptions = document.querySelector("#datalistOptions");
let locationRadio = document.querySelector("#locationRadio");
let parkTypeRadio = document.querySelector("#parkTypeRadio");
let locationsListContainer = document.querySelector(".locationsListContainer")

parkTypeRadio.addEventListener("click", () => {
    locationsListContainer.classList.add("d-none");
})

locationRadio.addEventListener("click", () => {
    locationsListContainer.classList.remove("d-none");
    locationsArray.forEach((location) => {
        parksSearchOptions.innerHTML += `<option value="${location}">${location}<option>`
    })
})