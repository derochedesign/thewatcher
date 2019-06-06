const startBtn = document.getElementById("startAll");
const theMain = document.getElementById("theMain");
const timeline = document.getElementById("timelineNodes");
const btnAud = document.getElementById("effectAudio");
let root = document.documentElement;
let allQuestions;
let questionsDom;
let stepInfo;

$("#makeFull").click(function() {
  if (screenfull.enabled) {
  screenfull.request();
  }
  $("#makeFull").hide();
  document.getElementById("introVid").play();
});

let ecScale;
let frugScale;
let healthScale;
let ageScale;
let allTraits;

let pos = 0;
let audPos = 0;

//init metrics
let metrics = {
    frugality: 0,     //1
    health: 0,        //2
    environment: 0,   //3
    personality: [],  //4
    age: []    //5
}

const voiceAudio = ["intro","ques","analyze","complete","existing","final"];

$.getJSON('data/questions.json', function(result) {
    
  //clone array
  allQuestions = result.questions.splice(0);
  console.log(allQuestions);
});

startBtn.addEventListener("click", _ => {
  //change section to main, and clear html
  theMain.innerHTML = "";
  theMain.className = "main";
  
  theMain.innerHTML = splashPage();
  handleSounds(0, false);
  document.getElementById("splashVid").play();
  document.getElementById("splashVid").onended = _ => {
    document.getElementById("walkToStart").style.display = "grid";
    checkWalking(1, ready);
  };
  
  
});

document.addEventListener("click", e => {
  if (e.target.matches(".button")) {
    btnAud.play();
  }
  if (e.target.matches("#viewResults")) {
    giveResults();
  }
  if (e.target.matches("#walkBtn")) {
    
  }
})

const handleSounds = (sPos, q) => {
  const a1 = document.getElementById("voiceAudio");
  
  if (q) {
    a1.setAttribute("src", `sounds/voice/${voiceAudio[sPos]}${pos+1}.mp3`);
  }
  else {
    a1.setAttribute("src", `sounds/voice/${voiceAudio[sPos]}.mp3`);
  }
  
  a1.play();
  if (!q) {
    audPos++;
  }
  
}

const checkWalking = (steps, func) => {
    //on walk
    let stepPos = 0;
    let prevStep;
  
    const stepLoop = setInterval(animsx, 800);
  
    function animsx() {
      $.getJSON('data/stepping.json', function(result) { 
        
        stepInfo = result.step;
        console.log(stepInfo);
        
        if (prevStep != stepInfo) {
          
          if (stepInfo == "right") {
            stepPos++;
            if (func == showComplete) {
              console.log("esketit");
              
              root.style.setProperty('--prog-prog', `${(100/steps)*stepPos}%`);
            }
          }
          if (stepPos == steps) {
            console.log(stepPos);
            
            setTimeout(_ => {
              func.call();
              clearInterval(stepLoop);
            },500);
            
          }
          
        }
        console.log("skipping");
        prevStep = stepInfo;
        
      });
    }
}

const generateQuestion = _ => {
  questionsDom.innerHTML = QuestionTemplate(allQuestions[pos]);
  addTimeline();
}

const addTimeline = _ => {
  const markArr = [...timeline.children];
  console.log(markArr);
  
  markArr[pos].className = "active";
}

const ready = _ => {
    const questionCount = allQuestions.length;
    //create html
    // allQuestions.map(question => 
    //     questionsDom.innerHTML += QuestionTemplate(question));
    
    theMain.innerHTML = mainPage();
    questionsDom = document.getElementById("questionHold");
    generateQuestion();
    handleSounds(1, true);   
    //listen for buttons, get the questions id, and the buttons id
    questionsDom.addEventListener("click", e => {

        if (!e.target.matches("button")) return;
        
        pos++;
        equateMetrics(e.target.dataset.id, e.target.parentElement.dataset.id, allQuestions);
        handleSounds(1, true);
        (pos == questionCount) ? giveAnalyze() : generateQuestion();
        
    });
}

const QuestionTemplate = props => {
    
    let answers = "";
    props.answers.map(answer => 
        answers += `<button data-id="${answer.id}" type="button" class="button answer">${answer.label}</button>`);
    
    return (
        `
        <div class="backdrop"></div>
        <h2 data-id="${props.id}">${props.question}</h2>
        ${(props.sub) ? `<h6>${props.sub}</h6>` : ''}
        <section data-id="${props.id}" class="answers">
          ${answers}
        </section>
        `
    )
}

const giveAnalyze = () => {
  theMain.innerHTML = "";
  theMain.className = "results";
  
  theMain.innerHTML = analyzePage();
  handleSounds(2, false);
  checkWalking(6, showComplete);
}

const showComplete = _ => {
  document.getElementById('completeOverlay').style.display = "grid";
  handleSounds(3, false);
}

const giveResults = () => {
  theMain.innerHTML = "";
  theMain.className = "results";
  handleSounds(4, false);
  
  theMain.innerHTML = resultsPage();
  
  ecScale = document.getElementById("ecScale");
  frugScale = document.getElementById("frugScale");
  healthScale = document.getElementById("healthScale");
  ageScale = document.getElementById("ageScale");
  allTraits = document.getElementById("topTraits");
  
  const restartBtn = document.getElementById("restartAll");
  restartBtn.addEventListener("click", e => {
    postUpdate(0,0);
    handleSounds(5, false);
    setTimeout( _ => {
      location.reload(true);
    },2000);
    
  });
  
  createProfile(metrics);
  
}

const equateMetrics = (bId, qId, allQ) => {
    //get current question and answer
    let currQ = allQ.filter(q => q.id == qId)[0];
    let ans = currQ.answers.filter(a => a.id == bId)[0];
    
    postUpdate(ans.ad, pos);
    
    // let tempMetrics = Object.assign({}, metrics); //doesn't clone obj arr's
    console.log(`health: ${ans.health}`);
    console.log(`frug: ${ans.frugality}`);
    console.log(`ec: ${ans.environment}`);
    
    //apply metric changes !! we need to figure out a good way to do the scales, rather than just add/subtract
    (ans.frugality) && (metrics.frugality += ans.frugality);
    (ans.health) && (metrics.health += ans.health);
    (ans.environment) && (metrics.environment += ans.environment);
    
    (ans.personality) && (ans.personality.map(trait => metrics.personality.push(trait)));
    (ans.age) && (ans.age.map(age => metrics.age.push(age)));
    
    console.log(metrics); 
    
}

const createProfile = finalMetrics => {
    //put metrics 1,2,3 on a scale -5 to 5
    //count instances for each keyword in metrics 4 and 5
    
    //know the max possible negative and positive for each segment
    //then take the users number and gets its position relative to that scale, then put it on the -5 to 5 scale
    
    //define the possible max for each metric
    const endpoints = {
       new: 5,
       frugality: 8.5, //pos
       health: 8.5, //neg; 5.5 pos
       environment: 5.5 //pos
    };
    
    //get the modifiers to transfer from their specific scale to a 5 scale
    const modifiers = {
        frugality: endpoints.frugality / endpoints.new,
        health: endpoints.health / endpoints.new,
        environment: endpoints.environment / endpoints.new
    }
    
    //place on 5 scale (finalMetrics holds the score for each metric)
    const newScale = {
        frugality: finalMetrics.frugality/modifiers.frugality,     //1
        health: finalMetrics.health/modifiers.health,        //2
        environment: finalMetrics.environment/modifiers.environment   //3
    }
    
    const personalityTraits = countKeywords(finalMetrics.personality);
    const ageDefine = countKeywords(finalMetrics.age);
    
    console.log(`Frugality: (-5) ${newScale.frugality} (5), Health: (-5) ${newScale.health} (5), Environment: (-5) ${newScale.environment} (5)`);
    console.log(`Personality Traits:`,personalityTraits, `Counting Age: `, ageDefine);
    
    buildScale(newScale.environment, ecScale);
    buildScale(newScale.frugality, frugScale);
    buildScale(newScale.health, healthScale);
    
    allTraits.innerHTML = buildTraits(personalityTraits);
    
    let middle = false;
    
    ageDefine.map (aAge => {
      ageDefine.map( age => {
        if (aAge.keyword != age.keyword) {
          if (age.count >= aAge.count-2 && age.count <= aAge.count+2) {
            //middle
            middle = true;
          }
        }
      });
    });
    
    
    const res = Math.max.apply(Math, ageDefine.map(function(o) { return o.count; }));
    let ageObj = ageDefine.find(function(o){ return o.count == res; });
    (middle) ? ageScale.innerHTML = "Middle Aged" : ageScale.innerHTML = ageObj.keyword;
    
}

const buildTraits = traits => {
  let dom = ``;
  
  const topArr = [];
  
  traits.map (trait => {
    if (trait.count >= 3) {
      topArr.push(trait);
      dom += `<div class="tag"><h2>${trait.keyword}</h2></div>`;
    }
  });
  
  return (
    `${dom}`
  )
}

const buildScale = (val, elem) => {
  let mod;
  (val > 0) ? mod = 1 : mod = -1;
  (val > 0) ? elem.classList.add("positive") : elem.classList.add("negative");
  
  let flatVal = Math.round(val);
  let half = false;
  
  console.log(`flatVal: ${flatVal} ; val: ${val}`);
  
  let remainder = val-flatVal;
  remainder = Math.abs(remainder);
  console.log(`remainder: ${remainder}`);
  
  if (remainder > 0.25 && remainder < 0.75) {
    //add half at end
    half = true;
  }
  flatVal = Math.abs(flatVal);
  
  if (flatVal > Math.abs(val) && half) { //round up
    for (let i = 0; i < flatVal; i++) {
      elem.querySelector(`[data-val='${(i+1) * mod}']`).classList.add("active");
      console.log("rUp for" + i);
      
    }
    elem.querySelector(`[data-val='${(flatVal) * mod}']`).classList.add("half");
  }
  else if (half) {
    //rd + h
    for (let i = 0; i < flatVal+1; i++) {
      elem.querySelector(`[data-val='${(i+1) * mod}']`).classList.add("active");
    }
    elem.querySelector(`[data-val='${(flatVal+1) * mod}']`).classList.add("half");
  }
  else {
    //rd
    for (let i = 0; i < flatVal; i++) {
      elem.querySelector(`[data-val='${(i+1) * mod}']`).classList.add("active");
      console.log("rDn for" + i);
    }
  }
  
  
}

const countKeywords = words => {
    
    let keyCounts = [];
    let counted = [];
    
    words.map(word => {
        //check if already counted
        let duplicates = counted.filter(countedWord => countedWord == word);
        if (duplicates.length == 0) {
            
            let c = 0;
            words.filter(keyword => (
                (word == keyword) && (c++)
            ));
            
            keyCounts.push({keyword: word,count: c});
            counted.push(word);
        }
    });
    return keyCounts;
}

function postUpdate(adID, p) {
    var adata = {popups:{pos:p,lastAnswer: {adID: adID}},city: {pos:p},pov: {pos:p}};
    
    $.ajax({
      type: 'POST',
      url: '/update',
      data: adata,
      success: function(data){
        //do something with the data via front-end framework
        console.log("lets do it");

      }
    }); //close ajax
}

const mainPage = props => {
  return (
  `
      <div id="questionHold" class="banner">
        
      </div>
      
      <div class="dude">
        <img src="img/art/person.png">
      </div>
  `)
}

const splashPage = props => {
  return (
    `<section class="splash">
    <video id="splashVid" mute>
      <source src="img/art/splash.mp4" type="video/mp4"></source>
    </video>
      <div id="walkToStart" class="walktostart">
        <img src="img/art/stepping.gif">
        <h2>Walk To Start</h2>
      </div>
    </section>`
  )
}

const analyzePage = props => {
  return (
      `
      <section class="analyze">
        <div id="completeOverlay" class="complete-overlay">
          <div>
            <h1>TRANSFER COMPLETE</h1>
            <button id="viewResults" type="button" class="button">View My Results</button>
          </div>
        </div>
        <div class="anal-dude">
          <video mute autoplay="autoplay" loop>
            <source src="img/art/analyze.mp4" type="video/mp4"></source>
          </video>
        </div>
        <div class="anal-info">
          <h1>WALK TO GENERATE ENERGY</h1>
          <div class="prog-bar">
            <div class="inner-bar">
            </div>
          </div>
          <h3>Analyzing...</h3>
        </div>
      </section>
      `
  )
}

const resultsPage = props => {
    return (
        `
        <section class="results">
      
        <div class="dude">
          <img src="img/art/person.png">
          <img class="double-dude" src="img/art/person_over.png">
          
          <div class="scale one">
            <h3>Environmental Conciousness</h3>
            <div class="range">
                <div id="ecScale" class="markers">
                  <div data-val="-5"></div>
                  <div data-val="-4"></div>
                  <div data-val="-3"></div>
                  <div data-val="-2"></div>
                  <div data-val="-1"></div>
                  <div data-val="1"></div>
                  <div data-val="2"></div>
                  <div data-val="3"></div>
                  <div data-val="4"></div>
                  <div data-val="5"></div>
                </div>
                <div class="label">
                  <h4>|</h4>
                  <h4>0</h4>
                </div>
              </div>
          </div>
          
          <div class="scale two">
            <h3>Frugality</h3>
            <div class="range">
              <div id="frugScale" class="markers">
                <div data-val="-5"></div>
                <div data-val="-4"></div>
                <div data-val="-3"></div>
                <div data-val="-2"></div>
                <div data-val="-1"></div>
                <div data-val="1"></div>
                <div data-val="2"></div>
                <div data-val="3"></div>
                <div data-val="4"></div>
                <div data-val="5"></div>
              </div>
              <div class="label">
                <h4>|</h4>
                <h4>0</h4>
              </div>
            </div>
          </div>
          
          <div class="scale three">
            <h3>Health/Fitness</h3>
            <div class="range">
              <div id="healthScale" class="markers">
                <div data-val="-5"></div>
                <div data-val="-4"></div>
                <div data-val="-3"></div>
                <div data-val="-2"></div>
                <div data-val="-1"></div>
                <div data-val="1"></div>
                <div data-val="2"></div>
                <div data-val="3"></div>
                <div data-val="4"></div>
                <div data-val="5"></div>
              </div>
              <div class="label">
                <h4>|</h4>
                <h4>0</h4>
              </div>
            </div>
          </div>
          
          <div class="scale four">
            <h3>Age Range</h3>
            <h3 id="ageScale" class="colourtxt"></h3>
          </div>
          
        </div>
        
        <section class="youare">
          <h2>Your traits...</h2>
          
          <div id="topTraits" class="traits">
            <div class="tag"><h2>Something</h2></div>
          </div>
          
        </section>
        <button id="restartAll" class="button large restart" type="button">Restart</button>
        
      </section>
        `
    )
}