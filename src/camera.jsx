import { useThree } from "@react-three/fiber";

export const CameraController = () => {
  const { camera } = useThree();
  camera.position.set(100, 35, 45);
  camera.lookAt(0, 0, 0);
  return null;
};
