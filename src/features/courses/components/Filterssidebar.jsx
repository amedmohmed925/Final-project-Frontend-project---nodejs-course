import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const FiltersSidebar = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  selectedLevel,
  setSelectedLevel,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  allTags = [],
  selectedTags,
  setSelectedTags,
  onReset
}) => {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleReset = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSelectedLevel("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedTags([]);
    
    // Call the onReset callback if provided
    if (onReset) {
      onReset();
    }
  };

  return (
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

      {/* Reset Button */}
      <div className="mt-3 d-grid">
        <Button 
          variant="outline-secondary" 
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};

export default FiltersSidebar;