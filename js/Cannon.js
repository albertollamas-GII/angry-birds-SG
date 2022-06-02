class Cannon {

    constructor(scene) {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.base = this.createBase();
        scene.add(this.base);

        this.cannon = this.createCannon();
        scene.add(this.cannon);
    }

    createBase() {
        var platform = new THREE.BoxGeometry(30,10,30);
        var texture = new THREE.TextureLoader().load('imgs/cannon-base.jpeg');
        var material = new THREE.MeshPhongMaterial( {map: texture} );
        var cube = new THREE.Mesh( platform, material );
        cube.position.set(-4,0.2+5,0);
        return cube;
    }


    createCannon() {
        var geometry = new THREE.SphereGeometry( 5, 32, 16 );
        var material = new THREE.MeshBasicMaterial( { color: 'black' } );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(-7.5,0.2+10+5,0);

        var fullCannon = new THREE.Object3D();
        var cylinderGeometry = new THREE.CylinderGeometry( 5, 4, 20, 32 );
        var cylinderMaterial = new THREE.MeshLambertMaterial({color:'black'});
        this.cannonBarrel = new THREE.Mesh( cylinderGeometry, cylinderMaterial, 0 );
        this.cannonBarrel.position.y = 10+0.2+5;

        this.cannonBarrel.rotation.z = Math.PI / 2;
        this.cannonBarrel.position.x = 3;
        this.cannonBarrel.position.z = 0;
        this.cannonBarrel.name = "Cannon";
        fullCannon.add(sphere);
        fullCannon.add(this.cannonBarrel);
        
        return fullCannon;

    }

    setAngulo(valor) {
        //Al haberlo rotado 90 en el create, tenemos w gira en Z, s en -Z, a en -Y, d en +Y
        if (this.left) {
            this.cannon.rotation.y = this.cannon.rotation.y + valor;
            if( this.cannon.rotation.y < -( Math.PI / 3 ) )
            {
              this.cannon.rotation.y = ( Math.PI / 3 );
            }
        } else if (this.right) {
            this.cannon.rotation.y -= valor; 
        } else if (this.up) {
            this.cannon.rotation.z += valor;
            
        } else if (this.down) {
            this.cannon.rotation.z -= valor;
          console.log('Entra aqui');
          if( this.cannon.rotation.z < 0 )
          {
            this.cannon.rotation.z = 0;
          }
        }
    }

    update() {
    }
}