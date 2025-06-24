import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './StudentReviewsSection.css'; // Import the custom CSS

const StudentReviewsSection = () => {
  const reviewSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const reviews = [
    {
      name: "Samir Ahmed",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "This course has been a game-changer for me. The instructors are highly knowledgeable!",
      rating: 5,
    },
    {
      name: "Lina Hassan",
      image: "https://courssat.com/assets/images/home/female.png",
      review: "Amazing experience! I learned so much and the flexibility was perfect for my schedule.",
      rating: 4,
    },
    {
      name: "Omar Khaled",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Ahmed Khaled",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Lina Hassan",
      image: "https://courssat.com/assets/images/home/female.png",
      review: "Amazing experience! I learned so much and the flexibility was perfect for my schedule.",
      rating: 4,
    },
    {
      name: "Mohamed Ali",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Hassan Mohamed",
      image: "https://courssat.com/assets/images/home/avatar.png",
      review: "The best platform for learning. Highly recommend it to everyone!",
      rating: 5,
    },
    {
      name: "Lina Hassan",
      image: "https://courssat.com/assets/images/home/female.png",
      review: "Amazing experience! I learned so much and the flexibility was perfect for my schedule.",
      rating: 4,
    },
  ];

  return (
    <section className="student-reviews-section">
      <Container>
     

        <div className="text-center mb-5 scroll-animation visible">
          <h2 className="fw-bold ">Student Reviews</h2>
          <p className="lead text-muted mx-auto " style={{ maxWidth: 700 }}>
          Inspiring success stories
             </p>
        </div>
        <Slider {...reviewSliderSettings}>
          {reviews.map((review, index) => (
            <div key={index} className="review-slide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="review-card"
              >
                <div className="review-header">
                  <img src={review.image} alt={review.name} className="review-image" />
                  <h3 className="review-name">{review.name}</h3>
                </div>
                <p className="review-text">{review.review}</p>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="rating-star">
                      ★
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default StudentReviewsSection;