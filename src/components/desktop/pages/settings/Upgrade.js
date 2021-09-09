// @flow

import React, {useState, useEffect, useRef} from "react";
import {connect} from "react-redux";
import axios from "axios";

import cardStyles from "../../../../css/layout/social/settings/card.css";
import layoutStyles from "../../../../css/layout.css";
import formStyles from "../../../../css/form.css";

import PlebTier from "../../layout/parts/settings/upgrade/PlebTier";
import BoostTier from "../../layout/parts/settings/upgrade/BoostTier";
import Purchased from "../../layout/parts/settings/upgrade/Purchased";
import AdsCard from "../../layout/parts/settings/upgrade/AdsCard";
import BoostTierLoading from "../../layout/parts/settings/upgrade/BoostTierLoading";
import PurchaseModal from "../../layout/parts/billing/modal/PurchaseModal";

import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";
import {API_URL, BOOST_PRODUCT_ID, MAX_MOBILE_WIDTH} from "../../../../util/constants";
import {formatFullDate} from "../../../../util/date";

function Upgrade(props) {
  const {width} = useWindowDimensions();
  const _isMounted = useRef(true);

  const [manager, setManager] = useState({
    slider: 1,
    boost: null,
    boostOrder: null,
    purchaseModal: false,
    loading: true,
    loadingBoosted: true,
    error: false,
  });

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, []);

  useEffect(() => {
    if(manager.loading === false){
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios.get(API_URL + `/market/product/${BOOST_PRODUCT_ID}`, config)
        .then(function (res) {
          if(_isMounted.current && res.data && res.data.data.product){
            setManager((manager) => ({
              ...manager,
              loading: false,
              error: false,
              boost: res.data.data.product
            }));
          }else{
            setManager((manager) => ({
              ...manager,
              loading: false,
              error: true
            }));
          }
        })
        .catch(function (err) {
          setManager((manager) => ({
            ...manager,
            loading: false,
            error: true
          }));
        });

    axios.get(API_URL + `/market/order/boost`, config)
        .then(function (res) {
          if(_isMounted.current && res.data && res.data.data.order){
            setManager((manager) => ({
              ...manager,
              boostOrder: res.data.data.order,
              loadingBoosted: false,
            }));
          }
        })
        .catch(function (err) {
          setManager((manager) => ({
            ...manager,
            boostOrder: null,
            loadingBoosted: false,
          }));
        });
  }, [manager.loading]);

  function setSlider(x){
    setManager((manager) => ({
      ...manager,
      slider: x,
    }));
  }

  function handleUpgrade() {
    setManager((manager) => ({
      ...manager,
      purchaseModal: !manager.purchaseModal,
    }));
  }

  function handleBoostReload() {
    setManager((manager) => ({
      ...manager,
      loading: true,
    }));
  }

  let active = false;

  if(manager.boostOrder  && manager.boostOrder.active){
    active = true;
  }

  return (
    <div>
      {
        manager.purchaseModal && <PurchaseModal product_id={BOOST_PRODUCT_ID}
                                                attributes={{ [manager.boost.attributes[0].id]: manager.slider }}
                                                close={handleUpgrade} />
      }
      <h3>Upgrade</h3>
      <div className={cardStyles.card}>
        <div className={cardStyles.cardBody}>
          <div className={width > MAX_MOBILE_WIDTH ? layoutStyles.tbRowM + ' ' + layoutStyles.mB1 : ''}>
            <div className={width <= MAX_MOBILE_WIDTH ? layoutStyles.tbRowM + ' ' + layoutStyles.mB1 : layoutStyles.tbCol4}>
              <div className={width <= MAX_MOBILE_WIDTH ? layoutStyles.tbCol12 : ''}>
                <PlebTier />
              </div>
            </div>
            <div className={(width <= MAX_MOBILE_WIDTH ? layoutStyles.tbRowM + ' ' + layoutStyles.mB1 : layoutStyles.tbCol8)}>
              <div className={width <= MAX_MOBILE_WIDTH ? layoutStyles.tbCol12 : ''}>
                {
                  (manager.boostOrder && !manager.loadingBoosted && props.auth.user !== null && props.auth.user.boosted) &&
                  <div className={formStyles.alert + ' ' + layoutStyles.mB1}>
                    <p>Your boost runs out on {formatFullDate(manager.boostOrder.expire_timestamp)}.</p>
                  </div>
                }
                {
                  props.auth.user !== null && (props.auth.user.boosted && active) && !manager.modify &&
                  <Purchased />
                }
                {
                  manager.loading && props.auth.user !== null && !props.auth.user.boosted && <BoostTierLoading />
                }
                {
                  ((props.auth.user !== null && manager.boost && (!props.auth.user.boosted || !active))) && !manager.loading &&
                  <BoostTier setSlider={setSlider}
                             slider={manager.slider}
                             base_cost={manager.boost.price}
                             storage_cost={manager.boost.attributes[0].price}
                             handleUpgrade={handleUpgrade}/>
                }
                {
                  (manager.error && !manager.loading) &&
                  <div className={formStyles.alert}>
                    Something went wrong. If this persist contact support.
                    <button className={formStyles.button} onClick={handleBoostReload}>
                      Refresh
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
          <hr />
          <div className={layoutStyles.tbRowM + ' ' + layoutStyles.mT1 + ' ' + layoutStyles.mB1}>
            <div className={layoutStyles.tbCol12}>
              <p>Why isn't your product free?</p>
              <br />
              <p>
                There is no long term viability of free services, just think
                about all the cool services that you've used in the past that
                were shut down, acquired, or screwed over its users (Tumblr,
                MySpace, Vine, VidMe, Flickr, PhotoBucket, Mixtape.moe, etc). I
                charge what it cost to run the site plus a few pennies which
                ensures long term survival.
              </p>
            </div>
          </div>
          <hr />
          <div className={layoutStyles.tbRowM + ' ' + layoutStyles.mT1 + ' ' + layoutStyles.mB1}>
            <AdsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Upgrade);