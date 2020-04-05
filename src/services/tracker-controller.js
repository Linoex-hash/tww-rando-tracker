import Locations from './locations';
import LogicLoader from './logic-loader';
import Macros from './macros';
import TrackerState from './tracker-state';
import Settings from './settings';
import LogicTweaks from './logic-tweaks';
import LogicHelper from './logic-helper';

export default class TrackerController {
  static async initialize() {
    Settings.initialize({ version: '1.7.0' });

    const {
      itemLocationsFile,
      macrosFile
    } = await LogicLoader.loadLogicFiles();

    Locations.initialize(itemLocationsFile);
    LogicTweaks.updateLocations();

    Macros.initialize(macrosFile);
    LogicTweaks.updateMacros();

    LogicHelper.initialize();

    this.state = TrackerState.default();
  }
}