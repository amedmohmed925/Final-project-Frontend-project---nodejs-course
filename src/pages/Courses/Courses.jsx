import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCoursesPreview } from "../../api/courseApi";
import { getCategories } from "../../api/categoryApi";
import "../../styles/Courses.css";
import { Spinner, Form, Button, Row, Col, Card } from "react-bootstrap";
import HeaderPages from "../../components/HeaderPages";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  // Fetch courses and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, categoriesData] = await Promise.all([
          getAllCoursesPreview(),
          getCategories(),
        ]);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setCategories(["All", ...categoriesData.map((cat) => cat.name)]);
        const uniqueTags = [...new Set(coursesData.flatMap((course) => course.tags))];
        setAllTags(uniqueTags);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply all filters
  useEffect(() => {
    let result = [...courses];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((course) => course.category === selectedCategory);
    }

    // Search in tags, title, and description
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (course) =>
          course.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm)) ||
          course.title.toLowerCase().includes(lowerSearchTerm) ||
          course.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filter by level
    if (selectedLevel) {
      result = result.filter((course) => course.level === selectedLevel);
    }

    // Filter by price range
    if (minPrice !== "" || maxPrice !== "") {
      const min = minPrice === "" ? 0 : parseFloat(minPrice);
      const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);
      result = result.filter((course) => course.price >= min && course.price <= max);
    }

    // Filter by selected tags (AND logic)
    if (selectedTags.length > 0) {
      result = result.filter((course) =>
        selectedTags.every((tag) => course.tags.includes(tag))
      );
    }

    setFilteredCourses(result);
    setVisibleCount(8);
  }, [searchTerm, selectedLevel, minPrice, maxPrice, selectedTags, selectedCategory, courses]);

  const handleImageError = (e) => {
    e.target.src = "path/to/fallback-image.jpg";
  };

  const truncateDescription = (description) => {
    return description.length > 50 ? description.substring(0, 50) + "..." : description;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(<FaStarHalfAlt key={fullStars + 1} className="star filled" />);
    }
    const remainingStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 1; i <= remainingStars; i++) {
      stars.push(<FaStar key={fullStars + (hasHalfStar ? 2 : 1) + i} className="star" />);
    }
    return stars;
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading ...</span>
        </Spinner>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <HeaderPages title="Explore our courses" />
      <div className="courses-container">
        <Row >
          {/* Filters Sidebar */}
          <Col md={3} className="filters-sidebar">
            <Card className="p-3 shadow-sm">
              <h5 className="mb-3">Filters</h5>

              {/* Category Filter */}
              <Form.Group controlId="categoryFilter" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Search */}
              <Form.Group controlId="searchByTags" className="mb-3">
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by tags, title, or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>

              {/* Level Filter */}
              <Form.Group controlId="levelFilter" className="mb-3">
                <Form.Label>Level</Form.Label>
                <Form.Select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Professional">Professional</option>
                </Form.Select>
              </Form.Group>

              {/* Price Range Filter */}
              <Form.Group controlId="priceFilter" className="mb-3">
                <Form.Label>Price Range</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </Form.Group>

              {/* Tags Filter */}
              <Form.Group controlId="tagsFilter">
                <Form.Label>Tags</Form.Label>
                <div className="tags-container">
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "primary" : "outline-primary"}
                      size="sm"
                      className="m-1"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            </Card>
          </Col>

          {/* Courses Grid */}
          <Col md={9}>
            <div className="courses-grid">
              {filteredCourses.slice(0, visibleCount).map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-image">
                    <img
                      src={course.featuredImage}
                      alt={course.title}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{truncateDescription(course.description)}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="course-rating">
                        {renderStars(course.averageRating)}
                        <span>({course.averageRating})</span>
                      </div>
                      <span className="courseLevel">{course.level}</span>
                    </div>
                    <button
                      className="enroll-btn d-flex justify-content-center"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      Enroll Now
                      <div className="mx-2">${course.price}</div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-4">
                No courses found matching your filters.
              </div>
            )}

            <div className="button-container text-center mt-4">
              {visibleCount < filteredCourses.length && (
                <Button
                  variant="primary"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  Show More
                </Button>
              )}
              {visibleCount > 6 && filteredCourses.length > 6 && (
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => setVisibleCount(6)}
                >
                  Show Less
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Courses;