// src/components/Cart.js
import { useEffect, useState } from "react";
import { Offcanvas, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeItemFromCart, applyCouponCode, checkout, closeCart } from "../../features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import "../../styles/Cart.css";

const Cart = () => {
  const { items, total, discount, finalTotal, isCartOpen, status, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (user && isCartOpen) {
      dispatch(fetchCart(user._id)); // تحديث السلة لما تتفتح
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
      dispatch(applyCouponCode(coupon));
      setCoupon("");
    }
  };

  const handleCheckout = () => {
    dispatch(checkout());
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <Offcanvas show={isCartOpen} onHide={() => dispatch(closeCart())} placement="end" className="cart-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart ({items.length} items)</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {status === "loading" && <div><Spinner /></div>}
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
                <Button variant="outline-primary" className="mt-2 w-100" onClick={handleApplyCoupon} disabled={!coupon}>
                  Apply Coupon
                </Button>
              </Form.Group>
              <Button variant="primary" className="w-100" onClick={handleCheckout} disabled={status === "loading"}>
                Checkout
              </Button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showErrorModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error || "An unexpected error occurred."}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;