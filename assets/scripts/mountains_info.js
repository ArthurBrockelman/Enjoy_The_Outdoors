let mountainsOutPutContainer = document.querySelector(".mountainsOutPutContainer");
let mountainDataList = document.querySelector("#mountainDataList");
let showAllMountainsButton = document.querySelector("#showAllMountainsButton");
console.log(showAllMountainsButton)

mountainDataList.addEventListener("change", () => {
    mountainsOutPutContainer.classList.remove("d-none");
    console.log(mountainDataList.value)
    let matches = mountainsArray.filter((mountain) => mountain.name === mountainDataList.value)
    console.log(matches)
    displayMoutains(matches, mountainsOutPutContainer)
})

showAllMountainsButton.addEventListener("click", () => {
    showAllMountainsButton.classList.remove("d-none")
    displayMoutains(mountainsArray, mountainsOutPutContainer);
})


function displayMoutains(matches, outputContainer) {
    
    let cardsPerRow = 3;
    let rowsToAdd = Math.ceil(matches.length / cardsPerRow)

    for(let i = 1; i <= rowsToAdd; i++) {
        outputContainer.innerHTML += `<div class="row p-3 parkRows"></div>`
    }
    
    let newRows = document.querySelectorAll(".parkRows")
    let columnsAdded = 0;
    let rowIndex = 0;
    matches.forEach((mountain) => {
        if(columnsAdded % cardsPerRow === 0 && columnsAdded !== 0) {
            rowIndex++
        }
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

        columnsAdded++

        getSunsetForMountain(mountain.lat, mountain.lng).then((data) => {

            let sunriseData = document.querySelector(`#mountainCard${mountain.name.replace(" ", "").replace(".", "").replace("'", "")} > p.sunrise`);

            let sunsetData = document.querySelector(`#mountainCard${mountain.name.replace(" ", "").replace(".", "").replace("'", "")} > p.sunset`);

            sunriseData.innerHTML = `<b>Sunrise: </b>${data.results.sunrise}`
            sunsetData.innerHTML = `<b>Sunset: </b>${data.results.sunset}`
            sunriseData.classList.remove("d-none")
            sunsetData.classList.remove("d-none")
        })
    })
}

async function getSunsetForMountain(lat, lng){
    let response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`)
    let data = await response.json()
    return data
}

