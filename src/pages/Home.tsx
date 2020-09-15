import { IonPage, IonIcon, IonContent, IonButton, IonList, IonText, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonProgressBar } from '@ionic/react';
import React, { ReactElement, useRef } from 'react';
import { RootState, ThunkDispatchType, actions, Toast, Homes, Task } from '../store';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { addOutline, checkbox } from 'ionicons/icons';
import Toolbar from '../components/common/Toolbar';
import classes from './Home.module.css';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { percentDone, percentDoneInterval } from '../utils/dates';

interface ReduxStateProps {
  removeAds: boolean;
  products: IAPProduct[];
  homes: Homes;
  currentHomeID: string;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  removeAds: state.flags.removeAds,
  products: state.flags.products,
  homes: state.homes.homes,
  currentHomeID: state.homes.currentHome,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  sendToast: (toast: Toast) => Promise<void>;
  subscribe: (productID: string) => Promise<void>;
  completeTask: (task: Task, roomID: string, homeID: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  sendToast: actions.flags.sendToast,
  subscribe: actions.flags.subscribe,
  completeTask: actions.homes.completeTask,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

const Home = ({ showInter, removeAds, history, sendToast, products, subscribe, homes, currentHomeID, completeTask}: Props): ReactElement => {

  const listRef = useRef<HTMLIonListElement>(null)

  const closeList = (): void => {
    if (listRef.current) {
      listRef.current.closeSlidingItems()
    }
  }

  const currentHome = homes[currentHomeID];

  const getBarColor = (percentDone: number): string => {
    if (percentDone < 0.33) {
      return 'primary'
    } else if (percentDone < 0.66) {
      return 'warning'
    } else {
      return 'danger'
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
          { currentHome && 
            <IonList ref={listRef} className={classes.list}>
              {Object.values(currentHome.rooms).map( room => {
                return (
                  <div key={`room-${room.id}`}>
                    <IonText className={classes.roomLabel}>{room.name}</IonText>
                    <div className={classes.roomContainer}>
                      {Object.values(room.tasks).map(task => {
                        const percentDone = percentDoneInterval(task.lastCleaned, task.cleanInterval)
                        const barColor = getBarColor(percentDone)
                        return (
                          <div key={`${room.id}-task-${task.id}`}>
                          <IonItemSliding>
                            <IonItemOptions side="start">
                              <IonItemOption color="primary"
                                onClick={() => {
                                  closeList()
                                  completeTask(task, room.id, currentHome.id)
                                  }}>
                                <IonIcon slot="icon-only" icon={checkbox}/>
                            </IonItemOption>
                          </IonItemOptions>
                            <IonItem lines='none'>
                              <IonLabel slot="start">{task.name}</IonLabel>
                            </IonItem>
                          </IonItemSliding>
                          <IonProgressBar color={barColor}
                          value={percentDoneInterval(task.lastCleaned, task.cleanInterval)}></IonProgressBar><br />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

          </IonList>}
        </IonContent>
    </IonPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
