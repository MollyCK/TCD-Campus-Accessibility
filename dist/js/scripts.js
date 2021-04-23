//The below function opens and fills the location info pop-up (modal) with data for each location
function openModal() { 
	$("area").each(function(i){ 
		$(this).click(function(e){
			e.preventDefault();
			$("#modal").hide();
			var id = $(this).attr("id"); 
			$.ajax({
			  	url: "data/dataExample.json?id="+id,	//Needs to be replaced with server url so that server knows to get data pertaining to the given location's id. Currently takes data from dummy data
			  	dataType:"json"
			}).done(function(data) { //fills the modal with the location's data from database
				$("#modal .title h2, #modal div.score, #modal p.description, #modal ul.comments").html("");
				$("#modal .title h2").html(data.placeName);
				$("#modal div.score").html("Average Score: "+data.score.average);
				$("#modal p.description").html(data.placeDescription);
				$("#modal button.openform").attr("data-id",id); 	//the button operates the openform function which takes a location id as a parameter, so we pass the appropriate id in here
				data.opinions.forEach(function(opinion){
					$("#modal ul.comments").append('<li><p>'+opinion.comments+'</p><p class="signature">'+opinion.userName+'</p></li>') //format how the specific part to each comment are displayed with the appropriate data
				});
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

function openForm(data) {
	$("#modal button.openform").click(function(){
		$("#modal").css({"top":"0.3%"})
		$("#modal .info").hide();
		$("#modal form h2 span").html(data.placeName);
		$("#modal form input[name='id']").val(data.id);
		$("#modal form").show();
	});
}

function myfunct(){
	console.log("submitted");
	var noiserating=document.getElementById("noise1").value;
	var lightrating=document.getElementById("light1").value;
	var smellrating=document.getElementById("smells1").value;
	var string =""+noiserating+lightrating+smellrating;
	console.log(string);
	/*send string to server*/
	$.ajax({
		/* url:server?string 				?? */
		url: "data/dataExample.json?noise=3&light=2&smells="+4,	//Needs to be replaced with server url so that server knows to get data pertaining to the given location's id. Currently takes data from dummy data
		dataType:"json"
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
	var addNewForm=$('.form-container').serializeArray();
	var loginFormObject={};
	$.each(addNewForm,
		function(i,v){
			loginFormObject[v.name]=v.value;
		});
	console.log(addNewForm);
}

function close1(){
	var form =document.getElementById("addLocationForm");
	form.preventDefault();
	form.style.display="none";	
}

function setText(data){
	var item1 = document.getElementById("content");
	var item =document.createElement("P");
	item.setAttribute("class","tabs");
	item.setAttribute("id","testing"+data.id);
	item.style.display="none";
	var nameplace =document.createElement("H1");
	var text =document.createTextNode(data.placeName);
	nameplace.appendChild(text);
	item.appendChild(nameplace);
	if(data.score.people <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Lots of people: \t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.movement <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("People moving chaotically: \t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.talking <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("People talking a lot: \t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.noise <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Lots of background noise: \t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.light <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Lots of light: \t\t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.lightBright <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Bright light: \t\t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.lightFlickering <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Flickering light: \t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.lightColourPeculiar <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Peculiar light colour: \t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.smells <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Strong smells: \t\t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.floorSticky <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Sticky floor: \t\t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.floorUneven <=2){
		answer ="no";
	}else{
		answer="yes";
	}
	text = document.createTextNode("Uneven floor: \t\t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.seatsHard <=3){
		answer ="soft";
	}else{
		answer="hard";
	}
	text = document.createTextNode("Seats hard or soft: \t\t\t\t\t\t" +answer+"\n");
	item.appendChild(text);
	if(data.score.seatsHard <=3){
		answer ="smooth";
	}else{
		answer="rough";
	}
	text = document.createTextNode("Textures smooth or rough: \t\t\t" +answer+"\n");
	item.appendChild(text);
	item1.appendChild(item);
	console.log(item);
	console.log(item1);
}
openModal();
closeModal();
