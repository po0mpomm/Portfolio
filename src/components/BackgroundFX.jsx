import { useEffect, useRef } from "react"

// Lightweight animated background: flowing radial gradients + subtle particles
// - Uses rAF, DPR-aware canvas, passive listeners
// - Honors prefers-reduced-motion (can be overridden via forceMotion)
// - Adapts colors via CSS variables defined in index.css

const BackgroundFX = ({ forceMotion = false }) => {
  const canvasRef = useRef(null)
  const systemPrefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const prefersReducedMotion = systemPrefersReduced && !forceMotion

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let width = 0
    let height = 0
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    let dprCap = isMobile ? 1.25 : 1.75
    let dpr = Math.max(1, Math.min(dprCap, window.devicePixelRatio || 1))
    let rafId = null
    let running = true
    let inViewport = true
    let particles = []
    let dust = []
    let meteors = []
    let t = 0
    const mouse = { x: 0.5, y: 0.5 }

    const rootStyles = getComputedStyle(document.documentElement)
    const colors = {
      bg1: rootStyles.getPropertyValue('--fx-bg-1').trim() || '#0a0a0f',
      bg2: rootStyles.getPropertyValue('--fx-bg-2').trim() || '#080814',
      accent1: rootStyles.getPropertyValue('--fx-accent-1').trim() || '#8b5cf6',
      accent2: rootStyles.getPropertyValue('--fx-accent-2').trim() || '#06b6d4',
      star: rootStyles.getPropertyValue('--fx-star').trim() || 'rgba(255,255,255,0.95)',
      dust: rootStyles.getPropertyValue('--fx-dust').trim() || 'rgba(200,220,255,0.05)'
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(640, rect.width)
      height = Math.max(360, rect.height)
      dpr = Math.max(1, Math.min(dprCap, window.devicePixelRatio || 1))
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
      initDust()
    }

    const rand = (min, max) => Math.random() * (max - min) + min

    const initParticles = () => {
      const targetCount = Math.floor((width * height) / (isMobile ? 120000 : 80000))
      const palette = [
        colors.star,
        'rgba(200, 210, 255, 0.95)',
        'rgba(160, 185, 255, 0.9)',
        colors.accent1 + 'E6'
      ]
      particles = new Array(targetCount).fill(0).map(() => {
        const depth = rand(0.6, 1.4)
        const baseR = rand(0.8, 2.1) * (2 - depth)
        const baseA = rand(0.10, 0.24) * (2 - depth)
        return {
          x: rand(0, width),
          y: rand(0, height),
          r: baseR,
          a: baseA,
          vx: rand(-0.06, 0.06) * depth,
          vy: rand(-0.06, 0.06) * depth,
          twinklePhase: rand(0, Math.PI * 2),
          twinkleSpeed: rand(0.6, 1.4) * 0.0013,
          color: palette[Math.floor(rand(0, palette.length))],
          depth
        }
      })
    }

    const initDust = () => {
      const targetDust = Math.max(5, Math.floor((width * height) / 1000000))
      dust = new Array(targetDust).fill(0).map(() => ({
        x: rand(0, width),
        y: rand(0, height),
        r: rand(14, 26),
        a: rand(0.015, 0.04),
        vx: rand(-0.015, 0.015),
        vy: rand(-0.015, 0.015)
      }))
    }

    const spawnMeteor = () => {
      if (meteors.length > 2) return
      const startEdge = Math.random() < 0.5 ? 'left' : 'top'
      const startX = startEdge === 'left' ? -50 : rand(0, width)
      const startY = startEdge === 'top' ? -50 : rand(0, height * 0.5)
      const speed = rand(0.6, 1.2)
      meteors.push({
        x: startX,
        y: startY,
        vx: speed * rand(0.8, 1.2),
        vy: speed * rand(0.4, 0.9),
        life: rand(600, 1200)
      })
    }

    const drawBackground = () => {
      const g1x = width * (0.28 + 0.22 * Math.sin(t * 0.0006))
      const g1y = height * (0.38 + 0.22 * Math.cos(t * 0.0005))
      const g2x = width * (0.72 + 0.22 * Math.cos(t * 0.0004))
      const g2y = height * (0.62 + 0.22 * Math.sin(t * 0.0007))

      const grad1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, Math.max(width, height) * 0.85)
      grad1.addColorStop(0, colors.accent1 + '18')
      grad1.addColorStop(1, colors.bg1)

      const grad2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, Math.max(width, height) * 0.85)
      grad2.addColorStop(0, colors.accent2 + '14')
      grad2.addColorStop(1, colors.bg2)

      ctx.fillStyle = grad1
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = grad2
      ctx.fillRect(0, 0, width, height)
      
      const g3x = width * (0.5 + 0.35 * Math.sin(t * 0.0002))
      const g3y = height * (0.5 + 0.35 * Math.cos(t * 0.00025))
      const grad3 = ctx.createRadialGradient(g3x, g3y, 0, g3x, g3y, Math.max(width, height) * 0.95)
      grad3.addColorStop(0, colors.accent1 + '10')
      grad3.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad3
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

      const vignette = ctx.createRadialGradient(width/2, height/2, Math.min(width, height) * 0.42, width/2, height/2, Math.max(width, height) * 0.9)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.5)')
      ctx.fillStyle = vignette
      ctx.fillRect(0,0,width,height)
    }

    const drawDust = () => {
      if (!dust.length) return
      ctx.save()
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i]
        d.x += d.vx
        d.y += d.vy
        if (d.x < -30) d.x = width + 30
        if (d.x > width + 30) d.x = -30
        if (d.y < -30) d.y = height + 30
        if (d.y > height + 30) d.y = -30

        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r)
        grad.addColorStop(0, colors.dust)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.globalAlpha = d.a
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
      ctx.globalAlpha = 1
    }

    const drawParticles = () => {
      ctx.save()
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.vx += (mouse.x * width - p.x) * 0.0000013 * p.depth
        p.vy += (mouse.y * height - p.y) * 0.0000013 * p.depth
        p.x += p.vx
        p.y += p.vy
        if (p.x < -5) p.x = width + 5
        if (p.x > width + 5) p.x = -5
        if (p.y < -5) p.y = height + 5
        if (p.y > height + 5) p.y = -5

        const twinkle = 0.72 + 0.28 * Math.sin(t * p.twinkleSpeed + p.twinklePhase)
        ctx.globalAlpha = Math.max(0, Math.min(1, p.a * twinkle))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
      ctx.globalAlpha = 1
    }

    const drawMeteors = () => {
      if (!meteors.length) return
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx
        m.y += m.vy
        m.life -= 16
        ctx.strokeStyle = colors.accent2 + 'AA'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 20, m.y - m.vy * 20)
        ctx.stroke()
        if (m.x > width + 80 || m.y > height + 80 || m.life <= 0) meteors.splice(i, 1)
      }
      ctx.restore()
      ctx.globalCompositeOperation = 'source-over'
    }

    // user interaction: click/tap burst glow
    const bursts = []
    const addBurst = (x, y) => {
      bursts.push({ x, y, r: 0, max: Math.max(160, Math.min(width, height) * 0.35) })
    }
    const drawBursts = () => {
      if (!bursts.length) return
      ctx.save()
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        b.r += 8
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, colors.accent1 + '33')
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = grad
        ctx.fillRect(0,0,width,height)
        if (b.r >= b.max) bursts.splice(i, 1)
      }
      ctx.restore()
      ctx.globalCompositeOperation = 'source-over'
    }

    // FPS adaptive quality
    let lastFpsCheck = 0
    let frames = 0
    const frame = (now) => {
      if (!running || !inViewport) return
      t = now
      ctx.clearRect(0, 0, width, height)
      drawBackground()
      if (!prefersReducedMotion) {
        drawDust()
        drawParticles()
        drawMeteors()
        drawBursts()
      }
      rafId = requestAnimationFrame(frame)

      frames++
      if (now - lastFpsCheck > 1000) {
        const fps = frames * 1000 / (now - lastFpsCheck)
        lastFpsCheck = now
        frames = 0
        if (fps < 50) {
          if (particles.length > 24) particles.splice(0, Math.floor(particles.length * 0.2))
          if (dust.length > 3) dust.splice(0, 1)
          dprCap = Math.max(1.1, dprCap - 0.1)
          dpr = Math.min(dpr, dprCap)
        }
        // randomly spawn meteor at healthy fps
        if (fps >= 45 && Math.random() < 0.25) spawnMeteor()
      }
    }

    // pointer tracking
    let tx = 0.5, ty = 0.5
    const onPointerMove = (e) => {
      const vw = window.innerWidth || document.documentElement.clientWidth
      const vh = window.innerHeight || document.documentElement.clientHeight
      tx = Math.min(1, Math.max(0, e.clientX / vw))
      ty = Math.min(1, Math.max(0, e.clientY / vh))
    }
    const onPointerDown = (e) => {
      const rect = canvas.getBoundingClientRect()
      addBurst((e.clientX - rect.left), (e.clientY - rect.top))
    }
    const smoothMouse = () => {
      mouse.x += (tx - mouse.x) * 0.08
      mouse.y += (ty - mouse.y) * 0.08
      if (running) requestAnimationFrame(smoothMouse)
    }

    resize()
    rafId = requestAnimationFrame(frame)
    requestAnimationFrame(smoothMouse)

    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    const onVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running && !rafId) rafId = requestAnimationFrame(frame)
    }
    document.addEventListener('visibilitychange', onVisibility)

    const io = new IntersectionObserver((entries) => {
      inViewport = entries[0]?.isIntersecting ?? true
      if (inViewport && running && !rafId) rafId = requestAnimationFrame(frame)
    }, { threshold: 0 })
    io.observe(canvas)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion, forceMotion])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 w-full h-full opacity-95"
      aria-hidden="true"
    />
  )
}

export default BackgroundFX


