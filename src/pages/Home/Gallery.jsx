import { useState, useEffect, useRef } from "react";
import "../../styles/Gallery.css";
import { motion } from "framer-motion";
const Gallery = ({
  // eslint-disable-next-line react/prop-types
  images = [
    "https://plus.unsplash.com/premium_vector-1720623229280-dc0e64e2a760?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1720549705253-89c513c71d0f?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1720549705152-1810209290fb?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1720549705289-598aac16e4ee?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1720549705368-538ce455742a?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1720710527301-367d09920932?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  // eslint-disable-next-line react/prop-types
  columns = 3,
  // eslint-disable-next-line react/prop-types
  height = 200,
  // eslint-disable-next-line react/prop-types
  width = 300,
}) => {
  const [activeImage, setActiveImage] = useState(null);
  const [show, setShow] = useState(false);
  const [rotations, setRotations] = useState({});
  const [transition, setTransition] = useState(null);
  const postcardRefs = useRef({});

  // تحويل computed property: imageRows
  const imageRows = Array(Math.ceil(images.length / columns))
    .fill()
    .map((_, i) => images.slice(i * columns, i * columns + columns));

  // تحويل created hook
  useEffect(() => {
    setRotationsFunc();
  }, []);

  const setRotationsFunc = () => {
    const shuffleArray = (arr) =>
      arr
        .map((a) => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map((a) => a[1]);

    let indices = shuffleArray(Array.from(Array(images.length).keys()));
    const newRotations = {};

    imageRows.forEach((row, i) =>
      row.forEach((col, j) => {
        const getRandom = (min, max) =>
          Math.floor(Math.random() * (max - min + 1) + min);

        const centre = getCenter(i, j);
        let translateY = centre.translateY;
        const translateYTolerance = (height + 60) * 0.5;
        translateY += getRandom(-translateYTolerance, translateYTolerance);

        let translateX = centre.translateX;
        const translateXTolerance = (width + 40) * 0.5;
        translateX += getRandom(-translateXTolerance, translateXTolerance);

        newRotations[`${i},${j}`] = {
          row: translateY,
          col: translateX,
          rot: getRandom(-60, 60),
          zIndex: indices.splice(0, 1),
        };
      })
    );

    setRotations(newRotations);
  };

  const getCenter = (row, col) => {
    const rowOffset = imageRows.length / 2 - row;
    let translateY = rowOffset * (height + 60) + rowOffset * 50;
    if (!(imageRows.length % 2)) {
      if (!translateY) {
        translateY -= 155;
      } else {
        translateY /= 2;
      }
    }

    const colOffset = Math.floor(columns / 2 - col);
    let translateX =
      colOffset * (width + 40) +
      (colOffset * (1200 - (width + 40) * columns)) / columns;
    return {
      translateY,
      translateX,
    };
  };

  const showGallery = () => {
    if (!show) {
      setShow(true);
    }
  };

  const hideGallery = () => {
    if (show && !activeImage) {
      setRotationsFunc();
      setShow(false);
    }
  };

  const selectImage = (row, col, image) => {
    const pc = postcardRefs.current[`pc_${row}${col}`];
    const startHandler = (e) => {
      setTransition(image);
    };
    const endHandler = (e) => {
      if (!activeImage) {
        setTransition(null);
        pc.removeEventListener("transitionstart", startHandler);
        e.target.removeEventListener("transitionend", endHandler);
        console.log("transition ended");
      }
    };
    pc.addEventListener("transitionstart", startHandler);
    pc.addEventListener("transitionend", endHandler);
    setActiveImage(image);
  };

  const getPostcardStyle = (row, col, image) => {
    const centre = getCenter(row, col);

    if (activeImage === image) {
      return {
        width: `${width + 40}px`,
        height: `${height + 60}px`,
        transition: "all 0.2s",
        transform: `translateX(${centre.translateX}px) translateY(${centre.translateY}px) translateZ(500px) !important`,
      };
    }

    return {
      width: `${width + 40}px`,
      height: `${height + 60}px`,
      transform: `translateX(${
        rotations[`${row},${col}`]?.col || 0
      }px) translateY(${rotations[`${row},${col}`]?.row || 0}px) rotateZ(${
        rotations[`${row},${col}`]?.rot || 0
      }deg)`,
    };
  };

  return (
    <div
      className={`gallery py-5 ${show ? "gallery-display" : ""}`}
      onMouseLeave={hideGallery}
    >
      <div className="text-center mb-5 scroll-animation visible">
        <h2 className="fw-bold">Success Exhibition</h2>
        <p className="lead text-muted mx-auto" style={{ maxWidth: 700 }}>
          Pictures of stories of excellence
        </p>
      </div>
      <div>
        {imageRows.map((imageRow, i) => (
          <div key={i} className="gallery__row">
            {imageRow.map((image, j) => (
              <div
                key={j}
                className="gallery__row__image"
                style={{ width: `${100 / columns}%` }}
              >
                <div
                  className={`postcard ${
                    transition === image ? "postcard-transition" : ""
                  }`}
                  style={getPostcardStyle(i, j, image)}
                  onClick={() => selectImage(i, j, image)}
                  ref={(el) => (postcardRefs.current[`pc_${i}${j}`] = el)}
                >
                  <div className="postcard__front">
                    <div className="image-wrapper">
                      <img
                        src={image}
                        alt={`Gallery ${i}-${j}`}
                        onMouseEnter={showGallery}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {activeImage && (
        <div className="overlay" onClick={() => setActiveImage(null)}></div>
      )}
    </div>
  );
};

export default Gallery;
