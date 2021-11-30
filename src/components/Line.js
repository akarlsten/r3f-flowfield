import React, { useRef, useLayoutEffect } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'

import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline'

extend({ MeshLine, MeshLineMaterial })

const Line = ({ item, index }) => {
  const meshLineRef = useRef()
  const materialRef = useRef()

  const { clock } = useThree()

  useLayoutEffect(() => {
    meshLineRef.current.setPoints(item.line.flat(), p => p * 1.5)
  }, [])

  useFrame((state, delta) => {
    //materialRef.current.dashOffset = clock.getElapsedTime() * 0.5
    materialRef.current.uniforms.visibility.value = (clock.getElapsedTime() / 3) % 5 // (clock.getElapsedTime() / 3000) % 1.0
  })

  return (
    <mesh key={`${item.x}${item.y}`} position={[item.x / 1000, item.y / 1000, 0]}>
      <meshLine
        ref={meshLineRef}
        attach="geometry"
        // points={item.line.flat()}
        widthCallback={pointWidth => {
          console.log(pointWidth)
        }}
      />
      <meshLineMaterial
        ref={materialRef}
        attach="material"
        transparent
        depthTest={false}
        lineWidth={1.2}
        color={index % 3 === 0 ? 'hotpink' : 'pink'}
        dashArray={1}
        // dashOffset={0.1}
        dashRatio={0}
      />
    </mesh>
  )
}

export default Line