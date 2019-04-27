const myLoop = setInterval(anims, 300);
const domElem1 = document.getElementById("adContainer1");
const domElem2 = document.getElementById("adContainer2");
const domElem3 = document.getElementById("adContainer3");
let myInfo;
let prevInfo = 0;
let adIDx;

let cPos = 1;

function anims() {
    
    $.getJSON('data/updates.json', function(result) {   
        //clone array
        console.log(result);
        
        myInfo = result.popups;
        console.log(myInfo.lastAnswer.adID);
        adIDx = parseInt(myInfo.lastAnswer.adID);
        
    });
    if (prevInfo != adIDx) {
        prevInfo = adIDx;
        addAd();
    }
}

const addAd = () => {
    index = allAds.findIndex(ad => ad.id == adIDx);
    
    if (index != -1) {
        console.log("found one");
        
        if (cPos == 1) {
            domElem1.innerHTML = AdTemplate(allAds[index]);
            cPos = 2;
            $(".adCont").css({zIndex:"0"});
            domElem1.style.zIndex = 3;
        }
        else if (cPos == 2) {
            domElem2.innerHTML = AdTemplate(allAds[index]);
            cPos = 3;
            $(".adCont").css({zIndex:"0"});
            domElem2.style.zIndex = 3;
        }
        else if (cPos == 3) {
            domElem3.innerHTML = AdTemplate(allAds[index]);
            cPos = 1;
            $(".adCont").css({zIndex:"0"});
            domElem3.style.zIndex = 3;
        }
        $(".closebtn").click(function(e) {
            e.target.parentElement.parentElement.parentElement.innerHTML = "";
            console.log("gya");
            
        });
        
    }
    
    
}

//show the ad that corresponds to the position and id


const AdTemplate = innards => {
    return (
        `<div class="popbox" data-id=${innards.id}>
            <div class="topbar">
                <button class="closebtn" type="button" name="button"> X </button>
            </div>
            ${innards.all}
        </div>`
    )
}

const allAds = [
    {
        id: 501,
        all: `<img src="img/ads/car1.gif" alt="">
        <h2>You've won a BMW!</h2>
        <h1 class="free">FREE!</h1>
        <img class="car" src="img/ads/bmw_pic.png" alt="">
        <h2 class="textb">Claim by giving up your privacy!</h2>
        <div class="carbutton">
            <h3>Give up my privacy</h3>
        </div>`
    },
    {
        id: 502,
        all: `<img src="img/ads/forums_popup.gif" alt="">`
    },
    {
        id: 503,
        all: `<div class="socialtxt">
            <h1 class="socialheading">Make yourself feel better with more followers!</h1>
            <ul class="likes">
            <li>100 Followers for $5!</li>
            <li>1,000 Followers for $20!</li>
            <li>10,000 Followers for $100!</li>
            </ul>
        </div>
        <img src="img/ads/social_follow.gif" class="socialicon" alt="">`
    },
    {
        id: 504,
        all: `<div class="netflix_title">
            <h2>Staying home all alone today?</h2>
            </div>
            <h2>Recommended for you!</h2>
            <img src="img/ads/netflix_pop.gif" alt="">
            <img src="img/ads/netflixpng.png" class="netflixlogo" alt="">`
    },
    {
        id: 505,
        all: `<h3 class="musichead">Music only you like</h1>
            <img src="img/ads/hottify_logo-01.png" class="musiclogo" alt="">
            <h1 class="hottify">hottify</h1>
            <img src="img/ads/hottifybutton.gif" class="musicbutton" alt="">`
    },
    {
        id: 506,
        all: `<div class="prestotxt">
            <img src="img/ads/presto_Card.gif" class="cardanim" alt="">
            <h4> Avoid FOUT <br> (Fear of Using Tickets)</h4>
            <h4 class="prestologo">PRESTO</h4>
            </div>`
    },
    {
        id: 507,
        all: `<h1 class="bikehead">CUSTOMIZE YOUR BIKE</h1>
        <img src="img/ads/bike.png" class="bikepic" alt="">
        <h1 class="biketxt">A NEW STYLE FOR <br> THE ROAD</h1>
        <img src="img/ads/gifbike.gif" class="bikegif" alt="">`
    },
    {
        id: 508,
        all: `<img src="img/ads/AFTER DINNER-GOINGOUT/img-beer.png" alt="" class="onbottom">
        <div class="bringup ontop leftalign bigtext topleft">
            <img src="img/ads/AFTER DINNER-GOINGOUT/gif-title.gif" alt="title" class="moveleft">
            <h1 class="bringupmore normalweight">FRESH, LIGHT, CLASSIC</h1>
        </div>
        <img src="img/ads/AFTER DINNER-GOINGOUT/gif-trynow.gif" alt="title" class="absolute bottomright-margin thirdsize">`
    },
    {
        id: 509,
        all: `<img src="img/ads/DINNER-FASTFOOD/img-fastfood.png" alt="" class="onbottom">
            <h1 class="black centrealign bigtext">NOODLEZ EXPRESS<h1>
            <img src="img/ads/DINNER-FASTFOOD/gif-promo.gif" alt="promo" class="thirdsize">
            <img src="img/ads/DINNER-FASTFOOD/gif-order.gif" alt="order" class="thirdsize blockdisplay bringup">`
    },
    {
        id: 510,
        all: `<h1 class="white centrealign notasbigtext topmargin">QUICKLY REMOVE YOURSELF FROM THE WORLD<h1>
            <div class="leftalign">
            <img src="img/ads/MUSIC-DONTLISTEN/gif-promo.gif" alt="promo" class="halfsize marginleft margintop">
            </div>
            <img src="img/ads/MUSIC-DONTLISTEN/img-dontlist.png" alt="nolistening" class="bottomright ninetypercentsize onbottom">`
    },
    {
        id: 511,
        all: `<h1 class="white centrealign bigtext topmargin textstroke">SPOTIFY<h1>
            <div class="leftalign">
                <h1 class="boxedtext notasbigtext normalweight marginleft">GET A MONTH MEMBERSHIP FREE!!!</h1>
                <img src="img/ads/MUSIC-SPOTIFY/gif-title.gif" alt="order" class="moveleftmore halfsize blockdisplay">
                <img src="img/ads/MUSIC-SPOTIFY/img-spotify.png" alt="spotify" class="bottomright-margin halfsize onbottom">`
    },
    {
        id: 512,
        all: `<img src="img/ads/breakfast_popup.gif" alt="">
`
    },
    {
        id: 513,
        all: `<img src="img/ads/boujeecafe_popup.gif" alt="">`
    },
    {
        id: 514,
        all: `<img src="img/ads/walking_popup.gif" alt="">`
    },
    {
        id: 515,
        all: `<img src="img/ads/makefood_popup.gif" alt="">`
    },
    {
        id: 516,
        all: `<img src="img/ads/gym_gear_popup.gif" alt="">`
    },
    {
        id: 517,
        all: `<img src="img/ads/mobile_games_Popup.gif" alt="">`
    },
    {
        id: 518,
        all: `<img src="img/ads/nightout_popup.gif" alt="">`
    },
    {
        id: 519,
        all: `<img src="img/ads/needpillow_popup.gif" alt="">`
    },
    {
        id: 520,
        all: `<img src="img/ads/morepillows_popup.gif" alt="">`
    },
    {
        id: 521,
        all: `<img src="img/ads/dinner_popup.gif" alt="">`
    },
    {
        id: 522,
        all: `<img src="img/ads/gym_fitness_popup.gif" alt="">`
    },
    {
        id: 523,
        all: `<img src="img/ads/breakfasthome_Popup.gif" alt="">`
    },
]
