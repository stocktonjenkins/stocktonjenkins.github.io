import React from "react";
import { Box } from "@mui/material";
import "./FadeInContent.css";

const FadeInContent: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;
  const [isVisible, setVisible] = React.useState(true);
  const domRef = React.useRef();
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    // @ts-ignore
    observer.observe(domRef.current);
    const theRef = domRef.current;
    // @ts-ignore
    return () => observer.unobserve(theRef);
  }, []);
  return (
    <Box
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      ref={domRef}
    >
      {children}
    </Box>
  );
};

export default FadeInContent;
