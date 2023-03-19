import React from 'react';
import mixpanel from 'mixpanel-browser';

export const MixpanelContext = React.createContext();

export const MixpanelProvider = ({children}) => {
  const [mixpaneldata, setMixpanel] = React.useState(null);

  React.useEffect(() => {
    const initMixpanel = async () => {
      const initializedMixpanel = await mixpanel.init('8e7285fd3f3d7c5623d3cd229203e3ac');
      setMixpanel(initializedMixpanel);
    };

    initMixpanel();
  }, []);

  return <MixpanelContext.Provider value={mixpaneldata}>{children}</MixpanelContext.Provider>;
};