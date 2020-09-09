import React, { ReactElement, useState } from 'react'

import { IonPage, IonIcon, IonContent, IonButton, IonInput, IonList, IonText, IonItem, IonLabel } from '@ionic/react';
import { RootState, ThunkDispatchType, actions, Toast, HomeTemplate, RoomTemplate, TaskTemplate, Home } from '../store';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import Toolbar from '../components/common/Toolbar';
import classes from './AddHome.module.css';
import { qrCode, addOutline } from 'ionicons/icons';
import { act } from 'react-dom/test-utils';

interface ReduxStateProps {
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  sendToast: (toast: Toast) => Promise<void>;
  saveHome: (house: Home) => Promise<void>
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  sendToast: actions.flags.sendToast,
  saveHome: actions.homes.saveHome
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

const AddHome = ({ saveHome, sendToast }: Props): ReactElement => {

  const [phase, setPhase] = useState(0);
  const [house, setHouse] = useState({...HomeTemplate});

  const renderPhaseZero = (): ReactElement => (
    <div className={classes.pageContainer}>
      <div className={classes.phaseOneContainer}>
        <div className={classes.section}>
          <IonIcon icon={addOutline} color="primary" className={classes.icon}/>
          <div>
            <IonButton className={classes.bigButton} onClick={() => setPhase(1)}>Create A New Home</IonButton>
          </div>
        </div>
        <div className={classes.section}> 
          <IonIcon icon={qrCode} color="primary" className={classes.icon}/>
          <div>
            <IonButton className={classes.bigButton}>Join A Home</IonButton>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPhaseOne = (): ReactElement => (
    <div>
      <IonItem lines="none">
       <IonInput placeholder="House Name" slot="start" onIonChange={e => setHouse({...house, name: e.detail.value!})}/>
      </IonItem>

      <IonList>
        {Object.keys(house.rooms).map((roomID) => {
          const room = house.rooms[roomID]
          return (
            <div className={classes.roomContainer} key={`room-${roomID}`}>
              <IonItem lines="full">
                <IonLabel position="floating">Room Name</IonLabel>
                <IonInput value={room.name}
                onIonChange={(e) => setHouse({...house, rooms: {...house.rooms, [room.id]: {...room, name: e.detail.value!}}})}
                />
              </IonItem>
              <IonList>
                {Object.keys(room.tasks).map((taskID) => {
                  const task = room.tasks[taskID];
                  return (
                    <IonItem key={`task-${task.id}`} lines="full">
                      <IonInput placeholder="Task Name" value={task.name} slot="start"
                      onIonChange={(e) => setHouse({...house, rooms: {...house.rooms, [room.id]: {...room, tasks: {...room.tasks, [task.id]: {...task, name: e.detail.value! }}}}})}/>
                      <IonInput type="number" placeholder="days" slot="end"
                      onIonChange={(e) => setHouse({...house, rooms: {...house.rooms, [room.id]: {...room, tasks: {...room.tasks, [task.id]: {...task, cleanInterval: Number(e.detail.value!) }}}}})}/>
                    </IonItem>
                  )
                })}
              </IonList>

              <IonButton className={classes.button} onClick={() => setHouse({...house, rooms: {...house.rooms, [roomID]: {...room, tasks: {...room.tasks, [Object.keys(room.tasks).length]: {...TaskTemplate, id: Object.keys(room.tasks).length}}}}})}>
                add Task +
              </IonButton>
            </div>
          )
        })}
      </IonList>
      <IonButton className={classes.button} onClick={() => setHouse({...house, rooms: {...house.rooms, [Object.keys(house.rooms).length]: {...RoomTemplate, id: Object.keys(house.rooms).length}}})}>
         Add Room
      </IonButton>
    </div>
  )

    
  return (
    <IonPage>
      <Toolbar back rightButtons={
        <IonButton routerLink="/" routerDirection="back"
          onClick={() => {
            saveHome(house)
            sendToast({message: 'Home Saved', open: true, color: 'primary'})
        }}>
          Save
        </IonButton>}
      />
        <IonContent>
          {phase === 0 && renderPhaseZero()}
          {phase === 1 && renderPhaseOne()}
        </IonContent>
    </IonPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHome);