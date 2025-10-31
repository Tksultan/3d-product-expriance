"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import {
  Expand,
  Shrink,
  Image as ImageIcon,
  Cuboid,
  Sparkles,
} from "lucide-react" // 🪄 Lucide icons


// 3D Model component
function Model({ url }) {
  const { scene } = useGLTF(url)
  const ref = useRef()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3()).length()
    const center = box.getCenter(new THREE.Vector3())

    // Center the model
    scene.position.x += scene.position.x - center.x
    scene.position.y += scene.position.y - center.y
    scene.position.z += scene.position.z - center.z

    // Scale adjustment — larger models shrink, smaller ones grow
    const scaleFactor = 3 / size
    setScale(scaleFactor)

    // Optional: ensure bounding box updates correctly
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.roughness = 0.4
        child.material.metalness = 0.2
      }
    })
  }, [scene])

  return <primitive ref={ref} object={scene} scale={scale} />
}

// Individual comparison card
function ComparisonCard({ item, index }) {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const orbitRef = useRef()
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    let timeout
    const controls = orbitRef.current

    if (!controls) return

    const handleStart = () => {
      setAutoRotate(false) // stop rotation when user interacts
      if (timeout) clearTimeout(timeout)
    }

    const handleEnd = () => {
      // resume auto-rotate after 3 seconds of no input
      timeout = setTimeout(() => {
        setAutoRotate(true)
      }, 3000)
    }

    controls.addEventListener("start", handleStart)
    controls.addEventListener("end", handleEnd)

    return () => {
      controls.removeEventListener("start", handleStart)
      controls.removeEventListener("end", handleEnd)
      if (timeout) clearTimeout(timeout)
    }
  }, [])


  // Detect exiting fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handleFullScreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }

  return (
    <div className="group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* 2D Image Section */}
        <div
          className="relative bg-gradient-to-br from-white to-slate-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200 flex items-center justify-center h-[500px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

          <div className="flex flex-col items-center justify-center h-full p-8 md:p-10 text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
              <ImageIcon size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-slate-700">2D View</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              {item.name}
            </h3>

            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className={`rounded-xl w-full max-w-sm object-contain transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"
                }`}
              style={{ maxHeight: "280px" }}
            />
          </div>
        </div>

        {/* 3D Viewer Section */}
        <div
          ref={containerRef}
          className="relative bg-gradient-to-br from-white to-slate-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200 flex items-center justify-center"
          style={{ height: "500px" }}
        >
          {/* Header Badge */}
          {!isFullscreen && (
            <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
              <Cuboid size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-slate-700">3D View</span>
            </div>
          )}

          {/* Canvas */}
          <Canvas
            gl={{
              outputColorSpace: THREE.SRGBColorSpace,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
            }}
            camera={{ position: [0, 0, 3] }}
            style={{ width: "100%", height: "100%" }}
          >
            <ambientLight intensity={2.0} />
            <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" castShadow />
            <Model url={item.model} />
            <OrbitControls
              ref={orbitRef}
              enableZoom={true}
              minDistance={1.5}
             
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
            />
            <Environment preset="night" />
          </Canvas>

          {/* Fullscreen Button */}
          <button
            onClick={handleFullScreen}
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {isFullscreen ? (
              <>
                <Shrink size={18} />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Expand size={18} />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
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
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6 border border-blue-200 shadow-sm">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">Interactive Experience</span>
        </div>

        <h1 className="text-2xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
          2D vs 3D Product Comparisons
        </h1>

        <p className="text-md md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
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

      
    </main>
  )
}
