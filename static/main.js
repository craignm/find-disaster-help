'use strict';

var answers = {};
var actions = [];
var actionList = [];

var VERSION = 'a'; // for future expansion

initializeActions();
checkHash();
window.onhashchange = checkHash;

function checkHash() {
  clearActionList();

  if (window.location.hash === undefined || 
      window.location.hash == '') {
    askQuestions();
  } else {
    setActionListFromHash();
    printActions();
  }
}

function askQuestions() {
  
  if (!ask('Have you experienced losses related to Hurricane Sandy?', 'losses')) {
    return;
  }
  
  if (!answers.losses) {
    addAction(0);
    printActions();
    return;
  }
  
  if (!ask('Do you have private property insurance?', 'propertyIinsurance')) {
    return;
  }
  
  if (answers.propertyInsurance) {
    addAction(1);
    addAction(2);
  } else {
    addAction(3);
  }
  
  addAction(4);
  
  if (!ask('Have you lost work, time employment, or income due to the hurricane?', 'income')) {
    return;
  }
  
  if (answers.income) {
    if (!ask('Do you live in New York State?', 'newYork')) {
      return;
    }
    if (answers.newYork) {
      addAction(5);
    }
    
    // TODO: anything for other states?
  }
  
  if (!ask('Have you lost health insurance due to the hurricane?', 'health')) {
    return;
  }
  if (answers.health) {
    addAction(6);
    
    if (!ask('Are you eligible for Medicaid?', 'medicaid')) {
      return;
    }
    if (answers.medicaid) {
      addAction(7);
    }

    if (!ask('Do you have children?', 'children')) {
      return;
    }
    if (answers.children) {
      addAction(8);
    }
  }
  
  if (!ask('Are you experiencing any of the following: <ul>' +
	   '<li>problems with mortgage or creditors' +
	   '<li>problems with insurance claims' +
	   '<li>tenant/landlord disputes',
	   'legal')) {
    return;
  }
  
  if (answers.legal) {
    addAction(9);
  }
  
  printActions();
}

// Returns true if the question has already been answered.
function ask(message, questionId) {
  if (answers[questionId] !== undefined) {
    return true;
  }

  var yesButton = $('<a href="#" class="button">')
    .addClass('yes-button')
    .text('Yes')
    .click(function() {
      event.preventDefault();
      answers[questionId] = true;
      askQuestions();
    });

  var noButton = $('<a href="#" class="button">')
    .addClass('no-button')
    .text('No')
    .click(function() {
      event.preventDefault();
      answers[questionId] = false;
      askQuestions();
    });

  $('#content')
    .empty()
    .append($('<div>').html(message)
    .addClass('question'));
  $('#controls')
    .empty()
    .append(yesButton)
    .append(noButton);

  return false;
}

function clearActionList() {
  actionList = [];
}

function addAction(messageNum) {
  actionList.push(messageNum);
}

function initializeActions() {
  actions[0] = 
    'If you are still in need of assistance, call xxx to speak with a social worker';
  
  actions[1] = 
    'Submit a claim to your private insurance plan for any eligible damages. ' +
    'You do not have to hear back to move onto the next steps, ' +
    'but you must initiate the insurance process.';
  
  actions[2] = 
    'Apply for ' +
    '<a href="http://www.disasterassistance.gov">' +
    'FEMA assistance</a>. ' +
    'Complete the application as best you can given your current insurance ' +
    'coverage information';
  
  actions[3] = 
    'Apply for ' +
    '<a href="http://www.disasterassistance.gov">' +
    'FEMA assistance</a>. ';
  
  actions[4] = 
    'Apply for ' +
    '<a href="http://disasterloan.sba.gov/ela">' +
    'low-interest Disaster Loans</a>' +
    ' through the Small Business Administration.'
    'You do not have to take any loan offered to you, ' +
    'but you must initiate the application process';
  
  actions[5] = 
    'Apply for ' +
    '<a href="http://www.labor.ny.gov/ui/claimantinfo/disaster-unemployment-assistance.shtm">' +
    'Disaster Unemployment Assistance (DUA)</a>.';
  
  actions[6] = 
    'Apply for <a href="https://a858-ihss.nyc.gov/">Family Health Plus</a>.';
  
  actions[7] = 
    'Apply for <a href="https://a858-ihss.nyc.gov/">Medicaid</a>.';
  
  actions[8] = 
    'Apply for <a href="https://a858-ihss.nyc.gov/">Child Health Plus</a>.';
  
  actions[9] =
    'Seek legal assistance from a pro bono provider. ' +
    '(e.g., <a href="http://nylag.org/units/storm-response-unit/">' +
    'NYLAG Storm Response Unit</a>)';
}

function printActions() {
  var ol = $('<ol>');

  $('#actions')
    .empty()
    .append(ol);

  for (var i = 0; i < actionList.length; ++i) {
    ol.append($('<li>')
	      .addClass('action-text')
	      .html(actions[actionList[i]]));
  }
  window.location.hash = VERSION + toAlpha(actionList);

  $('#actions').animate({
      'left' : 0
  }, 500);
}

function toAlpha(list) {
  var bitmask = 0;
  for (var i = 0; i < list.length; ++i) {
    bitmask |= 1 << list[i];
  }

  var string = '';
  while (1) {
    if (bitmask == 0) {
      return string;
    }
    
    string += String.fromCharCode('a'.charCodeAt(0) + (bitmask % 26));
    bitmask = Math.floor(bitmask / 26);
  }
}

function setActionListFromHash() {
  // trim off # and VERSION
  actionList = fromAlpha(window.location.hash.substring(2));
}

function fromAlpha(string) {
  var number = 0;
  for (var i = string.length - 1; i >= 0; --i) {
    number *= 26;
    number += string.charCodeAt(i) - 'a'.charCodeAt(0);
  }

  var list = [];
  for (var i = 0; i < actions.length; ++i) {
    if (number & (1 << i)) {
      list.push(i);
    }
  }

  return list;
}
