import { useEffect, useState } from "react";
import { Offcanvas, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  removeItemFromCart,
  applyCouponCode,
  checkout,
  closeCart,
} from "../cartSlice";
import { FaTrash } from "react-icons/fa";
import "../styles/Cart.css";
import paymentApi from "../../payment/api/paymentApi";

const Cart = () => {
  const { items, total, discount, finalTotal, isCartOpen, status, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  useEffect(() => {
    if (user && isCartOpen) {
      dispatch(fetchCart(user._id));
    }
  }, [isCartOpen, user, dispatch]);

  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  const handleRemove = (courseId) => {
    if (!courseId || typeof courseId !== "string") {
      console.error("Invalid courseId:", courseId);
      return;
    }
    dispatch(removeItemFromCart(courseId));
  };

  const handleApplyCoupon = () => {
    if (coupon) {
      dispatch(applyCouponCode(coupon)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setShowSuccessModal(true);
          setCoupon("");
          dispatch(fetchCart(user._id));
        }
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await paymentApi.post("/create-payment", {
        amount: finalTotal,
        email: user.email,
      });
      console.log("Payment Response:", response.data);

      const { paymentKey } = response.data;

      // إنشاء Modal محسّن
      const paymentModal = document.createElement("div");
      paymentModal.style.position = "fixed";
      paymentModal.style.top = "0";
      paymentModal.style.left = "0";
      paymentModal.style.width = "100%";
      paymentModal.style.height = "100%";
      paymentModal.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // خلفية أغمق للتباين
      paymentModal.style.zIndex = "1050";
      paymentModal.style.display = "flex";
      paymentModal.style.justifyContent = "center";
      paymentModal.style.alignItems = "center";
      paymentModal.style.transition = "opacity 0.3s ease-in-out"; // تأثير انتقال
      paymentModal.style.opacity = "0"; // للـ animation
      setTimeout(() => (paymentModal.style.opacity = "1"), 10); // تفعيل الظهور

      // حاوية داخلية للـ iframe
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#fff";
      modalContent.style.borderRadius = "15px"; // زوايا دائرية
      modalContent.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)"; // ظل أنيق
      modalContent.style.padding = "20px";
      modalContent.style.width = "90%";
      modalContent.style.maxWidth = "600px";
      modalContent.style.position = "relative";
      modalContent.style.overflow = "hidden";

      // عنوان للـ Modal
      const modalTitle = document.createElement("h5");
      modalTitle.innerText = "Complete Your Payment";
      modalTitle.style.margin = "0 0 15px 0";
      modalTitle.style.textAlign = "center";
      modalTitle.style.color = "#333";
      modalTitle.style.fontWeight = "bold";

      // الـ iframe
      const iframe = document.createElement("iframe");
      iframe.src = `https://accept.paymob.com/api/acceptance/iframes/908586?payment_token=${paymentKey}`;
      iframe.style.width = "100%";
      iframe.style.height = "450px"; // ارتفاع ثابت للتناسق
      iframe.style.border = "none";
      iframe.style.borderRadius = "10px"; // زوايا دائرية للـ iframe
      iframe.style.backgroundColor = "white";

      // زر إغلاق محسّن
      const closeButton = document.createElement("button");
      closeButton.innerText = "✖";
      closeButton.style.position = "absolute";
      closeButton.style.top = "10px";
      closeButton.style.right = "10px";
      closeButton.style.width = "30px";
      closeButton.style.height = "30px";
      closeButton.style.backgroundColor = "#dc3545";
      closeButton.style.color = "white";
      closeButton.style.border = "none";
      closeButton.style.borderRadius = "50%"; // شكل دائري
      closeButton.style.fontSize = "16px";
      closeButton.style.cursor = "pointer";
      closeButton.style.display = "flex";
      closeButton.style.alignItems = "center";
      closeButton.style.justifyContent = "center";
      closeButton.style.transition = "background-color 0.2s"; // تأثير عند الـ hover
      closeButton.onmouseover = () => (closeButton.style.backgroundColor = "#c82333");
      closeButton.onmouseout = () => (closeButton.style.backgroundColor = "#dc3545");
      closeButton.onclick = () => {
        paymentModal.style.opacity = "0"; // تأثير اختفاء
        setTimeout(() => document.body.removeChild(paymentModal), 300);
      };

      // تجميع العناصر
      modalContent.appendChild(modalTitle);
      modalContent.appendChild(iframe);
      modalContent.appendChild(closeButton);
      paymentModal.appendChild(modalContent);
      document.body.appendChild(paymentModal);

      // التحقق من الدفع عبر postMessage (اختياري)
      window.addEventListener("message", (event) => {
        if (event.origin === "https://accept.paymob.com") {
          const paymentData = event.data;
          console.log("Payment Data from iframe:", paymentData);
          if (paymentData.success) {
            paymentModal.style.opacity = "0";
            setTimeout(() => document.body.removeChild(paymentModal), 300);
            setShowPaymentSuccessModal(true);
            dispatch(checkout()).then((result) => {
              if (result.meta.requestStatus === "fulfilled") {
                dispatch(closeCart());
              }
            });
          } else {
            paymentModal.style.opacity = "0";
            setTimeout(() => document.body.removeChild(paymentModal), 300);
            setShowErrorModal(true);
            dispatch({ type: "cart/setError", payload: "Payment failed" });
          }
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.error || error.response?.data?.message || "An error occurred during checkout";
      setShowErrorModal(true);
      console.error("Checkout Error:", error.response ? error.response.data : error.message);
      dispatch({ type: "cart/setError", payload: errorMessage });
    }
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleClosePaymentSuccessModal = () => setShowPaymentSuccessModal(false);

  return (
    <>
      <Offcanvas
        show={isCartOpen}
        onHide={() => dispatch(closeCart())}
        placement="end"
        className="cart-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart ({items.length} items)</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {status === "loading" && (
            <div className="text-center">
              <Spinner />
            </div>
          )}
          {items.length === 0 ? (
            <div className="text-center">Your cart is empty</div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item, index) => (
                  <div
                    key={item.courseId._id || index}
                    className="cart-item d-flex align-items-center mb-3"
                  >
                    <img
                      src={
                        item.courseId.featuredImage ||
                        "https://via.placeholder.com/50"
                      }
                      alt={item.courseId.title}
                      className="cart-item-image me-3"
                    />
                    <div className="flex-grow-1">
                      <h6>{item.courseId.title}</h6>
                      <p>${item.courseId.price}</p>
                    </div>
                    <Button
                      variant="link"
                      className="text-danger"
                      onClick={() => handleRemove(item.courseId._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="cart-summary mt-4">
                <p>Total: ${total.toFixed(2)}</p>
                {discount > 0 && (
                  <>
                    <p>Discount: {discount}%</p>
                    <p>Final Total: ${finalTotal.toFixed(2)}</p>
                  </>
                )}
              </div>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <Button
                  variant="outline-primary"
                  className="mt-2 w-100"
                  onClick={handleApplyCoupon}
                  disabled={!coupon || status === "loading"}
                >
                  Apply Coupon
                </Button>
              </Form.Group>

              <Button
                variant="primary"
                className="w-100"
                onClick={handleCheckout}
                disabled={status === "loading" || items.length === 0}
              >
                Checkout
              </Button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--mainColor)" }}>
            Success
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Coupon applied successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "red" }}>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error || "An error occurred during checkout"}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPaymentSuccessModal}
        onHide={handleClosePaymentSuccessModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--mainColor)" }}>
            Payment Successful
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Your payment has been processed successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;