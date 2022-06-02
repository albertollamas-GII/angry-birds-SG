 
class Red extends THREE.Object3D{
    // Parámetros:
    // scene, la escena
    // sc, la escala del coche
    // x, z,  la posición donde se crea
    constructor(scene,x,y,z) {
      super();
      this.backToCannon = false;
      var red_material = Physijs.createMaterial(
              new THREE.MeshLambertMaterial({ color: 0xca0024, opacity: 1, transparent: false }),
              0.4, 
              0.1 
      );

      //Creamos el cuerpo
      this.geom = new THREE.SphereGeometry(3, 32, 16);
      this.bodyRed = new Physijs.SphereMesh(this.geom, red_material, 13 );
      this.bodyRed.name = "birdBall";
      
      //Creamos la cresta
      var headGeom = new THREE.SphereGeometry(3, 32, 16);
      headGeom.scale(0.25,0.5,0.25);
      var headMesh = new Physijs.SphereMesh(headGeom, red_material, 13 );
      headMesh.rotation.z = Math.PI / 4;
      headMesh.position.set(0,3.25,0);

      var headGeom2 = new THREE.SphereGeometry(3, 32, 16);
      headGeom2.scale(0.25,0.5,0.25);
      var headMesh2 = new Physijs.SphereMesh(headGeom2, red_material, 13 );
      headMesh2.rotation.z = Math.PI / 3;
      headMesh2.position.set(-2,3,0);

      //Creamos la cola
      var black_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 'black', opacity: 1, transparent: false }),
        0.4, 
        0.1 
      );
      var tail1 = new THREE.BoxGeometry(0.75, 1.5, 0.5);
      var tail1Mesh = new Physijs.BoxMesh(tail1, black_material, 13 );
      tail1Mesh.rotation.z = Math.PI / 4;
      tail1Mesh.position.set(-3.25,0,0);
      
      var tail2 = new THREE.BoxGeometry(0.75, 1.5, 0.5);
      var tail2Mesh = new Physijs.BoxMesh(tail2, black_material, 13 );
      tail2Mesh.rotation.z = - (Math.PI / 4);
      tail2Mesh.position.set(-3.25,-1,0);

      //Creamos los ojos
      var white_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 'white', opacity: 1, transparent: false }),
        0.4, 
        0.1 
      );

      var eyeGeom1 = new THREE.SphereGeometry(0.85, 32, 16);
      var eyeMesh1 = new Physijs.SphereMesh(eyeGeom1, white_material, 13 );
      eyeMesh1.position.set(+2,1.25,-1);
      
      var eyeGeom2 = new THREE.SphereGeometry(0.85, 32, 16);
      var eyeMesh2 = new Physijs.SphereMesh(eyeGeom2, white_material, 13 );
      eyeMesh2.position.set(+2,1.25,+1);

      var pupilGeom1 = new THREE.SphereGeometry(0.5, 32, 16);
      var pupilMesh1 = new Physijs.SphereMesh(pupilGeom1, black_material, 13 );
      pupilMesh1.position.set(+2.5,1.25,-1);
      
      var pupilGeom2 = new THREE.SphereGeometry(0.5, 32, 16);
      var pupilMesh2 = new Physijs.SphereMesh(pupilGeom2, black_material, 13 );
      pupilMesh2.position.set(+2.5,1.25,+1);

      //Creamos la boca
      var yellow_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 'yellow', opacity: 1, transparent: false }),
        0.4, 
        0.1 
      );
      var beakGeom = new THREE.ConeGeometry(1, 2, 32,16);
      var beakMesh = new Physijs.SphereMesh(beakGeom, yellow_material, 13 );
      beakMesh.rotation.z = - (Math.PI / 2);
      beakMesh.position.set(+3.5,-0.5,0);

      var grey_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ color: 'grey', opacity: 1, transparent: false }),
        0.4, 
        0.1 
      );
      
      var belly = new THREE.SphereGeometry(2.5, 32, 16);
      var bellyMesh = new Physijs.SphereMesh(belly, grey_material, 13 );
      bellyMesh.position.set(+0.5,-1,0);
      
      this.bodyRed.add(headMesh);
      this.bodyRed.add(headMesh2);
      this.bodyRed.add(tail1Mesh);
      this.bodyRed.add(tail2Mesh);
      this.bodyRed.add(eyeMesh1);
      this.bodyRed.add(eyeMesh2);
      this.bodyRed.add(pupilMesh1);
      this.bodyRed.add(pupilMesh2);
      this.bodyRed.add(beakMesh);
      this.bodyRed.add(bellyMesh);


      this.bodyRed.position.set(x,y,z);
      scene.add(this.bodyRed);

    }
     
    update() {
      if (this.bodyRed.position.y < -0.5 || this.bodyRed.position.x > 300 || this.bodyRed.position.z > 50) {
        this.backToCannon = true;
      }

    }
  }

  