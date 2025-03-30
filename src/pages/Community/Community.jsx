import { useState, useEffect } from "react";
import { FaHeart, FaComment, FaShare, FaPlus, FaUsers, FaBell, FaChartBar, FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  getPosts, createPost, likePost, getComments, createComment,
  getGroups, createGroup, acceptGroupInvite, sendGroupMessage,
  getChatRooms, createChatRoom, getNotifications, getActivityStats
} from "../../api/communityApi";
import { getUserById } from "../../api/userApi"; // استيراد getUserById
import "../../styles/Community.css";
import HeaderPages from "../../components/HeaderPages";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const socket = io("http://localhost:8080", {
  reconnection: true,
  reconnectionAttempts: 5,
  auth: { token: localStorage.getItem("accessToken") },
});

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: "", type: "post" });
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", invitedMembers: [] });
  const [chatRooms, setChatRooms] = useState([]);
  const [newChatRoom, setNewChatRoom] = useState("");
  const [liveChatMessages, setLiveChatMessages] = useState([]);
  const [liveChatInput, setLiveChatInput] = useState("");
  const [joinedRooms, setJoinedRooms] = useState(new Set());
  const [roomMessages, setRoomMessages] = useState({});
  const [roomParticipants, setRoomParticipants] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch(); // إضافة useDispatch
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

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const [groupsData, chatRoomsData, notificationsData, statsData] = await Promise.all([
          getGroups(),
          getChatRooms(),
          getNotifications(),
          getActivityStats(),
        ]);

        console.log("Groups fetched:", groupsData);
        console.log("ChatRooms fetched:", chatRoomsData);
        console.log("Notifications fetched:", notificationsData);
        console.log("Stats fetched:", statsData);

        setGroups(groupsData || []);
        setChatRooms(chatRoomsData || []);
        setNotifications(notificationsData || []);
        setStats(statsData);

        if (user) {
          chatRoomsData.forEach((room) => joinChatRoom(room._id));
          groupsData.forEach((group) => joinGroupChat(group._id));
        }
      } catch (error) {
        console.error("Error fetching additional data:", error);
        setGroups([]);
        setChatRooms([]);
        setNotifications([]);
        setStats(null);
      }
    };

    if (user) fetchAdditionalData();
  }, [user]);

  useEffect(() => {
    const updateStats = async () => {
      try {
        const statsData = await getActivityStats();
        setStats(statsData);
      } catch (error) {
        console.error("Error updating stats:", error);
      }
    };

    if (user) {
      updateStats();
      const statsInterval = setInterval(updateStats, 60000);
      return () => clearInterval(statsInterval);
    }
  }, [user]);

  useEffect(() => {
    const cleanOldMessages = () => {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      setLiveChatMessages((prev) => prev.filter((msg) => msg.timestamp > sevenDaysAgo));
    };
    cleanOldMessages();
    const cleanInterval = setInterval(cleanOldMessages, 3600000);

    socket.on("newMessage", async ({ roomId, message }) => {
      console.log("New message received:", message);

      if (roomId === "liveChat") {
        // جلب بيانات اليوزر بناءً على userId
        try {
          const userData = await dispatch(getUserById(message.userId)).unwrap();
          const enrichedMessage = {
            ...message,
            firstName: userData.firstName || "Unknown",
            lastName: userData.lastName || "",
          };
          setLiveChatMessages((prev) => [...prev, enrichedMessage]);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // في حالة الخطأ، نضيف الرسالة بدون اسم كامل كـ fallback
          setLiveChatMessages((prev) => [...prev, { ...message, firstName: "Unknown", lastName: "" }]);
        }
      } else {
        setRoomMessages((prev) => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), message],
        }));
      }
    });

    socket.on("roomParticipants", ({ roomId, participants }) => {
      setRoomParticipants((prev) => ({ ...prev, [roomId]: participants }));
    });

    socket.on("joinedRoom", ({ roomId }) => {
      setJoinedRooms((prev) => new Set(prev).add(roomId));
    });

    return () => {
      clearInterval(cleanInterval);
      socket.off("newMessage");
      socket.off("roomParticipants");
      socket.off("joinedRoom");
    };
  }, [dispatch]);

  const fetchComments = async (postId) => {
    try {
      const data = await getComments(postId);
      setComments((prev) => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }));
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
      setPosts((prev) => prev.map((post) => (post._id === postId ? updatedPost : post)));
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

  const handleLiveChatSubmit = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!liveChatInput.trim()) return;
    const message = {
      roomId: "liveChat",
      userId: user._id,
      content: liveChatInput,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      timestamp: Date.now(),
    };
    socket.emit("sendMessage", message);
    setLiveChatInput("");
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      const group = await createGroup(newGroup);
      setGroups((prev) => [...prev, group]);
      setNewGroup({ name: "", description: "", invitedMembers: [] });
      joinGroupChat(group._id);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleAcceptInvite = async (groupId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      const updatedGroup = await acceptGroupInvite(groupId);
      setGroups((prev) => prev.map((group) => (group._id === groupId ? updatedGroup : group)));
      joinGroupChat(groupId);
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleGroupMessage = async (groupId, content, e) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!content.trim() || !joinedRooms.has(`group_${groupId}`)) return;
    const roomId = `group_${groupId}`;
    const message = {
      roomId,
      userId: user._id,
      content,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
    };
    socket.emit("sendMessage", message);
    await sendGroupMessage({ groupId, content });
    e.target.value = "";
  };

  const handleChatRoomSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      const room = await createChatRoom({ name: newChatRoom });
      setChatRooms((prev) => [...prev, room]);
      setNewChatRoom("");
      joinChatRoom(room._id);
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  const handleSendMessage = (roomId, content, e) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!content.trim() || !joinedRooms.has(`chatroom_${roomId}`)) return;
    const fullRoomId = `chatroom_${roomId}`;
    const message = {
      roomId: fullRoomId,
      userId: user._id,
      content,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
    };
    socket.emit("sendMessage", message);
    e.target.value = "";
  };

  const joinChatRoom = (roomId) => {
    if (!user) return;
    const fullRoomId = `chatroom_${roomId}`;
    socket.emit("joinRoom", { roomId: fullRoomId });
  };

  const joinGroupChat = (groupId) => {
    if (!user) return;
    const fullRoomId = `group_${groupId}`;
    socket.emit("joinRoom", { roomId: fullRoomId });
  };

  const handleAddMember = async (groupId, userId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/groups/addMember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ groupId, userId }),
      });
      const updatedGroup = await response.json();
      setGroups((prev) => prev.map((group) => (group._id === groupId ? updatedGroup : group)));
    } catch (error) {
      console.error("Error adding member:", error);
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

      <div className="community-page">
        <div className="notifications">
          <FaBell />
          <span>{notifications.filter((n) => !n.isRead).length}</span>
        </div>
        <Link className="btn" to={"/chatbot"}>
        ChatBot AI
        </Link>

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
              <button className="btn" type="submit"><FaPlus /> Share</button>
            </form>

            <div className="posts-list">
              {posts.length === 0 ? (
                <p>No posts available.</p>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className={`post-card ${post.isPinned ? "pinned" : ""}`}>
                    <div className="post-header">
                      <img
                        src={post.userId?.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                        alt={`${post.userId?.firstName || "Unknown"} ${post.userId?.lastName || ""}`}
                      />
                      <div>
                        <b>{post.userId?.firstName || "Unknown"} {post.userId?.lastName || ""}</b>
                        <small> {new Date(post.createdAt).toLocaleString()}</small>
                      </div>
                    </div>
                    <p>{post.content}</p>
                    {post.media && <img src={post.media} alt="Media" />}
                    <div className="post-actions">
                      <button className="btn" onClick={() => handleLike(post._id)}>
                        <FaHeart className={user && post.likes.includes(user._id) ? "liked" : ""} />{" "}
                        {post.likes.filter((id) => id !== null).length}
                      </button>
                      <button className="btn" onClick={() => toggleComments(post._id)}>
                        <FaComment /> {comments[post._id]?.length || 0}
                      </button>
                      <button className="btn"><FaShare /></button>
                    </div>
                    {showComments[post._id] && (
                      <div className="comments-section">
                        {(comments[post._id] || []).map((comment) => (
                          <div
                            key={comment._id}
                            className="comment"
                            style={{ backgroundColor: getUserColor(comment.userId?._id) }}
                          >
                            <img
                              className="comment-avatar"
                              src={comment.userId?.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                              alt={`${comment.userId?.firstName || "Unknown"} ${comment.userId?.lastName || ""}`}
                            />
                            <div>
                              <span>{comment.userId?.firstName || "Unknown"} {comment.userId?.lastName || ""}</span>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(post._id, e.target.value, e)}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="live-chat-section">
            <h2>Live Chat</h2>
            <div className="chat-box">
              {liveChatMessages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  <img
                    src={msg.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                    alt={`${msg.firstName || "Unknown"} ${msg.lastName || ""}`}
                  />
                  <div>
                    <span>{msg.firstName || "Unknown"} {msg.lastName || ""}</span>
                    <p>{msg.content}</p>
                    <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                value={liveChatInput}
                onChange={(e) => setLiveChatInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button className="btn" onClick={handleLiveChatSubmit}>
                <FaPaperPlane /> Send
              </button>
            </div>
          </section>

          <section className={`sidebar ${showSidebar ? "active" : ""}`}>
            <div className="groups-section">
              <h3>Study Groups</h3>
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
                <input
                  value={newGroup.invitedMembers.join(",")}
                  onChange={(e) => setNewGroup({ ...newGroup, invitedMembers: e.target.value.split(",") })}
                  placeholder="Invite users (comma-separated IDs)"
                />
                <button className="btn" type="submit"><FaUsers /> Create</button>
              </form>
              <div className="groups-list">
                {groups.map((group) => (
                  <div key={group._id} className="group-card">
                    <h4>{group.name}</h4>
                    <p>{group.description}</p>
                    <small>{group.members.length} Members</small>
                    {user && group.pendingInvites.includes(user._id) && (
                      <button className="btn" onClick={() => handleAcceptInvite(group._id)}>Accept Invite</button>
                    )}
                    {user && group.creatorId.toString() === user._id && (
                      <button className="btn" onClick={() => handleAddMember(group._id, "USER_ID_HERE")}>Add Member</button>
                    )}
                    <div className="group-chat">
                      {!joinedRooms.has(`group_${group._id}`) ? (
                        <button className="btn" onClick={() => joinGroupChat(group._id)} disabled={!user}>Join Chat</button>
                      ) : (
                        <>
                          <p className="join-notice">You have joined the chat</p>
                          <div className="chat-box">
                            {roomMessages[`group_${group._id}`]?.map((msg, idx) => (
                              <div key={idx} className="chat-message">
                                <img
                                  src={msg.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                                  alt={`${msg.firstName || "Unknown"} ${msg.lastName || ""}`}
                                />
                                <div>
                                  <span>{msg.firstName || "Unknown"} {msg.lastName || ""}</span>
                                  <p>{msg.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Chat in group..."
                            onKeyPress={(e) => e.key === "Enter" && handleGroupMessage(group._id, e.target.value, e)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chatrooms-section">
              <h3>Live Chat Rooms</h3>
              <form className="new-chatroom-form" onSubmit={handleChatRoomSubmit}>
                <input
                  value={newChatRoom}
                  onChange={(e) => setNewChatRoom(e.target.value)}
                  placeholder="Chat Room Name"
                />
                <button className="btn" type="submit"><FaPlus /> Create</button>
              </form>
              <div className="chatrooms-list">
                {chatRooms.map((room) => (
                  <div key={room._id} className="chatroom-card">
                    <h4>{room.name}</h4>
                    <div className="chatroom-messages">
                      {!joinedRooms.has(`chatroom_${room._id}`) ? (
                        <button className="btn" onClick={() => joinChatRoom(room._id)} disabled={!user}>Join Chat</button>
                      ) : (
                        <>
                          <p className="join-notice">You have joined the chat</p>
                          <div className="chat-box">
                            {roomMessages[`chatroom_${room._id}`]?.map((msg, idx) => (
                              <div key={idx} className="chat-message">
                                <img
                                  src={msg.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                                  alt={`${msg.firstName || "Unknown"} ${msg.lastName || ""}`}
                                />
                                <div>
                                  <span>{msg.firstName || "Unknown"} {msg.lastName || ""}</span>
                                  <p>{msg.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Message..."
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(room._id, e.target.value, e)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stats-section">
              <h3><FaChartBar /> Your Activity</h3>
              {user && stats ? (
                <ul>
                  <li>Posts: {stats.postsCount}</li>
                  <li>Comments: {stats.commentsCount}</li>
                  <li>Likes Given: {stats.likesGiven}</li>
                  <li>Groups Joined: {stats.groupsJoined}</li>
                  <li>Chat Messages: {stats.chatMessages}</li>
                </ul>
              ) : (
                <p>Please log in to see your activity stats.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
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