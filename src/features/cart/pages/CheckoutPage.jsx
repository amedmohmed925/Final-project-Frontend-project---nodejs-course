import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Button, Form, Card, Row, Col, Alert, Image } from "react-bootstrap";
import { applyCouponCode, checkout } from "../cartSlice";
import paymobLogo from "../../../../public/paymobLogo.png";
import paypalLogo from "../../../../public/paypal.svg";
import paymentApi from "../../payment/api/paymentApi";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { items, total, discount, finalTotal, status, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [coupon, setCoupon] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApplyCoupon = () => {
    if (coupon) {
      dispatch(applyCouponCode(coupon)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setShowSuccess(true);
          setCoupon("");
        }
      });
    }
  };


  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleCheckout = async () => {
    try {
      const response = await paymentApi.post("/create-payment", {
        amount: finalTotal,
        email: user.email,
      });
      const { paymentKey } = response.data;

      // إنشاء Modal الدفع
      const paymentModal = document.createElement("div");
      paymentModal.style.position = "fixed";
      paymentModal.style.top = "0";
      paymentModal.style.left = "0";
      paymentModal.style.width = "100%";
      paymentModal.style.height = "100%";
      paymentModal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      paymentModal.style.zIndex = "1050";
      paymentModal.style.display = "flex";
      paymentModal.style.justifyContent = "center";
      paymentModal.style.alignItems = "center";
      paymentModal.style.transition = "opacity 0.3s ease-in-out";
      paymentModal.style.opacity = "0";
      setTimeout(() => (paymentModal.style.opacity = "1"), 10);

      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#fff";
      modalContent.style.borderRadius = "15px";
      modalContent.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
      modalContent.style.padding = "20px";
      modalContent.style.width = "90%";
      modalContent.style.maxWidth = "600px";
      modalContent.style.position = "relative";
      modalContent.style.overflow = "hidden";

      const modalTitle = document.createElement("h5");
      modalTitle.innerText = "Complete Your Payment";
      modalTitle.style.margin = "0 0 15px 0";
      modalTitle.style.textAlign = "center";
      modalTitle.style.color = "#333";
      modalTitle.style.fontWeight = "bold";

      const iframe = document.createElement("iframe");
      iframe.src = `https://accept.paymob.com/api/acceptance/iframes/908586?payment_token=${paymentKey}`;
      iframe.style.width = "100%";
      iframe.style.height = "450px";
      iframe.style.border = "none";
      iframe.style.borderRadius = "10px";
      iframe.style.backgroundColor = "white";

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
      closeButton.style.borderRadius = "50%";
      closeButton.style.fontSize = "16px";
      closeButton.style.cursor = "pointer";
      closeButton.style.display = "flex";
      closeButton.style.alignItems = "center";
      closeButton.style.justifyContent = "center";
      closeButton.style.transition = "background-color 0.2s";
      closeButton.onmouseover = () => (closeButton.style.backgroundColor = "#c82333");
      closeButton.onmouseout = () => (closeButton.style.backgroundColor = "#dc3545");
      closeButton.onclick = () => {
        paymentModal.style.opacity = "0";
        setTimeout(() => document.body.removeChild(paymentModal), 300);
      };

      modalContent.appendChild(modalTitle);
      modalContent.appendChild(iframe);
      modalContent.appendChild(closeButton);
      paymentModal.appendChild(modalContent);
      document.body.appendChild(paymentModal);

      window.addEventListener("message", (event) => {
        if (event.origin === "https://accept.paymob.com") {
          const paymentData = event.data;
          if (paymentData.success) {
            paymentModal.style.opacity = "0";
            setTimeout(() => document.body.removeChild(paymentModal), 300);
            setShowPaymentSuccessModal(true);
            dispatch(checkout());
          } else {
            paymentModal.style.opacity = "0";
            setTimeout(() => document.body.removeChild(paymentModal), 300);
            setShowErrorModal(true);
          }
        }
      });
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {showSuccess && <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>Coupon applied successfully!</Alert>}
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Courses in your cart</Card.Header>
            <Card.Body>
              {items.length === 0 ? (
                <div>Your cart is empty.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {items.map((item) => (
                    <li key={item.courseId._id} className="list-group-item d-flex align-items-center">
                      <img
                        src={item.courseId.featuredImage || "https://via.placeholder.com/50"}
                        alt={item.courseId.title}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8, marginRight: 16 }}
                      />
                      <div className="flex-grow-1">
                        <div>{item.courseId.title}</div>
                        <div className="text-muted">${item.courseId.price}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Order Summary</Card.Header>
            <Card.Body>
              <div className="mb-2">Total: <b>${total.toFixed(2)}</b></div>
              {discount > 0 && <div className="mb-2">Discount: <b>{discount}%</b></div>}
              <div className="mb-2">Final Total: <b>${finalTotal.toFixed(2)}</b></div>
              <Form.Group className="mb-3">
                <Form.Label>Apply Coupon</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button
                    variant="outline-primary"
                    className="ms-2"
                    onClick={handleApplyCoupon}
                    disabled={!coupon || status === "loading"}
                  >
                    Apply
                  </Button>
                </div>
              </Form.Group>
              <div className="mb-3">
                <div className="mb-2">Payment Methods</div>
                <div className="d-flex align-items-center gap-3">
                  <Button variant="outline-success" className="d-flex align-items-center" onClick={handleCheckout} disabled={items.length === 0 || status === "loading"}>
                    <Image src={paymobLogo} alt="Paymob" style={{ width: 32, height: 32, marginRight: 8 }} />
                    Pay with Paymob
                  </Button>
                  <Button variant="outline-secondary" className="d-flex align-items-center" disabled>
                    <Image src={paypalLogo} alt="PayPal" style={{ width: 32, height: 32, marginRight: 8, opacity: 0.5 }} />
                    PayPal (Coming Soon)
                  </Button>
                </div>
              </div>
      {/* Modals for payment result */}
      <Alert show={showPaymentSuccessModal} variant="success" onClose={() => setShowPaymentSuccessModal(false)} dismissible style={{ position: 'fixed', top: 80, right: 20, zIndex: 2000 }}>
        Payment Successful! Your payment has been processed successfully.
      </Alert>
      <Alert show={showErrorModal} variant="danger" onClose={() => setShowErrorModal(false)} dismissible style={{ position: 'fixed', top: 140, right: 20, zIndex: 2000 }}>
        Payment failed or was cancelled. Please try again.
      </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
