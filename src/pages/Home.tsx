import { IonPage, IonIcon, IonContent, IonButton } from '@ionic/react';
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import firebase from '../config/FirebaseConfig';
import 'firebase/analytics';
import { RootState, ThunkDispatchType, actions, Toast } from '../store';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { addOutline } from 'ionicons/icons';
import Toolbar from '../components/common/Toolbar';
import classes from './Home.module.css';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';

interface ReduxStateProps {
  removeAds: boolean;
  products: IAPProduct[];
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  removeAds: state.flags.removeAds,
  products: state.flags.products,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  sendToast: (toast: Toast) => Promise<void>;
  subscribe: (productID: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  sendToast: actions.flags.sendToast,
  subscribe: actions.flags.subscribe,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

const Home = ({ showInter, removeAds, history, sendToast, products, subscribe}: Props): ReactElement => {

  const listRef = useRef<HTMLIonListElement>(null)

  const closeList = (): void => {
    if (listRef.current) {
      listRef.current.closeSlidingItems()
    }
  }
    
  return (
    <IonPage>
      <Toolbar rightButtons={
        <IonButton routerLink='/addHome' routerDirection="forward">
          <IonIcon icon={addOutline}/>
        </IonButton>}/>
        <IonContent>

          <div className={classes.buttonContainer}>
            {products[0] && !removeAds &&
              <IonButton className={classes.button}
                onClick={() => subscribe(products[0].id)} key={products[0].id} 
                color="primary">
                Click Here to {products[0].title} For Only {products[0].price} a {products[0].billingPeriodUnit}
              </IonButton>
            }
          </div>
          <h1>HOME</h1>
        </IonContent>
    </IonPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
