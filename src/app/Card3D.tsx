'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface Card3DProps {
  card: {
    iconUrls: {
      medium: string;
    };
  };
}

function CardMesh({ card }: Card3DProps) {
  const mesh = useRef<any>();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += hovered ? 0.1 : 0.01;
    }
  });

  const texture = new TextureLoader().load(card.iconUrls.medium);

  return (
    <mesh
      ref={mesh}
      scale={[1, 1.4, 0.1]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Card3D({ card }: Card3DProps) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <CardMesh card={card} />
    </Canvas>
  );
}
