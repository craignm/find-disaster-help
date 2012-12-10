'use strict';

var answers = {};
var actions = [];
var actionList = [];
var globalQuestionId;

var VERSION = 'a'; // for future expansion

init();
checkHash();

function checkHash() {
  positionActions();
  if (!location.hash ||
      location.hash == '' ||
      location.hash == '#') {
    askQuestions();
  } else {
    setActionListFromHash();
    printActions();
  }
}

function askQuestions() {
  clearActionList();

  if (!ask('Have you experienced losses related to Hurricane Sandy?', 'losses')) {
    return;
  }
  
  if (!answers.losses) {
    addAction(0);
    printActions();
    return;
  }
  
  if (!ask('Do you have private property insurance?', 'propertyInsurance')) {
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


  if (!ask('Are you experiencing: <ul>' +
     '<li>problems with mortgage or creditors,' +
     '<li>problems with insurance claims, or' +
     '<li>tenant/landlord disputes',
     'legal')) {
    return;
  }

  if (answers.legal) {
    addAction(9);
  }

  if (!ask('Has your home been damaged?', 'damage')) {
    return;
  }

  if (answers.damage) {
    addAction(10);
  }
  
  //    if (!ask('Are you or your family experiencing: <ul>' +
  //       '<li>loss of sleep or fatigue,' +
  //       '<li>persistent crying, or' +
  //       '<li>loss of appetite',
  //       'social')) {
  //      return;
  //    }

  //    if (answers.social) {
  //      addAction(11);
  //    }

  if (!ask('Have you lost food or are you experiencing difficulty with daily food needs?', 'food')) {
    return;
  }

  if (answers.food) {
    addAction(12);

    if (!ask('Are you enrolled in SNAP?', 'snap')) {
	return;
    }

    if (answers.snap) {
	addAction(13);
    } else {
	addAction(14);
    }
  }

  addAction(15);

  printActions();
}

// Returns true if the question has already been answered.
function ask(message, questionId) {
  if (answers[questionId] !== undefined) {
    return true;
  }

  $('#content').empty().append('<div class="question">'+message+'</div>');

  globalQuestionId = questionId;

  $('.start-over-button').hide();
  $('.yes-button').show();
  $('.no-button').show();

  positionActions();

  return false;
}

function positionActions() {
  if (!location.hash ||
	location.hash == '#') {
    var offsetWidth = $(window).width();
    $('#actions').css({
	  left : offsetWidth
    });
  }
}


function clearActionList() {
  actionList = [];
}

function addAction(messageNum) {
  actionList.push(messageNum);
}

function init() {
  $('.start-over-button')
    .click(function(e) {
	e.preventDefault();
	clearActionList();
	answers = {};
	location.hash = '';
	checkHash();
      });
  
  $('.yes-button')
    .click(function(e) {
	e.preventDefault();
	answers[globalQuestionId] = true;
	askQuestions();
      });

  $('.no-button')
    .click(function(e) {
	e.preventDefault();
	answers[globalQuestionId] = false;
	askQuestions();
      });

  $(window).resize(function(){
	positionActions();
  });

  actions[0] = 
	'If you have any questions about benefits or need access to a social worker, ' +
	'please go to a <a href=http://www.singlestopusa.org/locations>Single Stop</a> ' +
	'location near you';

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
    ' through the Small Business Administration. ' +
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

  actions[10] = 
    'Register for <a href="http://www.nyc.gov/html/misc/html/2012/rapid_repairs.html">NYC Rapid Repairs</a>' +
    ' using your FEMA registration number.';

  actions[11] = 
    'Call (___) ___-____ to speak with a social worker.';

  actions[12] = 'Find a <a href="http://www.nyccah.org/hungermaps/">food pantry</a> near you';

  actions[13] = 'Apply for <a href="http://www.nyc.gov/html/hra/html/directory/snap_sandy.shtml">' +
    'replacement benefits</a>.';

  actions[14] = 'Check your elegibility and <a href="http://mybenefits.ny.gov">apply</a>/';

  actions[15] = 
	'If you have any questions about benefits or need access to a social worker, ' +
	'please go to a <a href=http://www.singlestopusa.org/locations>Single Stop</a> ' +
	'location near you';
}

function printActions() {
  $('.yes-button').hide();
  $('.no-button').hide();

  $('.start-over-button')
    .show()
    .css({ width: '150px' })

  var ol = $('<ol>');

  var hash = VERSION + toAlpha(actionList);
  location.hash = hash;
  
  var bookmarkDiv = $('<div>')
    .addClass('bookmark')
    .html('To get back here: ' +
    '<span class=bookmark-span>finddisasterhelp.com/#' +
    hash + '</span>');

  $('#actions')
    .empty()
    .append(ol)
    .append(bookmarkDiv);

  for (var i = 0; i < actionList.length; ++i) {
    ol.append($('<li>')
        .addClass('action-text')
        .html(actions[actionList[i]]));
  }

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
  clearActionList();
  // trim off # and VERSION
  actionList = fromAlpha(location.hash.substring(2));
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
