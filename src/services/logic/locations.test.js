import _ from 'lodash';

import Locations from './locations';

describe('Locations', () => {
  describe('initialize', () => {
    let itemLocationsFile;

    beforeEach(() => {
      itemLocationsFile = {
        'Outset Island - Savage Labyrinth - Floor 30': {
          Need: 'Can Access Savage Labyrinth & Can Defeat Keese & Can Defeat Miniblins',
          'Original item': 'Triforce Chart 6',
          Types: 'Savage Labyrinth',
          Paths: ['Cave09/Room20.arc/Chest000']
        },
        "Dragon Roost Cavern - Bird's Nest": {
          Need: 'Can Access Dragon Roost Cavern & DRC Small Key x3',
          'Original item': 'Small Key',
          Types: 'Dungeon',
          Paths: ['M_NewD2/Room3.arc/Actor016']
        }
      };
    });

    test('initializes the locations', () => {
      Locations.initialize(itemLocationsFile);

      expect(Locations.locations).toMatchSnapshot();
    });
  });

  describe('mapLocations', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data'
          }
        },
        'Dragon Roost Cavern': {
          "Bird's Nest": {
            test: 'data'
          }
        }
      };
    });

    test('creates an object by calling the iteratee on each location', () => {
      const mappedLocations = Locations.mapLocations(
        (generalLocation, detailedLocation) => `${detailedLocation} $$$ ${generalLocation}`
      );

      expect(mappedLocations).toMatchSnapshot();
    });
  });

  describe('detailedLocationsForGeneralLocation', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data'
          },
          'Savage Labyrinth - Floor 50': {
            test: 'data'
          }
        }
      };
    });

    test('creates an object by calling the iteratee on each location', () => {
      const detailedLocations = Locations.detailedLocationsForGeneralLocation('Outset Island');

      expect(detailedLocations).toEqual([
        'Savage Labyrinth - Floor 30',
        'Savage Labyrinth - Floor 50'
      ]);
    });
  });

  describe('getLocation', () => {
    let expectedLocation;

    beforeEach(() => {
      expectedLocation = {
        test: 'info'
      };

      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': expectedLocation
        }
      };
    });

    test('returns the info for the location', () => {
      const location = Locations.getLocation('Outset Island', 'Savage Labyrinth - Floor 30');

      expect(location).toEqual(expectedLocation);
    });
  });

  describe('setLocation', () => {
    beforeEach(() => {
      Locations.locations = {
        'Outset Island': {
          'Savage Labyrinth - Floor 30': {
            test: 'data'
          }
        }
      };
    });

    test('updates the location with the provided info key and value', () => {
      Locations.setLocation('Outset Island', 'Savage Labyrinth - Floor 30', 'need', 'expected value');

      const newValue = _.get(Locations.locations, ['Outset Island', 'Savage Labyrinth - Floor 30', 'need']);

      expect(newValue).toEqual('expected value');
    });
  });

  describe('_splitLocationName', () => {
    test('returns the general location and detailed location', () => {
      const input = 'Outset Island - Savage Labyrinth - Floor 30';

      const {
        generalLocation,
        detailedLocation
      } = Locations._splitLocationName(input);

      expect(generalLocation).toEqual('Outset Island');
      expect(detailedLocation).toEqual('Savage Labyrinth - Floor 30');
    });
  });
});
