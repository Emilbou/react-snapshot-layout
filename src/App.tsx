import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import "./App.css";

type Image = {
  id: string;
  download_url: string;
};

function DisplayImages({ data }: { data: Image[] }) {
  const styles: { [key: string]: React.CSSProperties } = {
    image: {
      width: "100%",
      display: "block",
      marginBottom: "1rem",
    },
    container: {
      columns: 3,
      gap: "1rem",
      opacity: 0,
    },
    loader: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100svh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      zIndex: 9999,
    },
  };

  return (
    <>
      <div style={styles.container}>
        {data.map((image) => (
          <img
            key={image.id}
            src={image.download_url}
            alt="Fetched from API"
            style={styles.image}
            className="imageChargee"
          />
        ))}
      </div>
      <div style={styles.loader}>
        <h1>Loading</h1>
      </div>
    </>
  );
}

function App() {
  const { data } = useSuspenseQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await fetch(
        "https://picsum.photos/v2/list?page=2&limit=30"
      );

      return response.json();
    },
  });

  const [elementsInfos, setElementsInfos] = React.useState<Element[] | null>(
    null
  );

  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const savePosition = () => {
    const elements = document.getElementsByClassName("imageChargee");
    const elementsArray = Array.from(elements);
    setElementsInfos(elementsArray);
  };

  React.useEffect(() => {
    const unchargedElements = document.getElementsByClassName("imageChargee");
    Promise.all(
      Array.from(unchargedElements).map(
        (img) =>
          new Promise<void>((resolve) => {
            if ((img as HTMLImageElement).complete) {
              resolve();
            } else {
              (img as HTMLImageElement).onload = () => resolve();
            }
          })
      )
    ).then(() => {
      savePosition();
    });
  }, []);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLImageElement>,
    imageSrc: string
  ) => {
    const element = document.getElementById(imageSrc);
    if (element) {
      const rect = element.getBoundingClientRect();
      setOffset({
        x: e.pageX - rect.left - window.scrollX,
        y: e.pageY - rect.top - window.scrollY,
      });
      setDraggingId(imageSrc);
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingId) {
        const element = document.getElementById(draggingId);
        if (element) {
          element.style.left = `${e.pageX - offset.x}px`;
          element.style.top = `${e.pageY - offset.y}px`;
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    if (draggingId) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, offset]);

  if (elementsInfos) {
    const mappedInfos = elementsInfos.map((el, index) => ({
      index,
      tagName: el.tagName,
      // className: el.className,
      top: (el as HTMLImageElement).offsetTop,
      left: (el as HTMLImageElement).offsetLeft,
      width: (el as HTMLImageElement).width,
      height: (el as HTMLImageElement).height,
      src: (el as HTMLImageElement).src,
    }));
    return (
      <div style={{ display: "contents" }}>
        {mappedInfos.map((image, index) => (
          <img
            key={index}
            id={image.src}
            src={image.src}
            draggable={false}
            style={{
              position: "absolute",
              top: image.top,
              left: image.left,
              width: image.width,
              height: image.height,
              cursor: "move",
              userSelect: "none",
            }}
            onMouseDown={(e) => handleMouseDown(e, image.src)}
          />
        ))}
      </div>
    );
  } else {
    return (
      <>
        <DisplayImages data={data} />
      </>
    );
  }
}

export default App;
