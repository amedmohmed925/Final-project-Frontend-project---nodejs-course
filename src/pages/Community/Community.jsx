import { useState, useEffect } from "react";
import { FaHeart, FaComment, FaShare, FaPlus, FaUsers, FaBell, FaChartBar, FaPaperPlane } from "react-icons/fa";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import {
  getPosts, createPost, likePost, getComments, createComment,
  getGroups, createGroup, acceptGroupInvite, sendGroupMessage,
  getChatRooms, createChatRoom, getNotifications, getActivityStats
} from "../../api/communityApi";
import "../../styles/Community.css";
import HeaderPages from "../../components/HeaderPages";

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
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const [postsData, groupsData, chatRoomsData, notificationsData, statsData] = await Promise.all([
          getPosts(),
          getGroups(),
          getChatRooms(),
          getNotifications(),
          getActivityStats(),
        ]);
        
        setPosts(postsData);
        setGroups(groupsData);
        setChatRooms(chatRoomsData);
        setNotifications(notificationsData);
        setStats(statsData);

        const commentCounts = await Promise.all(
          postsData.map(async (post) => {
            const comments = await getComments(post._id);
            return { postId: post._id, count: comments.length };
          })
        );
        
        setComments((prev) => {
          const updatedComments = { ...prev };
          commentCounts.forEach(({ postId, count }) => {
            updatedComments[postId] = updatedComments[postId] || { length: count };
          });
          return updatedComments;
        });

        chatRoomsData.forEach((room) => joinChatRoom(room._id));
        groupsData.forEach((group) => joinGroupChat(group._id));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    initialFetch();

    const updateStats = async () => {
      const statsData = await getActivityStats();
      setStats(statsData);
    };
    updateStats();
    const statsInterval = setInterval(updateStats, 60000); // تحديث كل دقيقة

    socket.on("newMessage", ({ roomId, message }) => {
      if (roomId === "liveChat") {
        setLiveChatMessages((prev) => [...prev, message]);
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

    const cleanOldMessages = () => {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      setLiveChatMessages((prev) => prev.filter((msg) => msg.timestamp > sevenDaysAgo));
    };
    cleanOldMessages();
    const cleanInterval = setInterval(cleanOldMessages, 3600000); // تنظيف كل ساعة

    return () => {
      clearInterval(statsInterval);
      clearInterval(cleanInterval);
      socket.off("newMessage");
      socket.off("roomParticipants");
      socket.off("joinedRoom");
    };
  }, []);

  const fetchComments = async (postId) => {
    const data = await getComments(postId);
    setComments((prev) => ({ ...prev, [postId]: data }));
    setShowComments((prev) => ({ ...prev, [postId]: true }));
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
    const newPostData = await createPost(newPost);
    setPosts((prev) => [newPostData, ...prev]);
    setNewPost({ content: "", type: "post" });
  };

  const handleLike = async (postId) => {
    const updatedPost = await likePost(postId);
    setPosts((prev) => prev.map((post) => (post._id === postId ? updatedPost : post)));
  };

  const handleCommentSubmit = async (postId, content, e) => {
    if (!content.trim()) return;
    const newComment = await createComment({ postId, content });
    setComments((prev) => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])],
    }));
    e.target.value = "";
  };

  const handleLiveChatSubmit = () => {
    if (!liveChatInput.trim()) return;
    const message = {
      roomId: "liveChat",
      userId: user._id,
      content: liveChatInput,
      username: user.username,
      profileImage: user.profileImage,
      timestamp: Date.now(),
    };
    socket.emit("sendMessage", message);
    setLiveChatInput("");
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    const group = await createGroup(newGroup);
    setGroups((prev) => [...prev, group]);
    setNewGroup({ name: "", description: "", invitedMembers: [] });
    joinGroupChat(group._id);
  };

  const handleAcceptInvite = async (groupId) => {
    const updatedGroup = await acceptGroupInvite(groupId);
    setGroups((prev) => prev.map((group) => (group._id === groupId ? updatedGroup : group)));
    joinGroupChat(groupId);
  };

  const handleGroupMessage = async (groupId, content, e) => {
    if (!content.trim() || !joinedRooms.has(`group_${groupId}`)) return;
    const roomId = `group_${groupId}`;
    const message = { roomId, userId: user._id, content, username: user.username, profileImage: user.profileImage };
    socket.emit("sendMessage", message);
    await sendGroupMessage({ groupId, content });
    e.target.value = "";
  };

  const handleChatRoomSubmit = async (e) => {
    e.preventDefault();
    const room = await createChatRoom({ name: newChatRoom });
    setChatRooms((prev) => [...prev, room]);
    setNewChatRoom("");
    joinChatRoom(room._id);
  };

  const handleSendMessage = (roomId, content, e) => {
    if (!content.trim() || !joinedRooms.has(`chatroom_${roomId}`)) return;
    const fullRoomId = `chatroom_${roomId}`;
    const message = { roomId: fullRoomId, userId: user._id, content, username: user.username, profileImage: user.profileImage };
    socket.emit("sendMessage", message);
    e.target.value = "";
  };

  const joinChatRoom = (roomId) => {
    const fullRoomId = `chatroom_${roomId}`;
    socket.emit("joinRoom", { roomId: fullRoomId });
  };

  const joinGroupChat = (groupId) => {
    const fullRoomId = `group_${groupId}`;
    socket.emit("joinRoom", { roomId: fullRoomId });
  };

  const handleAddMember = async (groupId, userId) => {
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
    const index = parseInt(userId.slice(-2), 16) % colors.length;
    return colors[index];
  };

  return (
    <div>
      <HeaderPages title={"Community"} />

      <div className="community-page">
        <header className="community-header">
          <h1>Course Community</h1>
          <div className="notifications">
            <FaBell />
            <span>{notifications.filter((n) => !n.isRead).length}</span>
          </div>
        </header>

        <div className="community-grid">
          <section className="posts-section">
            <form className="new-post-form" onSubmit={handlePostSubmit}>
              <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} placeholder="What's on your mind?" />
              <select value={newPost.type} onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}>
                <option value="post">Post</option>
                <option value="question">Question</option>
                <option value="resource">Resource</option>
              </select>
              <button type="submit"><FaPlus /> Share</button>
            </form>

            <div className="posts-list">
              {posts.map((post) => (
                <div key={post._id} className={`post-card ${post.isPinned ? "pinned" : ""}`}>
                  <div className="post-header">
                    <img src={post.userId.profileImage || "https://courssat.com/assets/images/home/avatar.png"} alt={post.userId.username} />
                    <div>
                      <span>{post.userId.username}</span>
                      <small>{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                  <p>{post.content}</p>
                  {post.media && <img src={post.media} alt="Media" />}
                  <div className="post-actions">
                    <button onClick={() => handleLike(post._id)}>
                      <FaHeart className={post.likes.includes(user._id) ? "liked" : ""} /> {post.likes.filter(id => id !== null).length}
                    </button>
                    <button onClick={() => toggleComments(post._id)}>
                      <FaComment /> {comments[post._id]?.length || 0}
                    </button>
                    <button><FaShare /></button>
                  </div>
                  {showComments[post._id] && (
                    <div className="comments-section">
                      {comments[post._id]?.map((comment) => (
                        <div
                          key={comment._id}
                          className="comment"
                          style={{ backgroundColor: getUserColor(comment.userId._id) }}
                        >
                          <img
                            className="comment-avatar"
                            src={comment.userId.profileImage || "https://courssat.com/assets/images/home/avatar.png"}
                            alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
                          />
                          <div>
                            <span>{comment.userId.firstName} {comment.userId.lastName}</span>
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
              ))}
            </div>
          </section>

          <section className="live-chat-section">
            <h2>Live Chat</h2>
            <div className="chat-box">
              {liveChatMessages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  <img src={msg.profileImage || "https://courssat.com/assets/images/home/avatar.png"} alt={msg.username} />
                  <div>
                    <span>{msg.username}</span>
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
              <button onClick={handleLiveChatSubmit}>
                <FaPaperPlane /> Send
              </button>
            </div>
          </section>

          <section className="sidebar">
            <div className="groups-section">
              <h3>Study Groups</h3>
              <form className="new-group-form" onSubmit={handleGroupSubmit}>
                <input value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="Group Name" />
                <textarea value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} placeholder="Description" />
                <input value={newGroup.invitedMembers.join(",")} onChange={(e) => setNewGroup({ ...newGroup, invitedMembers: e.target.value.split(",") })} placeholder="Invite users (comma-separated IDs)" />
                <button type="submit"><FaUsers /> Create</button>
              </form>
              <div className="groups-list">
                {groups.map((group) => (
                  <div key={group._id} className="group-card">
                    <h4>{group.name}</h4>
                    <p>{group.description}</p>
                    <small>{group.members.length} Members</small>
                    {group.pendingInvites.includes(user._id) && (
                      <button onClick={() => handleAcceptInvite(group._id)}>Accept Invite</button>
                    )}
                    {group.creatorId.toString() === user._id && (
                      <button onClick={() => handleAddMember(group._id, "USER_ID_HERE")}>Add Member</button>
                    )}
                    <div className="group-chat">
                      {!joinedRooms.has(`group_${group._id}`) ? (
                        <button onClick={() => joinGroupChat(group._id)}>Join Chat</button>
                      ) : (
                        <>
                          <p className="join-notice">You have joined the chat</p>
                          <div className="chat-box">
                            {roomMessages[`group_${group._id}`]?.map((msg, idx) => (
                              <div key={idx} className="chat-message">
                                <img src={msg.profileImage || "https://courssat.com/assets/images/home/avatar.png"} alt={msg.username} />
                                <div>
                                  <span>{msg.username}</span>
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
                <input value={newChatRoom} onChange={(e) => setNewChatRoom(e.target.value)} placeholder="Chat Room Name" />
                <button type="submit"><FaPlus /> Create</button>
              </form>
              <div className="chatrooms-list">
                {chatRooms.map((room) => (
                  <div key={room._id} className="chatroom-card">
                    <h4>{room.name}</h4>
                    <div className="chatroom-messages">
                      {!joinedRooms.has(`chatroom_${room._id}`) ? (
                        <button onClick={() => joinChatRoom(room._id)}>Join Chat</button>
                      ) : (
                        <>
                          <p className="join-notice">You have joined the chat</p>
                          <div className="chat-box">
                            {roomMessages[`chatroom_${room._id}`]?.map((msg, idx) => (
                              <div key={idx} className="chat-message">
                                <img src={msg.profileImage || "https://courssat.com/assets/images/home/avatar.png"} alt={msg.username} />
                                <div>
                                  <span>{msg.username}</span>
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
              {stats && (
                <ul>
                  <li>Posts: {stats.postsCount}</li>
                  <li>Comments: {stats.commentsCount}</li>
                  <li>Likes Given: {stats.likesGiven}</li>
                  <li>Groups Joined: {stats.groupsJoined}</li>
                  <li>Chat Messages: {stats.chatMessages}</li>
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Community;