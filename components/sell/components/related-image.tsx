"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ListingMedia } from "@/lib/generated/prisma/client";
import Image from "next/image";

function RelatedImage({
  listRelatedImage,
}: {
  listRelatedImage: ListingMedia[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraint, setDragConstraint] = useState(0);
  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        setDragConstraint(containerWidth - trackWidth);
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);

    return () => window.removeEventListener("resize", calculateConstraints);
  }, []);
  return (
    <div className="font-sans w-full py-12 md:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white ">
            Các ảnh khác
          </h1>
        </div>

        <motion.div
          ref={containerRef}
          className="overflow-hidden cursor-grab"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            ref={trackRef}
            className="flex space-x-6 pb-6 px-4"
            drag="x"
            dragConstraints={{
              right: 0,
              left: dragConstraint - 32,
            }}
            dragElastic={0.15}
          >
            {listRelatedImage.map((image) => (
              <StoryCard key={image.id} image={image} />
            ))}
          </motion.div>
        </motion.div>

        <div className="mt-10 flex items-center justify-center">
          <a
            href="#"
            className="text-gray-300 font-semibold hover:text-white transition-colors duration-300 group"
          >
            Discover More
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default RelatedImage;
const StoryCard = ({ image }: { image: ListingMedia }) => {
  return (
    <motion.div
      className="relative w-72 h-96 shrink-0 rounded-lg overflow-hidden shadow-xl group"
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
    >
      <Image
        src={image.images_url}
        alt="Product Image"
        fill
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
    </motion.div>
  );
};
