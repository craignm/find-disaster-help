'use strict';

var answers = {};

askQuestions();

function askQuestions() {
  clearActionList();

  if (!ask('Have you experienced losses related to Hurricane Sandy?', 'losses')) {
    return;
  }

  if (!answers.losses) {
    addAction('If you are still in need of assistance, call xxx to speak with a social worker');
    return;
  }

  if (!ask('Do you have private property insurance?', 'propertyIinsurance')) {
    return;
  }

  if (answers.propertyInsurance) {
    addAction('Submit a claim to your private insurance plan for any eligible damages. ' +
	    'You do not have to hear back to move onto the next steps, ' +
	    'but you must initiate the insurance process.');

    addAction('Submit application for FEMA assistance.' +
	    'Complete the application as best you can given your current insurance ' +
	    'coverage information',
	    'http://www.disasterassistance.gov');
  } else {
    addAction('Submit application for FEMA assistance. ' +
	    'http://www.disasterassistance.gov');
  }

  addAction('Apply for low-interest Disaster Loans through the Small Business Administration. ' +
	  'You do not have to take any loan offered to you, ' +
	  'but you must initiate the application process',
	  'http://disasterloan.sba.gov/ela');

  if (!ask('Have you lost work, time employment, or income due to the hurricane?', 'income')) {
    return;
  }

  if (answers.income) {
    if (!ask('Do you live in New York State?', 'newYork')) {
      return;
    }
    if (answers.newYork) {
      addAction('Apply for Disaster Unemployment Assistance (DUA).',
	      'http://www.labor.ny.gov/ui/claimantinfo/disaster-unemploymentassistance.shtm');
    }

    // TODO: anything for other states?
  }

  if (!ask('Have you lost health insurance due to the hurricane?', 'health')) {
    return;
  }
  if (answers.health) {
    addAction('Apply for Family Health Plus', 'https://a858-ihss.nyc.gov/');

    if (!ask('Are you eligible for Medicaid?', 'medicaid')) {
      return;
    }
    if (answers.medicaid) {
      addAction('Apply for Medicaid', 'https://a858-ihss.nyc.gov/');
    }

    if (!ask('Do you have children?', 'children')) {
      return;
    }
    if (answers.children) {
      addAction('Apply for Child Health Plus', 'https://a858-ihss.nyc.gov/');
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
    addAction('Seek legal assistance from a pro bono provider. ' +
	    '(e.g., NYLAG Storm Response Unit)',
	    'http://nylag.org/units/stormresponse-unit/');
  }

  createPrintedPage();
}

function ask(message, questionId) {
  if (answers[questionId] !== undefined) {
    return true;
  }

  var yesButton = $('<a class="button">')
    .addClass('yes-button')
    .text('Yes')
    .click(function() {
	answers[questionId] = true;
	askQuestions();
      });

  var noButton = $('<a class="button">')
    .addClass('no-button')
    .text('No')
    .click(function() {
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

  outerHeight = $('.question').outerHeight();
  $('.question').css({
    'margin-top' : -parseInt(outerHeight/2)
  });

  return false;
}

var actionList = [];

function clearActionList() {
  actionList = [];
}

function addAction(message, urlParam) {
  var url = '';
  if (urlParam !== undefined) {
    url = urlParam;
  }

  actionList.push({ message: message, url: url });

  displayActions();
}

function displayActions() {
  var ol = $('<ol>');

  $('#actions')
    .empty()
    .append(ol);

  for (var i = 0; i < actionList.length; ++i) {
    var newAction = $('<li>');
    newAction.append($('<div>')
		     .addClass('action-text')
		     .text(actionList[i].message));
    if (actionList[i].url != '') {
      newAction.append($('<a>')
		       .addClass('action-url')
		       .text(actionList[i].url)
		       .attr('href', actionList[i].url));
    }
    ol.append(newAction);
  }
}

function createPrintedPage() {
  $('#questions').hide();
}
