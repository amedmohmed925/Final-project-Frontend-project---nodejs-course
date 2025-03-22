import { useEffect, useState } from "react";
import { Offcanvas, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeItemFromCart, applyCouponCode, checkout, closeCart } from "../../features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import "../../styles/Cart.css";

const Cart = () => {
  const { items, total, discount, finalTotal, isCartOpen, status, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false); // مودال نجاح الدفع

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
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.log("Unauthorized. Please log in.");
        return;
      }      
      const response = await axios.post("http://localhost:8080/payment/create-payment", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      }, {
        amount: finalTotal,
        items: items.map((item) => ({
          name: item.courseId.title,
          amount: item.courseId.price * 100,
          quantity: 1,
        })),
        email: user.email, 
      });

      const { paymentKey } = response.data;


      const paymentModal = document.createElement("div");
      paymentModal.style.position = "fixed";
      paymentModal.style.top = "0";
      paymentModal.style.left = "0";
      paymentModal.style.width = "100%";
      paymentModal.style.height = "100%";
      paymentModal.style.backgroundColor = "rgba(0,0,0,0.5)";
      paymentModal.style.zIndex = "1050";
      paymentModal.style.display = "flex";
      paymentModal.style.justifyContent = "center";
      paymentModal.style.alignItems = "center";

      const iframe = document.createElement("iframe");
      iframe.src = `https://accept.paymob.com/api/acceptance/iframes/YOUR_IFRAME_ID?payment_token=${paymentKey}`;
      iframe.style.width = "80%";
      iframe.style.maxWidth = "600px";
      iframe.style.height = "80%";
      iframe.style.maxHeight = "500px";
      iframe.style.border = "none";
      iframe.style.backgroundColor = "white";
      paymentModal.appendChild(iframe);
      document.body.appendChild(paymentModal);

      // إغلاق الـ Modal بعد الدفع (محاكاة نجاح الدفع)
      iframe.onload = () => {
        setTimeout(() => {
          document.body.removeChild(paymentModal);
          setShowPaymentSuccessModal(true);
          dispatch(checkout()); // تفريغ السلة بعد الدفع
          dispatch(closeCart()); // إغلاق الـ Offcanvas
        }, 2000); // تأخير 2 ثانية لمحاكاة نجاح الدفع (بديل لـ Webhook)
      };
    } catch (error) {
      setShowErrorModal(true);
      console.error("Checkout Error:", error);
    }
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleClosePaymentSuccessModal = () => setShowPaymentSuccessModal(false);

  return (
    <>
      <Offcanvas show={isCartOpen} onHide={() => dispatch(closeCart())} placement="end" className="cart-offcanvas">
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
                      src={item.courseId.featuredImage || "https://via.placeholder.com/50"}
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

      {/* مودال نجاح الكوبون */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--mainColor)" }}>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Coupon applied successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال نجاح الدفع */}
      <Modal show={showPaymentSuccessModal} onHide={handleClosePaymentSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "var(--mainColor)" }}>Payment Successful</Modal.Title>
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