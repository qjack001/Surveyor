var data = '{"question":[{"title": "What do you choose?","description": "Select all that apply.","type": "checkbox","options":["Option 1","Option 2","Option 3"]},{"title": "Which part of Economics does your busness struggle with?","description": "Select all that apply.","type": "checkbox","options":["We have no problems. Are books are clean, we have lots of cash, and we get everything sent in on time.","Budgeting","Book keeping","Payables","Receivables","Cashflow","Payroll","Insurance","Legal","Taxes"]},{"title": "Name","description": "dkfj","type": "short answer","format":"name"},{"title": "q4","description": "dkfj","type": "checkbox","options":["df","df","df"]},{"title": "q5","description": "dkfj","type": "checkbox","options":["df","df","df"]}]}';
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

/**
 *  Builds the html question element
 */
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
    
    var userInput;
    
    if(dataIn.type == "checkbox")
    {
        userInput = getCheckboxes(dataIn.options);
    }
    else if(dataIn.type == "short answer")
    {
        userInput = getShortAnswer(dataIn.format);
    }
    else
    {
        userInput = document.createElement("P");
    }
    
    questionElement.appendChild(userInput);
    
    document.getElementById("content").appendChild(questionElement);
    question.push(questionElement);
}

function getCheckboxes(options)
{
    var output = document.createElement("UL");
    var option = [];
    
    for(let i = 0; i < options.length; i++)
    {
        option.push(document.createElement("LI"));
        option[i].appendChild(document.createTextNode(options[i]));
        option[i].onclick = function() { this.classList.toggle('clicked') };
        output.appendChild(option[i]);
    }
    
    return output;
}

function getShortAnswer(format)
{
    var output = document.createElement("h5");
    output.contentEditable = true;
    return output;
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