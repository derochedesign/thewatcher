const startBtn = document.getElementById("startAll");
const theMain = document.getElementById("theMain");
const timeline = document.getElementById("timelineNodes");
let allQuestions;
let questionsDom;
let stepInfo;

$("#makeFull").click(function() {
  if (screenfull.enabled) {
  screenfull.request();
  }
  $("#makeFull").hide();
});

let ecScale;
let frugScale;
let healthScale;
let ageScale;
let allTraits;

let pos = 0;

//init metrics
let metrics = {
    frugality: 0,     //1
    health: 0,        //2
    environment: 0,   //3
    personality: [],  //4
    age: []    //5
}

const myLoop = setInterval(anims, 300);

function anims() {
    
  $.getJSON('data/stepping.json', function(result) {   
      //clone array
      stepInfo = result.step;
      console.log(stepInfo);
      
  });
}

$.getJSON('data/questions.json', function(result) {
    
  //clone array
  allQuestions = result.questions.splice(0);
  console.log(allQuestions);
      
});

startBtn.addEventListener("click", _ => {
  //change section to main, and clear html
  theMain.innerHTML = "";
  theMain.className = "main";
  
  // questions();
  splashScreen();
  
});

const splashScreen = _ => {
  
  theMain.innerHTML = splashPage();
  
  //on walk
  let stepPos = 0;
  
  const stepLoop = setInterval(animsx, 300);

  function animsx() {
    if (stepInfo == "right") {
      stepPos++;
    }
    if (stepPos == 3) {
      walking = true;
      console.log(stepPos);
      
      setTimeout(_ => {
        ready();
        clearInterval(stepLoop);
      },500);
      
    }
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
        
    //listen for buttons, get the questions id, and the buttons id
    questionsDom.addEventListener("click", e => {

        if (!e.target.matches("button")) return;
        
        pos++;
        equateMetrics(e.target.dataset.id, e.target.parentElement.dataset.id, allQuestions);
        
        
        (pos == questionCount) ? giveResults() : generateQuestion();
        
    });
    
    //temp submit buttom
    
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

const giveResults = () => {
  theMain.innerHTML = "";
  theMain.className = "results";
  
  theMain.innerHTML = resultsPage();
  
  ecScale = document.getElementById("ecScale");
  frugScale = document.getElementById("frugScale");
  healthScale = document.getElementById("healthScale");
  ageScale = document.getElementById("ageScale");
  allTraits = document.getElementById("topTraits");
  
  const restartBtn = document.getElementById("restartAll");
  restartBtn.addEventListener("click", e => {
    postUpdate(0,0);
    
    setTimeout( _ => {
      location.reload(true);
    },300);
    
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
    
    ecScale.innerHTML = buildScale(newScale.environment, ecScale);
    frugScale.innerHTML = buildScale(newScale.frugality, frugScale);
    healthScale.innerHTML = buildScale(newScale.health, healthScale);
    
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
  (val > 0) ? elem.classList.add("positive") : elem.classList.add("negative");
  console.log(val > 0);
  
  let flatVal = Math.round(val);
  let half = false;
  let dom = ``;
  
  console.log(`flatVal: ${flatVal} ; val: ${val}`);
  
  
  let remainder = val-flatVal;
  (remainder < 0) && (remainder = remainder * -1);
  console.log(`remainder: ${remainder}`);
  
  if (remainder > 0.3 && remainder < 0.7) {
    //add half at end
    half = true;
  }
  (flatVal < 0) && (flatVal = flatVal * -1);
  if (flatVal > val && half) { //round up
    for (let i = 0; i < flatVal-1; i++) {
      dom += `<div></div>`;
    }
  }
  else {
    for (let i = 0; i < flatVal; i++) {
      dom += `<div></div>`;
    }
  }
  
  return (
    `
    ${dom}
    ${(half) ? `<div class="half"></div>` : ""}
    `
  )
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
      <h2>Imagine an ordinary day in your life, and answer as such.</h2>
      <div class="walktostart">
        <img src="img/art/stepping.gif">
        <h2>Walk To Start</h2>
      </div>
    </section>`
  )
}

const resultsPage = props => {
    return (
        `
        <section class="results">
      
        <div class="dude">
          <img src="img/art/person.png">
          
          <div class="scale one">
            <h3>Environmental Conciousness</h3>
            <div class="range">
                <div id="ecScale" class="markers">
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