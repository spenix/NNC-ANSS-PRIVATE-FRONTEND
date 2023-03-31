import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { adjustItemQty, loadCurrentItem, removeFromCart } from '../../../redux/ecommerce/ecommerceActions';

import { Button, Row, Col, Divider, Tag, InputNumber, Empty } from "antd";
import { Buy } from "react-iconly";

import EmptyImage from '../../../assets/images/apps/ecommerce/checkout-empty.svg';
import Avatar from "antd/lib/avatar/avatar";

export default function HeaderCart() {
  // Basket Dropdwon
  const dispatch = useDispatch()
  const cart = useSelector(state => state.ecommerce.cart)
  const [totalItem, setTotalItem] = useState(0);

  useEffect(() => {
    let items = 0;

    cart.forEach((item) => {
      items += item.qty;
    });

    setTotalItem(items);
  }, [cart, totalItem, setTotalItem]);

  // Basket Qty
  const onChangeHandler = (e, id) => {
    dispatch(adjustItemQty(id, e))
  };

  // Remove Cart
  const [removeClass, setRemoveClass] = useState("")

  const handleClick = () => {
    setRemoveClass("remove-cart");

    setTimeout(() => {
      setRemoveClass("");
    }, 200);
  }

  return (
    <Col className="hp-d-flex-center hp-mr-4 hp-basket-dropdown-button">
      <Button
        type="text"
        icon={
          <Buy
            set="curved"
            className="hp-text-color-black-60"
          />
        }
      />

      <div className={`hp-basket-dropdown ${removeClass}`}>
        <Row gutter={[8, 8]} align="middle" justify="space-between" style={{ height: 64 }}>
          <Col>
            <h5 className="hp-mb-0 hp-text-color-dark-15">My Cart</h5>
          </Col>

          {
            cart.length !== 0 && (
              <Col>
                <Tag className="hp-mr-0 hp-border-none hp-bg-color-primary-4 hp-text-color-primary-1">
                  {totalItem}

                  {cart.length === 1 ? (
                    " Item"
                  ) : (
                    " Items"
                  )}
                </Tag>
              </Col>
            )
          }
        </Row>

        <Divider className="hp-my-4" />

        <div className="hp-basket-dropdown-list">
          {
            cart.length !== 0 ? (
              cart.map((value, index) => (
                <div key={value.id}>
                  <div
                    className="hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 hp-border-radius hp-py-8 hp-px-10 hp-overflow-x-auto"
                    style={{ marginLeft: -10, marginRight: -10 }}
                  >
                    <Row align="middle" justify="space-between" wrap={false}>
                      <Col flex="1 0 0">
                        <Row wrap={false}>
                          <Col flex="0 0 32px" className="hp-mt-4">
                            <Link
                              to={`/apps/ecommerce/product-detail/${value.id}`} onClick={() => dispatch(loadCurrentItem(value))}
                            >
                              <Avatar
                                size={35}
                                src={require(`../../../assets/images/product/${value.imgList}`).default}
                                className="hp-bg-black-0 hp-bg-dark-100"
                              />
                            </Link>
                          </Col>

                          <Col flex="0 0 110px" className="hp-ml-10">
                            <Link
                              to={`/apps/ecommerce/product-detail/${value.id}`} onClick={() => dispatch(loadCurrentItem(value))}
                            >
                              <h5 className="hp-mb-0 hp-font-weight-500 hp-p1-body hp-text-color-black-100 hp-text-color-dark-15">{value.title}</h5>

                              <p className="hp-mb-0 hp-caption hp-text-color-black-60" style={{ marginTop: 1 }}>
                                By <span className="hp-text-color-black-80">{value.person}</span>
                              </p>
                            </Link>
                          </Col>

                          <Col flex="0 0 80px" className="hp-d-flex hp-d-flex-column hp-ml-8">
                            <InputNumber
                              min={1}
                              max={99}
                              value={value.qty}
                              onChange={(e) => onChangeHandler(e, value.id)}
                            />

                            <div
                              className="hp-cursor-pointer hp-d-inline-block hp-mt-4 hp-caption hp-text-color-black-60 hp-text-color-dark-60 hp-text-underline"
                              onClick={() => dispatch(removeFromCart(value.id))}
                            >
                              Remove Item
                            </div>
                          </Col>
                        </Row>
                      </Col>

                      <Col>
                        <p className="hp-basket-dropdown-list-item-price hp-p1-body hp-mb-0 hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-font-weight-500">
                          {
                            value.discount ? (
                              "$" + value.discount
                            ) : (
                              "$" + value.price
                            )
                          }
                        </p>
                      </Col>
                    </Row>
                  </div>

                  {
                    cart.length != (index + 1) && (
                      <Divider className="hp-my-4 hp-bg-color-dark-80" />
                    )
                  }
                </div>
              ))
            ) : (
              <Empty
                image={EmptyImage}
                imageStyle={{
                  height: 100,
                }}
                description={
                  <h5>Your cart is empty</h5>
                }
              />
            )
          }
        </div>

        <Divider className="hp-mt-4 hp-mb-0" />

        <Row gutter={[16]}>
          {
            cart.length !== 0 ? (
              <>
                <Col span={12}>
                  <Link to="/apps/ecommerce/checkout" onClick={handleClick}>
                    <Button block type="text" className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-hover-bg-primary-4">View Cart</Button>
                  </Link>
                </Col>

                <Col span={12}>
                  <Link to="/apps/ecommerce/address-information" onClick={handleClick}>
                    <Button block type="primary">Checkout</Button>
                  </Link>
                </Col>
              </>
            ) : (
              <Col span={24}>
                <Link to="/apps/ecommerce/shop" onClick={handleClick}>
                  <Button block type="primary">Go to shop list</Button>
                </Link>
              </Col>
            )
          }
        </Row>
      </div>
    </Col>
  );
};