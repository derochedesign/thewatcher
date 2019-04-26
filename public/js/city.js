const vidH = document.getElementById("vidHolder");
const myLoop = setInterval(anims, 300);

$("#makeFull").click(function() {
    if (screenfull.enabled) {
		screenfull.request();
    }
    $("#makeFull").hide();
});

let myInfo;
let prevInfo = {pos:0};

function anims() {
    
    $.getJSON('data/updates.json', function(result) {   
        //clone array
        myInfo = result.city;
    });
    
    if (prevInfo.pos !== Number(myInfo.pos)) {
        console.log("okay");
        
        prevInfo = myInfo;
        switchVideos();
    }
}

const switchVideos = () => {
    //by default, play first reveal and loop
    //then play the next one based on myInfo.pos
        vidH.innerHTML = buildVideoTagR(myInfo.pos);
}

const buildVideoTagR = p => {
        
        let source = `img/city/R${p}.mp4`
        
        return (
            `<video autoplay mute>
                <source src="${source}" type="video/mp4">
            </video>`
        )
}

const buildVideoTagLoop = p => {
        
    let source = `img/city/L${p}.mp4`;
    
    return (
        `<video autoplay loop mute>
            <source src="${source}" type="video/mp4">
        </video>`
    )
}

switchVideos();