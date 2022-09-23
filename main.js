//Select element

let countSpan = document.querySelector(".count span");
let bulletspan = document.querySelector(".spans");
let quizarea = document.querySelector(".quiz-area");
let answerarea = document.querySelector(".answers-area");
let submitbutton = document.querySelector(".submit-button");
let bulletsElement = document.querySelector(".bullets");
let resultcontainer = document.querySelector(".results")
let contdownelement = document.querySelector(".countdown")

//set Options
let currentindex = 0;
let theRightAnswers = 0;
let countdownintervel;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionopject = JSON.parse(this.responseText);
            createBullest(questionopject.length);
            addquestionsdata(questionopject[currentindex], questionopject.length);

            //count down befor onclick to run with page onlaod
            Countdown(3, questionopject.length);

            //right answer on click
            submitbutton.onclick = () => {
                let rightanswer = questionopject[currentindex].right_answer;
                currentindex++;

                //check from teh correct answer
                checkAnswer(rightanswer, questionopject.length);


                //Add New Question
                quizarea.innerHTML = "";
                answerarea.innerHTML = "";
                addquestionsdata(questionopject[currentindex], questionopject.length);

                //add handle bullets
                handleBullets();
                //count down
                clearInterval(countdownintervel);
                Countdown(3, questionopject.length);

                //show 
                shwoResults(questionopject.length);



            }
        }
    };
    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getQuestions();


function createBullest(num) {
    countSpan.innerHTML = num;
    //Create Span to bullets
    for (let i = 0; i < num; i++) {
        let bullets = document.createElement("span");

        if (i === 0) {
            bullets.className = "on";
        }
        bulletspan.appendChild(bullets);
    }
}


function addquestionsdata(obj, count) {

    if (currentindex < count) {

        //create quasion
        let questiontitle = document.createElement("h2");
        let questiontext = document.createTextNode(obj['title']);
        questiontitle.appendChild(questiontext);

        quizarea.appendChild(questiontitle);


        //create the choices
        for (let i = 1; i <= 4; i++) {
            let maindiv = document.createElement("div");
            maindiv.className = 'answer';
            let radioinput = document.createElement("input");

            radioinput.name = 'question';
            radioinput.type = 'radio';
            radioinput.id = `answer_${i}`;
            radioinput.dataset.answer = obj[`answer_${i}`];

            //if you need to select already the first choice
            // if (i === 1) {
            //     radioinput.checked = true;
            // }

            let thlabel = document.createElement("label");
            thlabel.htmlFor = `answer_${i}`;
            let thelabeltext = document.createTextNode(obj[`answer_${i}`]);
            thlabel.appendChild(thelabeltext);
            maindiv.appendChild(radioinput);
            maindiv.appendChild(thlabel);


            //add the main div input and radio to the div answerarea
            answerarea.appendChild(maindiv);
        }

    }
}


function checkAnswer(ranswer, count) {
    let answers = document.getElementsByName("question");
    let thechooseanswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            thechooseanswer = answers[i].dataset.answer;
        }
    }
    // console.log(ranswer);
    // console.log(thechooseanswer);
    if (ranswer === thechooseanswer) {
        theRightAnswers++;
        console.log("good answers you get it")
    }
}

function handleBullets() {
    let bulletallspans = document.querySelectorAll(".bullets .spans span");
    let arrayofSpans = Array.from(bulletallspans);
    arrayofSpans.forEach((span, index) => {
        if (currentindex === index) {
            span.className = 'on';
        }
    })
}

function shwoResults(count) {
    let theResults;

    if (currentindex === count) {
        quizarea.remove();
        answerarea.remove();
        submitbutton.remove();
        bulletsElement.remove();

        if (theRightAnswers > count / 2 && theRightAnswers < count) {
            theResults = `<span class="good">Good</span>,${theRightAnswers} From ${count}`;
        } else if (theRightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>,All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>,${theRightAnswers} From ${count}`;
        }
        resultcontainer.innerHTML = theResults;
        resultcontainer.style.padding = "10px";
        resultcontainer.style.backgroundColor = "white";
        resultcontainer.style.marginTop = "10px";
    }
}


function Countdown(duration, count) {
    if (currentindex <= count) {
        let minutes, seconds;
        countdownintervel = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            contdownelement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownintervel);
                submitbutton.click();
            }
        }, 1000);
    }
}