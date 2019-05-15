var data = '{"question":[{"title": "What do you choose?","description": "Select all that apply.","type": "checkbox","options":["Option 1","Option 2","Option 3"]},{"title": "Rate how nice you smell.","description": "1 being the least, 5 the most.","type": "scale","amount":5},{"title": "What\'s your email?","description": "So we can get in touch.","type": "text","format":"email"}]}';
var current = 0;
var question = [];
var answer = [];
var progressBar = [
    document.getElementById("progress-bar"),
    document.getElementById("progress-bar-percent")
];

importQuestions()

/**
 *  Parses the data to build the questions
 */
function importQuestions()
{
    var obj = JSON.parse(data);
    
    for(let i = 0; i < obj.question.length; i++)
    {
        buildQuestion(obj.question[i], i);
    }
}

function submit()
{
    var responseOut = {};
    var obj = JSON.parse(data);
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var unique = "" + Math.floor(Math.random() * 1000)
    
    for(let i = 0; i < answer.length; i++)
    {
        let answerOut = [];
        answer[i].forEach(v => answerOut.push(v));
        
        if(answerOut.length == 1)
        {
            responseOut[obj.question[i].title.replace(/\.|\?|\#|\$|\[|\]|\//, "")] = answerOut[0];
        }
        else
        {
            responseOut[obj.question[i].title.replace(/\.|\?|\#|\$|\[|\]|\//, "")] = answerOut;
        }
        
    }
    
    var firebaseConfig = 
    {
        //enter config data here
    };
    
    firebase.initializeApp(firebaseConfig);
    
    var database = firebase.database();
    firebase.database().ref(yyyy + "-" + mm + "-" + dd + "/" + unique).set(
    {
        response: responseOut
    });
    
    
    progressBar[0].style.width = 100 + "%";
    progressBar[1].style.display = "none";
    document.getElementById("back-btn").className = "hidden";
    question[current - 1].className = "prev";
    
    var end = document.createElement("DIV");
    end.className = "popup";
    end.appendChild(document.createElement("P").appendChild(document.createTextNode("Thank you, your response has been submitted.")));
    document.getElementById("content").appendChild(end);
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
        userInput = getCheckboxes(dataIn.options, index);
    }
    else if(dataIn.type == "text")
    {
        userInput = getShortAnswer(dataIn.format, index);
    }
    else if(dataIn.type == "scale")
    {
        userInput = getScale(dataIn.amount, index);
    }
    else
    {
        userInput = document.createElement("P");
    }
    
    questionElement.appendChild(userInput);
    
    document.getElementById("content").appendChild(questionElement);
    question.push(questionElement);
    answer.push(new Set());
}

function getCheckboxes(options, index)
{
    var output = document.createElement("UL");
    var option = [];
    
    for(let i = 0; i < options.length; i++)
    {
        option.push(document.createElement("LI"));
        option[i].appendChild(document.createTextNode(options[i]));
        option[i].onclick = function() 
        {
            this.classList.toggle('clicked');
            if(answer[index].has(this.innerHTML))
            {
                answer[index].delete(this.innerHTML);
            }
            else
            {
                answer[index].add(this.innerHTML);
            }
            
            
        };
        output.appendChild(option[i]);
    }
    
    return output;
}

function getShortAnswer(format, index)
{
    var output = document.createElement("H5");
    output.contentEditable = true;
    output.className = format;
    
    var mutationObserver = new MutationObserver(function(mutations) 
    {
        answer[index] = new Set([output.innerHTML]);
    });
    
    mutationObserver.observe(output, 
    {
        attributes: false,
        characterData: true,
        childList: false,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
    });
    
    return output;
}

function getScale(amount, index)
{
    var output = document.createElement("DIV");
    output.className = "scale";
    var option = [];
    
    for(let i = 0; i < amount; i++)
    {
        option.push(document.createElement("P"));
        option[i].appendChild(document.createTextNode((i+1)));
        option[i].onclick = function() 
        {
            this.classList.toggle('clicked');
            answer[index] = new Set([(i + 1)]);
            for(let j = 0; j < amount; j++)
            {
                if(j != i)
                {
                    option[j].className = "";
                }
            }
        };
        output.appendChild(option[i]);
    }
    
    return output;
}

/**
 *  Transitions to the next question
 */
function nextQuestion()
{
    current += 1;
    
    if(current < question.length)
    {
        relabelQuestions();
    }
    else
    {
        submit();
    }
}

/**
 *  Transitions to the previous question
 */
function previousQuestion()
{
    current -= 1;
    
    if(current >= 0)
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
    progressBar[1].innerHTML = Math.round((current / question.length) * 100) + "%";
    
    if(current == 0)
    {
        document.getElementById("back-btn").className = "hidden";
    }
    else
    {
        document.getElementById("back-btn").className = "";
    }
    
    if(current == (question.length - 1))
    {
        document.getElementById("next-btn").innerHTML = "Submit";
    }
    else
    {
        document.getElementById("next-btn").innerHTML = "Next";
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