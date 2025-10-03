import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense } from "react"

function AvatarModel(props) {
  const { scene } = useGLTF("https://models.readyplayer.me/63c9c3e4cebc1a0020786b13.glb")
  return <primitive object={scene} {...props} />
}

const Character = () => {
  return (
    <div className="w-full h-[300px] md:h-[500px] lg:h-[600px]">
      <Canvas camera={{ position: [0, 1.4, 2.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} />
        <directionalLight position={[-2, -1, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <group position={[0, -1.15, 0]}>
            <AvatarModel scale={1.25} />
          </group>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.9} />
      </Canvas>
    </div>
  )
}

export default Character

useGLTF.preload("https://models.readyplayer.me/63c9c3e4cebc1a0020786b13.glb")
