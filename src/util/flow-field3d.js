import { MersenneTwister19937, Random } from 'random-js'
import SimplexNoise from 'simplex-noise'

const getRandom = (randomSeed) => {
  const seed = randomSeed || MersenneTwister19937.autoSeed()

  return new Random(seed)
}

const simplex = new SimplexNoise()

const noise3D = (x, y, z, frequency, amplitude) => {
  return simplex.noise3D(x * frequency, y * frequency, z * frequency) * amplitude
}

const getBounds = (width, height, depth, margin) => {
  const marginWidth = width * margin
  const marginHeight = height * margin
  const marginDepth = depth * margin

  return {
    minWidth: marginWidth,
    maxWidth: width - marginWidth,
    minHeight: marginHeight,
    maxHeight: height - marginHeight,
    minDepth: marginDepth,
    maxDepth: depth - marginDepth
  }
}

const isInBound = (xCoord, yCoord, zCoord, width, height, depth, margin) => {
  const { minWidth, maxWidth, minHeight, maxHeight, minDepth, maxDepth } = getBounds(
    width,
    height,
    depth,
    margin
  )

  return (
    xCoord > minWidth &&
    xCoord < maxWidth &&
    yCoord > minHeight &&
    yCoord < maxHeight &&
    zCoord > minDepth &&
    zCoord < maxDepth
  )
}

export const generateParticles = ({
  count,
  height,
  margin = 0.1,
  seed,
  width,
  depth
}) => {
  const random = getRandom(seed)
  const bounds = getBounds(width, height, depth, margin)
  const { minWidth, maxWidth, minHeight, maxHeight, minDepth, maxDepth } = bounds
  let particles = []

  // Generate some particles with a random position
  for (let i = 0; i < count; i++) {
    particles.push({
      x: random.real(minWidth, maxWidth),
      y: random.real(minHeight, maxHeight),
      z: random.real(minDepth, maxDepth),
      vx: 0,
      vy: 0,
      vz: 0,
      line: [],
    })
  }

  return particles
}

export const moveParticle = ({
  amplitude,
  damping,
  frequency,
  lengthOfStep,
  particle,
}) => {
  // Calculate direction from noise
  const angle = noise3D(particle.x, particle.y, particle.z, frequency, amplitude)

  // Update the velocity of the particle based on the direction
  particle.vx += Math.cos(angle) * lengthOfStep
  particle.vy += Math.sin(angle) * lengthOfStep
  particle.vz += (Math.cos(angle) + Math.sin(angle)) * lengthOfStep

  // Move the particle
  particle.x += particle.vx
  particle.y += particle.vy
  particle.z += particle.vz

  // Use damping to slow down the particle (think friction)
  particle.vx *= damping
  particle.vy *= damping
  particle.vz *= damping

  particle.line.push([particle.x, particle.y, particle.z])
}

export const generateField = ({
  amplitude = 5,
  count = 1000,
  damping = 0.1,
  height,
  margin = 0.1,
  particles: suppliedParticles,
  scale = 1,
  seed,
  width,
  depth
} = {}) => {
  const maxParticleSteps = 30 * scale
  const lengthOfStep = 5 * scale
  const frequency = 0.001 / scale
  const particles =
    suppliedParticles ||
    generateParticles({ count, height, margin, seed, width, depth }) ||
    []

  particles?.forEach((particle) => {
    while (particle.line.length < maxParticleSteps) {
      moveParticle({
        amplitude,
        damping,
        frequency,
        lengthOfStep,
        particle,
      })
    }
  })

  particles?.forEach((particle) => {
    particle.line = particle.line.filter((particle) => {
      return isInBound(particle[0], particle[1], particle[2], width, height, depth, margin)
    })
  })

  return particles
}