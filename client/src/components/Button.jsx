import React from 'react';

export default function Button({ label, size, onClick, active }) {
  let padding = 'px-2 py-1';
  if (size === 1) padding = 'px-2 py-1';
  if (size === 2) padding = 'px-4 py-2';
  if (size === 3) padding = 'px-6 py-3';

  let color = 'bg-blue-600';
  if (active) color = 'bg-green-600';

  return (
    <button
      className={`${padding} ${color} text-white rounded shadow`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
