// Created Waleed Khan, 2024

// https://cd-static.bamgrid.com/dp-117731241344/home.json will provide data to populate a “Home” page similar to the current Disney+ experience.
const homeURL = "https://cd-static.bamgrid.com/dp-117731241344/home.json";

//https://cd-static.bamgrid.com/dp-117731241344/sets/<ref id>.json will provide data for dynamic “ref” sets. 
//The “ref id” will be provided in the “home.json”.
const refURL = "https://cd-static.bamgrid.com/dp-117731241344/sets/";

// currentID and and number of indexes
let currID = 0;
let tagIndex = 0;

window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'ArrowLeft':
            if(currID>0){
                currID--;
            }
            document.getElementById(`showID${currID}`).focus();
            break;
        case 'ArrowRight':
            if(currID<(tagIndex-1)){
                currID++;
            }
            document.getElementById(`showID${currID}`).focus();
            break;
        case 'ArrowUp':
            if((currID-15)<=0){
                currID=0;
            }
            else{
                currID-= (currID%15 + 15);
            }
            document.getElementById(`showID${currID}`).focus();
            break;
        case 'ArrowDown':
            if((currID+15)>=tagIndex){
                currID = tagIndex-1;
            }
            else{
                currID+=15;
                currID-=(currID%15);
            }
            document.getElementById(`showID${currID}`).focus();
            break;
    }
})

window.onload = async() =>{
    await renderRows();
}

async function renderRows(){
    
    const disneyData = await fetch(homeURL);
    const disneyDataJSON = await disneyData.json();
    
    const rowData = disneyDataJSON["data"]["StandardCollection"]["containers"];
    if(rowData == null || rowData== undefined){
        return;
    }
    
    let newBody = ``;
    let itemsToLoad = [];
    rowData.forEach((e)=>{

        let currSet = e["set"];
        let rowTitle = currSet["text"]["title"]["full"]["set"]["default"]["content"];                    
        let rowItems = currSet["items"];

        if(rowItems!=null || rowItems!=undefined){
            
            let newRow = "";
            newRow =`<div class="container">\n
                        <h2>${rowTitle}</h2>\n
                        <div class="rowContainer">\n
                            <div class="row">\n`

            rowItems.forEach(item => {
                if(item){
                    
                    let imageRef = item["image"]["tile"]["1.78"];
                    let key = Object.keys(imageRef)[0];
                    let imageURL = imageRef[key]["default"]["url"];
                    newRow += `<div class="item" tabIndex="${tagIndex}" id="showID${tagIndex}" style="background-image: url(${imageURL})"></div>\n`;
                    tagIndex++;
                }
                
            });

            newRow +=       `</div>\n
                        </div>\n
                    </div>`
            newBody += newRow;
        }
        else if(currSet["refId"]!=null && currSet["refId"]!=undefined){
            // If a set doesn't have items, add it's ref 
            itemsToLoad.push(currSet);
        }
    });
    
    document.body.innerHTML += newBody;
    await loadAdditionalRows(itemsToLoad);
}

async function loadAdditionalRows(items){
    await items.forEach(async (item)=>{
        if(item["refId"]==null || item["refID"==undefined]){
            return;
        }
        const currRow = await fetch(refURL+`${item["refId"]}.json`);
        const rowData = await currRow.json();
        
        let currSet = rowData["data"];
        currSet = currSet[Object.keys(currSet)[0]];
        
        let rowTitle = currSet["text"]["title"]["full"]["set"]["default"]["content"];
        let rowItems = currSet["items"];

        if(rowItems!=null || rowItems!=undefined){
            let newRow = "";
                newRow =`<div class="container">\n
                            <h2>${rowTitle}</h2>\n
                            <div class="rowContainer">\n
                                <div class="row">\n`

            rowItems.forEach(item => {
                if(item){
                    
                    let imageRef = item["image"]["tile"]["1.78"];
                    let key = Object.keys(imageRef)[0];
                    let imageURL = imageRef[key]["default"]["url"];

                    newRow += `<div class="item" tabIndex="${tagIndex}" id="showID${tagIndex}" style="background-image: url(${imageURL})"></div>\n`;
                    tagIndex++;
                }
                
            });

            newRow +=       `</div>\n
                        </div>\n
                    </div>`
            document.body.innerHTML += newRow;
        }
    });
    // document.body.innerHTML += additionalBody;
}

// Format for HTML layout
/*
<div class="container">
    <h2>Container Title</h2>
    <div class="rowContainer">
        <div class="row">
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
        </div>
    </div>
</div>
*/