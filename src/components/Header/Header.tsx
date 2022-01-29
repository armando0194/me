/* eslint-disable require-jsdoc */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Perlin from '../../util/Perlin';

const Terrain = (props: JSX.IntrinsicElements['mesh']) => {
  const scene = useThree((state) => state.scene);
  const fillMesh = useRef<THREE.Mesh>(null!);

  const perlin = new Perlin();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const size = width > height ? width : height;

  // Plane size
  const planeWidth = size * 2;
  const planeHeight = size / 2;

  // Segment size
  const segWidth = 35;
  const segHeight = 35;

  let time = 0;
  let line;

  useEffect(() => {
    fillMesh.current.rotateX(THREE.Math.degToRad(-70));

    line = new THREE.LineSegments(
      new THREE.WireframeGeometry(fillMesh.current.geometry),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    scene.add(line);
    line.rotateX(THREE.Math.degToRad(-70));
  }, []);

  useFrame(() => {
    updateTerrain(fillMesh.current.geometry);
    updateTerrain(line.geometry);
    time += 0.005;
  });

  function updateTerrain(geometry) {
    const { position } = geometry.attributes;

    const vertices = position.array;
    for (let i = 0; i <= vertices.length; i += 3) {
      vertices[i + 2] = perlin.noise(vertices[i] / 800 + time, vertices[i + 1] / 800 + time) * 200;
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  return (
    <>
      <mesh ref={fillMesh}>
        <planeBufferGeometry args={[planeWidth, planeHeight, segWidth, segHeight]} />
        <meshBasicMaterial color={0x333333} side={THREE.DoubleSide}></meshBasicMaterial>
      </mesh>
    </>
  );
};

const Header = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <Canvas
      style={{ height: '100%', width: '100%' }}
      camera={{
        aspect: window.innerWidth / window.innerHeight,
        fov: 50,
        near: 1.2,
        far: 10000,
        position: [0, height / 2, width > height ? width : height]
      }}
    >
      <Terrain />
    </Canvas>
  );
};

export default Header;
