//-----------------------------------------------------------------------------------------------------------------------------
//						Map Modal
//-----------------------------------------------------------------------------------------------------------------------------

function openModal() { 
	$("area").each(function(i){ 
		$(this).click(function(e){
			e.preventDefault();
			$("#modal").hide();
			var id = $(this).attr("id"); 
			$.ajax({
			  	url: "http://127.0.0.1:5000/place/"+id,	//Needs to be replaced with server url 
			  	dataType:"json"
			}).done(function(data) { //fills the modal with the location's data from database
				$("#modal .title h2, #modal div.scores, #modal p.description, #modal ul.comments").html("");
				$("#modal .title h2").html(data.placeName);
				$("#modal div.scores").html("Light: "+data['average light score'] + " Noise: "+data['average sound score'] + " Smell: "+data['average smells score']);
				$("#modal p.description").html(data.placeDescription);
				$("#modal button.openform").attr("data-id",id); 	//the button operates the openform function which takes a location id as a parameter, so we pass the appropriate id in here
				// data.opinions.forEach(function(opinion){
				// 	$("#modal ul.comments").append('<li><p>'+opinion.comments+'</p><p class="signature">'+opinion.userName+'</p></li>') //format how the specific part to each comment are displayed with the appropriate data
				// });
				$("#modal").show(100);
				openForm(data);
			}).fail(function(xhr){
				console.log(xhr.responseText);
			});
		});
	});
}

function closeModal() {
	$("#modal .close").click(function(e){
		e.preventDefault();
		$("#modal").hide(100);
	});
}

//-----------------------------------------------------------------------------------------------------------------------------
//						Map Location Survey
//-----------------------------------------------------------------------------------------------------------------------------

function openForm(data) {
	$("#modal button.openform").click(function(){
		$("#modal").css({"top":"0.3%"})
		$("#modal .info").hide();
		$("#modal form h2 span").html(data.placeName);
		$("#modal form input[name='id']").val(data.id);
		$("#modal form").show();
		submitSurvey(data);
	});
}

/*$(".submitform").click(function(e){
	e.preventDefault();
	submitSurvey();
});*/

function submitSurvey(locationData) {
	$(".submitform").click(function (e) {
		e.preventDefault();
		var placeID = locationData.id;
		var userName = $("#userName").val();
		var peopleRating = $("#people").val();
		var movementRating = $("#movement").val();
		var talkRating = $("#talking").val();
		var noiseRating = $("#noise").val();
		//noise tick boxes
		var noiseTypes = new Array(" ", " ", " ", " ", " ");
		if ($("#noiseType-voices").is(":checked")) {
			noiseTypes[0] = 'Voices';
		} if ($("#noiseType-cutlery-furniture").is(":checked")) {
			noiseTypes[1] = "CutleryFurniture";
		} if ($("#noiseType-media-music").is(":checked")) {
			noiseTypes[2] = "MediaMusic";
		} if ($("#noiseType-traffic-machinery").is(":checked")) {
			noiseTypes[3] = "TrafficHeavy machinery";
		} if ($("#noiseType-other").is(":checked")) {
			noiseTypes[4] = "Other";
		}
		var lightRating = $("#light").val();
		var brightRating = $("#lightBright").val();
		var flickerRating = $("#lightFlickering").val();
		var colourRating = $("#lightColourPeculiar").val();
		var smellRating = $("#smells").val();
		// smell tick boxes
		var smellTypes = new Array(" ", " ", " ", " ", " ");
		if ($("#smellType-chemical").is(":checked")) {
			smellTypes[0] = 'Chemical';
		} if ($("#smellType-food").is(":checked")) {
			smellTypes[1] = "Food";
		} if ($("#smellType-cosmetic").is(":checked")) {
			smellTypes[2] = "Cosmetic";
		} if ($("#smellType-natural").is(":checked")) {
			smellTypes[3] = "Natural";
		} if ($("#smellType-other").is(":checked")) {
			smellTypes[4] = "Other";
		}
		var stickyRating = $("#floorSticky").val();
		var unevenRating = $("#floorUneven").val();
		var seatsRating = $("#seatsHard").val();
		var texturesRating = $("#texturesRough").val();
		var comment = $("#comments").val();

		var surveydata = JSON.stringify({
			"score:": {
				"id": placeID,
				"people": peopleRating,
				"movement": movementRating,
				"talking": talkRating,
				"noise": noiseRating,
				"noiseType": noiseTypes,
				"light": lightRating,
				"lightBright": brightRating,
				"lightFlickering": flickerRating,
				"lightColourPeculiar": colourRating,
				"smells": smellRating,
				"smellType": smellTypes,
				"floorSticky": stickyRating,
				"floorUneven": unevenRating,
				"seatsHardBinary": seatsRating,
				"texturesRoughBinary": texturesRating
			},
			"comments": comment,
			"userName": userName
		});
		
		console.log(surveydata);

		$("#modal form").hide();
		$("#modal .info").show();
		$.ajax({
			type: "GET",
			url: "http://127.0.0.1:5000/survey/"+surveydata,
			contentType: "application/json",
			dataType: "jsonp"
		}).done(function (data) {
			//maybe reset all survey values here?
		}); 
	});
}

//-----------------------------------------------------------------------------------------------------------------------------
//						Filter Locations
//-----------------------------------------------------------------------------------------------------------------------------

$("#openFilterModal").click(function(e){
	e.preventDefault();
	document.getElementById("filterModal").style.display="block";
});

function closeFilterModal() {
	$("#filterModal .closeFilter").click(function(e){
		e.preventDefault();
		$("#filterModal").hide(100);
	});
}

$('.filterform input[type="submit"]').click(function(e){
	e.preventDefault();
	submitFilterValues();
});

function submitFilterValues(){
	// var noiserating=$("#noise1").val(); with jQuery
	var noiserating=document.getElementById("noise1").value;
	var lightrating=document.getElementById("light1").value;
	var smellrating=document.getElementById("smells1").value;
	var scores =""+noiserating+lightrating+smellrating;
	$.ajax({
		//type: "GET",
		url: "static/js/filterResultsExample.json",	//"http://127.0.0.1:5000/filter/"+scores,	
		//contentType: "application/json",
		dataType: "json" //"jsonp"
	}).done(function(data){
		appendData(data);
	});
}

function appendData(data) {
	//Location 1
	var location1 = document.getElementById("location1-name")
	location1.innerHTML =
		"<p> " + data[0].placeName + " </p>" +
		"<i class='add-icon'>+</i>" +
		"<i class='remove-icon'>-</i>";
	document.getElementById("location1-info").innerHTML =
		"<p>Lots of people: " + getScoreWord(data[0].people) + "<br>" +
		"People moving chaotically: " + getScoreWord(data[0].movement) + "<br>" +
		"People talking: " + getScoreWord(data[0].talking) + "<br>" +
		"Background noise: " + getScoreWord(data[0].noise) + "<br>" +
		"Lots of light: " + getScoreWord(data[0].light) + "<br>" +
		"Bright light: " + getScoreWord(data[0].lightBright) + "<br>" +
		"Flickering light: " + getScoreWord(data[0].lightFlickering) + "<br>" +
		"Peculiar light colour: " + getScoreWord(data[0].lightColourPeculiar) + "<br>" +
		"Strong smells: " + getScoreWord(data[0].smells) + "<br>" +
		"Sticky floor: " + getScoreWord(data[0].floorSticky) + "<br>" +
		"Uneven floor: " + getScoreWord(data[0].floorUneven) + "<br>" +
		"Seats: " + getSeatsScoreWord(data[0].seatsHard) + "<br>" +
		"Textures: " + getTexturesScoreWord(data[0].texturesRough) + "</p>";
		location1.style.display = "flex";
	//Location 2
	document.getElementById("location2-name").innerHTML =
		"<p> " + data[1].placeName + "</p>" +
		"<i class='add-icon'>+</i>" +
		"<i class='remove-icon'>-</i>";
	document.getElementById("location2-info").innerHTML =
		"<p>Lots of people: " + getScoreWord(data[1].people) + "<br>" +
		"People moving chaotically: " + getScoreWord(data[1].movement) + "<br>" +
		"People talking: " + getScoreWord(data[1].talking) + "<br>" +
		"Background noise: " + getScoreWord(data[1].noise) + "<br>" +
		"Lots of light: " + getScoreWord(data[1].light) + "<br>" +
		"Bright light: " + getScoreWord(data[1].lightBright) + "<br>" +
		"Flickering light: " + getScoreWord(data[1].lightFlickering) + "<br>" +
		"Peculiar light colour: " + getScoreWord(data[1].lightColourPeculiar) + "<br>" +
		"Strong smells: " + getScoreWord(data[1].smells) + "<br>" +
		"Sticky floor: " + getScoreWord(data[1].floorSticky) + "<br>" +
		"Uneven floor: " + getScoreWord(data[1].floorUneven) + "<br>" +
		"Seats: " + getSeatsScoreWord(data[1].seatsHard) + "<br>" +
		"Textures: " + getTexturesScoreWord(data[1].texturesRough) + "</p>";
	//Location 3
	document.getElementById("location3-name").innerHTML =
		"<p> " + data[2].placeName + " </p>" +
		"<i class='add-icon'>+</i>" +
		"<i class='remove-icon'>-</i>";
	document.getElementById("location3-info").innerHTML =
		"<p>Lots of people: " + getScoreWord(data[2].people) + "<br>" +
		"People moving chaotically: " + getScoreWord(data[2].movement) + "<br>" +
		"People talking: " + getScoreWord(data[2].talking) + "<br>" +
		"Background noise: " + getScoreWord(data[2].noise) + "<br>" +
		"Lots of light: " + getScoreWord(data[2].light) + "<br>" +
		"Bright light: " + getScoreWord(data[2].lightBright) + "<br>" +
		"Flickering light: " + getScoreWord(data[2].lightFlickering) + "<br>" +
		"Peculiar light colour: " + getScoreWord(data[2].lightColourPeculiar) + "<br>" +
		"Strong smells: " + getScoreWord(data[2].smells) + "<br>" +
		"Sticky floor: " + getScoreWord(data[2].floorSticky) + "<br>" +
		"Uneven floor: " + getScoreWord(data[2].floorUneven) + "<br>" +
		"Seats: " + getSeatsScoreWord(data[2].seatsHard) + "<br>" +
		"Textures: " + getTexturesScoreWord(data[2].texturesRough) + "</p>";
	//Location 4
	document.getElementById("location4-name").innerHTML =
		"<p> " + data[3].placeName + " </p>" +
		"<i class='add-icon'>+</i>" +
		"<i class='remove-icon'>-</i>";
	document.getElementById("location4-info").innerHTML =
		"<p>Lots of people: " + getScoreWord(data[3].people) + "<br>" +
		"People moving chaotically: " + getScoreWord(data[3].movement) + "<br>" +
		"People talking: " + getScoreWord(data[3].talking) + "<br>" +
		"Background noise: " + getScoreWord(data[3].noise) + "<br>" +
		"Lots of light: " + getScoreWord(data[3].light) + "<br>" +
		"Bright light: " + getScoreWord(data[3].lightBright) + "<br>" +
		"Flickering light: " + getScoreWord(data[3].lightFlickering) + "<br>" +
		"Peculiar light colour: " + getScoreWord(data[3].lightColourPeculiar) + "<br>" +
		"Strong smells: " + getScoreWord(data[3].smells) + "<br>" +
		"Sticky floor: " + getScoreWord(data[3].floorSticky) + "<br>" +
		"Uneven floor: " + getScoreWord(data[3].floorUneven) + "<br>" +
		"Seats: " + getSeatsScoreWord(data[3].seatsHard) + "<br>" +
		"Textures: " + getTexturesScoreWord(data[3].texturesRough) + "</p>";
	//Location 5
	document.getElementById("location5-name").innerHTML =
		"<p> " + data[4].placeName + " </p>" +
		"<i class='add-icon'>+</i>" +
		"<i class='remove-icon'>-</i>";
	document.getElementById("location5-info").innerHTML =
		"<p>Lots of people: " + getScoreWord(data[4].people) + "<br>" +
		"People moving chaotically: " + getScoreWord(data[4].movement) + "<br>" +
		"People talking: " + getScoreWord(data[4].talking) + "<br>" +
		"Background noise: " + getScoreWord(data[4].noise) + "<br>" +
		"Lots of light: " + getScoreWord(data[4].light) + "<br>" +
		"Bright light: " + getScoreWord(data[4].lightBright) + "<br>" +
		"Flickering light: " + getScoreWord(data[4].lightFlickering) + "<br>" +
		"Peculiar light colour: " + getScoreWord(data[4].lightColourPeculiar) + "<br>" +
		"Strong smells: " + getScoreWord(data[4].smells) + "<br>" +
		"Sticky floor: " + getScoreWord(data[4].floorSticky) + "<br>" +
		"Uneven floor: " + getScoreWord(data[4].floorUneven) + "<br>" +
		"Seats: " + getSeatsScoreWord(data[4].seatsHard) + "<br>" +
		"Textures: " + getTexturesScoreWord(data[4].texturesRough) + "</p>";
}

function getScoreWord(score) {
	if(score == 1)
		return "No";
	else if(score == 2)
		return "Rarely";
	else if(score == 3)
		return "Sometimes";
	else if(score == 4)
		return "Yes";
	else return "ERROR";
}

function getSeatsScoreWord(score) {
	if(score <= 3)
		return "Soft";
	else return "hard";
}

function getTexturesScoreWord(score) {
	if(score <= 3)
		return "Smooth";
	else return "Rough";
}

function displaydata(btn){
	var id = btn.getAttribute('id');
	document.getElementById("filterLocationInfo").style.display="block";
	var id = btn.getAttribute('id');
	var show = document.getElementById("testing"+id);
	var tabs=document.getElementsByClassName("tabs");
	for(i=0;i<tabs.length;i++){
		tabs[i].style.display="none";
	}
	show.style.display="block";
}

function setText(data) {
	var item1 = document.getElementById("filterLocationInfo");
	var item = document.createElement("P");
	item.setAttribute("class", "tabs");
	item.setAttribute("id", "testing" + data.id);
	item.style.display = "none";
	var nameplace = document.createElement("H1");
	var text = document.createTextNode(data.placeName);
	nameplace.appendChild(text);
	item.appendChild(nameplace);

	console.log(data);
	/*
	data.forEach(function(d,i){

		if(d.score.people <=2){
			answer ="no";
		}else{
			answer="yes";
		}

	})
	*/
	if (data.score.people == 1) {
		answer = "No";
	} else if (data.score.people == 2) {
		answer = "Rarely";
	}
	else if (data.score.people == 3) {
		answer = "Sometimes";

	} else if (data.score.people == 4) {
		answer = "Yes";
	}

	text = document.createTextNode("Lots of people: \t\t\t\t\t\t" + answer + "\n");
	item.appendChild(text);
	if (data.score.movement == 1) {
		answer = "No";
	} else if (data.score.movement == 2) {
		answer = "Rarely";
	}
	else if (data.score.movement == 3) {
		answer = "Sometimes";

	} else if (data.score.movement == 4) {
		answer = "Yes";
	}

	text = document.createTextNode("People moving chaotically: \t\t\t" + answer + "\n");
	item.appendChild(text);
	if (data.score.talking == 1) {
		answer = "No";
	} else if (data.score.talking == 2) {
		answer = "Rarely";
	}
	else if (data.score.talking == 3) {
		answer = "Sometimes";

	} else if (data.score.talking == 4) {
		answer = "Yes";
	}

	text = document.createTextNode("People talking a lot: \t\t\t\t\t" + answer + "\n");
	item.appendChild(text);
		if (data.score.noise == 1) {
			answer = "No";
		} else if (data.score.noise == 2) {
			answer = "Rarely";
		}
		else if (data.score.noise == 3) {
			answer = "Sometimes";

		} else if (data.score.noise == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Lots of background noise: \t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.light == 1) {
			answer = "No";
		} else if (data.score.light == 2) {
			answer = "Rarely";
		}
		else if (data.score.light == 3) {
			answer = "Sometimes";

		} else if (data.score.light == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Lots of light: \t\t\t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.lightBright == 1) {
			answer = "No";
		} else if (data.score.lightBright == 2) {
			answer = "Rarely";
		}
		else if (data.score.lightBright == 3) {
			answer = "Sometimes";

		} else if (data.score.lightBright == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Bright light: \t\t\t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.lightFlickering == 1) {
			answer = "No";
		} else if (data.score.lightFlickering == 2) {
			answer = "Rarely";
		}
		else if (data.score.lightFlickering == 3) {
			answer = "Sometimes";

		} else if (data.score.lightFlickering == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Flickering light: \t\t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.lightColourPeculiar == 1) {
			answer = "No";
		} else if (data.score.lightColourPeculiar == 2) {
			answer = "Rarely";
		}
		else if (data.score.lightColourPeculiar == 3) {
			answer = "Sometimes";

		} else if (data.score.lightColourPeculiar == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Peculiar light colour: \t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.smells == 1) {
			answer = "No";
		} else if (data.score.smells == 2) {
			answer = "Rarely";
		}
		else if (data.score.smells == 3) {
			answer = "Sometimes";

		} else if (data.score.smells == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Strong smells: \t\t\t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.floorSticky == 1) {
			answer = "No";
		} else if (data.score.floorSticky == 2) {
			answer = "Rarely";
		}
		else if (data.score.floorSticky == 3) {
			answer = "Sometimes";

		} else if (data.score.floorSticky == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Sticky floor: \t\t\t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.floorUneven == 1) {
			answer = "No";
		} else if (data.score.floorUneven == 2) {
			answer = "Rarely";
		}
		else if (data.score.floorUneven == 3) {
			answer = "Sometimes";

		} else if (data.score.floorUneven == 4) {
			answer = "Yes";
		}

		text = document.createTextNode("Uneven floor: \t\t\t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.seatsHard <= 3) {
			answer = "soft";
		} else {
			answer = "hard";
		}
		text = document.createTextNode("Seats hard or soft: \t\t\t\t\t\t" + answer + "\n");
		item.appendChild(text);
		if (data.score.seatsHard <= 3) {
			answer = "smooth";
		} else {
			answer = "rough";
		}
		text = document.createTextNode("Textures smooth or rough: \t\t\t" + answer + "\n");
		item.appendChild(text);
		item1.appendChild(item);
		console.log(item);
		console.log(item1);
	}

//-----------------------------------------------------------------------------------------------------------------------------
//						Add New Location
//-----------------------------------------------------------------------------------------------------------------------------

$("#addLocation").click(function(e){
	e.preventDefault();
	document.getElementById("addLocationForm").style.display="block";
	submitNewLocation();
});

function submitNewLocation(){
	$(".submitNewLocation").click(function (e) {
		e.preventDefault();
		var placeName = $("#newplaceName").val();
		var peopleRating = $("#newpeople").val();
		var movementRating = $("#newmovement").val();
		var talkRating = $("#newtalking").val();
		var noiseRating = $("#newnoise").val();
		//noise tick boxes
		var noiseTypes = new Array(" ", " ", " ", " ", " ");
		if ($("#newnoiseType-voices").is(":checked")) {
			noiseTypes[0] = 'Voices';
		} if ($("#newnoiseType-cutlery-furniture").is(":checked")) {
			noiseTypes[1] = "CutleryFurniture";
		} if ($("#newnoiseType-media-music").is(":checked")) {
			noiseTypes[2] = "MediaMusic";
		} if ($("#newnoiseType-traffic-machinery").is(":checked")) {
			noiseTypes[3] = "TrafficHeavy machinery";
		} if ($("#newnoiseType-other").is(":checked")) {
			noiseTypes[4] = "Other";
		}
		var lightRating = $("#newlight").val();
		var brightRating = $("#newlightBright").val();
		var flickerRating = $("#newlightFlickering").val();
		var colourRating = $("#newlightColourPeculiar").val();
		var smellRating = $("#newsmells").val();
		// smell tick boxes
		var smellTypes = new Array(" ", " ", " ", " ", " ");
		if ($("#newsmellType-chemical").is(":checked")) {
			smellTypes[0] = 'Chemical';
		} if ($("#newsmellType-food").is(":checked")) {
			smellTypes[1] = "Food";
		} if ($("#newsmellType-cosmetic").is(":checked")) {
			smellTypes[2] = "Cosmetic";
		} if ($("#newsmellType-natural").is(":checked")) {
			smellTypes[3] = "Natural";
		} if ($("#newsmellType-other").is(":checked")) {
			smellTypes[4] = "Other";
		}
		var stickyRating = $("#newfloorSticky").val();
		var unevenRating = $("#newfloorUneven").val();
		var seatsRating = $("#newseatsHard").val();
		var texturesRating = $("#newtexturesRough").val();
		var directions = $("#newdirections").val();
		var comment = $("#newcomments").val();

		var newLocationData = JSON.stringify({
			"placeName": placeName,
			"people": peopleRating,
			"movement": movementRating,
			"talking": talkRating,
			"noise": noiseRating,
			"noiseType": noiseTypes,
			"light": lightRating,
			"lightBright": brightRating,
			"lightFlickering": flickerRating,
			"lightColourPeculiar": colourRating,
			"smells": smellRating,				
			"smellType": smellTypes,
			"floorSticky": stickyRating,
			"floorUneven": unevenRating,
			"seatsHardBinary": seatsRating,
			"texturesRoughBinary": texturesRating,
			"directions": directions,
			"comments": comment,
		});

		console.log(newLocationData);

		$.ajax({
			type: "GET",
			url: "http://127.0.0.1:5000/newLocation/"+newLocationData,
			contentType: "application/json",
			dataType: "jsonp"
		}).done(function (data) {
			
		});
		close1();
	});
}

function close1(){
	var form =document.getElementById("addLocationForm");
	form.style.display="none";	
}

function closeaddLocation() {
	$("#close1").click(function(e){
		e.preventDefault();
		document.getElementById("addLocationForm").style.display="none";
	});
}

//-----------------------------------------------------------------------------------------------------------------------------
//						Styles Altering Buttons
//-----------------------------------------------------------------------------------------------------------------------------

function changeFont() {
  $(".dyslexia-font").click(function(e){
    e.preventDefault();
    $("body").toggleClass("dyslexic");
  });
}

function changeBackground() {
	$(".warm-background").click(function(e){
		e.preventDefault();
		$("body").toggleClass("warm");
	});
}

//-----------------------------------------------------------------------------------------------------------------------------
//						Function Calls
//-----------------------------------------------------------------------------------------------------------------------------
openModal();
closeModal();
closeaddLocation();
closeFilterModal();
changeBackground();
changeFont();