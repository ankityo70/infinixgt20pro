document.addEventListener('DOMContentLoaded', () => {
  // --- BOOT LOADER SYSTEM SIMULATION ---
  const logsContainer = document.getElementById('terminal-logs');
  const progressFill = document.getElementById('progress-fill');
  const progressPct = document.getElementById('progress-pct');
  const bootScreen = document.getElementById('boot-screen');

  const bootLogs = [
    "INITIALIZING SYSTEM BOOT SEQUENCE...",
    "LOADING XOS 14 FOR GT SYSTEM KERNEL...",
    "DETECTING CPU: MEDIATEK DIMENSITY 8200 ULTIMATE (4nm)... OK",
    "ESTABLISHING DUAL-CHIP PARALLEL INTERFACE...",
    "CO-PROCESSOR FOUND: PIXELWORKS X5 TURBO...",
    "CALIBRATING 144Hz LTPS AMOLED PANEL...",
    "CONNECTING TO MECHA LOOP LED CONTROLLER...",
    "THERMAL DISSIPATION SENSORS: ONLINE",
    "VC LIQUID COOLING MODULE: LIQUID PRESSURE OPTIMAL",
    "JBL AUDIO SYNERGY CALIBRATED...",
    "BYPASS CHARGING v2.0 INTERFACE READY...",
    "CYBER MECHA PROTOCOLS ENGAGED.",
    "SYSTEM LOADED. LAUNCHING SHOWCASE..."
  ];

  let currentLogIndex = 0;
  let progress = 0;

  function addLogLine() {
    if (currentLogIndex < bootLogs.length) {
      const p = document.createElement('p');
      p.innerHTML = `<span style="color: var(--accent-cyan)">[GT-OS]</span> ` + bootLogs[currentLogIndex];
      logsContainer.appendChild(p);
      logsContainer.scrollTop = logsContainer.scrollHeight;
      currentLogIndex++;
      
      // Schedule next line
      const delay = Math.random() * 150 + 80;
      setTimeout(addLogLine, delay);
    }
  }

  function updateProgressBar() {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 5) + 2;
      if (progress > 100) progress = 100;
      
      progressFill.style.width = `${progress}%`;
      progressPct.textContent = `${progress}%`;
      
      const delay = Math.random() * 100 + 40;
      setTimeout(updateProgressBar, delay);
    } else {
      // Boot finished, transition screen
      setTimeout(() => {
        bootScreen.classList.add('fade-out');
        // Initialize GSAP ScrollTrigger after loader finishes
        initScrollAnimations();
      }, 500);
    }
  }

  // Start Boot
  addLogLine();
  updateProgressBar();

  // --- LED MECHA LOOP INTERACTIVE CONTROLLER ---
  const colorDots = document.querySelectorAll('.color-dot');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const speedSlider = document.getElementById('led-speed');
  const speedVal = document.getElementById('speed-val');
  const mechaLoopElement = document.getElementById('blueprint-mecha-loop');

  let activeColor = '#00f0ff';
  let activeMode = 'pulse';
  let speedMulti = 1;

  // Sync color variables
  function updateLEDTheme() {
    document.documentElement.style.setProperty('--mecha-loop-color', activeColor);
    
    // Update SVG stroke colors and glows
    if (mechaLoopElement) {
      mechaLoopElement.setAttribute('stroke', activeColor);
      mechaLoopElement.style.animation = 'none';
      
      // Force trigger reflow to reset animation
      void mechaLoopElement.offsetWidth;
      
      // Calculate duration
      let baseDuration = activeMode === 'pulse' ? 1.5 : (activeMode === 'breathe' ? 3 : 2);
      let duration = baseDuration / speedMulti;
      
      if (activeMode === 'pulse') {
        mechaLoopElement.style.animation = `ledPulse ${duration}s infinite alternate ease-in-out`;
      } else if (activeMode === 'breathe') {
        mechaLoopElement.style.animation = `ledBreathe ${duration}s infinite ease-in-out`;
      } else if (activeMode === 'cycle') {
        // Handle color rotation animation inline or via CSS
        mechaLoopElement.style.animation = `ledBreathe ${duration}s infinite ease-in-out`;
      }
    }
  }

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      activeColor = dot.getAttribute('data-color');
      updateLEDTheme();
    });
  });

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.getAttribute('data-mode');
      updateLEDTheme();
    });
  });

  speedSlider.addEventListener('input', (e) => {
    speedMulti = parseFloat(e.target.value);
    speedVal.textContent = `${speedMulti}x`;
    updateLEDTheme();
  });

  // --- 60FPS VS 120FPS DYNAMIC GRAPHICS SLIDER ---
  const compareContainer = document.querySelector('.compare-container');
  const side60 = document.querySelector('.side-60');
  const sliderHandle = document.querySelector('.slider-handle');
  const character60 = document.getElementById('char-60');
  const character120 = document.getElementById('char-120');

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = compareContainer.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const pct = (posX / rect.width) * 100;
    side60.style.width = `${pct}%`;
    sliderHandle.style.left = `${pct}%`;
  }

  // Handle Drag
  sliderHandle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch support
  sliderHandle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  });

  // Character movement animation variables
  let position = 0;
  let direction = 1;
  const speed = 4;
  let frameCount = 0;
  
  // Track separate simulated positions to show frame rate difference
  let pos120 = 100;
  let pos30 = 100;

  function animateGameFrame() {
    const containerWidth = compareContainer.clientWidth;
    const charWidth = 50;
    const minX = 20;
    const maxX = containerWidth - charWidth - 20;

    // Standard 120Hz smooth movement updating every frame
    pos120 += speed * direction;
    if (pos120 >= maxX) {
      pos120 = maxX;
      direction = -1;
    } else if (pos120 <= minX) {
      pos120 = minX;
      direction = 1;
    }

    // Choppy 30Hz movement updates once every 4 frames
    frameCount++;
    if (frameCount % 4 === 0) {
      pos30 = pos120; // Snap to current 120fps coordinate
    }

    // Apply translations
    character120.style.transform = `translateX(${pos120}px)`;
    // Apply 30fps pos with motion blur overlay simulating low refresh rate
    character60.style.transform = `translateX(${pos30}px)`;

    requestAnimationFrame(animateGameFrame);
  }

  // Start game simulation
  animateGameFrame();

  // --- 144Hz AMOLED DISPLAY SPEED SIMULATION ---
  const movingDot = document.getElementById('moving-dot');
  const hzBtns = document.querySelectorAll('.hz-btn');
  let activeHz = 144;
  let dotPos = 0;
  let dotDirection = 1;
  let dotFrameCount = 0;
  let visualPos = 0;

  hzBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hzBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeHz = parseInt(btn.getAttribute('data-hz'));
    });
  });

  function animateDot() {
    const containerWidth = document.querySelector('.display-mock-container').clientWidth;
    const dotWidth = 20;
    const maxX = containerWidth - dotWidth - 10;
    const minX = 10;
    const dotSpeed = 6;

    dotPos += dotSpeed * dotDirection;
    if (dotPos >= maxX) {
      dotPos = maxX;
      dotDirection = -1;
    } else if (dotPos <= minX) {
      dotPos = minX;
      dotDirection = 1;
    }

    dotFrameCount++;
    
    // Simulate Hz refresh skips
    let divisor = 1; // 144Hz (full speed)
    if (activeHz === 60) divisor = 2.4; // 60Hz skip
    if (activeHz === 30) divisor = 4.8; // 30Hz skip

    if (Math.round(dotFrameCount % divisor) === 0) {
      visualPos = dotPos;
    }

    movingDot.style.left = `${visualPos}px`;
    requestAnimationFrame(animateDot);
  }
  animateDot();

  // --- JBL AUDIO DUAL SOUNDWAVE VISUALIZER ---
  const audioBtn = document.getElementById('audio-play-btn');
  const waveBars = document.querySelectorAll('.wave-bar');
  let audioPlaying = false;
  let audioInterval;

  function toggleAudio() {
    audioPlaying = !audioPlaying;
    if (audioPlaying) {
      audioBtn.innerHTML = '<i data-lucide="volume-2" class="cool-icon"></i> MUTE AUDIO';
      lucide.createIcons(); // Re-render Lucide icons
      
      // Activate wave bars
      waveBars.forEach(bar => bar.classList.add('active'));
      
      // Randomize heights
      audioInterval = setInterval(() => {
        waveBars.forEach(bar => {
          const height = Math.random() * 50 + 5;
          bar.style.height = `${height}px`;
        });
      }, 100);
    } else {
      audioBtn.innerHTML = '<i data-lucide="volume-x" class="cool-icon"></i> JBL AUDIO TEST';
      lucide.createIcons();
      clearInterval(audioInterval);
      waveBars.forEach(bar => {
        bar.classList.remove('active');
        bar.style.height = '5px';
      });
    }
  }

  audioBtn.addEventListener('click', toggleAudio);

  // --- GSAP (minimal, no scroll-driven transforms) ---
  function initScrollAnimations() {
    // No scroll-driven animations to avoid shaking
  }



  // --- INTERACTIVE VC TEMPERATURE MONITOR ---
  const tempSlider = document.getElementById('cooling-temp-slider');
  const tempVal = document.getElementById('temp-val');
  const tempStatus = document.getElementById('temp-status');
  const coolingVaporChamber = document.querySelector('.cooling-vapor-chamber');
  
  if (tempSlider) {
    tempSlider.addEventListener('input', (e) => {
      const temp = parseInt(e.target.value);
      tempVal.textContent = `${temp}°C`;
      
      let bubbleAnimationDuration;
      let color;
      let statusText;
      
      if (temp > 75) {
        color = '#ff5e00';
        statusText = 'WARNING: THERMAL THROTTLING ENGAGED';
        bubbleAnimationDuration = '0.4s';
        if (coolingVaporChamber) {
          coolingVaporChamber.style.borderColor = '#ff5e00';
          coolingVaporChamber.style.boxShadow = '0 0 20px rgba(255, 94, 0, 0.6)';
        }
      } else if (temp >= 45) {
        color = '#00f0ff';
        statusText = 'SYSTEM RUNNING IN HYPER-MODE (STABLE)';
        bubbleAnimationDuration = '1.2s';
        if (coolingVaporChamber) {
          coolingVaporChamber.style.borderColor = '#00f0ff';
          coolingVaporChamber.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
        }
      } else {
        color = '#39ff14';
        statusText = 'THERMAL SHIELD FULLY OPTIMIZED (COOL)';
        bubbleAnimationDuration = '2.5s';
        if (coolingVaporChamber) {
          coolingVaporChamber.style.borderColor = '#39ff14';
          coolingVaporChamber.style.boxShadow = '0 0 20px rgba(57, 255, 20, 0.4)';
        }
      }
      
      tempVal.style.color = color;
      tempStatus.textContent = statusText;
      tempStatus.style.color = color;
      
      const particles = document.querySelectorAll('.heat-particle');
      particles.forEach(p => {
        p.style.animationDuration = bubbleAnimationDuration;
        p.style.backgroundColor = color;
      });
    });
  }

  // --- INTERACTIVE DRAW CANVAS (144Hz DEMO) ---
  const hzCanvas = document.getElementById('hz-draw-canvas');
  if (hzCanvas) {
    const ctx = hzCanvas.getContext('2d');
    let particles = [];
    let isMouseInCanvas = false;
    let mouseX = 0;
    let mouseY = 0;
    
    function resizeCanvas() {
      hzCanvas.width = hzCanvas.clientWidth;
      hzCanvas.height = hzCanvas.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    hzCanvas.addEventListener('mouseenter', () => isMouseInCanvas = true);
    hzCanvas.addEventListener('mouseleave', () => isMouseInCanvas = false);
    hzCanvas.addEventListener('mousemove', (e) => {
      const rect = hzCanvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    const handlePointerMove = (e) => {
      const rect = hzCanvas.getBoundingClientRect();
      if (e.touches) {
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      } else {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }
    };
    
    hzCanvas.addEventListener('mousemove', handlePointerMove);
    hzCanvas.addEventListener('touchmove', (e) => {
      handlePointerMove(e);
      e.preventDefault();
    }, { passive: false });
    
    class CanvasParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff5e00';
      }
      update() {
        this.life -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    let lastDrawTime = 0;
    
    function updateDrawLoop(timestamp) {
      let targetInterval = 1000 / activeHz;
      let elapsed = timestamp - lastDrawTime;
      
      if (elapsed >= targetInterval) {
        lastDrawTime = timestamp - (elapsed % targetInterval);
        
        ctx.clearRect(0, 0, hzCanvas.width, hzCanvas.height);
        
        if (isMouseInCanvas) {
          particles.push(new CanvasParticle(mouseX, mouseY));
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update();
          if (p.life <= 0) {
            particles.splice(i, 1);
          } else {
            p.draw();
          }
        }
        
        if (particles.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particles[0].x, particles[0].y);
          for (let i = 1; i < particles.length; i++) {
            ctx.lineTo(particles[i].x, particles[i].y);
          }
          ctx.strokeStyle = activeHz === 144 ? 'rgba(0, 240, 255, 0.45)' : (activeHz === 60 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 240, 255, 0.08)');
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      requestAnimationFrame(updateDrawLoop);
    }
    requestAnimationFrame(updateDrawLoop);
  }



  // Initialize Lucide icons on load
  lucide.createIcons();
});
