import * as THREE from "three";
import React, { useState, useEffect, userRef } from "react";
import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Sky,
  Environment,
  Clouds,
  Cloud,
} from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CameraController } from "./camera";
import "./App.css";

export default function App() {
  const [objectCount, setObjectCount] = useState(3);
  const [shapes, setShapes] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const generate3DModel = async () => {
    if (!prompt) return;

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/get/3dmodel_url/${encodeURIComponent(prompt)}`,
        {
          mode: "no-cors",
        }
      );
      const data = await response.json();

      const randInt3to5 = Math.floor(Math.random() * 3) + objectCount;
      const newObjects = Array.from({ length: randInt3to5 }, (_, i) => ({
        id: `${objects.length + i}`,
        position: [
          (Math.random() + 5.7) * 6, // X軸方向でランダム
          20 + Math.random() * 2, // Y軸方向で高めの位置
          (Math.random() + 2.2) * 6, // Z軸方向でランダム,
        ],
        url: data.glb_url,
        textures: data.texture_urls,
      }));

      setObjects((prev) => [...prev, ...newObjects]);
    } catch (error) {
      console.error("Error fetching 3D model:", error);
    } finally {
      setLoading(false);
    }
  };

  const RenderModel = React.memo(({ url, textureUrls }) => {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          setModel(gltf.scene);
          setLoading(false); // Model loaded
          if (textureUrls) {
            gltf.scene.traverse((child) => {
              if (child.isMesh && textureUrls.length > 0) {
                const textureLoader = new THREE.TextureLoader();
                const texture = textureLoader.load(textureUrls[0]); // 最初のテクスチャを使用
                child.material.map = texture; // テクスチャをマテリアルに設定
                child.material.needsUpdate = true; // マテリアルを更新
              }
            });
          }
        },
        undefined,
        (error) => {
          console.error("Error loading GLB model:", error);
          setLoading(false); // Handle error
        }
      );

      return () => {
        setModel(null);
      };
    }, [url]);

    if (loading) {
      return null; // Prevent rendering until the model is loaded
    }

    return model ? <primitive object={model} /> : null;
  });

  const clearObjects = () => {
    setShapes([]); // shapesを空配列に設定し単純図形を削除
    setObjects([]); // objectsをから配列にして生成オブジェクトを削除
    console.log("delete");
  };

  // ランダムな形状のオブジェクトを追加する関数
  const addRandomObject = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const position = [
      (Math.random() + 5.7) * 6, // X軸方向でランダム
      20 + Math.random() * 2, // Y軸方向で高めの位置
      (Math.random() + 2.2) * 6, // Z軸方向でランダム
    ];

    // ランダムな形状を選択
    const shapeTypes = ["box", "sphere", "cone", "torus"];
    const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    setShapes([...shapes, { id, position, shape }]);
    console.log("set");
  };

  const RenderShape = ({ shape }) => {
    switch (shape) {
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} scale={[5, 0, 5]} />;
      case "cone":
        return <coneGeometry args={[0.5, 1, 32]} />;
      case "torus":
        return <torusGeometry args={[0.4, 0.15, 16, 100]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <button
        onClick={addRandomObject}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px 20px",
          zIndex: 1,
        }}
      >
        単純図形追加
      </button>
      <button
        onClick={clearObjects}
        style={{
          position: "absolute",
          top: "72px",
          left: "10px",
          padding: "10px 20px",
          zIndex: 1,
        }}
      >
        全オブジェクト削除
      </button>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="プロンプトを入力"
        style={{
          padding: "10px",
          marginRight: "10px",
          position: "absolute",
          top: "13px",
          left: "210px",
          padding: "10px 20px",
          zIndex: 1,
        }}
      />

      <button
        onClick={generate3DModel}
        disabled={loading}
        style={{
          position: "absolute",
          top: "10px",
          left: "430px",
          padding: "10px 20px",
          zIndex: 1,
        }}
      >
        {loading ? "生成中..." : "オブジェクトを追加する"}
      </button>
      <input
        type="number"
        value={objectCount}
        onChange={(e) => setObjectCount(e.target.value)}
        placeholder="オブジェクト数を指定"
        max="70"
        min="0"
        style={{
          padding: "10px",
          marginRight: "10px",
          position: "absolute",
          top: "55px",
          left: "210px",
          padding: "10px 20px",
          zIndex: 1,
        }}
      />

      <Canvas shadows camera={{ position: [100, 40, 100], fov: 6.0 }}>
        <Suspense fallback={null}>
          <hemisphereLight intensity={0.45 * Math.PI} />
          <spotLight
            decay={0}
            angle={0.4}
            penumbra={1}
            position={[20, 30, 2.5]}
            castShadow
            shadow-bias={-0.00001}
          />
          <directionalLight
            decay={0}
            color="red"
            position={[-10, -10, 0]}
            intensity={1.5}
          />
          <Clouds material={THREE.MeshBasicMaterial}>
            <Cloud seed={10} bounds={50} volume={80} position={[40, 0, -80]} />
            <Cloud
              seed={10}
              bounds={50}
              volume={80}
              position={[-40, 10, -80]}
            />
          </Clouds>
          <Environment preset="city" />
          <Sky />
          <Physics>
            <CameraController />
            <group position={[2, 3, 0]}>
              <Track position={[-3, 0, 10.5]} rotation={[0, -0.4, 0]} />
              <Plane />
            </group>
            {shapes.map((obj) => (
              <RigidBody key={obj.id} type="dynamic" position={obj.position}>
                <mesh>
                  <RenderShape shape={obj.shape} />
                  <meshStandardMaterial color="blue" />
                </mesh>
              </RigidBody>
            ))}
            {objects.map((obj) => (
              <RigidBody key={obj.id} type="dynamic" position={obj.position}>
                <CuboidCollider
                  args={[0.5, 0.5, 0.5]}
                  scale={[1.5, 1.5, 1.5]}
                />
                <RenderModel url={obj.url} textureUrls={obj.textures} />
              </RigidBody>
            ))}
          </Physics>
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Track(props) {
  const { nodes } = useGLTF("./../models/nabe_re.glb");
  return (
    <RigidBody colliders="trimesh" type="fixed">
      <mesh
        scale={[6, 3, 6]}
        geometry={nodes.円柱.geometry}
        {...props}
        dispose={null}
      >
        <meshStandardMaterial color="black" side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
}

function Plane(props) {
  const tableTexture = useLoader(TextureLoader, "./../images/table.jpg");
  return (
    <mesh>
      <CuboidCollider
        position={[35, 3.2, 15]}
        args={[30, 1, 30]}
      ></CuboidCollider>
      <mesh position={[35, 3.2, 15]}>
        <boxGeometry args={[60, 2, 60]} /> {/* サイズは args の2倍 */}
        <meshStandardMaterial map={tableTexture} />
      </mesh>
    </mesh>
  );
}
