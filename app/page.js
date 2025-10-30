"use client"

import { useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import * as THREE from "three"

// 3D Model component
function Model({ url }) {
  const { scene } = useGLTF(url)

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.roughness = 0.4
      child.material.metalness = 0.2
      child.material.envMapIntensity = 1.2
    }
  })

  return <primitive object={scene} scale={1.2} />
}

// Individual comparison card
function ComparisonCard({ item, index }) {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullScreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      el.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  return (
    <div className="group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* 2D Image Section */}
        <div
          className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

          <div className="flex flex-col items-center justify-center h-full p-8 md:p-10">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">2D View</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              {item.name}
            </h3>

            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className={`rounded-xl w-full max-w-sm object-contain transition-transform duration-500 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        </div>

        {/* 3D Viewer Section */}
        <div
          ref={containerRef}
          className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700"
          style={{ minHeight: "500px" }}
        >
          {/* Header Badge */}
          <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700 shadow-lg">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">3D View</span>
          </div>

          {/* Canvas */}
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

          {/* Fullscreen Button */}
          <button
            onClick={handleFullScreen}
            className="absolute bottom-6 right-6 z-20 group/btn flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6v12h12v-6m0-6h6v6m-6-6L4 20"
              />
            </svg>
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Main page component
export default function ProductComparisons() {
  const comparisons = [
    {
      id: 1,
      name: "Robot Toy",
      image: "/images/robot-toy.png",
      model: "/models/toy-robot.glb",
    },
    {
      id: 2,
      name: "Toy Car",
      image: "/images/toy-car.png",
      model: "/models/toy-car-3d.glb",
    },
    {
      id: 3,
      name: "Pumpkin",
      image: "/images/pumpkin.png",
      model: "/models/pumpkin.glb",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">✨ Interactive Experience</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
          2D vs 3D Product Comparisons
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explore our products in stunning detail. Compare traditional 2D images with interactive 3D models to see every
          angle and dimension.
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16">
        {comparisons.map((item, index) => (
          <ComparisonCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto mt-20 text-center animate-fade-in">
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-600/20 dark:to-blue-600/20 rounded-2xl p-8 md:p-12 border border-purple-200 dark:border-purple-800">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to explore more?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
            Rotate, zoom, and interact with our 3D models to get a complete view of every product.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
            View All Products
          </button>
        </div>
      </div>
    </main>
  )
}
