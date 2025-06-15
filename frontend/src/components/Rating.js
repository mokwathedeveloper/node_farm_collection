import React from 'react';

const Rating = ({ value, text, color = 'text-yellow-400' }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          <i
            className={
              value >= star
                ? `fas fa-star ${color}`
                : value >= star - 0.5
                ? `fas fa-star-half-alt ${color}`
                : `far fa-star ${color}`
            }
          ></i>
        </span>
      ))}
      <span className="ml-2 text-gray-600">{text && text}</span>
    </div>
  );
};

export default Rating;