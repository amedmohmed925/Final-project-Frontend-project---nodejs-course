import { useState, useEffect } from "react";
import { FaHeart, FaComment, FaShare, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  getPosts,
  createPost,
  likePost,
  getComments,
  createComment,
} from "../../api/communityApi";
import "../../styles/Community.css";
import HeaderPages from "../../components/HeaderPages";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: "", type: "post" });
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});

  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        console.log("Posts fetched:", postsData);
        setPosts(postsData || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (posts.length === 0) return;
      try {
        const commentData = await Promise.all(
          posts.map(async (post) => {
            const commentsData = await getComments(post._id);
            return { postId: post._id, comments: commentsData };
          })
        );

        setComments((prev) => {
          const updatedComments = { ...prev };
          commentData.forEach(({ postId, comments }) => {
            updatedComments[postId] = comments || [];
          });
          return updatedComments;
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [posts]);

  const fetchComments = async (postId) => {
    try {
      const data = await getComments(postId);
      setComments((prev) => ({
        ...prev,
        [postId]: Array.isArray(data) ? data : [],
      }));
      setShowComments((prev) => ({ ...prev, [postId]: true }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleComments = (postId) => {
    if (!comments[postId] || !comments[postId].length) {
      fetchComments(postId);
    } else {
      setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      const newPostData = await createPost(newPost);
      setPosts((prev) => [newPostData, ...prev]);
      setNewPost({ content: "", type: "post" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      const updatedPost = await likePost(postId);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async (postId, content, e) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!content.trim()) return;
    try {
      const newComment = await createComment({ postId, content });
      setComments((prev) => ({
        ...prev,
        [postId]: [newComment, ...(prev[postId] || [])],
      }));
      e.target.value = "";
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const getUserColor = (userId) => {
    const colors = ["#dbeafe", "#e0e7ff", "#fef3c7", "#d1fae5", "#fce7f3"];
    const index = userId ? parseInt(userId.slice(-2), 16) % colors.length : 0;
    return colors[index];
  };

  return (
    <div>
      <HeaderPages title={"Community"} />

      <NavigationBar />
      <div className="community-page ">
    

        <div className="community-grid">
          <section className="posts-section">
            <form className="new-post-form" onSubmit={handlePostSubmit}>
              <textarea
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="What's on your mind?"
              />
              <select
                value={newPost.type}
                onChange={(e) =>
                  setNewPost({ ...newPost, type: e.target.value })
                }
              >
                <option value="post">Post</option>
                <option value="question">Question</option>
                <option value="resource">Resource</option>
              </select>
              <button className="btn" type="submit">
                <FaPlus /> Share
              </button>
            </form>

            <div className="posts-list">
              {posts.length === 0 ? (
                <p>No posts available.</p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className={`post-card ${post.isPinned ? "pinned" : ""}`}
                  >
                    <div className="post-header">
                      <img
                        src={
                          post.userId?.profileImage ||
                          "https://courssat.com/assets/images/home/avatar.png"
                        }
                        alt={`${post.userId?.firstName || "Unknown"} ${
                          post.userId?.lastName || ""
                        }`}
                      />
                      <div>
                        <b>
                          {post.userId?.firstName || "Unknown"}{" "}
                          {post.userId?.lastName || ""}
                        </b>
                        <small>
                          {" "}
                          {new Date(post.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                    <p>{post.content}</p>
                    {post.media && <img src={post.media} alt="Media" />}
                    <div className="post-actions">
                      <button
                        className="btn"
                        onClick={() => handleLike(post._id)}
                      >
                        <FaHeart
                          className={
                            user && post.likes.includes(user._id) ? "liked" : ""
                          }
                        />{" "}
                        {post.likes.filter((id) => id !== null).length}
                      </button>
                      <button
                        className="btn"
                        onClick={() => toggleComments(post._id)}
                      >
                        <FaComment /> {comments[post._id]?.length || 0}
                      </button>
                      <button className="btn">
                        <FaShare />
                      </button>
                    </div>
                    {showComments[post._id] && (
                      <div className="comments-section">
                        {(comments[post._id] || []).map((comment) => (
                          <div
                            key={comment._id}
                            className="comment"
                            style={{
                              backgroundColor: getUserColor(
                                comment.userId?._id
                              ),
                            }}
                          >
                            <img
                              className="comment-avatar"
                              src={
                                comment.userId?.profileImage ||
                                "https://courssat.com/assets/images/home/avatar.png"
                              }
                              alt={`${comment.userId?.firstName || "Unknown"} ${
                                comment.userId?.lastName || ""
                              }`}
                            />
                            <div>
                              <span>
                                {comment.userId?.firstName || "Unknown"}{" "}
                                {comment.userId?.lastName || ""}
                              </span>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleCommentSubmit(post._id, e.target.value, e)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to log in to perform this action.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Community;
