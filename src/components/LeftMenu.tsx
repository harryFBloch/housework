import React, { ReactElement, useEffect, useState } from 'react';
import { IonMenu, IonToolbar, IonHeader, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonText, IonMenuToggle, IonIcon, IonAlert, IonToast } from '@ionic/react';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css"
import { bindActionCreators } from 'redux';
import { RootState, ThunkDispatchType, actions, Auth, Toast, Homes } from '../store';
import classes from './LeftMenu.module.css';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { logout } from '../store/auth/actions';
import { RouteComponentProps, withRouter } from 'react-router';
import { pencil, qrCode } from 'ionicons/icons';
import QR from './QRCode';

interface ReduxStateProps {
  products: IAPProduct[];
  removeAds: boolean;
  auth: Auth;
  toast: Toast,
  homes: Homes,
  currentHome: string,
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  products: state.flags.products,
  removeAds: state.flags.removeAds,
  auth: state.auth,
  toast: state.flags.toast,
  homes: state.homes.homes,
  currentHome: state.homes.currentHome,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  subscribe: (productID: string) => Promise<void>;
  initializeInter: () => Promise<void>;
  restorePurchase: () => Promise<void>;
  getHomes: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  subscribe: actions.flags.subscribe,
  initializeInter: actions.flags.initializeInter,
  restorePurchase: actions.flags.restorePurchase,
  getHomes: actions.homes.getHomes,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

export const LeftMenu = ({ initializeInter, products, subscribe, removeAds, auth, restorePurchase, toast, getHomes, history, homes, currentHome }: Props): ReactElement => {

  const [alert, setAlert] = useState(false)
  const [textToEncode, setTextToEncode] = useState("");

  const handleInitializeAd = () => {
    initializeInter()
  }

  useEffect(() => {
    if(auth.uid !== '') {
      console.log('start up')
      handleInitializeAd();
      getHomes()
      .then(() => {
        console.log('got homes')
      })
      .catch(() => {
        history.push('/addHome')
      })
    }
  }, [auth.uid])

  useEffect((): void => {
    if (textToEncode) {
      setAlert(true);
    } else {
      setAlert(false);
    }
  }, [textToEncode])

  const handleQRClick = (textToEncode: string): void => {
    setTextToEncode(textToEncode);
  }

  const handleCloseAlert = (): void => {
    setTextToEncode("")
  }

  const renderProducts = (product: IAPProduct): ReactElement => {
    return(
      <IonButton className={classes.productButton} 
        onClick={() => subscribe(product.id)} key={product.id} 
        color="warning">
        Click Here to {products[0].title} For Only {products[0].price} a {products[0].billingPeriodUnit}
      </IonButton>
    )
  }

  const renderHomes = (): ReactElement => {
    return (
    <IonList>
      {Object.keys(homes).map(homeID => {
        const home = homes[homeID]
        return (
          <IonItem lines="none" key={'homes-' + home.id} color={currentHome === home.id ? 'primary' : 'secondary'}>
            <IonLabel slot="start">{home.name}</IonLabel>
            <IonMenuToggle menu="left" slot="end">
            <IonButton  className={classes.iconButton} routerLink={`/addHome/${home.id}`} routerDirection="forward">
              <IonIcon icon={pencil}/>
            </IonButton>

            </IonMenuToggle>
            <IonButton slot="end" className={classes.iconButton}
            onClick={() => handleQRClick(`${auth.uid}-doing_housework-${homeID}`)}
            >
              <IonIcon icon={qrCode}/>
            </IonButton>
          </IonItem>
        )
      }  
      )}
    </IonList>)
  }

  return (
    <IonMenu side="start" menuId="left" contentId='main' color="secondary">
      {alert && <QR handleAlertClose={handleCloseAlert} textToEncode={textToEncode}/>}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Houses</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="secondary">
        {renderHomes()}

        <IonMenuToggle menu="left">
          <IonButton className={classes.productButton} routerLink="/addHome" routerDirection="forward">Add House</IonButton>
        </IonMenuToggle>

        {!removeAds && products[0] && renderProducts(products[0])}
        <IonButton className={classes.productButton} color="warning" onClick={restorePurchase}>Restore Purchases</IonButton>
        <IonButton className={classes.productButton} color="warning" onClick={logout}>Logout</IonButton>
      </IonContent>
      <IonToast isOpen={toast.open} color={toast.color} message={toast.message} position="top"/>
    </IonMenu>
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftMenu));