window.initNoWebGL = function(){
	console.log("Start No WebGL site experience.");

	$("#no-webgl-content").show().addClass("show");

	trackEvent({'page':{'name':'Begin','path':'/begin'},'event':'vpv'});

	// start the video 
	if(!IDR.deepLinkID){
		$("#no-webgl-content video")[0].play();
		$("#no-webgl-video").show().addClass("show");
		// show the buttons
		$("#explore-button").addClass("show");
		IDR.standardVideoPaused = false;
		IDR.galleryIndex = 0;
	} else {
		// show the buttons
		$("#play-button").addClass("show");
		$("#no-webgl-video").show().addClass("show");
		IDR.standardVideoPaused = true;
		IDR.galleryIndex = IDR.deepLinkID-1;
		$("#explore-button").addClass("active");
		$("#play-button").removeClass("active");
		$("#no-webgl-video").removeClass("show");
		$("#gallery").addClass("show");
		showGalleryItem();
	}

	// add listeners for the play and explore buttons
	$("#no-webgl-content video").click(function(e){
		if(IDR.standardVideoPaused){
			resumeVideo();
		} else {
			pauseVideo();
		}
	});

	
	IDR.showingSynopsis = false;

	window.pauseVideo = function(){
		console.log("video paused");
		$("#no-webgl-content video")[0].pause();
		IDR.standardVideoPaused = true;
		IDR.audio.play("ambient");
	}

	window.resumeVideo =function(){
		console.log("video resume");
		$("#no-webgl-content video")[0].play();
		IDR.standardVideoPaused = false;
		IDR.audio.fadeOut("ambient");
	}

	// whitmore  play button clciked
	$("#play-button").click(function(e){
		trackEvent({'ea':{'name':'Nav','action':'AutoPlay','label':'AUTOPLAY'},'event':'se'}) ;
		//trackEvent({'page':{'name':'Autoplay','path':'/autoplay'},'event':'vpv'});
		$("#play-button").removeClass("show");
		$("#explore-button").addClass("show");
		$("#no-webgl-video").addClass("show");
		$("#gallery").removeClass("show");
		hideGalleryItem();
		resumeVideo();
		
	});


	// explore button clicked
	$("#explore-button").click(function(e){
		trackEvent({'ea':{'name':'Nav','action':'Explore','label':'EXPLORE'},'event':'se'}) ;
		$("#explore-button").removeClass("show");
		$("#play-button").addClass("show");
		$("#no-webgl-video").removeClass("show");
		$("#gallery").addClass("show");
		pauseVideo();
		showGalleryItem();
	});




	function showGalleryItem(){
		var e = IDR.events[IDR.galleryIndex];
		// sub in all the text and dynamic data
    	$(".synopsis").html(e.synopsis);
    	$(".event-text").html(e.title);
    	$(".date-text").html(e.date);


    	trackEvent({'page':{'name':'Explore - '+ e.title ,'path':'/explore/'+ e.title },'event':'vpv'});

    	// update share buttons
    	if(e.short_url){url==e.short_url;} else {url = location.protocol + '//' + location.host+"/" + e.slug; }
    	
		$(".share-twitter").attr("data-url",url);
		$(".share-twitter").attr("data-label", e.title);
		$(".share-twitter").attr("data-text", e.twitter_share_text);

		$(".share-facebook").attr("data-url",url);
		$(".share-facebook").attr("data-label", e.title);
		$(".share-facebook").attr("data-text", e.twitter_share_text);

		$(".share-google").attr("data-url",url);
		$(".share-google").attr("data-label", e.title);
		$(".share-google").attr("data-text", e.twitter_share_text);

    	// handle downlaod
    	if(e.download){
    		$(".download-title").attr("data-file",e.download);
    		$(".download-title").attr("data-name",e.title);
    		$(".download-title").css("display","block");
    	} else {
    		$(".download-title").css("display","none");
    	}

    	if(e.video){
    		$(".video-title").attr("data-file",e.video);
    		$(".video-title").attr("data-name",e.title);
    		$(".video-title").css("display","block");
    	} else {
    		$(".video-title").css("display","none");
    	}
    	// handle media
    	// iamge only
    	$("#gallery-asset-container").html("<img src='"+e.image[0]+"' />");


	    if(!IDR.isPortrait && window.width>760){
			setTimeout(function(e){$("#right-content").addClass("show");},1000);		
		}

		$("#gallery-buttons").addClass("show");

		$("#right-content").css("display","block");
		$("#left-content").css("display","block");
		setTimeout(function(e){$("#left-content").addClass("show");},500);
		setTimeout(function(e){$("#gallery-asset-container").addClass("show");},500);
	}

	function hideGalleryItem(){
		var e = IDR.events[IDR.galleryIndex];
		trackEvent({'page':{'name':'Explore  - '+ e.title,'path':'/explore/'+ e.title + '/view'},'event':'vpv'});
		$("#left-content").removeClass("show");
		$("#right-content").removeClass("show");
		$("#left-content").css("display","none"); $("#right-content").css("display","none"); 
		$("#gallery-asset-container").removeClass("show");
	}


	// view synopsis
	$("#view-synopsis").click(function(e){ 
		window.trackEvent({label:"view synopsis clicked"}); 
		toggleSynopsis();
	});

	$("#hide-synopsis").click(function(e){ 
		window.trackEvent({label:"hide synopsis clicked"}); 
		toggleSynopsis();
	});



	function toggleSynopsis(){
		if(IDR.showingSynopsis){
			// hide it
			$("#right-content").removeClass("show");
			$("#left-content").addClass("show");
			$("#gallery-buttons").addClass("show");
			IDR.showingSynopsis = false;
		} else {
			// show it
			$("#right-content").addClass("show");
			$("#left-content").removeClass("show");
			$("#gallery-buttons").removeClass("show");
			IDR.showingSynopsis = true;
		}
	}


	// gallery next button clicked
	$("#gallery-next-button").click(function(e){
		window.trackEvent({label:"gallery next button clicked"});
		hideGalleryItem();
		IDR.galleryIndex++;
		if(IDR.galleryIndex==IDR.events.length) { IDR.galleryIndex=0;}
		setTimeout(function(){showGalleryItem();},1000);
		var e = IDR.events[IDR.galleryIndex];
		trackEvent({'page':{'name':'Fallback - '+ e.title,'path':'/fallback/'+ e.title},'event':'vpv'});
	});


	// gallery next button clicked
	$("#gallery-back-button").click(function(e){
		window.trackEvent({label:"gallery back button clicked"});
		hideGalleryItem();
		IDR.galleryIndex--;
		if(IDR.galleryIndex==-1) { IDR.galleryIndex=IDR.events.length-1;}
		setTimeout(function(){showGalleryItem();},1000);
		var e = IDR.events[IDR.galleryIndex];
		trackEvent({'page':{'name':'Fallback - '+ e.title,'path':'/fallback/'+ e.title},'event':'vpv'});
	});
	
}