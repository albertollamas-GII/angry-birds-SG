/**
 * Clase Box
 * 
 * Crea una caja con una textura de madera en la posicion pasada por parámetros y la añade a la escena
 */



class Box {
    // Parámetros:
    // scene, la escena
    // x, y, z,  la posición donde se crea
    constructor(scene,x,y,z,width, height, depth) {

      var texture = new THREE.TextureLoader().load('../imgs/wood.png');
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2,2);
      var material = new THREE.MeshPhongMaterial ({map: texture});
      var physiMaterial = Physijs.createMaterial (material, 1, 0.3); //Creamos el material con la textura, rozamiento y rebote

      this.geom = new THREE.BoxGeometry(width, height, depth);
      this.body = new Physijs.BoxMesh(this.geom, physiMaterial, 10); //Geometria + material + masa
      this.body.position.set(x, y, z);
      
      // se añade el cuerpo a la escena
      scene.add(this.body);
           
    }

  }
  