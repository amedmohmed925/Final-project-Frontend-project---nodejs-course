import React, { useState } from 'react';
import HeaderPages from '../shared/components/HeaderPages';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // بيانات المقالات مع تصنيفات
  const blogPosts = [
    {
      id: 1,
      title: 'Building Modern Web Applications with React',
      description: 'Discover the latest techniques and best practices for creating scalable React applications that deliver exceptional user experiences.',
      imgSrc: '/public/BLOG.jpg',
      category: 'tech',
      author: 'Ahmed Hassan',
      date: '2024-03-15',
      readTime: '8 min read',
      tags: ['React', 'JavaScript', 'Web Development']
    },
    {
      id: 2,
      title: 'The Ultimate Travel Guide to Egypt',
      description: 'Explore the hidden gems and ancient wonders of Egypt. From the pyramids to the Red Sea, discover what makes this destination magical.',
      imgSrc: '/public/BLOG.jpg',
      category: 'travel',
      author: 'Sara Mohamed',
      date: '2024-03-12',
      readTime: '12 min read',
      tags: ['Travel', 'Egypt', 'Tourism']
    },
    {
      id: 3,
      title: 'Mastering Mediterranean Cuisine',
      description: 'Learn the secrets of authentic Mediterranean cooking with traditional recipes and modern techniques that bring flavors to life.',
      imgSrc: '/public/BLOG.jpg',
      category: 'food',
      author: 'Omar Ali',
      date: '2024-03-10',
      readTime: '6 min read',
      tags: ['Cooking', 'Mediterranean', 'Recipes']
    },
    {
      id: 4,
      title: 'My Personal Journey in Digital Transformation',
      description: 'Sharing insights and lessons learned from transitioning into the digital world and building a successful online presence.',
      imgSrc: '/public/BLOG.jpg',
      category: 'personal',
      author: 'Layla Farid',
      date: '2024-03-08',
      readTime: '10 min read',
      tags: ['Personal Growth', 'Digital', 'Career']
    },
    {
      id: 5,
      title: 'AI and Machine Learning Trends 2024',
      description: 'Exploring the latest developments in artificial intelligence and how they are reshaping industries worldwide.',
      imgSrc: '/public/BLOG.jpg',
      category: 'tech',
      author: 'Mahmoud Reda',
      date: '2024-03-05',
      readTime: '15 min read',
      tags: ['AI', 'Machine Learning', 'Technology']
    },
    {
      id: 6,
      title: 'Street Food Adventures in Cairo',
      description: 'A culinary journey through Cairo\'s vibrant street food scene, discovering authentic flavors and local favorites.',
      imgSrc: '/public/BLOG.jpg',
      category: 'food',
      author: 'Nour Ibrahim',
      date: '2024-03-03',
      readTime: '7 min read',
      tags: ['Street Food', 'Cairo', 'Local Cuisine']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'tech', name: 'Technology', count: blogPosts.filter(post => post.category === 'tech').length },
    { id: 'travel', name: 'Travel', count: blogPosts.filter(post => post.category === 'travel').length },
    { id: 'food', name: 'Food', count: blogPosts.filter(post => post.category === 'food').length },
    { id: 'personal', name: 'Personal', count: blogPosts.filter(post => post.category === 'personal').length }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryBadgeClass = (category) => {
    switch(category) {
      case 'tech': return 'bg-primary';
      case 'travel': return 'bg-success';
      case 'food': return 'bg-warning';
      case 'personal': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
      {/* Header Section */}
      <HeaderPages />
      
      {/* Hero Section */}
      <div className="position-relative py-5" style={{
        background: 'linear-gradient(135deg, #0d6efd 0%, #6f42c1 50%, #6610f2 100%)',
        minHeight: '400px'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'rgba(0,0,0,0.2)'
        }}></div>
        <div className="position-relative container text-center text-white d-flex flex-column justify-content-center" style={{minHeight: '400px'}}>
          <h1 className="display-1 fw-bold mb-4">
            Our <span className="text-warning">Blog</span>
          </h1>
          <p className="lead fs-3 opacity-75 mx-auto" style={{maxWidth: '600px'}}>
            Discover insights, stories, and expertise from our team. Stay updated with the latest trends and valuable content.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Category Filter */}
        <div className="mb-5">
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`btn px-4 py-2 fw-semibold rounded-pill border-0 shadow-sm transition-all ${
                  selectedCategory === category.id
                    ? 'btn-primary text-white'
                    : 'btn-outline-primary bg-white'
                }`}
                style={{
                  background: selectedCategory === category.id 
                    ? 'linear-gradient(135deg, #0d6efd, #6f42c1)' 
                    : 'white',
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="row g-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="col-12 col-md-6 col-lg-4">
              <article className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden blog-card">
                {/* Image Container */}
                <div className="position-relative overflow-hidden" style={{height: '250px'}}>
                  <img
                    src={post.imgSrc}
                    alt={post.title}
                    className="card-img-top h-100 w-100 object-fit-cover blog-image"
                    style={{
                      transition: 'transform 0.5s ease',
                      objectFit: 'cover'
                    }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 blog-overlay" style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}></div>
                  
                  {/* Category Badge */}
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className={`badge ${getCategoryBadgeClass(post.category)} px-3 py-2 rounded-pill`}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="card-body p-4">
                  {/* Meta Information */}
                  <div className="d-flex align-items-center text-muted small mb-3">
                    <span className="fw-medium text-dark">{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.date)}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h2 className="card-title h5 fw-bold text-dark mb-3 blog-title" style={{
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    transition: 'color 0.3s ease'
                  }}>
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="card-text text-muted mb-3" style={{
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="badge bg-light text-secondary rounded-pill px-2 py-1 small"
                        style={{
                          fontSize: '0.75rem',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More Button */}
                  <button className="btn btn-primary w-100 py-3 fw-semibold rounded-3 border-0 read-more-btn" style={{
                    background: 'linear-gradient(135deg, #0d6efd, #6f42c1)',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                  }}>
                    Read Full Article
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-5">
          <button className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-3 fw-semibold load-more-btn" style={{
            transition: 'all 0.3s ease',
            transform: 'scale(1)'
          }}>
            Load More Articles
            <i className="bi bi-arrow-down ms-2"></i>
          </button>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-5 text-white" style={{
        background: 'linear-gradient(135deg, #212529 0%, #495057 100%)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center">
              <h3 className="display-6 fw-bold mb-4">
                Stay Updated with Our Latest Posts
              </h3>
              <p className="lead mb-5 opacity-75">
                Subscribe to our newsletter and never miss an update. Get the best content delivered directly to your inbox.
              </p>
              <div className="row g-3 justify-content-center">
                <div className="col-12 col-sm-8 col-md-6">
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-3 border-0 px-4"
                    placeholder="Enter your email address"
                    style={{
                      fontSize: '1rem',
                      padding: '12px 16px'
                    }}
                  />
                </div>
                <div className="col-12 col-sm-4 col-md-3">
                  <button className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold border-0 subscribe-btn" style={{
                    background: 'linear-gradient(135deg, #0d6efd, #6f42c1)',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                  }}>
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-8px);
          transition: all 0.5s ease;
        }
        
        .blog-card:hover .blog-image {
          transform: scale(1.1);
        }
        
        .blog-card:hover .blog-overlay {
          opacity: 1;
        }
        
        .blog-card:hover .blog-title {
          color: #0d6efd !important;
        }
        
        .read-more-btn:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 8px 25px rgba(13, 110, 253, 0.4);
        }
        
        .load-more-btn:hover {
          transform: scale(1.05) !important;
          background-color: #6c757d !important;
          border-color: #6c757d !important;
          color: white !important;
        }
        
        .subscribe-btn:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 8px 25px rgba(13, 110, 253, 0.4);
        }
        
        .badge:hover {
          background-color: #6c757d !important;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .display-1 {
            font-size: 3rem !important;
          }
          
          .lead {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;