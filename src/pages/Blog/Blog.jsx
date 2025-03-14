import React from "react";
import Footer from "../../components/Footer"; // استيراد مكون الـ Footer
import HeaderPages from "../../components/HeaderPages";

const Blog = () => {
  // بيانات الكروت (يمكنك استبدالها ببيانات ديناميكية من API لاحقًا)
  const blogPosts = [
    {
      title: 'Personal Blog - CSS Grid',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      imgSrc: '/public/BLOG.jpg', // صورة عشوائية للسفر
    },
    {
      title: 'Travel Blog - CSS Grid',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      imgSrc: '/public/BLOG.jpg', // صورة عشوائية للسفر
    },
    {
      title: 'Food Blog - CSS Grid',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      imgSrc: '/public/BLOG.jpg', // صورة عشوائية للسفر
    },
    {
      title: 'Tech Blog - CSS Grid',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      imgSrc: '/public/BLOG.jpg', // صورة عشوائية للسفر
    },
  ];
  return (
    <div>
      {/* قسم العنوان العلوي مع التدرج اللوني */}
      
    <HeaderPages title="Blog"/>
      {/* الكروت */}
      <div className="container my-5">
        <div className="row">
          {blogPosts.map((post, index) => (
            <div className="col-md-6 col-lg-3 mb-4" key={index}>
              <div className="card h-100">
                <img
                  src={post.imgSrc}
                  className="card-img-top"
                  alt={post.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                  <a href="#" className="btn btn-outline-primary">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إضافة الـ Footer */}
      <Footer />
    </div>
  );
};

export default Blog;
