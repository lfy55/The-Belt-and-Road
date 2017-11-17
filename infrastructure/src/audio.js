window.audio = {
	context:null,
	sounds:{},
	masterGain:null,
	webAudioAPIEnabled:false,
	soundsReady:false,
	soundsLoaded:0,
	totalSounds:5,
	legacySoundLevel:1,
	init: function(override){
		console.log("init Audio");
		try {
			
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			this.context = new AudioContext();
			this.masterGain = this.context.createGain();
			this.masterGain.connect(audio.context.destination); 
			this.webAudioAPIEnabled = true;

		}
		catch(e) {
			//handle any config we need to init non web audio API sounds
			console.log(e);
			this.webAudioAPIEnabled = false;
		}
		if(override=="disable"){this.webAudioAPIEnabled = false;}
		// load sounds, read these from JSON after its working
		// try to keep these iles small as possible
		if(this.webAudioAPIEnabled){
			this.load("assets/sounds/speech.mp3","speech",false,1); // 1
			this.load("assets/sounds/ambient.mp3","ambient",true,.3); // .3
			this.load("assets/sounds/ambient.mp3","intro",true,.3);
			this.load("assets/sounds/click.mp3","click",false,.5);
			this.load("assets/sounds/pointofinterest_drop.mp3","detail",false,1);
			
		} else {
			// add audio to the site body
			this.loadLegacy("assets/sounds/speech.mp3","speech",false,1); // 1
			this.loadLegacy("assets/sounds/ambient.mp3","ambient",true,.3); // .3
			this.loadLegacy("assets/sounds/ambient.mp3","intro",true,.3);
			this.loadLegacy("assets/sounds/click.mp3","click",false,.5);
			this.loadLegacy("assets/sounds/pointofinterest_drop.mp3","detail",false,1);
		} 
	},

	load : function(file,name,loop,level){
		//console.log("load sound file:" + file);
		
		var sound = {
			name:name,
			file:file,
			startTime:0,
			currentTime:0,
			state:0,
			duration:0,
			source: null,
			buffer:null,
			loop:loop,
			gain:null,
			maxGain:level
		}
		this.sounds[name] = sound;

		// Decode asynchronously
		var request = new XMLHttpRequest();
		request.open('GET', file, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			audio.context.decodeAudioData(request.response, function(buffer) {
				sound.buffer = buffer;
				sound.duration = buffer.duration;
				sound.gain = audio.context.createGain();
				//console.log("sound loaded:" + sound.name);
				audio.soundsLoaded++;
				if(audio.totalSounds == audio.soundsLoaded) { audio.soundsReady = true; }
				//  add to a global load manager to wait for these sounds to be all loaded.
			}, onError);
		}
		request.send();

		onError = function(e){
			console.log("Audio Error",e);
		}

	},

	play: function(s){
		if(this.webAudioAPIEnabled){
			var sound = this.sounds[s];
			if(sound.state==0){
				//console.log("play sound:" + sound.name);
				// initial play
				// creates a sound source
				sound.source = audio.context.createBufferSource(); 
				// set loop value
				sound.source.loop = sound.loop;
				// tell the source which sound to play
				sound.source.buffer = sound.buffer;    
				// conect the source to teh gain node
				sound.source.connect(sound.gain);    
				// set initial gain level
				sound.gain.gain.value = sound.maxGain;          
				// connect the gain to the master Gain
				sound.gain.connect(audio.masterGain); 
				// play the source now
				if (!sound.source.start){
				 	//sound.source.start = sound.source.noteOn;
				} else {
					sound.startTime = audio.context.currentTime;
				 	sound.source.start(0,sound.currentTime % sound.duration);
				 	sound.state=1;
				}

				if(sound.name=="speech"){
					// create echo effect
					var delay = audio.context.createDelay();
				    delay.delayTime.value = 0.05;

				    var feedback = audio.context.createGain();
				    feedback.gain.value = 0.5;

				    var filter = audio.context.createBiquadFilter();
				    filter.frequency.value = 500;

				    delay.connect(feedback);
				    feedback.connect(filter);
				    filter.connect(delay);

				    sound.source.connect(delay);
				    //sound.source.connect(audio.context.destination);
				    delay.connect(sound.gain);
				}

			} else {
				//console.log("already playing sound:"+ s);
			}
		} else {
			this.playLegacy(s);
		}	   
		  


	},



	playFromTo: function(s,start,end){

		if(this.webAudioAPIEnabled){
			var sound = this.sounds[s];
			if(sound.state==0){
				//console.log("play from to sound:" + sound.name);
				// initial play
				// creates a sound source
				sound.source = audio.context.createBufferSource(); 
				// tell the source which sound to play
				sound.source.buffer = sound.buffer;    
				// conect the source to teh gain node
				sound.source.connect(sound.gain);    
				// set initial gain level
				sound.gain.gain.value = sound.maxGain;          
				// connect the gain to the master Gain
				sound.gain.connect(audio.masterGain); 
				// play the source now
				if (!sound.source.start){
				 	//sound.source.start = sound.source.noteOn;
				} else {
					sound.source.start(0,start % sound.duration,(end-start) % sound.duration);
					sound.state = 0;
				}

				if(sound.name=="speech"){
					// create echo effect
					var delay = audio.context.createDelay();
				    delay.delayTime.value = 0.05;

				    var feedback = audio.context.createGain();
				    feedback.gain.value = 0.5;

				    var filter = audio.context.createBiquadFilter();
				    filter.frequency.value = 500;

				    delay.connect(feedback);
				    feedback.connect(filter);
				    filter.connect(delay);

				    sound.source.connect(delay);
				    //sound.source.connect(audio.context.destination);
				    delay.connect(sound.gain);
				}

			} else {
				//console.log("already playing sound:"+ s);
			}
		} else {
			this.playFromToLegacy(s,start,end);
		}	   
		  


	},

	pause:function(s){
		if(this.webAudioAPIEnabled){
			var sound = this.sounds[s];
			if(this.sounds[s].source ){
				//console.log("pause sound:" + s);
				// might need legacy noteOff in here
				//this.sounds[s].source.stop(0);
				//this.sounds[s].source=null;
				
				// create echo effect
				var delay = audio.context.createDelay();
			    delay.delayTime.value = 0.5;

			    var feedback = audio.context.createGain();
			    feedback.gain.value = 0.7;

			    var filter = audio.context.createBiquadFilter();
			    filter.frequency.value = 2000;

			    delay.connect(feedback);
			    feedback.connect(filter);
			    filter.connect(delay);

			    sound.source.connect(delay);
			    sound.source.connect(sound.gain);
			    delay.connect(this.masterGain);

			    setTimeout(function(){
			    	sound.currentTime += audio.context.currentTime - sound.startTime;
					//console.log(sound.currentTime);
					try{sound.source.stop();} catch(err){}
					sound.state=0;
			    },500);
				
			} else {
				//console.log("sound already paused:" + s);
			}
		} else {
			this.pauseLegacy(s);
		}
	},


	fadeOut:function(s){
		if(this.webAudioAPIEnabled){
			var sound = this.sounds[s];
			if(this.sounds[s].source && sound.state==1){
				//console.log("pause sound:" + s);
				// might need legacy noteOff in here
				var tween = new TWEEN.Tween(sound.gain.gain).to({value:0}, 2000).start();
				tween.easing(TWEEN.Easing.Quadratic.InOut);
			    tween.onComplete( function(){
			    	sound.currentTime += audio.context.currentTime - sound.startTime;
					sound.source.stop();
					sound.state=0;
			    });
				
			} 
		} else {
			this.fadeOutLegacy(s);
		}
	},

	muteAll:function(){
		//console.log("mute all sounds");
		if(this.webAudioAPIEnabled){
			this.masterGain.gain.value = 1;
			var tween = new TWEEN.Tween(this.masterGain.gain).to({value:0}, 1000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
		} else {
			this.muteAllLegacy();
		}
		
	},

	unMuteAll:function(){
		//console.log("un mute all sounds");
		if(this.webAudioAPIEnabled){
			var tween = new TWEEN.Tween(this.masterGain.gain).to({value:1}, 1000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
		} else {
			this.unMuteAllLegacy();
		}
	},

	getCurrentTime: function(s){
		if(this.webAudioAPIEnabled){
			var sound = this.sounds[s];
			return sound.currentTime + (this.context.currentTime - sound.startTime);
		} else {
			var sound = this.sounds[s];
			return sound.audioElement.currentTime;
		}
	},

	setSoundTime:function(s,t){
		var sound = this.sounds[s];
		sound.currentTime=t;
	},


	ios_unlock_sound: function(event) {
	    var buffer = audio.context.createBuffer(1, 1, 22050);
	    var source = audio.context.createBufferSource();
	    source.buffer = buffer;
	    source.connect(audio.context.destination);
	    source.noteOn(0);
	    window.removeEventListener("touchend", audio.ios_unlock_sound, false);
	   // console.log("unlocked iOS audio");
	    //alert("audio should be started");
	},



	/*  Legacy NO WEB AUDIO API FUNCTON */

	loadLegacy : function(file,name,loop,level){
		//console.log("load sound file:" + file);

		var _audio = new Audio();
		_audio.src = file;
		_audio.controls = false;
		_audio.autoplay = false;
		_audio.preload = true;
		_audio.loop = loop;
		_audio.id = name;
		document.body.appendChild(_audio);
		_audio.volume = level;

		audio.soundsLoaded++;
		if(audio.totalSounds == audio.soundsLoaded) { audio.soundsReady = true; }
		console.log(audio.soundsLoaded);
		
		var sound = {
			name:name,
			file:file,
			audioElement:_audio,
			startTime:0,
			currentTime:0,
			state:0,
			duration:0,
			loop:loop,
			gain:null,
			maxGain:level
		}
		this.sounds[name] = sound;

	},

	muteAllLegacy: function(){
		for(var soundIndex in this.sounds){
			sound = this.sounds[soundIndex];
			var tween = new TWEEN.Tween(sound.audioElement).to({volume:0}, 1000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
    	};
    	this.legacySoundLevel = 0;
	},

	unMuteAllLegacy: function(){
		for(var soundIndex in this.sounds){
			sound = this.sounds[soundIndex];
			var tween = new TWEEN.Tween(sound.audioElement).to({volume:sound.maxGain}, 1000).start();
			tween.easing(TWEEN.Easing.Quadratic.InOut);
    	};	
    	this.legacySoundLevel = 1;
	},

	playLegacy: function(s){
		var sound = this.sounds[s];
		if(sound.state==0){
			console.log("play sound legacy:" + sound.name);

			// initial play
			sound.audioElement.play();
			sound.audioElement.volume=sound.maxGain;
			if(this.legacySoundLevel == 0) { sound.audioElement.volume = 0; }
			
		} else {
			console.log("already playing sound:"+ s);
		}
	},


	playFromToLegacy: function(s,start,end){
		var sound = this.sounds[s];
		//if(sound.state==0){
		console.log("play sound from to legacy:" + sound.name);

		// start at specific time
		sound.audioElement.currentTime = start;
		sound.audioElement.play();
		sound.audioElement.volume=sound.maxGain;
		if(this.legacySoundLevel == 0) { sound.audioElement.volume = 0; }
		thisTimer = setInterval(function(){if(sound.audioElement.currentTime>=end){sound.audioElement.pause(); clearInterval(thisTimer);thisTimer=null;}},250);
		  


	},


	fadeOutLegacy:function(s){
		console.log("fade out legacy");
		/*
		var sound = this.sounds[s];
		sound = this.sounds[s];
		var tween = new TWEEN.Tween(sound.audioElement).to({volume:0}, 3000).start();
		tween.easing(TWEEN.Easing.Quadratic.InOut);
		this.legacySoundLevel = 0;
		*/
	},

	pauseLegacy:function(s){
		var sound = this.sounds[s];
		sound.audioElement.pause();
	}


}

//window.addEventListener("touchend", audio.ios_unlock_sound, false);


