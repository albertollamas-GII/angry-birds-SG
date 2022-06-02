class Pig {
    constructor (scene, x, y, z, radius) {
        this.cerdoCaido = false;
        var green_material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x008000, opacity: 1, transparent: true }),
            0, // alta friccion
            0.9 // alto rebote
        );

        var texture = new THREE.TextureLoader().load('imgs/pig.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        texture.offset.set(4,4);

        var material = new THREE.MeshPhongMaterial ({map: texture, color: 0x3d8f3d});
        
        this.geom = new THREE.SphereGeometry(radius, 32, 16);
        this.body = new Physijs.SphereMesh(this.geom, material, 10);
        this.body.position.set(x,y,z);
        this.body.rotation.y = Math.PI ;
        this.body.name = "Pig";

        // se añade el cuerpo a la escena
        scene.add(this.body);

    }

    update() {
        if(this.body.position.y < -0.5) {
            this.cerdoCaido = true;
        }
        

        if (this.body.position.y < -0.6) {
            this.cerdoCaido =false;
        }
    }
}