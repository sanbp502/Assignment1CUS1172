
//make intro view model and show to user
$(document).ready(function () {
  var src = $('#intro_view').html();
  var model = Handlebars.compile(src);
  var html = model(Quizzes);
  $('#widget_view').html(html);
});

//handle app widget event
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#widget_view").onclick = (e) => {
    handle_event(e);
  };
})

function handle_event(e) {
  if (e.target.offsetParent.id == "quizzes") {
    // if choice is a quiz button gets info from button id and calls api function
    getData(e.target.id);
  } else if (parseInt(e.target.id) >= 0) {
    // registers choice and changes color to show selection
    if (choice >= 0) {
      document.getElementById(choice).style.backgroundColor = "orange";
    }
    choice = e.target.id;
    document.getElementById(choice).style.backgroundColor = "yellow";
  } else if (e.target.id == "submit") {
    // if clicking submit button
    if (choice >= 0) {
      // check choice and reset
      checkAnswer(choice);
      choice = -1;
    } else {
      // prompt to choose an option
      alert("Please choose an answer");
    }
  } else if (e.target.id == "listSubmit") {
    // if the list submit button was clicked
    let value = document.querySelector("#options").value;
    if (value >= 0) {
      // check answer
      checkAnswer(value);
    } else {
      // prompt to choose an option
      alert("Please choose an answer");
    }
  } else if (e.target.id == "got_it") {
    // if the "Got it" button was clicked
    renderPage();
  } else if (e.target.id == "home_view") {
    // if going home
    let src = document.querySelector("#intro_view").innerHTML;
    let model = Handlebars.compile(src);
    let html = model(Quizzes);
    document.querySelector("#widget_view").innerHTML = html;
  }
}


//fetch data
let getData = async (quiz) => {
  try {
    const response = await fetch(`https://my-json-server.typicode.com/sanbp502/Quiz_DB/${quiz}`);
    const results = await response.json();
    qArray = results;

    //make model after getting info
    let src = document.querySelector('#quiz_view').innerHTML;
    let model = Handlebars.compile(src);
    //start json object
    quizQuestions['name'] = quiz;
    quizQuestions['currentQuestion'] = 1;
    quizQuestions['totalQuestions'] = totalCount(qArray);
    quizQuestions['correctResponses'] = 0;
    let html = model(quizQuestions);
    document.querySelector("#widget_view").innerHTML = html;

    view_question();
  } catch (error) {
    console.error(error);
  }
}

let Quizzes = { //keep track of quiz
  "Quiz": [
    { "quiz_choice": "Start" }
  ]
}

let quizQuestions = { //keep track of results
  "name": "",
  "currentQuestion": 0,
  "totalQuestions": 0,
  "correctResponses": 0
}

function getName(){
  return false;
}

//initialize default variables
let choice = -1;
let qChoice;
let qArray = [];

//get questions
let view_question = () => {
  let typeRandom = Math.floor(Math.random() * qArray.length);
  let chosenType = qArray[typeRandom][Object.keys(qArray[typeRandom])];
  let questionRandom = Math.floor(Math.random() * chosenType.length);
  qChoice = chosenType[questionRandom];

  let src = document.querySelector(`#${Object.keys(qArray[typeRandom])}`).innerHTML;
  let model = Handlebars.compile(src);
  let html = model(qChoice);
  document.querySelector("#quizQuestions").innerHTML = html;

  delete chosenType[questionRandom];
  chosenType.sort();
  chosenType.pop();

  if (chosenType.length == 0) {
    delete qArray[typeRandom];
    qArray.sort();
    qArray.pop();
  }
}

// Count questions
function totalCount(jsonObject) {
  let count = 0;
  for (const value of Object.values(jsonObject)) {
    for (const innerValue of Object.values(value)) {
      count += innerValue.length;
    }
  }
  return count;
}

// render page
const renderPage = function () {
  let src;
  let model;

  if (qArray.length > 0) {

    src = document.querySelector('#quiz_view').innerHTML;

    quizQuestions.currentQuestion += 1;
  } else {
    // Display result model
    src = document.querySelector('#result_view').innerHTML;
    let percentage = (quizQuestions.correctResponses / quizQuestions.totalQuestions) * 100;
    quizQuestions.percentage = percentage;
  }

  model = Handlebars.compile(src);
  let html = model(quizQuestions);
  document.querySelector('#widget_view').innerHTML = html;

  if (qArray.length > 0) {
    view_question();

    let isEmpty = true;
    for (let i = 0; i < qArray.length; i++) {
      if (Object.values(qArray[i])[0].length > 0) {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) {
      qArray.shift();
    }
  }
}


// checkAnswer 
function checkAnswer(number) {

  let correctAnswer;
  if (qChoice['Answer'] != number) {
    if ('Choices' in qChoice) {
      correctAnswer = qChoice['Choices'];
      correctAnswer = correctAnswer[qChoice['Answer']];
      correctAnswer = correctAnswer['Answer'];
    }
    else if (qChoice['Answer'] == 0) {
      correctAnswer = 'True';
    }
    else if (qChoice['Answer'] == 1) {
      correctAnswer = 'False';
    }
    qChoice.CorrectAnswer = correctAnswer;
  }
  else {
    quizQuestions['correctResponses'] = quizQuestions['correctResponses'] + 1;
    setTimeout(() => { renderPage(); }, 1000);
  }

  let src = document.querySelector('#feedback').innerHTML;
  let model = Handlebars.compile(src);
  let html = model(qChoice);
  document.querySelector(".Background").style.width = "100%";
  document.querySelector("#response").innerHTML = html;
}