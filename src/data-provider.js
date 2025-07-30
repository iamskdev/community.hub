// src/scripts/data-provider.js
const testimonials = [
  {
    quote: "Supporting creative work has been incredibly rewarding...",
    author: "Priya Sharma",
    role: "Supporter since 2022",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  // Add more testimonials here
];

function loadRandomTestimonials() {
  const container = document.getElementById('testimonial-container');
  // Shuffle and display testimonials
  // ...
}

document.addEventListener('DOMContentLoaded', loadRandomTestimonials);