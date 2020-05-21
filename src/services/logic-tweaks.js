import _ from 'lodash';

import CAVES from '../data/caves';
import CHARTS from '../data/charts';
import DUNGEONS from '../data/dungeons';
import HAS_ACCESSED_LOCATION_TWEAKS from '../data/has-accessed-location-tweaks';
import ISLANDS from '../data/islands';

import Locations from './locations';
import LogicHelper from './logic-helper';
import Macros from './macros';
import Settings from './settings';

export default class LogicTweaks {
  static applyTweaks() {
    this._updateMacros();
  }

  static _updateMacros() {
    this._updateDungeonEntranceMacros();
    this._updateCaveEntranceMacros();
    this._updateChartMacros();
  }

  static _addDefeatGanondorf() {
    Locations.setLocation(
      "Ganon's Tower",
      'Defeat Ganondorf',
      Locations.KEYS.NEED,
      'Can Reach and Defeat Ganondorf'
    );
  }

  static _updateTingleStatueReward() {
    Locations.setLocation(
      'Tingle Island',
      'Ankle - Reward for All Tingle Statues',
      Locations.KEYS.NEED,
      'Tingle Statue x5'
    );
  }

  static _updateSunkenTriforceTypes() {
    _.forEach(ISLANDS, (islandName) => {
      const originalItem = Locations.getLocation(
        islandName,
        'Sunken Treasure',
        Locations.KEYS.ORIGINAL_ITEM
      );

      if (_.startsWith(originalItem, 'Triforce Shard')) {
        Locations.setLocation(
          islandName,
          'Sunken Treasure',
          Locations.KEYS.TYPES,
          'Sunken Triforce'
        );
      }
    });
  }

  static _replaceCanAccessOtherLocation(requirements) {
    return requirements.replace(/Can Access Other Location/g, 'Has Accessed Other Location');
  }

  static _applyHasAccessedLocationTweaksForLocations() {
    const itemLocationTweaks = HAS_ACCESSED_LOCATION_TWEAKS.itemLocations;
    _.forEach(itemLocationTweaks, (generalLocationInfo, generalLocation) => {
      _.forEach(generalLocationInfo, (detailedLocation) => {
        const requirements = Locations.getLocation(
          generalLocation,
          detailedLocation,
          Locations.KEYS.NEED
        );
        const newNeeds = this._replaceCanAccessOtherLocation(requirements);

        Locations.setLocation(
          generalLocation,
          detailedLocation,
          Locations.KEYS.NEED,
          newNeeds
        );
      });
    });
  }

  static _applyHasAccessedLocationTweaksForMacros() {
    const macrosTweaks = HAS_ACCESSED_LOCATION_TWEAKS.macros;
    _.forEach(macrosTweaks, (macroName) => {
      const macroValue = Macros.getMacro(macroName);
      const newMacro = this._replaceCanAccessOtherLocation(macroValue);
      Macros.setMacro(macroName, newMacro);
    });
  }

  static _canAccessMacroName(locationName) {
    return `Can Access ${locationName}`;
  }

  static _updateDungeonEntranceMacros() {
    _.forEach(DUNGEONS, (dungeon) => {
      if (LogicHelper.isMainDungeon(dungeon)) {
        const macroName = this._canAccessMacroName(dungeon);
        delete Macros.macros[macroName]
      }
    });
  }

  static _updateCaveEntranceMacros() {
    _.forEach(CAVES, (cave) => {
      const macroName = this._canAccessMacroName(cave);
      delete Macros.macros[macroName];
    });

  }

  static _updateChartMacros() {
    _.forEach(CHARTS, (chart, index) => {
      // Assume everything is a Treasure Chart and clear any additional requirements like
      // wallet upgrades
      const macroName = `Chart for Island ${index + 1}`;
      delete Macros.macros[macroName];
    });
  }
}
