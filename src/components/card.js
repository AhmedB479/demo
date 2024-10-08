// import * as THREE from "three";
// import { useEffect, useRef, useState } from "react";
// import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
// import {
//   useGLTF,
//   useTexture,
//   Environment,
//   Lightformer,
//   RenderTexture
// } from "@react-three/drei";
// import {
//   BallCollider,
//   CuboidCollider,
//   Physics,
//   RigidBody,
//   useRopeJoint,
//   useSphericalJoint,
// } from "@react-three/rapier";
// import { MeshLineGeometry, MeshLineMaterial } from "meshline";
// import { useControls } from "leva";
// import BadgeTexture from "./badgetexture";
// import { PerspectiveCamera, Center, Text3D, Resize } from "@react-three/drei";
// import { useLoader } from "@react-three/fiber";

// extend({ MeshLineGeometry, MeshLineMaterial });
// useGLTF.preload(
//   "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb"
// );
// useTexture.preload(
//   "/assets_incase/band.jpg"
// );
// // IMPORTANT DO NOT REMOVE
// // from https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber

// // npm install @react-three/drei@9.96.4 @react-three/fiber@8.15.15 @react-three/rapier@1.3.0 @types/three@0.160.0 leva@0.9.33 meshline@3.2.0 react-dom@18.2.0 react-scripts@5.0.1 three@0.160.1

// // https://github.com/pmndrs/drei/issues/1596
// // metro.config.js is important here or else you will get errors solution to it is in link below
// // https://gist.github.com/Grano22/f63698d5245beebeee7d5b57e0afd7df

// export default function App() {
//   const { debug } = useControls({ debug: false });
//   return (
//     <Canvas frameloop="demand" camera={{ position: [0, 0, 13], fov: 25 }} dpr={[1,1]} gl={{antialias: true}}>
//       <ambientLight intensity={Math.PI} />
//       <Physics
//         debug={false}
//         interpolate
//         gravity={[0, -40, 0]}
//         timeStep={1 / 60}
//         // numSolverIterations={4}
//       >
//         <Band />
//       </Physics>
//       <Environment background blur={0.75}>
//         <color attach="background" args={["black"]} />
//         <Lightformer
//           intensity={2}
//           color="white"
//           position={[0, -1, 5]}
//           rotation={[0, 0, Math.PI / 3]}
//           scale={[100, 0.1, 1]}
//         />
//         <Lightformer
//           intensity={3}
//           color="white"
//           position={[-1, -1, 1]}
//           rotation={[0, 0, Math.PI / 3]}
//           scale={[100, 0.1, 1]}
//         />
//         <Lightformer
//           intensity={3}
//           color="white"
//           position={[1, 1, 1]}
//           rotation={[0, 0, Math.PI / 3]}
//           scale={[100, 0.1, 1]}
//         />
//         <Lightformer
//           intensity={10}
//           color="white"
//           position={[-10, 0, 14]}
//           rotation={[0, Math.PI / 2, Math.PI / 3]}
//           scale={[100, 10, 1]}
//         />
//       </Environment>
//     </Canvas>
//   );
// }

// function Band({ maxSpeed = 50, minSpeed = 10 }) {
//   const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef() // prettier-ignore
//   const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
//   const segmentProps = {
//     type: "dynamic",
//     canSleep: true,
//     colliders: false,
//     angularDamping: 2,
//     linearDamping: 6,
//   };
//   const { nodes, materials } = useGLTF(
//     "/assets_incase/tag.glb"
//   );
//   const texture = useTexture(
//     "/assets_incase/band.jpg"
//   );
//   texture.minFilter = THREE.LinearFilter; // Improve texture filtering
//   texture.anisotropy = 16;
//   const { width, height } = useThree((state) => state.size);
//   const [curve] = useState(
//     () =>
//       new THREE.CatmullRomCurve3([
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//       ])
//   );
//   const [dragged, drag] = useState(false);
//   const [hovered, hover] = useState(false);

//   useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
//   useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
//   useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
//   useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

//   useEffect(() => {
//     if (hovered) {
//       document.body.style.cursor = dragged ? "grabbing" : "grab";
//       return () => void (document.body.style.cursor = "auto");
//     }
//   }, [hovered, dragged]);

//   useFrame((state, delta) => {
    
//     if (dragged) {
//       vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
//       dir.copy(vec).sub(state.camera.position).normalize();
//       vec.add(dir.multiplyScalar(state.camera.position.length()));
//       [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
//       card.current?.setNextKinematicTranslation({
//         x: vec.x - dragged.x,
//         y: vec.y - dragged.y,
//         z: vec.z - dragged.z,
//       });
//     }
//     if (fixed.current) {
//       // Fix most of the jitter when over pulling the card
//       [j1, j2].forEach((ref) => {
//         if (!ref.current.lerped)
//           ref.current.lerped = new THREE.Vector3().copy(
//             ref.current.translation()
//           );
//         const clampedDistance = Math.max(
//           0.1,
//           Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
//         );
//         ref.current.lerped.lerp(
//           ref.current.translation(),
//           delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
//         );
//       });
//       // Calculate catmul curve
//       curve.points[0].copy(j3.current.translation());
//       curve.points[1].copy(j2.current.lerped);
//       curve.points[2].copy(j1.current.lerped);
//       curve.points[3].copy(fixed.current.translation());
//       band.current.geometry.setPoints(curve.getPoints(32));
//       // Tilt it back towards the screen
//       ang.copy(card.current.angvel());
//       rot.copy(card.current.rotation());
//       card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
//     }
//   });

//   curve.curveType = "chordal";
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

//   return (
//     <>
//             <group position={[0, 4, 0]}>
//         <RigidBody ref={fixed} {...segmentProps} type="fixed" />
//         <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody
//           position={[2, 0, 0]}
//           ref={card}
//           {...segmentProps}
//           type={dragged ? "kinematicPosition" : "dynamic"}
//         >
//           <CuboidCollider args={[0.8, 1.125, 0.01]} />
//           <group
//             scale={2.25}
//             position={[0, -1.2, -0.05]}
//             onPointerOver={() => hover(true)}
//             onPointerOut={() => hover(false)}
//             onPointerUp={(e) => (
//               e.target.releasePointerCapture(e.pointerId), drag(false)
//             )}
//             onPointerDown={(e) => (
//               e.target.setPointerCapture(e.pointerId),
//               drag(
//                 new THREE.Vector3()
//                   .copy(e.point)
//                   .sub(vec.copy(card.current.translation()))
//               )
//             )}
//           >
            
//             <mesh geometry={nodes.card.geometry}>
//               <meshPhysicalMaterial
//                 clearcoat={1}
//                 clearcoatRoughness={0.15}
//                 iridescence={1}
//                 iridescenceIOR={1}
//                 iridescenceThicknessRange={[0, 2400]}
//                 metalness={0.5}
//                 roughness={0.3}
//               >
//                 <RenderTexture attach="map" height={2000} width={2000}>
//                   <BadgeTexture user={{firstName:"John",lastName:"Doe"}} />

//                 </RenderTexture>
//               </meshPhysicalMaterial>
//             </mesh>
//             <mesh
//               geometry={nodes.clip.geometry}
//               material={materials.metal}
//               material-roughness={0.3}
//             />
//             <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
//           </group>
//         </RigidBody>
//       </group>
//       <mesh ref={band}>
//         <meshLineGeometry />
//         <meshLineMaterial
//           color="white"
//           depthTest={false}
//           resolution={[width, height]}
//           useMap
//           map={texture}
//           repeat={[-3, 1]}
//           lineWidth={1}
//         />
//       </mesh>
//     </>
//   );
// }
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
  RenderTexture
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useControls } from "leva";
import BadgeTexture from "./badgetexture";

extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload(
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb"
);
useTexture.preload(
  "/assets_incase/band.jpg"
);
export default function App() {
  return (
<Canvas frameloop="demand" camera={{ position: [0, 0, 13], fov: 25 }} dpr={[1,1]} gl={{antialias: true}}>      <ambientLight intensity={Math.PI} />
      <Physics
        interpolate
        gravity={[0, -40, 0]}
        timeStep={1 / 60}
      >
        <Band />
      </Physics>
      <Environment background blur={0.75}>
        <color attach="background" args={["transparent"]} />
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}

function Band({ maxSpeed = 30, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef() // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 5,
    linearDamping: 5,
  };
  const { nodes, materials } = useGLTF(
    "/assets_incase/tag.glb"
  );
  const texture = useTexture(
    "/assets_incase/band.jpg"
  );
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      // Calculate catmul curve
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      // Tilt it back towards the screen
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.target.releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              )
            )}
          >
 <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                clearcoat={1}
                clearcoatRoughness={0.15}
                iridescence={1}
                iridescenceIOR={1}
                iridescenceThicknessRange={[0, 2400]}
                metalness={0.5}
                roughness={0.3}
              >
                <RenderTexture attach="map" height={2000} width={2000}>
                  <BadgeTexture user={{firstName:"Ahmed",lastName:"Doe"}} />

                </RenderTexture>
              </meshPhysicalMaterial>
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
