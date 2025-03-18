import { useState, useEffect } from "react";
import { FaHeart, FaComment, FaShare, FaPlus, FaUsers, FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getPosts, createPost, likePost, getComments, createComment, getGroups, createGroup, getNotifications } from "../../api/communityApi";
import "../../styles/Community.css";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: "", type: "post" });
  const [comments, setComments] = useState({});
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchPosts();
    fetchGroups();
    fetchNotifications();
  }, []);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  const fetchComments = async (postId) => {
    const data = await getComments(postId);
    setComments((prev) => ({ ...prev, [postId]: data }));
  };

  const fetchGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    await createPost(newPost);
    setNewPost({ content: "", type: "post" });
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await likePost(postId);
    fetchPosts();
  };

  const handleCommentSubmit = async (postId, content) => {
    await createComment({ postId, content });
    fetchComments(postId);
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    await createGroup(newGroup);
    setNewGroup({ name: "", description: "" });
    fetchGroups();
  };

  return (
    <div className="community-page">
      <header className="community-header">
        <h1>Course Community</h1>
        <div className="notifications">
          <FaBell />
          <span>{notifications.filter(n => !n.isRead).length}</span>
        </div>
      </header>

      <div className="community-grid">
        <section className="posts-section">
          <form className="new-post-form" onSubmit={handlePostSubmit}>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="What's on your mind?"
            />
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
            >
              <option value="post">Post</option>
              <option value="question">Question</option>
              <option value="resource">Resource</option>
            </select>
            <button type="submit"><FaPlus /> Share</button>
          </form>

          <div className="posts-list">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <img src={"https://courssat.com/assets/images/home/avatar.png"} alt={post.userId.username} />
                  <div>
                    <span>{post.userId.username}</span>
                    <small className="mx-3">{new Date(post.createdAt).toLocaleString()}</small>
                  </div>
                </div>
                <p>{post.content}</p>
                {post.media && <img src={post.media} alt="Media" />}
                <div className="post-actions">
                  <button onClick={() => handleLike(post._id)}>
                    <FaHeart className={post.likes.includes(user._id) ? "liked" : ""} />
                    {post.likes.length}
                  </button>
                  <button onClick={() => fetchComments(post._id)}>
                    <FaComment /> {comments[post._id]?.length || 0}
                  </button>
                  <button><FaShare /></button>
                </div>
                {comments[post._id] && (
                  <div className="comments-section">
                    {comments[post._id].map((comment) => (
                      <div key={comment._id} className="comment">
                        <span>{comment.userId.username}: </span>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(post._id, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="groups-section">
          <h3>Your Groups</h3>
          <form className="new-group-form" onSubmit={handleGroupSubmit}>
            <input
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              placeholder="Group Name"
            />
            <textarea
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              placeholder="Description"
            />
            <button type="submit"><FaUsers /> Create Group</button>
          </form>
          <div className="groups-list">
            {groups.map((group) => (
              <div key={group._id} className="group-card">
                <h4>{group.name}</h4>
                <p>{group.description}</p>
                <small>{group.members.length} Members</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Community;