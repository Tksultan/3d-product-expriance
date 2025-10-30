"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";


// Simple 3D model loader
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
}

export default function ProductComparisons() {
  const comparisons = [
    {
      id: 1,
      name: "Robot toy",
      image: "/images/robot-toy.webp",
      model: "/models/toy-robot.glb",
    },
    {
      id: 2,
      name: "Toy car",
      image: "/images/toy-car.png",
      model: "/models/toy-car-3d.glb",
    },
    {
      id: 3,
      name: "Pumpkin",
      image: "/images/pumpkin.png",
      model: "/models/pumpkin.glb",
    },
  ];

  return (
    <section className="min-h-screen bg-[#f5f7fa] py-12 px-6">
      <h2 className="text-4xl font-bold mb-10 text-center text-[#282e4c]">
        2D vs 3D Product Comparisons
      </h2>

      <div className="flex flex-col gap-16 max-w-7xl mx-auto">
        {comparisons.map((item) => (
          <ComparisonCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

// Each comparison section
function ComparisonCard({ item }) {
  const containerRef = useRef(null);

  const handleFullScreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  };

  function Model({ url }) {
    const { scene } = useGLTF(url);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.roughness = 0.4;
        child.material.metalness = 0.2;
        child.material.envMapIntensity = 1.2;
      }
    });

    return <primitive object={scene} scale={1.2} />;
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* 2D Image */}
      <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-[#282e4c]">
          {item.name} - 2D Image
        </h3>
        <img
          src={item.image}
          alt={item.name}
          className="rounded-xl w-full max-w-md object-contain"
        />
      </div>

      {/* 3D Viewer */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl shadow-md overflow-hidden"
        style={{ height: "500px" }}
      >
        <h3 className="text-xl font-semibold absolute top-4 left-6 z-10 text-[#282e4c] bg-white/80 px-3 py-1 rounded-lg shadow-sm">
          {item.name} - 3D View
        </h3>

        <Canvas
          gl={{
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          camera={{ position: [0, 0, 3] }}
        >

          <ambientLight intensity={1.7} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.7}
            color="#ffff"
            castShadow
          />
          <Model url={item.model} />
          <OrbitControls enableZoom={true} />
          {/*apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse*/}
          <Environment preset="night" />
        </Canvas>

        <button
          onClick={handleFullScreen}
          className="absolute bottom-4 right-4 bg-[#282e4c] text-white px-4 py-2 rounded-lg hover:bg-[#3a4672] transition-all"
        >
          Full Screen
        </button>
      </div>
    </div>
  );
}
