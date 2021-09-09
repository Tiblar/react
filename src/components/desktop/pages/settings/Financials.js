// @flow

import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import axios from "axios";

import cardStyles from "../../../../css/layout/social/settings/card.css";
import layoutStyles from "../../../../css/layout.css";
import formStyles from "../../../../css/form.css";
import financialStyles from "../../../../css/layout/social/settings/pages/financials.css";

import NoInvoicesGraphic from "../../../../assets/graphics/billing.svg";
import LoadingGraphic from "../../../../assets/loading/dots.svg";

import FinancialsNav from "../../layout/parts/settings/financials/FinancialsNav";

import {API_URL} from "../../../../util/constants";
import OrderRow from "../../layout/parts/settings/financials/OrderRow";
import OrderModal from "../../layout/parts/settings/financials/OrderModal";

function Financials(props) {
  const [manager, setManager] = useState({
    orders: [],
    offset: 0,
    loading: true,
    error: false,
    type: "outgoing",
    modalOrderId: null,
  });

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const params = {
      offset: manager.offset,
    }

    axios.get(API_URL + `/market/orders/${manager.type}?` + (new URLSearchParams(params).toString()), config)
        .then(function (res) {
          if(res.data && res.data.data.orders){
            setManager(manager => ({
              ...manager,
              loading: false,
              orders: res.data.data.orders,
            }));
          }else{
            setManager(manager => ({
              ...manager,
              orders: [],
              loading: false,
              error: true
            }));
          }
        })
        .catch(function (err) {
          setManager(manager => ({
            ...manager,
            orders: [],
            loading: false,
            error: true
          }));
        });
  }, [manager.offset, manager.type]);

  function setNav(nav) {
    setManager(manager => ({
      ...manager,
      type: nav,
    }));
  }

  function handlePage(offset) {
    setManager(manager => ({
      ...manager,
      offset: manager.offset + offset
    }));
  }

  function setModal(orderId) {
    setManager(manager => ({
      ...manager,
      modalOrderId: orderId,
    }));
  }

  function cancelOrder(cancelId){
    let orders = manager.orders.map(order => {
      if(order.id === cancelId){
        order.active = false;

        let invoices = order.invoices.map(invoice => {
          if(invoice.payment_method){
            invoice.payment_method.cancelled = true;
          }

          return invoice;
        })

        order.invoices = invoices;
      }

      return order;
    });

    setManager(manager => ({
      ...manager,
      orders: orders,
    }))
  }

  function updateOrder(orderId, newOrder){
    let orders = manager.orders.map(order => {
      if(order.id === orderId){
        order = newOrder;
      }

      return order;
    });

    setManager(manager => ({
      ...manager,
      orders: orders,
    }))
  }

  let modalOrder = manager.orders.find(order => order.id === manager.modalOrderId);

  return (
    <div>
      {
        modalOrder &&
        <OrderModal order={modalOrder}
                    updateOrder={updateOrder}
                    cancelOrder={cancelOrder}
                    close={() => { setModal(null) }} />
      }
      <h3>Financials</h3>
      <div className={cardStyles.card}>
        <div className={cardStyles.cardBody}>
          <FinancialsNav type={manager.type} setNav={setNav} />
          {
            manager.orders.length === 0 && !manager.loading &&
            <div>
              <NoInvoicesGraphic />
              <div className={formStyles.alert + ' ' + layoutStyles.mT1}>
                No orders or invoices here.
              </div>
            </div>
          }
          {
            manager.orders.length !== 0 &&
            <div className={financialStyles.table}>
              <div>
                {
                  manager.orders.map(order =>
                      <OrderRow key={order.id} order={order} setModal={setModal} />
                  )
                }
              </div>
            </div>
          }
          <div className={layoutStyles.flex + ' ' + layoutStyles.mT1}>
            {
              manager.offset !== 0 &&
              <button className={formStyles.button + ' ' + layoutStyles.mR1} onClick={() => { handlePage(-10) }}>
                Previous Page
              </button>
            }
            {
              manager.orders.length === 10 &&
              <button className={formStyles.button} onClick={() => { handlePage(10) }}>
                Next Page
              </button>
            }
          </div>
          {
            manager.loading &&
            <div className={layoutStyles.flex + ' ' + layoutStyles.justifyContentCenter}>
              <LoadingGraphic width={100} />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Financials);

