/* 
import { useRef } from "react";
import { Mesh, MeshBasicMaterial } from "three";

const RotatingCube = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh>
      < args={[1, 1, 1]} />
      <meshLambertMaterial color="#9CDBA6" emissive="#9CDBA6" />
    </mesh>

const FloatingObject = () => {
  return (
    <canvas
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RotatingCube />
    </canvas>
  );
};

export default FloatingObject;
 */