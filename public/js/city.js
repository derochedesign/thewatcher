const vidH = document.getElementById("vidHolder");
const myLoop = setInterval(anims, 300);

$("#makeFull").click(function() {
    if (screenfull.enabled) {
		screenfull.request();
    }
    $("#makeFull").hide();
});

let myInfo;
let prevInfo = 0;
let xPos;

function anims() {
    $.getJSON('data/updates.json', function(result) {   
        //clone array
        myInfo = result.city;
        xPos = parseInt(result.city.pos);
    });
    
    if (prevInfo != xPos) {
        console.log("okay");
        
        prevInfo = xPos;
        switchVideos();
    }
}

const switchVideos = () => {
    //by default, play first reveal and loop
    //then play the next one based on myInfo.pos
    vidH.innerHTML = buildVideoTagLoop(myInfo.pos);
}



const buildVideoTagLoop = p => { 
    let sourceFirst = `img/city/R${p}.mp4`;
    let sourceLoop = `img/city/L${p}.mp4`;

    video_count = 1;
    videoPlayer = document.getElementById("videoContainer");
    
    function run() {
        videoPlayer.src = sourceLoop;
        videoPlayer.play();
        console.log("ffuck");
        
    };

    return (
        `<video id="videoContainer" autoplay mute onended="run()">
            <source src="${sourceFirst}" type="video/mp4">
        </video>`
    )
}

const buildVideoTagR = p => {
        
        let source = `img/city/R${p}.mp4`;
        
        return (
            `<video autoplay mute>
                <source src="${source}" type="video/mp4">
            </video>`
        )
}

// const buildVideoTagLoop = p => {
        
//     let source = `img/city/L${p}.mp4`;
    
//     return (
//         `<video autoplay loop mute>
//             <source src="${source}" type="video/mp4">
//         </video>`
//     )
// }

switchVideos();