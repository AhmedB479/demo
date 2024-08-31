import React from "react";
import { PerspectiveCamera, Center, Text3D, Resize } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

function BadgeTexture({ user }) { 
  // Define your variables here
  const planeWidth = 3.5;  // Example value
  const textureAspect = 1.5;  // Example value
  const resizeId = "uniqueId123";  // Example unique ID
  
  // Load the texture using useLoader
  const texture = useLoader(THREE.TextureLoader, '/assets_incase/R.jpeg');
  const args = {
    color:"black"
  };
  return (
    <>
      <PerspectiveCamera makeDefault manual aspect={1.05} position={[0.49, 0.22, 2]} />
      
      <mesh>
        <planeGeometry args={[planeWidth, -planeWidth / textureAspect]} />
        {/* <meshBasicMaterial transparent map={texture} side={THREE.BackSide} /> */}
        <meshBasicMaterial color={"black"} side={THREE.BackSide} />
      </mesh>
      
      <Center>
        <Resize key={resizeId} maxHeight={0.45} maxWidth={0.925}>
          <Text3D
            bevelEnabled={false}
            bevelSize={0}
            size={"10"}
            font="/assets_incase/Poppins Black_Regular.json"
            height={0.1} // Make sure to add height if needed
            scale={[0.9, 1, 0.9]}
            position={[0, -1, 0]} // Adjust position to be in front of the plane
            rotation={[0, Math.PI, Math.PI]}
            {...args}
            >
            <meshBasicMaterial color={"violet"} />
            {user.firstName}
          </Text3D>

          <Text3D
            bevelEnabled={false}
            bevelSize={0}
            size={"10"}
            font="/assets_incase/Poppins Black_Regular.json"
            height={0.1} // Make sure to add height if needed
            scale={[0.9, 1, 0.9]}
            position={[0, 1, 0]} // Adjust position to be in front of the plane
            rotation={[0, Math.PI, Math.PI]}>
            {user.lastName}
          </Text3D>
        </Resize>
      </Center>
    </>
  );
}

export default BadgeTexture;
