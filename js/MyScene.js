/**
 * Como norma general durante los archivos, se ha denominado bola/ball al pájaro que se lanza, por sencillez
 * para el programador y el lector.
 * 
 * Mezclo el español con el ingles sin querer por lo que hay variables en ambos idiomas.
 * 
 */

 const PIGS_LEVEL1 = 3; 
 const PIGS_LEVEL2 = 5; 
 const PIGS_LEVEL3 = 5; 

class MyPhysiScene extends Physijs.Scene {
    constructor (myCanvas) {
      // El gestor de hebras
      Physijs.scripts.worker = './physijs/physijs_worker.js'
      // El motor de física de bajo nivel, en el cual se apoya Physijs
      Physijs.scripts.ammo   = './ammo.js'
  
      super();
      this.primerupdate = 0;
      //Conntrolar comienzo
      this.start = false;
      this.restart = false;
      //Controla el movimiento inicial para ver cuando hacerlo y volver a colocarse en la posicion del cañon
      this.movimientoInicial = true;
      this.nextLevel = false;
      //Nos dice si ha lanzado la bola
      this.ballLaunched = false;
      //Control para el numero de cerdos muertos
      this.cerdosMuertos = 0;
      //Control para el numero de bolas lanzadas
      this.bolasLanzadas = 0;
      this.score = 0;

      // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
      this.renderer = this.createRenderer(myCanvas);
      
      // Se establece el valor de la gravedad, negativo, los objetos caen hacia abajo
      this.setGravity (new THREE.Vector3 (0, -7, 0));
      
      // Se crean y añaden luces a la escena
      this.createLights ();

      this.level = 0;
      //Al estar siempre en el mismo lugar lo inicializamos en el constructor
      this.cannon = new Cannon(this);

      // Tendremos varias cámaras que acompañan los movimientos
      this.createCamera ();
      
      
      // Un suelo 
      this.createGround ();
            
      // Medida del tiempo
      this.clock = new THREE.Clock();

      var botonAceptar = document.getElementById('accept-button')
      
      botonAceptar.onclick= function () {
        document.getElementById('new-game-dialog').style.display = "none";
        document.getElementById('choose-level').style.visibility = "visible";
      }

      this.showHelp = false;

      
    }

    //METODO QUE CREA LA PELOTA EN EL CAÑON
    createBall() {
      
      var posX = this.cannon.cannon.position.x + Math.cos((Math.PI/2) - this.cannon.cannon.rotation.z) * 10;
      var posY = (this.cannon.cannon.position.y+0.2+22+5) - Math.cos(this.cannon.cannon.rotation.z) * 10;
      var posZ = this.cannon.cannon.position.z - Math.sin(this.cannon.cannon.rotation.y) * 10;
      this.ball = new Red(this, posX, posY, posZ);

      this.ball.bodyRed.addEventListener ('collision', (o,v,r,n) => {
        if (o.name === "Pig") {
          this.playSound('../sounds/pig.mp3');
          this.remove(o);
          this.cerdosMuertos++;
          this.score += 100;
          var score = document.getElementById('puntos').innerHTML = this.score.toString();
        }

        if (o.name === "Glass") {
          this.remove(o);
        }
      });
    }

    //METODOS QUE COMPRUEBAN EVENTOS DE TECLADO

    showControls(event) {
      var Key = event.which || event.KeyCode;
      var help = document.getElementById('help-menu');
      switch(Key) {
        case KeyCode.KEY_H:
          if (this.showHelp == false){
            this.showHelp = true;
          } else {
            this.showHelp = false;
          }
          
          break;
      }
    }


    maintainCannonElevationControls(event){

      var Key = event.which || event.KeyCode;
      switch(Key) {
        case KeyCode.KEY_W:
          this.cannon.up = true;
          this.cannon.cannon.__dirtyRotation = true;
          this.cannon.__dirtyPosition = true;
          this.cannon.setAngulo(0.01); 
          break;
        case KeyCode.KEY_S:
          this.cannon.down = true;
          this.cannon.cannon.__dirtyRotation = true;
          this.cannon.__dirtyPosition = true;
          this.cannon.setAngulo(0.01); 
          break;
      }
    }

    maintainCannonRightLeft(event){
      var Key = event.which || event.KeyCode;
      switch(Key) {
        case KeyCode.KEY_A:
          this.cannon.left = true;
          this.cannon.cannon.__dirtyRotation = true;
          this.cannon.__dirtyPosition = true;
          this.cannon.setAngulo(0.01);          
          break;
        case KeyCode.KEY_D:
          this.cannon.right = true;
          this.cannon.cannon.__dirtyRotation = true;
          this.cannon.__dirtyPosition = true;
          this.cannon.setAngulo(0.01); 
          break;
      }
     
    }


    maintainBallKeypresses(event){
      var Key = event.which || event.keyCode;
      switch (Key) {
        case KeyCode.KEY_F:
          if( !this.ballLaunched){
            this.createBall();
            this.playSound('../sounds/red.mp3');
            this.bolasLanzadas++;
            this.ballLaunched = true;
            this.ball.bodyRed.applyCentralImpulse( new THREE.Vector3( 1500, -( Math.PI / 2 - this.cannon.cannon.rotation.z ), -this.cannon.cannon.rotation.y * 1000 ) );
          }
          break;
        case KeyCode.KEY_L:
          if( this.ballLaunched){
              this.ballLaunched = false;
              this.remove( this.ball );
          }
      }
    }

    onKeyUp (event) {
      var key = event.which || event.keyCode;
      switch (key) {
        case KeyCode.KEY_A : 
          this.cannon.left = false;
          break;
        case KeyCode.KEY_D :
          this.cannon.right = false;
          break;
        case KeyCode.KEY_S :
          this.cannon.down = false;
          break;
        case KeyCode.KEY_W :
          this.cannon.up = false;
          break;
      }
    }

    //Crea los 'obstaculos' del mundo, es decir, los cerdos y las cajas/cristales
    createBoxes(level) {
        if (level == 1) {
            //Trio central
            var box1 = new Box(this, 200, 1.5, -1, 3, 3, 3);
            var box2 = new Box(this, 202, 1.5, 4, 3 , 3, 3);
            var box3 = new Box(this, 200, 5, 1.5, 3 , 3, 3);
            this.pig1 = new Pig(this, 200, 9, 1.5, 2);

            //Columna
            var box4 = new Box(this, 220, 5, 10, 3, 3, 3);
            var box5 = new Box(this, 220, 1.5, 10, 3, 3, 3);
            this.pig2 = new Pig(this, 220, 8, 10, 2);

            //Detras cristal

            var glass1 = new Glass(this, 215, 4, -10, 1.5, 6, 5);
            this.pig3 = new Pig(this, 222, 4, -10, 3);


        } else if (level == 2) {

          var box1 = new Box(this, 200, 6.5, -20, 4,10,4 );
          var box1 = new Box(this, 200, 6.5, -10, 4,10,4 );
          var box1 = new Box(this, 200, 13, -15, 5,2,10 );
          this.pig1 = new Pig(this, 200, 16.5, -15, 2);
          this.pig2 = new Pig(this, 200, 4, -15, 3);

          var box1 = new Box(this, 180, 6.5, 0, 2,5,2 );
          var box1 = new Box(this, 180, 6.5, 5, 2,5,2 );
          var box1 = new Box(this, 180, 10, 2.5, 4,2,7 );
          this.pig3 = new Pig(this, 180, 6, 2.5, 1);

          var box1 = new Box(this, 210, 6.5, 26, 2,5,2 );
          var box1 = new Box(this, 210, 6.5, 29, 2,5,2 );
          var box1 = new Box(this, 210, 6.5, 17, 2,5,2 );
          var box1 = new Box(this, 210, 10, 22.5, 4,2,15 );
          var box1 = new Box(this, 210, 13, 24.5, 4,4,4 );
          this.pig4 = new Pig(this, 210, 19, 24.5, 3);
          this.pig5 = new Pig(this, 210, 6.5, 22, 2);

        } else if (level == 3) {
          var box1 = new Box(this, 200, 6.5, -20, 4,10,4 );
          this.pig1 = new Pig(this, 200, 12.5, -20, 2);

          box1 = new Box(this, 170, 6.5, 0, 4,10,10 );
          this.pig2 = new Pig(this, 176, 6.5, 0, 3);

          var glass1 = new Glass(this, 215, 4, 10, 4, 8, 4);
          glass1 = new Glass(this, 215, 4, 20, 4, 8, 4);
          box1 = new Box(this, 215, 11, 15, 3, 3, 10 );
          this.pig3 = new Pig(this, 215, 14, 15, 2);

          this.pig4 = new Pig(this, 195, 4.5, -20, 1);

          this.pig5 = new Pig(this, 215, 4.5, 15, 2);

        }


    }

    //Comprueba si se ha completado el nivel
    endLevel() {
      switch (this.level){
        case 1:
          if (this.cerdosMuertos == PIGS_LEVEL1){
            this.nextLevel = true;
          } else {
            if (this.bolasLanzadas > 3 ) {
              this.restart = true;
            }
          }
          break;
        case 2:
          if (this.cerdosMuertos == PIGS_LEVEL2){
            this.nextLevel = true;
          } else {
            if (this.bolasLanzadas > 5 ) {
              this.restart = true;
            }
          }
          break;
        case 3:
          if (this.cerdosMuertos == PIGS_LEVEL3){
            this.nextLevel = true;
          } else {
            if (this.bolasLanzadas > 7 ) {
              this.restart = true;
            }
          }
          break;
      }
    }

    //Comprueba si un cerdo ha salido del suelo del mundo => muere
    checkPigDown() {
      if (this.level == 1){
          if (this.pig1.cerdoCaido == true){
            this.score += 100;
            var score = document.getElementById('puntos').innerHTML = this.score.toString();
            this.cerdosMuertos++;
            this.pig1.cerdoCaido = false;
            this.remove(this.pig1);
          }

          if (this.pig2.cerdoCaido == true){
            this.score += 100;
            var score = document.getElementById('puntos').innerHTML = this.score.toString();
            this.pig2.cerdoCaido = false;
            this.cerdosMuertos++;
            this.remove(this.pig2);
          }

          if (this.pig3.cerdoCaido == true){
            this.score += 100;
            this.cerdosMuertos++;
            var score = document.getElementById('puntos').innerHTML = this.score.toString();
            this.pig3.cerdoCaido = false;
            this.remove(this.pig3);
          }
      } else if (this.level == 2 || this.level == 3){
        if (this.pig1.cerdoCaido == true){
          this.score += 100;
          var score = document.getElementById('puntos').innerHTML = this.score.toString();
          this.cerdosMuertos++;
          this.pig1.cerdoCaido = false;
          this.remove(this.pig1);
        }

        if (this.pig2.cerdoCaido == true){
          this.score += 100;
          var score = document.getElementById('puntos').innerHTML = this.score.toString();
          this.pig2.cerdoCaido = false;
          this.cerdosMuertos++;
          this.remove(this.pig2);
        }

        if (this.pig3.cerdoCaido == true){
          this.score += 100;
          this.cerdosMuertos++;
          var score = document.getElementById('puntos').innerHTML = this.score.toString();
          this.pig3.cerdoCaido = false;
          this.remove(this.pig3);
        }

        if (this.pig4.cerdoCaido == true){
          this.score += 100;
          this.cerdosMuertos++;
          var score = document.getElementById('puntos').innerHTML = this.score.toString();
          this.pig4.cerdoCaido = false;
          this.remove(this.pig4);
        }
        if (this.pig5.cerdoCaido == true){
          this.score += 100;
          this.cerdosMuertos++;
          var score = document.getElementById('puntos').innerHTML = this.score.toString();
          this.pig5.cerdoCaido = false;
          this.remove(this.pig5);
        }
      }
    }
    
    createRenderer (myCanvas) {
      // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
      
      // Se instancia un Renderer   WebGL
      var renderer = new THREE.WebGLRenderer();
      
      // Se establece un color de fondo en las imágenes que genera el render
      renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
      
      // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // La visualización se muestra en el lienzo recibido
      $(myCanvas).append(renderer.domElement);
      
      return renderer;  
    }
    
    /// Método que actualiza la razón de aspecto de la cámara y el tamaño de la imagen que genera el renderer en función del tamaño que tenga la ventana
    onWindowResize () {
      this.setCameraAspect (window.innerWidth / window.innerHeight);
      this.renderer.setSize (window.innerWidth, window.innerHeight);
    }
  
    
    //crea el fondo de nuestro mundo

    createBackground() {
        var extension = 'png';
        var path = '';
        if (this.level == 1)
          path = 'imgs/scene/level1/';
        else if (this.level == 2)
          path = 'imgs/scene/levelMed/';
        else if (this.level == 3)
          path = 'imgs/scene/level3/';
        
        var urls = [
            path + 'px.' + extension,
            path + 'nx.' + extension,
            path + 'py.' + extension,
            path + 'ny.' + extension,
            path + 'pz.' + extension,
            path + 'nz.' + extension
        ];
        var textureCube = new THREE.CubeTextureLoader ().load(urls) ;
        this.background = textureCube ;
    }
    
    //Crea el suelo de nuestro mundo

    createGround () {
      var geometry = new THREE.BoxGeometry (500,0.2,300);
      geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,-0.1,0));
      var texture = new THREE.TextureLoader().load('../imgs/ground.jpeg');
      //Para repetir la textura del suelo
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10,10);
      var material = new THREE.MeshPhongMaterial ({map: texture});
      var materialDark = new THREE.MeshPhongMaterial ({map: texture, color: 0xbfbfbf});
      var physiMaterial = Physijs.createMaterial (material, 1, 0.1);
      var physiMaterialDark = Physijs.createMaterial (materialDark, 0.2, 0.5);
      var ground = new Physijs.BoxMesh (geometry, physiMaterial, 0);
      
      //si el cerdo choca con el suelo muere (no lo he puesto para poder poner cerdos en el suelo)
      // ground.addEventListener ('collision', (o,v,r,n) => {
      //   if (o.name === "Pig") {
      //     this.remove(o);
      //     this.cerdosMuertos++;
      //     this.score += 100;
      //     var score = document.getElementById('puntos').innerHTML = this.score.toString();
      //   }
      // });

      this.add (ground);

      
    }

    //METODO QUE AÑADE SONIDO
    playSound(soundEffectPath){
      //Se crea un AudioListener y se asocia a la cámara
      var listener = new THREE.AudioListener();
      this.cameraCannon.add( listener );
  
      // Creamos una fuente de audio global
      var sound = new THREE.Audio( listener );
  
      var audioLoader = new THREE.AudioLoader();
  
      //Cargamos el sonido y lo añadimos a la fuente de audio
      audioLoader.load( soundEffectPath, function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop(false);
          sound.setVolume(0.2);
          sound.play();
      });
  
  }
  
  //METODO PARA CREAR LUCES

  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.75);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
//     this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
    this.spotLight.position.set( 200, 200, 100 );
    this.add (this.spotLight);
  }

    //METODOS RELACIONADOS CON LAS CAMARAS

    createCamera () {
      // Para crear una cámara le indicamos
      //   El ángulo del campo de visión en grados sexagesimales (fov)
      //   La razón de aspecto ancho/alto
      //   Los planos de recorte cercano y lejano
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      // También se indica dónde se coloca
      this.camera.position.set (0, 10, 50);
      // Y hacia dónde mira

    //   var objectPos = ;
    //   this.red.getWorldPosition(objectPos);
      var look = new THREE.Vector3(200,10,0);
      this.camera.lookAt(look);
      this.add (this.camera);

      
     // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
      this.cameraControl = new THREE.TrackballControls (this.camera, this.renderer.domElement);
      // Se configuran las velocidades de los movimientos
      this.cameraControl.rotateSpeed = 5;
      this.cameraControl.zoomSpeed = -2;
      this.cameraControl.panSpeed = 0.5;
      // Debe orbitar con respecto al punto de mira de la cámara
      this.cameraControl.target = look;
      this.cameraControl.enabled = true;
    //   Hacemos que la camara no rote
      this.cameraControl.noRotate = true;
      
      //Camara encima del cañon para cuando lancemos
      this.cameraCannon = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.cameraCannon.position.set(this.cannon.cannon.position.x-10, this.cannon.cannon.position.y+25, this.cannon.cannon.position.z);
      // this.cameraCannon.position.set(0, this.cannon.cannon.position.y+3, 50);
      this.add(this.cameraCannon);

      //Camara follow Bird
      this.cameraFollow = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);  
      this.cameraFollow.position.set(this.cannon.cannon.position.x -15, this.cannon.cannon.position.y+25, this.cannon.cannon.position.z);


      //Camara static para antes de empezar
      this.camaraStatic = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);  
      this.camaraStatic.position.set(100,100,0);
      this.camaraStatic.lookAt(new THREE.Vector3(0,0,0));

      //Por si se desea probar algo
      // this.cameraControl2 = new THREE.TrackballControls (this.camaraStatic, this.renderer.domElement);
      // // Se configuran las velocidades de los movimientos
      // this.cameraControl2.rotateSpeed = 5;
      // this.cameraControl2.zoomSpeed = -2;
      // this.cameraControl2.panSpeed = 0.5;
      // // Debe orbitar con respecto al punto de mira de la cámara
      // look = new THREE.Vector3(0,0,0);
      // // this.cameraContro2.target = look;
      // this.cameraControl2.enabled = true;
    }

    createInitialSpline() {
      this.spline = new THREE.CatmullRomCurve3( [
          new THREE.Vector3(200,10,50),
          new THREE.Vector3(-50,10,50),
          new THREE.Vector3(-60,10,50),
          new THREE.Vector3(-20,25,0),
          new THREE.Vector3(this.cannon.cannon.position.x-10, 25, this.cannon.cannon.position.z)
      ]);
  }

  initialCameraMovement() {
      this.movimientoInicial = true;
      const start    = { t: 0 };
      const end      = { t: 1 };
      new TWEEN.Tween(start)
          .to(end, 6000)
          .onUpdate( () =>{
              var pos = this.spline.getPointAt (start.t);
              this.camera.position.copy(pos);
          })
          .easing(TWEEN.Easing.Linear.None)
          .onComplete( () => this.movimientoInicial = false)
          .start()
  }
  

  backToCannon() {
    this.movimientoInicial = true;
    const start    = { t: 0 };
    const end      = { t: 1 };
    new TWEEN.Tween(start)
        .to(end, 3000)
        .onUpdate( () =>{
            var pos = this.spline.getPointAt (start.t);
            this.camera.position.copy(pos);
        })
        .easing(TWEEN.Easing.Linear.None)
        .onComplete( () => this.movimientoInicial = false)
        .start()
  }
    
    getCamera () {
      if (this.start) {
        if (this.movimientoInicial){
          return this.camera;
        } else if (this.ballLaunched) {
          if (this.ball.backToCannon) {
            this.backToCannon();
            this.ballLaunched = false;
            return this.camera;          
          } else {
            this.cameraFollow.position.set(this.ball.bodyRed.position.x + 10, this.ball.bodyRed.position.y + 5, this.ball.bodyRed.position.z + 50)
            this.cameraFollow.lookAt(this.ball.bodyRed.position.x, this.ball.bodyRed.position.y, this.ball.bodyRed.position.z);
            return this.cameraFollow;
          }
        } else {
          // this.cameraCannon.set(this.cannon.cannon.position.x, this.cannon.cannon.position.y + 15, this.cannon.position.z);
          this.cameraCannon.lookAt(new THREE.Vector3(200,10+this.cannon.cannon.rotation.z *100,-this.cannon.cannon.rotation.y *100));
          // this.cameraCannon.lookAt(new THREE.Vector3(0,10,0));
          return this.cameraCannon;
        }
      } else {
        return this.camaraStatic;
      }
    }

    setCameraAspect (ratio) {
      this.camera.aspect = ratio;
      this.camera.updateProjectionMatrix();
    }
    
    restartLevel() {
      this.bolasLanzadas = 0;
      this.cerdosMuertos = 0;
      this.score = 0;
      this.movimientoInicial = true;
    }


    
    update () {

     if (this.start == true) { 
      // Medida del tiempo transcurrido
      this.timeInSeconds = this.clock.getDelta();

      if (this.primerupdate == 1){
        this.createBoxes(this.level);
        this.createBackground();
        document.getElementById('help').style.visibility = "visible";

      }

      // Se actualizan los elementos de la escena para cada frame
      // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
      // Se actualiza la posición de la cámara según su controlador
      this.cameraControl.update();
      // this.cameraControl2.update();
      this.cannon.update();

      if (this.ballLaunched)
        this.ball.update();
      // Se le pide al motor de física que actualice las figuras según sus leyes
      this.simulate ();

      // Se le pide al renderer que renderice la escena que capta una determinada cámara, que nos la proporciona la propia escena.
      this.renderer.render(this, this.getCamera());
      if (this.primerupdate == 1){
        this.createInitialSpline();
        this.initialCameraMovement();
        this.primerupdate++;
        this.playSound('../sounds/theme-song.mp3');
      }
      // Por último, se solicita que la próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
      // La propia función render es la que indica que quiere ejecutarse la proxima vez
      // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.
      
      TWEEN.update();

      if (this.showHelp) {
        document.getElementById('help-menu').style.visibility = "visible";
      } else {
        document.getElementById('help-menu').style.visibility = "hidden";
      }

      if (this.level == 1) {
        this.pig1.update();
        this.pig2.update();
        this.pig3.update();
        
        this.checkPigDown();
      } else if (this.level == 2 || this.level == 3) {
        this.pig1.update();
        this.pig2.update();
        this.pig3.update();
        this.pig4.update();
        this.pig5.update();
        this.checkPigDown();
      }

      this.endLevel();
      if (document.getElementById('num-cannonballs').innerHTML == "-1"){
        this.start = false;
        console.log(document.getElementById('num-cannonballs').innerHTML.toString());

      }
      if (this.nextLevel) {
        console.log("aqui");
        var win = document.getElementById('game-over-win');
        win.style.visibility = "visible";
        document.getElementById('num-targets').innerHTML = this.cerdosMuertos.toString();
        document.getElementById('num-cannonballs').innerHTML = this.bolasLanzadas.toString();
        document.getElementById('back-to-menu-button').onclick = function() {
          document.getElementById('num-cannonballs').innerHTML = "-1";
        };
        this.nextLevel = false;
        
      } else if (this.restart) {
        document.getElementById('game-over-loss').style.visibility = "visible";
        this.restart = false;
      }
      
      requestAnimationFrame(() => this.update());


    } else {
        document.getElementById('level-1').onclick = function() {
          document.getElementById('nivel-elegido').innerHTML = "1";
        };
        document.getElementById('level-2').onclick = function() {
          document.getElementById('nivel-elegido').innerHTML = "2";
        };

        document.getElementById('level-3').onclick = function() {
          document.getElementById('nivel-elegido').innerHTML = "3";

        };

      if (document.getElementById('nivel-elegido').innerHTML == "1"){
        this.level = 1;
        document.getElementById('choose-level').style.visibility = "hidden";
        this.start = true;
        this.primerupdate++;
        
      } else if (document.getElementById('nivel-elegido').innerHTML == "2") {
        this.level = 2;
        document.getElementById('choose-level').style.visibility = "hidden";
        this.start = true;
        this.primerupdate++;
      
      } else if (document.getElementById('nivel-elegido').innerHTML == "3") {
        this.level = 3;
        document.getElementById('choose-level').style.visibility = "hidden";
        this.start = true;
        this.primerupdate++;
      
      }
      

      requestAnimationFrame(() => this.update());


    }
  }
    
}
  
  /// La función principal
  $(function () {
    
    // Se crea la escena
    var scene = new MyPhysiScene ("#WebGL-output");
    
    // listeners
    // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
    window.addEventListener ("resize", () => scene.onWindowResize());
    window.addEventListener ("keydown",() => scene.maintainCannonElevationControls(event));
    window.addEventListener ("keydown",() => scene.showControls(event));
    window.addEventListener ("keydown",() => scene.maintainBallKeypresses(event));
    window.addEventListener ("keydown",   () => scene.maintainCannonRightLeft(event));
    window.addEventListener ("keyup",   () => scene.onKeyUp(event));
    // Finalmente, realizamos el primer renderizado.
    
    
    
    scene.update();
  });
  
  