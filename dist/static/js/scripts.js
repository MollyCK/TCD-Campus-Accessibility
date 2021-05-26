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
				$("#modal .title h2, #modal div.score, #modal p.description, #modal ul.comments").html("");
				$("#modal .title h2").html(data.placeName);
				$("#modal div.score").html("Average Score: "+data.average);
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

function closeaddLocation() {
	$("#close1").click(function(e){
		e.preventDefault();
		document.getElementById("addLocationForm").style.display="none";
	});
}

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
		var noiseType = 5;
		if ($("#noiseType-voices").val() != 0) {
			noiseType = 1;
		} else if ($("#noiseType-cutlery-furniture").val() != 0) {
			noiseType = 2;
		} else if ($("#noiseType-media-music").val() != 0) {
			noiseType = 3;
		} else if ($("#noiseType-traffic-machinery").val() != 0) {
			noiseType = 4;
		}
		var lightRating = $("#light").val();
		var brightRating = $("#lightBright").val();
		var flickerRating = $("#lightFlickering").val();
		var colourRating = $("#lightColourPeculiar").val();
		var smellRating = $("#smells").val();
		// smell tick boxes
		var smellType = 5;
		if ($("#smellType-chemical").val() != 0) {
			smellType = 1;
		} else if ($("#smellType-food").val() != 0) {
			smellType = 2;
		} else if ($("#smellType-cosmetic").val() != 0) {
			smellType = 3;
		} else if ($("#smellType-natural").val() != 0) {
			smellType = 4;
		}
		var stickyRating = $("#floorSticky").val();
		var unevenRating = $("#floorUneven").val();
		var seatsRating = $("#seatsHard").val();
		var texturesRating = $("#texturesRough").val();
		var comment = $("#comments").val();

//trying something 
/*
		let xhr = new XMLHttpRequest();
		let url = "http://127.0.0.1:5000/survey";

		xhr.open("POST", url, true);

		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {

				//print received data from server
				result.innerHTML = this.responseText;
			}
		};
*/
		var surveydata = JSON.stringify({
			"score:": {
				"id": placeID,
				"people": peopleRating,
				"movement": movementRating,
				"talking": talkRating,
				"noise": noiseRating,
				"noisesArray": noiseType,
				"light": lightRating,
				"lightBright": brightRating,
				"lightFlickering": flickerRating,
				"lightColourPeculiar": colourRating,
				"smells": smellRating,
				"smellArray": smellType,
				"floorSticky": stickyRating,
				"floorUneven": unevenRating,
				"seatsHardBinary": seatsRating,
				"texturesRoughBinary": texturesRating
			},
			"comments": comment,
			"userName": userName
		});

//		xhr.send(surveydata);
		
		console.log(surveydata);

		$("#modal form").hide();
		$("#modal .info").show();
		$.ajax({
			type: "GET",
			url: "http://127.0.0.1:5000/survey?data="+surveydata,
			contentType: "application/json",
			dataType: "jsonp"
		}).done(function (data) {
			console.log(data);
		}); 
	});
}

$('.filterform input[type="submit"]').click(function(e){
	e.preventDefault();
	myfunct();
});

function myfunct(){
	console.log("submitted");
	// var noiserating=$("#noise1").val(); with jQuery
	var noiserating=document.getElementById("noise1").value;
	var lightrating=document.getElementById("light1").value;
	var smellrating=document.getElementById("smells1").value;
	var scores =""+noiserating+lightrating+smellrating;
	/*send string to server*/
	$.ajax({
		type: "GET",
		url: "http://127.0.0.1:5000/filter/"+scores,	
		dataType:"json",
		data: scores,
	}).done(function(data){
		console.log(data.placeName);
		cleardata();
		cleardata2();
		/*data.location.forEach(location){};					HAVE TO LOOP*/
		var test =document.getElementById("txtHint");
		var para = document.createElement("BUTTON");
		para.setAttribute("onclick","displaydata(this)");
		para.setAttribute("id",data.id);
		console.log($(para).attr("id"));
		var node = document.createTextNode(data.placeName);
		para.appendChild(node);
		test.appendChild(para);
		document.getElementById("content").style.display="none";
		setText(data);
		
	});
}

function displaydata(btn){
	var id = btn.getAttribute('id');
	document.getElementById("content").style.display="block";
	var id = btn.getAttribute('id');
	var show = document.getElementById("testing"+id);
	var tabs=document.getElementsByClassName("tabs");
	for(i=0;i<tabs.length;i++){
		tabs[i].style.display="none";
	}
	show.style.display="block";
}

function cleardata(){
	document.getElementById("content").innerHTML="";
	console.log("cleared");
}

function cleardata2(){
	document.getElementById("txtHint").innerHTML="";
	console.log("cleared2");
}

function addLocationFunct(){
	console.log("logged");
	document.getElementById("addLocationForm").style.display="block";
}

function addNewLocation(){
	var jsonString = {

	};
}

function close1(){
	var form =document.getElementById("addLocationForm");
	form.preventDefault();
	form.style.display="none";	
}

function setText(data) {
	var item1 = document.getElementById("content");
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

openModal();
closeModal();
closeaddLocation();

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

changeBackground();
changeFont();