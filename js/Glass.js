/**
 * Clase Box
 * 
 * Crea una caja con una textura de madera en la posicion pasada por parámetros y la añade a la escena
 */



 class Glass {
    // Parámetros:
    // scene, la escena
    // x, y, z,  la posición donde se crea
    constructor(scene,x,y,z,width, height, depth) {

        var glass_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0xf6feff, opacity: 0.6, transparent: true }),
            0.5, // alta friccion
            0.9 // alto rebote
        );

        this.geom = new THREE.BoxGeometry(width, height, depth);
        this.body = new Physijs.BoxMesh(this.geom, glass_material, 10); //Geometria + material + masa
        this.body.position.set(x, y, z);

        this.body.name = "Glass";
        
        // se añade el cuerpo a la escena
        scene.add(this.body);
           
    }

  }
  