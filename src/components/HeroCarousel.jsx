import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { motion, AnimatePresence } from "framer-motion"; // Add AnimatePresence
import "./DomeGallery.css";
import java from "../assets/hero/java.png";
import python from "../assets/hero/python.jpg";
import sql from "../assets/hero/sql.png";
import csharp from "../assets/hero/c#.png";
import uiux from "../assets/hero/UI_UX.jpg";
import powerBi from "../assets/hero/powerBI.jpg";
import flutter from "../assets/hero/flutter.png";

// Add course data with more details
const COURSE_DETAILS = {
  java: {
    title: "Java Programming Masterclass",
    description:
      "Become a Java expert from zero to hero with hands-on projects",
    price: 1299,
    originalPrice: 4999,
    level: "Beginner to Advanced",
    duration: "45 hours",
    features: [
      "Object-Oriented Programming",
      "Spring Framework",
      "REST APIs",
      "Database Integration",
      "Real-world Projects",
    ],
  },
  python: {
    title: "Python for Data Science",
    description: "Master Python, NumPy, Pandas, and Machine Learning",
    price: 1499,
    originalPrice: 5999,
    level: "Intermediate",
    duration: "50 hours",
    features: [
      "Data Analysis with Pandas",
      "Machine Learning Basics",
      "Data Visualization",
      "Web Scraping",
      "Case Studies",
    ],
  },
  sql: {
    title: "SQL & Database Design",
    description: "Complete guide to SQL queries and database management",
    price: 999,
    originalPrice: 3999,
    level: "Beginner",
    duration: "30 hours",
    features: [
      "SQL Queries",
      "Database Design",
      "Optimization Techniques",
      "NoSQL Introduction",
      "Practical Exercises",
    ],
  },
  "c#": {
    title: "C# & .NET Development",
    description: "Build applications with C# and .NET framework",
    price: 1399,
    originalPrice: 5499,
    level: "Intermediate",
    duration: "40 hours",
    features: [
      ".NET Core",
      "ASP.NET MVC",
      "Entity Framework",
      "Web APIs",
      "Deployment",
    ],
  },
  UI_UX: {
    title: "UI/UX Design Fundamentals",
    description: "Learn design principles and create stunning interfaces",
    price: 1199,
    originalPrice: 4499,
    level: "Beginner",
    duration: "35 hours",
    features: [
      "Figma Mastery",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
    ],
  },
  powerBI: {
    title: "Power BI Dashboard Mastery",
    description:
      "Create interactive dashboards and business intelligence reports",
    price: 1099,
    originalPrice: 4299,
    level: "Beginner",
    duration: "25 hours",
    features: [
      "Data Modeling",
      "DAX Formulas",
      "Dashboard Design",
      "Power Query",
      "Real-time Reporting",
    ],
  },
  flutter: {
    title: "Flutter Mobile Development",
    description: "Build cross-platform mobile apps with Flutter",
    price: 1599,
    originalPrice: 6499,
    level: "Intermediate",
    duration: "55 hours",
    features: [
      "Dart Programming",
      "State Management",
      "Firebase Integration",
      "API Integration",
      "App Store Deployment",
    ],
  },
};

const DEFAULT_IMAGES = [
  {
    src: java,
    alt: "Java Programming",
    key: "java",
  },
  {
    src: python,
    alt: "Python Data Science",
    key: "python",
  },
  {
    src: sql,
    alt: "SQL Database",
    key: "sql",
  },
  {
    src: csharp,
    alt: "C# Development",
    key: "c#",
  },
  {
    src: uiux,
    alt: "UI/UX Design",
    key: "UI_UX",
  },
  {
    src: powerBi,
    alt: "Power BI Analytics",
    key: "powerBI",
  },
  {
    src: flutter,
    alt: "Flutter Mobile",
    key: "flutter",
  },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map((c) => ({ ...c, src: "", alt: "", key: "" }));
  }
  if (pool.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    );
  }

  const normalizedImages = pool.map((image) => {
    if (typeof image === "string") {
      return { src: image, alt: "", key: "" };
    }
    return {
      src: image.src || "",
      alt: image.alt || "",
      key: image.key || "",
    };
  });

  const usedImages = Array.from(
    { length: totalSlots },
    (_, i) => normalizedImages[i % normalizedImages.length]
  );

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt,
    key: usedImages[i].key,
  }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = "#060010",
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = "250px",
  openedImageHeight = "350px",
  imageBorderRadius = "30px",
  openedImageBorderRadius = "30px",
  grayscale = true,
  autoRotate = true,
  autoRotateSpeed = 10.0,
  autoRotateReverse = false,
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const autoRotateRAF = useRef(null);
  const lastAnimationFrameTime = useRef(0);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add("dg-scroll-lock");
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute("data-enlarging") === "true") return;
    scrollLockedRef.current = false;
    document.body.classList.remove("dg-scroll-lock");
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  // Add state for popup
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const applyTransform = useCallback((xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  }, []);

  const updateAutoRotation = useCallback(
    (timestamp) => {
      if (!autoRotate || draggingRef.current || openingRef.current) {
        // Only stop if dragging or opening image - NOT for popup
        autoRotateRAF.current = null;
        return;
      }

      if (lastAnimationFrameTime.current === 0) {
        lastAnimationFrameTime.current = timestamp;
      }

      const deltaTime = timestamp - lastAnimationFrameTime.current;
      lastAnimationFrameTime.current = timestamp;

      // Calculate rotation based on time
      const rotationDelta = (autoRotateSpeed * deltaTime) / 1000;
      const direction = autoRotateReverse ? -1 : 1;

      // Update only Y rotation for circular motion
      const currentY = rotationRef.current.y;
      const newY = wrapAngleSigned(currentY + rotationDelta * direction);

      rotationRef.current = {
        x: rotationRef.current.x,
        y: newY,
      };

      applyTransform(rotationRef.current.x, newY);

      // Continue animation even when popup is open
      autoRotateRAF.current = requestAnimationFrame(updateAutoRotation);
    },
    [autoRotate, autoRotateSpeed, autoRotateReverse, applyTransform]
  );

  const startAutoRotation = useCallback(() => {
    if (!autoRotate || autoRotateRAF.current) return;
    lastAnimationFrameTime.current = 0;
    autoRotateRAF.current = requestAnimationFrame(updateAutoRotation);
  }, [autoRotate, updateAutoRotation]);

  const stopAutoRotation = useCallback(() => {
    if (autoRotateRAF.current) {
      cancelAnimationFrame(autoRotateRAF.current);
      autoRotateRAF.current = null;
    }
    lastAnimationFrameTime.current = 0;
  }, []);

  // Start auto-rotation - keep it running even when popup is open
  useEffect(() => {
    if (autoRotate && !draggingRef.current && !openingRef.current) {
      startAutoRotation();
    } else {
      stopAutoRotation();
    }

    return () => {
      stopAutoRotation();
    };
  }, [autoRotate, startAutoRotation, stopAutoRotation]);

  // Keep auto-rotation running when popup opens/closes
  useEffect(() => {
    if (autoRotate && !draggingRef.current && !openingRef.current) {
      startAutoRotation();
    }
  }, [popupOpen, autoRotate, startAutoRotation]);

  const lockedRadiusRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis;
      switch (fitBasis) {
        case "min":
          basis = minDim;
          break;
        case "max":
          basis = maxDim;
          break;
        case "width":
          basis = w;
          break;
        case "height":
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty("--radius", `${lockedRadiusRef.current}px`);
      root.style.setProperty("--viewer-pad", `${viewerPad}px`);
      root.style.setProperty("--overlay-blur-color", overlayBlurColor);
      root.style.setProperty("--tile-radius", imageBorderRadius);
      root.style.setProperty("--enlarge-radius", openedImageBorderRadius);
      root.style.setProperty(
        "--image-filter",
        grayscale ? "grayscale(1)" : "none"
      );
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight,
    applyTransform,
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, [applyTransform]);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(
          rotationRef.current.x - vY / 200,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia, applyTransform]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current || popupOpen) return; // Don't drag when popup is open
        stopInertia();
        stopAutoRotation();
        const evt = event;
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
      },
      onDrag: ({
        event,
        last,
        velocity = [0, 0],
        direction = [0, 0],
        movement,
      }) => {
        if (
          focusedElRef.current ||
          !draggingRef.current ||
          !startPosRef.current ||
          popupOpen
        )
          return;
        const evt = event;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;
        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 16) movedRef.current = true;
        }
        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(
          startRotRef.current.y + dxTotal / dragSensitivity
        );
        if (
          rotationRef.current.x !== nextX ||
          rotationRef.current.y !== nextY
        ) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }
        if (last) {
          draggingRef.current = false;
          let [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (
            Math.abs(vx) < 0.001 &&
            Math.abs(vy) < 0.001 &&
            Array.isArray(movement)
          ) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) {
            startInertia(vx, vy);
          } else if (autoRotate) {
            setTimeout(() => {
              if (
                !draggingRef.current &&
                !focusedElRef.current &&
                !openingRef.current
              ) {
                startAutoRotation();
              }
            }, 500);
          }
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } }
  );

  const onTileClick = useCallback(
    (e) => {
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current || popupOpen) return;

      // Get the clicked item data
      const target = e.currentTarget;
      const parent = target.parentElement;
      const offsetX = getDataNumber(parent, "offsetX", 0);
      const offsetY = getDataNumber(parent, "offsetY", 0);
      const src = parent.dataset.src || "";
      const alt = target.querySelector("img")?.alt || "";

      // Find the corresponding item in items array
      const clickedItem = items.find(
        (item) => item.x === offsetX && item.y === offsetY
      );

      if (clickedItem && clickedItem.key) {
        const courseDetails = COURSE_DETAILS[clickedItem.key] || {
          title: clickedItem.alt,
          description: "Master this skill with comprehensive learning",
          price: 999,
          originalPrice: 2999,
          level: "Beginner to Intermediate",
          duration: "40+ hours",
          features: [
            "Hands-on projects",
            "Certificate of completion",
            "Lifetime access",
            "Community support",
          ],
        };

        setSelectedCourse({
          ...clickedItem,
          ...courseDetails,
        });
        setPopupOpen(true);
      }
    },
    [items, popupOpen]
  );

  const onTilePointerUp = useCallback(
    (e) => {
      if (e.pointerType !== "touch") return;
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current || popupOpen) return;
      onTileClick(e);
    },
    [onTileClick, popupOpen]
  );

  const handleClosePopup = useCallback(() => {
    setPopupOpen(false);
    // Small delay before clearing course data for smooth animation
    setTimeout(() => {
      setSelectedCourse(null);
    }, 300);
  }, []);

  const handleAddToCart = useCallback(
    (course) => {
      console.log("Adding to cart:", course);
      alert(`🎉 "${course.title}" has been added to your cart!`);
      handleClosePopup();
    },
    [handleClosePopup]
  );

  // Close popup on Escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && popupOpen) {
        handleClosePopup();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [popupOpen, handleClosePopup]);

  // Prevent background scroll when popup is open
  useEffect(() => {
    if (popupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [popupOpen]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("dg-scroll-lock");
      document.body.style.overflow = "";
      stopAutoRotation();
      stopInertia();
    };
  }, [stopAutoRotation, stopInertia]);

  return (
    <>
      <div
        ref={rootRef}
        className="sphere-root"
        style={{
          ["--segments-x"]: segments,
          ["--segments-y"]: segments,
          ["--overlay-blur-color"]: overlayBlurColor,
          ["--tile-radius"]: imageBorderRadius,
          ["--enlarge-radius"]: openedImageBorderRadius,
          ["--image-filter"]: grayscale ? "grayscale(1)" : "none",
        }}
      >
        <main ref={mainRef} className="sphere-main">
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="item"
                  data-src={it.src}
                  data-offset-x={it.x}
                  data-offset-y={it.y}
                  data-size-x={it.sizeX}
                  data-size-y={it.sizeY}
                  style={{
                    ["--offset-x"]: it.x,
                    ["--offset-y"]: it.y,
                    ["--item-size-x"]: it.sizeX,
                    ["--item-size-y"]: it.sizeY,
                  }}
                >
                  <div
                    className="item__image"
                    role="button"
                    tabIndex={0}
                    aria-label={it.alt || "Course details"}
                    onClick={onTileClick}
                    onPointerUp={onTilePointerUp}
                  >
                    <img src={it.src} draggable={false} alt={it.alt} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overlay" />
          <div className="overlay overlay--blur" />
          <div className="edge-fade edge-fade--top" />
          <div className="edge-fade edge-fade--bottom" />

          <div className="viewer" ref={viewerRef}>
            <div ref={scrimRef} className="scrim" />
            <div ref={frameRef} className="frame" />
          </div>
        </main>
      </div>

      {/* Course Popup */}

<AnimatePresence>
  {popupOpen && selectedCourse && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999]"
      onClick={handleClosePopup} // 👈 bahar click = close
    >
      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // 👈 andar click safe
      >
        <div className="p-6">
          <img
            src={selectedCourse.src}
            alt={selectedCourse.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h3 className="text-xl font-bold mb-2">
            {selectedCourse.title}
          </h3>

          <p className="text-gray-600 mb-1">
            {selectedCourse.description}
          </p>

          <p className="text-gray-600 mb-1">
             Duration : {selectedCourse.duration}
          </p>

           <p className="text-gray-600 mb-4">
            level:  {selectedCourse.level}
          </p>

          <button
            onClick={() => handleAddToCart(selectedCourse)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            ₹{selectedCourse.price}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
}
