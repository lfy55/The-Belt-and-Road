var table = [
    "H", "Hydrogen", "1.00794", 1, 1,
    "He", "Helium", "4.002602", 18, 1,
    "Li", "Lithium", "6.941", 1, 2,
    "Be", "Beryllium", "9.012182", 2, 2,
    "B", "Boron", "10.811", 13, 2,
    "C", "Carbon", "12.0107", 14, 2,
    "N", "Nitrogen", "14.0067", 15, 2,
    "O", "Oxygen", "15.9994", 16, 2,
    "F", "Fluorine", "18.9984032", 17, 2,
    "Ne", "Neon", "20.1797", 18, 2,
    "Na", "Sodium", "22.98976...", 1, 3,
    "Mg", "Magnesium", "24.305", 2, 3,
    "Al", "Aluminium", "26.9815386", 13, 3,
    "Si", "Silicon", "28.0855", 14, 3,
    "P", "Phosphorus", "30.973762", 15, 3,
    "S", "Sulfur", "32.065", 16, 3,
    "Cl", "Chlorine", "35.453", 17, 3,
    "Ar", "Argon", "39.948", 18, 3,
    "K", "Potassium", "39.948", 1, 4,
    "Ca", "Calcium", "40.078", 2, 4,
    "Sc", "Scandium", "44.955912", 3, 4,
    "Ti", "Titanium", "47.867", 4, 4,
    "V", "Vanadium", "50.9415", 5, 4,
    "Cr", "Chromium", "51.9961", 6, 4,
    "Mn", "Manganese", "54.938045", 7, 4,
    "Fe", "Iron", "55.845", 8, 4,
    "Co", "Cobalt", "58.933195", 9, 4,
    "Ni", "Nickel", "58.6934", 10, 4,
    "Cu", "Copper", "63.546", 11, 4,
    "Zn", "Zinc", "65.38", 12, 4,
    "Ga", "Gallium", "69.723", 13, 4,
    "Ge", "Germanium", "72.63", 14, 4,
    "As", "Arsenic", "74.9216", 15, 4,
    "Se", "Selenium", "78.96", 16, 4,
    "Br", "Bromine", "79.904", 17, 4,
    "Kr", "Krypton", "83.798", 18, 4,
    "Rb", "Rubidium", "85.4678", 1, 5,
    "Sr", "Strontium", "87.62", 2, 5,
    "Y", "Yttrium", "88.90585", 3, 5,
    "Zr", "Zirconium", "91.224", 4, 5,
    "Nb", "Niobium", "92.90628", 5, 5,
    "Mo", "Molybdenum", "95.96", 6, 5,
    "Tc", "Technetium", "(98)", 7, 5,
    "Ru", "Ruthenium", "101.07", 8, 5,
    "Rh", "Rhodium", "102.9055", 9, 5,
    "Pd", "Palladium", "106.42", 10, 5,
    "Ag", "Silver", "107.8682", 11, 5,
    "Cd", "Cadmium", "112.411", 12, 5,
    "In", "Indium", "114.818", 13, 5,
    "Sn", "Tin", "118.71", 14, 5,
    "Sb", "Antimony", "121.76", 15, 5,
    "Te", "Tellurium", "127.6", 16, 5,
    "I", "Iodine", "126.90447", 17, 5,
    "Xe", "Xenon", "131.293", 18, 5,
    "Cs", "Caesium", "132.9054", 1, 6,
    "Ba", "Barium", "132.9054", 2, 6,
    "La", "Lanthanum", "138.90547", 4, 9,
    "Ce", "Cerium", "140.116", 5, 9,
    "Pr", "Praseodymium", "140.90765", 6, 9,
    "Nd", "Neodymium", "144.242", 7, 9,
    "Pm", "Promethium", "(145)", 8, 9,
    "Sm", "Samarium", "150.36", 9, 9,
    "Eu", "Europium", "151.964", 10, 9,
    "Gd", "Gadolinium", "157.25", 11, 9,
    "Tb", "Terbium", "158.92535", 12, 9,
    "Dy", "Dysprosium", "162.5", 13, 9,
    "Ho", "Holmium", "164.93032", 14, 9,
    "Er", "Erbium", "167.259", 15, 9,
    "Tm", "Thulium", "168.93421", 16, 9,
    "Yb", "Ytterbium", "173.054", 17, 9,
    "Lu", "Lutetium", "174.9668", 18, 9,
    "Hf", "Hafnium", "178.49", 4, 6,
    "Ta", "Tantalum", "180.94788", 5, 6,
    "W", "Tungsten", "183.84", 6, 6,
    "Re", "Rhenium", "186.207", 7, 6,
    "Os", "Osmium", "190.23", 8, 6,
    "Ir", "Iridium", "192.217", 9, 6,
    "Pt", "Platinum", "195.084", 10, 6,
    "Au", "Gold", "196.966569", 11, 6,
    "Hg", "Mercury", "200.59", 12, 6,
    "Tl", "Thallium", "204.3833", 13, 6,
    "Pb", "Lead", "207.2", 14, 6,
    "Bi", "Bismuth", "208.9804", 15, 6,
    "Po", "Polonium", "(209)", 16, 6,
    "At", "Astatine", "(210)", 17, 6,
    "Rn", "Radon", "(222)", 18, 6,
    "Fr", "Francium", "(223)", 1, 7,
    "Ra", "Radium", "(226)", 2, 7,
    "Ac", "Actinium", "(227)", 4, 10,
    "Th", "Thorium", "232.03806", 5, 10,
    "Pa", "Protactinium", "231.0588", 6, 10,
    "U", "Uranium", "238.02891", 7, 10,
    "Np", "Neptunium", "(237)", 8, 10,
    "Pu", "Plutonium", "(244)", 9, 10,
    "Am", "Americium", "(243)", 10, 10,
    "Cm", "Curium", "(247)", 11, 10,
    "Bk", "Berkelium", "(247)", 12, 10,
    "Cf", "Californium", "(251)", 13, 10,
    "Es", "Einstenium", "(252)", 14, 10,
    "Fm", "Fermium", "(257)", 15, 10,
    "Md", "Mendelevium", "(258)", 16, 10,
    "No", "Nobelium", "(259)", 17, 10,
    "Lr", "Lawrencium", "(262)", 18, 10,
    "Rf", "Rutherfordium", "(267)", 4, 7,
    "Db", "Dubnium", "(268)", 5, 7,
    "Sg", "Seaborgium", "(271)", 6, 7,
    "Bh", "Bohrium", "(272)", 7, 7,
    "Hs", "Hassium", "(270)", 8, 7,
    "Mt", "Meitnerium", "(276)", 9, 7,
    "Ds", "Darmstadium", "(281)", 10, 7,
    "Rg", "Roentgenium", "(280)", 11, 7,
    "Cn", "Copernicium", "(285)", 12, 7,
    "Nh", "Nihonium", "(286)", 13, 7,
    "Fl", "Flerovium", "(289)", 14, 7,
    "Mc", "Moscovium", "(290)", 15, 7,
    "Lv", "Livermorium", "(293)", 16, 7,
    "Ts", "Tennessine", "(294)", 17, 7,
    "Og", "Oganesson", "(294)", 18, 7
];

var camera, scene, renderer;
var controls, inControll = true;
var lastHotpot = {};
var currentObject;

var position3ds = {};
var objects = [];
var targets = {
    table: [],
    sphere: [],
    helix: [],
    grid: [],
    tile: []
};

var customState = {};

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x = 770;
    camera.position.y = 130;
    camera.position.z = 3000;

    scene = new THREE.Scene();

    // table

    for (var i = 0; i < table.length; i += 5) {

        var element = document.createElement('div');
        element.id = i;
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

        var board = document.createElement('div');
        board.className = 'board';
        element.appendChild(board);

        var video = document.createElement('video');
        video.className = 'video';
        element.appendChild(video);
        element.video = video;

        var card = document.createElement('div');
        card.className = 'card';
        element.appendChild(card);

        var number = document.createElement('div');
        number.className = 'number';
        number.textContent = (i / 5) + 1;
        card.appendChild(number);

        // var symbol = document.createElement('div');
        // symbol.className = 'symbol';
        // symbol.textContent = table[i];
        var geosymbol = document.createElement('img');
        geosymbol.className = 'geosymbol';
        geosymbol.src = './assets/geos/1.png';
        geosymbol.width = "90";
        card.appendChild(geosymbol);
        var flag = document.createElement('img');
        flag.className = 'flag';
        flag.src = './assets/flags/1.png';
        flag.width = "24";
        card.appendChild(flag);
        var cname = document.createElement('div');
        cname.className = 'cname2';
        cname.innerHTML = '哈萨克斯坦';
        card.appendChild(cname);
        var ename = document.createElement('div');
        ename.className = 'ename';
        ename.innerHTML = 'Kazakhstan';
        card.appendChild(ename);
        var attr1 = document.createElement('div');
        attr1.className = 'attr-title1';
        attr1.innerHTML = '人口数量：';
        card.appendChild(attr1);
        var attr2 = document.createElement('div');
        attr2.className = 'attr-title2';
        attr2.innerHTML = '官方语言：';
        card.appendChild(attr2);
        var val1 = document.createElement('div');
        val1.className = 'attr-value1';
        val1.innerHTML = '1300万';
        card.appendChild(val1);
        var val2 = document.createElement('div');
        val2.className = 'attr-value2';
        val2.innerHTML = '哈萨克语';
        card.appendChild(val2);
        var search = document.createElement('img');
        search.className = 'search-icon';
        search.src = './assets/search.png';
        search.width = "10";
        card.appendChild(search);
        var star = document.createElement('img');
        star.className = 'star-icon';
        star.src = './assets/star.png';
        star.width = "10";
        card.appendChild(star);
        var _self = this;
        element.addEventListener("click", (event) => {
            if (currentObject && currentObject.id !== event.currentTarget.id) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (!currentObject && !inControll)
                return;

            if (lastHotpot.element) {
                lastHotpot.element.className = 'element';
                lastHotpot.element.video.src = undefined;
            }

            event.currentTarget.className = 'element show';
            event.currentTarget.video.src = './assets/video/video.mp4';
            event.currentTarget.video.play();
            lastHotpot.element = event.currentTarget;
            if (inControll) {
                lastHotpot.position = camera.position.clone();
                lastHotpot.rotation = camera.rotation.clone();
            }
            inControll = false;
            var position3d = position3ds[event.currentTarget.id];
            var verctorR = new THREE.Vector3(0, 0, 1);
            verctorR.applyAxisAngle(new THREE.Vector3(1, 0, 0), position3d.rotation.x);
            verctorR.applyAxisAngle(new THREE.Vector3(0, 1, 0), position3d.rotation.y);
            verctorR.applyAxisAngle(new THREE.Vector3(0, 0, 1), position3d.rotation.z);
            new TWEEN.Tween(camera.position)
                .to({
                    x: position3d.position.x + 500 * verctorR.x,
                    y: position3d.position.y + 500 * verctorR.y,
                    z: position3d.position.z + 500 * verctorR.z,
                }, 800)
                .start();
            new TWEEN.Tween(camera.rotation)
                .to({
                    x: position3d.rotation.x,
                    y: position3d.rotation.y,
                    z: position3d.rotation.z
                }, 800)
                .onComplete(() => {
                    currentObject = lastHotpot.element;
                })
                .start();
            new TWEEN.Tween(_self)
                .to({}, 900)
                .onUpdate(render)
                .start();
        });

        // var details = document.createElement('div');
        // details.className = 'details';
        // details.innerHTML = table[i + 1] + '<br>' + table[i + 2];
        // element.appendChild(details);

        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

        //

        var object = new THREE.Object3D();
        object.position.x = (table[i + 3] * 140) - 1330;
        object.position.y = -(table[i + 4] * 180) + 990;

        targets.table.push(object);

    }

    // sphere

    var vector = new THREE.Vector3();
    var spherical = new THREE.Spherical();

    for (var i = 0, l = objects.length; i < l; i++) {

        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var object = new THREE.Object3D();

        spherical.set(800, phi, theta);

        object.position.setFromSpherical(spherical);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        targets.sphere.push(object);

    }

    // helix

    var vector = new THREE.Vector3();
    var cylindrical = new THREE.Cylindrical();

    for (var i = 0, l = objects.length; i < l; i++) {

        var theta = i * 0.175 + Math.PI;
        var y = -(i * 8) + 450;

        var object = new THREE.Object3D();

        cylindrical.set(900, theta, y);

        object.position.setFromCylindrical(cylindrical);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        targets.helix.push(object);

    }

    // grid

    for (var i = 0; i < objects.length; i++) {

        var object = new THREE.Object3D();

        object.position.x = ((i % 5) * 400) - 800;
        object.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
        object.position.z = (Math.floor(i / 25)) * 1000 - 2000;

        targets.grid.push(object);

    }

    //

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    renderer.domElement.addEventListener('click', () => {
        if (!inControll && lastHotpot.position) {
            currentObject = undefined;
            if (lastHotpot.element) {
                lastHotpot.element.className = 'element';
                lastHotpot.element = undefined;
            }
            resetCustomState();

            new TWEEN.Tween(camera.position)
                .to({
                    x: lastHotpot.position.x,
                    y: lastHotpot.position.y,
                    z: lastHotpot.position.z
                }, 1200)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();

            new TWEEN.Tween(camera.rotation)
                .to({
                    x: lastHotpot.rotation.x,
                    y: lastHotpot.rotation.y,
                    z: lastHotpot.rotation.z
                }, 1200)
                .onComplete(() => inControll = true)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            new TWEEN.Tween(this)
                .to({}, 1200)
                .onUpdate(render)
                .start();
        }
    });

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);

    var button = document.getElementById('table');
    button.addEventListener('click', function (event) {

        transform(targets.table, 2000);

    }, false);

    var button = document.getElementById('sphere');
    button.addEventListener('click', function (event) {

        transform(targets.sphere, 2000);

    }, false);

    var button = document.getElementById('helix');
    button.addEventListener('click', function (event) {

        transform(targets.helix, 2000);

    }, false);

    var button = document.getElementById('grid');
    button.addEventListener('click', function (event) {

        transform(targets.grid, 2000);

    }, false);

    var button = document.getElementById('tile');
    button.addEventListener('click', function (event) {

        transform(targets.tile, 2000, 'tile');
    }, false);


    tileLayout();
    transform(targets.grid, 2000);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function transform(targets, duration, type) {

    TWEEN.removeAll();

    customState.currentType = type;
    if (type) {
        setTimeout(() => {
            resetCustomState();
        }, duration);
    } else {
        resetCustomState();
    }

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        var target = targets[i];
        position3ds[object.element.id] = target;

        new TWEEN.Tween(object.position)
            .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    // new TWEEN.Tween(camera.position)
    //     .to({
    //         x: 0,
    //         y: 0,
    //         z: 3000
    //     }, duration)
    //     .onUpdate(render)
    //     .start();

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();

    if (inControll)
        controls.update();

}

function render() {

    if (currentObject && customState.currentType !== 'tile') {
        objects.forEach(object => {
            if (object.element.id !== currentObject.id) {
                object.element.style.opacity = 0.2;
            } else {
                object.element.style.opacity = 1.0;
            }
        });
    } else {
        objects.forEach(object => {
            object.element.style.opacity = 1.0;
        });
    }

    renderer.render(scene, camera);
}

function resetCustomState() {
    if (customState.currentType === 'tile') {
        customState.tiles.forEach(tile => {
            tile.element.style.display = 'block';
        });
    } else {
        customState.tiles.forEach(tile => {
            tile.element.style.display = 'none';
        });
    }
}

function tileLayout() {
    for (var i = 0; i < objects.length; i++) {

        var object = new THREE.Object3D();
        var area = i % 4;

        switch (area) {
            case 0:
                object.position.x = (Math.floor(i / 4 % 9) * 140) - 1400;
                object.position.y = -(Math.floor(i / 36) * 180) - 200;
                break;
            case 1:
                object.position.x = (Math.floor(i / 4 % 9) * 140) + 200;
                object.position.y = -(Math.floor(i / 36) * 180) - 200;
                break;
            case 2:
                object.position.x = (Math.floor(i / 4 % 9) * 140) - 1400;
                object.position.y = -(Math.floor(i / 36) * 180) + 700;
                break;
            case 3:
                object.position.x = (Math.floor(i / 4 % 9) * 140) + 200;
                object.position.y = -(Math.floor(i / 36) * 180) + 700;
                break;
            default:
                break;
        }
        object.position.z = 200;
        targets.tile.push(object);
    }
    customState.tiles = [];
    var contitents = ['亚洲', '欧洲', '非洲', '美洲'];
    for (var i = 0; i < contitents.length; i++) {
        var tile = document.createElement('div');
        tile.id = 'tile-' + i;
        tile.className = 'tile';
        tile.innerHTML = contitents[i];
        tile.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!inControll)
                return;

            event.currentTarget.style.display = 'none';
            lastHotpot.position = camera.position.clone();
            lastHotpot.rotation = camera.rotation.clone();
            inControll = false;
            var position3d = customState.tiles.find(tile => tile.element.id === event.currentTarget.id);
            var verctorR = new THREE.Vector3(0, 0, 1);
            verctorR.applyAxisAngle(new THREE.Vector3(1, 0, 0), position3d.rotation.x);
            verctorR.applyAxisAngle(new THREE.Vector3(0, 1, 0), position3d.rotation.y);
            verctorR.applyAxisAngle(new THREE.Vector3(0, 0, 1), position3d.rotation.z);
            new TWEEN.Tween(camera.position)
                .to({
                    x: position3d.position.x + 1200 * verctorR.x,
                    y: position3d.position.y + 1200 * verctorR.y,
                    z: position3d.position.z + 1200 * verctorR.z,
                }, 800)
                .start();
            new TWEEN.Tween(camera.rotation)
                .to({
                    x: position3d.rotation.x,
                    y: position3d.rotation.y,
                    z: position3d.rotation.z
                }, 800)
                .onComplete(() => {
                    currentObject = position3d.element;
                })
                .start();
            new TWEEN.Tween(this)
                .to({}, 900)
                .onUpdate(render)
                .start();
        });
        var object = new THREE.CSS3DObject(tile);
        switch (i) {
            case 0:
                object.position.x = -840;
                object.position.y = 430;
                break;
            case 1:
                object.position.x = 760;
                object.position.y = 430;
                break;
            case 2:
                object.position.x = -840;
                object.position.y = -470;
                break;
            case 3:
                object.position.x = 760;
                object.position.y = -470;
                break;
            default:
                break;
        }

        object.position.z = 210;
        scene.add(object);
        customState.tiles.push(object);
    }
}