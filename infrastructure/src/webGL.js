// decalre global vars
var three, camera, composer, renderer, effect, scene, timeline, earth, earthContainer, skybox, innerRing, outerRing, ambientLayer, blurs;
var hotspot, dirLight1, dirLight2, ambientLight, detailViewScreen, viewScreen, viewScreen2, viewScreen3, viewScreen4, closeButton;
var fire1, fire2, fire3, fire4;
var hadClickedTimelineHotSpot = false;
var waitingToReplay = false;
var radius = 160;
var hotspotYOffset = 0.45;
var targetRotationX = Math.PI / 180 * -91;
var targetRotationOnMouseDownX = 0;
var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;
var targetEarthRotationX = 0;
var targetEarthRotationOnMouseDownX = 0;
var targetEarthRotationY = 0;
var targetEarthRotationOnMouseDownY = 0;
var targetSceneRotationY = 0;
var targetSceneRotationX = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var finalRotationY;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var PI2 = Math.PI * 2;
var objects = [];
var locked = false;
var showingDetail = false;
var showingSynopsis = false;
var grabbedEarth = false;
var grabbedTimeline = false;
var lastTime = Date.now();
var playSpeed = 0;
var finishedDrift = true;
var minRot = 1.5882496193366493;
var maxRot = 6.494548660368968;
var hotspot_alt1 = new THREE.Object3D(),
	hotspot_alt2 = new THREE.Object3D();
var currentTime = 0.0;

window.initWebGL = function () {
	console.log("Start WebGL experience.");
	// init the canvas and key elements
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setClearColor(0x000000);
	//renderer.setPixelRatio( window.devicePixelRatio ); // do  in need this?
	renderer.setSize($("#webgl-content").width(), $("#webgl-content").height());
	$("#webgl-content").append(renderer.domElement);

	// set a camera
	camera = new THREE.PerspectiveCamera(45, $("#webgl-content").width() / $("#webgl-content").height(), 1, 100000);
	camera.position.z = 550;

	scene = new THREE.Scene();
	scene.rotation.set(0, 0, 0);



	var w = $("#webgl-content").width();
	var h = $("#webgl-content").height();
	var canvas = renderer.domElement;
	// if i need to add this font, find a bold, one this is too light for canvas
	$(canvas).css({
		"font-family": "Borda"
	});

	var gl = canvas.getContext("webgl");
	if (!gl) {
		var gl = canvas.getContext("experimental-webgl");
	}

	// add stats, remove later
	//stats = new Stats();
	//document.body.appendChild( stats.domElement );  

	// set hotspot array for fast index lookup
	IDR.eventIndex = [];
	for (i = 0; i < IDR.events.length; i++) {
		IDR.eventIndex.push(IDR.events[i].month + "-" + IDR.events[i].year);
	}


	// add background skybox
	addSkyBox();



	// add outer ring
	addOuterRing();


	// add earth
	addEarth();

	//add ships
	addShips();

	// add city lines
	addCityLines();

	// add hotspot
	createHotSpot();
	createAltHotSpot(hotspot_alt1, IDR.alt_events[0]);
	createAltHotSpot(hotspot_alt2, IDR.alt_events[1]);

	// add close button
	createCloseButton();

	// add timeline
	addTimeline();

	// add detailViewScreen
	addDetailViewScreen();



	// add lighting
	addLights();

	// add event listners
	addEventListeners();




	// start after slight delay to allow init to run.
	setTimeout(function () {
		start();
	}, 500);

	/* RENDER ANIAMTION LOOP */
	// first remove any non webgl render loops
	window.render = null;
	render();

	function render() {
		requestAnimationFrame(render);
		if (skybox && earth) {
			skybox.rotation.x = earth.rotation.x * .25;
			skybox.rotation.y = earth.rotation.y - Math.PI / 180 * 30 * .25;
			skybox.rotation.z = earth.rotation.z * .25;
		}


		if (IDR.mode == "explore" && earth && !locked) {
			//console.log("here");
			earth.rotation.y += (targetEarthRotationX - earth.rotation.y) * 0.05;
			earth.rotation.x += (targetEarthRotationY - earth.rotation.x) * 0.05;
		}

		if (IDR.mode == "play" && earth && !showingDetail) {
			earth.rotation.y -= .0005;
			//camera.rotation.x=  earth.rotation.y * .0005;
		}

		if (targetSceneRotationY && targetSceneRotationX) {
			scene.rotation.y += ((targetSceneRotationY - scene.rotation.y) * .05);
			scene.rotation.x += ((targetSceneRotationX - scene.rotation.x) * .05);
			/*
			viewScreen.position.z = Math.abs(scene.rotation.y * 180/Math.PI * 3);
			viewScreen.material.uniforms["amount"].value = Math.abs(scene.rotation.y * 180/Math.PI * .005);
			viewScreen3.position.z = Math.abs(scene.rotation.y * 180/Math.PI * 3);
			if(viewScreen3.material.uniforms){
				viewScreen3.material.uniforms["amount"].value = Math.abs(scene.rotation.y * 180/Math.PI * .005);
			}
			*/
		}

		if (timeline) {
			// if dragging or if finsihing a spin
			if (grabbedTimeline || !finishedDrift) {
				// rotate the dials
				timeline.dial.rotation.y += (-targetRotationX - timeline.dial.rotation.y) * 0.05;

				// check if we are close enough to stopped to say finsihed drifting
				//console.log(Math.abs(( -targetRotationX -  timeline.dial.rotation.y ) * 0.05));

				if (!finishedDrift) {
					if (Math.abs((-targetRotationX - timeline.dial.rotation.y) * 0.05) < .00001) {
						finishedDrift = true;
						playSpeech();
						//console.log("finsihed drift"); 
						//targetRotationX =-timeline.dial.rotation.y; 
						if (hadClickedTimelineHotSpot == true && hotspot.event_data) {
							$("#preview").click();
							hadClickedTimelineHotSpot = false;
						}
					}
				}

			}

			// only if not drggaging, not drifting, and is speech playing

			if (IDR.mode == "play" && IDR.speechPlaying && finishedDrift && !grabbedTimeline) {
				deltaTime = (Date.now() - lastTime) / 1000;
				lastTime = Date.now();
				timeline.dial.rotation.y += playSpeed * deltaTime;
				targetRotationX = -timeline.dial.rotation.y;
			} else {
				lastTime = Date.now();
				//targetRotationX = -timeline.dial.rotation.y;
			}


			// add clamping or tweaks to speed etc here
			//if(timeline.dial.rotation.y>maxRot) { timeline.dial.rotation.y = maxRot;}
			//if(timeline.dial.rotation.y<minRot) { timeline.dial.rotation.y = minRot;}
			if (-targetRotationX < minRot) {
				targetRotationX = -minRot;
			}
			if (-targetRotationX > maxRot) {
				targetRotationX = -maxRot;
			}
			timeline.outerDial.rotation.y = .5 * timeline.dial.rotation.y;
			//console.log(timeline.dial.rotation.y);



			newRot = Math.round(timeline.dial.rotation.y * 180 / Math.PI * 10) / 10;
			if (IDR.timeLineRot != newRot) {
				IDR.timeLineRot = newRot;
				onTimeLineUpdated();
			}

		}


		renderer.render(scene, camera);

		//if using post processing
		//renderer.clear();
		//composer.render();


		TWEEN.update();
		//stats.update();
	}
	/* END ANIMATION LOOP */





	// move down later

	function onTimeLineUpdated() {
		var r = Math.round((IDR.timeLineRot - 90) * 100) / 100;
		//console.log(r,timeline.dial.rotation.y);
		var y = 1996,
			m = 1,
			d = 1;

		if (r < 7 && r >= 1) {
			// first 7 months
			y = Math.floor(r / 12) + 1996;
			m = Math.floor(r) % 12;
			if (m != 2) {
				d = Math.floor((r - (y - 1996) - m) * 30) + 1;
			} else {
				d = Math.floor((r - (y - 1996) - m) * 28) + 1;
			}

		} else if (r >= 7 && r < 42) {
			// 3 days of attack
			m = 7;
			y = 1996;
			d = Math.floor((r - 6) / 12) + 2;

		} else if (r >= 42 && r < 288) {
			var y = Math.floor((r - 36) / 12) + 1996;
			var m = Math.floor(r - 36) % 12 + 1;
			//console.log((r -((y-1996)*12)-m-35));
			if (m != 2) {
				d = Math.floor(((r - ((y - 1996) * 12) - m - 35)) * 30) + 1;
			} else {
				d = Math.floor(((r - ((y - 1996) * 12) - m - 35)) * 28) + 1;
			}
		} else if (r >= 288) {
			y = 2017;
			m = 1;
			d = 30;
		} else if (r < 1) {
			y = 1996;
			m = 1;
			d = 1;
		}


		// check if triggering a show  hotspot event

		var i = IDR.eventIndex.indexOf(m + "-" + y);

		if (i != -1 && IDR.showingEventIndex != i) {
			// new show event triggered
			IDR.showingEventIndex = i;
			hotspot.event_data = IDR.events[i];
			hotspot.hide();
			setTimeout(function () {
				hotspot.show();
			}, 300);
			console.log(i);
			if (i == 1) {
				// show the alt hotspots as well
				setTimeout(function () {
					hotspot_alt1.show();
				}, 300);
				//setTimeout(function(){hotspot_alt2.show();},500);
			} else {
				hotspot_alt1.hide();
				hotspot_alt2.hide();
			}
		}

		if (r >= 288) {
			y = 2017;
			m = 1;
			d = 30;
		}


		// handler for "sticky dates"
		// need to show hotspot date for longer....
		var dm = IDR.eventIndex.indexOf(m + "-" + y);
		if (i != -1) {
			d = IDR.events[i].day;
		}

		if (d == 1 && m == 12 && y == 1997) {
			d = 30;
			y = 1997;
			m = 11;
		}


		// format strings
		if (m < 10) {
			m = "0" + m;
		}
		if (d < 10) {
			d = "0" + d;
		}

		//y=(""+y).substring(2,4);

		//update the date field
		$("#date-content .month").html(m);
		$("#date-content .day").html(d);
		$("#date-content .year").html(y);

		//debug
		//console.log(m,d,y);

		// if special moment

		//console.log("r:" + r);


		if (r >= 290 && IDR.mode == "play") {
			// stop timeline from moving
			playSpeed = 0;
			clearInterval(IDR.progressTimer);
			IDR.progressTimer = null;
			speechPlaying = false;

			if (!waitingToReplay) {
				// start replay timer
				waitingToReplay = true;
				IDR.replayTimer = setTimeout(function () {
					clearTimeout(IDR.replayTimer)
					IDR.replayTimer = null;
					pauseSpeech();
					$("#webgl-content").removeClass("show");

					setTimeout(function () {
						locked = false;
						finishedDrift = false;
						hadClickedTimelineHotSpot = false;
						hotspot.event_data = null;
						IDR.showingEventIndex = null;
						timeline.dial.rotation.y = 1.589;
						targetRotationX = -1.589;
						setTimeout(function () {
							playSpeech();
							waitingToReplay = false;
						}, 500);
					}, 3000);

					setTimeout(function () {
						$("#webgl-content").addClass("show");
					}, 4000);

				}, 9000);
			}
		}


		// ship controller
		for (k = 0; k < (36); k++) {
			IDR.ships[k].update(r);
		}


		// line length 
		for (k = 0; k < (36 * 4); k++) {
			IDR.lines[k].update(r);
		}

		// radial circles
		outerRing.rotation.z += .0005;

	}




	/* ADD EVENT LISTENERS */
	function addEventListeners() {

		// listen for resize
		window.addEventListener('resize', onWindowResize, false);

		function onWindowResize() {
			console.log("got resize event")
			renderer.setSize($("#webgl-content").width(), $("#webgl-content").height());
			camera.aspect = $("#webgl-content").width() / $("#webgl-content").height();
			camera.updateProjectionMatrix();

			if (window.innerWidth < window.innerHeight) {
				IDR.isPortrait = true;
				camera.position.z = 700;
				// adjust timeline
				if (timeline) {
					timeline.position.z = 670 - window.innerWidth * .01;
					if (!showingDetail) {
						timeline.position.y = -60 - window.innerWidth * .003;
					}
				}
			} else {
				IDR.isPortrait = false;
				camera.position.z = 550;
				if (timeline) {
					// adjust timeline
					timeline.position.z = 530 - window.innerWidth * .01;
					if (!showingDetail) {
						timeline.position.y = -55 - window.innerWidth * .003;
					}
				}
			}



		}
		onWindowResize();



		// view synopsis
		$("#view-synopsis").click(function (e) {
			e.preventDefault();
			console.log("got view synipsis button click");
			//window.trackEvent({label:"view synopsis clicked"}); 
			toggleSynopsis();
			IDR.audio.playFromTo("click", 0, 1);
		});

		$("#hide-synopsis").click(function (e) {
			e.preventDefault();
			console.log("got hide synipsis button click");
			//window.trackEvent({label:"hide synopsis clicked"}); 
			toggleSynopsis();
			IDR.audio.playFromTo("click", 0, 1);
		});

		$("#preview").click(function (e) {
			showDetailView(hotspot.event_data);
			//IDR.audio.playFromTo("click",0,1);
			if (IDR.mode == "play" && IDR.speechPlaying) {
				pauseSpeech();
			}
			trackEvent({
				'ea': {
					'name': 'Nav',
					'action': 'Thumb',
					'label': hotspot.event_data.title
				},
				'event': 'se'
			});
		});


		// play button clicked
		$("#play-button").click(function (e) {
			trackEvent({
				'ea': {
					'name': 'Nav',
					'action': 'AutoPlay',
					'label': 'AUTOPLAY'
				},
				'event': 'se'
			});
			//wangjue
			//IDR.audio.playFromTo("click", 0, 1);
			$("#play-button").addClass("active");
			$("#explore-button").removeClass("active");
			playButtonClicked();

		});

		// explore button clicked
		$("#explore-button").click(function (e) {
			//wangjue
			//IDR.audio.playFromTo("click", 0, 1);
			trackEvent({
				'ea': {
					'name': 'Nav',
					'action': 'Explore',
					'label': 'EXPLORE'
				},
				'event': 'se'
			});
			$("#explore-button").addClass("active");
			$("#play-button").removeClass("active");
			exploreButtonClicked();

		});

		// mouse click
		document.addEventListener('mousedown', onDocumentMouseDown, false);

		function onDocumentMouseDown(event) {
			if (!showingSignup) {
				event.preventDefault();
			}
			document.addEventListener('mouseup', onDocumentMouseUp, false);
			document.addEventListener('mouseout', onDocumentMouseOut, false);

			mouseXOnMouseDown = event.clientX - windowHalfX;
			mouseYOnMouseDown = event.clientY - windowHalfY;

			// check for clicks
			mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
			mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);

			var intersects = raycaster.intersectObjects(objects, true);

			grabbedEarth = false;
			grabbedTimeline = false;


			if (intersects.length > 0) {


				if (intersects[0].object.userData.type == 'hotspot_target' || intersects[0].object.parent.userData.type == 'hotspot_target' || intersects[0].object.parent.parent.userData.type == 'hotspot_target') {
					var e = intersects[0].object.parent.event_data;
					console.log("intersects", e);
					if (IDR.mode == "play" && IDR.speechPlaying) {
						pauseSpeech();
					}
					showDetailView(e);
				}

				if (intersects[0].object.userData.type == 'close_target') {
					hideDetailView();
				}

				if (intersects[0].object.userData.type == 'earth' || intersects[0].object.parent.userData.type == 'earth' || intersects[0].object.parent.parent.userData.type == 'earth') {
					targetEarthRotationOnMouseDownX = targetEarthRotationX;
					targetEarthRotationOnMouseDownY = targetEarthRotationY;
					grabbedEarth = true;
					console.log("earth grabbed");

				}

				if (intersects[0].object.userData.type == 'timeline' || intersects[0].object.parent.userData.type == 'timeline' || intersects[0].object.parent.parent.userData.type == 'timeline') {
					targetRotationOnMouseDownX = targetRotationX;
					//targetRotationOnMouseDownY = targetRotationY;
					grabbedTimeline = true;
					if (IDR.mode == "play" && IDR.speechPlaying) {
						pauseSpeech();
					}
					console.log("timeline grabbed");
				}


				if (intersects[0].object.userData.type == 'timeline_hotspot' || intersects[0].object.parent.userData.type == 'timeline_hotspot') {
					document.body.style.cursor = "pointer";
					console.log("got hotspot on timeline:" + intersects[0].object.userData.index);
					if (intersects[0].object.userData.index) {
						console.log("index we got:" + intersects[0].object.userData.index);
						finishedDrift = false;
						hadClickedTimelineHotSpot = true;
						targetRotationX = -getHotSpotRot(intersects[0].object.userData.index - 1);
					} else if (intersects[0].object.parent.userData.index) {
						//goToEvent(intersects[ 0 ].object.parent.userData.index);
						console.log("index we got:" + intersects[0].object.parent.userData.index);
						finishedDrift = false;
						hadClickedTimelineHotSpot = true;
						targetRotationX = -getHotSpotRot(intersects[0].object.parent.userData.index - 1);
					}


				}

			}
		}

		// touch click
		document.addEventListener('touchstart', onDocumentTouchStart, false);

		function onDocumentTouchStart(event) {

			document.addEventListener('touchend', onDocumentMouseUp, false);

			if (event.touches.length == 1) {
				//console.log("touch");
				//event.preventDefault();

				mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
				mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;


				mouse.x = +(event.targetTouches[0].pageX / window.innerWidth) * 2 - 1;
				mouse.y = -(event.targetTouches[0].pageY / window.innerHeight) * 2 + 1;



				raycaster.setFromCamera(mouse, camera);

				var intersects = raycaster.intersectObjects(objects, true);

				grabbedEarth = false;
				grabbedTimeline = false;


				if (intersects.length > 0) {


					if (intersects[0].object.userData.type == 'hotspot_target' || intersects[0].object.parent.userData.type == 'hotspot_target' || intersects[0].object.parent.parent.userData.type == 'hotspot_target') {
						var e = intersects[0].object.parent.event_data;
						//console.log("intersects", e);
						if (IDR.mode == "play" && IDR.speechPlaying) {
							pauseSpeech();
						}
						showDetailView(e);
					}

					if (intersects[0].object.userData.type == 'close_target' || intersects[0].object.parent.userData.type == 'close_target') {
						hideDetailView();
					}

					if (intersects[0].object.userData.type == 'earth' || intersects[0].object.parent.userData.type == 'earth' || intersects[0].object.parent.parent.userData.type == 'earth') {
						targetEarthRotationOnMouseDownX = targetEarthRotationX;
						targetEarthRotationOnMouseDownY = targetEarthRotationY;
						grabbedEarth = true;
						//console.log("earth grabbed");

					}

					if (intersects[0].object.userData.type == 'timeline' || intersects[0].object.parent.userData.type == 'timeline' || intersects[0].object.parent.parent.userData.type == 'timeline') {
						targetRotationOnMouseDownX = targetRotationX;
						//targetRotationOnMouseDownY = targetRotationY;
						grabbedTimeline = true;
						if (IDR.mode == "play" && IDR.speechPlaying) {
							pauseSpeech();
						}
						//console.log("timeline grabbed");
					}





					if (intersects[0].object.userData.type == 'timeline_hotspot' || intersects[0].object.parent.userData.type == 'timeline_hotspot') {
						document.body.style.cursor = "pointer";
						//console.log("got hotspot on timeline:" + intersects[ 0 ].object.userData.index);
						if (intersects[0].object.userData.index) {
							//console.log("index we got:" + intersects[ 0 ].object.userData.index);
							finishedDrift = false;
							hadClickedTimelineHotSpot = true;
							targetRotationX = -getHotSpotRot(intersects[0].object.userData.index - 1);
						} else if (intersects[0].object.parent.userData.index) {
							//goToEvent(intersects[ 0 ].object.parent.userData.index);
							//console.log("index we got:" + intersects[ 0 ].object.parent.userData.index);
							finishedDrift = false;
							hadClickedTimelineHotSpot = true;
							targetRotationX = -getHotSpotRot(intersects[0].object.parent.userData.index - 1);
						}


					}

				}

			}

		}

		// drag with touch
		document.addEventListener('touchmove', onDocumentTouchMove, false);

		function onDocumentTouchMove(event) {

			if (event.touches.length == 1) {

				//event.preventDefault();

				mouseX = event.touches[0].pageX - windowHalfX;
				mouseY = event.touches[0].pageY - windowHalfY;
				if (grabbedTimeline) {
					targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.002;
					targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.003;
				}

				if (grabbedEarth) {
					targetEarthRotationX = targetEarthRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.005;
					targetEarthRotationY = targetEarthRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.005;
				}

			}

		}


		// drag with mouse
		document.addEventListener('mousemove', onDocumentMouseMove, false);

		function onDocumentMouseMove(event) {

			mouseX = event.clientX - windowHalfX;
			mouseY = event.clientY - windowHalfY;

			if (grabbedTimeline) {
				targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.002;
				targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.003;
			}

			if (grabbedEarth) {
				targetEarthRotationY = targetEarthRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.005;
				targetEarthRotationX = targetEarthRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.005;
			}

			mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
			mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			var intersects = raycaster.intersectObjects(objects, true);

			document.body.style.cursor = "default";

			if (intersects.length > 0) {

				//console.log(intersects[0].object.userData.type);
				if (IDR.mode == "explore") {
					if (intersects[0].object.userData.type == "earth" || intersects[0].object.parent.userData.type == "earth") {
						document.body.style.cssText = "cursor: -moz-grab; cursor: -webkit-grab; cursor: grab;";
					}
				}

				if (intersects[0].object.userData.type == 'timeline' || intersects[0].object.parent.userData.type == 'timeline' || intersects[0].object.parent.parent.userData.type == 'timeline') {
					document.body.style.cursor = "ew-resize";
				}

				if (intersects[0].object.userData.type == 'hotspot_target' || intersects[0].object.parent.userData.type == 'hotspot_target' || intersects[0].object.parent.parent.userData.type == 'hotspot_target') {
					document.body.style.cursor = "pointer";
				}

				if (intersects[0].object.userData.type == 'timeline_hotspot' || intersects[0].object.parent.userData.type == 'timeline_hotspot') {
					document.body.style.cursor = "pointer";
					//console.log("got hotspot on timeline:" + intersects[ 0 ].object.userData.index);

				}

				if (intersects[0].object.userData.type == 'close_target' || intersects[0].object.parent.userData.type) {
					document.body.style.cursor = "pointer";
				}

			}


		}

		// mouse / touch up
		function onDocumentMouseUp(event) {

			// document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
			document.removeEventListener('mouseup', onDocumentMouseUp, false);
			document.removeEventListener('mouseout', onDocumentMouseOut, false);
			if (grabbedTimeline) {
				finishedDrift = false;
			}
			grabbedEarth = false;
			grabbedTimeline = false;
			document.removeEventListener('touchend', onDocumentMouseUp, false);
		}

		// mouse / touch out
		function onDocumentMouseOut(event) {

			// document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
			document.removeEventListener('mouseup', onDocumentMouseUp, false);
			document.removeEventListener('mouseout', onDocumentMouseOut, false);
			if (grabbedTimeline) {
				finishedDrift = false;
			}
			grabbedEarth = false;
			grabbedTimeline = false;


		}



		window.onDocumentMouseMoveDetail = function (event) {

			mouseX = event.clientX - windowHalfX;
			mouseY = event.clientY - windowHalfY;
			// if showing detail view add some parrllax
			if (showingDetail) {
				targetSceneRotationY = -mouseX * .00007;
				targetSceneRotationX = -mouseY * .0001;
			}

		}

		// need gyro equivelent for mobile


	}


	/* ADD SKYBOX */
	function addSkyBox() {
		// try adding as a curved plane, tansparnt , belnd mode etc...
		var geo = new THREE.SphereGeometry(1500, 40, 40);
		var mat = new THREE.MeshBasicMaterial({
			color: 0x7efaff,
			map: new THREE.TextureLoader().load("assets/images/stars.jpg"),
			side: THREE.BackSide,
			opacity: .1,
			transparent: true,
			blending: THREE.AdditiveBlending
		});
		skybox = new THREE.Mesh(geo, mat);
		scene.add(skybox);
	}


	/*  ADD INNER RING */
	function addInnerRing() {
		var geo = new THREE.PlaneGeometry(160, 160);
		var mat = new THREE.MeshLambertMaterial({
			map: new THREE.TextureLoader().load("assets/images/inner_ring.png"),
			transparent: true,
			blending: THREE.AdditiveBlending,
			opacity: .01
		});
		innerRing = new THREE.Mesh(geo, mat);
		innerRing.position.z = 210;
		//innerRing.rotation.x=-.2;
		//scene.add(innerRing);


		innerRing.show = function () {
			var tween = new TWEEN.Tween(this.material).to({
				opacity: .9
			}, 1000).start();
			tween.easing(TWEEN.Easing.Bounce.InOut);
			var tween = new TWEEN.Tween(this.material).to({
				opacity: .9
			}, 2000).start();
			tween.easing(TWEEN.Easing.Bounce.InOut);
		}


	}



	/*  ADD OUTER */
	function addOuterRing() {
		var geo = new THREE.PlaneGeometry(480, 480, 1, 1);
		var mat = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load("assets/images/radial_layers_medium.jpg"),
			transparent: true,
			opacity: 0,
			blending: THREE.AdditiveBlending
		});
		outerRing = new THREE.Mesh(geo, mat);
		outerRing.position.z = 320;
		//outerRing.position.y = -50;

		//outerRing.rotation.z=-2;



		outerRing.show = function () {
			//console.log("showing outer ring");
			scene.add(outerRing);
			var tween = new TWEEN.Tween(this.material).to({
				opacity: .4
			}, 1500).start();
			tween.easing(TWEEN.Easing.Bounce.Out);
			//var tween = new TWEEN.Tween(this.material).to({ opacity:.4 }, 500).delay(500).start();
			//tween.easing(TWEEN.Easing.Bounce.InOut);
		}

	}


	/*  ADD LIGHTS */
	function addLights() {
		//dirLight1 = new THREE.DirectionalLight(0x7efaff, 1.5);
		// this is the good light for the planet
		//dirLight1 = new THREE.DirectionalLight(0xD0FDFF, 1.5);
		//dirLight1.position.set(-.5, 1, 2).normalize();
		//scene.add(dirLight1);

		dirLight1 = new THREE.PointLight(0xD0FDFF, 1.1, 0);
		dirLight1.position.set(0, 0, 600);
		dirLight1.lookAt(0, 0, 0);
		scene.add(dirLight1);


		dirLight2 = new THREE.DirectionalLight(0x7efaff, 1);
		dirLight2.position.set(400, 400, 100);
		//dirLight2.lookAt(camera);
		scene.add(dirLight2);

		/*
				dirLight3 = new THREE.PointLight(0x7efaff,2,0);
				dirLight3.position.set(0,0,-200);
				dirLight3.lookAt(0,0,-500);
				scene.add(dirLight3);
		*/

		/*
				dirLight3 = new THREE.PointLight(0xff8340,1.1,500);
				dirLight3.position.set(0, 0, 700);
				dirLight3.lookAt(detailViewScreen.position);
				scene.add(dirLight3);
				*/

		/*
		dirLight2 = new THREE.DirectionalLight(0xffffff,1);
		dirLight2.position.set(-5, 5, 5);
		scene.add(dirLight2);
		*/
	}

	/*  ADD AMBIENT LAYERS */
	function addAmbientLayers() {

	}



	/*  ADD EARTH */
	function addEarth() {
		// add eaerth container
		earthContainer = new THREE.Object3D();
		earthContainer.rotation.x = (Math.PI / 180) * 10;
		earthContainer.rotation.z = (Math.PI / 180) * -20;
		earthContainer.rotation.y = (Math.PI / 180) * -20;
		var geo = new THREE.SphereGeometry(radius, 50, 50);
		var mat = new THREE.MeshLambertMaterial({
			map: new THREE.TextureLoader().load("assets/images/earth.jpg")
		});
		earth = new THREE.Mesh(geo, mat);
		earthContainer.add(earth);


		var geo = new THREE.SphereGeometry(radius + 1, 50, 50);
		fire1 = new THREE.TextureLoader().load("assets/images/fire1.png");
		fire2 = new THREE.TextureLoader().load("assets/images/fire2.png");
		fire3 = new THREE.TextureLoader().load("assets/images/fire3.png");
		fire4 = new THREE.TextureLoader().load("assets/images/fire4.png");
		mat = new THREE.MeshLambertMaterial({
			transparent: true,
			color: 0xff8340,
			blending: THREE.AdditiveBlending,
			opacity: .4,
			map: fire1
		});
		earth.earthC1 = new THREE.Mesh(geo, mat);
		earth.add(earth.earthC1);

		mat = new THREE.MeshLambertMaterial({
			transparent: true,
			color: 0xff8340,
			blending: THREE.AdditiveBlending,
			opacity: .4,
			map: fire2
		});
		earth.earthC2 = new THREE.Mesh(geo, mat);
		earth.add(earth.earthC2);

		mat = new THREE.MeshLambertMaterial({
			transparent: true,
			color: 0xff8340,
			blending: THREE.AdditiveBlending,
			opacity: .4,
			map: fire3
		});
		earth.earthC3 = new THREE.Mesh(geo, mat);
		earth.add(earth.earthC3);

		mat = new THREE.MeshLambertMaterial({
			transparent: true,
			color: 0xff8340,
			blending: THREE.AdditiveBlending,
			opacity: .4,
			map: fire4
		});
		earth.earthC4 = new THREE.Mesh(geo, mat);
		earth.add(earth.earthC4);





		var geo = new THREE.SphereGeometry(radius + 15, 40, 30);
		var mat = new THREE.MeshLambertMaterial({
			transparent: true,
			color: 0x2AC7CC,
			blending: THREE.AdditiveBlending,
			opacity: .4,
		});
		var egh = new THREE.EdgesHelper(new THREE.Mesh(geo, mat), 0x2AC7CC);
		egh.material.linewidth = .5;
		egh.material.transparent = true;
		egh.material.opacity = .08;
		earth.add(egh);

		var geo = new THREE.SphereGeometry(radius + 15, 20, 30);
		var mat = new THREE.MeshLambertMaterial({
			transparent: true,
			color: 0x2AC7CC,
			blending: THREE.AdditiveBlending,
			opacity: .8,
		});
		var egh = new THREE.EdgesHelper(new THREE.Mesh(geo, mat), 0x2AC7CC);
		egh.material.linewidth = .5;
		egh.material.transparent = true;
		egh.material.opacity = .15;
		earth.add(egh);

		var geo = new THREE.SphereGeometry(radius + 15, 50, 50);
		var mat = new THREE.MeshLambertMaterial({
			blending: THREE.AdditiveBlending,
			transparent: true,
			color: 0x2AC7CC,
			opacity: .6,
			map: new THREE.TextureLoader().load("assets/images/earth_political_alpha.png")
		});
		earthPol = new THREE.Mesh(geo, mat);
		earth.add(earthPol);
		ep2 = earthPol.clone();
		earth.add(ep2);

		// add earth orbital ring
		earth.ring = new THREE.Object3D();
		var r = radius + 60;
		var t = Math.PI / 180 * 2;
		var mat = new THREE.LineBasicMaterial({
			linewidth: .5,
			color: 0x6FD5F0,
			transparent: true,
			opacity: .4
		});

		var lineGeo = new THREE.Geometry();
		for (i = 0; i < 180; i++) {
			var x = r * Math.cos(t * i);
			var z = r * Math.sin(t * i);

			lineGeo.vertices.push(new THREE.Vector3(x * .985, 0, z * .985));
			lineGeo.vertices.push(new THREE.Vector3(x, 0, z));

			if (i % 5 == 0) {

				lineGeo.vertices.push(new THREE.Vector3(x * .965, 0, z * .965));
				lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
				lineGeo.vertices.push(new THREE.Vector3(x * .965, 0, z * .965));
				lineGeo.vertices.push(new THREE.Vector3(x, 0, z));

			}

			if (Math.floor((Math.random() * 10) + 1) == 1) {

				lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
				lineGeo.vertices.push(new THREE.Vector3(x, 5, z));


			}

			if (i % 10 == 0) {
				yr = 1996
				var pgeo = new THREE.PlaneGeometry(6, 3);
				var pmat = new THREE.MeshPhongMaterial({
					map: new THREE.TextureLoader().load("assets/images/years/" + yr + ".png"),
					transparent: true,
					opacity: 1,
					side: THREE.DoubleSide
				});
				p = new THREE.Mesh(pgeo, pmat);

				p.position.x = x * 1.02;
				p.position.z = z * 1.02;
				p.position.y = -1;
				p.lookAt(new THREE.Vector3(0, 0, 0));
				earth.ring.add(p);
				yr++;
			}

		}

		// now add all the lines as one piece of geometry
		var line = new THREE.LineSegments(lineGeo, mat);

		earth.ring.add(line);


		earth.add(earth.ring);


		scene.add(earthContainer);
		ep2userData = {
			type: "earth"
		};
		earth.userData = {
			type: "earth"
		};
		earthPol.userData = {
			type: "earth"
		};
		earth.earthC1.userData = {
			type: "earth"
		};
		earth.earthC2.userData = {
			type: "earth"
		};
		earth.earthC3.userData = {
			type: "earth"
		};
		earth.earthC4.userData = {
			type: "earth"
		};
		egh.userData = {
			type: "earth"
		};
		objects.push(earth);

	}





	/* ADD SHIPS */

	function addShips() {
		//create ship array
		IDR.ships = [];
		IDR.lasers = [];
		// create ship geo
		var lineGeo = new THREE.Geometry();

		var r = 7;
		var t = Math.PI / 20 * 2;

		var x = (r + 2) * Math.cos(t * 16.8);
		var z = (r + 2) * Math.sin(t * 16.8);

		var x2 = (r + 2) * Math.cos(t * 17.2);
		var z2 = (r + 2) * Math.sin(t * 17.2);

		var x3 = (r + 4) * Math.cos(t * 17);
		var z3 = (r + 4) * Math.sin(t * 17);

		lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
		lineGeo.vertices.push(new THREE.Vector3(x2, 0, z2));

		lineGeo.vertices.push(new THREE.Vector3(x2, 0, z2));
		lineGeo.vertices.push(new THREE.Vector3(x3, 0, z3));

		lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
		lineGeo.vertices.push(new THREE.Vector3(x3, 0, z3));

		var v1 = new THREE.Vector3(0, 0, 0);
		var v2 = new THREE.Vector3(30, 0, 0);
		var v3 = new THREE.Vector3(30, 30, 0);

		for (j = 0; j < 20; j++) {
			var x = r * Math.cos(t * j);
			var z = r * Math.sin(t * j);
			var x2 = r * Math.cos(t * j * 1.01);
			var z2 = r * Math.sin(t * j * 1.01);
			var x3 = r * Math.cos(t * j * .99);
			var z3 = r * Math.sin(t * j * .99);

			lineGeo.vertices.push(new THREE.Vector3(x * .8, 0, z * .8));
			lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
			lineGeo.vertices.push(new THREE.Vector3(x2 * .8, 0, z2 * .8));
			lineGeo.vertices.push(new THREE.Vector3(x2, 0, z2));
			lineGeo.vertices.push(new THREE.Vector3(x3 * .8, 0, z3 * .8));
			lineGeo.vertices.push(new THREE.Vector3(x3, 0, z3));

			if (j % 5 == 0) {
				lineGeo.vertices.push(new THREE.Vector3(x * 1.05, 0, z * 1.05));
				lineGeo.vertices.push(new THREE.Vector3(x * 1.4, 0, z * 1.4));
			}

			if ((j + 3) % 20 == 0) {
				lineGeo.vertices.push(new THREE.Vector3(x * .3, 0, z * .3));
				lineGeo.vertices.push(new THREE.Vector3(x * .7, 0, z * .7));
			}

		}

		// create ship mat
		var mat = new THREE.LineBasicMaterial({
			linewidth: 1,
			color: 0x6FD5F0,
			transparent: true,
			opacity: .4
		});

		// create ship mat
		var lasermat = new THREE.LineBasicMaterial({
			linewidth: 1.5,
			color: 0x6FD5F0,
			transparent: true,
			opacity: .4
		});

		// cycle to create 36 ships
		for (i = 0; i < 36; i++) {
			// create ship object using geo
			var ship = new THREE.Object3D();
			ship.shipMesh = new THREE.LineSegments(lineGeo, mat);
			ship.index = i;
			ship.add(ship.shipMesh);
			// add targets 1-4
			ship.targets = [];
			ship.targets.push(IDR.cities.phase1[i]);
			ship.targets.push(IDR.cities.phase2[i]);
			ship.targets.push(IDR.cities.phase3[i]);
			ship.targets.push(IDR.cities.phase4[i]);
			// add x,y,z pos for each target
			ship.positions = [];
			ship.positions.push(latLngToVector3(IDR.cities.phase1[i].lat, IDR.cities.phase1[i].lng, radius + 100));
			ship.positions.push(latLngToVector3(IDR.cities.phase1[i].lat, IDR.cities.phase1[i].lng, radius + 50));
			ship.positions.push(latLngToVector3(IDR.cities.phase2[i].lat, IDR.cities.phase2[i].lng, radius + 50));
			ship.positions.push(latLngToVector3(IDR.cities.phase3[i].lat, IDR.cities.phase3[i].lng, radius + 50));
			ship.positions.push(latLngToVector3(IDR.cities.phase4[i].lat, IDR.cities.phase4[i].lng, radius + 50));

			// and 36 lasers 
			var geo = new THREE.Geometry();
			geo.vertices.push(new THREE.Vector3(0, 0, 0));
			geo.vertices.push(new THREE.Vector3(0, 0, 50));
			var laser = new THREE.LineSegments(geo, lasermat);
			IDR.lasers.push(laser);
			addObjectAtLatLng(laser, IDR.cities.phase1[i].lat, IDR.cities.phase1[i].lng, 0);
			laser.lookAt(new THREE.Vector3(0, 0, 0));

			// ship.start
			ship.start = function () {
				this.shipMesh.material.opacity = .3;
				addObjectAtLatLng(this, this.targets[0].lat, this.targets[0].lng, 400);
			}


			ship.update = function (r) {
				// update position of each ship based on r value
				var pos = {};
				//pre war
				if (r < 7) {
					pos = this.positions[0];
					IDR.lasers[this.index].material.opacity = 0;

				}

				// to wave 1
				if (r >= 7 && r < 13) {
					p = ((r - 7) / 6);
					pos.x = this.positions[0].x + (p * (this.positions[1].x - this.positions[0].x));
					pos.y = this.positions[0].y + (p * (this.positions[1].y - this.positions[0].y));
					pos.z = this.positions[0].z + (p * (this.positions[1].z - this.positions[0].z));
					rotX = Math.PI / 180 * 90 * p;
					this.shipMesh.rotation.x = rotX;
				}

				// during wave 1
				if (r >= 13 && r < 20) {
					pos = this.positions[1];

				}


				// blast em wave 1
				if (r >= 15 && r < 17) {
					p = ((r - 15) / 2);
					IDR.lasers[this.index].position.set(this.positions[1].x, this.positions[1].y, this.positions[1].z);
					IDR.lasers[this.index].material.opacity = .8 * p;
					IDR.lasers[this.index].scale.z = 1 * p;


				}

				// blast em wave 1 done
				if (r >= 19 && r < 21) {
					p = ((r - 19) / 2);
					//IDR.lasers[this.index].position.set(this.positions[1].x, this.positions[1].y,this.positions[1].z);
					IDR.lasers[this.index].material.opacity = .8 * (1 - p);
					IDR.lasers[this.index].scale.z = 1;

					pos2 = latLngToVector3(IDR.cities.phase1[this.index].lat, IDR.cities.phase1[this.index].lng, radius - 50);
					pos2.x = IDR.lasers[this.index].position.x + (p * (pos2.x - IDR.lasers[this.index].position.x));
					pos2.y = IDR.lasers[this.index].position.y + (p * (pos2.y - IDR.lasers[this.index].position.y));
					pos2.z = IDR.lasers[this.index].position.z + (p * (pos2.z - IDR.lasers[this.index].position.z));
					IDR.lasers[this.index].position.set(pos2.x, pos2.y, pos2.z);


				}


				// to wave 2
				if (r >= 20 && r < 22) {
					p = ((r - 20) / 2);
					pos.x = this.positions[1].x + (p * (this.positions[2].x - this.positions[1].x));
					pos.y = this.positions[1].y + (p * (this.positions[2].y - this.positions[1].y));
					pos.z = this.positions[1].z + (p * (this.positions[2].z - this.positions[1].z));
				}

				// during wave 2
				if (r >= 22 && r < 26) {
					pos = this.positions[2];
				}


				// blast em wave 2
				if (r >= 22 && r < 24) {
					p = ((r - 22) / 2);
					IDR.lasers[this.index].position.set(this.positions[2].x, this.positions[2].y, this.positions[2].z);
					IDR.lasers[this.index].material.opacity = .8 * p;
					IDR.lasers[this.index].scale.z = 1 * p;

				}

				// blast em wave 2 done
				if (r >= 24 && r < 26) {
					p = ((r - 24) / 2);
					//IDR.lasers[this.index].position.set(this.positions[1].x, this.positions[1].y,this.positions[1].z);
					IDR.lasers[this.index].material.opacity = .8 * (1 - p);
					IDR.lasers[this.index].scale.z = 1;

					pos2 = latLngToVector3(IDR.cities.phase2[this.index].lat, IDR.cities.phase2[this.index].lng, radius - 50);
					pos2.x = IDR.lasers[this.index].position.x + (p * (pos2.x - IDR.lasers[this.index].position.x));
					pos2.y = IDR.lasers[this.index].position.y + (p * (pos2.y - IDR.lasers[this.index].position.y));
					pos2.z = IDR.lasers[this.index].position.z + (p * (pos2.z - IDR.lasers[this.index].position.z));
					IDR.lasers[this.index].position.set(pos2.x, pos2.y, pos2.z);

				}

				// to wave 3
				if (r >= 26 && r < 28) {
					p = ((r - 26) / 2);
					pos.x = this.positions[2].x + (p * (this.positions[3].x - this.positions[2].x));
					pos.y = this.positions[2].y + (p * (this.positions[3].y - this.positions[2].y));
					pos.z = this.positions[2].z + (p * (this.positions[3].z - this.positions[2].z));
				}

				// during wave 3
				if (r >= 28 && r < 34) {
					pos = this.positions[3];
				}

				// blast em wave 3
				if (r >= 29 && r < 31) {
					p = ((r - 29) / 2);
					IDR.lasers[this.index].position.set(this.positions[3].x, this.positions[3].y, this.positions[3].z);
					IDR.lasers[this.index].material.opacity = .8 * p;
					IDR.lasers[this.index].scale.z = 1 * p;


				}

				// blast em wave 3 done
				if (r >= 31 && r < 33) {
					p = ((r - 31) / 2);
					//IDR.lasers[this.index].position.set(this.positions[1].x, this.positions[1].y,this.positions[1].z);
					IDR.lasers[this.index].material.opacity = .8 * (1 - p);
					IDR.lasers[this.index].scale.z = 1;

					pos2 = latLngToVector3(IDR.cities.phase3[this.index].lat, IDR.cities.phase3[this.index].lng, radius - 50);
					pos2.x = IDR.lasers[this.index].position.x + (p * (pos2.x - IDR.lasers[this.index].position.x));
					pos2.y = IDR.lasers[this.index].position.y + (p * (pos2.y - IDR.lasers[this.index].position.y));
					pos2.z = IDR.lasers[this.index].position.z + (p * (pos2.z - IDR.lasers[this.index].position.z));
					IDR.lasers[this.index].position.set(pos2.x, pos2.y, pos2.z);

				}


				// to wave 4
				if (r >= 34 && r < 36) {
					p = ((r - 34) / 2);
					pos.x = this.positions[3].x + (p * (this.positions[4].x - this.positions[3].x));
					pos.y = this.positions[3].y + (p * (this.positions[4].y - this.positions[3].y));
					pos.z = this.positions[3].z + (p * (this.positions[4].z - this.positions[3].z));
				}


				// during wave 4
				if (r >= 36 && r < 46) {
					p = ((r - 36) / 10);
					pos = this.positions[4];
					this.shipMesh.material.opacity = .4 * (1 - p);
				}


				// blast em wave 4
				if (r >= 38 && r < 40) {
					p = ((r - 38) / 2);
					IDR.lasers[this.index].position.set(this.positions[4].x, this.positions[4].y, this.positions[4].z);
					IDR.lasers[this.index].material.opacity = .8 * p;
					IDR.lasers[this.index].scale.z = 1 * p;


				}

				// blast em wave 4 done
				if (r >= 41 && r < 43) {
					p = ((r - 41) / 2);
					//IDR.lasers[this.index].position.set(this.positions[1].x, this.positions[1].y,this.positions[1].z);
					IDR.lasers[this.index].material.opacity = .8 * (1 - p);
					IDR.lasers[this.index].scale.z = 1;

					pos2 = latLngToVector3(IDR.cities.phase4[this.index].lat, IDR.cities.phase4[this.index].lng, radius - 50);
					pos2.x = IDR.lasers[this.index].position.x + (p * (pos2.x - IDR.lasers[this.index].position.x));
					pos2.y = IDR.lasers[this.index].position.y + (p * (pos2.y - IDR.lasers[this.index].position.y));
					pos2.z = IDR.lasers[this.index].position.z + (p * (pos2.z - IDR.lasers[this.index].position.z));
					IDR.lasers[this.index].position.set(pos2.x, pos2.y, pos2.z);


				}



				// post war
				if (r >= 43) {
					pos = this.positions[4];

				}





				this.position.set(pos.x, pos.y, pos.z);
				this.lookAt(new THREE.Vector3(0, 0, 0));
				IDR.lasers[this.index].lookAt(new THREE.Vector3(0, 0, 0));

			}


			// add to IDR.ships
			IDR.ships.push(ship);
			ship.start();

		}


	}



	// add city lines to earth
	function addCityLines() {

		IDR.lines = [];
		var lineMatBlue = new THREE.MeshBasicMaterial({
			color: 0x3CD8FF,
			transparent: true,
			opacity: 0.3,
			blending: THREE.AdditiveBlending
		});
		var lineMatOrange = new THREE.MeshBasicMaterial({
			color: 0xff8340,
			transparent: true,
			opacity: 0.3,
			blending: THREE.AdditiveBlending
		});

		var hexMat = new THREE.MeshBasicMaterial({
			linewidth: 2,
			color: 0xff8340,
			transparent: true,
			opacity: 0.5
		});
		for (j = 0; j < 4; j++) {
			for (i = 0; i < 36; i++) {
				var line = new THREE.Object3D();
				line.city = IDR.cities["phase" + (j + 1)][i];

				// add hex
				hexGeo = new THREE.CircleGeometry(2, 6, 5);
				hexGeo.vertices.shift();
				line.hex = new THREE.Line(hexGeo, hexMat);
				line.hex.z = 40;
				line.add(line.hex);



				// add line
				h = Math.random() * 80 + 50;
				geo = new THREE.Geometry();
				geo.vertices.push(new THREE.Vector3(0, 0, 0));
				geo.vertices.push(new THREE.Vector3(0, 0, h));
				line.lineBlue = new THREE.LineSegments(geo, lineMatOrange);
				line.add(line.lineBlue);

				// add label
				labelGeo = new THREE.PlaneGeometry(32, 8);
				labelMat = new THREE.MeshBasicMaterial({
					side: THREE.DoubleSide,
					blending: THREE.AdditiveBlending,
					map: new THREE.TextureLoader().load("assets/images/city_labels/" + (j + 1) + "_" + (i + 1) + ".png"),
					transparent: true,
					opacity: 1
				});
				line.label = new THREE.Mesh(labelGeo, labelMat);
				line.label.position.z = h;
				line.label.position.x = 16;
				line.label.h = h;
				line.add(line.label);


				line.update = function (r) {
					h = this.lineBlue.scale.z;
					o = this.lineBlue.material.opacity;

					if (r < 19) {
						o = 0;
						h = 0.00001;
						earth.earthC1.material.opacity = 0;
						earth.earthC2.material.opacity = 0;
						earth.earthC3.material.opacity = 0;
						earth.earthC4.material.opacity = 0;
					}

					if (r > 19 && r < 29 && this.city.phase == 1) {
						o = .3;
						h = (r - 19) / 10;
						earth.earthC1.material.opacity = h;
						earth.earthC2.material.opacity = 0;
						earth.earthC3.material.opacity = 0;
						earth.earthC4.material.opacity = 0;
					}


					if (r > 23 && r < 33 && this.city.phase == 2) {
						o = .3;
						h = (r - 23) / 10;
						earth.earthC1.material.opacity = 1;
						earth.earthC2.material.opacity = h;
						earth.earthC3.material.opacity = 0;
						earth.earthC4.material.opacity = 0;
					}

					if (r > 30 && r < 40 && this.city.phase == 3) {
						o = .3;
						h = (r - 30) / 10;
						earth.earthC1.material.opacity = 1;
						earth.earthC2.material.opacity = 1;
						earth.earthC3.material.opacity = h;
						earth.earthC4.material.opacity = 0;
					}

					if (r > 40 && r < 50 && this.city.phase == 4) {
						o = .3;
						h = (r - 40) / 10;
						earth.earthC1.material.opacity = 1;
						earth.earthC2.material.opacity = 1;
						earth.earthC3.material.opacity = 1;
						earth.earthC4.material.opacity = h;
					}


					if (r > 50 && r < 250) {
						o = .3;
						h = 1 - (r - 50) / 200;

						h2 = 1 - (r - 50) / 20;

						earth.earthC1.material.opacity = h2;
						earth.earthC2.material.opacity = h2;
						earth.earthC3.material.opacity = h2;
						earth.earthC4.material.opacity = h2;
					}

					if (r < 19 || r > 250) {
						h = 0.00001;
						this.hex.material.opacity = 0;
						this.label.material.opacity = 0;
						earth.earthC1.material.opacity = 0;
						earth.earthC2.material.opacity = 0;
						earth.earthC3.material.opacity = 0;
						earth.earthC4.material.opacity = 0;

					} else {
						this.hex.material.opacity = .8;
						this.label.material.opacity = 1;
					}
					this.lineBlue.material.opacity = o;
					this.lineBlue.scale.z = h;
					this.label.position.z = this.label.h * h;
					//this.lineBlue.geometry.vertices[1] = new THREE.Vector3(0, 0, 50)
				}


				// add to earth
				addObjectAtLatLng(line, line.city.lat, line.city.lng, 17);

				// add to array
				IDR.lines.push(line);

				//line.scale.set(.001,.001,.001);
				//line.hex.material.opacity = 0;
				//line.lineBlue.material.opacity = 0;

			}
		}


	}




	/*  ADD HOTSPOT */
	function createHotSpot() {
		hotspot = new THREE.Object3D();

		var mat = new THREE.MeshBasicMaterial({
			blending: THREE.AdditiveBlending,
			color: 0xff8340,
			transparent: true,
			opacity: .6
		});

		var hexShape = new THREE.Shape();
		hexShape.moveTo(0, 10);
		hexShape.lineTo(9, 5);
		hexShape.lineTo(9, -5);
		hexShape.lineTo(0, -10);
		hexShape.lineTo(0, -6);
		hexShape.lineTo(5, -3);
		hexShape.lineTo(5, 3);
		hexShape.lineTo(0, 6);
		//hexShape.lineTo(0,10);

		var geo = new THREE.ShapeGeometry(hexShape);


		hotspot.hexSeg1 = new THREE.Mesh(geo, mat);
		hotspot.hexSeg2 = new THREE.Mesh(geo, mat);

		hotspot.add(hotspot.hexSeg1);
		hotspot.add(hotspot.hexSeg2);

		hotspot.hexSeg1.rotation.z = (Math.PI / 180) * -60;
		hotspot.hexSeg2.rotation.z = (Math.PI / 180) * 120;
		hotspot.hexSeg2.position.z = 3;




		var hexShape3 = new THREE.Shape();
		hexShape3.moveTo(0, 10);
		hexShape3.lineTo(9, 5);
		hexShape3.lineTo(9, -5);
		hexShape3.lineTo(0, -10);
		hexShape3.lineTo(-9, -5);
		hexShape3.lineTo(-9, 5);
		hexShape3.lineTo(0, 10);
		//hexShape3.lineTo(9,5);

		var geo = new THREE.ShapeGeometry(hexShape3);
		var mat = new THREE.LineBasicMaterial({
			blending: THREE.AdditiveBlending,
			linewidth: 2,
			color: 0xff8340,
			transparent: true,
			opacity: .8
		});
		hotspot.hexSeg3 = new THREE.Line(geo, mat);
		hotspot.add(hotspot.hexSeg3);
		hotspot.hexSeg3.position.z = 6;
		hotspot.hexSeg3.position.x = .25;

		hotspot.hexSeg3.scale.set(1.2, 1.2, 1.2);


		var mat = new THREE.MeshBasicMaterial({
			blending: THREE.AdditiveBlending,
			color: 0xff8340,
			transparent: true,
			opacity: .8,
			side: THREE.DoubleSide
		});
		var hexShape4 = new THREE.Shape();
		hexShape4.moveTo(0, 10);
		hexShape4.lineTo(9, 5);
		hexShape4.lineTo(9, -5);
		hexShape4.lineTo(0, -10);
		hexShape4.lineTo(-9, -5);
		hexShape4.lineTo(-8, -4.5);
		hexShape4.lineTo(0, -9);
		hexShape4.lineTo(8, -4.5);
		hexShape4.lineTo(8, 4.5);
		hexShape4.lineTo(0, 9);
		//hexShape4.lineTo(0,10);

		var geo = new THREE.ShapeGeometry(hexShape4);

		hotspot.hexSeg4 = new THREE.Mesh(geo, mat);
		hotspot.hexSeg4.scale.set(1.5, 1.5, 1.5)

		hotspot.add(hotspot.hexSeg4);

		hotspot.hexSeg4.position.z = 9;
		hotspot.hexSeg4.position.x = .4;


		// consider rebuilding this as 2 lines later
		// mght be more efficient than a shape??

		var mat = new THREE.LineBasicMaterial({
			blending: THREE.AdditiveBlending,
			linewidth: 2,
			color: 0xff8340,
			transparent: true,
			opacity: .9
		});
		var plus = new THREE.Shape();
		plus.moveTo(0, 3);
		plus.lineTo(0, -3);
		plus.moveTo(0, 0);
		plus.lineTo(3, 0);
		plus.lineTo(-3, 0);
		var geo = new THREE.ShapeGeometry(plus);
		hotspot.plus = new THREE.Line(geo, mat);
		hotspot.add(hotspot.plus);
		hotspot.plus.position.z = 12;
		hotspot.plus.position.x = 0;

		// merge to single geo later!!!!

		var mat = new THREE.LineBasicMaterial({
			blending: THREE.AdditiveBlending,
			linewidth: 3,
			color: 0xff8340,
			transparent: true,
			opacity: .5
		});
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0, 0, 0));
		geo.vertices.push(new THREE.Vector3(5, 0, 0));
		hotspot.line = new THREE.Line(geo, mat);
		hotspot.add(hotspot.line);
		hotspot.line.position.z = 9;
		hotspot.line.position.x = 15;

		hotspot.line2 = new THREE.Line(geo, mat);
		hotspot.add(hotspot.line2);
		hotspot.line2.position.z = 9;
		hotspot.line2.position.x = -15;
		hotspot.line2.rotation.z = (Math.PI / 180) * -180;

		hotspot.line3 = new THREE.Line(geo, mat);
		hotspot.add(hotspot.line3);
		hotspot.line3.position.z = 9;
		hotspot.line3.position.x = -10;
		hotspot.line3.position.y = 15;
		hotspot.line3.rotation.z = (Math.PI / 180) * -60;

		hotspot.line4 = new THREE.Line(geo, mat);
		hotspot.add(hotspot.line4);
		hotspot.line4.position.z = 9;
		hotspot.line4.position.x = -10;
		hotspot.line4.position.y = -15;
		hotspot.line4.rotation.z = (Math.PI / 180) * 240;


		hotspot.canvas = document.createElement('canvas');
		hotspot.canvas.width = 1024;
		hotspot.canvas.height = 256;
		hotspot.context = hotspot.canvas.getContext('2d');
		hotspot.context.font = "80px Borda-Bold";
		hotspot.context.fillStyle = "rgba(255,160,67,1)";
		hotspot.context.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ&!", 0, 300);
		hotspot.context.font = "40px Borda-Bold";
		hotspot.context.fillText("0123456789.", 0, 200);
		hotspot.texture = new THREE.Texture(hotspot.canvas);
		//hotspot.texture.needsUpdate = true;
		hotspot.pMat = new THREE.MeshBasicMaterial({
			color: 0xff8340,
			blending: THREE.AdditiveBlending,
			map: hotspot.texture,
			side: THREE.DoubleSide,
			transparent: true
		});
		hotspot.title = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), hotspot.pMat);
		hotspot.title.position.x = 56;
		hotspot.title.position.y = -10;
		hotspot.add(hotspot.title);
		hotspot.canvas = null;

		// add the big line
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0, 0, 0));
		geo.vertices.push(new THREE.Vector3(0, 0, 250));
		var mat = new THREE.LineBasicMaterial({
			blending: THREE.AdditiveBlending,
			color: 0xff8340,
			transparent: true,
			opacity: .5
		});
		var line = new THREE.Line(geo, mat);
		hotspot.add(line);


		// attach a big transparent click listener
		var geo = new THREE.PlaneGeometry(50, 50, 1, 1);
		var mat = new THREE.MeshBasicMaterial({
			color: 0xff8340,
			transparent: true,
			opacity: 0
		});
		hotspot.detector = new THREE.Mesh(geo, mat);
		hotspot.detector.position.z = 20;
		hotspot.add(hotspot.detector);

		//attach classes for listners
		hotspot.userData = {
			type: "hotspot"
		};
		hotspot.detector.userData = {
			type: "hotspot_target"
		};
		hotspot.hexSeg1.userData = {
			type: "hotspot_target"
		};
		hotspot.hexSeg2.userData = {
			type: "hotspot_target"
		};
		hotspot.hexSeg3.userData = {
			type: "hotspot_target"
		};
		hotspot.hexSeg4.userData = {
			type: "hotspot_target"
		};
		hotspot.plus.userData = {
			type: "hotspot_target"
		};
		hotspot.line.userData = {
			type: "hotspot_target"
		};
		hotspot.title.userData = {
			type: "hotspot_target"
		};
		hotspot.scale.set(2, 2, 2);



		hotspot.show = function () {
			if (!showingDetail) {
				console.log(hotspot.event_data);
				if (IDR.mode != "explore") {
					trackEvent({
						'page': {
							'name': 'Autoplay - ' + hotspot.event_data.title,
							'path': '/autoplay/' + hotspot.event_data.title
						},
						'event': 'vpv'
					});
				} else {
					trackEvent({
						'page': {
							'name': 'Explore - ' + hotspot.event_data.title,
							'path': '/explore/' + hotspot.event_data.title
						},
						'event': 'vpv'
					});
				}

				hotspot.remove(hotspot.title);
				hotspot.canvas = document.createElement('canvas');
				hotspot.canvas.id = 'canvas1';
				hotspot.canvas.width = 1024;
				hotspot.canvas.height = 256;
				hotspot.context = hotspot.canvas.getContext('2d');
				hotspot.context.font = "76px Borda-Bold";
				hotspot.context.fillStyle = "rgba(255,160,67,1)";
				hotspot.context.fillText(hotspot.event_data.title.toUpperCase(), 0, 200);
				hotspot.context.font = "40px Borda-Bold";
				hotspot.context.fillText(hotspot.event_data.date, 10, 100);
				hotspot.texture = new THREE.Texture(hotspot.canvas);
				hotspot.pMat = new THREE.MeshBasicMaterial({
					blending: THREE.AdditiveBlending,
					map: hotspot.texture,
					side: THREE.DoubleSide,
					transparent: true,
					color: 0xff8340
				});
				hotspot.title = new THREE.Mesh(new THREE.PlaneGeometry(80, 20), hotspot.pMat);
				hotspot.texture.needsUpdate = true;
				hotspot.remove(hotspot.title);
				hotspot.title.position.x = 56;
				hotspot.title.position.y = 10;
				hotspot.add(hotspot.title);
				hotspot.title.userData = {
					type: "hotspot_target"
				};
				hotspot.canvas = null;

				addObjectAtLatLng(hotspot, hotspot.event_data.lat, hotspot.event_data.lng, 18);
				rotateToLatLng(hotspot.event_data.lat, hotspot.event_data.lng, hotspotYOffset);

				var tween = new TWEEN.Tween(hotspot.scale).to({
					x: 1.7,
					y: 1.7,
					z: 1.7
				}, 300).start();
				tween.easing(TWEEN.Easing.Back.InOut);

				// show the preivew element
				$("#preview-image").attr("src", hotspot.event_data.thumb);
				console.log(hotspot.event_data);
				$(".preview-detail").html(hotspot.event_data.preview_detail);
				setTimeout(function () {
					changeDetail(hotspot.event_data);
					$("#engineeringDetail_wrap").addClass("show");
				}, 150);


			}
		}

		hotspot.hide = function () {
			var tween = new TWEEN.Tween(hotspot.scale).to({
				x: .00001,
				y: .00001,
				z: .00001
			}, 300).start();
			tween.easing(TWEEN.Easing.Back.InOut);

			$("#engineeringDetail_wrap").removeClass("show");
		}

		// add hotspot to clickable collection
		objects.push(hotspot);


	}




	////////////////////////
	/*  ADD ALT  HOTSPOT */
	///////////////////////

	function createAltHotSpot(obj, data) {

		obj.event_data = data;

		var mat = new THREE.MeshBasicMaterial({
			color: 0xff8340,
			transparent: true,
			opacity: .6
		});
		var hexShape = new THREE.Shape();
		hexShape.moveTo(0, 10);
		hexShape.lineTo(9, 5);
		hexShape.lineTo(9, -5);
		hexShape.lineTo(0, -10);
		hexShape.lineTo(0, -6);
		hexShape.lineTo(5, -3);
		hexShape.lineTo(5, 3);
		hexShape.lineTo(0, 6);

		var geo = new THREE.ShapeGeometry(hexShape);

		obj.hexSeg1 = new THREE.Mesh(geo, mat);
		obj.hexSeg2 = new THREE.Mesh(geo, mat);

		obj.add(obj.hexSeg1);
		obj.add(obj.hexSeg2);

		obj.hexSeg1.rotation.z = (Math.PI / 180) * -60;
		obj.hexSeg2.rotation.z = (Math.PI / 180) * 120;
		obj.hexSeg2.position.z = 3;




		var hexShape3 = new THREE.Shape();
		hexShape3.moveTo(0, 10);
		hexShape3.lineTo(9, 5);
		hexShape3.lineTo(9, -5);
		hexShape3.lineTo(0, -10);
		hexShape3.lineTo(-9, -5);
		hexShape3.lineTo(-9, 5);
		hexShape3.lineTo(0, 10);
		//hexShape3.lineTo(9,5);

		var geo = new THREE.ShapeGeometry(hexShape3);
		var mat = new THREE.LineBasicMaterial({
			linewidth: 2,
			color: 0xff8340,
			transparent: true,
			opacity: .8
		});
		obj.hexSeg3 = new THREE.Line(geo, mat);
		obj.add(obj.hexSeg3);
		obj.hexSeg3.position.z = 6;
		obj.hexSeg3.position.x = .25;

		obj.hexSeg3.scale.set(1.2, 1.2, 1.2);


		var mat = new THREE.MeshBasicMaterial({
			color: 0xff8340,
			transparent: true,
			opacity: .8,
			side: THREE.DoubleSide
		});
		var hexShape4 = new THREE.Shape();
		hexShape4.moveTo(0, 10);
		hexShape4.lineTo(9, 5);
		hexShape4.lineTo(9, -5);
		hexShape4.lineTo(0, -10);
		hexShape4.lineTo(-9, -5);
		hexShape4.lineTo(-8, -4.5);
		hexShape4.lineTo(0, -9);
		hexShape4.lineTo(8, -4.5);
		hexShape4.lineTo(8, 4.5);
		hexShape4.lineTo(0, 9);
		//hexShape4.lineTo(0,10);

		var geo = new THREE.ShapeGeometry(hexShape4);

		obj.hexSeg4 = new THREE.Mesh(geo, mat);
		obj.hexSeg4.scale.set(1.5, 1.5, 1.5)

		obj.add(obj.hexSeg4);

		obj.hexSeg4.position.z = 9;
		obj.hexSeg4.position.x = .4;


		// consider rebuilding this as 2 lines later
		// mght be more efficient than a shape??
		var mat = new THREE.LineBasicMaterial({
			linewidth: 2,
			color: 0xff8340,
			transparent: true,
			opacity: .9
		});
		var plus = new THREE.Shape();
		plus.moveTo(0, 3);
		plus.lineTo(0, -3);
		plus.moveTo(0, 0);
		plus.lineTo(3, 0);
		plus.lineTo(-3, 0);
		var geo = new THREE.ShapeGeometry(plus);
		obj.plus = new THREE.Line(geo, mat);
		obj.add(obj.plus);
		obj.plus.position.z = 12;
		obj.plus.position.x = 0;

		// merge to single geo later!!!!
		var mat = new THREE.LineBasicMaterial({
			linewidth: 3,
			color: 0xff8340,
			transparent: true,
			opacity: .5
		});
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0, 0, 0));
		geo.vertices.push(new THREE.Vector3(5, 0, 0));
		obj.line = new THREE.Line(geo, mat);
		obj.add(obj.line);
		obj.line.position.z = 9;
		obj.line.position.x = 15;

		obj.line2 = new THREE.Line(geo, mat);
		obj.add(obj.line2);
		obj.line2.position.z = 9;
		obj.line2.position.x = -15;
		obj.line2.rotation.z = (Math.PI / 180) * -180;

		obj.line3 = new THREE.Line(geo, mat);
		obj.add(obj.line3);
		obj.line3.position.z = 9;
		obj.line3.position.x = -10;
		obj.line3.position.y = 15;
		obj.line3.rotation.z = (Math.PI / 180) * -60;

		obj.line4 = new THREE.Line(geo, mat);
		obj.add(obj.line4);
		obj.line4.position.z = 9;
		obj.line4.position.x = -10;
		obj.line4.position.y = -15;
		obj.line4.rotation.z = (Math.PI / 180) * 240;

		/*
    	obj.canvas = document.createElement('canvas');
    	obj.canvas.id = 'canvas1';
		obj.canvas.width = 1024;
		obj.canvas.height = 256;
		obj.context = obj.canvas.getContext('2d');
		obj.context.font = "80px Borda-Bold";
		obj.context.fillStyle = "rgba(255,160,67,1)";
		obj.context.fillText(obj.event_data.title.toUpperCase(), 0, 200);
		obj.context.font = "60px Borda-Bold";
		obj.context.fillText(obj.event_data.date, 10, 100);
		obj.texture = new THREE.Texture(obj.canvas);
		obj.pMat = new THREE.MeshBasicMaterial( { map: obj.texture,  side: THREE.DoubleSide , transparent:true} );
		obj.title = new THREE.Mesh(new THREE.PlaneGeometry(80,20),obj.pMat);
		obj.texture.needsUpdate = true;
		obj.remove(obj.title);
		obj.title.position.x = 56;
		obj.title.position.y = 10;
		obj.add(obj.title);
		obj.canvas = null;
		*/

		// add the big line
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0, 0, 0));
		geo.vertices.push(new THREE.Vector3(0, 0, 250));
		var mat = new THREE.LineBasicMaterial({
			color: 0xff8340,
			transparent: true,
			opacity: .5
		});
		var line = new THREE.Line(geo, mat);
		obj.add(line);


		//attach classes for listners
		obj.userData = {
			type: "hotspot_target"
		};
		obj.hexSeg1.userData = {
			type: "hotspot_target"
		};
		obj.hexSeg2.userData = {
			type: "hotspot_target"
		};
		obj.hexSeg3.userData = {
			type: "hotspot_target"
		};
		obj.hexSeg4.userData = {
			type: "hotspot_target"
		};

		obj.scale.set(2, 2, 2);




		obj.show = function () {
			if (!showingDetail) {
				console.log(obj.event_data);

				addObjectAtLatLng(obj, obj.event_data.lat, obj.event_data.lng, 16);
				//rotateToLatLng(obj.event_data.lat,obj.event_data.lng, hotspotYOffset );

				var tween = new TWEEN.Tween(obj.scale).to({
					x: 1.5,
					y: 1.5,
					z: 1.5
				}, 300).start();
				tween.easing(TWEEN.Easing.Back.InOut);
			}
		}

		obj.hide = function () {
			var tween = new TWEEN.Tween(obj.scale).to({
				x: .00001,
				y: .00001,
				z: .000001
			}, 300).start();
			tween.easing(TWEEN.Easing.Back.InOut);
		}


		// add hotspot to clickable collection
		objects.push(obj);


	}



	/* END ALT HOTSPOT */



	/* CLOSE BUTTON */
	function createCloseButton() {

		closeButton = new THREE.Object3D();

		var mat = new THREE.MeshBasicMaterial({
			color: 0xFF9643,
			transparent: true,
			opacity: .3,
			side: THREE.DoubleSide
		});
		var hexShape = new THREE.Shape();
		hexShape.moveTo(0, 10);
		hexShape.lineTo(9, 5);
		hexShape.lineTo(9, -5);
		hexShape.lineTo(0, -10);
		hexShape.lineTo(0, -6);
		hexShape.lineTo(5, -3);
		hexShape.lineTo(5, 3);
		hexShape.lineTo(0, 6);
		//hexShape.lineTo(0,10);

		var geo = new THREE.ShapeGeometry(hexShape);

		closeButton.hexSeg1 = new THREE.Mesh(geo, mat);
		closeButton.hexSeg2 = new THREE.Mesh(geo, mat);

		closeButton.add(closeButton.hexSeg1);
		closeButton.add(closeButton.hexSeg2);

		closeButton.hexSeg1.rotation.z = (Math.PI / 180) * -60;
		closeButton.hexSeg2.rotation.z = (Math.PI / 180) * 180;
		closeButton.hexSeg2.position.z = 3;



		var hexShape3 = new THREE.Shape();
		hexShape3.moveTo(0, 10);
		hexShape3.lineTo(9, 5);
		hexShape3.lineTo(9, -5);
		hexShape3.lineTo(0, -10);
		hexShape3.lineTo(-9, -5);
		hexShape3.lineTo(-9, 5);
		hexShape3.lineTo(0, 10);
		//hexShape3.lineTo(9,5);

		var geo = new THREE.ShapeGeometry(hexShape3);
		var mat = new THREE.LineBasicMaterial({
			linewidth: 2,
			color: 0xFF9643,
			transparent: true,
			opacity: .8
		});
		closeButton.hexSeg3 = new THREE.Line(geo, mat);
		closeButton.add(closeButton.hexSeg3);
		closeButton.hexSeg3.position.z = 6;
		closeButton.hexSeg3.position.x = .25;

		closeButton.hexSeg3.scale.set(1.2, 1.2, 1.2);

		var mat = new THREE.MeshBasicMaterial({
			color: 0xFF9643,
			transparent: true,
			opacity: .7,
			side: THREE.DoubleSide
		});
		var hexShape4 = new THREE.Shape();
		hexShape4.moveTo(0, 10);
		hexShape4.lineTo(9, 5);
		hexShape4.lineTo(9, -5);
		hexShape4.lineTo(0, -10);
		hexShape4.lineTo(-9, -5);
		//hexShape4.lineTo(-9,5);
		//hexShape3.lineTo(0,10);
		//hexShape4.lineTo(-8,4.5);
		hexShape4.lineTo(-8, -4.5);
		hexShape4.lineTo(0, -9);
		hexShape4.lineTo(8, -4.5);
		hexShape4.lineTo(8, 4.5);
		hexShape4.lineTo(0, 9);
		//hexShape4.lineTo(0,10);


		var geo = new THREE.ShapeGeometry(hexShape4);

		closeButton.hexSeg4 = new THREE.Mesh(geo, mat);
		closeButton.hexSeg4.scale.set(1.5, 1.5, 1.5)

		closeButton.add(closeButton.hexSeg4);

		closeButton.hexSeg4.position.z = 9;
		closeButton.hexSeg4.position.x = .4;



		var mat = new THREE.LineBasicMaterial({
			linewidth: 2,
			color: 0xFF9643,
			transparent: true,
			opacity: .9
		});
		var plus = new THREE.Shape();
		plus.moveTo(0, 3);
		plus.lineTo(0, -3);
		plus.moveTo(0, 0);
		plus.lineTo(3, 0);
		plus.lineTo(-3, 0);
		var geo = new THREE.ShapeGeometry(plus);
		closeButton.plus = new THREE.Line(geo, mat);
		closeButton.add(closeButton.plus);
		closeButton.plus.position.z = 12;
		closeButton.plus.position.x = 0;
		closeButton.plus.rotation.z = (Math.PI / 180) * 45;


		var mat = new THREE.LineBasicMaterial({
			linewidth: 3,
			color: 0xFF9643,
			transparent: true,
			opacity: .7
		});
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vector3(0, 0, 0));
		geo.vertices.push(new THREE.Vector3(5, 0, 0));
		closeButton.line = new THREE.Line(geo, mat);
		closeButton.add(closeButton.line);
		closeButton.line.position.z = 9;
		closeButton.line.position.x = 15;

		closeButton.line2 = new THREE.Line(geo, mat);
		closeButton.add(closeButton.line2);
		closeButton.line2.position.z = 9;
		closeButton.line2.position.x = -15;
		closeButton.line2.rotation.z = (Math.PI / 180) * -180;

		closeButton.line3 = new THREE.Line(geo, mat);
		closeButton.add(closeButton.line3);
		closeButton.line3.position.z = 9;
		closeButton.line3.position.x = -10;
		closeButton.line3.position.y = 15;
		closeButton.line3.rotation.z = (Math.PI / 180) * -60;

		closeButton.line4 = new THREE.Line(geo, mat);
		closeButton.add(closeButton.line4);
		closeButton.line4.position.z = 9;
		closeButton.line4.position.x = -10;
		closeButton.line4.position.y = -15;
		closeButton.line4.rotation.z = (Math.PI / 180) * 240;

		/*
        var canvas = document.createElement('canvas');
		canvas.width = 1024;
		canvas.height = 1024;
		closeButton.context = canvas.getContext('2d');
		closeButton.context.font = "100px Borda-Bold";
		closeButton.context.fillStyle = "rgba(255,160,67,1)";
		closeButton.context.fillText("CLOSE", 0, 300);
		closeButton.texture = new THREE.Texture(canvas);
		closeButton.texture.needsUpdate = true;
		closeButton.pMat = new THREE.MeshBasicMaterial( { map: closeButton.texture,  side: THREE.DoubleSide , transparent:true} );
		closeButton.title = new THREE.Mesh(new THREE.PlaneGeometry(60,60),closeButton.pMat);
		closeButton.title.position.y = -36;
		closeButton.title.position.x = 22;
		closeButton.add(closeButton.title);
		*/

		mat = new THREE.MeshBasicMaterial({
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load("assets/images/close_text.png"),
			transparent: true,
			opacity: 1
		});
		closeButton.title = new THREE.Mesh(new THREE.PlaneGeometry(24, 6), mat);
		closeButton.title.position.y = -24;
		closeButton.add(closeButton.title);

		/* big hit zone */
		mat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0
		});
		hit = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), mat);
		hit.position.z = 40;
		closeButton.add(hit);

		// add listner classes
		hit.userData = {
			type: "close_target"
		};
		closeButton.hexSeg1.userData = {
			type: "close_target"
		};
		closeButton.hexSeg2.userData = {
			type: "close_target"
		};
		closeButton.hexSeg3.userData = {
			type: "close_target"
		};
		closeButton.hexSeg4.userData = {
			type: "close_target"
		};
		closeButton.plus.userData = {
			type: "close_target"
		};
		closeButton.hexSeg4.userData = {
			type: "close_target"
		};
		closeButton.title.userData = {
			type: "close_target"
		};


		scene.add(closeButton);

		objects.push(closeButton);

		closeButton.show = function () {
			console.log("show close button");
			// set up distance form camera pre animation
			closeButton.lookAt(camera.position);
			closeButton.rotation.x = (Math.PI / 180) * -135;
			closeButton.orgRotY = closeButton.rotation.y;
			//closeButton.rotation.y += ((Math.PI/180) * 90);
			closeButton.position.z = 270;
			closeButton.position.y = -300;
			yTarget = -305;
			//  closeButton.hex.material.opacity = 0;
			// if mobile, portrait
			if (IDR.isPortrait) {
				closeButton.position.z = 350;
				yTarget = -115;
				xrot = (Math.PI / 180) * -25;
				closeButton.scale.set(.9, .9, .9);
			} else {
				xrot = (Math.PI / 180) * -65;
				closeButton.scale.set(1, 1, 1);
			}
			// animate it to the spot we want
			// var tween = new TWEEN.Tween(closeButton.hex.material).to({ opacity:1 }, 1000).delay(2000).start();
			//tween.easing(TWEEN.Easing.Quadratic.InOut);
			var tween = new TWEEN.Tween(closeButton.position).to({
				y: yTarget
			}, 1000).delay(2000).start();

			var tween = new TWEEN.Tween(closeButton.rotation).to({
				x: xrot
			}, 1000).delay(2500).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);

			tween.onComplete(function () {
				closeButton.lookAt(camera.position);
			});

			//var tween = new TWEEN.Tween(closeButton.rotation).to({ y: closeButton.orgRotY, }, 1000).delay(2000).start();
			//tween.easing(TWEEN.Easing.Quadratic.InOut);



		}

		closeButton.hide = function () {
			console.log("hide close button");
			//var tween = new TWEEN.Tween(closeButton.hex.material).to({ opacity:0 }, 1000).start();
			//tween.easing(TWEEN.Easing.Quadratic.InOut);
			var tween = new TWEEN.Tween(closeButton.position).to({
				y: yTarget - 300
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);

			var tween = new TWEEN.Tween(closeButton.rotation).to({
				x: (Math.PI / 180) * -135
			}, 1000).start();
			tween.easing(TWEEN.Easing.Quadratic.Out);


		}
	}




	/*  ADD DETAIL VIEW SCREEN */
	function addDetailViewScreen() {
		// add eaerth container
		detailViewScreen = new THREE.Object3D();
		detailViewScreen.position.z = 0;
		detailViewScreen.position.y = -70;
		detailViewScreen.rotation.y = Math.PI / 180 * 180;
		detailViewScreen.rotation.x = Math.PI / 180 * 30;

		var geo = new THREE.SphereGeometry(radius * 2.5, 6, 3, 4.41, .6, 1.4, .3);
		var mat = new THREE.MeshLambertMaterial({
			map: new THREE.TextureLoader().load("assets/images/detail_1_1.jpg"),
			opacity: .5,
			transparent: true,
			blending: THREE.AdditiveBlending
		});

		viewScreen = new THREE.Mesh(geo, mat);
		viewScreen2 = new THREE.Mesh(geo, mat);
		viewScreen3 = new THREE.Mesh(geo, mat);
		viewScreen4 = new THREE.Mesh(geo, mat);

		viewScreen3.material.opacity = 0;
		viewScreen4.material.opacity = 0;

		var egh = new THREE.EdgesHelper(viewScreen.clone(), 0xff8340);
		var egh2 = new THREE.EdgesHelper(viewScreen2.clone(), 0x7efaff);
		egh.material.linewidth = .5;
		egh.material.transparent = true;
		egh.material.opacity = .2;
		egh.position.z = -1;
		viewScreen.add(egh);
		viewScreen3.add(egh);
		egh2.material.linewidth = .5;
		egh2.material.transparent = true;
		egh2.material.opacity = .4;
		egh2.position.z = -8;
		viewScreen2.add(egh2);
		viewScreen4.add(egh2);
		detailViewScreen.add(viewScreen);
		detailViewScreen.add(viewScreen2);
		detailViewScreen.add(viewScreen3);
		detailViewScreen.add(viewScreen4);

		var mat = new THREE.MeshLambertMaterial({
			color: 0xff8340,
			opacity: .05,
			transparent: true,
		});
		viewScreenOverlay = new THREE.Mesh(geo, mat);
		viewScreenOverlay.position.z = viewScreen2.position.z + 1;

		var mat = new THREE.MeshBasicMaterial({
			color: 0x7efaff,
			opacity: .05,
			transparent: true,
		});
		viewScreenOverlay2 = new THREE.Mesh(geo, mat);
		viewScreenOverlay2.position.z = viewScreen2.position.z - 2;

		detailViewScreen.add(viewScreenOverlay);
		detailViewScreen.add(viewScreenOverlay2);
		scene.add(detailViewScreen);

	}



	/* TIMELINE SCRUBBER  */

	function addTimeline() {

		// position and add timline
		timeline = new THREE.Object3D();
		timeline.dial = new THREE.Object3D();
		timeline.outerDial = new THREE.Object3D();
		timeline.pointer = new THREE.Object3D();
		timeline.add(timeline.dial);
		timeline.add(timeline.outerDial);
		timeline.add(timeline.pointer);

		r = 120;

		var mat = new THREE.LineBasicMaterial({
			linewidth: 1,
			color: 0x6FD5F0,
			transparent: true,
			opacity: .7
		});

		var yr = 1996;
		var t = 2 * Math.PI / 360;
		psize = 2.4;
		py = 1.7;

		// look for methods to merge geometyr instead of all these sepeate geos
		var lineGeo = new THREE.Geometry();
		for (i = 0; i < 360; i++) {
			var x = r * Math.cos(t * i);
			var z = r * Math.sin(t * i);

			lineGeo.vertices.push(new THREE.Vector3(x * .985, 0, z * .985));
			lineGeo.vertices.push(new THREE.Vector3(x, 0, z));


			var geo = new THREE.Geometry();
			lineGeo.vertices.push(new THREE.Vector3(x * .96, 0, z * .96));
			lineGeo.vertices.push(new THREE.Vector3(x * .965, 0, z * .965));



			if (i == 1 || ((i - 36) % 12 === 0 && i > 36 && i < 280)) {

				var pgeo = new THREE.PlaneGeometry(psize * 2, psize);
				var pmat = new THREE.MeshPhongMaterial({
					map: new THREE.TextureLoader().load("assets/images/years/" + yr + ".png"),
					transparent: true,
					opacity: 1
				});
				p = new THREE.Mesh(pgeo, pmat);

				p.position.x = x * 1;
				p.position.z = z * 1;
				p.position.y = py;
				p.lookAt(new THREE.Vector3(0, 60, 0));
				timeline.dial.add(p);
				yr++;

				var geo = new THREE.Geometry();
				geo.vertices.push(new THREE.Vector3(x * .96, 0, z * .96));
				geo.vertices.push(new THREE.Vector3(x * .99, 0, z * .99));
				var line = new THREE.Line(geo, mat);
				timeline.dial.add(line);

			}




			if (i == 7 || i == 19 || i == 31 || i == 43) {

				if (i == 7) {
					d = "070296";
				}
				if (i == 19) {
					d = "070396";
				}
				if (i == 31) {
					d = "070496";
				}

				if (i != 43) {
					var pgeo = new THREE.PlaneGeometry(psize * 4.1, psize * 1.1);
					var pmat = new THREE.MeshPhongMaterial({
						map: new THREE.TextureLoader().load("assets/images/years/" + d + ".png"),
						transparent: true,
						opacity: 1
					});
					p = new THREE.Mesh(pgeo, pmat);
					p.position.x = r * Math.cos(t * (i + psize + .6));
					p.position.z = r * Math.sin(t * (i + psize + .6));
					p.position.y = py;
					p.lookAt(new THREE.Vector3(0, 60, 0));
					timeline.dial.add(p);

					// add anngled hash marks
					for (j = 0; j < 17; j++) {
						var xh = (r - 3) * Math.cos(t * i + (.012 * j));
						var zh = (r - 3) * Math.sin(t * i + (.012 * j));
						var xh2 = (r - 5) * Math.cos(t * i + (.012 * j + .012));
						var zh2 = (r - 5) * Math.sin(t * i + (.012 * j + .012));

						lineGeo.vertices.push(new THREE.Vector3(xh, 0, zh));
						lineGeo.vertices.push(new THREE.Vector3(xh2, 0, zh2));

					}

				}


				lineGeo.vertices.push(new THREE.Vector3(x * .96, 0, z * .96));
				lineGeo.vertices.push(new THREE.Vector3(x * 1.05, 0, z * 1.05));



			}



		}

		// now add all the lines as one piece of geometry
		var line = new THREE.LineSegments(lineGeo, mat);
		timeline.dial.add(line);


		// add hotspots ( octgons )

		for (i = 0; i < IDR.events.length; i++) {
			e = IDR.events[i];
			//console.log(e.month,e.day,e.year);
			var hotspotMat = new THREE.LineBasicMaterial({
				linewidth: 2,
				color: 0xFF9643,
				transparent: true,
				opacity: .6
			});
			geo = new THREE.CircleGeometry(1.2, 6);
			geo.vertices.shift();
			var hotspot = new THREE.Line(geo, hotspotMat);
			hotspot.event_data = e;
			if (e.year == 1996 && e.month < 7) {
				pos = e.month;
			} else if (e.year == 1996 && e.month == 7 && e.day < 5) {
				if (e.day == 2) {
					pos = 7;
				}
				if (e.day == 3) {
					pos = 19;
				}
				if (e.day == 4) {
					pos = 31;
				}
			} else {

				pos = Math.floor((e.year - 1997) * 12) + 47 + e.month + (e.day / 30);


			}

			//console.log(pos);
			hotspot.position.x = r * Math.cos(t * pos);
			hotspot.position.z = r * Math.sin(t * pos);
			hotspot.position.y = -1.5;

			geo = new THREE.PlaneGeometry(5, 5, 1, 1);
			mat = new THREE.MeshBasicMaterial({
				opacity: 0,
				transparent: true
			});
			p = new THREE.Mesh(geo, mat);
			p.userData = {
				type: "timeline_hotspot",
				index: e.id
			};
			p.position.z = 6;
			p.position.y = -1;
			p.position.x = 0;

			hotspot.add(p);
			hotspot.lookAt(new THREE.Vector3(0, 0, 0));
			hotspot.rotation.z = Math.PI / 180 * 30;
			hotspot.userData = {
				type: "timeline_hotspot",
				index: e.id
			};
			timeline.dial.add(hotspot);



			//add to clickable objects to detect
			hotspot.userData = {
				type: "timeline_hotspot",
				index: e.id
			};

			objects.push(hotspot);
		}





		// add little min hotspots


		for (i = 0; i < 4; i++) {


			var hotspotMat = new THREE.LineBasicMaterial({
				linewidth: 2,
				color: 0xFF9643,
				transparent: true,
				opacity: .6
			});
			geo = new THREE.CircleGeometry(.6, 6);
			geo.vertices.shift();
			var hotspot = new THREE.Line(geo, hotspotMat);
			if (i == 0) {
				pos = 17;
			}
			if (i == 1) {
				pos = 24;
			}
			if (i == 2) {
				pos = 30;
			}
			if (i == 3) {
				pos = 40;
			}

			//console.log(pos);
			hotspot.position.x = r * Math.cos(t * pos);
			hotspot.position.z = r * Math.sin(t * pos);
			hotspot.position.y = -1.5;
			hotspot.lookAt(new THREE.Vector3(0, 0, 0));
			hotspot.rotation.z = Math.PI / 180 * 30;
			timeline.dial.add(hotspot);


			//add to clickable objects to detect
			objects.push(hotspot);
		}



		// invisilbe shape inside timeline to help with dragging
		geo = new THREE.PlaneGeometry(250, 50, 1, 1);
		material = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0,
			color: 0x6FD5F0
		});
		circle = new THREE.Mesh(geo, material);
		//circle.rotation.x=-Math.PI/180*90;
		//circle.position.z=radius;
		//circle.position.x=-100;
		circle.position.z = -150;
		circle.position.y = -10;
		timeline.add(circle);





		// outer dial
		geo = new THREE.CylinderGeometry(r + 12, r + 12, 3, 200, 1, true);
		material = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: .1,
			color: 0x6FD5F0,
			side: THREE.DoubleSide
		});
		circle = new THREE.Mesh(geo, material);
		timeline.outerDial.add(circle);
		geo = new THREE.CylinderGeometry(r + 14, r + 14, 3, 200, 1, true);
		material = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: .2,
			color: 0x6FD5F0,
			side: THREE.DoubleSide
		});
		circle = new THREE.Mesh(geo, material);
		timeline.outerDial.add(circle);

		// add some radial lines to this
		var lineGeo = new THREE.Geometry();
		mat = new THREE.LineBasicMaterial({
			linewidth: 2,
			transparent: true,
			opacity: .4,
			color: 0x6FD5F0
		});
		for (i = 0; i < 360; i += 4) {
			var x = (r + 12) * Math.cos(t * i);
			var z = (r + 12) * Math.sin(t * i);
			//var geo = new THREE.Geometry();
			lineGeo.vertices.push(new THREE.Vector3(x * 1.07, 0, z * 1.07));
			lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
			//var line = new THREE.Line(geo, mat);
			//line.rotation.y=Math.PI/180 * 90;
			//timeline.outerDial.add(line);
		}

		// now add all the lines as one piece of geometry
		var line = new THREE.LineSegments(lineGeo, mat);
		timeline.outerDial.add(line);


		// pointer object

		var s = new THREE.Shape();

		// can i smoooth out the absarc curve?
		s.absarc(0, 0, r, Math.PI / 180 * 85, Math.PI / 180 * -280.5, false);
		s.lineTo((r - 10) * Math.cos(t * 90), (r - 10) * Math.sin(t * 90));
		s.lineTo((r) * Math.cos(t * 94.7), (r) * Math.sin(t * 94.7));
		//s.lineTo((r)*Math.cos(t*95),(r)*Math.sin(t*95));
		var geo = new THREE.ShapeGeometry(s);
		var mat = new THREE.LineBasicMaterial({
			linewidth: 1,
			transparent: true,
			opacity: .3,
			color: 0x6FD5F0
		});
		var tp = new THREE.Line(geo, mat);
		timeline.pointer.add(tp);
		timeline.pointer.rotation.x = Math.PI / 180 * -90;

		// add arrows to pointer
		var s = new THREE.Shape();
		s.moveTo(-.7, 0);
		s.lineTo(0, -1.8);
		s.lineTo(.7, 0);
		s.lineTo(-.7, 0);
		var geo = new THREE.ShapeGeometry(s);
		mat = new THREE.MeshLambertMaterial({
			transparent: true,
			opacity: .6,
			color: 0x7efaff,
			side: THREE.DoubleSide
		});
		var arrow = new THREE.Mesh(geo, mat);
		arrow.position.y = 121;
		var arrow2 = arrow.clone();
		arrow2.rotation.z = Math.PI / 180 * 180;
		arrow2.position.z -= 4;
		arrow.position.z -= .2;
		timeline.pointer.add(arrow);
		timeline.pointer.add(arrow2);


		// add curved arorws below pointer

		var s2 = new THREE.Shape();
		s2.absarc(0, 0, r, Math.PI / 180 * 75, Math.PI / 180 * 87, false);
		s2.moveTo((r) * Math.cos(t * 75), (r) * Math.sin(t * 75))
		s2.lineTo((r) * Math.cos(t * 75) - 2, (r) * Math.sin(t * 75) - 1);
		var geo = new THREE.ShapeGeometry(s2);
		var mat = new THREE.LineBasicMaterial({
			linewidth: 2,
			transparent: true,
			opacity: .2,
			color: 0x7efaff
		});
		var tp2 = new THREE.Line(geo, mat);
		tp2.position.z -= 7;

		var s2 = new THREE.Shape();
		s2.absarc(0, 0, r, Math.PI / 180 * 105, Math.PI / 180 * 93, false);
		s2.moveTo((r) * Math.cos(t * 105), (r) * Math.sin(t * 105))
		s2.lineTo((r) * Math.cos(t * 105) + 2, (r) * Math.sin(t * 105) - 1);
		var geo = new THREE.ShapeGeometry(s2);
		var mat = new THREE.LineBasicMaterial({
			linewidth: 2,
			transparent: true,
			opacity: .2,
			color: 0x7efaff
		});
		var tp3 = new THREE.Line(geo, mat);
		tp3.position.z -= 7;

		timeline.pointer.add(tp2);
		timeline.pointer.add(tp3);


		// position the whole timeline object
		if (IDR.isPortrait) {
			timeline.position.z = 660 - window.innerWidth * .01;
			timeline.position.y = -55 - window.innerWidth * .003;
		} else {
			timeline.position.z = 530 - window.innerWidth * .01;
			timeline.position.y = -55 - window.innerWidth * .003;
		}
		timeline.rotation.x = Math.PI / 180 * 5;

		// adjust the rotation of the dial to start
		timeline.dial.rotation.y = Math.PI / 180 * 80;
		timeline.outerDial.rotation.y = Math.PI / 180 * 80;

		scene.add(timeline);




		timeline.show = function () {
			if (IDR.isPortrait) {
				ypos = -52 - window.innerWidth * .003;
			} else {
				ypos = -52 - window.innerWidth * .003;
			}
			var tween = new TWEEN.Tween(timeline.position).to({
				y: ypos
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			setTimeout(function () {
				$("#date-content").addClass("show");
			}, 1000);

		}

		timeline.show2 = function () {
			if (IDR.isPortrait) {
				ypos = -52 - window.innerWidth * .003;
			} else {
				ypos = -52 - window.innerWidth * .003;
			}
			var tween = new TWEEN.Tween(timeline.position).to({
				y: ypos
			}, 2000).start();
			tween.easing(TWEEN.Easing.Elastic.InOut);
			$("#date-content").addClass("show");
			setTimeout(function () {
				$("#date-content").addClass("show");
			}, 1000);

		}

		timeline.hide = function () {
			var tween = new TWEEN.Tween(timeline.position).to({
				y: 40
			}, 4000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			$("#date-content").removeClass("show");
		}


		timeline.hide2 = function () {
			timeline.position.y = -100;
			$("#date-content").removeClass("show");
		}

		timeline.userData = {
			type: "timeline"
		};
		objects.push(timeline);

	}


	function showDetailView(e) {
		console.log("Show Detail view", locked, showingDetail);
		if (!showingDetail) {
			//if(IDR.mode=="play"){m="AutoPlay"; m2 = "autoplay";} else {m="Explore"; m2="explore";}
			//trackEvent({'page':{'name': m + ' - '+ e.title,'path':'/'+m2+'/' + e.title},'event':'vpv'});

			// wangjue
			//IDR.audio.playFromTo("detail", 0, 1);

			if (IDR.mode == "explore") {
				trackEvent({
					'page': {
						'name': 'Explore  - ' + hotspot.event_data.title,
						'path': '/explore/' + hotspot.event_data.title + '/view'
					},
					'event': 'vpv'
				});
			} else {
				trackEvent({
					'page': {
						'name': 'Autoplay  - ' + hotspot.event_data.title,
						'path': '/autoplay/' + hotspot.event_data.title + '/view'
					},
					'event': 'vpv'
				});
			}

			locked = true;

			// let animation complete then set state
			setTimeout(function () {
				showingDetail = true;
			});

			// hide the preview button
			$("#engineeringDetail_wrap").removeClass("show");

			// add listner for parallax in detail view
			document.addEventListener('mousemove', onDocumentMouseMoveDetail, false);

			// sub in all the text and dynamic data
			$(".synopsis").html(e.synopsis);
			$(".event-text").html(e.title);
			$(".date-text").html(e.date);

			// update share buttons
			if (e.short_url) {
				url == e.short_url;
			} else {
				url = location.protocol + '//' + location.host + "/" + e.slug;
			}

			$(".share-twitter").attr("data-url", url);
			$(".share-twitter").attr("data-label", e.title);
			$(".share-twitter").attr("data-text", e.twitter_share_text);

			$(".share-facebook").attr("data-url", url);
			$(".share-facebook").attr("data-label", e.title);
			$(".share-facebook").attr("data-text", e.twitter_share_text);

			$(".share-google").attr("data-url", url);
			$(".share-google").attr("data-label", e.title);
			$(".share-google").attr("data-text", e.twitter_share_text);

			// handle downlaod
			if (e.download) {
				$(".download-title").attr("data-file", e.download);
				$(".download-title").attr("data-name", e.title);
				$(".download-title").css("display", "block");
			} else {
				$(".download-title").css("display", "none");
			}

			// if smallscreen mobile show link to watch video
			if (e.video && (IDR.isSmallScreenMobile || IDR.isIE11)) {
				$(".video-title").attr("data-file", e.video);
				$(".video-title").attr("data-name", e.title);
				$(".video-title").css("display", "block");
			} else {
				$(".video-title").css("display", "none");
			}

			// handle if simple image or 1st of gallery
			if (e.image.length > 0 && !e.video || (IDR.isSmallScreenMobile) || (IDR.isIE11)) {
				//console.log("this is a single image");

				var shader = THREE.IDRGBShiftShader;
				var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
				uniforms["tDiffuse"].value = new THREE.TextureLoader().load(e.image[0]);
				uniforms["amount"].value = .001;
				//uniforms[ "angle" ].value = .5;
				uniforms["opacity"].value = 0.4;
				var parameters = {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: uniforms
				};

				var mat = new THREE.ShaderMaterial(parameters);
				mat.transparent = true;
				mat.blending = THREE.AdditiveBlending;
				mat.opacity = .4;
				mat.color = new THREE.Color(0xff8340);
				viewScreen.material = mat;
				viewScreen2.material = mat;
				if (viewScreen3.material.uniforms) {
					viewScreen3.material.uniforms["opacity"].value = 0;
					viewScreen4.material.uniforms["opacity"].value = 0;
				}

			}

			// handle if this is an image gallery
			if (e.image.length > 1 && !e.video) {
				//console.log("this is a gallery of images");
				if (viewScreen3.material.uniforms) {
					viewScreen3.material.uniforms["opacity"].value = 0;
					viewScreen4.material.uniforms["opacity"].value = 0;
				}

				window.detailGalleryIndex = 0;
				window.detailGalleryAB = 0;
				window.detailGalleryTimer = setInterval(function () {
					window.detailGalleryIndex++;
					if (window.detailGalleryIndex == e.image.length) {
						window.detailGalleryIndex = 0;
					}

					var shader = THREE.IDRGBShiftShader;
					var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
					uniforms["tDiffuse"].value = new THREE.TextureLoader().load(e.image[window.detailGalleryIndex]);
					uniforms["amount"].value = .001;
					//uniforms[ "angle" ].value = .5;
					uniforms["opacity"].value = 0.4;
					var parameters = {
						fragmentShader: shader.fragmentShader,
						vertexShader: shader.vertexShader,
						uniforms: uniforms
					};

					var mat = new THREE.ShaderMaterial(parameters);
					mat.transparent = true;
					mat.blending = THREE.AdditiveBlending;

					if (window.detailGalleryAB == 1) {
						viewScreen.material = mat;
						viewScreen2.material = mat;
						viewScreen.material.uniforms["opacity"].value = 0;
						viewScreen2.material.uniforms["opacity"].value = 0;
						var tween = new TWEEN.Tween(viewScreen.material.uniforms["opacity"]).to({
							"value": .4
						}, 1000).start();
						var tween = new TWEEN.Tween(viewScreen.material.uniforms["opacity"]).to({
							"value": .4
						}, 1000).start();
						var tween = new TWEEN.Tween(viewScreen3.material.uniforms["opacity"]).to({
							"value": 0
						}, 1000).start();
						var tween = new TWEEN.Tween(viewScreen4.material.uniforms["opacity"]).to({
							"value": 0
						}, 1000).start();
						window.detailGalleryAB = 0;
					} else {
						viewScreen3.material = mat;
						viewScreen4.material = mat;
						//console.log(viewScreen3.material.uniforms);
						viewScreen3.material.uniforms["opacity"].value = 0;
						viewScreen4.material.uniforms["opacity"].value = 0;
						var tween = new TWEEN.Tween(viewScreen3.material.uniforms["opacity"]).to({
							"value": .4
						}, 1000).start();
						var tween = new TWEEN.Tween(viewScreen4.material.uniforms["opacity"]).to({
							"value": .4
						}, 1000).start();
						var tween = new TWEEN.Tween(viewScreen.material.uniforms["opacity"]).to({
							"value": 0
						}, 1000).start();
						var tween = new TWEEN.Tween(viewScreen2.material.uniforms["opacity"]).to({
							"value": 0
						}, 1000).start();
						window.detailGalleryAB = 1;
					}


				}, 3000);
			}

			// handle if this is video
			if (e.video && !IDR.isSmallScreenMobile && !IDR.isIE11) {
				//console.log("video texture");
				if (viewScreen3.material.uniforms) {
					viewScreen3.material.uniforms["opacity"].value = 0;
					viewScreen4.material.uniforms["opacity"].value = 0;
				}

				var texture = new THREE.VideoTexture($("#video_" + e.id)[0]);
				$("#video_" + e.id)[0].play();

				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;
				texture.format = THREE.RGBAFormat;

				var shader = THREE.IDRGBShiftShader;
				var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
				uniforms["tDiffuse"].value = texture;
				uniforms["amount"].value = .001;
				//uniforms[ "angle" ].value = .5;
				uniforms["opacity"].value = 0.35;
				var parameters = {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: uniforms
				};

				var mat = new THREE.ShaderMaterial(parameters);
				mat.transparent = true;
				mat.blending = THREE.AdditiveBlending;
				mat.opacity = .4;
				viewScreen.material = mat;
				viewScreen2.material = mat;
			}



			// get current earth rotation and store on earth
			earth.orgRotX = earth.rotation.x;
			earth.orgRotY = earth.rotation.y;
			earth.orgRotZ = earth.rotation.z;

			earthContainer.orgRotX = earthContainer.rotation.x;
			earthContainer.orgRotY = earthContainer.rotation.y;
			earthContainer.orgRotZ = earthContainer.rotation.z;

			detailViewScreen.orgRotX = detailViewScreen.rotation.x;
			detailViewScreen.orgRotY = detailViewScreen.rotation.y;
			detailViewScreen.orgRotZ = detailViewScreen.rotation.z;


			var tween = new TWEEN.Tween(earthContainer.rotation).to({
				x: 0,
				y: 0,
				z: 0
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			offset = earth.orgRotY - (Math.PI / (2 + hotspotYOffset) * -1) + (Math.PI / (2) * -1);
			var tween = new TWEEN.Tween(earth.rotation).to({
				x: (Math.PI / 180) * 90 - (.15 * earth.orgRotY),
				y: offset
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			tween.onComplete(function () {
				locked = false;
				targetEarthRotationX = earth.rotation.y;
				targetEarthRotationY = earth.rotation.x
			});

			var tween = new TWEEN.Tween(camera.rotation).to({
				x: (Math.PI / 180) * -30
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			var tween = new TWEEN.Tween(detailViewScreen.rotation).to({
				x: (Math.PI / 180) * -15
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			var tween = new TWEEN.Tween(detailViewScreen.position).to({
				z: -30,
				y: -225
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);

			// if mobile, portrait
			if (IDR.isPortrait) {

				var tween = new TWEEN.Tween(detailViewScreen.position).to({
					z: -120,
					y: -70
				}, 3000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);
				var tween = new TWEEN.Tween(detailViewScreen.rotation).to({
					x: (Math.PI / 180) * -1
				}, 3000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);
				var tween = new TWEEN.Tween(camera.rotation).to({
					x: (Math.PI / 180) * -15
				}, 3000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);

			} else {
				if (window.innerWidth > 760) {

					setTimeout(function (e) {
						$("#right-content").addClass("show");
					}, 1000);

				}
			}

			$("#right-content").css("display", "block");
			$("#left-content").css("display", "block");
			setTimeout(function (e) {
				$("#left-content").addClass("show");
			}, 1000);
			//console.log("show the left",$("#left-content").html());


			// animate in the close button
			closeButton.show();
			timeline.hide();

			// hide the toggle buttons
			$("#buttons").removeClass("show");
			$("#explore-button").removeClass("show");
			$("#play-button").removeClass("show");

			tween.onComplete(function () {
				locked = false;
			});

			// pause speech
			// wangjue
			// if (IDR.mode == "play") {
			// 	IDR.audio.pause("speech");
			// }
			// if (IDR.mode == "explore") {
			// 	IDR.audio.playFromTo("speech", e.speechClipStart, e.speechClipEnd);
			// }


		};

	}


	function hideDetailView() {
		if (!locked) {
			locked = true;
			//trackEvent({'ea':{'name':'Nav','action':'Close','label': hotspot.event_data.title },'event':'se'});
			if (IDR.mode == "explore") {
				trackEvent({
					'page': {
						'name': 'Explore  - ' + hotspot.event_data.title,
						'path': '/explore/' + hotspot.event_data.title + '/view'
					},
					'event': 'vpv'
				});
			} else {
				trackEvent({
					'page': {
						'name': 'Autoplay  - ' + hotspot.event_data.title,
						'path': '/autoplay/' + hotspot.event_data.title + '/view'
					},
					'event': 'vpv'
				});
			}

			document.removeEventListener('mousemove', onDocumentMouseMoveDetail, false);


			targetSceneRotationY = 0;
			targetSceneRotationX = 0;

			//// hide the preview button
			setTimeout(function () {
				$("#engineeringDetail_wrap").addClass("show");
			}, 3500);

			//console.log("Hide Detail View");
			if (window.detailGalleryTimer) {
				window.clearInterval(window.detailGalleryTimer);
				window.detailGalleryTimer = null;
			}

			// add tilt to earthContianer back in
			var tween = new TWEEN.Tween(earthContainer.rotation).to({
				x: earthContainer.orgRotX,
				y: earthContainer.orgRotY,
				z: earthContainer.orgRotZ
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut)
			// rotate back to start earth position
			var tween = new TWEEN.Tween(earth.rotation).to({
				x: earth.orgRotX,
				y: earth.orgRotY,
				z: earth.orgRotZ
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			tween.onComplete(function () {
				targetEarthRotationX = earth.rotation.y;
				targetEarthRotationY = earth.rotation.x;
			});

			// detail screen back out
			var tween = new TWEEN.Tween(detailViewScreen.rotation).to({
				x: detailViewScreen.orgRotX
			}, 4000).start();

			tween.easing(TWEEN.Easing.Quadratic.InOut);
			var tween = new TWEEN.Tween(scene.rotation).to({
				x: 0,
				y: 0,
				z: 0
			}, 3000).start();

			// roate camera back
			var tween = new TWEEN.Tween(camera.rotation).to({
				x: 0,
				y: 0
			}, 3000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut)


			$("#left-content").removeClass("show");
			$("#right-content").removeClass("show");
			setTimeout(function (e) {
				$("#left-content").css("display", "none");
				$("#right-content").css("display", "none");
			}, 2000);

			// unlock
			setTimeout(function () {
				showingDetail = false;
				locked = false;
			}, 3500);

			// animate out the close button
			closeButton.hide();
			timeline.show();

			// show the toggle buttons



			if (IDR.mode == "explore") {
				$("#play-button").addClass("show");
				// pause the current speech sound
				pauseSpeech();
			}

			// resume sound
			if (IDR.mode == "play") {
				$("#explore-button").addClass("show");
				$("#buttons").addClass("show");
				//IDR.audio.play("speech");

				playSpeech();
			}



			// handle if this is video
			var e = hotspot.event_data;
			if (e.video) {
				//console.log("stop video texture");
				$("#video_" + e.id)[0].pause();
			}

		};
	}


	function toggleSynopsis() {
		if (showingSynopsis) {
			// hide it
			$("#right-content").removeClass("show");
			$("#left-content").addClass("show");
			showingSynopsis = false;
			if (IDR.isPortrait) {
				var tween = new TWEEN.Tween(camera.rotation).to({
					x: (Math.PI / 180) * -15
				}, 2000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);
			}
			trackEvent({
				'page': {
					'name': 'Autoplay',
					'path': '/autoplay'
				},
				'event': 'vpv'
			});
		} else {
			// show it
			$("#right-content").addClass("show");
			$("#left-content").removeClass("show");
			showingSynopsis = true;
			if (IDR.isPortrait) {
				var tween = new TWEEN.Tween(camera.rotation).to({
					x: (Math.PI / 180) * -30
				}, 2000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut)

			}
		}
	}



	function playButtonClicked() {
		if (IDR.mode != "play") {
			trackEvent({
				'page': {
					'name': 'Autoplay',
					'path': '/autoplay'
				},
				'event': 'vpv'
			});
			IDR.mode = "play";
			$("#play-button").removeClass("show");
			$("#explore-button").addClass("show");
			//$("#play-button").css("z-index",0);
			//$("#explore-button").css("z-index",1);
			if (IDR.isPortrait) {
				zpos = 700;
			} else {
				zpos = 550;
			}
			var tween = new TWEEN.Tween(camera.position).to({
				z: zpos,
				y: 0
			}, 2000).start();
			tween.easing(TWEEN.Easing.Back.InOut);
			//logic for the play state
			// start speech
			playSpeech();
		}
	}


	function exploreButtonClicked() {
		if (IDR.mode != "explore") {
			IDR.mode = "explore";
			trackEvent({
				'page': {
					'name': 'Explore',
					'path': '/explore'
				},
				'event': 'vpv'
			});
			$("#play-button").addClass("show");
			$("#explore-button").removeClass("show");
			//$("#play-button").css("z-index",1);
			//$("#explore-button").css("z-index",0);
			if (IDR.isPortrait) {
				zpos = 700 - 20;
			} else {
				zpos = 550 - 20;
			}
			var tween = new TWEEN.Tween(camera.position).to({
				z: zpos,
				y: -8
			}, 2000).start();
			tween.easing(TWEEN.Easing.Back.InOut);
			// logic for the explore state
			pauseSpeech();
		}

	}


	function addObjectAtLatLng(obj, lat, lng, height) {
		// heght is height from surface of earth
		if (!height) {
			height = 0;
		}
		var pos = latLngToVector3(lat, (lng), radius + height);
		obj.position.set(pos.x, pos.y, pos.z);
		//obj.lookAt(earth.position);
		// instead look away :)
		var v = new THREE.Vector3();
		v.subVectors(obj.position, earth.position).add(obj.position);
		obj.lookAt(v);

		earth.add(obj);
	}


	// convert the positions from a lat, lon to a position on a sphere.
	function latLngToVector3(lat, lon, radius) {
		var phi = (lat) * Math.PI / 180;
		var theta = (lon - 180) * Math.PI / 180;

		var x = -(radius) * Math.cos(phi) * Math.cos(theta);
		var y = (radius) * Math.sin(phi);
		var z = (radius) * Math.cos(phi) * Math.sin(theta);

		return new THREE.Vector3(x, y, z);
	}

	function rotateToLatLng(lat, lng, offsetY) {
		if (!showingDetail) {
			locked = true;
			if (!offsetY) {
				offsetY = 0;
			}
			var rotX = earth.rotation.x;
			var rotY = earth.rotation.y;
			var rotZ = earth.rotation.z;
			var c = earth.rotation.y;
			var d = -lng * (Math.PI / 180) % (2 * Math.PI);
			var f = Math.PI / (2 + offsetY) * -1;
			earth.rotation.y = c % (2 * Math.PI);
			earth.rotation.x = (lat * (Math.PI / 180) % Math.PI) + (Math.PI / 180 * -30);
			earth.rotation.y = d + f;
			var newRotX = earth.rotation.x;
			var newRotY = earth.rotation.y;
			var newRotZ = earth.rotation.z;
			earth.rotation.x = rotX;
			earth.rotation.y = rotY;
			earth.rotation.z = rotZ;
			TWEEN.removeAll();
			var tween = new TWEEN.Tween(earth.rotation).to({
				x: newRotX,
				y: newRotY,
				z: newRotZ
			}, 500).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
			tween.onComplete(function () {
				locked = false;
				targetEarthRotationX = earth.rotation.y;
				targetEarthRotationY = earth.rotation.x
			});
			//
			//locked=false;
			//targetEarthRotationX = 2;
			//targetEarthRotationY = 2;
			//targetEarthRotationOnMouseDownX = 2;
			//targetEarthRotationOnMouseDownY = 2;
			//targetEarthRotationX = newRotY;
			//console.log("Target Earth Rotation X:" + targetEarthRotationX);
			//console.log("Target we want:" + newRotY);

			// override the rotation targetX with the target we now have
			//targetEarthRotationX = earth.rotation.x;

		}

	}

	function playProgress() {

		if (IDR.mode == "play" && IDR.speechPlaying) {
			// keep progress going
			// calc the time to the next Event

			//wangjue
			//currentTime = audio.getCurrentTime("speech");

			// replace with call to audio.getDuration(s);
			//wangjue
			// if (currentTime > 90) {
			// 	pauseSpeech();
			// }

			// console.log("SPEECH TIME: " + currentTime);
			var index = 0;
			if (hotspot.event_data) {
				index = hotspot.event_data.id;
			}
			if (index < IDR.events.length) {
				e = IDR.events[index];
				timeToEvent = e.speechTime - currentTime;
				currentRot = timeline.dial.rotation.y;
				targetRotY = getHotSpotRot(index);
				distance = targetRotY - currentRot;
				playSpeed = distance / timeToEvent;
				// console.log("timeToEvent:" + timeToEvent);
				// console.log("palySpeed:" + playSpeed);
				if (playSpeed < 0) {
					playSpeed *= -1;
				}
			} else {
				//playSpeed = 0;
				timeToEvent = IDR.events[IDR.events.length - 1].speechTime - currentTime;
				currentRot = timeline.dial.rotation.y;
				targetRotY = getHotSpotRot(IDR.events.length - 1);
				distance = targetRotY - currentRot;
				playSpeed = distance / timeToEvent;
				if (playSpeed < 0) {
					playSpeed *= -1;
				}
			}

			if (playSpeed > 0.8) playSpeed = 0.8;
			else if (playSpeed > 0.4) playSpeed = 0.6;
			else if (playSpeed > 0.1) playSpeed = 0.3;
			else playSpeed = 0.022;

		} else {
			playSpeed = 0;
		}
	}

	window.pauseSpeech = function () {
		//wangjue
		//IDR.audio.pause("speech");
		IDR.speechPlaying = false;
		clearInterval(IDR.progressTimer);
		IDR.progressTimer = null;
		playSpeed = 0;
	}



	window.playSpeech = function () {
		if (IDR.mode == "play") {
			// determine where in the speech we are based on the timeline
			currentRot = timeline.dial.rotation.y;
			//console.log("curent rot: " + currentRot);
			// get current Hotspot or first one if none set.
			if (!hotspot.event_data) {
				currentIndex = 0;
			} else {
				currentIndex = hotspot.event_data.id - 1;
			}
			currentHotSpot = IDR.events[currentIndex];
			currentHotSpotRot = getHotSpotRot(currentIndex);
			currentHotSpotTime = currentHotSpot.speechTime;

			// now get prev hotspot or Start position if none.
			if (currentIndex == 0) {
				prevHotSpotRot = minRot;
				prevHotSpotTime = 0;
			} else {
				prevHotSpot = IDR.events[currentIndex - 1];
				prevHotSpotRot = getHotSpotRot(currentIndex - 1);
				prevHotSpotTime = prevHotSpot.speechTime;
			}

			// now get next hotspot or end position if none.
			if ((currentIndex) == IDR.events.length - 1) {
				nextHotSpotRot = getHotSpotRot(IDR.events.length - 1);
				nextHotSpotTime = IDR.events[IDR.events.length - 1].speechTime;
			} else {
				nextHotSpot = IDR.events[currentIndex + 1];
				nextHotSpotRot = getHotSpotRot(currentIndex + 1);
				nextHotSpotTime = nextHotSpot.speechTime;
			}

			//console.log(prevHotSpotTime, currentHotSpotTime, nextHotSpotTime );
			//console.log(prevHotSpotRot, currentHotSpotRot, nextHotSpotRot );


			if (currentRot <= currentHotSpotRot) {
				startRot = prevHotSpotRot;
				endRot = currentHotSpotRot;
				startTime = prevHotSpotTime;
				endTime = currentHotSpotTime;
				currentTime = prevHotSpotTime;
			} else {
				startRot = currentHotSpotRot;
				endRot = nextHotSpotRot;
				startTime = currentHotSpotTime;
				endTime = nextHotSpotTime;
				currentTime = currentHotSpotTime;
			}

			totalDistance = Math.abs(endRot - startRot);
			percent = (currentRot - startRot) / totalDistance;
			totalTime = endTime - startTime;
			percentTime = percent * totalTime;
			targetTime = startTime + percentTime;

			//console.log("totalDistance: " + totalDistance);
			//console.log("totalTime: " + totalTime);
			//console.log(targetTime);

			//targetTime = 13;
			if (targetTime < 0) {
				targetTime = 0;
			}

			// wangjue
			// IDR.audio.setSoundTime("speech", targetTime);
			// IDR.audio.play("speech");
			IDR.speechPlaying = true;
			IDR.progressTimer = setInterval(playProgress, 500);

		}
	}


	function getHotSpotRot(index) {
		if (index == IDR.events.length) {
			index = IDR.events.length - 1;
		}
		//console.log("index:" + index)
		e = IDR.events[index];
		if (e.year == 1996 && e.month < 7) {
			pos = e.month;
		} else if (e.year == 1996 && e.month == 7 && e.day < 5) {
			if (e.day == 2) {
				pos = 7;
			}
			if (e.day == 3) {
				pos = 19;
			}
			if (e.day == 4) {
				pos = 31;
			}
		} else {
			pos = Math.floor((e.year - 1997) * 12) + 47 + e.month + (e.day / 30);
		}
		targetRotY = pos * (2 * Math.PI / 360) + (Math.PI / 180 * 90);
		return targetRotY;
	}



	function start() {
		//  start exp
		//console.log("START");
		trackEvent({
			'page': {
				'name': 'Begin',
				'path': '/begin'
			},
			'event': 'vpv'
		});

		$("#webgl-content").show().addClass("show");
		$("#timeline-detector").show();
		$("#engineeringDetail_wrap").show();

		$("#landing").removeClass("show");
		$("#enter-button").removeClass("show");
		$("#enter-button").remove();

		if (IDR.isMobile == true) {
			$("footer").hide();
			$(".container").css("overflow", "hidden");
		}


		$(".standard-header .titles").addClass("show");
		$(".mobile-header .title small.show").addClass("show");
		$(".mobile-header .title.show").addClass("show");


		// show the intstucitns page first


		// wangjue
		// setTimeout(function () {
		// 	IDR.audio.play("ambient");
		// }, 1000);


		if (IDR.deepLinkID == 21) {
			IDR.deepLinkID = 0;
		}


		setTimeout(function () {

			if (IDR.deepLinkID > 0) {
				// deep link expeince
				console.log("deep link to:" + IDR.events[IDR.deepLinkID - 1].title);
				IDR.mode = "explore";

				if (IDR.isPortrait) {
					zpos = 700 - 20;
				} else {
					zpos = 550 - 20;
				}
				var tween = new TWEEN.Tween(camera.position).to({
					z: zpos,
					y: -8
				}, 2000).start();
				tween.easing(TWEEN.Easing.Back.InOut);

				var posX = camera.position.x;
				var posY = camera.position.y;
				var posZ = camera.position.z;
				var rotX = camera.rotation.x;
				var rotY = camera.rotation.y;
				var rotZ = camera.rotation.z;
				camera.rotation.z = Math.PI / 180 * -50;
				camera.rotation.y = Math.PI / 180 * -90;
				camera.rotation.x = Math.PI / 180 * -30;
				var tween = new TWEEN.Tween(camera.rotation).to({
					x: rotX,
					y: rotY,
					z: rotZ
				}, 5000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);
				var posX = camera.position.x;
				var posY = camera.position.y;
				var posZ = camera.position.z;
				camera.position.set(-500, 700, -250);
				var tween = new TWEEN.Tween(camera.position).to({
					x: posX,
					y: posY,
					z: posZ
				}, 5000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);
				timeline.hide2();

				setTimeout(function () {
					outerRing.show();
				}, 10000);
				setTimeout(function () {
					IDR.audio.play("ambient");
				}, 1000);
				setTimeout(function () {
					timeline.show();
					$("#buttons").addClass("show");
				}, 2000);
				setTimeout(function () {
					locked = false;
					finishedDrift = false;
					hadClickedTimelineHotSpot = true;
					hotspot.event_data = IDR.events[IDR.deepLinkID - 1];
					IDR.showingEventIndex = IDR.deepLinkID - 1;
					hotspot.show();
					if (IDR.deepLinkID == 2) {
						hotspot_alt1.show();
					}
					setTimeout(function () {
						timeline.dial.rotation.y = getHotSpotRot(IDR.deepLinkID - 1);
						targetRotationX = -getHotSpotRot(IDR.deepLinkID - 1);
					}, 500);

					trackEvent({
						'ea': {
							'name': 'Nav',
							'action': 'Timeline',
							'label': 'TIMELINE'
						},
						'event': 'se'
					});
					$("#buttons").addClass("show");
					$("#play-button").addClass("show");
					$("#explore-button").removeClass("show");
				}, 6000);
			} else {
				// regular site experience

				IDR.mode = "play";
				if (IDR.isMobile) {
					IDR.mode = "explore";
				}
				var posX = camera.position.x;
				var posY = camera.position.y;
				var posZ = camera.position.z;
				var rotX = camera.rotation.x;
				var rotY = camera.rotation.y;
				var rotZ = camera.rotation.z;
				camera.rotation.z = Math.PI / 180 * -20;
				camera.rotation.y = Math.PI / 180 * -50;
				camera.rotation.x = Math.PI / 180 * 20;
				var tween = new TWEEN.Tween(camera.rotation).to({
					x: rotX,
					y: rotY,
					z: rotZ
				}, 6000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);

				var posX = camera.position.x;
				var posY = camera.position.y;
				var posZ = camera.position.z;
				camera.position.set(-200, 600, -200);
				var tween = new TWEEN.Tween(camera.position).to({
					x: posX,
					y: posY,
					z: posZ
				}, 5000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);

				timeline.hide2();

				setTimeout(function () {
					outerRing.show();
				}, 9000);

				setTimeout(function () {
					if (!IDR.isMobile) {
						playSpeech();
					}
				}, 6500);


				//outerRing.show(); innerRing.show();
				setTimeout(function () {
					timeline.show();
					$("#buttons").addClass("show");
				}, 4500);
				setTimeout(function () {
					$("#explore-button").addClass("show");
					console.log("isMobile:" + IDR.isMobile);
					if (IDR.isMobile) {
						$("#buttons").addClass("show");
						$("#play-button").addClass("show");
						$("#explore-button").removeClass("show");
						//console.log("got here");
					}
					trackEvent({
						'ea': {
							'name': 'Nav',
							'action': 'Timeline',
							'label': 'TIMELINE'
						},
						'event': 'se'
					});
				}, 6000);
			}

		}, 100);


	}


}