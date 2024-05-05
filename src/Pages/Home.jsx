import {Suspense, useEffect, useRef, useState} from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '../Components/Loader'
import { Island } from '../Models/Island';
import  Background from "../Models/Sky.jsx";
import Bird from "../Models/Bird.jsx";
import Plane from '../Models/Plane';
import HomeInfo from './HomeInfo.jsx';
import sakura from "../assets/sakura.mp3";
import { soundoff, soundon } from '../assets/icons/index.js';
      
function Home() {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const adjustIslandForScreenSize = ()=> {
     let screenScale = null 
     let screenPosition = [0, -6.5, -43];
     let rotation = [0.1, 4.7, 0]
     if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9]
     } else {
      screenScale = [1, 1, 1]
     }
     return [screenScale, screenPosition, rotation]
  }

  const adjustPlaneForScreenSize = ()=> {
     let screenScale,screenPosition;

     if (window.innerWidth < 768) {
      screenScale = [1, 1, 1];
      screenPosition = [0, -1.5, 0];
     } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
     }

     return [screenScale, screenPosition]
  }

  const [IslandScale, IslandPosition, IslandRotation] = adjustIslandForScreenSize();
  const [planeScale, planePosition] = adjustPlaneForScreenSize();

  useEffect(()=>{
    if(isPlaying) {
      audioRef.current.play();
    }

    return ()=> audioRef.current.pause()
  }, [isPlaying])

  return (
    <section className='w-full h-screen relative'>

      <div className='absolute top-28 right-0 left-0 z-10 flex items-center justify-center'>
          {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>


      <Canvas className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
              camera={{near:0.1, far: 1000}}
      >

        <Suspense fallback={<Loader />}>
            <directionalLight position={[10, 1, 1]} intensity={2} />
            <ambientLight intensity={0.5} />
            <hemisphereLight skyColor='b1e1ff' groundColor='#000000' />

            <Bird />
            <Background isRotating={isRotating}/>
            <Island position = {IslandPosition} scale = {IslandScale}  rotation = {IslandRotation} isRotating={isRotating} setIsRotating={setIsRotating} setCurrentStage={setCurrentStage}/>
            <Plane isRotating={isRotating} position = {planePosition} scale={planeScale} rotation = {[0,20,0]} />

        </Suspense>


      </Canvas>

        <div className='absolute bottom-2 left-2'>
          <img src={isPlaying? soundon : soundoff} alt="sound" 
           className='w-10 h-10 cursor-pointer object-contain'
           onClick={()=> setIsPlaying(!isPlaying)}
          />
        </div>

    </section>
  )
}

export default Home