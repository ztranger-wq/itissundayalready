import { useState, useRef } from 'react';
import './ProductImageGallery.css';

const ProductImageGallery = ({ images = [] }) => {
    const [mainImage, setMainImage] = useState(images[0] || '');
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const mainImageRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!mainImageRef.current) return;
        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const bgX = (x / width) * 100;
        const bgY = (y / height) * 100;

        setZoomPosition({ x: bgX, y: bgY });
    };

    if (images.length === 0) {
        return <div className="gallery-placeholder">No Image Available</div>;
    }

    return (
        <div className="product-image-gallery">
            <div 
                className="main-image-wrapper"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                ref={mainImageRef}
            >
                <img src={mainImage} alt="Main product view" className="main-image" />
                {showZoom && (
                    <div 
                        className="zoom-view"
                        style={{
                            backgroundImage: `url(${mainImage})`,
                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }}
                    />
                )}
            </div>
            <div className="thumbnail-wrapper">
                {images.map((img, index) => (
                    <div 
                        key={index} 
                        className={`thumbnail-item ${img === mainImage ? 'active' : ''}`}
                        onClick={() => setMainImage(img)}
                    >
                        <img src={img} alt={`Product thumbnail ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImageGallery;