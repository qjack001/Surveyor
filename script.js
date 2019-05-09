var data = '{"question":[{"title": "q1","description": "dkfj","type": "checkbox","options":["df","df","df"]},{"title": "q2","description": "dkfj","type": "checkbox","options":["df","df","df"]},{"title": "q3","description": "dkfj","type": "checkbox","options":["df","df","df"]},{"title": "q4","description": "dkfj","type": "checkbox","options":["df","df","df"]},{"title": "q5","description": "dkfj","type": "checkbox","options":["df","df","df"]}]}';
var current = 0;
var question = [];
var progressBar = [
    document.getElementById("progress-bar"),
    document.getElementById("progress-bar-percent")
];

importQuestions(data)

/**
 *  Parses the data to build the questions
 */
function importQuestions(input)
{
    var obj = JSON.parse(input);
    
    for(let i = 0; i < obj.question.length; i++)
    {
        buildQuestion(obj.question[i], i);
    }
}

function buildQuestion(dataIn, index)
{
    var questionElement = document.createElement("DIV");
    questionElement.id = "Q" + index;
    
    if(index == 0)
    {
        questionElement.className = "selected";
    }
    else if(index == 1)
    {
        questionElement.className = "next";
    }
    else
    {
        questionElement.className = "question";
    }
    
    var titleElement = document.createElement("H1");
    var titleTxt = document.createTextNode(dataIn.title);
    titleElement.appendChild(titleTxt);
    questionElement.appendChild(titleElement);
    
    var descElement = document.createElement("P");
    var descTxt = document.createTextNode(dataIn.description);
    descElement.appendChild(descTxt);
    questionElement.appendChild(descElement);
    
    document.getElementById("content").appendChild(questionElement);
    question.push(questionElement);
    
    
    
}

/**
 *  Transitions to the next question
 */
function nextQuestion()
{
    current += 1;
    
    if(current >= 0 && current < question.length)
    {
        relabelQuestions();
    }
    else
    {
        current -= 1; //undo last action if out of range
    }
}

/**
 *  Transitions to the previous question
 */
function previousQuestion()
{
    current -= 1;
    
    if(current >= 0 && current < question.length)
    {
        relabelQuestions();
    }
    else
    {
        current += 1; //undo last action if out of range
    }
}

/**
 *  Re-labels all questions as .questions (hiding them).
 *  The current and next/prev questions are set accordingly.
 */
function relabelQuestions()
{
    progressBar[0].style.width = ((current / question.length) * 100) + "%";
    progressBar[1].innerHTML = ((current / question.length) * 100) + "%";
    
    if(current == 0)
    {
        document.getElementById("back-btn").className = "hidden";
    }
    else
    {
        document.getElementById("back-btn").className = "";
    }
    
    for(let i = 0; i < question.length; i++)
    {        
        if(i == current)
        {
            question[i].className = "selected";
        }
        else if(i == (current - 1))
        {
            question[i].className = "prev";
        }
        else if(i == (current + 1))
        {
            question[i].className = "next";
        }
        else
        {
            question[i].className = "question";
        }
    }
}