import React from "react";
import { PerspectiveCamera, Center, Text3D, Resize } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
function BadgeTexture({user}) { 
      // Define your variables here
    const planeWidth = 3.5;  // Example value
    const textureAspect = 1.5;  // Example value
    const resizeId = "uniqueId123";  // Example unique ID
    // Load the texture using useLoader
    const texture = useLoader(THREE.TextureLoader, '/assets_incase/R.jpeg');
    
  return (
    <>
    <PerspectiveCamera makeDefault manual aspect={1.05} position={[0.49, 0.22, 2]} />
    <mesh>
    <planeGeometry args={[planeWidth, -planeWidth / textureAspect]} />
    <meshBasicMaterial transparent alphaMap={texture} side={THREE.BackSide} />
    </mesh>
    <Center bottom right>
    <Resize key={resizeId} maxHeight={0.45} maxWidth={0.925}>
        <Text3D
        bevelEnabled={false}
        bevelSize={0}
        font="/assets_incase/gt.json"
        height={0}
        rotation={[0, Math.PI, Math.PI]}>
        {user.firstName}
        </Text3D>
        <Text3D
        bevelEnabled={false}
        bevelSize={0}
        font="/assets_incase/gt.json"
        height={0}
        position={[0, 1.4, 0]}
        rotation={[0, Math.PI, Math.PI]}>
        {user.lastName}
        </Text3D>
    </Resize>
    </Center>
    
    </>
  );
}

export default BadgeTexture;
