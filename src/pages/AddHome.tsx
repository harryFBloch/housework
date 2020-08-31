import React, { ReactElement, useState } from 'react'

import { IonPage, IonIcon, IonContent, IonButton, IonInput } from '@ionic/react';
import { RootState, ThunkDispatchType, actions, Toast } from '../store';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import Toolbar from '../components/common/Toolbar';
import classes from './AddHome.module.css';
import { qrCode, addOutline } from 'ionicons/icons';

interface ReduxStateProps {
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  sendToast: (toast: Toast) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  sendToast: actions.flags.sendToast,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

const AddHome = ({}: Props): ReactElement => {

  const [phase, setPhase] = useState(0);

  const renderPhaseZero = (): ReactElement => (
    <div className={classes.pageContainer}>
      <div className={classes.phaseOneContainer}>
        <div className={classes.section}>
          <IonIcon icon={addOutline} color="primary" className={classes.icon}/>
          <div>
            <IonButton className={classes.bigButton}>Start A New Home</IonButton>
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
    <div className={classes.pageContainer}>
      <IonInput placeholder="House Name"/>

    </div>
  )

    
  return (
    <IonPage>
      <Toolbar back/>
        <IonContent>
          {phase === 0 && renderPhaseZero()}
          {phase === 1 && renderPhaseOne()}
        </IonContent>
    </IonPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHome);