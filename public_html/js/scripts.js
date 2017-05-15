"use strict";

function relevantEvents(){
	$('#user_menu #relevant_events div.uk-spinner').removeClass('uk-hidden');
	$("#user_menu #relevant_events").addClass('uk-text-center');
	$("#user_menu #relevant_events ul").remove();
	
	if(Cookies.get('youthMember')){
		var youthGroupId;
		
		switch(Cookies.getJSON('youthMember').youth_group){
			case 'Young Men':
				youthGroupId = 24;
				break;
			case 'Young Women':
				youthGroupId = 23;
				break;
			default:
				youthGroupId = 22;
		}
		
		$.ajax({
			method: "GET",
			url: '/relevant-events.json',
			data: {youth_group_id:youthGroupId},
			dataType: 'json'
		}).fail(function(){
			$('#user_menu #relevant_events div.uk-spinner').addClass('uk-hidden');
			$("#user_menu #relevant_events").removeClass('uk-text-center');
			$('#user_menu #relevant_events').append('<p class="uk-animation-fade">We could not retrieve any relevant events.</');
		}).done(function(relevantEventData){
			$("#user_menu #relevant_events div.uk-spinner").addClass('uk-hidden');
			$("#user_menu #relevant_events").removeClass('uk-text-center');
			if(relevantEventData.data.length > 0){
				var eventList = $("<ul />");
					eventList.addClass('uk-list').appendTo($('#user_menu #relevant_events'));
				for(var i in relevantEventData.data){
					eventList.append('<li class="uk-animation-fade"><a href="/events/' + relevantEventData.data[i].slug + '" title="' + relevantEventData.data[i].event_title + '">' + relevantEventData.data[i].event_title + '</a></li>');	
				}
			} else {
				$('#user_menu #relevant_events').append('<p class="uk-animation-fade">No relevant events found.</p>');
			}			
		});
	}
}

function youthMemberCheck(){
	if(Cookies.get('youthMember')){
		$("#mobile_menu").find('.member-link').first().children('a').first().off('click');
		$("#mobile_menu").find('.member-link').last().children('a').first().off('click');
		
		relevantEvents();
		$("#user_nav").html('<span class="uk-icon uk-margin-small-right" uk-icon="icon: user"></span><div class="uk-inline"><a class="uk-link-muted" href="#user_menu" uk-toggle>' + Cookies.getJSON('youthMember').first_name + ' ' + Cookies.getJSON('youthMember').last_name + '</a>');
		
		$("#mobile_menu").find('.member-link').first().children('a').first().html('<span class="uk-icon uk-margin-small-right" uk-icon="icon: refresh"></span>Update Info').click(function(){
			setTimeout(function(){$('#user_menu ul.uk-nav').children('li.member-link').first().children('a').first().click();}, 500);
			UIkit.offcanvas('#mobile_menu').hide();
		});
		
		$("#mobile_menu").find('.member-link').last().children('a').first().html('<span class="uk-icon uk-margin-small-right" uk-icon="icon: sign-out"></span>Sign Out').click(function(){
			setTimeout(function(){$('#user_menu ul.uk-nav').children('li.member-link').last().children('a').first().click();}, 500);
			UIkit.offcanvas('#mobile_menu').hide();
		});
				
		document.forms['youth_member_form']['entryId'].value = Cookies.getJSON('youthMember').id;
		document.forms['youth_member_form']['fields[youthMemberFirstName]'].value = Cookies.getJSON('youthMember').first_name;
		document.forms['youth_member_form']['fields[youthMemberLastName]'].value = Cookies.getJSON('youthMember').last_name;
		$(document.forms['youth_member_form']['fields[youthMemberYouthGroup]']).children('option').each(function(){
			if($(this).text() == Cookies.getJSON('youthMember').youth_group){
				$(this).prop('selected', true);
			}
		});
		$(document.forms['youth_member_form']['fields[youthMemberWard]']).children('option').each(function(){
			if($(this).text() == Cookies.getJSON('youthMember').ward){
				$(this).prop('selected', true);
			}
		});
		document.forms['youth_member_form']['fields[householdTelephone]'].value = Cookies.getJSON('youthMember').household_telephone;
		customUrlTitle(document.forms['youth_member_form']);
	} else{
		$("#user_nav").html('<a href="#join_modal" class="uk-link-muted uk-margin-right" uk-toggle><span class="uk-icon uk-margin-small-right" uk-icon="icon: user"></span>Join</a><a href="javascript:void(0)" class="uk-link-muted" onclick="signIn();"><span class="uk-icon uk-margin-small-right" uk-icon="icon: sign-in"></span>Sign In</a>');
		
		$("#mobile_menu").find('.member-link').first().children('a').first().html('<span class="uk-icon uk-margin-small-right" uk-icon="icon: user"></span>Join').click(function(){
			setTimeout(function(){$('#user_nav').find('a').first().click();}, 500);
			UIkit.offcanvas('#mobile_menu').hide();
		});
		
		$("#mobile_menu").find('.member-link').last().children('a').first().html('<span class="uk-icon uk-margin-small-right" uk-icon="icon: sign-in"></span>Sign In').click(function(){
			setTimeout(function(){$('#user_nav').find('a').last().click();}, 500);
			UIkit.offcanvas('#mobile_menu').hide();
		});
	}
}

function signIn(){
	UIkit.modal.prompt('Household Telephone:', '').then(function(telStr){
		if(typeof telStr != 'undefined' && telStr != null && telStr != ''){
			// Submit data via AJAX
			$.ajax({
				method: "GET",
				url: '/youth-members.json',
				data: {phone:formatPhoneNumber(telStr)},
				dataType: 'json'
			}).fail(function(){
				UIkit.modal.alert('We could not process your request. Please contact web support, or try again later.');
			}).done(function(youthMemberData){
				if(youthMemberData.data.length > 0){
					var modalHTML = '<div class="uk-modal-body"><table class="uk-table uk-table-striped uk-table-middle uk-table-hover"><tbody>';
					
					for(var i in youthMemberData.data){
						modalHTML += '<tr class="inactive" style="cursor: pointer;" onclick="$(this).removeClass(' + "'" + 'inactive' + "'" + '); $(this).parent().find(' + "'" + 'tr.inactive .uk-inline' + "'" + ').addClass('+ "'" + 'uk-invisible' + "'" + ').find(' + "'" + 'input' + "'" + ').first().val(' + "''" + '); $(this).find(' + "'" + '.uk-inline' + "'" + ').first().removeClass('+ "'" + 'uk-invisible' + "'" + ').find(' + "'" + 'input' + "'" + ').first().focus();" onfocusout="$(this).addClass(' + "'" + 'inactive' + "'" + ');"><td>' + youthMemberData.data[i].first_name + ' ' + youthMemberData.data[i].last_name + '</td><td><div class="uk-inline uk-invisible uk-animation-fade uk-animation-fast"><a class="uk-form-icon uk-form-icon-flip uk-modal-close" href="javascript:void(0)" uk-icon="icon: arrow-right" data-slug="' + youthMemberData.data[i].slug + '" onclick="rYouthMember($(this).data(' + "'" + 'slug' + "'" + '), $(this).next(' + "'" + 'input' + "'" + ').val());"></a><input type="text" class="uk-input uk-float-right uk-width-auto" placeholder="4 Digit PIN" maxlength="4"></div></td>';	
					}
					
					modalHTML += '</tbody></table></div>'
					UIkit.modal.dialog(modalHTML);
				} else {
					UIkit.modal.alert('Household Telephone not found.');
				}			
			});
		}
	});
}

function signOut(){
	Cookies.remove('youthMember');
	youthMemberCheck();
	UIkit.offcanvas('#user_menu').hide();
}

function showMobileMenu(){
	UIkit.offcanvas('#mobile_menu').show();
}

function customUrlTitle(form){
	document.forms[form.id]['title'].value = document.forms[form.id]['fields[youthMemberFirstName]'].value + ' ' + document.forms[form.id]['fields[youthMemberLastName]'].value;
	document.forms[form.id]['slug'].value = (document.forms[form.id]['fields[householdTelephone]'].value.replace(/[a-z]|[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]|\s/gi, '') + '-' + document.forms[form.id]['fields[youthMemberFirstName]'].value + '-' + document.forms[form.id]['fields[youthMemberLastName]'].value).replace(/ /g, '-').toLowerCase();
}

function formatPhoneNumber(telStr){
	var cleanStr = telStr.replace(/[a-z]|[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]|\s/gi, '');
	
	if(cleanStr.length > 10){
		cleanStr = cleanStr.substr(1);
	}
	
	var newStr = [cleanStr.slice(0, 3), ' ', cleanStr.slice(3)].join('');
		newStr = [newStr.slice(0, 7), '-', newStr.slice(7)].join('');
	
	return newStr;
}

function cYouthMember(form){
	// Validate form and submit if valid
	if(validateForm(form, false)){
		var $form = $(form);
		var slug = document.forms[form.id]['slug'].value;
		UIkit.modal.dialog('<p class="uk-modal-body"><div uk-spinner></div> Submitting Data&hellip;</p>');

		// Check to see if there is an existing Youth Member
		$.ajax({
		method: "GET",
		url: '/youth-members/' + slug + '.json',
		dataType: 'json'
		}).fail(function(){
			// Submit data via AJAX
			$.ajax({
				method: "POST",
				url: form.action,
				data: $form.serialize(),
				dataType: 'json'
			}).fail(function(){
				UIkit.modal.alert('We could not process your request. Please contact web support, or try again later.');
			}).done(function(data){
				if (data.success){
	                UIkit.modal.alert('Success! Thanks for joining. Click "Sign In" to log in.');
	            } else {
		            if(data.errors.length > 0){
	                	UIkit.modal.alert('Failed with the following errors:' + data.errors.join(', '));
	                } else{
		                // Default error
		                UIkit.modal.alert('We could not process your request. Please contact web support, or try again later.');
	                }
	            }
			});
		}).done(function(){
			UIkit.modal.alert('Our records show that this youth member already exists. Please sign in.');
		});	
	}
}

function rYouthMember(slug, pin){
	$.ajax({
		method: "GET",
		url: '/youth-members/' + slug + '.json',
		data: {pin:pin},
		dataType: 'json'
	}).fail(function(){
		UIkit.modal.alert('Invalid PIN. Please try again or contact web support.');
	}).done(function(youthMemberData){
		if(typeof youthMemberData.error == 'undefined'){
			Cookies.set('youthMember', youthMemberData);
			youthMemberCheck();
			setTimeout(function(){
				if($(window).width() > 768){
					UIkit.offcanvas('#user_menu').show();
					setTimeout(function(){
						$("#user_menu h3").first().addClass('uk-animation-shake');
						setTimeout(function(){
							$("#user_menu h3").first().removeClass('uk-animation-shake');
						}, 500);
					}, 500);
				} else{
					UIkit.offcanvas('#mobile_menu').show();
				}
			}, 250);
		} else {
			UIkit.modal.alert(youthMemberData.error);
		}
	});
}

function uYouthMember(form){
	// Validate form and submit if valid
	if(validateForm(form, false)){
		var $form = $(form);
		UIkit.modal.dialog('<p class="uk-modal-body"><div uk-spinner></div> Submitting Data&hellip;</p>');
		
		// Submit data via AJAX
		$.ajax({
			method: "POST",
			url: form.action,
			data: $form.serialize(),
			dataType: 'json'
		}).fail(function(){
			UIkit.modal.alert('We could not process your request. Please contact web support, or try again later.');
		}).done(function(data){
			if (data.success){
                UIkit.modal.alert('Success! Your information has been updated.');
            } else {
	            if(data.errors.length > 0){
                	UIkit.modal.alert('Failed with the following errors:' + data.errors.join(', '));
                } else {
	                // Default error
	                UIkit.modal.alert('We could not process your request. Please contact web support, or try again later.');
                }
            }
		});	
	}
}

function register(registrantForm, eventForm){
	if(Cookies.get('youthMember')){
		var eventId = document.forms[eventForm.id]['entryId'].value;
		if(Cookies.getJSON('youthMember').registered_events.indexOf(eventId) == -1){
			var registrantSuccess = false;
			var eventSuccess = false;
			var registrantComplete = false;
			var eventComplete = false;
			
			document.forms[registrantForm.id]['entryId'].value = Cookies.getJSON('youthMember').id;
			document.forms[registrantForm.id]['title'].value = Cookies.getJSON('youthMember').title;
			document.forms[registrantForm.id]['slug'].value = Cookies.getJSON('youthMember').slug;
			document.forms[eventForm.id]['fields[eventRegistrants][]'].value = Cookies.getJSON('youthMember').id;
			
			$.ajax({
				method: "POST",
				url: document.forms[registrantForm.id].action,
				data: $(document.forms[registrantForm.id]).serialize(),
				dataType: 'json'
			}).done(function(data){
				registrantSuccess = true;
			}).always(function(){
				registrantComplete = true;
			});
			
			$.ajax({
				method: "POST",
				url: document.forms[eventForm.id].action,
				data: $(document.forms[eventForm.id]).serialize(),
				dataType: 'json'
			}).done(function(data){
				eventSuccess = true;
			}).always(function(){
				eventComplete = true;
			});
			
			$(document).ajaxStop(function(){
				if(registrantSuccess == false || eventSuccess == false){
					UIkit.modal.alert('We could not process your request. Please contact web support, or try again later.');
				} else{
					var updatedYouthMember = Cookies.getJSON('youthMember');	
						updatedYouthMember.registered_events.push(eventId);
					Cookies.set('youthMember', updatedYouthMember);
					UIkit.modal.alert('Success! Thanks for registering.');
				}
			});
		} else{
			UIkit.modal.alert('Our records show you have already registered for this event. Thank you.');
		}
	} else{
		UIkit.modal.alert('Oops! Please sign in to register for this event.');
	}
}

$(document).ready(function(){
	youthMemberCheck();
});