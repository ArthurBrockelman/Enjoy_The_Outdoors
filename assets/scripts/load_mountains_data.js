"use strict"

let mountainsArray = []

window.onload = function(){

    loadJsonData("assets/data/mountains.json").then((mountains) => {
        mountainsArray = mountains.mountains;
        let mountaindatalistOptions = document.querySelector("#mountaindatalistOptions");
        mountainsArray.forEach((mountain) => {
            mountaindatalistOptions.innerHTML += `<option value="${mountain.name}">${mountain.name}</option>`
        })
    })

}

//function that can "fetch" the sunset/sunrise times
let loadJsonData = async (path) => {
    let response = await fetch(path)
    let data = await response.json()
    return data
}