import _ from 'lodash';

import yaml from 'js-yaml';

import Locations from './locations';
import LogicCalculation from './logic-calculation';
import LogicHelper from './logic-helper';
import LogicLoader from './logic-loader';
import LogicTweaks from './logic-tweaks';
import Macros from './macros';
import Settings from './settings';
import TrackerState from './tracker-state';

export default class TrackerController {
  static async calculateLogic() {
    Settings.initialize({ version: '1.8.0' });

    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();

    _.forEach(itemLocationsFile, (locationData, locationName) => {
      const { generalLocation, detailedLocation } = Locations.splitLocationName(locationName);
      const requirements = LogicHelper.requirementsForLocation(generalLocation, detailedLocation);
      const requirementsString = requirements.reduce({
        andInitialValue: '',
        andReducer: ({
          accumulator, item, isReduced, index
        }) => {
          const itemString = isReduced ? `(${item})` : item;
          if (index === 0) {
            return itemString;
          }
          return `${accumulator} & ${itemString}`;
        },
        orInitialValue: '',
        orReducer: ({
          accumulator, item, isReduced, index
        }) => {
          const itemString = isReduced ? `(${item})` : item;
          if (index === 0) {
            return itemString;
          }
          return `${accumulator} | ${itemString}`;
        }
      });
      itemLocationsFile[locationName].Need = requirementsString;
    });
    const logicFileOutput = yaml.dump(itemLocationsFile);
    console.log(logicFileOutput);
  }

  static async initialize(settings, callbacks) {
    Settings.initialize(settings);

    this.callbacks = callbacks;

    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    Macros.initialize(macrosFile);

    LogicTweaks.applyTweaks();

    LogicHelper.initialize();

    const trackerState = TrackerState.default();
    this._refreshState(trackerState);
  }

  static initializeFromSaveData(saveData, callbacks) {
    const {
      flags,
      options,
      version,

      itemLocations,
      macros,

      entrances,
      items,
      locationsChecked
    } = saveData;

    Settings.initialize({
      flags,
      options,
      version
    });

    this.callbacks = callbacks;

    Locations.initialize(itemLocations);
    Macros.initialize(macros);

    LogicHelper.initialize();

    const trackerState = TrackerState.createStateManually({
      entrances,
      items,
      locationsChecked
    });
    this._refreshState(trackerState);
  }

  static _refreshState(newState) {
    const newLogic = new LogicCalculation(newState);

    this.callbacks.stateUpdated({ newLogic, newState });
  }
}
