import React, { useMemo } from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { generateField } from '@romellogoodman/flow-field'
import { Sphere, PerspectiveCamera, OrbitControls, Points, PointMaterial, Point, Segments, Segment } from '@react-three/drei'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline'

import '../styles/FlowField.css'

import Text from './html/Text'

import Effects from './Effects'
import Line from './Line'


extend({ MeshLine, MeshLineMaterial })

const FlowField = () => {
  const field = useMemo(() => generateField({
    height: 1000,
    width: 1000,
    count: 1000,
    scale: 1, // 1
    damping: 0.1, // 0.1
    margin: 0.1, // 0.1
    // seed: 0.123 // random
  })
    .map((item, index) =>
      ({ ...item, z: 0, line: item.line.map((thing, tIndex) => [...thing, 0 /* (thing[0] / thing[1]) * 50 */]) })
    ), [])

  const field2 = useMemo(() => generateField({
    height: 500,
    width: 500,
    count: 500,
    scale: 5, // 1
    damping: 0.3, // 0.1
    margin: 0.1, // 0.1
    // seed: 0.123 // random
  })
    .map((item, index) =>
      ({ ...item, z: 50, line: item.line.map((thing, tIndex) => [...thing, 50 /* (thing[0] / thing[1]) * 50 */]) })
    ), [])

  console.log(field)
  const points = []
  for (let j = 0; j < Math.PI; j += (5 * Math.PI) / 100) {
    points.push(Math.cos(j), Math.sin(j), 0)
  }

  console.log(points)
  return (
    <>
      <Canvas camera={{ fov: 90, near: 0.1, far: 10000, position: [500, 0, 1000] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <mesh
          scale={0.5} rotation={[0.5, 0.5, 0]}>
          <sphereGeometry args={[0.5, 30, 30]} />
          <meshStandardMaterial color={'hotpink'} />
        </mesh>
        {/* <Points limit={5000}>
          <PointMaterial scale={4} />
          {field.map(item => (
            <Point key={`${item.x}${item.y}`} size={1} position={[item.x, item.y, Math.random() * 500]} color="white" />
          ))}
        </Points> */}
        {/* <Segments limit={1000} lineWidth={0.4}>
          {field.map(item => item.line.map(line => (
            <Segment key={`${line[0]}${line[1]}`} start={[line[0], line[1], 0]} end={[line[0] + 100, line[1] + 100, 0]} />
          )))}
          <Segment start={[0, 0, 0]} end={[30, 0, 0]} />
        </Segments> */}
        {field.map((item, idx) => (
          <Line key={`${item.x}${item.y}`} item={item} index={idx} />
        ))}
        {field2.map((item, idx) => (
          <Line key={`${item.x}${item.y}`} item={item} index={idx} />
        ))}
        <Effects />
      </Canvas>
      {/* <Text /> */}
    </>
  )
}

export default FlowField