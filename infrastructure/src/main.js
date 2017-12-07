window.init = function(){

	// handle incoming vars
	var queryParams = $.getQueryParameters();
	//console.log(queryParams)

	// Add in any videos we need to pre-set for content sections
	for(i=0;i < IDR.events.length;i++){
		var e =IDR.events[i];
		console.log(e);
		if(e.video){
			$("#video_holder").append(
		    '<video id="video_'+e.id+'"width="1024" height="512" preload="auto" loop ><source src="'+e.video+'" type="video/mp4"></source></video>');
		}
	}

	//addRandomXs();
    
    initWebGL(); 
    $("#no-webgl-content").hide();

	//setInterval(addRandomDigitalText,100);
	
	// for testing
	
	//$("#landing").hide();

	// start background loaders
	// oncomplete of loading all background assets once, then show the "enter button"


}


window.addRandomXs = function(){
	for(i=0;i<30;i++){
		var t = Math.floor(Math.random()* window.innerHeight * .7); 
		var l = Math.floor(Math.random()* window.innerWidth) * .7; 
		$("#container").append("<div class'x' style='position:absolute; top:"+t+"px; left:"+l+"px; font-size:6px; opacity:.1;'>x</div>")
	}
}


window.addRandomDigitalText = function(){
	var t = window.innerHeight/2 + Math.floor(Math.random()*5) +200; 
	var l = 10; 
	var text = Date.now()* Math.random()
	$("body").append("<div id='randomText' class'x' style='position:absolute; top:"+t+"px; left:"+l+"px; font-size:10px; opacity:.1;'>"+text+"</div>");
	//$("#randomText").fadeOut();
	setTimeout(function(){$("#randomText").remove();},100);
}

var dataLayer = [];

/* enter butotn animations */
frameRate = 1000/30;
cellWidth = 180;
cellHeight = 280;
cols = 12;
curFrame = 0;
aniamteInFrames = [0,66];
aniamteRollOverFrames = [67,80];
aniamteRollOutFrames = [78,67];
aniamteOutFrames = [81,131];
enterButton = document.getElementById("enter-button");

showFrame = function(o,f){
	x = (curFrame%cols) * cellWidth;
	y = Math.floor(curFrame / cols) * cellHeight;
	o.style.backgroundPosition = -x + "px " + -y+ "px";
	//console.log("current frame:" + f);
	//console.log(x,y);
}

animate = function(o,frames){
	curFrame =frames[0];
	try{clearInterval(enterAnimation);}catch(e){}
	enterAnimation = null;
	enterAnimation = setInterval(function(){
		showFrame(o,curFrame);
		if(frames[0]<frames[1]){curFrame++;}
		if(frames[1]<frames[0]){curFrame--;}
		if(curFrame==frames[1]){
			clearInterval(enterAnimation);
			enterAnimation = null;
		}
	},frameRate);
}

enterOver = function(e){animate(enterButton,aniamteRollOverFrames)};
enterOut = function(e){animate(enterButton,aniamteRollOutFrames)};




// standard HTML event handlers
window.enterButtonClicked = function(e){
	//console.log("enter button clicked. attempt to start web audio if needed.");
	enterButton.removeEventListener("click",enterButtonClicked);
	trackEvent({'page':{'name':'Enter','path':'/enter'},'event':'vpv'});

	enterButton.removeEventListener("mouseover",enterOver);
	enterButton.removeEventListener("mouseout",enterOut);
	animate(enterButton,aniamteRollOutFrames);
	setTimeout(function(){animate(enterButton,aniamteOutFrames);},frameRate * (aniamteRollOutFrames[1]-aniamteRollOutFrames[1]));
										
	IDR.showingLanding = false;


	IDR.audio.playFromTo("detail",0,1);

	// hide the landing page
	$("#landing").removeClass("show");


	if(IDR.isMobile==true){
		$("footer").hide();
		$(".container").css("overflow","hidden");

	}

	// fade out the landing music, since each site exp. has own sounds
	IDR.audio.fadeOut("intro");

	// based on support serve correct version of site
	setTimeout(function(){
		if(IDR.webGLEnabled) { 
			var img = new Image();
			img.onload = function() {
				console.log("got earth map");
				initWebGL();
			}
			img.src = "assets/images/earth.jpg";
			
			$("#no-webgl-content").hide();
		} else { 
			initNoWebGL(); 
			$("#webgl-content").hide();
		}
		$("#landing").hide();
		$(".standard-header .titles").addClass("show");
		$(".mobile-header .title small").addClass("show");
		$(".mobile-header .title").addClass("show");
		window.cancelAnimationFrame(window.myReq);
		window.myReq= null;// kill that old render loop
	}, 3000);
	
	

}


window.signupClicked = function(e){
	showingSignup=true;
	trackEvent({'ea':{'name':'Nav','action':'signup','label':'SIGNUP CLICKED'},'event':'se'});
	IDR.audio.playFromTo("click",0,1);

	if($("#signupFormContainer").hasClass("show")){
		$("#signupFormContainer").removeClass("show");
	} else {
		$("#signupFormContainer").addClass("show");
	}
	
	
}


window.joinClicked = function(e){
	
	trackEvent({'ea':{'name':'Nav','action':'join','label':'JOIN CLICKED'},'event':'se'});
	IDR.audio.playFromTo("click",0,1);

	//open Join website
	window.open(IDR.nav[0].url);
	
}

window.onPlayerReady = function (event) {
	//event.target.playVideo();
	console.log("trailer is ready");
}

    
window.onPlayerStateChange = function(event) {

    if (event.data == YT.PlayerState.PLAYING ) { 
    	trackEvent({'media':{'action':'START','label':IDR.trailer.youtubeID},'event':'media'}); 
    	// clear any old intervals just in case
    	try{window.clearInterval(ytTimer);}catch(e){}

    	window.ytTimer = setInterval(function(){
    		// check YT player progress
    		duration = IDR.player.getCurrentTime() / IDR.player.getDuration();
    		//console.log(duration);
    		if( duration<.10 ){ 
    			// near strt of video, resert the flags
    			window.tracked20=false; window.tracked50=false; window.tracked75=false; window.tracked90=false; 
    		}
    		if( duration>=.20 && duration<.50 && !window.tracked20 ){ trackEvent({'media':{'action':"20%",'label':IDR.trailer.youtubeID},'event':'media'}); window.tracked20=true; }
    		if( duration>=.50 && duration<.75 && !window.tracked50 ){ trackEvent({'media':{'action':"50%",'label':IDR.trailer.youtubeID},'event':'media'}); window.tracked50=true;}
    		if( duration>=.75 && duration<.90 && !window.tracked75 ){ trackEvent({'media':{'action':"75%",'label':IDR.trailer.youtubeID},'event':'media'}); window.tracked75=true;}
    		if( duration>=.90 && duration<1 && !window.tracked90 ){ trackEvent({'media':{'action':"90%",'label':IDR.trailer.youtubeID},'event':'media'}); window.tracked90=true;}
    	},1000)

    }

    if (event.data == YT.PlayerState.ENDED ) { 
    	// clear any old intervals just in case
    	try{window.clearInterval(ytTimer);}catch(e){}
    	trackEvent({'media':{'action':'END','label':IDR.trailer.youtubeID},'event':'media'});
    }

    if (event.data == YT.PlayerState.PAUSED ) { 
    	// clear any old intervals just in case
    	try{window.clearInterval(ytTimer);}catch(e){}
    	// get current time
    	duration = ((IDR.player.getCurrentTime() / IDR.player.getDuration()) * 100) + "%";
    	trackEvent({'media':{'action': duration,'label':IDR.youtubeID},'event':'media'}) 
   	}

}
	



window.facebookClicked = function(e){
	console.log("show faebook share popup");
}

window.twitterClicked = function(e){
	console.log("show twitter share popup");
	
}

window.googleClicked = function(e){
	console.log("show google share popup");
	
}

window.youtubeClicked = function(e){
	console.log("show youtube");
	
	window.open(IDR.urlYouTubeChannel,'YouTube');
}

window.soundClicked = function(e){
	console.log("sound clicked");
	IDR.audio.playFromTo("click",0,1);
	if (IDR.soundOn) {
    	$("#sound .bar").addClass("noAnim");
   		IDR.soundOn = false;
   		IDR.audio.muteAll();
   		
  	} else {
    	$("#sound .bar").removeClass("noAnim");
    	IDR.soundOn = true;
    	IDR.audio.unMuteAll();
    	
  	}
	
}


// mobile event handlers
window.MsignupClicked = function(e){
	showingSignup=true;
	trackEvent({'ea':{'name':'Nav','action':'signup','label':'SIGNUP CLICKED'},'event':'se'});
	IDR.audio.playFromTo("click",0,1);

	if($("#signupFormContainer").hasClass("show")){
		$("#signupFormContainer").removeClass("show");
	} else {
		$("#signupFormContainer").addClass("show");
	}
	$(".share-links").removeClass("show");
}


window.MjoinClicked = function(e){
	
	trackEvent({'ea':{'name':'Nav','action':'join','label':'JOIN CLICKED'},'event':'se'});
	IDR.audio.playFromTo("click",0,1);

	//open Join website
	window.open(IDR.nav[0].url);
	
}


window.MticketsClicked = function(e){
	
	trackEvent({'ea':{'name':'Nav','action':'tickets','label':'GET TICKETS CLICKED'},'event':'se'});
	IDR.audio.playFromTo("click",0,1);

	//open Join website
	window.open(IDR.nav[3].url);
	
}

window.MtrailerClicked = function(e){
	window.trailerClicked();
	$(".share-links").removeClass("show");
}

// hamburger nav handler

$("#mobile-menu-button").click(function(e){
	if($("#mobile-overlay").hasClass("show")){
		hideMobileNav();
	} else {
		showMobileNav();
	}
	$(".share-links").removeClass("show");
});


// download button on gallery item clicked
$(".download-title").click(function(e){

	var d = $(this).attr("data-file");
	var n = $(this).attr("data-name");
	trackEvent({'ea':{'name':'Download','action':n,'label':'(not set)'},'event':'se'});

	// test if we can use downlaod method
	if(IDR.isDownloadSupported){
		var link = document.createElement("a");
		document.body.appendChild(link);
	    link.download = n;
	    link.href = d;
	    link.click();
		document.body.removeChild(link);
	} else {
		// fallback to old way
		window.open(d,n);
	}

});


// video button on gallery item clicked
$(".video-title").click(function(e){
	var d = $(this).attr("data-file");
	var n = $(this).attr("data-name");
	
	window.open(d,n);
	
});


// twitter detail share 
$(".share-twitter").click(function(e){
	var text = $(this).attr("data-text");
	if(!text){text="United We Survive. The War of 1996. Independce Day Resurgence."}
	var url = $(this).attr("data-url");
	if(!url){"http://warof1996.com";}
	var label = $(this).attr("data-label");

	trackEvent({'social':{'network':'Twitter','action':'Tweet','target':url},'event':'sa'});
	
	//open twitter share window
	window.open("https://twitter.com/intent/tweet?hashtags=IDR&original_referer=http://warof1996.com&ref_src=twsrc%5Etfw&related=20thcenturyfox%3A20th%20Century%20Fox&text="+text+"&tw_p=tweetbutton&url="+url,"Twitter Share","width=550, height=420");
});


// facebook detail share 
$(".share-facebook").click(function(e){
	var text = $(this).attr("data-text");
	if(!text){text="United We Survive. The War of 1996. Independce Day Resurgence."}
	var url = $(this).attr("data-url");
	if(!url){"http://warof1996.com";}
	var label = $(this).attr("data-label");

	trackEvent({'social':{'network':'Facebook','action':'Share','target':url},'event':'sa'});
	//open facebook share window
	window.open("https://www.facebook.com/sharer/sharer.php?app_id=1667600636830643&sdk=joey&u="+url+"&display=popup&ref=plugin&src=share_button","Facebook Share","width=550, height=420");
});


// google detail share 
$(".share-google").click(function(e){
	var text = $(this).attr("data-text");
	if(!text){text="United We Survive. The War of 1996. Independce Day Resurgence."}
	var url = $(this).attr("data-url");
	if(!url){"http://warof1996.com";}
	var label = $(this).attr("data-label");
	trackEvent({'social':{'network':'G+','action':'Share','target':url},'event':'sa'});
	//open facebook share window
	window.open("https://plus.google.com/share?url="+url,"Google Share","width=550, height=420");

});


// analytics event tracking
window.trackEvent = function(e){
	console.log("Event Tracked", e);
	dataLayer.push(e);

}



/* helper */
jQuery.extend({

  getQueryParameters : function(str) {
	  return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
  }

});


function isMobile(){
	var isMobile = false; //initiate as false
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
	return isMobile;
}
showingSignup=false;
// init the app
init();