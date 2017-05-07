// Form Validation Function
function validateForm(form, showMessage){
	var allValid = true;
	
	// Remove any previous alerts
	$(form).children(".uk-alert").remove();
	$(form).find(".uk-form-danger").removeClass('uk-form-danger');
	
	// Validate form inputs
	for (i = 0; i < form.length; i++){
		
		// Checks required field values. If missing/empty add warning to form and exit. 
		if(form.elements[i].validity.valueMissing){
			if(showMessage){
				$(form).prepend('<div class="uk-alert uk-alert-danger"><p>' + $(form.elements[i]).data("label") + ' is a required field.</p></div>').hide().fadeIn();
			}

			$(form.elements[i]).focus().addClass('uk-form-danger');
				    	
	    	allValid = false;
	    	break;
	    }
	    
	    // Checks field types. If wrong type add warning to form and exit
	    if(form.elements[i].validity.typeMismatch){	
		    if(showMessage){
				$(form).prepend('<div class="uk-alert uk-alert-danger"><p>' + $(form.elements[i]).data("label") + ' is invalid.</p></div>').hide().fadeIn();
			}
			
			$(form.elements[i]).focus().addClass('uk-form-danger');
			
	    	allValid = false;
	    	break;
		}
	}
	
	return allValid;
}