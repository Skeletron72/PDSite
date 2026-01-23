import React from 'react';

export const PixelButton = ({ children, onClick, type = "button", className = "", color = "" }) => {
    const colorClass = color ? `is-${color}` : "";
    return (
        <button
            type={type}
            onClick={onClick}
            className={`nes-btn ${colorClass} ${className}`}
        >
            {children}
        </button>
    );
};

export const PixelContainer = ({ children, title, className = "", dark = false }) => {
    const darkClass = dark ? "is-dark" : "";
    return (
        <div className={`nes-container ${darkClass} with-title ${className}`}>
            {title && <p className="title">{title}</p>}
            {children}
        </div>
    );
};

export const PixelInput = ({ label, placeholder, value, onChange, type = "text", className = "" }) => (
    <div className={`nes-field ${className}`}>
        <label>{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="nes-input"
            placeholder={placeholder}
        />
    </div>
);

export const PixelHeading = ({ level = 1, children, className = "" }) => {
    const Tag = `h${level}`;
    return <Tag className={`pixel-font ${className}`}>{children}</Tag>;
};
