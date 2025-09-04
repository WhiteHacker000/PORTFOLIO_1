import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import HeroPhoto from '../../Assets/HomePic/Footer3.jpeg';

const HEX_SIZE = 40; // radius for black hex
const GAP = 4; // wire width gap in px
const HEX_WIDTH = 48 * 2; // SVG container size
const HEX_HEIGHT = Math.sqrt(3) * 48;
// Adjust LEFT_OFFSET to ensure leftmost hex covers the left edge
const LEFT_OFFSET = -(HEX_WIDTH * 0.5 + GAP * 0.5); // shift grid further left
const NAVBAR_HEIGHT = 56; // px, height of the navbar

// Taglines array
const TAGLINES = [
  "Building smart solutions, one line of code at a time.",
  "Engineering ideas into reality — just like Stark.",
  "Minimal. Modern. Powerful.",
  "Code is my arc reactor.",
  "Turning imagination into innovation."
];

const getHexPointsArray = (size) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i - Math.PI / 6;
    const x = 48 + size * Math.cos(angle); // center at 48
    const y = HEX_HEIGHT / 2 + size * Math.sin(angle);
    points.push([x, y]);
  }
  return points;
};

const getHexPoints = (size) => {
  return getHexPointsArray(size).map(([x, y]) => `${x},${y}`).join(' ');
};

const NeonBonds = ({ size }) => {
  const points = getHexPointsArray(size);
  // Bonds: 0-1, 2-3, 4-5 (like benzene)
  const bonds = [
    { from: points[0], to: points[1], color: '#00f6ff' }, // blue
    { from: points[2], to: points[3], color: '#ff0055' }, // red
    { from: points[4], to: points[5], color: '#00f6ff' }, // blue
  ];
  return (
    <g className="benzene-bonds">
      {bonds.map((bond, i) => (
        <line
          key={i}
          x1={bond.from[0]}
          y1={bond.from[1]}
          x2={bond.to[0]}
          y2={bond.to[1]}
          stroke={bond.color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

const FlowingNeonEdges = ({ size, wavePhase }) => {
  const points = getHexPointsArray(size);
  // Both red and blue lines on the same edge (1-2)
  const redOpacity = 0.2 + 0.8 * wavePhase;
  const blueOpacity = 0.2 + 0.8 * wavePhase;
  return (
    <g>
      {/* Red neon edge */}
      <line
        x1={points[1][0]}
        y1={points[1][1]}
        x2={points[2][0]}
        y2={points[2][1]}
        stroke="#ff1744"
        strokeWidth="5"
        strokeLinecap="round"
        filter="drop-shadow(0 0 8px #ff1744)"
        style={{ opacity: redOpacity }}
      />
      {/* Blue neon edge, overlapping */}
      <line
        x1={points[1][0]}
        y1={points[1][1]}
        x2={points[2][0]}
        y2={points[2][1]}
        stroke="#00f6ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="drop-shadow(0 0 8px #00f6ff)"
        style={{ opacity: blueOpacity }}
      />
    </g>
  );
};

const Hexagon = React.memo(({ x, y, animateId, wavePhase }) => (
  <svg
    className="solid-hex-svg floating-hex"
    width={HEX_WIDTH}
    height={HEX_HEIGHT}
    style={{ position: 'absolute', left: x, top: y, filter: 'drop-shadow(0 8px 24px #000a)' }}
  >
    <polygon
      points={getHexPoints(HEX_SIZE)}
      fill="#000"
      stroke="#222"
      strokeWidth="2"
    />
    {/* Subtle highlight on top edge for 3D effect */}
    <polyline
      points={getHexPoints(HEX_SIZE).split(' ').slice(0, 4).join(' ')}
      fill="none"
      stroke="#fff4"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Flowing neon edges: red then blue */}
    <FlowingNeonEdges size={HEX_SIZE - 6} wavePhase={wavePhase} />
  </svg>
));

const HexGrid = () => {
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });
  const [hoveredHex, setHoveredHex] = useState(null); // {row, col}
  const [waveTime, setWaveTime] = useState(0);
  const waveTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const gridRef = useRef();

  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight - NAVBAR_HEIGHT;
      // Add extra columns and rows to ensure full coverage
      const cols = Math.ceil((width - (HEX_WIDTH + GAP) * 0.25) / ((HEX_WIDTH + GAP) * 0.75)) + 3;
      const rows = Math.ceil((height - (HEX_HEIGHT + GAP) / 2) / ((HEX_HEIGHT + GAP) * 0.8)) + 3;
      setDimensions({ cols, rows });
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  // Animation for wave effect (optimized)
  useEffect(() => {
    let running = true;
    const animate = () => {
      frameCountRef.current++;
      // Only update state every 3 frames for smoother performance
      if (frameCountRef.current % 3 === 0) {
        waveTimeRef.current += 0.036; // 20% faster than original
        setWaveTime(waveTimeRef.current);
      }
      if (running) requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; };
  }, []);

  // Mouse move handler to find hovered hex
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      // Inverse of grid math
      let found = null;
      for (let row = 0; row < dimensions.rows; row++) {
        // For odd rows, render one extra hex to fill the left gap
        const colsInRow = (row % 2 === 1) ? dimensions.cols + 1 : dimensions.cols;
        for (let col = 0; col < colsInRow; col++) {
          // Updated x/y with gap and row offset
          let x = col * ((HEX_WIDTH + GAP) * 0.75) + LEFT_OFFSET;
          if (row % 2 === 1) {
            x += 0.4 * (HEX_WIDTH + GAP);
          }
          x += col * 0.05 * (HEX_WIDTH + GAP); // Add 0.05 gap per column
          let y = row * ((HEX_HEIGHT + GAP) * 0.8); // Remove NAVBAR_HEIGHT offset
          if (
            mouseX >= x && mouseX <= x + HEX_WIDTH &&
            mouseY >= y && mouseY <= y + HEX_HEIGHT
          ) {
            found = { row, col };
            break;
          }
        }
        if (found) break;
      }
      setHoveredHex(found);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  const hexes = [];
  let animateId = 0;
  for (let row = 0; row < dimensions.rows; row++) {
    // For odd rows, render one extra hex to fill the left gap
    const colsInRow = (row % 2 === 1) ? dimensions.cols + 1 : dimensions.cols;
    for (let col = 0; col < colsInRow; col++) {
      // Updated x/y with gap and row offset
      let x = col * ((HEX_WIDTH + GAP) * 0.75) + LEFT_OFFSET;
      if (row % 2 === 1) {
        x += 0.4 * (HEX_WIDTH + GAP);
      }
      x += col * 0.05 * (HEX_WIDTH + GAP); // Add 0.05 gap per column
      let y = row * ((HEX_HEIGHT + GAP) * 0.8); // Remove NAVBAR_HEIGHT offset
      // Only filter out hexes whose top is below the viewport
      if (y > window.innerHeight) continue;
      if (y + HEX_HEIGHT < 0) continue;
      const pop = hoveredHex && hoveredHex.row === row && hoveredHex.col === col;
      // Each hex has a phase offset for a traveling sine wave
      const phase = Math.sin(waveTime - (row + col) * 0.4) * 0.5 + 0.5;
      hexes.push(
        <Hexagon
          key={`${row}-${col}`}
          x={x}
          y={y}
          animateId={animateId++ % 6}
          pop={pop}
          wavePhase={phase}
        />
      );
    }
  }
  return (
    <div className="hero-section">
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          width: '100vw',
          position: 'relative',
        }}
      >
        <div
          className="hex-grid-solid"
          ref={gridRef}
          style={{
            width: '100vw',
            height: '100%',
            position: 'absolute',
            top: '0px',
            left: 0,
            pointerEvents: 'none',
            zIndex: 2,
            overflow: 'hidden',
            pointerEvents: 'auto', // allow mouse events
          }}
        >
          {hexes}
          <div className="hex-fade-top" />
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [currentTagline, setCurrentTagline] = useState(0);

  // Function to get a random tagline index
  const getRandomTaglineIndex = () => {
    return Math.floor(Math.random() * TAGLINES.length);
  };

  // Function to check if it's 3 AM and change tagline
  const checkAndChangeTagline = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if it's 3 AM
    if (currentHour === 3) {
      const newIndex = getRandomTaglineIndex();
      setCurrentTagline(newIndex);
      
      // Store the current date to avoid multiple changes on the same day
      localStorage.setItem('lastTaglineChange', now.toDateString());
    }
  };

  // Initialize tagline and set up daily change
  useEffect(() => {
    // Check if we already changed the tagline today
    const lastChange = localStorage.getItem('lastTaglineChange');
    const today = new Date().toDateString();
    
    if (lastChange !== today) {
      // If it's a new day, change the tagline
      const newIndex = getRandomTaglineIndex();
      setCurrentTagline(newIndex);
      localStorage.setItem('lastTaglineChange', today);
    } else {
      // If it's the same day, get the stored tagline index
      const storedIndex = localStorage.getItem('currentTaglineIndex');
      if (storedIndex !== null) {
        setCurrentTagline(parseInt(storedIndex));
      }
    }

    // Set up interval to check every hour
    const interval = setInterval(checkAndChangeTagline, 60 * 60 * 1000); // Check every hour

    // Also check immediately when component mounts
    checkAndChangeTagline();

    return () => clearInterval(interval);
  }, []);

  // Store current tagline index when it changes
  useEffect(() => {
    localStorage.setItem('currentTaglineIndex', currentTagline.toString());
  }, [currentTagline]);

  return (
    <div className="home-root">
      <div className="hex-bg-wrap">
        <div className="hex-sticky">
          <HexGrid />
        </div>

        {/* Content below navbar in normal flow */}
        <div className="hex-content">
          <div className="hero-stack">
            <div className="tagline-section">
              <div className="tagline-box">
                <h1 className="tagline-text">{TAGLINES[currentTagline]}</h1>
                <div className="author-line">
                  <span className="author-text">— Today's line</span>
                </div>
              </div>
            </div>

            <div className="about-myself-section">
              <div className="about-photo">
                <img src={HeroPhoto} alt="My portrait" />
              </div>
              <div className="about-box with-photo">
                <h2 className="about-title">About Myself</h2>
                <p className="about-text">
                  I am Kushal Tyagi, a passionate developer with a love for futuristic UI and cyberpunk design. Welcome to my portfolio where creativity meets technology.
                </p>
                <div className="about-details">
                  <div className="detail-item">
                    <span className="detail-label">Skills:</span>
                    <span className="detail-value">React, JavaScript, CSS3, HTML5, Python, Windows, MySQL</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Focus:</span>
                    <span className="detail-value">Modern Web Development</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Style:</span>
                    <span className="detail-value">Cyberpunk & Futuristic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <section className="projects-section">
            <h1 className="projects-title">PROJECTS</h1>
            <div className="projects-grid">
              <a className="project-card" href="#" target="_blank" rel="noreferrer">
                <div className="project-image" aria-label="Project 1 image"></div>
                <div className="project-info">
                  <h3 className="project-name">Project One</h3>
                  <p className="project-link">View Project</p>
                </div>
              </a>
              <a className="project-card" href="#" target="_blank" rel="noreferrer">
                <div className="project-image" aria-label="Project 2 image"></div>
                <div className="project-info">
                  <h3 className="project-name">Project Two</h3>
                  <p className="project-link">View Project</p>
                </div>
              </a>
              <a className="project-card" href="#" target="_blank" rel="noreferrer">
                <div className="project-image" aria-label="Project 3 image"></div>
                <div className="project-info">
                  <h3 className="project-name">Project Three</h3>
                  <p className="project-link">View Project</p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
