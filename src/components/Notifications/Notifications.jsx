import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBell, FaTimes } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { getUserNotifications, markNotificationAsRead, deleteNotification } from "../../api/notificationApi";
import { setNotifications, markAsRead, deleteNotification as deleteNotificationAction, toggleNotifications } from "../../features/notifications/notificationSlice";
import { CSSTransition } from "react-transition-group";
import "../../styles/Notifications.css";

const Notifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { notifications, unreadCount, isOpen } = useSelector((state) => state.notifications);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications();
        dispatch(setNotifications(data));
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [dispatch, user]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      dispatch(markAsRead(notificationId));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      dispatch(deleteNotificationAction(notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div className="notifications-container">
      <div
        className="notifications-icon"
        onClick={() => dispatch(toggleNotifications())}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {unreadCount}
          </span>
        )}
      </div>

      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="notifications"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div className="notifications-overlay" ref={nodeRef}>
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h4>Notifications</h4>
              <button
                className="close-dropdown-button"
                onClick={() => dispatch(toggleNotifications())}
              >
                <FaTimes />
              </button>
            </div>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.isRead ? "read" : "unread"}`}
                >
                  <div
                    onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                    className="notification-content"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>{notification.title}</h5>
                      <button
                        className="close-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification._id);
                        }}
                      >
                        <IoCloseSharp />
                      </button>
                    </div>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-notifications">No notifications yet</p>
            )}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Notifications;