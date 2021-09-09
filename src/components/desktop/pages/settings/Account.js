// @flow

import React  from "react";
import { connect } from "react-redux";

import cardStyles from "../../../../css/layout/social/settings/card.css";
import formStyles from "../../../../css/form.css";
import layoutStyles from "../../../../css/layout.css";

import KeyIcon from "../../../../assets/svg/icons/key.svg";
import GnuPGIcon from "../../../../assets/svg/logos/gnupg.svg";

import Storage from "../../layout/parts/settings/account/Storage";
import TwoFactorEmail from "../../layout/parts/settings/twofactor/TwoFactorEmail";
import ChangeOrCurrentAccount from "../../layout/parts/settings/account/ChangeOrCurrentAccount";
import ConfirmEmail from "../../layout/parts/settings/account/ConfirmEmail";

import {AccountProvider} from "../../layout/parts/settings/account/context";

function Account(props) {

  if(props.auth.user === null){
    return null;
  }

  return (
      <AccountProvider>
        <div>
          <h3>Account</h3>
          <div className={layoutStyles.tbRowM + " " + layoutStyles.mB1}>
            <div className={layoutStyles.tbCol12}>
              <div className={cardStyles.card}>
                <div className={cardStyles.cardBody}>
                  <ChangeOrCurrentAccount username={props.auth.user.info.username}
                                          email={(props.auth.user.email === null ? "" : props.auth.user.email)} />
                  {props.auth.user.confirm_email !== null && <hr />}
                  <ConfirmEmail />
                  <hr />
                  <Storage />
                  <hr />
                  <div className={layoutStyles.tbRowM + " " + layoutStyles.mB1 + " " + layoutStyles.mT1}>
                    <div className={layoutStyles.tbCol12}>
                      <h4 className={layoutStyles.mN}>Two Factor Options</h4>
                      <div className={cardStyles.card + " " + layoutStyles.mT1}>
                        <TwoFactorEmail />
                        <div className={cardStyles.cardFooter}>
                          <div className={layoutStyles.mR1}>
                            <GnuPGIcon width="35" />
                          </div>
                          <div>
                            <h4 className={layoutStyles.mN}>PGP Key</h4>
                            {/*Enter your PGP key and decrypt a code..*/}
                            <p className={formStyles.small + " " + formStyles.muted}>
                              * Coming soon
                            </p>
                          </div>
                          <button className={formStyles.button + " " + layoutStyles.mL} disabled={true}>Select</button>
                        </div>
                        <div className={cardStyles.cardFooter}>
                          <div className={layoutStyles.mR1}>
                            <KeyIcon width="35" />
                          </div>
                          <div>
                            <h4 className={layoutStyles.mN}>FreeOPT Authenticator</h4>
                            {/*Enter a code or scan a QR.*/}
                            <p className={formStyles.small + " " + formStyles.muted}>
                              * Coming soon
                            </p>
                          </div>
                          <button className={formStyles.button + " " + layoutStyles.mL} disabled={true}>Select</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccountProvider>
  );
}

const mapStateToProps = state => {
  const { auth } = state;
  return { auth: auth };
};

export default connect(mapStateToProps)(Account);
